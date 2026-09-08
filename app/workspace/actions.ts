"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SpaceType } from "@/types";
import { THEMES, type NexusThemeKey } from "@/lib/themes";

const VALID_TYPES: SpaceType[] = [
  "student",
  "research",
  "business",
  "office",
  "personal",
  "creative",
  "custom",
];

function isThemeKey(s: string): s is NexusThemeKey {
  return s in THEMES;
}

export async function createSpace(input: {
  name: string;
  type: SpaceType;
  description: string;
  theme: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const name = input.name.trim();
  if (!name) return { error: "Give your Space a name." };
  if (name.length > 100) return { error: "Name too long (max 100 characters)." };

  const type = VALID_TYPES.includes(input.type) ? input.type : "custom";
  const theme = isThemeKey(input.theme) ? input.theme : "y2k";
  const description = (input.description ?? "").trim().slice(0, 500);

  const { data, error } = await supabase
    .from("spaces")
    .insert({ name, type, description, theme, user_id: user.id })
    .select("*")
    .single();

  if (error) {
    console.error("createSpace", error);
    return { error: "Could not create the Space. Please try again." };
  }

  revalidatePath("/workspace");
  return { space: data };
}

export async function updateSpace(
  spaceId: string,
  input: { name: string; type: SpaceType; description: string; theme: string }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const name = input.name.trim();
  if (!name) return { error: "Give your Space a name." };
  if (name.length > 100) return { error: "Name too long (max 100 characters)." };

  const type = VALID_TYPES.includes(input.type) ? input.type : "custom";
  const theme = isThemeKey(input.theme) ? input.theme : "y2k";
  const description = (input.description ?? "").trim().slice(0, 500);

  const { error } = await supabase
    .from("spaces")
    .update({ name, type, description, theme })
    .eq("id", spaceId)
    .eq("user_id", user.id);

  if (error) {
    console.error("updateSpace", error);
    return { error: "Could not update the Space." };
  }

  revalidatePath(`/space/${spaceId}`);
  revalidatePath("/workspace");
  return { ok: true };
}

export async function updateSpaceTheme(spaceId: string, theme: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  if (!isThemeKey(theme)) return { error: "Invalid theme." };

  const { error } = await supabase
    .from("spaces")
    .update({ theme })
    .eq("id", spaceId)
    .eq("user_id", user.id);

  if (error) {
    console.error("updateSpaceTheme", error);
    return { error: "Could not update theme." };
  }

  revalidatePath(`/space/${spaceId}`);
  return { ok: true };
}

export async function deleteSpace(spaceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  // Ownership enforced by RLS; also guard the id is the current user's UUID format
  const { error } = await supabase
    .from("spaces")
    .delete()
    .eq("id", spaceId)
    .eq("user_id", user.id);

  if (error) {
    console.error("deleteSpace", error);
    return { error: "Could not delete the Space." };
  }

  revalidatePath("/workspace");
  return { ok: true };
}