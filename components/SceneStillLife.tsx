'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lemon, LemonSlice, LemonLeaf } from './Lemon';

gsap.registerPlugin(ScrollTrigger);

export function SceneStillLife() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lemonRef = useRef<HTMLDivElement>(null);
  const slice1Ref = useRef<HTMLDivElement>(null);
  const slice2Ref = useRef<HTMLDivElement>(null);
  const leaf1Ref = useRef<HTMLDivElement>(null);
  const leaf2Ref = useRef<HTMLDivElement>(null);
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
          scrub: 1,
          id: 'still-life',
        },
      });

      tl.fromTo(lemonRef.current,
        { scale: 0.4, y: 200, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, ease: 'none' },
        0
      )
      .fromTo(slice1Ref.current,
        { scale: 0.2, x: -100, y: 100, rotation: 20, opacity: 0 },
        { scale: 0.7, x: -80, y: -20, rotation: 12, opacity: 1, ease: 'none' },
        0.1
      )
      .fromTo(slice2Ref.current,
        { scale: 0.2, x: 100, y: 100, rotation: -20, opacity: 0 },
        { scale: 0.55, x: 90, y: 10, rotation: -15, opacity: 1, ease: 'none' },
        0.15
      )
      .fromTo(leaf1Ref.current,
        { scale: 0.3, x: -150, y: 50, rotation: -40, opacity: 0 },
        { scale: 0.6, x: -140, y: -80, rotation: -25, opacity: 0.85, ease: 'none' },
        0.12
      )
      .fromTo(leaf2Ref.current,
        { scale: 0.3, x: 150, y: 50, rotation: 30, opacity: 0 },
        { scale: 0.5, x: 130, y: -60, rotation: 20, opacity: 0.8, ease: 'none' },
        0.18
      )
      .to([lemonRef.current, slice1Ref.current, slice2Ref.current, leaf1Ref.current, leaf2Ref.current],
        { y: -80, opacity: 0, ease: 'none' },
        0.7
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
      id="still-life"
      className="relative min-h-[160vh] flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1c1917, #292524, #1c1917)' }}
      aria-label="Still Life"
    >
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 50% 40% at 50% 42%, rgba(254,249,195,0.1) 0%, transparent 60%)',
      }} />

      <div className="absolute z-[1] pointer-events-none" style={{
        left: '50%', top: '50%',
        transform: 'translate(-50%,-50%)',
        width: 'min(600px, 80vw)', height: 'min(600px, 80vw)',
        border: '1px solid rgba(254,249,195,0.06)',
        borderRadius: '4px',
      }} />

      <div ref={lemonRef} className="absolute z-20" style={{
        left: '50%', top: '45%',
        transform: 'translate(-50%,-50%)',
        width: 'min(280px, 50vw)', height: 'min(280px, 50vw)',
      }}>
        <Lemon className="w-full h-full" />
      </div>

      <div ref={slice1Ref} className="absolute z-15" style={{
        left: '30%', top: '55%',
        width: 'min(200px, 35vw)', height: 'min(150px, 25vw)',
      }}>
        <LemonSlice className="w-full h-full" />
      </div>

      <div ref={slice2Ref} className="absolute z-12" style={{
        right: '25%', top: '50%',
        width: 'min(160px, 28vw)', height: 'min(120px, 20vw)',
      }}>
        <LemonSlice className="w-full h-full" flipped />
      </div>

      <div ref={leaf1Ref} className="absolute z-10" style={{
        left: '18%', top: '35%',
        width: '90px', height: '140px',
      }}>
        <LemonLeaf className="w-full h-full" flipped />
      </div>

      <div ref={leaf2Ref} className="absolute z-8" style={{
        right: '18%', top: '40%',
        width: '80px', height: '130px',
      }}>
        <LemonLeaf className="w-full h-full" />
      </div>

      <div ref={titleRef} className="absolute z-30 text-center pointer-events-none" style={{
        left: '50%', top: '8%', transform: 'translateX(-50%)', maxWidth: '500px',
      }}>
        <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-cream-50 leading-[0.9] tracking-tight">
          Still <span className="font-medium">Life</span>
        </h2>
      </div>

      <div ref={textLeftRef} className="absolute z-30 pointer-events-none left-[6%] bottom-[16%] max-w-[260px]">
        <p className="font-display text-2xl md:text-3xl font-light text-cream-100 leading-[1.15]">
          Arranged by <span className="font-medium">gravity</span> and time.
        </p>
        <p className="mt-4 text-xs text-cream-400/60 leading-relaxed">
          The Dutch masters knew: fruit is architecture. Each sphere a dome. Each segment a vaulted hall.
        </p>
      </div>

      <div ref={textRightRef} className="absolute z-30 pointer-events-none right-[6%] bottom-[18%] max-w-[240px] text-right">
        <p className="font-display text-2xl md:text-3xl font-light text-cream-100 leading-[1.15]">
          Light <span className="font-medium">considers</span> every surface.
        </p>
      </div>

      <div className="absolute top-6 left-6 z-30 pointer-events-none">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-500/30">VI</p>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-500/30">
          Composition in ochre &middot; cadmium yellow &middot; raw umber &middot; titanium white
        </p>
      </div>
    </section>
  );
}
