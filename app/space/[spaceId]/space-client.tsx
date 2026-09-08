"use client";

import { useEffect, useState } from "react";
import { Y2KBackground } from "@/components/nexus/y2k-background";
import { NexusLogo } from "@/components/nexus/ui";
import { CommandPalette } from "@/components/nexus/command-palette";
import { ThemeSwitcher } from "@/components/nexus/theme-switcher";
import { getTheme } from "@/lib/themes";
import { cn, timeAgo } from "@/lib/utils";
import type {
  Space,
  Source,
  Note,
  Conversation,
  Concept,
  Connection,
} from "@/types";
import { OverviewTab } from "./space/overview-tab";
import { SourcesTab } from "./space/sources-tab";
import { NotesTab } from "./space/notes-tab";
import { ConversationsTab } from "./space/conversations-tab";
import { GraphTab } from "./space/graph-tab";
import { InsightsTab } from "./space/insights-tab";
import { IntelligencePanel } from "./space/intelligence-panel";
import { AddSourceOverlay } from "./space/add-source-overlay";
import { AddNoteOverlay } from "./space/add-note-overlay";

export type SpaceTab =
  | "overview"
  | "sources"
  | "notes"
  | "conversations"
  | "graph"
  | "insights";

const TABS: { key: SpaceTab; label: string; icon: string }[] = [
  { key: "overview", label: "Overview", icon: "◈" },
  { key: "sources", label: "Sources", icon: "▤" },
  { key: "notes", label: "Notes", icon: "✦" },
  { key: "conversations", label: "Conversations", icon: "❋" },
  { key: "graph", label: "Knowledge Graph", icon: "◎" },
  { key: "insights", label: "Insights", icon: "◑" },
];

export function SpaceClient({
  space,
  sources,
  notes,
  conversations,
  concepts,
  connections,
  initialTab,
  initialQuery,
  initialAdd,
}: {
  space: Space;
  sources: Source[];
  notes: Note[];
  conversations: Conversation[];
  concepts: Concept[];
  connections: Connection[];
  initialTab: string;
  initialQuery: string | null;
  initialAdd: string | null;
}) {
  const [activeTab, setActiveTab] = useState<SpaceTab>(
    (initialTab as SpaceTab) ?? "overview"
  );
  const [addSourceOpen, setAddSourceOpen] = useState(false);
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    null
  );
  const [panelPrompt, setPanelPrompt] = useState<string | null>(initialQuery);

  const theme = getTheme(space.theme);

  // Apply the Space's atmosphere while inside it
  useEffect(() => {
    const root = document.documentElement;
    const vars = theme.vars;
    for (const [name, val] of Object.entries(vars)) {
      root.style.setProperty(name, `hsl(${val})`);
    }
    return () => {
      // Restore stored theme on leave (ThemeProvider re-applies)
      const stored = window.localStorage.getItem("nexus-theme");
      if (stored) {
        const meta = getTheme(stored);
        for (const [name, val] of Object.entries(meta.vars)) {
          root.style.setProperty(name, `hsl(${val})`);
        }
      }
    };
  }, [theme]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (initialAdd === "source") setAddSourceOpen(true);
    if (initialAdd === "note") setAddNoteOpen(true);
  }, [initialAdd]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Y2KBackground />
      {/* ambient Space-specific glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 70% 10%, hsl(${theme.vars["--glow-violet"]}), transparent 60%)`,
        }}
      />

      {/* ── LEFT: Space navigation ─────────────────────────── */}
      <aside className="relative z-10 flex h-full w-56 shrink-0 flex-col border-r border-(--border)/60 bg-(--card)/30 backdrop-blur-xl">
        <div className="flex items-center gap-2 px-5 pb-4 pt-5">
          <NexusLogo compact />
          <span className="font-display text-sm font-bold tracking-[0.2em] chrome-text">
            NEXUS
          </span>
        </div>

        <div className="px-5">
          <p className="font-display text-[10px] uppercase tracking-[0.2em] text-(--muted-foreground)">
            Space
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-(--foreground)">
            {space.name}
          </p>
          <p className="text-[11px] text-(--muted-foreground)">
            {timeAgo(space.created_at)}
          </p>
        </div>

        <nav className="mt-5 flex-1 space-y-0.5 overflow-y-auto px-3">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors cursor-pointer",
                activeTab === t.key
                  ? "bg-(--primary)/12 text-(--foreground)"
                  : "text-(--muted-foreground) hover:bg-(--card) hover:text-(--foreground)"
              )}
            >
              <span
                className={cn(
                  "w-4 text-center text-xs",
                  activeTab === t.key ? "text-(--primary)" : ""
                )}
              >
                {t.icon}
              </span>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-(--border)/60 p-3">
          <ThemeSwitcher />
        </div>
      </aside>

      {/* ── CENTER: main content ───────────────────────────── */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        {activeTab === "overview" && (
          <OverviewTab
            space={space}
            sources={sources}
            concepts={concepts}
            connections={connections}
            notes={notes}
            onAddSource={() => setAddSourceOpen(true)}
            onAddNote={() => setAddNoteOpen(true)}
            onGoTab={setActiveTab}
          />
        )}
        {activeTab === "sources" && (
          <SourcesTab
            spaceId={space.id}
            sources={sources}
            onAdd={() => setAddSourceOpen(true)}
          />
        )}
        {activeTab === "notes" && (
          <NotesTab
            spaceId={space.id}
            notes={notes}
            onAdd={() => setAddNoteOpen(true)}
          />
        )}
        {activeTab === "conversations" && (
          <ConversationsTab
            spaceId={space.id}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
          />
        )}
        {activeTab === "graph" && (
          <GraphTab
            spaceId={space.id}
            concepts={concepts}
            connections={connections}
          />
        )}
        {activeTab === "insights" && (
          <InsightsTab
            spaceId={space.id}
            space={space}
            concepts={concepts}
            connections={connections}
            sources={sources}
          />
        )}
      </main>

      {/* ── RIGHT: NEXUS intelligence panel ────────────────── */}
      <IntelligencePanel
        space={space}
        probePrompt={panelPrompt}
        onPromptConsumed={() => setPanelPrompt(null)}
      />

      {/* Modals */}
      {addSourceOpen && (
        <AddSourceOverlay
          spaceId={space.id}
          onClose={() => setAddSourceOpen(false)}
        />
      )}
      {addNoteOpen && (
        <AddNoteOverlay
          spaceId={space.id}
          onClose={() => setAddNoteOpen(false)}
        />
      )}

      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onCreateSpace={() => {
          setCommandOpen(false);
          window.location.href = "/workspace";
        }}
        spaces={[
          {
            id: space.id,
            user_id: space.user_id,
            name: space.name,
            type: space.type,
            description: space.description,
            theme: space.theme,
            created_at: space.created_at,
          },
        ]}
      />
    </div>
  );
}