export interface Transaction
{
    sender:string;
    recipient:string;
    amount:number;
    nonce:number;
    timestamp:number; // number is safer  for the hashing


}
export interface DualSignature{
    ecdsa:{
        r:string;
        s:string;
    };
    dilithium:Buffer;

}
export interface SignedTransaction extends Transaction
{
    txId:string;
    dualSignature:DualSignature;
}
export interface VerifaicationResult{
    isValid:boolean;
    isEcdsaValid:boolean;
    isDilithiumValid:boolean;
    error?:string;
}