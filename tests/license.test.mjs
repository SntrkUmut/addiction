import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('the app is closed-source: UNLICENSED, private, all rights reserved', () => {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.private, true);
  assert.equal(pkg.license, 'UNLICENSED');

  const license = readFileSync(new URL('../LICENSE', import.meta.url), 'utf8');
  assert.match(license, /^Copyright \(c\) 2026 Umut Şentürk\. All rights reserved\./m);
  assert.match(license, /Unauthorized copying, distribution, or modification of this code, via any medium, is strictly prohibited\./);
  assert.equal(license.includes('MIT License'), false);
  assert.equal(license.includes('650 Industries'), false);
});
