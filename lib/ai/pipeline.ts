import { createClient } from "@/lib/supabase/server";
import { retrieveForQuestion, buildContext } from "./retrieval";
import { resolveAIProvider } from "./provider";
import type {
  AiMode,
  RetrievalContext,
  ChunkRef,
  SourceRef,
  ConceptRef,
} from "@/types";

/**
 * Concept extractor: pulls candidate concepts from a document/answer.
 *
 * When a generative model is configured, asks it to extract concepts + a
 * one-line description. Otherwise extracts capitalized noun phrases as a
 * keyword heuristic (still stored as real concepts in the graph).
 */
export async function extractConcepts(input: {
  text: string;
  spaceId: string;
  userId: string;
}): Promise<{ name: string; description: string | null }[]> {
  const { text, spaceId, userId } = input;
  const sample = text.slice(0, 6000);

  const provider = resolveAIProvider();
  let concepts: { name: string; description: string | null }[] = [];

  if (provider) {
    try {
      const raw = await provider.stream({
        mode: "research",
        messages: [
          {
            role: "user",
            content:
              "Extract the 3-8 most important concepts from the text below. " +
              "Return strictly as JSON array: [{\"name\": string, \"description\": string}]. " +
              "Use their title case names. No markdown, no extra text.\n\nTEXT:\n" +
              sample,
          },
        ],
      });
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        concepts = parsed
          .filter((c) => c && typeof c.name === "string")
          .map((c) => ({ name: c.name.trim().slice(0, 120), description: c.description ? String(c.description).slice(0, 400) : null }))
          .slice(0, 8);
      }
    } catch (e) {
      console.error("concept extraction via LLM failed", e);
    }
  }

  if (concepts.length === 0) {
    concepts = extractNounPhrases(sample).map((name) => ({ name, description: null }));
  }

  // Persist into the graph (authorization enforced via the user's JWT)
  if (concepts.length > 0) {
    const supabase = await createClient();
    for (const c of concepts.slice(0, 12)) {
      const { error } = await supabase.rpc("upsert_concept", {
        p_name: c.name,
        p_description: c.description ?? null,
        p_space_id: spaceId,
      });
      if (error) {
        console.error("upsert_concept", error.message);
      }
    }
  }

  return concepts;
}

/** Split camel/snake/normal text into plausible concept noun phrases */
function extractNounPhrases(text: string): string[] {
  const cleaned = text
    .replace(/[^A-Za-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = cleaned.split(" ");
  const stop = new Set([
    "and", "the", "for", "with", "from", "that", "this", "which",
    "when", "where", "into", "your", "you", "are", "was", "were", "will",
    "would", "can", "could", "should", "their", "them", "they", "there",
  ]);

  const phrases: string[] = [];
  const seen = new Set<string>();
  const POI = (w: string) => {
    const first = w[0];
    return first === first?.toUpperCase() && w.length > 2 && !stop.has(w.toLowerCase());
  };

  for (let i = 0; i < words.length; i++) {
    if (POI(words[i])) {
      let phrase = words[i];
      let j = i + 1;
      while (j < words.length && POI(words[j]) && j - i < 3) {
        phrase += " " + words[j];
        j++;
      }
      if (!seen.has(phrase)) {
        seen.add(phrase);
        phrases.push(phrase);
      }
      if (phrases.length >= 14) break;
    }
  }
  return phrases.slice(0, 10);
}

export async function runAIAnswer(input: {
  question: string;
  spaceId: string;
  userId: string;
  mode?: AiMode;
  maxRetrieved?: number;
}): Promise<{
  answer: string;
  context: RetrievalContext;
  providerUsed: string | null;
}> {
  const { question, spaceId, userId, mode = "quick", maxRetrieved = 8 } = input;

  const retrieval = await retrieveForQuestion({
    spaceId,
    userId,
    question,
    limit: maxRetrieved,
  });

  const context = buildContext(retrieval);
  const provider = resolveAIProvider();

  if (!provider) {
    return {
      answer:
        buildRetrievalOnlyAnswer(question, retrieval.chunks),
      context: toContext(retrieval),
      providerUsed: null,
    };
  }

  const answer = await provider.stream({
    mode,
    messages: [
      {
        role: "user",
        content: `${context}\n\nQuestion: ${question}`,
      },
    ],
  });

  return { answer: answer.trim(), context: toContext(retrieval), providerUsed: provider.name };
}

/**
 * Retrieval-only answer: real, citation-grounded, and honest that no
 * generative model is connected. Used when no AI provider is configured.
 */
function buildRetrievalOnlyAnswer(question: string, chunks: ChunkRef[]): string {
  if (chunks.length === 0) {
    return (
      "I couldn't find relevant passages in this Space to ground an answer. " +
      "Add sources with the content you want me to reason over, or set an AI provider in your environment for full reasoning."
    );
  }
  const top = chunks.slice(0, 3);
  const lines = top.map(
    (c, i) => `${i + 1}. ${c.content.trim().slice(0, 420)}`
  );
  const cites = Array.from(new Set(top.map((c) => c.sourceTitle)))
    .map((t) => `[Source: ${t}]`)
    .join(" ");
  return (
    `Based on your sources, here are the passages most relevant to "${question}":\n\n` +
    lines.join("\n\n") +
    `\n\n${cites}\n\n` +
    `Add an AI provider (AI_API_KEY) to enable full reasoning, synthesis across these passages and deeper modes like Deep, Teach and Research.`
  );
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