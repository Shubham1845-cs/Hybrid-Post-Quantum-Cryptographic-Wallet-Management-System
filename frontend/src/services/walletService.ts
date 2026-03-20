import  apiClient from './apiClient';
import type {WalletResponce,GenerateWalletRequest} from '../types/api.types';

// genrate hybrid wallet

export const generateWallet=async(password:string):Promise<WalletResponce> =>
{
    const payload:GenerateWalletRequest={password};
    const response=await apiClient.post<WalletResponce>('/api/wallet/generate',payload);
    return response.data;
};

//  get wallet by address

export  const getWallet=async(address:string):Promise<WalletResponce> =>
{
    const response = await apiClient.get<WalletResponce>(`/api/wallet/${address}`);
    return response.data;
};

// export wallet
export const exportWallet=async(address:string):Promise<Blob> =>
{
    const responce=await apiClient.get(`/api/wallet/${address}/export`);
    return responce.data;
};