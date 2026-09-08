import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GraphPageClient } from "./graph-client";

export default async function GraphPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [conceptsRes, connectionsRes] = await Promise.all([
    supabase
      .from("concepts")
      .select("id, space_id, user_id, name, description, created_at")
      .eq("user_id", user.id)
      .limit(1500),
    supabase
      .from("connections")
      .select("id, space_id, user_id, concept_a, concept_b, relationship, created_at")
      .eq("user_id", user.id)
      .limit(4000),
  ]);

  return (
    <GraphPageClient
      concepts={conceptsRes.data ?? []}
      connections={connectionsRes.data ?? []}
    />
  );
}