// ─── HeroStack — 3D stacked cards visual ────────────────────────────────────

const CARDS = [
  { offset: 0, rotate: 0, scale: 1, opacity: 1 },
  { offset: 1, rotate: 2, scale: 0.96, opacity: 0.7 },
  { offset: 2, rotate: 4, scale: 0.92, opacity: 0.5 },
  { offset: 3, rotate: 6, scale: 0.88, opacity: 0.3 },
];

export default function HeroStack() {
  return (
    <div style={styles.container}>
      <div style={styles.perspective}>
        {CARDS.slice().reverse().map((card, i) => (
          <div
            key={i}
            style={{
              ...styles.card,
              transform: `
                translateZ(${-card.offset * 24}px)
                translateY(${card.offset * 12}px)
                rotateX(${card.rotate}deg)
                scale(${card.scale})
              `,
              opacity: card.opacity,
              zIndex: CARDS.length - i,
            }}
          >
            <div style={styles.cardInner}>
              <div style={styles.glowBorder} />
              <div style={styles.content}>
                {i === CARDS.length - 1 && (
                  <>
                    <div style={styles.icon}>⬡</div>
                    <div style={styles.title}>QuantumVault</div>
                    <div style={styles.badges}>
                      <span style={{ ...styles.badge, background: 'rgba(99,102,241,0.18)', borderColor: 'rgba(99,102,241,0.35)', color: '#a5b4fc' }}>ECDSA</span>
                      <span style={{ ...styles.badge, background: 'rgba(139,92,246,0.18)', borderColor: 'rgba(139,92,246,0.35)', color: '#c4b5fd' }}>ML-DSA</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 0',
  },
  perspective: {
    perspective: '1000px',
    perspectiveOrigin: 'center center',
    position: 'relative',
    width: 280,
    height: 180,
    transformStyle: 'preserve-3d',
    transform: 'rotateX(15deg) rotateY(-8deg)',
  },
  card: {
    position: 'absolute',
    inset: 0,
    borderRadius: 22,
    transformStyle: 'preserve-3d',
  },
  cardInner: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: 22,
    background: 'linear-gradient(145deg, rgba(30,35,68,0.9) 0%, rgba(10,13,28,0.85) 100%)',
    backdropFilter: 'blur(20px) saturate(160%)',
    WebkitBackdropFilter: 'blur(20px) saturate(160%)',
    overflow: 'hidden',
  },
  glowBorder: {
    position: 'absolute',
    inset: 0,
    borderRadius: 22,
    padding: 1.5,
    background: 'linear-gradient(135deg, rgba(99,102,241,0.6) 0%, rgba(139,92,246,0.8) 50%, rgba(6,182,212,0.5) 100%)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    pointerEvents: 'none',
    boxShadow: '0 0 30px rgba(139,92,246,0.4), inset 0 0 20px rgba(99,102,241,0.1)',
  },
  content: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 20,
  },
  icon: {
    fontSize: 36,
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #06b6d4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #06b6d4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.02em',
  },
  badges: {
    display: 'flex',
    gap: 6,
  },
  badge: {
    padding: '3px 8px',
    borderRadius: 9999,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
    border: '1px solid',
  },
};
