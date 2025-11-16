'use client';

import { useEffect, useRef } from 'react';
import { useCurrentAccount, useCurrentWallet } from '@iota/dapp-kit';

/**
 * Custom hook to check wallet connection status
 * 
 * @returns Wallet connection information including address and wallet type
 */
export function useWalletStatus() {
  const account = useCurrentAccount();
  const { currentWallet } = useCurrentWallet();
  const wasConnected = useRef(false);

  useEffect(() => {
    const isConnected = Boolean(account);

    if (isConnected && !wasConnected.current) {
      console.log('🔌 Wallet connected!', {
        address: account?.address,
        label: currentWallet?.name,
        icon: currentWallet?.icon,
      });
    } else if (!isConnected && wasConnected.current) {
      console.log('🔌 Wallet disconnected.');
    }

    wasConnected.current = isConnected;
  }, [account, currentWallet]);
  
  return {
    isConnected: !!account,
    address: account?.address,
    wallet: currentWallet,
    account,
  };
}

