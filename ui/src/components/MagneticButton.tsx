// ─── Magnetic Button — Interactive button with magnetic effect ───────────────

import { useRef, useState, useCallback } from 'react';
import type { ReactNode, CSSProperties, ButtonHTMLAttributes } from 'react';

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  magnetic?: boolean;
  ripple?: boolean;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function MagneticButton({
  children,
  variant = 'primary',
  size = 'md',
  magnetic = true,
  ripple = true,
  className = '',
  style = {},
  disabled,
  onClick,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || disabled) return;
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setOffset({ x: x * 0.3, y: y * 0.3 });
  }, [magnetic, disabled]);

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // Create ripple
    if (ripple) {
      const button = buttonRef.current;
      if (button) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();

        setRipples(prev => [...prev, { id, x, y }]);
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== id));
        }, 600);
      }
    }

    onClick?.(e);
  }, [ripple, disabled, onClick]);

  const sizeStyles: Record<string, CSSProperties> = {
    sm: { padding: '8px 16px', fontSize: 13, borderRadius: 8 },
    md: { padding: '12px 24px', fontSize: 14, borderRadius: 14 },
    lg: { padding: '16px 36px', fontSize: 16, borderRadius: 16 },
  };

  const variantStyles: Record<string, CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #06b6d4 100%)',
      color: '#fff',
      border: 'none',
      boxShadow: isPressed
        ? '0 2px 8px rgba(99,102,241,0.4)'
        : '0 4px 20px rgba(99,102,241,0.4), 0 0 0 0 rgba(99,102,241,0)',
    },
    ghost: {
      background: 'rgba(255,255,255,0.04)',
      color: 'var(--clr-text-primary)',
      border: '1px solid rgba(99,131,255,0.18)',
    },
    danger: {
      background: 'rgba(239,68,68,0.15)',
      color: '#fca5a5',
      border: '1px solid rgba(239,68,68,0.3)',
    },
  };

  return (
    <button
      ref={buttonRef}
      className={`interactive ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        letterSpacing: '0.01em',
        outline: 'none',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${isPressed ? 0.97 : 1})`,
        transition: magnetic
          ? 'transform 0.15s ease-out, box-shadow 0.2s ease, background 0.2s ease'
          : 'transform 0.1s ease, box-shadow 0.2s ease, background 0.2s ease',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={handleClick}
      {...props}
    >
      {/* Content */}
      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
        {children}
      </span>

      {/* Ripples */}
      {ripples.map(r => (
        <span
          key={r.id}
          style={{
            position: 'absolute',
            left: r.x,
            top: r.y,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.4)',
            transform: 'translate(-50%, -50%)',
            animation: 'rippleExpand 0.6s ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Shine effect */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
          transform: 'translateX(-100%)',
          animation: variant === 'primary' && !disabled ? 'buttonShine 3s ease-in-out infinite' : 'none',
          pointerEvents: 'none',
        }}
      />
    </button>
  );
}
