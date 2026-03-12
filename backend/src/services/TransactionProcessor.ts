import crypto from 'crypto'
import { DecryptedKeys } from '../types/crypto.types'
import { ECDSACrypto } from './ECDSACrypto'
import {DilithiumCrypto} from './DilithiumCrypto'
import { SignedTransaction, Transaction } from '../types/transaction.types'   
import {Transaction as TransactionModel} from '../models/Transaction';

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
    
    async signAndPersistTransaction(
        tx:Transaction,
        privateKeys:DecryptedKeys,

    ):Promise<SignedTransaction>{
        const dataString = `${tx.sender}|${tx.recipient}|${tx.amount}|${tx.nonce}|${tx.timestamp}`;
        const txId = crypto.createHash('sha256').update(dataString).digest('hex');
        const dataToSign = Buffer.from(txId, 'hex');

        // B. Generate Dual Signatures
        const ecdsaSignature = this.ecdsa.sign(dataToSign, privateKeys.classicalPrivateKey);
        const dilithiumSignature = this.dilithium.sign(dataToSign, privateKeys.pqcPrivateKey);

        const signedTx: SignedTransaction = {
            ...tx,
            txId,
            dualSignature: {
                ecdsa: ecdsaSignature,
                dilithium: dilithiumSignature,
            },
            status: 'pending' // Initial state
        };

        // C. Persistence: Save to MongoDB
        // This satisfies Requirement 8.3 (Transaction Storage)
        await TransactionModel .create(signedTx);
        return signedTx;
    }

    /**
     * Retrieval Method: Find a specific transaction by its Hash
     */
    async getTransactionByHash(txId: string) {
        const tx = await TransactionModel.findOne({ txId }).lean();
        if (!tx) throw new Error("Transaction not found in ledger.");
        return tx;
    }
    }

