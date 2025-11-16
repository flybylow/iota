/**
 * IOTA Explorer Integration
 * Generates links to verify DIDs and credentials on the blockchain
 * 
 * NOTE: IOTA explorer uses format: https://explorer.iota.org/txblock/[TX_ID]?network=testnet
 * In production, these links would show real, verifiable identity documents.
 */

export const IOTA_EXPLORER_BASE = 'https://explorer.iota.org';
export const IOTA_2_0_TESTNET_EXPLORER = 'https://explorer.iota.org/iota2-testnet';
export const IOTA_IDENTITY_DOCS = 'https://wiki.iota.org/identity.rs/introduction/';

/**
 * Extract address from DID
 * Format: did:iota:0x... → 0x...
 * Handles: did:iota:0x:0x... (double 0x format) → 0x...
 */
export function extractAddressFromDID(did: string): string {
  const parts = did.split(':');
  let address = parts[parts.length - 1]; // Get the last part
  
  // Handle double 0x format (did:iota:0x:0x...)
  if (address === '0x' && parts.length > 3) {
    // If last part is just '0x', get the part before it
    address = parts[parts.length - 2] + ':' + address;
  }
  
  return address;
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
    // Link to explorer homepage with network parameter
    return `${IOTA_EXPLORER_BASE}?network=${network}`;
  }
  
  // Remove 'block_' prefix if it's a demo block ID
  const cleanId = blockId.replace(/^block_\d+_/, '');
  
  // Use txblock format for all block IDs
  // Format: https://explorer.iota.org/txblock/[BLOCK_ID]?network=testnet
  // Examples: J1XA6HLRN2T6jwoKy851vys5r9xzBx6tRhWvcHBSLqaD or BdHQcAirbW2yiuyE2EwFUgkiG3xwPyWQFCq9DtgpCYPw
  if (network === 'testnet') {
    return `${IOTA_EXPLORER_BASE}/txblock/${cleanId}?network=testnet`;
  }
  
  // Mainnet (no network parameter needed)
  return `${IOTA_EXPLORER_BASE}/txblock/${cleanId}`;
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
 * Format: https://explorer.iota.org/?network=testnet
 */
