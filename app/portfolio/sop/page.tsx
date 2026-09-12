import type { Metadata } from "next";
import { DocShell, SectionHead } from "@/components/portfolio/doc-shell";
import { PortfolioNav } from "@/components/portfolio/nav";
import { site } from "@/data/site";
import { Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Statement of Purpose — Sonakshi",
  description:
    "The readable statement of purpose: using technology to understanding it, the gap year, and the projects that got me here.",
};

const TOC = [
  { id: "the-shift", label: "The shift" },
  { id: "the-projects", label: "What I built" },
  { id: "the-rule", label: "The rule" },
  { id: "the-gap", label: "The gap" },
  { id: "ai-grounded", label: "AI, grounded" },
  { id: "an-honest-direction", label: "Honest direction" },
];

export default function SopPage() {
  const hasPdf = site.docs.sop !== null;

  return (
    <>
      <PortfolioNav />
      <DocShell
        kind="statement of purpose"
        title="From using technology to understanding it"
        subtitle="An honest essay — the shift, the builds, the gap year, and why I want to study Computer Science properly."
        toc={TOC}
      >
        {/* download strip */}
        <div className="mb-10 flex flex-wrap items-center gap-4 rounded-lg border border-pf-line/70 bg-pf-panel/50 p-5">
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-pf-dim">
            <Download size={12} className="text-pf-acid" /> the one-file version
          </span>
          {hasPdf ? (
            <a
              href={site.docs.sop!}
              download
              className="rounded-full border border-pf-acid/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-pf-acid transition-colors hover:bg-pf-acid/10"
            >
              download sop.pdf
            </a>
          ) : (
            <span className="font-mono text-[11px] text-pf-faint">no separate file needed — use the print / save-as-pdf button above</span>
          )}
        </div>

        <SectionHead id="the-shift" n="01" label="The shift" />

        <p>
          I want to study Computer Science because I have reached a point where I do not just want to use technology
          anymore; I want to understand how it works and learn how to build with it properly. My strongest interest is
          Artificial Intelligence, but that interest keeps pulling me outward — into programming, software, and
          problem-solving more generally.
        </p>
        <p>
          I did not start with a clean plan. My interest grew out of trying to make things. I taught myself to code and
          began experimenting with web development, and I found that I enjoyed the specific act of taking an idea that
          exists only inside my head and turning it into something a person could open and actually use. Building, I
          learned quickly, is much more than knowing a language. There are problems at every stage, and quite often I
          did not know how to solve them the first time I met them.
        </p>
        <p className="doc-lead">When something broke, I searched, read documentation, figured out what I was doing wrong, tried another approach, and sometimes started part of the project over.</p>
        <p>
          Things that looked simple turned into far bigger problems than I expected. That did not push me away — it made
          me more curious about what was happening underneath the interface.
        </p>

        <SectionHead id="the-projects" n="02" label="What I built" />

        <p>
          I have tried to put this into practice with projects of my own. I built a Dell laptop showroom as an
          interactive product website — you can open it at{" "}
          <a href="https://dell-y2k-showroom.vercel.app" target="_blank" rel="noreferrer">
            dell-y2k-showroom.vercel.app
          </a>{" "}
          — and later LUMORA, a site for a sculptural lamp at{" "}
          <a href="https://lumora-eta-dusky.vercel.app" target="_blank" rel="noreferrer">
            lumora-eta-dusky.vercel.app
          </a>
          . Neither was an assignment. I built them because I wanted to see whether I could take an idea, learn the
          tools it needed, and turn it into something that actually worked. That meant teaching myself technologies I
          was not comfortable with, facing errors I did not initially understand, and changing my approach when
          something was not working.
        </p>
        <p>
          I also learned that a project being technically functional is not the same as it being right. I started
          paying attention to how a person would actually experience what I had built: how it looked, how it moved, how
          it behaved on different screens, and whether the idea made sense as a product rather than only as code.
        </p>

        <SectionHead id="the-rule" n="03" label="The rule" />

        <p>
          This way of learning has become central to how I work. I understand something much better when I have a
          reason to use it. If I want to build something and discover a part I do not know yet, that gap becomes a
          reason to learn it. I have gotten comfortable with being a beginner and working through a problem step by
          step. At the same time, I know the limits of teaching myself: I can learn tools and build projects, but I
          want a much stronger foundation in mathematics, algorithms, computer systems, and the ideas that actually
          make modern AI possible.
        </p>

        <SectionHead id="the-gap" n="04" label="The gap" />

        <p>
          My academic path has made me realistic about that goal. My marks slipped during the final years of school,
          and I know there are gaps I am responsible for closing. Instead of hiding that, I am using my gap year to
          repair my preparation and build real discipline. My aim is not to reach a particular score or get into a
          particular college. It is to arrive at the next stage of education ready enough to actually use it.
        </p>

        <SectionHead id="ai-grounded" n="05" label="AI, grounded" />

        <p>
          I have already had one taste of combining AI with software a real person opens. I built an AI-powered second
          brain — an app that organizes my notes, sources, and half-formed ideas and answers me back — and I use it
          every day. It showed me what I want more of: AI living inside software instead of staying at a demo's
          distance.
        </p>
        <p>
          If I am given the opportunity to study Computer Science, my first priority would be to build that foundation
          properly. I want to take mathematics and core computer science seriously, rather than rushing toward whatever
          AI topic happens to be popular. Alongside my coursework, I would keep building, and I would want my projects
          to become more technically substantial as I go. I would like to work with other students, join technical
          communities, take part in competitions where appropriate, and look for chances to explore research once I
          know enough to contribute meaningfully.
        </p>

        <SectionHead id="an-honest-direction" n="06" label="Honest direction" />

        <p>
          I also want to use those years to find out what, specifically, I want to pursue within AI. Right now I know I
          enjoy coding, building products, and exploring AI — but I do not want to invent a research ambition just
          because it would sound impressive in an application. I would rather explore during my undergraduate years,
          understand what actually interests me most, and choose a direction with a far better picture of the field.
        </p>
        <p>
          In the longer term, I want to be someone who does more than use existing tools — someone who can create
          technology people genuinely find useful. I want to keep experimenting with ideas, but I also want the
          technical depth to know when an idea is good, how to build it properly, and what its limits are.
        </p>
        <p>
          I am applying because I want to take what I have started doing on my own and develop it much further. I know
          I still have a lot to learn; that is not a weakness in this application, it is the reason I want to study
          this field in depth. I intend to use my undergraduate years to learn seriously, build consistently, explore
          AI beyond the surface, and gradually turn an honest interest in coding into the ability to create things that
          are genuinely useful.
        </p>
      </DocShell>
    </>
  );
}