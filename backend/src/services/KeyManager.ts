import crypto from "crypto"
import { ECDSACrypto } from './ECDSACrypto';
import { DilithiumCrypto } from './DilithiumCrypto';
import { HybridKeyPair, EncryptedKeys, DecryptedKeys } from '../types/crypto.types';

export class KeyManager{
    private ecdsa =new ECDSACrypto();
    private dilithium= new DilithiumCrypto();

    private readonly CONFIG={
    iterations: 10000,
    keyLen: 32,
    digest: 'sha256',
    saltLen: 32,
    ivLen: 16
    };
    
    genratedHybridKeyPair():HybridKeyPair{
         const classical =this.ecdsa.generateKeyPair();
         const pqc=this.dilithium.generateKeyPair();

         const walletAddress=crypto.createHash('sha256')
         .update(Buffer.concat([classical.publicKey,pqc.publicKey])).digest('hex');
          
         return {
            walletAddress,
            publicKey:{ecdsa:classical.publicKey,dilithium:pqc.publicKey},
            privateKey:{ecdsa:classical.privateKey,dilithium:pqc.privateKey}
         };
    }
    encrptionPrivateKeys(classicalPriv:Buffer,pqcPriv:Buffer,password:string):EncryptedKeys{
        const salt=crypto.randomBytes(this.CONFIG.saltLen);
        const iv=crypto.randomBytes(this.CONFIG.ivLen);
        const key=crypto.pbkdf2Sync(password,salt,this.CONFIG.iterations,this.CONFIG.keyLen,this.CONFIG.digest);
        const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32BE(classicalPriv.length);
    const combinedData = Buffer.concat([lengthBuffer, classicalPriv, pqcPriv]);

    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encryptedData = Buffer.concat([cipher.update(combinedData), cipher.final()]);
     
    return {
      encryptedClassical: encryptedData, // We store the whole chunk here
      encryptedPQC: Buffer.alloc(0),      // We can leave this empty or remove from interface
      iv,
      authTag: cipher.getAuthTag(),
      salt
    };    
    }
    decryptPrivateKeys(encrypted: EncryptedKeys, password: string): DecryptedKeys {
    try {
      const key = crypto.pbkdf2Sync(password, encrypted.salt, this.CONFIG.iterations, this.CONFIG.keyLen, this.CONFIG.digest);
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, encrypted.iv);
      decipher.setAuthTag(encrypted.authTag);

      const decrypted = Buffer.concat([decipher.update(encrypted.encryptedClassical), decipher.final()]);

      // Split the keys back apart using the stored length
      const classicalLen = decrypted.readUInt32BE(0);
      const classicalPrivateKey = decrypted.slice(4, 4 + classicalLen);
      const pqcPrivateKey = decrypted.slice(4 + classicalLen);

      return { classicalPrivateKey, pqcPrivateKey };
    } catch (e) {
      throw new Error('Decryption failed: Wrong password or corrupted data');
    }
    }
}