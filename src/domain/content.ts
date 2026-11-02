/**
 * Content manifest fetch and caching (rev 5).
 * Fetches from beta/prod channel, caches locally, validates, falls back to bundled.
 * 
 * Channel selection:
 * - beta: non-prod/TestFlight builds (default)
 * - prod: App Store builds
 * - Controlled by EXPO_PUBLIC_MANIFEST_CHANNEL env var
 */

import 'expo-sqlite/localStorage/install';
import bundledManifest from '../content/manifest.bundled.json';

const MANIFEST_CACHE_KEY = 'quit-content-manifest-v1';
const MANIFEST_FETCH_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours
const LAST_FETCH_KEY = 'quit-content-last-fetch-v1';

export type Manifest = typeof bundledManifest;

/**
 * Get manifest channel (beta or prod)
 */
function getManifestChannel(): 'beta' | 'prod' {
  const channel = process.env.EXPO_PUBLIC_MANIFEST_CHANNEL;
  if (channel === 'prod' || channel === 'beta') return channel;
  const appEnv = process.env.EXPO_PUBLIC_APP_ENV;
  if (appEnv === 'production' || appEnv === 'prod') return 'prod';
  return 'beta';
}

/**
 * Fetch manifest from Supabase content_manifests table
 * Silently fails if credentials are missing. Bundled fallback is full v11 (8 chapters).
 */
async function fetchRemoteManifest(): Promise<Manifest | null> {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    // No credentials: silently use bundled manifest
    return null;
  }

  try {
    const channel = getManifestChannel();
    const response = await fetch(
      `${supabaseUrl}/rest/v1/content_manifests?channel=eq.${channel}&order=version.desc&limit=1`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      // No manifest for this channel: fall back to bundled
      return null;
    }

    return data[0].manifest;
  } catch {
    return null;
  }
}

/**
 * Validate and filter manifest based on copyStatus
 * In production builds, only approved content is shown
 */
function filterManifest(manifest: Manifest, isProd: boolean): Manifest {
  if (!isProd) {
    return manifest; // Dev/beta: show all content
  }

  // Production: filter out non-approved content
  const filtered: Manifest = {
    ...manifest,
    chapters: manifest.chapters.filter(ch => ch.copyStatus === 'approved'),
  };
  
  if (manifest.milestones) {
    filtered.milestones = manifest.milestones.filter(m => !m.copyStatus || m.copyStatus === 'approved');
  }
  if (manifest.goalPool) {
    filtered.goalPool = manifest.goalPool.filter(g => !(g as any).copyStatus || (g as any).copyStatus === 'approved');
  }
  if (manifest.items) {
    filtered.items = manifest.items.filter(i => !(i as any).copyStatus || (i as any).copyStatus === 'approved');
  }
  if (manifest.upcoming) {
    // upcoming may not have copyStatus in schema yet, always include if present
    filtered.upcoming = manifest.upcoming;
  }
  
  return filtered;
}

/**
 * Get effective manifest: cached > bundled, with production filtering
 */
export async function getManifest(): Promise<Manifest> {
  const isProd = process.env.NODE_ENV === 'production';
  
  try {
    // Check if we should fetch
    const lastFetchStr = await localStorage.getItem(LAST_FETCH_KEY);
    const lastFetch = lastFetchStr ? parseInt(lastFetchStr, 10) : 0;
    const shouldFetch = Date.now() - lastFetch > MANIFEST_FETCH_INTERVAL;

    if (shouldFetch) {
      const remote = await fetchRemoteManifest();
      if (remote && remote.version > bundledManifest.version) {
        // Cache the remote manifest
        await localStorage.setItem(MANIFEST_CACHE_KEY, JSON.stringify(remote));
        await localStorage.setItem(LAST_FETCH_KEY, Date.now().toString());
        return filterManifest(remote, isProd);
      }
    }

    // Try cached manifest
    const cachedStr = await localStorage.getItem(MANIFEST_CACHE_KEY);
    if (cachedStr) {
      const cached = JSON.parse(cachedStr);
      if (cached.version >= bundledManifest.version) {
        return filterManifest(cached, isProd);
      }
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[content] Manifest fetch/cache failed, using bundled', error);
    }
  }

  // Fallback to bundled
  return filterManifest(bundledManifest, isProd);
}

/**
 * Get chapter by index (0-based)
 */
export function getChapter(manifest: Manifest, index: number) {
  return manifest.chapters[index];
}

/**
 * Get piece by global index (0-based across all chapters)
 */
export function getPiece(manifest: Manifest, pieceIndex: number) {
  let count = 0;
  for (const chapter of manifest.chapters) {
    if (pieceIndex < count + chapter.pieces.length) {
      return {
        chapter,
        piece: chapter.pieces[pieceIndex - count],
        chapterIndex: manifest.chapters.indexOf(chapter),
        pieceInChapter: pieceIndex - count,
      };
    }
    count += chapter.pieces.length;
  }
  return null;
}

/**
 * Calculate total pieces and chapters
 */
export function getContentStats(manifest: Manifest) {
  const totalPieces = manifest.chapters.reduce((sum, ch) => sum + ch.pieces.length, 0);
  const totalChapters = manifest.chapters.length;
  return { totalPieces, totalChapters };
}
