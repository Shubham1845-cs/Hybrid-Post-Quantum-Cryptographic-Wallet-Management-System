import { truncate, formatBalance } from '../../utils/helpers';

interface WalletCardProps {
  address: string;
  balance: number;
}

const WalletCard = ({ address, balance }: WalletCardProps) => {
  return (
    /*
      3D card effect:
      - dark deep background with subtle grid lines
      - glowing violet border
      - inner glow on hover via shadow
      - floating animation
    */
    <div className="relative w-full max-w-md rounded-2xl p-6 animate-float
                    bg-gradient-to-br from-[#0f0c29] via-[#1a1248] to-[#0d0b20]
                    border border-violet-500/30
                    shadow-[0_8px_32px_rgba(124,58,237,0.25),inset_0_1px_0_rgba(255,255,255,0.07)]
                    hover:shadow-[0_12px_48px_rgba(124,58,237,0.45),inset_0_1px_0_rgba(255,255,255,0.1)]
                    transition-shadow duration-500
                    overflow-hidden">

      {/* background grid lines for depth */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* top glow orb */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full
                      bg-violet-600/20 blur-2xl pointer-events-none" />

      {/* ── Header ─────────────────────────────────────── */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {/* glowing dot */}
          <span className="w-2 h-2 rounded-full bg-emerald-400
                           shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
          <span className="text-xs font-mono text-violet-300/70
                           uppercase tracking-[0.2em]">
            Hybrid PQC Wallet
          </span>
        </div>
        {/* chip visual */}
        <div className="w-9 h-6 rounded-md border border-yellow-400/50
                        bg-gradient-to-br from-yellow-300/20 to-yellow-600/10
                        shadow-[0_0_8px_rgba(250,204,21,0.3)]" />
      </div>

      {/* ── Balance ────────────────────────────────────── */}
      <div className="relative mb-6">
        <p className="text-xs font-mono text-violet-400/60
                      uppercase tracking-widest mb-1">
          Balance
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-mono font-bold text-white
                           drop-shadow-[0_0_12px_rgba(167,139,250,0.6)]">
            {formatBalance(balance)}
          </span>
          <span className="text-sm font-mono text-violet-400">HPQC</span>
        </div>
      </div>

      {/* ── Address ────────────────────────────────────── */}
      <div className="relative rounded-xl border border-violet-500/20
                      bg-white/[0.03] backdrop-blur-sm px-4 py-3
                      hover:border-violet-400/40 transition-colors duration-300
                      group">
        <p className="text-[10px] font-mono text-violet-400/60
                      uppercase tracking-widest mb-1">
          Wallet Address
        </p>
        {/* shimmer effect on hover */}
        <p className="text-sm font-mono text-violet-100 tracking-wide"
           title={address}>
          {truncate(address, 10, 8)}
        </p>
        {/* shimmer bar */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                        transition-opacity duration-500 pointer-events-none
                        bg-[linear-gradient(90deg,transparent_0%,rgba(167,139,250,0.06)_50%,transparent_100%)]
                        bg-[length:200%_100%] animate-shimmer" />
      </div>

    </div>
  );
};

export default WalletCard;