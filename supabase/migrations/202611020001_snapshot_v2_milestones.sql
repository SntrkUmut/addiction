-- Migration: Add snapshot_version column and milestones shape constraint
-- Rev 4 §15: Milestones sync to cloud
-- PROPOSAL ONLY - NOT APPLIED TO ANY DATABASE

-- Add schema version column to track snapshot format
alter table public.user_snapshots
  add column if not exists snapshot_version smallint not null default 1;

-- Add constraint to validate milestones field shape
-- This helps ops tell versions apart and guards the field shape
alter table public.user_snapshots
  add constraint user_snapshots_milestones_shape
  check (
    not (snapshot ? 'milestones')
    or (jsonb_typeof(snapshot->'milestones') = 'object'
        and jsonb_typeof(snapshot->'milestones'->'seen') = 'array'
        and jsonb_array_length(snapshot->'milestones'->'seen') <= 64)
  ) not valid;

-- Note: Run `alter table public.user_snapshots validate constraint user_snapshots_milestones_shape;`
-- after verifying existing rows, to enable the constraint without blocking writes.

-- RLS policies unchanged - existing policies cover the new column
-- No new grants needed

-- Down migration (if needed):
-- alter table public.user_snapshots drop constraint if exists user_snapshots_milestones_shape;
-- alter table public.user_snapshots drop column if exists snapshot_version;
