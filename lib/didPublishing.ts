/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * DID Publishing to Blockchain
 * 
 * Handles the actual publishing of DIDs to the IOTA Tangle
 * Requires testnet tokens for storage deposits
 */

import { initWasm } from './iotaIdentityReal';
import { initClient, isClientConnected } from './iotaClient';
import { savePrivateKey } from './keyStorage';
import type { DIDCreationResult } from '@/types';

/**
 * Note: This file still uses the deprecated wallet-connection.ts approach.
 * In production, use the dApp Kit hooks from lib/hooks/useDIDPublishing.ts
 * for proper transaction signing with Wallet Standard API.
 */

/**
 * Attempt to publish a DID Document to the blockchain
 * 
 * Requirements:
 * - WASM initialized
 * - Client connected to network
 * - Wallet with testnet tokens (for storage deposit)
 * 
 * @returns Transaction receipt if successful
 */
export async function publishDIDToBlockchain(
  _document: any,
  _privateKey: Uint8Array
): Promise<{ published: boolean; transactionId?: string; error?: string }> {
  try {
    await initWasm();
    const connection = await initClient();
    
    if (!connection || !isClientConnected()) {
      return {
        published: false,
        error: 'No network connection - DID created locally only'
      };
    }
    
    console.log('📤 Attempting to publish DID to blockchain...');
    
    console.warn('⚠️ IdentityClientReadOnly is connected, but write operations require wallet signing.');
    console.warn('💡 Publishing to the Tangle currently requires the dApp Kit transaction flow.');
    console.warn('💡 Use lib/hooks/useDIDPublishing.ts together with a connected wallet once testnet tokens are available.');
    
    return {
      published: false,
      error: 'Blockchain publishing requires wallet signing via dApp Kit. This demo currently creates DIDs locally only.',
    };
    
  } catch (error) {
    console.error('❌ Failed to publish DID:', error);
    return {
      published: false,
      error: error instanceof Error ? error.message : 'Unknown publishing error'
    };
  }
}

/**
 * Create and publish a DID (if possible)
 * Falls back to local creation if publishing fails
 */
export async function createAndPublishDID(): Promise<DIDCreationResult> {
  try {
    await initWasm();
    
    const identityModule = await import('@iota/identity-wasm/web');
    const { IotaDocument } = identityModule;
    
    // Generate private key
    const privateKey = new Uint8Array(32);
    crypto.getRandomValues(privateKey);
    
    // Create DID document
    const document = new IotaDocument('smr');
    const didString = document.id().toString();
    
    console.log('✅ DID document created locally:', didString);
    
    // Attempt to publish
    const publishResult = await publishDIDToBlockchain(document, privateKey);
    
    if (publishResult.published) {
      console.log('✅ DID published to blockchain!');
      console.log('📝 Transaction ID:', publishResult.transactionId);
      
      // Store private key
      await savePrivateKey(didString, privateKey);
      
      return {
        did: didString,
        document: (document.toJSON ? document.toJSON() : document) as Record<string, unknown>,
        privateKey: Array.from(privateKey),
        needsPublishing: false,
        keyStored: true,
        onChain: true,
        transactionId: publishResult.transactionId,
        note: 'DID successfully published to IOTA testnet'
      };
    } else {
      console.log('⚠️  Publishing failed:', publishResult.error);
      console.log('💡 DID created locally - can be published later with tokens');
      
      // Store private key for local DID
      await savePrivateKey(didString, privateKey);
      
      return {
        did: didString,
        document: (document.toJSON ? document.toJSON() : document) as Record<string, unknown>,
        privateKey: Array.from(privateKey),
        needsPublishing: true,
        keyStored: true,
        onChain: false,
        note: `Local DID created. ${publishResult.error}`
      };
    }
    
  } catch (error) {
    console.error('❌ Error in createAndPublishDID:', error);
    throw error;
  }
}

/**
 * Check if a DID is published on-chain
 * 
 * @param did - DID to check
 * @returns Whether the DID exists on the blockchain
 */
export async function isDIDPublished(did: string): Promise<boolean> {
  try {
    const connection = await initClient();
    
    if (!connection || !isClientConnected()) {
      return false;
    }
    
    const identityModule =
      connection.identityModule ?? (await import('@iota/identity-wasm/web'));
    const IotaDID = (identityModule as any).IotaDID;
    
    if (!IotaDID || typeof IotaDID.parse !== 'function') {
      console.warn('⚠️ IotaDID parser not available - cannot resolve on-chain DID');
      return false;
    }
    
    let parsedDid: any;
    try {
      parsedDid = IotaDID.parse(did);
    } catch (parseError) {
      console.warn('⚠️ Invalid DID format for on-chain resolution:', parseError);
      return false;
    }
    
    const readOnlyClient = connection.identityClientReadOnly;
    if (!readOnlyClient || typeof readOnlyClient.resolveDid !== 'function') {
      console.warn('⚠️ IdentityClientReadOnly not available - cannot resolve DID');
      return false;
    }

    try {
      await readOnlyClient.resolveDid(parsedDid);
      return true; // Successfully resolved = published
    } catch (resolveError) {
      console.warn('⚠️ DID resolution failed:', resolveError);
      return false; // Resolution failed = not published
    }
    
  } catch (error) {
    console.error('Error checking DID publication status:', error);
    return false;
  }
}

/**
 * Resolve a DID from the blockchain
 * 
 * @param did - DID to resolve
 * @returns DID Document if found
 */
export async function resolveDIDFromBlockchain(did: string) {
  try {
    const connection = await initClient();
    
    if (!connection || !isClientConnected()) {
      throw new Error('No network connection');
    }
    
    const identityModule =
      connection.identityModule ?? (await import('@iota/identity-wasm/web'));
    const IotaDID = (identityModule as any).IotaDID;
    
    if (!IotaDID || typeof IotaDID.parse !== 'function') {
      throw new Error('IotaDID parser not available');
    }
    
    let parsedDid: any;
    try {
      parsedDid = IotaDID.parse(did);
    } catch (parseError) {
      throw new Error(`Invalid DID format: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }

    const readOnlyClient = connection.identityClientReadOnly;
    if (!readOnlyClient || typeof readOnlyClient.resolveDid !== 'function') {
      throw new Error('IdentityClientReadOnly not available');
    }
    
    console.log('🔍 Resolving DID from blockchain:', did);
    const resolved = await readOnlyClient.resolveDid(parsedDid);
    
    console.log('✅ DID resolved successfully');
    return resolved;
    
  } catch (error) {
    console.error('❌ Failed to resolve DID:', error);
    throw new Error(`Could not resolve DID: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

