'use client';

import { createNetworkConfig, IotaClientProvider, WalletProvider } from '@iota/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useMemo } from 'react';

// Import dApp Kit styles
import '@iota/dapp-kit/dist/index.css';

// Lazy load IOTA SDK to avoid SSR issues
let getFullnodeUrl: ((network: 'testnet' | 'mainnet') => string) | null = null;

const loadIotaClient = async () => {
  if (typeof window === 'undefined') return;
  if (getFullnodeUrl) return;
  
  try {
    const module = await import('@iota/iota-sdk/client');
    getFullnodeUrl = module.getFullnodeUrl;
  } catch (error) {
    console.error('Failed to load IOTA SDK client:', error);
  }
};

// Configure network (IOTA Testnet and Mainnet) - lazy loaded
// Use Next.js API route proxy to avoid CORS issues
const getNetworkConfig = () => {
  if (typeof window !== 'undefined') {
    // For client-side: use Next.js API proxy to avoid CORS
    const baseUrl = window.location.origin;
    return {
      testnet: { url: `${baseUrl}/api/iota` },
      mainnet: { url: 'https://api.mainnet.iotaledger.net' },
    };
  }
  // For SSR: use direct endpoint (server-side has no CORS)
  // Using api.testnet.iota.cafe - the .iotaledger.net endpoint returns 404
  return {
    testnet: { url: 'https://api.testnet.iota.cafe' },
    mainnet: { url: 'https://api.mainnet.iotaledger.net' },
  };
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Reduce refetching in dev
      refetchOnWindowFocus: false,
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

/**
 * IOTA dApp Kit Providers
 * 
 * Provides wallet connection, network configuration, and React Query
 * to all child components.
 */
export function Providers({ children }: ProvidersProps) {
  // Load IOTA SDK on client side
  if (typeof window !== 'undefined') {
    loadIotaClient();
  }

  // Memoize network config to avoid recreating on every render
  const networkConfig = useMemo(() => {
    const config = getNetworkConfig();
    const { networkConfig: nc } = createNetworkConfig({
      testnet: { url: config.testnet.url },
      mainnet: { url: config.mainnet.url },
    });
    return nc;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <IotaClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider>
          {children}
        </WalletProvider>
      </IotaClientProvider>
    </QueryClientProvider>
  );
}

