"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import type { Space, AiMessage, AiMode } from "@/types";
import { ChatView } from "./chat-view";
import { cn } from "@/lib/utils";

/**
 * Right-hand NEXUS intelligence panel.
 * A persistent presence inside the Space — not a separate chatbot page.
 */
export function IntelligencePanel({
  space,
  probePrompt,
  initialMode,
  onPromptConsumed,
}: {
  space: Space;
  probePrompt?: string | null;
  initialMode?: AiMode | null;
  onPromptConsumed?: () => void;
}) {
  // Desktop starts open; on mobile the panel is a full-screen sheet and
  // starts closed so the Space content is visible first.
  const [open, setOpen] = useState(false);
  const [liveConversationId, setLiveConversationId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<AiMessage[]>([]);

  useEffect(() => {
    if (window.innerWidth >= 768) setOpen(true);
  }, []);

  // Allow the space page's mobile top bar to open this sheet.
  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("nexus:open-ai", onOpen);
    return () => window.removeEventListener("nexus:open-ai", onOpen);
  }, []);

  // A routed "Ask NEXUS" query must open the panel so the answer is visible.
  useEffect(() => {
    if (probePrompt) setOpen(true);
  }, [probePrompt]);

  return (
    <>
      {/* Floating launcher when panel is collapsed */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-6 z-30 flex items-center gap-2 rounded-full bg-gradient-to-r from-(--glow-violet) to-(--glow-blue) px-4 py-3 text-sm font-medium text-white shadow-[0_0_30px_hsl(var(--glow-violet)/0.4)] transition-all hover:shadow-[0_0_40px_hsl(var(--glow-violet)/0.6)] active:scale-95 cursor-pointer md:bottom-6"
        >
          <Sparkles size={15} />
          Ask NEXUS
        </button>
      )}

      <aside
        className={cn(
          "fixed inset-0 z-[60] flex h-full w-full flex-col bg-(--card)/95 backdrop-blur-xl md:relative md:inset-auto md:z-10 md:w-[360px] md:shrink-0 md:border-l md:border-(--border)/60 md:bg-(--card)/30"
        )}
        style={{ display: open ? "flex" : "none" }}
        aria-label="NEXUS intelligence panel"
      >
        <div className="flex items-center justify-between border-b border-(--border)/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-(--primary)/15">
              <Sparkles size={13} className="text-(--primary)" />
            </span>
            <div>
              <p className="text-sm font-semibold text-(--foreground) leading-none">NEXUS</p>
              <p className="text-[10px] text-(--muted-foreground)">inside {space.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Collapse panel"
            className="rounded-lg p-1.5 text-(--muted-foreground) transition-colors hover:bg-(--card) hover:text-(--foreground) cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <div className="min-h-0 flex-1">
          <ChatView
            spaceId={space.id}
            conversationId={liveConversationId}
            initialMessages={initialMessages}
            initialMode={initialMode ?? null}
            probePrompt={probePrompt}
            onPromptConsumed={onPromptConsumed}
            onConversationCreated={(id) => setLiveConversationId(id)}
            compact
          />
        </div>
      </aside>
    </>
  );
}