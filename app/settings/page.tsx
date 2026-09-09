import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
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

  // Reading feedback is a builder-only operation (service-role, bypasses RLS).
  const admin = createServiceClient();
  const { data: feedback } = await admin
    .from("feedback")
    .select("id, user_email, content, page, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <SettingsClient
      userEmail={user.email ?? ""}
      username={user.user_metadata?.full_name ?? user.email ?? ""}
      spaces={spaces ?? []}
      feedback={feedback ?? []}
    />
  );
}