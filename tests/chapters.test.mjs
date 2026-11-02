import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CHAPTER_CHROME,
  celebrationCopy,
  chapterCompletedByLight,
  chapterSeenKey,
  collectionA11yLabel,
  decideChapterReveal,
  endOfContentView,
  isEndOfPublishedContent,
  latestUnseenChapterCompletion,
  nextChapterFogTeaser,
  planOpenChapterCelebration,
  takeQueuedChapter,
} from '../src/domain/chapters.ts';
import { isUsableManifestShape } from '../src/domain/manifestGuard.ts';

const bundled = JSON.parse(
  readFileSync(new URL('../src/content/manifest.bundled.json', import.meta.url), 'utf8'),
);

const ALL_CHAPTER_KEYS = bundled.chapters.map(chapter => chapterSeenKey(chapter.order));
const EDITORIAL_PY = fileURLToPath(new URL('../src/content/editorial.py', import.meta.url));

function editorialScan(blob) {
  const dir = mkdtempSync(join(tmpdir(), 'chapter-chrome-'));
  const path = join(dir, 'strings.json');
  writeFileSync(path, JSON.stringify({ copy: blob }));
  try {
    return spawnSync('python3', [EDITORIAL_PY, path], { encoding: 'utf8' });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('chapter celebration fires once per chapter via seen key', () => {
  const first = latestUnseenChapterCompletion(bundled, 12, []);
  assert.equal(first?.order, 1);
  assert.equal(first?.key, 'chapter-1');
  assert.equal(first?.lightsAtCompletion, 12);
  assert.equal(first?.completed.id, 'ch-temel');
  assert.equal(first?.next?.id, 'ch-bahce');
  assert.equal(latestUnseenChapterCompletion(bundled, 12, ['chapter-1']), null);

  const second = latestUnseenChapterCompletion(bundled, 24, ['chapter-1']);
  assert.equal(second?.order, 2);
  assert.equal(second?.key, 'chapter-2');
  assert.equal(latestUnseenChapterCompletion(bundled, 24, ['chapter-1', 'chapter-2']), null);

  const last = latestUnseenChapterCompletion(bundled, 96, ALL_CHAPTER_KEYS.slice(0, 7));
  assert.equal(last?.order, 8);
  assert.equal(last?.next, null);
  assert.equal(latestUnseenChapterCompletion(bundled, 96, ALL_CHAPTER_KEYS), null);
});

test('already-seen chapters do not re-trigger on load or backfill', () => {
  assert.equal(latestUnseenChapterCompletion(bundled, 11, []), null);
  assert.equal(latestUnseenChapterCompletion(bundled, 12, ['chapter-1']), null);
  assert.equal(latestUnseenChapterCompletion(bundled, 96, ALL_CHAPTER_KEYS), null);
  assert.equal(chapterCompletedByLight(bundled, 12, 13, []).show, null);
  assert.equal(chapterCompletedByLight(bundled, 11, 12, ['chapter-1']).show, null);
  assert.equal(chapterCompletedByLight(bundled, 95, 96, ALL_CHAPTER_KEYS).show, null);
});

test('the completing light uses the (before, after] range and picks the latest in it', () => {
  const ch1 = chapterCompletedByLight(bundled, 11, 12, []);
  assert.equal(ch1.show?.key, 'chapter-1');
  assert.deepEqual(ch1.markSeenQuietly, []);

  const ch2 = chapterCompletedByLight(bundled, 23, 24, ['chapter-1']);
  assert.equal(ch2.show?.key, 'chapter-2');
  assert.deepEqual(ch2.markSeenQuietly, []);

  const skipped = chapterCompletedByLight(bundled, 23, 24, []);
  assert.equal(skipped.show?.key, 'chapter-2');
  assert.deepEqual(skipped.markSeenQuietly, ['chapter-1']);

  const leap = chapterCompletedByLight(bundled, 11, 24, []);
  assert.equal(leap.show?.key, 'chapter-2');
  assert.deepEqual(leap.markSeenQuietly, ['chapter-1']);

  assert.equal(chapterCompletedByLight(bundled, 10, 11, []).show, null);
});

test('open/backfill shows only the latest completed unseen chapter and quiet-marks older ones', () => {
  const first = planOpenChapterCelebration(bundled, 12, []);
  assert.equal(first.show?.key, 'chapter-1');
  assert.deepEqual(first.markSeenQuietly, []);

  const stacked = planOpenChapterCelebration(bundled, 24, []);
  assert.equal(stacked.show?.key, 'chapter-2');
  assert.deepEqual(stacked.markSeenQuietly, ['chapter-1']);

  const catchUp = planOpenChapterCelebration(bundled, 96, []);
  assert.equal(catchUp.show?.key, 'chapter-8');
  assert.deepEqual(catchUp.markSeenQuietly, ALL_CHAPTER_KEYS.slice(0, 7));

  const latestAlreadySeen = planOpenChapterCelebration(bundled, 24, ['chapter-2']);
  assert.equal(latestAlreadySeen.show, null);
  assert.deepEqual(latestAlreadySeen.markSeenQuietly, ['chapter-1']);
});

test('queued celebrations are not marked seen until they are presented after dismiss', () => {
  const flow = latestUnseenChapterCompletion(bundled, 12, []);
  const whileDialog = decideChapterReveal(flow, true, false);
  assert.equal(whileDialog.present, null);
  assert.equal(whileDialog.queue?.key, 'chapter-1');
  const seenWhileQueued = whileDialog.present ? [whileDialog.present.key] : [];
  assert.deepEqual(seenWhileQueued, []);

  assert.equal(takeQueuedChapter(whileDialog.queue, true, false), null);
  const afterDismiss = takeQueuedChapter(whileDialog.queue, false, false);
  assert.equal(afterDismiss?.key, 'chapter-1');
  const seenAfterShow = afterDismiss ? [afterDismiss.key] : [];
  assert.deepEqual(seenAfterShow, ['chapter-1']);

  const blockedByShowing = decideChapterReveal(flow, false, true);
  assert.equal(blockedByShowing.present, null);
  assert.equal(blockedByShowing.queue?.key, 'chapter-1');

  const immediate = decideChapterReveal(flow, false, false);
  assert.equal(immediate.present?.key, 'chapter-1');
  assert.equal(immediate.queue, null);
});

test('celebrationCopy falls back when completion is missing or invalid', () => {
  const chapter = bundled.chapters[0];
  assert.equal(celebrationCopy(chapter).title, chapter.completion.title);
  assert.equal(celebrationCopy({ ...chapter, completion: undefined }).title, chapter.title);
  assert.equal(celebrationCopy({ ...chapter, completion: null }).title, chapter.title);
  assert.equal(celebrationCopy({ ...chapter, completion: { title: '   ' } }).title, chapter.title);
  assert.equal(celebrationCopy({ ...chapter, completion: { title: 12 } }).title, chapter.title);
  assert.equal(celebrationCopy({ ...chapter, completion: {} }).cta, CHAPTER_CHROME.continueCta);
});

test('isUsableManifestShape requires a non-empty completion.title', () => {
  assert.equal(isUsableManifestShape(bundled), true);
  assert.equal(isUsableManifestShape(null), false);
  assert.equal(isUsableManifestShape({ version: 1, chapters: [] }), false);
  const missing = {
    ...bundled,
    chapters: bundled.chapters.map(chapter => ({ ...chapter, completion: undefined })),
  };
  assert.equal(isUsableManifestShape(missing), false);
  const blank = {
    ...bundled,
    chapters: bundled.chapters.map(chapter => ({ ...chapter, completion: { title: '  ' } })),
  };
  assert.equal(isUsableManifestShape(blank), false);
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

test('CHAPTER_CHROME and Sığınak collection copy have no fire/smoke imagery or yak-/yan- verbs', () => {
  const chrome = [
    CHAPTER_CHROME.fogFallbackTitle,
    CHAPTER_CHROME.fogCaption(12, 5),
    CHAPTER_CHROME.endBody,
    CHAPTER_CHROME.opensIn,
    CHAPTER_CHROME.soon,
    CHAPTER_CHROME.daysLeft(4),
    CHAPTER_CHROME.lightsReady(2),
    CHAPTER_CHROME.goesToFirstPiece,
    CHAPTER_CHROME.meanwhile,
    CHAPTER_CHROME.collection,
    CHAPTER_CHROME.collectionItems,
    CHAPTER_CHROME.homeCta,
    CHAPTER_CHROME.continueCta,
    CHAPTER_CHROME.remainingLights(3),
    collectionA11yLabel(),
  ].join('\n');
  const siginak = readFileSync(new URL('../src/screens/Siginak.tsx', import.meta.url), 'utf8');
  assert.match(siginak, /CHAPTER_CHROME\.collectionItems/);
  const scan = editorialScan(`${chrome}\n${CHAPTER_CHROME.collectionItems}`);
  assert.equal(scan.status, 0, scan.stdout + scan.stderr);
  assert.match(scan.stdout, /OK/);
  assert.equal(editorialScan('Bugünün ışığını yak').status, 1);
  assert.equal(editorialScan('ışıkları yanıyor').status, 1);
  assert.equal(editorialScan('kamp ateşi ve duman').status, 1);
});

test('Sığınak consumes focus once from onLayout; celebration/handoff use hopeful and header', () => {
  const siginak = readFileSync(new URL('../src/screens/Siginak.tsx', import.meta.url), 'utf8');
  assert.match(siginak, /onFocusConsumed/);
  assert.match(siginak, /scrollToFocus\(focusChapterId\)/);
  assert.match(siginak, /}, \[focusChapterId\]\);/);
  assert.equal(siginak.includes('chapters, teaser, end, reduceMotion'), false);

  const celebration = readFileSync(new URL('../src/screens/ChapterCelebration.tsx', import.meta.url), 'utf8');
  assert.match(celebration, /pose="hopeful"/);
  assert.match(celebration, /celebrationCopy/);
  assert.match(celebration, /accessibilityRole="header"/);

  const handoff = readFileSync(new URL('../src/screens/ChapterHandoff.tsx', import.meta.url), 'utf8');
  assert.match(handoff, /pose="hopeful"/);
  assert.match(handoff, /accessibilityRole="header"/);
});

test('App queues until overlay dismiss and marks seen only when presenting', () => {
  const app = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8');
  assert.match(app, /presentChapter[\s\S]*markKeysSeen\(\[flow\.key\]\)/);
  assert.match(app, /dismissDialog[\s\S]*flushQueuedChapter/);
  assert.match(app, /dismissUrge[\s\S]*flushQueuedChapter/);
  assert.match(app, /closeMilestone[\s\S]*flushQueuedChapter/);
  assert.match(app, /queueMicrotask\(\(\) => considerChapterOnOpenRef\.current/);
  assert.match(app, /const firstPieceId = chapterFlow\.flow\.next\?\.pieces\[0\]\?\.id \?\? '__end__'/);
});
