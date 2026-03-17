// ─── What this file does ──────────────────────────────────────────────────────
// Renders all active toasts in the bottom-right corner
// Each toast auto-dismisses after 4 seconds
// User can also manually dismiss by clicking ✕

import { useError }   from '../../hooks/useError';
import type { Toast } from '../../types/error.types';
import { cn }         from '../../utils/cn';

// ── Single toast item ──────────────────────────────────────────────────────
const ToastItem = ({
  toast,
  onDismiss,
}: {
  toast:     Toast;
  onDismiss: (id: string) => void;
}) => {

  const colors = {
    error:   'border-red-500/30 bg-red-950/80 text-red-300',
    warning: 'border-yellow-500/30 bg-yellow-950/80 text-yellow-300',
    info:    'border-blue-500/30 bg-blue-950/80 text-blue-300',
  }[toast.severity];

  const dot = {
    error:   'bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.9)]',
    warning: 'bg-yellow-400 shadow-[0_0_6px_rgba(234,179,8,0.9)]',
    info:    'bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.9)]',
  }[toast.severity];

  return (
    <div className={cn(
      'flex items-center gap-3',
      'rounded-xl border backdrop-blur-md',
      'px-4 py-3 min-w-[280px] max-w-[380px]',
      'shadow-[0_8px_24px_rgba(0,0,0,0.4)]',
      colors,
    )}>
      {/* colored dot */}
      <span className={cn('w-2 h-2 rounded-full shrink-0', dot)} />

      {/* message */}
      <p className="flex-1 text-xs font-mono leading-relaxed">
        {toast.message}
      </p>

      {/* dismiss */}
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-[10px] font-mono text-slate-500
                   hover:text-slate-300 transition-colors shrink-0">
        ✕
      </button>
    </div>
  );
};

// ── Container — fixed bottom-right corner ─────────────────────────────────
const ToastContainer = () => {
  const { toasts, dismissToast } = useError();

  // render nothing if no toasts
  if (toasts.length === 0) return null;

  return (
    // fixed positioning — sits above everything in bottom-right
    <div className="fixed bottom-6 right-6 z-50
                    flex flex-col gap-2 items-end">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={dismissToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer;