// ─── Custom Cursor — Glow trail effect ───────────────────────────────────────

import { useEffect, useState, useCallback } from 'react';

interface CursorState {
  x: number;
  y: number;
  hovering: boolean;
  clicking: boolean;
}

export default function CustomCursor() {
  const [cursor, setCursor] = useState<CursorState>({ x: 0, y: 0, hovering: false, clicking: false });
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const [visible, setVisible] = useState(false);

  const updateCursor = useCallback((e: MouseEvent) => {
    setCursor(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
    setTrail(prev => [...prev.slice(-8), { x: e.clientX, y: e.clientY }]);
    setVisible(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => updateCursor(e);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button, a, input, [role="button"], .interactive');
      setCursor(prev => ({ ...prev, hovering: !!isInteractive }));
    };

    const handleMouseDown = () => setCursor(prev => ({ ...prev, clicking: true }));
    const handleMouseUp = () => setCursor(prev => ({ ...prev, clicking: false }));
    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [updateCursor]);

  if (!visible) return null;

  return (
    <>
      {/* Trail */}
      {trail.map((point, i) => (
        <div
          key={i}
          style={{
            position: 'fixed',
            left: point.x,
            top: point.y,
            width: 4 + i * 0.5,
            height: 4 + i * 0.5,
            borderRadius: '50%',
            background: `rgba(99, 102, 241, ${0.1 + i * 0.05})`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 9998,
            transition: 'opacity 0.3s',
          }}
        />
      ))}

      {/* Main cursor */}
      <div
        style={{
          position: 'fixed',
          left: cursor.x,
          top: cursor.y,
          width: cursor.hovering ? 48 : cursor.clicking ? 20 : 12,
          height: cursor.hovering ? 48 : cursor.clicking ? 20 : 12,
          borderRadius: '50%',
          border: cursor.hovering ? '2px solid rgba(99, 102, 241, 0.8)' : 'none',
          background: cursor.hovering
            ? 'rgba(99, 102, 241, 0.1)'
            : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'width 0.2s ease, height 0.2s ease, background 0.2s ease, border 0.2s ease',
          mixBlendMode: cursor.hovering ? 'normal' : 'screen',
        }}
      />

      {/* Outer glow ring */}
      <div
        style={{
          position: 'fixed',
          left: cursor.x,
          top: cursor.y,
          width: cursor.hovering ? 64 : 32,
          height: cursor.hovering ? 64 : 32,
          borderRadius: '50%',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9998,
          transition: 'width 0.3s ease, height 0.3s ease',
        }}
      />

      {/* Glow effect */}
      <div
        style={{
          position: 'fixed',
          left: cursor.x,
          top: cursor.y,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9997,
          filter: 'blur(10px)',
        }}
      />

      <style>{`
        * { cursor: none !important; }
      `}</style>
    </>
  );
}
