import type { TransactionResponce } from "../types/api.types";
// direction check

export const isSent=(tx:TransactionResponce,walletAddress:string):boolean=>
{
    return tx.sender ===walletAddress;
}

// sort newest  first

export const sortByNewest=(tx:TransactionResponce[]):TransactionResponce[]=>
{
    return [...tx].sort((a,b)=>{return new Date(b.timestamp).getTime()- new Date(a.timestamp).getTime()});
}
// filter by direction
export type FilterType='all'|'sent'|'received';

export const filterTransactions=(tx:TransactionResponce[],filter:FilterType,walletAddress:string):TransactionResponce[]=>
{
    if(filter==='sent') return tx.filter((tx)=>isSent(tx,walletAddress));
    if(filter ==='received') return tx.filter((tx)=> !isSent(tx,walletAddress));
    return tx;
};

// relative time display 
export const getRelativeTime=(timestamp :string):string=>{
    const diff=Date.now()-new Date(timestamp).getTime();
    const minute=Math.floor(diff/60000);
    const hours=Math.floor(diff/3600000);
    const days=Math.floor(diff/86400000);
    
    if(minute<1) return 'just now';
    if(minute<60) return `${minute}m ago`;
    if(hours<24) return `${hours}h ago`;
    
    return `${days}d ago`;


} 
// summary stats for the header
export interface TxSummary{
      totalSent:number;
      totalReceived:number;
      sentCount:number;
      receivedCount:number;
      
}
export const getTxSummary = (
    txs: TransactionResponce[],
    walletAddress: string
): TxSummary => {
    return txs.reduce(
        (acc, tx) => {
            if (tx.sender === walletAddress) {
                acc.totalSent += tx.amount;
                acc.sentCount++;
            } else {
                acc.totalReceived += tx.amount;
                acc.receivedCount++;
            }
            return acc;
        },
        { totalSent: 0, totalReceived: 0, sentCount: 0, receivedCount: 0 }
    );
};