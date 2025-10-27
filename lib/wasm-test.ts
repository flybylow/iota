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
    console.log('🧪 Testing DID document creation...');
    
    const iotaIdentity = await import('@iota/identity-wasm/web');
    
    // Initialize if not already done
    if (typeof iotaIdentity.init === 'function') {
      await iotaIdentity.init();
    }
    
    console.log('✅ WASM initialized, checking available classes...');
    
    // Check what's available in the SDK
    const availableClasses = Object.keys(iotaIdentity).filter(key => 
      typeof (iotaIdentity as any)[key] === 'function' || 
      typeof (iotaIdentity as any)[key] === 'object'
    );
    
    console.log('Available SDK exports:', availableClasses.slice(0, 20).join(', '), '...');
    
    // Try to create a DID document (doesn't require network)
    const IotaDocument = (iotaIdentity as any).IotaDocument;
    const IotaDID = (iotaIdentity as any).IotaDID;
    
    if (!IotaDocument) {
      return {
        success: false,
        message: 'IotaDocument class not found in SDK',
        availableClasses: availableClasses.slice(0, 30)
      };
    }
    
    console.log('Creating local DID document...');
    
    // Create a DID document without publishing (local only)
    const document = new IotaDocument('iota'); // 'iota' for IOTA network
    
    console.log('✅ DID document created locally!');
    console.log('DID:', document.id().toString());
    
    return {
      success: true,
      message: 'DID document created successfully (local, not published)',
      did: document.id().toString(),
      availableClasses: availableClasses.slice(0, 30)
    };
  } catch (error) {
    console.error('❌ DID creation test failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5)
      } : error
    };
  }
}

