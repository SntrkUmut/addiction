import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  CHAPTER_CHROME,
  chapterCompletedByLight,
  chapterSeenKey,
  endOfContentView,
  isEndOfPublishedContent,
  nextChapterFogTeaser,
  nextUnseenChapterCompletion,
} from '../src/domain/chapters.ts';

const bundled = JSON.parse(
  readFileSync(new URL('../src/content/manifest.bundled.json', import.meta.url), 'utf8'),
);

const ALL_CHAPTER_KEYS = bundled.chapters.map(chapter => chapterSeenKey(chapter.order));

test('chapter celebration fires once per chapter via seen key', () => {
  const first = nextUnseenChapterCompletion(bundled, 12, []);
  assert.equal(first?.order, 1);
  assert.equal(first?.key, 'chapter-1');
  assert.equal(first?.lightsAtCompletion, 12);
  assert.equal(first?.completed.id, 'ch-temel');
  assert.equal(first?.next?.id, 'ch-bahce');
  assert.equal(nextUnseenChapterCompletion(bundled, 12, ['chapter-1']), null);

  const second = nextUnseenChapterCompletion(bundled, 24, ['chapter-1']);
  assert.equal(second?.order, 2);
  assert.equal(second?.key, 'chapter-2');
  assert.equal(nextUnseenChapterCompletion(bundled, 24, ['chapter-1', 'chapter-2']), null);

  const last = nextUnseenChapterCompletion(bundled, 96, ALL_CHAPTER_KEYS.slice(0, 7));
  assert.equal(last?.order, 8);
  assert.equal(last?.next, null);
  assert.equal(nextUnseenChapterCompletion(bundled, 96, ALL_CHAPTER_KEYS), null);
});

test('already-seen chapters do not re-trigger on load or backfill', () => {
  assert.equal(nextUnseenChapterCompletion(bundled, 11, []), null);
  assert.equal(nextUnseenChapterCompletion(bundled, 12, ['chapter-1']), null);
  assert.equal(nextUnseenChapterCompletion(bundled, 96, ALL_CHAPTER_KEYS), null);
  assert.equal(chapterCompletedByLight(bundled, 12, 13, []), null);
  assert.equal(chapterCompletedByLight(bundled, 11, 12, ['chapter-1']), null);
  assert.equal(chapterCompletedByLight(bundled, 95, 96, ALL_CHAPTER_KEYS), null);
});

test('the completing light opens the matching unseen chapter', () => {
  const ch1 = chapterCompletedByLight(bundled, 11, 12, []);
  assert.equal(ch1?.key, 'chapter-1');
  const ch2 = chapterCompletedByLight(bundled, 23, 24, ['chapter-1']);
  assert.equal(ch2?.key, 'chapter-2');
  assert.equal(chapterCompletedByLight(bundled, 10, 11, []), null);
});

test('end-of-content replaces the fog teaser after chapter 8', () => {
  assert.equal(isEndOfPublishedContent(bundled, 95), false);
  assert.equal(isEndOfPublishedContent(bundled, 96), true);
  assert.equal(endOfContentView(bundled, 95), null);
  assert.ok(nextChapterFogTeaser(bundled, 95));

  const end = endOfContentView(bundled, 98, new Date('2026-11-02T12:00:00+03:00'));
  assert.ok(end);
  assert.equal(nextChapterFogTeaser(bundled, 96), null);
  assert.equal(end.eyebrow, bundled.upcoming.eyebrow);
  assert.equal(end.title, bundled.upcoming.teaserLine);
  assert.equal(end.body, CHAPTER_CHROME.endBody);
  assert.equal(end.opensValue, 'Yakında');
  assert.equal(end.opensA11y, 'Açılmasına Yakında');
  assert.equal(end.bankedLights, 2);
  assert.equal(end.lightsReadyLabel, '2 ışık hazır');
  assert.equal(end.firstPieceHint, 'ilk parçaya gider');
  assert.equal(end.bankedA11y, '2 ışık hazır, sonraki bölümün ilk parçasına gider');
  assert.doesNotMatch(end.title + end.body, /Sığınak tamamlandı|bitti|tamamlandı/i);

  const dated = {
    ...bundled,
    upcoming: { ...bundled.upcoming, opensAt: '2026-11-06T09:00:00+03:00' },
  };
  const datedEnd = endOfContentView(dated, 96, new Date('2026-11-02T12:00:00+03:00'));
  assert.equal(datedEnd?.opensValue, '4 gün');
  assert.equal(datedEnd?.opensA11y, 'Açılmasına 4 gün');
});

test('fog teaser uses the next chapter teaser or upcoming copy', () => {
  const early = nextChapterFogTeaser(bundled, 7);
  assert.equal(early?.kind, 'chapter');
  assert.equal(early?.order, 2);
  assert.equal(early?.line, bundled.chapters[1].teaser.line);
  assert.equal(early?.threshold, 12);
  assert.equal(early?.remaining, 5);

  const afterChapter1 = nextChapterFogTeaser(bundled, 12);
  assert.equal(afterChapter1?.order, 3);
  assert.equal(afterChapter1?.line, bundled.chapters[2].teaser.line);

  const late = nextChapterFogTeaser(bundled, 90);
  assert.equal(late?.kind, 'upcoming');
  assert.equal(late?.order, 9);
  assert.equal(late?.line, bundled.upcoming.teaserLine);
  assert.equal(late?.remaining, 6);
});

test('chapter chrome copy is approved', () => {
  assert.equal(CHAPTER_CHROME.copyStatus, 'approved');
});
