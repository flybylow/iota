/**
 * WASM & Server-Side API Test
 * Tests both client-side WASM (known to fail) and server-side API (should work)
 */

export async function testWasmInit() {
  try {
    console.log('🧪 Testing client-side WASM initialization...');
    
    // Try importing the WASM module
    const iotaIdentity = await import('@iota/identity-wasm/web');
    console.log('✅ WASM module imported:', Object.keys(iotaIdentity));
    
    // Try initializing
    if (typeof iotaIdentity.init === 'function') {
      await iotaIdentity.init();
      console.log('✅ Client-side WASM initialized successfully');
      return { success: true, message: 'Client-side WASM initialized', approach: 'client' };
    } else {
      console.log('⚠️ No init function found');
      return { success: false, message: 'No init function found', approach: 'client' };
    }
  } catch (error) {
    console.error('❌ Client-side WASM failed (expected):', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error',
      error,
      approach: 'client'
    };
  }
}

export async function testServerSideAPI() {
  try {
    console.log('🧪 Testing server-side API approach...');
    
    const response = await fetch('/api/did/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Server-side API works!', data);
      return {
        success: true,
        message: 'Server-side WASM works via API',
        approach: 'server-api',
        data
      };
    } else {
      console.error('❌ Server-side API returned error:', data);
      return {
        success: false,
        message: data.error || 'Server-side API failed',
        approach: 'server-api',
        error: data
      };
    }
  } catch (error) {
    console.error('❌ Server-side API test failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error,
      approach: 'server-api'
    };
  }
}

