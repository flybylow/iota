/**
 * IOTA Identity Configuration
 * 
 * This file contains configuration for connecting to the IOTA network
 */

export const IOTA_CONFIG = {
  // IOTA Testnet API endpoint
  apiEndpoint: process.env.NEXT_PUBLIC_IOTA_API_ENDPOINT || 'https://api.testnet.iotaledger.net',
  
  // Network type
  network: process.env.NEXT_PUBLIC_NETWORK || 'testnet',
  
  // Explorer URL for testnet
  explorerUrl: 'https://explorer.iota.org/iota-testnet',
  
  // Faucet URL for getting testnet tokens
  // NOTE: Using IOTA testnet faucet (correct for IOTA hackathon)
  // Alternative: Join IOTA Discord: https://discord.iota.org
  faucetUrl: 'https://faucet.testnet.iotaledger.net',
  faucetNote: '💧 IOTA testnet faucet - request tokens for development',
};

export type NetworkType = 'testnet' | 'mainnet';

