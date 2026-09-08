"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Plus, Trash2, Sparkles } from "lucide-react";
import type { Conversation, AiMessage } from "@/types";
import { timeAgo } from "@/lib/utils";
import { ChatView } from "./chat-view";
import { cn } from "@/lib/utils";

export function ConversationsTab({
  spaceId,
  conversations,
  activeConversationId,
  onSelectConversation,
}: {
  spaceId: string;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string | null) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(activeConversationId);
  const [loadedMessages, setLoadedMessages] = useState<AiMessage[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    onSelectConversation(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) {
      setLoadedMessages([]);
      return;
    }
    let cancelled = false;
    setLoadingMsgs(true);
    fetch(`/api/conversations/${selectedId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setLoadedMessages(data.messages ?? []);
          setLoadingMsgs(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadedMessages([]);
          setLoadingMsgs(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  async function handleDelete(id: string) {
    setDeleting(id);
    const res = await fetch(`/api/conversations/${id}`, { method: "DELETE" });
    setDeleting(null);
    if (res.ok) {
      if (selectedId === id) setSelectedId(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.25em] text-(--muted-foreground)">
            Conversations
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-(--foreground)">
            Talks with NEXUS
          </h1>
          <p className="mt-1 text-sm text-(--muted-foreground)">
            Every conversation is grounded in this Space's knowledge.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Conversation list */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="flex w-full items-center gap-2.5 rounded-xl border border-(--primary)/30 bg-(--primary)/8 px-3.5 py-2.5 text-sm font-medium text-(--foreground) transition-all hover:border-(--primary)/60 hover:bg-(--primary)/15 cursor-pointer"
          >
            <Plus size={15} className="text-(--primary)" />
            New conversation
          </button>

          {conversations.length === 0 && (
            <p className="rounded-xl border border-(--border) bg-(--card)/40 px-3.5 py-3 text-xs text-(--muted-foreground)">
              No conversations yet. Start one — NEXUS is ready.
            </p>
          )}

          {conversations.map((c) => (
            <div
              key={c.id}
              className={cn(
                "group flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2.5 transition-all",
                selectedId === c.id
                  ? "border-(--primary)/40 bg-(--primary)/12"
                  : "border-(--border) bg-(--card)/40 hover:border-(--primary)/30"
              )}
              onClick={() => setSelectedId(c.id)}
            >
              <MessageSquare size={14} className={selectedId === c.id ? "text-(--primary)" : "text-(--muted-foreground)"} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-(--foreground)">{c.title}</p>
                <p className="text-[10px] text-(--muted-foreground)">{timeAgo(c.created_at)}</p>
              </div>
              <button
                type="button"
                aria-label="Delete conversation"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(c.id);
                }}
                disabled={deleting === c.id}
                className="rounded-lg p-1.5 text-(--muted-foreground) opacity-0 transition-all hover:bg-red-500/10 hover:text-red-300 group-hover:opacity-100 disabled:opacity-40 cursor-pointer"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>

        {/* Chat area */}
        <div className="h-[70vh] overflow-hidden rounded-2xl glass-strong">
          {loadingMsgs ? (
            <div className="flex h-full items-center justify-center text-sm text-(--muted-foreground)">
              Loading...
            </div>
          ) : (
            <ChatView
              spaceId={spaceId}
              conversationId={selectedId}
              initialMessages={selectedId ? loadedMessages : []}
              onConversationCreated={(id) => setSelectedId(id)}
              compact
            />
          )}
        </div>
      </div>
    </div>
  );
}