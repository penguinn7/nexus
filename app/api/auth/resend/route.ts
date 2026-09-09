import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const supabase = await createClient();

  const isLocal = process.env.NODE_ENV === "development";
  const requestedHost =
    (await headers()).get("x-forwarded-host") ?? (await headers()).get("host");
  const origin = isLocal
    ? "http://localhost:3000"
    : requestedHost
      ? `https://${requestedHost}`
      : "";

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    const low = error.message.toLowerCase();
    if (low.includes("rate") || low.includes("too many")) {
      return NextResponse.json(
        { error: "You asked for too many emails — wait a few minutes and try again." },
        { status: 429 }
      );
    }
    if (low.includes("confirmed") || low.includes("already")) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}