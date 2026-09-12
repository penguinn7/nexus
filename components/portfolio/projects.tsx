"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, FolderGit2, Play } from "lucide-react";
import { SectionShell, Reveal, SectionTag, Chip } from "./primitives";
import { site } from "@/data/site";

type PKey = keyof typeof site.projects;

interface Row {
  index: string;
  name: string;
  sub: string;
  kind: string;
  status: string;
  story: string[];
  skills: string[];
  learned: string;
  live?: string;
  repo?: string;
  special?: { label: string; href: string };
}

const ROWS: Record<PKey, Row> = {
  lumora: {
    index: "ONE",
    name: "LUMORA",
    sub: "A sculptural lamp product website",
    kind: "web · 3D experiment",
    status: "live · surviving",
    story: [
      "What if a product's story is told by the light itself?",
      "I built a cinematic product website for a lamp — a fictional product with a real obsession for how light behaves on camera. The site is a single scroll with lighting as the protagonist.",
    ],
    skills: ["web design", "3D / three.js", "cinematic UI", "scroll-driven storytelling"],
    learned: "that the moon of a story is often more magnetic than the story's star.",
    live: site.projects.lumora.live,
    repo: site.projects.lumora.repo,
  },
  dellplay: {
    index: "TWO",
    name: "DELL / PLAY",
    sub: "An independent Y2K-inspired Dell showroom concept",
    kind: "web · visual direction",
    status: "concept · alive",
    story: [
      "What if a serious tech brand and a playful culture collided — with zero permission from the brand?",
      "A fully independent visual concept: a Y2K take on Dell, built as a rebellious fan project. It's the closest I've gotten to full creative freedom — and the weirdest portfolio piece I love.",
    ],
    skills: ["visual direction", "art direction", "front-end", "concept work"],
    learned: "that constraints are spice, not walls — and that rules can be borrowed for flavor.",
    live: site.projects.dellplay.live,
    repo: site.projects.dellplay.repo,
  },
  nexus: {
    index: "THREE",
    name: "NEXUS",
    sub: "An AI second brain — spaces, sources, notes, graph",
    kind: "app · AI · product",
    status: "live · in use",
    story: [
      "What if notes stopped being flat files and became a graph you could walk through?",
      "NEXUS is the AI-powered second brain I use every day. Spaces, source capture, notes, and a visual graph — with Gemini doing the heavy lifting. The app you are inside right now.",
    ],
    skills: ["Next.js", "TypeScript", "Supabase", "Gemini AI", "graph thinking"],
    learned: "that my own curiosity, given a tool, compounds faster than any syllabus.",
    live: site.projects.nexus.live,
    repo: site.projects.nexus.repo,
    special: { label: "it runs right here", href: "/workspace" },
  },
};

function ProjectRow({ row, i }: { row: Row; i: number }) {
  const [open, setOpen] = useState(false);
  const [statusTone] = useState<string>(row.status.includes("live") ? "acid" : "violet");
  const [statusColor] = useState<string>(
    row.status.includes("live") ? "bg-pf-acid pf-glow-pulse" : "bg-pf-violet pf-glow-pulse"
  );

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="grid w-full grid-cols-2 gap-4 rounded-lg border border-pf-line/70 bg-pf-panel/40 px-5 py-6 text-left transition-colors hover:border-pf-line md:grid-cols-[auto,1fr,auto,auto] md:items-center md:px-8"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-pf-faint">{row.index}</span>
        <span className="font-display text-2xl font-bold tracking-tight text-pf-text md:text-3xl">{row.name}</span>
        <span className="col-span-2 font-mono text-[11px] uppercase tracking-[0.2em] text-pf-dim md:col-span-1">
          {row.kind}
        </span>
        <span className="col-span-2 flex flex-wrap items-center gap-3 md:col-span-1 md:justify-end">
          <span className={"h-1.5 w-1.5 rounded-full " + statusColor} />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-pf-dim">{row.status}</span>
          <span className={"transition-transform duration-300 " + (open ? "rotate-90" : "") + " text-pf-acid"}>›</span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-2 grid gap-8 rounded-lg border border-pf-line/60 bg-pf-ink/80 p-6 md:grid-cols-[5fr,4fr] md:p-8">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-pf-faint">
                    {row.sub}
                  </span>
                  <ArrowUpRight size={14} className="text-pf-acid" />
                </div>
                <div className="space-y-3">
                  {row.story.map((s, si) => (
                    <p key={si} className="text-[13px] leading-relaxed text-pf-dim md:text-sm">
                      {si === 0 ? <span className="text-pf-acid">▸ </span> : <span className="text-pf-faint">▸ </span>}
                      {s}
                    </p>
                  ))}
                </div>
                <div className="mt-5 border-t border-pf-line/60 pt-4 text-[13px] leading-relaxed text-pf-dim">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-pf-amber">learning took: </span>
                  {row.learned}
                </div>
              </div>

              <div className="flex flex-col justify-between gap-6">
                <div className="flex flex-wrap gap-2">
                  {row.skills.map((s) => (
                    <Chip key={s} tone="line">{s}</Chip>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  {row.special ? (
                    <a
                      href={row.special.href}
                      className="flex items-center gap-2 rounded-full border border-pf-acid/50 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-pf-acid transition-colors hover:bg-pf-acid/10"
                    >
                      <Play size={11} /> {row.special.label}
                    </a>
                  ) : null}
                  {row.repo && row.repo !== "#" && (
                    <a
                      href={row.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-full border border-pf-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-pf-dim transition-colors hover:border-pf-acid/50 hover:text-pf-acid"
                    >
                      {row.live === row.repo || (!row.live || row.live === "#") ? (
                        <>
                          open on github <ArrowUpRight size={11} />
                        </>
                      ) : (
                        <>
                          <FolderGit2 size={11} /> github
                        </>
                      )}
                    </a>
                  )}
                  {row.live && row.live !== "#" && row.live !== row.repo && (
                    <a
                      href={row.live}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-full border border-pf-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-pf-dim transition-colors hover:border-pf-acid/50 hover:text-pf-acid"
                    >
                      live <ArrowUpRight size={11} />
                    </a>
                  )}
                  {!row.repo || row.repo === "#" ? (
                    <span className="rounded-full border border-pf-line/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-pf-faint">
                      deployment pending or not shown
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Projects() {
  const keys = Object.keys(ROWS) as PKey[];
  return (
    <SectionShell id="projects" tag="04 · the exhibits" tone="acid" className="relative">
      <div className="pointer-events-none absolute left-0 top-1/3 h-80 w-80 rounded-full bg-pf-acid/8 blur-[120px]" aria-hidden />
      <div className="mb-12 grid gap-6 lg:grid-cols-[5fr,7fr] lg:items-end">
        <div>
          <SectionTag tone="acid" className="mb-5">projects</SectionTag>
          <Reveal>
            <h2 className="font-display text-3xl font-bold leading-tight text-pf-text md:text-5xl">
              Three rooms,
              <br />
              <span className="pf-gradient-text-acid">open them.</span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.08}>
          <p className="max-w-lg leading-relaxed text-pf-dim lg:justify-self-end">
            Select a room to walk inside. Each one is a full turn of the loop — an idea that left my head and came
            back as something I can point at. {site.projects.nexus.live !== "#" && (
              <span className="text-pf-text">NEXUS even runs here — the exhibit is the museum.</span>
            )}
          </p>
        </Reveal>
      </div>

      <div className="space-y-3">
        {keys.map((k, i) => (
          <Reveal key={k} delay={i * 0.05}>
            <ProjectRow row={ROWS[k]} i={i} />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}