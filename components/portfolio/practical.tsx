"use client";

import { SectionShell, Reveal, SectionTag } from "./primitives";

export function Practical() {
  return (
    <SectionShell id="practical" tag="09 · the practical bits" className="bg-pf-panel/30">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* finance */}
        <Reveal>
          <div className="relative h-full rounded-lg border border-pf-line bg-pf-ink/70 p-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded border border-pf-amber/40 bg-pf-amber/10 font-mono text-sm text-pf-amber">₹</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-pf-dim">financial reality</span>
            </div>
            <p className="text-sm leading-relaxed text-pf-dim">
              My family's budget can cover a realistic undergraduate cost — but generous scholarships and tuition
              waivers would turn this plan into a <span className="text-pf-text">stable one</span>. I'm grateful to be
              able to apply; I'm also honest that cost shapes sense.
            </p>
            <div className="mt-5 border-t border-pf-line/60 pt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-pf-faint">
              openness ▸ part of the same honesty system
            </div>
          </div>
        </Reveal>

        {/* english */}
        <Reveal delay={0.06}>
          <div className="relative h-full rounded-lg border border-pf-line bg-pf-ink/70 p-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded border border-pf-blue/40 bg-pf-blue/10 font-mono text-sm text-pf-blue">Aa</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-pf-dim">language</span>
            </div>
            <p className="text-sm leading-relaxed text-pf-dim">
              English is my working language — every part of this site, my projects, my notes. Writing and reading
              in English is where I live; an English-taught computer science program is entirely native to me.
            </p>
            <div className="mt-5 border-t border-pf-line/60 pt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-pf-faint">
              comfortable ▸ confident ▸ daily-writing
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}