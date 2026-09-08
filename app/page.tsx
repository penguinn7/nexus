"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Network,
  FileText,
  MessageSquare,
  Zap,
  Telescope,
  GraduationCap,
  Briefcase,
  Palette,
  Layers,
  Compass,
} from "lucide-react";
import { Y2KBackground } from "@/components/nexus/y2k-background";
import { NexusButton, NexusLogo, GlowInput } from "@/components/nexus/ui";
import { THEMES } from "@/lib/themes";
import { cn } from "@/lib/utils";
import type { AiMode } from "@/types";
import { useState } from "react";

const MODES: {
  key: AiMode;
  label: string;
  tagline: string;
  icon: typeof Zap;
  example: string;
}[] = [
  {
    key: "quick",
    label: "Quick",
    tagline: "Concise. Immediate.",
    icon: Zap,
    example:
      "Entropy is a measure of the number of microscopic configurations consistent with a system's macroscopic state.",
  },
  {
    key: "deep",
    label: "Deep",
    tagline: "Reasoning across your sources.",
    icon: Telescope,
    example:
      "Entropy connects to thermodynamics, statistical mechanics and information theory. In your notes, entropy is framed as disorder, but Claude Shannon reframes it as uncertainty — the two are reconciled through Boltzmann's constant.",
  },
  {
    key: "research",
    label: "Research",
    tagline: "Citations, contradictions, unknowns.",
    icon: Sparkles,
    example:
      "Your notes define entropy via microstates. The paper you saved defines it via information. These agree when k·ln(W) ≈ H·ln(2), but your sources differ on reversibility — flagged below.",
  },
  {
    key: "teach",
    label: "Teach",
    tagline: "Step-by-step, at your level.",
    icon: GraduationCap,
    example:
      "Imagine a deck of cards. Shuffled, it looks disordered. Entropy counts how many arrangements 'look the same'. Let's build intuition one small step at a time...",
  },
  {
    key: "executive",
    label: "Executive",
    tagline: "Decisions, risks, actions.",
    icon: Briefcase,
    example:
      "Recommendation: adopt entropy-based framing for the paper's thesis. Risk: two sources use incompatible definitions. Action: reconcile units before chapter 3.",
  },
  {
    key: "creative",
    label: "Creative",
    tagline: "Synthesis beyond the obvious.",
    icon: Palette,
    example:
      "What if you taught entropy as an economy of possible states? Your Markov-chain notes and your economics readings share a hidden skeleton...",
  },
];

const MODE_KEYS: AiMode[] = ["quick", "deep", "research", "teach", "executive", "creative"];

