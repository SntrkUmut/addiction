import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  CLOUD_SYNC_CARD_TITLE,
  cloudSyncStatusSubtitle,
  isProductionBuild,
  ON_DEVICE_DATA_NOTE,
  shouldShowCloudSyncCard,
} from '../src/domain/buildEnv.ts';

function withAppEnv(value, fn) {
  const previous = process.env.EXPO_PUBLIC_APP_ENV;
  if (value === undefined) delete process.env.EXPO_PUBLIC_APP_ENV;
  else process.env.EXPO_PUBLIC_APP_ENV = value;
  try {
    fn();
  } finally {
    if (previous === undefined) delete process.env.EXPO_PUBLIC_APP_ENV;
    else process.env.EXPO_PUBLIC_APP_ENV = previous;
  }
}

test('production and prod hide the cloud-sync card and use the on-device note', () => {
  assert.equal(isProductionBuild('production'), true);
  assert.equal(isProductionBuild('prod'), true);
  assert.equal(shouldShowCloudSyncCard('production'), false);
  assert.equal(shouldShowCloudSyncCard('prod'), false);
  assert.equal(cloudSyncStatusSubtitle(true, 'production'), ON_DEVICE_DATA_NOTE);
  assert.equal(cloudSyncStatusSubtitle(false, 'production'), ON_DEVICE_DATA_NOTE);
  assert.equal(ON_DEVICE_DATA_NOTE, 'Verilerin bu cihazda saklanır');
});

test('preview, development and unset env keep the optional sign-in status card', () => {
  assert.equal(isProductionBuild('preview'), false);
  assert.equal(isProductionBuild('development'), false);
  assert.equal(isProductionBuild(undefined), false);
  assert.equal(shouldShowCloudSyncCard('preview'), true);
  assert.equal(shouldShowCloudSyncCard('development'), true);
  assert.equal(shouldShowCloudSyncCard(undefined), true);
  assert.equal(CLOUD_SYNC_CARD_TITLE, 'Bulut eşitleme');
  assert.equal(
    cloudSyncStatusSubtitle(true, 'preview'),
    'Uzak içerik ve yedekleme hazır · giriş isteğe bağlı',
  );
  assert.equal(
    cloudSyncStatusSubtitle(false, 'preview'),
    'Bağlı değil · Tüm veriler cihazda',
  );
});

test('isProductionBuild reads EXPO_PUBLIC_APP_ENV from the process', () => {
  withAppEnv('production', () => {
    assert.equal(isProductionBuild(), true);
    assert.equal(shouldShowCloudSyncCard(), false);
    assert.equal(cloudSyncStatusSubtitle(true), ON_DEVICE_DATA_NOTE);
  });
  withAppEnv('preview', () => {
    assert.equal(isProductionBuild(), false);
    assert.equal(shouldShowCloudSyncCard(), true);
  });
});

test('Ben gates the cloud-sync card at the UI and keeps the production note', () => {
  const source = readFileSync(new URL('../src/screens/Ben.tsx', import.meta.url), 'utf8');
  assert.match(source, /shouldShowCloudSyncCard/);
  assert.match(source, /ON_DEVICE_DATA_NOTE/);
  assert.match(source, /CLOUD_SYNC_CARD_TITLE/);
  assert.match(source, /cloudSyncStatusSubtitle/);
  assert.equal(source.includes('signUp'), false);
  assert.equal(source.includes('signIn'), false);
});
