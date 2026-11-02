import type { ProgressEvent } from '../data/schema';

/**
 * Earned light is derived from real completed actions rather than a balance
 * field. Check-ins can reward at most once per local calendar day; each
 * completed coping event earns once by event id. Opening or leaving an urge
 * flow does not award anything.
 */
export function earnedLight(events: readonly ProgressEvent[]): number {
  const rewardedCheckInDays = new Set<string>();
  const rewardedCopingSessions = new Set<string>();

  for (const event of events) {
    if (event.kind === 'checkin') {
      const date = new Date(event.at);
      if (!Number.isFinite(date.getTime())) continue;
      const localDay = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      rewardedCheckInDays.add(localDay);
    } else if (event.kind === 'coping') {
      rewardedCopingSessions.add(event.id);
    }
  }

  return rewardedCheckInDays.size + rewardedCopingSessions.size;
}
