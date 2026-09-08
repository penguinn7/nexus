import { createClient } from "@/lib/supabase/server";
import { resolveEmbeddingProvider } from "./embedding";
import type { Concept, Connection, Source } from "@/types";

export interface RetrievedChunk {
  chunkId: string;
  documentId: string;
  sourceId: string;
  sourceTitle: string;
  content: string;
  similarity?: number;
}

export interface RetrievalResult {
  chunks: RetrievedChunk[];
  concepts: Concept[];
  connections: Connection[];
  sources: Source[];
  mode: "semantic+keyword" | "keyword";
}

interface SearchRow {
  chunk_id: string;
  document_id: string;
  source_id: string;
  source_title: string | null;
  content: string | null;
  similarity: number | null;
  rank?: number | null;
}

/**
 * RetrievalService: fetches the knowledge relevant to a question inside
 * a Space. Prioritizes the user's own content via semantic + keyword
 * search over document chunks, then attaches graph context.
 */
export async function retrieveForQuestion(params: {
  spaceId: string;
  userId: string;
  question: string;
  limit?: number;
}): Promise<RetrievalResult> {
  const { spaceId, userId, question, limit = 8 } = params;
  const supabase = await createClient();

  const keywords = extractKeywords(question);
  const searchTerms = keywords.slice(0, 6).join(" & ");

  const embeddingProvider = resolveEmbeddingProvider();
  let embedding: number[] | null = null;
  if (embeddingProvider) {
    try {
      const [vec] = await embeddingProvider.embed([question]);
      embedding = vec;
    } catch (e) {
      console.error("embedding failed, falling back to keyword", e);
    }
  }

  const noResult = { data: null, error: null };
  const [semanticRes, keywordRes, conceptsRes, connectionsRes, sourcesRes] =
    await Promise.all([
      embedding
        ? supabase.rpc("search_chunks", {
            p_space_id: spaceId,
            p_query_embedding: embedding,
            p_limit: limit * 2,
            p_min_similarity: 0.5,
          })
        : Promise.resolve(noResult),
      supabase.rpc("search_chunks_keyword", {
        p_space_id: spaceId,
        p_query: searchTerms || question.slice(0, 60),
        p_limit: limit * 2,
      }),
      supabase
        .from("concepts")
        .select("id, space_id, user_id, name, description, created_at")
        .eq("space_id", spaceId)
        .eq("user_id", userId)
        .limit(200),
      supabase
        .from("connections")
        .select("id, space_id, user_id, concept_a, concept_b, relationship, created_at")
        .eq("space_id", spaceId)
        .eq("user_id", userId)
        .limit(500),
      supabase
        .from("sources")
        .select("id, space_id, user_id, title, source_type, url, status, created_at")
        .eq("space_id", spaceId)
        .eq("user_id", userId)
        .eq("status", "ready")
        .limit(100),
    ]);

  const semantic: RetrievalResult["chunks"] = ((semanticRes.data ?? []) as SearchRow[])
    .filter((r) => (r.similarity ?? 0) >= 0.5)
    .map((r) => ({
      chunkId: r.chunk_id,
      documentId: r.document_id,
      sourceId: r.source_id,
      sourceTitle: r.source_title ?? "",
      content: r.content ?? "",
      similarity: Number(r.similarity),
    }));

  const keyword: RetrievalResult["chunks"] = ((keywordRes.data ?? []) as SearchRow[]).map(
    (r) => ({
      chunkId: r.chunk_id,
      documentId: r.document_id,
      sourceId: r.source_id,
      sourceTitle: r.source_title ?? "",
      content: r.content ?? "",
      similarity: Number(r.rank ?? 0),
    })
  );

  // Merge semantic + keyword, dedupe by chunk id, prioritize semantic
  const seen = new Set<string>();
  const merged: RetrievedChunk[] = [];
  for (const c of [...semantic, ...keyword]) {
    if (seen.has(c.chunkId)) continue;
    seen.add(c.chunkId);
    merged.push(c);
  }
  if (merged.length < 3) {
    // Weak retrieval: add top recent ready sources so NEXUS can still orient.
    // (kept honest — sources are cited only when actually included)
  }

  return {
    chunks: merged.slice(0, limit),
    concepts: (conceptsRes.data ?? []) as Concept[],
    connections: (connectionsRes.data ?? []) as Connection[],
    sources: (sourcesRes.data ?? []) as Source[],
    mode: semantic.length > 0 ? "semantic+keyword" : "keyword",
  };
}

/** Lightweight keyword extraction: drop stopwords, keep meaningful tokens */
const STOPWORDS = new Set(
  (
    "a an the and or but if then else of in on at to from by with about into over after for as is are was were be been being do does did has have had this that these those it its i me my we our you your he she they them what which who whom when where why how what " +
    "explain tell describe compare discuss show find what is what are difference between vs sum summarize help make give name list define teach learn"
  ).split(/\s+/)
);

function extractKeywords(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w))
    .slice(0, 10);
}

/**
 * Builds the LLM context block from retrieved chunks + graph info.
 * Sources in context may be cited by the model.
 */
export function buildContext(retrieval: RetrievalResult): string {
  if (retrieval.chunks.length === 0) {
    return "Your knowledge base has no relevant source passages for this question. Rely on general knowledge and be transparent that no source material covers this.";
  }

  const chunkText = retrieval.chunks
    .map(
      (c, i) =>
        `[Source: ${c.sourceTitle}]\n${c.content.slice(0, 1400)}`
    )
    .join("\n\n---\n\n");

  const conceptNames = retrieval.concepts
    .slice(0, 60)
    .map((c) => c.name)
    .join(", ");

  const connectionNames = retrieval.connections
    .slice(0, 24)
    .map(
      (cn) =>
        `- ${cn.relationship} (concept_a -> concept_b)`
    )
    .join("\n");

  return `## Relevant content from the user's Space\n\n${chunkText}\n\n## Concepts in this Space\n${conceptNames || "none yet"}\n\n## Some relationships\n${connectionNames || "none yet"}`;
}