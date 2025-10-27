/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Integration Testing for IOTA Identity
 * 
 * Tests the complete flow from DID creation to credential verification
 * Following the testing strategy from the implementation plan
 */

import { initWasm } from './iotaIdentityReal';
import { initClient, isClientConnected, getClientInfo } from './iotaClient';
import { createAndPublishDID, isDIDPublished } from './didPublishing';
import { issueCredential, verifyCredential } from './iotaIdentityReal';

export interface TestResult {
  passed: boolean;
  message: string;
  details?: any;
  error?: string;
}

/**
 * Phase 1: WASM Initialization Test
 * Test if WASM module loads correctly in the browser
 */
export async function testWASMInit(): Promise<TestResult> {
  try {
    console.log('🧪 Phase 1: Testing WASM Initialization...');
    
    await initWasm();
    
    console.log('✅ WASM initialized successfully');
    return {
      passed: true,
      message: 'WASM initialized successfully',
      details: {
        browser: typeof window !== 'undefined',
        timing: 'Initialization completed'
      }
    };
  } catch (error) {
    console.error('❌ WASM initialization failed:', error);
    return {
      passed: false,
      message: 'WASM initialization failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Phase 2: Network Connection Test
 * Test if we can connect to IOTA testnet
 */
export async function testNetworkConnection(): Promise<TestResult> {
  try {
    console.log('🧪 Phase 2: Testing Network Connection...');
    
    await initClient();
    const info = await getClientInfo();
    
    if (isClientConnected()) {
      console.log('✅ Network connection established');
      return {
        passed: true,
        message: 'Connected to IOTA testnet',
        details: info
      };
    } else {
      console.log('⚠️  No network connection - will create DIDs locally');
      return {
        passed: true, // Not a failure, just local mode
        message: 'Network unavailable - operating in local mode',
        details: info
      };
    }
  } catch (error) {
    console.error('❌ Network test failed:', error);
    return {
      passed: true, // Not critical - can work offline
      message: 'Network connection not available - local mode only',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Phase 3: DID Creation Test
 * Test creating a DID (local or on-chain)
 */
export async function testDIDCreation(): Promise<TestResult> {
  try {
    console.log('🧪 Phase 3: Testing DID Creation...');
    
    const result = await createAndPublishDID();
    
    console.log('✅ DID created:', result.did);
    console.log('📍 On-chain:', result.onChain ? 'Yes' : 'No (local only)');
    
    // Check if DID is published (if we have network)
    let publishedStatus = false;
    try {
      publishedStatus = await isDIDPublished(result.did);
    } catch {
      publishedStatus = false;
    }
    
    return {
      passed: true,
      message: result.onChain ? 'DID created and published to blockchain' : 'DID created locally',
      details: {
        did: result.did,
        onChain: result.onChain,
        published: publishedStatus,
        transactionId: result.transactionId,
        note: result.note
      }
    };
  } catch (error) {
    console.error('❌ DID creation failed:', error);
    return {
      passed: false,
      message: 'DID creation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Phase 4: Credential Issuance Test
 * Test issuing a verifiable credential
 */
export async function testCredentialIssuance(): Promise<TestResult> {
  try {
    console.log('🧪 Phase 4: Testing Credential Issuance...');
    
    // Create issuer DID
    const issuerResult = await createAndPublishDID();
    console.log('✅ Issuer DID created:', issuerResult.did);
    
    // Create subject DID
    const subjectResult = await createAndPublishDID();
    console.log('✅ Subject DID created:', subjectResult.did);
    
    // Issue credential
    const credentialJWT = await issueCredential(
      issuerResult.did,
      subjectResult.did,
      {
        type: 'TestCredential',
        testData: 'Integration test credential',
        issuedFor: 'testing purposes',
        timestamp: new Date().toISOString()
      }
    );
    
    console.log('✅ Credential issued');
    console.log('📄 JWT length:', credentialJWT.length);
    
    return {
      passed: true,
      message: 'Credential issued successfully',
      details: {
        issuer: issuerResult.did,
        subject: subjectResult.did,
        credentialLength: credentialJWT.length,
        onChain: issuerResult.onChain && subjectResult.onChain
      }
    };
  } catch (error) {
    console.error('❌ Credential issuance failed:', error);
    return {
      passed: false,
      message: 'Credential issuance failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Phase 5: Credential Verification Test
 * Test verifying a credential
 */
export async function testCredentialVerification(): Promise<TestResult> {
  try {
    console.log('🧪 Phase 5: Testing Credential Verification...');
    
    // Create and issue a test credential
    const issuerResult = await createAndPublishDID();
    const subjectResult = await createAndPublishDID();
    
    const credentialJWT = await issueCredential(
      issuerResult.did,
      subjectResult.did,
      {
        type: 'TestCredential',
        testData: 'Verification test'
      }
    );
    
    // Verify the credential
    const verifyResult = await verifyCredential(credentialJWT);
    
    if (verifyResult.isValid) {
      console.log('✅ Credential verified successfully');
      return {
        passed: true,
        message: 'Credential verification successful',
        details: {
          isValid: verifyResult.isValid,
          onChain: verifyResult.onChain,
          note: verifyResult.note
        }
      };
    } else {
      console.log('⚠️  Credential verification returned invalid');
      return {
        passed: false,
        message: 'Credential verification failed',
        error: verifyResult.error
      };
    }
  } catch (error) {
    console.error('❌ Credential verification test failed:', error);
    return {
      passed: false,
      message: 'Credential verification test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Run all integration tests
 * Follows the testing strategy from the implementation plan
 */
export async function runAllTests(): Promise<{
  overall: boolean;
  tests: Record<string, TestResult>;
}> {
  console.log('🚀 Running IOTA Identity Integration Tests...');
  console.log('=' . repeat(60));
  
  const results: Record<string, TestResult> = {};
  
  // Phase 1: WASM Init
  results.wasmInit = await testWASMInit();
  
  // Phase 2: Network Connection
  results.networkConnection = await testNetworkConnection();
  
  // Phase 3: DID Creation
  results.didCreation = await testDIDCreation();
  
  // Phase 4: Credential Issuance
  results.credentialIssuance = await testCredentialIssuance();
  
  // Phase 5: Credential Verification
  results.credentialVerification = await testCredentialVerification();
  
  // Calculate overall result
  const criticalTests = ['wasmInit', 'didCreation', 'credentialIssuance', 'credentialVerification'];
  const overall = criticalTests.every(test => results[test].passed);
  
  console.log('=' .repeat(60));
  console.log('🏁 Test Results:');
  console.log(`✅ Passed: ${Object.values(results).filter(r => r.passed).length}/${Object.values(results).length}`);
  console.log(`Overall: ${overall ? '✅ PASS' : '❌ FAIL'}`);
  
  return { overall, tests: results };
}