export function getExplorerHomeURL(network: 'testnet' | 'mainnet' = 'testnet'): string {
  if (network === 'testnet') {
    return `${IOTA_EXPLORER_BASE}?network=testnet`;
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

/**
 * Get explorer URL for viewing a DID on IOTA 2.0
 * For IOTA 2.0, DIDs can be resolved and viewed on the explorer
 * Format: https://explorer.iota.org/address/[object-id]?network=testnet
 * 
 * Based on working format: /address/[id]?network=testnet
 * 
 * @param did - The DID to view (format: did:iota:0x... or did:iota:testnet:0x...)
 * @param network - 'testnet' or 'mainnet'
 * @returns Explorer URL for the DID
 */
export function getDIDExplorerURL(did: string, network: 'testnet' | 'mainnet' = 'testnet'): string {
  // Extract object ID from DID
  // Format: did:iota:0x... or did:iota:testnet:0x...
  const parts = did.split(':');
  let objectId = parts[parts.length - 1]; // Get the last part (0x...)
  
  // Clean object ID: remove '0x' prefix for length check, but keep it for URL
  const cleanObjectId = objectId.startsWith('0x') ? objectId.substring(2) : objectId;
  
  // For IOTA testnet
  if (network === 'testnet') {
    // Try address view if object ID is available
    if (cleanObjectId && cleanObjectId.length === 64) {
      // IOTA 2.0 explorer format: /address/[object-id]?network=testnet
      return `${IOTA_EXPLORER_BASE}/address/0x${cleanObjectId}?network=testnet`;
    }
    // Fallback to explorer homepage
    return `${IOTA_EXPLORER_BASE}?network=testnet`;
  } else {
    // Mainnet
    if (cleanObjectId && cleanObjectId.length === 64) {
      return `${IOTA_EXPLORER_BASE}/address/0x${cleanObjectId}`;
    }
    return `${IOTA_EXPLORER_BASE}`;
  }
}

/**
 * Get a simple DID viewer/resolver URL
 * For IOTA 2.0, links to address view using the object ID from the DID
 * Format: https://explorer.iota.org/address/[object-id]?network=testnet
 * 
 * Based on working formats:
 * - Transactions: /txblock/[id]?network=testnet
 * - Addresses/Objects: /address/[id]?network=testnet
 * 
 * @param did - The DID to view (format: did:iota:0x... or did:iota:testnet:0x...)
 * @param network - 'testnet' or 'mainnet'
 * @returns URL to view/resolve the DID on IOTA 2.0 explorer
 */
export function getDIDViewerURL(did: string, network: 'testnet' | 'mainnet' = 'testnet'): string {
  // Extract object ID from DID
  // Formats: 
  //   - did:iota:0x[64-char-hex] (real DIDs from createDID())
  //   - did:iota:testnet:0x[64-char-hex] (testnet with network identifier)
  //   - did:iota:0x:0x[...] (mock DIDs with double 0x)
  
  const parts = did.split(':');
  let objectId = parts[parts.length - 1]; // Get the last part
  
  // Handle double 0x format (did:iota:0x:0x...)
  if (objectId === '0x' && parts.length > 3) {
    // Try to find the hex part in previous parts
    for (let i = parts.length - 1; i >= 0; i--) {
      if (parts[i].length > 2 && parts[i].startsWith('0x')) {
        objectId = parts[i];
        break;
      }
    }
    // If still '0x', concatenate parts
    if (objectId === '0x') {
      const hexParts = parts.slice(parts.indexOf('0x'));
      objectId = hexParts.join('').replace(/0x0x/g, '0x');
    }
  }
  
  // Clean: remove 0x if present, then extract hex part
  let hexPart = objectId.startsWith('0x') ? objectId.substring(2) : objectId;
  
  // Remove any non-hex characters
  hexPart = hexPart.replace(/[^0-9a-fA-F]/g, '');
  
  // Check if this is a mock DID (short hex or contains mock identifiers)
  // Mock DIDs have short hex parts or contain identifiable strings
  const isMockDID = hexPart.length < 32 || 
                    did.includes('farmermaria') || 
                    did.includes('factorychoco') || 
                    did.includes('ch2025001') ||
                    did.includes('minerlithium') ||
                    did.includes('mfgbattery') ||
                    did.includes('farmercotton') ||
                    did.includes('factorytextile') ||
                    did.includes('supplierrare') ||
                    did.includes('mfgtechassembly');
  
  if (isMockDID) {
    // For mock DIDs, link to explorer homepage with network parameter
    if (network === 'testnet') {
      return `${IOTA_EXPLORER_BASE}?network=testnet`;
    }
    return `${IOTA_EXPLORER_BASE}`;
  }
  
  // For real DIDs with 64-char hex, use directly
  if (hexPart.length >= 64) {
    hexPart = hexPart.substring(0, 64);
    const cleanObjectId = '0x' + hexPart.toLowerCase();
    
    if (network === 'testnet') {
      return `${IOTA_EXPLORER_BASE}/address/${cleanObjectId}?network=testnet`;
    }
    return `${IOTA_EXPLORER_BASE}/address/${cleanObjectId}`;
  } 
  
  // For 32-63 char hex, pad to 64 (might be valid but shorter)
  if (hexPart.length >= 32) {
    hexPart = hexPart.padEnd(64, '0');
    const cleanObjectId = '0x' + hexPart.toLowerCase();
    
    if (network === 'testnet') {
      return `${IOTA_EXPLORER_BASE}/address/${cleanObjectId}?network=testnet`;
    }
    return `${IOTA_EXPLORER_BASE}/address/${cleanObjectId}`;
  }
  
  // Last resort: Link to explorer homepage
  if (network === 'testnet') {
    return `${IOTA_EXPLORER_BASE}?network=testnet`;
  }
  return `${IOTA_EXPLORER_BASE}`;
}

