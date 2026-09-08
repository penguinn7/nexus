"use client";

import { useState } from "react";
import { Sparkles, FileText, Network, RefreshCw, Link2 } from "lucide-react";
import type { Space, Concept, Connection, Source } from "@/types";
import { NexusButton } from "@/components/nexus/ui";

export function InsightsTab({
  spaceId,
  space,
  concepts,
  connections,
  sources,
}: {
  spaceId: string;
  space: Space;
  concepts: Concept[];
  connections: Connection[];
  sources: Source[];
}) {
  const [insights, setInsights] = useState<string[] | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [used, setUsed] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    setNote(null);
    try {
      const res = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spaceId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not generate insights.");
        return;
      }
      setInsights(data.insights);
      setUsed(true);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.25em] text-(--muted-foreground)">
            Insights
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-(--foreground)">
            What NEXUS notices
          </h1>
          <p className="mt-1 text-sm text-(--muted-foreground)">
            Recurring ideas, contradictions, missing pieces and things worth
            exploring — derived from your actual knowledge graph.
          </p>
        </div>
        <NexusButton onClick={generate} loading={loading}>
          <RefreshCw size={14} />
          {loading ? "Thinking..." : used ? "Regenerate" : "Generate insights"}
        </NexusButton>
      </div>

      {/* Graph-derived facts (always real) */}
      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <FactCard icon={Network} label="Concepts mapped" value={concepts.length} />
        <FactCard icon={Link2} label="Relationships found" value={connections.length} />
        <FactCard icon={FileText} label="Sources read" value={sources.length} />
      </section>

      {!loading && !insights && !error && (
        <div className="mt-8 rounded-3xl glass-strong p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-(--primary)/25 bg-(--primary)/8">
            <Sparkles size={24} className="text-(--primary)" />
          </div>
          <h3 className="font-display text-lg font-semibold text-(--foreground)">
            Tell me about this Space.
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-(--muted-foreground)">
            NEXUS will analyze {concepts.length > 0 ? `${concepts.length} concepts and how they connect` : "your sources and concepts"} to surface patterns, contradictions and next steps.
          </p>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {insights && (
        <div className="mt-6 space-y-3">
          {insights.map((ins, i) => (
            <InsightRow key={i} icon={insightIcon(i)} text={ins} />
          ))}
        </div>
      )}

      {note && (
        <p className="mt-4 rounded-lg bg-(--primary)/8 px-3 py-2 text-xs text-(--primary)">
          {note}
        </p>
      )}
    </div>
  );
}

function FactCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Network;
  label: string;
  value: number;
}) {
  return (
    <div className="glass rounded-2xl p-4 glass-hover">
      <div className="flex items-center gap-2 text-(--muted-foreground)">
        <Icon size={13} />
        <span className="text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      <p className="mt-1.5 font-display text-2xl font-bold text-(--foreground)">{value}</p>
    </div>
  );
}

function InsightRow({ icon: Icon, text }: { icon: typeof Sparkles; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl glass p-4 transition-all duration-300 glass-hover">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--primary)/12">
        <Icon size={14} className="text-(--primary)" />
      </span>
      <p className="text-sm leading-relaxed text-(--foreground)">{text}</p>
    </div>
  );
}

function insightIcon(i: number): typeof Sparkles {
  const icons = [Sparkles, Network, FileText];
  return icons[i % icons.length];
}