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
  
  // Check for different possible wallet API structures
  const iota = (window as any).iota;
  
  // Log available objects for debugging
  const windowKeys = Object.keys(window).filter(k => 
    k.toLowerCase().includes('iota') || 
    k.toLowerCase().includes('wallet') ||
    k.startsWith('_iota')
  );
  
  console.log('🔍 Checking for wallet:', {
    iotaExists: !!iota,
    iotaKeys: iota ? Object.keys(iota) : [],
    windowKeys: windowKeys,
    allWindowKeys: Object.keys(window).slice(0, 50) // First 50 keys
  });
  
  // IOTA Wallet might expose API differently
  // Check various possible locations
  if (iota !== undefined) {
    if (iota.wallet || iota.account || iota.accounts || typeof iota === 'object') {
      console.log('✅ Found iota object:', Object.keys(iota));
      return true;
    }
  }
  
  // Check if installed but API not available yet
  if (windowKeys.length > 0) {
    console.log('⚠️  Found wallet-related keys but no API:', windowKeys);
  }
  
  return false;
}

/**
 * Connect to IOTA Wallet extension
 * Returns wallet address or null if not connected
 */
export async function connectWallet(): Promise<string | null> {
  try {
    console.log('🔍 Available window objects:', Object.keys(window).filter(k => k.toLowerCase().includes('iota') || k.toLowerCase().includes('wallet')));
    
    if (!await isWalletInstalled()) {
      console.error('❌ IOTA Wallet extension not installed');
      console.log('💡 Make sure IOTA Wallet extension is enabled');
      return null;
    }
    
    const iota = (window as any).iota;
    
    // Try multiple API structures
    let wallet = iota?.wallet || iota?.account || iota?.accounts || iota;
    
    // If iota is just an object with methods, use it directly
    if (!wallet && iota && typeof iota === 'object') {
      console.log('⚠️  iota object found but no standard API. Available keys:', Object.keys(iota));
      wallet = iota;
    }
    
    if (!wallet) {
      console.error('❌ Wallet API not available');
      console.log('Available iota keys:', iota ? Object.keys(iota) : 'none');
      console.log('💡 The IOTA Wallet extension may use a different API structure');
      return null;
    }
    
    console.log('🔗 Connecting to IOTA Wallet...');
    console.log('Wallet object:', wallet);
    
    // Try to get wallet address - different possible methods
    let address = null;
    
    if (typeof wallet.getAccounts === 'function') {
      const accounts = await wallet.getAccounts();
      address = accounts[0]?.receiveAddress;
    } else if (typeof wallet.address === 'string') {
      address = wallet.address;
    } else if (typeof wallet.account === 'function') {
      const account = await wallet.account();
      address = account?.address || account?.addresses?.[0];
    }
    
    if (!address) {
      console.error('❌ Could not get wallet address');
      console.log('Available wallet methods:', Object.keys(wallet));
      return null;
    }
    
    console.log('✅ Wallet connected:', address);
    
    return address;
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

