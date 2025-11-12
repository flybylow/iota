/**
 * Client-Side DID Publishing using @iota/identity-wasm/web and @iota/dapp-kit
 * 
 * OBJECT-ORIENTED APPROACH: IOTA is now object-based (no Alias Outputs).
 * Everything is an object instead of an output.
 * 
 * Based on:
 * - https://docs.iota.org/developer/iota-identity/getting-started/wasm
 * - https://docs.iota.org/developer/iota-identity/how-tos/decentralized-identifiers/create
 * - https://docs.iota.org/developer/iota-identity/references/iota-did-method-spec
 * 
 * Pattern from docs:
 * 1. Create storage (JwkMemStore, KeyIdMemStore) for the NEW identity's keys
 * 2. Create IdentityClient with storage
 * 3. Create unpublished IotaDocument
 * 4. Use createIdentity().finish().buildAndExecute() - but we need wallet signing for gas
 */

import { initIdentityClient, getIdentityModule } from './iotaClient';
import { IOTA_CONFIG } from './config';

export interface PublishIdentityResult {
  success: boolean;
  blockId?: string;
  did?: string;
  explorerUrl?: string;
  error?: string;
}

/**
 * Publish a DID to the IOTA blockchain using client-side wallet signing
 * 
 * OBJECT-ORIENTED APPROACH:
 * 1. Create storage for the NEW identity's keys (JwkMemStore, KeyIdMemStore)
 * 2. Create IdentityClient with storage (for the new identity, not wallet)
 * 3. Create unpublished IotaDocument
 * 4. Build transaction using createIdentity().finish().build()
 * 5. Sign and execute with wallet (for gas payment)
 * 
 * @param walletAddress - The wallet address that will pay for gas
 * @param signAndExecuteTransaction - Function from dApp Kit to sign and execute transactions
 * @returns Publish result with DID and block ID
 */
