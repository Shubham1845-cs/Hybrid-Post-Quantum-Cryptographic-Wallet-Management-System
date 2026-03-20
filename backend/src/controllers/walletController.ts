import { NextFunction, Request,Response } from "express";
import { KeyManager } from "../services/KeyManager";
import {Wallet} from  "../models/Wallet"
import { create } from "node:domain";
import { version } from "node:os";

const keyManager=new KeyManager();

export const generateWallet=async(req:Request,res:Response)=>{
    try {
        const password=req.body.password;
        if(!password || password.length<8)
        {
            return res.status(400).json({error:'Password must be atleast 8 characters long'});

        }
        //generate the hybrid key pair
        const walletData=keyManager.generateHybridKeyPair();

        // encrypt the private keys with the users password
        const encryptedKeys=keyManager.encryptPrivateKeys(walletData.privateKey.ecdsa,walletData.privateKey.dilithium,password)
        
        // store in the mongodb using the wallet model
        const newWallet= await Wallet.create({
            address:walletData.walletAddress,
            publicKeys:{
                ecdsa:walletData.publicKey.ecdsa,
                dilithium:walletData.publicKey.dilithium
            },
            encryptedPrivateKeys:encryptedKeys,
            balance:100,  //new wallet with the some test balance
            nonce:0

        });

        // Return success response with wallet data
        return res.status(201).json({
            message: "Wallet created successfully",
            address: newWallet.address,
            balance: newWallet.balance,
            publicKeys: {
                ecdsa: walletData.publicKey.ecdsa,
                dilithium: walletData.publicKey.dilithium
            }
        });
    } catch (error:any) {
          console.log("Wallet genration error",error);
          return res.status(500).json({error:"internal server Error"});
    }

};

export const getWallet=async(req:Request,res:Response)=>
{
    try {
        const address=req.params.address;
        //ensure the address is provided
        if(!address)
        {
            return res.status(400).json({error:"Wallet address is required"});

        }
        // fetch the wallet from the db
        const wallet=await Wallet.findOne({address:address.toLowerCase()},{encryptedPrivateKeys:0}).lean();
        if(!wallet)
        {
            return res.status(404).json({error:"wallet not found"});

        }
        // return the public data
        return res.status(200).json({
            address:wallet.address,
            balance:wallet.balance,
            nonce:wallet.nonce,
            publicKeys:{
                ecdsa:wallet.publicKeys.ecdsa,
                dilithium:wallet.publicKeys.dilithium
            }
            
        })
    } catch (error:any) {
        console.log("Get wallet error",error);
        return res.status(500).json({error:"internal server error"});
    }
};
export const exportWallet=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const address=req.params.address;
        const wallet=await Wallet.findOne({address:address.toLocaleLowerCase()});
        if(!wallet)
        {
            return  res.status(404).json({erro:"Wallet not found"});

        }
        const exportData={
            version:"1.0.0",
            cryptoType:"Hybrid (ECDSA + ML-DSA)",
            address:wallet.address,
            publicKeys:{
                ecdsa:wallet.publicKeys.ecdsa.toString('hex'),
                dilithium:wallet.publicKeys.dilithium.toString('hex')

            },
            // The user will need their original password to use this.
            encryptedVault:{
                classical:wallet.encryptedPrivateKeys.encryptedClassical.toString('hex'),
                pqc:wallet.encryptedPrivateKeys.encryptedPQC.toString('hex'),
                salt:wallet.encryptedPrivateKeys.salt.toString('hex'),
                iv:wallet.encryptedPrivateKeys.iv.toString('hex'),
                authTag:wallet.encryptedPrivateKeys.authTag.toString('hex')
            }
        };
        res.status(200).json(exportData);
    } catch (error) {
        next(error);
    }
}