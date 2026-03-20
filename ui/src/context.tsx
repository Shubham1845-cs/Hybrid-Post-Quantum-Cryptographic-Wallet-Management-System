// ─── Global app context: active wallet + toast notifications ─────────────────

import {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react';
import type { ReactNode } from 'react';
import type { WalletData, Toast, ToastType } from './types';

// ── Wallet context ────────────────────────────────────────────────────────────

interface WalletCtx {
  wallet:    WalletData | null;
  setWallet: (w: WalletData | null) => void;
}

const WalletContext = createContext<WalletCtx>({
  wallet:    null,
  setWallet: () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}

// ── Toast context ─────────────────────────────────────────────────────────────

interface ToastCtx {
  toasts:  Toast[];
  addToast:(message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastCtx>({
  toasts:   [],
  addToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [toasts, setToasts]  = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      <ToastContext.Provider value={{ toasts, addToast }}>
        {children}
      </ToastContext.Provider>
    </WalletContext.Provider>
  );
}
