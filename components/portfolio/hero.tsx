"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";
import { ChevronDown } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

function IdeaFlow() {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto mt-12 w-full max-w-3xl" aria-hidden>
      <svg viewBox="0 0 640 120" className="w-full">
        {/* track */}
        <line x1="48" y1="60" x2="592" y2="60" stroke="rgba(183,250,60,0.14)" strokeWidth="1" strokeDasharray="3 6" />

        {/* start node */}
        <circle cx="48" cy="60" r="5" fill="#b7fa3c" />
        <text x="48" y="86" textAnchor="middle" fill="#8b91a6" fontSize="11" letterSpacing="3" fontFamily="var(--font-jetbrains)">
          IDEA
        </text>

        {/* end node */}
        <rect x="556" y="48" width="36" height="24" rx="3" fill="none" stroke="#a78bfa" strokeWidth="1.2" />
        <text x="574" y="86" textAnchor="middle" fill="#a78bfa" fontSize="11" letterSpacing="3" fontFamily="var(--font-jetbrains)">
          SYSTEM
        </text>

        {/* traveling packages */}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <motion.circle
              cx={0}
              cy={0}
              r={4}
              fill={["#4f7dff", "#b7fa3c", "#a78bfa"][i]}
              initial={reduce ? { opacity: 0 } : { cx: 60 }}
              animate={reduce ? { opacity: 0 } : { cx: 540 }}
              transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 0.55, delay: i * 1.1, ease: "easeInOut" }}
              style={{ filter: "blur(0.5px)" }}
            />
            <motion.circle
              cx={0}
              cy={0}
              r={9}
              fill={["#4f7dff", "#b7fa3c", "#a78bfa"][i]}
              opacity={0.12}
              initial={reduce ? { opacity: 0 } : { cx: 60 }}
              animate={reduce ? { opacity: 0 } : { cx: 540 }}
              transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 0.55, delay: i * 1.1, ease: "easeInOut" }}
            />
          </g>
        ))}

        {/* mid label */}
        <text x="320" y="40" textAnchor="middle" fill="#5a6178" fontSize="10" letterSpacing="4" fontFamily="var(--font-jetbrains)">
          EXPERIMENT · BUILD · BREAK · UNDERSTAND · REBUILD
        </text>
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen flex-col justify-center overflow-hidden px-5 pt-28 pb-16 md:px-10">
      {/* ambient field */}
      <div className="pointer-events-none absolute inset-0 pf-grid opacity-70" aria-hidden />
      <div className="pointer-events-none absolute inset-0 pf-scanlines opacity-40" aria-hidden />

      {/* glows */}
      <div className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-pf-blue/14 blur-[120px]" aria-hidden />
      <div className="pointer-events-none absolute -right-24 bottom-16 h-96 w-96 rounded-full bg-pf-violet/14 blur-[130px]" aria-hidden />
      <div className="pointer-events-none absolute right-1/3 top-1/3 h-64 w-64 rounded-full bg-pf-acid/8 blur-[100px]" aria-hidden />

      {/* floating sys chips */}
      <div className="pointer-events-none absolute left-6 top-1/4 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-pf-faint md:block">
        <div className="pf-float">idea_engine.exe</div>
      </div>
      <div className="pointer-events-none absolute right-10 top-1/3 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-pf-faint md:block">
        <div className="pf-float" style={{ animationDelay: "1.4s" }}>build_mode.exe</div>
      </div>

      <div className="relative mx-auto w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-pf-dim"
        >
          <span className="h-px w-10 bg-pf-line" />
          a digital exhibit of a curious student
        </motion.div>

        <h1 className="mt-6 font-display text-[13vw] font-extrabold uppercase leading-[0.95] tracking-tight text-pf-text md:text-8xl lg:text-[7.2rem]">
          {site.name.split("").map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block pf-chrome-text"
              initial={{ opacity: 0, y: "0.6em", rotateX: 60 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.25 + i * 0.045, duration: 0.7, ease }}
              style={{ transformPerspective: 600 }}
            >
              {ch}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7, ease }}
          className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.32em] text-pf-dim"
        >
          <span className="text-pf-acid">{site.tagline}</span>
          <span className="h-1 w-1 rounded-full bg-pf-faint" />
          <span>{site.role}</span>
          <span className="h-1 w-1 rounded-full bg-pf-faint" />
          <span>{site.status}</span>
        </motion.p>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease }}
          className="mt-10 max-w-2xl border-l-2 border-pf-acid/60 pl-5"
        >
          <span className="block text-xl leading-snug text-pf-text md:text-3xl md:leading-snug">
            “{site.statement}”
          </span>
          <span className="mt-2 block text-sm leading-relaxed text-pf-dim">{site.statementSub}</span>
        </motion.blockquote>

        <IdeaFlow />
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 text-pf-faint">
        <motion.div
          animate={useReducedMotion() ? {} : { y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={16} />
        </motion.div>
        <span className="font-mono text-[9px] uppercase tracking-[0.3em]">scroll · explore</span>
      </div>
    </section>
  );
}