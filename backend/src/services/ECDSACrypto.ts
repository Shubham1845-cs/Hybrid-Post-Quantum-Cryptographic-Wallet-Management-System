import { ec as EC } from 'elliptic';
import { KeyPair, Signature } from '../types/crypto.types';

// Create a class to handle ECDSA operations
export class ECDSACrypto {
  private ec: EC;

  constructor() {
    // Initialize elliptic curve (secp256k1 - same as Bitcoin)
    this.ec = new EC('secp256k1');
  }

  // Method 1: Generate a new key pair
  generateKeyPair(): KeyPair {
    const keyPair = this.ec.genKeyPair();
    
    return {
      publicKey: Buffer.from(keyPair.getPublic('hex'), 'hex'),
      privateKey: Buffer.from(keyPair.getPrivate('hex'), 'hex'),
    };
  }

  // Method 2: Sign data with private key
  sign(data: Buffer, privateKey: Buffer): Signature {
    const key = this.ec.keyFromPrivate(privateKey);
    const signature = key.sign(data);
    
    return {
      r: signature.r.toString('hex'),
      s: signature.s.toString('hex'),
    };
  }

  // Method 3: Verify signature with public key
  verify(data: Buffer, signature: Signature, publicKey: Buffer): boolean {
    const key = this.ec.keyFromPublic(publicKey, 'hex');
    return key.verify(data, signature);
  }
}