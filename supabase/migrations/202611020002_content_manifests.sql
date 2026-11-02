-- Migration: Content manifests table and Storage bucket
-- Rev 4 §19.4: Remote content (chapters, goals, seasons, items)
-- PROPOSAL ONLY - NOT APPLIED TO ANY DATABASE

-- Table for versioned content manifests
create table if not exists public.content_manifests (
  id               bigint generated always as identity primary key,
  channel          text not null default 'prod' check (channel in ('prod','beta')),
  version          integer not null,                 -- monotonically increasing per channel
  schema_version   smallint not null default 1,      -- manifest JSON schema major
  min_app_version  text not null default '1.0.0',    -- clients below this ignore the row
  published_at     timestamptz not null,             -- schedule drops in advance
  manifest         jsonb not null check (pg_column_size(manifest) < 524288), -- 512 KB limit
  created_at       timestamptz not null default now(),
  unique (channel, version)
);

-- Enable RLS
alter table public.content_manifests enable row level security;

-- Read policy: anyone (anon, authenticated) can read published manifests
create policy "read published manifests" on public.content_manifests
  for select to anon, authenticated 
  using (published_at <= now());

-- Write policies: none - only dashboard/service role writes
-- (Service role bypasses RLS)

-- Index for efficient latest-version lookups
create index if not exists content_manifests_latest 
  on public.content_manifests (channel, version desc);

-- Storage bucket for content art
-- This must be created via Supabase dashboard or API, not SQL:
-- Bucket name: "content"
-- Public: true (publicly readable)
-- File size limit: 5 MB
-- Allowed MIME types: image/png, image/jpeg, image/webp
-- Path structure: chapters/{chapterId}/{name}.{contentHash}@2x.png
--
-- Bucket creation command (for reference, run via Supabase CLI or dashboard):
-- insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- values ('content', 'content', true, 5242880, '{image/png,image/jpeg,image/webp}');

-- Down migration (if needed):
-- drop table if exists public.content_manifests;
-- delete from storage.buckets where id = 'content';
