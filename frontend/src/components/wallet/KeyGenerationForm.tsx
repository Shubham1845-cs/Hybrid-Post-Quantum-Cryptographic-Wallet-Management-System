import { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { getPasswordStrength, type StrengthResult } from '../../utils/passwordStrength';

const KeyGenerationForm = () => {
  // local state
  const [password, setpassword] = useState('');
  const [confirmPassword, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [strength, setStrength] = useState<StrengthResult>(getPasswordStrength(''));

  // global wallet state and actions from context
  const { loading, error, handleGenerateWallet } = useWallet();
  // update password strength as user types
  useEffect(() => {
    setStrength(getPasswordStrength(password));
    // clear the local error  when user start typing
    if (localError) setLocalError(null);
  }, [password]);

  // Validation
  const validate = (): boolean => {
    if (!password) {
      setLocalError('password is required');
      return false;
    }
    if (password.length < 8) {
      setLocalError('password must be at least 8 characters');
      return false;
    }
    if (strength.score < 3) {
      setLocalError('password is too weak');
      return false;
    }
    if (password != confirmPassword) {
      setLocalError('passwords do not match');
      return false;
    }
    return true;
  };

  // generate handler
  const handleGenerate = async () => {
    setLocalError(null);
    setIsSuccess(false);
    if (!validate()) return;
    const success = await handleGenerateWallet(password);

    if (success) {
      setIsSuccess(true);
      setpassword('');
      setConfirm('');
    }
  };

  //whether button should be disabled
  const isDisabled = loading || !password || !confirmPassword;
  return (
    <div className="relative w-full max-w-md">
      {/* ── Card wrapper ─────────────────────────────────────── */}
      <div
        className="relative rounded-2xl overflow-hidden
                      border border-white/[0.08]
                      bg-gradient-to-b from-slate-900/90 to-slate-950/90
                      backdrop-blur-md
                      shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]
                      p-6"
      >
        {/* background glow blob */}
        <div
          className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full
                        bg-violet-600/10 blur-3xl pointer-events-none"
        />
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="relative flex items-center gap-3 mb-6">
          {/* icon box */}
          <div
            className="w-10 h-10 rounded-xl
                          bg-violet-500/10 border border-violet-400/20
                          flex items-center justify-center
                          shadow-[0_0_12px_rgba(124,58,237,0.3)]"
          >
            <span className="text-lg">🔐</span>
          </div>
          <div>
            <h2
              className="text-sm font-mono font-bold text-slate-100
                           tracking-wide uppercase"
            >
              Generate Wallet
            </h2>
            <p className="text-[10px] font-mono text-slate-500 tracking-widest">
              Hybrid ECDSA + Dilithium keypair
            </p>
          </div>
        </div>
        <div className="relative mb-3">
          <label
            className="block text-[10px] font-mono text-slate-400
                            uppercase tracking-widest mb-2"
          >
            Encryption Password
          </label>
          {/* input wrapper — needed for the eye icon inside */}
          <div className="relative group">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              placeholder="Enter a strong password"
              className="w-full bg-white/[0.04] border border-white/[0.1]
                         hover:border-violet-500/40 focus:border-violet-500/60
                         rounded-xl px-4 py-3 pr-12
                         text-sm font-mono text-slate-200
                         placeholder:text-slate-600
                         outline-none transition-all duration-300
                         focus:bg-white/[0.06]
                         focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
            />
            {/* show/hide password toggle */}
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2
                         text-slate-500 hover:text-violet-400
                         transition-colors duration-200
                         text-xs font-mono"
            >
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>
        </div>
        {/* ── Password Strength Bar ───────────────────────────── */}
        {password.length > 0 && (
          <div className="mb-4">
            {/* track */}
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-1">
              {/* fill — width driven by strength.percent */}
              <div
                className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
                style={{ width: `${strength.percent}%` }}
              />
            </div>
            {/* label */}
            <p className={`text-[10px] font-mono tracking-widest ${strength.textColor}`}>
              {strength.label}
            </p>
          </div>
        )}
        {/* ── Confirm Password Input ──────────────────────────── */}
        <div className="relative mb-5">
          <label
            className="block text-[10px] font-mono text-slate-400
                            uppercase tracking-widest mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full bg-white/[0.04] border border-white/[0.1]
                         hover:border-violet-500/40 focus:border-violet-500/60
                         rounded-xl px-4 py-3
                         text-sm font-mono text-slate-200
                         placeholder:text-slate-600
                         outline-none transition-all duration-300
                         focus:bg-white/[0.06]
                         focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
            />

            {/* match indicator — only shows when confirm has value */}
            {confirmPassword.length > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                {password === confirmPassword ? '✓' : '✗'}
              </span>
            )}
          </div>
        </div>

        {/* ── Password Requirements Checklist ─────────────────── */}
        {password.length > 0 && (
          <div className="mb-5 grid grid-cols-2 gap-1">
            {[
              { label: '8+ characters', pass: password.length >= 8 },
              { label: 'Uppercase', pass: /[A-Z]/.test(password) },
              { label: 'Number', pass: /[0-9]/.test(password) },
              { label: 'Special char', pass: /[^A-Za-z0-9]/.test(password) },
            ].map(({ label, pass }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={`text-[10px] ${pass ? 'text-emerald-400' : 'text-slate-600'}`}>
                  {pass ? '✓' : '○'}
                </span>
                <span
                  className={`text-[10px] font-mono transition-colors duration-300
                                  ${pass ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Error Messages ──────────────────────────────────── */}
        {/* local validation error */}
        {localError && (
          <div
            className="mb-4 rounded-lg border border-red-500/20
                          bg-red-500/10 px-3 py-2
                          flex items-center gap-2"
          >
            <span className="text-red-400 text-xs">⚠</span>
            <p className="text-xs font-mono text-red-400">{localError}</p>
          </div>
        )}

        {/* API error from context */}
        {error && !localError && (
          <div
            className="mb-4 rounded-lg border border-red-500/20
                          bg-red-500/10 px-3 py-2
                          flex items-center gap-2"
          >
            <span className="text-red-400 text-xs">⚠</span>
            <p className="text-xs font-mono text-red-400">{error}</p>
          </div>
        )}

        {/* ── Success Message ─────────────────────────────────── */}
        {isSuccess && (
          <div
            className="mb-4 rounded-lg border border-emerald-500/20
                          bg-emerald-500/10 px-3 py-2
                          flex items-center gap-2"
          >
            {/* glowing green dot */}
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400
                             shadow-[0_0_6px_rgba(52,211,153,0.9)]"
            />
            <p className="text-xs font-mono text-emerald-400">Wallet generated successfully!</p>
          </div>
        )}

        {/* ── Generate Button ─────────────────────────────────── */}
        <button
          onClick={handleGenerate}
          disabled={isDisabled}
          className="relative w-full py-3 rounded-xl
                     font-mono font-bold text-sm tracking-widest uppercase
                     transition-all duration-300 overflow-hidden
                     disabled:opacity-40 disabled:cursor-not-allowed
                     disabled:shadow-none
                     enabled:hover:scale-[1.02] enabled:active:scale-[0.98]
                     bg-gradient-to-r from-violet-600 to-indigo-600
                     hover:from-violet-500 hover:to-indigo-500
                     text-white
                     shadow-[0_4px_16px_rgba(124,58,237,0.4)]
                     hover:shadow-[0_6px_24px_rgba(124,58,237,0.6)]"
        >
          {/* shimmer on button */}
          {!isDisabled && (
            <div
              className="absolute inset-0 pointer-events-none
                            bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)]
                            bg-[length:200%_100%] animate-shimmer"
            />
          )}

          {/* button text */}
          <span className="relative">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                {/* inline mini spinner */}
                <span
                  className="w-3 h-3 rounded-full border-2 border-white/30
                                 border-t-white animate-spinRing"
                />
                Generating Keys...
              </span>
            ) : (
              'Generate Wallet'
            )}
          </span>
        </button>

        {/* ── Security note ───────────────────────────────────── */}
        <p
          className="mt-4 text-center text-[10px] font-mono
                      text-slate-600 tracking-wide"
        >
          🔒 Password encrypts your private keys locally
        </p>
      </div>
    </div>
  );
};

export default KeyGenerationForm;
