import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SpaceClient } from "./space-client";
import type { Space, Source, Note, Conversation, Concept, Connection } from "@/types";

export default async function SpacePage({
  params,
  searchParams,
}: {
  params: Promise<{ spaceId: string }>;
  searchParams: Promise<{ tab?: string; q?: string; add?: string; mode?: string }>;
}) {
  const { spaceId } = await params;
  const sp = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: space, error } = await supabase
    .from("spaces")
    .select("id, user_id, name, type, description, theme, created_at")
    .eq("id", spaceId)
    .eq("user_id", user.id)
    .single();

  if (error || !space) notFound();
  if (space.user_id !== user.id) notFound();

  const [sourcesRes, notesRes, conversationsRes, conceptsRes, connectionsRes] =
    await Promise.all([
      supabase
        .from("sources")
        .select("id, space_id, user_id, title, source_type, url, status, created_at, error")
        .eq("space_id", spaceId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("notes")
        .select("id, space_id, user_id, title, content, created_at, updated_at")
        .eq("space_id", spaceId)
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(200),
      supabase
        .from("conversations")
        .select(
          "id, space_id, user_id, title, created_at"
        )
        .eq("space_id", spaceId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("concepts")
        .select("id, space_id, user_id, name, description, created_at")
        .eq("space_id", spaceId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1000),
      supabase
        .from("connections")
        .select("id, space_id, user_id, concept_a, concept_b, relationship, created_at")
        .eq("space_id", spaceId)
        .eq("user_id", user.id)
        .limit(2000),
    ]);

  const initialTab =
    sp.tab === "sources" || sp.tab === "notes" || sp.tab === "conversations" ||
    sp.tab === "graph" || sp.tab === "insights" || sp.tab === "overview"
      ? sp.tab
      : "overview";

  const initialMode =
    sp.mode === "quick" || sp.mode === "deep" || sp.mode === "research" ||
    sp.mode === "teach" || sp.mode === "executive" || sp.mode === "creative"
      ? sp.mode
      : "quick";

  return (
    <SpaceClient
      space={space as Space}
      sources={(sourcesRes.data ?? []) as Source[]}
      notes={(notesRes.data ?? []) as Note[]}
      conversations={(conversationsRes.data ?? []) as Conversation[]}
      concepts={(conceptsRes.data ?? []) as Concept[]}
      connections={(connectionsRes.data ?? []) as Connection[]}
      initialTab={initialTab}
      initialQuery={sp.q ?? null}
      initialMode={initialMode}
      initialAdd={sp.add ?? null}
    />
  );
}