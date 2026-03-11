import { SignatureValidator } from '../../src/services/SignatureValidator'
import { KeyManager } from '../../src/services/KeyManager'
import { TransactionProcessor } from '../../src/services/TransactionProcessor'
import { HybridKeyPair } from '../../src/types/crypto.types'
import { SignedTransaction } from '../../src/types/transaction.types'
import { Wallet } from '../../src/models/Wallet'

describe('SignatureValidator Unit Tests', () => {
    const validator  = new SignatureValidator()
    const keyManager = new KeyManager()
    const processor  = new TransactionProcessor()

    let hybridKeyPair: HybridKeyPair

    // Generate key pair once — ML-DSA key gen is expensive
    beforeAll(() => {
        hybridKeyPair = keyManager.generateHybridKeyPair()
    })

    // Re-insert the wallet before each test because afterEach (in setup.ts) clears the DB
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
            balance: 1000,
            nonce:   0
        })
    })

    // Helper: construct and sign a tx using the stored wallet's keys
    function makeSignedTx(overrides: Partial<{ sender: string; amount: number; recipient: string; nonce: number }> = {}): SignedTransaction {
        const tx = processor.constructTransaction(
            overrides.sender    ?? hybridKeyPair.walletAddress,
            overrides.recipient ?? 'a'.repeat(64),
            overrides.amount    ?? 100,
            overrides.nonce     ?? 0
        )
        return processor.signTransaction(tx, {
            classicalPrivateKey: hybridKeyPair.privateKey.ecdsa,
            pqcPrivateKey:       hybridKeyPair.privateKey.dilithium
        })
    }

    describe('verifyTransaction — valid cases', () => {
        it('should verify a correctly signed transaction', async () => {
            const signed = makeSignedTx()
            const result = await validator.verifyTransaction(signed)

            expect(result.isValid).toBe(true)
            expect(result.isEcdsaValid).toBe(true)
            expect(result.isDilithiumValid).toBe(true)
            expect(result.error).toBeUndefined()
        })

        it('should verify transactions with different amounts', async () => {
            for (const amount of [1, 50, 999]) {
                const signed = makeSignedTx({ amount })
                const result = await validator.verifyTransaction(signed)
                expect(result.isValid).toBe(true)
            }
        })
    })

    describe('verifyTransaction — missing signatures (8.5)', () => {
        it('should reject when ECDSA r is empty', async () => {
            const signed = makeSignedTx()
            signed.dualSignature.ecdsa.r = ''
            const result = await validator.verifyTransaction(signed)

            expect(result.isValid).toBe(false)
            expect(result.error).toMatch(/Missing signature/)
        })

        it('should reject when ECDSA s is empty', async () => {
            const signed = makeSignedTx()
            signed.dualSignature.ecdsa.s = ''
            const result = await validator.verifyTransaction(signed)

            expect(result.isValid).toBe(false)
            expect(result.error).toMatch(/Missing signature/)
        })

        it('should reject when Dilithium signature is empty buffer', async () => {
            const signed = makeSignedTx()
            signed.dualSignature.dilithium = Buffer.alloc(0)
            const result = await validator.verifyTransaction(signed)

            expect(result.isValid).toBe(false)
            expect(result.error).toMatch(/Missing signature/)
        })
    })

    describe('verifyTransaction — unknown sender', () => {
        it('should reject a transaction from a sender not in the database', async () => {
            const signed = makeSignedTx({ sender: 'f'.repeat(64) })
            const result = await validator.verifyTransaction(signed)

            expect(result.isValid).toBe(false)
            expect(result.error).toMatch(/not found/)
        })
    })

    describe('verifyTransaction — tamper detection (8.7)', () => {
        it('should reject when amount is changed after signing', async () => {
            const signed  = makeSignedTx()
            signed.amount = 9999         // tampered
            const result  = await validator.verifyTransaction(signed)

            expect(result.isValid).toBe(false)
            expect(result.error).toMatch(/tampered/)
        })

        it('should reject when recipient is changed after signing', async () => {
            const signed     = makeSignedTx()
            signed.recipient = 'b'.repeat(64)   // tampered
            const result     = await validator.verifyTransaction(signed)

            expect(result.isValid).toBe(false)
            expect(result.error).toMatch(/tampered/)
        })

        it('should reject when nonce is changed after signing', async () => {
            const signed = makeSignedTx()
            signed.nonce = 99            // tampered
            const result = await validator.verifyTransaction(signed)

            expect(result.isValid).toBe(false)
            expect(result.error).toMatch(/tampered/)
        })

        it('should reject when timestamp is changed after signing', async () => {
            const signed     = makeSignedTx()
            signed.timestamp = 0         // tampered
            const result     = await validator.verifyTransaction(signed)

            expect(result.isValid).toBe(false)
            expect(result.error).toMatch(/tampered/)
        })
    })

    describe('verifyTransaction — corrupted signatures', () => {
        it('should reject a corrupted ECDSA signature', async () => {
            const signed = makeSignedTx()
            signed.dualSignature.ecdsa.r = 'deadbeef'.repeat(8)
            signed.dualSignature.ecdsa.s = 'cafebabe'.repeat(8)
            const result = await validator.verifyTransaction(signed)

            expect(result.isValid).toBe(false)
            expect(result.isEcdsaValid).toBe(false)
        })

        it('should reject a corrupted Dilithium signature', async () => {
            const signed    = makeSignedTx()
            const corrupted = Buffer.from(signed.dualSignature.dilithium)
            corrupted[0]   ^= 0xff
            corrupted[1]   ^= 0xff
            signed.dualSignature.dilithium = corrupted
            const result = await validator.verifyTransaction(signed)

            expect(result.isValid).toBe(false)
            expect(result.isDilithiumValid).toBe(false)
        })
    })

    describe('validateNonce (8.7)', () => {
        it('should return true when transaction nonce matches expected', () => {
            const signed = makeSignedTx({ nonce: 5 })
            expect(validator.validateNonce(signed, 5)).toBe(true)
        })

        it('should return false when nonce is below expected (replay attack)', () => {
            const signed = makeSignedTx({ nonce: 4 })
            expect(validator.validateNonce(signed, 5)).toBe(false)
        })

        it('should return false when nonce is above expected (future nonce)', () => {
            const signed = makeSignedTx({ nonce: 6 })
            expect(validator.validateNonce(signed, 5)).toBe(false)
        })
    })
})
