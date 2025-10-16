/**
 * IOTA Identity Configuration
 * 
 * This file contains configuration for connecting to the IOTA network
 */

export const IOTA_CONFIG = {
  // Shimmer Testnet API endpoint
  apiEndpoint: process.env.NEXT_PUBLIC_IOTA_API_ENDPOINT || 'https://api.testnet.shimmer.network',
  
  // Network type
  network: process.env.NEXT_PUBLIC_NETWORK || 'testnet',
  
  // Explorer URL for testnet
  explorerUrl: 'https://explorer.shimmer.network/testnet',
  
  // Faucet URL for getting testnet tokens
  faucetUrl: 'https://faucet.testnet.shimmer.network',
};

export type NetworkType = 'testnet' | 'mainnet';

