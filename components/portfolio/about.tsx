"use client";

import { useEffect, useState } from "react";
import { SectionShell, Reveal, SectionTag, Chip, StatLine } from "./primitives";
import { site } from "@/data/site";

/* identity card detail rows that cycle on a timer */
const ID_ROWS = [
  { k: "NODE", v: "Mount Abu · Rajasthan · INDIA" },
  { k: "BUILD MODE", v: "ELECTRON HUNTING — UNDERSTANDING WHY SCREENS LIGHT UP" },
  { k: "DREAM MODE", v: "KAIZEN — BUILDING ONE DOUBT AT A TIME" },
  { k: "GROWTH MODE", v: "LEARNING EVERY DAY" },
];

function IdentityCard() {
  const [row, setRow] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setRow((r) => (r + 1) % ID_ROWS.length), 2600);
    return () => clearInterval(t);
  }, []);
  const cur = ID_ROWS[row];

  return (
    <div className="relative overflow-hidden rounded-lg border border-pf-line bg-pf-panel/60 p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-pf-faint">IDENTITY CARD</span>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-pf-acid">
          <span className="h-1.5 w-1.5 rounded-full bg-pf-acid pf-glow-pulse" /> VERIFIED
        </span>
      </div>

      <div className="space-y-0">
        {ID_ROWS.map((r, i) => (
          <div
            key={r.k}
            className="flex items-baseline justify-between gap-4 border-b border-pf-line/70 py-4 last:border-0"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-pf-dim">{r.k}</span>
            <span
              className={
                "max-w-[70%] text-right font-mono text-[11px] leading-relaxed transition-opacity duration-500 " +
                (i === row ? "text-pf-text opacity-100" : "text-pf-faint opacity-40")
              }
            >
              {r.v}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Chip tone="line">class-12</Chip>
        <Chip tone="line">pcb+maths</Chip>
        <Chip tone="line">cse / ai</Chip>
      </div>
    </div>
  );
}

export function About() {
  return (
    <SectionShell id="about" tag="01 · session node" className="bg-pf-ink">
      <div className="grid gap-10 lg:grid-cols-[5fr,7fr] lg:gap-16">
        <Reveal>
          <IdentityCard />
        </Reveal>

        <div>
          <SectionTag tone="blue" className="mb-6">who is on the far side of the screen?</SectionTag>
          <Reveal>
            <h2 className="font-display text-3xl font-bold leading-tight text-pf-text md:text-5xl">
              A student who
              <br />
              <span className="pf-gradient-text">{site.about.introHighlight}</span>
            </h2>
          </Reveal>
          <div className="mt-7 space-y-5 text-base leading-relaxed text-pf-dim">
            {site.about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 grid gap-x-10 sm:grid-cols-2">
            <StatLine label="hivemind" value={site.about.hivemind} note="open-source, youtubers, papers, my own logs" />
            <StatLine label="becoming" value={site.about.becoming} note="my only honest to-do" />
            <StatLine label="believed out" value={site.about.limitsKilled} note="things i proved wrong by just trying" />
            <StatLine label="going" value={site.about.going} note="no brake pedal found yet" />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}