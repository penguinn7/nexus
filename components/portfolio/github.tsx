"use client";

import { ArrowUpRight, Star, GitFork, GitBranch, CalendarClock } from "lucide-react";
import { SectionShell, Reveal, SectionTag } from "./primitives";
import { site } from "@/data/site";
import type { GithubResult } from "@/lib/github";

function timeAgo(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso).getTime();
  const days = Math.floor((Date.now() - d) / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const LANGS: Record<string, string> = {
  TypeScript: "bg-pf-blue",
  JavaScript: "bg-pf-amber",
  Python: "bg-pf-acid",
  HTML: "bg-pf-violet",
  CSS: "bg-pf-violet",
  SCSS: "bg-pf-violet",
  Shell: "bg-pf-faint",
};

export function Github({ data }: { data: GithubResult }) {
  const configured = data.ok && data.repos && data.repos.length > 0;
  const name = site.github.username;

  return (
    <SectionShell id="github" tag="08 · live data — no screenshots" className="relative overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-pf-blue/10 blur-[120px]" aria-hidden />

      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionTag tone="blue" className="mb-5">github</SectionTag>
          <Reveal>
            <h2 className="flex items-center gap-4 font-display text-3xl font-bold leading-tight text-pf-text md:text-4xl">
              The repo table
              <ArrowUpRight size={18} className="text-pf-acid" />
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.06}>
          <p className="max-w-md leading-relaxed text-pf-dim">
            No fabricated graphs. These numbers stream live from GitHub the moment this page opens — whatever they
            are at that second is the truth, screenshots be damned.
          </p>
        </Reveal>
      </div>

      {configured ? (
        <div className="grid gap-4 md:grid-cols-2">
          {data.repos!.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.04}>
              <a
                href={r.html_url}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col gap-3 rounded-lg border border-pf-line/70 bg-pf-panel/40 p-5 transition-all hover:border-pf-acid/50 hover:bg-pf-panel"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[12px] text-pf-text">{r.name}</span>
                  <span className="flex items-center gap-3 font-mono text-[10px] text-pf-dim">
                    {r.language && (
                      <span className="flex items-center gap-1.5">
                        <span className={"h-2 w-2 rounded-full " + (LANGS[r.language] ?? "bg-pf-faint")} />
                        {r.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star size={10} /> {r.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork size={10} /> {r.forks}
                    </span>
                  </span>
                </div>
                <p className="line-clamp-2 flex-1 text-[13px] leading-relaxed text-pf-dim">
                  {r.description || "no description yet — code says more anyway."}
                </p>
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-pf-faint">
                  <CalendarClock size={10} /> pushed {timeAgo(r.pushed_at)}
                  <ArrowUpRight size={11} className="ml-auto text-pf-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-pf-acid" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal>
          <div className="rounded-lg border border-dashed border-pf-line p-8 text-center">
            <GitBranch size={22} className="mx-auto mb-3 text-pf-faint" />
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-pf-dim">
              direct feed not yet configured
            </p>
            <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-pf-faint">
              The username is still a placeholder in my config ({name ? `"${name}"` : "—"}). The moment I point it
              at my real profile, honest numbers stream in here automatically. Check back — or check my inbox.
            </p>
            <a
              href={site.github.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-pf-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-pf-dim transition-colors hover:border-pf-acid/50 hover:text-pf-acid"
            >
              my profile on GitHub <ArrowUpRight size={11} />
            </a>
          </div>
        </Reveal>
      )}
    </SectionShell>
  );
}