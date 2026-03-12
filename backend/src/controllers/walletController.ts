import { Request,Response } from "express";
import { KeyManager } from "src/services/KeyManager";
import {Wallet} from  "src/models/Wallet"
import { create } from "node:domain";

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