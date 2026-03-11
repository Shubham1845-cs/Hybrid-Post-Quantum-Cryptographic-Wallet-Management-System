import crypto from 'crypto'
import { DecryptedKeys } from '../types/crypto.types'
import { ECDSACrypto } from './ECDSACrypto'
import {DilithiumCrypto} from './DilithiumCrypto'
import { SignedTransaction, Transaction } from '../types/transaction.types'   
export class TransactionProcessor{
    private ecdsa=new ECDSACrypto();
    private dilithium=new DilithiumCrypto();

    validateTransactionInputs(senderBalance:number,
        amount:number,
        recipientAddress:string):boolean {
        if(amount<=0)
        {
            throw new Error('Transaction amount must be greater than zero');

        }
        if(senderBalance<amount)
        {
            throw new Error('Insufficient balance for this transcation ');

        }
        if(!recipientAddress || recipientAddress.length <40)
        {
            throw new Error('Invalid recipient address format.');

        }
        return true;
    }
    constructTransaction(
        sender:string,
        recipient:string,
        amount:number,
        nonce:number
    ):Transaction{
        return {
            sender,
            recipient,
            amount,
            nonce,
            
            timestamp:Date.now(),
        };
    }
    serializeTransaction(tx:Transaction):Buffer{
        const dataString=`${tx.sender}|${tx.recipient}|${tx.amount}|${tx.nonce}|${tx.timestamp}`;
        //convert to buffer
        return Buffer.from(dataString,'utf-8');
    }
    deserializeTransaction(bytes:Buffer):Transaction{
        const dataString=bytes.toString('utf-8');
        const parts=dataString.split('|');
        if(parts.length!==5)
        {
            throw new Error('Corrupted or invalid transaction data');

        }
        return{
            sender:parts[0],
            recipient:parts[1],
            amount:Number(parts[2]),
            nonce:Number(parts[3]),
            timestamp:Number(parts[4]),

        };

    }
    signTransaction(tx:Transaction,privateKeys:DecryptedKeys):SignedTransaction{
         const serializedBytes=this.serializeTransaction(tx);
         const txId=crypto.createHash('sha256').update(serializedBytes).digest('hex');
         const dataToSign=Buffer.from(txId,'hex');
         const ecdsaSignature=this.ecdsa.sign(dataToSign,privateKeys.classicalPrivateKey);
         const dilithiumSignature=this.dilithium.sign(dataToSign,privateKeys.pqcPrivateKey);
         return{
            ...tx,
            txId,
            dualSignature:{
                ecdsa:ecdsaSignature,
                dilithium:dilithiumSignature,
            },
         };
    }

}