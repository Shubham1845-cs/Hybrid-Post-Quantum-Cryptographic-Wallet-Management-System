export const isValidAddress=(address:string):boolean=>{
    return /^[0-9a-fA-F]{64}$/.test(address);

};

// amount must be real positive number within balance
export const isValidAmount=(amount:number|'',balance:number):boolean=>
{
    if(amount==='')  return false;
    if(amount<=0)     return false;
    if(amount> balance)  return false;
    if(isNaN(amount))   return false;
    return true;
    
}
// format a timeStamp string  into readable local time
export const formatTimestamp=(timestamp:string):string =>
{
    return new Date(timestamp).toLocaleString('en-IN',{
        day:'2-digit',
        month:'2-digit',
        year:'numeric',
        hour:'2-digit',
        minute:'2-digit',
        second:'2-digit',
        hour12:true,
    });
};
