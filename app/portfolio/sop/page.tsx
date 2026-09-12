import type { Metadata } from "next";
import { DocShell, SectionHead } from "@/components/portfolio/doc-shell";
import { PortfolioNav } from "@/components/portfolio/nav";
import { site } from "@/data/site";
import { Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Statement of Purpose — Sonakshi",
  description:
    "A readable, honest statement of purpose: what happens when an idea leaves my head, and why I want to study it for four years at university.",
};

const TOC = [
  { id: "the-question", label: "The question" },
  { id: "from-tools-to-current", label: "Tools → current" },
  { id: "the-argument-with-grades", label: "The grades argument" },
  { id: "the-gap-year", label: "The gap year" },
  { id: "why-university", label: "Why university" },
  { id: "what-i-would-build", label: "What I would build" },
];

export default function SopPage() {
  const hasPdf = site.docs.sop !== null;

  return (
    <>
      <PortfolioNav />
      <DocShell
      kind="statement of purpose"
      title="What happens when an idea leaves my head?"
      subtitle="An honest essay in six movements — the same loop, as a story."
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

      <div id="the-question">
        <SectionHead id="the-question" n="01" label="The question that started it" />
        <p className="doc-lead">When I was fifteen, my school phone wouldn't charge.</p>
        <p>
          It should have been the end of the story. Instead it became the beginning of this one. I wanted to know
          what was happening inside — not the repair-shop answer, but the real one. Why does a cable make power go
          one way and not the other? What is the streak of light that leaves my phone and enters a charger? I asked
          the only person in my town who knew, and when he shrugged, the question stayed unofficial in my head:
        </p>
        <blockquote>What happens when an idea leaves my head?</blockquote>
        <p>
          That sentence has followed me from failing phones to failing builds to this application. It has no finished
          answer yet. This essay is the most honest version I can give you of the answer so far.
        </p>
      </div>

      <SectionHead id="from-tools-to-current" n="02" label="From tools to current" />
      <p className="doc-lead">Growing up in the mountains, the internet was a small, expensive thing I had to ration.</p>
      <p>
        A limited data plan was my only door to the world. Every search cost something, so I became a researcher
        out of necessity — reading one article until it answered three questions. That habit gave me something
        rarer than a fast connection: patience for depth.
      </p>
      <p>
        My love of electronics started the same way. A dead iPod, a printer that shredded paper, a speaker that
        wheezed. I took them apart with a toolkit I didn't fully understand, and slowly learned that what I was
        really doing was tracing the physical path of electricity — where it entered, where it pooled, where it
        refused to go. Years before I wrote a line of code, I learned to read a system by taking it apart and
        putting it back together. The computer science I now want to study is the same instinct, one level up.
      </p>
      <p>
        The web caught next. I taught myself design and front-end development with that same rationed-internet
        patience, and began building things simply because I was curious what they would look like finished.
      </p>

      <SectionHead id="the-argument-with-grades" n="03" label="The argument I had with my own grades" />
      <p className="doc-lead">I will not hide this from you, because it is the truest thing about me.</p>
      <p>
        My academic record dips. My final school year ended at 70%, sliding from 88% in class 10 — and I know how
        that reads on an application. It reads: distracted. What actually happened is more precise: the moment the
        world asked eighteen-year-olds to name a single future, every other question I had been quietly collecting
        came forward demanding attention. My grades didn't drop because I stopped caring; they dropped because I
        started aiming my curiosity at things in its own path — and doing it without the discipline of structure.
      </p>
      <p>
        I think this matters to you in a specific way. The dip taught me something no straight line ever could:
        <em> the cost of operating unsupervised, and the repair of it.</em> I chose the repair myself, on my own
        time, with no one forcing it — which is the reason the next section exists.
      </p>

      <SectionHead id="the-gap-year" n="04" label="The gap year that got built" />
      <p className="doc-lead">Two doors opened after school. I picked the one with no assigned seating.</p>
      <p>
        Re-sitting my final exams would have meant memorizing better the second time — the same test, the same
        lens. Instead I took a gap year and treated it as a laboratory. I restored a dead iPod and a speaker.
        I disassembled and rebuilt my printer. I designed and shipped two web projects with my own hands, and I
        built <strong>NEXUS</strong> — an AI-powered second brain I use every single day — from database schema to
        interface to graph. I wrote, I shipped, I broke, I wrote again.
      </p>
      <p>
        None of it was assigned. All of it was chosen. That is the difference I want a university to see: not a
        student who was told what to do and did it, but one who kept building when no one was looking, and chose
        this field on purpose.
      </p>

      <SectionHead id="why-university" n="05" label="Why a university now" />
      <p className="doc-lead">I've hit the ceiling of a self-taught gap year — and that's the happy part.</p>
      <p>
        Left alone, my loop works. But the questions I'm now chasing live beyond my reach: how neural networks
        actually generalize, how systems stay trustworthy under scale, what math is hiding underneath the tools I
        use daily. I can feel the boundaries of my self-built knowledge, and it's time to stand on a real
        foundation.
      </p>
      <p>
        What I bring in exchange is unreproducible at a desk in a lecture hall: a curiosity that has been tested
        by failure and didn't quit; discipline chosen, not imposed; and the habit of shipping real things. I do
        not want to be lectured into being curious — I want to be given the tools to make my curiosity rigorous.
      </p>

      <SectionHead id="what-i-would-build" n="06" label="What I would build with your four years" />
      <p className="doc-lead">Given a foundation, a lab, and mentors, here is the shape of it.</p>
      <p>
        First, I would ground the loop: the "whys" behind the seven stages I named — inference, learning theory,
        systems. Then I would run it out loud: joining research, building things that fail in public, working with
        teammates who argue better than I do. And at the end, I would enter the applied world — not to escape, but
        because the bridge between my ideas and reality is exactly the interface between the classroom and the
        world, which is the place I want to spend a career.
      </p>
      <p>
        I don't know the complete answer to my question yet. But I know my first seven steps by heart, I've lived
        every one of them, and I am ready to trade my loop for something that moves faster than curiosity alone
        can.
      </p>
      <blockquote>An idea left my head five years ago and became this application. Imagine what happens when I give it a system to live in.</blockquote>
    </DocShell>
    </>
  );
}