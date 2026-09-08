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
              if (res.error) setError(res.error as string);
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