import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Saves user feedback to the `feedback` table so the builder can read
 * it in Settings. Service-role insert (bypasses RLS, which is fine on
 * the server after the user is authenticated).
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in to send feedback." }, { status: 401 });
    }

    let body: { content?: unknown; page?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const content = typeof body.content === "string" ? body.content.trim() : "";
    if (content.length < 3 || content.length > 2000) {
      return NextResponse.json(
        { error: "Feedback must be between 3 and 2000 characters." },
        { status: 400 }
      );
    }
    const page = typeof body.page === "string" ? body.page.slice(0, 300) : null;

    const admin = createServiceClient();
    const { error } = await admin.from("feedback").insert({
      user_id: user.id,
      user_email: user.email ?? null,
      content,
      page,
    });
    if (error) {
      console.error("feedback insert error:", error.message);
      return NextResponse.json(
        { error: `Feedback failed: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("feedback route error:", err);
    const message =
      err instanceof Error && err.message
        ? `Feedback failed: ${err.message}`
        : "Could not save feedback.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}