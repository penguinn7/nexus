'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lemon, LemonLeaf } from './Lemon';
import { RevealText } from './AnimatedText';

gsap.registerPlugin(ScrollTrigger);

export function SceneObject() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lemonRef = useRef<HTMLDivElement>(null);
  const leaf1Ref = useRef<HTMLDivElement>(null);
  const leaf2Ref = useRef<HTMLDivElement>(null);
  const textLeftRef = useRef<HTMLDivElement>(null);
  const textRightRef = useRef<HTMLDivElement>(null);
  const textBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          id: 'object',
        },
      });

      tl.fromTo(lemonRef.current,
        { scale: 0.5, y: 300, opacity: 0 },
        { scale: 1.8, y: -50, opacity: 1, ease: 'none' },
        0
      )
      .fromTo(leaf1Ref.current,
        { x: -400, y: 200, rotation: -40, opacity: 0, scale: 0.5 },
        { x: -120, y: -60, rotation: -15, opacity: 0.9, scale: 1, ease: 'none' },
        0.1
      )
      .fromTo(leaf2Ref.current,
        { x: 400, y: 250, rotation: 30, opacity: 0, scale: 0.5 },
        { x: 160, y: 40, rotation: 20, opacity: 0.85, scale: 1, ease: 'none' },
        0.15
      )
      .to(lemonRef.current,
        { scale: 3, y: -300, opacity: 0, ease: 'none' },
        0.65
      )
      .to([leaf1Ref.current, leaf2Ref.current],
        { opacity: 0, ease: 'none' },
        0.7
      );

      [textLeftRef, textRightRef, textBottomRef].forEach((ref) => {
        const el = ref.current;
        if (!el) return;
        gsap.fromTo(el,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'top 40%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="object"
      className="relative min-h-[160vh] flex items-center justify-center overflow-hidden"
      aria-label="The Object"
    >
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 45%, rgba(254,249,195,0.35) 0%, transparent 70%)',
      }} />

      <div ref={lemonRef} className="absolute z-10" style={{
        left: '50%', top: '45%', transform: 'translate(-50%,-50%)',
        width: 'min(400px, 70vw)', height: 'min(400px, 70vw)',
      }}>
        <Lemon className="w-full h-full" />
      </div>

      <div ref={leaf1Ref} className="absolute z-5" style={{
        left: '12%', top: '55%', width: '120px', height: '200px',
      }}>
        <LemonLeaf className="w-full h-full" flipped />
      </div>

      <div ref={leaf2Ref} className="absolute z-5" style={{
        right: '10%', top: '50%', width: '110px', height: '190px',
      }}>
        <LemonLeaf className="w-full h-full" />
      </div>

      <div ref={textLeftRef} className="absolute z-30 left-[6%] bottom-[15%] max-w-[280px]">
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-charcoal-900 leading-[1.05]">
          The weight of <span className="font-medium">citrus</span>
        </h2>
        <p className="mt-5 text-sm md:text-base text-charcoal-500 leading-relaxed">
          Held against the light, each cell<br />a small cathedral of juice.
        </p>
      </div>

      <div ref={textRightRef} className="absolute z-30 right-[6%] top-[18%] max-w-[260px] text-right">
        <h3 className="font-display text-3xl md:text-4xl font-light text-charcoal-900 leading-[1.1]">
          Surface tension<br />holds <span className="font-medium">memory</span>
        </h3>
      </div>

      <div ref={textBottomRef} className="absolute z-30 bottom-[5%] left-1/2 -translate-x-1/2 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-charcoal-300">
          Diameter 58-70mm &middot; Weight 50-80g &middot; pH 2.0-2.6
        </p>
      </div>
    </section>
  );
}
