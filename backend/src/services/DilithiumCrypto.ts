import crypto from 'crypto';
import { KeyPair } from '../types/crypto.types';

export class DilithiumCrypto {
  
  generateKeyPair(): KeyPair {
    
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ml-dsa-65', {
      publicKeyEncoding: { type: 'spki', format: 'der' },
      privateKeyEncoding: { type: 'pkcs8', format: 'der' }
    });
    
    return { publicKey, privateKey };
  }

  sign(data: Buffer, privateKey: Buffer): Buffer {
    const key = crypto.createPrivateKey({ key: privateKey, format: 'der', type: 'pkcs8' });
    
    // Pass 'null' for the algorithm because ML-DSA handles its own internal hashing
    return crypto.sign(null, data, key);
  }

  // Method 3: Verify signature
  verify(data: Buffer, signature: Buffer, publicKey: Buffer): boolean {
    const key = crypto.createPublicKey({ key: publicKey, format: 'der', type: 'spki' });
    
    return crypto.verify(null, data, key, signature);
  }
}