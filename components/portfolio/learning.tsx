"use client";

import { useState } from "react";
import { SectionShell, Reveal, SectionTag, Chip } from "./primitives";

const STAGES = [
  {
    n: "01",
    name: "SEE",
    detail:
      "Something breaks, glows, moves, or confuses me. A phone that won't charge, a printer that shreds paper, an AI that hallucinates. First emotion: confusion. Second: a question.",
  },
  {
    n: "02",
    name: "WONDER",
    detail:
      "I ask the dumb version out loud: 'what is actually happening inside this?'. I don't google yet. I guess first, badly. My wrong guesses become the thing I dig for.",
  },
  {
    n: "03",
    name: "TAKE APART",
    detail:
      "Open the object. Trace the path the data/current/ink physically takes. Name every part out loud. This is where the amateur argyle of 2023 became a socket-level citizen.",
  },
  {
    n: "04",
    name: "BUILD",
    detail:
      "I rebuild a small version for myself — worse, smaller, mine. A lamp I can hold. A page I can refresh. An app that answers to only me.",
  },
  {
    n: "05",
    name: "BREAK",
    detail:
      "Push my version until it fails. Failure isn't grief — it's the manager writing review notes for free. I collect failures like XP.",
  },
  {
    n: "06",
    name: "UNDERSTAND",
    detail:
      "Now I go to theory — papers, docs, the why. The internal map pins to the same coordinates I already touched, so it sticks. This is when the internet finally makes sense.",
  },
  {
    n: "07",
    name: "BUILD AGAIN",
    detail:
      "The second version is cleaner. Not because I got smarter — because I've been that object. The loop is complete, so it can start on the next mystery.",
  },
];

function LoopViz({ active }: { active: number }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      <div className="absolute inset-0 rounded-full border border-pf-line/60" />
      <div className="absolute inset-8 rounded-full border border-pf-line/40" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "conic-gradient(from 90deg, transparent 0deg, transparent 340deg, rgba(183,250,60,0.16) 360deg)",
        }}
      />
      <div className="absolute inset-0 rotate-[-90deg]"> </div>

      {/* stage markers positioned around the ring */}
      {STAGES.map((s, i) => {
        const a = (i / STAGES.length) * 2 * Math.PI;
        const x = 50 + Math.cos(a - Math.PI / 2) * 40;
        const y = 50 + Math.sin(a - Math.PI / 2) * 40;
        const isActive = i === active;
        return (
          <div
            key={s.n}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div
              className={
                "mx-auto flex h-11 w-11 items-center justify-center rounded-full border font-display text-[11px] transition-all duration-300 " +
                (isActive
                  ? "scale-110 border-pf-acid bg-pf-acid/15 text-pf-acid pf-glow"
                  : "border-pf-line bg-pf-ink text-pf-dim")
              }
            >
              {s.n}
            </div>
            <div
              className={
                "mt-1.5 font-mono text-[9px] uppercase tracking-[0.25em] transition-colors " +
                (isActive ? "text-pf-acid" : "text-pf-faint")
              }
            >
              {s.name}
            </div>
          </div>
        );
      })}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="font-display text-xl font-bold text-pf-text">THE LOOP</div>
        <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-pf-dim">never closes · only restarts</div>
      </div>
    </div>
  );
}

export function Learning() {
  const [active, setActive] = useState(0);

  return (
    <SectionShell id="learning" tag="02 · this is how I think" className="relative overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-pf-violet/10 blur-[100px]" aria-hidden />

      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionTag tone="violet" className="mb-6">the learning loop</SectionTag>
          <Reveal>
            <h2 className="font-display text-3xl font-bold leading-tight text-pf-text md:text-4xl">
              Watch me learn, <br className="hidden md:block" />
              <span className="pf-gradient-text-violet">in seven stages.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-lg leading-relaxed text-pf-dim">
              I didn't discover this loop in a book. I discovered it by tracing a pattern across everything I've been
              curious about — and I named it because it kept returning. Everything on this site is one full turn of
              the loop.
            </p>
          </Reveal>
          <Reveal delay={0.14} className="mt-6">
            <div className="border-l-2 border-pf-violet/60 pl-4 text-sm leading-relaxed text-pf-dim">
              The loop has no exit. Which means curiosity is not a phase — it is the operating system.
            </div>
          </Reveal>

          <div className="mt-8 hidden items-center gap-2 lg:flex">
            <Chip tone="violet">stage {active + 1}</Chip>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-pf-dim">{STAGES[active].name}</span>
            <span className="ml-2 h-px flex-1 bg-pf-line" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-12">
          <Reveal className="w-full">
            <LoopViz active={active} />
          </Reveal>

          <div className="w-full space-y-1.5">
            {STAGES.map((s, i) => (
              <button
                key={s.n}
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                className={
                  "group w-full rounded border px-4 py-3 text-left transition-all duration-200 " +
                  (i === active
                    ? "border-pf-violet/60 bg-pf-violet/10"
                    : "border-pf-line/70 bg-pf-panel/40 hover:border-pf-line hover:bg-pf-panel")
                }
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em]">
                    <span className={"font-display text-sm " + (i === active ? "text-pf-violet" : "text-pf-faint")}>{s.n}</span>
                    <span className={i === active ? "text-pf-text" : "text-pf-dim"}>{s.name}</span>
                  </span>
                  <span className={"text-pf-faint transition-all " + (i === active ? "rotate-90 text-pf-violet" : "")}>›</span>
                </div>
                {i === active && (
                  <p className="mt-2 text-[13px] leading-relaxed text-pf-dim">{s.detail}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}