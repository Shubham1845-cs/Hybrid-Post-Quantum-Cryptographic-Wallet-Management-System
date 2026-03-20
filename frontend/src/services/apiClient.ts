import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../types/api.types';

// axois instance 

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers:
    {
        'Content-Type': 'application/json',
    },
    timeout: 15000,   // key gen is slow
});

// request interceptor- run before every   outgoing request

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // log outgoing req in development
    if (import.meta.env.MODE === 'development')
    {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url} `,config.data ?? '');

    }
    return config;
},
  (error:AxiosError)=>
  {
    return Promise.reject(error);

  }
);

// Respons interceptor
apiClient.interceptors.response.use((response:AxiosResponse)=>
{
      return response;
}) ,
(error:AxiosError)=>
{
     const ApiError:ApiError ={
        message:"an unexprected error occured",
        status: error.response?.status ?? 0,
     };

     if(error.response)
     {
        const data= error.response.data as {message?:string; code?:string};
        ApiError.message=data?.message ?? `Server error : ${error.response.status}`;
        ApiError.code=data?.code;


     }
     else if(error.request)
     {
         ApiError.message ='Network error — check your connection or the server is down';
         ApiError.status=0;
     }
     else{
        ApiError.message=error.message;
     }
    if (import.meta.env.MODE === 'development') { // ✅ Vite
        console.error('[API Error]', ApiError);
    }

    return Promise.reject(ApiError);
}  

export default apiClient;
