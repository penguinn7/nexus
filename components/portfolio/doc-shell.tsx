"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Download, ArrowLeft, ArrowUpRight, FileText } from "lucide-react";

function DocToc({ items, active }: { items: { id: string; label: string }[]; active: string }) {
  return (
    <div className="hidden lg:block">
      <div className="sticky top-28 space-y-1">
        <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-pf-faint">inside this document</div>
        {items.map((it) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            className={
              "block border-l py-1 pl-3 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors " +
              (active === it.id ? "border-pf-acid text-pf-acid" : "border-pf-line text-pf-dim hover:text-pf-text")
            }
          >
            {it.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function DocShell({
  kind,
  title,
  subtitle,
  toc,
  children,
  printCta = true,
}: {
  kind: "statement of purpose" | "curriculum vitae";
  title: string;
  subtitle: string;
  toc: { id: string; label: string }[];
  children: React.ReactNode;
  printCta?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(toc[0]?.id ?? "");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <div ref={ref} className="relative px-5 pb-28 pt-32 md:px-10">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[200px,1fr]">
        <DocToc items={toc} active={active} />

        <article className="doc-type min-w-0">
          {/* header */}
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-pf-faint">
              <span className="h-px w-8 bg-pf-line" /> {kind}
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-pf-text md:text-6xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-pf-dim">{subtitle}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="/portfolio"
                className="flex items-center gap-2 rounded-full border border-pf-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-pf-dim transition-colors hover:border-pf-acid/50 hover:text-pf-acid"
              >
                <ArrowLeft size={11} /> exhibits
              </a>
              {printCta && (
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-2 rounded-full border border-pf-acid/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-pf-acid transition-colors hover:bg-pf-acid/10"
                >
                  <FileText size={11} /> print / save as pdf
                </button>
              )}
              <a
                href="/portfolio/cv"
                className="flex items-center gap-2 rounded-full border border-pf-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-pf-dim transition-colors hover:border-pf-acid/50 hover:text-pf-acid"
              >
                the cv <ArrowUpRight size={11} />
              </a>
            </div>
          </div>

          {children}

          <div className="mt-16 border-t border-pf-line pt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-pf-faint">
            end of {kind} · {title}
          </div>
        </article>
      </div>

      {/* reading progress */}
      <div className="fixed inset-x-0 top-16 z-40 h-[2px]">
        <motion.div
          className="h-full origin-left bg-gradient-to-r from-pf-blue via-pf-violet to-pf-acid"
          style={{ scaleX: progress }}
        />
      </div>
    </div>
  );
}

export function SectionHead({ id, n, label }: { id: string; n: string; label: string }) {
  return (
    <div id={id} className="mb-4 mt-14 flex items-end justify-between gap-4 first:mt-0">
      <span className="flex items-center gap-3">
        <span className="font-display text-2xl font-bold text-pf-faint">{n}</span>
        <h2 className="font-display text-xl font-bold tracking-tight text-pf-text md:text-2xl">{label}</h2>
      </span>
      <span className="h-px flex-1 bg-pf-line" />
    </div>
  );
}