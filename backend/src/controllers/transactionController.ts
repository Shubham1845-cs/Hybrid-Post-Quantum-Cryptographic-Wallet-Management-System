import {Request,Response} from 'express';
import { Wallet } from 'src/models/Wallet';
import { Transaction } from 'src/models/Transaction';
import { TransactionProcessor } from 'src/services/TransactionProcessor';
import { KeyManager } from 'src/services/KeyManager';
import { SignatureValidator } from 'src/services/SignatureValidator';
const keyManager=new KeyManager();

const txProcessor=new TransactionProcessor();

type SignatureValidationResult = {
    isValid: boolean;
    error?: string;
    [key: string]: unknown;
};

const validator=new SignatureValidator();

const validateTxSignature = async (tx: unknown): Promise<SignatureValidationResult> => {
    const v = validator as unknown as {
        validateSignature?: (payload: unknown) => Promise<SignatureValidationResult>;
        validate?: (payload: unknown) => Promise<SignatureValidationResult>;
        verify?: (payload: unknown) => Promise<SignatureValidationResult>;
    };

    if (typeof v.validateSignature === 'function') return v.validateSignature(tx);
    if (typeof v.validate === 'function') return v.validate(tx);
    if (typeof v.verify === 'function') return v.verify(tx);

    throw new Error('SignatureValidator method not found');
};

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
    const txId=req.params.txId;
    //fetch the transaction from the db using the tx
    const tx=await Transaction.findOne({txId}).lean();
    if(!tx)
    {
        return res.status(404).json({error:"Transaction not found"});
    }
    // call hybrid validator
    const result = await validateTxSignature(tx);
    //return verfied details
    if(result.isValid){
         return res.status(200).json({
            message:"Transaction is valid",
            txId:(tx as any).txId,
            status:"Verified",
            details:result
         });
    }
    else{
    return res.status(400).json({
        message:"Transaction is invalid",
        txId:(tx as any).txId,
        details:result,
        error:result.error,
        status: "Invalid Signature",
    });
}

   } catch (error) {
    console.log("Verify transaction error",error);
    return res.status(500).json({error:"internal server error"});
   }
}