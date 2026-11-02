/**
 * Style helper utilities for proper TypeScript typing
 * Not used - kept for reference. Use `as any` for style arrays instead.
 */

import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

type StyleArray<T> = readonly (T | null | undefined | false)[];

/**
 * Helper to flatten style arrays for View components
 */
export function flattenViewStyle(styles: StyleArray<ViewStyle>): ViewStyle | undefined {
  return StyleSheet.flatten(styles.filter(Boolean) as ViewStyle[]) as ViewStyle | undefined;
}

/**
 * Helper to flatten style arrays for Text components
 */
export function flattenTextStyle(styles: StyleArray<TextStyle>): TextStyle | undefined {
  return StyleSheet.flatten(styles.filter(Boolean) as TextStyle[]) as TextStyle | undefined;
}
