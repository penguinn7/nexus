"use client";

import { useEffect, useState } from "react";
import { Menu, Pencil, Plus, Sparkles, X } from "lucide-react";
import { Y2KBackground } from "@/components/nexus/y2k-background";
import { NexusLogo } from "@/components/nexus/ui";
import { CommandPalette } from "@/components/nexus/command-palette";
import { ThemeSwitcher } from "@/components/nexus/theme-switcher";
import { FeedbackButton } from "@/components/nexus/feedback-button";
import { EditSpaceModal } from "@/components/nexus/edit-space-modal";
import { getTheme } from "@/lib/themes";
import { cn, timeAgo } from "@/lib/utils";
import type {
  Space,
  Source,
  Note,
  Conversation,
  Concept,
  Connection,
  AiMode,
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
  initialMode,
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
  initialMode?: string;
  initialAdd: string | null;
}) {
  const [activeTab, setActiveTab] = useState<SpaceTab>(
    (initialTab as SpaceTab) ?? "overview"
  );
  const [panelMode, setPanelMode] = useState<AiMode | null>(
    (initialMode as AiMode) ?? null
  );
  const [addSourceOpen, setAddSourceOpen] = useState(false);
  const [addSourceProps, setAddSourceProps] = useState<{
    initialKind?: "pdf" | "text" | "url" | "youtube";
    initialFile?: File | null;
    initialUrl?: string | null;
  } | null>(null);
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    null
  );
  const [panelPrompt, setPanelPrompt] = useState<string | null>(initialQuery);

  const theme = getTheme(space.theme);

  function openAddSource(props?: { initialKind?: "pdf" | "text" | "url" | "youtube"; initialFile?: File | null; initialUrl?: string | null }) {
    setAddSourceProps(props ?? null);
    setAddSourceOpen(true);
  }

  function openAI() {
    window.dispatchEvent(new CustomEvent("nexus:open-ai"));
  }

  // Global drag & drop: drop any file from anywhere to add it to this Space
  useEffect(() => {
    let depth = 0;
    let activeTimer: ReturnType<typeof setTimeout> | null = null;

    function hasFiles(e: DragEvent) {
      return Array.from(e.dataTransfer?.types ?? []).includes("Files");
    }

    function onDragOver(e: DragEvent) {
      if (!hasFiles(e)) return;
      e.preventDefault();
      if (activeTimer) clearTimeout(activeTimer);
      setDragActive(true);
    }
    function onDragEnter(e: DragEvent) {
      if (!hasFiles(e)) return;
      depth += 1;
      if (activeTimer) clearTimeout(activeTimer);
      setDragActive(true);
    }
    function onDragLeave(e: DragEvent) {
      if (!hasFiles(e)) return;
      depth -= 1;
      if (depth <= 0) {
        depth = 0;
        activeTimer = setTimeout(() => setDragActive(false), 120);
      }
    }
    function onDrop(e: DragEvent) {
      if (!hasFiles(e)) return;
      e.preventDefault();
      depth = 0;
      if (activeTimer) clearTimeout(activeTimer);
      setDragActive(false);
      const file = e.dataTransfer?.files?.[0];
      if (file) openAddSource({ initialFile: file });
    }

    document.addEventListener("dragover", onDragOver);
    document.addEventListener("dragenter", onDragEnter);
    document.addEventListener("dragleave", onDragLeave);
    document.addEventListener("drop", onDrop);
    return () => {
      document.removeEventListener("dragover", onDragOver);
      document.removeEventListener("dragenter", onDragEnter);
      document.removeEventListener("dragleave", onDragLeave);
      document.removeEventListener("drop", onDrop);
    };
  }, []);

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
    <div className="flex h-screen flex-col overflow-hidden md:flex-row">
      <Y2KBackground />
      {/* ambient Space-specific glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 70% 10%, hsl(${theme.vars["--glow-violet"]}), transparent 60%)`,
        }}
      />

      {/* ── LEFT: Space navigation (desktop) ──────────────── */}
      <aside className="relative z-10 hidden h-full w-56 shrink-0 flex-col border-r border-(--border)/60 bg-(--card)/30 backdrop-blur-xl md:flex">
        <div className="flex items-center gap-2 px-5 pb-4 pt-5">
          <NexusLogo compact />
          <span className="font-display text-sm font-bold tracking-[0.2em] chrome-text">
            NEXUS
          </span>
        </div>

        <div className="px-5">
          <div className="flex items-center justify-between gap-2">
            <p className="font-display text-[10px] uppercase tracking-[0.2em] text-(--muted-foreground)">
              Space
            </p>
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              aria-label="Edit Space"
              title="Edit Space"
              className="rounded-md p-1 text-(--muted-foreground) transition-colors hover:bg-(--card) hover:text-(--foreground) cursor-pointer"
            >
              <Pencil size={13} />
            </button>
          </div>
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
          <FeedbackButton className="w-full" />
        </div>
      </aside>

      {/* ── MOBILE: top bar ───────────────────────────────── */}
      <div className="relative z-20 flex items-center gap-2 border-b border-(--border)/50 bg-(--card)/60 px-3 py-2.5 backdrop-blur-xl md:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-1.5 text-(--muted-foreground) transition-colors hover:bg-(--card) hover:text-(--foreground) cursor-pointer"
        >
          <Menu size={18} />
        </button>
        <span className="truncate font-display text-sm font-semibold text-(--foreground)">
          {space.name}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            aria-label="Edit Space"
            className="rounded-lg p-1.5 text-(--muted-foreground) transition-colors hover:bg-(--card) hover:text-(--foreground) cursor-pointer"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={openAI}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-(--glow-violet) to-(--glow-blue) px-3 py-1.5 text-xs font-medium text-white shadow-[0_0_20px_hsl(var(--glow-violet)/0.35)] active:scale-95 cursor-pointer"
          >
            <Sparkles size={13} />
            Ask NEXUS
          </button>
        </div>
      </div>

      {/* ── MOBILE: drawer nav ───────────────────────────── */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-(--border)/60 bg-(--card)/95 backdrop-blur-xl md:hidden animate-scale-in">
            <div className="flex items-center justify-between px-5 pb-4 pt-5">
              <div className="flex items-center gap-2">
                <NexusLogo compact />
                <span className="font-display text-sm font-bold tracking-[0.2em] chrome-text">
                  NEXUS
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-1.5 text-(--muted-foreground) transition-colors hover:bg-(--card) hover:text-(--foreground) cursor-pointer"
              >
                <X size={16} />
              </button>
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
            <nav className="mt-4 flex-1 space-y-0.5 overflow-y-auto px-3">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => {
                    setActiveTab(t.key);
                    setDrawerOpen(false);
                  }}
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
              <FeedbackButton className="w-full" />
            </div>
          </div>
        </>
      )}

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
        initialMode={panelMode}
        onPromptConsumed={() => setPanelPrompt(null)}
      />

      {/* ── Universal "Add from anywhere" corner widget ─── */}
      <button
        type="button"
        onClick={() => openAddSource()}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-br from-(--glow-violet) to-(--glow-blue) px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_hsl(var(--glow-violet)/0.35)] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Plus size={16} strokeWidth={2.5} />
        Add anything
      </button>

      {/* Drag-anywhere drop target */}
      {dragActive && (
        <div className="pointer-events-none fixed inset-0 z-[45] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-2xl border-2 border-dashed border-(--primary)/60 bg-(--primary)/10 px-10 py-8 text-center animate-scale-in">
            <Sparkles size={28} className="mx-auto text-(--primary)" />
            <p className="mt-3 font-display text-lg text-(--foreground)">
              Drop to add to <span className="text-(--primary)">{space.name}</span>
            </p>
            <p className="mt-1 text-xs text-(--muted-foreground)">
              PDF · TXT · MD · CSV · up to 10 MB
            </p>
          </div>
        </div>
      )}

      {/* Modals */}
      {addSourceOpen && (
        <AddSourceOverlay
          spaceId={space.id}
          initialKind={addSourceProps?.initialKind}
          initialFile={addSourceProps?.initialFile}
          initialUrl={addSourceProps?.initialUrl}
          onClose={() => setAddSourceOpen(false)}
        />
      )}
      {addNoteOpen && (
        <AddNoteOverlay
          spaceId={space.id}
          onClose={() => setAddNoteOpen(false)}
        />
      )}

      <EditSpaceModal
        space={space}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />

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