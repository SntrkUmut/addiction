/**
 * Manifest shape checks that do not import Expo.
 * Missing or invalid `completion` (no non-empty title) is not usable.
 */

export function isUsableManifestShape(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as { version?: unknown; chapters?: unknown };
  if (typeof candidate.version !== 'number' || !Number.isFinite(candidate.version)) return false;
  if (!Array.isArray(candidate.chapters) || candidate.chapters.length === 0) return false;
  return candidate.chapters.every(chapter => {
    if (!chapter || typeof chapter !== 'object') return false;
    const record = chapter as { pieces?: unknown; completion?: unknown };
    if (!Array.isArray(record.pieces) || record.pieces.length === 0) return false;
    const completion = record.completion;
    if (!completion || typeof completion !== 'object') return false;
    const title = (completion as { title?: unknown }).title;
    return typeof title === 'string' && title.trim().length > 0;
  });
}
