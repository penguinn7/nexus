"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LayoutGrid, Sparkles, MessageCircle } from "lucide-react";
import { Y2KBackground } from "@/components/nexus/y2k-background";
import { NexusLogo, NexusButton } from "@/components/nexus/ui";
import { useTheme } from "@/components/nexus/theme-provider";
import { THEMES, type NexusThemeKey } from "@/lib/themes";
import { updateSpaceTheme } from "@/app/workspace/actions";
import { timeAgo, cn } from "@/lib/utils";
import type { Space } from "@/types";

type FeedbackItem = {
  id: string;
  user_email: string | null;
  content: string;
  page: string | null;
  created_at: string;
};

export function SettingsClient({
  userEmail,
  username,
  spaces,
  feedback,
}: {
  userEmail: string;
  username: string;
  spaces: Space[];
  feedback: FeedbackItem[];
}) {
  const router = useRouter();
  const { theme: appTheme, setTheme } = useTheme();
  const [isPending, startTransition] = useTransition();
  const [pendingSpace, setPendingSpace] = useState<string | null>(null);

  async function handleSignOut() {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (res.ok) router.push("/login");
  }

  function changeSpaceTheme(spaceId: string, key: NexusThemeKey) {
    setPendingSpace(spaceId);
    startTransition(async () => {
      await updateSpaceTheme(spaceId, key);
      setPendingSpace(null);
      router.refresh();
    });
  }

  const grouped = new Map<string, Space[]>();
  for (const s of spaces) {
    const list = grouped.get(s.theme) ?? [];
    list.push(s);
    grouped.set(s.theme, list);
  }

  return (
    <div className="relative min-h-screen">
      <Y2KBackground density="minimal" />
      <main className="relative z-10 mx-auto max-w-3xl px-4 py-10">
        <div className="mb-8 flex items-center gap-3">
          <NexusLogo />
          <div>
            <h1 className="font-display text-xl font-bold text-(--foreground)">Settings</h1>
            <p className="text-sm text-(--muted-foreground)">Account &amp; workspace preferences</p>
          </div>
        </div>

        {/* Appearance */}
        <section className="rounded-2xl glass-strong p-5">
          <h2 className="flex items-center gap-2 font-display font-semibold text-(--foreground)">
            <Sparkles size={15} className="text-(--primary)" />
            Interface atmosphere
          </h2>
          <p className="mt-1 text-sm text-(--muted-foreground)">
            The global theme NEXUS uses across your workspace.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.values(THEMES).map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTheme(t.key)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all cursor-pointer",
                  appTheme === t.key
                    ? "border-(--primary)/60 bg-(--primary)/12 text-(--foreground)"
                    : "border-(--border) bg-(--card)/50 text-(--muted-foreground) hover:border-(--primary)/30"
                )}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: `linear-gradient(135deg, hsl(${t.vars["--glow-pink"]}), hsl(${t.vars["--glow-cyan"]}))` }}
                />
                {t.name}
              </button>
            ))}
          </div>
        </section>

        {/* Space themes */}
        {spaces.length > 0 && (
          <section className="mt-6 rounded-2xl glass-strong p-5">
            <h2 className="flex items-center gap-2 font-display font-semibold text-(--foreground)">
              <LayoutGrid size={15} className="text-(--primary)" />
              Space themes
            </h2>
            <p className="mt-1 text-sm text-(--muted-foreground)">
              Each Space can have its own atmosphere.
            </p>
            <div className="mt-4 space-y-3">
              {Object.values(THEMES).map((t) => {
                const inThis = (grouped.get(t.key) ?? []).length;
                if (inThis === 0) return null;
                return (
                  <div
                    key={t.key}
                    className="rounded-xl border border-(--border) bg-(--background)/30 p-3"
                  >
                    <div className="flex items-center gap-2 text-sm text-(--foreground)">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: `linear-gradient(135deg, hsl(${t.vars["--glow-pink"]}), hsl(${t.vars["--glow-cyan"]}))` }}
                      />
                      {t.name} · {inThis} Space{inThis === 1 ? "" : "s"}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {spaces.filter((s) => s.theme === t.key).map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center gap-2 rounded-lg border border-(--border) bg-(--card)/50 px-3 py-1.5 text-xs text-(--muted-foreground)"
                        >
                          {s.name}
                          <select
                            value=""
                            onChange={(e) => {
                              const v = e.target.value;
                              if (v) changeSpaceTheme(s.id, v as NexusThemeKey);
                            }}
                            disabled={pendingSpace === s.id}
                            className="rounded border border-(--border) bg-(--card) px-1.5 py-0.5 text-[11px] text-(--foreground) focus:outline-none disabled:opacity-50 cursor-pointer"
                            aria-label={`Theme for ${s.name}`}
                          >
                            <option value="">change ↓</option>
                            {Object.values(THEMES).map((tm) => (
                              <option key={tm.key} value={tm.key}>
                                {tm.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Feedback inbox */}
        <section className="mt-6 rounded-2xl glass-strong p-5">
          <h2 className="flex items-center gap-2 font-display font-semibold text-(--foreground)">
            <MessageCircle size={15} className="text-(--primary)" />
            Feedback inbox
            {feedback.length > 0 && (
              <span className="rounded-full border border-(--primary)/40 bg-(--primary)/10 px-2 py-0.5 text-[10px] font-medium text-(--primary)">
                {feedback.length}
              </span>
            )}
          </h2>
          <p className="mt-1 text-sm text-(--muted-foreground)">
            What people send from the "Send feedback" button.
          </p>
          {feedback.length === 0 ? (
            <p className="mt-4 rounded-xl border border-(--border) bg-(--background)/30 px-4 py-6 text-center text-sm text-(--muted-foreground)">
              No feedback yet. Share NEXUS with someone and ask them to click
              "Send feedback".
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {feedback.map((f) => (
                <li
                  key={f.id}
                  className="rounded-xl border border-(--border) bg-(--background)/30 p-3"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] text-(--muted-foreground)">
                    <span className="truncate font-medium">
                      {f.user_email ?? "Anonymous"}
                      {f.page ? ` · ${f.page}` : ""}
                    </span>
                    <span className="shrink-0">{timeAgo(f.created_at)}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-(--foreground)">{f.content}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Account */}
        <section className="mt-6 rounded-2xl glass-strong p-5">
          <h2 className="font-display font-semibold text-(--foreground)">Account</h2>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-(--background)/30 px-3 py-2.5">
              <span className="text-(--muted-foreground)">Name</span>
              <span className="text-(--foreground)">{username}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-(--background)/30 px-3 py-2.5">
              <span className="text-(--muted-foreground)">Email</span>
              <span className="text-(--foreground)">{userEmail}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-(--background)/30 px-3 py-2.5">
              <span className="text-(--muted-foreground)">Plan</span>
              <span className="rounded-full border border-(--primary)/30 bg-(--primary)/10 px-2.5 py-0.5 text-xs text-(--primary)">
                Free
              </span>
            </div>
          </div>
          <div className="mt-5">
            <NexusButton variant="danger" onClick={handleSignOut} disabled={isPending}>
              <LogOut size={15} />
              Sign out
            </NexusButton>
          </div>
        </section>
      </main>
    </div>
  );
}