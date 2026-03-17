import { useAppContext } from "../context/AppContext";
import { createTransaction,getTransactionHistory } from "../services/transactionService";
import type { TransactionResponce } from "../types/api.types";
// Custom hook — encapsulates all transaction operations

export const useTransaction=()=>
{
    const {state,dispatch}=useAppContext();
     
    //create and sign a new transaction
    const handleCreateTransaction=async(sender:string,recipient:string,amount:number,password:string):Promise<TransactionResponce | null > =>
    {
        dispatch({type:'SET_LOADING',payload:{loading:true}});
        dispatch({type:'SET_ERROR',payload:null});
        try {
            const transaction=await createTransaction(sender,recipient,amount,password);
            dispatch({type:'ADD_TRANSACTION',payload:transaction});
            return transaction;

        } catch (error:any) {
            dispatch({type:'SET_ERROR',payload:error.message});
            return null;
        }
        finally{
            dispatch({type:'SET_LOADING',payload:{loading:false}});
              
        }
    };
    // load transaction history for a given address
    const handleLoadHistory=async(address:string):Promise<void>=>{
         dispatch({type:'SET_LOADING',payload:{loading:true}});
         try {
             const transaction=await getTransactionHistory(address);
            dispatch({type:'SET_TRANSACTIONS',payload:transaction});
         } catch (error:any) {
            dispatch({type:'SET_ERROR',payload:error.message});
         }
         finally{
             dispatch({type:'SET_LOADING',payload:{loading:false}});
         }
    };

    return{
        transaction:state.transactions,
        loading:state.loading,
        error:state.error,
        handleCreateTransaction,
        handleLoadHistory,
    };
};
