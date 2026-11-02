/**
 * Derived progress helpers used by Yuva, Sığınak, Rotam, and collection.
 * Lights come from events (earnedLight); a slip never reduces them.
 */

import type { AppState, CollectionItem, ProgressEvent } from '../data/schema';
import type { Manifest } from './content';
import { earnedLight } from './rewards';
import { journeyDay } from './journey';

export const COPING_CHOICES = [
  { id: 'breath', title: 'Yavaş nefes', detail: 'Ritmi yumuşat, omuzlarını bırak.', minutes: 3 },
  { id: 'walk', title: 'Kısa bir yürüyüş', detail: 'Bulunduğun yeri değiştir ve biraz hareket et.', minutes: 5 },
  { id: 'water', title: 'Su iç', detail: 'Bir bardak su alıp yavaşça iç.', minutes: 2 },
  { id: 'reasons', title: 'Nedenlerimi hatırla', detail: 'Bırakmaya karar verdiğin nedeni yeniden oku.', minutes: 1 },
] as const;

const FOX_ACCESSORY_IDS = new Set([
  'it-atki',
  'it-bere',
  'it-hasir-sapka',
  'it-lastik-cizme',
  'it-semsiye',
  'it-sirt-cantasi',
  'it-yuvarlak-gozluk',
  'it-yildiz-rozeti',
  'it-orgu-eldiven',
  'it-ruzgarlik',
]);

export function lightsFrom(state: AppState): number {
  return earnedLight(state.events);
}

export function hasLoggedSlip(state: AppState): boolean {
  return state.events.some(event => event.kind === 'slip');
}

export function eventOnLocalDay(event: { at: string }, dayIso: string): boolean {
  return todayIso(new Date(event.at)) === dayIso;
}

export function checkedInOn(state: AppState, dayIso: string): boolean {
  return state.events.some(event => event.kind === 'checkin' && eventOnLocalDay(event, dayIso));
}

export function todayIso(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function cigarettesAvoided(state: AppState, now = new Date()): number {
  const profile = state.profile;
  if (!profile || profile.cigarettesPerDay <= 0) return 0;
  const days = journeyDay(profile.quitDate, now);
  const smoked = state.events.filter(event => event.kind === 'slip').length;
  return Math.max(0, Math.round(days * profile.cigarettesPerDay) - smoked);
}

export function estimatedSavings(state: AppState, now = new Date()): number | null {
  const profile = state.profile;
  if (!profile || profile.packPrice <= 0 || profile.packSize <= 0) return null;
  const avoided = cigarettesAvoided(state, now);
  return (avoided * profile.packPrice) / profile.packSize;
}

export function formatMoney(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
  } catch {
    return `${Math.round(value)} ${currency}`;
  }
}

export function unlockedPieceCount(lights: number, lightsPerPiece = 2): number {
  return Math.floor(Math.max(0, lights) / lightsPerPiece);
}

export type ChapterProgress = {
  id: string;
  title: string;
  eyebrow: string;
  pieces: { id: string; name: string; unlocked: boolean; icon: string }[];
  unlockedCount: number;
  total: number;
  /** Previous chapter is complete (or this is chapter 1), so the path has entered it. */
  entered: boolean;
  locked: boolean;
  complete: boolean;
  completionReward?: string;
};

export function chapterProgress(manifest: Manifest, lights: number): ChapterProgress[] {
  const lightsPerPiece = manifest.lightsPerPiece ?? 2;
  let priorPieces = 0;
  let previousComplete = true;
  return manifest.chapters.map(chapter => {
    const entered = previousComplete;
    const pieces = chapter.pieces.map((piece, index) => {
      const globalIndex = priorPieces + index;
      return {
        id: piece.id,
        name: piece.name,
        icon: piece.icon,
        unlocked: lights >= (globalIndex + 1) * lightsPerPiece,
      };
    });
    const unlockedCount = pieces.filter(piece => piece.unlocked).length;
    const complete = unlockedCount === pieces.length && pieces.length > 0;
    const result: ChapterProgress = {
      id: chapter.id,
      title: chapter.title,
      eyebrow: chapter.eyebrow,
      pieces,
      unlockedCount,
      total: pieces.length,
      entered,
      locked: !entered,
      complete,
      completionReward: chapter.completionReward,
    };
    previousComplete = complete;
    priorPieces += chapter.pieces.length;
    return result;
  });
}

export function eventTitle(event: ProgressEvent): string {
  switch (event.kind) {
    case 'checkin':
      return event.details.mood ? `Check-in: ${String(event.details.mood)}` : 'Check-in';
    case 'coping':
      return event.details.tool ? `Baş etme: ${String(event.details.tool)}` : 'Bir baş etme adımı denedin';
    case 'craving':
      return 'İstek anı için destek açtın';
    case 'urge_result':
      return `İstek sonrası: ${String(event.details.result ?? 'yanıtın kaydedildi')}`;
    case 'slip':
      return 'Bir sigara içtiğini kaydettin';
    default:
      return 'Kayıt';
  }
}

export function appendEvent(state: AppState, event: ProgressEvent): AppState {
  return { ...state, events: [event, ...state.events] };
}

export function earnedCollection(state: AppState, manifest: Manifest, now = new Date()): CollectionItem[] {
  const earned = [...(state.collection?.earned ?? [])];
  const have = new Set(earned.map(item => item.id));
  const lights = lightsFrom(state);
  const at = now.toISOString();
  const chapters = chapterProgress(manifest, lights);

  for (const chapter of chapters) {
    if (chapter.complete && chapter.completionReward && !have.has(chapter.completionReward)) {
      earned.push({ id: chapter.completionReward, at, source: 'chapter' });
      have.add(chapter.completionReward);
    }
  }

  const milestoneRewards = new Map(
    (manifest.milestones ?? []).map(item => [item.key, item.reward] as const),
  );
  for (const seen of state.milestones?.seen ?? []) {
    const reward = milestoneRewards.get(seen.key);
    if (reward && !have.has(reward)) {
      earned.push({ id: reward, at: seen.seenAt, source: 'milestone' });
      have.add(reward);
    }
  }

  return earned;
}

export function foxAccessories(state: AppState): string[] {
  return (state.collection?.earned ?? [])
    .map(item => item.id)
    .filter(id => FOX_ACCESSORY_IDS.has(id));
}

export function withSyncedCollection(state: AppState, manifest: Manifest, now = new Date()): AppState {
  return { ...state, collection: { earned: earnedCollection(state, manifest, now) } };
}
