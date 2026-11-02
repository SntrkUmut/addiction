/**
 * Decorative mascot FX helpers (PR #1 layering, no smoke/fire).
 * Pure so Node tests can cover allowlists and reduce-motion gating.
 */

export const ALLOWED_MASCOT_EFFECTS = [
  'shield',
  'breath_ring',
  'bubbles',
  'sparkles',
  'crystals',
] as const;

export type MascotEffect = (typeof ALLOWED_MASCOT_EFFECTS)[number];

const ALLOWED = new Set<string>(ALLOWED_MASCOT_EFFECTS);
const BANNED = new Set(['smoke', 'fire', 'flame', 'ember', 'coal']);

export function isAllowedMascotEffect(value: string): value is MascotEffect {
  return ALLOWED.has(value) && !BANNED.has(value);
}

export function sanitizeMascotEffects(effects: readonly string[]): MascotEffect[] {
  const unique: MascotEffect[] = [];
  for (const effect of effects) {
    if (!isAllowedMascotEffect(effect)) continue;
    if (!unique.includes(effect)) unique.push(effect);
  }
  return unique;
}

export function layerMascotEffects(effects: readonly MascotEffect[]): {
  back: MascotEffect[];
  mid: MascotEffect[];
} {
  return {
    back: effects.filter(effect => effect === 'breath_ring' || effect === 'shield' || effect === 'sparkles'),
    mid: effects.filter(effect => effect === 'bubbles' || effect === 'crystals'),
  };
}

/** Animations run only after the OS preference is known and reduce-motion is off. */
export function isMascotMotionEnabled(reduceMotion: boolean | null): boolean {
  return reduceMotion === false;
}
