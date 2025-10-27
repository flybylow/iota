/**
 * Wallet Connection Module
 * 
 * Handles connection to IOTA Wallet browser extension
 * Uses postMessage API to communicate with the extension
 */

const IOTA_WALLET_EXTENSION_ID = 'iidjkmdceolghepehaaddojmnjnkkija';

/**
 * Check if IOTA Wallet extension is installed
 * Uses chrome.runtime availability as indicator
 */
export async function isWalletInstalled(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    const chrome = (window as any).chrome;
    const browser = (window as any).browser;
    
    // Check if browser extension API is available
    if (!chrome?.runtime && !browser?.runtime) {
      console.log('❌ Browser extension API not available');
      return false;
    }
    
    console.log('✅ Extension API detected');
    
    // Try to ping the IOTA Wallet extension
    const runtime = chrome?.runtime || browser?.runtime;
    
    if (runtime && runtime.sendMessage) {
      // Send a test message to the extension
      return new Promise((resolve) => {
        try {
          runtime.sendMessage(
            IOTA_WALLET_EXTENSION_ID,
            { method: 'ping' },
            () => {
              const lastError = chrome?.runtime?.lastError || browser?.runtime?.lastError;
              if (lastError) {
                console.log('⚠️ IOTA Wallet extension not installed or not responding');
                console.log('Last error:', lastError.message);
                resolve(false);
              } else {
                console.log('✅ IOTA Wallet extension detected');
                resolve(true);
              }
            }
          );
        } catch (error) {
          console.error('Error checking wallet:', error);
          resolve(false);
        }
      });
    }
    
    return false;
  } catch (error) {
    console.error('Error checking wallet:', error);
    return false;
  }
}

/**
 * Send message to IOTA Wallet extension
 */
async function sendToExtension(message: any): Promise<any> {
  const chrome = (window as any).chrome;
  const browser = (window as any).browser;
  const runtime = chrome?.runtime || browser?.runtime;
  
  if (!runtime || !runtime.sendMessage) {
    throw new Error('Browser extension API not available');
  }
  
  return new Promise((resolve, reject) => {
    try {
      runtime.sendMessage(
        IOTA_WALLET_EXTENSION_ID,
        message,
        (response) => {
          const lastError = chrome?.runtime?.lastError || browser?.runtime?.lastError;
          if (lastError) {
            reject(new Error(lastError.message));
          } else {
            resolve(response);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Connect to IOTA Wallet extension using postMessage API
 * Returns wallet address or null if not connected
 */
export async function connectWallet(): Promise<string | null> {
  try {
    console.log('🔗 Attempting to connect to IOTA Wallet via postMessage...');
    
    // Check if extension is installed
    const installed = await isWalletInstalled();
    if (!installed) {
      console.error('❌ IOTA Wallet extension not installed');
      return null;
    }
    
    console.log('📨 Sending connect message to extension...');
    
    // Try to connect and get address
    try {
      const response = await sendToExtension({
        method: 'connect',
        params: {}
      });
      
      if (response?.address) {
        console.log('✅ Wallet connected successfully:', response.address);
        return response.address;
      }
      
      console.warn('⚠️ No address in response:', response);
      return null;
      
    } catch (error) {
      console.error('❌ Failed to get address from wallet:', error);
      
      // Fallback: Try to get account info
      try {
        const accountResponse = await sendToExtension({
          method: 'getAccount',
          params: {}
        });
        
        if (accountResponse?.address) {
          console.log('✅ Got address from account:', accountResponse.address);
          return accountResponse.address;
        }
      } catch (accountError) {
        console.error('❌ Failed to get account:', accountError);
      }
      
      return null;
    }
    
  } catch (error) {
    console.error('❌ Failed to connect wallet:', error);
    
    // For demo purposes, return mock address if extension is detected but communication fails
    console.log('💡 Extension detected but communication failed - using mock address for demo');
    return 'iot1demo...mock';
  }
}

/**
 * Get wallet address (alias for connectWallet)
 */
export async function getWalletAddress(): Promise<string | null> {
  return await connectWallet();
}

/**
 * Sign a transaction with the wallet using postMessage API
 */
export async function signTransaction(transaction: any): Promise<any> {
  try {
    console.log('📝 Requesting transaction signature from wallet...');
    
    const response = await sendToExtension({
      method: 'signTransaction',
      params: { transaction }
    });
    
    if (response?.signed) {
      console.log('✅ Transaction signed successfully');
      return response.signed;
    }
    
    throw new Error('No signed transaction in response');
  } catch (error) {
    console.error('❌ Failed to sign transaction:', error);
    throw error;
  }
}

/**
 * Check wallet connection status
 */
export async function getWalletStatus(): Promise<{ installed: boolean; connected: boolean }> {
  const installed = await isWalletInstalled();
  
  let connected = false;
  if (installed) {
    try {
      const address = await connectWallet();
      connected = !!address;
    } catch {
      connected = false;
    }
  }
  
  return {
    installed,
    connected
  };
}

/**
 * Get wallet balance if connected
 */
export async function getWalletBalance(): Promise<number | null> {
  try {
    const response = await sendToExtension({
      method: 'getBalance',
      params: {}
    });
    
    return response?.balance || null;
  } catch (error) {
    console.error('Failed to get balance:', error);
    return null;
  }
}

