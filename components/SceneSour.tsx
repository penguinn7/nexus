'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lemon } from './Lemon';
import { ScrollText } from './AnimatedText';

gsap.registerPlugin(ScrollTrigger);

export function SceneSour() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lemonRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const sourWords = [
    'ACUTE', 'BRIGHT', 'SHARP', 'VIVID',
    'TANGY', 'ZESTY', 'PIQUANT', 'TART',
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
          id: 'sour',
        },
      });

      tl.fromTo(lemonRef.current,
        { scale: 0.7, y: 250, rotation: 0, opacity: 0 },
        { scale: 1.3, y: 0, rotation: 3, opacity: 1, ease: 'none' },
        0
      )
      .to(lemonRef.current,
        { scale: 1.8, y: -150, rotation: -2, opacity: 0, ease: 'none' },
        0.6
      );

      [titleRef, subtitleRef].forEach((ref) => {
        const el = ref.current;
        if (!el) return;
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

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll<HTMLElement>('.sour-card');
        gsap.fromTo(cards,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.06,
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
              end: 'top 40%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sour"
      className="relative min-h-[150vh] flex items-center justify-center overflow-hidden"
      style={{ background: '#fefce8' }}
      aria-label="Sour"
    >
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(234,179,8,0.1) 0%, transparent 60%)',
      }} />

      <ScrollText
        speed={25}
        direction="horizontal"
        className="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-0 pointer-events-none"
        style={{ opacity: 0.06 }}
        pauseOnHover={false}
      >
        <span className="font-display text-[8vw] font-light text-charcoal-900 tracking-tight">
          SOUR &middot; SOUR &middot; SOUR &middot; SOUR
        </span>
      </ScrollText>

      <div ref={lemonRef} className="absolute z-10" style={{
        left: '50%', top: '42%',
        transform: 'translate(-50%,-50%)',
        width: 'min(320px, 60vw)', height: 'min(320px, 60vw)',
      }}>
        <Lemon className="w-full h-full" />
      </div>

      <div ref={titleRef} className="absolute z-30 text-center pointer-events-none" style={{
        left: '50%', top: '10%', transform: 'translateX(-50%)', maxWidth: '600px',
      }}>
        <h2 className="font-display text-6xl md:text-8xl lg:text-9xl font-light text-charcoal-900 leading-[0.9] tracking-tight">
          SOUR
        </h2>
        <p className="mt-4 text-xl md:text-2xl font-light text-charcoal-600 tracking-wide">
          is a <span className="font-medium text-charcoal-900">signal</span>, not a flaw.
        </p>
      </div>

      <div ref={subtitleRef} className="absolute z-30 text-center pointer-events-none" style={{
        left: '50%', top: '28%', transform: 'translateX(-50%)', maxWidth: '500px',
      }}>
        <p className="text-base md:text-lg text-charcoal-500 leading-relaxed">
          A language the tongue reads.<br />The tongue detects H<sup>+</sup> ions at 10<sup>-3</sup> M.
        </p>
      </div>

      <div ref={gridRef} className="absolute z-30 bottom-[16%] left-1/2 -translate-x-1/2 pointer-events-none" style={{ maxWidth: '560px', width: '90%' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {sourWords.map((word) => (
            <div
              key={word}
              className="sour-card px-3 py-2.5 rounded-lg border border-lemon-200/80 bg-white/70 backdrop-blur-sm text-center"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-charcoal-700">
                {word}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal-300">
          pH 2.0-2.6 &middot; Citric acid 5-6% &middot; Titratable acidity 4.5-5.5%
        </p>
      </div>
    </section>
  );
}
