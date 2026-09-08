import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WorkspaceClient } from "./workspace-client";
import type { Space, SpaceWithStats, Stats } from "@/types";

export default async function WorkspacePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: spaces } = await supabase
    .from("spaces")
    .select("id, user_id, name, type, description, theme, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const [sources, concepts, connections, notes, conversations] =
    await Promise.all([
      supabase
        .from("sources")
        .select("id, space_id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("concepts")
        .select("id, space_id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("connections")
        .select("id, space_id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("notes")
        .select("id, space_id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("conversations")
        .select("id, space_id", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);

  const countsBySpace = new Map<
    string,
    { sources: number; concepts: number; connections: number; notes: number; conversations: number }
  >();
  const add = (
    rows: { space_id: string }[] | null,
    key: "sources" | "concepts" | "connections" | "notes" | "conversations"
  ) => {
    for (const r of rows ?? []) {
      const entry = countsBySpace.get(r.space_id) ?? {
        sources: 0,
        concepts: 0,
        connections: 0,
        notes: 0,
        conversations: 0,
      };
      entry[key] += 1;
      countsBySpace.set(r.space_id, entry);
    }
  };

  add(sources.data, "sources");
  add(concepts.data, "concepts");
  add(connections.data, "connections");
  add(notes.data, "notes");
  add(conversations.data, "conversations");

  const spacesWithStats: SpaceWithStats[] = (spaces ?? []).map((s: Space) => {
    const c = countsBySpace.get(s.id) ?? {
      sources: 0,
      concepts: 0,
      connections: 0,
      notes: 0,
      conversations: 0,
    };
    return {
      ...s,
      source_count: c.sources,
      concept_count: c.concepts,
      connection_count: c.connections,
      note_count: c.notes,
      conversation_count: c.conversations,
      recent_activity: s.created_at,
    };
  });

  const stats: Stats = {
    spaces: spaces?.length ?? 0,
    sources: sources.count ?? 0,
    concepts: concepts.count ?? 0,
    connections: connections.count ?? 0,
  };

  return (
    <WorkspaceClient
      spaces={spacesWithStats}
      stats={stats}
      userName={user.user_metadata?.full_name ?? user.email ?? "there"}
    />
  );
}