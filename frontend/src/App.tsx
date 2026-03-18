import theme from './styles/theme';

/**
 * App – root component.
 *
 * This component acts as the styling system showcase during initial setup.
 * It demonstrates the configured Tailwind theme (colors, typography, components)
 * and will be replaced with the full router/layout once feature screens are built.
 */
function App() {
  return (
    <div className="min-h-screen bg-surface-light">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="border-b border-slate-200 bg-white shadow-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <span className="text-lg font-bold text-white">⬡</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900" style={{ fontFamily: theme.typography.fontFamily.display }}>
                Hybrid PQC Wallet
              </h1>
              <p className="text-2xs text-slate-500">Post-Quantum Cryptography</p>
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
        <section className="mb-12 animate-fade-in text-center">
          <span className="badge-accent badge mb-4">Styling System Ready</span>
          <h2
            className="gradient-text text-5xl font-extrabold tracking-tight text-balance"
            style={{ fontFamily: theme.typography.fontFamily.display }}
          >
            Secure Your Digital Assets
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
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
            {/* Primary */}
            <div className="card">
              <p className="mb-3 text-sm font-semibold text-slate-700">Primary (Indigo)</p>
              <div className="flex gap-1">
                {Object.values(theme.colors.primary).map((hex, i) => (
                  <div
                    key={i}
                    className="h-8 flex-1 rounded first:rounded-l-lg last:rounded-r-lg"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>
            {/* Accent */}
            <div className="card">
              <p className="mb-3 text-sm font-semibold text-slate-700">Accent (Cyan)</p>
              <div className="flex gap-1">
                {Object.values(theme.colors.accent).map((hex, i) => (
                  <div
                    key={i}
                    className="h-8 flex-1 rounded first:rounded-l-lg last:rounded-r-lg"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>
            {/* Semantic */}
            <div className="card">
              <p className="mb-3 text-sm font-semibold text-slate-700">Semantic Colors</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-success-500" />
                  <span className="text-sm text-slate-600">Success</span>
                  <code className="key-display ml-auto py-0.5 px-1.5 text-2xs">{theme.colors.success[500]}</code>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-warning-500" />
                  <span className="text-sm text-slate-600">Warning</span>
                  <code className="key-display ml-auto py-0.5 px-1.5 text-2xs">{theme.colors.warning[500]}</code>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-error-500" />
                  <span className="text-sm text-slate-600">Error</span>
                  <code className="key-display ml-auto py-0.5 px-1.5 text-2xs">{theme.colors.error[500]}</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Typography ─────────────────────────────────────────────── */}
        <section className="mb-12">
          <h3 className="section-title mb-1">Typography</h3>
          <p className="section-subtitle mb-6">Inter · JetBrains Mono · Plus Jakarta Sans</p>
          <div className="card space-y-4">
            <p
              className="text-4xl font-extrabold tracking-tight text-slate-900"
              style={{ fontFamily: theme.typography.fontFamily.display }}
            >
              Display Heading
            </p>
            <p className="text-2xl font-bold text-slate-800">Section Heading (2xl)</p>
            <p className="text-lg font-semibold text-slate-700">Sub-heading (lg)</p>
            <p className="text-base text-slate-600">
              Body copy — readable, comfortable line-height for wallet operations and transaction
              details.
            </p>
            <p className="text-sm text-slate-500">
              Small text — used for metadata, timestamps, and helper messages.
            </p>
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
              <p className="mb-4 text-sm font-semibold text-slate-700">Buttons</p>
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
              <p className="mb-4 text-sm font-semibold text-slate-700">Badges</p>
              <div className="flex flex-wrap gap-2">
                <span className="badge-primary badge">Primary</span>
                <span className="badge-accent badge">Accent</span>
                <span className="badge-success badge">Active</span>
                <span className="badge-warning badge">Pending</span>
                <span className="badge-error badge">Failed</span>
              </div>
            </div>

            {/* Form Controls */}
            <div className="card">
              <p className="mb-4 text-sm font-semibold text-slate-700">Form Controls</p>
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
              <p className="mb-4 text-sm font-semibold text-slate-700">Wallet Card</p>
              <div className="rounded-xl gradient-primary p-4 text-white shadow-glow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium opacity-75">Hybrid PQC Wallet</p>
                    <p className="mt-1 text-xl font-bold">1,234.56 ETH</p>
                  </div>
                  <span className="badge-success badge">Active</span>
                </div>
                <div className="mt-4">
                  <p className="text-2xs font-medium uppercase tracking-wider opacity-60">
                    Public Key (ECDSA)
                  </p>
                  <code
                    className="mt-1 block truncate text-xs opacity-90"
                    style={{ fontFamily: theme.typography.fontFamily.mono }}
                  >
                    0x4f46e5a3...b4fc
                  </code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Responsive Grid ────────────────────────────────────────── */}
        <section className="mb-12">
          <h3 className="section-title mb-1">Responsive Layout</h3>
          <p className="section-subtitle mb-6">Resize the window to see the grid adapt</p>
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {['xs: 480px', 'sm: 640px', 'md: 768px', 'lg: 1024px', 'xl: 1280px', '2xl: 1536px'].map(
              (bp) => (
                <div key={bp} className="card text-center">
                  <p className="text-sm font-semibold text-primary-600">{bp}</p>
                </div>
              )
            )}
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <p className="text-center text-sm text-slate-500">
          Hybrid Post-Quantum Cryptographic Wallet Management System
        </p>
      </footer>
    </div>
  );
}

export default App;
