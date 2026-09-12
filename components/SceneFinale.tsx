'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lemon, LemonLeaf } from './Lemon';
import { Typewriter } from './AnimatedText';

gsap.registerPlugin(ScrollTrigger);

export function SceneFinale() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lemonRef = useRef<HTMLDivElement>(null);
  const leafRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

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
          id: 'finale',
        },
      });

      tl.fromTo(lemonRef.current,
        { scale: 0.15, y: 300, opacity: 0, filter: 'blur(30px)' },
        { scale: 1, y: 0, opacity: 1, filter: 'blur(0px)', ease: 'none' },
        0
      )
      .fromTo(leafRef.current,
        { scale: 0.1, x: -150, y: 80, rotation: -40, opacity: 0 },
        { scale: 1, x: -60, y: -30, rotation: -15, opacity: 1, ease: 'none' },
        0.08
      )
      .to(lemonRef.current,
        { scale: 1.5, y: -80, opacity: 1, ease: 'none' },
        0.35
      )
      .to(lemonRef.current,
        { scale: 3, y: -400, opacity: 0, filter: 'blur(20px)', ease: 'none' },
        0.65
      )
      .to(leafRef.current,
        { opacity: 0, ease: 'none' },
        0.6
      );

      [titleRef, subtitleRef, footerRef].forEach((ref) => {
        const el = ref.current;
        if (!el) return;
        gsap.fromTo(el,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.5, ease: 'expo.out',
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
      id="finale"
      className="relative min-h-[150vh] flex items-center justify-center overflow-hidden"
      style={{ background: '#1c1917' }}
      aria-label="Finale"
    >
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 40% 35% at 50% 45%, rgba(254,249,195,0.06) 0%, transparent 60%)',
      }} />

      <div ref={lemonRef} className="absolute z-20" style={{
        left: '50%', top: '45%',
        transform: 'translate(-50%,-50%)',
        width: 'min(280px, 55vw)', height: 'min(280px, 55vw)',
      }}>
        <Lemon className="w-full h-full" />
      </div>

      <div ref={leafRef} className="absolute z-15" style={{
        left: '50%', top: '45%',
        transform: 'translate(-50%,-50%)',
        width: '110px', height: '180px',
      }}>
        <LemonLeaf className="w-full h-full" flipped />
      </div>

      <div ref={titleRef} className="absolute z-30 text-center pointer-events-none" style={{
        left: '50%', top: '12%', transform: 'translateX(-50%)', maxWidth: '500px',
      }}>
        <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-cream-50 leading-[0.9] tracking-tight">
          ONE<br /><span className="font-medium">LEMON</span>
        </h2>
      </div>

      <div ref={subtitleRef} className="absolute z-30 text-center pointer-events-none" style={{
        left: '50%', bottom: '22%', transform: 'translateX(-50%)', maxWidth: '400px',
      }}>
        <p className="font-display text-lg md:text-xl font-light text-cream-200/80 leading-relaxed">
          Nothing more needed.<br /><span className="font-medium text-cream-100">Nothing less desired.</span>
        </p>
      </div>

      <div ref={footerRef} className="absolute z-30 text-center pointer-events-none" style={{
        left: '50%', bottom: '10%', transform: 'translateX(-50%)', maxWidth: '400px',
      }}>
        <Typewriter
          text="The experience concludes. The lemon remains."
          speed={35}
          className="font-mono text-[11px] text-cream-400/50"
          cursor
        />
      </div>

      <div className="absolute bottom-6 left-6 z-30 pointer-events-none">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cream-500/25">
          LIMON &mdash; An immersive experience
        </p>
      </div>

      <div className="absolute bottom-6 right-6 z-30 pointer-events-none text-right">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cream-500/25">
          Designed with precision<br />Built with care
        </p>
      </div>
    </section>
  );
}
