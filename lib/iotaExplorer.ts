/**
 * IOTA/Shimmer Explorer Integration
 * Generates links to verify DIDs and credentials on the blockchain
 */

export const SHIMMER_TESTNET_EXPLORER = 'https://explorer.shimmer.network/testnet';
export const SHIMMER_MAINNET_EXPLORER = 'https://explorer.shimmer.network/shimmer';

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
 */
export function getExplorerURL(did: string, network: 'testnet' | 'mainnet' = 'testnet'): string {
  const address = extractAddressFromDID(did);
  const baseURL = network === 'testnet' ? SHIMMER_TESTNET_EXPLORER : SHIMMER_MAINNET_EXPLORER;
  return `${baseURL}/addr/${address}`;
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

