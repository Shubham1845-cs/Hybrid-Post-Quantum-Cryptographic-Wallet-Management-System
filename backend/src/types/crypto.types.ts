export interface KeyPair{
    publicKey:Buffer;
    privateKey:Buffer;  // buffer is an binary data
}

export interface Signature
{
    r:string;
    s:string
}