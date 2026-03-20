// ─── Page Loader — 3D animated intro ─────────────────────────────────────────

import { useState, useEffect } from 'react';

export default function PageLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'revealing' | 'done'>('loading');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setPhase('revealing');
          setTimeout(() => {
            setPhase('done');
            onComplete();
          }, 800);
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div style={{
      ...styles.container,
      opacity: phase === 'revealing' ? 0 : 1,
      transform: phase === 'revealing' ? 'scale(1.1)' : 'scale(1)',
    }}>
      {/* Animated rings */}
      <div style={styles.rings}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              ...styles.ring,
              width: 120 + i * 60,
              height: 120 + i * 60,
              animationDelay: `${i * 0.2}s`,
              borderColor: `rgba(${99 + i * 20}, ${102 + i * 40}, 241, ${0.6 - i * 0.15})`,
            }}
          />
        ))}

        {/* Core orb */}
        <div style={styles.orb}>
          <div style={styles.orbInner} />
          <div style={styles.orbGlow} />
        </div>
      </div>

      {/* Logo */}
      <div style={styles.logo}>
        <span style={styles.logoIcon}>⬡</span>
        <span style={styles.logoText}>QuantumVault</span>
      </div>

      {/* Progress */}
      <div style={styles.progressContainer}>
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${Math.min(progress, 100)}%` }} />
        </div>
        <span style={styles.progressText}>{Math.min(Math.round(progress), 100)}%</span>
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          style={{
            ...styles.particle,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 2}s`,
            width: 2 + Math.random() * 4,
            height: 2 + Math.random() * 4,
          }}
        />
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #060811 0%, #0a0d1c 50%, #0d1024 100%)',
    transition: 'opacity 0.8s ease, transform 0.8s ease',
  },
  rings: {
    position: 'relative',
    width: 240,
    height: 240,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  ring: {
    position: 'absolute',
    borderRadius: '50%',
    border: '2px solid',
    animation: 'loaderSpin 4s linear infinite, loaderPulse 2s ease-in-out infinite',
  },
  orb: {
    position: 'relative',
    width: 60,
    height: 60,
  },
  orbInner: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
    animation: 'loaderPulse 1.5s ease-in-out infinite',
  },
  orbGlow: {
    position: 'absolute',
    inset: -20,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
    animation: 'loaderGlow 2s ease-in-out infinite',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  logoIcon: {
    fontSize: 32,
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #06b6d4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'loaderFloat 3s ease-in-out infinite',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 700,
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #06b6d4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em',
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    width: 200,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 9999,
    background: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 9999,
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
    transition: 'width 0.2s ease',
  },
  progressText: {
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: 'var(--font-mono)',
    width: 36,
  },
  particle: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(99,102,241,0.6)',
    animation: 'particleFloat 4s ease-in-out infinite',
    pointerEvents: 'none',
  },
};
