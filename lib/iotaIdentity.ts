/**
 * IOTA Identity Utility Functions
 * 
 * This file provides wrapper functions for working with IOTA DIDs and Verifiable Credentials.
 * 
 * Key Concepts:
 * - DID: Decentralized Identifier (like did:iota:0x123...)
 * - VC: Verifiable Credential (digitally signed claims)
 * - DID Document: Public information about a DID (keys, services, etc.)
 */

import { DIDCreationResult, CredentialData, VerificationResult } from '@/types';

// Flag to track if WASM has been initialized
let wasmInitialized = false;

/**
 * Initialize the IOTA Identity WASM module
 * This must be called before using any IOTA Identity functions
 * 
 * NOTE: For this demo, we're skipping actual WASM initialization
 * and creating mock DIDs instead. This makes the app work instantly
 * without complex WASM setup.
 */
async function initWasm() {
  if (wasmInitialized) return;
  
  // For demo purposes, we skip WASM initialization
  // In production, you would actually initialize the WASM module
  wasmInitialized = true;
  console.log('✅ IOTA Identity (Demo Mode) initialized');
}

/**
 * Create a new DID on the IOTA Tangle
 * 
 * Flow:
 * 1. Generate cryptographic keys (Ed25519)
 * 2. Create DID Document
 * 3. Publish to IOTA Tangle
 * 4. Return DID identifier
 * 
 * @returns Promise with DID and document data
 */
export async function createDID(): Promise<DIDCreationResult> {
  try {
    await initWasm();
    
    console.log('📝 Creating new DID...');
    
    // Generate random bytes for DID
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    
    // Convert bytes to hex string
    const hexString = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Create DID in IOTA format (Shimmer testnet)
    const didString = `did:iota:smr:0x${hexString}`;
    
    // Create mock DID document
    const document = {
      id: didString,
      '@context': 'https://www.w3.org/ns/did/v1',
      verificationMethod: [{
        id: `${didString}#key-1`,
        type: 'Ed25519VerificationKey2018',
        controller: didString,
        publicKeyMultibase: 'z' + hexString.substring(0, 44),
      }],
      authentication: [`${didString}#key-1`],
    };
    
    console.log('🔐 Generated DID Document');
    console.log('✅ DID created:', didString);
    console.log('💡 Note: This is a demo DID (not published to blockchain)');
    
    return {
      did: didString,
      document,
    };
  } catch (error) {
    console.error('❌ Error creating DID:', error);
    throw error;
  }
}

/**
 * Issue a Verifiable Credential
 * 
 * This creates a digitally signed credential that makes claims about a subject.
 * Think of it like a digital diploma or certificate.
 * 
 * Flow:
 * 1. Create credential with claims (subject data)
 * 2. Sign with issuer's private key
 * 3. Return as JWT (JSON Web Token)
 * 
 * @param issuerDID - DID of the credential issuer
 * @param holderDID - DID of the credential holder (subject)
 * @param claimData - The actual claims (degree info, etc.)
 * @returns JWT string representing the credential
 */
export async function issueCredential(
  issuerDID: string,
  holderDID: string,
  claimData: CredentialData
): Promise<string> {
  try {
    await initWasm();
    
    console.log('📝 Issuing credential...');
    
    // Create credential subject (the claims about the holder)
    const credentialSubject = {
      id: holderDID,
      name: claimData.name,
      degree: claimData.degree,
      university: claimData.university,
    };
    
    // Create the credential as a simple JSON structure
    // In production, this would be a proper W3C Verifiable Credential
    const now = new Date();
    const oneYearLater = new Date(now);
    oneYearLater.setFullYear(now.getFullYear() + 1);
    
    const credential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1'
      ],
      id: `${issuerDID}#credential-${Date.now()}`,
      type: ['VerifiableCredential', 'UniversityDegreeCredential'],
      issuer: issuerDID,
      issuanceDate: now.toISOString(),
      expirationDate: oneYearLater.toISOString(),
      credentialSubject: credentialSubject,
    };
    
    console.log('✅ Credential created');
    
    // In a real app, you would sign this with the issuer's private key
    // For this demo, we'll return the credential as JSON
    // Note: This is NOT a valid JWT without signing!
    const jwt = JSON.stringify(credential);
    
    return jwt;
  } catch (error) {
    console.error('❌ Error issuing credential:', error);
    throw error;
  }
}

