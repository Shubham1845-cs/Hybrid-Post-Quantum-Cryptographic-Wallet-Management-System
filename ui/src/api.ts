// ─── Typed API client — all 6 backend endpoints ─────────────────────────────

import type {
  WalletData,
  WalletExport,
  TransactionHistoryResponse,
  CreateTransactionPayload,
  TransactionResult,
  VerifyResult,
} from './types';

const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      json?.error ||
      json?.message ||
      `HTTP ${res.status}: ${res.statusText}`;
    throw new Error(msg);
  }

  return json as T;
}

// ── Wallet endpoints ──────────────────────────────────────────────────

/** POST /api/wallet/generate */
export function generateWallet(password: string): Promise<WalletData> {
  return request<WalletData>('/wallet/generate', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

/** GET /api/wallet/:address */
export function getWallet(address: string): Promise<WalletData> {
  return request<WalletData>(`/wallet/${encodeURIComponent(address)}`);
}

/** GET /api/wallet/:address/export */
export function exportWallet(address: string): Promise<WalletExport> {
  return request<WalletExport>(`/wallet/${encodeURIComponent(address)}/export`);
}

// ── Transaction endpoints ─────────────────────────────────────────────

/** POST /api/transaction/create */
export function createTransaction(
  payload: CreateTransactionPayload
): Promise<TransactionResult> {
  return request<TransactionResult>('/transaction/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** POST /api/transaction/verify  (body: { txId }) */
export function verifyTransaction(
  txId: string
): Promise<VerifyResult> {
  return request<VerifyResult>('/transaction/verify', {
    method: 'POST',
    body: JSON.stringify({ txId }),
  });
}

/** GET /api/transaction/history/:address */
export function getTransactionHistory(
  address: string
): Promise<TransactionHistoryResponse> {
  return request<TransactionHistoryResponse>(
    `/transaction/history/${encodeURIComponent(address)}`
  );
}
