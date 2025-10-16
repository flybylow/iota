// @ts-nocheck
/**
 * Simple WASM Loader
 * Loads IOTA Identity WASM from public directory
 */

let Identity: any = null;
let initialized = false;

export async function initSimpleWasm() {
  if (initialized && Identity) {
    console.log('✅ WASM already initialized');
    return Identity;
  }

  try {
    console.log('🔄 Loading WASM module...');
    
    // Import the JS bindings
    const wasmModule = await import('@iota/identity-wasm/web');
    
    console.log('📦 Module loaded, initializing WASM...');
    
    // Initialize the WASM (it will fetch from /identity_wasm_bg.wasm automatically)
    await wasmModule.init();
    
    Identity = wasmModule;
    initialized = true;
    
    console.log('✅ WASM initialized successfully!');
    console.log('📋 Available exports:', Object.keys(wasmModule).slice(0, 15).join(', '));
    return Identity;
    
  } catch (error: any) {
    console.error('❌ WASM initialization failed:', error);
    throw error;
  }
}

export async function testCreateSimpleDID() {
  try {
    const Identity = await initSimpleWasm();
    
    console.log('📝 Creating DID...');
    
    // Create a new DID document
    const { IotaDocument, IotaDID } = Identity;
    
    // Generate a random network (placeholder for now)
    const networkName = 'smr';
    
    // Create a new DID
    const doc = new IotaDocument(networkName);
    
    const did = doc.id().toString();
    const docJson = doc.toJSON();
    
    console.log('✅ DID Created:', did);
    
    return {
      success: true,
      did,
      document: docJson,
      network: networkName
    };
    
  } catch (error: any) {
    console.error('❌ DID creation failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

