"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const NODES = ["IDEA", "EXPERIMENT", "BUILD", "FAIL", "UNDERSTAND", "REBUILD", "SYSTEM"];

function NodeBadge({
  state,
  index,
  node,
  isLast,
}: {
  state: MotionValue<{ opacity: number; scale: number }[]>;
  index: number;
  node: string;
  isLast: boolean;
}) {
  const opacity = useTransform(state, (arr) => arr[index].opacity);
  const scale = useTransform(state, (arr) => arr[index].scale);
  return (
    <motion.div
      style={{ opacity, scale }}
      className={
        "flex h-14 w-14 items-center justify-center rounded-lg border font-mono text-[9px] tracking-[0.08em] md:h-20 md:w-20 md:text-[11px] md:tracking-[0.12em] " +
        (isLast
          ? "border-pf-violet bg-pf-violet/15 text-pf-violet pf-glow"
          : "border-pf-line bg-pf-panel/80 text-pf-dim backdrop-blur-sm")
      }
    >
      {node === "FAIL" ? <span className="text-pf-amber">FAIL</span> : node}
    </motion.div>
  );
}

export function TheQuestion() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const chainOpacity = useTransform(scrollYProgress, [0.02, 0.18], [0, 1]);
  const qOpacity = useTransform(scrollYProgress, [0.02, 0.12], [1, 0]);
  const answerOpacity = useTransform(scrollYProgress, [0.55, 0.72], [0, 1]);
  const answerY = useTransform(scrollYProgress, [0.55, 0.72], [40, 0]);
  const finalOpacity = useTransform(scrollYProgress, [0.82, 0.95], [0, 1]);

  const stageState = useTransform(scrollYProgress, (p) =>
    NODES.map((_, i) => {
      const start = 0.16 + i * 0.055;
      const prog = Math.min(1, Math.max(0, (p - start) / 0.045));
      return { opacity: 0.14 + 0.86 * prog, scale: 0.9 + 0.1 * prog };
    })
  );

  return (
    <section ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 pf-grid opacity-40" aria-hidden />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pf-acid/6 blur-[140px]" aria-hidden />

        {/* the question */}
        <motion.div style={{ opacity: qOpacity }} className="absolute inset-0 flex items-center justify-center px-6">
          <h2 className="max-w-4xl text-center font-display text-4xl font-extrabold leading-tight tracking-tight text-pf-text md:text-6xl">
            What happens when
            <br />
            <span className="pf-gradient-text">an idea leaves</span>
            <br />
            your head?
          </h2>
          <span className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.35em] text-pf-faint">
            ▸ keep scrolling — it starts moving
          </span>
        </motion.div>

        {/* the chain */}
        <motion.div style={{ opacity: chainOpacity }} className="absolute inset-0 flex items-center justify-center px-4">
          <div className="flex w-full max-w-5xl flex-wrap items-center justify-center gap-y-5">
            {NODES.map((node, i) => (
              <div key={node} className="flex items-center">
                <NodeBadge state={stageState} index={i} node={node} isLast={i === NODES.length - 1} />
                {i < NODES.length - 1 && <span className="px-1.5 text-pf-faint md:px-2">→</span>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* answer */}
        <motion.div style={{ opacity: answerOpacity, y: answerY }} className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.35em] text-pf-acid">
            <span className="h-px w-8 bg-pf-acid/50" /> the honest answer <span className="h-px w-8 bg-pf-acid/50" />
          </div>
          <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight text-pf-text md:text-5xl">
            I don't know the complete answer yet.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-pf-dim md:text-lg">
            But I know the first seven steps by heart — and I've lived every one of them.
          </p>
        </motion.div>

        {/* final */}
        <motion.div style={{ opacity: finalOpacity }} className="absolute inset-0 flex items-center justify-center px-6">
          <p className="max-w-2xl text-center font-display text-2xl font-bold leading-snug text-pf-text md:text-4xl">
            That sequence — from
            <span className="text-pf-acid"> IDEA </span>
            to
            <span className="text-pf-violet"> SYSTEM </span>
            — is exactly what I want to study. For the next four years. With you.
          </p>
        </motion.div>
      </div>
    </section>
  );
}