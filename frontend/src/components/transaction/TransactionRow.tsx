import type { TransactionResponce } from "../../types/api.types";
import { truncate,formatBalance } from "../../utils/helpers";
import { isSent,getRelativeTime } from "../../utils/transactionHelpers";
import { formatTimestamp } from "../../utils/transactionValidation";

interface TransactionRowProps{
    transaction:TransactionResponce;
    walletAddress:string;
}

const TransactionRow=({transaction,walletAddress}:TransactionRowProps)=>
{
    const sent=isSent(transaction,walletAddress);
    const relativeTime=getRelativeTime(transaction.timestamp);
    const fullTimestamp=formatTimestamp(transaction.timestamp);
    
    // // the "other" address — recipient if sent, sender if received
    const counterparty = sent
        ? transaction.recipient
        : transaction.sender;

        return(
            <div className="group relative flex items-center gap-4
                    px-4 py-3
                    border-b border-white/[0.04] last:border-0
                    hover:bg-white/[0.03]
                    transition-colors duration-200">

                {/* ── Direction icon ──────────────────────────────────── */}
                <div className={`w-9 h-9 rounded-xl flex items-center
                       justify-center shrink-0 text-sm
                       transition-all duration-300
                       ${sent
                        ? 'bg-red-500/10 border border-red-500/20 group-hover:border-red-500/40'
                        : 'bg-emerald-500/10 border border-emerald-500/20 group-hover:border-emerald-500/40'
                    }`}>
                    {/* ↑ = sent, ↓ = received */}
                    <span className={`font-mono font-bold text-base
                          ${sent ? 'text-red-400' : 'text-emerald-400'}`}>
                        {sent ? '↑' : '↓'}
                    </span>
                </div>

                {/* ── Middle — direction label + counterparty address ─── */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-mono font-bold
                            uppercase tracking-widest
                            ${sent ? 'text-red-400' : 'text-emerald-400'}`}>
                            {sent ? 'Sent' : 'Received'}
                        </span>

                        {/* verified badge */}
                        {transaction.verified && (
                            <span className="text-[8px] font-mono text-slate-500
                             border border-white/[0.08]
                             px-1.5 py-0.5 rounded-full">
                                ✓ verified
                            </span>
                        )}
                    </div>

                    {/* counterparty address — truncated */}
                    <p className="text-xs font-mono text-slate-500 truncate"
                        title={counterparty}>
                        {sent ? 'To: ' : 'From: '}
                        <span className="text-slate-400">
                            {truncate(counterparty, 8, 6)}
                        </span>
                    </p>
                </div>

                {/* ── Right — amount + time ───────────────────────────── */}
                <div className="text-right shrink-0">
                    {/* amount */}
                    <p className={`text-sm font-mono font-bold
                       ${sent ? 'text-red-400' : 'text-emerald-400'}`}>
                        {sent ? '−' : '+'}{formatBalance(transaction.amount)}
                    </p>
                    <p className="text-[9px] font-mono text-slate-600">
                        HPQC
                    </p>

                    {/* relative time — tooltip shows full timestamp */}
                    <p className="text-[9px] font-mono text-slate-600 mt-0.5"
                        title={fullTimestamp}>
                        {relativeTime}
                    </p>
                </div>

            </div>
        );
        
  
}

export default TransactionRow;