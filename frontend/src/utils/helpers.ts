export const truncate=(str:string,start:number,end:number):string =>
{
    if(!str)
    {
        return '';

    }
    if(str.length <=start + end ) return str;
    return `${str.slice(0,start)} ...${str.slice(-end)}`;


};

export const formatBalance=(balance:number):string =>
{
    return balance.toFixed(6);
       
}