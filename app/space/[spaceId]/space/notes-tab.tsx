"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  StickyNote,
  Sparkles,
  Wand2,
  GraduationCap,
  Lightbulb,
  MessageCircleQuestion,
  LinkIcon,
  X,
} from "lucide-react";
import type { Note } from "@/types";
import { timeAgo } from "@/lib/utils";
import { createNote, updateNote, deleteNote } from "@/app/space/notes-actions";
import { NexusButton } from "@/components/nexus/ui";

const AI_ACTIONS = [
  { key: "summarize", label: "Summarize", icon: Wand2 },
  { key: "improve", label: "Improve", icon: Sparkles },
  { key: "explain", label: "Explain", icon: Lightbulb },
  { key: "study_notes", label: "Study notes", icon: GraduationCap },
  { key: "generate_questions", label: "Questions", icon: MessageCircleQuestion },
  { key: "connect", label: "Connect to graph", icon: LinkIcon },
] as const;

type ActionKey = (typeof AI_ACTIONS)[number]["key"];

export function NotesTab({
  spaceId,
  notes,
  onAdd,
}: {
  spaceId: string;
  notes: Note[];
  onAdd: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(noteId: string) {
    const res = await deleteNote({ spaceId, noteId });
    if (res.error) {
      setError(res.error);
      return;
    }
    window.location.reload();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.25em] text-(--muted-foreground)">
            Notes
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-(--foreground)">
            Thoughts &amp; reflections
          </h1>
          <p className="mt-1 text-sm text-(--muted-foreground)">
            Notes that NEXUS can understand, improve and connect.
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-(--glow-violet) to-(--glow-blue) px-4 py-2.5 text-sm font-medium text-white shadow-[0_0_20px_hsl(var(--glow-violet)/0.3)] transition-all hover:shadow-[0_0_30px_hsl(var(--glow-violet)/0.5)] active:scale-[0.98] cursor-pointer"
        >
          <Plus size={15} />
          New note
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-3">
        {notes.length === 0 ? (
          <div className="rounded-3xl glass-strong p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-(--primary)/25 bg-(--primary)/8">
              <StickyNote size={24} className="text-(--primary)" />
            </div>
            <h3 className="font-display text-lg font-semibold text-(--foreground)">
              Nothing written yet.
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-(--muted-foreground)">
              Capture a thought. NEXUS can summarize it, explain it, and find
              how it connects to everything else in this Space.
            </p>
            <button
              type="button"
              onClick={onAdd}
              className="mt-5 rounded-xl border border-(--primary)/40 bg-(--primary)/10 px-5 py-2.5 text-sm font-medium text-(--primary) transition-all hover:bg-(--primary)/20 cursor-pointer"
            >
              Write your first note
            </button>
          </div>
        ) : (
          notes.map((n) =>
            editingId === n.id ? (
              <NoteEditor
                key={n.id}
                spaceId={spaceId}
                note={n}
                onDone={() => setEditingId(null)}
              />
            ) : (
              <NoteCard
                key={n.id}
                note={n}
                onEdit={() => setEditingId(n.id)}
                onDelete={() => handleDelete(n.id)}
              />
            )
          )
        )}
      </div>
    </div>
  );
}

function NoteCard({
  note,
  onEdit,
  onDelete,
}: {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group glass rounded-xl p-4 transition-all duration-300 glass-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display font-semibold text-(--foreground)">
            {note.title}
          </h3>
          <p className="mt-0.5 text-[11px] text-(--muted-foreground)">
            Updated {timeAgo(note.updated_at)}
          </p>
        </div>
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit note"
            className="rounded-lg p-2 text-(--muted-foreground) transition-colors hover:bg-(--card) hover:text-(--foreground) cursor-pointer"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete note"
            className="rounded-lg p-2 text-(--muted-foreground) transition-colors hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {note.content && (
        <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-(--muted-foreground)">
          {note.content}
        </p>
      )}
    </div>
  );
}

function NoteEditor({
  spaceId,
  note,
  onDone,
}: {
  spaceId: string;
  note: Note;
  onDone: () => void;
}) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content ?? "");
  const [saving, setSaving] = useState(false);
  const [aiBusy, setAiBusy] = useState<ActionKey | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    const res = await updateNote({ spaceId, noteId: note.id, title, content });
    setSaving(false);
    if (res.error) {
      setAiError(res.error);
      return;
    }
    onDone();
    window.location.reload();
  }

  async function runAiAction(action: ActionKey) {
    setAiBusy(action);
    setAiError(null);
    try {
      const res = await fetch("/api/ai/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spaceId, noteId: note.id, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiError(data.error ?? "AI action failed.");
        return;
      }
      if (action === "generate_questions" || action === "study_notes") {
        setContent((c) => c + "\n\n─── " + actionLabel(action) + " ───\n\n" + data.result);
      } else {
        setContent(data.result);
      }
    } catch {
      setAiError("Network error — please try again.");
    } finally {
      setAiBusy(null);
    }
  }

  return (
    <div className="glass rounded-xl p-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        className="w-full bg-transparent font-display text-base font-semibold text-(--foreground) placeholder:text-(--muted-foreground)/50 focus:outline-none"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        placeholder="Write freely..."
        className="mt-2 w-full resize-y bg-transparent text-sm leading-relaxed text-(--foreground) placeholder:text-(--muted-foreground)/50 focus:outline-none"
      />

      <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-(--border)/50 pt-3">
        {AI_ACTIONS.map((a) => {
          const Icon = a.icon;
          const busy = aiBusy === a.key;
          return (
            <button
              key={a.key}
              type="button"
              onClick={() => runAiAction(a.key)}
              disabled={aiBusy !== null}
              className="flex items-center gap-1.5 rounded-lg border border-(--border) bg-(--card)/50 px-2.5 py-1.5 text-[11px] text-(--muted-foreground) transition-all hover:border-(--primary)/40 hover:text-(--foreground) disabled:opacity-50 cursor-pointer"
            >
              <Icon size={12} className={busy ? "animate-pulse text-(--primary)" : "text-(--primary)"} />
              {busy ? "Thinking..." : a.label}
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-2">
          {aiError && <span className="text-[11px] text-red-300">{aiError}</span>}
          <button
            type="button"
            onClick={onDone}
            className="rounded-lg px-3 py-1.5 text-xs text-(--muted-foreground) hover:text-(--foreground) cursor-pointer"
          >
            Cancel
          </button>
          <NexusButton size="sm" onClick={handleSave} loading={saving}>
            Save
          </NexusButton>
        </div>
      </div>
    </div>
  );
}

function actionLabel(a: ActionKey): string {
  const found = AI_ACTIONS.find((x) => x.key === a);
  return found?.label ?? a;
}