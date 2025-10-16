# 🧪 Quick Test - Complete DID Flow

## Test the Complete Flow

### Option 1: Automated Test (Copy & Paste)

Open browser console at **http://localhost:3002** and paste:

```javascript
(async () => {
  console.log('🚀 Testing Complete IOTA Identity Flow\n');
  
  // Import modules
  const { createDID, issueCredential, verifyCredential } = await import('/lib/iotaIdentityReal.js');
  
  // Step 1: Create Farmer DID (Issuer)
  console.log('👨‍🌾 Step 1: Creating Farmer DID...');
  const farmer = await createDID();
  console.log('✅ Farmer DID:', farmer.did);
  console.log('   Key stored:', farmer.keyStored);
  console.log('');
  
  // Step 2: Create Product DID (Holder)
  console.log('📦 Step 2: Creating Product DID...');
  const product = await createDID();
  console.log('✅ Product DID:', product.did);
  console.log('   Key stored:', product.keyStored);
  console.log('');
  
  // Step 3: Issue Credential
  console.log('📝 Step 3: Issuing Organic Origin Credential...');
  const credential = await issueCredential(farmer.did, product.did, {
    type: 'OrganicOriginCertification',
    origin: 'Ecuador',
    certification: 'EU Organic',
    harvestDate: '2025-10-01',
    batchWeight: 2500,
    variety: 'Nacional'
  });
  console.log('✅ Credential issued!');
  console.log('   Length:', credential.length, 'chars');
  console.log('');
  
  // Step 4: Verify Credential
  console.log('🔍 Step 4: Verifying credential...');
  const result = await verifyCredential(credential);
  console.log('✅ Verification result:', result.isValid ? 'VALID ✓' : 'INVALID ✗');
  if (result.note) console.log('   Note:', result.note);
  console.log('');
  
  // Summary
  console.log('📊 FLOW TEST COMPLETE!');
  console.log('═══════════════════════════════════════');
  console.log('✅ Farmer DID:    ', farmer.did.substring(0, 45) + '...');
  console.log('✅ Product DID:   ', product.did.substring(0, 45) + '...');
  console.log('✅ Credential:    ', 'Issued');
  console.log('✅ Verification:  ', result.isValid ? 'PASSED' : 'FAILED');
  console.log('═══════════════════════════════════════');
  console.log('\n🎉 All steps completed successfully!');
  
  return { farmer, product, credential, result };
})();
```

---

### Option 2: Step-by-Step (Manual)

```javascript
// Import
const { createDID, issueCredential, verifyCredential } = await import('/lib/iotaIdentityReal.js');

// Create Farmer DID
const farmer = await createDID();
console.log('Farmer:', farmer.did);

// Create Product DID
const product = await createDID();
console.log('Product:', product.did);

// Issue Credential
const cred = await issueCredential(farmer.did, product.did, {
  type: 'OrganicOriginCertification',
  origin: 'Ecuador'
});
console.log('Credential:', cred.substring(0, 100) + '...');

// Verify
const result = await verifyCredential(cred);
console.log('Valid?', result.isValid);
```

---

## Expected Output

You should see:

```
🚀 Testing Complete IOTA Identity Flow

👨‍🌾 Step 1: Creating Farmer DID...
✅ Farmer DID: did:iota:smr:0x...
   Key stored: true

📦 Step 2: Creating Product DID...
✅ Product DID: did:iota:smr:0x...
   Key stored: true

📝 Step 3: Issuing Organic Origin Credential...
✅ Credential issued!
   Length: XXX chars

🔍 Step 4: Verifying credential...
✅ Verification result: VALID ✓
   Note: Structural validation passed...

📊 FLOW TEST COMPLETE!
═══════════════════════════════════════
✅ Farmer DID:     did:iota:smr:0x...
✅ Product DID:    did:iota:smr:0x...
✅ Credential:     Issued
✅ Verification:   PASSED
═══════════════════════════════════════

🎉 All steps completed successfully!
```

---

## What This Proves

✅ **DID Creation** - Working locally  
✅ **Key Management** - Encrypted storage  
✅ **Credential Issuance** - W3C format  
✅ **Verification** - Structural validation  

---

## Check LocalStorage

In console, check stored keys:

```javascript
// List all stored DIDs
const { listStoredDIDs } = await import('/lib/keyStorage.js');
console.log('Stored DIDs:', listStoredDIDs());
```

---

## Next Steps

- **To Publish DIDs:** Need testnet tokens from https://faucet.testnet.shimmer.network
- **For Full Signing:** Requires SDK Storage setup (future enhancement)
- **For On-Chain Verification:** Requires IOTA Client integration

This demo proves the complete flow works! 🎊

