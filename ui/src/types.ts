// ─── Shared types for the QuantumVault UI ───────────────────────────────────

export interface PublicKeys {
  ecdsa:     string;
  dilithium: string;
}

export interface WalletData {
  address:   string;
  balance:   number;
  nonce:     number;
  publicKeys: PublicKeys;
}

export interface NewWalletResponse extends WalletData {
  message?: string;
}

export interface ExportVault {
  classical: string;
  pqc:       string;
  salt:      string;
  iv:        string;
  authTag:   string;
}

export interface WalletExport {
  version:          string;
  cryptoType:       string;
  address:          string;
  publicKeys:       PublicKeys;
  encryptedVault:   ExportVault;
}

export interface Transaction {
  txId:       string;
  sender:     string;
  recipient:  string;
  amount:     number;
  nonce:      number;
  timestamp:  string | number;
  status?:    string;
  signatures?: {
    ecdsa?:     string;
    dilithium?: string;
  };
}

export interface TransactionHistoryResponse {
  count:        number;
  transactions: Transaction[];
}

export interface CreateTransactionPayload {
  sender:    string;
  recipient: string;
  amount:    number;
  password:  string;
}

export interface TransactionResult {
  message:     string;
  txId:        string;
  Transaction: Transaction;
}

export interface VerifyTransactionResult {
  message: string;
  txId:    string;
  status:  string;
  details?: unknown;
}

export interface VerifyResult {
  valid:       boolean;
  signatures?: {
    ecdsa:     boolean;
    dilithium: boolean;
  };
  transaction?: Transaction;
}

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id:      string;
  message: string;
  type:    ToastType;
}
