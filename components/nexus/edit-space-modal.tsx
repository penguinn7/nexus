"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, BookOpen, Sparkles, Briefcase, FileText, User, Puzzle, Dices, Trash2 } from "lucide-react";
import { updateSpace, deleteSpace } from "@/app/workspace/actions";
import { THEMES, type NexusThemeKey } from "@/lib/themes";
import { NexusButton, GlowInput } from "./ui";
import { cn } from "@/lib/utils";
import type { Space, SpaceType } from "@/types";

const TYPES: { key: SpaceType; label: string; icon: typeof User }[] = [
  { key: "student", label: "Student", icon: BookOpen },
  { key: "research", label: "Research", icon: Sparkles },
  { key: "business", label: "Business", icon: Briefcase },
  { key: "office", label: "Office", icon: FileText },
  { key: "personal", label: "Personal", icon: User },
  { key: "creative", label: "Creative", icon: Puzzle },
  { key: "custom", label: "Custom", icon: Dices },
];

export function EditSpaceModal({
  space,
  open,
  onClose,
}: {
  space: Space;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(space.name);
  const [type, setType] = useState<SpaceType>(space.type);
  const [description, setDescription] = useState(space.description ?? "");
  const [theme, setTheme] = useState<NexusThemeKey>(space.theme);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    setName(space.name);
    setType(space.type);
    setDescription(space.description ?? "");
    setTheme(space.theme);
    setError(null);
    setConfirmDelete(false);
  }, [open, space]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await updateSpace(space.id, { name, type, description, theme });
      if (res.error) {
        setError(res.error);
        return;
      }
      onClose();
      router.refresh();
    });
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const res = await deleteSpace(space.id);
      if (res.error) {
        setError(res.error);
        return;
      }
      router.push("/workspace");
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-space-title"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl glass-strong p-6 shadow-[0_0_80px_hsl(var(--glow-violet)/0.2)] animate-scale-in">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-(--muted-foreground) transition-colors hover:bg-(--card) hover:text-(--foreground) cursor-pointer"
        >
          <X size={16} />
        </button>

        <h2
          id="edit-space-title"
          className="font-display text-xl font-semibold text-(--foreground)"
        >
          Edit Space
        </h2>
        <p className="mt-1 text-sm text-(--muted-foreground)">
          Change how this Space looks and what it contains.
        </p>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <GlowInput
            label="Name"
            placeholder="e.g. JEE Universe, Quantum Research, Acme Startup"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
            maxLength={100}
          />

          <div className="space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-widest text-(--muted-foreground)">
              Kind of Space
            </span>
            <div className="grid grid-cols-4 gap-2">
              {TYPES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setType(t.key)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 text-[11px] transition-all cursor-pointer",
                      type === t.key
                        ? "border-(--primary)/60 bg-(--primary)/12 text-(--foreground) shadow-[0_0_16px_hsl(var(--glow-violet)/0.2)]"
                        : "border-(--border) bg-(--card)/50 text-(--muted-foreground) hover:border-(--primary)/30 hover:text-(--foreground)"
                    )}
                  >
                    <Icon size={16} />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <GlowInput
            label="Description"
            placeholder="What is this Space about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
          />

          <div className="space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-widest text-(--muted-foreground)">
              Atmosphere
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.values(THEMES).map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTheme(t.key)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all cursor-pointer",
                    theme === t.key
                      ? "border-(--primary)/60 bg-(--primary)/12 text-(--foreground)"
                      : "border-(--border) bg-(--card)/50 text-(--muted-foreground) hover:border-(--primary)/30"
                  )}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, hsl(${t.vars["--glow-pink"]}), hsl(${t.vars["--glow-cyan"]}))`,
                    }}
                  />
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between gap-2 pt-1">
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-300">Delete this Space permanently?</span>
                <NexusButton
                  type="button"
                  variant="danger"
                  loading={isPending}
                  onClick={handleDelete}
                >
                  Yes, delete
                </NexusButton>
                <NexusButton
                  type="button"
                  variant="ghost"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </NexusButton>
              </div>
            ) : (
              <NexusButton
                type="button"
                variant="ghost"
                onClick={() => setConfirmDelete(true)}
                className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 size={14} className="mr-1" />
                Delete
              </NexusButton>
            )}
            <div className="flex items-center gap-2">
              <NexusButton type="button" variant="ghost" onClick={onClose}>
                Cancel
              </NexusButton>
              <NexusButton type="submit" loading={isPending}>
                Save changes
              </NexusButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}