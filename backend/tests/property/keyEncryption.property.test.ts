import * as fc from 'fast-check';
import { KeyManager } from '../../src/services/KeyManager';

/**
 * Feature: hybrid-pqc-wallet
 * Property 3: Private Key Storage Encryption
 * **Validates: Requirements 1.5, 5.2**
 * 
 * For any generated Hybrid_Key_Pair, when stored in the database, both private keys 
 * should be in encrypted format and not recoverable without the encryption password.
 */
describe('Property 3: Private Key Storage Encryption', () => {
  const keyManager = new KeyManager();

  // Custom arbitraries for generating test data
  const privateKeyArbitrary = fc.uint8Array({ minLength: 32, maxLength: 1024 });
  const passwordArbitrary = fc.string({ minLength: 8, maxLength: 64 });

  it('should encrypt keys differently from original private keys', () => {
    fc.assert(
      fc.property(
        privateKeyArbitrary,
        privateKeyArbitrary,
        passwordArbitrary,
        (classicalPriv, pqcPriv, password) => {
          const classicalBuffer = Buffer.from(classicalPriv);
          const pqcBuffer = Buffer.from(pqcPriv);

          const encrypted = keyManager.encryptPrivateKeys(
            classicalBuffer,
            pqcBuffer,
            password
          );

          // Encrypted data should not equal original private keys
          const encryptedDataNotEqualClassical = !encrypted.encryptedClassical.equals(classicalBuffer);
          const encryptedDataNotEqualPQC = !encrypted.encryptedClassical.equals(pqcBuffer);

          // Encrypted data should have authentication components
          const hasIV = encrypted.iv.length > 0;
          const hasAuthTag = encrypted.authTag.length > 0;
          const hasSalt = encrypted.salt.length > 0;

          return (
            encryptedDataNotEqualClassical &&
            encryptedDataNotEqualPQC &&
            hasIV &&
            hasAuthTag &&
            hasSalt
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should decrypt with correct password to recover original keys', () => {
    fc.assert(
      fc.property(
        privateKeyArbitrary,
        privateKeyArbitrary,
        passwordArbitrary,
        (classicalPriv, pqcPriv, password) => {
          const classicalBuffer = Buffer.from(classicalPriv);
          const pqcBuffer = Buffer.from(pqcPriv);

          // Encrypt the keys
          const encrypted = keyManager.encryptPrivateKeys(
            classicalBuffer,
            pqcBuffer,
            password
          );

          // Decrypt with the same password
          const decrypted = keyManager.decryptPrivateKeys(encrypted, password);

          // Decrypted keys should match original keys
          const classicalMatches = decrypted.classicalPrivateKey.equals(classicalBuffer);
          const pqcMatches = decrypted.pqcPrivateKey.equals(pqcBuffer);

          return classicalMatches && pqcMatches;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should fail to decrypt with wrong password', () => {
    fc.assert(
      fc.property(
        privateKeyArbitrary,
        privateKeyArbitrary,
        passwordArbitrary,
        passwordArbitrary,
        (classicalPriv, pqcPriv, correctPassword, wrongPassword) => {
          // Ensure passwords are different
          fc.pre(correctPassword !== wrongPassword);

          const classicalBuffer = Buffer.from(classicalPriv);
          const pqcBuffer = Buffer.from(pqcPriv);

          // Encrypt with correct password
          const encrypted = keyManager.encryptPrivateKeys(
            classicalBuffer,
            pqcBuffer,
            correctPassword
          );

          // Attempt to decrypt with wrong password should throw
          try {
            keyManager.decryptPrivateKeys(encrypted, wrongPassword);
            // If decryption succeeds, the test should fail
            return false;
          } catch (error) {
            // Decryption should fail with wrong password
            return true;
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not recover keys from encrypted data without password', () => {
    fc.assert(
      fc.property(
        privateKeyArbitrary,
        privateKeyArbitrary,
        passwordArbitrary,
        (classicalPriv, pqcPriv, password) => {
          const classicalBuffer = Buffer.from(classicalPriv);
          const pqcBuffer = Buffer.from(pqcPriv);

          const encrypted = keyManager.encryptPrivateKeys(
            classicalBuffer,
            pqcBuffer,
            password
          );

          // Encrypted data should not contain the original keys in plaintext
          const encryptedData = encrypted.encryptedClassical;
          
          // Check that original keys are not present as substrings in encrypted data
          const classicalNotInEncrypted = !encryptedData.includes(classicalBuffer);
          const pqcNotInEncrypted = !encryptedData.includes(pqcBuffer);

          return classicalNotInEncrypted && pqcNotInEncrypted;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should produce different encrypted outputs for same keys with different passwords', () => {
    fc.assert(
      fc.property(
        privateKeyArbitrary,
        privateKeyArbitrary,
        passwordArbitrary,
        passwordArbitrary,
        (classicalPriv, pqcPriv, password1, password2) => {
          // Ensure passwords are different
          fc.pre(password1 !== password2);

          const classicalBuffer = Buffer.from(classicalPriv);
          const pqcBuffer = Buffer.from(pqcPriv);

          const encrypted1 = keyManager.encryptPrivateKeys(
            classicalBuffer,
            pqcBuffer,
            password1
          );

          const encrypted2 = keyManager.encryptPrivateKeys(
            classicalBuffer,
            pqcBuffer,
            password2
          );

          // Different passwords should produce different encrypted outputs
          const differentEncrypted = !encrypted1.encryptedClassical.equals(encrypted2.encryptedClassical);
          const differentSalts = !encrypted1.salt.equals(encrypted2.salt);

          return differentEncrypted && differentSalts;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should produce different encrypted outputs for same keys and password (due to random IV)', () => {
    fc.assert(
      fc.property(
        privateKeyArbitrary,
        privateKeyArbitrary,
        passwordArbitrary,
        (classicalPriv, pqcPriv, password) => {
          const classicalBuffer = Buffer.from(classicalPriv);
          const pqcBuffer = Buffer.from(pqcPriv);

          const encrypted1 = keyManager.encryptPrivateKeys(
            classicalBuffer,
            pqcBuffer,
            password
          );

          const encrypted2 = keyManager.encryptPrivateKeys(
            classicalBuffer,
            pqcBuffer,
            password
          );

          // Even with same password, different IVs and salts should produce different encrypted outputs
          const differentIVs = !encrypted1.iv.equals(encrypted2.iv);
          const differentSalts = !encrypted1.salt.equals(encrypted2.salt);
          const differentEncrypted = !encrypted1.encryptedClassical.equals(encrypted2.encryptedClassical);

          return differentIVs && differentSalts && differentEncrypted;
        }
      ),
      { numRuns: 100 }
    );
  });
});
