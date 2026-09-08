import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { retrieveForQuestion, buildContext } from "@/lib/ai/retrieval";
import { resolveAIProvider } from "@/lib/ai/provider";

type NoteAction =
  | "summarize"
  | "improve"
  | "explain"
  | "extract_concepts"
  | "connect"
  | "generate_questions"
  | "study_notes";

const ACTIONS: Record<NoteAction, string> = {
  summarize:
    "Write a concise summary of the note. Lead with the core idea. Use a few bullets for key points.",
  improve:
    "Rewrite the note to be clearer and more structured, preserving all facts and the author's voice. Fix grammar. Tighten wording.",
  explain:
    "Explain the note's main ideas in simpler terms, step by step, using an analogy where helpful. Assume the reader is new to the topic.",
  extract_concepts:
    "Identify the 3-8 key concepts in the note. Give each concept a one-line plain definition. Use a bullet list: **Name** — definition.",
  connect:
    "Connect this note to the 'Concepts in this Space' and 'Relevant content' listed in context. State explicit links between the note's ideas and existing knowledge. Suggest 1-2 new relationships worth adding to the graph.",
  generate_questions:
    "Generate 5 insightful questions someone could answer from this note — from basic recall to synthesis.",
  study_notes:
    "Convert this note into study/revision notes: key terms with definitions, the 3 most important facts, a mini mind-map list, and 2 quick self-test questions with answers.",
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: { spaceId?: string; noteId?: string; action?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { spaceId, noteId, action: actionRaw } = body;
  const action = (actionRaw ?? "") as NoteAction;

  if (!spaceId || !noteId || !ACTIONS[action]) {
    return NextResponse.json({ error: "Missing parameters." }, { status: 400 });
  }

  // Ownership via RLS
  const { data: note } = await supabase
    .from("notes")
    .select("id, title, content")
    .eq("id", noteId)
    .eq("space_id", spaceId)
    .eq("user_id", user.id)
    .single();
  if (!note) {
    return NextResponse.json({ error: "Note not found." }, { status: 404 });
  }

  const content = note.content ?? "";

  // Retrieve relevant Space context to ground connection/explanation.
  const retrieval = await retrieveForQuestion({
    spaceId,
    userId: user.id,
    question: content.slice(0, 500),
    limit: 5,
  });
  const contextBlock = buildContext(retrieval);

  const provider = resolveAIProvider();
  if (!provider) {
    return NextResponse.json({
      error: "No AI provider configured. Set AI_API_KEY to enable AI note actions.",
    }, { status: 503 });
  }

  const result = await provider.stream({
    mode: "deep",
    messages: [
      {
        role: "user",
        content: `${contextBlock}\n\n## The note\nTitle: ${note.title}\n\n${content.slice(0, 8000)}\n\nAction:\n${ACTIONS[action]}`,
      },
    ],
  });

  return NextResponse.json({ result: result.trim() });
}