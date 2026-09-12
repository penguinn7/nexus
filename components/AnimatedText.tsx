'use client';

import { useRef, useEffect, useState, Children, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealTextProps {
  children: ReactNode;
  className?: string;
  trigger?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  direction?: 'up' | 'left';
}

export function RevealText({
  children,
  className = '',
  trigger,
  start = 'top 80%',
  end = 'bottom 20%',
  scrub = 1,
  direction = 'up',
}: RevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const ctx = gsap.context(() => {
      if (direction === 'left') {
        gsap.fromTo(
          inner,
          { xPercent: 100, opacity: 0 },
          {
            xPercent: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: trigger || container,
              start,
              end,
              scrub,
            },
          }
        );
      } else {
        gsap.fromTo(
          inner,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: trigger || container,
              start,
              end,
              scrub,
            },
          }
        );
      }
    }, container);

    return () => ctx.revert();
  }, [trigger, start, end, scrub, direction]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden inline-block ${className}`}
    >
      <div ref={innerRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}

interface SplitRevealProps {
  text: string;
  className?: string;
  split?: 'words' | 'chars' | 'lines';
  delay?: number;
  stagger?: number;
  duration?: number;
  ease?: string;
  trigger?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
}

export function SplitReveal({
  text,
  className = '',
  split = 'words',
  delay = 0,
  stagger = 0.06,
  duration = 1,
  ease = 'expo.out',
  trigger,
  start = 'top 85%',
  end = 'bottom 20%',
  scrub = false,
  from = { opacity: 0, yPercent: 100 },
  to = { opacity: 1, yPercent: 0 },
}: SplitRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let parts: string[];
    if (split === 'words') {
      parts = text.split(/(\s+)/);
    } else if (split === 'chars') {
      parts = text.split('');
    } else {
      parts = text.split('\n').filter((l) => l.trim());
    }

    container.innerHTML = '';

    const elements: HTMLElement[] = [];

    if (split === 'lines') {
      parts.forEach((line, i) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'overflow-hidden';
        const inner = document.createElement('div');
        inner.textContent = line;
        inner.style.willChange = 'transform, opacity';
        wrapper.appendChild(inner);
        container.appendChild(wrapper);
        elements.push(inner);
      });
    } else {
      parts.forEach((part) => {
        const wrapper = document.createElement('span');
        wrapper.style.display = 'inline-block';
        wrapper.style.overflow = 'hidden';
        const inner = document.createElement('span');
        inner.style.display = 'inline-block';
        inner.style.willChange = 'transform, opacity';
        inner.textContent = part;
        wrapper.appendChild(inner);
        container.appendChild(wrapper);
        elements.push(inner);
      });
    }

    if (elements.length === 0) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: trigger
          ? {
              trigger,
              start,
              end,
              scrub,
            }
          : undefined,
        delay: scrub ? 0 : delay,
      });

      tl.fromTo(elements, from, {
        ...to,
        duration,
        ease,
        stagger: scrub ? stagger * elements.length : stagger,
      });
    }, container);

    return () => ctx.revert();
  }, [text, split, delay, stagger, duration, ease, trigger, start, end, scrub, from, to]);

  return (
    <div ref={containerRef} className={className} aria-hidden="true">
      <span className="sr-only">{text}</span>
    </div>
  );
}

interface ScrollTextProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  pauseOnHover?: boolean;
  style?: React.CSSProperties;
}

export function ScrollText({
  children,
  className = '',
  speed = 30,
  direction = 'horizontal',
  reverse = false,
  pauseOnHover = true,
  style,
}: ScrollTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    let animId: number;
    let pos = 0;
    let lastT = 0;

    const tick = (t: number) => {
      if (paused) {
        lastT = t;
        animId = requestAnimationFrame(tick);
        return;
      }
      const dt = (t - lastT) / 1000;
      lastT = t;
      pos += speed * dt * (reverse ? -1 : 1);
      const w = content.scrollWidth / 3;
      if (!reverse && pos >= w) pos -= w;
      if (reverse && pos <= -w) pos += w;
      content.style.transform = `translateX(${pos}px)`;
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [speed, direction, reverse, paused]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={style}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
      aria-label="Scrolling text"
    >
      <div
        ref={contentRef}
        className="flex whitespace-nowrap items-center"
        style={{ willChange: 'transform' }}
      >
        {children}
        <span className="inline-block mx-6 opacity-30" aria-hidden="true">&bull;</span>
        {children}
        <span className="inline-block mx-6 opacity-30" aria-hidden="true">&bull;</span>
        {children}
      </div>
    </div>
  );
}

interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  onComplete?: () => void;
}

export function Typewriter({
  text,
  className = '',
  speed = 50,
  delay = 0,
  cursor = true,
  onComplete,
}: TypewriterProps) {
  const [display, setDisplay] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    let tid: ReturnType<typeof setTimeout>;

    const type = () => {
      if (i < text.length) {
        setDisplay(text.slice(0, i + 1));
        i++;
        tid = setTimeout(type, speed);
      } else {
        setShowCursor(false);
        onComplete?.();
      }
    };

    const start = setTimeout(type, delay);
    return () => {
      clearTimeout(start);
      clearTimeout(tid);
    };
  }, [text, speed, delay, onComplete]);

  useEffect(() => {
    if (!cursor) return;
    const iv = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(iv);
  }, [cursor]);

  return (
    <span className={className} aria-live="polite">
      {display}
      {cursor && showCursor && <span className="animate-pulse ml-0.5 opacity-60">|</span>}
    </span>
  );
}
