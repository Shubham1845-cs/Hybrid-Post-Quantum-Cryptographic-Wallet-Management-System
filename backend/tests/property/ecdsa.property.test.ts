/// <reference types="jest" />
import * as fc from 'fast-check';
import { ECDSACrypto } from '../../src/services/ECDSACrypto';

describe('ECDSA Property Tests', () => {
  const ecdsa = new ECDSACrypto();

  it('Property 1: Generated keys should be valid', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const keyPair = ecdsa.generateKeyPair();
        
        // Check that keys exist and have correct length
        expect(keyPair.publicKey).toBeInstanceOf(Buffer);
        expect(keyPair.privateKey).toBeInstanceOf(Buffer);
        expect(keyPair.publicKey.length).toBeGreaterThan(0);
        expect(keyPair.privateKey.length).toBeGreaterThan(0);
        
        return true;
      }),
      { numRuns: 100 } // Run this test 100 times with random data
    );
  });

  it('Property 2: Signature should verify correctly', () => {
    fc.assert(
      fc.property(fc.uint8Array({ minLength: 32, maxLength: 32 }), (data) => {
        const keyPair = ecdsa.generateKeyPair();
        const dataBuffer = Buffer.from(data);
        
        // Sign the data
        const signature = ecdsa.sign(dataBuffer, keyPair.privateKey);
        
        // Verify the signature
        const isValid = ecdsa.verify(dataBuffer, signature, keyPair.publicKey);
        
        return isValid === true;
      }),
      { numRuns: 100 }
    );
  });
});
