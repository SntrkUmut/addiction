import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
const db = new PGlite();
const M = '/workspace/addiction-figma/proposals/supabase/migrations/';
const ok = (n) => console.log('PASS', n), bad = (n, e) => { console.log('FAIL', n, e?.message ?? ''); process.exitCode = 1; };
async function expectErr(n, sql, params) { try { await db.query(sql, params); bad(n, { message: 'no error' }); } catch (e) { ok(n + ' -> ' + e.message.slice(0, 90)); } }
async function expectOk(n, sql, params) { try { const r = await db.query(sql, params); ok(n); return r; } catch (e) { bad(n, e); } }
// Supabase stubs
await db.exec(`
create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to service_role; alter default privileges in schema public grant all on tables to service_role;
create schema auth; create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
grant usage on schema auth to anon, authenticated; grant execute on function auth.uid() to anon, authenticated;
create schema storage;
create table storage.buckets (id text primary key, name text not null, public boolean default false, file_size_limit bigint, allowed_mime_types text[]);
create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text references storage.buckets(id), name text, owner uuid);
alter table storage.objects enable row level security;
grant usage on schema storage to anon, authenticated, service_role;
grant select, insert, update, delete on storage.objects to anon, authenticated, service_role;
insert into storage.buckets(id,name,public) values ('avatars','avatars',false);
create policy "loose avatars" on storage.objects for all to authenticated using (true) with check (true);
`);
const existing = readFileSync('/workspace/addiction/supabase/migrations/202610200001_user_snapshots.sql', 'utf8');
await db.exec(existing); ok('apply existing 202610200001');
await db.exec(`insert into auth.users values ('11111111-1111-1111-1111-111111111111'),('22222222-2222-2222-2222-222222222222');
 insert into public.user_snapshots(user_id, snapshot) values ('11111111-1111-1111-1111-111111111111', '{"profile":null,"events":[]}');`);
for (const f of ['202611020001_user_snapshots_v2.sql', '202611020002_content_manifests.sql', '202611020003_content_storage.sql']) {
  const sql = readFileSync(M + f, 'utf8');
  try { await db.exec(sql); ok('apply ' + f); } catch (e) { bad('apply ' + f, e); }
  try { await db.exec(sql); ok('re-apply (idempotent) ' + f); } catch (e) { bad('re-apply ' + f, e); }
}
// --- snapshots
let r = await db.query(`select snapshot_version from public.user_snapshots`); r.rows[0].snapshot_version === 1 ? ok('existing row snapshot_version=1') : bad('v1', {message: JSON.stringify(r.rows)});
await db.exec(`set role authenticated; set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';`);
const v2 = { profile: null, events: [], schemaVersion: 2, milestones: { seen: [{ key: 'day-1', seenAt: '2026-10-22T09:00:00Z', variant: 'default' }] },
  collection: { earned: [{ id: 'it-kuvars', at: '2026-10-28T10:00:00Z', source: 'goal' }] }, personalization: { foxAccessory: 'it-atki', slots: {}, updatedAt: '2026-10-28T10:00:00Z' } };
