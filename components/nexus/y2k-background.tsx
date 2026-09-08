"use client";

import { useEffect, useId, useMemo } from "react";
import { cn } from "@/lib/utils";

const COLORS = [
  "var(--glow-pink)",
  "var(--glow-violet)",
  "var(--glow-blue)",
  "var(--glow-cyan)",
];

interface Star {
  size: number;
  top: number;
  left: number;
  delay: number;
  duration: number;
  opacity: number;
  hue: string;
}

export function Y2KBackground({
  className,
  density = "default",
}: {
  className?: string;
  density?: "minimal" | "default" | "dense";
}) {
  const id = useId();
  const starCount = density === "dense" ? 90 : density === "minimal" ? 24 : 55;

  const stars = useMemo<Star[]>(() => {
    const arr: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      arr.push({
        size: Math.random() * 2.4 + 0.6,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: Math.random() * 3 + 2.5,
        opacity: Math.random() * 0.6 + 0.3,
        hue: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
    return arr;
  }, [starCount]);

  // Deterministic orb positions (stable across renders)
  const orbs = useMemo(
    () =>
      [
        { top: "12%", left: "8%", size: 460, color: COLORS[0], delay: "0s" },
        { top: "62%", left: "78%", size: 420, color: COLORS[1], delay: "-2s" },
        { top: "30%", left: "64%", size: 340, color: COLORS[2], delay: "-4s" },
        { top: "80%", left: "20%", size: 300, color: COLORS[3], delay: "-1s" },
      ].map((o, i) => ({ ...o, key: i })),
    []
  );

  useEffect(() => {
    // Glowing cursor interaction: radiate the nearest glow toward cursor
    const el = document.getElementById(`bg-${id}`);
    let frame: number | null = null;

    const onMove = (e: MouseEvent) => {
      if (!el) return;
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${e.clientX}px`);
        el.style.setProperty("--my", `${e.clientY}px`);
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [id]);

  return (
    <div
      id={`bg-${id}`}
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 z-0 overflow-hidden", className)}
    >
      {/* Base vert */}
      <div className="absolute inset-0 bg-(--background)" />

      {/* Cyber grid */}
      <div
        className="absolute inset-0 cyber-grid opacity-40"
        style={{
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black 30%, transparent 100%)",
        }}
      />

      {/* Soft orbs */}
      {orbs.map((o) => (
        <div
          key={o.key}
          className="absolute rounded-full blur-[120px] animate-glow-pulse"
          style={{
            top: o.top,
            left: o.left,
            width: o.size,
            height: o.size,
            background: o.color,
            opacity: 0.24,
            animationDelay: o.delay,
            animationDuration: "9s",
          }}
        />
      ))}

      {/* Stars / sparkles */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            background: s.hue,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}

      {/* Cursor-reactive glow */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-700 hover:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), hsl(var(--glow-violet) / 0.09), transparent 70%)",
        }}
      />

      {/* Scanlines (extremely subtle) */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 4px)",
        }}
      />
    </div>
  );
}