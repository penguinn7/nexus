import Image from "next/image";
import { Reveal } from "@/components/portfolio/primitives";
import { StatGrid } from "./ui";
import type { UniversityConfig } from "@/data/university/types";

export function HomeSection({ config }: { config: UniversityConfig }) {
  const { colors } = config;

  return (
    <section id="top" className="relative overflow-hidden px-5 pt-28 md:px-10">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(160,180,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(160,180,255,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-40 top-10 h-[480px] w-[480px] rounded-full blur-[160px]" style={{ background: `${colors.accent}18` }} aria-hidden />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-end gap-10 lg:grid-cols-[3fr,2fr]">
          <div>
            <Reveal>
              <div className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-pf-faint">
                <span className="h-[3px] w-7 rounded-full" style={{ background: colors.accent }} />
                where I want to study · {config.founded} → now
              </div>
            </Reveal>
            <Reveal delay={0.04}>
              <h1 className="font-display text-[18vw] font-extrabold leading-[0.9] tracking-tight text-pf-text md:text-9xl">
                {config.name}
                <span style={{ color: colors.accent }}>_</span>
              </h1>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-pf-dim md:text-lg">{config.identityLine}</p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  config.country,
                  config.city,
                  `founded ${config.founded}`,
                  "research-first",
                ].map((t) => (
                  <span key={t} className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-pf-dim" style={{ borderColor: "rgba(139,145,166,0.35)" }}>
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {config.heroImage && (
            <Reveal delay={0.1}>
              <div className="relative overflow-hidden rounded-lg border border-pf-line">
                <Image
                  src={config.heroImage.src}
                  alt={config.heroImage.alt}
                  width={1280}
                  height={720}
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pf-ink/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-3">
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-pf-dim">{config.heroImage.category}</span>
                  {config.heroImage.link && (
                    <a href={config.heroImage.link} target="_blank" rel="noreferrer" className="font-mono text-[9px] uppercase tracking-[0.3em] text-pf-faint underline decoration-pf-faint/40 underline-offset-4">
                      {config.heroImage.credit} ↗
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          )}
        </div>

        <Reveal delay={0.16}>
          <div className="mt-12 space-y-4">
            {config.intro.map((p, i) => (
              <p key={i} className="max-w-3xl text-[15px] leading-relaxed text-pf-dim">
                <span className="mr-2 font-mono text-[10px] text-pf-acid">▸</span>
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="mx-auto mt-20 max-w-6xl">
        <StatGridBlock config={config} />
      </div>
    </section>
  );
}

export function StatGridBlock({ config }: { config: UniversityConfig }) {
  return (
    <div>
      <Reveal>
        <div className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-pf-faint">
          <span className="h-[3px] w-7 rounded-full" style={{ background: config.colors.accent }} />
          snapshot, in numbers
        </div>
      </Reveal>
      <StatGrid stats={config.stats} accent={config.colors.accent} />
    </div>
  );
}