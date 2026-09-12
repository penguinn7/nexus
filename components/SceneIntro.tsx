'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lemon } from './Lemon';
import { RevealText, SplitReveal } from './AnimatedText';

gsap.registerPlugin(ScrollTrigger);

export function SceneIntro() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lemonRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const lemon = lemonRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    if (!section || !lemon || !title || !subtitle) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=200%',
          scrub: 1.5,
          pin: true,
          pinSpacing: true,
          id: 'intro',
        },
      });

      tl.fromTo(lemon,
        { scale: 0.3, y: 150, opacity: 0, filter: 'blur(16px)' },
        { scale: 1, y: 0, opacity: 1, filter: 'blur(0px)', ease: 'none' },
        0
      )
      .fromTo(title,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.15
      )
      .fromTo(subtitle,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.3
      )
      .to(lemon,
        { scale: 2.2, y: -350, opacity: 0, ease: 'none' },
        0.6
      )
      .to(title,
        { y: -200, opacity: 0, ease: 'none' },
        0.55
      )
      .to(subtitle,
        { y: -120, opacity: 0, ease: 'none' },
        0.6
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="intro"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Introduction"
    >
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 90% 70% at 50% 40%, rgba(254,249,195,0.5) 0%, transparent 60%)',
      }} />

      <div
        ref={lemonRef}
        className="relative z-10"
        style={{ width: '280px', height: '280px' }}
      >
        <Lemon className="w-full h-full" />
      </div>

      <div
        ref={titleRef}
        className="absolute z-20 text-center pointer-events-none"
        style={{ top: '56%', left: '50%', transform: 'translate(-50%, 0)' }}
      >
        <h1 className="font-display text-7xl md:text-8xl lg:text-[10rem] font-light tracking-tight text-charcoal-900 leading-[0.9]">
          LIM<span className="text-lemon-500">O</span>N
        </h1>
      </div>

      <div
        ref={subtitleRef}
        className="absolute z-20 text-center pointer-events-none"
        style={{ top: '72%', left: '50%', transform: 'translate(-50%, 0)' }}
      >
        <p className="text-sm md:text-base font-light text-charcoal-400 tracking-[0.3em] uppercase">
          An immersive experience
        </p>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 text-charcoal-300">
        <span className="text-[10px] font-medium uppercase tracking-[0.25em]">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-charcoal-300 to-transparent" />
      </div>
    </section>
  );
}
