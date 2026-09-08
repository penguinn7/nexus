/**
 * Web research module.
 *
 * Uses Tavily (https://tavily.com) when TAVILY_API_KEY is configured to give
 * NEXUS live, external research to complement the user's own Sources.
 * Never throws — returns an empty array on any failure so callers degrade.
 */

export interface WebResult {
  title: string;
  url: string;
  content: string;
}

export function webResearchEnabled(): boolean {
  return Boolean(process.env.TAVILY_API_KEY);
}

export async function webSearch(
  query: string,
  opts?: { maxResults?: number; searchDepth?: "basic" | "advanced" }
): Promise<WebResult[]> {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return [];

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        query: query.slice(0, 300),
        search_depth: opts?.searchDepth ?? "advanced",
        max_results: opts?.maxResults ?? 4,
        include_answer: false,
        include_raw_content: false,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("webSearch failed", res.status, text.slice(0, 200));
      return [];
    }

    const data = await res.json();
    const results: unknown[] = Array.isArray(data?.results) ? data.results : [];
    return results
      .filter(
        (r): r is { title: unknown; url: unknown; content: unknown } =>
          !!r && typeof r === "object" && "title" in r && "url" in r
      )
      .slice(0, opts?.maxResults ?? 4)
      .map((r) => ({
        title: String(r.title ?? "").slice(0, 200),
        url: String(r.url ?? ""),
        content: String(r.content ?? "").slice(0, 800),
      }))
      .filter((r) => r.url && r.content);
  } catch (e) {
    console.error("webSearch threw", e);
    return [];
  }
}

/** Compact markdown block of live web results for prompt context. */
export function buildWebContext(results: WebResult[]): string {
  if (results.length === 0) return "";
  const lines = results
    .map(
      (r, i) =>
        `${i + 1}. [${r.title}](${r.url})\n   ${r.content.replace(/\s+/g, " ").trim()}`
    )
    .join("\n\n");
  return `## Live web research (external, retrieved just now)\n${lines}`;
}