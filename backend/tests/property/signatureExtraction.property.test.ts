import * as fc from 'fast-check';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { TransactionProcessor } from '../../src/services/TransactionProcessor';
import { KeyManager } from '../../src/services/KeyManager';

describe('Task 8.2: Signature Extraction Property Tests', () => {
    let processor: TransactionProcessor;
    let keyManager: KeyManager;
    let keys: any;

    beforeAll(() => {
        processor = new TransactionProcessor();
        keyManager = new KeyManager();
        keys = keyManager.generateHybridKeyPair();
    });

    it('8.2 - Should extract and isolate ECDSA and Dilithium signatures from valid transactions', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 10, maxLength: 50 }),
                (mockRecipient) => {
                    const tx = processor.constructTransaction(keys.walletAddress, mockRecipient, 50, 1);
                    const privateKeys = {
                        classicalPrivateKey: keys.privateKey.ecdsa,
                        pqcPrivateKey: keys.privateKey.dilithium
                    };

                    const signedTx = processor.signTransaction(tx, privateKeys);

                    // Property: Extraction
                    // A dual signature must correctly encapsulate exactly two distinctive, recoverable formats
                    const extractedEcdsa = signedTx.dualSignature?.ecdsa;
                    const extractedDilithium = signedTx.dualSignature?.dilithium;

                    const isEcdsaExtracted = extractedEcdsa && typeof extractedEcdsa.r === 'string' && typeof extractedEcdsa.s === 'string';
                    const isDilithiumExtracted = extractedDilithium && Buffer.isBuffer(extractedDilithium);

                    return isEcdsaExtracted && isDilithiumExtracted;
                }
            ),
            { numRuns: 20 }
        );
    });
});
