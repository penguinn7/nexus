"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import type { Space, AiMessage } from "@/types";
import { ChatView } from "./chat-view";
import { cn } from "@/lib/utils";

/**
 * Right-hand NEXUS intelligence panel.
 * A persistent presence inside the Space — not a separate chatbot page.
 */
export function IntelligencePanel({
  space,
  probePrompt,
  onPromptConsumed,
}: {
  space: Space;
  probePrompt?: string | null;
  onPromptConsumed?: () => void;
}) {
  const [open, setOpen] = useState(true);
  const [liveConversationId, setLiveConversationId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<AiMessage[]>([]);

  return (
    <>
      {/* Floating launcher when panel is collapsed */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-gradient-to-r from-(--glow-violet) to-(--glow-blue) px-4 py-3 text-sm font-medium text-white shadow-[0_0_30px_hsl(var(--glow-violet)/0.4)] transition-all hover:shadow-[0_0_40px_hsl(var(--glow-violet)/0.6)] active:scale-95 cursor-pointer"
        >
          <Sparkles size={15} />
          Ask NEXUS
        </button>
      )}

      <aside
        className={cn(
          "relative z-10 flex h-full w-[360px] shrink-0 flex-col border-l border-(--border)/60 bg-(--card)/30 backdrop-blur-xl transition-all duration-300",
          open ? "translate-x-0" : "translate-x-full"
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