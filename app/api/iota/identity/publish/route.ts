import { NextRequest, NextResponse } from 'next/server';
import { IotaClient } from '@iota/iota-sdk/client';
import path from 'path';
import fs from 'fs';

/**
 * Server-Side Identity Publishing API Route
 * 
 * Uses @iota/iota-sdk server-side to create IdentityClient and publish DIDs
 * 
 * Following the pattern from IOTA Notarization Workshop:
 * https://docs.iota.org/developer/workshops/iota-notarization-truedoc
 * 
 * POST /api/iota/identity/publish
 * Body: { did?: string, walletAddress: string }
 * 
 * IMPORTANT: WASM loading in Next.js API routes has limitations.
 * The @iota/identity-wasm/node module tries to load WASM synchronously during require/import,
 * which can hang in Next.js. This is a known limitation.
 * 
 * Alternatives if this doesn't work:
 * - Use Rust SDK directly (recommended for production)
 * - Use a separate Node.js microservice for Identity operations
 * - Pre-initialize WASM at server startup using a custom server
 */

const IOTA_API_ENDPOINT = process.env.NEXT_PUBLIC_IOTA_API_ENDPOINT || 'https://api.testnet.iota.cafe';

// Cache for WASM module to avoid re-importing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedIdentityModule: any = null;
let wasmInitializing = false;

// Try to load WASM module at top level (Next.js may handle this better)
// This will only execute once when the module is first loaded
let identityModulePromise: Promise<any> | null = null;

async function loadIdentityModule(): Promise<any> {
  if (cachedIdentityModule) {
    return cachedIdentityModule;
  }
  
  if (identityModulePromise) {
    return identityModulePromise;
  }
  
  identityModulePromise = (async () => {
    if (wasmInitializing) {
      // Wait for existing initialization
      while (!cachedIdentityModule) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return cachedIdentityModule;
    }
    
    wasmInitializing = true;
    try {
      // Set up WASM file path first
      const nodeModulesPath = path.join(process.cwd(), 'node_modules', '@iota', 'identity-wasm', 'node', 'identity_wasm_bg.wasm');
      
      if (!fs.existsSync(nodeModulesPath)) {
        throw new Error(`WASM file not found: ${nodeModulesPath}`);
      }
      
      const expectedPath = path.join(process.cwd(), '.next', 'server', 'vendor-chunks', 'identity_wasm_bg.wasm');
      const expectedDir = path.dirname(expectedPath);
      
      if (!fs.existsSync(expectedDir)) {
        fs.mkdirSync(expectedDir, { recursive: true });
      }
      
      if (!fs.existsSync(expectedPath)) {
        fs.copyFileSync(nodeModulesPath, expectedPath);
      }
      
      // Try dynamic import in a worker-like context
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const module = require('@iota/identity-wasm/node');
      
      // Initialize if needed
      if (typeof module.init === 'function') {
        try {
          await module.init(nodeModulesPath);
        } catch {
          await module.init();
        }
      }
      
      cachedIdentityModule = module;
      wasmInitializing = false;
      return module;
    } catch (error) {
      wasmInitializing = false;
      identityModulePromise = null;
      throw error;
    }
  })();
  
  return identityModulePromise;
}

/**
 * Initialize IOTA Client (server-side only)
 */
