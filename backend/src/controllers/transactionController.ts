import {Request,Response} from 'express';
import { Wallet } from '../models/Wallet';
import { Transaction } from '../models/Transaction';
import { TransactionProcessor } from '../services/TransactionProcessor';
import { KeyManager } from '../services/KeyManager';
import { SignatureValidator } from '../services/SignatureValidator';
import { SignedTransaction } from '../types/transaction.types';

const keyManager=new KeyManager();
const txProcessor=new TransactionProcessor();
const validator=new SignatureValidator();

export const createTransaction=async(req:Request,res:Response)=>{
    try {
        const {sender,recipient,amount,password}= req.body;

        // fetch the sender wallet
        const senderWallet=await Wallet.findOne({address:sender.toLowerCase()});
        if(!senderWallet)
        {
            return res.status(404).json({error:"Sender wallet not found"});
        }
        // validate the inputs
        txProcessor.validateTransactionInputs(senderWallet.balance,amount,recipient);
        // decrypt the private keys using the provided pass
        const decryptedKeys=keyManager.decryptPrivateKeys(senderWallet.encryptedPrivateKeys,password);
        // construct the raw transaction
        const rawTx=txProcessor.constructTransaction(sender,recipient,amount,senderWallet.nonce);
        // sign and persist the transaction
        const signedTx=await txProcessor.signAndPersistTransaction(rawTx,decryptedKeys);
        // update the sender nonce
        senderWallet.nonce+=1;
        await senderWallet.save();
        // return the transaction details
        return res.status(201).json({
            message:"Transaction created successfully",
            txId:signedTx.txId,
            Transaction:signedTx
        });

    } catch (error:any) {
        console.log("Create transaction error",error);
        return res.status(500).json({error:"internal server error"});
    }
}

export const verifyTransaction=async(req:Request,res:Response)=>
{
   try {
    const txId=req.body.txId;
    if(!txId) {
        return res.status(400).json({error:"Transaction ID is required"});
    }
    //fetch the transaction from the db using the tx
    // Note: do NOT use .lean() - SignatureValidator needs proper Buffer types
    const tx=await Transaction.findOne({txId});
    if(!tx)
    {
        return res.status(404).json({error:"Transaction not found"});
    }
    // call hybrid validator
    const result = await validator.verifyTransaction(tx as unknown as SignedTransaction);
    //return verfied details
    if(result.isValid){
         return res.status(200).json({
            valid: true,
            message:"Transaction is valid",
            txId: tx.txId,
            status:"Verified",
            signatures: {
                ecdsa: result.isEcdsaValid,
                dilithium: result.isDilithiumValid
            },
            transaction: tx
         });
    }
    else{
    return res.status(400).json({
        valid: false,
        message:"Transaction is invalid",
        txId: tx.txId,
        error: result.error,
        status: "Invalid Signature",
        signatures: {
            ecdsa: result.isEcdsaValid,
            dilithium: result.isDilithiumValid
        }
    });
}

   } catch (error) {
    console.log("Verify transaction error",error);
    return res.status(500).json({error:"internal server error"});
   }
}

export const getTransactionHistory=async(req:Request,res:Response)=> {
    try {
        const address = req.params.address;
        if (!address) {
            return res.status(400).json({error: "Address is required"});
        }
        const transactions = await Transaction.find({
            $or: [
                { sender: address.toLowerCase() },
                { recipient: address.toLowerCase() }
            ]
        }).sort({ timestamp: -1 }).lean();
        
        return res.status(200).json({
            count: transactions.length,
            transactions
        });
    } catch (error) {
        console.log("Get transaction history error", error);
        return res.status(500).json({error: "internal server error"});
    }
}