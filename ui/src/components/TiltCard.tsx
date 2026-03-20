// ─── Tilt Card — 3D mouse-tracking effect ────────────────────────────────────

import { useRef, useState, useCallback } from 'react';
import type { ReactNode, CSSProperties } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  intensity?: number;
  glare?: boolean;
  scale?: number;
}

export default function TiltCard({
  children,
  className = '',
  style = {},
  intensity = 15,
  glare = true,
  scale = 1.02,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTransform({ rotateX, rotateY, glareX, glareY });
  }, [intensity]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTransform({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`tilt-card interactive ${className}`}
      style={{
        ...style,
        transform: isHovered
          ? `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${scale})`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
        transition: isHovered
          ? 'transform 0.1s ease-out'
          : 'transform 0.5s ease-out',
        transformStyle: 'preserve-3d',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {/* Glare overlay */}
      {glare && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: `radial-gradient(circle at ${transform.glareX}% ${transform.glareY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Border glow */}
      <div
        style={{
          position: 'absolute',
          inset: -1,
          borderRadius: 'inherit',
          background: `linear-gradient(${135 + transform.rotateY * 2}deg, rgba(99,102,241,${isHovered ? 0.6 : 0.2}), rgba(139,92,246,${isHovered ? 0.6 : 0.2}), rgba(6,182,212,${isHovered ? 0.4 : 0.1}))`,
          zIndex: -1,
          filter: isHovered ? 'blur(8px)' : 'blur(0px)',
          transition: 'filter 0.3s ease, background 0.3s ease',
        }}
      />
    </div>
  );
}
