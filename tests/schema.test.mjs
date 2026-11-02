import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAppState } from '../src/data/schema.ts';

const profile = {
  name: 'Ada',
  cigarettesPerDay: 10,
  packPrice: 100,
  packSize: 20,
  quitDate: '2026-10-21',
  reason: 'Nefes',
  currency: 'TRY',
};
const event = {
  id: 'event-1',
  kind: 'checkin',
  at: '2026-10-21T08:00:00.000Z',
  details: { mood: 'İyi' },
};

test('accepts valid state and returns only the supported profile and event fields', () => {
  const parsed = parseAppState({
    profile: { ...profile, unexpectedCredential: 'ignored' },
    events: [{ ...event, unexpectedField: true }],
    unexpectedTopLevel: true,
  });

  assert.deepEqual(parsed, { profile, events: [event] });
});

test('accepts an unconfigured profile with local events', () => {
  assert.deepEqual(parseAppState({ profile: null, events: [event] }), { profile: null, events: [event] });
});

test('rejects invalid event kinds, timestamps, and non-object details', () => {
  assert.equal(parseAppState({ profile: null, events: [{ ...event, kind: 'unknown' }] }), null);
  assert.equal(parseAppState({ profile: null, events: [{ ...event, at: 'not-a-date' }] }), null);
  assert.equal(parseAppState({ profile: null, events: [{ ...event, details: [] }] }), null);
});

test('rejects impossible plans and incomplete package price pairs', () => {
  assert.equal(parseAppState({ profile: { ...profile, cigarettesPerDay: 101 }, events: [] }), null);
  assert.equal(parseAppState({ profile: { ...profile, packSize: 0 }, events: [] }), null);
});

test('rejects snapshots larger than the cloud snapshot limit', () => {
  const oversizedEvent = { ...event, details: { note: 'x'.repeat(700_000) } };

  assert.equal(parseAppState({ profile: null, events: [oversizedEvent] }), null);
});
