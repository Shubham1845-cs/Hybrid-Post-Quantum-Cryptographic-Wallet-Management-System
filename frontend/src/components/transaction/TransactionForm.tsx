import { useMemo, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTransaction } from '../../hooks/useTransaction';
import { formatBalance } from '../../utils/helpers';
import TransactionResult from './TransactionResult';

const TransactionForm = () => {
  const { state } = useAppContext();
  const { loading, handleCreateTransaction } = useTransaction();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const activeWallet = state.wallet;

  const parsedAmount = useMemo(() => Number(amount), [amount]);

  const validate = () => {
    if (!activeWallet) return 'Load or generate a wallet first';
    if (!recipient.trim()) return 'Recipient address is required';
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return 'Amount must be greater than zero';
    if (parsedAmount > activeWallet.balance) return 'Amount exceeds wallet balance';
    if (!password) return 'Password is required';
    return null;
  };

  const onSubmit = async () => {
    setLocalError(null);

    const message = validate();
    if (message) {
      setLocalError(message);
      return;
    }

    const tx = await handleCreateTransaction(
      activeWallet!.address,
      recipient.trim(),
      parsedAmount,
      password
    );

    if (!tx) {
      setLocalError('Failed to submit transaction');
      return;
    }

    setSubmitted(true);
    setRecipient('');
    setAmount('');
    setPassword('');
  };

  if (!activeWallet) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-white/8 bg-slate-900/70 p-6 text-center">
        <p className="text-sm font-mono text-slate-300">No wallet loaded</p>
        <p className="mt-1 text-xs font-mono text-slate-500">Generate or load a wallet to send transactions</p>
      </div>
    );
  }

  if (submitted && state.transactions[0]) {
    return (
      <div className="w-full max-w-md">
        <TransactionResult
          transaction={state.transactions[0]}
          onDismiss={() => setSubmitted(false)}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/8 bg-slate-900/80 p-5">
      <h2 className="mb-4 text-sm font-mono font-bold uppercase tracking-widest text-slate-200">Send Transaction</h2>

      <div className="mb-3">
        <label className="mb-1 block text-[10px] font-mono uppercase tracking-widest text-slate-500">From</label>
        <p className="rounded-lg border border-white/8 bg-white/3 px-3 py-2 text-xs font-mono text-slate-300 break-all">{activeWallet.address}</p>
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-[10px] font-mono uppercase tracking-widest text-slate-500">Recipient</label>
        <input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Recipient wallet address"
          className="w-full rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-xs font-mono text-slate-200 outline-none transition-colors focus:border-violet-400"
        />
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-[10px] font-mono uppercase tracking-widest text-slate-500">Amount</label>
        <input
          type="number"
          min="0"
          step="0.000001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.000000"
          className="w-full rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-xs font-mono text-slate-200 outline-none transition-colors focus:border-violet-400"
        />
        <p className="mt-1 text-[10px] font-mono text-slate-500">Available: {formatBalance(activeWallet.balance)} HPQC</p>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-[10px] font-mono uppercase tracking-widest text-slate-500">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Wallet password"
          className="w-full rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-xs font-mono text-slate-200 outline-none transition-colors focus:border-violet-400"
        />
      </div>

      {(localError || state.error) && (
        <p className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-mono text-red-300">
          {localError || state.error}
        </p>
      )}

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Sending...' : 'Send Transaction'}
      </button>
    </div>
  );
};

export default TransactionForm;
