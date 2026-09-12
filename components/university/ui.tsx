import type { ReactNode } from "react";
import { Reveal } from "@/components/portfolio/primitives";
import type { SourceRef } from "@/data/university/types";

/* ── section frame ──────────────────────────────────────────── */
export function UniSection({
  id,
  title,
  intro,
  accent,
  children,
  className = "",
}: {
  id: string;
  title: string;
  intro?: string;
  accent?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`px-5 py-24 md:px-10 md:py-32 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em]">
            <span className="h-[3px] w-7 rounded-full" style={{ background: accent ?? "#7ea0ff" }} />
            <span className="text-pf-dim">{title}</span>
          </div>
        </Reveal>
        {intro && (
          <Reveal delay={0.04}>
            <p className="mb-10 max-w-3xl text-base leading-relaxed text-pf-dim">{intro}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

/* ── stats grid ──────────────────────────────────────────────── */
export function StatGrid({ stats, accent }: { stats: { label: string; value: string; note?: string; source?: SourceRef }[]; accent?: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.03}>
          <div className="h-full rounded-lg border border-pf-line bg-pf-panel/60 p-5 backdrop-blur-sm">
            <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-pf-dim">{s.label}</span>
            <span className="mt-2 block font-display text-2xl font-bold tracking-tight text-pf-text">{s.value}</span>
            {s.note && <p className="mt-1 text-[12px] leading-snug text-pf-faint">{s.note}</p>}
            {s.source && (
              <a
                href={s.source.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block font-mono text-[9px] uppercase tracking-[0.2em] text-pf-faint underline decoration-pf-faint/40 underline-offset-4"
              >
                {s.source.label} ↗
              </a>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ── card grid ──────────────────────────────────────────────── */
export function CardGrid({ cards, accent }: { cards: { title: string; body: string; source?: SourceRef }[]; accent?: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((c, i) => (
        <Reveal key={c.title} delay={i * 0.04}>
          <div className="h-full rounded-lg border border-pf-line bg-pf-panel/60 p-6 backdrop-blur-sm">
            <h3 className="text-[15px] font-semibold text-pf-text">{c.title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-pf-dim">{c.body}</p>
            {c.source && (
              <a
                href={c.source.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block font-mono text-[9px] uppercase tracking-[0.2em] text-pf-faint underline decoration-pf-faint/40 underline-offset-4"
              >
                {c.source.label} ↗
              </a>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ── noticed/deeper list ────────────────────────────────────── */
export function NotedList({ items, accent }: { items: { found: string; why: string; source?: SourceRef }[]; accent?: string }) {
  return (
    <div className="space-y-3">
      {items.map((n, i) => (
        <Reveal key={i} delay={i * 0.03}>
          <div className="relative rounded-lg border border-pf-line bg-pf-panel/60 p-5">
            <span className="absolute left-5 top-4 font-display text-2xl font-bold text-pf-faint/40">{String(i + 1).padStart(2, "0")}</span>
            <div className="pl-8">
              <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-pf-faint">found</span>
              <p className="mt-0.5 text-[14px] font-semibold leading-snug text-pf-text">{n.found}</p>
              <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-pf-faint">why it matters to me</span>
              <p className="mt-0.5 text-[13px] leading-relaxed text-pf-dim">{n.why}</p>
              {n.source && (
                <a
                  href={n.source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block font-mono text-[9px] uppercase tracking-[0.2em] text-pf-faint underline decoration-pf-faint/40 underline-offset-4"
                >
                  {n.source.label} ↗
                </a>
              )}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ── image gallery ──────────────────────────────────────────── */
export function ImageGallery({ images }: { images: { src: string; alt: string; category: string; credit: string; link?: string }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((img, i) => {
        const Wrapper = img.link ? "a" : "div";
        const wrapProps = img.link ? { href: img.link, target: "_blank", rel: "noreferrer" } : {};
        return (
          <Reveal key={i} delay={i * 0.03}>
            <Wrapper {...wrapProps} className="group relative block aspect-[4/3] overflow-hidden rounded-lg border border-pf-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pf-ink/90 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-pf-acid">{img.category}</span>
                <span className="mt-0.5 block text-[11px] text-pf-faint">{img.credit}</span>
              </div>
            </Wrapper>
          </Reveal>
        );
      })}
    </div>
  );
}

/* ── source footer ──────────────────────────────────────────── */
export function SourceFooter({ sources }: { sources: SourceRef[] }) {
  return (
    <div className="mt-10 border-t border-pf-line pt-6">
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-pf-faint">sources</span>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {sources.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[9px] uppercase tracking-[0.2em] text-pf-faint underline decoration-pf-faint/40 underline-offset-4 transition-colors hover:text-pf-acid"
          >
            {s.label} ↗
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── why cards ──────────────────────────────────────────────── */
export function WhyCards({ reasons, accent }: { reasons: { feature: string; interest: string; meaning: string; source?: SourceRef }[]; accent?: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {reasons.map((r, i) => (
        <Reveal key={r.feature} delay={i * 0.04}>
          <div className="flex h-full flex-col rounded-lg border border-pf-line bg-pf-panel/60 p-6 backdrop-blur-sm">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-pf-acid">{r.feature}</span>
            <h4 className="mt-2 text-[15px] font-semibold text-pf-text">{r.interest}</h4>
            <p className="mt-2 flex-1 text-[13px] leading-relaxed text-pf-dim">{r.meaning}</p>
            {r.source && (
              <a
                href={r.source.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block font-mono text-[9px] uppercase tracking-[0.2em] text-pf-faint underline decoration-pf-faint/40 underline-offset-4"
              >
                {r.source.label} ↗
              </a>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ── semester road ──────────────────────────────────────────── */
export function SemesterRoad({ semesters }: { semesters: { label: string; points: string[] }[] }) {
  return (
    <div className="relative space-y-6 border-l border-pf-line pl-6 md:space-y-8">
      {semesters.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.04}>
          <div className="relative">
            <span className="absolute -left-7 top-0.5 h-3.5 w-3.5 rounded-full border border-pf-line bg-pf-ink" />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-pf-acid">{s.label}</span>
            <ul className="mt-2 space-y-1.5">
              {s.points.map((p, pi) => (
                <li key={pi} className="flex items-start gap-2 text-[13px] leading-relaxed text-pf-dim">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-pf-faint" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ── plain chip list ────────────────────────────────────────── */
export function ChipList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span
          key={t}
          className="rounded-full border border-pf-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-pf-dim"
        >
          {t}
        </span>
      ))}
    </div>
  );
}