"use client";

import { useEffect, useState } from "react";

export function Cursor() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    setEnabled(true);

    const dot = document.getElementById("pf-cursor-dot");
    const ring = document.getElementById("pf-cursor-ring");
    if (!dot || !ring) return;

    let raf = 0;
    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };

    const onOver = (e: Event) => {
      const t = (e.target as HTMLElement)?.closest?.("a, button, [data-cursor]");
      ring.classList.toggle("pf-cursor-engaged", !!t);
      ring.style.borderColor = t ? "rgba(183,250,60,0.9)" : "";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    loop();

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div id="pf-cursor-dot" className="pf-cursor-dot" aria-hidden />
      <div id="pf-cursor-ring" className="pf-cursor-ring" aria-hidden />
      <style jsx>{`
        .pf-cursor-engaged .pf-cursor-dot,
        #pf-cursor-dot.pf-cursor-engaged {
          transform: scale(0.4);
        }
        #pf-cursor-ring.pf-cursor-engaged {
          width: 54px;
          height: 54px;
          margin: -27px 0 0 -27px;
        }
      `}</style>
    </>
  );
}