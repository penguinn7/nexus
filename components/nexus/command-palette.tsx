"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Sparkles,
  FileText,
  StickyNote,
  Network,
  Palette,
  Settings,
  Space as SpaceIcon,
} from "lucide-react";
import type { Space } from "@/types";
import { cn } from "@/lib/utils";
import { THEMES } from "@/lib/themes";
import { useTheme } from "./theme-provider";

export function CommandPalette({
  open,
  onClose,
  onCreateSpace,
  spaces,
}: {
  open: boolean;
  onClose: () => void;
  onCreateSpace: () => void;
  spaces: Space[];
}) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo(() => {
    const base = [
      {
        label: "Create Space",
        hint: "Start a new environment",
        icon: Plus,
        action: () => onCreateSpace(),
      },
      {
        label: "Ask NEXUS",
        hint: "Ask anything, anywhere",
        icon: Sparkles,
        action: () => {
          onClose();
          if (spaces.length > 0) router.push(`/space/${spaces[0].id}`);
        },
      },
      {
        label: "Add Source",
        hint: "PDF, text or URL",
        icon: FileText,
        action: () => {
          onClose();
          if (spaces.length > 0) router.push(`/space/${spaces[0].id}?add=source`);
        },
      },
      {
        label: "Add Note",
        hint: "Capture a thought",
        icon: StickyNote,
        action: () => {
          onClose();
          if (spaces.length > 0) router.push(`/space/${spaces[0].id}?add=note`);
        },
      },
      {
        label: "Open Knowledge Graph",
        hint: "Explore connections",
        icon: Network,
        action: () => {
          onClose();
          if (spaces.length > 0) router.push(`/space/${spaces[0].id}?tab=graph`);
        },
      },
      {
        label: "Settings",
        hint: "Account & preferences",
        icon: Settings,
        action: () => {
          onClose();
          router.push("/settings");
        },
      },
    ];

    const themeCommands = Object.values(THEMES).map((t) => ({
      label: `Theme: ${t.name}`,
      hint: t.description,
      icon: Palette,
      action: () => {
        setTheme(t.key);
        onClose();
      },
    }));

    const spaceCommands = spaces.map((s) => ({
      label: `Open: ${s.name}`,
      hint: "Space",
      icon: SpaceIcon,
      action: () => {
        onClose();
        router.push(`/space/${s.id}`);
      },
    }));

    return [...spaceCommands, ...base, ...themeCommands];
  }, [router, onClose, onCreateSpace, spaces, setTheme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((i) => (i + 1) % Math.max(filtered.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) =>
          i === 0 ? Math.max(filtered.length - 1, 0) : i - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[index];
        if (cmd) cmd.action();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, filtered, index, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl glass-strong shadow-[0_0_80px_hsl(var(--glow-violet)/0.25)] animate-scale-in">
        <div className="flex items-center gap-3 border-b border-(--border)/60 px-4 py-3">
          <Search size={18} className="text-(--muted-foreground)" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            placeholder="Search or run a command..."
            className="flex-1 bg-transparent text-sm text-(--foreground) placeholder:text-(--muted-foreground)/60 focus:outline-none"
          />
          <kbd className="rounded border border-(--border) px-1.5 py-0.5 text-[10px] text-(--muted-foreground)">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <p className="text-sm text-(--muted-foreground)">
                Nothing connected yet.
              </p>
              <p className="mt-1 text-xs text-(--muted-foreground)/70">
                Try a different command.
              </p>
            </div>
          ) : (
            filtered.map((cmd, i) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.label}
                  type="button"
                  onMouseEnter={() => setIndex(i)}
                  onClick={cmd.action}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors cursor-pointer",
                    index === i
                      ? "bg-(--primary)/15 text-(--foreground)"
                      : "text-(--muted-foreground)"
                  )}
                >
                  <Icon
                    size={16}
                    className={index === i ? "text-(--primary)" : ""}
                  />
                  <span className="flex-1 text-sm font-medium">{cmd.label}</span>
                  <span className="text-[11px] text-(--muted-foreground)/60">
                    {cmd.hint}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
