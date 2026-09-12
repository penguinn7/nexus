'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lemon, LemonSlice, LemonLeaf } from './Lemon';
import { ScrollText } from './AnimatedText';

gsap.registerPlugin(ScrollTrigger);

interface WorldEl {
  id: string;
  type: 'lemon' | 'slice' | 'leaf';
  x: number;
  y: number;
  scale: number;
  rotation: number;
  z: number;
  flipped?: boolean;
}

const ELEMENTS: WorldEl[] = [
  { id: 'w-l1', type: 'lemon', x: 12, y: 62, scale: 0.7, rotation: -8, z: 20 },
  { id: 'w-l2', type: 'lemon', x: 82, y: 28, scale: 0.45, rotation: 12, z: 15 },
  { id: 'w-l3', type: 'lemon', x: 45, y: 12, scale: 0.35, rotation: -20, z: 10 },
  { id: 'w-s1', type: 'slice', x: 22, y: 38, scale: 0.55, rotation: 5, z: 18 },
  { id: 'w-s2', type: 'slice', x: 72, y: 52, scale: 0.4, rotation: -25, z: 12, flipped: true },
  { id: 'w-leaf1', type: 'leaf', x: 6, y: 42, scale: 0.6, rotation: -25, z: 22, flipped: true },
  { id: 'w-leaf2', type: 'leaf', x: 88, y: 38, scale: 0.5, rotation: 15, z: 19 },
  { id: 'w-leaf3', type: 'leaf', x: 35, y: 8, scale: 0.4, rotation: 45, z: 14, flipped: true },
  { id: 'w-leaf4', type: 'leaf', x: 65, y: 78, scale: 0.7, rotation: -10, z: 16 },
];

export function SceneWorld() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ELEMENTS.forEach((el) => {
        const node = elementsRef.current.get(el.id);
        if (!node) return;

        gsap.fromTo(node,
          {
            scale: el.scale * 0.15,
            x: (el.x - 50) * 10,
            y: (el.y - 50) * 10,
            rotation: el.rotation + (Math.random() - 0.5) * 50,
            opacity: 0,
          },
          {
            scale: el.scale,
            x: 0, y: 0,
            rotation: el.rotation,
            opacity: 0.9,
            ease: 'expo.out',
            duration: 1.5,
            delay: Math.random() * 0.4,
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'top 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      const parallaxTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      ELEMENTS.forEach((el) => {
        const node = elementsRef.current.get(el.id);
        if (!node) return;
        const depth = el.z / 20;
        parallaxTl.to(node, {
          x: (Math.random() - 0.5) * 80 * depth,
          y: (Math.random() - 0.5) * 120 * depth,
          rotation: el.rotation + (Math.random() - 0.5) * 20,
          ease: 'none',
        }, 0);
      });

      const textEls = section.querySelectorAll<HTMLElement>('[data-world-text]');
      textEls.forEach((el) => {
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.2, ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'top 45%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const dims: Record<string, { w: string; h: string }> = {
    lemon: { w: '200px', h: '200px' },
    slice: { w: '160px', h: '120px' },
    leaf: { w: '100px', h: '160px' },
  };

  return (
    <section
      ref={sectionRef}
      id="world"
      className="relative min-h-[180vh] overflow-hidden"
      aria-label="The World"
    >
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 25% 30%, rgba(132,204,22,0.08) 0%, transparent 50%), radial-gradient(ellipse at 75% 70%, rgba(250,204,21,0.1) 0%, transparent 50%)',
      }} />

      {ELEMENTS.map((el) => {
        const Comp = el.type === 'lemon' ? Lemon : el.type === 'slice' ? LemonSlice : LemonLeaf;
        const d = dims[el.type];
        return (
          <div
            key={el.id}
            ref={(n) => { if (n) elementsRef.current.set(el.id, n); }}
            className="absolute pointer-events-none"
            style={{
              left: `${el.x}%`, top: `${el.y}%`,
              transform: 'translate(-50%,-50%)',
              width: d.w, height: d.h,
              zIndex: el.z,
            }}
          >
            <Comp className="w-full h-full" flipped={el.type === 'leaf' ? el.flipped : undefined} />
          </div>
        );
      })}

      <div data-world-text className="absolute z-30 left-[6%] top-[10%] max-w-[300px]">
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-charcoal-900 leading-[1.02]">
          A whole <span className="font-medium">ecosystem</span>
        </h2>
        <p className="mt-5 text-sm md:text-base text-charcoal-500 leading-relaxed max-w-xs">
          Each lemon carries its grove. The soil, the sun, the wind — all written in the rind.
        </p>
      </div>

      <div data-world-text className="absolute z-30 right-[6%] top-[28%] max-w-[280px] text-right">
        <h3 className="font-display text-3xl md:text-4xl font-light text-charcoal-900 leading-[1.1]">
          Leaves breathe <span className="font-medium">chlorophyll</span>
        </h3>
      </div>

      <div data-world-text className="absolute z-30 right-[6%] bottom-[22%] max-w-[260px] text-right">
        <h3 className="font-display text-2xl md:text-3xl font-light text-charcoal-900 leading-[1.2]">
          Roots drink <span className="font-medium">minerals</span>
        </h3>
        <p className="mt-3 text-xs text-charcoal-400 leading-relaxed text-right">
          Calcium, magnesium, potassium — the architecture of flavor.
        </p>
      </div>

      <div data-world-text className="absolute z-30 bottom-[8%] left-1/2 -translate-x-1/2 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-charcoal-300 flex flex-wrap justify-center gap-x-5 gap-y-1">
          <span>Citrus limon</span>
          <span>Rutaceae</span>
          <span>Hesperidium</span>
          <span>Origin: Northeast India</span>
        </p>
      </div>

      <ScrollText
        speed={15}
        direction="horizontal"
        className="absolute bottom-0 left-0 right-0 z-20 py-4 border-t border-charcoal-100/50"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-charcoal-200 px-4">
          THE GROVE BREATHES &middot; THE FRUIT REMEMBERS &middot; THE SEED DREAMS
        </span>
      </ScrollText>
    </section>
  );
}
