// Proposal for src/domain/turkishSuffix.ts — Turkish case suffixes after numbers and dates.
// Rule: the suffix follows how the number is SPOKEN, and only the LAST non-zero spoken word
// matters (2026 = "iki bin yirmi altı" -> "altı"; 2100 = "iki bin yüz" -> "yüz").
//   vowel harmony : last vowel a/ı/o/u -> "a", e/i/ö/ü -> "e"
//   assimilation  : word ends in f s t k ç ş h p -> "t…" (ablative/locative), else "d…"
//   dative buffer : word ends in a vowel -> "y" + a/e
type Word = { back: boolean; hard: boolean; vowelEnd: boolean };
//                     back = a/ı/o/u harmony, hard = voiceless final consonant, vowelEnd = ends in a vowel
const w = (back: boolean, hard: boolean, vowelEnd: boolean): Word => ({ back, hard, vowelEnd });

/** Last spoken word -> features. Units 1–9, tens 10–90, yüz, bin, milyon, sıfır. */
const UNITS: Record<number, Word> = {
  1: w(false, false, false), // bir
  2: w(false, false, true),  // iki
  3: w(false, true, false),  // üç
  4: w(false, true, false),  // dört
  5: w(false, true, false),  // beş
  6: w(true, false, true),   // altı
  7: w(false, false, true),  // yedi
  8: w(false, false, false), // sekiz
  9: w(true, false, false),  // dokuz
};
const TENS: Record<number, Word> = {
  1: w(true, false, false),  // on
  2: w(false, false, true),  // yirmi
  3: w(true, false, false),  // otuz
  4: w(true, true, false),   // kırk
  5: w(false, false, true),  // elli
  6: w(true, true, false),   // altmış
  7: w(false, true, false),  // yetmiş
  8: w(false, false, false), // seksen
  9: w(true, false, false),  // doksan
};
const YUZ = w(false, false, false);    // yüz
const BIN = w(false, false, false);    // bin
const MILYON = w(true, false, false);  // milyon
const SIFIR = w(true, false, false);   // sıfır

export function lastSpokenWord(n: number): Word {
  if (!Number.isInteger(n) || n < 0) throw new RangeError('non-negative integer expected');
  if (n === 0) return SIFIR;
  if (n % 10 !== 0) return UNITS[n % 10];
  if (n % 100 !== 0) return TENS[(n % 100) / 10];
  if (n % 1000 !== 0) return YUZ;
  if (n % 1_000_000 !== 0) return BIN;
  return MILYON;
}

/** -dan/-den/-tan/-ten : "2026’dan beri" */
export const ablative = (n: number) => { const x = lastSpokenWord(n); return (x.hard ? 't' : 'd') + (x.back ? 'an' : 'en'); };
/** -da/-de/-ta/-te : "2026’da" */
export const locative = (n: number) => { const x = lastSpokenWord(n); return (x.hard ? 't' : 'd') + (x.back ? 'a' : 'e'); };
/** -a/-e/-ya/-ye : "Bölüm 3’e bak", "Bölüm 6’ya bak" */
export const dative = (n: number) => { const x = lastSpokenWord(n); return (x.vowelEnd ? 'y' : '') + (x.back ? 'a' : 'e'); };

/** Dative of month names for "{d} {Ay}’a kadar" (index 0 = Ocak). */
const MONTH_DATIVE = ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'e', 'e', 'a', 'a'];
//                    Ocak Şubat Mart Nisan Mayıs Haziran Temmuz Ağustos Eylül Ekim Kasım Aralık

export const APOS = '’'; // U+2019, the app's existing apostrophe; never a straight '

const dateText = (d: Date, withYear: boolean) =>
  d.toLocaleDateString('tr-TR', withYear ? { day: 'numeric', month: 'long', year: 'numeric' } : { day: 'numeric', month: 'long' });

/** "21 Ekim 2026’dan beri" (Rotam hero, Ben). */
export const sinceLabel = (d: Date) => `${dateText(d, true)}${APOS}${ablative(d.getFullYear())} beri`;
/** "30 Kasım’a kadar" (seasonal banner). */
export const untilLabel = (d: Date) => `${dateText(d, false)}${APOS}${MONTH_DATIVE[d.getMonth()]} kadar`;
/** "Bölüm 3’e bak" (chapter-complete CTA). */
export const chapterCta = (n: number) => `Bölüm ${n}${APOS}${dative(n)} bak`;
