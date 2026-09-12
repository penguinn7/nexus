'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { id: 'intro', label: 'Intro' },
  { id: 'object', label: 'Object' },
  { id: 'world', label: 'World' },
  { id: 'cut', label: 'Cut' },
  { id: 'sour', label: 'Sour' },
  { id: 'still-life', label: 'Still Life' },
  { id: 'finale', label: 'Finale' },
];

export function Navigation() {
  const [activeId, setActiveId] = useState('intro');
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      SECTIONS.forEach((s) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveId(s.id),
          onEnterBack: () => setActiveId(s.id),
        });
      });
    }, navRef.current as HTMLElement);
    return () => ctx.revert();
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50 flex items-center gap-0.5 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-xl border border-charcoal-100/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
      aria-label="Section navigation"
    >
      {SECTIONS.map((s) => {
        const active = activeId === s.id;
        return (
          <button
            key={s.id}
            onClick={() => {
              document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider transition-all duration-300 ${
              active
                ? 'bg-charcoal-900 text-cream-50 shadow-sm'
                : 'text-charcoal-400 hover:text-charcoal-700 hover:bg-charcoal-50'
            }`}
            aria-label={`Go to ${s.label}`}
          >
            {s.label}
          </button>
        );
      })}
    </nav>
  );
}