async function createIOTAClient() {
  try {
    const client = new IotaClient({
      nodes: [IOTA_API_ENDPOINT],
    });
    
    // Verify connection - IotaClient might have different methods
    // Let's try to get network info if available
    try {
      const info = await client.getInfo?.();
      if (info) {
        console.log('✅ IOTA Client initialized (server-side)');
        console.log('📡 Network Info:', info);
      } else {
        console.log('✅ IOTA Client created (server-side)');
      }
    } catch {
      // getInfo might not be available, that's okay
      console.log('✅ IOTA Client created (server-side)');
    }
    
    return client;
  } catch (error) {
    console.error('❌ Failed to create IOTA Client:', error);
    throw new Error(`IOTA Client creation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Create IdentityClient using IOTA SDK client adapter
 * 
 * Note: identityModule must be initialized before calling this
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createIdentityClient(iotaClient: IotaClient, identityModule: any) {
  try {
    const { IdentityClient, IdentityClientReadOnly } = identityModule;
    
    if (!IdentityClient || !IdentityClientReadOnly) {
      throw new Error('IdentityClient or IdentityClientReadOnly not available in @iota/identity-wasm/node');
    }
    
    console.log('📋 IdentityClient type:', typeof IdentityClient);
    console.log('📋 IdentityClientReadOnly type:', typeof IdentityClientReadOnly);
    
    // Create IdentityClientReadOnly using IOTA SDK client as adapter
    console.log('📦 Creating IdentityClientReadOnly with IotaClient adapter...');
    console.log('⏱️ IdentityClientReadOnly.create() started at:', new Date().toISOString());
    const readOnlyStartTime = Date.now();
    const readOnlyClient = await IdentityClientReadOnly.create(iotaClient);
    const readOnlyDuration = ((Date.now() - readOnlyStartTime) / 1000).toFixed(2);
    console.log(`✅ IdentityClientReadOnly created in ${readOnlyDuration}s`);
    
    // Create IdentityClient using IdentityClientReadOnly
    console.log('📦 Creating IdentityClient from IdentityClientReadOnly...');
    console.log('⏱️ IdentityClient.create() started at:', new Date().toISOString());
    const clientStartTime = Date.now();
    const identityClient = await IdentityClient.create(readOnlyClient);
    const clientDuration = ((Date.now() - clientStartTime) / 1000).toFixed(2);
    console.log(`✅ IdentityClient created (server-side) in ${clientDuration}s`);
    
    return identityClient;
  } catch (error) {
    console.error('❌ Failed to create IdentityClient:', error);
    console.error('📋 Error details:', error instanceof Error ? error.stack : String(error));
    throw new Error(`IdentityClient creation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * POST /api/iota/identity/publish
 * 
 * Creates and publishes an Identity (DID) to the IOTA blockchain
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  try {
    console.log('📤 [Identity Publish API] Starting server-side identity publishing...');
    console.log('⏱️ [Identity Publish API] Request received at:', new Date().toISOString());
    
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid JSON in request body',
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 400 }
      );
    }
    
    const { did, walletAddress } = body;
    
    if (!walletAddress) {
      return NextResponse.json(
        { 
          success: false,
          error: 'walletAddress is required'
        },
        { status: 400 }
      );
    }
    
    console.log(`📍 DID: ${did || 'new'}`);
    console.log(`👛 Wallet: ${walletAddress}`);
    
    // Step 1: Create IOTA SDK client (server-side)
    console.log('📦 Step 1: Creating IOTA SDK client...');
    console.log('⏱️ Step 1 started at:', new Date().toISOString());
    const iotaClient = await createIOTAClient();
    console.log('✅ Step 1 completed:', new Date().toISOString());
    
    // Step 2: Initialize Identity WASM first (before creating IdentityClient)
    console.log('📦 Step 2: Setting up WASM file path...');
    
    // IMPORTANT: The WASM module tries to load the file during import, so we need to
    // ensure the file exists at the expected location BEFORE importing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let identityModule: any;
    
    // Load WASM module using the centralized loader
    console.log('📦 Loading Identity WASM module...');
    console.log('⏱️ Load started at:', new Date().toISOString());
    try {
      const loadStartTime = Date.now();
      identityModule = await loadIdentityModule();
      const loadDuration = ((Date.now() - loadStartTime) / 1000).toFixed(2);
      console.log(`✅ Identity WASM module loaded in ${loadDuration}s`);
    } catch (loadError) {
      console.error('❌ Failed to load Identity WASM module:', loadError);
      const errorDetails = loadError instanceof Error ? loadError.message : String(loadError);
      console.error('📋 Error details:', errorDetails);
      console.error('📋 Stack:', loadError instanceof Error ? loadError.stack : undefined);
      
      // Return helpful error message
      return NextResponse.json(
        {
          success: false,
          error: 'WASM module failed to load',
          details: errorDetails,
          hint: 'This is a known Next.js limitation with WASM modules. Consider using Rust SDK or a separate microservice for Identity operations.',
        },
        { status: 500 }
      );
    }
    
    // identityModule is now available from the try block above
    // Step 3: Create IdentityClient using IOTA client adapter
    console.log('📦 Step 3: Creating IdentityClient...');
    console.log('⏱️ Step 3 started at:', new Date().toISOString());
    const identityClient = await createIdentityClient(iotaClient, identityModule);
    console.log('✅ Step 3 completed:', new Date().toISOString());
    
    const { IotaDocument } = identityModule;
    
    // Step 4: Create unpublished IotaDocument
    console.log('📦 Step 4: Creating unpublished IotaDocument...');
    const unpublishedDoc = new IotaDocument('iota');
    const didString = unpublishedDoc.id().toString();
    
    console.log('✅ DID Document created (unpublished)');
    console.log('📝 DID:', didString);
    console.log('📋 Verification methods:', unpublishedDoc.methods().length);
    
    // Step 5: Create and publish Identity
    console.log('📦 Step 5: Creating Identity using IdentityClient...');
    
    if (typeof identityClient.createIdentity !== 'function') {
      return NextResponse.json(
        { 
          success: false,
          error: 'identityClient.createIdentity() method not available'
        },
        { status: 500 }
      );
    }
    
    // Use the unpublished document if did is provided, otherwise create new identity
    let publishedDoc;
    let publishedDid;
    
    if (did) {
      // If a DID is provided, try to use the unpublished document
      // For now, we'll create a new identity - in the future we might resolve and update existing
      console.log('📝 Using provided DID, creating new identity...');
      const result = await identityClient.createIdentity();
      publishedDoc = result.doc;
      publishedDid = publishedDoc.id().toString();
    } else {
      // Create new identity
      console.log('📝 Creating new identity...');
      const result = await identityClient.createIdentity();
      publishedDoc = result.doc;
      publishedDid = publishedDoc.id().toString();
    }
    
    console.log('✅ Identity created');
    console.log('📝 DID:', publishedDid);
    
    // Publish the identity
    if (typeof identityClient.publish === 'function') {
      console.log('📦 Publishing identity to blockchain...');
      await identityClient.publish(publishedDoc);
      console.log('✅ Identity published');
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: 'identityClient.publish() method not available'
        },
        { status: 500 }
      );
    }
    // Extract block ID or transaction ID from publish result if available
    // The publish() method might return transaction details
    let blockId: string | undefined;
    
    // Note: publish() might return transaction details, we may need to check the return value
    // For now, we'll use the DID as the identifier
    
    const explorerUrl = `https://explorer.iota.org/address/${publishedDid}?network=testnet`;
    
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ [Identity Publish API] Completed successfully in ${elapsedTime}s`);
    
    return NextResponse.json({
      success: true,
      did: publishedDid,
      blockId,
      explorerUrl,
      message: 'Identity successfully published to IOTA blockchain'
    });
    
  } catch (error) {
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`❌ [Identity Publish API] Failed after ${elapsedTime}s`);
    console.error('❌ [Identity Publish API] Unhandled error:', error);
    console.error('❌ Error type:', error?.constructor?.name);
    console.error('❌ Error message:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error) {
      console.error('❌ Error stack:', error.stack);
    }
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = {
      message: errorMessage,
      type: error?.constructor?.name || typeof error,
      ...(error instanceof Error && error.stack ? { stack: error.stack } : {})
    };
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to publish identity',
        details: errorMessage,
        errorDetails: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
        hint: errorMessage.includes('ENOENT') ? 'WASM file not found - check if file was copied correctly' : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

