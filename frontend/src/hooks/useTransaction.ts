import { useAppContext } from "../context/AppContext";
import { createTransaction,getTransactionHistory } from "../services/transactionService";
// Custom hook — encapsulates all transaction operations

export const useTransaction=()=>
{
    const {state,dispatch}=useAppContext();
     
    //create and sign a new transaction
    const handleCreateTransaction=async(sender:string,recipient:string,amount:number,password:string):Promise<void> =>
    {
        dispatch({type:'SET_LOADING',payload:true});
        try {
            const transaction=await createTransaction(sender,recipient,amount,password);
            dispatch({type:'ADD_TRANSACTION',payload:transaction});

        } catch (error:any) {
            dispatch({type:'SET_ERROR',payload:error.message});
        }
        finally{
            dispatch({type:'SET_LOADING',payload:false});
        }
    };
    // load transaction history for a given address
    const handleLoadHistory=async(address:string):Promise<void>=>{
         dispatch({type:'SET_LOADING',payload:true});
         try {
             const transaction=await getTransactionHistory(address);
            dispatch({type:'SET_TRANSACTIONS',payload:transaction});
         } catch (error:any) {
            dispatch({type:'SET_ERROR',payload:error.message});
         }
         finally{
             dispatch({type:'SET_LOADING',payload:false});
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
