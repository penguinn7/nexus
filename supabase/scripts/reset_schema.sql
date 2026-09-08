-- ============================================================
-- NEXUS — clean slate for the public schema
-- Run FIRST if migration 0001 fails mid-way, then re-run 0001.
-- Removes any partially-created NEXUS tables. Safe to run on a
-- fresh project (no real user data exists yet).
-- NOTE: storage.objects policies reference the bucket, which is
-- recreated by 0003.
-- ============================================================

drop table if exists public.notes cascade;
drop table if exists public.connections cascade;
drop table if exists public.concepts cascade;
drop table if exists public.messages cascade;
drop table if exists public.conversations cascade;
drop table if exists public.document_chunks cascade;
drop table if exists public.documents cascade;
drop table if exists public.sources cascade;
drop table if exists public.spaces cascade;
drop table if exists public.profiles cascade;