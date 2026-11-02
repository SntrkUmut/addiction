import test from 'node:test';
import assert from 'node:assert/strict';
import { earnedLight } from '../src/domain/rewards.ts';

const event = (id, kind, at, details = {}) => ({ id, kind, at, details });

test('awards at most one check-in light per local calendar day', () => {
  const morning = new Date(2026, 9, 21, 8).toISOString();
  const evening = new Date(2026, 9, 21, 20).toISOString();

  assert.equal(earnedLight([
    event('checkin-morning', 'checkin', morning),
    event('checkin-evening', 'checkin', evening),
  ]), 1);
});

test('awards a check-in light on each distinct local day', () => {
  const firstDay = new Date(2026, 9, 21, 23, 59).toISOString();
  const nextDay = new Date(2026, 9, 22, 0, 1).toISOString();

  assert.equal(earnedLight([
    event('checkin-1', 'checkin', firstDay),
    event('checkin-2', 'checkin', nextDay),
  ]), 2);
});

test('awards one light for each distinct completed coping event', () => {
  const at = new Date(2026, 9, 21, 12).toISOString();
  const first = event('coping-1', 'coping', at);
  const second = event('coping-2', 'coping', at);

  assert.equal(earnedLight([first, second]), 2);
  assert.equal(earnedLight([first, first]), 1);
});

test('slips and uncompleted urge events never remove or grant lights', () => {
  const at = new Date(2026, 9, 21, 12).toISOString();

  assert.equal(earnedLight([
    event('checkin', 'checkin', at),
    event('slip', 'slip', at),
    event('craving', 'craving', at),
    event('result', 'urge_result', at),
  ]), 1);
});

test('ignores check-ins with invalid timestamps', () => {
  assert.equal(earnedLight([event('bad-date', 'checkin', 'not-a-date')]), 0);
});
