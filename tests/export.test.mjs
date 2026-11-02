import test from 'node:test';
import assert from 'node:assert/strict';
import { createExportJson } from '../src/domain/export.ts';

test('exports a versioned, timestamped snapshot with its full history', () => {
  const state = {
    profile: { name: 'Ada', cigarettesPerDay: 8, packPrice: 90, packSize: 20, quitDate: '2026-10-21', reason: 'Nefes', currency: 'TRY' },
    events: [{ id: 'event-1', kind: 'checkin', at: '2026-10-21T08:00:00.000Z', details: { mood: 'İyi' } }],
  };
  const exported = JSON.parse(createExportJson(state, new Date('2026-10-21T12:00:00.000Z')));

  assert.equal(exported.format, 'quit-companion-export');
  assert.equal(exported.formatVersion, 1);
  assert.equal(exported.exportedAt, '2026-10-21T12:00:00.000Z');
  assert.deepEqual(exported.profile, state.profile);
  assert.deepEqual(exported.events, state.events);
  assert.equal('email' in exported, false);
});

test('exports an unconfigured profile as null without losing local events', () => {
  const state = { profile: null, events: [] };
  const exported = JSON.parse(createExportJson(state, new Date('2026-10-21T12:00:00.000Z')));

  assert.equal(exported.profile, null);
  assert.deepEqual(exported.events, []);
});
