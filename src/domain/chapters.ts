/**
 * Chapter completion, fog teaser, and end-of-content helpers.
 * Progress is derived from lights + the manifest; seen keys live in milestones.seen.
 */

import type { Manifest } from './content';

export type ChapterSeenKey = `chapter-${number}`;

type Chapter = Manifest['chapters'][number];
type Upcoming = NonNullable<Manifest['upcoming']>;

export type ChapterFlow = {
  key: ChapterSeenKey;
  order: number;
  lightsAtCompletion: number;
  completed: Chapter;
  next: Chapter | null;
};

/**
 * UI chrome that is not in the bundled v11 chapter/upcoming copy.
 * copyStatus: approved, Umut adına Grok Bot, 2026-11-02.
 * Accessibility labels (opensA11yLabel, bankedA11yLabel, collectionA11yLabel) are approved too.
 */
export const CHAPTER_CHROME = {
  copyStatus: 'approved' as const,
  fogFallbackTitle: 'Sisin ardında yeni bir yer var',
  fogCaption: (threshold: number, remaining: number) => (
    `${threshold}. ışıkta açılır · ${remaining} ışık kaldı`
  ),
  endBody: 'Şu an açık olan her parçayı yerine koydun. Işıkların birikmeye devam ediyor; yeni bölüm açılınca yolunu hemen aydınlatacak.',
  opensIn: 'Açılmasına',
  soon: 'Yakında',
  daysLeft: (n: number) => `${n} gün`,
  lightsReady: (n: number) => `${n} ışık hazır`,
  goesToFirstPiece: 'ilk parçaya gider',
  meanwhile: 'Bu arada',
  collection: 'Koleksiyon',
  homeCta: 'Ana ekrana dön',
  continueCta: 'Yola devam et',
  remainingLights: (n: number) => `${n} ışık kaldı`,
  collectionItems: 'Kristaller ve aksesuarlar',
} as const;

/** Screen-reader label for the collection card on both Sığınak surfaces. */
export function collectionA11yLabel(): string {
  return `${CHAPTER_CHROME.collection}, ${CHAPTER_CHROME.collectionItems}`;
}

/** Screen-reader label for "Açılmasına" + "{n} gün" / "Yakında". */
export function opensA11yLabel(opensValue: string): string {
  return `${CHAPTER_CHROME.opensIn} ${opensValue}`;
}

/** Screen-reader label for the visible "{n} ışık hazır" / "ilk parçaya gider" pair. */
export function bankedA11yLabel(n: number): string {
  return `${CHAPTER_CHROME.lightsReady(n)}, sonraki bölümün ilk parçasına gider`;
}

export function chapterSeenKey(order: number): ChapterSeenKey {
  return `chapter-${order}`;
}

export function lightsPerPieceOf(manifest: Pick<Manifest, 'lightsPerPiece'>): number {
  return manifest.lightsPerPiece ?? 2;
}

function builtPieces(lights: number, lightsPerPiece: number): number {
  return Math.floor(Math.max(0, lights) / lightsPerPiece);
}

function chapterStates(
  manifest: Pick<Manifest, 'chapters' | 'lightsPerPiece'>,
  lights: number,
): { chapter: Chapter; entered: boolean; complete: boolean }[] {
  const lpp = lightsPerPieceOf(manifest);
  let priorPieces = 0;
  let previousComplete = true;
  return manifest.chapters.map(chapter => {
    const complete = chapter.pieces.length > 0
      && lights >= (priorPieces + chapter.pieces.length) * lpp;
    const result = { chapter, entered: previousComplete, complete };
    previousComplete = complete;
    priorPieces += chapter.pieces.length;
    return result;
  });
}

export function publishedPieceCount(manifest: Pick<Manifest, 'chapters'>): number {
  return manifest.chapters.reduce((sum, chapter) => sum + chapter.pieces.length, 0);
}

export function lightsToCompleteChapter(
  manifest: Pick<Manifest, 'chapters' | 'lightsPerPiece'>,
  chapterIndex: number,
): number {
  const lpp = lightsPerPieceOf(manifest);
  let pieces = 0;
  for (let i = 0; i <= chapterIndex; i += 1) {
    pieces += manifest.chapters[i]?.pieces.length ?? 0;
  }
  return pieces * lpp;
}

export function isEndOfPublishedContent(
  manifest: Pick<Manifest, 'chapters' | 'lightsPerPiece'>,
  lights: number,
): boolean {
  const total = publishedPieceCount(manifest);
  if (total === 0) return false;
  return builtPieces(lights, lightsPerPieceOf(manifest)) >= total;
}

