import type { AiMode } from "@/types";

/**
 * AIProvider abstraction.
 *
 * The rest of NEXUS talks to this interface, never to a specific vendor.
 * Swapping OpenAI for Anthropic, Gemini or a local model only requires a
 * new implementation of `chat()`.
 */

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  mode: AiMode;
  temperature?: number;
  maxTokens?: number;
}

export interface AIProvider {
  name: string;
  /** Streams a chat completion, yielding tokens via onToken and returning the full text. */
  stream(options: {
    messages: ChatMessage[];
    mode: AiMode;
    signal?: AbortSignal;
    onToken?: (token: string) => void;
  }): Promise<string>;
}

/** System prompt scaffolding per AI mode */
export function modeSystemPrompt(mode: AiMode): string {
  const base =
    "You are NEXUS, a knowledge intelligence layer inside a user's private workspace. " +
    "You reason over the user's own sources, concepts and knowledge graph. " +
    "Only claim a fact comes from a source when you were given that source's content. " +
    "Answer in the language the user writes in.";

  const modeAdditions: Record<AiMode, string> = {
    quick:
      "MODE: QUICK. Be concise. Direct answer first, minimal elaboration. No fluff.",
    deep:
      "MODE: DEEP. Reason carefully. Connect across the user's sources. Note supporting evidence, reasoning chains, and limitations of your answer.",
    research:
      "MODE: RESEARCH. Prioritize the user's sources. Compare sources, flag uncertainty, and clearly identify contradictions between them. Attribute claims to specific sources using [Source: Title]. If sources disagree, say so explicitly.",
    teach:
      "MODE: TEACH. Explain step by step using examples and analogies. Adapt to the indicated level. End with one practice question.",
    executive:
      "MODE: EXECUTIVE. Ultra-concise. Lead with the headline. Then decisions, risks, and recommended actions in bullets.",
    creative:
      "MODE: CREATIVE. Brainstorm. Generate alternative framings and unconventional connections, while staying grounded in the user's material.",
  };

  return `${base}\n${modeAdditions[mode]}\n\nFormat guidelines:\n- Use short paragraphs and terse bullet lists where helpful.\n- Cite user sources inline like [Source: Title]. Only cite sources provided in context.\n- At the end, if useful, add a 'Explore next' question.\n- Never invent sources. If context provides none, rely on general knowledge and say so.`;
}

/**
 * Detects an AI provider from environment config.
 * Returns null if none is configured, so callers can degrade gracefully.
 */
export function resolveAIProvider(): AIProvider | null {
  if (process.env.AI_API_KEY) {
    return new OpenAICompatibleProvider({
      apiKey: process.env.AI_API_KEY,
      baseUrl: process.env.AI_BASE_URL ?? "https://api.openai.com/v1",
      model: process.env.AI_MODEL ?? "gpt-4o-mini",
    });
  }
  // Anthropic-style config
  if (process.env.ANTHROPIC_API_KEY) {
    return new AnthropicProvider({
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514",
    });
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* OpenAI-compatible provider (also works with local / compatible)     */
/* ------------------------------------------------------------------ */

class OpenAICompatibleProvider implements AIProvider {
  name = "openai-compatible";
  constructor(
    private cfg: {
      apiKey: string;
      baseUrl: string;
      model: string;
    }
  ) {}

  async stream({
    messages,
    mode,
    signal,
    onToken,
  }: {
    messages: ChatMessage[];
    mode: AiMode;
    signal?: AbortSignal;
    onToken?: (token: string) => void;
  }): Promise<string> {
    const system = modeSystemPrompt(mode);

    const res = await fetch(`${this.cfg.baseUrl}/chat/completions`, {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: this.cfg.model,
        stream: true,
        messages: [{ role: "system", content: system }, ...messages],
        temperature: mode === "creative" ? 0.9 : 0.3,
      }),
    });

    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => "");
      throw new Error(`AI request failed (${res.status}): ${text.slice(0, 300)}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Parse SSE lines
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") continue;
        try {
          const json = JSON.parse(payload);
          const delta = json?.choices?.[0]?.delta?.content ?? "";
          if (delta) {
            full += delta;
            onToken?.(delta);
          }
        } catch {
          /* ignore partial JSON */
        }
      }
    }

    return full;
  }
}

/* ------------------------------------------------------------------ */
/* Anthropic provider                                                  */
/* ------------------------------------------------------------------ */

class AnthropicProvider implements AIProvider {
  name = "anthropic";
  constructor(
    private cfg: {
      apiKey: string;
      model: string;
    }
  ) {}

  async stream({
    messages,
    mode,
    signal,
    onToken,
  }: {
    messages: ChatMessage[];
    mode: AiMode;
    signal?: AbortSignal;
    onToken?: (token: string) => void;
  }): Promise<string> {
    const system = modeSystemPrompt(mode);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.cfg.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.cfg.model,
        max_tokens: 2048,
        system,
        messages: messages
          .filter((m) => m.role !== "system")
          .map((m) => ({
            role: m.role,
            content: m.content,
          })),
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`AI request failed (${res.status}): ${text.slice(0, 300)}`);
    }

    const data = await res.json();
    const content: string = (data?.content ?? [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("");
    onToken?.(content);
    return content;
  }
}