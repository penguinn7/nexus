"use client";

import { FileText, FolderGit2, BookOpenCheck, Mail } from "lucide-react";
import { SectionShell, Reveal, SectionTag } from "./primitives";
import { site } from "@/data/site";

const ITEMS = [
  {
    label: "statement of purpose",
    desc: "the same loop, as a story",
    href: "/portfolio/sop",
    icon: FileText,
    tone: "border-pf-blue/40 text-pf-blueSoft",
  },
  {
    label: "curriculum vitae",
    desc: "one page, zero fluff",
    href: "/portfolio/cv",
    icon: BookOpenCheck,
    tone: "border-pf-violet/40 text-pf-violet",
  },
  {
    label: "github",
    desc: "the exhibits' source folders",
    href: site.github.profileUrl,
    ext: true,
    icon: FolderGit2,
    tone: "border-pf-acid/40 text-pf-acid",
  },
];

export function Kit() {
  return (
    <SectionShell id="kit" tag="10 · application kit" className="pb-28">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionTag className="mb-5">the application kit</SectionTag>
          <Reveal>
            <h2 className="font-display text-3xl font-bold leading-tight text-pf-text md:text-4xl">
              What an admissions officer
              <br />
              <span className="text-pf-acid">should open next.</span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.06}>
          <p className="max-w-md leading-relaxed text-pf-dim">
            Everything ships open-source-style: no gatekeeping, no paywall for context. The SOP is below in plain
            language, the site is the evidence folder.
          </p>
        </Reveal>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {ITEMS.map((it, i) => {
          const Icon = it.icon;
          const isMail = it.label === "reach me";
          return (
            <Reveal key={it.label} delay={i * 0.05}>
              <a
                href={it.href}
                {...(it.ext ? { target: "_blank", rel: "noreferrer" } : {})}
                className={
                  "group flex h-full flex-col gap-4 rounded-lg border p-6 transition-all hover:-translate-y-1 " +
                  (isMail ? "border-pf-acid/50 bg-pf-acid/8" : "border-pf-line bg-pf-panel/50")
                }
              >
                <Icon size={20} className={it.tone} />
                <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-pf-text">{it.label}</span>
                <span className="text-[13px] leading-relaxed text-pf-dim">{it.desc}</span>
                <span className="mt-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-pf-acid">
                  open {it.ext ? "↗" : "→"}
                </span>
              </a>
            </Reveal>
          );
        })}
      </div>

      {/* contact chip */}
      <Reveal delay={0.1} className="mt-10">
        <div className="flex flex-wrap items-center justify-center gap-4 rounded-lg border border-pf-line/70 bg-pf-panel/40 px-6 py-5">
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-pf-dim">
            <Mail size={12} className="text-pf-acid" /> reach me directly
          </span>
          <a href={`mailto:${site.contact.email}`} className="font-mono text-[12px] tracking-[0.08em] text-pf-acid underline decoration-pf-acid/40 underline-offset-4">
            {site.contact.email}
          </a>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-pf-faint">response time ÷ doubt</span>
        </div>
      </Reveal>
    </SectionShell>
  );
}