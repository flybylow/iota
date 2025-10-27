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
import { connectWallet } from './wallet-connection';
import type { DIDCreationResult } from '@/types';

/**
 * Attempt to publish a DID Document to the blockchain
 * 
 * Requirements:
 * - WASM initialized
 * - Client connected to network
 * - Wallet with testnet tokens (for storage deposit)
 * 
 * @param document - The DID document to publish
 * @param privateKey - Private key for signing
 * @returns Transaction receipt if successful
 */
export async function publishDIDToBlockchain(
  document: any,
  privateKey: Uint8Array
): Promise<{ published: boolean; transactionId?: string; error?: string }> {
  try {
    await initWasm();
    const client = await initClient();
    
    if (!client || !isClientConnected()) {
      return {
        published: false,
        error: 'No network connection - DID created locally only'
      };
    }
    
    console.log('📤 Attempting to publish DID to blockchain...');
    
    // Step 1: Connect to wallet
    const walletAddress = await connectWallet();
    if (!walletAddress) {
      return {
        published: false,
        error: 'Wallet not connected. Please connect your IOTA Wallet extension.'
      };
    }
    
    console.log('✅ Wallet connected:', walletAddress);
    
    // Step 2: Note - IOTA SDK contains native bindings
    // For now, DIDs are created locally and ready for blockchain publishing
    // Full publishing requires server-side implementation
    console.log('📝 Note: Wallet connected successfully');
    console.log('💡 DIDs created locally and ready for blockchain when publishing is implemented');
    console.log('🔧 Full publishing requires server-side API or wallet extension with proper methods');
    
    return {
      published: false,
      error: 'Wallet connected. Framework ready. Publishing requires server-side implementation.'
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
    const client = await initClient();
    
    if (!client || !isClientConnected()) {
      return false;
    }
    
    const identityModule = await import('@iota/identity-wasm/web');
    const IotaIdentityClient = (identityModule as any).IotaIdentityClient;
    
    if (!IotaIdentityClient) {
      return false;
    }
    
    const identityClient = new IotaIdentityClient(client);
    
    // Try to resolve the DID from blockchain
    try {
      await identityClient.resolveDid(did);
      return true; // Successfully resolved = published
    } catch {
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
    const client = await initClient();
    
    if (!client || !isClientConnected()) {
      throw new Error('No network connection');
    }
    
    const identityModule = await import('@iota/identity-wasm/web');
    const IotaIdentityClient = (identityModule as any).IotaIdentityClient;
    
    if (!IotaIdentityClient) {
      throw new Error('IotaIdentityClient not available');
    }
    
    const identityClient = new IotaIdentityClient(client);
    
    console.log('🔍 Resolving DID from blockchain:', did);
    const resolved = await identityClient.resolveDid(did);
    
    console.log('✅ DID resolved successfully');
    return resolved;
    
  } catch (error) {
    console.error('❌ Failed to resolve DID:', error);
    throw new Error(`Could not resolve DID: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

