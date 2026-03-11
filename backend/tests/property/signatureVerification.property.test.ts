import * as fc from 'fast-check'
import { SignatureValidator } from '../../src/services/SignatureValidator'
import { KeyManager } from '../../src/services/KeyManager'
import { TransactionProcessor } from '../../src/services/TransactionProcessor'
import { HybridKeyPair } from '../../src/types/crypto.types'
import { Wallet } from '../../src/models/Wallet'

/**
 * Feature: hybrid-pqc-wallet
 * Properties 11, 12, 13: Signature Verification
 * **Validates: Requirements 4.2, 4.3, 4.4, 4.5, 4.6**
 */
describe('Signature Verification Property Tests', () => {
    const validator  = new SignatureValidator()
    const keyManager = new KeyManager()
    const processor  = new TransactionProcessor()

    let hybridKeyPair: HybridKeyPair

    const senderArbitrary    = fc.hexaString({ minLength: 64, maxLength: 64 })
    const recipientArbitrary = fc.hexaString({ minLength: 64, maxLength: 64 })
    const amountArbitrary    = fc.integer({ min: 1, max: 1000000 })
    const nonceArbitrary     = fc.integer({ min: 0, max: 10000 })

    // Generate hybrid key pair once — ML-DSA key gen is expensive
    beforeAll(() => {
        hybridKeyPair = keyManager.generateHybridKeyPair()
    })

    // Re-insert the wallet before each test because setup.ts clears the DB after each it()
    beforeEach(async () => {
        await Wallet.create({
            address:   hybridKeyPair.walletAddress,
            publicKeys: {
                ecdsa:     hybridKeyPair.publicKey.ecdsa,
                dilithium: hybridKeyPair.publicKey.dilithium
            },
            encryptedPrivateKeys: {
                encryptedClassical: Buffer.alloc(1),
                encryptedPQC:       Buffer.alloc(1),
                iv:                 Buffer.alloc(16),
                authTag:            Buffer.alloc(16),
                salt:               Buffer.alloc(32)
            },
            balance: 1000000,
            nonce:   0
        })
    })

    /**
     * Property 11: Valid Signature Verification
     * For any transaction signed with a valid key pair, verifyTransaction must succeed.
     */
    it('Property 11: should verify any correctly signed transaction (8.4*)', async () => {
        await fc.assert(
            fc.asyncProperty(
                recipientArbitrary,
                amountArbitrary,
                nonceArbitrary,
                async (recipient, amount, nonce) => {
                    const tx = processor.constructTransaction(
                        hybridKeyPair.walletAddress,
                        recipient,
                        amount,
                        nonce
                    )
                    const signed = processor.signTransaction(tx, {
                        classicalPrivateKey: hybridKeyPair.privateKey.ecdsa,
                        pqcPrivateKey:       hybridKeyPair.privateKey.dilithium
                    })

                    const result = await validator.verifyTransaction(signed)
                    return result.isValid && result.isEcdsaValid && result.isDilithiumValid
                }
            ),
            { numRuns: 10 }   // signing is expensive — 10 full sign+verify cycles
        )
    })

    /**
     * Property 12: Invalid Signature Rejection
     * Any transaction with a corrupted signature must be rejected.
     * Tests both ECDSA and Dilithium corruption independently.
     */
    it('Property 12: should reject any transaction with a corrupted ECDSA signature (8.6*)', async () => {
        await fc.assert(
            fc.asyncProperty(
                recipientArbitrary,
                amountArbitrary,
                nonceArbitrary,
                fc.hexaString({ minLength: 64, maxLength: 64 }),
                async (recipient, amount, nonce, badHex) => {
                    const tx = processor.constructTransaction(
                        hybridKeyPair.walletAddress,
                        recipient,
                        amount,
                        nonce
                    )
                    const signed = processor.signTransaction(tx, {
                        classicalPrivateKey: hybridKeyPair.privateKey.ecdsa,
                        pqcPrivateKey:       hybridKeyPair.privateKey.dilithium
                    })

                    // Replace ECDSA signature with random bytes
                    signed.dualSignature.ecdsa.r = badHex
                    signed.dualSignature.ecdsa.s = badHex

                    const result = await validator.verifyTransaction(signed)
                    return !result.isValid && !result.isEcdsaValid
                }
            ),
            { numRuns: 10 }
        )
    })

    it('Property 12: should reject any transaction with a corrupted Dilithium signature (8.6*)', async () => {
        await fc.assert(
            fc.asyncProperty(
                recipientArbitrary,
                amountArbitrary,
                nonceArbitrary,
                async (recipient, amount, nonce) => {
                    const tx = processor.constructTransaction(
                        hybridKeyPair.walletAddress,
                        recipient,
                        amount,
                        nonce
                    )
                    const signed = processor.signTransaction(tx, {
                        classicalPrivateKey: hybridKeyPair.privateKey.ecdsa,
                        pqcPrivateKey:       hybridKeyPair.privateKey.dilithium
                    })

                    // Flip the first two bytes of the Dilithium signature
                    const corrupted = Buffer.from(signed.dualSignature.dilithium)
                    corrupted[0] ^= 0xff
                    corrupted[1] ^= 0xff
                    signed.dualSignature.dilithium = corrupted

                    const result = await validator.verifyTransaction(signed)
                    return !result.isValid && !result.isDilithiumValid
                }
            ),
            { numRuns: 10 }
        )
    })

    /**
     * Property 13: Transaction Tamper Detection
     * Any modification to a signed transaction's payload must be detected.
     */
    it('Property 13: should detect tampering in any transaction field (8.8*)', async () => {
        await fc.assert(
            fc.asyncProperty(
                recipientArbitrary,
                amountArbitrary,
                nonceArbitrary,
                fc.integer({ min: 1, max: 500000 }),      // tampered amount (always different)
                async (recipient, amount, nonce, tamperedAmount) => {
                    fc.pre(tamperedAmount !== amount)

                    const tx = processor.constructTransaction(
                        hybridKeyPair.walletAddress,
                        recipient,
                        amount,
                        nonce
                    )
                    const signed = processor.signTransaction(tx, {
                        classicalPrivateKey: hybridKeyPair.privateKey.ecdsa,
                        pqcPrivateKey:       hybridKeyPair.privateKey.dilithium
                    })

                    // Tamper the amount after signing
                    signed.amount = tamperedAmount

                    const result = await validator.verifyTransaction(signed)
                    return (
                        !result.isValid &&
                        result.error !== undefined &&
                        result.error.includes('tampered')
                    )
                }
            ),
            { numRuns: 10 }
        )
    })

    /**
     * Property 13 (cont.): validateNonce rejects any nonce that does not match the expected value.
     */
    it('Property 13: validateNonce should only accept the exact expected nonce (8.8*)', () => {
        fc.assert(
            fc.property(
                nonceArbitrary,
                nonceArbitrary,
                (txNonce, expectedNonce) => {
                    const tx = processor.constructTransaction(
                        hybridKeyPair.walletAddress,
                        'a'.repeat(64),
                        1,
                        txNonce
                    )
                    const signed = processor.signTransaction(tx, {
                        classicalPrivateKey: hybridKeyPair.privateKey.ecdsa,
                        pqcPrivateKey:       hybridKeyPair.privateKey.dilithium
                    })

                    const result = validator.validateNonce(signed, expectedNonce)
                    return result === (txNonce === expectedNonce)
                }
            ),
            { numRuns: 20 }
        )
    })
})
