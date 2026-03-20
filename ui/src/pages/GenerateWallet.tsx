// ─── Generate Wallet page — Immersive 3D experience ───────────────────────────

import { useState } from 'react';
import type { Page } from '../App';
import { useWallet, useToast } from '../context';
import { generateWallet } from '../api';
import TiltCard from '../components/TiltCard';
import Reveal from '../components/Reveal';
import MagneticButton from '../components/MagneticButton';
import AnimatedInput from '../components/AnimatedInput';
import { MouseParallax } from '../components/Parallax';

type Step = 'form' | 'loading' | 'success';

export default function GenerateWallet({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const { setWallet } = useWallet();
  const { addToast }  = useToast();

  const [step,     setStep]     = useState<Step>('form');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [address,  setAddress]  = useState('');
  const [copied,   setCopied]   = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters';
    if (password !== confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGenerate = async () => {
    if (!validate()) return;
    setStep('loading');
    try {
      const wallet = await generateWallet(password);
      setWallet(wallet);
      setAddress(wallet.address);
      setStep('success');
    } catch (e: unknown) {
      addToast((e as Error).message, 'error');
      setStep('form');
    }
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('Address copied', 'success');
  };

  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8)  s++;
    if (password.length >= 14) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#eab308', '#10b981', '#06b6d4'][strength];

  if (step === 'loading') {
    return (
      <main className="page-content" style={{ paddingTop: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 24 }}>
          {/* Animated loading orb */}
          <MouseParallax intensity={15}>
            <div style={{ position: 'relative', width: 120, height: 120 }}>
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    inset: i * 15,
                    border: '2px solid',
                    borderColor: `rgba(${99 + i * 20}, ${102 + i * 40}, 241, ${0.6 - i * 0.15})`,
                    borderRadius: '50%',
                    animation: `loaderSpin ${3 + i}s linear infinite ${i === 1 ? 'reverse' : ''}`,
                  }}
                />
              ))}
              <div
                style={{
                  position: 'absolute',
                  inset: 35,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
                  animation: 'loaderPulse 1.5s ease-in-out infinite',
                  boxShadow: '0 0 40px rgba(99,102,241,0.5)',
                }}
              />
            </div>
          </MouseParallax>

          <Reveal direction="up" delay={0.2}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontWeight: 700, marginBottom: 8 }} className="animated-gradient-text">
                Generating Your Wallet
              </h2>
              <p className="text-secondary">
                Creating ECDSA P-256 and ML-DSA-65 key pairs...
              </p>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.4}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <span className="badge badge-indigo">ECDSA P-256</span>
              <span className="badge badge-violet">ML-DSA-65</span>
              <span className="badge badge-cyan">AES-256-GCM</span>
            </div>
          </Reveal>
        </div>
      </main>
    );
  }

  if (step === 'success') {
    return (
      <main className="page-content" style={{ paddingTop: 40 }}>
        <div style={{ maxWidth: 560 }}>
          <Reveal direction="scale">
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 48, marginBottom: 12, animation: 'float 3s ease-in-out infinite' }}>🎉</div>
              <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
                <span className="animated-gradient-text">Wallet Created!</span>
              </h1>
              <p className="text-secondary">
                Your hybrid ECDSA + ML-DSA wallet is ready. Save your address and never share your password.
              </p>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.1}>
            <TiltCard
              className="glass"
              style={{ padding: 'var(--sp-lg)', marginBottom: 20 }}
              intensity={8}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span className="text-xs text-muted" style={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>Your Address</span>
                <MagneticButton variant="ghost" size="sm" onClick={copyAddress}>
                  {copied ? '✓ Copied' : '⎘ Copy'}
                </MagneticButton>
              </div>
              <div className="hash-display break-all">{address}</div>
            </TiltCard>
          </Reveal>

          <Reveal direction="up" delay={0.2}>
            <TiltCard
              className="glass"
              style={{ padding: 'var(--sp-lg)', marginBottom: 24, borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.04)' }}
              intensity={5}
            >
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20 }}>⚠️</span>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 4, color: '#fcd34d' }}>Keep your password safe</div>
                  <div className="text-secondary text-sm">
                    Your private keys are encrypted with your password using AES-256-GCM + PBKDF2.
                    If you lose your password, your funds cannot be recovered.
                  </div>
                </div>
              </div>
            </TiltCard>
          </Reveal>

          <Reveal direction="up" delay={0.3}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <MagneticButton variant="primary" onClick={() => onNavigate('dashboard')}>
                ⬡ Go to Dashboard
              </MagneticButton>
              <MagneticButton variant="ghost" onClick={() => onNavigate('send')}>
                ↗ Send Transaction
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </main>
    );
  }

  return (
    <main className="page-content" style={{ paddingTop: 40 }}>
      <div style={{ maxWidth: 520 }}>
        <Reveal direction="up">
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
              Generate <span className="animated-gradient-text">New Wallet</span>
            </h1>
            <p className="text-secondary">
              Create a hybrid ECDSA + ML-DSA (Dilithium) wallet secured by your password.
            </p>
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.1}>
          <TiltCard className="glass" style={{ padding: 'var(--sp-xl)' }} intensity={10}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <AnimatedInput
                label="Password"
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                error={errors.password}
                onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
              />

              {/* Password strength */}
              {password && (
                <div style={{ marginTop: -12 }}>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(strength / 5) * 100}%`,
                        background: strengthColor,
                        animation: 'none',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 11, color: strengthColor, fontWeight: 600, marginTop: 4, display: 'block' }}>
                    {strengthLabel}
                  </span>
                </div>
              )}

              <AnimatedInput
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                value={confirm}
                error={errors.confirm}
                onChange={e => { setConfirm(e.target.value); setErrors(prev => ({ ...prev, confirm: '' })); }}
                onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              />

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '12px 0', borderTop: '1px solid var(--clr-border)' }}>
                <span className="badge badge-indigo">ECDSA P-256</span>
                <span className="badge badge-violet">ML-DSA-65</span>
                <span className="badge badge-cyan">AES-256-GCM</span>
                <span className="badge badge-green">PBKDF2</span>
              </div>

              <MagneticButton
                variant="primary"
                size="lg"
                style={{ width: '100%' }}
                onClick={handleGenerate}
                disabled={!password || !confirm}
              >
                ◈ Generate Wallet
              </MagneticButton>
            </div>
          </TiltCard>
        </Reveal>

        {/* Info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--sp-lg)', marginTop: 24 }}>
          {[
            { label: 'Classical Key', value: 'ECDSA P-256', color: 'var(--clr-accent-1)', icon: '🔑' },
            { label: 'Quantum Key',   value: 'ML-DSA-65',  color: 'var(--clr-accent-2)', icon: '⚛' },
          ].map((k, i) => (
            <Reveal key={k.label} direction={i === 0 ? 'left' : 'right'} delay={0.2 + i * 0.1}>
              <TiltCard className="glass" style={{ padding: 'var(--sp-lg)' }} intensity={12}>
                <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>{k.icon}</span>
                <span className="text-xs text-muted" style={{ letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>{k.label}</span>
                <span style={{ fontWeight: 700, color: k.color }}>{k.value}</span>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
