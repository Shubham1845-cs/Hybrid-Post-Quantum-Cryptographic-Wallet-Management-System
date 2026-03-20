const messages:Record<string,string> = {
    'wallet.generate': 'Generating wallet...',
    'wallet.load': 'Loading wallet...',
    'tx.create': 'Creating transaction...',
    'tx.history': 'Loading transaction history...',

};
export const getLoadingMessage=(context:string | null):string =>
{
      if (!context) return 'Loading...';
  return messages[context] ?? 'Loading...';
}