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
export function getExplorerURL(did: string, network: 'testnet' | 'mainnet' = 'testnet', forceReal: boolean = false): string | null {
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
 * 
 * IOTA Explorer API format:
 * - Transaction Block: https://explorer.iota.org/txblock/{transactionBlockId}
 * - Transaction: https://explorer.iota.org/tx/{transactionId}
 * - Network: Add ?network=testnet or ?network=mainnet
 * 
 * @param transactionId - The transaction ID from publishing
 * @param network - 'testnet' or 'mainnet'
 */
export function getTransactionURL(transactionId: string, network: 'testnet' | 'mainnet' = 'testnet'): string {
  // Format: https://explorer.iota.org/txblock/{blockId}?network=testnet
  return `${IOTA_EXPLORER_BASE}/txblock/${transactionId}?network=${network}`;
}

/**
 * Get transaction URL (alternative format)
 * Format: https://explorer.iota.org/tx/{transactionId}
 */
export function getTransactionDetailURL(transactionId: string, network: 'testnet' | 'mainnet' = 'testnet'): string {
  return `${IOTA_EXPLORER_BASE}/tx/${transactionId}?network=${network}`;
}

/**
 * Get explorer URL for a block/transaction ID
 * Creates a usable link to view on IOTA explorer
 * 
 * @param blockId - The block or transaction ID
 * @param network - 'testnet' or 'mainnet'
 * @returns Full explorer URL
 */
export function getExplorerBlockURL(blockId: string, network: 'testnet' | 'mainnet' = 'testnet'): string {
  if (!blockId) {
    return `${IOTA_EXPLORER_BASE}?network=${network}`;
  }
  
  // Ensure proper format
  const cleanBlockId = blockId.trim();
  
  // Check if it's a valid hex string (starts with 0x)
  if (cleanBlockId.startsWith('0x')) {
    return `${IOTA_EXPLORER_BASE}/txblock/${cleanBlockId}?network=${network}`;
  }
  
  // Otherwise assume it's already a full block ID
  return `${IOTA_EXPLORER_BASE}/txblock/${cleanBlockId}?network=${network}`;
}

/**
 * Get the actual blockchain explorer URL for a DID
 * If transaction ID is available, links to the specific transaction
 * Otherwise returns null to indicate no valid transaction exists
 */
export function getRealExplorerURL(did: string, network: 'testnet' | 'mainnet' = 'testnet', transactionId?: string): string | null {
  // If we have a transaction ID, link directly to it
  if (transactionId) {
    return getTransactionURL(transactionId, network);
  }
  
  // Return null if no transaction ID exists
  // This prevents broken links to DIDs that aren't published to the blockchain yet
  return null;
}

/**
 * Get explorer URL for a transaction/block ID
 * Creates usable links that actually work on IOTA explorer
 * Uses the correct structure: https://explorer.iota.org/txblock/[BLOCK_ID]?network=testnet
 */
export function getBlockExplorerURL(blockId: string | undefined, network: 'testnet' | 'mainnet' = 'testnet'): string {
  if (!blockId) {
    return `${IOTA_EXPLORER_BASE}/testnet`;
  }
  
  // Remove 'block_' prefix if it's a demo block ID
  const cleanId = blockId.replace(/^block_\d+_/, '');
  
  // Use txblock format for all block IDs
  // Examples: J1XA6HLRN2T6jwoKy851vys5r9xzBx6tRhWvcHBSLqaD or 4j8HwsCQEtjmY28drcnw9Kq7aLyN78UEq4LFDr8PdwL8
  return `${IOTA_EXPLORER_BASE}/txblock/${cleanId}?network=${network}`;
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

/**
 * Get general IOTA explorer URL for verification
 * Links to the main explorer (not individual transactions)
 */
export function getExplorerHomeURL(network: 'testnet' | 'mainnet' = 'testnet'): string {
  if (network === 'testnet') {
    return `${IOTA_EXPLORER_BASE}/testnet`;
  }
  return `${IOTA_EXPLORER_BASE}`;
}

/**
 * Store and retrieve transaction links
 * 
 * @param blockId - The block ID to store
 * @param network - Network type
 * @returns Stored explorer link
 */
export function storeTransactionLink(blockId: string, network: 'testnet' | 'mainnet' = 'testnet'): string {
  // Store transaction link
  const link = `${IOTA_EXPLORER_BASE}/txblock/${blockId}?network=${network}`;
  
  // In production, you might want to store this in localStorage
  if (typeof window !== 'undefined') {
    const links = JSON.parse(localStorage.getItem('iota-transaction-links') || '[]');
    links.push({ blockId, link, network, timestamp: Date.now() });
    localStorage.setItem('iota-transaction-links', JSON.stringify(links));
  }
  
  return link;
}

/**
 * Get stored transaction links
 */
export function getStoredTransactionLinks(): Array<{ blockId: string; link: string; network: string; timestamp: number }> {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('iota-transaction-links') || '[]');
  }
  return [];
}

