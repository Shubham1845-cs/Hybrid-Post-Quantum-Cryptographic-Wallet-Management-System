// ─── Animated Input — Focus/hover micro-interactions ─────────────────────────

import { useState, useRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  mono?: boolean;
}

export default function AnimatedInput({
  label,
  error,
  mono = false,
  className = '',
  onFocus,
  onBlur,
  ...props
}: AnimatedInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPosition({ x, y });
  };

  return (
    <div className="form-group" style={{ position: 'relative' }}>
      {label && (
        <label
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: isFocused ? 'var(--clr-accent-1)' : 'var(--clr-text-secondary)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 6,
            display: 'block',
            transition: 'color 0.2s ease',
          }}
        >
          {label}
        </label>
      )}

      <div
        style={{ position: 'relative' }}
        onMouseMove={handleMouseMove}
      >
        {/* Glow effect */}
        <div
          style={{
            position: 'absolute',
            inset: -2,
            borderRadius: 10,
            background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(99,102,241,${isFocused ? 0.4 : 0.15}) 0%, transparent 60%)`,
            opacity: isFocused ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }}
        />

        {/* Border glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 8,
            border: `2px solid ${error ? 'var(--clr-danger)' : isFocused ? 'var(--clr-accent-1)' : 'transparent'}`,
            boxShadow: isFocused && !error
              ? '0 0 20px rgba(99,102,241,0.3), 0 0 40px rgba(99,102,241,0.1)'
              : 'none',
            transition: 'all 0.3s ease',
            pointerEvents: 'none',
          }}
        />

        <input
          ref={inputRef}
          className={`interactive ${className}`}
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${error ? 'var(--clr-danger)' : 'rgba(99, 131, 255, 0.18)'}`,
            borderRadius: 8,
            color: 'var(--clr-text-primary)',
            fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
            fontSize: mono ? 13 : 14,
            padding: '12px 14px',
            outline: 'none',
            transition: 'border-color 0.2s ease, background 0.2s ease',
          }}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />

        {/* Focus line animation */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            width: isFocused ? '100%' : '0%',
            height: 2,
            background: 'linear-gradient(90deg, transparent, var(--clr-accent-1), var(--clr-accent-2), var(--clr-accent-1), transparent)',
            transform: 'translateX(-50%)',
            borderRadius: '0 0 8px 8px',
            transition: 'width 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Error message */}
      {error && (
        <span
          style={{
            fontSize: 12,
            color: 'var(--clr-danger)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginTop: 6,
            animation: 'shakeX 0.4s ease',
          }}
        >
          ⚠ {error}
        </span>
      )}
    </div>
  );
}
