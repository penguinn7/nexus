"use client";

import { SectionShell, Reveal, SectionTag } from "./primitives";

function PrismScene() {
  return (
    <svg viewBox="0 0 520 320" className="mx-auto w-full max-w-md" aria-hidden>
      <defs>
        <linearGradient id="pf-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e7e9f2" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="pf-split1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f7dff" />
          <stop offset="100%" stopColor="#b7fa3c" />
        </linearGradient>
        <linearGradient id="pf-split2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#f0b90b" />
        </linearGradient>
      </defs>

      {/* incoming beam */}
      <line x1="40" y1="120" x2="225" y2="160" stroke="url(#pf-beam)" strokeWidth="2" />

      {/* prism */}
      <polygon points="250,130 310,250 190,250" fill="rgba(167,139,250,0.08)" stroke="#a78bfa" strokeWidth="1.5" />

      {/* split beams */}
      <line x1="250" y1="160" x2="130" y2="285" stroke="url(#pf-split1)" strokeWidth="2" opacity="0.85" />
      <line x1="250" y1="160" x2="390" y2="285" stroke="url(#pf-split2)" strokeWidth="2" opacity="0.85" />

      {/* ideas go in at top */}
      <text x="150" y="105" textAnchor="middle" fill="#c9cede" fontSize="11" letterSpacing="3" fontFamily="var(--font-jetbrains)">
        "CAN I BUILD THIS?"
      </text>

      <circle cx="130" cy="285" r="3" fill="#4f7dff" />
      <text x="90" y="305" textAnchor="middle" fill="#8b91a6" fontSize="10" letterSpacing="2" fontFamily="var(--font-jetbrains)">
        #wanted_to_be_a_dev
      </text>
      <circle cx="390" cy="285" r="3" fill="#a78bfa" />
      <text x="432" y="305" textAnchor="middle" fill="#8b91a6" fontSize="10" letterSpacing="2" fontFamily="var(--font-jetbrains)">
        #"the_picture_maker"
      </text>
    </svg>
  );
}

export function Collaboration() {
  return (
    <SectionShell id="cooperation" tag="07 · shared bandwidth" className="bg-pf-panel/30">
      <div className="grid items-center gap-12 lg:grid-cols-[6fr,5fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <PrismScene />
        </div>

        <div className="order-1 lg:order-2">
          <SectionTag className="mb-6">collaboration · the prism</SectionTag>
          <Reveal>
            <h2 className="font-display text-3xl font-bold leading-tight text-pf-text md:text-4xl">
              I've worked on both sides <br />
              <span className="text-pf-violet">of the same light.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-pf-dim">
              <p>
                Before I could build, I was doing <span className="text-pf-text">tech PR and written content for
                startups</span> — the side that packages ideas for humans. Then I learned to build, and the same
                ideas took physical form.
              </p>
              <p>
                Together they make an unusual table partner: <span className="text-pf-text">someone who has presented
                the before</span>, and is now learning to build a future after graduation — <em>not just describe it</em>.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "tech-communications",
                "written storytelling",
                "front-end building",
                "product thinking",
              ].map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-pf-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-pf-dim"
                >
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}