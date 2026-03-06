export interface KeyPair{
    publicKey:Buffer;
    privateKey:Buffer;  // buffer is an binary data
}

export interface Signature
{
    r:string;
    s:string
}
export interface HybridKeyPair
{
    walletAddress:string; 
    publicKey:{
        ecdsa:Buffer;
        dilithium:Buffer;

    };
    privateKey:{
        ecdsa:Buffer;
        dilithium:Buffer
    }
}

export interface EncryptedKeys
{
  encryptedClassical: Buffer;
  encryptedPQC: Buffer; 
   iv:Buffer;
   authTag:Buffer;
   salt:Buffer;

}
export interface DecryptedKeys
{
    classicalPrivateKey: Buffer;
    pqcPrivateKey: Buffer; 
}
