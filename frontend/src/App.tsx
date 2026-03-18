import theme from './styles/theme';

/**
 * App – root component.
 *
 * Acts as the styling system showcase during initial setup.
 * Demonstrates the dark Tailwind theme (colors, typography, components).
 * Will be replaced by the full router/layout once feature screens are built.
 */
function App() {
  return (
    <div className="min-h-screen bg-app-bg">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="border-b border-white/5 bg-app-surface shadow-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand shadow-glow-violet">
              <span className="text-lg font-bold text-white">⬡</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-white" style={{ fontFamily: theme.typography.fontFamily.sans }}>
                Hybrid PQC Wallet
              </h1>
              <p className="text-label text-white/40 uppercase">Post-Quantum Cryptography</p>
            </div>
          </div>
          <nav className="hidden items-center gap-1 sm:flex">
            <button className="btn-ghost btn-sm btn">Dashboard</button>
            <button className="btn-ghost btn-sm btn">Wallets</button>
            <button className="btn-ghost btn-sm btn">Transactions</button>
            <button className="btn-primary btn-sm btn ml-2">Connect</button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section className="mb-12 animate-fadeIn text-center">
          <span className="badge-accent badge mb-4">Styling System Ready</span>
          <h2
            className="gradient-text text-display font-bold tracking-tight text-balance"
            style={{ fontFamily: theme.typography.fontFamily.sans }}
          >
            Secure Your Digital Assets
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/50">
            A hybrid post-quantum cryptographic wallet combining classical ECDSA and
            CRYSTALS-Dilithium signatures for future-proof security.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button className="btn-primary btn btn-lg">Create Wallet</button>
            <button className="btn-outline btn btn-lg">Learn More</button>
          </div>
        </section>

        {/* ── Color Palette ──────────────────────────────────────────── */}
        <section className="mb-12">
          <h3 className="section-title mb-1">Color Palette</h3>
          <p className="section-subtitle mb-6">Design tokens configured in tailwind.config.js</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* App backgrounds */}
            <div className="card">
              <p className="mb-3 text-sm font-semibold text-white/70">App Backgrounds</p>
              <div className="space-y-2">
                {(Object.entries(theme.colors.app) as [string, string][]).map(([name, hex]) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="h-6 w-6 flex-none rounded-md border border-white/10" style={{ backgroundColor: hex }} />
                    <span className="text-sm text-white/60">app.{name}</span>
                    <code className="ml-auto text-xs text-white/40" style={{ fontFamily: theme.typography.fontFamily.mono }}>{hex}</code>
                  </div>
                ))}
              </div>
            </div>
            {/* Brand */}
            <div className="card">
              <p className="mb-3 text-sm font-semibold text-white/70">Brand (Violet)</p>
              <div className="space-y-2">
                {(Object.entries(theme.colors.brand) as [string, string][]).map(([name, hex]) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="h-6 w-6 flex-none rounded-md border border-white/10" style={{ backgroundColor: hex }} />
                    <span className="text-sm text-white/60">brand.{name}</span>
                    <code className="ml-auto text-xs text-white/40" style={{ fontFamily: theme.typography.fontFamily.mono }}>{hex}</code>
                  </div>
                ))}
              </div>
            </div>
            {/* Accent */}
            <div className="card">
              <p className="mb-3 text-sm font-semibold text-white/70">Accent Colors</p>
              <div className="space-y-2">
                {(Object.entries(theme.colors.accent) as [string, string][]).map(([name, hex]) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="h-6 w-6 flex-none rounded-md border border-white/10" style={{ backgroundColor: hex }} />
                    <span className="text-sm text-white/60">accent.{name}</span>
                    <code className="ml-auto text-xs text-white/40" style={{ fontFamily: theme.typography.fontFamily.mono }}>{hex}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Typography ─────────────────────────────────────────────── */}
        <section className="mb-12">
          <h3 className="section-title mb-1">Typography</h3>
          <p className="section-subtitle mb-6">DM Sans · JetBrains Mono</p>
          <div className="card space-y-4">
            <p className="text-display font-bold text-white">Display Heading (2rem / 700)</p>
            <p className="text-heading font-semibold text-white/90">Section Heading (1.25rem / 600)</p>
            <p className="text-xl font-semibold text-white/80">Sub-heading (xl)</p>
            <p className="text-base text-white/60">
              Body copy — readable, comfortable line-height for wallet operations and transaction
              details.
            </p>
            <p className="text-sm text-white/40">
              Small text — used for metadata, timestamps, and helper messages.
            </p>
            <p className="text-label uppercase text-white/30">Label (0.625rem · letter-spacing 0.1em)</p>
            <code
              className="key-display block"
              style={{ fontFamily: theme.typography.fontFamily.mono }}
            >
              0x4f46e5a3...b4fc (ECDSA Public Key — JetBrains Mono)
            </code>
          </div>
        </section>

        {/* ── Component Showcase ─────────────────────────────────────── */}
        <section className="mb-12">
          <h3 className="section-title mb-1">Components</h3>
          <p className="section-subtitle mb-6">Reusable classes from the @layer components block</p>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Buttons */}
            <div className="card">
              <p className="mb-4 text-sm font-semibold text-white/70">Buttons</p>
              <div className="flex flex-wrap gap-2">
                <button className="btn-primary btn">Primary</button>
                <button className="btn-accent btn">Accent</button>
                <button className="btn-outline btn">Outline</button>
                <button className="btn-ghost btn">Ghost</button>
                <button className="btn-danger btn">Danger</button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="btn-primary btn btn-sm">Small</button>
                <button className="btn-primary btn">Default</button>
                <button className="btn-primary btn btn-lg">Large</button>
                <button className="btn-primary btn" disabled>
                  Disabled
                </button>
              </div>
            </div>

            {/* Badges */}
            <div className="card">
              <p className="mb-4 text-sm font-semibold text-white/70">Badges</p>
              <div className="flex flex-wrap gap-2">
                <span className="badge-primary badge">Primary</span>
                <span className="badge-accent badge">Accent</span>
                <span className="badge-success badge">Active</span>
                <span className="badge-warning badge">Pending</span>
                <span className="badge-error badge">Failed</span>
              </div>
              <div className="divider" />
              <div className="flex items-center gap-2">
                <div className="spinner" />
                <span className="text-sm text-white/50">Loading…</span>
              </div>
            </div>

            {/* Form Controls */}
            <div className="card">
              <p className="mb-4 text-sm font-semibold text-white/70">Form Controls</p>
              <div className="space-y-3">
                <div>
                  <label className="label" htmlFor="demo-wallet">
                    Wallet Name
                  </label>
                  <input
                    id="demo-wallet"
                    className="input"
                    type="text"
                    placeholder="My PQC Wallet"
                  />
                  <p className="helper-text">Choose a memorable name for your wallet.</p>
                </div>
                <div>
                  <label className="label" htmlFor="demo-address">
                    Recipient Address
                  </label>
                  <input
                    id="demo-address"
                    className="input input-error"
                    type="text"
                    placeholder="0x..."
                  />
                  <p className="error-text">Invalid address format.</p>
                </div>
              </div>
            </div>

            {/* Wallet Card */}
            <div className="card">
              <p className="mb-4 text-sm font-semibold text-white/70">Wallet Card</p>
              <div className="rounded-card gradient-brand p-4 text-white shadow-glow-violet animate-float">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-label uppercase opacity-60">Hybrid PQC Wallet</p>
                    <p className="mt-1 text-xl font-bold">1,234.56 ETH</p>
                  </div>
                  <span className="badge-success badge">Active</span>
                </div>
                <div className="mt-4">
                  <p className="text-label uppercase opacity-50">
                    Public Key (ECDSA)
                  </p>
                  <code
                    className="mt-1 block truncate text-xs opacity-80"
                    style={{ fontFamily: theme.typography.fontFamily.mono }}
                  >
                    0x4f46e5a3b2c1d0e9f8a7b6c5d4e3f2a1...b4fc
                  </code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Shadows / Glows ────────────────────────────────────────── */}
        <section className="mb-12">
          <h3 className="section-title mb-1">Shadows &amp; Glows</h3>
          <p className="section-subtitle mb-6">Box-shadow tokens from the theme</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'glow-violet',  cls: 'shadow-glow-violet',    bg: 'bg-brand' },
              { label: 'glow-indigo',  cls: 'shadow-glow-indigo',    bg: 'bg-accent-indigo' },
              { label: 'glow-emerald', cls: 'shadow-glow-emerald',   bg: 'bg-accent-emerald' },
              { label: 'glow-red',     cls: 'shadow-glow-red',       bg: 'bg-accent-red' },
            ].map(({ label, cls, bg }) => (
              <div key={label} className={`card flex items-center justify-center h-20 ${cls}`}>
                <div className={`h-8 w-8 rounded-full ${bg}`} />
                <p className="ml-3 text-xs text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Responsive Grid ────────────────────────────────────────── */}
        <section className="mb-12">
          <h3 className="section-title mb-1">Responsive Layout</h3>
          <p className="section-subtitle mb-6">Resize the window to see the grid adapt</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {['sm: 640px', 'md: 768px', 'lg: 1024px', 'xl: 1280px', '2xl: 1536px'].map(
              (bp) => (
                <div key={bp} className="card text-center">
                  <p className="text-sm font-semibold text-brand-light">{bp}</p>
                </div>
              )
            )}
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 bg-app-surface py-6">
        <p className="text-center text-sm text-white/30">
          Hybrid Post-Quantum Cryptographic Wallet Management System
        </p>
      </footer>
    </div>
  );
}

export default App;
