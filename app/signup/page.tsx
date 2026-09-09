"use client";

import Link from "next/link";
import { useState } from "react";
import { signupAction } from "@/app/auth/actions";
import { GlowInput, NexusButton } from "@/components/nexus/ui";
import { Y2KBackground } from "@/components/nexus/y2k-background";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [lastEmail, setLastEmail] = useState<string>("");

  async function handleSubmit(fd: FormData) {
    const res = await signupAction(fd);
    if (res.error) {
      setError(res.error);
      return;
    }
    if (res.needsVerification) {
      setLastEmail((fd.get("email") as string) ?? "");
      setSent(true);
    }
  }

  async function handleResend() {
    if (!lastEmail) return;
    setResending(true);
    setResendMsg(null);
    try {
      const res = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: lastEmail }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setResendMsg("Re-sent! Check your inbox (and spam folder).");
      } else {
        setResendMsg(data.error ?? "Could not resend right now — try again soon.");
      }
    } catch {
      setResendMsg("Network error — try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      <Y2KBackground density="dense" />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <span className="font-display text-3xl font-bold tracking-[0.25em] chrome-text">
              NEXUS
            </span>
            <p className="mt-2 text-sm text-(--muted-foreground)">
              Your brain, but connected.
            </p>
          </div>

          {sent ? (
            <div className="rounded-2xl glass-strong p-8 text-center shadow-[0_0_60px_hsl(var(--glow-violet)/0.15)]">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-(--glow-violet)/30 to-(--glow-blue)/30">
                <span className="text-2xl">✉️</span>
              </div>
              <h1 className="font-display text-lg font-semibold text-(--foreground)">
                Check your inbox
              </h1>
              <p className="mt-2 text-sm text-(--muted-foreground)">
                We sent a verification link to <span className="text-(--foreground)">{lastEmail}</span>.
                Click it to activate your account, then sign in. If you don't see it, check your spam folder.
              </p>

              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="mt-4 w-full rounded-xl border border-(--primary)/30 bg-(--primary)/10 px-4 py-2.5 text-sm font-medium text-(--primary) transition-all hover:bg-(--primary)/20 disabled:opacity-40 cursor-pointer"
              >
                {resending ? "Sending…" : "Resend verification email"}
              </button>
              {resendMsg && (
                <p className="mt-3 text-xs text-(--muted-foreground)">{resendMsg}</p>
              )}

              <Link href="/login" className="mt-4 inline-block">
                <NexusButton variant="outline">Go to sign in</NexusButton>
              </Link>
            </div>
          ) : (
            <form
              action={handleSubmit}
              className="space-y-4 rounded-2xl glass-strong p-6 shadow-[0_0_60px_hsl(var(--glow-violet)/0.15)]"
            >
              <GlowInput
                label="Full name"
                name="full_name"
                placeholder="Ada Lovelace"
                autoComplete="name"
              />
              <GlowInput
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
              <GlowInput
                label="Password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
              />

              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                >
                  {error}
                </p>
              )}

              <NexusButton type="submit" className="w-full" size="lg">
                Create account
              </NexusButton>

              <p className="pb-1 text-center text-sm text-(--muted-foreground)">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-(--primary) hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}