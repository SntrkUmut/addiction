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
export type AppState = { profile: Profile | null; events: ProgressEvent[] };
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

  if (candidate.profile === null) return { profile: null, events };
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

  return {
    profile: {
      name: profile.name,
      cigarettesPerDay: profile.cigarettesPerDay,
      packPrice: profile.packPrice,
      packSize: profile.packSize,
      quitDate: profile.quitDate,
      reason: profile.reason,
      currency: profile.currency,
    },
    events,
  };
}
