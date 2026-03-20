import crypto from 'crypto'
import { ECDSACrypto } from './ECDSACrypto'
import { DilithiumCrypto } from './DilithiumCrypto'
import { TransactionProcessor } from './TransactionProcessor'
import { SignedTransaction, VerifaicationResult } from '../types/transaction.types'
import { Wallet } from '../models/Wallet'

export class SignatureValidator {
    private ecdsa     = new ECDSACrypto()
    private dilithium = new DilithiumCrypto()
    private processor = new TransactionProcessor()

    // 8.1 — main entry point
    async verifyTransaction(signedTx: SignedTransaction): Promise<VerifaicationResult> {
        try {
            // 8.5 — guard: both signatures must be present and non-empty
            if (
                !signedTx.dualSignature?.ecdsa?.r ||
                !signedTx.dualSignature?.ecdsa?.s ||
                !signedTx.dualSignature?.dilithium ||
                signedTx.dualSignature.dilithium.length === 0
            ) {
                return {
                    isValid: false,
                    isEcdsaValid: false,
                    isDilithiumValid: false,
                    error: 'Missing signature: both ECDSA and Dilithium signatures are required'
                }
            }

            // 8.1 — fetch sender public keys from database
            // Note: do NOT use .lean() — Mongoose must handle Buffer type conversion
            // so crypto.createPublicKey() receives a proper Node.js Buffer, not a
            // BSON Binary object (which .lean() returns for Binary/Buffer schema fields).
            const wallet = await Wallet.findOne({ address: signedTx.sender.toLowerCase() })
            if (!wallet) {
                return {
                    isValid: false,
                    isEcdsaValid: false,
                    isDilithiumValid: false,
                    error: `Sender wallet not found: ${signedTx.sender}`
                }
            }

            // 8.7 — tamper detection: re-derive txId from the raw transaction fields
            // If any field was changed after signing the recomputedTxId will not match
            // Note: Convert timestamp back to number format for consistent hashing
            const timestampValue = signedTx.timestamp instanceof Date
                ? signedTx.timestamp.getTime()
                : signedTx.timestamp;

            const baseTx = {
                sender:    signedTx.sender,
                recipient: signedTx.recipient,
                amount:    signedTx.amount,
                nonce:     signedTx.nonce,
                timestamp: timestampValue
            }
            const serialized     = this.processor.serializeTransaction(baseTx)
            const recomputedTxId = crypto.createHash('sha256').update(serialized).digest('hex')

            if (recomputedTxId !== signedTx.txId) {
                return {
                    isValid: false,
                    isEcdsaValid: false,
                    isDilithiumValid: false,
                    error: 'Transaction payload has been tampered with'
                }
            }

            // The same 32 raw bytes that TransactionProcessor.signTransaction signed
            const dataToVerify = Buffer.from(signedTx.txId, 'hex')

            // 8.3 — verify each signature independently
            const isEcdsaValid = this.verifyClassicalSignature(
                dataToVerify,
                signedTx.dualSignature.ecdsa,
                Buffer.from(wallet.publicKeys.ecdsa)
            )
            const isDilithiumValid = this.verifyPQCSignature(
                dataToVerify,
                signedTx.dualSignature.dilithium,
                Buffer.from(wallet.publicKeys.dilithium)
            )

            // 8.5 — both must pass; either failing marks the transaction invalid
            const isValid = isEcdsaValid && isDilithiumValid
            return { isValid, isEcdsaValid, isDilithiumValid }

        } catch (e) {
            // 13.3 - Log failure reasons and return descriptive error
            const errorMessage = e instanceof Error ? e.message : 'Unknown cryptographic validation error';
            
            console.error(`[Signature Verification Error]: Validation failed for TxID ${signedTx.txId || 'unknown'}`);
            console.error(`Reason: ${errorMessage}`);
            
            // 13.3 - Implement rejection logic for failed verification
            return { 
                isValid: false, 
                isEcdsaValid: false, 
                isDilithiumValid: false, 
                error: `Verification rejected: ${errorMessage}` 
            };
        }
    }

    // 8.3 — classical ECDSA verification
    private verifyClassicalSignature(
        data:      Buffer,
        signature: { r: string; s: string },
        publicKey: Buffer
    ): boolean {
        try {
            return this.ecdsa.verify(data, signature, publicKey)
        } catch {
            return false
        }
    }

    // 8.3 — post-quantum Dilithium verification
    private verifyPQCSignature(
        data:      Buffer,
        signature: Buffer,
        publicKey: Buffer
    ): boolean {
        try {
            return this.dilithium.verify(data, signature, publicKey)
        } catch {
            return false
        }
    }

    // 8.7 — replay protection: signed tx nonce must equal the expected counter
    validateNonce(signedTx: SignedTransaction, expectedNonce: number): boolean {
        return signedTx.nonce === expectedNonce
    }
}
