/**
 * Haptics helper (rev 4 §13).
 * All haptic calls go through this helper to respect the user toggle,
 * reduce motion settings, and handle failures gracefully.
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { AccessibilityInfo } from 'react-native';

const HAPTICS_ENABLED_KEY = 'quit-haptics-enabled-v1';

// Global state for haptics enabled toggle (defaults to true)
let hapticsEnabled = true;
let reduceMotion = false;

/**
 * Initialize haptics settings from storage
 */
export async function initHaptics(): Promise<void> {
  try {
    const stored = await localStorage.getItem(HAPTICS_ENABLED_KEY);
    hapticsEnabled = stored === null ? true : stored === 'true';
  } catch {
    hapticsEnabled = true;
  }

  try {
    reduceMotion = await AccessibilityInfo.isReduceMotionEnabled().catch(() => false);
    AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      reduceMotion = enabled;
    });
  } catch {
    if (__DEV__) {
      console.log('[haptics] Failed to check reduce motion setting');
    }
  }
}

/**
 * Get current haptics enabled state
 */
export function getHapticsEnabled(): boolean {
  return hapticsEnabled;
}

/**
 * Set haptics enabled state and persist
 */
export async function setHapticsEnabled(enabled: boolean): Promise<void> {
  hapticsEnabled = enabled;
  try {
    await localStorage.setItem(HAPTICS_ENABLED_KEY, enabled ? 'true' : 'false');
  } catch {
    // Silently fail - toggle still works in memory
  }
}

type HapticKind = 'selection' | 'light' | 'soft' | 'medium' | 'success';

/**
 * Perform a haptic feedback with all guards in place
 */
export async function haptic(kind: HapticKind): Promise<void> {
  // Guard: user toggle
  if (!hapticsEnabled) return;
  
  // Guard: web platform
  if (Platform.OS === 'web') return;

  // Guard: reduce motion for rhythmic haptics only
  // Keep discrete confirmations (success, medium, light) even with reduce motion
  if (reduceMotion && (kind === 'soft')) return;

  const run = (() => {
    switch (kind) {
      case 'selection':
        return () => Haptics.selectionAsync();
      case 'light':
        return () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      case 'soft':
        // Soft is iOS 13+ only, fallback to Light
        if (Platform.OS === 'ios') {
          return () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        }
        return () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      case 'medium':
        return () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      case 'success':
        return () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  })();

  try {
    await run();
  } catch {
    // Never block UI, never surface errors
  }
}

// Debounce helper to prevent multiple haptics in quick succession
const hapticDebounce: Map<HapticKind, number> = new Map();
const DEBOUNCE_MS = 1000;

/**
 * Perform a haptic with debouncing (max once per second per kind)
 */
export async function hapticDebounced(kind: HapticKind): Promise<void> {
  const now = Date.now();
  const last = hapticDebounce.get(kind) || 0;
  
  if (now - last < DEBOUNCE_MS) return;
  
  hapticDebounce.set(kind, now);
  await haptic(kind);
}
