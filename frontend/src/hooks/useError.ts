// ─── Centralized error logic hook ────────────────────────────────────────────
import { useState, useCallback } from 'react';
import { useAppContext }          from '../context/AppContext';
import type { Toast } from '../types/error.types';
import { buildAppError, generateToastId } from '../utils/errorUtils';

export const useError = () => {
  const { state, dispatch }   = useAppContext();
  const [toasts, setToasts]   = useState<Toast[]>([]);

  // ── Clear global error ───────────────────────────────────────────────────
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, [dispatch]);

  // ── Set global error ─────────────────────────────────────────────────────
  const setError = useCallback((message: string) => {
    dispatch({ type: 'SET_ERROR', payload: message });
  }, [dispatch]);

  // ── Build full AppError from current state.error ─────────────────────────
  const appError = state.error
    ? buildAppError(state.error)
    : null;

  // ── Show a toast (auto-dismisses after duration ms) ──────────────────────
  const showToast = useCallback((
    message:  string,
    severity: Toast['severity'] = 'error',
    duration: number            = 4000
  ) => {
    const id    = generateToastId();
    const toast: Toast = { id, message, severity };

    // add to toasts array
    setToasts((prev) => [...prev, toast]);

    // auto remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  // ── Manually dismiss a toast ─────────────────────────────────────────────
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    error:        state.error,     // raw error string from context
    appError,                       // processed AppError object
    clearError,
    setError,
    toasts,
    showToast,
    dismissToast,
  };
};