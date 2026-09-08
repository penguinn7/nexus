"use client";

import {
  FileText,
  StickyNote,
  Network,
  BookOpen,
  ArrowRight,
  Plus,
  Upload,
} from "lucide-react";
import type { Space, Source, Note, Concept, Connection, SpaceType } from "@/types";
import { getTheme } from "@/lib/themes";
import { timeAgo, cn } from "@/lib/utils";
import { StatusPill } from "@/components/nexus/ui";
import type { SpaceTab } from "../space-client";

const TYPE_HUMAN: Record<string, string> = {
  student: "Student",
  research: "Research",
  business: "Business",
  office: "Office",
  personal: "Personal",
  creative: "Creative",
  custom: "Custom",
};

export function OverviewTab({
  space,
  sources,
  notes,
  concepts,
  connections,
  onAddSource,
  onAddNote,
  onGoTab,
}: {
  space: Space;
  sources: Source[];
  notes: Note[];
  concepts: Concept[];
  connections: Connection[];
  onAddSource: () => void;
  onAddNote: () => void;
  onGoTab: (t: SpaceTab) => void;
}) {
  const theme = getTheme(space.theme);
  const readySources = sources.filter((s) => s.status === "ready").length;
  const processing = sources.filter((s) => s.status !== "ready" && s.status !== "failed");

  const recentSources = sources.slice(0, 4);
  const recentNotes = notes.slice(0, 3);
  const topConcepts = concepts.slice(0, 8);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Identity */}
      <div className="relative overflow-hidden rounded-3xl glass-strong p-7">
        <div
          aria-hidden
          className="absolute -right-20 -top-24 h-64 w-64 rounded-full blur-3xl opacity-30 animate-glow-pulse"
          style={{
            background: `linear-gradient(135deg, hsl(${theme.vars["--glow-pink"]}), hsl(${theme.vars["--glow-violet"]}), hsl(${theme.vars["--glow-cyan"]}))`,
          }}
        />
        <div className="relative">
          <p className="font-display text-[10px] uppercase tracking-[0.3em] text-(--muted-foreground)">
            {TYPE_HUMAN[space.type] ?? "Custom"} Space · {theme.name} atmosphere
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-(--foreground)">
            {space.name}
          </h1>
          {space.description && (
            <p className="mt-2 max-w-xl text-sm text-(--muted-foreground)">
              {space.description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px] text-(--muted-foreground)">
            <span className="rounded-full border border-(--border) bg-(--card)/50 px-2.5 py-1">
              Created {timeAgo(space.created_at)}
            </span>
            {processing.length > 0 && (
              <span className="flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-amber-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                Teaching NEXUS {processing.length} source{processing.length === 1 ? "" : "s"}...
              </span>
            )}
          </div>

          {/* Quick actions */}
          <div className="mt-6 flex flex-wrap gap-2">
            <QuickAction icon={Upload} label="Add source" onClick={onAddSource} />
            <QuickAction icon={StickyNote} label="Add note" onClick={onAddNote} />
            <QuickAction icon={Network} label="Explore graph" onClick={() => onGoTab("graph")} />
            <QuickAction icon={BookOpen} label="Open insights" onClick={() => onGoTab("insights")} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat icon={FileText} label="Sources" value={readySources} sub={sources.length === readySources ? undefined : `${sources.length} total`} />
        <Stat icon={Network} label="Concepts" value={concepts.length} />
        <Stat icon={ArrowRight} label="Connections" value={connections.length} />
        <Stat icon={StickyNote} label="Notes" value={notes.length} />
      </div>

      {/* Body grids */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* Recent sources */}
        <section className="glass rounded-2xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xs uppercase tracking-[0.25em] text-(--muted-foreground)">
              Recent sources
            </h2>
            <button type="button" onClick={() => onGoTab("sources")} className="flex items-center gap-1 text-xs text-(--primary) hover:underline cursor-pointer">
              View all <ArrowRight size={11} />
            </button>
          </div>
          {recentSources.length === 0 ? (
            <p className="py-4 text-center text-sm text-(--muted-foreground)">
              This Space is quiet.{" "}
              <button type="button" onClick={onAddSource} className="text-(--primary) hover:underline cursor-pointer">
                Add a source
              </button>
              .
            </p>
          ) : (
            <ul className="space-y-2">
              {recentSources.map((s) => (
                <li key={s.id} className="flex items-center gap-2.5 rounded-xl bg-(--background)/30 px-3 py-2">
                  <FileText size={13} className="shrink-0 text-(--muted-foreground)" />
                  <span className="min-w-0 flex-1 truncate text-sm text-(--foreground)">{s.title}</span>
                  <StatusPill status={s.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Concepts preview */}
        <section className="glass rounded-2xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xs uppercase tracking-[0.25em] text-(--muted-foreground)">
              Concepts forming
            </h2>
            <button type="button" onClick={() => onGoTab("graph")} className="flex items-center gap-1 text-xs text-(--primary) hover:underline cursor-pointer">
              Open graph <ArrowRight size={11} />
            </button>
          </div>
          {topConcepts.length === 0 ? (
            <p className="py-4 text-center text-sm text-(--muted-foreground)">
              Add sources and NEXUS will map the concepts here.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {topConcepts.map((c) => (
                <span
                  key={c.id}
                  className="rounded-full border px-3 py-1.5 text-xs transition-all hover:scale-105 cursor-default"
                  style={{
                    borderColor: `hsl(${theme.vars["--glow-cyan"]} / 0.35)`,
                    background: `hsl(${theme.vars["--glow-cyan"]} / 0.08)`,
                    color: `hsl(${theme.vars["--glow-cyan"]})`,
                  }}
                >
                  {c.name}
                </span>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Recent notes */}
      {recentNotes.length > 0 && (
        <section className="mt-5 glass rounded-2xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xs uppercase tracking-[0.25em] text-(--muted-foreground)">
              Recent notes
            </h2>
            <button type="button" onClick={() => onGoTab("notes")} className="flex items-center gap-1 text-xs text-(--primary) hover:underline cursor-pointer">
              View all <ArrowRight size={11} />
            </button>
          </div>
          <ul className="space-y-2">
            {recentNotes.map((n) => (
              <li key={n.id} className="rounded-xl bg-(--background)/30 px-3 py-2">
                <p className="text-sm font-medium text-(--foreground)">{n.title}</p>
                {n.content && <p className="line-clamp-1 text-xs text-(--muted-foreground)">{n.content}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Upload;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl border border-(--border)/70 bg-(--card)/40 px-3.5 py-2 text-xs font-medium text-(--foreground) transition-all hover:border-(--primary)/50 hover:bg-(--card) hover:shadow-[0_0_16px_hsl(var(--glow-violet)/0.15)] active:scale-[0.98] cursor-pointer"
    >
      <Icon size={13} className="text-(--primary)" />
      {label}
    </button>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof FileText;
  label: string;
  value: number;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl glass p-4 glass-hover">
      <div className="flex items-center gap-2 text-(--muted-foreground)">
        <Icon size={13} />
        <span className="text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      <p className="mt-1.5 font-display text-2xl font-bold text-(--foreground)">{value}</p>
      {sub && <p className="text-[10px] text-(--muted-foreground)/70">{sub}</p>}
    </div>
  );
}