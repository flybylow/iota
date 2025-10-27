/**
 * IOTA Explorer Integration
 * Generates links to verify DIDs and credentials on the blockchain
 * 
 * NOTE: IOTA explorer uses format: https://explorer.iota.org/txblock/[TX_ID]?network=testnet
 * In production, these links would show real, verifiable identity documents.
 */

export const IOTA_EXPLORER_BASE = 'https://explorer.iota.org';
export const IOTA_IDENTITY_DOCS = 'https://wiki.iota.org/identity.rs/introduction/';

/**
 * Extract address from DID
 * Format: did:iota:0x... → 0x...
 */
export function extractAddressFromDID(did: string): string {
  const parts = did.split(':');
  return parts[parts.length - 1]; // Returns 0x...
}

/**
 * Generate explorer URL for a DID
 * 
 * Detects if DID is real (on blockchain) or mock (demo only)
 * - Real DIDs: Link to blockchain explorer
 * - Mock DIDs: Link to IOTA Identity documentation
 */
export function getExplorerURL(did: string, network: 'testnet' | 'mainnet' = 'testnet', forceReal: boolean = false): string {
  // Check if this is a mock DID (contains placeholder patterns)
  const isMockDID = did.includes('farmermaria') || 
                    did.includes('factorychoco') || 
                    did.includes('ch2025001') ||
                    did.includes('minerlithium') ||
                    did.includes('mfgbattery') ||
                    did.includes('farmercotton') ||
                    did.includes('factorytextile') ||
                    did.includes('supplierrare') ||
                    did.includes('mfgtechassembly');
  
  // For mock DIDs in demo mode, link to docs
  if (isMockDID && !forceReal) {
    return IOTA_IDENTITY_DOCS;
  }
  
  // For real DIDs, link to blockchain explorer
  return getRealExplorerURL(did, network);
}

/**
 * Get transaction block URL for a published DID
 * Format: https://explorer.iota.org/txblock/[TX_ID]?network=testnet
 * 
 * @param transactionId - The transaction ID from publishing
 * @param network - 'testnet' or 'mainnet'
 */
export function getTransactionURL(transactionId: string, network: 'testnet' | 'mainnet' = 'testnet'): string {
  return `${IOTA_EXPLORER_BASE}/txblock/${transactionId}?network=${network}`;
}

/**
 * Get the actual blockchain explorer URL for a DID
 * If transaction ID is available, links to the specific transaction
 * Otherwise links to the address
 */
export function getRealExplorerURL(did: string, network: 'testnet' | 'mainnet' = 'testnet', transactionId?: string): string {
  // If we have a transaction ID, link directly to it
  if (transactionId) {
    return getTransactionURL(transactionId, network);
  }
  
  // Otherwise link to the address
  const address = extractAddressFromDID(did);
  return `${IOTA_EXPLORER_BASE}/addr/${address}?network=${network}`;
}

/**
 * Generate search URL for DID on explorer
 */
export function getExplorerSearchURL(did: string, network: 'testnet' | 'mainnet' = 'testnet'): string {
  return `${IOTA_EXPLORER_BASE}/search/${did}?network=${network}`;
}

/**
 * Get IOTA Identity documentation URL
 */
export function getIOTAIdentityDocsURL(): string {
  return 'https://wiki.iota.org/identity.rs/introduction/';
}

