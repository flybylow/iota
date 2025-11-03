/**
 * IOTA Identity Object Builder (DEPRECATED)
 * 
 * ⚠️ This file is deprecated - no longer using Alias Outputs or transaction building!
 * 
 * IOTA now uses an object-based model:
 * - No more Alias Outputs
 * - Use IdentityClient.create_identity() to create Identity objects
 * - Everything is object-based now
 * 
 * See: https://docs.iota.org/developer/iota-identity/how-tos/decentralized-identifiers/create
 * 
 * This file is kept for reference but should not be used.
 * Use IdentityClient from lib/iotaClient.ts instead.
 */

/**
 * @deprecated No longer using Alias Outputs - use IdentityClient.create_identity() instead
 */
export async function buildAliasOutputForDID(
  packedDocument: Uint8Array,
  didString: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  console.warn('⚠️ buildAliasOutputForDID is deprecated');
  console.warn('💡 Use IdentityClient.create_identity() instead (object-based model)');
  console.warn('📋 See: https://docs.iota.org/developer/iota-identity/how-tos/decentralized-identifiers/create');
  
  return {
    deprecated: true,
    message: 'Use IdentityClient.create_identity() instead - object-based model, no Alias Outputs'
  };
}

/**
 * @deprecated No longer using Alias IDs - use Identity object resolution instead
 */
export async function isDIDPublished(did: string): Promise<boolean> {
  console.warn('⚠️ isDIDPublished is deprecated');
  console.warn('💡 Use IdentityClient.resolve() instead (object-based model)');
  
  // Try to resolve the DID from blockchain using IdentityClient
  try {
    const { initIdentityClient } = await import('./iotaClient');
    const identityClient = await initIdentityClient();
    
    if (!identityClient) {
      return false;
    }
    
    // Note: Use IdentityClient.resolve() when available
    return false;
  } catch (error) {
    console.error('❌ Error checking DID:', error);
    return false;
  }
}
