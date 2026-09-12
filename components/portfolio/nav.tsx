"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "HOW I THINK", href: "#learning" },
  { label: "ACADEMICS", href: "#academics" },
  { label: "PROJECTS", href: "#projects" },
  { label: "AUTOPSIES", href: "#autopsies" },
  { label: "AI + ME", href: "#aime" },
  { label: "COOPERATION", href: "#cooperation" },
  { label: "GITHUB", href: "#github" },
];

export function PortfolioNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "mx-auto mt-3 flex h-12 items-center justify-between gap-3 rounded-none border-x-0 px-4 transition-all duration-300 md:rounded-lg md:border md:px-5 md:backdrop-blur-xl",
          scrolled
            ? "md:max-w-4xl md:border-pf-line md:bg-pf-ink/80"
            : "border-transparent bg-transparent md:max-w-5xl"
        )}
      >
        <a href="#top" className="flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-pf-text">
            {site.spaceName}
          </span>
          <span className="hidden h-1.5 w-1.5 rounded-full bg-pf-acid pf-glow-pulse sm:block" aria-hidden />
        </a>

        <nav className="hidden items-center gap-5 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-[10px] uppercase tracking-[0.24em] text-pf-dim transition-colors hover:text-pf-acid"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/portfolio/sop"
            className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-pf-dim transition-colors hover:text-pf-text sm:block"
          >
            SOP
          </a>
          <a
            href="/portfolio/cv"
            className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-pf-dim transition-colors hover:text-pf-text sm:block"
          >
            CV
          </a>
          <a
            href={site.github.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1 rounded-full border border-pf-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-pf-acid transition-all hover:border-pf-acid/50 md:flex"
          >
            GitHub <ArrowUpRight size={11} />
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-pf-line text-pf-text lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* progress */}
      <motion.div
        className="h-[2px] origin-left bg-gradient-to-r from-pf-blue via-pf-violet to-pf-acid"
        style={{ scaleX: progress }}
        aria-hidden
      />

      {/* mobile menu */}
      {open && (
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-3 mt-2 flex flex-col gap-1 rounded-lg border border-pf-line bg-pf-ink/95 p-3 backdrop-blur-xl lg:hidden"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.24em] text-pf-dim transition-colors hover:bg-pf-panel hover:text-pf-text"
            >
              {l.label}
            </a>
          ))}
          <a
            href={site.github.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.24em] text-pf-acid"
          >
            Github ↗
          </a>
        </motion.nav>
      )}
    </header>
  );
}