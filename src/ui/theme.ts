/**
 * Theme system (rev 5).
 * Supports light/dark modes with system detection and manual override.
 */

import { useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

const THEME_MODE_KEY = 'quit-theme-mode-v1';

// Global state
let currentMode: ThemeMode = 'system';

/**
 * Initialize theme from storage
 */
export async function initTheme(): Promise<ThemeMode> {
  try {
    const stored = await localStorage.getItem(THEME_MODE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      currentMode = stored;
    }
  } catch {
    currentMode = 'system';
  }
  return currentMode;
}

/**
 * Get current theme mode
 */
export function getThemeMode(): ThemeMode {
  return currentMode;
}

/**
 * Set theme mode and persist
 */
export async function setThemeMode(mode: ThemeMode): Promise<void> {
  currentMode = mode;
  try {
    await localStorage.setItem(THEME_MODE_KEY, mode);
  } catch {
    // Silently fail - mode still works in memory
  }
}

/**
 * Resolve theme mode to actual light/dark
 */
export function resolveTheme(mode: ThemeMode, systemScheme: 'light' | 'dark' | null): ResolvedTheme {
  if (mode === 'system') {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }
  return mode;
}

/**
 * React hook for theme
 */
export function useTheme(): { mode: ThemeMode; resolved: ResolvedTheme; setMode: (mode: ThemeMode) => Promise<void> } {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(currentMode);
  
  useEffect(() => {
    initTheme().then(setModeState);
  }, []);
  
  const resolved = resolveTheme(mode, systemScheme);
  
  const setMode = async (newMode: ThemeMode) => {
    await setThemeMode(newMode);
    setModeState(newMode);
  };
  
  return { mode, resolved, setMode };
}
