"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";

const BOOT_KEY = "sonakshi_booted";

export function BootSequence() {
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(BOOT_KEY)) return;
    sessionStorage.setItem(BOOT_KEY, "1");
    if (reduce) return;
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setDone(true), 1650);
    return () => clearTimeout(t);
  }, [visible]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {visible && !done && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-pf-ink"
          exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeInOut" } }}
          onClick={() => setDone(true)}
          style={{ cursor: "pointer" }}
          aria-label="System boot sequence — click to skip"
        >
          <div className="pointer-events-none absolute inset-0 pf-grid opacity-60" />
          <div className="pointer-events-none absolute inset-0 pf-scanlines" />

          <div className="relative w-[min(88vw,520px)]">
            <div className="mb-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.35em] text-pf-faint">
              <span>{site.spaceName}</span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-pf-acid pf-glow-pulse" />
                OK
              </span>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="font-mono text-[12px] uppercase tracking-[0.3em] text-pf-blueSoft"
            >
              SYSTEM INITIALIZING…
            </motion.p>

            <div className="mt-5 space-y-2.5 font-mono text-[12px]">
              {site.bootModules.map((m, i) => (
                <motion.div
                  key={m}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.14 }}
                  className="flex items-center justify-between gap-4 text-pf-dim"
                >
                  <span>
                    <span className="text-pf-faint">&gt;</span> {m}
                  </span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1] }}
                    transition={{ delay: 0.2 + i * 0.14 + 0.1 }}
                    className="text-pf-acid"
                  >
                    ✓
                  </motion.span>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 h-px w-full bg-pf-line">
              <motion.div
                className="h-px bg-pf-acid"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.35, ease: "easeInOut" }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-pf-faint">
              <span className="flex items-center gap-1.5">
                loading <i className="pf-blink not-italic text-pf-acid">▋</i>
              </span>
              <button
                type="button"
                onClick={() => setDone(true)}
                className="border border-pf-line px-3 py-1 uppercase tracking-[0.3em] text-pf-dim transition-colors hover:border-pf-acid/60 hover:text-pf-acid"
              >
                skip ›
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}