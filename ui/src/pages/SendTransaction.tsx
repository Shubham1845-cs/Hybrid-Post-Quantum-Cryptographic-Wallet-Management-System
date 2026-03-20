// ─── Send Transaction page — Immersive 3D experience ──────────────────────────

import { useState } from 'react';
import type { Page } from '../App';
import { useWallet, useToast } from '../context';
import { createTransaction } from '../api';
import type { Transaction } from '../types';
import TiltCard from '../components/TiltCard';
import Reveal from '../components/Reveal';
import MagneticButton from '../components/MagneticButton';
import AnimatedInput from '../components/AnimatedInput';

export default function SendTransaction({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const { wallet } = useWallet();
  const { addToast } = useToast();

  const [form, setForm] = useState({ recipient: '', amount: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ txId: string; tx: Transaction } | null>(null);
  const [copied, setCopied] = useState(false);

  const set = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!wallet) e.sender = 'No wallet loaded — go to Dashboard first';
    if (!form.recipient.trim()) e.recipient = 'Recipient address is required';
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) e.amount = 'Enter a valid positive amount';
    if (wallet && amt > wallet.balance) e.amount = `Insufficient balance (${wallet.balance.toFixed(4)} QV)`;
    if (!form.password) e.password = 'Password is required to sign the transaction';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = async () => {
    if (!validate() || !wallet) return;
    setLoading(true);
    try {
      const res = await createTransaction({
        sender:    wallet.address,
        recipient: form.recipient.trim(),
        amount:    parseFloat(form.amount),
        password:  form.password,
      });
      setResult({ txId: res.txId, tx: res.Transaction });
      addToast('Transaction submitted successfully', 'success');
    } catch (e: unknown) {
      addToast((e as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyTxId = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.txId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('TX ID copied', 'success');
  };

  if (!wallet) {
    return (
      <main className="page-content" style={{ paddingTop: 40 }}>
        <Reveal direction="scale">
          <TiltCard className="glass" style={{ padding: 'var(--sp-xl)', maxWidth: 500, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>↗</div>
            <h2 style={{ fontWeight: 700, marginBottom: 8 }}>No Wallet Loaded</h2>
            <p className="text-secondary" style={{ marginBottom: 20 }}>
              Load or generate a wallet first to send transactions.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <MagneticButton variant="primary" onClick={() => onNavigate('dashboard')}>Load Wallet</MagneticButton>
              <MagneticButton variant="ghost" onClick={() => onNavigate('generate')}>Generate Wallet</MagneticButton>
            </div>
          </TiltCard>
        </Reveal>
      </main>
    );
  }

  if (result) {
    return (
      <main className="page-content" style={{ paddingTop: 40 }}>
        <div style={{ maxWidth: 560 }}>
          <Reveal direction="scale">
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 40, marginBottom: 12, animation: 'float 3s ease-in-out infinite' }}>✅</div>
              <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
                Transaction <span className="animated-gradient-text">Submitted</span>
              </h1>
              <p className="text-secondary">Signed with both ECDSA and ML-DSA signatures.</p>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.1}>
            <TiltCard className="glass" style={{ padding: 'var(--sp-lg)', marginBottom: 20 }} intensity={8}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span className="text-xs text-muted" style={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>Transaction ID</span>
                <MagneticButton variant="ghost" size="sm" onClick={copyTxId}>
                  {copied ? '✓ Copied' : '⎘ Copy'}
                </MagneticButton>
              </div>
              <div className="hash-display">{result.txId}</div>
            </TiltCard>
          </Reveal>

          <Reveal direction="up" delay={0.2}>
            <TiltCard className="glass" style={{ padding: 'var(--sp-lg)', marginBottom: 24 }} intensity={6}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {([
                  ['Amount', `${result.tx.amount} QV`],
                  ['Nonce',  result.tx.nonce],
                  ['Sender',    result.tx.sender?.slice(0, 16) + '...'],
                  ['Recipient', result.tx.recipient?.slice(0, 16) + '...'],
                ] as const).map(([label, value]) => (
                  <div key={label}>
                    <span className="text-xs text-muted" style={{ letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>{label}</span>
                    <span className="font-mono" style={{ fontSize: 13 }}>{String(value)}</span>
                  </div>
                ))}
              </div>
            </TiltCard>
          </Reveal>

          <Reveal direction="up" delay={0.3}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <MagneticButton variant="primary" onClick={() => { setResult(null); setForm({ recipient: '', amount: '', password: '' }); }}>
                ↗ Send Another
              </MagneticButton>
              <MagneticButton variant="ghost" onClick={() => onNavigate('verify')}>✔ Verify TX</MagneticButton>
              <MagneticButton variant="ghost" onClick={() => onNavigate('history')}>◷ History</MagneticButton>
            </div>
          </Reveal>
        </div>
      </main>
    );
  }

  return (
    <main className="page-content" style={{ paddingTop: 40 }}>
      <div style={{ maxWidth: 540 }}>
        <Reveal direction="up">
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
              Send <span className="animated-gradient-text">Transaction</span>
            </h1>
            <p className="text-secondary">
              Signs with both ECDSA + ML-DSA (Dilithium). Balance:{' '}
              <strong style={{ color: 'var(--clr-text-primary)' }}>{wallet.balance.toFixed(4)} QV</strong>
            </p>
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.1}>
          <TiltCard className="glass" style={{ padding: 'var(--sp-xl)' }} intensity={8}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Sender (read-only) */}
              <div className="form-group">
                <label style={{ color: 'var(--clr-text-secondary)' }}>Sender</label>
                <div className="hash-display" style={{ fontSize: 12 }}>{wallet.address}</div>
              </div>

              {/* Recipient */}
              <AnimatedInput
                label="Recipient Address"
                placeholder="0x..."
                mono
                value={form.recipient}
                error={errors.recipient}
                onChange={e => set('recipient', e.target.value)}
              />

              {/* Amount */}
              <AnimatedInput
                label="Amount (QV)"
                type="number"
                placeholder="0.0000"
                value={form.amount}
                error={errors.amount}
                onChange={e => set('amount', e.target.value)}
              />

              {/* Password */}
              <AnimatedInput
                label="Signing Password"
                type="password"
                placeholder="Your wallet password"
                value={form.password}
                error={errors.password}
                onChange={e => set('password', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />

              {/* Sig badges */}
              <div style={{ display: 'flex', gap: 8, padding: '12px 0', borderTop: '1px solid var(--clr-border)' }}>
                <span className="badge badge-indigo">ECDSA Signature</span>
                <span className="badge badge-violet">ML-DSA Signature</span>
              </div>

              <MagneticButton
                variant="primary"
                size="lg"
                style={{ width: '100%' }}
                onClick={handleSend}
                disabled={loading}
              >
                {loading
                  ? <><span className="spinner" /> Signing & Broadcasting...</>
                  : '↗ Sign & Send Transaction'}
              </MagneticButton>
            </div>
          </TiltCard>
        </Reveal>
      </div>
    </main>
  );
}
