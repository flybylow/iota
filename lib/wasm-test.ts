/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * WASM Initialization Test
 * Phase 1: Test if @iota/identity-wasm can initialize in Next.js environment
 */

export async function testWasmInit() {
  try {
    console.log('🧪 Testing WASM initialization...');
    
    // Attempt to import the WASM module
    const iotaIdentity = await import('@iota/identity-wasm/web');
    console.log('✅ Module imported successfully');
    console.log('Available exports:', Object.keys(iotaIdentity));
    
    // Try to initialize WASM
    if (typeof iotaIdentity.init === 'function') {
      await iotaIdentity.init();
      console.log('✅ WASM initialized successfully!');
      return {
        success: true,
        message: 'WASM initialized',
        exports: Object.keys(iotaIdentity)
      };
    } else {
      console.log('⚠️ No init function found, trying alternative initialization');
      
      // Try initAsync if init doesn't exist
      if (typeof (iotaIdentity as any).initAsync === 'function') {
        await (iotaIdentity as any).initAsync();
        console.log('✅ WASM initialized with initAsync!');
        return {
          success: true,
          message: 'WASM initialized with initAsync',
          exports: Object.keys(iotaIdentity)
        };
      }
      
      return {
        success: false,
        message: 'No initialization function found'
      };
    }
  } catch (error) {
    console.error('❌ WASM initialization failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error
    };
  }
}

export async function testCreateDID() {
  try {
    console.log('🧪 Testing DID creation...');
    
    const iotaIdentity = await import('@iota/identity-wasm/web');
    
    // Initialize if not already done
    if (typeof iotaIdentity.init === 'function') {
      await iotaIdentity.init();
    }
    
    // Try to create a client
    console.log('Creating IOTA client...');
    const Client = (iotaIdentity as any).Client;
    
    if (!Client) {
      return {
        success: false,
        message: 'Client class not found in SDK'
      };
    }
    
    const client = await Client.create({
      nodes: ['https://api.testnet.shimmer.network'],
      permanodes: ['https://api.testnet.shimmer.network']
    });
    
    console.log('✅ Client created successfully');
    
    return {
      success: true,
      message: 'Client created, ready for DID operations',
      client
    };
  } catch (error) {
    console.error('❌ DID creation test failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error
    };
  }
}

