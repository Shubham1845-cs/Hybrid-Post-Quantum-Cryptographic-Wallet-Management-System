// ─── Design tokens as TypeScript constants ────────────────────────────────────
// Use these when Tailwind can't help:
// canvas drawing, SVG fills, programmatic style objects

export const tokens = {

  colors: {
    bg: {
      primary: '#080612',
      surface: '#0f0c1a',
      card:    '#13102a',
    },
    brand: {
      default: '#7c3aed',
      light:   '#a78bfa',
      dim:     '#4c1d95',
    },
    accent: {
      indigo:  '#6366f1',
      emerald: '#10b981',
      red:     '#ef4444',
      yellow:  '#f59e0b',
    },
    text: {
      primary:   '#f1f5f9',
      secondary: '#94a3b8',
      muted:     '#475569',
      brand:     '#a78bfa',
    },
  },

  shadows: {
    card:        '0 8px 32px rgba(0,0,0,0.4)',
    glowViolet:  '0 0 24px rgba(124,58,237,0.4)',
    glowEmerald: '0 0 24px rgba(16,185,129,0.4)',
    glowRed:     '0 0 24px rgba(239,68,68,0.4)',
  },

  radius: {
    card:  '1rem',
    panel: '1.5rem',
    pill:  '9999px',
  },

  fonts: {
    mono: '"JetBrains Mono", monospace',
    sans: '"DM Sans", sans-serif',
  },

  animation: {
    transition: 'all 0.3s ease',
    fast:       'all 0.15s ease',
    slow:       'all 0.5s ease',
  },

} as const;

// ── Helper — get glow shadow by color name ────────────────────────────────
export const getGlow = (
  color: 'violet' | 'emerald' | 'red' | 'indigo',
  opacity = 0.4
): string => {
  const rgb = {
    violet:  '124,58,237',
    emerald: '16,185,129',
    red:     '239,68,68',
    indigo:  '99,102,241',
  }[color];
  return `0 0 24px rgba(${rgb},${opacity})`;
};