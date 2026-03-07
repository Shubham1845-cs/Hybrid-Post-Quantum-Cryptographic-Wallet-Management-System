import {Schema,model,Document} from 'mongoose'

export interface Transactionstruct extends Document{
    txId:string;
    sender:string;
    recipient:string;
    amount:number;
    timestamp:Date;
    nonce:number;
    dualsingnature:{
        ecdsa:{
            r:string;
            s:string
        };
        dilithium:Buffer;

    };
    verified:boolean;
}

const Transactionschema=new Schema<Transactionstruct>({
    txId:{
        type:String,
        unique:true,
        required:true,
        index:true
    },
    sender:{
        type:String,
        required:true,
        lowercase:true,
        index:true
    },
    recipient:{
        type:String,
        required:true,
        lowercase:true,
        index:true
    },
    amount:
    {
        type:Number,
        required:true,
        min:[0,'Amount can not be negative']

    },
    timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
    nonce:
    {
        type:Number,
        required:true
    },
    dualsingnature:{
        ecdsa:{
            r:{
                type:String,
                required:true
            },
             s:{
                type:String,
                required:true
            }
        },
        dilithium:{
            type:Buffer,
            required:true
        }
    },
    verified:
    {
        type:Boolean,
        default:false
    }
},
{
    versionKey:false
}
)
export const Transaction=model<Transactionstruct>('Transcation',Transactionschema);