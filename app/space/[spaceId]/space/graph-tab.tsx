"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Network, Sparkles, ZoomIn, Target } from "lucide-react";
import type { Concept, Connection } from "@/types";

interface GraphNode extends Concept {
  x: number;
  y: number;
  vx: number;
  vy: number;
  degree: number;
}

const GLOW = [
  "var(--glow-pink)",
  "var(--glow-violet)",
  "var(--glow-blue)",
  "var(--glow-cyan)",
];

export function GraphTab({
  spaceId,
  concepts,
  connections,
}: {
  spaceId: string;
  concepts: Concept[];
  connections: Connection[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const router = useRouter();

  const onClickAsk = selected
    ? () => {
        const target = spaceId === "__all__" ? selected.space_id : spaceId;
        router.push(
          `/space/${target}?q=${encodeURIComponent(`Explain the concept "${selected.name}" in this Space.`)}`
        );
      }
    : undefined;

  const nodes = useMemo<GraphNode[]>(() => {
    const degreeMap = new Map<string, number>();
    for (const c of connections) {
      degreeMap.set(c.concept_a, (degreeMap.get(c.concept_a) ?? 0) + 1);
      degreeMap.set(c.concept_b, (degreeMap.get(c.concept_b) ?? 0) + 1);
    }
    return concepts.map((c, i) => ({
      ...c,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      degree: degreeMap.get(c.id) ?? 0,
    }));
  }, [concepts, connections]);

  // Resize observer for canvas
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        setDims({ w: e.contentRect.width, h: e.contentRect.height });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Canvas render + physics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (dims.w === 0 || dims.h === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = dims.w;
    canvas.height = dims.h;

    if (nodes.length === 0) return;

    // Random initial placements around center
    const cx = dims.w / 2;
    const cy = dims.h / 2;
    for (const n of nodes) {
      if (n.x === 0 && n.y === 0) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.min(dims.w, dims.h) * 0.3 * (0.5 + Math.random() * 0.8);
        n.x = cx + Math.cos(angle) * r;
        n.y = cy + Math.sin(angle) * r;
      }
    }

    // Physics sim
    const REPULSION = 4000;
    const SPRING = 0.015;
    const DAMPING = 0.85;
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    const forceTick = () => {
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          if (a === b) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy || 1;
          const dist = Math.sqrt(distSq);
          const force = REPULSION / distSq;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          a.vx += fx;
          a.vy += fy;
          b.vx -= fx;
          b.vy -= fy;
        }
      }
      // Springs on edges
      for (const e of connections) {
        const a = nodeMap.get(e.concept_a);
        const b = nodeMap.get(e.concept_b);
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        // Push connected nodes slightly closer than free ones
        const target = 110;
        const f = (dist - target) * SPRING;
        const fx = (dx / dist) * f;
        const fy = (dy / dist) * f;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }
      // Integrate
      for (const n of nodes) {
        n.vx *= DAMPING;
        n.vy *= DAMPING;
        n.x += n.vx;
        n.y += n.vy;
        // Keep in bounds softly
        n.x = Math.max(30, Math.min(dims.w - 30, n.x));
        n.y = Math.max(30, Math.min(dims.h - 30, n.y));
      }
    };

    const render = () => {
      if (nodes.length === 0) return;
      ctx.clearRect(0, 0, dims.w, dims.h);

      // Edges
      for (const e of connections) {
        const a = nodeMap.get(e.concept_a);
        const b = nodeMap.get(e.concept_b);
        if (!a || !b) continue;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        const active = selected && (e.concept_a === selected.id || e.concept_b === selected.id);
        ctx.strokeStyle = active
          ? "hsl(var(--glow-violet) / 0.7)"
          : "hsl(var(--glow-blue) / 0.2)";
        ctx.lineWidth = active ? 1.6 : 1;
        ctx.stroke();
      }

      // Nodes
      for (const n of nodes) {
        const r = 10 + Math.min(n.degree, 6) * 3 + Math.sqrt((n.name?.length ?? 0) * 0.8);
        const isSel = selected?.id === n.id;
        const hue = GLOW[n.name.length % GLOW.length];

        // glow halo
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 6, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(var(--glow-violet) / ${isSel ? 0.22 : 0.06})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = "hsl(var(--card) / 0.9)";
        ctx.fill();
        ctx.strokeStyle = isSel ? "hsl(var(--glow-pink))" : hue;
        ctx.lineWidth = isSel ? 2 : 1.2;
        ctx.stroke();

        // label
        ctx.fillStyle = "hsl(var(--foreground) / 0.85)";
        ctx.font = "10px var(--font-space-grotesk), sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const label = n.name.length > 18 ? n.name.slice(0, 17) + "…" : n.name;
        ctx.fillText(label, n.x, n.y + r + 4);
      }
    };

    // Run physics until settled, then keep a light liveliness
    let tick = 0;
    const simInterval = window.setInterval(() => {
      forceTick();
      if (tick > 220) {
        window.clearInterval(simInterval);
      }
      tick++;
    }, 16);

    const raf = () => {
      render();
      animationFrame = requestAnimationFrame(raf);
    };
    let animationFrame = requestAnimationFrame(raf);

    // Center on a concept when selected
    if (selected) {
      // handled by re-render: render highlights selection
    }

    return () => {
      window.clearInterval(simInterval);
      cancelAnimationFrame(animationFrame);
    };
  }, [nodes, connections, dims, selected]); // eslint-disable-line react-hooks/exhaustive-deps

  // Click selection (based on canvas coords)
  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const hit = nodes
      .map((n) => {
        const r = 10 + Math.min(n.degree, 6) * 3 + Math.sqrt((n.name?.length ?? 0) * 0.8);
        const d = Math.hypot(n.x - x, n.y - y);
        return { n, d, r };
      })
      .filter((h) => h.d <= h.r + 6)
      .sort((a, b) => a.d - b.d)[0];
    setSelected(hit ? hit.n : null);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.25em] text-(--muted-foreground)">
            Knowledge Graph
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-(--foreground)">
            How your knowledge fits together
          </h1>
          <p className="mt-1 text-sm text-(--muted-foreground)">
            Concepts become nodes. Relationships become edges.
          </p>
        </div>
      </div>

      {nodes.length === 0 ? (
        <div className="mt-8 rounded-3xl glass-strong p-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-(--primary)/25 bg-(--primary)/8">
            <Network size={24} className="text-(--primary)" />
          </div>
          <h3 className="font-display text-lg font-semibold text-(--foreground)">
            Mapping your knowledge...
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-(--muted-foreground)">
            Wait, no — there's nothing to map yet. Add sources and NEXUS will
            extract concepts and draw their connections here.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_300px]">
          <div ref={wrapRef} className="relative h-[62vh] overflow-hidden rounded-2xl glass-strong">
            {/* controls */}
            <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-col gap-2">
              <span className="rounded-lg glass px-3 py-1.5 text-[11px] text-(--muted-foreground)">
                {nodes.length} concepts · {connections.length} connections
              </span>
            </div>
            {selected && (
              <div className="pointer-events-none absolute right-4 top-4 z-10 flex items-center gap-2 rounded-lg glass px-3 py-1.5 text-[11px] text-(--foreground)">
                <Target size={11} className="text-(--primary)" />
                {selected.name}
              </div>
            )}
            <canvas
              ref={canvasRef}
              onClick={handleClick}
              className="h-full w-full cursor-crosshair"
              aria-label={`Knowledge graph with ${nodes.length} concepts`}
            />
          </div>

          {/* Details panel */}
          <div className="flex h-[62vh] flex-col glass-strong rounded-2xl p-5">
            {selected ? (
              <NodeDetails
                node={selected}
                connections={connections}
                nodes={nodes}
                onAsk={onClickAsk}
              />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <ZoomIn size={22} className="text-(--muted-foreground)" />
                <p className="mt-2 text-sm font-medium text-(--foreground)">Select a node</p>
                <p className="mt-1 max-w-[220px] text-xs text-(--muted-foreground)">
                  Click any concept to inspect its relationships and ask NEXUS about it.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NodeDetails({
  node,
  connections,
  nodes,
  onAsk,
}: {
  node: GraphNode;
  connections: Connection[];
  nodes: GraphNode[];
  onAsk: (() => void) | undefined;
}) {
  const related = connections.filter((c) => c.concept_a === node.id || c.concept_b === node.id);
  const links = related.map((c) => {
    const otherId = c.concept_a === node.id ? c.concept_b : c.concept_a;
    const other = nodes.find((n) => n.id === otherId);
    return { other: other?.name ?? "unknown", relationship: c.relationship };
  });

  return (
    <div className="flex h-full flex-col">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--primary)/12">
        <Sparkles size={16} className="text-(--primary)" />
      </span>
      <h2 className="mt-3 font-display text-xl font-bold text-(--foreground)">{node.name}</h2>
      {node.description && (
        <p className="mt-2 text-sm leading-relaxed text-(--muted-foreground)">{node.description}</p>
      )}
      <p className="mt-2 text-[11px] text-(--muted-foreground)">
        Connected to {links.length} concept{links.length === 1 ? "" : "s"}
      </p>

      <div className="mt-4 flex-1 space-y-2 overflow-y-auto">
        {links.length === 0 ? (
          <p className="text-xs text-(--muted-foreground)">Standalone so far. Ask NEXUS to connect it.</p>
        ) : (
          links.slice(0, 30).map((l, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-(--background)/30 px-3 py-2 text-xs">
              <span className="text-(--muted-foreground)">{l.other}</span>
              <span className="flex-1 border-t border-dashed border-(--border)" />
              <span className="text-(--primary)">{l.relationship}</span>
            </div>
          ))
        )}
      </div>

      <button
        type="button"
        onClick={onAsk}
        className="mt-4 rounded-xl bg-gradient-to-r from-(--glow-violet) to-(--glow-blue) px-4 py-2.5 text-sm font-medium text-white shadow-[0_0_20px_hsl(var(--glow-violet)/0.3)] transition-all hover:shadow-[0_0_30px_hsl(var(--glow-violet)/0.5)] active:scale-[0.98] cursor-pointer"
      >
        Ask NEXUS about this
      </button>
    </div>
  );
}