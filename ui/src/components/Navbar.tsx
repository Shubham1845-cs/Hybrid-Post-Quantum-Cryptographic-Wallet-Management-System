// ─── Navbar ───────────────────────────────────────────────────────────────────

import type { Page } from '../App';
import { useWallet } from '../context';

interface NavItem { id: Page; label: string; icon: string; }

const ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard',  icon: '⬡' },
  { id: 'generate',  label: 'New Wallet', icon: '◈' },
  { id: 'send',      label: 'Send',       icon: '↗' },
  { id: 'history',   label: 'History',    icon: '◷' },
  { id: 'verify',    label: 'Verify',     icon: '✔' },
];

export default function Navbar({
  currentPage,
  onNavigate,
}: {
  currentPage: Page;
  onNavigate:  (p: Page) => void;
}) {
  const { wallet } = useWallet();

  return (
    <nav style={styles.nav}>
      {/* Brand */}
      <div style={styles.brand} onClick={() => onNavigate('dashboard')}>
        <span style={styles.brandIcon}>⬡</span>
        <span>
          <span className="gradient-text font-bold" style={{ fontSize: 17 }}>
            QuantumVault
          </span>
          <span style={{ fontSize: 10, color: 'var(--clr-text-muted)', display: 'block', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: -2 }}>
            Hybrid PQC Wallet
          </span>
        </span>
      </div>

      {/* Nav links */}
      <div style={styles.links}>
        {ITEMS.map(item => (
          <button
            key={item.id}
            className="btn btn-ghost btn-sm"
            style={{
              ...(currentPage === item.id ? styles.activeLink : styles.link),
            }}
            onClick={() => onNavigate(item.id)}
          >
            <span style={{ fontSize: 15 }}>{item.icon}</span>
            <span className="font-medium" style={{ fontSize: 13 }}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Wallet pill */}
      {wallet ? (
        <div className="badge badge-indigo" style={{ maxWidth: 180 }}>
          <span style={{ fontSize: 10, opacity: 0.7 }}>◉</span>
          <span className="truncate font-mono" style={{ fontSize: 11 }}>
            {wallet.address.slice(0, 8)}…{wallet.address.slice(-6)}
          </span>
        </div>
      ) : (
        <button
          className="btn btn-primary btn-sm"
          onClick={() => onNavigate('generate')}
        >
          + New Wallet
        </button>
      )}
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    position:       'sticky',
    top:            0,
    zIndex:         100,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    gap:            16,
    padding:        '12px 32px',
    background:     'rgba(6,8,17,0.8)',
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    borderBottom:   '1px solid var(--clr-border)',
  },
  brand: {
    display:     'flex',
    alignItems:  'center',
    gap:         10,
    cursor:      'pointer',
    userSelect:  'none',
    flexShrink:  0,
  },
  brandIcon: {
    fontSize:   28,
    background: 'var(--grad-brand)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor:  'transparent',
    backgroundClip: 'text',
    lineHeight: 1,
  },
  links: {
    display:    'flex',
    alignItems: 'center',
    gap:        4,
  },
  link: {
    background:   'transparent',
    border:       '1px solid transparent',
    color:        'var(--clr-text-secondary)',
  },
  activeLink: {
    background:   'rgba(99,102,241,0.12)',
    border:       '1px solid rgba(99,102,241,0.3)',
    color:        'var(--clr-text-primary)',
  },
};
