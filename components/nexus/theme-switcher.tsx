"use client";

import { Check, Palette } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const { themeMeta, theme, setTheme, availableThemes } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change theme"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg border border-(--border) bg-(--card)/60 px-3 py-2 text-sm text-(--muted-foreground) transition-all hover:border-(--primary)/40 hover:text-(--foreground) cursor-pointer"
      >
        <Palette size={16} />
        <span>{themeMeta.name}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl glass-strong p-2 shadow-2xl animate-scale-in">
          <p className="px-2 py-1 text-[11px] uppercase tracking-widest text-(--muted-foreground)">
            Space atmosphere
          </p>
          <div className="mt-1 space-y-1">
            {availableThemes.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => {
                  setTheme(t.key);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors cursor-pointer",
                  theme === t.key
                    ? "bg-(--primary)/15 text-(--foreground)"
                    : "text-(--muted-foreground) hover:bg-(--card) hover:text-(--foreground)"
                )}
              >
                <span
                  className="h-3.5 w-3.5 rounded-full border"
                  style={{
                    background: `linear-gradient(135deg, ${t.vars["--glow-pink"]}, ${t.vars["--glow-violet"]}, ${t.vars["--glow-cyan"]})`,
                  }}
                />
                <span className="flex-1">
                  <span className="block text-sm font-medium">{t.name}</span>
                  <span className="block text-[11px] text-(--muted-foreground)">
                    {t.description}
                  </span>
                </span>
                {theme === t.key && <Check size={14} className="text-(--primary)" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
