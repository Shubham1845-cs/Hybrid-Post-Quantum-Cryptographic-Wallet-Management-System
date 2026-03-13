import * as fc from 'fast-check';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { TransactionProcessor } from '../../src/services/TransactionProcessor';
import { KeyManager } from '../../src/services/KeyManager';
import { Transaction } from '../../src/models/Transaction';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Transaction.deleteMany({});
});

describe('Task 12.2: Transaction Persistence Property Tests', () => {
    let processor: TransactionProcessor;
    let keyManager: KeyManager;
    let keys: any;

    beforeAll(() => {
        processor = new TransactionProcessor();
        keyManager = new KeyManager();
        keys = keyManager.generateHybridKeyPair();
    });

    it('12.2 - Should successfully persist signed transactions to DB and retrieve identically', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.string({ minLength: 40, maxLength: 64 }),
                fc.integer({ min: 1, max: 1000 }),
                async (mockRecipient, mockAmount) => {
                    const tx = processor.constructTransaction(keys.walletAddress, mockRecipient, mockAmount, 0);
                    const privateKeys = {
                        classicalPrivateKey: keys.privateKey.ecdsa,
                        pqcPrivateKey: keys.privateKey.dilithium
                    };

                    const signedTx = await processor.signAndPersistTransaction(tx, privateKeys);

                    // Retrieve
                    const retrievedTx = await processor.getTransactionByHash(signedTx.txId);

                    const amountsMatch = retrievedTx.amount === signedTx.amount;
                    const signaturesMatch = retrievedTx.dualSignature.ecdsa.r === signedTx.dualSignature.ecdsa.r;

                    return amountsMatch && signaturesMatch;
                }
            ),
            { numRuns: 10 }
        );
    });
});
