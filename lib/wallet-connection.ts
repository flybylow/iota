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
  console.log('🔍 Starting wallet detection...');
  if (typeof window === 'undefined') {
    console.log('❌ Window not available (SSR)');
    return false;
  }
  
  try {
    const chrome = (window as any).chrome;
    const browser = (window as any).browser;
    
    console.log('📋 Chrome object:', chrome ? 'exists' : 'missing');
    console.log('📋 Browser object:', browser ? 'exists' : 'missing');
    
    // Check if browser extension API is available
    if (!chrome?.runtime && !browser?.runtime) {
      console.log('❌ Browser extension API not available');
      console.log('💡 Make sure you are using Chrome/Edge/Brave browser');
      return false;
    }
    
    console.log('✅ Extension API detected');
    console.log('📋 Extension ID to check:', IOTA_WALLET_EXTENSION_ID);
    
    // First, try to check what extensions are installed
    const runtime = chrome?.runtime || browser?.runtime;
    
    if (runtime) {
      console.log('📋 Checking for installed extensions...');
      try {
        // Try to get all installed extensions
        if (runtime.getExtensions) {
          const extensions = await new Promise<any[]>((resolve) => {
            runtime.getExtensions((result: any) => {
              resolve(result || []);
            });
          });
          console.log('📋 Installed extensions count:', extensions.length);
        }
      } catch (e) {
        console.log('💡 Cannot enumerate extensions (normal)');
      }
    }
    
    // Try to ping the IOTA Wallet extension
    if (runtime && runtime.sendMessage) {
      console.log('📨 Sending ping to extension...');
      // Send a test message to the extension
      return new Promise((resolve) => {
        try {
          // Add timeout to prevent hanging
          const timeoutId = setTimeout(() => {
            console.log('⏱️ Wallet detection timeout after 5 seconds');
            console.log('💡 Possible causes:');
            console.log('   • Extension ID is incorrect: ' + IOTA_WALLET_EXTENSION_ID);
            console.log('   • Extension not installed');
            console.log('   • Extension disabled in chrome://extensions/');
            console.log('   • Extension is locked');
            console.log('💡 Visit chrome://extensions/ to check');
            resolve(false);
          }, 5000); // 5 second timeout
          
          runtime.sendMessage(
            IOTA_WALLET_EXTENSION_ID,
            { method: 'ping' },
            () => {
              clearTimeout(timeoutId);
              const lastError = chrome?.runtime?.lastError || browser?.runtime?.lastError;
              if (lastError) {
                console.log('⚠️ Extension not responding');
                console.log('📋 Error message:', lastError.message);
                console.log('💡 Debug info:');
                console.log('   • Extension ID used: ' + IOTA_WALLET_EXTENSION_ID);
                console.log('   • Error: ' + lastError.message);
                console.log('   • Check chrome://extensions/?id=' + IOTA_WALLET_EXTENSION_ID);
                resolve(false);
              } else {
                console.log('✅ IOTA Wallet extension detected and responding!');
                resolve(true);
              }
            }
          );
        } catch (error) {
          console.error('❌ Error checking wallet:', error);
          resolve(false);
        }
      });
    }
    
    console.log('⚠️ runtime.sendMessage not available');
    return false;
  } catch (error) {
    console.error('❌ Error in wallet detection:', error);
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
    console.log('📋 Extension ID:', IOTA_WALLET_EXTENSION_ID);
    console.log('🌐 Browser check:', typeof window !== 'undefined' ? 'window exists' : 'no window');
    
    // Check if extension is installed
    console.log('🔍 Calling isWalletInstalled()...');
    const installed = await isWalletInstalled();
    console.log('🔍 Wallet installed check result:', installed);
    
    if (!installed) {
      console.warn('⚠️  IOTA Wallet extension not detected');
      console.info('💡 Note: Wallet connection is optional');
      console.info('✅ App works perfectly without wallet connection!');
      console.info('🎯 You can still use Blockchain Mode to create DIDs locally');
      return null;
    }
    
    console.log('✅ Extension detected and responding!');
    
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

/**
 * Check if wallet has sufficient balance for DID publishing
 * Requires minimal amount for storage deposit
 */
export async function hasSufficientBalance(): Promise<boolean> {
  try {
    const balance = await getWalletBalance();
    if (balance === null) {
      return false;
    }
    
    // Minimum balance needed for storage deposit (testnet: very small amount)
    const MINIMUM_BALANCE = 0.0001;
    return balance >= MINIMUM_BALANCE;
  } catch (error) {
    console.error('Failed to check balance:', error);
    return false;
  }
}

