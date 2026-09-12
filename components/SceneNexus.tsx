'use client';

import { ArrowUpRight } from 'lucide-react';

export function SceneNexus() {
  return (
    <section
      id="nexus-project"
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-28"
      style={{ background: '#1c1917' }}
      aria-label="Featured project — NEXUS"
    >
      {/* NEXUS-flavored ambient field (violet glow + fine grid) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(167,139,250,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.05) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 60%)' }}
      />

      <div className="relative mx-auto w-full max-w-4xl text-center">
        <p className="animate-fade-up font-mono text-[10px] uppercase tracking-[0.35em] text-cream-400/60">
          featured project · built by me · used daily
        </p>

        <h2 className="animate-fade-up mt-6 font-display text-5xl font-extrabold uppercase tracking-tight text-cream-50 md:text-7xl" style={{ animationDelay: '0.1s' }}>
          NEXUS
        </h2>

        <p className="animate-fade-up mt-3 font-mono text-[11px] uppercase tracking-[0.3em] text-violet-300/70" style={{ animationDelay: '0.18s' }}>
          AI second brain — spaces · sources · notes · graph
        </p>

        <p className="animate-fade-up mx-auto mt-6 max-w-xl text-sm leading-relaxed text-cream-200/70 md:text-base" style={{ animationDelay: '0.26s' }}>
          The note system that finally grew up to meet my messy brain. I feed it ideas,
          pages, and half-thoughts — it keeps them organized, connects them into a graph,
          and answers me back with context. This is the app I reach for every day
          &mdash; and it lives in this very deployment.
        </p>

        <div className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: '0.34s' }}>
          <a
            href="/workspace"
            className="group inline-flex items-center gap-2 rounded-full border border-violet-300/40 bg-violet-400/10 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-violet-200 transition-all hover:border-violet-300/70 hover:bg-violet-400/20"
          >
            open nexus <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a
            href="/portfolio#projects"
            className="inline-flex items-center gap-2 rounded-full border border-cream-500/25 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-cream-300/60 transition-colors hover:border-cream-400/40 hover:text-cream-200"
          >
            see it in my portfolio
          </a>
        </div>

        <p className="animate-fade-up mt-12 font-mono text-[9px] uppercase tracking-[0.25em] text-cream-500/30" style={{ animationDelay: '0.42s' }}>
          next.js · typescript · supabase · gemini
        </p>
      </div>
    </section>
  );
}