export default function LandingPage() {
  const [demoMode, setDemoMode] = useState<AiMode>("deep");
  const demo = MODES.find((m) => m.key === demoMode)!;

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Y2KBackground density="dense" />

      {/* ── NAV ─────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-40">
        <div className="glass mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl px-5 py-2.5">
          <NexusLogo />
          <nav className="hidden items-center gap-6 text-sm text-(--muted-foreground) md:flex">
            <a href="#how" className="transition-colors hover:text-(--foreground)">How it works</a>
            <a href="#spaces" className="transition-colors hover:text-(--foreground)">Spaces</a>
            <a href="#graph" className="transition-colors hover:text-(--foreground)">Graph</a>
            <a href="#modes" className="transition-colors hover:text-(--foreground)">AI Modes</a>
            <a href="#pricing" className="transition-colors hover:text-(--foreground)">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <NexusButton variant="ghost" size="sm">Sign in</NexusButton>
            </Link>
            <Link href="/signup">
              <NexusButton size="sm">Get started</NexusButton>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-24">
        <div className="pointer-events-none absolute -top-1/4 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-(--glow-violet)/25 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-(--glow-blue)/16 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-3xl text-center animate-fade-up">
          <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-(--primary)/30 bg-(--primary)/10 px-4 py-1.5 text-xs font-medium text-(--primary)">
            <span className="h-1.5 w-1.5 rounded-full bg-(--primary) animate-pulse" />
            An operating system for knowledge
          </p>
          <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
            <span className="chrome-text">NEXUS</span>
          </h1>
          <p className="mt-6 font-display text-2xl font-semibold text-(--foreground) sm:text-3xl md:text-4xl">
            Your brain,
            <br />
            <span className="text-gradient">but connected.</span>
          </p>
          <p className="mx-auto mt-6 max-w-xl text-base text-(--muted-foreground) sm:text-lg">
            Your sources, thoughts, research and AI living inside one
            intelligent environment.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup">
              <NexusButton size="lg" className="w-full sm:w-auto">
                Enter NEXUS
                <ArrowRight size={16} />
              </NexusButton>
            </Link>
            <Link href="/login">
              <NexusButton size="lg" variant="outline" className="w-full sm:w-auto">
                Explore a Space
              </NexusButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section id="how" className="relative z-10 mx-auto max-w-6xl px-4 py-24">
        <SectionLabel>How NEXUS works</SectionLabel>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold text-(--foreground) md:text-4xl">
          Capture. Understand. Connect.{" "}
          <span className="text-gradient">Discover.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-(--muted-foreground)">
          Every Space you create becomes a living environment. Drop sources in,
          and NEXUS reads them, extracts concepts, finds relationships and
          builds a graph you can explore — and ask about.
        </p>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          <Step n="01" title="Capture" body="Add PDFs, text, URLs and notes. NEXUS ingests and understands each source in its Space's context." icon={FileText} />
          <Step n="02" title="Connect" body="Concepts become nodes. Relationships become edges. NEXUS maps how your knowledge fits together." icon={Network} />
          <Step n="03" title="Explore" body="Ask about any idea. NEXUS retrieves from your sources, cites them, and surfaces what's missing." icon={Sparkles} />
        </div>
      </section>

      {/* ── LIVING SPACES ───────────────────────────────────── */}
      <section id="spaces" className="relative z-10 mx-auto max-w-6xl px-4 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionLabel>Living Spaces</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-bold text-(--foreground) md:text-4xl">
              Not folders.
              <br />
              <span className="text-gradient">Environments.</span>
            </h2>
            <p className="mt-5 text-(--muted-foreground)">
              A Space isn't a directory of files. It's a subject, a research
              project, a business, a course, a thesis — with its own identity,
              theme, sources, concepts, conversations and growing knowledge
              graph.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-(--muted-foreground)">
              <li className="flex items-start gap-3">
                <Sparkles size={16} className="mt-0.5 shrink-0 text-(--primary)" />
                Each Space gets its own visual theme and atmosphere
              </li>
              <li className="flex items-start gap-3">
                <MessageSquare size={16} className="mt-0.5 shrink-0 text-(--primary)" />
                NEXUS understands the whole Space, not isolated files
              </li>
              <li className="flex items-start gap-3">
                <Layers size={16} className="mt-0.5 shrink-0 text-(--primary)" />
                Sources, notes, conversations and concepts live together
              </li>
              <li className="flex items-start gap-3">
                <Compass size={16} className="mt-0.5 shrink-0 text-(--primary)" />
                NEXUS tells you what to explore next
              </li>
            </ul>
          </div>

          {/* Example space preview card */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-(--glow-violet)/20 via-transparent to-(--glow-cyan)/20 blur-2xl" />
            <div className="relative rounded-2xl glass-strong p-6 animate-float" style={{ animationDuration: "10s" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-lg font-semibold text-(--foreground)">JEE Universe</p>
                  <p className="text-xs text-(--muted-foreground)">Student Space · Y2K atmosphere</p>
                </div>
                <span className="rounded-lg border border-(--primary)/30 bg-(--primary)/10 px-2 py-1 text-[10px] text-(--primary)">LIVE</span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Sources", v: "23" },
                  { label: "Concepts", v: "117" },
                  { label: "Links", v: "342" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-(--background)/40 p-2.5">
                    <p className="font-display text-xl font-bold text-(--foreground)">{s.v}</p>
                    <p className="text-[10px] uppercase tracking-wide text-(--muted-foreground)">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Mini concept flow */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 rounded-xl bg-(--background)/30 p-3">
                <ConceptChip>Entropy</ConceptChip>
                <ArrowRight size={12} className="text-(--muted-foreground)" />
                <ConceptChip>Thermodynamics</ConceptChip>
                <ArrowRight size={12} className="text-(--muted-foreground)" />
                <ConceptChip>Statistical Mechanics</ConceptChip>
                <ArrowRight size={12} className="text-(--muted-foreground)" />
                <ConceptChip>Information Theory</ConceptChip>
              </div>

              <p className="mt-4 text-xs text-(--muted-foreground)/80">
                "Your Kinematics notes, the Rotational Motion playlist and your
                Newton's Laws summary share 14 concepts. Start with
                <span className="text-(--primary)"> Circular Motion</span> — it
                bridges all three."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOURCE-AWARE AI ─────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <ExampleAnswer />
          </div>
          <div className="order-1 lg:order-2">
            <SectionLabel>Source-aware AI</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-bold text-(--foreground) md:text-4xl">
              It says where it learned things.
            </h2>
            <p className="mt-5 text-(--muted-foreground)">
              NEXUS distinguishes what comes from your sources, what the model
              knows, and what is current information. Answers cite the exact
              notes and papers behind them. If it doesn't know, it says so.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-(--muted-foreground)">
              <li className="flex items-start gap-3">
                <FileText size={16} className="mt-0.5 shrink-0 text-(--primary)" />
                Inline citations to your own sources
              </li>
              <li className="flex items-start gap-3">
                <Sparkles size={16} className="mt-0.5 shrink-0 text-(--primary)" />
                Contradictions between sources surfaced honestly
              </li>
              <li className="flex items-start gap-3">
                <Network size={16} className="mt-0.5 shrink-0 text-(--primary)" />
                Connections drawn across everything you've given it
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── KNOWLEDGE GRAPH ─────────────────────────────────── */}
      <section id="graph" className="relative z-10 mx-auto max-w-6xl px-4 py-24">
        <div className="text-center">
          <SectionLabel className="justify-center">Knowledge Graph</SectionLabel>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-bold text-(--foreground) md:text-4xl">
            Watch your knowledge <span className="text-gradient">become a map.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-(--muted-foreground)">
            Concepts become nodes. Relationships become edges. Pan, zoom, select,
            inspect — and ask NEXUS to explain any node from your sources.
          </p>
        </div>
        <div className="relative mt-14">
          <div className="absolute -inset-10 rounded-full bg-(--glow-blue)/10 blur-3xl" />
          <MiniGraph />
        </div>
      </section>

      {/* ── AI MODES ────────────────────────────────────────── */}
      <section id="modes" className="relative z-10 mx-auto max-w-6xl px-4 py-24">
        <div className="text-center">
          <SectionLabel className="justify-center">AI Modes</SectionLabel>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-bold text-(--foreground) md:text-4xl">
            One intelligence.
            <br />
            <span className="text-gradient">Six ways to think.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-(--muted-foreground)">
            The mode you choose genuinely changes how NEXUS reasons, cites,
            structures and challenges your thinking — not just a label.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[300px_1fr]">
          <div className="flex flex-wrap gap-2 lg:flex-col">
            {MODES.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setDemoMode(m.key)}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all cursor-pointer",
                    demoMode === m.key
                      ? "border-(--primary)/50 bg-(--primary)/10 shadow-[0_0_24px_hsl(var(--glow-violet)/0.15)]"
                      : "border-(--border) bg-(--card)/40 hover:border-(--primary)/30"
                  )}
                >
                  <Icon size={17} className={demoMode === m.key ? "text-(--primary)" : "text-(--muted-foreground)"} />
                  <span>
                    <span className={cn("block text-sm font-medium", demoMode === m.key ? "text-(--foreground)" : "text-(--muted-foreground)")}>{m.label}</span>
                    <span className="block text-[11px] text-(--muted-foreground)/70">{m.tagline}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative overflow-hidden rounded-2xl glass-strong p-6">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-(--glow-pink)/15 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--primary)/15">
                  <demo.icon size={14} className="text-(--primary)" />
                </span>
                <p className="font-display text-sm font-semibold text-(--foreground)">NEXUS · {demo.label} mode</p>
                <span className="ml-auto hidden h-2 w-2 rounded-full bg-emerald-400 animate-pulse sm:block" />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-(--foreground)">
                {demo.example}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-(--muted-foreground)">
                <Sparkles size={12} className="text-(--primary)" />
                Sources: Thermodynamics Notes · Statistical Mechanics Paper
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THEMES ──────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-24">
        <div className="text-center">
          <SectionLabel className="justify-center">Atmospheres</SectionLabel>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-bold text-(--foreground) md:text-4xl">
            Every Space has a <span className="text-gradient">mood.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-(--muted-foreground)">
            Themes are data-driven. Each Space can spin up its own atmosphere —
            and the architecture is built to welcome new ones.
          </p>
        </div>
        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-3">
          {Object.values(THEMES).map((t) => (
            <div
              key={t.key}
              className="flex items-center gap-2.5 rounded-full border border-(--border) bg-(--card)/50 py-2 pl-3 pr-4 text-sm text-(--muted-foreground) hover:border-(--primary)/30 hover:text-(--foreground)"
            >
              <span
                className="h-4 w-4 rounded-full"
                style={{ background: `linear-gradient(135deg, hsl(${t.vars["--glow-pink"]}), hsl(${t.vars["--glow-cyan"]}))` }}
              />
              {t.name}
            </div>
          ))}
        </div>
      </section>

      {/* ── USE CASES ───────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-24">
        <div className="text-center">
          <SectionLabel className="justify-center">What you can build</SectionLabel>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-bold text-(--foreground) md:text-4xl">
            A Space for <span className="text-gradient">everything.</span>
          </h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <UseCase title="Exam preparation" body="Physics, Chemistry, Math — notes, PDFs, problem sets, videos and concepts woven into one map." />
          <UseCase title="Research projects" body="Papers, datasets, hypotheses. NEXUS finds contradictions and keeps your citations honest." />
          <UseCase title="Startups & business" body="Market research, interviews, notes on every competitor — an executive briefing mode that cuts to decisions." />
          <UseCase title="University courses" body="Lectures, readings and assignments become connected concepts you can ask about. Goodbye scattered files." />
          <UseCase title="Creative projects" body="References, drafts and brainstorms. Creative mode synthesizes across what you've collected." />
          <UseCase title="Personal knowledge" body="Books you read, articles you saved, ideas you had — a second brain that actually connects them." />
        </div>
      </section>

      {/* ── PHILOSOPHY ──────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-4xl px-4 py-24">
        <div className="rounded-3xl glass-strong p-10 text-center">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-(--muted-foreground)">Philosophy</p>
          <blockquote className="mx-auto mt-6 max-w-2xl font-display text-2xl font-semibold leading-snug text-(--foreground) md:text-3xl">
            "The ultimate loop is simple:
            <br />
            <span className="text-gradient">capture → understand → connect → ask → discover → learn.</span>
            <br />
            And NEXUS gets smarter."
          </blockquote>
          <div className="mx-auto mt-8 flex max-w-md flex-wrap items-center justify-center gap-2 text-xs text-(--muted-foreground)">
            {["Captured", "Understood", "Connected", "Explored", "Learned"].map((s) => (
              <span key={s} className="rounded-full border border-(--primary)/25 bg-(--primary)/8 px-3 py-1 text-(--primary)">{s} ✓</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────── */}
      <section id="pricing" className="relative z-10 mx-auto max-w-6xl px-4 py-24">
        <div className="text-center">
          <SectionLabel className="justify-center">Pricing</SectionLabel>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-bold text-(--foreground) md:text-4xl">
            Start free. <span className="text-gradient">Grow deep.</span>
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Tier name="Free" price="$0" features={["2 Spaces", "20 sources", "Quick & Deep AI modes", "Core knowledge graph"]} featured={false} />
          <Tier name="Plus" price="$12" features={["Unlimited Spaces", "500 sources/month", "All six AI modes", "Research mode & citations"]} featured cta="Start Plus" />
          <Tier name="Pro" price="$29" features={["Large Spaces", "Deeper retrieval", "Extended context", "Advanced integrations", "Priority processing"]} featured={false} />
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-32 pt-12">
        <div className="relative overflow-hidden rounded-3xl glass-strong px-6 py-16 text-center">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-(--glow-violet)/20 blur-3xl" />
          <h2 className="relative font-display text-3xl font-bold text-(--foreground) md:text-5xl">
            Give me your information.
            <br />
            <span className="chrome-text">I'll build the world around it.</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-(--muted-foreground)">
            Create your first Space in seconds. No credit card required.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup">
              <NexusButton size="lg">Enter NEXUS</NexusButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-(--border)/50 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 text-sm text-(--muted-foreground) sm:flex-row">
          <NexusLogo />
          <p className="text-xs">Your brain, but connected. © 2026 NEXUS</p>
          <div className="flex gap-6 text-xs">
            <a href="#" className="hover:text-(--foreground)">Privacy</a>
            <a href="#" className="hover:text-(--foreground)">Terms</a>
            <a href="#" className="hover:text-(--foreground)">Status</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ── helpers ────────────────────────────────────────────────────── */

function UseCase({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl glass p-6 transition-all duration-300 glass-hover">
      <h3 className="font-display text-base font-semibold text-(--foreground)">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-(--muted-foreground)">{body}</p>
    </div>
  );
}

function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-2 font-display text-xs uppercase tracking-[0.3em] text-(--primary)", className)}>
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-(--primary)" />
      {children}
    </p>
  );
}

