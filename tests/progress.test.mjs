import test from 'node:test';
import assert from 'node:assert/strict';
import { latestUnseenMilestone, milestoneByDay, resolveMilestoneCopy } from '../src/domain/milestones.ts';

test('late open shows only the latest unseen milestone', () => {
  assert.equal(latestUnseenMilestone(0, []), null);
  assert.equal(latestUnseenMilestone(9, [])?.day, 7);
  assert.equal(latestUnseenMilestone(9, ['day-7']), null);
  assert.equal(latestUnseenMilestone(90, ['day-90']), null);
});

test('kayma copy is used only as a variant, never as a reset', () => {
  const day7 = milestoneByDay(7);
  assert.ok(day7);
  const slipped = resolveMilestoneCopy(day7, true);
  const clean = resolveMilestoneCopy(day7, false);
  assert.equal(clean.eyebrow, 'BİR HAFTA OLDU');
  assert.equal(slipped.eyebrow, 'YOLCULUĞUN DEVAM EDİYOR');
  assert.equal(slipped.day, 7);
});
