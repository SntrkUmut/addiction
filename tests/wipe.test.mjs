import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AES_KEY_SUFFIX,
  ASYNC_STORAGE_KEYS,
  EXPORT_CACHE_FILE,
  FALLBACK_AUTH_STORAGE_KEY,
  HAPTICS_ENABLED_KEY,
  LAST_FETCH_KEY,
  LEGACY_MILESTONES_KEY,
  MANIFEST_CACHE_KEY,
  PENDING_SYNC_KEY,
  REMINDER_KEY,
  SQLITE_KEYS,
  STATE_KEY,
  THEME_MODE_KEY,
  secureStoreKeysFor,
  supabaseAuthStorageKeys,
  wipeLocalData,
} from '../src/data/wipe.ts';

const root = dirname(fileURLToPath(new URL('../package.json', import.meta.url)));

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, files);
    else files.push(path);
  }
  return files;
}

function mockDeps(overrides = {}) {
  const sqlite = new Map();
  const asyncStore = new Map();
  const secure = new Set();
  const calls = {
    sqliteRemoved: [],
    sqliteCleared: 0,
    asyncRemoved: [],
    asyncCleared: 0,
    secureDeleted: [],
    notificationsCancelled: 0,
    notificationsDismissed: 0,
    badgeResets: 0,
    cacheDeleted: [],
    signOut: 0,
    memoryResets: 0,
    signOutScopes: [],
  };

  for (const key of SQLITE_KEYS) sqlite.set(key, 'yes');
  for (const key of ASYNC_STORAGE_KEYS) asyncStore.set(key, 'yes');
  asyncStore.set('sb-demo-auth-token', 'session');
  secure.add('sb-demo-auth-token:aes-gcm-v2');

  const deps = {
    sqliteRemove: async key => {
      calls.sqliteRemoved.push(key);
      sqlite.delete(key);
    },
    sqliteClear: async () => {
      calls.sqliteCleared += 1;
      sqlite.clear();
    },
    asyncStorageKeys: async () => [...asyncStore.keys()],
    asyncStorageRemove: async keys => {
      for (const key of keys) {
        calls.asyncRemoved.push(key);
        asyncStore.delete(key);
      }
    },
    asyncStorageClear: async () => {
      calls.asyncCleared += 1;
      asyncStore.clear();
    },
    secureStoreDelete: async key => {
      calls.secureDeleted.push(key);
      secure.delete(key);
    },
    cancelNotifications: async () => {
      calls.notificationsCancelled += 1;
    },
    dismissNotifications: async () => {
      calls.notificationsDismissed += 1;
    },
    resetBadge: async () => {
      calls.badgeResets += 1;
    },
    deleteCacheFile: async name => {
      calls.cacheDeleted.push(name);
    },
    signOutLocal: async () => {
      calls.signOut += 1;
      calls.signOutScopes.push({ scope: 'local' });
    },
    resetMemory: () => {
      calls.memoryResets += 1;
    },
    ...overrides,
  };

  return { deps, calls, sqlite, asyncStore, secure };
}

