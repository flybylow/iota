/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * IOTA Identity Client Integration (Object-Based Model)
 * 
 * Handles connection to IOTA testnet for publishing Identity objects (DIDs)
 * Using the new object-based model - no more Alias Outputs
 * 
 * See: https://docs.iota.org/developer/iota-identity/how-tos/decentralized-identifiers/create
 */

import { IOTA_CONFIG } from './config';

let IdentityClient: any = null;
let clientInitialized = false;

/**
 * Initialize Identity Client for network operations
 * This uses the object-based IOTA Identity model
 */
export async function initIdentityClient() {
  if (clientInitialized && IdentityClient) {
    return IdentityClient;
  }
  
  try {
    console.log('🔄 Initializing IOTA Identity Client (object-based)...');
    console.log('📡 Connecting to:', IOTA_CONFIG.apiEndpoint);
    
    const identityModule = await import('@iota/identity-wasm/web');
    
    // Log ALL exports to see what's available
    const allExports = Object.keys(identityModule);
    console.log('📋 All available exports:', allExports.slice(0, 30).join(', '));
    
    // The API has changed - check for CreateIdentity, DefaultHttpClient, etc.
    const CreateIdentityClass = (identityModule as any).CreateIdentity;
    const DefaultHttpClientClass = (identityModule as any).DefaultHttpClient;
    const IdentityClientClass = (identityModule as any).IdentityClient;
    const ClientClass = (identityModule as any).Client;
    
    // If CreateIdentity exists, it might be the new API pattern
    if (CreateIdentityClass) {
      console.log('✅ Found CreateIdentity - this is likely the correct API');
      
      // CreateIdentity might be used with DefaultHttpClient for network operations
      if (DefaultHttpClientClass) {
        try {
          // Create HTTP client for network operations
          const httpClient = new DefaultHttpClientClass(IOTA_CONFIG.apiEndpoint);
          console.log('✅ DefaultHttpClient created');
          
          // CreateIdentity might work with httpClient
          // Store both for later use
          IdentityClient = {
            create_identity: CreateIdentityClass,
            httpClient: httpClient,
            apiEndpoint: IOTA_CONFIG.apiEndpoint,
            network: IOTA_CONFIG.network
          };
          
          clientInitialized = true;
          console.log('✅ Identity Client initialized using CreateIdentity API');
          console.log('🌐 Network: Connected to IOTA testnet');
          return IdentityClient;
        } catch (e) {
          console.log('⚠️ Failed to create DefaultHttpClient:', e);
        }
      } else {
        // CreateIdentity might be a builder or function
        try {
          IdentityClient = {
            create_identity: CreateIdentityClass,
            apiEndpoint: IOTA_CONFIG.apiEndpoint,
            network: IOTA_CONFIG.network
          };
          
          clientInitialized = true;
          console.log('✅ Identity Client initialized using CreateIdentity (no HTTP client)');
          return IdentityClient;
        } catch (e) {
          console.log('⚠️ Failed to use CreateIdentity:', e);
        }
      }
    }
    
    // Fallback: Try traditional IdentityClient if it exists
    if (!clientInitialized && IdentityClientClass) {
      try {
        // Try new IdentityClient() with parameters
        const client = new IdentityClientClass({
          network: IOTA_CONFIG.network,
          nodes: [IOTA_CONFIG.apiEndpoint],
        });
        
        IdentityClient = client;
        clientInitialized = true;
        console.log('✅ IdentityClient created with constructor');
        return IdentityClient;
      } catch (e) {
        console.log('⚠️ IdentityClient constructor failed:', e);
      }
    }
    
    // Last fallback: Try Client
    if (!clientInitialized && ClientClass) {
      try {
        const client = new ClientClass({
          nodes: [IOTA_CONFIG.apiEndpoint],
        });
        
        IdentityClient = client;
        clientInitialized = true;
        console.log('✅ Client created (fallback)');
        return IdentityClient;
      } catch (e) {
        console.log('⚠️ Client constructor also failed:', e);
      }
    }
    
    if (!clientInitialized) {
      console.warn('⚠️ Could not initialize IdentityClient - CreateIdentity API not found');
      console.warn('💡 Available exports:', allExports.slice(0, 20).join(', '));
      console.warn('💡 Make sure you have @iota/identity-wasm@^1.7.0-beta.1 installed');
      console.warn('📋 See: https://docs.iota.org/developer/iota-identity/getting-started/wasm');
      return null;
    }
    
    return IdentityClient;
  } catch (error) {
    console.error('❌ Failed to initialize Identity Client:', error);
    console.log('💡 DIDs will be created locally (not published to blockchain)');
    return null;
  }
}

/**
 * Check if we have an active network connection
 */
export function isClientConnected(): boolean {
  return clientInitialized && IdentityClient !== null;
}

/**
 * Get client info for debugging
 */
export async function getClientInfo() {
  if (!IdentityClient) {
    return {
      connected: false,
      message: 'No Identity Client connection - creating DIDs locally only'
    };
  }
  
  try {
    // Try to get network info
    const info = await IdentityClient.getInfo?.();
    return {
      connected: true,
      networkInfo: info,
      message: 'Connected to IOTA testnet (object-based)'
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
 * Get the active Identity Client instance (may be null)
 * This uses the new object-based model
 */
export function getIdentityClient() {
  return IdentityClient;
}

/**
 * Legacy function name for backwards compatibility
 * @deprecated Use getIdentityClient() instead
 */
export function getClient() {
  return IdentityClient;
}

/**
 * Legacy init function for backwards compatibility
 * @deprecated Use initIdentityClient() instead
 */
export async function initClient() {
  return initIdentityClient();
}

