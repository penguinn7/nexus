'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RevealText } from './AnimatedText';

gsap.registerPlugin(ScrollTrigger);

function CSSLemon({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`} role="img" aria-label="A realistic lemon">
      <div className="absolute inset-0 rounded-[45%_55%_50%_50%/55%_45%_55%_45%] bg-gradient-to-br from-lemon-100 via-lemon-300 to-lemon-600 shadow-[0_20px_60px_rgba(161,98,7,0.3),0_4px_16px_rgba(161,98,7,0.2)]" />
      <div className="absolute inset-[8%] rounded-[42%_58%_52%_48%/58%_42%_58%_42%] bg-gradient-to-br from-lemon-200/60 via-lemon-400/30 to-transparent" />
      <div className="absolute top-[12%] left-[18%] w-[35%] h-[25%] rounded-full bg-gradient-to-br from-white/70 via-lemon-100/40 to-transparent blur-[2px]" />
      <div className="absolute bottom-[15%] right-[20%] w-[30%] h-[20%] rounded-full bg-gradient-to-tl from-lemon-700/20 via-lemon-800/10 to-transparent blur-[3px]" />
      <div className="absolute top-[5%] left-[42%] w-[16%] h-[10%] rounded-[50%_50%_60%_40%/70%_30%_70%_30%] bg-gradient-to-b from-amber-800 to-amber-900 shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
      <div className="absolute top-[6%] left-[44%] w-[12%] h-[7%] rounded-[50%_50%_60%_40%/60%_40%_60%_40%] bg-gradient-to-b from-amber-600 to-amber-800 opacity-60" />
      <div className="absolute top-[10%] left-[45%] w-[6%] h-[4%] rounded-full bg-lemon-100/40" />
      <svg className="absolute inset-0 w-full h-full opacity-[0.08]" viewBox="0 0 100 100">
        <filter id="tex">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100" height="100" filter="url(#tex)" />
      </svg>
    </div>
  );
}

function CSSLeaf({ className = '', flipped = false }: { className?: string; flipped?: boolean }) {
  return (
    <div
      className={`relative ${className}`}
      style={{ transform: flipped ? 'scaleX(-1)' : 'none' }}
      role="img"
      aria-label="A lemon leaf"
    >
      <div className="absolute inset-0 rounded-[50%_50%_50%_50%/60%_40%_60%_40%] bg-gradient-to-br from-lime-400 via-green-500 to-green-700 shadow-[0_8px_24px_rgba(22,101,52,0.25)]" />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
        <path d="M50 10 Q45 30 42 50 Q40 65 42 80" stroke="rgba(22,65,20,0.3)" strokeWidth="1.5" />
        <path d="M50 20 Q30 40 20 60" stroke="rgba(22,65,20,0.15)" strokeWidth="0.8" />
        <path d="M50 20 Q70 40 80 60" stroke="rgba(22,65,20,0.15)" strokeWidth="0.8" />
        <path d="M50 35 Q32 50 22 65" stroke="rgba(22,65,20,0.12)" strokeWidth="0.6" />
        <path d="M50 35 Q68 50 78 65" stroke="rgba(22,65,20,0.12)" strokeWidth="0.6" />
        <path d="M50 50 Q35 60 25 72" stroke="rgba(22,65,20,0.1)" strokeWidth="0.5" />
        <path d="M50 50 Q65 60 75 72" stroke="rgba(22,65,20,0.1)" strokeWidth="0.5" />
      </svg>
      <div className="absolute top-[5%] left-[15%] w-[30%] h-[20%] rounded-full bg-gradient-to-br from-lime-300/50 to-transparent blur-[1px]" />
    </div>
  );
}

function CSSSlice({ className = '', flipped = false }: { className?: string; flipped?: boolean }) {
  return (
    <div
      className={`relative ${className}`}
      style={{ transform: flipped ? 'scaleX(-1)' : 'none' }}
      role="img"
      aria-label="A lemon cross-section"
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-lemon-200 via-lemon-300 to-lemon-500 shadow-[0_16px_48px_rgba(161,98,7,0.3)]" />
      <div className="absolute inset-[12%] rounded-full bg-gradient-to-br from-lemon-100 via-amber-50 to-lemon-200" />
      <svg className="absolute inset-[12%] w-[76%] h-[76%]" viewBox="0 0 100 100">
        {Array.from({ length: 10 }, (_, i) => {
          const angle = (i * 36 - 90) * (Math.PI / 180);
          const x2 = 50 + Math.cos(angle) * 48;
          const y2 = 50 + Math.sin(angle) * 48;
          return (
            <line
              key={i}
              x1="50" y1="50"
              x2={x2} y2={y2}
              stroke="rgba(202,138,4,0.25)"
              strokeWidth="0.8"
            />
          );
        })}
        {Array.from({ length: 10 }, (_, i) => {
          const startAngle = (i * 36 - 90 + 5) * (Math.PI / 180);
          const endAngle = (i * 36 - 90 + 31) * (Math.PI / 180);
          const r = 44;
          const ix = 50 + Math.cos(startAngle) * r;
          const iy = 50 + Math.sin(startAngle) * r;
          const ox = 50 + Math.cos(endAngle) * r;
          const oy = 50 + Math.sin(endAngle) * r;
          return (
            <path
              key={`s${i}`}
              d={`M50,50 L${ix},${iy} A${r},${r} 0 0,1 ${ox},${oy} Z`}
              fill={`rgba(254,249,195,${0.3 + (i % 3) * 0.1})`}
            />
          );
        })}
        <circle cx="50" cy="50" r="8" fill="rgba(254,249,195,0.6)" />
      </svg>
      <div className="absolute top-[15%] left-[20%] w-[25%] h-[18%] rounded-full bg-gradient-to-br from-white/50 to-transparent blur-[1px]" />
    </div>
  );
}

export { CSSLemon as Lemon, CSSLeaf as LemonLeaf, CSSSlice as LemonSlice };
