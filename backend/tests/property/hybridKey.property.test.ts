import * as fc from 'fast-check';
import { describe, it, expect } from '@jest/globals';
import { DilithiumCrypto } from '../../src/services/DilithiumCrypto';
import { KeyManager } from '../../src/services/KeyManager';

describe('Property Tests: Dilithium, Hybrid Key Generation, and Address Derivation', () => {
    const dilithium = new DilithiumCrypto();
    const keyManager = new KeyManager();

    it('3.4 - Dilithium key generation produces valid keys', () => {
        // ML-DSA/Dilithium keys are deterministic based on randomness, but we test structure since keygen is parameterless.
        fc.assert(
            fc.property(fc.integer({ min: 1, max: 10 }), () => { // Limit runs due to Dilithium speed
                const keys = dilithium.generateKeyPair();
                return Buffer.isBuffer(keys.publicKey) && 
                       Buffer.isBuffer(keys.privateKey) && 
                       keys.publicKey.length > 0 && 
                       keys.privateKey.length > 0;
            }),
            { numRuns: 3 }
        );
    });

    it('4.3 - Hybrid Key Generation Produces Valid Keys', () => {
        fc.assert(
            fc.property(fc.integer({ min: 1, max: 10 }), () => {
                const hybridKeyPair = keyManager.generateHybridKeyPair();
                
                const hasClassicalPub = hybridKeyPair.publicKey.ecdsa.length > 0;
                const hasClassicalPriv = hybridKeyPair.privateKey.ecdsa.length > 0;
                
                const hasPQCPub = Buffer.isBuffer(hybridKeyPair.publicKey.dilithium) && hybridKeyPair.publicKey.dilithium.length > 0;
                const hasPQCPriv = Buffer.isBuffer(hybridKeyPair.privateKey.dilithium) && hybridKeyPair.privateKey.dilithium.length > 0;
                
                return hasClassicalPub && hasClassicalPriv && hasPQCPub && hasPQCPriv;
            }),
            { numRuns: 3 }
        );
    });

    it('4.5 - Wallet Address Derivation is Deterministic', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 30, maxLength: 80 }), 
                fc.uint8Array({ minLength: 100, maxLength: 2000 }),
                (mockEcdsaPub, mockDilithiumPubArray) => {
                    const mockDilithiumPub = Buffer.from(mockDilithiumPubArray);
                    
                    const address1 = (keyManager as any).deriveWalletAddress(mockEcdsaPub, mockDilithiumPub);
                    const address2 = (keyManager as any).deriveWalletAddress(mockEcdsaPub, mockDilithiumPub);
                    
                    // Address must be a hex string of exactly 64 characters (SHA256)
                    const isHex = /^[0-9a-f]{64}$/i.test(address1);
                    const isDeterministic = address1 === address2;

                    return isHex && isDeterministic;
                }
            ),
            { numRuns: 20 }
        );
    });
});
