-- ============================================================
-- NEXUS — retrieval helpers
-- ============================================================

-- Semantic search over chunks within a Space (pgvector).
-- Falls back naturally: returns no rows when embeddings are absent,
-- and callers use keyword search as a complement.
create or replace function public.search_chunks(
  p_space_id uuid,
  p_query_embedding vector(1536),
  p_limit int default 10,
  p_min_similarity float default 0.6
)
returns table (
  chunk_id uuid,
  document_id uuid,
  source_id uuid,
  source_title text,
  content text,
  similarity float
)
language sql
stable
security definer set search_path = public
as $$
  select
    dc.id as chunk_id,
    dc.document_id,
    s.id as source_id,
    s.title as source_title,
    dc.content,
    1 - (dc.embedding <=> p_query_embedding) as similarity
  from public.document_chunks dc
  join public.documents d on d.id = dc.document_id
  join public.sources s on s.id = d.source_id
  where dc.space_id = p_space_id
    and dc.user_id = auth.uid()
    and dc.embedding is not null
    and 1 - (dc.embedding <=> p_query_embedding) > p_min_similarity
  order by dc.embedding <=> p_query_embedding
  limit p_limit;
$$;

-- Keyword search over chunks within a Space.
create or replace function public.search_chunks_keyword(
  p_space_id uuid,
  p_query text,
  p_limit int default 10
)
returns table (
  chunk_id uuid,
  document_id uuid,
  source_id uuid,
  source_title text,
  content text,
  rank float
)
language sql
stable
security definer set search_path = public
as $$
  select
    dc.id as chunk_id,
    dc.document_id,
    s.id as source_id,
    s.title as source_title,
    dc.content,
    ts_rank_cd(
      to_tsvector('english', dc.content),
      plainto_tsquery('english', p_query)
    ) as rank
  from public.document_chunks dc
  join public.documents d on d.id = dc.document_id
  join public.sources s on s.id = d.source_id
  where dc.space_id = p_space_id
    and dc.user_id = auth.uid()
    and to_tsvector('english', dc.content) @@ plainto_tsquery('english', p_query)
  order by rank desc
  limit p_limit;
$$;