export async function publishIdentityToChainClientSide(
  walletAddress: string,
  signAndExecuteTransaction: (transaction: any) => Promise<any>
): Promise<PublishIdentityResult> {
  try {
    console.log('📡 Starting client-side DID publishing (Object-Oriented)...');
    console.log('👛 Wallet address (gas payer):', walletAddress);

    // Step 1: Initialize Identity WASM module
    let identityModule = await getIdentityModule();
    if (!identityModule) {
      // Try to initialize it
      const connection = await initIdentityClient();
      if (!connection || !connection.identityModule) {
        throw new Error('Failed to initialize Identity WASM module');
      }
      identityModule = connection.identityModule;
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const module = identityModule as any;
    
    // Step 2: Get network identifier
    const { IotaClient } = await import('@iota/iota-sdk/client');
    const iotaClient = new IotaClient({ url: IOTA_CONFIG.apiEndpoint });
    const network = await iotaClient.getChainIdentifier();
    console.log('🌐 Network:', network);

    // Step 3: Create IdentityClientReadOnly (read-only access to chain)
    const readOnlyClient = await module.IdentityClientReadOnly.create(iotaClient);
    console.log('✅ IdentityClientReadOnly created');

    // Step 4: Create unpublished IotaDocument with verification method
    // A DID document MUST have at least one verification method
    // Use IotaDocument.generateMethod() - this is the correct pattern from docs
    const { IotaDocument, MethodScope, JwkMemStore, JwsAlgorithm, Storage } = module;
    const unpublishedDoc = new IotaDocument(network);
    console.log('✅ Unpublished document created');
    console.log('📝 Placeholder DID:', unpublishedDoc.id().toString());
    
    // Create temporary storage for key generation
    if (typeof JwkMemStore !== 'function') {
      throw new Error('JwkMemStore not available in identity-wasm module');
    }

    const KeyIdStorageCtor = module.KeyIdMemStore || module.KeyIdMemstore;
    if (!KeyIdStorageCtor) {
      throw new Error('KeyIdMemStore not available in identity-wasm module');
    }

    if (typeof Storage !== 'function') {
      throw new Error('Storage class not available in identity-wasm module');
    }

    const jwkStorage = new JwkMemStore();
    const keyIdStorage = new KeyIdStorageCtor();
    const storage = new Storage(jwkStorage, keyIdStorage);
    
    // Generate verification method using IotaDocument.generateMethod()
    // This is the correct pattern from the docs:
    // unpublished.generate_method(storage, keyType, alg, fragment, scope)
    console.log('🔑 Generating verification method using generateMethod()...');
    
    // Use JwkMemStore.ed25519KeyType() - this is a static method, not a property
    const keyType = typeof JwkMemStore.ed25519KeyType === 'function' 
      ? JwkMemStore.ed25519KeyType() 
      : 'Ed25519'; // Fallback to string if method doesn't exist
    const alg = JwsAlgorithm.EdDSA;
    const fragment = '#key-1'; // Use explicit fragment like in the example
    const scope = MethodScope.VerificationMethod();
    
    const verificationMethodFragment = await unpublishedDoc.generateMethod(
      storage,
      keyType,
      alg,
      fragment,
      scope
    );
    console.log('✅ Verification method generated, fragment:', verificationMethodFragment);
    console.log('📋 Verification methods:', unpublishedDoc.methods().length);

    // Step 5: Use IdentityBuilder directly (no IdentityClient needed!)
    // Pattern from WASM API:
    // 1. new IdentityBuilder(doc) - creates builder with document
    // 2. builder.controller(address) - sets controller (wallet address)
    // 3. builder.finish() - returns TransactionBuilder<CreateIdentity>
    // 4. CreateIdentity.buildProgrammableTransaction(readOnlyClient) - builds transaction bytes
    console.log('📦 Creating IdentityBuilder directly (no IdentityClient needed)...');
    
    const { IdentityBuilder } = module;
    if (!IdentityBuilder) {
      throw new Error('IdentityBuilder not available in identity-wasm module');
    }
    
    // Verify document has verification methods before creating builder
    const methodCount = unpublishedDoc.methods().length;
    console.log('📋 Document verification methods before builder:', methodCount);
    if (methodCount === 0) {
      throw new Error('Document must have at least one verification method before creating IdentityBuilder');
    }
    
    // Create IdentityBuilder with the unpublished document
    // The document already has a verification method, so it's valid
    console.log('📦 Creating IdentityBuilder with document...');
    const identityBuilder = new IdentityBuilder(unpublishedDoc);
    console.log('✅ IdentityBuilder created');
    
    // Set controller (wallet address that pays gas)
    // The controller is the address that controls the identity
    // According to docs, if no controller is set, the transaction sender becomes the controller
    // But we want to explicitly set it to the wallet address
    console.log('📦 Setting controller to wallet address...');
    const builderWithController = identityBuilder.controller(walletAddress, BigInt(1), false);
    console.log('✅ Controller set to wallet address:', walletAddress);

    // Create CreateIdentity directly from the builder.
    // Important: do this before calling finish(), because finish() consumes the builder.
    const builderForTransaction = builderWithController ?? identityBuilder;
    const { CreateIdentity: CreateIdentityClass } = module;
    if (!CreateIdentityClass) {
      throw new Error('CreateIdentity class not available in identity-wasm module');
    }

    console.log('📦 Creating CreateIdentity from builder...');
    const createIdentity = new CreateIdentityClass(builderForTransaction);
    console.log('✅ CreateIdentity instance created');

    console.log('📦 Building programmable transaction via CreateIdentity...');
    const transactionBytes = await createIdentity.buildProgrammableTransaction(readOnlyClient);
    console.log('✅ Transaction bytes built:', transactionBytes.length, 'bytes');

    // Convert bytes to base64 string for dApp Kit (Wallet Standard expects base64-encoded BCS transaction)
    const bytesToBase64 = (bytes: Uint8Array): string => {
      if (typeof Buffer !== 'undefined') {
        return Buffer.from(bytes).toString('base64');
      }
      let binary = '';
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    };

    const transactionBase64 = bytesToBase64(transactionBytes);
    console.log('✅ Transaction encoded to base64 for wallet signing');

    // Step 6: Sign and execute using wallet
    // The transaction is provided as base64 (Wallet Standard compatible)
    console.log('🔏 Signing transaction with wallet...');
    console.log('📋 Transaction length (base64):', transactionBase64.length);
    console.log('📋 Transaction ready for dApp Kit');
    
    const result = await signAndExecuteTransaction(transactionBase64);
    
    console.log('✅ Transaction signed and executed');
    console.log('📋 Result type:', typeof result);
    console.log('📋 Result keys:', result ? Object.keys(result).slice(0, 10) : 'null');

    // Step 7: Extract DID and block ID from result
    // The DID format is: did:iota:[network]:0x[objectId]
    // The Object ID comes from the transaction result
    let did: string;
    let blockId: string | undefined;

    // Try multiple ways to extract the DID
    if (result?.output) {
      const output = result.output;
      // Check if output has didDocument
      if (output.didDocument && typeof output.didDocument.id === 'function') {
        did = output.didDocument.id().toString();
      } else if (output.did) {
        did = output.did;
      } else if (output.identity) {
        // Check if identity object has didDocument
        const identity = output.identity;
        if (identity.didDocument && typeof identity.didDocument.id === 'function') {
          did = identity.didDocument.id().toString();
        } else if (identity.did) {
          did = identity.did;
        }
      }
    }
    
    // If we still don't have a DID, try extracting Object ID
    if (!did) {
      const objectId = result?.objectId || result?.digest || result?.transactionId || result?.txId;
      if (objectId) {
        // Format: did:iota:[network]:0x[objectId]
        // Remove 0x prefix if present, then add it back
        const cleanObjectId = objectId.startsWith('0x') ? objectId : `0x${objectId}`;
        did = `did:iota:${network}:${cleanObjectId}`;
        console.log('📝 Constructed DID from Object ID:', did);
      } else {
        throw new Error(
          `Could not extract DID from transaction result. ` +
          `Result structure: ${JSON.stringify(result, null, 2).substring(0, 500)}`
        );
      }
    }
    
    blockId = result?.blockId || result?.digest || result?.transactionId || result?.txId || result?.messageId;

    console.log('✅ DID published:', did);
    console.log('📦 Block ID:', blockId);

    const explorerUrl = `https://explorer.iota.org/address/${did}?network=testnet`;

    return {
      success: true,
      did,
      blockId,
      explorerUrl,
    };
  } catch (error) {
    console.error('❌ Failed to publish DID:', error);
    console.error('📋 Error details:', error instanceof Error ? error.stack : String(error));
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Main export function - tries client-side first, falls back to microservice
 * 
 * Components should use this function. It will:
 * 1. Try client-side publishing if signAndExecuteTransaction is provided
 * 2. Fall back to microservice (which will return a helpful error)
 */
export async function publishIdentityToChain(
  did: string | null,
  walletAddress?: string,
  signAndExecuteTransaction?: (transaction: any) => Promise<any>
): Promise<PublishIdentityResult> {
  // If signAndExecuteTransaction is provided, use client-side approach
  if (signAndExecuteTransaction && walletAddress) {
    return publishIdentityToChainClientSide(walletAddress, signAndExecuteTransaction);
  }
  
  // Otherwise, fall back to microservice (which will explain the limitation)
  return publishIdentityToChainLegacy(did, walletAddress);
}

/**
 * Legacy function signature for backwards compatibility
 * This version tries to use the microservice (which will fail gracefully)
 */
export async function publishIdentityToChainLegacy(
  did: string | null,
  walletAddress?: string
): Promise<PublishIdentityResult> {
  // This is the old microservice approach - now returns error
  const SERVICE_BASE_URL =
    (process.env.NEXT_PUBLIC_IDENTITY_SERVICE_URL || 'http://localhost:4000').replace(/\/$/, '');

  try {
    const response = await fetch(`${SERVICE_BASE_URL}/identity/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        did,
        walletAddress,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data?.success) {
      return {
        success: false,
        error:
          data?.error ||
          data?.details ||
          `Identity service error (status ${response.status})`,
      };
    }

    return {
      success: true,
      did: data.did,
      blockId: data.blockId,
      explorerUrl: data.explorerUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reach identity service',
    };
  }
}
