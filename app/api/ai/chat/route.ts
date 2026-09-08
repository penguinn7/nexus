import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { retrieveForQuestion, buildContext } from "@/lib/ai/retrieval";
import { resolveAIProvider } from "@/lib/ai/provider";
import { extractConcepts } from "@/lib/ai/pipeline";
import { webSearch, buildWebContext, webResearchEnabled } from "@/lib/ai/search";
import type { AiMode, RetrievalContext, ChunkRef, SourceRef, ConceptRef } from "@/types";
import type { WebResult } from "@/lib/ai/search";

const VALID_MODES: AiMode[] = [
  "quick",
  "deep",
  "research",
  "teach",
  "executive",
  "creative",
];

function modeParse(raw: string | null | undefined): AiMode {
  return raw && (VALID_MODES as string[]).includes(raw) ? (raw as AiMode) : "quick";
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: { spaceId?: string; question?: string; mode?: string; conversationId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { spaceId, question, conversationId } = body;
  const mode = modeParse(body.mode);

  if (!spaceId || typeof spaceId !== "string") {
    return NextResponse.json({ error: "Missing space_id." }, { status: 400 });
  }
  if (!question || typeof question !== "string" || question.trim().length === 0) {
    return NextResponse.json({ error: "Missing question." }, { status: 400 });
  }
  if (question.length > 4000) {
    return NextResponse.json({ error: "Question too long (max 4000 characters)." }, { status: 400 });
  }

  // ── Server-side ownership check (defense in depth; RLS also applied) ──
  const { data: space, error: spaceErr } = await supabase
    .from("spaces")
    .select("id")
    .eq("id", spaceId)
    .eq("user_id", user.id)
    .single();

  if (spaceErr || !space) {
    return NextResponse.json({ error: "Space not found." }, { status: 404 });
  }

  // ── Resolve conversation (create or continue) ──
  let convId = conversationId;
  if (convId) {
    const { data: conv } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", convId)
      .eq("space_id", spaceId)
      .eq("user_id", user.id)
      .single();
    if (!conv) convId = undefined;
  }
  if (!convId) {
    const { data: conv, error: convErr } = await supabase
      .from("conversations")
      .insert({
        space_id: spaceId,
        user_id: user.id,
        title: question.slice(0, 60),
      })
      .select("id")
      .single();
    if (convErr || !conv) {
      console.error("conversation create failed", convErr);
      return NextResponse.json({ error: "Could not start a conversation." }, { status: 500 });
    }
    convId = conv.id;
  }

  // ── Persist user message ──
  const { error: msgErr } = await supabase.from("messages").insert({
    conversation_id: convId,
    space_id: spaceId,
    user_id: user.id,
    role: "user",
    content: question.trim(),
  });
  if (msgErr) {
    console.error("user message insert failed", msgErr);
    return NextResponse.json({ error: "Could not save message." }, { status: 500 });
  }

  // ── Retrieve context ──
  const [retrieval, webResults] = await Promise.all([
    retrieveForQuestion({
      spaceId,
      userId: user.id,
      question,
      limit: 8,
    }),
    // NEXUS "does its own research": supplement with live web when enabled
    webResearchEnabled()
      ? webSearch(question, { maxResults: 4 }).catch(() => [])
      : Promise.resolve([]),
  ]);

  const webBlock = buildWebContext(webResults);
  const encodedContext = JSON.stringify(toContext(retrieval));
  const contextBlock = [buildContext(retrieval), webBlock].filter(Boolean).join("\n\n");

  // ── Generate (streamed if a provider exists; otherwise retrieval-only) ──
  const provider = resolveAIProvider();

  const headers: Record<string, string> = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  };

  const encoder = new TextEncoder();
  let finished = false;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let full = "";
      const push = (data: unknown) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          /* client gone */
        }
      };

      try {
        push({
          type: "meta",
          conversationId: convId,
          mode,
          provider: provider?.name ?? null,
          web: webResearchEnabled(),
        });

        if (!provider) {
          const answer = buildRetrievalOnlyAnswer(question, retrieval.chunks, webResults);
          full = answer;
          push({ type: "delta", content: answer });
          push({ type: "done" });
        } else {
          await provider.stream({
            mode,
            messages: [
              { role: "user", content: `${contextBlock}\n\nQuestion: ${question}` },
            ],
            onToken: (tok) => {
              full += tok;
              push({ type: "delta", content: tok });
            },
          });
          push({ type: "done" });
        }

        // ── Persist assistant message with grounding ──
        await supabase.from("messages").insert({
          conversation_id: convId!,
          space_id: spaceId,
          user_id: user.id,
          role: "assistant",
          content: full,
          metadata: encodedContext,
        });

        // ── Fire-and-forget concept extraction ──
        if (full.length > 0) {
          void extractConcepts({
            text: `${question}\n\n${full}`,
            spaceId,
            userId: user.id,
          }).catch((e) => console.error("concept extraction failed", e));
        }

        push({ type: "complete" });
        finished = true;
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "AI generation failed";
        console.error("chat error", message);
        push({
          type: "error",
          error: cleanError(message),
        });
      } finally {
        try {
          controller.close();
        } catch {
          /* ignore */
        }
      }
    },
    cancel() {
      // client aborted
    },
  });

  void finished;
  return new Response(stream, { headers });
}

function toContext(r: Awaited<ReturnType<typeof retrieveForQuestion>>): RetrievalContext {
  return {
    chunks: r.chunks.map<ChunkRef>((c) => ({
      chunkId: c.chunkId,
      sourceId: c.sourceId,
      sourceTitle: c.sourceTitle,
      content: c.content,
    })),
    sources: r.sources.map<SourceRef>((s) => ({
      id: s.id,
      title: s.title,
      sourceType: s.source_type,
      url: s.url,
    })),
    concepts: r.concepts.map<ConceptRef>((c) => ({
      id: c.id,
      name: c.name,
    })),
  };
}

function buildRetrievalOnlyAnswer(
  question: string,
  chunks: ChunkRef[],
  webResults: WebResult[] = []
): string {
  if (chunks.length === 0 && webResults.length === 0) {
    return (
      "I couldn't find relevant passages in this Space to ground an answer. " +
      "Add sources with the content you want me to reason over, or set an AI provider (GEMINI_API_KEY) in your environment for full reasoning."
    );
  }

  const parts: string[] = [];
  if (chunks.length > 0) {
    const top = chunks.slice(0, 3);
    const lines = top.map((c, i) => `${i + 1}. ${c.content.trim().slice(0, 420)}`);
    const cites = Array.from(new Set(top.map((c) => c.sourceTitle)))
      .map((t) => `[Source: ${t}]`)
      .join(" ");
    parts.push(
      `Based on your sources, here are the passages most relevant to "${question}":\n\n${lines.join("\n\n")}\n\n${cites}`
    );
  }

  if (webResults.length > 0) {
    const lines = webResults.map(
      (w, i) => `${i + 1}. [${w.title}](${w.url})\n   ${w.content.replace(/\s+/g, " ")}`
    );
    parts.push(`Live web research on "${question}":\n\n${lines.join("\n\n")}`);
  }

  return (
    parts.join("\n\n") +
    "\n\nAdd an AI provider (GEMINI_API_KEY) to enable full reasoning and synthesis across these passages."
  );
}

/** Prevent leaking raw provider errors/secrets to the client */
function cleanError(msg: string): string {
  const low = msg.toLowerCase();
  if (low.includes("authentication") || low.includes("401") || low.includes("api key")) {
    return "The AI provider rejected the request — check your AI_API_KEY configuration.";
  }
  if (low.includes("429") || low.includes("rate")) {
    return "The AI provider is rate-limiting requests. Try again in a moment.";
  }
  if (low.includes("fetch failed") || low.includes("network") || low.includes("econn")) {
    return "Could not reach the AI provider. Check your network connection.";
  }
  return "NEXUS hit an error while answering. Please try again.";
}