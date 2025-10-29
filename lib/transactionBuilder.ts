/**
 * IOTA SDK Transaction Builder
 * 
 * Builds proper transaction objects that can be submitted via dApp Kit
 */

import { IOTA_CONFIG } from './config';

/**
 * Build an alias output for DID publishing using dApp Kit
 * 
 * Note: We don't create a separate Client here because dApp Kit
 * provides its own client via useIotaClient() hook in components.
 */

/**
 * Build an alias output for DID publishing
 * 
 * This creates a transaction payload that dApp Kit can handle.
 * 
 * NOTE: dApp Kit's signAndExecute expects a specific format.
 * For now, we're returning a simple object that the wallet
 * can potentially work with.
 */
export async function buildAliasOutputForDID(
  packedDocument: Uint8Array,
  didString: string
): Promise<any> {
  console.log('📦 Building transaction for DID publishing...');
  console.log('📝 DID:', didString);
  console.log('📦 Document size:', packedDocument.length, 'bytes');

  // Convert Uint8Array to hex string for transaction metadata
  const hexDocument = Array.from(packedDocument)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  console.log('💡 Transaction format for dApp Kit...');
  console.log('📋 This will be passed to signAndExecute()');

  // Return payload - wallet will handle the rest
  return {
    accountIndex: 0,
    outputs: {
      type: 'alias',
      stateMetadata: hexDocument, // Hex string
    }
  };
}

/**
 * Check if a DID is already published on-chain
 */
export async function isDIDPublished(did: string): Promise<boolean> {
  // Try to resolve the DID from blockchain
  const aliasId = did.split(':').pop() || '';
  
  console.log('🔍 Checking if DID is published:', did);
  console.log('🔑 Alias ID:', aliasId);
  
  // For now, return false (not checking actual on-chain)
  // In production, would need to use dApp Kit's client to resolve
  return false;
}

