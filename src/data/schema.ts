export type EventKind = 'checkin' | 'craving' | 'coping' | 'slip' | 'urge_result';
export type ProgressEvent = {
  id: string;
  kind: EventKind;
  at: string;
  details: Record<string, unknown>;
};
export type Profile = {
  name: string;
  cigarettesPerDay: number;
  packPrice: number;
  packSize: number;
  quitDate: string;
  reason: string;
  currency: string;
};

// Rev 4: Milestones sync to cloud
export type MilestoneKey = 'day-1' | 'day-7' | 'day-14' | 'day-30' | 'day-60' | 'day-90' | 'day-180' | 'day-365' | `chapter-${number}`;
export type MilestoneSeen = { 
  key: MilestoneKey; 
  seenAt: string; // ISO
  variant: 'default' | 'slip'; 
};

// Rev 4: Collections (grow-only, synced)
export type CollectionItem = {
  id: string;
  at: string; // ISO
  source: 'goal' | 'milestone' | 'chapter' | 'season';
};

// Rev 4: Personalization (last-writer-wins by updatedAt, synced)
export type Personalization = {
  foxAccessory?: string;
  slots?: Record<string, string>; // pieceId → itemId
  updatedAt: string; // ISO
};

export type AppState = { 
  schemaVersion?: 2; // absent = 1
  profile: Profile | null; 
  events: ProgressEvent[];
  lights?: number; // Rev 5: total lights earned (calculated from check-ins)
  milestones?: { seen: MilestoneSeen[] }; // Rev 4: synced
  collection?: { earned: CollectionItem[] }; // Rev 4: synced, grow-only
  personalization?: Personalization; // Rev 4: synced, LWW
};
export type CopingChoice = { id: string; title: string; detail: string; icon: string; minutes: number };

const eventKinds = new Set<EventKind>(['checkin', 'craving', 'coping', 'slip', 'urge_result']);
const MAX_EVENTS = 10_000;
// Keep local payloads below the snapshot table's 1 MiB database constraint,
// leaving room for PostgreSQL JSONB representation overhead.
const MAX_STATE_BYTES = 700_000;

/** Validate persisted and remote JSON before trusting it as application state. */
export function parseAppState(value: unknown): AppState | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  try {
    const serialized = JSON.stringify(value);
    if (!serialized || new TextEncoder().encode(serialized).byteLength > MAX_STATE_BYTES) return null;
  } catch {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  if (!Array.isArray(candidate.events) || candidate.events.length > MAX_EVENTS) return null;
  const events: ProgressEvent[] = [];
  for (const item of candidate.events) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
    const event = item as Record<string, unknown>;
    if (typeof event.id !== 'string' || event.id.length < 1 || event.id.length > 120
      || typeof event.kind !== 'string' || !eventKinds.has(event.kind as EventKind)
      || typeof event.at !== 'string' || !Number.isFinite(Date.parse(event.at))
      || !event.details || typeof event.details !== 'object' || Array.isArray(event.details)) return null;
    events.push({ id: event.id, kind: event.kind as EventKind, at: event.at, details: event.details as Record<string, unknown> });
  }

  if (candidate.profile === null) {
    return buildAppState(null, events, candidate);
  }
  if (!candidate.profile || typeof candidate.profile !== 'object' || Array.isArray(candidate.profile)) return null;
  const profile = candidate.profile as Record<string, unknown>;
  if (typeof profile.name !== 'string' || profile.name.length > 120
    || typeof profile.reason !== 'string' || profile.reason.length > 2_000
    || typeof profile.quitDate !== 'string' || !Number.isFinite(Date.parse(profile.quitDate))
    || typeof profile.currency !== 'string' || !/^[A-Z]{3}$/.test(profile.currency)
    || typeof profile.cigarettesPerDay !== 'number' || !Number.isFinite(profile.cigarettesPerDay) || profile.cigarettesPerDay < 0 || profile.cigarettesPerDay > 100
    || typeof profile.packPrice !== 'number' || !Number.isFinite(profile.packPrice) || profile.packPrice < 0 || profile.packPrice > 10_000_000
    || typeof profile.packSize !== 'number' || !Number.isFinite(profile.packSize) || profile.packSize < 0 || profile.packSize > 100
    || ((profile.packPrice === 0) !== (profile.packSize === 0))) return null;

  return buildAppState({
    name: profile.name,
    cigarettesPerDay: profile.cigarettesPerDay,
    packPrice: profile.packPrice,
    packSize: profile.packSize,
    quitDate: profile.quitDate,
    reason: profile.reason,
    currency: profile.currency,
  }, events, candidate);
}