function Step({ n, title, body, icon: Icon }: { n: string; title: string; body: string; icon: typeof FileText }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl glass p-6 transition-all duration-300 glass-hover">
      <span className="font-display text-4xl font-bold text-(--primary)/20 transition-colors group-hover:text-(--primary)/40">{n}</span>
      <div className="mt-2 flex items-center gap-2">
        <Icon size={16} className="text-(--primary)" />
        <h3 className="font-display font-semibold text-(--foreground)">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-(--muted-foreground)">{body}</p>
    </div>
  );
}

function ConceptChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-(--glow-cyan)/40 bg-(--glow-cyan)/10 px-2.5 py-1 text-[10px] font-medium text-(--foreground)">
      {children}
    </span>
  );
}

function ExampleAnswer() {
  return (
    <div className="relative overflow-hidden rounded-2xl glass-strong p-6">
      <div className="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-(--glow-cyan)/15 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--primary)/15">
            <Sparkles size={14} className="text-(--primary)" />
          </span>
          <p className="font-display text-sm font-semibold text-(--foreground)">NEXUS</p>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-(--foreground)">
          Entropy measures the number of microscopic configurations consistent
          with a system's macroscopic state.
        </p>

        <p className="mt-4 font-display text-[10px] uppercase tracking-[0.2em] text-(--muted-foreground)">Sources</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <Citation>Thermodynamics Notes</Citation>
          <Citation>Statistical Mechanics Paper</Citation>
        </div>

        <p className="mt-4 font-display text-[10px] uppercase tracking-[0.2em] text-(--muted-foreground)">Connected concepts</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <ConceptChip>Microstates</ConceptChip>
          <ConceptChip>Probability</ConceptChip>
          <ConceptChip>Information Theory</ConceptChip>
        </div>

        <p className="mt-4 font-display text-[10px] uppercase tracking-[0.2em] text-(--muted-foreground)">Explore next</p>
        <p className="mt-1 text-xs text-(--primary)">→ "Why does entropy increase?"</p>
      </div>
    </div>
  );
}

