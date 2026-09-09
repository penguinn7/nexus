"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Menu, Network, Plus, Sparkles, Layers, X, ArrowRight } from "lucide-react";
import { Sidebar } from "@/components/nexus/sidebar";
import { AiInput } from "@/components/nexus/ai-input";
import { SpaceCard } from "@/components/nexus/space-card";
import { CreateSpaceModal } from "@/components/nexus/create-space-modal";
import { Y2KBackground } from "@/components/nexus/y2k-background";
import { CommandPalette } from "@/components/nexus/command-palette";
import type { SpaceWithStats, Stats } from "@/types";

export function WorkspaceClient({
  spaces,
  stats,
  userName,
}: {
  spaces: SpaceWithStats[];
  stats: Stats;
  userName: string;
}) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    function onOpen() {
      setCommandOpen(true);
    }
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((o) => !o);
      }
    }
    window.addEventListener("nexus:command-open", onOpen);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("nexus:command-open", onOpen);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function handleAsk(prompt: string) {
    if (spaces.length === 0) {
      setCreateOpen(true);
      return;
    }
    // Ask NEXUS globally: use the Space with the most material, in Research mode
    // so it reads your sources AND researches the live web — then answers immediately.
    const best =
      [...spaces].sort(
        (a, b) =>
          Number(b.source_count ?? 0) - Number(a.source_count ?? 0)
      )[0];
    router.push(
      `/space/${best.id}?tab=overview&mode=research&q=${encodeURIComponent(prompt)}`
    );
  }

  const firstName = userName.split(" ")[0];

  return (
    <div className="flex h-screen flex-col overflow-hidden lg:flex-row">
      <Y2KBackground />
      <div className="hidden lg:block">
        <Sidebar spaces={spaces} onNewSpace={() => setCreateOpen(true)} />
      </div>

      {/* ── MOBILE: top bar ───────────────────────────────── */}
      <div className="relative z-20 flex items-center gap-2 border-b border-(--border)/50 bg-(--card)/60 px-3 py-2.5 backdrop-blur-xl lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-1.5 text-(--muted-foreground) transition-colors hover:bg-(--card) hover:text-(--foreground) cursor-pointer"
        >
          <Menu size={18} />
        </button>
        <span className="truncate font-display text-sm font-bold tracking-[0.2em] chrome-text">
          NEXUS
        </span>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          aria-label="New Space"
          className="ml-auto flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-(--glow-violet) to-(--glow-blue) px-3 py-1.5 text-xs font-medium text-white shadow-[0_0_20px_hsl(var(--glow-violet)/0.35)] active:scale-95 cursor-pointer"
        >
          <Plus size={14} />
          New Space
        </button>
      </div>

      {/* ── MOBILE: drawer ────────────────────────────────── */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden animate-scale-in">
            <Sidebar drawer spaces={spaces} onNewSpace={() => { setDrawerOpen(false); setCreateOpen(true); }} />
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="absolute right-2 top-3 z-10 rounded-lg p-1.5 text-(--muted-foreground) hover:text-(--foreground) cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </>
      )}

      <main className="relative z-10 flex-1 overflow-y-auto px-6 py-8 md:px-10">
        {/* Hero */}
        <section className="mx-auto max-w-4xl animate-fade-up">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-(--muted-foreground)">
            Welcome back, {firstName}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-(--foreground) md:text-4xl">
            Your brain, <span className="text-gradient">but connected.</span>
          </h1>
          <p className="mt-2 text-sm text-(--muted-foreground)">
            Everything you know, growing into one intelligent environment.
          </p>

          <div className="mt-6">
            <AiInput onSubmit={handleAsk} />
          </div>
        </section>

        {/* Stats */}
        <section className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard icon={Layers} label="Spaces" value={stats.spaces} delay="0ms" />
          <StatCard icon={FileText} label="Sources" value={stats.sources} delay="60ms" />
          <StatCard icon={Sparkles} label="Concepts" value={stats.concepts} delay="120ms" />
          <StatCard icon={Network} label="Connections" value={stats.connections} delay="180ms" />
        </section>

        {/* Spaces */}
        <section className="mx-auto mt-12 max-w-4xl">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="font-display text-sm uppercase tracking-[0.25em] text-(--muted-foreground)">
                Living Spaces
              </h2>
              <p className="mt-1 text-sm text-(--foreground)">
                Environments where knowledge becomes connected.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-(--primary) transition-colors hover:bg-(--primary)/10 cursor-pointer"
            >
              New Space <ArrowRight size={14} />
            </button>
          </div>

          {spaces.length === 0 ? (
            <EmptyWorkspace onCreate={() => setCreateOpen(true)} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {spaces.map((s) => (
                <SpaceCard key={s.id} space={s} />
              ))}
            </div>
          )}
        </section>
      </main>

      <CreateSpaceModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onCreateSpace={() => {
          setCommandOpen(false);
          setCreateOpen(true);
        }}
        spaces={spaces}
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: typeof Layers;
  label: string;
  value: number;
  delay: string;
}) {
  return (
    <div
      className="animate-fade-up rounded-2xl glass p-4 transition-all duration-300 glass-hover"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-2 text-(--muted-foreground)">
        <Icon size={14} />
        <span className="text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      <p className="mt-2 font-display text-2xl font-bold text-(--foreground)">
        {value.toLocaleString()}
      </p>
      {value === 0 && (
        <p className="mt-0.5 text-[11px] text-(--muted-foreground)/80">
          Waiting for your first one...
        </p>
      )}
    </div>
  );
}

function EmptyWorkspace({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-strong p-10 text-center animate-scale-in">
      <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-(--glow-violet)/20 blur-3xl animate-glow-pulse" />
      <div className="relative">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-(--primary)/30 bg-(--primary)/10">
          <Sparkles size={26} className="text-(--primary) animate-glow-pulse" />
        </div>
        <h3 className="font-display text-xl font-semibold text-(--foreground)">
          Your universe is quiet.
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-(--muted-foreground)">
          Give NEXUS something to connect. Create a Space for a subject,
          research project, business — anything worth understanding deeply.
        </p>
        <button
          type="button"
          onClick={onCreate}
          className="mt-6 rounded-xl bg-gradient-to-r from-(--glow-violet) to-(--glow-blue) px-6 py-3 text-sm font-medium text-white shadow-[0_0_30px_hsl(var(--glow-violet)/0.4)] transition-all hover:brightness-110 hover:shadow-[0_0_40px_hsl(var(--glow-violet)/0.6)] active:scale-[0.98] cursor-pointer"
        >
          Create your first Space
        </button>
      </div>
    </div>
  );
}