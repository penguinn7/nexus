'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollProgressProps {
  children?: (progress: number) => React.ReactNode;
  trigger?: string;
  start?: string;
  end?: string;
}

export function ScrollProgress({
  children,
  trigger,
  start = 'top bottom',
  end = 'bottom top',
}: ScrollProgressProps) {
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: trigger || (ref.current as HTMLElement),
        start,
        end,
        onUpdate: (self) => setProgress(self.progress),
      });
    }, ref.current as HTMLElement);
    return () => ctx.revert();
  }, [trigger, start, end]);

  if (!children) return null;
  return <>{children(progress)}</>;
}
