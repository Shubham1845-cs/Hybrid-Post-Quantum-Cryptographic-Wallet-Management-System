/**
 * theme.ts – Typed theme constants for the Hybrid PQC Wallet frontend.
 *
 * These values mirror the Tailwind configuration so that they are available
 * in TypeScript logic (e.g. for chart libraries, canvas drawing, or runtime
 * style computation) without duplicating magic strings.
 */

// ---------------------------------------------------------------------------
// Color Palette
// ---------------------------------------------------------------------------

export const colors = {
  /** Primary brand color – deep indigo/navy */
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },
  /** Accent color – teal/cyan */
  accent: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
    950: '#083344',
  },
  /** Semantic success */
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  /** Semantic warning */
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  /** Semantic error */
  error: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
  },
  /** Surface / background shades */
  surface: {
    light: '#f8fafc',
    DEFAULT: '#f1f5f9',
    dark: '#0f172a',
    card: '#ffffff',
    cardDark: '#1e293b',
  },
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export const typography = {
  fontFamily: {
    /** UI text and body copy */
    sans: '"Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
    /** Code, addresses, and cryptographic keys */
    mono: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
    /** Display headings */
    display: '"Plus Jakarta Sans", "Inter", ui-sans-serif, sans-serif',
  },
  fontSize: {
    '2xs': '0.625rem',
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing (4-point grid)
// ---------------------------------------------------------------------------

export const spacing = {
  0: '0px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  18: '4.5rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  88: '22rem',
  96: '24rem',
} as const;

// ---------------------------------------------------------------------------
// Breakpoints (matches Tailwind screens)
// ---------------------------------------------------------------------------

export const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ---------------------------------------------------------------------------
// Border Radius
// ---------------------------------------------------------------------------

export const borderRadius = {
  none: '0px',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  '4xl': '2rem',
  full: '9999px',
} as const;

// ---------------------------------------------------------------------------
// Shadows
// ---------------------------------------------------------------------------

export const shadows = {
  card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  cardHover: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  glow: '0 0 20px rgb(99 102 241 / 0.35)',
  glowAccent: '0 0 20px rgb(6 182 212 / 0.35)',
} as const;

// ---------------------------------------------------------------------------
// Z-Index scale
// ---------------------------------------------------------------------------

export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
  tooltip: 600,
} as const;

// ---------------------------------------------------------------------------
// Composite theme export
// ---------------------------------------------------------------------------

const theme = {
  colors,
  typography,
  spacing,
  breakpoints,
  borderRadius,
  shadows,
  zIndex,
} as const;

export type Theme = typeof theme;
export default theme;
