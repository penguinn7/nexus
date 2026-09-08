"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createNote(input: { spaceId: string; title: string; content: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const title = (input.title ?? "").trim() || "Untitled note";
  const content = (input.content ?? "").trim().slice(0, 100_000);

  const { data: space } = await supabase
    .from("spaces")
    .select("id")
    .eq("id", input.spaceId)
    .eq("user_id", user.id)
    .single();
  if (!space) return { error: "Space not found." };

  const { data, error } = await supabase
    .from("notes")
    .insert({ space_id: input.spaceId, user_id: user.id, title, content })
    .select("id")
    .single();

  if (error) {
    console.error("createNote", error);
    return { error: "Could not create the note." };
  }

  revalidatePath(`/space/${input.spaceId}`);
  return { noteId: data.id };
}

export async function updateNote(input: {
  spaceId: string;
  noteId: string;
  title: string;
  content: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("notes")
    .update({
      title: (input.title ?? "").trim() || "Untitled note",
      content: (input.content ?? "").slice(0, 100_000),
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.noteId)
    .eq("space_id", input.spaceId)
    .eq("user_id", user.id);

  if (error) {
    console.error("updateNote", error);
    return { error: "Could not save the note." };
  }

  revalidatePath(`/space/${input.spaceId}`);
  return { ok: true };
}

export async function deleteNote(input: { spaceId: string; noteId: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", input.noteId)
    .eq("space_id", input.spaceId)
    .eq("user_id", user.id);

  if (error) {
    console.error("deleteNote", error);
    return { error: "Could not delete the note." };
  }

  revalidatePath(`/space/${input.spaceId}`);
  return { ok: true };
}