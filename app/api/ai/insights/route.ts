import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resolveAIProvider } from "@/lib/ai/provider";
import { extractConcepts } from "@/lib/ai/pipeline";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: { spaceId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { spaceId } = body;
  if (!spaceId) {
    return NextResponse.json({ error: "Missing space." }, { status: 400 });
  }

  // Ownership via RLS
  const { data: space } = await supabase
    .from("spaces")
    .select("id, name")
    .eq("id", spaceId)
    .eq("user_id", user.id)
    .single();
  if (!space) {
    return NextResponse.json({ error: "Space not found." }, { status: 404 });
  }

  const [concepts, connections, sources] = await Promise.all([
    supabase
      .from("concepts")
      .select("id, name, description")
      .eq("space_id", spaceId)
      .eq("user_id", user.id)
      .limit(300),
    supabase
      .from("connections")
      .select("id, concept_a, concept_b, relationship")
      .eq("space_id", spaceId)
      .eq("user_id", user.id)
      .limit(800),
    supabase
      .from("sources")
      .select("id, title, source_type")
      .eq("space_id", spaceId)
      .eq("user_id", user.id)
      .eq("status", "ready")
      .limit(100),
  ]);

  const provider = resolveAIProvider();

  // Build a compact graph snapshot as grounding
  const conceptNames = (concepts.data ?? []).map((c) => c.name).join("; ") || "none yet";
  const relLines = (connections.data ?? [])
    .slice(0, 80)
    .map((r) => `${r.relationship}`)
    .join(", ") || "none yet";
  const sourceTitles = (sources.data ?? []).map((s) => s.title).join(" | ") || "none yet";

  let insights: string[];
  if (provider) {
    try {
      const raw = await provider.stream({
        mode: "research",
        messages: [
          {
            role: "user",
            content:
              `You are analyzing the knowledge graph of a NEXUS Space named "${space.name}".\n` +
              `Concepts: ${conceptNames}\n` +
              `Relationship types: ${relLines}\n` +
              `Sources: ${sourceTitles}\n\n` +
              `Produce exactly 5 insights for the user, each 1-2 sentences, as a JSON array of strings. ` +
              `Cover: (1) the single most important concept or idea, (2) a surprising or underappreciated connection between concepts ` +
              `(3) a contradiction, tension or gap in the knowledge, (4) a question worth exploring next, (5) the most valuable next action ` +
              `in this Space. Ground everything strictly in the provided concepts, relationships and sources. Return only the JSON array.`,
          },
        ],
      });
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        insights = parsed.map(String).slice(0, 5);
      } else {
        insights = [sanitize(raw)];
      }
    } catch (e) {
      console.error("insights failed", e);
      insights = fallbackInsights(concepts.data ?? [], connections.data ?? [], sources.data ?? []);
    }
  } else {
    insights = fallbackInsights(concepts.data ?? [], connections.data ?? [], sources.data ?? []);
  }

  // Extract hypotheses into the graph
  void extractConcepts({
    text: `${space.name}: ${conceptNames}`,
    spaceId,
    userId: user.id,
  }).catch(() => {});

  return NextResponse.json({ insights });
}

/** Deterministic, honest insights from the actual graph when no AI is connected */
function fallbackInsights(
  concepts: { name: string }[],
  connections: { relationship: string }[],
  sources: { title: string }[]
): string[] {
  const out: string[] = [];
  if (concepts.length === 0) {
    out.push(
      "Your graph is empty. Add sources — NEXUS will start mapping concepts automatically."
    );
    return [...out, "Try adding a PDF (lecture notes work great), a URL, or pasted text."];
  }

  // find the concept with the most edges is not available here; give structural insights
  const names = concepts.slice(0, 12).map((c) => c.name);
  out.push(
    `The most prominent conceptual cluster in this Space revolves around: ${names.slice(0, 5).join(", ")}.`
  );
  if (connections.length > 10) {
    out.push(
      `${connections.length} relationships are recorded. Look for concepts that touch the most others — they usually represent the core of the Space.`
    );
  } else {
    out.push(
      `Only ${connections.length} relationships so far. Ask NEXUS to " connect these concepts" to grow your map.`
    );
  }
  out.push(
    `Sources available: ${sources.length}. For deeper insight, set an AI provider (AI_API_KEY) so NEXUS can synthesize patterns, contradictions and next steps.`
  );
  out.push(`A good next question: "Explain the most important idea here and connect it to the others."`);
  return out;
}

function sanitize(s: string): string {
  return s.replace(/```json|```/g, "").trim().slice(0, 500);
}