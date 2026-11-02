-- Remote Sığınak content (chapters, milestones, goals, seasons, items) — spec rev 5 §19.4.
-- Append-only, versioned per channel, scheduled with published_at. Clients (anon or signed in) can read
-- only published rows; only the service role (CI / dashboard) writes. Art lives in the `content`
-- Storage bucket (202611020003).

create table if not exists public.content_manifests (
  id bigint generated always as identity primary key,
  channel text not null default 'prod',
  version integer not null,
  schema_version smallint not null default 1,
  min_app_version text not null default '1.0.0',
  published_at timestamptz not null,
  manifest jsonb not null,
  notes text,
  created_at timestamptz not null default now(),
  constraint content_manifests_channel check (channel in ('prod', 'beta')),
  constraint content_manifests_version_positive check (version > 0),
  constraint content_manifests_schema_version check (schema_version >= 1),
  constraint content_manifests_min_app_version check (min_app_version ~ '^[0-9]+\.[0-9]+\.[0-9]+$'),
  constraint content_manifests_manifest_size check (pg_column_size(manifest) < 524288),
  constraint content_manifests_manifest_matches_row check (
    jsonb_typeof(manifest) = 'object'
    and manifest ->> 'version' = version::text
    and manifest ->> 'schemaVersion' = schema_version::text
    and jsonb_typeof(manifest -> 'chapters') = 'array'
  ),
  constraint content_manifests_channel_version_key unique (channel, version)
);

comment on table public.content_manifests is
  'Append-only Sığınak content manifests. Client: highest published version per channel. Never update or delete a published row; publish a higher version instead.';

-- Lookups: the unique (channel, version) index serves "latest version" (backward scan).
-- This one serves the publishing schedule / "what goes live next" queries.
create index if not exists content_manifests_channel_published_at_idx
  on public.content_manifests (channel, published_at desc);

alter table public.content_manifests enable row level security;

revoke all on table public.content_manifests from anon, authenticated;
grant select on table public.content_manifests to anon, authenticated;

drop policy if exists "Anyone can read published manifests" on public.content_manifests;
create policy "Anyone can read published manifests"
  on public.content_manifests for select to anon, authenticated
  using (published_at <= now());
-- No insert/update/delete policies: only the service role (bypasses RLS) writes.

-- Guard rails that also bind the service role (triggers are not bypassed by RLS bypass).
create or replace function public.content_manifests_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  latest integer;
begin
  if tg_op in ('UPDATE', 'DELETE') and old.published_at <= now() then
    raise exception 'content_manifests: version % (%) is published and immutable; insert a higher version instead',
      old.version, old.channel using errcode = 'check_violation';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  if tg_op = 'UPDATE' and (new.channel <> old.channel or new.version <> old.version) then
    raise exception 'content_manifests: channel and version cannot change' using errcode = 'check_violation';
  end if;

  if tg_op = 'INSERT' then
    select max(m.version) into latest from public.content_manifests m where m.channel = new.channel;
    if latest is not null and new.version <= latest then
      raise exception 'content_manifests: version must be greater than % for channel %', latest, new.channel
        using errcode = 'check_violation';
    end if;
  end if;

  if new.channel = 'prod'
     and jsonb_path_exists(new.manifest, 'strict $.**.copyStatus ? (@ == "pending")') then
    raise exception 'content_manifests: prod manifest contains copy that is still PENDING APPROVAL'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

revoke all on function public.content_manifests_guard() from public, anon, authenticated;

drop trigger if exists content_manifests_guard on public.content_manifests;
create trigger content_manifests_guard
  before insert or update or delete on public.content_manifests
  for each row execute function public.content_manifests_guard();

-- Down:
--   drop trigger if exists content_manifests_guard on public.content_manifests;
--   drop function if exists public.content_manifests_guard();
--   drop table if exists public.content_manifests;
