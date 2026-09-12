"use client";

import { SectionShell, Reveal, SectionTag, Chip, StatLine } from "./primitives";
import { site } from "@/data/site";

const BAR_TONE: Record<string, string> = {
  ok: "bg-pf-acid",
  warn: "bg-pf-amber",
  low: "bg-pf-blue",
  now: "bg-pf-violet",
};

export function Academics() {
  return (
    <SectionShell id="academics" tag="03 · academic record" tone="amber" className="bg-pf-panel/30">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionTag tone="amber" className="mb-6">the honest graph</SectionTag>
          <Reveal>
            <h2 className="font-display text-3xl font-bold leading-tight text-pf-text md:text-4xl">
              No fixed trajectory.
              <br />
              <span className="text-pf-amber">A real one.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-lg leading-relaxed text-pf-dim">
              The bars only go down, and that's exactly why I'm showing them. The dip is real, the worry was real,
              and the repair is also real. A portfolio of only wins would be a cover letter. This is a debugging log.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-7 border-l-2 border-pf-amber/60 pl-4 text-sm leading-relaxed text-pf-dim">
              Eleven solid years of school gave me the spine. The dip in the final years — right when the world asked
              me to declare "a career" — taught me something school couldn't.
            </div>
          </Reveal>
        </div>

        <div>
          <Reveal>
            <div className="space-y-5">
              {site.academics.map((a) => {
                const width = a.kind === "now" ? 100 : a.kind === "ok" ? 88 : a.kind === "warn" ? 78 : 70;
                return (
                  <div key={a.label} className="group">
                    <div className="mb-2 flex items-baseline justify-between gap-4">
                      <span className="flex items-center gap-3">
                        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-pf-dim">{a.label}</span>
                        <Chip tone={a.kind === "now" ? "violet" : "line"}>{a.note}</Chip>
                      </span>
                      <span className="font-display text-xl font-bold text-pf-text">{a.value}</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full border border-pf-line/60 bg-pf-ink">
                      <div
                        className={"h-full rounded-full transition-all duration-700 " + BAR_TONE[a.kind]}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    {a.kind === "low" && (
                      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-pf-faint">
                        ▸ the dip · gap year begins
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>

      {/* the turn */}
      <div className="mt-20 border-t border-pf-line pt-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <SectionTag tone="amber" className="mb-5">on the gap year</SectionTag>
            <h3 className="font-display text-2xl font-bold text-pf-text md:text-3xl">
              I could have re-sat my final exams.
              <br />
              <span className="text-pf-amber">Instead I built this.</span>
            </h3>
            <p className="mt-5 max-w-lg leading-relaxed text-pf-dim">
              Both were options. One told the world I could memorize better the second time. The other told me
              I could go build something only I could have built. I chose the one with no assigned seating —
              and no ceiling.
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal delay={0.05}>
              <div className="h-full rounded-lg border border-pf-line bg-pf-ink p-5">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-pf-dim">→ academics</div>
                <ul className="space-y-2.5 text-[13px] leading-relaxed text-pf-dim">
                  <li>▸ restored a dead iPod / speaker</li>
                  <li>▸ disassembled my printer — and rebuilt it</li>
                  <li>▸ traced PCBs to understand current in my own house</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-lg border border-pf-line bg-pf-ink p-5">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-pf-dim">→ technical</div>
                <ul className="space-y-2.5 text-[13px] leading-relaxed text-pf-dim">
                  <li>▸ taught myself web development</li>
                  <li>▸ built LUMORA, DELL/PLAY, NEXUS</li>
                  <li>▸ reading into AI, agents and systems</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}