/**
 * Verify a Verifiable Credential
 * 
 * This checks if a credential is valid by:
 * 1. Parsing the JWT
 * 2. Extracting the issuer's DID
 * 3. Fetching the issuer's DID Document from Tangle
 * 4. Verifying the signature using the issuer's public key
 * 5. Checking expiration dates
 * 
 * @param credentialJWT - The credential to verify (as JWT string)
 * @returns Verification result with validity status
 */
export async function verifyCredential(credentialJWT: string): Promise<VerificationResult> {
  try {
    await initWasm();
    
    console.log('🔍 Verifying credential...');
    
    // Parse the credential JSON
    const credentialData = JSON.parse(credentialJWT);
    
    // Basic validation checks
    if (!credentialData.issuer) {
      return {
        isValid: false,
        error: 'Missing issuer in credential',
      };
    }
    
    if (!credentialData.credentialSubject) {
      return {
        isValid: false,
        error: 'Missing credential subject',
      };
    }
    
    // Check expiration
    if (credentialData.expirationDate) {
      const expDate = new Date(credentialData.expirationDate);
      if (expDate < new Date()) {
        return {
          isValid: false,
          error: 'Credential has expired',
        };
      }
    }
    
    console.log('✅ Credential is valid');
    
    // In a real app, you would:
    // 1. Fetch the issuer's DID Document from the Tangle
    // 2. Extract the public key
    // 3. Verify the JWT signature
    // For this demo, we're doing basic validation
    
    return {
      isValid: true,
      credential: credentialData,
    };
  } catch (error) {
    console.error('❌ Error verifying credential:', error);
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch a DID Document from the IOTA Tangle
 * 
 * @param did - The DID to fetch
 * @returns The DID Document
 */
export async function resolveDID(did: string): Promise<unknown> {
  try {
    await initWasm();
    
    console.log('🔍 Resolving DID:', did);
    
    // Validate DID format
    if (!did || typeof did !== 'string') {
      const error = new Error('Invalid DID: must be a non-empty string');
      error.name = 'ValidationError';
      throw error;
    }
    
    // Check if it's a valid IOTA DID format
    const iotaDIDRegex = /^did:iota:(smr|rms|iota):0x[0-9a-fA-F]{64}$/;
    if (!iotaDIDRegex.test(did)) {
      const error = new Error('Invalid DID format. Please enter a valid IOTA DID starting with did:iota:smr:0x...');
      error.name = 'ValidationError';
      throw error;
    }
    
    // Check if DID exists in localStorage (for demo purposes)
    const savedDIDs = JSON.parse(localStorage.getItem('iota-dids') || '[]');
    const existsLocally = savedDIDs.some((d: { did: string }) => d.did === did);
    
    // For demo: only accept DIDs we created OR the example DID
    const exampleDID = 'did:iota:smr:0xec6c94cbe765fb6bbd0b8e8753740798e299f3b2e4d43806dd36ec2db2f8e96c';
    
    if (!existsLocally && did !== exampleDID) {
      const error = new Error('DID not found. You can only verify DIDs you created or use the example.');
      error.name = 'ValidationError';
      throw error;
    }
    
    // Create mock DID document for demo
    const document = {
      id: did,
      '@context': 'https://www.w3.org/ns/did/v1',
      verificationMethod: [{
        id: `${did}#key-1`,
        type: 'Ed25519VerificationKey2018',
        controller: did,
      }],
      authentication: [`${did}#key-1`],
    };
    
    console.log('✅ DID resolved (demo mode)');
    
    return document;
  } catch (error) {
    // Only log unexpected errors, not validation errors
    if (error instanceof Error && error.name !== 'ValidationError') {
      console.error('❌ Error resolving DID:', error);
    }
    throw error;
  }
}

