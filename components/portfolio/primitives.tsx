"use client";

import type { ReactNode, MouseEvent } from "react";
import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Reveal: scroll-triggered entrance ──────────────────────── */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "p" | "span" | "li" | "h2" | "h3";
}) {
  const reduce = useReducedMotion();
  const Comp = (motion as any)[as] as typeof motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </Comp>
  );
}

/* ── SectionTag: mono eyebrow label ─────────────────────────── */
export function SectionTag({
  children,
  tone = "blue",
  className,
}: {
  children: ReactNode;
  tone?: "blue" | "acid" | "violet" | "amber" | "dim";
  className?: string;
}) {
  const dot = {
    blue: "bg-pf-blue",
    acid: "bg-pf-acid",
    violet: "bg-pf-violet",
    amber: "bg-pf-amber",
    dim: "bg-pf-faint",
  }[tone];
  return (
    <div className={cn("flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.32em] text-pf-dim", className)}>
      <span className={cn("h-[3px] w-6 rounded-full", dot)} />
      <span>{children}</span>
    </div>
  );
}

/* ── Chip: mono tag pill ────────────────────────────────────── */
export function Chip({
  children,
  className,
  tone = "line",
}: {
  children: ReactNode;
  className?: string;
  tone?: "line" | "blue" | "acid" | "violet" | "warn";
}) {
  const tones = {
    line: "border-pf-line bg-pf-panel text-pf-dim",
    blue: "border-pf-blue/40 bg-pf-blue/10 text-pf-blueSoft",
    acid: "border-pf-acid/40 bg-pf-acid/10 text-pf-acid",
    violet: "border-pf-violet/40 bg-pf-violet/10 text-pf-violet",
    warn: "border-pf-amber/40 bg-pf-amber/10 text-pf-amber",
  }[tone];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]", tones, className)}>
      {children}
    </span>
  );
}

/* ── Bracket: framed exhibit corner ─────────────────────────── */
export function Bracket({ tone = "text-pf-faint" }: { tone?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute h-4 w-4", tone)}>
      <span className="absolute left-0 top-0 h-1.5 w-1.5 border-l border-t" />
      <span className="absolute right-0 top-0 h-1.5 w-1.5 border-r border-t" />
      <span className="absolute bottom-0 left-0 h-1.5 w-1.5 border-b border-l" />
      <span className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r" />
    </div>
  );
}

/* ── MagneticButton: cursor-adjacent magnetic hover ─────────── */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  function onMove(e: MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  }
  function onLeave() {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0, 0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("inline-block transition-transform duration-300 ease-out will-change-transform", className)}
    >
      {children}
    </div>
  );
}

/* ── Marquee: scrolling mono ticker ─────────────────────────── */
export function Marquee({
  items,
  fast = false,
  className,
  tone = "text-pf-faint",
}: {
  items: string[];
  fast?: boolean;
  className?: string;
  tone?: string;
}) {
  const row = items.concat(items);
  return (
    <div className={cn("pf-marquee-paused relative flex w-full overflow-hidden pf-fade-mask-x", className)}>
      <div className={cn("flex shrink-0 items-center gap-8 whitespace-nowrap pr-8", fast ? "pf-marquee-fast" : "pf-marquee", tone)}>
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.28em]">
            {item}
            <i className="h-1 w-1 rounded-full bg-current opacity-40 not-italic" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── StatLine: animated counter line ────────────────────────── */
export function StatLine({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <Reveal className="flex items-baseline justify-between gap-6 border-b border-pf-line/70 py-4">
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-pf-dim">{label}</span>
      <span className="text-right">
        <span className="font-display text-2xl tracking-tight text-pf-text md:text-3xl">{value}</span>
        {note && <span className="mt-1 block text-[11px] leading-snug text-pf-faint">{note}</span>}
      </span>
    </Reveal>
  );
}

/* ── SectionShell: standard padded section frame ────────────── */
export function SectionShell({
  id,
  children,
  className,
  tone = "blue",
  tag,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  tone?: "blue" | "acid" | "violet" | "amber" | "dim";
  tag?: string;
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 px-5 py-24 md:px-10 md:py-32", className)}>
      <div className="mx-auto w-full max-w-6xl">
        {tag && (
          <div className="mb-10">
            <SectionTag tone={tone}>{tag}</SectionTag>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}