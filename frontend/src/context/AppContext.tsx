import React,{createContext,useContext,useReducer} from 'react';
import type { AppState,Action,AppContextType } from '../types/state.types';

// initail state
const initialState:AppState={
    wallet:null,
    transactions:[],
    loading:false,
    error:null,
}

//Reducer
const appReducer=(state:AppState,action:Action):AppState =>
{
    switch (action.type)
    {
        case 'SET_WALLET':
            return {
                ...state,
                wallet:action.payload,
                error:null,
            };
        case 'ClEAR_WALLET':
            return {
                ...state,
                wallet:null,
                transactions:[],
                error:null
                
            };
        case 'SET_TRANSACTIONS':
            return{
                ...state,
                transactions:action.payload,
                error:null
            };
        case 'ADD_TRANSACTION':
            return{
                ...state,
                transactions:[action.payload,...state.transactions],

            };
        case 'SET_LOADING':
            return{
                ...state,
                loading:action.payload,
            };
        case 'SET_ERROR':
            return {
                ...state,
                error:action.payload,
                loading:false,
            };
        default:
            return state;
        
    }
}
// create conetext

const AppContext=createContext<AppContextType | undefined>(undefined);

// provider  component

export const AppProvider: React.FC<{children:React.ReactNode}> =({children})=>{
    const [state,dispatch]=useReducer(appReducer,initialState);
    return(
        <AppContext.Provider value={{state,dispatch}}>
            {children}
        </AppContext.Provider>
    )
}

// custom Hook
export const useAppContext=():AppContextType =>{
    const context=useContext(AppContext);
    if(!context)
    {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
}
