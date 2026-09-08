/**
 * EmbeddingProvider abstraction.
 * Generates vector embeddings for document chunks and queries.
 * Implementations: OpenAI-compatible API (default), or null when
 * no key is configured (in which case search falls back to keywords).
 */

export interface EmbeddingProvider {
  name: string;
  dimension: number;
  embed(texts: string[]): Promise<number[][]>;
}

class OpenAIEmbeddingProvider implements EmbeddingProvider {
  name = "openai-compatible";
  dimension = 1536;
  constructor(
    private cfg: {
      apiKey: string;
      baseUrl: string;
      model: string;
    }
  ) {}

  async embed(texts: string[]): Promise<number[][]> {
    const res = await fetch(`${this.cfg.baseUrl}/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: this.cfg.model,
        input: texts,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Embedding request failed (${res.status}): ${text.slice(0, 300)}`);
    }

    const data = await res.json();
    const out: number[][] = (data.data ?? []).map((d: { embedding: number[] }) =>
      d.embedding
    );
    if (out.length !== texts.length) {
      throw new Error("Embedding count mismatch");
    }
    return out;
  }
}

/** Returns the configured embedding provider, or null. */
export function resolveEmbeddingProvider(): EmbeddingProvider | null {
  if (process.env.EMBEDDING_API_KEY) {
    return new OpenAIEmbeddingProvider({
      apiKey: process.env.EMBEDDING_API_KEY,
      baseUrl: process.env.EMBEDDING_BASE_URL ?? "https://api.openai.com/v1",
      model: process.env.EMBEDDING_MODEL ?? "text-embedding-3-small",
    });
  }
  // Reuse the main AI key if present (OpenAI-compatible)
  if (process.env.AI_API_KEY) {
    return new OpenAIEmbeddingProvider({
      apiKey: process.env.AI_API_KEY,
      baseUrl: process.env.AI_BASE_URL ?? "https://api.openai.com/v1",
      model: process.env.EMBEDDING_MODEL ?? "text-embedding-3-small",
    });
  }
  return null;
}

/** Chunk a normalized text into overlapping segments for embedding. */
export function chunkText(text: string, maxChars = 1800, overlap = 180): string[] {
  const cleaned = text.replace(/\r\n/g, "\n").trim();
  if (!cleaned) return [];

  const paragraphs = cleaned.split(/\n{2,}/).map((p) => p.trim());
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    if (para.length === 0) continue;
    // Very long paragraph: split by sentences
    if (para.length > maxChars) {
      if (current) {
        chunks.push(current);
        current = "";
      }
      const sentences = para.match(/[^.!?]+[.!?]*(\s|$)/g) ?? [para];
      let sentenceBuf = "";
      for (const s of sentences) {
        if ((sentenceBuf + s).length > maxChars) {
          if (sentenceBuf) chunks.push(sentenceBuf.trim());
          sentenceBuf = s;
        } else {
          sentenceBuf += s;
        }
      }
      if (sentenceBuf.trim()) chunks.push(sentenceBuf.trim());
      continue;
    }

    if ((current + "\n\n" + para).length > maxChars) {
      chunks.push(current);
      current = para;
    } else {
      current = current ? `${current}\n\n${para}` : para;
    }
  }
  if (current.trim()) chunks.push(current.trim());

  // Add small overlap between adjacent chunks for context continuity
  const out: string[] = [];
  for (let i = 0; i < chunks.length; i++) {
    let c = chunks[i];
    const prev = chunks[i - 1];
    if (prev) {
      const tail = prev.slice(-overlap);
      c = tail + "\n\n" + c;
    }
    out.push(c);
  }
  return out;
}