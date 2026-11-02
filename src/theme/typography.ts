/**
 * Typography tokens (rev 4).
 * Uses Nunito via @expo-google-fonts/nunito.
 * Always use toLocaleUpperCase('tr-TR') for Turkish uppercase (İ, I).
 */

export const fontWeights = {
  regular: 'Nunito_400Regular',
  semiBold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
} as const;

export const textStyles = {
  displayXl: {
    fontFamily: fontWeights.black,
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -0.96,
  },
  displayLg: {
    fontFamily: fontWeights.extraBold,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.48,
  },
  titleLg: {
    fontFamily: fontWeights.extraBold,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.26,
  },
  titleMd: {
    fontFamily: fontWeights.extraBold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.11,
  },
  titleSm: {
    fontFamily: fontWeights.bold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: 0,
  },
  bodyLg: {
    fontFamily: fontWeights.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyMd: {
    fontFamily: fontWeights.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  smStrong: {
    fontFamily: fontWeights.semiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
  },
  smStrongValue: {
    fontFamily: fontWeights.extraBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
  },
  labelButton: {
    fontFamily: fontWeights.extraBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
  },
  labelTextButton: {
    fontFamily: fontWeights.extraBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0,
  },
  eyebrow: {
    fontFamily: fontWeights.extraBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.88,
  },
  caption: {
    fontFamily: fontWeights.semiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },
  captionBold: {
    fontFamily: fontWeights.bold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0,
  },
  numericTimer: {
    fontFamily: fontWeights.black,
    fontSize: 56,
    lineHeight: 60,
    letterSpacing: -1.12,
  },
} as const;

// Spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
} as const;

// Border radii
export const radii = {
  small: 12, // small stat tile
  iconTile: 14,
  input: 16,
  note: 16,
  tooltip: 12,
  row: 20,
  card: 24,
  sheetTop: 32,
  pill: 999,
} as const;

// Component heights
export const heights = {
  primaryButton: 56, // +4 edge = 60 total
  secondaryButton: 52,
  chip: 36,
  feelingChip: 48,
  questRow: 68,
  toolRow: 68,
  input: 64,
  textButton: 44,
  closeButton: 44,
  tabBar: 84,
} as const;

// Grouped API for easier imports
export const typography = {
  display: {
    xl: textStyles.displayXl,
    lg: textStyles.displayLg,
    md: textStyles.titleLg,
    sm: textStyles.titleMd,
  },
  title: {
    lg: textStyles.titleLg,
    md: textStyles.titleMd,
    sm: textStyles.titleSm,
  },
  body: {
    lg: textStyles.bodyLg,
    md: textStyles.bodyMd,
    sm: textStyles.smStrong,
  },
  label: {
    button: textStyles.labelButton,
    textButton: textStyles.labelTextButton,
    md: textStyles.smStrongValue,
    sm: textStyles.eyebrow,
  },
  caption: {
    regular: textStyles.caption,
    bold: textStyles.captionBold,
  },
} as const;
