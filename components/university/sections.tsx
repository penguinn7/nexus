import { UniSection, CardGrid, NotedList, WhyCards, SemesterRoad, ChipList, SourceFooter, ImageGallery } from "./ui";
import type { UniversityConfig } from "@/data/university/types";

export function AcademicsSection({ config }: { config: UniversityConfig }) {
  const { academics, colors } = config;
  return (
    <UniSection id="academics" title={academics.title} intro={academics.intro} accent={colors.accent}>
      <CardGrid cards={academics.cards} accent={colors.accent} />
      <div className="mt-6">
        <SourceFooter sources={academics.cards.flatMap((c) => (c.source ? [c.source] : []))} />
      </div>
    </UniSection>
  );
}

export function ResearchSection({ config }: { config: UniversityConfig }) {
  const { research, colors } = config;
  return (
    <UniSection id="research" title={research.title} intro={research.intro} accent={colors.accent} className="bg-pf-ink/40">
      <CardGrid cards={research.cards} accent={colors.accent} />
      <div className="mt-6">
        <SourceFooter sources={research.cards.flatMap((c) => (c.source ? [c.source] : []))} />
      </div>
    </UniSection>
  );
}

export function LifeSection({ config }: { config: UniversityConfig }) {
  const { studentLife, colors } = config;
  return (
    <UniSection id="life" title={studentLife.title} intro={studentLife.intro} accent={colors.accent}>
      <CardGrid cards={studentLife.cards} accent={colors.accent} />
      <div className="mt-6">
        <SourceFooter sources={studentLife.cards.flatMap((c) => (c.source ? [c.source] : []))} />
      </div>
    </UniSection>
  );
}

export function OpportunitiesSection({ config }: { config: UniversityConfig }) {
  const { opportunities, colors } = config;
  return (
    <UniSection id="opportunities" title={opportunities.title} intro={opportunities.intro} accent={colors.accent} className="bg-pf-ink/40">
      <CardGrid cards={opportunities.cards} accent={colors.accent} />
      <div className="mt-6">
        <SourceFooter sources={opportunities.cards.flatMap((c) => (c.source ? [c.source] : []))} />
      </div>
    </UniSection>
  );
}

export function NoticedSection({ config }: { config: UniversityConfig }) {
  const { noticed, colors } = config;
  return (
    <UniSection id="noticed" title={noticed.title} intro={noticed.intro} accent={colors.accent}>
      <NotedList items={noticed.items} accent={colors.accent} />
    </UniSection>
  );
}

export function DeeperSection({ config }: { config: UniversityConfig }) {
  const { deeper, colors } = config;
  return (
    <UniSection id="deeper" title={deeper.title} intro={deeper.intro} accent={colors.accent} className="bg-pf-ink/40">
      <NotedList items={deeper.items} accent={colors.accent} />
    </UniSection>
  );
}

export function WhySection({ config }: { config: UniversityConfig }) {
  const { why, colors } = config;
  return (
    <UniSection id="why" title="why I fit — and what I'd develop" accent={colors.accent}>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-pf-line bg-pf-panel/60 p-6">
          <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-pf-acid">what I already bring</h3>
          <ChipList items={why.bring} />
        </div>
        <div className="rounded-lg border border-pf-line bg-pf-panel/60 p-6">
          <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-pf-acid">what I'd develop here</h3>
          <ChipList items={why.develop} />
        </div>
      </div>
      <div className="mt-8">
        <WhyCards reasons={why.reasons} accent={colors.accent} />
      </div>
    </UniSection>
  );
}

export function RoadmapSection({ config }: { config: UniversityConfig }) {
  const { roadmap, colors } = config;
  return (
    <UniSection id="roadmap" title={roadmap.title} intro={roadmap.intro} accent={colors.accent} className="bg-pf-ink/40">
      <SemesterRoad semesters={roadmap.semesters} />
    </UniSection>
  );
}

export function ArchiveSection({ config }: { config: UniversityConfig }) {
  const { archive, colors } = config;
  return (
    <UniSection id="archive" title={archive.title} intro={archive.intro} accent={colors.accent}>
      <ImageGallery images={archive.images} />
    </UniSection>
  );
}

export function MoneySection({ config }: { config: UniversityConfig }) {
  const { finance, language, colors } = config;
  return (
    <UniSection id="money" title="money & logistics" accent={colors.accent}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-pf-line bg-pf-panel/60 p-6">
          <h3 className="text-[15px] font-semibold text-pf-text">{finance.note.title}</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-pf-dim">{finance.note.body}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {finance.sources.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[9px] uppercase tracking-[0.2em] text-pf-faint underline decoration-pf-faint/40 underline-offset-4 hover:text-pf-acid"
              >
                {s.label} ↗
              </a>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-pf-line bg-pf-panel/60 p-6">
          <h3 className="text-[15px] font-semibold text-pf-text">{language.title}</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-pf-dim">{language.body}</p>
          {language.source && (
            <a
              href={language.source.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block font-mono text-[9px] uppercase tracking-[0.2em] text-pf-faint underline decoration-pf-faint/40 underline-offset-4"
            >
              {language.source.label} ↗
            </a>
          )}
        </div>
      </div>
      <div className="mt-8">
        <SourceFooter sources={config.sources} />
      </div>
    </UniSection>
  );
}