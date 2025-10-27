/**
 * Wallet Connection Module
 * 
 * Handles connection to IOTA Wallet browser extension
 * Manages wallet operations for DID publishing
 */

/**
 * Check if IOTA Wallet extension is installed
 */
export async function isWalletInstalled(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  const iota = (window as any).iota;
  return iota !== undefined && iota.wallet !== undefined;
}

/**
 * Connect to IOTA Wallet extension
 * Returns wallet address or null if not connected
 */
export async function connectWallet(): Promise<string | null> {
  try {
    if (!await isWalletInstalled()) {
      console.error('❌ IOTA Wallet extension not installed');
      return null;
    }
    
    const wallet = (window as any).iota?.wallet;
    if (!wallet) {
      console.error('❌ Wallet not available');
      return null;
    }
    
    console.log('🔗 Connecting to IOTA Wallet...');
    
    // Get wallet accounts
    const accounts = await wallet.getAccounts();
    if (!accounts || accounts.length === 0) {
      console.error('❌ No accounts found in wallet');
      return null;
    }
    
    const address = accounts[0]?.receiveAddress;
    console.log('✅ Wallet connected:', address);
    
    return address || null;
  } catch (error) {
    console.error('❌ Failed to connect wallet:', error);
    return null;
  }
}

/**
 * Get wallet address (alias for connectWallet)
 */
export async function getWalletAddress(): Promise<string | null> {
  return await connectWallet();
}

/**
 * Sign a transaction with the wallet
 */
export async function signTransaction(transaction: any): Promise<string> {
  const wallet = (window as any).iota?.wallet;
  if (!wallet) throw new Error('Wallet not connected');
  
  try {
    const signed = await wallet.sign(transaction);
    console.log('✅ Transaction signed');
    return signed;
  } catch (error) {
    console.error('❌ Failed to sign transaction:', error);
    throw error;
  }
}

/**
 * Check wallet connection status
 */
export function getWalletStatus(): { installed: boolean; connected: boolean } {
  const installed = typeof window !== 'undefined' && 
                   typeof (window as any).iota !== 'undefined';
  
  return {
    installed,
    connected: installed // Simplified - could check actual connection
  };
}

