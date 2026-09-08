import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

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

  // Ownership is enforced by RLS. Fetch the source and its stored file
  // (documents cascade-delete with the source).
  const { data: source, error } = await supabase
    .from("sources")
    .select("id, space_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !source) {
    return NextResponse.json({ error: "Source not found." }, { status: 404 });
  }

  const { data: docs } = await supabase
    .from("documents")
    .select("file_path")
    .eq("source_id", id)
    .eq("user_id", user.id)
    .limit(1);

  // Remove stored file if present.
  if (docs?.[0]?.file_path) {
    try {
      const admin = createServiceClient();
      await admin.storage.from("nexus-sources").remove([docs[0].file_path]);
    } catch (e) {
      console.error("storage cleanup", e);
      // Continue even if the file is already gone.
    }
  }

  const { error: delErr } = await supabase
    .from("sources")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (delErr) {
    console.error("source delete", delErr);
    return NextResponse.json({ error: "Could not delete the source." }, { status: 500 });
  }

  revalidatePath(`/space/${source.space_id}`);
  return NextResponse.json({ ok: true });
}