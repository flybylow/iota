/**
 * Blockchain Publishing Helper
 * 
 * This module provides the complete blockchain publishing implementation
 * using IOTA Identity SDK and dApp Kit.
 */

import { useSignAndExecuteTransaction } from '@iota/dapp-kit';
import { useIotaClient } from '@iota/dapp-kit';
import { initWasm } from './iotaIdentityReal';
import type { DIDCreationResult } from '@/types';

let Identity: any = null;

/**
 * Prepare a DID document for blockchain publishing
 * This creates a proper IotaDocument ready for on-chain submission
 */
export async function createBlockchainDID(): Promise<{
  doc: any;
  did: string;
  packedDoc: Uint8Array;
}> {
  // Initialize WASM
  await initWasm();
  
  // Initialize Identity SDK if not already done
  if (!Identity) {
    const identityModule = await import('@iota/identity-wasm/web');
    await identityModule.init();
    Identity = identityModule;
  }
  
  const { IotaDocument } = Identity;
  
  // Create a new IotaDocument
  const doc = new IotaDocument('iota');
  const did = doc.id().toString();
  
  console.log('✅ IOTA Identity Document created');
  console.log('📝 DID:', did);
  
  // Pack the document for blockchain (as Uint8Array)
  const packedDoc = new TextEncoder().encode(doc.toJSON());
  
  return {
    doc,
    did,
    packedDoc,
  };
}

/**
 * Publish DID to blockchain using dApp Kit
 * 
 * This is the main function that handles the complete publishing flow:
 * 1. Creates IotaDocument
 * 2. Prepares transaction
 * 3. Signs with wallet
 * 4. Submits to blockchain
 */
export async function publishDIDToChain(
  signAndExecute: (params: any, callbacks: any) => void,
  client: any,
  address: string
): Promise<{ success: boolean; blockId?: string; error?: string }> {
  try {
    console.log('📤 Starting blockchain publishing...');
    
    // Step 1: Create IOTA Identity document
    console.log('📦 Step 1: Creating IOTA Identity document...');
    const { doc, did, packedDoc } = await createBlockchainDID();
    
    console.log('✅ Document created:', did);
    
    // Step 2: Prepare transaction for dApp Kit
    console.log('📦 Step 2: Preparing transaction...');
    
    // Create transaction payload with proper structure
    // The IOTA Identity SDK document is ready for publishing
    const transactionPayload = {
      accountIndex: 0,
      options: {
        alias: {
          immutableMetadata: packedDoc,
        }
      }
    };
    
    console.log('✅ Transaction prepared');
    console.log('💡 Ready for wallet signing');
    
    // Step 3: Return promise for signAndExecute
    return new Promise((resolve) => {
      // Call signAndExecute with the transaction
      signAndExecute(
        transactionPayload,
        {
          onSuccess: (result: any) => {
            console.log('✅ Transaction submitted to blockchain!', result);
            resolve({
              success: true,
              blockId: result.id || result.blockId,
            });
          },
          onError: (error: Error) => {
            console.error('❌ Transaction failed:', error);
            resolve({
              success: false,
              error: error.message,
            });
          }
        }
      );
    });
    
  } catch (error) {
    console.error('❌ Publishing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Simplified blockchain publishing - creates and publishes a DID in one step
 */
export async function createAndPublishDID(
  signAndExecute: (params: any, callbacks: any) => void,
  client: any,
  address: string
): Promise<DIDCreationResult> {
  try {
    // Create the DID
    const { did, packedDoc } = await createBlockchainDID();
    
    // Publish to blockchain
    const result = await publishDIDToChain(signAndExecute, client, address);
    
    if (result.success) {
      return {
        did,
        document: {} as any,
        privateKey: new Uint8Array(),
        needsPublishing: false,
        keyStored: false,
        onChain: true,
        transactionId: result.blockId,
        explorerUrl: `https://explorer.iota.org/search/${did}?network=testnet`,
        note: 'DID published to IOTA blockchain successfully',
      };
    } else {
      return {
        did,
        document: {} as any,
        privateKey: new Uint8Array(),
        needsPublishing: true,
        keyStored: false,
        onChain: false,
        error: result.error,
        note: 'DID created locally but publishing failed',
      };
    }
  } catch (error) {
    console.error('❌ Error in createAndPublishDID:', error);
    throw error;
  }
}

