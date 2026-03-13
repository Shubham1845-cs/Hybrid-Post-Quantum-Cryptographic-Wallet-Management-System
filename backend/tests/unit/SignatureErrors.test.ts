import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { TransactionProcessor } from '../../src/services/TransactionProcessor';
import { SignatureValidator } from '../../src/services/SignatureValidator';
import { Transaction as TransactionModel } from '../../src/models/Transaction';
import { DecryptedKeys } from '../../src/types/crypto.types';

// Mock the DB model to ensure we don't actually write to the DB during failure tests
jest.mock('../../src/models/Transaction', () => ({
    Transaction: {
        create: jest.fn()
    }
}));

describe('Task 13: Signature Error Handling Scenarios', () => {
    let txProcessor: TransactionProcessor;
    let validator: SignatureValidator;

    beforeEach(() => {
        txProcessor = new TransactionProcessor();
        validator = new SignatureValidator();
        jest.clearAllMocks();
    });

    it('13.1 - Should throw an error and abort DB insertion if signature generation fails', async () => {
        const dummyTx = txProcessor.constructTransaction('sender_abc', 'recipient_xyz', 100, 1);
        
        // Provide intentionally corrupted/invalid private keys to force crypto failure
        const invalidKeys = {
            classicalPrivateKey: 'invalid_hex_length' as any, 
            pqcPrivateKey: Buffer.from('invalid_pqc_key')
        };

        await expect(txProcessor.signAndPersistTransaction(dummyTx, invalidKeys))
            .rejects.toThrow(/Transaction signing failed/);

        // Verify the database create method was NEVER called because the signature failed
        expect(TransactionModel.create).not.toHaveBeenCalled();
    });

    it('13.3 - Should gracefully reject and return isValid=false on validation exceptions', async () => {
        // Create an intentionally malformed transaction missing expected fields
        const malformedTx: any = {
            txId: 'abc1234',
            sender: 'sender_abc',
            dualSignature: null // this will trigger a nested error
        };

        const result = await validator.verifyTransaction(malformedTx);

        // Verify it handles the catastrophic failure cleanly via the try-catch block
        expect(result.isValid).toBe(false);
        expect(result.isEcdsaValid).toBe(false);
        expect(result.isDilithiumValid).toBe(false);
        expect(result.error).toMatch(/Missing signature/);
    });
});
