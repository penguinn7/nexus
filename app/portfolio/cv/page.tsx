import type { Metadata } from "next";
import { DocShell } from "@/components/portfolio/doc-shell";
import { PortfolioNav } from "@/components/portfolio/nav";
import { site } from "@/data/site";
import { Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Curriculum Vitae — Sonakshi",
  description: "One page, zero fluff — education, projects, technical skills, and experience.",
};

const TOC = [
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
];

function CVSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-10 first:mt-0">
      <h2 className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-pf-acid">
        <span className="h-px w-8 bg-pf-acid/40" /> {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ title, meta, note, bullet }: { title: string; meta?: string; note?: string; bullet?: string }) {
  return (
    <div className="mb-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-[15px] font-semibold text-pf-text">{title}</span>
        {meta && <span className="font-mono text-[11px] tracking-[0.1em] text-pf-dim">{meta}</span>}
      </div>
      {note && <p className="mt-1 text-[13px] leading-relaxed text-pf-dim">{note}</p>}
      {bullet && <p className="mt-1 text-[13px] leading-relaxed text-pf-dim">▸ {bullet}</p>}
    </div>
  );
}

export default function CvPage() {
  const hasPdf = site.docs.cv !== null;

  return (
    <>
      <PortfolioNav />
      <DocShell kind="curriculum vitae" title="Sonakshi" subtitle="One page, zero fluff — the readable version. Print is engineered to be clean." toc={TOC}>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-pf-line/70 bg-pf-panel/50 p-5">
        <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] tracking-[0.06em] text-pf-dim">
          <span className="text-pf-text">aspiring cs / ai undergraduate</span>
          <span>{site.contact.location}</span>
          <span>{site.contact.email}</span>
          <span>intake {site.intake}</span>
        </div>
        {hasPdf ? (
          <a
            href={site.docs.cv!}
            download
            className="flex items-center gap-2 rounded-full border border-pf-acid/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-pf-acid transition-colors hover:bg-pf-acid/10"
          >
            <Download size={11} /> download cv.pdf
          </a>
        ) : (
          <span className="font-mono text-[11px] text-pf-faint">no separate file needed — use the print / save-as-pdf button above</span>
        )}
      </div>

      <CVSection id="education" title="Education">
        <Row title="Class 12 · CBSE" meta="70%" note="Science stream with mathematics — Informatics isn't offered here, so I taught myself." />
        <Row title="Class 10 · CBSE" meta="88.2%" note="Distinction — before I let curiosity take the wheel." />
        <Row title="Gap year (current)" meta="self-directed" note="The laboratory: electronics repair, web development, AI tooling — chosen, not assigned." />
      </CVSection>

      <CVSection id="projects" title="Selected projects">
        <Row
          title="NEXUS — AI second brain"
          meta="Next.js · TS · Supabase · AI"
          bullet="Spaces, sources, notes and a graph — installed and used daily by me. The app this portfolio is built inside."
        />
        <Row
          title="LUMORA — product website"
          meta="web · 3D"
          bullet="A cinematic single-scroll product site for a sculptural lamp; lighting as the protagonist."
        />
        <Row
          title="DELL / PLAY — brand concept"
          meta="web · art direction"
          bullet="An independent Y2K-inspired Dell showroom concept — full creative freedom, no permission needed."
        />
      </CVSection>

      <CVSection id="experience" title="Experience & leadership">
        <Row
          title="Tech communications & written content"
          meta="freelance"
          bullet="The before-io side of me: packaging startup ideas for human attention before I could build them."
        />
        <Row
          title="Electronic repair & restoration"
          meta="self-taught"
          bullet="iPods, printers, speakers — disassembled, diagnosed, rebuilt. Socket-level literacy earned by hand."
        />
      </CVSection>

      <CVSection id="skills" title="Skills & languages">
        <div className="grid gap-x-10 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-pf-faint">technical</h3>
            <p className="text-[13px] leading-relaxed text-pf-dim">
              HTML · CSS · JavaScript · TypeScript · React / Next.js · Tailwind · SQL (Supabase) · AI tooling ·
              basic electronics · 3D on the web · UI/UX
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-pf-faint">languages</h3>
            <p className="text-[13px] leading-relaxed text-pf-dim">
              English — working language, daily writing · Hindi — native · working proficiency in learning
              math notation (in progress, enjoying it)
            </p>
          </div>
        </div>
      </CVSection>
    </DocShell>
    </>
  );
}