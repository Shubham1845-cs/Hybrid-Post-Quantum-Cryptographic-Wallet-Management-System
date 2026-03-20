// ─── What this file does ──────────────────────────────────────────────────────
// Enhanced ErrorMessage — categorizes error, shows icon, recovery buttons
// Used inline inside forms and pages

import { useMemo }               from 'react';
import type { RecoveryOption } from '../../types/error.types';
import { buildAppError, getErrorIcon } from '../../utils/errorUtils';
import { cn }                    from '../../utils/cn';

interface ErrorMessageProps {
  message:    string;
  recovery?:  RecoveryOption[];  // optional recovery buttons
  onDismiss?: () => void;        // optional dismiss
  compact?:   boolean;           // compact mode for inline use
}

const ErrorMessage = ({
  message,
  recovery,
  onDismiss,
  compact = false,
}: ErrorMessageProps) => {

  // build full AppError from raw message
  const appError = useMemo(() => buildAppError(message), [message]);
  const icon     = getErrorIcon(appError.category);

  // color scheme per severity
  const colors = {
    error: {
      border:  'border-red-500/25',
      bg:      'bg-red-500/8',
      glow:    'shadow-[0_0_20px_rgba(239,68,68,0.1)]',
      bar:     'bg-red-500',
      barGlow: 'shadow-[0_0_8px_rgba(239,68,68,0.8)]',
      title:   'text-red-400',
      text:    'text-red-300',
      badge:   'border-red-500/30 text-red-400 bg-red-500/10',
    },
    warning: {
      border:  'border-yellow-500/25',
      bg:      'bg-yellow-500/8',
      glow:    'shadow-[0_0_20px_rgba(234,179,8,0.1)]',
      bar:     'bg-yellow-500',
      barGlow: 'shadow-[0_0_8px_rgba(234,179,8,0.8)]',
      title:   'text-yellow-400',
      text:    'text-yellow-300',
      badge:   'border-yellow-500/30 text-yellow-400 bg-yellow-500/10',
    },
    info: {
      border:  'border-blue-500/25',
      bg:      'bg-blue-500/8',
      glow:    'shadow-[0_0_20px_rgba(59,130,246,0.1)]',
      bar:     'bg-blue-500',
      barGlow: 'shadow-[0_0_8px_rgba(59,130,246,0.8)]',
      title:   'text-blue-400',
      text:    'text-blue-300',
      badge:   'border-blue-500/30 text-blue-400 bg-blue-500/10',
    },
  }[appError.severity];

  return (
    <div className={cn(
      'relative rounded-xl border overflow-hidden',
      'transition-all duration-300',
      compact ? 'px-3 py-2' : 'px-4 py-3',
      colors.border,
      colors.bg,
      colors.glow,
    )}>

      {/* left accent bar */}
      <div className={cn(
        'absolute left-0 top-3 bottom-3 w-[3px] rounded-full',
        colors.bar, colors.barGlow,
      )} />

      <div className="ml-3">

        {/* ── Header row ───────────────────────────────────── */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex items-center gap-2">
            {/* icon */}
            <span className="text-sm">{icon}</span>

            {/* category badge */}
            <span className={cn(
              'text-[9px] font-mono font-bold uppercase',
              'tracking-widest px-2 py-0.5 rounded-full border',
              colors.badge,
            )}>
              {appError.category}
            </span>
          </div>

          {/* dismiss button */}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className={cn(
                'text-[10px] font-mono uppercase tracking-widest',
                'border px-2 py-0.5 rounded-md shrink-0',
                'transition-all duration-200',
                colors.badge,
              )}>
              ✕
            </button>
          )}
        </div>

        {/* ── Friendly message ──────────────────────────────── */}
        <p className={cn(
          'font-mono leading-relaxed',
          compact ? 'text-[11px]' : 'text-xs',
          colors.text,
        )}>
          {appError.friendly}
        </p>

        {/* ── Recovery actions ──────────────────────────────── */}
        {recovery && recovery.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {recovery.map(({ label, variant, action }) => (
              <button
                key={label}
                onClick={action}
                className={cn(
                  'text-[10px] font-mono font-bold uppercase',
                  'tracking-widest px-3 py-1.5 rounded-lg',
                  'transition-all duration-200',
                  'hover:scale-[1.03] active:scale-[0.97]',
                  variant === 'primary'
                    ? cn('border', colors.badge, 'hover:opacity-80')
                    : 'text-slate-500 hover:text-slate-300 border border-white/[0.06] hover:border-white/[0.12]',
                )}>
                {label}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ErrorMessage;