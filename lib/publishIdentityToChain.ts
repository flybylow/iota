/**
 * Publish Identity Object to IOTA Blockchain
 * 
 * Uses the object-based IOTA Identity model:
 * 1. Create unpublished IotaDocument
 * 2. Use IdentityClient.create_identity(unpublished).finish()
 * 3. Build and execute to publish (requires wallet signing)
 * 
 * See: https://docs.iota.org/developer/iota-identity/how-tos/decentralized-identifiers/create
 */

import { initWasm } from './iotaIdentityReal';
import { initIdentityClient } from './iotaClient';
import { IOTA_CONFIG } from './config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Identity: any = null;

export interface PublishIdentityResult {
  success: boolean;
  blockId?: string;
  did?: string;
  explorerUrl?: string;
  error?: string;
}

/**
 * Publish a DID to the IOTA blockchain using IdentityClient (object-based model)
 * 
 * @param did - Optional DID string (will create new one if not provided)
 * @param walletAddress - Wallet address for signing
 * @param signAndExecute - dApp Kit signAndExecute function for wallet signing
 * @returns Publish result with block ID
 */
export async function publishIdentityToChain(
  did: string | null,
  walletAddress: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signAndExecute?: (params: any, callbacks: any) => void
): Promise<PublishIdentityResult> {
  try {
    console.log('📤 Publishing Identity object to IOTA blockchain...');
    console.log(`📍 DID: ${did || 'new'}`);
    console.log(`👛 Wallet: ${walletAddress}`);

    // Step 1: Initialize WASM
    await initWasm();
    
    if (!Identity) {
      const identityModule = await import('@iota/identity-wasm/web');
      await identityModule.init({});
      Identity = identityModule;
    }

    console.log('✅ Step 1: WASM initialized');

    // Step 2: Create unpublished IotaDocument
    const { IotaDocument } = Identity;
    console.log('📦 Step 2: Creating unpublished IotaDocument...');
    
    const unpublishedDoc = new IotaDocument('iota');
    const didString = unpublishedDoc.id().toString();
    
    console.log('✅ DID Document created (unpublished)');
    console.log('📝 DID:', didString);
    console.log('📋 Verification methods:', unpublishedDoc.methods().length);

    // Step 3: Create IdentityBuilder from IotaDocument
    // CreateIdentity expects an IdentityBuilder, not an IotaDocument directly
    console.log('📦 Step 3: Creating IdentityBuilder from IotaDocument...');
    
    const { IdentityBuilder } = Identity;
    if (!IdentityBuilder) {
      return {
        success: false,
        error: 'IdentityBuilder not available in IOTA Identity WASM'
      };
    }
    
    let identityBuilder;
    try {
      // Try creating IdentityBuilder from IotaDocument
      // Pattern 1: new IdentityBuilder(unpublishedDoc)
      identityBuilder = new IdentityBuilder(unpublishedDoc);
      console.log('✅ IdentityBuilder created from IotaDocument');
    } catch (error1) {
      try {
        // Pattern 2: IdentityBuilder.from_document(unpublishedDoc)
        if (typeof IdentityBuilder.from_document === 'function') {
          identityBuilder = IdentityBuilder.from_document(unpublishedDoc);
          console.log('✅ IdentityBuilder created using from_document()');
        } else {
          throw error1;
        }
      } catch (error2) {
        try {
          // Pattern 3: IdentityBuilder.new() then set document
          identityBuilder = new IdentityBuilder();
          if (typeof identityBuilder.document === 'function') {
            identityBuilder.document(unpublishedDoc);
            console.log('✅ IdentityBuilder created and configured');
          } else {
            throw error2;
          }
        } catch (error3) {
          return {
            success: false,
            error: `Failed to create IdentityBuilder. Errors: ${error1.message}, ${error2?.message}, ${error3?.message}`
          };
        }
      }
    }
    
    if (!identityBuilder) {
      return {
        success: false,
        error: 'IdentityBuilder creation returned null or undefined'
      };
    }

    // Step 4: Initialize IdentityClient
    console.log('📦 Step 4: Initializing IdentityClient...');
    const identityClient = await initIdentityClient();
    
    if (!identityClient) {
      return {
        success: false,
        error: 'IdentityClient not available - cannot publish Identity object'
      };
    }

    console.log('✅ IdentityClient available');

    // Step 5: Use IdentityClient.createIdentity() method
    // According to docs: IdentityClient.create(new DefaultHttpClient(...))
    console.log('📦 Step 5: Creating Identity using IdentityClient...');
    
    // Check if IdentityClient is available from the module
    const { IdentityClient: IdentityClientClass, DefaultHttpClient } = Identity;
    
    if (!IdentityClientClass) {
      return {
        success: false,
        error: 'IdentityClient not available in IOTA Identity WASM module'
      };
    }
    
    if (!DefaultHttpClient) {
      return {
        success: false,
        error: 'DefaultHttpClient not available in IOTA Identity WASM module'
      };
    }
    
    try {
      console.log('📦 Creating DefaultHttpClient adapter...');
      const apiEndpoint = identityClient?.apiEndpoint || IOTA_CONFIG.apiEndpoint;
      console.log('📡 API Endpoint:', apiEndpoint);
      
      // Create DefaultHttpClient as the adapter
      let httpClient;
      try {
        // DefaultHttpClient constructor might take endpoint as parameter
        httpClient = new DefaultHttpClient(apiEndpoint);
        console.log('✅ DefaultHttpClient created');
      } catch (httpError) {
        console.error('❌ Failed to create DefaultHttpClient:', httpError);
        return {
          success: false,
          error: `DefaultHttpClient creation failed: ${httpError instanceof Error ? httpError.message : String(httpError)}`
        };
      }
      
      if (!httpClient) {
        return {
          success: false,
          error: 'DefaultHttpClient creation returned null or undefined'
        };
      }
      
      // Now create IdentityClient using DefaultHttpClient directly
      console.log('📦 Creating IdentityClient using .create() with DefaultHttpClient...');
      
      if (typeof IdentityClientClass.create !== 'function') {
        return {
          success: false,
          error: 'IdentityClient.create() method not available'
        };
      }
      
      try {
        // Use IdentityClient.create(DefaultHttpClient) directly
        const wasmClient = await IdentityClientClass.create(httpClient);
        console.log('✅ IdentityClient created using .create()');
        
        if (typeof wasmClient.createIdentity === 'function') {
          console.log('📦 Calling createIdentity()...');
          const { doc, key } = await wasmClient.createIdentity();
          
          console.log('✅ Identity created');
          const didString = doc.id().toString();
          console.log('📝 DID:', didString);
          
          // Publish the identity
          if (typeof wasmClient.publish === 'function') {
            console.log('📦 Publishing identity...');
            await wasmClient.publish(doc);
            console.log('✅ Identity published');
            
            const explorerUrl = `https://explorer.iota.org/address/${didString}?network=testnet`;
            
            return {
              success: true,
              did: didString,
              explorerUrl
            };
          } else {
            return {
              success: false,
              error: 'publish() method not available on IdentityClient'
            };
          }
        } else {
          return {
            success: false,
            error: 'createIdentity() method not available on IdentityClient'
          };
        }
      } catch (clientError) {
        console.error('❌ IdentityClient.create() failed:', clientError);
        console.error('📋 httpClient passed:', httpClient);
        console.error('📋 httpClient type:', typeof httpClient);
        console.error('💡 IdentityClient.create() requires IdentityClientReadOnly');
        console.error('💡 IdentityClientReadOnly.create() requires a ReadAdapter with getChainIdentifier()');
        console.error('💡 This adapter typically comes from @iota/iota-sdk, which is not available in browser');
        console.error('💡 Consider using a server-side API route to handle IdentityClient creation');
        
        return {
          success: false,
          error: `Cannot create IdentityClient in browser: ${clientError instanceof Error ? clientError.message : String(clientError)}. IdentityClient requires IdentityClientReadOnly, which needs a ReadAdapter from @iota/iota-sdk (Node.js only). Consider using a server-side API route.`
        };
      }
    } catch (error) {
      console.error('❌ Publishing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  } catch (error) {
    console.error('❌ Publishing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

