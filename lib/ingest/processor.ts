import { chunkText, resolveEmbeddingProvider } from "@/lib/ai/embedding";

/**
 * SourceProcessor — normalizes raw source bytes into:
 *  - normalizedText
 *  - chunks (with embeddings when an embedding provider exists)
 */

export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
export const ALLOWED_MIME = new Map<string, string>([
  ["application/pdf", "pdf"],
  ["text/plain", "text"],
  ["text/markdown", "text"],
  ["text/csv", "text"],
]);

/** File extensions accepted for direct text ingestion (no PDF parser). */
export const TEXT_FILE_EXTENSIONS = new Set(["txt", "md", "markdown", "csv"]);

export function isTextFile(fileName: string): boolean {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return TEXT_FILE_EXTENSIONS.has(ext);
}

export async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  // Dynamic import keeps pdf parsing out of the client bundle entirely.
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(Buffer.from(buffer));
  return data.text ?? "";
}

/**
 * Best-effort extractor for a YouTube watch page: title + description.
 * Transcripts are only fetched when the page exposes them; otherwise NEXUS
 * stores the video as a source link so it can still be cited in research.
 */
export async function extractYoutubeText(
  url: string
): Promise<{ title: string; text: string }> {
  const res = await fetch(url, {
    headers: { "User-Agent": "NEXUS/1.0 knowledge-crawler" },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) {
    throw new Error(`Could not reach YouTube (status ${res.status})`);
  }
  const html = await res.text();

  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch?.[1]?.trim()?.replace(/ - YouTube.*$/i, "")?.slice(0, 140) || "YouTube video";

  const descMatches = Array.from(
    html.matchAll(/<meta[^>]+(?:name|property)="(?:description|og:description)"[^>]+content="([^"]*)"/gi)
  );
  const desc = descMatches
    .map((m) => m[1])
    .find((d) => d && d.length > 20)
    ?.replace(/\\n/g, " ")
    ?.slice(0, 4000);

  const text =
    `YouTube video: ${title}\nURL: ${url}\n\n${desc ? `Description:\n${desc}` : ""}`.trim();
  return { title, text };
}

export async function extractUrlText(url: string): Promise<{ title: string; text: string }> {
  if (!/^https?:\/\//i.test(url)) {
    throw new Error("Invalid URL — must start with http:// or https://");
  }
  const res = await fetch(url, {
    headers: { "User-Agent": "NEXUS/1.0 knowledge-crawler" },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) {
    throw new Error(`Could not fetch URL (status ${res.status})`);
  }
  const html = await res.text();
  return { title: htmlTitle(html), text: htmlToText(html) };
}

function htmlTitle(html: string): string {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m?.[1]?.trim()?.slice(0, 140) || "Untitled webpage";
}

function htmlToText(html: string): string {
  return (
    html
      // remove script/style blocks
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      // strip tags
      .replace(/<[^>]+>/g, " ")
      // decode common entities
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      // collapse spaces and trim each line
      .replace(/[ \t]+/g, " ")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .join("\n")
      .slice(0, 400_000)
  );
}

export interface IngestResult {
  normalizedText: string;
  chunks: string[];
}

/** Normalize + chunk raw text; optionally embed (provider decides). */
export function processText(raw: string, opts?: { chunkSize?: number; overlap?: number }): IngestResult {
  const normalized = raw
    .replace(/\r\n/g, "\n")
    .replace(/\u0000/g, "")
    .trim();
  const chunks = chunkText(normalized, opts?.chunkSize, opts?.overlap);
  return { normalizedText: normalized, chunks };
}

export async function embedChunks(chunks: string[]): Promise<number[][] | null> {
  const provider = resolveEmbeddingProvider();
  if (!provider) return null;

  const vectors: number[][] = [];
  const BATCH = 32;
  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH);
    const vecs = await provider.embed(batch);
    vectors.push(...vecs);
  }
  return vectors;
}