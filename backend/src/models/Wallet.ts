import {Schema,model,Document} from 'mongoose';
export interface Iwallet extends Document
{
    address:string;
    publicKeys:{
         ecdsa:Buffer;
         dilithium:Buffer
    }
    encryptedPrivateKeys:{
        encryptedClassical:Buffer;
        encryptedPQC:Buffer;
        iv:Buffer;
        authTag:Buffer;
        salt:Buffer;

    };
    balance:number;
    nonce:number;

}

const Walletschema=new Schema<Iwallet>(
    {
        address:{
            type:String,
            required:true,
            unique:true,
            index:true,
            lowercase:true
        },
        publicKeys:
        {
            ecdsa:{
                type:Buffer,
                require:true
            },
            dilithium:
            {
                type:Buffer,
                require:true
            }
        },
        encryptedPrivateKeys:{
            encryptedClassical:
            {
                type:Buffer,
                require:true
            },
            encryptedPQC:
            {
                type:Buffer,
                require:true
            
            },
            iv:
            {
                
                type:Buffer,
                require:true
            },
            authTag:{
                
                type:Buffer,
                require:true
            },
            salt:
            {
                
                type:Buffer,
                require:true
            }
        },
        balance:{
            type:Number,
            default:0,
            min:0
        },
        nonce:
        {
            type:Number,
            default:0,

        },
    },
    {
        timestamps:true
    }

);
export const Wallet =model<Iwallet>('wallet',Walletschema);
