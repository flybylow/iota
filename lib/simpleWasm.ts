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
    const { IotaDocument } = Identity;
    
    // Generate a random network (placeholder for now)
    const networkName = 'smr';
    
    // Create a new DID
    const doc = new IotaDocument(networkName);
    
    const did = doc.id().toString();
    const docJson = doc.toJSON();
    
    console.log('✅ DID Created:', did);
    console.log('📄 Document:', docJson);
    
    // Store for later use
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastDID', did);
      localStorage.setItem('lastDIDDoc', JSON.stringify(docJson));
    }
    
    return {
      success: true,
      did,
      document: docJson,
      network: networkName,
      note: 'DID created locally (not published to blockchain)'
    };
    
  } catch (error: any) {
    console.error('❌ DID creation failed:', error);
    return {
      success: false,
      error: error.message,
      details: error.toString()
    };
  }
}

export async function testIssueCredential(issuerDID?: string, holderDID?: string) {
  try {
    const Identity = await initSimpleWasm();
    
    console.log('📜 Issuing credential...');
    
    // Use provided DIDs or create new ones
    const issuer = issuerDID || 'did:iota:smr:0x' + '1'.repeat(64);
    const holder = holderDID || 'did:iota:smr:0x' + '2'.repeat(64);
    
    console.log('👤 Issuer:', issuer);
    console.log('👤 Holder:', holder);
    
    // Create a simple credential object (W3C Verifiable Credential format)
    const credential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1'
      ],
      id: `${issuer}#credential-${Date.now()}`,
      type: ['VerifiableCredential', 'OrganicProductCertificate'],
      issuer: issuer,
      issuanceDate: new Date().toISOString(),
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      credentialSubject: {
        id: holder,
        name: 'Maria Garcia',
        location: 'Manabí Province, Ecuador',
        product: 'Organic Cocoa',
        batchWeight: '2500 kg',
        certification: 'EU Organic, Fair Trade',
        harvestDate: '2025-10-01'
      }
    };
    
    console.log('✅ Credential Created');
    console.log('📋 Type:', credential.type);
    console.log('📅 Issued:', credential.issuanceDate);
    console.log('📅 Expires:', credential.expirationDate);
    
    // Store for verification
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastCredential', JSON.stringify(credential));
    }
    
    return {
      success: true,
      credential: credential,
      issuer,
      holder
    };
    
  } catch (error: any) {
    console.error('❌ Credential issuance failed:', error);
    return {
      success: false,
      error: error.message,
      details: error.toString()
    };
  }
}

export async function testVerifyCredential(credentialJson?: any) {
  try {
    const Identity = await initSimpleWasm();
    
    console.log('🔍 Verifying credential...');
    
    // Get credential from storage or parameter
    let cred = credentialJson;
    if (!cred && typeof window !== 'undefined') {
      const stored = localStorage.getItem('lastCredential');
      if (stored) {
        cred = JSON.parse(stored);
      }
    }
    
    if (!cred) {
      throw new Error('No credential to verify. Issue a credential first.');
    }
    
    console.log('📄 Credential received');
    console.log('👤 Issuer:', cred.issuer);
    console.log('👤 Subject ID:', cred.credentialSubject.id);
    console.log('📋 Type:', cred.type);
    
    // Basic validation
    const now = new Date();
    const issuanceDate = new Date(cred.issuanceDate);
    const expirationDate = cred.expirationDate ? new Date(cred.expirationDate) : null;
    
    const isNotExpired = !expirationDate || expirationDate > now;
    const isIssued = issuanceDate <= now;
    
    console.log('⏰ Issued:', cred.issuanceDate);
    if (cred.expirationDate) {
      console.log('⏰ Expires:', cred.expirationDate);
    }
    console.log('✓ Not expired:', isNotExpired);
    console.log('✓ Already issued:', isIssued);
    console.log('✓ Has valid structure:', !!(cred.issuer && cred.credentialSubject));
    
    const isValid = isNotExpired && isIssued && cred.issuer && cred.credentialSubject;
    
    if (isValid) {
      console.log('✅ Credential is valid!');
    } else {
      console.log('❌ Credential validation failed');
    }
    
    return {
      success: true,
      isValid,
      credential: cred,
      issuer: cred.issuer,
      subject: cred.credentialSubject,
      issuanceDate: cred.issuanceDate,
      expirationDate: cred.expirationDate,
      checks: {
        notExpired: isNotExpired,
        issued: isIssued,
        hasValidStructure: !!(cred.issuer && cred.credentialSubject)
      }
    };
    
  } catch (error: any) {
    console.error('❌ Credential verification failed:', error);
    return {
      success: false,
      error: error.message,
      details: error.toString()
    };
  }
}

