"use client";

import Link from "next/link";
import {
  FileText,
  Network,
  BookOpen,
  MessageSquare,
  Sparkles,
  Briefcase,
  Puzzle,
  User,
  type LucideIcon,
} from "lucide-react";
import type { SpaceWithStats } from "@/types";
import { getTheme } from "@/lib/themes";
import { cn, timeAgo } from "@/lib/utils";

const TYPE_HUMAN: Record<string, string> = {
  student: "Student",
  research: "Research",
  business: "Business",
  office: "Office",
  personal: "Personal",
  creative: "Creative",
  custom: "Custom",
};

const TYPE_ICON: Record<string, LucideIcon> = {
  student: BookOpen,
  research: Sparkles,
  business: Briefcase,
  office: FileText,
  personal: User,
  creative: Puzzle,
  custom: Network,
};

export function SpaceCard({ space }: { space: SpaceWithStats }) {
  const theme = getTheme(space.theme);
  const Icon = TYPE_ICON[space.type] ?? Network;

  return (
    <Link
      href={`/space/${space.id}`}
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden rounded-2xl glass p-5 transition-all duration-300 glass-hover",
        "hover:-translate-y-0.5"
      )}
    >
      {/* Theme accent */}
      <div
        className={cn(
          "absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-25 blur-2xl transition-opacity duration-500 group-hover:opacity-50"
        )}
        style={{
          background: `linear-gradient(135deg, hsl(${theme.vars["--glow-pink"]}), hsl(${theme.vars["--glow-violet"]}), hsl(${theme.vars["--glow-cyan"]}))`,
        }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl border"
            style={{
              borderColor: `hsl(${theme.vars["--glow-violet"]} / 0.4)`,
              background: `hsl(${theme.vars["--glow-violet"]} / 0.1)`,
              color: `hsl(${theme.vars["--glow-pink"]})`,
            }}
          >
            <Icon size={20} />
          </span>
          <div>
            <h3 className="font-display text-base font-semibold text-(--foreground) group-hover:text-white">
              {space.name}
            </h3>
            <p className="text-xs text-(--muted-foreground)">
              {TYPE_HUMAN[space.type] ?? "Custom"}
            </p>
          </div>
        </div>
        <span
          className="mt-1 h-2 w-2 rounded-full"
          style={{
            background: `linear-gradient(135deg, hsl(${theme.vars["--glow-pink"]}), hsl(${theme.vars["--glow-cyan"]}))`,
          }}
          title={theme.name}
        />
      </div>

      {space.description && (
        <p className="line-clamp-2 text-sm text-(--muted-foreground)">
          {space.description}
        </p>
      )}

      <div className="mt-auto grid grid-cols-4 gap-2 text-center">
        <Stat icon={FileText} label="Sources" value={Number(space.source_count ?? 0)} />
        <Stat icon={Network} label="Concepts" value={Number(space.concept_count ?? 0)} />
        <Stat icon={Sparkles} label="Links" value={Number(space.connection_count ?? 0)} />
        <Stat icon={BookOpen} label="Notes" value={Number(space.note_count ?? 0)} />
      </div>

      {space.recent_activity && (
        <p className="text-[11px] text-(--muted-foreground)/70">
          {timeAgo(space.recent_activity)}
        </p>
      )}
    </Link>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-lg bg-(--background)/40 px-1 py-2">
      <Icon size={13} className="text-(--muted-foreground)" />
      <span className="text-sm font-semibold text-(--foreground)">
        {value.toLocaleString()}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-(--muted-foreground)">
        {label}
      </span>
    </div>
  );
}