await expectOk('authenticated upserts v2 snapshot (client payload, no snapshot_version)', `insert into public.user_snapshots(user_id, snapshot, updated_at) values ($1, $2, now()) on conflict (user_id) do update set snapshot = excluded.snapshot, updated_at = excluded.updated_at`, ['11111111-1111-1111-1111-111111111111', v2]);
r = await db.query(`select snapshot_version from public.user_snapshots`); r.rows[0]?.snapshot_version === 2 ? ok('generated snapshot_version=2') : bad('v2', {message: JSON.stringify(r.rows)});
await expectOk('old client overwrites with v1 shape', `update public.user_snapshots set snapshot = '{"profile":null,"events":[]}'`);
r = await db.query(`select snapshot_version from public.user_snapshots`); r.rows[0]?.snapshot_version === 1 ? ok('generated column follows payload back to 1') : bad('v1 again', {message: JSON.stringify(r.rows)});
await expectErr('client cannot write snapshot_version', `update public.user_snapshots set snapshot_version = 2`);
await expectErr('milestones.seen not array rejected', `update public.user_snapshots set snapshot = '{"profile":null,"events":[],"milestones":{"seen":{}}}'`);
await expectErr('milestones key not string rejected', `update public.user_snapshots set snapshot = '{"profile":null,"events":[],"milestones":{"seen":[{"key":7}]}}'`);
await expectErr('milestones key missing rejected', `update public.user_snapshots set snapshot = '{"profile":null,"events":[],"milestones":{"seen":[{"seenAt":"x"}]}}'`);
await expectErr('collection.earned id missing rejected', `update public.user_snapshots set snapshot = '{"profile":null,"events":[],"collection":{"earned":[{"at":"x"}]}}'`);
await expectErr('personalization.slots array rejected', `update public.user_snapshots set snapshot = '{"profile":null,"events":[],"personalization":{"slots":[]}}'`);
await expectOk('empty milestones ok', `update public.user_snapshots set snapshot = '{"profile":null,"events":[],"milestones":{"seen":[]}}'`);
r = await db.query(`select count(*)::int c from public.user_snapshots`); r.rows[0].c === 1 ? ok('RLS still: user sees only own row') : bad('rls');
await db.exec(`set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';`);
r = await db.query(`select count(*)::int c from public.user_snapshots`); r.rows[0].c === 0 ? ok('other user sees 0 rows') : bad('rls2');
await db.exec(`reset role;`);
// --- content manifests
const base = JSON.parse(readFileSync('/workspace/addiction-figma/content/manifest.example.json', 'utf8'));
// rev 5.1: the example is fully approved; derive a v7 draft with one PENDING chapter for the gate tests
const ex = { ...base, version: 7, chapters: base.chapters.map((c, i) => i === 2 ? { ...c, copyStatus: 'pending' } : c) };
const approved = JSON.parse(JSON.stringify(ex).replaceAll('"pending"', '"approved"'));
const ins = `insert into public.content_manifests(channel, version, schema_version, published_at, manifest) values ($1,$2,1,$3,$4)`;
await db.exec(`set role service_role;`);
await expectOk('service role inserts beta v7 (pending copy allowed on beta)', ins, ['beta', 7, '2026-11-01T09:00:00+03', ex]);
await expectErr('prod rejects PENDING APPROVAL copy', ins, ['prod', 7, '2026-11-01T09:00:00+03', ex]);
await expectOk('prod accepts approved v7 (live)', ins, ['prod', 7, '2026-11-01T09:00:00+03', approved]);
const v8 = { ...approved, version: 8 };
await expectOk('prod v8 scheduled for the future', ins, ['prod', 8, '2099-01-01T09:00:00+03', v8]);
await expectErr('version must increase', ins, ['prod', 8, '2026-11-01T09:00:00+03', v8]);
await expectErr('manifest.version must match row', ins, ['prod', 9, '2026-11-01T09:00:00+03', approved]);
await expectErr('published row is immutable (update)', `update public.content_manifests set notes='x' where channel='prod' and version=7`);
await expectErr('published row is immutable (delete)', `delete from public.content_manifests where channel='prod' and version=7`);
await expectOk('scheduled row can still be edited', `update public.content_manifests set notes='QA ok' where channel='prod' and version=8`);
await expectErr('bad channel', ins, ['staging', 1, '2026-11-01T09:00:00+03', { ...approved, version: 1 }]);
await db.exec(`reset role; set role anon;`);
r = await db.query(`select version from public.content_manifests where channel='prod' order by version desc limit 1`);
r.rows[0]?.version === 7 ? ok('anon sees latest PUBLISHED prod version = 7 (v8 hidden until published_at)') : bad('anon read', {message: JSON.stringify(r.rows)});
await expectErr('anon cannot insert', ins, ['prod', 20, '2026-11-01T09:00:00+03', { ...approved, version: 20 }]);
await db.exec(`reset role; set role authenticated;`);
await expectErr('authenticated cannot update', `update public.content_manifests set notes='x' where version=8 returning id`).catch(()=>{});
r = await db.query(`update public.content_manifests set notes='x' returning id`).catch(e=>({rows:null,err:e.message}));
(r.rows === null || r.rows.length === 0) ? ok('authenticated update affects nothing / denied: ' + (r.err ?? '0 rows')) : bad('auth update');
await expectErr('anon cannot call guard function directly', `select public.content_manifests_guard()`);
await db.exec(`reset role;`);
r = await db.query(`explain select version from public.content_manifests where channel='prod' order by version desc limit 1`);
console.log('   plan:', r.rows.map(x => x['QUERY PLAN']).join(' | ').slice(0, 160));
// --- storage
r = await db.query(`select id, public, file_size_limit, allowed_mime_types from storage.buckets where id='content'`); console.log('   bucket:', JSON.stringify(r.rows[0]));
await db.exec(`insert into storage.objects(bucket_id, name) values ('content','chapters/ch-dere/kucuk-kopru.a1b2c3@2x.png'),('avatars','u1.png');`);
await db.exec(`set role authenticated;`);
r = await db.query(`select bucket_id from storage.objects`); JSON.stringify(r.rows) === '[{"bucket_id":"avatars"}]' ? ok('authenticated (even with a loose avatars policy) cannot list content bucket') : bad('list', {message: JSON.stringify(r.rows)});
await expectErr('authenticated cannot upload to content', `insert into storage.objects(bucket_id, name) values ('content','x.png')`);
await expectOk('authenticated can still use avatars (restrictive policy scoped to content)', `insert into storage.objects(bucket_id, name) values ('avatars','u2.png')`);
await db.exec(`reset role; set role anon;`);
r = await db.query(`select count(*)::int c from storage.objects where bucket_id='content'`); r.rows[0].c === 0 ? ok('anon cannot list content bucket') : bad('anon list');
await db.exec(`reset role; set role service_role;`);
await expectOk('service role uploads to content', `insert into storage.objects(bucket_id, name) values ('content','chapters/ch-orman/cam-agaci.d4e5f6@2x.png')`);