test('inventory lists every quit-* persist key used in the app', () => {
  const listed = new Set([
    ...SQLITE_KEYS,
    ...ASYNC_STORAGE_KEYS,
    EXPORT_CACHE_FILE,
  ]);
  assert.deepEqual([...listed].sort(), [
    EXPORT_CACHE_FILE,
    LAST_FETCH_KEY,
    HAPTICS_ENABLED_KEY,
    MANIFEST_CACHE_KEY,
    LEGACY_MILESTONES_KEY,
    PENDING_SYNC_KEY,
    STATE_KEY,
    REMINDER_KEY,
    THEME_MODE_KEY,
  ].sort());

  const found = new Set();
  for (const file of walk(join(root, 'src')).concat([join(root, 'App.tsx')])) {
    if (!['.ts', '.tsx', '.js', '.mjs'].includes(extname(file))) continue;
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/['"](quit-[a-z0-9-]+-v1|quit-veri\.json)['"]/g)) found.add(match[1]);
  }
  for (const key of found) {
    assert.equal(listed.has(key), true, `unlisted persist key ${key}`);
  }
});

test('supabase auth keys include the default token and project-ref variants', () => {
  const keys = supabaseAuthStorageKeys('https://abcd.supabase.co');
  assert.equal(keys.includes(FALLBACK_AUTH_STORAGE_KEY), true);
  assert.equal(keys.includes('sb-abcd-auth-token'), true);
  assert.equal(keys.includes('sb-abcd-auth-token-code-verifier'), true);
  assert.equal(keys.includes('sb-abcd-auth-token-user'), true);
  assert.equal(keys.includes('sb-abcd-auth-token-flows-code-verifier'), true);
  assert.deepEqual(
    secureStoreKeysFor(['sb-abcd-auth-token']),
    ['sb-abcd-auth-token', `sb-abcd-auth-token${AES_KEY_SUFFIX}`],
  );
});

test('wipe removes every known key, cancels notifications, and signs out locally', async () => {
  const previousFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = async () => {
    fetchCalls += 1;
    throw new Error('network should not be used');
  };

  const { deps, calls, sqlite, asyncStore, secure } = mockDeps();
  const result = await wipeLocalData(deps);
  globalThis.fetch = previousFetch;

  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
  assert.equal(fetchCalls, 0);
  assert.equal(calls.signOut, 1);
  assert.deepEqual(calls.signOutScopes, [{ scope: 'local' }]);
  for (const key of SQLITE_KEYS) {
    assert.equal(calls.sqliteRemoved.includes(key), true, key);
  }
  assert.equal(calls.sqliteCleared, 1);
  assert.equal(sqlite.size, 0);
  assert.equal(calls.asyncRemoved.includes(THEME_MODE_KEY), true);
  assert.equal(calls.asyncCleared, 1);
  assert.equal(asyncStore.size, 0);
  assert.equal(calls.secureDeleted.includes(`sb-demo-auth-token${AES_KEY_SUFFIX}`), true);
  assert.equal(secure.size, 0);
  assert.equal(calls.notificationsCancelled, 1);
  assert.equal(calls.notificationsDismissed, 1);
  assert.equal(calls.badgeResets, 1);
  assert.deepEqual(calls.cacheDeleted, [EXPORT_CACHE_FILE]);
  assert.equal(calls.memoryResets, 1);
});

test('a partial error does not stop the rest of the wipe', async () => {
  const { deps, calls } = mockDeps({
    sqliteRemove: async key => {
      calls.sqliteRemoved.push(key);
      if (key === STATE_KEY) throw new Error('sqlite busy');
    },
  });

  const result = await wipeLocalData(deps);

  assert.equal(result.ok, false);
  assert.equal(result.errors.includes('sqlite:quit-companion-state-v1'), true);
  assert.equal(calls.sqliteRemoved.includes(REMINDER_KEY), true);
  assert.equal(calls.sqliteRemoved.includes(MANIFEST_CACHE_KEY), true);
  assert.equal(calls.sqliteCleared, 1);
  assert.equal(calls.asyncCleared, 1);
  assert.equal(calls.notificationsCancelled, 1);
  assert.equal(calls.notificationsDismissed, 1);
  assert.equal(calls.badgeResets, 1);
  assert.deepEqual(calls.cacheDeleted, [EXPORT_CACHE_FILE]);
  assert.equal(calls.memoryResets, 1);
});

test('a signOut network error is non-fatal and the rest of the wipe still runs', async () => {
  const { deps, calls, sqlite, asyncStore } = mockDeps({
    signOutLocal: async () => {
      calls.signOut += 1;
      throw new Error('Network request failed');
    },
  });

  const result = await wipeLocalData(deps);

  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
  assert.equal(calls.signOut, 1);
  assert.equal(sqlite.size, 0);
  assert.equal(asyncStore.size, 0);
  assert.equal(calls.notificationsCancelled, 1);
  assert.equal(calls.memoryResets, 1);
});

test('missing web APIs are non-fatal', async () => {
  const { deps, calls, sqlite, asyncStore } = mockDeps({
    secureStoreDelete: async () => {
      throw new Error('SecureStore is unavailable on web');
    },
    cancelNotifications: async () => {
      throw new Error('Notifications unavailable');
    },
    dismissNotifications: async () => {
      throw new Error('Notifications unavailable');
    },
    resetBadge: async () => {
      throw new Error('Badge unavailable');
    },
    deleteCacheFile: async () => {
      throw new Error('FileSystem unavailable');
    },
  });

  const result = await wipeLocalData(deps);

  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
  assert.equal(sqlite.size, 0);
  assert.equal(asyncStore.size, 0);
  assert.equal(calls.sqliteCleared, 1);
  assert.equal(calls.asyncCleared, 1);
  assert.equal(calls.memoryResets, 1);
});

test('signOutLocally is local-only and wipe never calls the server', () => {
  const store = readFileSync(new URL('../src/data/store.ts', import.meta.url), 'utf8');
  assert.match(store, /signOut\(\{ scope: 'local' \}\)/);
  const signOutLocal = store.slice(store.indexOf('export async function signOutLocally'));
  const fn = signOutLocal.slice(0, signOutLocal.indexOf('export async function currentUserEmail'));
  assert.equal(fn.includes("from('user_snapshots')"), false);
  assert.equal(fn.includes('functions.invoke'), false);
  assert.equal(fn.includes('delete-account'), false);
  assert.equal(/signOut\(\)/.test(fn), false);

  const wipe = readFileSync(new URL('../src/data/wipe.ts', import.meta.url), 'utf8');
  assert.equal(wipe.includes('user_snapshots'), false);
  assert.equal(wipe.includes('delete-account'), false);
  assert.equal(wipe.includes('functions.invoke'), false);
  assert.match(wipe, /cancelAllScheduledNotificationsAsync/);
  assert.match(wipe, /dismissAllNotificationsAsync/);
  assert.match(wipe, /setBadgeCountAsync\(0\)/);
});

test('Ben uses the approved Alert copy, terracotta accent, and a11y on Verilerimi sil', () => {
  const ben = readFileSync(new URL('../src/screens/Ben.tsx', import.meta.url), 'utf8');
  assert.match(ben, /Tüm verilerin silinsin mi\?/);
  assert.match(
    ben,
    /Yolculuğun, ışıkların, rozetlerin ve ayarların bu cihazdan kalıcı olarak silinecek\. Bu işlem geri alınamaz\./,
  );
  assert.match(ben, /text: 'Vazgeç', style: 'cancel'/);
  assert.match(ben, /text: 'Sil', style: 'destructive'/);
  assert.match(ben, /Silinemedi\. Lütfen tekrar dene\./);
  assert.match(ben, /text: 'Tekrar dene'/);
  assert.match(ben, /accessibilityRole="button"/);
  assert.match(ben, /accessibilityLabel="Verilerimi sil"/);
  assert.match(ben, /accessibilityHint="Bu cihazdaki tüm verileri kalıcı olarak siler"/);
  assert.match(ben, /colors\.text\.accent/);
  assert.equal(/yak|yan/.test(ben.slice(ben.indexOf('confirmDelete'))), false);
  assert.equal(ben.includes('#FF0000'), false);
  assert.equal(ben.includes('colors.action.primary'), true); // reminder switch, not the wipe
  const deleteBlock = ben.slice(ben.indexOf('deleteSection'));
  assert.equal(deleteBlock.includes('colors.action.primary'), false);
});

test('wipe returns to onboarding without restarting the app', () => {
  const app = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8');
  assert.match(app, /wipeDeviceData/);
  assert.match(app, /emptyAppState\(\)/);
  assert.match(app, /setOnboardingVisible\(true\)/);
  assert.match(app, /router\.replace\('\/'\)/);
  assert.match(app, /resetMode\(\)/);
  assert.equal(app.includes("setMode('system')"), false);
  assert.equal(app.includes('Updates.reloadAsync'), false);
  assert.equal(app.includes('DevSettings.reload'), false);
});

test('resetMode restores system theme in memory without writing the key back', () => {
  const theme = readFileSync(new URL('../src/ui/theme.ts', import.meta.url), 'utf8');
  const resetMode = theme.slice(theme.indexOf('const resetMode'), theme.indexOf('const value'));
  assert.match(resetMode, /resetThemeMemory\(\)/);
  assert.match(resetMode, /setModeState\('system'\)/);
  assert.equal(resetMode.includes('setThemeMode'), false);
  assert.equal(resetMode.includes('AsyncStorage.setItem'), false);

  const app = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8');
  const fn = app.slice(app.indexOf('const handleDeleteData'), app.indexOf('const handleExport'));
  assert.match(fn, /resetMode\(\)/);
  assert.equal(/\bsetMode\(/.test(fn), false);
  assert.equal(fn.includes('setThemeMode'), false);
});

test('a failed wipe stays on Ben and offers Tekrar dene', () => {
  const ben = readFileSync(new URL('../src/screens/Ben.tsx', import.meta.url), 'utf8');
  assert.match(ben, /const WIPE_ERROR_MESSAGE = 'Silinemedi\. Lütfen tekrar dene\.';/);
  const catchBlock = ben.slice(ben.indexOf('} catch {'), ben.indexOf('} finally {'));
  assert.match(catchBlock, /WIPE_ERROR_MESSAGE/);
  assert.match(catchBlock, /text: 'Vazgeç', style: 'cancel'/);
  assert.match(catchBlock, /text: 'Tekrar dene'/);
  assert.match(catchBlock, /onPress: \(\) => \{ runDelete\(\); \}/);

  const app = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8');
  const fn = app.slice(app.indexOf('const handleDeleteData'), app.indexOf('const handleExport'));
  const failIdx = fn.indexOf("throw new Error('wipe')");
  const onboardIdx = fn.indexOf('setOnboardingVisible(true)');
  assert.equal(failIdx !== -1, true);
  assert.equal(onboardIdx !== -1, true);
  assert.equal(failIdx < onboardIdx, true);
  assert.match(fn, /if \(!result\.ok\)/);
});
