"use client";

import { Reveal } from "./primitives";
import { site } from "@/data/site";

export function Finale() {
  return (
    <section id="finale" className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-24 text-center">
      <div className="pointer-events-none absolute inset-0 pf-grid opacity-50" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pf-acid/8 blur-[140px]" aria-hidden />

      <div className="relative">
        <Reveal>
          <p className="mx-auto mb-8 max-w-xl font-mono text-[11px] uppercase leading-loose tracking-[0.35em] text-pf-dim">
            this self-portrait is a live process.
            <br />
            <span className="text-pf-faint">systems evolve — verify at your own pace.</span>
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-pf-text md:text-6xl">
            I like finding out
            <br />
            <span className="pf-gradient-text">what happens when</span>
            <br />
            an idea leaves my head.
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mx-auto mt-10 flex max-w-md flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.3em] text-pf-dim">
            <span className="text-pf-acid">{site.name}</span>
            <span className="h-1 w-1 rounded-full bg-pf-faint" />
            <span>{site.role}</span>
            <span className="h-1 w-1 rounded-full bg-pf-faint" />
            <span>class of {site.intake}</span>
            <span className="h-1 w-1 rounded-full bg-pf-faint" />
            <span>willing to learn anything</span>
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mx-auto mt-8 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-pf-line" />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-pf-faint">end of line</span>
            <span className="h-1.5 w-1.5 rounded-full bg-pf-acid pf-glow-pulse" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}