function buildAppState(profile: Profile | null, events: ProgressEvent[], candidate: Record<string, unknown>): AppState {
  const state: AppState = { profile, events };
  
  // Rev 4: schemaVersion
  if (typeof candidate.schemaVersion === 'number' && candidate.schemaVersion === 2) {
    state.schemaVersion = 2;
  }

  // Rev 4: Parse milestones (optional, grow-only set)
  if (candidate.milestones && typeof candidate.milestones === 'object' && !Array.isArray(candidate.milestones)) {
    const milestonesObj = candidate.milestones as Record<string, unknown>;
    if (Array.isArray(milestonesObj.seen)) {
      const seen: MilestoneSeen[] = [];
      for (const item of milestonesObj.seen) {
        if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
        const ms = item as Record<string, unknown>;
        if (typeof ms.key !== 'string' || typeof ms.seenAt !== 'string' || !Number.isFinite(Date.parse(ms.seenAt))) continue;
        const variant = (ms.variant === 'slip' || ms.variant === 'default') ? ms.variant : 'default';
        // Drop unknown keys for forward compatibility
        if (!ms.key.match(/^(day-\d+|chapter-\d+)$/)) continue;
        // Dedupe by key, keep earliest
        const existing = seen.find(s => s.key === ms.key);
        if (!existing) {
          seen.push({ key: ms.key as MilestoneKey, seenAt: ms.seenAt, variant });
        } else if (ms.seenAt < existing.seenAt) {
          existing.seenAt = ms.seenAt;
          existing.variant = variant;
        }
      }
      if (seen.length <= 64) {
        state.milestones = { seen };
      }
    }
  }
  if (!state.milestones) {
    state.milestones = { seen: [] };
  }

  // Rev 4: Parse collection (optional, grow-only set)
  if (candidate.collection && typeof candidate.collection === 'object' && !Array.isArray(candidate.collection)) {
    const collectionObj = candidate.collection as Record<string, unknown>;
    if (Array.isArray(collectionObj.earned)) {
      const earned: CollectionItem[] = [];
      for (const item of collectionObj.earned) {
        if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
        const ci = item as Record<string, unknown>;
        if (typeof ci.id !== 'string' || typeof ci.at !== 'string' || !Number.isFinite(Date.parse(ci.at))) continue;
        const source = ['goal', 'milestone', 'chapter', 'season'].includes(ci.source as string) 
          ? ci.source as CollectionItem['source'] 
          : 'milestone';
        // Dedupe by id
        if (!earned.find(e => e.id === ci.id)) {
          earned.push({ id: ci.id, at: ci.at, source });
        }
      }
      if (earned.length <= 2000) {
        state.collection = { earned };
      }
    }
  }
  if (!state.collection) {
    state.collection = { earned: [] };
  }

  // Rev 4: Parse personalization (optional, LWW)
  if (candidate.personalization && typeof candidate.personalization === 'object' && !Array.isArray(candidate.personalization)) {
    const p = candidate.personalization as Record<string, unknown>;
    if (typeof p.updatedAt === 'string' && Number.isFinite(Date.parse(p.updatedAt))) {
      const personalization: Personalization = { updatedAt: p.updatedAt };
      if (typeof p.foxAccessory === 'string') {
        personalization.foxAccessory = p.foxAccessory;
      }
      if (p.slots && typeof p.slots === 'object' && !Array.isArray(p.slots)) {
        const slots: Record<string, string> = {};
        for (const [k, v] of Object.entries(p.slots)) {
          if (typeof v === 'string') slots[k] = v;
        }
        if (Object.keys(slots).length > 0) {
          personalization.slots = slots;
        }
      }
      state.personalization = personalization;
    }
  }

  return state;
}
