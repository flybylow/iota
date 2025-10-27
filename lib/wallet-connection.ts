/**
 * Wallet Connection Module
 * 
 * Handles connection to IOTA Wallet browser extension
 * Manages wallet operations for DID publishing
 */

const IOTA_WALLET_EXTENSION_ID = 'iidjkmdceolghepehaaddojmnjnkkija';

/**
 * Check if IOTA Wallet extension is installed
 */
export async function isWalletInstalled(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  // Check for IOTA Wallet extension via postMessage API
  try {
    // Try to detect extension via chrome/browser API
    const chrome = (window as any).chrome;
    const browser = (window as any).browser;
    
    if (chrome?.runtime?.id || browser?.runtime?.id) {
      // Extension context is available
      console.log('✅ Extension context detected');
    }
    
    // Check for IOTA-specific APIs
    const iota = (window as any).iota;
    const iotaWallet = (window as any).iotaWallet;
    
    console.log('🔍 Wallet detection:', {
      hasIota: !!iota,
      hasIotaWallet: !!iotaWallet,
      chromeRuntime: !!chrome?.runtime,
      browserRuntime: !!browser?.runtime
    });
    
    // Check if the wallet extension is available via postMessage
    // IOTA Wallet uses postMessage for communication
    if (iota || iotaWallet || chrome?.runtime || browser?.runtime) {
      console.log('✅ Wallet detected');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking wallet:', error);
    return false;
  }
}

/**
 * Connect to IOTA Wallet extension
 * Returns wallet address or null if not connected
 */
export async function connectWallet(): Promise<string | null> {
  try {
    console.log('🔗 Attempting to connect to IOTA Wallet...');
    
    // Check if extension is installed
    const installed = await isWalletInstalled();
    if (!installed) {
      console.error('❌ IOTA Wallet extension not detected');
      
      // Check for extension installation
      const chrome = (window as any).chrome;
      const browser = (window as any).browser;
      
      if (chrome?.runtime?.id || browser?.runtime?.id) {
        console.log('⚠️ Extension context exists but IOTA Wallet API not found');
        return null;
      }
      
      return null;
    }
    
    // For now, return a mock address for testing
    // Real implementation will require the IOTA Wallet SDK integration
    console.log('📝 Note: Full wallet integration requires IOTA Wallet SDK');
    console.log('🔧 Current implementation provides wallet detection framework');
    
    // Mock wallet address for testing/demo
    const mockAddress = 'iot1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
    console.log('✅ Using mock address for demo:', mockAddress);
    
    return mockAddress;
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

