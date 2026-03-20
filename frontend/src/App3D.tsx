import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, MeshDistortMaterial } from '@react-three/drei';
import { BrowserRouter as Router } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import './styles/3d-app.css';
import { useAppContext } from './context/AppContext';
import { generateWallet } from './services/walletService';
import { createTransaction, getTransactionHistory } from './services/transactionService';
import type { WalletResponce, TransactionResponce } from './types/api.types';

gsap.registerPlugin(ScrollTrigger);

// 3D Components
function FloatingCube({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <MeshDistortMaterial color={color} distort={0.3} speed={2} roughness={0.2} metalness={0.8} />
      </mesh>
    </Float>
  );
}

function FloatingSphere({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <MeshDistortMaterial color={color} distort={0.4} speed={3} roughness={0.1} metalness={0.9} />
      </mesh>
    </Float>
  );
}

function QuantumRing({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[i * Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2 + i * 0.3, 0.05, 16, 100]} />
          <meshStandardMaterial color={i === 0 ? '#00d4ff' : i === 1 ? '#7c3aed' : '#f472b6'} emissive={i === 0 ? '#0044ff' : i === 1 ? '#4c1d95' : '#be185d'} emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7c3aed" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <FloatingCube position={[-4, 2, -5]} color="#00d4ff" scale={0.8} />
      <FloatingCube position={[4, -2, -3]} color="#7c3aed" scale={0.6} />
      <FloatingCube position={[0, 3, -8]} color="#f472b6" scale={0.5} />
      <FloatingSphere position={[-3, -3, -4]} color="#00d4ff" />
      <FloatingSphere position={[3, 2, -6]} color="#7c3aed" />
      <QuantumRing position={[0, 0, -10]} />

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

// Navigation Component
function Navigation() {
  const [activeSection, setActiveSection] = useState('home');
  const { state } = useAppContext();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <nav className="nav-3d">
      <div className="nav-logo">
        <span className="logo-icon">◈</span>
        <span>QuantumVault</span>
      </div>
      <div className="nav-links">
        {[
          { id: 'home', label: 'Home' },
          { id: 'wallet', label: 'Wallet' },
          { id: 'generate', label: 'Generate Keys' },
          { id: 'send', label: 'Send' },
          { id: 'history', label: 'History' },
        ].map((item) => (
          <button
            key={item.id}
            className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => scrollToSection(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {state.wallet && (
        <div className="nav-wallet">
          <span className="wallet-address">{state.wallet.address.slice(0, 6)}...{state.wallet.address.slice(-4)}</span>
        </div>
      )}
    </nav>
  );
}

// Hero Section
function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
      });
      gsap.from(subtitleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1.5,
        delay: 0.3,
        ease: 'power4.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToWallet = () => {
    const element = document.getElementById('wallet');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="section hero-section" ref={heroRef}>
      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title">
          <span className="gradient-text">Quantum-Resistant</span>
          <br />
          Cryptographic Wallet
        </h1>
        <p ref={subtitleRef} className="hero-subtitle">
          Hybrid ECDSA + Dilithium3 security for the post-quantum era.
          <br />
          Protect your assets against tomorrow's threats, today.
        </p>
        <button className="cta-button" onClick={scrollToWallet}>
          <span>Enter the Vault</span>
          <span className="cta-arrow">→</span>
        </button>
      </div>
      <div className="scroll-indicator">
        <div className="scroll-line"></div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
}

// Wallet Dashboard Section
function WalletSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { state } = useAppContext();
  const wallet = state.wallet;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.wallet-card-3d', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
        },
        y: 100,
        opacity: 0,
        stagger: 0.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="wallet" className="section wallet-section" ref={sectionRef}>
      <div className="section-header">
        <h2 className="section-title">Your Wallet</h2>
        <p className="section-subtitle">Dual-signature protected assets</p>
      </div>
      <div className="wallet-cards-container">
        <div className="wallet-card-3d glass-card">
          <div className="card-glow"></div>
          <div className="card-icon">💎</div>
          <h3>Total Balance</h3>
          <div className="balance-amount">{wallet ? `${wallet.balance.toFixed(4)} ETH` : '0.0000 ETH'}</div>
          <div className="balance-usd">${wallet ? (wallet.balance * 3500).toFixed(2) : '0.00'} USD</div>
        </div>
        <div className={`wallet-card-3d glass-card featured ${wallet ? 'active' : ''}`}>
          <div className="card-glow"></div>
          <div className="card-icon">🔐</div>
          <h3>Security Status</h3>
          <div className="security-status">{wallet ? 'Quantum Protected' : 'No Wallet'}</div>
          <div className="security-badges">
            <span className="badge">ECDSA</span>
            <span className="badge">Dilithium3</span>
          </div>
        </div>
        <div className="wallet-card-3d glass-card">
          <div className="card-glow"></div>
          <div className="card-icon">📊</div>
          <h3>Transactions</h3>
          <div className="tx-count">{state.transactions.length}</div>
          <div className="tx-label">Total Transactions</div>
        </div>
      </div>
      {wallet && (
        <div className="wallet-details glass-card">
          <h4>Wallet Address</h4>
          <code className="address-code">{wallet.address}</code>
          <div className="public-keys">
            <div className="key-item">
              <span className="key-label">Classical Key</span>
              <code className="key-value">{wallet.publicKeys.classical.slice(0, 20)}...</code>
            </div>
            <div className="key-item">
              <span className="key-label">PQC Key</span>
              <code className="key-value">{wallet.publicKeys.pqc.slice(0, 20)}...</code>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// Generate Keys Section
function GenerateSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { dispatch } = useAppContext();
  const [generatedWallet, setGeneratedWallet] = useState<WalletResponce | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.generate-content', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        x: -100,
        opacity: 0,
        duration: 1,
      });
      gsap.from('.generate-visual', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        x: 100,
        opacity: 0,
        duration: 1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleGenerate = async () => {
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setError(null);
    setIsGenerating(true);
    dispatch({ type: 'SET_LOADING', payload: { loading: true, context: 'Generating quantum-resistant keys...' } });

    try {
      const wallet = await generateWallet(password);
      setGeneratedWallet(wallet);
      dispatch({ type: 'SET_WALLET', payload: wallet });

      // Load transaction history
      const history = await getTransactionHistory(wallet.address);
      dispatch({ type: 'SET_TRANSACTIONS', payload: history });
    } catch (err: any) {
      setError(err.message || 'Failed to generate wallet');
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to generate wallet' });
    } finally {
      setIsGenerating(false);
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    }
  };

  return (
    <section id="generate" className="section generate-section" ref={sectionRef}>
      <div className="generate-content">
        <h2 className="section-title">Generate Hybrid Keys</h2>
        <p className="section-description">
          Create a new wallet with dual cryptographic protection.
          Each key pair combines classical ECDSA with post-quantum Dilithium3.
        </p>
        <div className="key-features">
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <span>Instant generation</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🛡️</span>
            <span>AES-256-GCM encryption</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔑</span>
            <span>Dual signature scheme</span>
          </div>
        </div>

        <div className="password-input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter password (min 8 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            disabled={isGenerating}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {generatedWallet && (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <div>
              <div className="success-title">Wallet Generated!</div>
              <div className="success-address">{generatedWallet.address.slice(0, 10)}...{generatedWallet.address.slice(-8)}</div>
            </div>
          </div>
        )}

        <button
          className={`generate-button ${isGenerating ? 'generating' : ''}`}
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <span className="spinner"></span>
              <span>Generating Quantum Keys...</span>
            </>
          ) : (
            <>
              <span>Generate New Wallet</span>
              <span className="btn-icon">+</span>
            </>
          )}
        </button>
      </div>
      <div className="generate-visual">
        <div className="key-visualization">
          <div className={`key-ring ${isGenerating ? 'animating' : ''}`}>
            <div className="key-circle outer"></div>
            <div className="key-circle middle"></div>
            <div className="key-circle inner"></div>
            <div className="key-center">🔐</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Send Transaction Section
function SendSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [txResult, setTxResult] = useState<TransactionResponce | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.send-form-container', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 100,
        opacity: 0,
        duration: 1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.wallet) {
      setError('Please generate a wallet first');
      return;
    }
    if (!recipient || !amount || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError(null);
    dispatch({ type: 'SET_LOADING', payload: { loading: true, context: 'Creating dual-signature transaction...' } });

    try {
      const tx = await createTransaction(state.wallet.address, recipient, parseFloat(amount), password);
      setTxResult(tx);
      dispatch({ type: 'ADD_TRANSACTION', payload: tx });
      setAmount('');
      setRecipient('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Transaction failed' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    }
  };

  return (
    <section id="send" className="section send-section" ref={sectionRef}>
      <div className="section-header">
        <h2 className="section-title">Send Transaction</h2>
        <p className="section-subtitle">Dual-signed, quantum-protected transfers</p>
      </div>
      <div className="send-form-container glass-card">
        <div className="form-glow"></div>
        <form className="send-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Recipient Address</label>
            <input
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="form-input"
              disabled={!state.wallet}
            />
          </div>
          <div className="form-group">
            <label>Amount (ETH)</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input"
              step="0.0001"
              disabled={!state.wallet}
            />
          </div>
          <div className="form-group">
            <label>Wallet Password</label>
            <div className="password-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                disabled={!state.wallet}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {txResult && (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <div>
                <div className="success-title">Transaction Sent!</div>
                <div className="success-address">TX: {txResult.txId.slice(0, 16)}...</div>
              </div>
            </div>
          )}

          <div className="signature-preview">
            <div className="sig-item">
              <span className="sig-label">ECDSA Signature</span>
              <span className={`sig-status ${state.wallet ? 'ready' : 'pending'}`}>{state.wallet ? 'Ready' : 'No Wallet'}</span>
            </div>
            <div className="sig-item">
              <span className="sig-label">Dilithium3 Signature</span>
              <span className={`sig-status ${state.wallet ? 'ready' : 'pending'}`}>{state.wallet ? 'Ready' : 'No Wallet'}</span>
            </div>
          </div>
          <button type="submit" className="send-button" disabled={!state.wallet}>
            <span>Sign & Send</span>
            <span className="btn-icon">→</span>
          </button>
        </form>
      </div>
    </section>
  );
}

