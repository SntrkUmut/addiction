/**
 * Journey utilities (rev 5).
 * Uses turkishSuffix.ts for proper date formatting.
 */

import { sinceLabel, untilLabel, chapterCta } from './turkishSuffix';

/**
 * Calculate journey day (days since quit date, 0-indexed from quit date).
 * A slip never resets this counter.
 */
function parseLocalDate(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }
  return new Date(value);
}

export function journeyDay(quitDate: string, now: Date = new Date()): number {
  const quit = startOfDay(parseLocalDate(quitDate));
  const today = startOfDay(now);
  const diff = today.getTime() - quit.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Start of day in local timezone
 */
export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Format a date with Turkish month name and proper suffix
 * e.g. "21 Ekim 2026'dan beri"
 */
export function formatTurkishDateSince(dateStr: string): string {
  return sinceLabel(parseLocalDate(dateStr));
}

/**
 * Format relative time for Rotam events
 * "Bugün 09:12" / "Dün 21:40" / "30 Eki 18:05"
 */
export function formatEventTime(at: string, now: Date = new Date()): string {
  const date = new Date(at);
  const today = startOfDay(now);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const eventDay = startOfDay(date);
  
  const time = date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  
  if (eventDay.getTime() === today.getTime()) {
    return `Bugün ${time}`;
  } else if (eventDay.getTime() === yesterday.getTime()) {
    return `Dün ${time}`;
  } else {
    const dayMonth = date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
    });
    return `${dayMonth} ${time}`;
  }
}

/**
 * Calculate days until a future date (for milestone ghosts)
 * Returns positive number if in future, 0 if today or past
 */
export function daysUntil(targetDay: number, currentDay: number): number {
  return Math.max(0, targetDay - currentDay);
}

/**
 * Format days until a milestone
 * "{n} gün sonra" or "Bugün" if 0
 */
export function formatDaysUntil(days: number): string {
  if (days === 0) return 'Bugün';
  if (days === 1) return '1 gün sonra';
  return `${days} gün sonra`;
}

// Re-export for convenience
export { sinceLabel, untilLabel, chapterCta };
