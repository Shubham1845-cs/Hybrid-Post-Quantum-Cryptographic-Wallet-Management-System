import { truncate } from '../../utils/helpers';

interface PublicKeysDisplayProps {
  classicalKey: string;
  pqcKey: string;
}

interface KeyRowProps {
  label: string;
  value: string;
  badge: string;
  badgeColor: string;
  glowColor: string;
}

// ── Single key row ──────────────────────────────────────────────────────────
const KeyRow = ({ label, value, badge, badgeColor, glowColor }: KeyRowProps) => (
  <div className="group rounded-xl border border-white/[0.06]
                  bg-white/[0.02] hover:bg-white/[0.05]
                  px-4 py-3 transition-all duration-300
                  hover:border-white/[0.12]">
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] font-mono uppercase tracking-widest
                       text-slate-400">
        {label}
      </span>
      {/* badge */}
      <span className={`text-[9px] font-mono font-bold uppercase
                        tracking-widest px-2 py-0.5 rounded-full
                        border ${badgeColor}`}
            style={{ textShadow: `0 0 8px ${glowColor}` }}>
        {badge}
      </span>
    </div>

    {/* key value with glow on hover */}
    <p className="text-xs font-mono text-slate-300 break-all
                  group-hover:text-white transition-colors duration-300"
       style={{ textShadow: `0 0 0px ${glowColor}` }}
       title={value}>
      {truncate(value, 14, 10)}
    </p>

    {/* bottom glow line — appears on hover */}
    <div className={`h-[1px] w-0 group-hover:w-full mt-2
                     transition-all duration-500 rounded-full
                     ${glowColor.includes('99') ? 'bg-indigo-500/50' : 'bg-emerald-500/50'}`} />
  </div>
);

const PublicKeysDisplay = ({ classicalKey, pqcKey }: PublicKeysDisplayProps) => {
  return (
    <div className="relative w-full max-w-md rounded-2xl p-5
                    bg-gradient-to-b from-slate-900/80 to-slate-950/80
                    border border-white/[0.07]
                    shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]
                    backdrop-blur-md overflow-hidden">

      {/* background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2
                      w-48 h-20 rounded-full
                      bg-indigo-600/10 blur-2xl pointer-events-none" />

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded-md bg-indigo-500/20
                        border border-indigo-400/30
                        flex items-center justify-center
                        shadow-[0_0_8px_rgba(99,102,241,0.4)]">
          <span className="text-[10px]">🔑</span>
        </div>
        <h3 className="text-sm font-mono font-bold text-slate-200
                       tracking-wide uppercase">
          Public Keys
        </h3>
        {/* dual security badge */}
        <span className="ml-auto text-[9px] font-mono text-emerald-400
                         border border-emerald-500/30 px-2 py-0.5 rounded-full
                         bg-emerald-500/10">
          Dual Layer
        </span>
      </div>

      {/* ── Keys ───────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <KeyRow
          label="Classical Key"
          value={classicalKey}
          badge="ECDSA"
          badgeColor="border-indigo-400/40 text-indigo-300 bg-indigo-500/10"
          glowColor="rgba(99,102,241,0.8)"
        />
        <KeyRow
          label="Post-Quantum Key"
          value={pqcKey}
          badge="Dilithium"
          badgeColor="border-emerald-400/40 text-emerald-300 bg-emerald-500/10"
          glowColor="rgba(52,211,153,0.8)"
        />
      </div>

    </div>
  );
};

export default PublicKeysDisplay;