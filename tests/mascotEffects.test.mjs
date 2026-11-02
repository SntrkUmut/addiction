import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  ALLOWED_MASCOT_EFFECTS,
  isAllowedMascotEffect,
  isMascotMotionEnabled,
  layerMascotEffects,
  sanitizeMascotEffects,
} from '../src/ui/mascotEffects.ts';

test('keeps decorative FX and drops smoke/fire', () => {
  assert.equal(isAllowedMascotEffect('shield'), true);
  assert.equal(isAllowedMascotEffect('crystals'), true);
  assert.equal(isAllowedMascotEffect('breath_ring'), true);
  assert.equal(isAllowedMascotEffect('bubbles'), true);
  assert.equal(isAllowedMascotEffect('sparkles'), true);
  assert.equal(isAllowedMascotEffect('smoke'), false);
  assert.equal(isAllowedMascotEffect('fire'), false);
  assert.equal(isAllowedMascotEffect('flame'), false);
  assert.equal(isAllowedMascotEffect('ember'), false);
  assert.equal(isAllowedMascotEffect('coal'), false);
  assert.deepEqual(
    sanitizeMascotEffects(['smoke', 'shield', 'crystals', 'shield', 'coal', 'flame', 'ember']),
    ['shield', 'crystals'],
  );
});

test('layers FX the way PR #1 did, with no front smoke', () => {
  const layered = layerMascotEffects(['breath_ring', 'bubbles', 'sparkles', 'crystals', 'shield']);
  assert.deepEqual(layered.back, ['breath_ring', 'sparkles', 'shield']);
  assert.deepEqual(layered.mid, ['bubbles', 'crystals']);
});

test('motion stays off until reduce-motion is known and disabled', () => {
  assert.equal(isMascotMotionEnabled(null), false);
  assert.equal(isMascotMotionEnabled(true), false);
  assert.equal(isMascotMotionEnabled(false), true);
});

test('restored fx assets use Metro @2x/@3x naming and omit smoke or @1x', () => {
  const files = readdirSync(join(import.meta.dirname, '../assets/mascot/fx'));
  assert.equal(files.some(name => /smoke|fire|flame|ember|coal/i.test(name)), false);
  assert.equal(files.some(name => name.includes('@1x')), false);
  for (const effect of ALLOWED_MASCOT_EFFECTS) {
    assert.ok(files.includes(`fx_${effect}.png`), `missing fx_${effect}.png`);
    assert.ok(files.includes(`fx_${effect}@2x.png`), `missing fx_${effect}@2x.png`);
    assert.ok(files.includes(`fx_${effect}@3x.png`), `missing fx_${effect}@3x.png`);
  }
});
