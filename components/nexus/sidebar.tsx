"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Plus,
  Sparkles,
  Compass,
  Network,
  Settings,
  LogOut,
  Search,
} from "lucide-react";
import { NexusLogo } from "./ui";
import { FeedbackButton } from "./feedback-button";
import type { Space } from "@/types";
import { cn } from "@/lib/utils";

export function Sidebar({
  spaces,
  onNewSpace,
  drawer = false,
}: {
  spaces: Space[];
  onNewSpace: () => void;
  drawer?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const navItems = [
    { href: "/workspace", label: "Explore", icon: Compass },
    { href: "/graph", label: "Knowledge Graph", icon: Network },
  ];

  async function handleSignOut() {
    setSigningOut(true);
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (res.ok) {
      router.push("/login");
      router.refresh();
    }
    setSigningOut(false);
  }

  const recentSpaces = spaces.slice(0, 5);

  return (
    <aside
    className={cn(
      "h-full w-64 shrink-0 flex-col border-r border-(--border)/60 bg-(--card)/40 backdrop-blur-xl",
      drawer ? "flex" : "hidden lg:flex"
    )}
  >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 pb-4 pt-5">
        <Link href="/workspace" className="flex items-center gap-2">
          <NexusLogo compact />
          <span className="font-display text-sm font-bold tracking-[0.2em] chrome-text">
            NEXUS
          </span>
        </Link>
      </div>

      {/* New Space */}
      <div className="px-3">
        <button
          type="button"
          onClick={onNewSpace}
          className="flex w-full items-center gap-2.5 rounded-xl border border-(--primary)/30 bg-gradient-to-r from-(--glow-violet)/20 to-(--glow-blue)/20 px-3.5 py-2.5 text-sm font-medium text-(--foreground) transition-all duration-300 hover:border-(--primary)/60 hover:shadow-[0_0_24px_hsl(var(--glow-violet)/0.25)] active:scale-[0.98] cursor-pointer"
        >
          <Plus size={16} className="text-(--primary)" />
          New Space
        </button>

        {/* Quick search triggers the OS-style command */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("nexus:command-open"))}
          className="mt-2 flex w-full items-center gap-2.5 rounded-xl border border-(--border) bg-(--card)/60 px-3.5 py-2.5 text-sm text-(--muted-foreground) transition-colors hover:border-(--primary)/40 hover:text-(--foreground) cursor-pointer"
          aria-label="Open command center"
        >
          <Search size={15} />
          <span className="flex-1 text-left">Search &amp; commands</span>
          <kbd className="rounded border px-1.5 py-0.5 text-[10px] text-(--muted-foreground)">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Nav */}
      <nav className="mt-5 flex-1 space-y-0.5 overflow-y-auto px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm transition-colors",
                active
                  ? "bg-(--primary)/12 text-(--foreground)"
                  : "text-(--muted-foreground) hover:bg-(--card) hover:text-(--foreground)"
              )}
            >
              <Icon size={16} className={active ? "text-(--primary)" : ""} />
              {item.label}
            </Link>
          );
        })}

        {recentSpaces.length > 0 && (
          <div className="mt-6">
            <p className="px-3.5 pb-1 font-display text-[10px] uppercase tracking-[0.2em] text-(--muted-foreground)">
              Recent Spaces
            </p>
            <div className="space-y-0.5">
              {recentSpaces.map((s) => {
                const active = pathname === `/space/${s.id}`;
                return (
                  <Link
                    key={s.id}
                    href={`/space/${s.id}`}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-3.5 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-(--primary)/12 text-(--foreground)"
                        : "text-(--muted-foreground) hover:bg-(--card) hover:text-(--foreground)"
                    )}
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-(--glow-pink) to-(--glow-cyan)" />
                    <span className="truncate">{s.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-(--border)/60 p-3">
        <Link
          href="/settings"
          className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm text-(--muted-foreground) transition-colors hover:bg-(--card) hover:text-(--foreground)"
        >
          <Settings size={16} />
          Settings
        </Link>
        <FeedbackButton className="w-full" />
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm text-(--muted-foreground) transition-colors hover:bg-(--card) hover:text-red-300 disabled:opacity-50 cursor-pointer"
        >
          <LogOut size={16} />
          {signingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </aside>
  );
}