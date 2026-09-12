"use client";

import { useState } from "react";
import { SectionShell, Reveal, SectionTag, Chip } from "./primitives";

const CASES = [
  {
    key: "lumora",
    name: "LUMORA",
    imagined: "A perfect landing page will make the lamp itself feel believable.",
    wentWrong: "The lamp looked flat. Three days of tweaking lighting, and the product still refused to shine.",
    learned: "Light is not a decoration — it is the medium. I reframed the whole page around shadows and glow, and it finally came alive.",
    dailyLesson: "The thing you think you're building is rarely the thing people feel.",
  },
  {
    key: "dellplay",
    name: "DELL / PLAY",
    imagined: "Y2K + Dell on screen will look effortless with just a style, a folder of fonts, and vibes.",
    wentWrong: "Every element felt frozen. A trend is a skin, not a skeleton — the concept had no internal physics.",
    learned: "Campaigns run on a core idea. I rebuilt the concept around a single notion and let every screen obey it.",
    dailyLesson: "Aesthetic without an engine is a screensaver.",
  },
  {
    key: "nexus",
    name: "NEXUS",
    imagined: "AI knowing my context makes perfect graph notes appear automatically.",
    wentWrong: "The connection between my scattered inputs and AI's confidence was broken — summaries were confident and wrong.",
    learned: "AI is a copilot, not a memory. I redesigned around sources you can trust before trusting the summary.",
    dailyLesson: "Don't outsource the remembering — outsource the drafting.",
  },
];

export function Autopsies() {
  const [active, setActive] = useState(0);
  const c = CASES[active];

  return (
    <SectionShell id="autopsies" tag="05 · post-mortem" tone="violet" className="bg-pf-panel/30">
      <div className="grid gap-10 lg:grid-cols-[4fr,6fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionTag tone="violet" className="mb-5">what went wrong (and why that's good content)</SectionTag>
          <Reveal>
            <h2 className="font-display text-2xl font-bold leading-tight text-pf-text md:text-4xl">
              Autopsy reports.
              <br />
              <span className="text-pf-violet">My projects, dissected.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 max-w-md leading-relaxed text-pf-dim">
              Every exhibit got a post-mortem. Pick one — the file opens below. The sections that fail are the ones
              I'd tattoo on my palm to re-read.
            </p>
          </Reveal>

          <div className="mt-8 space-y-2">
            {CASES.map((x, i) => (
              <button
                key={x.key}
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                className={
                  "block w-full text-left font-mono text-[12px] uppercase tracking-[0.24em] py-2 transition-colors " +
                  (i === active ? "text-pf-text" : "text-pf-faint hover:text-pf-dim")
                }
              >
                <span className={i === active ? "text-pf-acid" : "text-pf-faint"}>
                  {i === active ? "▸ " : "   "}
                </span>
                {x.name}
              </button>
            ))}
          </div>
        </div>

        <Reveal className="relative">
          <div className="relative space-y-3">
            {[
              { label: "WHAT I IMAGINED", v: c.imagined, tone: "text-pf-dim border-pf-line/70" },
              { label: "WHAT WENT WRONG", v: c.wentWrong, tone: "text-pf-amber border-pf-amber/40" },
              { label: "WHAT I LEARNED", v: c.learned, tone: "text-pf-text border-pf-acid/50" },
            ].map((row, i) => (
              <div key={row.label} className={"relative rounded-lg border-l-2 bg-pf-ink/80 p-6 " + row.tone}>
                <div className="mb-2 flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-pf-faint">{row.label}</span>
                </div>
                <p className="text-sm leading-relaxed text-pf-dim">{row.v}</p>
                {i < 2 && (
                  <span className="absolute -bottom-3 left-6 font-mono text-[10px] text-pf-faint">▼</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-lg border border-pf-line/70 bg-pf-panel/50 px-5 py-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-pf-dim">what I carry next time</span>
            <span className="font-mono text-[11px] text-pf-acid">“{c.dailyLesson}”</span>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}