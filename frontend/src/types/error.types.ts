// ─── All error-related TypeScript types ──────────────────────────────────────

export type ErrorSeverity = 'error' | 'warning' | 'info';

export type ErrorCategory =
  | 'network'
  | 'auth'
  | 'validation'
  | 'not_found'
  | 'server'
  | 'unknown';

// shape of a fully processed error
export interface AppError {
  raw:       string;        // original error message
  friendly:  string;        // human readable version
  category:  ErrorCategory;
  severity:  ErrorSeverity;
  recovery?: RecoveryOption[];
}

// a single recovery button
export interface RecoveryOption {
  label:   string;
  variant: 'primary' | 'ghost'; // button style
  action:  () => void;
}

// shape of a toast notification
export interface Toast {
  id:       string;
  message:  string;
  severity: ErrorSeverity;
}