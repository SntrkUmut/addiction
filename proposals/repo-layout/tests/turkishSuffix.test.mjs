// npm test  (repo runner: node --experimental-strip-types --test tests/*.test.mjs)
import test from 'node:test';
import assert from 'node:assert/strict';
import { ablative, locative, dative, sinceLabel, untilLabel, chapterCta } from '../src/domain/turkishSuffix.ts';

test('ablative — Umut’s cases', () => {
  const umut = [[2026,'dan'],[2027,'den'],[2030,'dan'],[2025,'ten'],[2023,'ten'],
    [2024,'ten'],[2028,'den'],[2029,'dan'],[2040,'tan'],[2100,'den']];
  for (const [y, s] of umut) assert.equal(ablative(y), s, String(y));
});
test('ablative — every last word', () => {
  const more = [[2021,'den'],[2022,'den'],[2020,'den'],[2050,'den'],[2060,'tan'],
    [2070,'ten'],[2080,'den'],[2090,'dan'],[2000,'den'],[2010,'dan'],[2200,'den'],[1999,'dan'],
    [0,'dan'],[1000000,'dan']];
  for (const [y, s] of more) assert.equal(ablative(y), s, String(y));
});
test('locative and dative', () => {
  assert.equal(locative(2026), 'da'); assert.equal(locative(2025), 'te'); assert.equal(locative(2040), 'ta');
  const dat = [[1,'e'],[2,'ye'],[3,'e'],[4,'e'],[5,'e'],[6,'ya'],[7,'ye'],[8,'e'],
    [9,'a'],[10,'a'],[11,'e'],[12,'ye'],[16,'ya'],[20,'ye'],[30,'a'],[40,'a'],[50,'ye'],[60,'a'],[70,'e'],[100,'e']];
  for (const [n, s] of dat) assert.equal(dative(n), s, String(n));
});
test('labels', () => {
  assert.equal(sinceLabel(new Date(2026, 9, 21)), '21 Ekim 2026’dan beri');
  assert.equal(sinceLabel(new Date(2025, 0, 5)), '5 Ocak 2025’ten beri');
  assert.equal(sinceLabel(new Date(2040, 4, 1)), '1 Mayıs 2040’tan beri');
  assert.equal(untilLabel(new Date(2026, 10, 30)), '30 Kasım’a kadar');
  assert.equal(untilLabel(new Date(2026, 8, 1)), '1 Eylül’e kadar');
  assert.equal(chapterCta(2), 'Bölüm 2’ye bak');
  assert.equal(chapterCta(3), 'Bölüm 3’e bak');
  assert.equal(chapterCta(6), 'Bölüm 6’ya bak');
  assert.equal(chapterCta(9), 'Bölüm 9’a bak');
  assert.equal(chapterCta(10), 'Bölüm 10’a bak');
});
