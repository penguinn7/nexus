-- ============================================================
-- NEXUS — Database schema
-- Tables: profiles, spaces, sources, documents, document_chunks,
--         conversations, messages, concepts, connections, notes
--
-- Multi-user isolation via Row Level Security on every table.
-- ============================================================

create extension if not exists "pgcrypto";
create extension if not exists "vector";

-- ------------------------------------------------------------
-- profiles
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id);

-- Sync profile on auth.users insert
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- spaces
-- ------------------------------------------------------------
create table if not exists public.spaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  type text not null default 'custom' check (type in ('student','research','business','office','personal','creative','custom')),
  description text,
  theme text not null default 'y2k',
  created_at timestamptz not null default now()
);

create index if not exists spaces_user_id_idx on public.spaces (user_id);
create index if not exists spaces_created_at_idx on public.spaces (created_at desc);

alter table public.spaces enable row level security;

create policy "Spaces are viewable by owner"
  on public.spaces for select
  using (auth.uid() = user_id);

create policy "Spaces are insertable by owner"
  on public.spaces for insert
  with check (auth.uid() = user_id);

create policy "Spaces are updatable by owner"
  on public.spaces for update
  using (auth.uid() = user_id);

create policy "Spaces are deletable by owner"
  on public.spaces for delete
  using (auth.uid() = user_id);

create or replace function public.is_space_owner(space_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.spaces
    where spaces.id = space_id and spaces.user_id = auth.uid()
  );
$$;

-- ------------------------------------------------------------
-- sources
-- ------------------------------------------------------------
create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  source_type text not null default 'text',
  url text,
  status text not null default 'uploading'
    check (status in ('uploading','processing','indexing','analyzing','ready','failed')),
  error text,
  created_at timestamptz not null default now()
);

-- Recover from a pre-existing/older `sources` table that is missing columns.
alter table public.sources add column if not exists source_type text not null default 'text';
alter table public.sources add column if not exists url text;
alter table public.sources add column if not exists status text not null default 'uploading';
alter table public.sources add column if not exists error text;
alter table public.sources add column if not exists created_at timestamptz not null default now();

create index if not exists sources_space_id_idx on public.sources (space_id);
create index if not exists sources_user_id_idx on public.sources (user_id);
create index if not exists sources_status_idx on public.sources (status);

alter table public.sources enable row level security;

create policy "Sources are viewable by owner"
  on public.sources for select
  using (auth.uid() = user_id);

create policy "Sources are insertable by owner"
  on public.sources for insert
  with check (auth.uid() = user_id);

create policy "Sources are updatable by owner"
  on public.sources for update
  using (auth.uid() = user_id);

create policy "Sources are deletable by owner"
  on public.sources for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- documents
-- ------------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources (id) on delete cascade,
  space_id uuid not null references public.spaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  file_name text not null,
  file_path text,
  extracted_text text,
  created_at timestamptz not null default now()
);

create index if not exists documents_source_id_idx on public.documents (source_id);
create index if not exists documents_space_id_idx on public.documents (space_id);
create index if not exists documents_user_id_idx on public.documents (user_id);

alter table public.documents enable row level security;

create policy "Documents are viewable by owner"
  on public.documents for select
  using (auth.uid() = user_id);

create policy "Documents are insertable by owner"
  on public.documents for insert
  with check (auth.uid() = user_id);

create policy "Documents are updatable by owner"
  on public.documents for update
  using (auth.uid() = user_id);

create policy "Documents are deletable by owner"
  on public.documents for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- document_chunks (with pgvector embeddings)
-- ------------------------------------------------------------
create table if not exists public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents (id) on delete cascade,
  space_id uuid not null references public.spaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  embedding vector(1536),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists document_chunks_document_id_idx on public.document_chunks (document_id);
create index if not exists document_chunks_space_id_idx on public.document_chunks (space_id);
create index if not exists document_chunks_user_id_idx on public.document_chunks (user_id);
create index if not exists document_chunks_embedding_idx
  on public.document_chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

alter table public.document_chunks enable row level security;

create policy "Chunks are viewable by owner"
  on public.document_chunks for select
  using (auth.uid() = user_id);

create policy "Chunks are insertable by owner"
  on public.document_chunks for insert
  with check (auth.uid() = user_id);

create policy "Chunks are updatable by owner"
  on public.document_chunks for update
  using (auth.uid() = user_id);

create policy "Chunks are deletable by owner"
  on public.document_chunks for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- conversations
-- ------------------------------------------------------------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'New conversation',
  created_at timestamptz not null default now()
);

create index if not exists conversations_space_id_idx on public.conversations (space_id);
create index if not exists conversations_user_id_idx on public.conversations (user_id);

alter table public.conversations enable row level security;

create policy "Conversations are viewable by owner"
  on public.conversations for select
  using (auth.uid() = user_id);

create policy "Conversations are insertable by owner"
  on public.conversations for insert
  with check (auth.uid() = user_id);

