-- Minimal, private snapshot backup for the local-first mobile MVP.
-- Run with Supabase CLI migrations or in the SQL editor of a development project.

create table if not exists public.user_snapshots (
  user_id uuid primary key references auth.users (id) on delete cascade,
  snapshot jsonb not null,
  updated_at timestamptz not null default now(),
  constraint user_snapshots_snapshot_size check (pg_column_size(snapshot) < 1048576)
);

alter table public.user_snapshots enable row level security;

revoke all on table public.user_snapshots from anon;
grant select, insert, update, delete on table public.user_snapshots to authenticated;

drop policy if exists "Users can read their own snapshot" on public.user_snapshots;
create policy "Users can read their own snapshot"
  on public.user_snapshots for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own snapshot" on public.user_snapshots;
create policy "Users can create their own snapshot"
  on public.user_snapshots for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own snapshot" on public.user_snapshots;
create policy "Users can update their own snapshot"
  on public.user_snapshots for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own snapshot" on public.user_snapshots;
create policy "Users can delete their own snapshot"
  on public.user_snapshots for delete to authenticated
  using ((select auth.uid()) = user_id);
