/**
 * Key Storage Utility
 * 
 * ⚠️ WARNING: This is a DEMO implementation only!
 * 
 * In production, you should NEVER store private keys in localStorage.
 * Use proper key management solutions like:
 * - Hardware wallets (Ledger, Trezor)
 * - Browser extension wallets (MetaMask)
 * - Secure enclaves / HSM
 * - Key derivation from user password with proper encryption
 * 
 * This implementation is for DEMONSTRATION and TESTING purposes only.
 */

// Simple encryption/decryption using Web Crypto API
// Still not secure for production, but better than plain text
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encrypt(data: Uint8Array, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    data
  );
  
  // Combine salt + iv + encrypted data
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);
  
  // Convert to base64
  return btoa(String.fromCharCode(...combined));
}

async function decrypt(encryptedBase64: string, password: string): Promise<Uint8Array> {
  // Decode from base64
  const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  
  // Extract salt, iv, and encrypted data
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const encrypted = combined.slice(28);
  
  const key = await deriveKey(password, salt);
  
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    encrypted
  );
  
  return new Uint8Array(decrypted);
}

// Simple session-based "password" - in production, this would be user-entered
const SESSION_PASSWORD = 'demo-session-' + Date.now();

/**
 * Save private key to localStorage (encrypted)
 * 
 * @param did - The DID associated with this key
 * @param privateKey - The private key as Uint8Array or number array
 */
export async function savePrivateKey(did: string, privateKey: Uint8Array | number[]): Promise<void> {
  try {
    console.warn('⚠️  DEMO ONLY: Saving private key to localStorage');
    console.warn('⚠️  In production, use hardware wallet or secure enclave!');
    
    const keyArray = privateKey instanceof Uint8Array ? privateKey : new Uint8Array(privateKey);
    const encrypted = await encrypt(keyArray, SESSION_PASSWORD);
    
    localStorage.setItem(`privateKey-${did}`, encrypted);
    console.log('✅ Private key saved (encrypted) for DID:', did.substring(0, 40) + '...');
  } catch (error) {
    console.error('❌ Failed to save private key:', error);
    throw new Error('Failed to save private key');
  }
}

/**
 * Load private key from localStorage (decrypted)
 * 
 * @param did - The DID to load the key for
 * @returns The private key as Uint8Array, or null if not found
 */
export async function loadPrivateKey(did: string): Promise<Uint8Array | null> {
  try {
    const encrypted = localStorage.getItem(`privateKey-${did}`);
    if (!encrypted) {
      console.log('ℹ️  No private key found for DID:', did.substring(0, 40) + '...');
      return null;
    }
    
    const decrypted = await decrypt(encrypted, SESSION_PASSWORD);
    console.log('✅ Private key loaded for DID:', did.substring(0, 40) + '...');
    return decrypted;
  } catch (error) {
    console.error('❌ Failed to load private key:', error);
    return null;
  }
}

/**
 * Delete private key from localStorage
 * 
 * @param did - The DID to delete the key for
 */
export function deletePrivateKey(did: string): void {
  localStorage.removeItem(`privateKey-${did}`);
  console.log('🗑️  Private key deleted for DID:', did.substring(0, 40) + '...');
}

/**
 * Check if a private key exists for a DID
 * 
 * @param did - The DID to check
 * @returns true if a key exists, false otherwise
 */
export function hasPrivateKey(did: string): boolean {
  return localStorage.getItem(`privateKey-${did}`) !== null;
}

/**
 * List all DIDs that have stored keys
 * 
 * @returns Array of DID strings
 */
export function listStoredDIDs(): string[] {
  const dids: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('privateKey-')) {
      const did = key.replace('privateKey-', '');
      dids.push(did);
    }
  }
  
  return dids;
}

/**
 * Clear all stored keys
 * 
 * ⚠️ WARNING: This will delete all private keys and make DIDs unrecoverable!
 */
export function clearAllKeys(): void {
  const dids = listStoredDIDs();
  
  if (dids.length === 0) {
    console.log('ℹ️  No keys to clear');
    return;
  }
  
  console.warn('⚠️  Clearing all private keys!');
  dids.forEach(did => deletePrivateKey(did));
  console.log(`🗑️  Cleared ${dids.length} private key(s)`);
}

/**
 * Get security warning for display in UI
 */
export function getSecurityWarning(): string {
  return '⚠️ DEMO ONLY: Private keys are stored in browser localStorage. In production, use a hardware wallet or secure key management solution. Never share or expose your private keys!';
}

/**
 * Export all keys as JSON (for backup in demo)
 * 
 * ⚠️ WARNING: Only for demo/testing. Never export keys in production!
 */
export async function exportKeysForDemo(): Promise<Record<string, string>> {
  console.warn('⚠️  DEMO ONLY: Exporting all keys');
  
  const dids = listStoredDIDs();
  const exported: Record<string, string> = {};
  
  for (const did of dids) {
    const key = await loadPrivateKey(did);
    if (key) {
      exported[did] = btoa(String.fromCharCode(...key));
    }
  }
  
  return exported;
}

