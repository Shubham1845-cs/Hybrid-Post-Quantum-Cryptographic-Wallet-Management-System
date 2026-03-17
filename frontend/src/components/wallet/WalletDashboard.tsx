import { useAppContext } from '../../context/AppContext';
import WalletCardSkeleton from '../common/WalletCardSkeleton';
import ErrorMessage from '../common/ErrorMessage';
import WalletCard from './WalletCard';
import PublicKeysDisplay from './PublicKeysDisplay';

const WalletDashboard = () => {
  const { state, dispatch } = useAppContext();

  // ── Loading — show skeleton instead of spinner ─────────────
  if (state.loading) {
    return (
      <div className="min-h-screen bg-[#080612]
                      flex flex-col items-center gap-6 px-4 py-8">
        <div className="w-full max-w-md">
          <p className="text-[10px] font-mono text-violet-400/60
                        uppercase tracking-[0.3em] mb-1">Dashboard</p>
          <div className="h-8 w-48 rounded-lg
                          bg-slate-800 animate-pulse" />
        </div>
        <WalletCardSkeleton />
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (state.error) {
    return (
      <div className="min-h-screen bg-[#080612]
                      flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <ErrorMessage
            message={state.error}
            onDismiss={() => dispatch({ type: 'SET_ERROR', payload: null })}
          />
        </div>
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────────
  if (!state.wallet) {
    return (
      <div className="min-h-screen bg-[#080612]
                      flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full
                        bg-violet-500/10 border border-violet-500/20
                        flex items-center justify-center
                        shadow-[0_0_32px_rgba(124,58,237,0.2)]
                        animate-pulse">
          <span className="text-2xl">🔐</span>
        </div>
        <p className="text-lg font-mono font-bold text-slate-200">
          No wallet loaded
        </p>
        <p className="text-sm font-mono text-slate-500 text-center max-w-xs">
          Generate a new wallet or load an existing one
        </p>
      </div>
    );
  }

  // ── Full dashboard ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#080612] px-4 py-8
                    flex flex-col items-center gap-6">

      {/* star dots */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.4 + 0.1,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md">
        <p className="text-[10px] font-mono text-violet-400/60
                      uppercase tracking-[0.3em] mb-1">Dashboard</p>
        <h1 className="text-2xl font-mono font-bold text-white
                       drop-shadow-[0_0_20px_rgba(167,139,250,0.4)]">
          Wallet Overview
        </h1>
      </div>

      <WalletCard
        address={state.wallet.address}
        balance={state.wallet.balance}
      />
      <PublicKeysDisplay
        classicalKey={state.wallet.publicKeys.classical}
        pqcKey={state.wallet.publicKeys.pqc}
      />
    </div>
  );
};

export default WalletDashboard;