create policy "Conversations are updatable by owner"
  on public.conversations for update
  using (auth.uid() = user_id);

create policy "Conversations are deletable by owner"
  on public.conversations for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- messages
-- ------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  space_id uuid not null references public.spaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_id_idx on public.messages (conversation_id);
create index if not exists messages_user_id_idx on public.messages (user_id);

alter table public.messages enable row level security;

create policy "Messages are viewable by owner"
  on public.messages for select
  using (auth.uid() = user_id);

create policy "Messages are insertable by owner"
  on public.messages for insert
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- concepts
-- ------------------------------------------------------------
create table if not exists public.concepts (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  unique (space_id, name)
);

create index if not exists concepts_space_id_idx on public.concepts (space_id);
create index if not exists concepts_user_id_idx on public.concepts (user_id);

alter table public.concepts enable row level security;

create policy "Concepts are viewable by owner"
  on public.concepts for select
  using (auth.uid() = user_id);

create policy "Concepts are insertable by owner"
  on public.concepts for insert
  with check (auth.uid() = user_id);

create policy "Concepts are updatable by owner"
  on public.concepts for update
  using (auth.uid() = user_id);

create policy "Concepts are deletable by owner"
  on public.concepts for delete
  using (auth.uid() = user_id);

-- Create concept helper (upsert by name within space)
create or replace function public.upsert_concept(p_name text, p_description text, p_space_id uuid)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_id uuid;
  v_owner uuid;
begin
  -- Server-side authorization: only the space owner's caller may proceed.
  if not public.is_space_owner(p_space_id) then
    raise exception 'not authorized';
  end if;

  select user_id into v_owner from public.spaces where id = p_space_id;

  insert into public.concepts (name, description, space_id, user_id)
  values (p_name, p_description, p_space_id, v_owner)
  on conflict (space_id, name)
  do update set description = coalesce(excluded.description, public.concepts.description)
  returning id into v_id;

  return v_id;
end;
$$;

-- ------------------------------------------------------------
-- connections
-- ------------------------------------------------------------
create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  concept_a uuid not null references public.concepts (id) on delete cascade,
  concept_b uuid not null references public.concepts (id) on delete cascade,
  relationship text not null default 'related to',
  created_at timestamptz not null default now(),
  unique (space_id, concept_a, concept_b, relationship)
);

create index if not exists connections_space_id_idx on public.connections (space_id);
create index if not exists connections_concept_a_idx on public.connections (concept_a);
create index if not exists connections_concept_b_idx on public.connections (concept_b);

alter table public.connections enable row level security;

create policy "Connections are viewable by owner"
  on public.connections for select
  using (auth.uid() = user_id);

create policy "Connections are insertable by owner"
  on public.connections for insert
  with check (auth.uid() = user_id);

create policy "Connections are deletable by owner"
  on public.connections for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- notes
-- ------------------------------------------------------------
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'Untitled note',
  content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notes_space_id_idx on public.notes (space_id);
create index if not exists notes_user_id_idx on public.notes (user_id);
create index if not exists notes_updated_at_idx on public.notes (updated_at desc);

alter table public.notes enable row level security;

create policy "Notes are viewable by owner"
  on public.notes for select
  using (auth.uid() = user_id);

create policy "Notes are insertable by owner"
  on public.notes for insert
  with check (auth.uid() = user_id);

create policy "Notes are updatable by owner"
  on public.notes for update
  using (auth.uid() = user_id);

create policy "Notes are deletable by owner"
  on public.notes for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Helper: space stats (sources, concepts, connections, notes)
-- ------------------------------------------------------------
create or replace function public.get_space_stats(p_space_id uuid)
returns table (
  source_count bigint,
  concept_count bigint,
  connection_count bigint,
  note_count bigint,
  conversation_count bigint
)
language sql
stable
security definer set search_path = public
as $$
  select
    (select count(*) from public.sources s where s.space_id = p_space_id and s.user_id = auth.uid()),
    (select count(*) from public.concepts c where c.space_id = p_space_id and c.user_id = auth.uid()),
    (select count(*) from public.connections c where c.space_id = p_space_id and c.user_id = auth.uid()),
    (select count(*) from public.notes n where n.space_id = p_space_id and n.user_id = auth.uid()),
    (select count(*) from public.conversations c where c.space_id = p_space_id and c.user_id = auth.uid());
$$;

-- ------------------------------------------------------------
-- Helper: global stats for the workspace dashboard
-- ------------------------------------------------------------
create or replace function public.get_user_stats()
returns table (
  space_count bigint,
  source_count bigint,
  concept_count bigint,
  connection_count bigint
)
language sql
stable
security definer set search_path = public
as $$
  select
    (select count(*) from public.spaces s where s.user_id = auth.uid()),
    (select count(*) from public.sources s where s.user_id = auth.uid()),
    (select count(*) from public.concepts c where c.user_id = auth.uid()),
    (select count(*) from public.connections c where c.user_id = auth.uid());
$$;