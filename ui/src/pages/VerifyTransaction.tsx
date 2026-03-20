// ─── Verify Transaction page ──────────────────────────────────────────────────

import { useState } from 'react';
import type { Page } from '../App';
import { useToast } from '../context';
import { verifyTransaction } from '../api';
import type { VerifyResult } from '../types';
import TiltCard from '../components/TiltCard';
import MagneticButton from '../components/MagneticButton';
import AnimatedInput from '../components/AnimatedInput';
import Reveal from '../components/Reveal';

export default function VerifyTransaction({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const { addToast } = useToast();
  const [txId,    setTxId]    = useState('');
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<VerifyResult | null>(null);
  const [error,   setError]   = useState('');

  const handleVerify = async () => {
    const id = txId.trim();
    if (!id) { setError('Please enter a Transaction ID'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await verifyTransaction(id);
      setResult(res);
      addToast(res.valid ? 'Transaction verified ✓' : 'Verification failed', res.valid ? 'success' : 'error');
    } catch (e: unknown) {
      const msg = (e as Error).message;
      addToast(msg, 'error');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const SigBadge = ({ label, valid }: { label: string; valid: boolean }) => (
    <TiltCard className="glass" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{
        width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: valid ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
        color: valid ? '#6ee7b7' : '#fca5a5', fontWeight: 700, fontSize: 14, flexShrink: 0,
      }}>
        {valid ? '✓' : '✕'}
      </span>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{label}</div>
        <div className="text-xs" style={{ color: valid ? '#6ee7b7' : '#fca5a5', marginTop: 2 }}>
          {valid ? 'Signature valid' : 'Signature invalid'}
        </div>
      </div>
    </TiltCard>
  );

  return (
    <main className="page-content" style={{ paddingTop: 40 }}>
      <div style={{ maxWidth: 560 }}>
        <Reveal direction="up" delay={0.1}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
              Verify <span className="animated-gradient-text">Transaction</span>
            </h1>
            <p className="text-secondary">
              Independently verify a transaction's hybrid ECDSA + ML-DSA signatures.
            </p>
          </div>
        </Reveal>

        {/* Input card */}
        <Reveal direction="up" delay={0.2}>
          <TiltCard className="glass" style={{ padding: 'var(--sp-xl)', marginBottom: 24 }}>
            <div className="form-group">
              <AnimatedInput
                id="txid"
                label="Transaction ID"
                placeholder="Enter transaction ID"
                value={txId}
                onChange={e => { setTxId(e.target.value); setError(''); setResult(null); }}
                onKeyDown={e => e.key === 'Enter' && handleVerify()}
                className={error ? 'input-error' : ''}
              />
              {error && <span className="field-error">⚠ {error}</span>}
            </div>
            <div style={{ marginTop: 16 }}>
              <MagneticButton
                style={{ width: '100%' }}
                onClick={handleVerify}
                disabled={loading || !txId.trim()}
              >
                {loading ? <><span className="spinner" /> Verifying…</> : '✔ Verify Signatures'}
              </MagneticButton>
            </div>
          </TiltCard>
        </Reveal>

        {/* Result */}
        {result && (
          <Reveal direction="up" delay={0.1}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Overall status */}
              <TiltCard
                className="glass"
                style={{
                  padding: 'var(--sp-lg)',
                  borderColor: result.valid ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)',
                  background: result.valid ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 36 }}>{result.valid ? '✅' : '❌'}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: result.valid ? '#6ee7b7' : '#fca5a5', marginBottom: 4 }}>
                      {result.valid ? 'Transaction Valid' : 'Transaction Invalid'}
                    </div>
                    <div className="text-secondary text-sm">
                      {result.valid
                        ? 'Both ECDSA and ML-DSA signatures verified successfully.'
                        : 'One or more signatures failed verification.'}
                    </div>
                  </div>
                </div>
              </TiltCard>

              {/* Individual signatures */}
              {result.signatures && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 14, color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                    Signature Checks
                  </h3>
                  <SigBadge label="ECDSA P-256"   valid={result.signatures.ecdsa} />
                  <SigBadge label="ML-DSA-65 (Dilithium)" valid={result.signatures.dilithium} />
                </div>
              )}

              {/* TX Details */}
              {result.transaction && (
                <TiltCard className="glass" style={{ padding: 'var(--sp-lg)' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Transaction Details</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {([
                      ['Amount',    `${result.transaction.amount} QV`],
                      ['Nonce',     result.transaction.nonce],
                      ['Sender',    result.transaction.sender],
                      ['Recipient', result.transaction.recipient],
                    ] as const).map(([label, value]) => (
                      <div key={label} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        <span className="text-xs text-muted" style={{ width: 80, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.08em', paddingTop: 2 }}>
                          {label}
                        </span>
                        <span className="font-mono" style={{ fontSize: 12, wordBreak: 'break-all', flex: 1 }}>
                          {String(value ?? '—')}
                        </span>
                      </div>
                    ))}
                  </div>
                </TiltCard>
              )}

              {/* Reset */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <MagneticButton variant="ghost" onClick={() => { setResult(null); setTxId(''); }}>
                  ↺ Verify Another
                </MagneticButton>
                <MagneticButton variant="ghost" onClick={() => onNavigate('history')}>
                  ◷ Transaction History
                </MagneticButton>
              </div>
            </div>
          </Reveal>
        )}

        {/* Explainer card */}
        {!result && !loading && (
          <Reveal direction="up" delay={0.3}>
            <TiltCard className="glass" style={{ padding: 'var(--sp-lg)', marginTop: 24 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>How verification works</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: '📋', title: 'Fetch TX', desc: 'Retrieves the signed transaction from the ledger.' },
                  { icon: '🔑', title: 'ECDSA check', desc: "Verifies the classical signature against the sender's public key." },
                  { icon: '⚛',  title: 'ML-DSA check', desc: 'Verifies the post-quantum Dilithium signature independently.' },
                  { icon: '✔',  title: 'Consensus', desc: 'Both signatures must pass for the TX to be considered valid.' },
                ].map(s => (
                  <div key={s.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 20, width: 24, flexShrink: 0 }}>{s.icon}</span>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{s.title} — </span>
                      <span className="text-secondary text-sm">{s.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TiltCard>
          </Reveal>
        )}
      </div>
    </main>
  );
}
