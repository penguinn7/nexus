import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: spaces } = await supabase
    .from("spaces")
    .select("id, user_id, name, type, description, theme, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return <SettingsClient userEmail={user.email ?? ""} username={user.user_metadata?.full_name ?? user.email ?? ""} spaces={spaces ?? []} />;
}