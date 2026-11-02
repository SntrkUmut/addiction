-- Snapshot format v2: optional top-level `milestones`, `collection`, `personalization` inside
-- public.user_snapshots.snapshot (spec rev 5 §15, §19.4). Additive only: no data is changed and old
-- clients keep working (they drop unknown top-level keys).
-- snapshot_version is GENERATED from the JSON itself, so it stays correct even when an old client
-- upserts a v1-shaped snapshot over a v2 row (an upsert never sends this column).

alter table public.user_snapshots
  add column if not exists snapshot_version smallint
  generated always as (
    case
      when snapshot -> 'schemaVersion' = '2'::jsonb
        or snapshot ? 'milestones'
        or snapshot ? 'collection'
        or snapshot ? 'personalization'
      then 2
      else 1
    end
  ) stored;

comment on column public.user_snapshots.snapshot_version is
  '1 = {profile, events}; 2 = adds milestones/collection/personalization. Derived from snapshot; read-only.';

-- Shape guards. The client validates fully (parseAppState); these only stop malformed payloads.
alter table public.user_snapshots drop constraint if exists user_snapshots_milestones_shape;
alter table public.user_snapshots
  add constraint user_snapshots_milestones_shape check (
    not (snapshot ? 'milestones')
    or (
      jsonb_typeof(snapshot -> 'milestones') = 'object'
      and jsonb_typeof(snapshot -> 'milestones' -> 'seen') = 'array'
      and jsonb_array_length(snapshot -> 'milestones' -> 'seen') <= 256
      and not jsonb_path_exists(snapshot, '$.milestones.seen[*] ? (!exists(@.key) || @.key.type() != "string")')
    )
  ) not valid;

alter table public.user_snapshots drop constraint if exists user_snapshots_collection_shape;
alter table public.user_snapshots
  add constraint user_snapshots_collection_shape check (
    not (snapshot ? 'collection')
    or (
      jsonb_typeof(snapshot -> 'collection') = 'object'
      and jsonb_typeof(snapshot -> 'collection' -> 'earned') = 'array'
      and jsonb_array_length(snapshot -> 'collection' -> 'earned') <= 2000
      and not jsonb_path_exists(snapshot, '$.collection.earned[*] ? (!exists(@.id) || @.id.type() != "string")')
    )
  ) not valid;

alter table public.user_snapshots drop constraint if exists user_snapshots_personalization_shape;
alter table public.user_snapshots
  add constraint user_snapshots_personalization_shape check (
    not (snapshot ? 'personalization')
    or (
      jsonb_typeof(snapshot -> 'personalization') = 'object'
      and (not (snapshot -> 'personalization' ? 'slots')
           or jsonb_typeof(snapshot -> 'personalization' -> 'slots') = 'object')
    )
  ) not valid;

-- Existing rows are v1 (no such keys), so validation cannot fail; VALIDATE does not block writes.
alter table public.user_snapshots validate constraint user_snapshots_milestones_shape;
alter table public.user_snapshots validate constraint user_snapshots_collection_shape;
alter table public.user_snapshots validate constraint user_snapshots_personalization_shape;

-- RLS policies and grants from 202610200001 already cover the new column; nothing to change.
-- Down:
--   alter table public.user_snapshots drop constraint if exists user_snapshots_personalization_shape;
--   alter table public.user_snapshots drop constraint if exists user_snapshots_collection_shape;
--   alter table public.user_snapshots drop constraint if exists user_snapshots_milestones_shape;
--   alter table public.user_snapshots drop column if exists snapshot_version;