function flowAtIndex(
  manifest: Pick<Manifest, 'chapters' | 'lightsPerPiece'>,
  index: number,
): ChapterFlow {
  const chapter = manifest.chapters[index];
  return {
    key: chapterSeenKey(chapter.order),
    order: chapter.order,
    lightsAtCompletion: lightsToCompleteChapter(manifest, index),
    completed: chapter,
    next: manifest.chapters[index + 1] ?? null,
  };
}

/**
 * On open/backfill: show only the most recently completed chapter if it is
 * unseen. Older completed unseen keys are returned to mark quietly — never
 * stacked as a celebration parade.
 */
export function planOpenChapterCelebration(
  manifest: Pick<Manifest, 'chapters' | 'lightsPerPiece'>,
  lights: number,
  seenKeys: readonly string[],
): { show: ChapterFlow | null; markSeenQuietly: ChapterSeenKey[] } {
  const seen = new Set(seenKeys);
  const completed: ChapterFlow[] = [];
  const progress = chapterStates(manifest, lights);
  for (let i = 0; i < progress.length; i += 1) {
    if (!progress[i].complete) continue;
    completed.push(flowAtIndex(manifest, i));
  }
  if (completed.length === 0) return { show: null, markSeenQuietly: [] };
  const latest = completed[completed.length - 1];
  const markSeenQuietly = completed
    .slice(0, -1)
    .filter(flow => !seen.has(flow.key))
    .map(flow => flow.key);
  if (seen.has(latest.key)) return { show: null, markSeenQuietly };
  return { show: latest, markSeenQuietly };
}

export function latestUnseenChapterCompletion(
  manifest: Pick<Manifest, 'chapters' | 'lightsPerPiece'>,
  lights: number,
  seenKeys: readonly string[],
): ChapterFlow | null {
  return planOpenChapterCelebration(manifest, lights, seenKeys).show;
}

export function olderUnseenChapterKeys(
  manifest: Pick<Manifest, 'chapters' | 'lightsPerPiece'>,
  lights: number,
  seenKeys: readonly string[],
): ChapterSeenKey[] {
  return planOpenChapterCelebration(manifest, lights, seenKeys).markSeenQuietly;
}

/**
 * Trigger only when a chapter's completion threshold sits in (before, after]
 * and that chapter has not been seen. Multiple crossings pick the latest
 * in range; earlier ones in the range are returned as markSeenQuietly.
 */
export function chapterCompletedByLight(
  manifest: Pick<Manifest, 'chapters' | 'lightsPerPiece'>,
  beforeLights: number,
  afterLights: number,
  seenKeys: readonly string[],
): { show: ChapterFlow | null; markSeenQuietly: ChapterSeenKey[] } {
  const seen = new Set(seenKeys);
  const crossed: ChapterFlow[] = [];
  for (let i = 0; i < manifest.chapters.length; i += 1) {
    const flow = flowAtIndex(manifest, i);
    if (!(beforeLights < flow.lightsAtCompletion && afterLights >= flow.lightsAtCompletion)) continue;
    if (seen.has(flow.key)) continue;
    crossed.push(flow);
  }
  if (crossed.length === 0) return { show: null, markSeenQuietly: [] };
  const show = crossed[crossed.length - 1];
  const quietly: ChapterSeenKey[] = [];
  const progress = chapterStates(manifest, afterLights);
  for (let i = 0; i < progress.length; i += 1) {
    if (!progress[i].complete) continue;
    const flow = flowAtIndex(manifest, i);
    if (flow.key === show.key) continue;
    if (seen.has(flow.key)) continue;
    quietly.push(flow.key);
  }
  return { show, markSeenQuietly: quietly };
}

/**
 * Overlay-aware reveal: queue while a dialog/modal is open, present when
 * the overlay is gone. Seen keys are the caller's job and must be written
 * only when `present` is non-null — never on queue.
 */
export function decideChapterReveal(
  flow: ChapterFlow | null,
  overlayOpen: boolean,
  alreadyShowing: boolean,
): { present: ChapterFlow | null; queue: ChapterFlow | null } {
  if (!flow) return { present: null, queue: null };
  if (overlayOpen || alreadyShowing) return { present: null, queue: flow };
  return { present: flow, queue: null };
}

/** Take a queued celebration once every overlay has dismissed. */
export function takeQueuedChapter(
  queued: ChapterFlow | null,
  overlayOpen: boolean,
  alreadyShowing: boolean,
): ChapterFlow | null {
  if (!queued || overlayOpen || alreadyShowing) return null;
  return queued;
}

export function celebrationCopy(chapter: Chapter): { eyebrow: string; title: string; body: string; cta: string } {
  const copy = chapter.completion;
  const title = typeof copy?.title === 'string' && copy.title.trim().length > 0
    ? copy.title
    : chapter.title;
  return {
    eyebrow: (typeof copy?.eyebrow === 'string' && copy.eyebrow) || chapter.eyebrow,
    title,
    body: typeof copy?.body === 'string' ? copy.body : '',
    cta: (typeof copy?.cta === 'string' && copy.cta) || CHAPTER_CHROME.continueCta,
  };
}

