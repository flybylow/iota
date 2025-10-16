/**
 * IOTA/Shimmer Explorer Integration
 * Generates links to verify DIDs and credentials on the blockchain
 * 
 * NOTE: This demo uses mock DIDs that don't actually exist on the blockchain.
 * In production, these links would show real, verifiable identity documents.
 */

export const SHIMMER_TESTNET_EXPLORER = 'https://explorer.iota.org/shimmer-testnet';
export const SHIMMER_MAINNET_EXPLORER = 'https://explorer.iota.org/shimmer';
export const IOTA_IDENTITY_DOCS = 'https://wiki.iota.org/identity.rs/introduction/';

/**
 * Extract address from DID
 * Format: did:iota:smr:0x... → 0x...
 */
export function extractAddressFromDID(did: string): string {
  const parts = did.split(':');
  return parts[parts.length - 1]; // Returns 0x...
}

/**
 * Generate explorer URL for a DID
 * For demo purposes, links to IOTA Identity documentation
 * In production, would link to actual DID on blockchain
 */
export function getExplorerURL(did: string, network: 'testnet' | 'mainnet' = 'testnet'): string {
  // For demo with mock DIDs, link to IOTA Identity docs instead of non-existent blockchain entries
  return IOTA_IDENTITY_DOCS;
}

/**
 * Generate search URL for DID on explorer
 */
export function getExplorerSearchURL(did: string, network: 'testnet' | 'mainnet' = 'testnet'): string {
  const baseURL = network === 'testnet' ? SHIMMER_TESTNET_EXPLORER : SHIMMER_MAINNET_EXPLORER;
  return `${baseURL}/search/${did}`;
}

/**
 * Get IOTA Identity documentation URL
 */
export function getIOTAIdentityDocsURL(): string {
  return 'https://wiki.iota.org/identity.rs/introduction/';
}

