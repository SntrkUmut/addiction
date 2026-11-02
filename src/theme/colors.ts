/**
 * Color tokens for the Sığınak app (rev 4).
 * Design tokens are split into primitives and semantic tokens.
 * Components should use only semantic tokens to enable future dark mode support.
 */

// Primitive tokens
export const primitives = {
  cream: {
    50: '#FFFEFC',
    100: '#F8F6F1',
    200: '#F2F1EB',
    300: '#EAE4DC',
  },
  terracotta: {
    50: '#FDF0EC',
    100: '#FCEBE3',
    150: '#FBE3D6',
    200: '#F7E9E2',
    300: '#F0DDD2',
    350: '#EAD0C2',
    600: '#C84F2E', // rev 3: was #C9502F
    700: '#A5412B',
    800: '#8E3623', // shadow
  },
  obsidian: {
    600: '#3A4350',
    700: '#2C3440',
    800: '#202B37',
    900: '#1B1F24',
    950: '#14171B',
  },
  ink: {
    900: '#202522',
  },
  neutral: {
    200: '#C9C3B8',
    400: '#A4A79F',
    500: '#666C66',
    600: '#6E726A', // rev 5: tertiary text
  },
  gold: {
    100: '#F7F0DC',
    500: '#D9AC58',
    600: '#B98A2E', // rev 3
    700: '#A9822F', // rev 3
  },
  teal: {
    100: '#E3F7F5',
    400: '#5ED6CF',
    700: '#2E7F7A', // rev 3
  },
  white: '#FFFFFF',
} as const;

// Semantic tokens (light theme)
// Components should use only these tokens
export const semanticLight = {
  bg: {
    canvas: primitives.cream[100],
    dark: primitives.obsidian[900],
  },
  surface: {
    card: primitives.cream[50],
    sunken: primitives.cream[200],
    hero: primitives.terracotta[100],
    rewardSoft: primitives.gold[100],
    calmSoft: primitives.teal[100],
    glassDark: 'rgba(255, 255, 255, 0.1)',
  },
  border: {
    default: primitives.cream[300],
    accent: primitives.terracotta[300],
    glassDark: 'rgba(255, 255, 255, 0.22)',
  },
  text: {
    primary: primitives.ink[900],
    secondary: primitives.neutral[500],
    tertiary: primitives.neutral[600], // rev 5: #6E726A for locked/faded text
    accent: primitives.terracotta[700],
    onAccent: primitives.white,
    onDark: primitives.cream[50],
    onDarkMuted: primitives.neutral[200],
  },
  action: {
    primary: primitives.terracotta[600],
    primaryPressed: primitives.terracotta[700],
    primaryEdge: primitives.terracotta[800],
    secondary: primitives.cream[200],
  },
  accent: {
    gold: primitives.gold[500],
    goldDeep: primitives.gold[600],
    goldEdge: primitives.gold[700],
    teal: primitives.teal[400],
    tealDeep: primitives.teal[700],
  },
} as const;

// Semantic tokens (dark theme - rev 5 mock5)
// Uses dusk scene for main screens, keeps night scene for focus screens
export const semanticDark = {
  bg: {
    canvas: primitives.obsidian[900],
    dark: primitives.obsidian[950],
  },
  surface: {
    card: primitives.obsidian[800],
    sunken: primitives.obsidian[700],
    hero: primitives.obsidian[600],
    rewardSoft: 'rgba(217, 172, 88, 0.12)', // gold with low opacity
    calmSoft: 'rgba(94, 214, 207, 0.12)', // teal with low opacity
    glassDark: 'rgba(255, 255, 255, 0.08)',
  },
  border: {
    default: primitives.obsidian[700],
    accent: primitives.obsidian[600],
    glassDark: 'rgba(255, 255, 255, 0.18)',
  },
  text: {
    primary: primitives.cream[50],
    secondary: primitives.neutral[400],
    tertiary: '#8C8F87', // rev 5: darker tertiary for dark mode
    accent: primitives.terracotta[600], // brighter on dark
    onAccent: primitives.white,
    onDark: primitives.cream[50],
    onDarkMuted: primitives.neutral[200],
  },
  action: {
    primary: primitives.terracotta[600],
    primaryPressed: primitives.terracotta[700],
    primaryEdge: primitives.terracotta[800],
    secondary: primitives.obsidian[700],
  },
  accent: {
    gold: primitives.gold[500],
    goldDeep: primitives.gold[600],
    goldEdge: primitives.gold[700],
    teal: primitives.teal[400],
    tealDeep: primitives.teal[700],
  },
} as const;

// Default export for backward compatibility
export const semantic = semanticLight;

// Scene gradients
export const sceneDay = {
  sky: ['#FBE3D6', '#FCEBE3', '#F7E9E2'], // linear gradient 180° at 0%, 55%, 100%
  horizon: primitives.terracotta[300], // #F0DDD2
  innerHill: primitives.terracotta[350], // #EAD0C2 at 75% opacity
};

export const sceneDusk = {
  // Rev 5: Dusk scene for dark mode main screens
  sky: ['#2C3440', '#202B37', '#1B1F24'], // obsidian gradient
  horizon: primitives.obsidian[700],
  innerHill: primitives.obsidian[600], // at 75% opacity
};

export const sceneNight = {
  sky: ['#14171B', '#1B1F24', '#202B37'], // linear gradient 180° at 0%, 55%, 100%
  horizon: primitives.obsidian[700],
  innerHill: primitives.obsidian[600], // at 75% opacity
};

// Shadow/effects values
export const shadows = {
  button: {
    color: primitives.terracotta[800],
    offsetY: 4,
    blur: 0,
  },
  nodeEdge: {
    done: primitives.terracotta[800],
    next: primitives.gold[700],
    locked: '#D6CEC2',
    offsetY: 6,
    blur: 0,
  },
  float: {
    color: 'rgba(92, 56, 36, 0.08)', // #5C3824 at 8-10%
    offsetY: 6,
    blur: 18,
  },
  glow: {
    gold: 'rgba(217, 172, 88, 0.38)', // center → 0 at 68-70%
  },
} as const;
