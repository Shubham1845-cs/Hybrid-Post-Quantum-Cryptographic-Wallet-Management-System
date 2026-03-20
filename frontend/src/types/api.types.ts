export interface WalletPublicKeys
{
    classical:string;
    pqc:string;

}
export interface WalletResponce
{
    address:string;
    balance:number;
    publicKeys:WalletPublicKeys;
    nonce:number;
    createdAt:string;
}

export interface GenerateWalletRequest
{
    password:string;

}
export  interface TransactionDualSignature
{
    classical:string;
    pqc:string;

}

export interface TransactionResponce
{
    txId:string;
    sender:string;
    recipient:string;
    amount:number;
    timestamp:string;
    nonce:number;
    dualSignature:TransactionDualSignature;
    verified:boolean;
}

export interface createTransactionRequest
{
     sender:string;
     recipient:string;
     amount:number;
     password:string;

}

export interface VerifyTransactionRequest{
     txId:string;
}

export  interface VerifyTransactionResponse
{
    txId:string;
    verified:boolean;
    classicalValid:boolean;
    pqcValid:boolean;
    message:string;

}

export interface ApiError
{
    message:string;
    status:number;
    code?:string;
    
}