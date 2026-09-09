"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { loginAction } from "@/app/auth/actions";
import { GlowInput, NexusButton } from "@/components/nexus/ui";
import { Y2KBackground } from "@/components/nexus/y2k-background";
import { useState } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginInner />
    </Suspense>
  );
}

function LoginFallback() {
  return <div className="min-h-screen" />;
}

function LoginInner() {
  const searchParams = useSearchParams();
  const serverError = searchParams.get("error");
  const [error, setError] = useState<string | null>(serverError);
  const [email, setEmail] = useState("");
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const needsConfirm = (error ?? "").toLowerCase().includes("verify your email");

  async function handleResend() {
    if (!email) return;
    setResending(true);
    setResendMsg(null);
    try {
      const res = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      setResendMsg(
        res.ok
          ? "Re-sent! Check your inbox (and spam)."
          : data.error ?? "Could not resend right now — try again soon."
      );
    } catch {
      setResendMsg("Network error — try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      <Y2KBackground density="minimal" />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <span className="font-display text-3xl font-bold tracking-[0.25em] chrome-text">
              NEXUS
            </span>
            <p className="mt-2 text-sm text-(--muted-foreground)">
              Welcome back to your connected brain.
            </p>
          </div>

          <form
            action={async (fd) => {
              const res = await loginAction(fd);
              if (res.error) {
                setError(res.error as string);
                setEmail((fd.get("email")?.toString() ?? "").trim());
              }
            }}
            className="space-y-4 rounded-2xl glass-strong p-6 shadow-[0_0_60px_hsl(var(--glow-violet)/0.15)]"
          >
            <GlowInput
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <GlowInput
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            {needsConfirm && (
              <div className="rounded-xl border border-(--primary)/25 bg-(--primary)/8 p-3">
                <p className="text-xs text-(--muted-foreground)">
                  Didn't get the link? We can email it again.
                </p>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="mt-2 w-full rounded-lg border border-(--primary)/30 bg-(--primary)/10 px-3 py-1.5 text-xs font-medium text-(--primary) transition-all hover:bg-(--primary)/20 disabled:opacity-40 cursor-pointer"
                >
                  {resending ? "Sending…" : "Resend verification email"}
                </button>
                {resendMsg && (
                  <p className="mt-2 text-[11px] text-(--muted-foreground)">{resendMsg}</p>
                )}
              </div>
            )}

            <NexusButton type="submit" className="w-full" size="lg">
              Enter NEXUS
            </NexusButton>

            <p className="pb-1 text-center text-sm text-(--muted-foreground)">
              New to NEXUS?{" "}
              <Link
                href="/signup"
                className="font-medium text-(--primary) hover:underline"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}