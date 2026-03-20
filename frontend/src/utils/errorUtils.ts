// ─── All error processing logic ───────────────────────────────────────────────
import  type { ErrorCategory, ErrorSeverity, AppError } from '../types/error.types';

// ─── Raw message → human friendly message ────────────────────────────────────
const friendlyMessages: Array<{ match: string; friendly: string }> = [
  {
    match:    'network error',
    friendly: 'Cannot reach the server. Check your internet connection.',
  },
  {
    match:    'failed to fetch',
    friendly: 'Cannot connect to server. Make sure the backend is running.',
  },
  {
    match:    'wallet not found',
    friendly: 'Wallet not found. Double-check the address and try again.',
  },
  {
    match:    'invalid password',
    friendly: 'Incorrect password. Please try again.',
  },
  {
    match:    'insufficient balance',
    friendly: 'Not enough balance to complete this transaction.',
  },
  {
    match:    'invalid signature',
    friendly: 'Transaction signature is invalid. The transaction was rejected.',
  },
  {
    match:    'invalid address',
    friendly: 'The recipient address is not valid. Must be a 64-character hex string.',
  },
  {
    match:    'server error',
    friendly: 'Something went wrong on the server. Please try again shortly.',
  },
  {
    match:    '500',
    friendly: 'Internal server error. Please try again later.',
  },
  {
    match:    '404',
    friendly: 'The requested resource was not found.',
  },
  {
    match:    '401',
    friendly: 'Authentication failed. Check your credentials.',
  },
  {
    match:    'timeout',
    friendly: 'The request took too long. Check your connection and try again.',
  },
];

export const getFriendlyMessage = (raw: string): string => {
  const lower = raw.toLowerCase();
  for (const { match, friendly } of friendlyMessages) {
    if (lower.includes(match)) return friendly;
  }
  return raw; // fallback — show original if no match found
};

// ─── Raw message → error category ────────────────────────────────────────────
export const getErrorCategory = (raw: string): ErrorCategory => {
  const lower = raw.toLowerCase();
  if (lower.includes('network') || lower.includes('fetch') || lower.includes('timeout'))
    return 'network';
  if (lower.includes('password') || lower.includes('auth') || lower.includes('401'))
    return 'auth';
  if (lower.includes('not found') || lower.includes('404'))
    return 'not_found';
  if (lower.includes('500') || lower.includes('server error'))
    return 'server';
  if (lower.includes('invalid') || lower.includes('validation'))
    return 'validation';
  return 'unknown';
};

// ─── Category → severity ─────────────────────────────────────────────────────
export const getErrorSeverity = (category: ErrorCategory): ErrorSeverity => {
  if (category === 'network' || category === 'server') return 'error';
  if (category === 'auth'    || category === 'not_found') return 'warning';
  return 'error';
};

// ─── Build full AppError from raw string ─────────────────────────────────────
export const buildAppError = (raw: string): AppError => {
  const category = getErrorCategory(raw);
  const severity = getErrorSeverity(category);
  const friendly = getFriendlyMessage(raw);
  return { raw, friendly, category, severity };
};

// ─── Category → icon ─────────────────────────────────────────────────────────
export const getErrorIcon = (category: ErrorCategory): string => {
  const icons: Record<ErrorCategory, string> = {
    network:    '📡',
    auth:       '🔑',
    validation: '⚠',
    not_found:  '🔍',
    server:     '🖥',
    unknown:    '⚠',
  };
  return icons[category];
};

// ─── Generate unique toast id ─────────────────────────────────────────────────
export const generateToastId = (): string => {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
};