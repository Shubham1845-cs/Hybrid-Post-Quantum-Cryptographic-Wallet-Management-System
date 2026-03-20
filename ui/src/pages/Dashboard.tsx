// ─── Dashboard page — Immersive 3D experience ─────────────────────────────────

import { useState, useCallback } from 'react';
import type { Page } from '../App';
import { useWallet, useToast } from '../context';
import { getWallet, exportWallet } from '../api';
import type { WalletExport } from '../types';
import TiltCard from '../components/TiltCard';
import Reveal from '../components/Reveal';
import MagneticButton from '../components/MagneticButton';
import AnimatedInput from '../components/AnimatedInput';
import { MouseParallax } from '../components/Parallax';
import HeroStack from '../components/HeroStack';

export default function Dashboard({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const { wallet, setWallet } = useWallet();
  const { addToast }          = useToast();
  const [lookup,    setLookup]  = useState('');
  const [loading,   setLoading]  = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportData, setExportData] = useState<WalletExport | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const copyText = useCallback(async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 1800);
    addToast('Copied to clipboard', 'success');
  }, [addToast]);

  const handleLookup = async () => {
    if (!lookup.trim()) return;
    setLoading(true);
    try {
      const w = await getWallet(lookup.trim());
      setWallet(w);
      setLookup('');
      addToast('Wallet loaded successfully', 'success');
    } catch (e: unknown) {
      addToast((e as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!wallet) return;
    setExporting(true);
    try {
      const data = await exportWallet(wallet.address);
      setExportData(data);
    } catch (e: unknown) {
      addToast((e as Error).message, 'error');
    } finally {
      setExporting(false);
    }
  };

  const downloadExport = () => {
    if (!exportData) return;
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `quantumvault-${wallet?.address?.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Wallet exported', 'success');
  };

  return (
    <main className="page-content" style={{ paddingTop: 40 }}>
      {/* Hero row */}
      <Reveal direction="up">
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 8 }}>
            {wallet ? (
              <>Your <span className="animated-gradient-text">Quantum-Safe</span> Wallet</>
            ) : (
              <>Welcome to <span className="animated-gradient-text">QuantumVault</span></>
            )}
          </h1>
          <p className="text-secondary" style={{ fontSize: 15 }}>
            {wallet
              ? 'ECDSA + ML-DSA (Dilithium) hybrid signatures — protected against quantum and classical attacks.'
              : 'A hybrid post-quantum cryptographic wallet combining ECDSA and ML-DSA (Dilithium) signatures.'}
          </p>
        </div>
      </Reveal>

      {wallet ? (
        <>
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-lg)', marginBottom: 24 }}>
            {[
              {
                label: 'Balance',
                value: wallet.balance.toFixed(4),
                sub: 'QV tokens',
                gradient: true,
              },
              {
                label: 'Nonce',
                value: wallet.nonce.toString(),
                sub: 'transactions sent',
              },
              {
                label: 'Security',
                badges: ['ECDSA P-256', 'ML-DSA 65'],
                sub: 'Hybrid signatures',
              },
            ].map((stat, i) => (
              <Reveal key={stat.label} direction="up" delay={0.1 * i}>
                <TiltCard className="glass stat-card" intensity={8}>
                  <span className="stat-label">{stat.label}</span>
                  {stat.badges ? (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                      <span className="badge badge-indigo">{stat.badges[0]}</span>
                      <span className="badge badge-violet">{stat.badges[1]}</span>
                    </div>
                  ) : (
                    <span
                      className={`stat-value ${stat.gradient ? 'animated-gradient-text' : ''}`}
                      style={{ fontSize: stat.label === 'Balance' ? 32 : 28 }}
                    >
                      {stat.value}
                    </span>
                  )}
                  <span className="stat-sub" style={{ marginTop: stat.badges ? 'auto' : 0, paddingTop: stat.badges ? 8 : 0 }}>
                    {stat.sub}
                  </span>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          {/* Address card */}
          <Reveal direction="up" delay={0.2}>
            <TiltCard className="glass" style={{ padding: 'var(--sp-lg)', marginBottom: 24 }} intensity={6}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span className="text-sm text-muted font-semibold" style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Wallet Address
                </span>
                <MagneticButton variant="ghost" size="sm" onClick={() => copyText(wallet.address, 'address')} aria-label="Copy wallet address">
                  {copied === 'address' ? '✓ Copied' : '⎘ Copy'}
                </MagneticButton>
              </div>
              <div className="hash-display">{wallet.address}</div>
            </TiltCard>
          </Reveal>

          {/* Keys */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--sp-lg)', marginBottom: 24 }}>
            {[
              { key: 'ecdsa', label: 'ECDSA', badge: 'badge-indigo', desc: 'Classical public key', value: wallet.publicKeys.ecdsa },
              { key: 'dilithium', label: 'ML-DSA', badge: 'badge-violet', desc: 'Post-quantum key', value: wallet.publicKeys.dilithium },
            ].map((k, i) => (
              <Reveal key={k.key} direction={i === 0 ? 'left' : 'right'} delay={0.3}>
                <TiltCard className="glass" style={{ padding: 'var(--sp-lg)' }} intensity={10}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div>
                      <span className={`badge ${k.badge}`}>{k.label}</span>
                      <span className="text-xs text-muted" style={{ marginLeft: 8 }}>{k.desc}</span>
                    </div>
                    <MagneticButton variant="ghost" size="sm" onClick={() => copyText(k.value, k.key)} aria-label={`Copy ${k.label} public key`}>
                      {copied === k.key ? '✓' : '⎘'}
                    </MagneticButton>
                  </div>
                  <div
                    className="hash-display"
                    style={{
                      fontSize: 11,
                      maxHeight: 80,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {k.value}
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          {/* Actions */}
          <Reveal direction="up" delay={0.4}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <MagneticButton variant="primary" onClick={() => onNavigate('send')}>↗ Send Transaction</MagneticButton>
              <MagneticButton variant="ghost" onClick={() => onNavigate('history')}>◷ Transaction History</MagneticButton>
              <MagneticButton variant="ghost" onClick={handleExport} disabled={exporting}>
                {exporting ? <><span className="spinner" /> Exporting...</> : '⬇ Export Wallet'}
              </MagneticButton>
              <MagneticButton variant="ghost" onClick={() => setShowClearConfirm(true)}>
                ✕ Clear Wallet
              </MagneticButton>
            </div>
          </Reveal>

          {/* Clear wallet confirmation dialog */}
          {showClearConfirm && (
            <Reveal direction="scale">
              <TiltCard className="glass" style={{ padding: 'var(--sp-lg)', marginTop: 24, borderColor: 'rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: 24 }}>⚠️</span>
                  <div>
                    <h3 style={{ fontWeight: 700, color: '#fca5a5' }}>Clear Wallet?</h3>
                    <p className="text-secondary text-sm">This will remove the wallet from your session. Make sure you have backed up your keys.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <MagneticButton
                    variant="ghost"
                    onClick={() => setShowClearConfirm(false)}
                  >
                    Cancel
                  </MagneticButton>
                  <MagneticButton
                    variant="ghost"
                    style={{ borderColor: 'rgba(239,68,68,0.4)', color: '#fca5a5' }}
                    onClick={() => {
                      setWallet(null);
                      setExportData(null);
                      setShowClearConfirm(false);
                      addToast('Wallet cleared', 'success');
                    }}
                  >
                    ✕ Clear Wallet
                  </MagneticButton>
                </div>
              </TiltCard>
            </Reveal>
          )}

          {/* Export data */}
          {exportData && (
            <Reveal direction="scale">
              <TiltCard className="glass" style={{ padding: 'var(--sp-lg)', marginTop: 24 }} intensity={5}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h3 style={{ fontWeight: 700 }}>Export Preview</h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <MagneticButton variant="primary" size="sm" onClick={downloadExport}>⬇ Download JSON</MagneticButton>
                    <MagneticButton variant="ghost" size="sm" onClick={() => setExportData(null)}>✕</MagneticButton>
                  </div>
                </div>
                <div className="hash-display" style={{ maxHeight: 200, overflow: 'auto', fontSize: 11 }}>
                  {JSON.stringify(exportData, null, 2)}
                </div>
              </TiltCard>
            </Reveal>
          )}
        </>
      ) : (
        /* No wallet — lookup or create */
        <div className="hero-grid-landing" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 520 }}>
            {/* Lookup */}
            <Reveal direction="up" delay={0.1}>
              <TiltCard className="glass" style={{ padding: 'var(--sp-xl)' }} intensity={8}>
                <h2 style={{ fontWeight: 700, marginBottom: 6 }}>Load existing wallet</h2>
                <p className="text-secondary text-sm" style={{ marginBottom: 20 }}>
                  Enter a wallet address to load it.
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <AnimatedInput
                      placeholder="0x..."
                      mono
                      value={lookup}
                      onChange={e => setLookup(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleLookup()}
                    />
                  </div>
                  <MagneticButton variant="primary" onClick={handleLookup} disabled={loading || !lookup.trim()}>
                    {loading ? <span className="spinner" /> : 'Load'}
                  </MagneticButton>
                </div>
              </TiltCard>
            </Reveal>

            {/* Divider */}
            <Reveal direction="fade" delay={0.15}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="divider" style={{ flex: 1, margin: 0 }} />
                <span className="text-muted text-sm">or</span>
                <div className="divider" style={{ flex: 1, margin: 0 }} />
              </div>
            </Reveal>

            {/* Create */}
            <Reveal direction="up" delay={0.2}>
              <TiltCard className="glass" style={{ padding: 'var(--sp-xl)' }} intensity={8}>
                <h2 style={{ fontWeight: 700, marginBottom: 6 }}>Create a new wallet</h2>
                <p className="text-secondary text-sm" style={{ marginBottom: 20 }}>
                  Generate a hybrid ECDSA + ML-DSA (Dilithium) key pair protected by your password.
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="badge badge-indigo">ECDSA P-256</span>
                  <span className="badge badge-violet">ML-DSA 65 (Dilithium)</span>
                  <span className="badge badge-cyan">AES-256-GCM encrypted</span>
                </div>
                <MagneticButton
                  variant="primary"
                  size="lg"
                  style={{ marginTop: 20, width: '100%' }}
                  onClick={() => onNavigate('generate')}
                >
                  ◈ Generate New Wallet
                </MagneticButton>
              </TiltCard>
            </Reveal>

            {/* Feature grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--sp-lg)' }}>
              {[
                { icon: '🔐', title: 'Post-Quantum Security', desc: 'ML-DSA-65 (CRYSTALS-Dilithium) resists quantum computer attacks.' },
                { icon: '⚡', title: 'Hybrid Signatures', desc: 'Both ECDSA and Dilithium signatures required — defence-in-depth.' },
                { icon: '🔒', title: 'Encrypted Storage', desc: 'Private keys encrypted with AES-256-GCM using PBKDF2 password.' },
                { icon: '✓',  title: 'On-chain Verification', desc: 'Verify transaction integrity using both signature schemes.' },
              ].map((f, i) => (
                <Reveal key={f.title} direction="up" delay={0.3 + i * 0.05}>
                  <TiltCard className="glass" style={{ padding: 'var(--sp-lg)' }} intensity={12}>
                    <div style={{ fontSize: 28, marginBottom: 8, animation: 'float 3s ease-in-out infinite', animationDelay: `${i * 0.2}s` }}>
                      {f.icon}
                    </div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{f.title}</div>
                    <div className="text-secondary text-sm">{f.desc}</div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>

          {/* 3D Hero Stack */}
          <div className="hero-stack-desktop" style={{ position: 'sticky', top: 120 }}>
            <Reveal direction="right" delay={0.3}>
              <MouseParallax intensity={25}>
                <HeroStack />
              </MouseParallax>
            </Reveal>
          </div>
        </div>
      )}
    </main>
  );
}
