-- Public, read-only Storage bucket for Sığınak content art — spec rev 5 §19.4.
-- Paths: chapters/{chapterId}/{name}.{contentHash}@2x.png (or .webp), items/{set}/{name}.{hash}@2x.png.
-- Files are content-hashed and immutable; upload with cacheControl 31536000.
-- Clients read ONLY through public URLs (getPublicUrl / CDN). They get no Storage API access, so they
-- cannot list the bucket and spot unreleased chapter art early. The service role (CI) uploads.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('content', 'content', true, 2097152, array['image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Defence in depth: a RESTRICTIVE policy, so no current or future permissive policy on storage.objects
-- (e.g. a later "users upload avatars" policy) can ever open this bucket to client reads, lists or writes.
drop policy if exists "Content bucket is closed to client API access" on storage.objects;
create policy "Content bucket is closed to client API access"
  on storage.objects as restrictive for all to anon, authenticated
  using (bucket_id <> 'content')
  with check (bucket_id <> 'content');
-- No permissive policy is created for this bucket: public-URL reads do not go through RLS,
-- and the service role bypasses RLS for uploads.

-- Down:
--   drop policy if exists "Content bucket is closed to client API access" on storage.objects;
--   delete from storage.buckets where id = 'content';  -- only after emptying the bucket
