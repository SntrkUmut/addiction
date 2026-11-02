import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  accessoryPose,
  MASCOT_ACCESSORIES,
} from '../src/ui/mascotAccessories.ts';

const MASCOT_DIR = join(import.meta.dirname, '../assets/mascot');
const APP_POSES = ['fox_sleepy', 'fox_calm', 'fox_idle', 'fox_cheer', 'fox_happy', 'fox_wave'];

function metroFiles(file) {
  const stem = file.replace(/\.png$/, '');
  return [`${stem}.png`, `${stem}@2x.png`, `${stem}@3x.png`];
}

test('runtime accessory data drops preview, notes, and @1x maps', () => {
  const blob = JSON.stringify(MASCOT_ACCESSORIES);
  assert.equal(blob.includes('preview'), false);
  assert.equal(blob.includes('not_recommended'), false);
  assert.equal(blob.includes('@1x'), false);
  assert.equal(Object.keys(MASCOT_ACCESSORIES).length, 10);
});

test('glove wave uses the corrected bbox and ruzgarlik idle uses the base file', () => {
  const wave = accessoryPose('it-orgu-eldiven', 'fox_wave');
  assert.ok(wave);
  assert.deepEqual(
    wave.bbox.map(value => Number(value.toFixed(3))),
    [0.34, 0.331, 0.885, 0.815],
  );
  assert.equal(wave.file, 'it-orgu-eldiven-wave.png');

  const sleepyHat = accessoryPose('it-hasir-sapka', 'fox_sleepy');
  assert.ok(sleepyHat);
  assert.equal(sleepyHat.fit.scale, 0.95);
  assert.equal(sleepyHat.fit.rotate, -6);
  assert.equal(sleepyHat.fit.tx, 0.03);
  assert.equal(sleepyHat.fit.ty, -0.006);
  assert.equal(sleepyHat.file, 'it-hasir-sapka.png');

  const idleWindbreaker = accessoryPose('it-ruzgarlik', 'fox_idle');
  assert.ok(idleWindbreaker);
  assert.equal(idleWindbreaker.file, 'it-ruzgarlik.png');
  assert.equal(idleWindbreaker.file.includes('idle'), false);
});

test('every app pose/accessory pair that has data resolves to Metro @2x/@3x files', () => {
  const missing = [];
  for (const [id, accessory] of Object.entries(MASCOT_ACCESSORIES)) {
    for (const pose of APP_POSES) {
      const data = accessoryPose(id, pose);
      if (!data) continue;
      if (accessory.perPoseFiles && data.file === `${id}.png`) {
        assert.equal(pose, 'fox_idle', `${id} ${pose} should not fall back to the base file`);
      }
      for (const name of metroFiles(data.file)) {
        if (!existsSync(join(MASCOT_DIR, name))) missing.push(`${id}/${pose}/${name}`);
      }
    }
  }
  assert.deepEqual(missing, []);
});

test('Mascot require map uses the base windbreaker file for idle', () => {
  const mascot = readFileSync(join(import.meta.dirname, '../src/ui/Mascot.tsx'), 'utf8');
  assert.match(mascot, /fox_idle:\s*require\('\.\.\/\.\.\/assets\/mascot\/it-ruzgarlik\.png'\)/);
  assert.equal(mascot.includes('it-ruzgarlik-idle'), false);
  assert.equal(mascot.includes('accessories.json'), false);
});

test('shipped accessory pngs keep Metro density names and omit @1x and idle leftovers', () => {
  const files = readdirSync(MASCOT_DIR).filter(name => name.startsWith('it-') && name.endsWith('.png'));
  assert.equal(files.some(name => name.includes('@1x')), false);
  assert.equal(files.some(name => name.includes('idle')), false);
  assert.equal(files.some(name => name.includes('preview')), false);
  assert.ok(files.includes('it-ruzgarlik.png'));
  assert.ok(files.includes('it-ruzgarlik@2x.png'));
  assert.ok(files.includes('it-ruzgarlik@3x.png'));
});
