import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('app.json repeats the union of required-reason APIs at expo.ios.privacyManifests', () => {
  const app = JSON.parse(readFileSync(new URL('../app.json', import.meta.url), 'utf8'));
  const manifests = app.expo.ios.privacyManifests;

  assert.equal(manifests.NSPrivacyTracking, false);
  assert.deepEqual(manifests.NSPrivacyTrackingDomains, []);
  assert.deepEqual(manifests.NSPrivacyCollectedDataTypes, []);

  const byType = Object.fromEntries(
    manifests.NSPrivacyAccessedAPITypes.map(entry => [
      entry.NSPrivacyAccessedAPIType,
      entry.NSPrivacyAccessedAPITypeReasons,
    ]),
  );

  assert.deepEqual(byType.NSPrivacyAccessedAPICategoryUserDefaults, ['CA92.1']);
  assert.deepEqual(byType.NSPrivacyAccessedAPICategoryFileTimestamp, ['C617.1', '0A2A.1', '3B52.1']);
  assert.deepEqual(byType.NSPrivacyAccessedAPICategorySystemBootTime, ['35F9.1']);
  assert.deepEqual(byType.NSPrivacyAccessedAPICategoryDiskSpace, ['E174.1', '85F4.1']);
  assert.equal(Object.keys(byType).length, 4);
});
