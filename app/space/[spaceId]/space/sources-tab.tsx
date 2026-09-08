"use client";

import { useState } from "react";
import {
  FileText,
  Link2,
  Type,
  Plus,
  Trash2,
  Globe,
} from "lucide-react";
import type { Source } from "@/types";
import { cn, timeAgo } from "@/lib/utils";
import { StatusPill } from "@/components/nexus/ui";

function SourceIcon({ type }: { type: string }) {
  const cls = "h-4 w-4";
  if (type === "url") return <Link2 size={14} className={cls} />;
  if (type === "text") return <Type size={14} className={cls} />;
  return <FileText size={14} className={cls} />;
}

export function SourcesTab({
  spaceId,
  sources,
  onAdd,
}: {
  spaceId: string;
  sources: Source[];
  onAdd: () => void;
}) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.25em] text-(--muted-foreground)">
            Sources
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-(--foreground)">
            Knowledge inputs
          </h1>
          <p className="mt-1 text-sm text-(--muted-foreground)">
            Everything NEXUS can read and connect.
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-(--glow-violet) to-(--glow-blue) px-4 py-2.5 text-sm font-medium text-white shadow-[0_0_20px_hsl(var(--glow-violet)/0.3)] transition-all hover:shadow-[0_0_30px_hsl(var(--glow-violet)/0.5)] active:scale-[0.98] cursor-pointer"
        >
          <Plus size={15} />
          Add source
        </button>
      </div>

      <div className="mt-6 space-y-2.5">
        {sources.length === 0 ? (
          <div className="rounded-3xl glass-strong p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-(--primary)/25 bg-(--primary)/8">
              <FileText size={24} className="text-(--primary)" />
            </div>
            <h3 className="font-display text-lg font-semibold text-(--foreground)">
              No sources yet.
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-(--muted-foreground)">
              Give NEXUS something to read — a PDF, a webpage or your own
              notes. It will extract the concepts and wire them into the graph.
            </p>
            <button
              type="button"
              onClick={onAdd}
              className="mt-5 rounded-xl border border-(--primary)/40 bg-(--primary)/10 px-5 py-2.5 text-sm font-medium text-(--primary) transition-all hover:bg-(--primary)/20 cursor-pointer"
            >
              Add your first source
            </button>
          </div>
        ) : (
          sources.map((s) => (
            <SourceRow key={s.id} source={s} />
          ))
        )}
      </div>
    </div>
  );
}

function SourceRow({ source }: { source: Source }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/sources/${source.id}`, { method: "DELETE" });
    if (res.ok) {
      window.location.reload();
    } else {
      setDeleting(false);
    }
  }

  return (
    <div className="group flex items-center gap-3 rounded-xl glass p-4 transition-all duration-300 glass-hover">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--primary)/10 text-(--primary)">
        <SourceIcon type={source.source_type} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-(--foreground)">{source.title}</p>
          <StatusPill status={source.status} />
        </div>
        <p className="mt-0.5 flex items-center gap-2 text-[11px] text-(--muted-foreground)">
          {source.source_type === "url" ? (
            <span className="flex items-center gap-1 truncate">
              <Globe size={10} />
              <span className="truncate">{source.url}</span>
            </span>
          ) : (
            "Added " + timeAgo(source.created_at)
          )}
        </p>
      </div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        aria-label={`Delete ${source.title}`}
        className="rounded-lg p-2 text-(--muted-foreground) opacity-0 transition-all hover:bg-red-500/10 hover:text-red-300 group-hover:opacity-100 disabled:opacity-40 cursor-pointer"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}