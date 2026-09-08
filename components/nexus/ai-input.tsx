"use client";

import { useState, type FormEvent } from "react";
import {
  Sparkles,
  Zap,
  Telescope,
  GraduationCap,
  Briefcase,
  Palette,
  CornerDownLeft,
} from "lucide-react";
import type { AiMode } from "@/types";
import { cn } from "@/lib/utils";

const MODES: { key: AiMode; label: string; icon: typeof Zap; hint: string }[] = [
  { key: "quick", label: "Quick", icon: Zap, hint: "Concise, fast" },
  { key: "deep", label: "Deep", icon: Telescope, hint: "Detailed reasoning" },
  { key: "research", label: "Research", icon: Sparkles, hint: "Source-heavy, citations" },
  { key: "teach", label: "Teach", icon: GraduationCap, hint: "Learn step-by-step" },
  { key: "executive", label: "Executive", icon: Briefcase, hint: "Decisions & risks" },
  { key: "creative", label: "Creative", icon: Palette, hint: "Synthesis & ideas" },
];

export function AiInput({
  onSubmit,
  placeholder = "Ask NEXUS anything...",
  className,
  autoFocus = false,
}: {
  onSubmit: (prompt: string, mode: AiMode) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState("");
  const [mode, setMode] = useState<AiMode>("quick");
  const [modeOpen, setModeOpen] = useState(false);
  const active = MODES.find((m) => m.key === mode)!;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed, mode);
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("w-full", className)}
    >
      <div className="relative glass-strong rounded-2xl p-2 transition-all duration-300 focus-within:border-(--primary)/50 focus-within:shadow-[0_0_0_1px_hsl(var(--primary)/0.35),0_0_40px_hsl(var(--glow-violet)/0.16)]">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as FormEvent);
            }
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          rows={2}
          className="w-full resize-none bg-transparent px-3 pt-2 text-sm text-(--foreground) placeholder:text-(--muted-foreground)/60 focus:outline-none"
        />

        <div className="flex items-center justify-between px-1 pb-0.5 pt-1">
          {/* Mode selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setModeOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded-lg border border-(--border) bg-(--card)/70 px-2.5 py-1.5 text-xs font-medium text-(--muted-foreground) transition-colors hover:border-(--primary)/50 hover:text-(--foreground) cursor-pointer"
              aria-expanded={modeOpen}
              title={active.hint}
            >
              <active.icon size={13} className="text-(--primary)" />
              {active.label}
            </button>

            {modeOpen && (
              <div className="absolute bottom-full left-0 z-30 mb-2 w-56 rounded-xl glass-strong p-1.5 shadow-2xl animate-scale-in">
                {MODES.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => {
                        setMode(m.key);
                        setModeOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors cursor-pointer",
                        mode === m.key
                          ? "bg-(--primary)/15 text-(--foreground)"
                          : "text-(--muted-foreground) hover:bg-(--card)"
                      )}
                    >
                      <Icon size={14} className={mode === m.key ? "text-(--primary)" : ""} />
                      <span className="flex-1">
                        <span className="block text-xs font-medium">{m.label}</span>
                        <span className="block text-[10px] opacity-70">{m.hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-[10px] text-(--muted-foreground)/70 sm:block">
              Enter to ask · Shift+Enter for newline
            </span>
            <button
              type="submit"
              disabled={!value.trim()}
              aria-label="Ask NEXUS"
              className="rounded-lg bg-gradient-to-r from-(--glow-violet) to-(--glow-blue) p-2 text-white transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_20px_hsl(var(--glow-violet)/0.5)] disabled:opacity-40 disabled:hover:shadow-none cursor-pointer active:scale-95"
            >
              <CornerDownLeft size={16} />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}