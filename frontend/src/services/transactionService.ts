import apiClient  from "./apiClient";
import type { createTransactionRequest,TransactionResponce,VerifyTransactionRequest,VerifyTransactionResponse } from "../types/api.types";

// create and sign new transaction
export const createTransaction=async(sender:string,recipient:string,amount:number,password:string):Promise<TransactionResponce> =>
{
    const payload:createTransactionRequest={sender,recipient,amount,password};
    const responce=await apiClient.post<TransactionResponce>("/api/transaction/create",payload);
    return responce.data;

}

// verify  transaction by ID
export const verifyTransaction=async(txId:string):Promise<VerifyTransactionResponse> =>
{
    const payload:VerifyTransactionRequest={txId};
    const responce=await apiClient.post<VerifyTransactionResponse>("/api/transaction/verify",payload);

    return responce.data;

};
 
// get transaction history for an address
export const getTransactionHistory=async(address:string):Promise<TransactionResponce[]> =>{
    const responce=await apiClient.get<TransactionResponce[]>(`/api/transaction/history/${address}`);
    return responce.data;
};
