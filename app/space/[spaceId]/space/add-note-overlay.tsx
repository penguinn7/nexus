"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, StickyNote } from "lucide-react";
import { NexusButton, GlowInput } from "@/components/nexus/ui";
import { createNote } from "@/app/space/notes-actions";

export function AddNoteOverlay({
  spaceId,
  onClose,
}: {
  spaceId: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    titleRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await createNote({ spaceId, title, content });
      if (res.error) {
        setError(res.error);
        return;
      }
      onClose();
      router.refresh();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl glass-strong p-6 shadow-[0_0_80px_hsl(var(--glow-violet)/0.2)] animate-scale-in">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-(--muted-foreground) transition-colors hover:bg-(--card) hover:text-(--foreground) cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-2">
          <StickyNote size={18} className="text-(--primary)" />
          <h2 className="font-display text-xl font-semibold text-(--foreground)">
            New note
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <GlowInput
            ref={titleRef}
            label="Title"
            placeholder="Untitled note"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-widest text-(--muted-foreground)">
              Content
            </span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              autoFocus={false}
              className="w-full resize-y rounded-xl border border-(--border) bg-(--card)/60 px-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground)/60 transition-all focus:border-(--primary)/60 focus:outline-none"
              placeholder="Write a thought..."
            />
          </label>

          {error && (
            <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <NexusButton type="button" variant="ghost" onClick={onClose}>
              Cancel
            </NexusButton>
            <NexusButton type="submit" loading={isPending}>
              Create note
            </NexusButton>
          </div>
        </form>
      </div>
    </div>
  );
}