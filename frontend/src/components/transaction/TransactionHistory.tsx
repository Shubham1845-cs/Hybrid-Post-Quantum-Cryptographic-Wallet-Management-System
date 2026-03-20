

import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTransaction } from '../../hooks/useTransaction';
import ErrorMessage from '../common/ErrorMessage';
import TransactionRow from './TransactionRow';
import {
    type FilterType,
    filterTransactions,
    sortByNewest,
    getTxSummary,
} from '../../utils/transactionHelpers';
import { formatBalance } from '../../utils/helpers';
import TransactionHistorySkeleton from '../common/TransactionHistorySkeleton';

const TransactionHistory = () => {
    const [filter, setFilter] = useState<FilterType>('all');

    // ── Global state + transaction actions ───────────────────────────────────
    const { state, dispatch } = useAppContext();
    const { loading, error, handleLoadHistory } = useTransaction();

    const wallet = state.wallet;
    const transactions = state.transactions;

    // ── Fetch history when component mounts ──────────────────────────────────
    useEffect(() => {
        if (wallet) {
            handleLoadHistory(wallet.address);
        }
    }, []);

    const handleRefresh = () => {
        if (wallet) handleLoadHistory(wallet.address);
    };

    if (!wallet) {
        return (
            <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-slate-900/60 p-8 text-center">
                <p className="text-2xl mb-3">📋</p>
                <p className="text-sm font-mono text-slate-400">No wallet loaded</p>
                <p className="text-xs font-mono text-slate-600 mt-1">
                    Generate or load a wallet to see history
                </p>
            </div>
        );
    }

    // ── Loading state ─────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="w-full max-w-md">
                  <TransactionHistorySkeleton /> 
            </div>
        );
    }

    // ── Error state ───────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="w-full max-w-md">
                <ErrorMessage
                    message={error}
                    onDismiss={() => dispatch({ type: 'SET_ERROR', payload: null })}
                />
            </div>
        );
    }

    // ── Process transactions ──────────────────────────────────────────────────
    const sorted = sortByNewest(transactions);
    const filtered = filterTransactions(sorted, filter, wallet.address);
    const summary = getTxSummary(transactions, wallet.address);

    return (
        <div className="relative w-full max-w-md">
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-b from-slate-900/90 to-slate-950/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]">

                {/* background glow */}
                <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-slate-600/10 blur-3xl pointer-events-none" />

                {/* ── Header ───────────────────────────────────────── */}
                <div className="relative px-5 pt-5 pb-4 border-b border-white/[0.05]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-slate-500/10 border border-slate-400/20 flex items-center justify-center">
                                <span className="text-sm">📋</span>
                            </div>
                            <div>
                                <h2 className="text-sm font-mono font-bold text-slate-100 tracking-wide uppercase">
                                    Transaction History
                                </h2>
                                <p className="text-[10px] font-mono text-slate-500">
                                    {transactions.length} total transactions
                                </p>
                            </div>
                        </div>

                        {/* refresh button */}
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/[0.12] flex items-center justify-center text-slate-400 hover:text-slate-200 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed">
                            <span className="text-sm font-mono">↻</span>
                        </button>
                    </div>

                    {/* ── Summary stat cards ──────────────────────────── */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {/* sent stats */}
                        <div className="rounded-xl border border-red-500/15 bg-red-500/5 px-3 py-2">
                            <p className="text-[9px] font-mono text-red-400/70 uppercase tracking-widest mb-1">
                                Total Sent
                            </p>
                            <p className="text-sm font-mono font-bold text-red-400">
                                −{formatBalance(summary.totalSent)}
                            </p>
                            <p className="text-[9px] font-mono text-slate-600">
                                {summary.sentCount} transactions
                            </p>
                        </div>

                        {/* received stats */}
                        <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-3 py-2">
                            <p className="text-[9px] font-mono text-emerald-400/70 uppercase tracking-widest mb-1">
                                Total Received
                            </p>
                            <p className="text-sm font-mono font-bold text-emerald-400">
                                +{formatBalance(summary.totalReceived)}
                            </p>
                            <p className="text-[9px] font-mono text-slate-600">
                                {summary.receivedCount} transactions
                            </p>
                        </div>
                    </div>

                    {/* ── Filter tabs ─────────────────────────────────── */}
                    <div className="flex gap-1">
                        {(['all', 'sent', 'received'] as FilterType[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-200 ${filter === tab
                                    ? tab === 'sent'
                                        ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                                        : tab === 'received'
                                            ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                                            : 'bg-white/[0.08] border border-white/[0.12] text-slate-200'
                                    : 'bg-transparent border border-white/[0.05] text-slate-600 hover:text-slate-400 hover:border-white/[0.08]'
                                    }`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Transaction list ─────────────────────────────── */}
                <div className="relative">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <p className="text-2xl">
                                {filter === 'sent' ? '📤' : filter === 'received' ? '📥' : '📭'}
                            </p>
                            <p className="text-sm font-mono text-slate-500">
                                {filter === 'all' ? 'No transactions yet' : `No ${filter} transactions`}
                            </p>
                            <p className="text-[10px] font-mono text-slate-600 text-center px-8">
                                {filter === 'all'
                                    ? 'Send a transaction to see it here'
                                    : `Switch to "All" to see other transactions`}
                            </p>
                        </div>
                    ) : (
                        <div>
                            {filtered.map((tx) => (
                                <TransactionRow
                                    key={tx.txId}
                                    transaction={tx}
                                    walletAddress={wallet.address}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Footer — showing count ───────────────────────── */}
                {filtered.length > 0 && (
                    <div className="px-5 py-3 border-t border-white/[0.05] flex items-center justify-between">
                        <p className="text-[10px] font-mono text-slate-600">
                            Showing {filtered.length} of {transactions.length}
                        </p>
                        <p className="text-[9px] font-mono text-slate-700">
                            🔒 ECDSA + Dilithium secured
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionHistory;