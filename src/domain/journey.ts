/**
 * Journey days and date utilities (rev 4).
 * Journey days count from quitDate and never reset on a slip.
 */

/**
 * Calculate journey day (days since quit date, 0-indexed from quit date).
 * A slip never resets this counter.
 */
export function journeyDay(quitDate: string, now: Date = new Date()): number {
  const quit = startOfDay(new Date(quitDate));
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
 * 
 * The ablative suffix follows the last spoken word of the year:
 * 2026 "yirmi altı" → 'dan
 * 2027 "yirmi yedi" → 'den
 * etc.
 */
export function formatTurkishDateSince(dateStr: string): string {
  const date = new Date(dateStr);
  const formatted = date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  
  // Get ablative suffix based on year's last digit/tens spoken word
  const year = date.getFullYear();
  const suffix = getYearAblativeSuffix(year);
  
  return `${formatted}${suffix} beri`;
}

/**
 * Get Turkish ablative suffix for a year based on vowel harmony rules.
 * The suffix follows the last spoken word of the year number.
 */
export function getYearAblativeSuffix(year: number): string {
  // For years like 2026, 2027, etc., we need the last non-zero digit
  // or the tens place if the ones is zero
  
  const lastDigit = year % 10;
  const tensDigit = Math.floor((year % 100) / 10);
  
  // Turkish number words for last sounds:
  // 0: sıfır (ends in r, front unrounded) → 'dan
  // 1: bir (ends in r, front unrounded) → 'den  
  // 2: iki (ends in i, front unrounded) → 'den
  // 3: üç (ends in ç, front rounded) → 'ten
  // 4: dört (ends in t, front rounded) → 'ten
  // 5: beş (ends in ş, front unrounded) → 'ten
  // 6: altı (ends in ı, back unrounded) → 'dan
  // 7: yedi (ends in i, front unrounded) → 'den
  // 8: sekiz (ends in z, front unrounded) → 'den
  // 9: dokuz (ends in z, front unrounded) → 'dan
  
  // For tens (when last digit is 0):
  // 10/20: yirmi (ends in i) → 'den
  // 30: otuz (ends in z) → 'dan
  // 40: kırk (ends in k) → 'tan
  // 50: elli (ends in i) → 'den
  // 60: altmış (ends in ş) → 'tan
  // 70: yetmiş (ends in ş) → 'ten
  // 80: seksen (ends in n) → 'den
  // 90: doksan (ends in n) → 'dan
  
  const suffixMap: Record<number, string> = {
    0: "'dan", // sıfır
    1: "'den", // bir
    2: "'den", // iki
    3: "'ten", // üç
    4: "'ten", // dört
    5: "'ten", // beş
    6: "'dan", // altı
    7: "'den", // yedi
    8: "'den", // sekiz
    9: "'dan", // dokuz
  };
  
  const tensSuffixMap: Record<number, string> = {
    0: "'dan", // special handling
    1: "'den", // on
    2: "'den", // yirmi
    3: "'dan", // otuz
    4: "'tan", // kırk
    5: "'den", // elli
    6: "'tan", // altmış
    7: "'ten", // yetmiş
    8: "'den", // seksen
    9: "'dan", // doksan
  };
  
  if (lastDigit === 0) {
    return tensSuffixMap[tensDigit] || "'dan";
  }
  
  return suffixMap[lastDigit] || "'dan";
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
