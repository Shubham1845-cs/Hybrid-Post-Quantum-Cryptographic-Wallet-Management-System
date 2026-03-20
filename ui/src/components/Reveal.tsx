// ─── Reveal — Scroll-triggered entrance animations ───────────────────────────

import { useRef, useEffect, useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';

interface RevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  className?: string;
  style?: CSSProperties;
  once?: boolean;
}

const getInitialTransform = (direction: RevealDirection, distance: number): string => {
  switch (direction) {
    case 'up': return `translateY(${distance}px)`;
    case 'down': return `translateY(-${distance}px)`;
    case 'left': return `translateX(${distance}px)`;
    case 'right': return `translateX(-${distance}px)`;
    case 'scale': return 'scale(0.8)';
    case 'fade': return 'none';
    default: return `translateY(${distance}px)`;
  }
};

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  distance = 60,
  threshold = 0.1,
  className = '',
  style = {},
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : getInitialTransform(direction, distance),
        transition: `opacity ${duration}s cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}s, transform ${duration}s cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

// Stagger children animation wrapper
interface StaggerProps {
  children: ReactNode[];
  staggerDelay?: number;
  direction?: RevealDirection;
  className?: string;
  style?: CSSProperties;
}

export function Stagger({
  children,
  staggerDelay = 0.1,
  direction = 'up',
  className = '',
  style = {},
}: StaggerProps) {
  return (
    <div className={className} style={style}>
      {children.map((child, i) => (
        <Reveal key={i} direction={direction} delay={i * staggerDelay}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
