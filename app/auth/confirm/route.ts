import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/workspace";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      const base = isLocalEnv
        ? origin
        : forwardedHost
          ? `https://${forwardedHost}`
          : origin;
      return NextResponse.redirect(`${base}${next}`);
    }
    console.error("confirm error", error?.message);
  }

  // Redirect to an error page with a clear message
  const redirectUrl = new URL(`${origin}/login`);
  redirectUrl.searchParams.set("error", "We could not verify your email link. Please try again.");
  return NextResponse.redirect(redirectUrl);
}