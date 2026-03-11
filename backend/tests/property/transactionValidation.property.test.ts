import * as fc from 'fast-check';
import { TransactionProcessor } from '../../src/services/TransactionProcessor';

/**
 * Feature: hybrid-pqc-wallet
 * Property 6: Transaction Input Validation
 * **Validates: Requirements 3.1, 3.2, 10.6, 10.7**
 *
 * For any set of transaction inputs, the validator should:
 * - Reject non-positive amounts
 * - Reject amounts that exceed the sender's balance
 * - Reject recipient addresses shorter than 40 characters
 * - Accept all inputs that satisfy every constraint
 */
describe('Property 6: Transaction Input Validation', () => {
  const processor = new TransactionProcessor();

  const validAddressArbitrary = fc.hexaString({ minLength: 64, maxLength: 64 });

  it('should reject non-positive amounts', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 0 }).chain(() => fc.oneof(
          fc.constant(0),
          fc.integer({ min: -1000000, max: -1 })
        )),
        fc.integer({ min: 1, max: 1000000 }),
        validAddressArbitrary,
        (amount, balance, address) => {
          try {
            processor.validateTransactionInputs(balance, amount, address);
            return false; // should have thrown
          } catch {
            return true;
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject amount exceeding sender balance', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 999999 }),
        fc.integer({ min: 1, max: 1000000 }),
        validAddressArbitrary,
        (balance, extraAmount, address) => {
          const amount = balance + extraAmount; // always > balance
          try {
            processor.validateTransactionInputs(balance, amount, address);
            return false;
          } catch {
            return true;
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject recipient addresses shorter than 40 characters', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 1000000 }),
        fc.integer({ min: 1, max: 999 }),
        fc.string({ maxLength: 39 }),
        (balance, amount, shortAddress) => {
          fc.pre(amount <= balance);
          try {
            processor.validateTransactionInputs(balance, amount, shortAddress);
            return false;
          } catch {
            return true;
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should accept valid transaction inputs and return true', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 1000000 }),
        fc.integer({ min: 1, max: 999 }),
        validAddressArbitrary,
        (balance, amount, address) => {
          fc.pre(amount <= balance);
          try {
            return processor.validateTransactionInputs(balance, amount, address) === true;
          } catch {
            return false;
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