function Citation({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-(--primary)/30 bg-(--primary)/10 px-2.5 py-1 text-[10px] text-(--primary)">
      <FileText size={10} />
      {children}
    </span>
  );
}

const NODES = [
  { x: 50, y: 22, r: 22, label: "Entropy", hue: "var(--glow-pink)" },
  { x: 20, y: 40, r: 17, label: "Microstates", hue: "var(--glow-cyan)" },
  { x: 50, y: 52, r: 19, label: "Thermodynamics", hue: "var(--glow-violet)" },
  { x: 80, y: 40, r: 16, label: "Probability", hue: "var(--glow-cyan)" },
  { x: 33, y: 70, r: 15, label: "Statistical Mechanics", hue: "var(--glow-blue)" },
  { x: 67, y: 70, r: 15, label: "Information Theory", hue: "var(--glow-pink)" },
  { x: 50, y: 86, r: 13, label: "Uncertainty", hue: "var(--glow-blue)" },
];
const EDGES = [
  [0, 1], [0, 2], [0, 3], [2, 4], [2, 5], [5, 6],
];

function MiniGraph() {
  return (
    <div className="relative mx-auto h-72 max-w-2xl overflow-hidden rounded-3xl glass-strong p-4">
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <svg viewBox="0 0 100 100" className="relative h-full w-full">
        <defs>
          <linearGradient id="edge-g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--glow-pink) / 0.5)" />
            <stop offset="100%" stopColor="hsl(var(--glow-cyan) / 0.5)" />
          </linearGradient>
        </defs>
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x} y1={NODES[a].y}
            x2={NODES[b].x} y2={NODES[b].y}
            stroke="url(#edge-g)"
            strokeWidth="0.35"
          />
        ))}
        {NODES.map((n, i) => (
          <g key={n.label}>
            <circle cx={n.x} cy={n.y} r={n.r} fill="hsl(var(--card))" stroke={n.hue} strokeWidth="0.4" opacity="0.95" />
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.hue} opacity="0.08" />
            <circle cx={n.x} cy={n.y} r="1.2" fill={n.hue} className="animate-pulse" />
            <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle" fontSize="2.6" fill="hsl(var(--foreground) / 0.9)" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      <style jsx>{`
        text { font-weight: 500; letter-spacing: 0.02em; }
      `}</style>
    </div>
  );
}

function Tier({ name, price, features, featured = false, cta }: { name: string; price: string; features: string[]; featured?: boolean; cta?: string }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl p-6 transition-all duration-300",
        featured
          ? "glass-strong glow-border border border-(--primary)/40 shadow-[0_0_60px_hsl(var(--glow-violet)/0.15)]"
          : "glass glass-hover"
      )}
    >
      {featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-(--glow-violet) to-(--glow-blue) px-3 py-1 text-[10px] font-semibold text-white">
          MOST POPULAR
        </span>
      )}
      <h3 className="font-display text-lg font-semibold text-(--foreground)">{name}</h3>
      <p className="mt-2 font-display text-3xl font-bold text-(--foreground)">
        {price}
        <span className="text-sm font-normal text-(--muted-foreground)">/mo</span>
      </p>
      <ul className="mt-5 flex-1 space-y-2.5 text-sm text-(--muted-foreground)">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-0.5 text-(--primary)">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <Link href="/signup" className="mt-6">
        <NexusButton variant={featured ? "default" : "outline"} className="w-full">
          {cta ?? `Choose ${name}`}
        </NexusButton>
      </Link>
    </div>
  );
}