// History Section
function HistorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { state } = useAppContext();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.history-item', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        x: -50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <section id="history" className="section history-section" ref={sectionRef}>
      <div className="section-header">
        <h2 className="section-title">Transaction History</h2>
        <p className="section-subtitle">Immutable quantum-secured ledger</p>
      </div>
      <div className="history-list">
        {!state.wallet ? (
          <div className="empty-state glass-card">
            <div className="empty-icon">📭</div>
            <p>Generate a wallet to see transaction history</p>
          </div>
        ) : state.transactions.length === 0 ? (
          <div className="empty-state glass-card">
            <div className="empty-icon">📭</div>
            <p>No transactions yet</p>
          </div>
        ) : (
          state.transactions.map((tx) => (
            <div key={tx.txId} className="history-item glass-card">
              <div className={`tx-type ${tx.sender === state.wallet?.address ? 'send' : 'receive'}`}>
                {tx.sender === state.wallet?.address ? '↑' : '↓'}
              </div>
              <div className="tx-details">
                <div className="tx-amount">
                  {tx.sender === state.wallet?.address ? '-' : '+'}{tx.amount.toFixed(4)} ETH
                </div>
                <div className="tx-address">
                  {tx.sender === state.wallet?.address
                    ? `To: ${formatAddress(tx.recipient)}`
                    : `From: ${formatAddress(tx.sender)}`}
                </div>
              </div>
              <div className="tx-meta">
                <div className="tx-time">{formatTime(tx.timestamp)}</div>
                <div className={`tx-status ${tx.verified ? 'confirmed' : 'pending'}`}>
                  {tx.verified ? 'confirmed' : 'pending'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

// Loading Overlay
function LoadingOverlay() {
  const { state } = useAppContext();

  if (!state.loading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="quantum-loader">
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
        </div>
        <p className="loading-text">{state.loadingContext || 'Processing...'}</p>
      </div>
    </div>
  );
}

// Error Display
function ErrorDisplay() {
  const { state, dispatch } = useAppContext();

  if (!state.error) return null;

  return (
    <div className="error-banner">
      <span className="error-icon">⚠️</span>
      <span className="error-text">{state.error}</span>
      <button className="error-close" onClick={() => dispatch({ type: 'SET_ERROR', payload: null })}>
        ×
      </button>
    </div>
  );
}

// Footer
function Footer() {
  return (
    <footer className="footer-3d">
      <div className="footer-content">
        <div className="footer-logo">
          <span className="logo-icon">◈</span>
          <span>QuantumVault</span>
        </div>
        <p className="footer-text">Hybrid Post-Quantum Cryptographic Wallet Management System</p>
        <div className="footer-links">
          <a href="#" className="footer-link">Documentation</a>
          <a href="#" className="footer-link">GitHub</a>
          <a href="#" className="footer-link">Security</a>
        </div>
      </div>
      <div className="footer-glow"></div>
    </footer>
  );
}

// Main App Component
function App3DContent() {
  return (
    <div className="app-3d">
      {/* Fixed 3D Background */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <Scene />
        </Canvas>
      </div>

      {/* Global UI */}
      <LoadingOverlay />
      <ErrorDisplay />

      {/* Navigation */}
      <Navigation />

      {/* Scrollable Content */}
      <main className="main-content">
        <HeroSection />
        <WalletSection />
        <GenerateSection />
        <SendSection />
        <HistorySection />
        <Footer />
      </main>
    </div>
  );
}

function App3D() {
  return (
    <Router>
      <App3DContent />
    </Router>
  );
}

export default App3D;
