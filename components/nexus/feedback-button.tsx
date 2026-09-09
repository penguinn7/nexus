"use client";

import { useState } from "react";
import { Check, Loader2, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Corner "Send feedback" control. Opens a small dialog that posts to
 * /api/feedback so the builder can read what users want in Settings.
 */
export function FeedbackButton({
  iconOnly = false,
  className,
}: {
  iconOnly?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (content.trim().length < 3 || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), page: window.location.pathname }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not send feedback.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error — try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {iconOnly ? (
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setContent("");
            setError(null);
            setOpen(true);
          }}
          aria-label="Send feedback"
          title="Send feedback"
          className="rounded-lg p-1.5 text-(--muted-foreground) transition-colors hover:bg-(--card) hover:text-(--foreground) cursor-pointer"
        >
          <MessageCircle size={16} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setContent("");
            setError(null);
            setOpen(true);
          }}
          className={cn(
            "flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm text-(--muted-foreground) transition-colors hover:bg-(--card) hover:text-(--foreground) cursor-pointer",
            className
          )}
        >
          <MessageCircle size={16} />
          Send feedback
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[65] flex items-end justify-center p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl glass-strong p-5 shadow-[0_0_80px_hsl(var(--glow-violet)/0.25)] animate-scale-in">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-lg p-1.5 text-(--muted-foreground) transition-colors hover:bg-(--card) hover:text-(--foreground) cursor-pointer"
            >
              <X size={16} />
            </button>

            {sent ? (
              <div className="py-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-(--primary)/15">
                  <Check size={24} className="text-(--primary)" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-(--foreground)">
                  Thanks for the feedback
                </h3>
                <p className="mt-1 text-sm text-(--muted-foreground)">
                  NEXUS will grow a little faster because of it.
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-5 rounded-xl border border-(--primary)/40 bg-(--primary)/10 px-5 py-2 text-sm font-medium text-(--primary) hover:bg-(--primary)/20 cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-display text-lg font-semibold text-(--foreground)">
                  Send feedback
                </h3>
                <p className="mt-1 text-sm text-(--muted-foreground)">
                  A bug, a wish, an idea — it goes straight to the builder.
                </p>
                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    autoFocus
                    placeholder="e.g. I want to copy a source link, or the app is slow on…"
                    className="w-full resize-none rounded-xl border border-(--border) bg-(--card)/60 px-3.5 py-3 text-sm text-(--foreground) outline-none transition-colors placeholder:text-(--muted-foreground)/70 focus:border-(--primary)/50"
                  />
                  {error && <p className="text-xs text-red-300">{error}</p>}
                  <button
                    type="submit"
                    disabled={busy || content.trim().length < 3}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-(--glow-violet) to-(--glow-blue) px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_24px_hsl(var(--glow-violet)/0.35)] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                  >
                    {busy ? <Loader2 size={15} className="animate-spin" /> : <MessageCircle size={15} />}
                    Send feedback
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}