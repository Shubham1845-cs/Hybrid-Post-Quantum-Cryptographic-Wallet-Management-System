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
  /** App background / surface shades – deep dark violet */
  app: {
    bg:      '#080612',
    surface: '#0f0c1a',
    card:    '#13102a',
  },
  /** Brand – violet */
  brand: {
    DEFAULT: '#7c3aed',
    light:   '#a78bfa',
    dim:     '#4c1d95',
    glow:    'rgba(124,58,237,0.4)',
  },
  /** Accent – semantic / interactive colors */
  accent: {
    indigo:  '#6366f1',
    emerald: '#10b981',
    red:     '#ef4444',
    yellow:  '#f59e0b',
  },
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export const typography = {
  fontFamily: {
    /** UI text and body copy */
    sans: '"DM Sans", sans-serif',
    /** Code, addresses, and cryptographic keys */
    mono: '"JetBrains Mono", monospace',
  },
  fontSize: {
    /** 2rem / 700 weight – hero headings */
    display: '2rem',
    /** 1.25rem / 600 weight – section headings */
    heading: '1.25rem',
    /** 0.625rem – uppercase labels */
    label: '0.625rem',
    /** 0.5rem – fine-print / micro copy */
    micro: '0.5rem',
    // Tailwind defaults also available (xs, sm, base, lg, xl, 2xl …)
  },
  fontWeight: {
    normal:    '400',
    medium:    '500',
    semibold:  '600',
    bold:      '700',
    extrabold: '800',
  },
  lineHeight: {
    none:    '1',
    tight:   '1.25',
    snug:    '1.375',
    normal:  '1.5',
    relaxed: '1.625',
    loose:   '2',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight:   '-0.025em',
    normal:  '0em',
    wide:    '0.025em',
    wider:   '0.05em',
    widest:  '0.1em',
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing (4-point grid – subset)
// ---------------------------------------------------------------------------

export const spacing = {
  0:   '0px',
  0.5: '0.125rem',
  1:   '0.25rem',
  1.5: '0.375rem',
  2:   '0.5rem',
  2.5: '0.625rem',
  3:   '0.75rem',
  3.5: '0.875rem',
  4:   '1rem',
  5:   '1.25rem',
  6:   '1.5rem',
  7:   '1.75rem',
  8:   '2rem',
  9:   '2.25rem',
  10:  '2.5rem',
  12:  '3rem',
  16:  '4rem',
  20:  '5rem',
  24:  '6rem',
  32:  '8rem',
  40:  '10rem',
  48:  '12rem',
  64:  '16rem',
  80:  '20rem',
  96:  '24rem',
} as const;

// ---------------------------------------------------------------------------
// Breakpoints (matches Tailwind defaults – xs removed from new config)
// ---------------------------------------------------------------------------

export const breakpoints = {
  sm:  '640px',
  md:  '768px',
  lg:  '1024px',
  xl:  '1280px',
  '2xl': '1536px',
} as const;

// ---------------------------------------------------------------------------
// Border Radius
// ---------------------------------------------------------------------------

export const borderRadius = {
  none:    '0px',
  sm:      '0.125rem',
  DEFAULT: '0.25rem',
  md:      '0.375rem',
  lg:      '0.5rem',
  xl:      '0.75rem',
  '2xl':   '1rem',
  '3xl':   '1.5rem',
  card:    '1rem',
  panel:   '1.5rem',
  full:    '9999px',
} as const;

// ---------------------------------------------------------------------------
// Shadows
// ---------------------------------------------------------------------------

export const shadows = {
  card:         '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
  cardHover:    '0 12px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
  glowViolet:   '0 0 24px rgba(124,58,237,0.4)',
  glowVioletLg: '0 0 48px rgba(124,58,237,0.5)',
  glowEmerald:  '0 0 24px rgba(16,185,129,0.4)',
  glowRed:      '0 0 24px rgba(239,68,68,0.4)',
  glowIndigo:   '0 0 24px rgba(99,102,241,0.4)',
  innerTop:     'inset 0 1px 0 rgba(255,255,255,0.07)',
} as const;

// ---------------------------------------------------------------------------
// Z-Index scale
// ---------------------------------------------------------------------------

export const zIndex = {
  base:     0,
  raised:   10,
  dropdown: 100,
  sticky:   200,
  overlay:  300,
  modal:    400,
  toast:    500,
  tooltip:  600,
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
