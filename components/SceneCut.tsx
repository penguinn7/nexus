'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lemon, LemonSlice } from './Lemon';

gsap.registerPlugin(ScrollTrigger);

export function SceneCut() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lemonRef = useRef<HTMLDivElement>(null);
  const knifeRef = useRef<HTMLDivElement>(null);
  const slice1Ref = useRef<HTMLDivElement>(null);
  const slice2Ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const textLeftRef = useRef<HTMLDivElement>(null);
  const textRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
          id: 'cut',
        },
      });

      tl.fromTo(lemonRef.current,
        { scale: 1.2, y: 200, opacity: 1 },
        { scale: 2, y: -80, opacity: 1, ease: 'none' },
        0
      )
      .fromTo(knifeRef.current,
        { y: -350, rotation: -20, opacity: 0 },
        { y: -20, rotation: -5, opacity: 1, ease: 'none' },
        0.05
      )
      .to(knifeRef.current,
        { y: 200, rotation: 5, opacity: 0, ease: 'power2.in' },
        0.22
      )
      .to(lemonRef.current,
        { scale: 0, opacity: 0, ease: 'power2.in' },
        0.22
      )
      .fromTo(slice1Ref.current,
        { scale: 0, x: 0, rotation: 0, opacity: 0 },
        { scale: 1, x: -100, rotation: -10, opacity: 1, ease: 'back.out(1.4)' },
        0.25
      )
      .fromTo(slice2Ref.current,
        { scale: 0, x: 0, rotation: 0, opacity: 0 },
        { scale: 1, x: 100, rotation: 10, opacity: 1, ease: 'back.out(1.4)' },
        0.27
      )
      .to([slice1Ref.current, slice2Ref.current],
        { y: -200, scale: 1.2, opacity: 0, rotation: (i) => i === 0 ? -15 : 15, ease: 'none' },
        0.55
      );

      [titleRef, textLeftRef, textRightRef].forEach((ref) => {
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
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cut"
      className="relative min-h-[180vh] flex items-center justify-center overflow-hidden"
      style={{ background: '#0c0a09' }}
      aria-label="The Cut"
    >
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(254,249,195,0.08) 0%, transparent 60%)',
      }} />

      <div ref={knifeRef} className="absolute z-30 pointer-events-none" style={{
        left: '50%', top: '40%',
        transform: 'translate(-50%, 0) rotate(-5deg)',
      }}>
        <div className="w-[3px] h-[280px] rounded-full" style={{
          background: 'linear-gradient(180deg, transparent 0%, #d4d4d4 15%, #a3a3a3 50%, #737373 85%, transparent 100%)',
          boxShadow: '0 0 24px rgba(212,212,212,0.3), 0 0 60px rgba(212,212,212,0.1)',
        }} />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-5 h-8 rounded-b-lg" style={{
          background: 'linear-gradient(180deg, #a3a3a3, #525252)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        }} />
      </div>

      <div ref={lemonRef} className="absolute z-20" style={{
        left: '50%', top: '48%',
        transform: 'translate(-50%,-50%)',
        width: 'min(350px, 65vw)', height: 'min(350px, 65vw)',
      }}>
        <Lemon className="w-full h-full" />
      </div>

      <div ref={slice1Ref} className="absolute z-20" style={{
        left: '50%', top: '48%',
        transform: 'translate(-50%,-50%)',
        width: 'min(300px, 55vw)', height: 'min(220px, 40vw)',
      }}>
        <LemonSlice className="w-full h-full" />
      </div>

      <div ref={slice2Ref} className="absolute z-20" style={{
        left: '50%', top: '48%',
        transform: 'translate(-50%,-50%)',
        width: 'min(300px, 55vw)', height: 'min(220px, 40vw)',
      }}>
        <LemonSlice className="w-full h-full" flipped />
      </div>

      <div ref={titleRef} className="absolute z-40 text-center pointer-events-none" style={{
        left: '50%', top: '8%', transform: 'translateX(-50%)', maxWidth: '500px',
      }}>
        <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-cream-50 leading-[0.93] tracking-tight">
          The blade<br /><span className="font-medium">releases</span>
        </h2>
        <p className="mt-5 text-base md:text-lg text-cream-300/70 leading-relaxed">
          What was whole becomes geometry.<br />What was hidden becomes light.
        </p>
      </div>

      <div ref={textLeftRef} className="absolute z-40 pointer-events-none left-[6%] bottom-[18%] max-w-[280px]">
        <p className="font-display text-3xl md:text-4xl font-light text-cream-100 leading-[1.1]">
          Ten segments.<br />
          <span className="font-medium">Ten chambers</span><br />
          of liquid gold.
        </p>
      </div>

      <div ref={textRightRef} className="absolute z-40 pointer-events-none right-[6%] bottom-[18%] max-w-[280px] text-right">
        <p className="font-display text-3xl md:text-4xl font-light text-cream-100 leading-[1.1]">
          Each vesicle<br />
          a <span className="font-medium">universe</span><br />
          of pressure.
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-500/40">
          Cross-section: exocarp &middot; mesocarp &middot; endocarp &middot; juice vesicles
        </p>
      </div>
    </section>
  );
}
