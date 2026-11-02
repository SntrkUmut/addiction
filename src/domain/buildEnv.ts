/**
 * Distinguishes App Store / production builds from development and preview.
 * eas.json sets EXPO_PUBLIC_APP_ENV to development | preview | production.
 * Sign-in and cloud sync stay in the data layer; this only gates UI.
 */

export function isProductionBuild(appEnv = process.env.EXPO_PUBLIC_APP_ENV): boolean {
  return appEnv === 'production' || appEnv === 'prod';
}

/** True in development and preview so the existing status card can stay for QA. */
export function shouldShowCloudSyncCard(appEnv = process.env.EXPO_PUBLIC_APP_ENV): boolean {
  return !isProductionBuild(appEnv);
}

/** Production substitute for the cloud-sync card: accurate, no backup promise. */
export const ON_DEVICE_DATA_NOTE = 'Verilerin bu cihazda saklanır';

export const CLOUD_SYNC_CARD_TITLE = 'Bulut eşitleme';

export function cloudSyncStatusSubtitle(
  supabaseConfigured: boolean,
  appEnv = process.env.EXPO_PUBLIC_APP_ENV,
): string {
  if (!shouldShowCloudSyncCard(appEnv)) {
    return ON_DEVICE_DATA_NOTE;
  }
  return supabaseConfigured
    ? 'Uzak içerik ve yedekleme hazır · giriş isteğe bağlı'
    : 'Bağlı değil · Tüm veriler cihazda';
}
