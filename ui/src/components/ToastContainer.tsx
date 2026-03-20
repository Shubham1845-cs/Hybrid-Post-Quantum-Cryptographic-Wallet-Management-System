// ─── Toast notification container ────────────────────────────────────────────

import type { Toast } from '../types';

const ICONS: Record<string, string> = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
};

const COLORS: Record<string, string> = {
  success: '#6ee7b7',
  error:   '#fca5a5',
  info:    '#a5b4fc',
};

export default function ToastContainer({ toasts }: { toasts: Toast[] }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span style={{ color: COLORS[t.type], fontSize: 15, fontWeight: 700, flexShrink: 0 }}>
            {ICONS[t.type]}
          </span>
          <span style={{ color: 'var(--clr-text-primary)', lineHeight: 1.4 }}>
            {t.message}
          </span>
        </div>
      ))}
    </div>
  );
}
