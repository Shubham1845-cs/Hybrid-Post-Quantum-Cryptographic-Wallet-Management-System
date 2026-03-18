/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {

      // ── Brand colors ──────────────────────────────────────
      colors: {
        app: {
          bg:      '#080612',
          surface: '#0f0c1a',
          card:    '#13102a',
        },
        brand: {
          DEFAULT: '#7c3aed',
          light:   '#a78bfa',
          dim:     '#4c1d95',
          glow:    'rgba(124,58,237,0.4)',
        },
        accent: {
          indigo:   '#6366f1',
          emerald:  '#10b981',
          red:      '#ef4444',
          yellow:   '#f59e0b',
        },
      },

      // ── Typography ────────────────────────────────────────
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"DM Sans"', 'sans-serif'],
      },

      fontSize: {
        'display': ['2rem',    { lineHeight: '2.5rem',  fontWeight: '700' }],
        'heading': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'label':   ['0.625rem',{ lineHeight: '1rem',    letterSpacing: '0.1em' }],
        'micro':   ['0.5rem',  { lineHeight: '0.75rem', letterSpacing: '0.15em' }],
      },

      // ── Border radius ─────────────────────────────────────
      borderRadius: {
        card:  '1rem',
        panel: '1.5rem',
      },

      // ── Shadows ───────────────────────────────────────────
      boxShadow: {
        'card':           '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card-hover':     '0 12px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glow-violet':    '0 0 24px rgba(124,58,237,0.4)',
        'glow-violet-lg': '0 0 48px rgba(124,58,237,0.5)',
        'glow-emerald':   '0 0 24px rgba(16,185,129,0.4)',
        'glow-red':       '0 0 24px rgba(239,68,68,0.4)',
        'glow-indigo':    '0 0 24px rgba(99,102,241,0.4)',
        'inner-top':      'inset 0 1px 0 rgba(255,255,255,0.07)',
      },

      // ── Animations ────────────────────────────────────────
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)'  },
          '50%':      { transform: 'translateY(-6px)' },
        },
        spinRing: {
          to: { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)'   },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to:   { opacity: '1', transform: 'translateX(0)'    },
        },
      },

      animation: {
        shimmer:  'shimmer 2.5s infinite linear',
        float:    'float 4s ease-in-out infinite',
        spinRing: 'spinRing 0.9s linear infinite',
        fadeIn:   'fadeIn 0.3s ease-out forwards',
        slideIn:  'slideIn 0.3s ease-out forwards',
      },

    },
  },
  plugins: [],
};
