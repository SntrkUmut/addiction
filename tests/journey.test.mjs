import test from 'node:test';
import assert from 'node:assert/strict';
import { journeyDay } from '../src/domain/journey.ts';

test('counts local calendar days with Math.round so a 23-hour DST spring-forward is still one day', () => {
  const previousTz = process.env.TZ;
  process.env.TZ = 'America/New_York';
  try {
    // 2026-03-08 is the US spring-forward: local midnights are 23 hours apart.
    // Math.floor(23h / 24h) would return 0; Math.round returns 1.
    assert.equal(journeyDay('2026-03-07', new Date(2026, 2, 8, 12)), 1);
    assert.equal(journeyDay('2026-03-07', new Date(2026, 2, 9, 12)), 2);
    assert.equal(journeyDay('2026-03-08', new Date(2026, 2, 8, 9)), 0);
  } finally {
    if (previousTz === undefined) delete process.env.TZ;
    else process.env.TZ = previousTz;
  }
});

test('a later slip does not change journeyDay', () => {
  const now = new Date(2026, 9, 30, 18);
  assert.equal(journeyDay('2026-10-21', now), 9);
});
