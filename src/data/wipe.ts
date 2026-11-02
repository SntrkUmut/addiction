/**
 * Single inventory of every persist key this app writes, plus the local-only
 * wipe used by Ben → Verilerimi sil. New storage must be added here.
 */

export const STATE_KEY = 'quit-companion-state-v1';
export const PENDING_SYNC_KEY = 'quit-companion-pending-sync-v1';
export const LEGACY_MILESTONES_KEY = 'quit-milestones-seen-v1';
export const REMINDER_KEY = 'quit-companion-reminder-v1';
export const HAPTICS_ENABLED_KEY = 'quit-haptics-enabled-v1';
export const THEME_MODE_KEY = 'quit-theme-mode-v1';
export const MANIFEST_CACHE_KEY = 'quit-content-manifest-v1';
export const LAST_FETCH_KEY = 'quit-content-last-fetch-v1';
export const EXPORT_CACHE_FILE = 'quit-veri.json';
export const AES_KEY_SUFFIX = ':aes-gcm-v2';
export const FALLBACK_AUTH_STORAGE_KEY = 'supabase.auth.token';

export const SQLITE_KEYS = [
  STATE_KEY,
  PENDING_SYNC_KEY,
  LEGACY_MILESTONES_KEY,
  REMINDER_KEY,
  HAPTICS_ENABLED_KEY,
  MANIFEST_CACHE_KEY,
  LAST_FETCH_KEY,
] as const;

export const ASYNC_STORAGE_KEYS = [THEME_MODE_KEY] as const;

const AUTH_KEY_SUFFIXES = ['', '-code-verifier', '-user', '-flows-code-verifier'] as const;

export function supabaseProjectRef(supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL): string | null {
  if (!supabaseUrl) return null;
  try {
    const ref = new URL(supabaseUrl).hostname.split('.')[0];
    return ref || null;
  } catch {
    return null;
  }
}

/** Auth keys supabase-js and GoTrue may write for this project. */
export function supabaseAuthStorageKeys(supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL): string[] {
  const bases = [FALLBACK_AUTH_STORAGE_KEY];
  const ref = supabaseProjectRef(supabaseUrl);
  if (ref) bases.push(`sb-${ref}-auth-token`);
  return bases.flatMap(base => AUTH_KEY_SUFFIXES.map(suffix => `${base}${suffix}`));
}

export function secureStoreKeysFor(storageKeys: readonly string[]): string[] {
  return storageKeys.flatMap(key => [key, `${key}${AES_KEY_SUFFIX}`]);
}

export type WipeDeps = {
  sqliteRemove: (key: string) => Promise<void>;
  sqliteClear: () => Promise<void>;
  asyncStorageKeys: () => Promise<readonly string[]>;
  asyncStorageRemove: (keys: readonly string[]) => Promise<void>;
  asyncStorageClear: () => Promise<void>;
  secureStoreDelete: (key: string) => Promise<void>;
  cancelNotifications: () => Promise<void>;
  resetBadge: () => Promise<void>;
  deleteCacheFile: (name: string) => Promise<void>;
  signOutLocal: () => Promise<void>;
  resetMemory: () => void;
};

export type WipeResult = { ok: boolean; errors: string[] };

async function step(errors: string[], name: string, run: () => Promise<void> | void) {
  try {
    await run();
  } catch {
    errors.push(name);
  }
}

/**
 * Clear every local persist surface. Never writes or deletes on a server.
 * Each step is isolated so a partial failure still continues.
 */
export async function wipeLocalData(deps: WipeDeps): Promise<WipeResult> {
  const errors: string[] = [];
  const authKeys = supabaseAuthStorageKeys();

  await step(errors, 'signOutLocal', () => deps.signOutLocal());

  for (const key of SQLITE_KEYS) {
    await step(errors, `sqlite:${key}`, () => deps.sqliteRemove(key));
  }
  await step(errors, 'sqliteClear', () => deps.sqliteClear());

  const asyncKeys = new Set<string>([...ASYNC_STORAGE_KEYS, ...authKeys]);
  await step(errors, 'asyncStorageKeys', async () => {
    for (const key of await deps.asyncStorageKeys()) asyncKeys.add(key);
  });
  for (const key of asyncKeys) {
    await step(errors, `asyncStorage:${key}`, () => deps.asyncStorageRemove([key]));
    await step(errors, `secureStore:${key}`, () => deps.secureStoreDelete(key));
    await step(errors, `secureStore:${key}${AES_KEY_SUFFIX}`, () => deps.secureStoreDelete(`${key}${AES_KEY_SUFFIX}`));
  }
  await step(errors, 'asyncStorageClear', () => deps.asyncStorageClear());

  await step(errors, 'cancelNotifications', () => deps.cancelNotifications());
  await step(errors, 'resetBadge', () => deps.resetBadge());
  await step(errors, 'exportCache', () => deps.deleteCacheFile(EXPORT_CACHE_FILE));
  await step(errors, 'resetMemory', () => { deps.resetMemory(); });

  return { ok: errors.length === 0, errors };
}

/** Device wiring. Dynamic imports keep unit tests free of native modules. */
export async function wipeDeviceData(): Promise<WipeResult> {
  const [
    { default: AsyncStorage },
    SecureStore,
    Notifications,
    { File, Paths },
    { signOutLocally },
    { resetHapticsMemory },
    { resetThemeMemory },
  ] = await Promise.all([
    import('@react-native-async-storage/async-storage'),
    import('expo-secure-store'),
    import('expo-notifications'),
    import('expo-file-system'),
    import('./store'),
    import('../ui/haptics'),
    import('../ui/theme'),
  ]);

  return wipeLocalData({
    sqliteRemove: async key => {
      localStorage.removeItem(key);
    },
    sqliteClear: async () => {
      localStorage.clear();
    },
    asyncStorageKeys: () => AsyncStorage.getAllKeys(),
    asyncStorageRemove: keys => AsyncStorage.multiRemove([...keys]),
    asyncStorageClear: () => AsyncStorage.clear(),
    secureStoreDelete: key => SecureStore.deleteItemAsync(key),
    cancelNotifications: () => Notifications.cancelAllScheduledNotificationsAsync(),
    resetBadge: async () => {
      await Notifications.setBadgeCountAsync(0);
    },
    deleteCacheFile: async name => {
      const file = new File(Paths.cache, name);
      if (file.exists) file.delete();
    },
    signOutLocal: signOutLocally,
    resetMemory: () => {
      resetHapticsMemory();
      resetThemeMemory();
    },
  });
}
