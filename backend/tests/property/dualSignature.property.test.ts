import * as fc from 'fast-check';
import { TransactionProcessor } from '../../src/services/TransactionProcessor';
import { KeyManager } from '../../src/services/KeyManager';
import { ECDSACrypto } from '../../src/services/ECDSACrypto';
import { DilithiumCrypto } from '../../src/services/DilithiumCrypto';

/**
 * Feature: hybrid-pqc-wallet
 * Property 8: Dual Signature Generation
 * **Validates: Requirements 3.4, 3.5, 3.6**
 *
 * For any transaction signed with a valid hybrid key pair:
 * - The signed transaction must contain a non-empty txId (64-char hex)
 * - The ECDSA signature (r, s) must be valid hex strings
 * - The Dilithium signature must be a non-empty Buffer
 * - Both signatures must verify against their respective public keys
 * - Transactions with different payloads must produce different txIds
 */
describe('Property 8: Dual Signature Generation', () => {
  const processor = new TransactionProcessor();
  const keyManager = new KeyManager();
  const ecdsa      = new ECDSACrypto();
  const dilithium  = new DilithiumCrypto();

  // Generate key pair once — ML-DSA key gen is expensive
  const hybridKeyPair = keyManager.generateHybridKeyPair();
  const privateKeys = {
    classicalPrivateKey: hybridKeyPair.privateKey.ecdsa,
    pqcPrivateKey:       hybridKeyPair.privateKey.dilithium,
  };

  const senderArbitrary    = fc.hexaString({ minLength: 64, maxLength: 64 });
  const recipientArbitrary = fc.hexaString({ minLength: 64, maxLength: 64 });
  const amountArbitrary    = fc.integer({ min: 1, max: 1000000 });
  const nonceArbitrary     = fc.integer({ min: 0, max: 10000 });

  it('should produce a SignedTransaction with valid dual-signature structure', () => {
    fc.assert(
      fc.property(
        senderArbitrary,
        recipientArbitrary,
        amountArbitrary,
        nonceArbitrary,
        (sender, recipient, amount, nonce) => {
          const tx     = processor.constructTransaction(sender, recipient, amount, nonce);
          const signed = processor.signTransaction(tx, privateKeys);

          const hasTxId          = typeof signed.txId === 'string' && signed.txId.length === 64;
          const hasEcdsaR        = typeof signed.dualSignature.ecdsa.r === 'string' && signed.dualSignature.ecdsa.r.length > 0;
          const hasEcdsaS        = typeof signed.dualSignature.ecdsa.s === 'string' && signed.dualSignature.ecdsa.s.length > 0;
          const hasDilithium     = Buffer.isBuffer(signed.dualSignature.dilithium) && signed.dualSignature.dilithium.length > 0;

          return hasTxId && hasEcdsaR && hasEcdsaS && hasDilithium;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should produce a verifiable ECDSA signature', () => {
    fc.assert(
      fc.property(
        senderArbitrary,
        recipientArbitrary,
        amountArbitrary,
        nonceArbitrary,
        (sender, recipient, amount, nonce) => {
          const tx     = processor.constructTransaction(sender, recipient, amount, nonce);
          const signed = processor.signTransaction(tx, privateKeys);

          const dataToSign = Buffer.from(signed.txId, 'hex');
          return ecdsa.verify(dataToSign, signed.dualSignature.ecdsa, hybridKeyPair.publicKey.ecdsa);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should produce a verifiable Dilithium signature', () => {
    fc.assert(
      fc.property(
        senderArbitrary,
        recipientArbitrary,
        amountArbitrary,
        nonceArbitrary,
        (sender, recipient, amount, nonce) => {
          const tx     = processor.constructTransaction(sender, recipient, amount, nonce);
          const signed = processor.signTransaction(tx, privateKeys);

          const dataToSign = Buffer.from(signed.txId, 'hex');
          return dilithium.verify(dataToSign, signed.dualSignature.dilithium, hybridKeyPair.publicKey.dilithium);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should produce different txIds for transactions with different payloads', () => {
    fc.assert(
      fc.property(
        senderArbitrary,
        recipientArbitrary,
        fc.integer({ min: 1, max: 499999 }),
        fc.integer({ min: 500000, max: 1000000 }),
        nonceArbitrary,
        (sender, recipient, amount1, amount2, nonce) => {
          fc.pre(amount1 !== amount2);
          const tx1 = processor.constructTransaction(sender, recipient, amount1, nonce);
          const tx2 = processor.constructTransaction(sender, recipient, amount2, nonce);

          // Force same timestamp to isolate the amount difference
          tx2.timestamp = tx1.timestamp;

          const signed1 = processor.signTransaction(tx1, privateKeys);
          const signed2 = processor.signTransaction(tx2, privateKeys);

          return signed1.txId !== signed2.txId;
        }
      ),
      { numRuns: 20 }
    );
  });
});
