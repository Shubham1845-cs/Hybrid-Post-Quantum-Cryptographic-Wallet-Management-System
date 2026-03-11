import * as fc from 'fast-check';
import { TransactionProcessor } from '../../src/services/TransactionProcessor';

/**
 * Feature: hybrid-pqc-wallet
 * Property 7: Transaction Payload Completeness
 * **Validates: Requirements 3.3**
 *
 * For any valid transaction inputs, constructTransaction() should:
 * - Include all required fields (sender, recipient, amount, nonce, timestamp)
 * - Preserve input values exactly
 * - Produce a timestamp that falls within the time window of the call
 */
describe('Property 7: Transaction Payload Completeness', () => {
  const processor = new TransactionProcessor();

  const senderArbitrary    = fc.hexaString({ minLength: 64, maxLength: 64 });
  const recipientArbitrary = fc.hexaString({ minLength: 64, maxLength: 64 });
  const amountArbitrary    = fc.integer({ min: 1, max: 1000000 });
  const nonceArbitrary     = fc.integer({ min: 0, max: 10000 });

  it('should include all required fields with correct values', () => {
    fc.assert(
      fc.property(
        senderArbitrary,
        recipientArbitrary,
        amountArbitrary,
        nonceArbitrary,
        (sender, recipient, amount, nonce) => {
          const tx = processor.constructTransaction(sender, recipient, amount, nonce);

          return (
            tx.sender    === sender    &&
            tx.recipient === recipient &&
            tx.amount    === amount    &&
            tx.nonce     === nonce     &&
            typeof tx.timestamp === 'number' &&
            tx.timestamp > 0
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should generate a timestamp within the call window', () => {
    fc.assert(
      fc.property(
        senderArbitrary,
        recipientArbitrary,
        amountArbitrary,
        nonceArbitrary,
        (sender, recipient, amount, nonce) => {
          const before = Date.now();
          const tx = processor.constructTransaction(sender, recipient, amount, nonce);
          const after = Date.now();

          return tx.timestamp >= before && tx.timestamp <= after;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should produce distinct transactions for distinct nonces', () => {
    fc.assert(
      fc.property(
        senderArbitrary,
        recipientArbitrary,
        amountArbitrary,
        fc.integer({ min: 0, max: 4999 }),
        fc.integer({ min: 5000, max: 10000 }),
        (sender, recipient, amount, nonce1, nonce2) => {
          fc.pre(nonce1 !== nonce2);
          const tx1 = processor.constructTransaction(sender, recipient, amount, nonce1);
          const tx2 = processor.constructTransaction(sender, recipient, amount, nonce2);

          return tx1.nonce !== tx2.nonce;
        }
      ),
      { numRuns: 100 }
    );
  });
});
