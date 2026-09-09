"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Zap,
  Telescope,
  GraduationCap,
  Briefcase,
  Palette,
  Send,
  FileText,
  Network,
} from "lucide-react";
import type { AiMode, AiMessage } from "@/types";
import { cn } from "@/lib/utils";
import { AiInput } from "@/components/nexus/ai-input";

const MODES: { key: AiMode; label: string; icon: typeof Zap }[] = [
  { key: "quick", label: "Quick", icon: Zap },
  { key: "deep", label: "Deep", icon: Telescope },
  { key: "research", label: "Research", icon: Sparkles },
  { key: "teach", label: "Teach", icon: GraduationCap },
  { key: "executive", label: "Executive", icon: Briefcase },
  { key: "creative", label: "Creative", icon: Palette },
];

/** Parsed SSE event from the chat API */
type ChatEvent =
  | { type: "meta"; conversationId?: string; mode?: string; provider?: string | null; web?: boolean }
  | { type: "delta"; content: string }
  | { type: "done" }
  | { type: "complete" }
  | { type: "error"; error: string };

export function ChatView({
  spaceId,
  conversationId,
  initialMessages,
  initialMode,
  probePrompt,
  onConversationCreated,
  onPromptConsumed,
  compact = false,
  onConversationChanged,
}: {
  spaceId: string;
  conversationId: string | null;
  initialMessages?: AiMessage[];
  initialMode?: AiMode | null;
  probePrompt?: string | null;
  onConversationCreated?: (id: string) => void;
  onConversationChanged?: (id: string) => void;
  onPromptConsumed?: () => void;
  compact?: boolean;
}) {
  const [mode, setMode] = useState<AiMode>(initialMode ?? "quick");
  const [messages, setMessages] = useState<AiMessage[]>(initialMessages ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<{ provider: string | null; web: boolean }>({
    provider: null,
    web: false,
  });
  const bottomRef = useRef<HTMLDivElement>(null);
  const [lastContext, setLastContext] = useState<AiMessage["context"] | null>(null);
  const remainingProbe = probePrompt ?? null;
  const probeUsed = useRef(false);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  // Consume an incoming probe prompt (from workspace Ask or elsewhere)
  useEffect(() => {
    if (remainingProbe && !probeUsed.current) {
      probeUsed.current = true;
      onPromptConsumed?.();
      const t = setTimeout(() => submit(remainingProbe, initialMode ?? undefined), 350);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingProbe]);

  async function submit(prompt: string, m?: AiMode) {
    const useMode = m ?? mode;
    const question = prompt.trim();
    if (!question) return;

    setError(null);
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: question, createdAt: new Date().toISOString() },
      { id: crypto.randomUUID(), role: "assistant", content: "", createdAt: new Date().toISOString() },
    ]);

    let acc = "";
    const updateLast = (delta: string) => {
      acc += delta;
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last && last.role === "assistant") {
          next[next.length - 1] = { ...last, content: acc };
        }
        return next;
      });
    };

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spaceId, question, mode: useMode, conversationId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          setError("Your session expired. Please sign in again.");
        } else {
          setError(data.error ?? "NEXUS could not answer. Try again.");
        }
        setMessages((prev) => prev.slice(0, -1));
        setLoading(false);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";
        for (const part of parts) {
          if (!part.startsWith("data:")) continue;
          try {
            const ev = JSON.parse(part.slice(5).trim()) as ChatEvent;
            if (ev.type === "meta") {
              setAiStatus({ provider: ev.provider ?? null, web: Boolean(ev.web) });
              if (ev.conversationId && ev.conversationId !== conversationId) {
                onConversationCreated?.(ev.conversationId);
                onConversationChanged?.(ev.conversationId);
              }
            } else if (ev.type === "delta") {
              updateLast(ev.content);
            } else if (ev.type === "error") {
              setError(ev.error);
              setMessages((prev) => prev.slice(0, -1));
            }
          } catch {
            /* ignore partial */
          }
        }
      }
      setLoading(false);
    } catch {
      setError("Could not reach NEXUS. Check your connection and try again.");
      setMessages((prev) => prev.slice(0, -1));
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Mode selector (compact row) */}
      <div className="flex flex-wrap items-center gap-1 border-b border-(--border)/50 px-4 py-2.5">
        {MODES.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              className={cn(
                "flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] transition-all cursor-pointer",
                mode === m.key
                  ? "bg-(--primary)/15 text-(--primary)"
                  : "text-(--muted-foreground) hover:bg-(--card) hover:text-(--foreground)"
              )}
            >
              <Icon size={12} />
              {m.label}
            </button>
          );
        })}
        <span className="ml-auto flex items-center gap-1 text-[10px] text-(--muted-foreground)/70">
          {aiStatus.provider && (
            <span className="inline-flex items-center gap-1 rounded-full border border-(--glow-cyan)/25 bg-(--glow-cyan)/8 px-2 py-0.5 font-medium text-(--muted-foreground)">
              <span className="h-1 w-1 rounded-full bg-(--glow-cyan)" />
              AI online
            </span>
          )}
          {aiStatus.web && (
            <span className="inline-flex items-center gap-1 rounded-full border border-(--glow-violet)/25 bg-(--glow-violet)/8 px-2 py-0.5 font-medium text-(--muted-foreground)">
              ● Web research
            </span>
          )}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !loading ? (
          <EmptyChat onPick={submit} />
        ) : (
          messages.map((m, i) => (
            <MessageRow key={m.id} message={m} streaming={loading && i === messages.length - 1 && m.role === "assistant"} />
          ))
        )}
        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-(--border)/50 p-3">
        {!compact && (
          <AiInput
            onSubmit={submit}
            placeholder="Ask NEXUS anything in this Space..."
            className="mb-1"
          />
        )}
        {compact && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const v = (fd.get("prompt") as string) ?? "";
              if (v.trim()) {
                submit(v);
                e.currentTarget.reset();
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              name="prompt"
              placeholder="Ask NEXUS..."
              disabled={loading}
              className="flex-1 rounded-xl border border-(--border) bg-(--card)/60 px-3 py-2 text-sm text-(--foreground) placeholder:text-(--muted-foreground)/60 focus:border-(--primary)/50 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={loading}
              className="rounded-lg bg-gradient-to-r from-(--glow-violet) to-(--glow-blue) p-2.5 text-white transition-all hover:brightness-110 disabled:opacity-40 cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function MessageRow({
  message,
  streaming,
}: {
  message: AiMessage;
  streaming?: boolean;
}) {
  const isUser = message.role === "user";

  // Parse citation markers [Source: X] into chips
  const parts = splitCitations(message.content);
  const context = message.context;

  return (
    <div className={cn("flex flex-col gap-1.5", isUser ? "items-end" : "items-start")}>
      {!isUser && (
        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-(--muted-foreground)">
          <Sparkles size={11} className="text-(--primary)" />
          NEXUS
        </span>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-md bg-gradient-to-r from-(--glow-violet)/25 to-(--glow-blue)/25 text-(--foreground)"
            : "rounded-bl-md glass text-(--foreground)"
        )}
      >
        {parts.length === 0 ? (
          <ContentBlock content={message.content} />
        ) : (
          parts.map((p, i) =>
            p.citation ? (
              <CitationChip key={i} title={p.text} />
            ) : (
              <ContentBlock key={i} content={p.text} />
            )
          )
        )}
        {streaming && <TypingDots />}
      </div>

      {/* Grounding: sources + concepts */}
      {!isUser && context && (context.sources.length > 0 || context.concepts.length > 0) && (
        <div className="mt-1 flex max-w-[90%] flex-wrap gap-1.5">
          {context.sources.slice(0, 3).map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1 rounded-full border border-(--primary)/25 bg-(--primary)/8 px-2 py-0.5 text-[10px] text-(--primary)"
              title={s.url ?? undefined}
            >
              <FileText size={9} />
              {s.title}
            </span>
          ))}
          {context.concepts.slice(0, 4).map((c) => (
            <span
              key={c.id ?? c.name}
              className="inline-flex items-center gap-1 rounded-full border border-(--glow-cyan)/25 bg-(--glow-cyan)/8 px-2 py-0.5 text-[10px] text-(--muted-foreground)"
            >
              <Network size={9} />
              {c.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ContentBlock({ content }: { content: string }) {
  if (!content) return null;
  return <div className="whitespace-pre-wrap">{content}</div>;
}

function CitationChip({ title }: { title: string }) {
  return (
    <span className="mx-0.5 inline-flex translate-y-[1px] items-center gap-1 rounded-full border border-(--primary)/30 bg-(--primary)/10 px-2 py-0.5 align-middle text-[10px] font-medium text-(--primary)">
      <FileText size={9} />
      {title}
    </span>
  );
}

/** Split "…text [Source: X] …" into text/citation segments */
function splitCitations(content: string): { text: string; citation: boolean }[] {
  const re = /\[Source: ([^\]]+)\]/g;
  const out: { text: string; citation: boolean }[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    if (m.index > last) out.push({ text: content.slice(last, m.index), citation: false });
    out.push({ text: m[1], citation: true });
    last = m.index + m[0].length;
  }
  if (last < content.length) out.push({ text: content.slice(last), citation: false });
  return out;
}

function TypingDots() {
  return (
    <span className="mt-1.5 flex items-center gap-1" aria-label="NEXUS is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-(--primary)"
          style={{ animation: "typing 1s ease-in-out infinite", animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

const PROBES = [
  "What are the most important concepts in this Space?",
  "Explain the single most important idea here.",
  "What am I missing?",
  "Find contradictions between my sources.",
  "Turn this into revision notes.",
  "What should I explore next?",
];

function EmptyChat({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-(--primary)/25 bg-(--primary)/8">
        <Sparkles size={20} className="text-(--primary)" />
      </div>
      <p className="font-display text-sm font-semibold text-(--foreground)">
        This Space is listening.
      </p>
      <p className="mt-1 max-w-xs text-xs text-(--muted-foreground)">
        Ask about your sources, request explanations, or discover connections.
      </p>
      <div className="mt-4 flex max-w-sm flex-col gap-1.5">
        {PROBES.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPick(p)}
            className="rounded-lg border border-(--border) bg-(--card)/40 px-3 py-1.5 text-left text-xs text-(--muted-foreground) transition-all hover:border-(--primary)/30 hover:text-(--foreground) cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}