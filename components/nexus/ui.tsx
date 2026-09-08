"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* NexusButton                                                        */
/* ------------------------------------------------------------------ */

type ButtonVariant = "default" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface NexusButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export function NexusButton({
  variant = "default",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: NexusButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        // sizes
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        // variants
        variant === "default" &&
          "bg-gradient-to-r from-(--glow-violet) via-(--glow-blue) to-(--glow-pink) text-white shadow-[0_0_24px_hsl(var(--glow-violet)/0.35)] hover:shadow-[0_0_36px_hsl(var(--glow-violet)/0.55)] hover:brightness-110 active:scale-[0.98]",
        variant === "outline" &&
          "border border-(--border) bg-(--card)/50 text-(--foreground) hover:border-(--primary)/50 hover:bg-(--card) hover:shadow-[0_0_20px_hsl(var(--glow-blue)/0.12)]",
        variant === "ghost" &&
          "text-(--muted-foreground) hover:bg-(--card) hover:text-(--foreground)",
        variant === "danger" &&
          "bg-red-500/15 text-red-300 border border-red-500/30 hover:bg-red-500/25",
        className
      )}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      )}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* GlassPanel                                                         */
/* ------------------------------------------------------------------ */

export function GlassPanel({
  className,
  strong = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { strong?: boolean }) {
  return (
    <div
      className={cn(
        strong ? "glass-strong" : "glass",
        "rounded-2xl transition-colors duration-300",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* GlowInput                                                          */
/* ------------------------------------------------------------------ */

export interface GlowInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leading?: ReactNode;
}

export const GlowInput = forwardRef<HTMLInputElement, GlowInputProps>(
  function GlowInput(
    { label, leading, className, id, ...props },
    ref
  ) {
    return (
      <label className="block space-y-1.5">
        {label && (
          <span className="text-xs font-medium uppercase tracking-widest text-(--muted-foreground)">
            {label}
          </span>
        )}
        <div className="relative">
          {leading && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--muted-foreground)">
              {leading}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full rounded-xl border border-(--border) bg-(--card)/60 px-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground)/60 transition-all focus:border-(--primary)/60 focus:bg-(--card) focus:outline-none focus:shadow-[0_0_0_1px_hsl(var(--primary)/0.4),0_0_24px_hsl(var(--glow-violet)/0.15)]",
              leading && "pl-9",
              className
            )}
            {...props}
          />
        </div>
      </label>
    );
  }
);

/* ------------------------------------------------------------------ */
/* SectionTitle                                                       */
/* ------------------------------------------------------------------ */

export function SectionTitle({
  children,
  className,
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "font-display text-xs uppercase tracking-[0.25em] text-(--muted-foreground)",
        className
      )}
    >
      {children}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/* StatusPill                                                         */
/* ------------------------------------------------------------------ */

export function StatusPill({
  status,
}: {
  status: "uploading" | "processing" | "indexing" | "analyzing" | "ready" | "failed" | "pending";
}) {
  const styles: Record<string, string> = {
    uploading: "border-amber-400/40 text-amber-300 bg-amber-400/10",
    processing: "border-blue-400/40 text-blue-300 bg-blue-400/10",
    indexing: "border-violet-400/40 text-violet-300 bg-violet-400/10",
    analyzing: "border-pink-400/40 text-pink-300 bg-pink-400/10",
    ready: "border-emerald-400/40 text-emerald-300 bg-emerald-400/10",
    failed: "border-red-400/40 text-red-300 bg-red-400/10",
    pending: "border-(--border) text-(--muted-foreground) bg-(--card)",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        styles[status]
      )}
    >
      {status === "ready" && (
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
      )}
      {(status === "uploading" || status === "processing" || status === "indexing" || status === "analyzing") && (
        <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      )}
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Logo                                                               */
/* ------------------------------------------------------------------ */

export function NexusLogo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex select-none items-center gap-2",
        className
      )}
    >
      <svg
        viewBox="0 0 32 32"
        className={cn("text-(--primary)", compact ? "h-6 w-6" : "h-8 w-8")}
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="nexus-g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--glow-pink))" />
            <stop offset="50%" stopColor="hsl(var(--glow-violet))" />
            <stop offset="100%" stopColor="hsl(var(--glow-cyan))" />
          </linearGradient>
        </defs>
        <circle
          cx="16"
          cy="16"
          r="6.5"
          stroke="url(#nexus-g)"
          strokeWidth="2.2"
          fill="hsl(var(--primary)/0.08)"
        />
        <ellipse
          cx="16"
          cy="16"
          rx="14"
          ry="5.2"
          stroke="url(#nexus-g)"
          strokeWidth="1.4"
          opacity="0.55"
          transform="rotate(-18 16 16)"
        />
        <ellipse
          cx="16"
          cy="16"
          rx="14"
          ry="5.2"
          stroke="url(#nexus-g)"
          strokeWidth="1.4"
          opacity="0.55"
          transform="rotate(36 16 16)"
        />
        <circle cx="16" cy="16" r="2.4" fill="url(#nexus-g)" />
      </svg>
      {!compact && (
        <span className="font-display text-lg font-bold tracking-[0.2em] chrome-text">
          NEXUS
        </span>
      )}
    </span>
  );
}