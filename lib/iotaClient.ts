/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * IOTA Client Integration
 * 
 * Handles connection to IOTA testnet for publishing DIDs and credentials
 */

import { IOTA_CONFIG } from './config';

let ClientInstance: any = null;
let clientInitialized = false;

/**
 * Initialize IOTA Client for network operations
 * This is separate from WASM init because it requires network connection
 */
export async function initClient() {
  if (clientInitialized && ClientInstance) {
    return ClientInstance;
  }
  
  try {
    console.log('🔄 Initializing IOTA Client...');
    console.log('📡 Connecting to:', IOTA_CONFIG.apiEndpoint);
    
    const identityModule = await import('@iota/identity-wasm/web');
    
    // Attempt to create client connection
    // Note: This requires the SDK's Client class which may not be available in all versions
    const Client = (identityModule as any).Client;
    
    if (!Client) {
      console.warn('⚠️ Client class not available in this SDK version');
      console.warn('⚠️ DIDs will be created locally only');
      return null;
    }
    
    // Try to connect to network
    try {
      ClientInstance = await Client.create({
        nodes: [IOTA_CONFIG.apiEndpoint],
        localPow: true, // Use local proof-of-work for testnet
      });
      
      clientInitialized = true;
      console.log('✅ IOTA Client initialized');
      console.log('🌐 Network: Connected to IOTA testnet');
      
      return ClientInstance;
    } catch (networkError) {
      console.warn('⚠️  Network connection failed:', networkError);
      console.warn('⚠️  Falling back to local DID creation');
      return null;
    }
  } catch (error) {
    console.error('❌ Failed to initialize IOTA Client:', error);
    console.log('💡 DIDs will be created locally (not published to blockchain)');
    return null;
  }
}

/**
 * Check if we have an active network connection
 */
export function isClientConnected(): boolean {
  return clientInitialized && ClientInstance !== null;
}

/**
 * Get client info for debugging
 */
export async function getClientInfo() {
  if (!ClientInstance) {
    return {
      connected: false,
      message: 'No client connection - creating DIDs locally only'
    };
  }
  
  try {
    // Try to get network info
    const info = await ClientInstance.getInfo();
    return {
      connected: true,
      networkInfo: info,
      message: 'Connected to IOTA testnet'
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Connection check failed'
    };
  }
}

/**
 * Get the active client instance (may be null)
 */
export function getClient() {
  return ClientInstance;
}

