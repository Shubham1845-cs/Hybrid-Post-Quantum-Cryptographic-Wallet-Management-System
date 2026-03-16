import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateWallet, getWallet } from '../services/walletService';

export const useWallet = () => {
  const { state, dispatch } = useAppContext();

  const handleGenerateWallet = async (password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR',   payload: null }); // clear old errors first
    try {
      const wallet = await generateWallet(password);
      dispatch({ type: 'SET_WALLET', payload: wallet });
      return true;  // ← signals success to the form
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return false; // ← signals failure to the form
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleLoadWallet = async (address: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const wallet = await getWallet(address);
      dispatch({ type: 'SET_WALLET', payload: wallet });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleClearWallet = (): void => {
    dispatch({ type: 'ClEAR_WALLET' });
  };

  return {
    wallet:               state.wallet,
    loading:            state.loading,
    error:                state.error,
    handleGenerateWallet,
    handleLoadWallet,
    handleClearWallet,
  };
};