"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionShell, Reveal, SectionTag } from "./primitives";

function BridgeScene() {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 680 260" className="w-full" aria-hidden>
      <defs>
        <linearGradient id="pf-arc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4f7dff" />
          <stop offset="55%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#b7fa3c" />
        </linearGradient>
      </defs>

      {/* ground */}
      <line x1="0" y1="235" x2="680" y2="235" stroke="rgba(139,145,166,0.18)" strokeWidth="1" />

      {/* platform A */}
      <rect x="30" y="175" width="150" height="60" rx="4" fill="rgba(79,125,255,0.06)" stroke="rgba(79,125,255,0.5)" strokeWidth="1" />
      <text x="105" y="216" textAnchor="middle" fill="#c9cede" fontSize="12" letterSpacing="3" fontFamily="var(--font-jetbrains)">
        WHAT I WANT TO BUILD
      </text>

      {/* platform B */}
      <rect x="500" y="175" width="150" height="60" rx="4" fill="rgba(183,250,60,0.06)" stroke="rgba(183,250,60,0.5)" strokeWidth="1" />
      <text x="575" y="216" textAnchor="middle" fill="#c9cede" fontSize="12" letterSpacing="3" fontFamily="var(--font-jetbrains)">
        WHAT I CURRENTLY KNOW
      </text>

      {/* the gap */}
      <path
        d="M 180 205 C 340 30 340 30 500 205"
        fill="none"
        stroke="url(#pf-arc)"
        strokeWidth="2"
        strokeDasharray="3 7"
        strokeLinecap="round"
      />

      {/* traveler */}
      {!reduce && (
        <motion.circle
          r="5"
          fill="#ffffff"
          style={{ offsetPath: "path(M 180 205 C 340 30 340 30 500 205)", filter: "drop-shadow(0 0 6px rgba(183,250,60,0.9))" }}
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.animate attributeName="opacity" values="1" dur="0.001s" />
        </motion.circle>
      )}

      {/* static marker on arc */}
      <circle cx="340" cy="132" r="4" fill="#a78bfa" opacity="0.4" />
      <text x="340" y="120" textAnchor="middle" fill="#a78bfa" fontSize="11" letterSpacing="3" fontFamily="var(--font-jetbrains)">
        AI — THE TEMPORARY BRIDGE
      </text>
    </svg>
  );
}

export function Aime() {
  return (
    <SectionShell id="aime" tag="06 · the tool that found me" tone="acid" className="relative overflow-hidden">
      <div className="pointer-events-none absolute right-0 bottom-0 h-80 w-80 rounded-full bg-pf-blue/10 blur-[120px]" aria-hidden />

      <div className="grid items-center gap-12 lg:grid-cols-[6fr,4fr] lg:gap-16">
        <div>
          <SectionTag tone="acid" className="mb-6">a.i. + me</SectionTag>
          <Reveal>
            <h2 className="font-display text-3xl font-bold leading-tight text-pf-text md:text-4xl">
              AI is my bridge <br />
              <span className="pf-gradient-text-acid">to the far side of the gap.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-pf-dim">
              <p>
                Twelve months ago, the gap between my ideas and my skills was a canyon. I could imagine the system,
                but not the syntax. AI let me <span className="text-pf-text">walk across and meet the build</span>.
              </p>
              <p>
                The gift: I can now iterate faster than my own doubt — shipping, breaking, fixing, understanding.
              </p>
              <p>
                The price: a tool that thinks for me can quietly think <em>for me</em> — flattening the curiosity
                that started this. So I keep a rule.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-6 border-l-2 border-pf-acid/60 pl-4 font-mono text-[12px] uppercase tracking-[0.18em] text-pf-acid">
              rule: never finish a step I haven't understood first.
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="hidden lg:block">
          <div className="rounded-xl border border-pf-line bg-pf-panel/50 p-6 backdrop-blur-sm">
            <BridgeScene />
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-pf-faint">
              the bridge is load-bearing only while I keep walking over it
            </p>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}