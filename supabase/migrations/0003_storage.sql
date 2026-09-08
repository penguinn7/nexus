-- ============================================================
-- NEXUS — storage buckets with RLS
-- ============================================================

insert into storage.buckets (id, name, public)
values ('nexus-sources', 'nexus-sources', false)
on conflict (id) do nothing;

-- Users can only read/write their own files.
-- Path convention: {user_id}/{space_id}/{source_id}/{filename}
drop policy if exists "nexus-sources: read own files" on storage.objects;
create policy "nexus-sources: read own files"
  on storage.objects for select
  using (bucket_id = 'nexus-sources' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "nexus-sources: insert own files" on storage.objects;
create policy "nexus-sources: insert own files"
  on storage.objects for insert
  with check (
    bucket_id = 'nexus-sources'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "nexus-sources: update own files" on storage.objects;
create policy "nexus-sources: update own files"
  on storage.objects for update
  using (bucket_id = 'nexus-sources' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "nexus-sources: delete own files" on storage.objects;
create policy "nexus-sources: delete own files"
  on storage.objects for delete
  using (bucket_id = 'nexus-sources' and (storage.foldername(name))[1] = auth.uid()::text);