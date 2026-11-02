import type { AppState } from '../data/schema';

/** Stable, versioned JSON envelope for a user's intentional data export. */
export function createExportJson(state: AppState, exportedAt = new Date()): string {
  return JSON.stringify({
    format: 'quit-companion-export',
    formatVersion: 1,
    exportedAt: exportedAt.toISOString(),
    profile: state.profile,
    events: state.events,
  }, null, 2);
}
