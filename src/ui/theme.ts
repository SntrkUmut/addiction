/**
 * Theme system (rev 5).
 * Supports light/dark modes with system detection and manual override.
 */

import { useColorScheme } from 'react-native';
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { semanticLight, semanticDark } from '../theme/colors';
import { THEME_MODE_KEY } from '../data/wipe';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

type ThemeContextValue = {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  colors: typeof semanticLight;
  isDark: boolean;
  themeMode: ThemeMode;
  setMode: (mode: ThemeMode) => Promise<void>;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

// Global state
let currentMode: ThemeMode = 'system';

/**
 * Initialize theme from storage
 */
export async function initTheme(): Promise<ThemeMode> {
  try {
    const stored = await AsyncStorage.getItem(THEME_MODE_KEY);
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

/** First-run default after a local wipe. Persistence is handled by the wipe. */
export function resetThemeMemory() {
  currentMode = 'system';
}

/**
 * Set theme mode and persist
 */
export async function setThemeMode(mode: ThemeMode): Promise<void> {
  currentMode = mode;
  try {
    await AsyncStorage.setItem(THEME_MODE_KEY, mode);
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
 * Theme Provider component
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = React.useState<ThemeMode>(currentMode);
  
  React.useEffect(() => {
    initTheme().then(setModeState);
  }, []);
  
  const resolved = resolveTheme(mode, systemScheme);
  const isDark = resolved === 'dark';
  const colors = isDark ? semanticDark : semanticLight;
  
  const setMode = async (newMode: ThemeMode) => {
    await setThemeMode(newMode);
    setModeState(newMode);
  };
  
  const value: ThemeContextValue = {
    mode,
    resolved,
    colors: colors as typeof semanticLight,
    isDark,
    themeMode: mode,
    setMode,
  };
  
  return React.createElement(ThemeContext.Provider, { value }, children);
}

/**
 * React hook for theme
 */
export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    // Fallback for use outside provider
    return {
      mode: 'light',
      resolved: 'light',
      colors: semanticLight,
      isDark: false,
      themeMode: 'light',
      setMode: async () => {},
    };
  }
  return context;
}
