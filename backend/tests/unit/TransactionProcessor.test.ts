import { describe, it, expect, beforeEach } from '@jest/globals';
import { TransactionProcessor } from '../../src/services/TransactionProcessor';
import { KeyManager } from '../../src/services/KeyManager';

describe('Task 7.10: Unit tests for Transaction Processor', () => {
    let txProcessor: TransactionProcessor;
    let keyManager: KeyManager;

    beforeEach(() => {
        txProcessor = new TransactionProcessor();
        keyManager = new KeyManager();
    });

    it('should correctly construct a transaction', () => {
        const tx = txProcessor.constructTransaction('sender123', 'recipient456', 500, 10);
        
        expect(tx.sender).toBe('sender123');
        expect(tx.recipient).toBe('recipient456');
        expect(tx.amount).toBe(500);
        expect(tx.nonce).toBe(10);
        expect(tx.timestamp).toBeDefined();
    });

    it('should validate inputs properly and reject invalid values', () => {
        // Successful validation
        expect(txProcessor.validateTransactionInputs(1000, 500, 'a'.repeat(40))).toBe(true);

        // Negative or zero amount
        expect(() => { txProcessor.validateTransactionInputs(1000, 0, 'a'.repeat(40)); }).toThrow('greater than zero');
        expect(() => { txProcessor.validateTransactionInputs(1000, -50, 'a'.repeat(40)); }).toThrow('greater than zero');

        // Insufficient balance
        expect(() => { txProcessor.validateTransactionInputs(100, 500, 'a'.repeat(40)); }).toThrow('Insufficient balance');

        // Invalid recipient format (too short)
        expect(() => { txProcessor.validateTransactionInputs(1000, 500, 'short_address'); }).toThrow('Invalid recipient address format');
    });

    it('should extract correct string payload during serialization', () => {
        const tx = txProcessor.constructTransaction('sender123', 'recipient456', 500, 10);
        tx.timestamp = 1675000000;

        const serialized = txProcessor.serializeTransaction(tx);
        expect(serialized).toBe('sender123|recipient456|500|10|1675000000');
    });
});
