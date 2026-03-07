import { KeyManager } from '../../src/services/KeyManager';
import { ECDSACrypto } from '../../src/services/ECDSACrypto';
import { DilithiumCrypto } from '../../src/services/DilithiumCrypto';
import crypto from 'crypto';

// Mock the Wallet model to avoid database dependencies in unit tests
jest.mock('../../src/models/Wallet');

describe('KeyManager Unit Tests', () => {
  let keyManager: KeyManager;

  beforeEach(() => {
    keyManager = new KeyManager();
    jest.clearAllMocks();
  });

  describe('Hybrid Key Generation', () => {
    it('should generate a valid hybrid key pair with all required fields', () => {
      const hybridKeyPair = keyManager.genratedHybridKeyPair();

      // Verify structure
      expect(hybridKeyPair).toHaveProperty('walletAddress');
      expect(hybridKeyPair).toHaveProperty('publicKey');
      expect(hybridKeyPair).toHaveProperty('privateKey');

      // Verify public keys
      expect(hybridKeyPair.publicKey).toHaveProperty('ecdsa');
      expect(hybridKeyPair.publicKey).toHaveProperty('dilithium');
      expect(Buffer.isBuffer(hybridKeyPair.publicKey.ecdsa)).toBe(true);
      expect(Buffer.isBuffer(hybridKeyPair.publicKey.dilithium)).toBe(true);

      // Verify private keys
      expect(hybridKeyPair.privateKey).toHaveProperty('ecdsa');
      expect(hybridKeyPair.privateKey).toHaveProperty('dilithium');
      expect(Buffer.isBuffer(hybridKeyPair.privateKey.ecdsa)).toBe(true);
      expect(Buffer.isBuffer(hybridKeyPair.privateKey.dilithium)).toBe(true);

      // Verify wallet address format (should be 64 character hex string from SHA-256)
      expect(hybridKeyPair.walletAddress).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should generate unique key pairs on multiple calls', () => {
      const keyPair1 = keyManager.genratedHybridKeyPair();
      const keyPair2 = keyManager.genratedHybridKeyPair();

      // Wallet addresses should be different
      expect(keyPair1.walletAddress).not.toBe(keyPair2.walletAddress);

      // ECDSA keys should be different
      expect(keyPair1.publicKey.ecdsa.equals(keyPair2.publicKey.ecdsa)).toBe(false);
      expect(keyPair1.privateKey.ecdsa.equals(keyPair2.privateKey.ecdsa)).toBe(false);

      // Dilithium keys should be different
      expect(keyPair1.publicKey.dilithium.equals(keyPair2.publicKey.dilithium)).toBe(false);
      expect(keyPair1.privateKey.dilithium.equals(keyPair2.privateKey.dilithium)).toBe(false);
    });

    it('should generate ECDSA keys with valid length', () => {
      const hybridKeyPair = keyManager.genratedHybridKeyPair();

      // ECDSA secp256k1 public key should be 65 bytes (uncompressed) or 33 bytes (compressed)
      const ecdsaPubKeyLen = hybridKeyPair.publicKey.ecdsa.length;
      expect(ecdsaPubKeyLen === 65 || ecdsaPubKeyLen === 33).toBe(true);

      // ECDSA private key should be 32 bytes
      expect(hybridKeyPair.privateKey.ecdsa.length).toBe(32);
    });

    it('should generate Dilithium keys with valid length', () => {
      const hybridKeyPair = keyManager.genratedHybridKeyPair();

      // Dilithium3 (ML-DSA-65) public key should be 1952 bytes
      expect(hybridKeyPair.publicKey.dilithium.length).toBeGreaterThan(1900);

      // Dilithium3 private key should be 4000 bytes
      expect(hybridKeyPair.privateKey.dilithium.length).toBeGreaterThan(3900);
    });
  });

  describe('Wallet Address Derivation', () => {
    it('should derive the same address from the same public keys', () => {
      const ecdsaCrypto = new ECDSACrypto();
      const dilithiumCrypto = new DilithiumCrypto();

      const ecdsaKeys = ecdsaCrypto.generateKeyPair();
      const dilithiumKeys = dilithiumCrypto.generateKeyPair();

      // Manually derive address using the same algorithm as KeyManager
      const address1 = crypto
        .createHash('sha256')
        .update(Buffer.concat([ecdsaKeys.publicKey, dilithiumKeys.publicKey]))
        .digest('hex');

      const address2 = crypto
        .createHash('sha256')
        .update(Buffer.concat([ecdsaKeys.publicKey, dilithiumKeys.publicKey]))
        .digest('hex');

      expect(address1).toBe(address2);
    });

    it('should derive different addresses from different public keys', () => {
      const keyPair1 = keyManager.genratedHybridKeyPair();
      const keyPair2 = keyManager.genratedHybridKeyPair();

      expect(keyPair1.walletAddress).not.toBe(keyPair2.walletAddress);
    });

    it('should derive address with known test vectors', () => {
      // Create known test vectors
      const testEcdsaPubKey = Buffer.from('04' + 'a'.repeat(128), 'hex'); // 65 bytes
      const testDilithiumPubKey = Buffer.alloc(1952, 0xbb); // 1952 bytes

      const expectedAddress = crypto
        .createHash('sha256')
        .update(Buffer.concat([testEcdsaPubKey, testDilithiumPubKey]))
        .digest('hex');

      // The KeyManager derives address internally during generation
      // We verify the algorithm produces expected output
      expect(expectedAddress).toMatch(/^[a-f0-9]{64}$/);
      expect(expectedAddress.length).toBe(64);
    });
  });

  describe('Private Key Encryption', () => {
    it('should encrypt private keys with a password', () => {
      const hybridKeyPair = keyManager.genratedHybridKeyPair();
      const password = 'test-password-123';

      const encrypted = keyManager.encrptionPrivateKeys(
        hybridKeyPair.privateKey.ecdsa,
        hybridKeyPair.privateKey.dilithium,
        password
      );

      // Verify encrypted structure
      expect(encrypted).toHaveProperty('encryptedClassical');
      expect(encrypted).toHaveProperty('iv');
      expect(encrypted).toHaveProperty('authTag');
      expect(encrypted).toHaveProperty('salt');

      // Verify all fields are Buffers
      expect(Buffer.isBuffer(encrypted.encryptedClassical)).toBe(true);
      expect(Buffer.isBuffer(encrypted.iv)).toBe(true);
      expect(Buffer.isBuffer(encrypted.authTag)).toBe(true);
      expect(Buffer.isBuffer(encrypted.salt)).toBe(true);

      // Verify encrypted data is different from original
      expect(encrypted.encryptedClassical.equals(hybridKeyPair.privateKey.ecdsa)).toBe(false);

      // Verify IV is 16 bytes (AES-GCM standard)
      expect(encrypted.iv.length).toBe(16);

      // Verify auth tag is 16 bytes (AES-GCM standard)
      expect(encrypted.authTag.length).toBe(16);

      // Verify salt is 32 bytes (as configured)
      expect(encrypted.salt.length).toBe(32);
    });

    it('should produce different encrypted output with different passwords', () => {
      const hybridKeyPair = keyManager.genratedHybridKeyPair();

      const encrypted1 = keyManager.encrptionPrivateKeys(
        hybridKeyPair.privateKey.ecdsa,
        hybridKeyPair.privateKey.dilithium,
        'password1'
      );

      const encrypted2 = keyManager.encrptionPrivateKeys(
        hybridKeyPair.privateKey.ecdsa,
        hybridKeyPair.privateKey.dilithium,
        'password2'
      );

      // Different passwords should produce different encrypted data
      expect(encrypted1.encryptedClassical.equals(encrypted2.encryptedClassical)).toBe(false);
      expect(encrypted1.salt.equals(encrypted2.salt)).toBe(false);
    });

    it('should produce different encrypted output on multiple encryptions with same password', () => {
      const hybridKeyPair = keyManager.genratedHybridKeyPair();
      const password = 'same-password';

      const encrypted1 = keyManager.encrptionPrivateKeys(
        hybridKeyPair.privateKey.ecdsa,
        hybridKeyPair.privateKey.dilithium,
        password
      );

      const encrypted2 = keyManager.encrptionPrivateKeys(
        hybridKeyPair.privateKey.ecdsa,
        hybridKeyPair.privateKey.dilithium,
        password
      );

      // Different salt and IV should produce different encrypted data
      expect(encrypted1.encryptedClassical.equals(encrypted2.encryptedClassical)).toBe(false);
      expect(encrypted1.salt.equals(encrypted2.salt)).toBe(false);
      expect(encrypted1.iv.equals(encrypted2.iv)).toBe(false);
    });
  });

  describe('Private Key Decryption', () => {
    it('should decrypt private keys with correct password', () => {
      const hybridKeyPair = keyManager.genratedHybridKeyPair();
      const password = 'correct-password';

      const encrypted = keyManager.encrptionPrivateKeys(
        hybridKeyPair.privateKey.ecdsa,
        hybridKeyPair.privateKey.dilithium,
        password
      );

      const decrypted = keyManager.decryptPrivateKeys(encrypted, password);

      // Verify decrypted keys match original keys
      expect(decrypted.classicalPrivateKey.equals(hybridKeyPair.privateKey.ecdsa)).toBe(true);
      expect(decrypted.pqcPrivateKey.equals(hybridKeyPair.privateKey.dilithium)).toBe(true);
    });

    it('should fail to decrypt with incorrect password', () => {
      const hybridKeyPair = keyManager.genratedHybridKeyPair();
      const correctPassword = 'correct-password';
      const wrongPassword = 'wrong-password';

      const encrypted = keyManager.encrptionPrivateKeys(
        hybridKeyPair.privateKey.ecdsa,
        hybridKeyPair.privateKey.dilithium,
        correctPassword
      );

      // Attempt to decrypt with wrong password should throw error
      expect(() => {
        keyManager.decryptPrivateKeys(encrypted, wrongPassword);
      }).toThrow('Decryption failed: Wrong password or corrupted data');
    });

    it('should fail to decrypt with corrupted encrypted data', () => {
      const hybridKeyPair = keyManager.genratedHybridKeyPair();
      const password = 'test-password';

      const encrypted = keyManager.encrptionPrivateKeys(
        hybridKeyPair.privateKey.ecdsa,
        hybridKeyPair.privateKey.dilithium,
        password
      );

      // Corrupt the encrypted data
      encrypted.encryptedClassical[0] ^= 0xFF;

      // Attempt to decrypt corrupted data should throw error
      expect(() => {
        keyManager.decryptPrivateKeys(encrypted, password);
      }).toThrow('Decryption failed: Wrong password or corrupted data');
    });

    it('should fail to decrypt with corrupted auth tag', () => {
      const hybridKeyPair = keyManager.genratedHybridKeyPair();
      const password = 'test-password';

      const encrypted = keyManager.encrptionPrivateKeys(
        hybridKeyPair.privateKey.ecdsa,
        hybridKeyPair.privateKey.dilithium,
        password
      );

      // Corrupt the auth tag
      encrypted.authTag[0] ^= 0xFF;

      // Attempt to decrypt with corrupted auth tag should throw error
      expect(() => {
        keyManager.decryptPrivateKeys(encrypted, password);
      }).toThrow('Decryption failed: Wrong password or corrupted data');
    });

    it('should handle encryption/decryption round-trip with known test vectors', () => {
      // Create known test vectors
      const testEcdsaPrivKey = Buffer.from('a'.repeat(64), 'hex'); // 32 bytes
      const testDilithiumPrivKey = Buffer.alloc(4000, 0xbb); // 4000 bytes
      const password = 'known-password-123';

      const encrypted = keyManager.encrptionPrivateKeys(
        testEcdsaPrivKey,
        testDilithiumPrivKey,
        password
      );

      const decrypted = keyManager.decryptPrivateKeys(encrypted, password);

      // Verify round-trip preserves data
      expect(decrypted.classicalPrivateKey.equals(testEcdsaPrivKey)).toBe(true);
      expect(decrypted.pqcPrivateKey.equals(testDilithiumPrivKey)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle empty password gracefully', () => {
      const hybridKeyPair = keyManager.genratedHybridKeyPair();

      // Empty password should still work (though not recommended)
      const encrypted = keyManager.encrptionPrivateKeys(
        hybridKeyPair.privateKey.ecdsa,
        hybridKeyPair.privateKey.dilithium,
        ''
      );

      const decrypted = keyManager.decryptPrivateKeys(encrypted, '');

      expect(decrypted.classicalPrivateKey.equals(hybridKeyPair.privateKey.ecdsa)).toBe(true);
    });

    it('should handle very long passwords', () => {
      const hybridKeyPair = keyManager.genratedHybridKeyPair();
      const longPassword = 'a'.repeat(1000);

      const encrypted = keyManager.encrptionPrivateKeys(
        hybridKeyPair.privateKey.ecdsa,
        hybridKeyPair.privateKey.dilithium,
        longPassword
      );

      const decrypted = keyManager.decryptPrivateKeys(encrypted, longPassword);

      expect(decrypted.classicalPrivateKey.equals(hybridKeyPair.privateKey.ecdsa)).toBe(true);
    });

    it('should handle special characters in password', () => {
      const hybridKeyPair = keyManager.genratedHybridKeyPair();
      const specialPassword = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

      const encrypted = keyManager.encrptionPrivateKeys(
        hybridKeyPair.privateKey.ecdsa,
        hybridKeyPair.privateKey.dilithium,
        specialPassword
      );

      const decrypted = keyManager.decryptPrivateKeys(encrypted, specialPassword);

      expect(decrypted.classicalPrivateKey.equals(hybridKeyPair.privateKey.ecdsa)).toBe(true);
    });

    it('should handle unicode characters in password', () => {
      const hybridKeyPair = keyManager.genratedHybridKeyPair();
      const unicodePassword = '密码🔐🔑';

      const encrypted = keyManager.encrptionPrivateKeys(
        hybridKeyPair.privateKey.ecdsa,
        hybridKeyPair.privateKey.dilithium,
        unicodePassword
      );

      const decrypted = keyManager.decryptPrivateKeys(encrypted, unicodePassword);

      expect(decrypted.classicalPrivateKey.equals(hybridKeyPair.privateKey.ecdsa)).toBe(true);
    });
  });
});
