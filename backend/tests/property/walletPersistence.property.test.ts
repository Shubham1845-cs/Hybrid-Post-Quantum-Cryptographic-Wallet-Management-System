import * as fc from 'fast-check';
import { KeyManager } from '../../src/services/KeyManager';
import { Wallet } from '../../src/models/Wallet';

/**
 * Feature: hybrid-pqc-wallet
 * Property 4: Wallet Data Persistence Round-Trip
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
 * 
 * For any wallet created and stored in the database, retrieving the wallet by address 
 * should return all wallet data (address, balance, public keys) matching the original values.
 */
describe('Property 4: Wallet Data Persistence Round-Trip', () => {
  const keyManager = new KeyManager();

  // Custom arbitraries for generating test data
  const passwordArbitrary = fc.string({ minLength: 8, maxLength: 64 });
  const balanceArbitrary = fc.integer({ min: 0, max: 1000000 });
  const nonceArbitrary = fc.integer({ min: 0, max: 1000 });

  it('should persist and retrieve wallet with all data intact', async () => {
    await fc.assert(
      fc.asyncProperty(
        passwordArbitrary,
        balanceArbitrary,
        nonceArbitrary,
        async (password, balance, nonce) => {
          // Skip passwords that are only whitespace
          fc.pre(password.trim().length > 0);

          // Generate a hybrid key pair
          const hybridKeyPair = keyManager.genratedHybridKeyPair();

          // Encrypt the private keys
          const encryptedKeys = keyManager.encrptionPrivateKeys(
            hybridKeyPair.privateKey.ecdsa,
            hybridKeyPair.privateKey.dilithium,
            password
          );

          // Store wallet in database with custom balance and nonce
          await Wallet.create({
            address: hybridKeyPair.walletAddress,
            publicKeys: {
              ecdsa: hybridKeyPair.publicKey.ecdsa,
              dilithium: hybridKeyPair.publicKey.dilithium
            },
            encryptedPrivateKeys: {
              encryptedClassical: encryptedKeys.encryptedClassical,
              encryptedPQC: encryptedKeys.encryptedPQC,
              iv: encryptedKeys.iv,
              authTag: encryptedKeys.authTag,
              salt: encryptedKeys.salt
            },
            balance,
            nonce
          });

          // Retrieve wallet from database (without .lean() to preserve Buffer types)
          const retrievedWallet = await Wallet.findOne({ 
            address: hybridKeyPair.walletAddress 
          });

          // Verify wallet was retrieved
          if (!retrievedWallet) {
            return false;
          }

          // Verify address matches
          const addressMatches = retrievedWallet.address === hybridKeyPair.walletAddress;

          // Verify balance matches (Requirement 2.1)
          const balanceMatches = retrievedWallet.balance === balance;

          // Verify public keys match (Requirements 2.2, 2.3)
          const ecdsaPublicKeyMatches = retrievedWallet.publicKeys.ecdsa.equals(
            hybridKeyPair.publicKey.ecdsa
          );
          const dilithiumPublicKeyMatches = retrievedWallet.publicKeys.dilithium.equals(
            hybridKeyPair.publicKey.dilithium
          );

          // Verify nonce matches
          const nonceMatches = retrievedWallet.nonce === nonce;

          // Verify encrypted private keys are stored (Requirement 2.4)
          const hasEncryptedKeys = 
            retrievedWallet.encryptedPrivateKeys.encryptedClassical.length > 0 &&
            retrievedWallet.encryptedPrivateKeys.iv.length > 0 &&
            retrievedWallet.encryptedPrivateKeys.authTag.length > 0 &&
            retrievedWallet.encryptedPrivateKeys.salt.length > 0;

          // Verify encrypted keys can be decrypted back to original keys
          const encryptedKeysForDecryption = {
            encryptedClassical: retrievedWallet.encryptedPrivateKeys.encryptedClassical,
            encryptedPQC: retrievedWallet.encryptedPrivateKeys.encryptedPQC,
            iv: retrievedWallet.encryptedPrivateKeys.iv,
            authTag: retrievedWallet.encryptedPrivateKeys.authTag,
            salt: retrievedWallet.encryptedPrivateKeys.salt
          };
          const decryptedKeys = keyManager.decryptPrivateKeys(
            encryptedKeysForDecryption,
            password
          );
          const classicalPrivKeyMatches = decryptedKeys.classicalPrivateKey.equals(
            hybridKeyPair.privateKey.ecdsa
          );
          const pqcPrivKeyMatches = decryptedKeys.pqcPrivateKey.equals(
            hybridKeyPair.privateKey.dilithium
          );

          return (
            addressMatches &&
            balanceMatches &&
            ecdsaPublicKeyMatches &&
            dilithiumPublicKeyMatches &&
            nonceMatches &&
            hasEncryptedKeys &&
            classicalPrivKeyMatches &&
            pqcPrivKeyMatches
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should retrieve wallet by address case-insensitively', async () => {
    await fc.assert(
      fc.asyncProperty(
        passwordArbitrary,
        async (password) => {
          // Skip passwords that are only whitespace
          fc.pre(password.trim().length > 0);

          // Generate a hybrid key pair
          const hybridKeyPair = keyManager.genratedHybridKeyPair();

          // Encrypt the private keys
          const encryptedKeys = keyManager.encrptionPrivateKeys(
            hybridKeyPair.privateKey.ecdsa,
            hybridKeyPair.privateKey.dilithium,
            password
          );

          // Store wallet in database
          await keyManager.storeKeyPair(hybridKeyPair, encryptedKeys);

          // Try to retrieve with different case variations (without .lean())
          const lowerCase = hybridKeyPair.walletAddress.toLowerCase();
          const upperCase = hybridKeyPair.walletAddress.toUpperCase();
          const mixedCase = hybridKeyPair.walletAddress;

          const wallet1 = await Wallet.findOne({ address: lowerCase });
          const wallet2 = await Wallet.findOne({ address: upperCase });
          const wallet3 = await Wallet.findOne({ address: mixedCase });

          // All should retrieve the same wallet
          return wallet1 !== null && wallet2 !== null && wallet3 !== null;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain data integrity for multiple wallets', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(passwordArbitrary, { minLength: 2, maxLength: 5 }),
        async (passwords) => {
          // Filter out passwords that are only whitespace
          const validPasswords = passwords.filter(p => p.trim().length > 0);
          fc.pre(validPasswords.length >= 2);

          const wallets = [];

          // Create multiple wallets
          for (const password of validPasswords) {
            const hybridKeyPair = keyManager.genratedHybridKeyPair();
            const encryptedKeys = keyManager.encrptionPrivateKeys(
              hybridKeyPair.privateKey.ecdsa,
              hybridKeyPair.privateKey.dilithium,
              password
            );

            await keyManager.storeKeyPair(hybridKeyPair, encryptedKeys);
            wallets.push({ hybridKeyPair, password });
          }

          // Verify each wallet can be retrieved with correct data
          for (const { hybridKeyPair, password } of wallets) {
            const retrieved = await Wallet.findOne({ 
              address: hybridKeyPair.walletAddress 
            });

            if (!retrieved) {
              return false;
            }

            // Verify address matches
            if (retrieved.address !== hybridKeyPair.walletAddress) {
              return false;
            }

            // Verify public keys match
            if (!retrieved.publicKeys.ecdsa.equals(hybridKeyPair.publicKey.ecdsa)) {
              return false;
            }
            if (!retrieved.publicKeys.dilithium.equals(hybridKeyPair.publicKey.dilithium)) {
              return false;
            }

            // Verify private keys can be decrypted
            const encryptedKeysForDecryption = {
              encryptedClassical: retrieved.encryptedPrivateKeys.encryptedClassical,
              encryptedPQC: retrieved.encryptedPrivateKeys.encryptedPQC,
              iv: retrieved.encryptedPrivateKeys.iv,
              authTag: retrieved.encryptedPrivateKeys.authTag,
              salt: retrieved.encryptedPrivateKeys.salt
            };
            const decrypted = keyManager.decryptPrivateKeys(
              encryptedKeysForDecryption,
              password
            );
            if (!decrypted.classicalPrivateKey.equals(hybridKeyPair.privateKey.ecdsa)) {
              return false;
            }
            if (!decrypted.pqcPrivateKey.equals(hybridKeyPair.privateKey.dilithium)) {
              return false;
            }
          }

          return true;
        }
      ),
      { numRuns: 50 } // Reduced runs due to multiple wallet creation
    );
  });

  it('should return null for non-existent wallet address', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.hexaString({ minLength: 64, maxLength: 64 }),
        async (fakeAddress) => {
          // Try to retrieve a wallet that doesn't exist
          const wallet = await Wallet.findOne({ address: fakeAddress });
          
          // Should return null for non-existent wallet
          return wallet === null;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve balance updates across persistence', async () => {
    await fc.assert(
      fc.asyncProperty(
        passwordArbitrary,
        balanceArbitrary,
        balanceArbitrary,
        async (password, initialBalance, updatedBalance) => {
          // Skip passwords that are only whitespace
          fc.pre(password.trim().length > 0);

          // Generate and store wallet with initial balance
          const hybridKeyPair = keyManager.genratedHybridKeyPair();
          const encryptedKeys = keyManager.encrptionPrivateKeys(
            hybridKeyPair.privateKey.ecdsa,
            hybridKeyPair.privateKey.dilithium,
            password
          );

          await Wallet.create({
            address: hybridKeyPair.walletAddress,
            publicKeys: {
              ecdsa: hybridKeyPair.publicKey.ecdsa,
              dilithium: hybridKeyPair.publicKey.dilithium
            },
            encryptedPrivateKeys: {
              encryptedClassical: encryptedKeys.encryptedClassical,
              encryptedPQC: encryptedKeys.encryptedPQC,
              iv: encryptedKeys.iv,
              authTag: encryptedKeys.authTag,
              salt: encryptedKeys.salt
            },
            balance: initialBalance,
            nonce: 0
          });

          // Update balance
          await Wallet.updateOne(
            { address: hybridKeyPair.walletAddress },
            { $set: { balance: updatedBalance } }
          );

          // Retrieve and verify updated balance
          const retrieved = await Wallet.findOne({ 
            address: hybridKeyPair.walletAddress 
          });

          return retrieved !== null && retrieved.balance === updatedBalance;
        }
      ),
      { numRuns: 100 }
    );
  });
});
