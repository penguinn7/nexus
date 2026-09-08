"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Y2KBackground } from "@/components/nexus/y2k-background";
import { NexusLogo } from "@/components/nexus/ui";
import { GraphTab } from "@/app/space/[spaceId]/space/graph-tab";
import type { Concept, Connection } from "@/types";

export function GraphPageClient({
  concepts,
  connections,
}: {
  concepts: Concept[];
  connections: Connection[];
}) {
  return (
    <div className="relative min-h-screen">
      <Y2KBackground />
      <main className="relative z-10 min-h-screen">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-(--border)/50 px-6 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <Link href="/workspace" className="flex items-center gap-2 text-(--muted-foreground) hover:text-(--foreground)">
              <ArrowLeft size={15} />
              <NexusLogo compact />
              <span className="font-display text-sm font-bold tracking-[0.2em] chrome-text">
                NEXUS
              </span>
            </Link>
          </div>
          <p className="hidden text-[11px] text-(--muted-foreground) sm:block">
            Aggregate graph across all your Spaces
          </p>
        </header>

        <div className="p-0">
          {/* graph-tab renders its own header; reuse with an artificial space */}
          <GraphTab
            spaceId="__all__"
            concepts={concepts}
            connections={connections}
          />
        </div>

        {concepts.length === 0 && (
          <div className="fixed inset-0 z-0 flex flex-col items-center justify-center">
            <p className="font-display text-lg text-(--foreground)">Nothing connected yet.</p>
            <p className="mt-1 text-sm text-(--muted-foreground)">
              Create a Space and add sources to begin mapping your knowledge.
            </p>
            <Link
              href="/workspace"
              className="mt-4 rounded-xl border border-(--primary)/40 bg-(--primary)/10 px-5 py-2.5 text-sm font-medium text-(--primary) hover:bg-(--primary)/20"
            >
              Go to workspace
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}