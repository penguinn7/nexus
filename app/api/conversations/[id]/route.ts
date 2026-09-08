import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { RetrievalContext } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  // RLS constrains to owned conversations.
  const { data: messages } = await supabase
    .from("messages")
    .select("id, conversation_id, role, content, metadata, created_at")
    .eq("conversation_id", id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const rows = (messages ?? []).map((m) => {
    let context: RetrievalContext | undefined;
    if (m.metadata && typeof m.metadata === "object" && Object.keys(m.metadata as object).length > 0) {
      try {
        context = m.metadata as unknown as RetrievalContext;
      } catch {
        context = undefined;
      }
    }
    return {
      id: m.id,
      conversationId: m.conversation_id,
      role: m.role as "user" | "assistant",
      content: m.content,
      createdAt: m.created_at,
      context,
    };
  });

  return NextResponse.json({ messages: rows });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("delete conversation", error);
    return NextResponse.json({ error: "Could not delete conversation." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}