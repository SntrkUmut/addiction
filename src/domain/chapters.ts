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
 * copyStatus: pending — TODO-review. Listed in the PR as "Yeni metinler (onay bekliyor)".
 */
export const CHAPTER_CHROME = {
  copyStatus: 'pending' as const,
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
} as const;

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

/**
 * Earliest completed chapter whose `chapter-N` key is not in milestones.seen.
 * Load/backfill of an already-seen chapter returns null.
 */
export function nextUnseenChapterCompletion(
  manifest: Pick<Manifest, 'chapters' | 'lightsPerPiece'>,
  lights: number,
  seenKeys: readonly string[],
): ChapterFlow | null {
  const seen = new Set(seenKeys);
  const progress = chapterStates(manifest, lights);
  for (let i = 0; i < progress.length; i += 1) {
    if (!progress[i].complete) continue;
    const chapter = progress[i].chapter;
    const key = chapterSeenKey(chapter.order);
    if (seen.has(key)) continue;
    return {
      key,
      order: chapter.order,
      lightsAtCompletion: lightsToCompleteChapter(manifest, i),
      completed: chapter,
      next: manifest.chapters[i + 1] ?? null,
    };
  }
  return null;
}

/**
 * Fire only when this light crosses chapter N's completion threshold
 * and that chapter has not been seen. Does not re-fire on later lights
 * or on load/backfill of an already-complete unseen chapter (load uses
 * nextUnseenChapterCompletion instead).
 */
export function chapterCompletedByLight(
  manifest: Pick<Manifest, 'chapters' | 'lightsPerPiece'>,
  beforeLights: number,
  afterLights: number,
  seenKeys: readonly string[],
): ChapterFlow | null {
  const flow = nextUnseenChapterCompletion(manifest, afterLights, seenKeys);
  if (!flow) return null;
  if (beforeLights >= flow.lightsAtCompletion) return null;
  if (afterLights < flow.lightsAtCompletion) return null;
  return flow;
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
  bankedLights: number;
  lightsReadyLabel: string;
  firstPieceHint: string;
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
    bankedLights: banked,
    lightsReadyLabel: CHAPTER_CHROME.lightsReady(banked),
    firstPieceHint: CHAPTER_CHROME.goesToFirstPiece,
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
