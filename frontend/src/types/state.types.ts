import type React from "react";
import type { WalletResponce,TransactionResponce } from "./api.types";

//app state shape
export interface AppState{
    wallet:WalletResponce | null;
    transactions:TransactionResponce[];
    loading:boolean;
    loadingContext:  string | null;
    error:string | null;
}

// all posssible action

export type Action=
 | {type:'SET_WALLET'; payload:WalletResponce}
 |{type:'ClEAR_WALLET'}
 |{type:'SET_TRANSACTIONS'; payload:TransactionResponce[]}
 |{type:'ADD_TRANSACTION'; payload:TransactionResponce}
 | { type: 'SET_LOADING';      payload: { loading: boolean; context?: string } } 
 |{type:'SET_ERROR'; payload:string | null}

 export interface AppContextType
 {
   state:AppState;
   dispatch:React.Dispatch<Action>;
 }