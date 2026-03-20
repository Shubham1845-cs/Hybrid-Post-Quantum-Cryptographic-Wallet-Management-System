// ─── Transaction History page ─────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import type { Page } from '../App';
import { useWallet, useToast } from '../context';
import { getTransactionHistory } from '../api';
import type { Transaction } from '../types';
import TiltCard from '../components/TiltCard';
import MagneticButton from '../components/MagneticButton';
import Reveal from '../components/Reveal';

export default function TransactionHistory({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const { wallet } = useWallet();
  const { addToast } = useToast();
  const [txs, setTxs]     = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded]   = useState(false);
  const [filter, setFilter]   = useState<'all' | 'received' | 'sent'>('all');

  const loadHistory = async () => {
    if (!wallet) return;
    setLoading(true);
    try {
      const res = await getTransactionHistory(wallet.address);
      setTxs(res.transactions);
      setLoaded(true);
    } catch (e: unknown) {
      addToast((e as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wallet && !loaded) loadHistory();
  }, [wallet]);

  if (!wallet) {
    return (
      <main className="page-content" style={{ paddingTop: 40 }}>
        <Reveal direction="up" delay={0.1}>
          <TiltCard className="glass" style={{ padding: 'var(--sp-xl)', maxWidth: 500, textAlign: 'center', margin: '0 auto' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>◷</div>
            <h2 style={{ fontWeight: 700, marginBottom: 8 }}>No Wallet Loaded</h2>
            <p className="text-secondary" style={{ marginBottom: 20 }}>Load a wallet to view its transaction history.</p>
            <MagneticButton onClick={() => onNavigate('dashboard')}>Load Wallet</MagneticButton>
          </TiltCard>
        </Reveal>
      </main>
    );
  }

  const filtered = txs.filter(tx => {
    if (filter === 'received') return tx.recipient === wallet.address;
    if (filter === 'sent')     return tx.sender    === wallet.address;
    return true;
  });

  const totalReceived = txs.filter(tx => tx.recipient === wallet.address).reduce((s, tx) => s + tx.amount, 0);
  const totalSent     = txs.filter(tx => tx.sender    === wallet.address).reduce((s, tx) => s + tx.amount, 0);

  return (
    <main className="page-content" style={{ paddingTop: 40 }}>
      <Reveal direction="up" delay={0.1}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
            Transaction <span className="animated-gradient-text">History</span>
          </h1>
          <p className="text-secondary text-sm font-mono">{wallet.address}</p>
        </div>
      </Reveal>

      {/* Summary stats */}
      {loaded && (
        <Reveal direction="up" delay={0.2}>
          <div className="grid-3" style={{ marginBottom: 24 }}>
            <TiltCard className="glass stat-card">
              <span className="stat-label">Total TXs</span>
              <span className="stat-value" style={{ fontSize: 28 }}>{txs.length}</span>
            </TiltCard>
            <TiltCard className="glass stat-card">
              <span className="stat-label">Received</span>
              <span className="stat-value" style={{ fontSize: 22, color: '#6ee7b7' }}>+{totalReceived.toFixed(4)}</span>
              <span className="stat-sub">QV</span>
            </TiltCard>
            <TiltCard className="glass stat-card">
              <span className="stat-label">Sent</span>
              <span className="stat-value" style={{ fontSize: 22, color: '#fca5a5' }}>-{totalSent.toFixed(4)}</span>
              <span className="stat-sub">QV</span>
            </TiltCard>
          </div>
        </Reveal>
      )}

      {/* Controls */}
      <Reveal direction="up" delay={0.3}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 'received', 'sent'] as const).map(f => (
              <button
                key={f}
                className="btn btn-sm interactive"
                aria-pressed={filter === f}
                style={filter === f
                  ? { background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)', color: 'var(--clr-text-primary)' }
                  : { background: 'transparent', border: '1px solid transparent', color: 'var(--clr-text-muted)' }
                }
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <MagneticButton
            variant="ghost"
            size="sm"
            onClick={loadHistory}
            disabled={loading}
          >
            {loading ? <><span className="spinner" /> Loading…</> : '↻ Refresh'}
          </MagneticButton>
        </div>
      </Reveal>

      {/* Transaction list */}
      {loading && !loaded ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 40 }}>
          <span className="spinner spinner-lg" />
          <span className="text-secondary">Loading transactions…</span>
        </div>
      ) : filtered.length === 0 ? (
        <Reveal direction="up" delay={0.2}>
          <TiltCard className="glass" style={{ padding: 'var(--sp-xl)', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <h3 style={{ fontWeight: 700, marginBottom: 6 }}>No Transactions</h3>
            <p className="text-secondary text-sm">
              {filter === 'all'
                ? 'No transactions found for this wallet.'
                : `No ${filter} transactions found.`}
            </p>
            {filter === 'all' && (
              <div style={{ marginTop: 16 }}>
                <MagneticButton onClick={() => onNavigate('send')}>
                  Send First Transaction
                </MagneticButton>
              </div>
            )}
          </TiltCard>
        </Reveal>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((tx, i) => {
            const isSent     = tx.sender    === wallet.address;
            const isReceived = tx.recipient === wallet.address;
            const direction  = isSent ? 'sent' : isReceived ? 'received' : 'other';
            const dirIcon    = direction === 'sent' ? '↗' : direction === 'received' ? '↙' : '↔';
            const amtColor   = direction === 'received' ? '#6ee7b7' : '#fca5a5';
            const amtPrefix  = direction === 'received' ? '+' : '-';

            return (
              <Reveal key={tx.txId ?? i} direction="up" delay={0.1 + i * 0.05}>
                <TiltCard
                  className="glass glass-hover"
                  style={{ padding: 'var(--sp-lg)', display: 'flex', alignItems: 'center', gap: 16 }}
                >
                  {/* Direction icon */}
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    background: direction === 'received' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                    fontSize: 18, color: direction === 'received' ? '#6ee7b7' : '#fca5a5',
                  }}>
                    {dirIcon}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>
                          {direction === 'sent' ? 'Sent to' : 'Received from'}
                        </span>
                        <span className="font-mono text-muted" style={{ fontSize: 12, marginLeft: 8 }}>
                          {direction === 'sent'
                            ? `${tx.recipient?.slice(0, 8)}…${tx.recipient?.slice(-6)}`
                            : `${tx.sender?.slice(0, 8)}…${tx.sender?.slice(-6)}`}
                        </span>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 16, color: amtColor }}>
                        {amtPrefix}{tx.amount.toFixed(4)} QV
                      </span>
                    </div>

                    {tx.txId && (
                      <div className="font-mono text-muted" style={{ fontSize: 11, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {tx.txId}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                      {tx.nonce !== undefined && (
                        <span className="badge" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--clr-border)', fontSize: 10 }}>
                          nonce #{tx.nonce}
                        </span>
                      )}
                      {tx.signatures && (
                        <>
                          <span className="badge badge-indigo" style={{ fontSize: 10 }}>ECDSA ✓</span>
                          <span className="badge badge-violet" style={{ fontSize: 10 }}>ML-DSA ✓</span>
                        </>
                      )}
                      <button
                        className="badge interactive"
                        style={{ background: 'transparent', border: '1px solid var(--clr-border)', cursor: 'pointer', fontSize: 10, color: 'var(--clr-text-muted)' }}
                        onClick={() => { onNavigate('verify'); }}
                        aria-label={`Verify transaction ${tx.txId}`}
                      >
                        ✔ Verify
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      )}

      {/* Bottom action */}
      {loaded && txs.length > 0 && (
        <Reveal direction="up" delay={0.4}>
          <div style={{ marginTop: 24 }}>
            <MagneticButton variant="ghost" onClick={() => onNavigate('send')}>
              ↗ Send Transaction
            </MagneticButton>
          </div>
        </Reveal>
      )}
    </main>
  );
}
