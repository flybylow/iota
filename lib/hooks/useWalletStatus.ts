'use client';

import { useCurrentAccount, useCurrentWallet } from '@iota/dapp-kit';

/**
 * Custom hook to check wallet connection status
 * 
 * @returns Wallet connection information including address and wallet type
 */
export function useWalletStatus() {
  const account = useCurrentAccount();
  const { currentWallet } = useCurrentWallet();
  
  return {
    isConnected: !!account,
    address: account?.address,
    wallet: currentWallet,
    account,
  };
}

