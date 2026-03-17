// ─── What this file does ──────────────────────────────────────────────────────
// Displays the result of a successfully submitted transaction
// Shows txId, amount, recipient, timestamp, verification status
// Reused anywhere a transaction needs to be displayed

import  type { TransactionResponce } from '../../types/api.types';
import { truncate } from '../../utils/helpers';
import { formatTimestamp } from '../../utils/transactionValidation';

interface TransactionResultProps {
    transaction: TransactionResponce;
    onDismiss: () => void;
}

// ── One row in the result table ───────────────────────────────────────────────
const ResultRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-start justify-between
                  py-2 border-b border-white/[0.05] last:border-0">
        <span className="text-[10px] font-mono text-slate-500
                     uppercase tracking-widest w-24 shrink-0">
            {label}
        </span>
        <span className="text-xs font-mono text-slate-300 text-right break-all ml-4">
            {value}
        </span>
    </div>
);

const TransactionResult = ({ transaction, onDismiss }: TransactionResultProps) => {
    return (
        <div className="relative rounded-2xl overflow-hidden
                    border border-emerald-500/20
                    bg-gradient-to-b from-emerald-950/40 to-slate-950/60
                    backdrop-blur-md p-5
                    shadow-[0_0_32px_rgba(52,211,153,0.1)]">

            {/* top glow line */}
            <div className="absolute top-0 left-8 right-8 h-[1px]
                      bg-gradient-to-r from-transparent
                      via-emerald-400/60 to-transparent" />

            {/* ── Header ───────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {/* glowing dot */}
                    <span className="w-2 h-2 rounded-full bg-emerald-400
                           shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                    <p className="text-xs font-mono font-bold text-emerald-400
                        uppercase tracking-widest">
                        Transaction Submitted
                    </p>
                </div>

                {/* verified badge */}
                {transaction.verified && (
                    <span className="text-[9px] font-mono font-bold
                           text-emerald-300 border border-emerald-500/30
                           bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        ✓ Verified
                    </span>
                )}
            </div>

            {/* ── Transaction details ───────────────────────────────── */}
            <div className="bg-white/[0.02] rounded-xl px-4 py-2 mb-4">
                <ResultRow
                    label="Tx ID"
                    value={truncate(transaction.txId, 10, 8)}
                />
                <ResultRow
                    label="Amount"
                    value={`${transaction.amount.toFixed(6)} HPQC`}
                />
                <ResultRow
                    label="Recipient"
                    value={truncate(transaction.recipient, 10, 8)}
                />
                <ResultRow
                    label="Timestamp"
                    value={formatTimestamp(transaction.timestamp)}
                />
                <ResultRow
                    label="Nonce"
                    value={`#${transaction.nonce}`}
                />
            </div>

            {/* ── Dual signature indicator ──────────────────────────── */}
            <div className="flex items-center gap-3 mb-4">
                {/* ECDSA badge */}
                <div className="flex-1 rounded-lg border border-indigo-500/20
                        bg-indigo-500/5 px-3 py-2 text-center">
                    <p className="text-[9px] font-mono text-indigo-400
                        uppercase tracking-widest mb-0.5">
                        ECDSA
                    </p>
                    <p className="text-[10px] font-mono text-slate-400">
                        ✓ Signed
                    </p>
                </div>
                {/* divider */}
                <span className="text-slate-600 text-xs font-mono">+</span>
                {/* Dilithium badge */}
                <div className="flex-1 rounded-lg border border-violet-500/20
                        bg-violet-500/5 px-3 py-2 text-center">
                    <p className="text-[9px] font-mono text-violet-400
                        uppercase tracking-widest mb-0.5">
                        Dilithium
                    </p>
                    <p className="text-[10px] font-mono text-slate-400">
                        ✓ Signed
                    </p>
                </div>
            </div>

            {/* ── Dismiss button ────────────────────────────────────── */}
            <button
                onClick={onDismiss}
                className="w-full py-2 rounded-xl
                   border border-white/[0.08] bg-white/[0.03]
                   hover:bg-white/[0.06] hover:border-white/[0.12]
                   text-xs font-mono text-slate-400 hover:text-slate-200
                   transition-all duration-300 tracking-widest uppercase">
                New Transaction
            </button>

        </div>
    );
};

export default TransactionResult;