export type FogTeaser = {
  kind: 'chapter' | 'upcoming';
  order: number;
  eyebrow: string;
  line: string;
  previewIcons: string[];
  gateIcon: string;
  threshold: number;
  remaining: number;
};

/**
 * The single next-chapter teaser at the end of the path.
 * Hidden once every published piece is built (end-of-content takes its place).
 */
export function nextChapterFogTeaser(
  manifest: Pick<Manifest, 'chapters' | 'lightsPerPiece' | 'upcoming'>,
  lights: number,
): FogTeaser | null {
  if (isEndOfPublishedContent(manifest, lights)) return null;
  const progress = chapterStates(manifest, lights);
  const lpp = lightsPerPieceOf(manifest);

  for (let i = 0; i < progress.length; i += 1) {
    if (progress[i].entered) continue;
    const chapter = progress[i].chapter;
    const threshold = lightsToCompleteChapter(manifest, i - 1);
    return {
      kind: 'chapter',
      order: chapter.order,
      eyebrow: chapter.eyebrow,
      line: chapter.teaser?.line || chapter.title,
      previewIcons: chapter.teaser?.previewIcons ?? chapter.pieces.slice(0, 3).map(piece => piece.icon),
      gateIcon: chapter.pieces[0]?.icon ?? 'sparkle',
      threshold,
      remaining: Math.max(0, threshold - lights),
    };
  }

  const upcoming = manifest.upcoming as Upcoming | undefined;
  if (!upcoming) return null;
  const threshold = publishedPieceCount(manifest) * lpp;
  return {
    kind: 'upcoming',
    order: upcoming.chapterOrder,
    eyebrow: upcoming.eyebrow,
    line: upcoming.teaserLine || upcoming.title,
    previewIcons: [],
    gateIcon: 'sparkle',
    threshold,
    remaining: Math.max(0, threshold - lights),
  };
}

export type EndOfContentView = {
  eyebrow: string;
  title: string;
  body: string;
  opensLabel: string;
  opensValue: string;
  opensA11y: string;
  bankedLights: number;
  lightsReadyLabel: string;
  firstPieceHint: string;
  bankedA11y: string;
  meanwhile: string;
  collectionLabel: string;
};

function daysUntil(iso: string, now: Date): number {
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return 0;
  const startNow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const startTarget = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.ceil((startTarget - startNow) / 86_400_000);
}

export function endOfContentView(
  manifest: Pick<Manifest, 'chapters' | 'lightsPerPiece' | 'upcoming'>,
  lights: number,
  now = new Date(),
): EndOfContentView | null {
  if (!isEndOfPublishedContent(manifest, lights)) return null;
  const upcoming = manifest.upcoming;
  const lpp = lightsPerPieceOf(manifest);
  const banked = Math.max(0, lights - publishedPieceCount(manifest) * lpp);
  let opensValue: string = CHAPTER_CHROME.soon;
  if (upcoming?.opensAt) {
    const days = daysUntil(upcoming.opensAt, now);
    if (days > 0) opensValue = CHAPTER_CHROME.daysLeft(days);
  }
  return {
    eyebrow: upcoming?.eyebrow ?? '',
    title: upcoming?.teaserLine || upcoming?.title || CHAPTER_CHROME.fogFallbackTitle,
    body: CHAPTER_CHROME.endBody,
    opensLabel: CHAPTER_CHROME.opensIn,
    opensValue,
    opensA11y: opensA11yLabel(opensValue),
    bankedLights: banked,
    lightsReadyLabel: CHAPTER_CHROME.lightsReady(banked),
    firstPieceHint: CHAPTER_CHROME.goesToFirstPiece,
    bankedA11y: bankedA11yLabel(banked),
    meanwhile: CHAPTER_CHROME.meanwhile,
    collectionLabel: CHAPTER_CHROME.collection,
  };
}

export function handoffCopy(
  flow: ChapterFlow,
  upcoming?: Manifest['upcoming'],
): { eyebrow: string; title: string; body: string; cta: string } {
  if (flow.next?.intro) {
    return {
      eyebrow: flow.next.intro.eyebrow || flow.next.eyebrow,
      title: flow.next.intro.title,
      body: flow.next.intro.body,
      cta: flow.next.intro.cta || CHAPTER_CHROME.continueCta,
    };
  }
  return {
    eyebrow: upcoming?.eyebrow ?? '',
    title: upcoming?.title ?? CHAPTER_CHROME.fogFallbackTitle,
    body: upcoming?.teaserLine || CHAPTER_CHROME.endBody,
    cta: CHAPTER_CHROME.continueCta,
  };
}
