import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { latestUnseenMilestone, milestoneByDay, resolveMilestoneCopy } from '../src/domain/milestones.ts';

const bundled = JSON.parse(
  readFileSync(new URL('../src/content/manifest.bundled.json', import.meta.url), 'utf8'),
);

test('bundled offline fallback is full approved v11 (8 chapters)', () => {
  assert.equal(bundled.version, 11);
  assert.equal(bundled.chapters.length, 8);
  assert.deepEqual(
    bundled.chapters.map(chapter => chapter.id),
    ['ch-temel', 'ch-bahce', 'ch-dere', 'ch-orman', 'ch-teras', 'ch-kis-odasi', 'ch-kiyi', 'ch-tepe'],
  );
  assert.ok(bundled.chapters.every(chapter => chapter.copyStatus === 'approved'));
  assert.equal(
    bundled.chapters.reduce((sum, chapter) => sum + chapter.pieces.length, 0),
    48,
  );
  assert.equal(bundled.items.length, 28);
});

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
