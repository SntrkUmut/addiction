import 'react-native-url-polyfill/auto';
import 'expo-sqlite/localStorage/install';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { createAuthStorage } from './sessionStorage';
import { emptyAppState, parseAppState } from './schema';
import type { AppState, MilestoneKey } from './schema';
import { LEGACY_MILESTONES_KEY, PENDING_SYNC_KEY, STATE_KEY } from './wipe';

export { emptyAppState, parseAppState } from './schema';
export type { AppState, CopingChoice, EventKind, Profile, ProgressEvent } from './schema';
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
export const supabaseReady = Boolean(supabaseUrl && supabaseKey);

let client: SupabaseClient | null = null;
let cloudSyncQueue: Promise<void> = Promise.resolve();
if (supabaseUrl && supabaseKey) {
  client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      storage: createAuthStorage(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

export async function loadAppState(): Promise<AppState> {
  try {
    const value = await localStorage.getItem(STATE_KEY);
    if (!value) return emptyAppState();
    const parsed = parseAppState(JSON.parse(value));
    if (!parsed) return emptyAppState();
    return importLegacyMilestones(parsed);
  } catch {
    return emptyAppState();
  }
}

async function importLegacyMilestones(state: AppState): Promise<AppState> {
  if ((state.milestones?.seen.length ?? 0) > 0) return state;
  try {
    const raw = await localStorage.getItem(LEGACY_MILESTONES_KEY);
    if (!raw) return state;
    const value = JSON.parse(raw) as unknown;
    const keys = Array.isArray(value)
      ? value
      : value && typeof value === 'object' && Array.isArray((value as { seen?: unknown }).seen)
        ? (value as { seen: unknown[] }).seen
        : [];
    const seen = [];
    for (const item of keys) {
      const key = typeof item === 'string' ? item : item && typeof item === 'object' ? String((item as { key?: unknown }).key ?? '') : '';
      if (!/^(day-\d+|chapter-\d+)$/.test(key)) continue;
      seen.push({ key: key as MilestoneKey, seenAt: new Date(0).toISOString(), variant: 'default' as const });
    }
    if (seen.length === 0) return state;
    return { ...state, milestones: { seen } };
  } catch {
    return state;
  }
}

function enqueueCloudSync(operation: () => Promise<boolean | null>) {
  const result = cloudSyncQueue.then(operation, operation);
  cloudSyncQueue = result.then(() => undefined, () => undefined);
  return result;
}

export async function saveAppState(state: AppState): Promise<{ cloudSync: Promise<boolean | null> | null }> {
  await localStorage.setItem(STATE_KEY, JSON.stringify(state));
  // Device storage remains authoritative while offline. When an authenticated
  // Supabase session exists, each saved snapshot is also backed up remotely.
  if (!client) return { cloudSync: null };
  try {
    // The locally persisted session is enough to bind the retry marker while offline.
    const { data: auth } = await client.auth.getSession();
    if (!auth.session) return { cloudSync: null };
    const userId = auth.session.user.id;
    const revision = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify({ userId, revision }));
    return { cloudSync: enqueueCloudSync(async () => {
      try {
        const raw = await localStorage.getItem(PENDING_SYNC_KEY);
        if (!raw) return null;
        const pending = JSON.parse(raw) as { userId?: unknown; revision?: unknown };
        if (pending.userId !== userId || typeof pending.revision !== 'string') return null;
        const latestState = await loadAppState();
        const { data: currentAuth, error: authError } = await client!.auth.getSession();
        if (!latestState || authError || currentAuth.session?.user.id !== userId) return null;
        const { error } = await client!.from('user_snapshots').upsert({ user_id: userId, snapshot: latestState, updated_at: new Date().toISOString() });
        if (error) {
          console.warn('Cloud save failed; the local copy is safe.');
          return false;
        }
        await clearPendingSync(userId, pending.revision);
        return true;
      } catch {
        console.warn('Cloud save failed; the local copy is safe.');
        return false;
      }
    }) };
  } catch {
    console.warn('Cloud save failed; the local copy is safe.');
    return { cloudSync: Promise.resolve(false) };
  }
}

export async function clearLocalState() {
  await localStorage.removeItem(STATE_KEY);
  await localStorage.removeItem(PENDING_SYNC_KEY);
}

export async function signUp(email: string, password: string): Promise<string | null> {
  if (!client) throw new Error('Supabase is not configured.');
  const emailRedirectTo = Linking.createURL('auth/callback');
  const { data, error } = await client.auth.signUp({ email, password, options: { emailRedirectTo } });
  if (error) throw error;
  if (!data.session) return 'Doğrulama bağlantısını e-postana gönderdik. Bağlantıyı bu cihazda aç; hesabın uygulamada doğrulansın.';
  return null;
}

export async function completeAuthCallback(code: string) {
  if (!client) throw new Error('Supabase is not configured.');
  const { error } = await client.auth.exchangeCodeForSession(code);
  if (error) throw error;
}

async function clearPendingSync(userId: string, revision?: unknown) {
  const raw = await localStorage.getItem(PENDING_SYNC_KEY);
  if (!raw) return;
  try {
    const pending = JSON.parse(raw) as { userId?: unknown; revision?: unknown };
    if (pending.userId === userId && (revision === undefined || pending.revision === revision)) await localStorage.removeItem(PENDING_SYNC_KEY);
  } catch {
    await localStorage.removeItem(PENDING_SYNC_KEY);
  }
}

/** Retry the most recent local snapshot after connectivity returns, only for its original account. */
async function flushPendingSnapshotNow(): Promise<boolean | null> {
  if (!client) return null;
  const raw = await localStorage.getItem(PENDING_SYNC_KEY);
  if (!raw) return null;
  let pending: { userId?: unknown; revision?: unknown };
  try { pending = JSON.parse(raw) as typeof pending; }
  catch { await localStorage.removeItem(PENDING_SYNC_KEY); return null; }
  const state = await loadAppState();
  if (typeof pending.userId !== 'string' || !state) {
    await localStorage.removeItem(PENDING_SYNC_KEY);
    return null;
  }
  const { data: auth, error: authError } = await client.auth.getSession();
  if (authError || !auth.session || auth.session.user.id !== pending.userId) return null;
  const { error } = await client.from('user_snapshots').upsert({ user_id: auth.session.user.id, snapshot: state, updated_at: new Date().toISOString() });
  if (error) return false;
  await clearPendingSync(auth.session.user.id, pending.revision);
  return true;
}

export function flushPendingSnapshot(): Promise<boolean | null> {
  return enqueueCloudSync(flushPendingSnapshotNow);
}

export async function signIn(email: string, password: string) {
  if (!client) throw new Error('Supabase is not configured.');
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return null;
}

export async function signOut() {
  if (!client) return;
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

/** Drop the on-device session only. Must not call the Auth server. */
export async function signOutLocally() {
  if (!client) return;
  const { error } = await client.auth.signOut({ scope: 'local' });
  if (error) throw error;
}

export async function currentUserEmail(): Promise<string | null> {
  if (!client) return null;
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return null;
  return data.user.email ?? null;
}

export function subscribeToAuthChanges(callback: (email: string | null) => void) {
  if (!client) return () => {};
  const { data } = client.auth.onAuthStateChange((_event, session) => callback(session?.user?.email ?? null));
  return () => data.subscription.unsubscribe();
}

export async function removeAccount() {
  if (!client) throw new Error('Supabase is not configured.');
  const { data: auth } = await client.auth.getSession();
  if (!auth.session) throw new Error('Silmek için önce hesabına giriş yap.');
  const { error } = await client.functions.invoke('delete-account');
  if (error) throw error;
  await client.auth.signOut();
  await clearLocalState();
}

export async function pullSnapshot(): Promise<AppState | null> {
  if (!client) return null;
  const { data: auth } = await client.auth.getUser();
  if (!auth.user) return null;
  const { data, error } = await client.from('user_snapshots').select('snapshot').eq('user_id', auth.user.id).maybeSingle();
  if (error) throw error;
  return data?.snapshot == null ? null : parseAppState(data.snapshot);
}

export async function pushSnapshot(state: AppState) {
  if (!client) throw new Error('Supabase is not configured.');
  const { data: auth } = await client.auth.getUser();
  if (!auth.user) throw new Error('Bulut eşitleme için önce giriş yap.');
  await localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify({ userId: auth.user.id }));
  const { error } = await client.from('user_snapshots').upsert({
    user_id: auth.user.id,
    snapshot: state,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
  await clearPendingSync(auth.user.id);
}
