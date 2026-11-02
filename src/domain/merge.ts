/**
 * Merge utilities for synced state (rev 4).
 * Implements union semantics for grow-only sets and LWW for personalization.
 */

import type { AppState, MilestoneSeen, CollectionItem, Personalization } from '../data/schema';

/**
 * Merge two AppState objects, applying union for milestones and collection.
 * Profile and events use the "winner" state (typically remote when pulling).
 */
export function mergeAppStates(
  local: AppState | null,
  remote: AppState | null,
  preferRemote: boolean = true
): AppState | null {
  if (!local) return remote;
  if (!remote) return local;

  // Profile and events: use the preferred source
  const base = preferRemote ? remote : local;
  
  // Milestones: union of seen sets, keeping earliest seenAt per key
  const milestones = mergeMilestones(
    local.milestones?.seen || [],
    remote.milestones?.seen || []
  );

  // Collection: union of earned items
  const collection = mergeCollection(
    local.collection?.earned || [],
    remote.collection?.earned || []
  );

  // Personalization: last-writer-wins by updatedAt
  const personalization = mergePersonalization(
    local.personalization,
    remote.personalization
  );

  return {
    ...base,
    schemaVersion: 2,
    milestones: { seen: milestones },
    collection: { earned: collection },
    personalization,
  };
}

/**
 * Union milestones, keeping earliest seenAt per key
 */
export function mergeMilestones(
  local: MilestoneSeen[],
  remote: MilestoneSeen[]
): MilestoneSeen[] {
  const map = new Map<string, MilestoneSeen>();

  for (const ms of [...local, ...remote]) {
    const existing = map.get(ms.key);
    if (!existing || ms.seenAt < existing.seenAt) {
      map.set(ms.key, ms);
    }
  }

  return Array.from(map.values()).sort((a, b) => a.seenAt.localeCompare(b.seenAt));
}

/**
 * Union collection items by id
 */
export function mergeCollection(
  local: CollectionItem[],
  remote: CollectionItem[]
): CollectionItem[] {
  const map = new Map<string, CollectionItem>();

  for (const item of [...local, ...remote]) {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  }

  return Array.from(map.values()).sort((a, b) => a.at.localeCompare(b.at));
}

/**
 * Merge personalization: last-writer-wins by updatedAt
 */
export function mergePersonalization(
  local: Personalization | undefined,
  remote: Personalization | undefined
): Personalization | undefined {
  if (!local) return remote;
  if (!remote) return local;
  
  return local.updatedAt >= remote.updatedAt ? local : remote;
}
