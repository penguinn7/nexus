"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Radio, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UniversityConfig } from "@/data/university/types";

export const UNI_NAV = [
  { id: "top", label: "KAIST" },
  { id: "academics", label: "academics" },
  { id: "research", label: "research" },
  { id: "life", label: "student life" },
  { id: "opportunities", label: "opportunities" },
  { id: "noticed", label: "i noticed" },
  { id: "deeper", label: "deeper" },
  { id: "why", label: "why" },
  { id: "roadmap", label: "roadmap" },
  { id: "archive", label: "archive" },
  { id: "money", label: "money & logistics" },
];

export function UniShell({
  config,
  children,
}: {
  config: UniversityConfig;
  children: React.ReactNode;
}) {
  const [now, setNow] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const t = setInterval(tick, 15000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const accent = config.colors.accent;

  return (
    <div className="relative min-h-screen" style={{ background: config.colors.base }}>
      {/* console top bar */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={cn(
            "flex h-12 items-center justify-between gap-3 px-4 transition-all duration-300 md:px-6",
            scrolled ? "backdrop-blur-xl" : ""
          )}
          style={{
            background: scrolled ? "rgba(5,8,14,0.86)" : "transparent",
            borderBottom: "1px solid rgba(139,145,166,0.22)",
          }}
        >
          <a href="#top" className="flex items-center gap-3">
            <span className="font-display text-lg font-extrabold tracking-tight text-pf-text">
              {config.name}
              <span style={{ color: accent }}>_</span>
            </span>
            <span className="hidden items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.25em] text-pf-faint sm:flex" style={{ borderColor: "rgba(139,145,166,0.35)" }}>
              <Radio size={9} /> university console
            </span>
          </a>

          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-[10px] tracking-[0.2em] text-pf-faint md:block">
              local time {now || "—"}
            </span>
            <span className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-pf-faint md:flex">
              <span className="h-1.5 w-1.5 rounded-full pf-glow-pulse" style={{ background: accent }} />
              verified &amp; sourced
            </span>
            <a
              href="/portfolio"
              className="flex items-center gap-1.5 rounded border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-pf-dim transition-colors hover:text-pf-text"
              style={{ borderColor: "rgba(139,145,166,0.35)" }}
            >
              <X size={10} /> exit console
            </a>
          </div>
        </div>
      </header>

      {/* main */}
      <main className="relative pb-28">{children}</main>

      {/* bottom section nav */}
      <nav className="fixed inset-x-0 bottom-6 z-40 flex justify-center px-3">
        <div className="w-fit max-w-full overflow-x-auto rounded-full border border-pf-line/70 bg-pf-ink/80 px-2 py-1.5 backdrop-blur-xl no-scrollbar">
          <div className="flex items-center gap-0.5">
            {UNI_NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="whitespace-nowrap rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-pf-faint transition-colors hover:text-pf-text"
              >
                {n.label}
              </a>
            ))}
            <a
              href={config.officialSite}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-pf-dim"
              style={{ color: accent }}
            >
              official <ArrowUpRight size={10} />
            </a>
          </div>
        </div>
      </nav>

      {/* footer */}
      <footer className="relative border-t px-5 pb-16 pt-10" style={{ borderColor: "rgba(139,145,166,0.2)" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-display text-sm font-bold text-pf-text">
              {config.fullName}
            </div>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-pf-faint">
              prepared for my application · nothing invented · every claim sourced
            </p>
          </div>
          <div className="flex gap-4">
            <a href="/portfolio" className="font-mono text-[10px] uppercase tracking-[0.25em] text-pf-dim transition-colors hover:text-pf-text">
              ← back to the exhibit
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}