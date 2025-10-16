# How This Demo Works

## Overview

This Digital Product Passport demo uses **mock data** to demonstrate the complete DID and Verifiable Credential workflow without requiring actual blockchain integration.

## Why Mock Data?

The IOTA Identity SDK (`@iota/identity-wasm`) has **fundamental compatibility issues with Next.js 15** due to webpack bundling of WebAssembly files. After extensive testing:

- ❌ Client-side WASM fails (`.wasm` binary not served correctly)
- ❌ Server-side WASM fails (`.wasm` file not bundled in build output)
- ✅ Mock data approach works perfectly for demonstrations

**See:** `test-real-iota-sdk` branch for complete WASM testing documentation

## Current Architecture: Mock Data Mode

### 1. DID Creation (`lib/iotaIdentity.ts`)

```typescript
export async function createDID(): Promise<DIDCreationResult> {
  // Generate random hex for DID address
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const address = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Create properly formatted DID (follows W3C standard)
  const did = `did:iota:smr:0x${address}`;
  
  return {
    did,
    document: { id: did },
    explorerUrl: 'https://wiki.iota.org/identity.rs/introduction/'
  };
}
```

**What it does:**
- ✅ Generates valid DID format (`did:iota:smr:0x...`)
- ✅ Returns instantly (no network calls)
- ❌ Not published to blockchain
- ❌ Not cryptographically signed

### 2. Credential Issuance

```typescript
export async function issueDPPCredential(
  issuerDID: string,
  subjectDID: string,
  productDID: string,
  credentialType: string,
  certificationData: any
): Promise<DPPCredential> {
  // Create credential as JSON object
  const credentialPayload = {
    issuer: issuerDID,
    subject: subjectDID,
    type: credentialType,
    data: certificationData,
    issuedAt: new Date().toISOString()
  };
  
  // Encode as JWT (Base64, not cryptographically signed)
  const jwt = btoa(JSON.stringify(credentialPayload));
  
  return {
    jwt,
    issuer: issuerName,
    issuerDID,
    subject: subjectDID,
    credentialType,
    issuedAt: new Date().toISOString(),
    certificationData
  };
}
```

**What it does:**
- ✅ Creates W3C Verifiable Credential structure
- ✅ Stores all credential data
- ✅ Enables credential chaining (references previous credentials)
- ❌ Not cryptographically signed (just Base64 encoded)
- ❌ Can't verify signature authenticity

### 3. Credential Verification

```typescript
export async function verifyCredential(jwt: string): Promise<VerificationResult> {
  try {
    // Decode JWT (just Base64 decode, no signature check)
    const decoded = JSON.parse(atob(jwt));
    
    // Check DID format is valid
    if (!decoded.issuer.match(/^did:iota:smr:0x[a-f0-9]{64}$/)) {
      return { isValid: false, error: 'Invalid DID format' };
    }
    
    // Check required fields exist
    if (!decoded.type || !decoded.data) {
      return { isValid: false, error: 'Missing required fields' };
    }
    
    return {
      isValid: true,
      issuer: decoded.issuer,
      credentialType: decoded.type,
      // ... other fields
    };
  } catch (err) {
    return { isValid: false, error: err.message };
  }
}
```

**What it does:**
- ✅ Validates DID format
- ✅ Checks credential structure
- ✅ Enables demo workflow to complete
- ❌ Doesn't check cryptographic signatures
- ❌ Can't verify issuer actually signed it

### 4. Local Storage for Demo Persistence

```typescript
// Save credential for next step in workflow
localStorage.setItem('farmer-credential', JSON.stringify(credential));

// Load for verification in factory step
const saved = localStorage.getItem('farmer-credential');
const credential = JSON.parse(saved);
```

**What it does:**
- ✅ Persists credentials between demo steps
- ✅ Enables credential chaining demo
- ✅ Resets on browser refresh
- ❌ Only exists in your browser
- ❌ Not on blockchain

## Industry-Specific Data (`data/industry-data.ts`)

Contains complete mock stakeholder and product data for 4 industries:

```typescript
export const industryData = {
  'food-beverage': {
    product: { /* Chocolate bar details */ },
    stakeholders: {
      farmer: { /* Maria's Cocoa Farm */ },
      factory: { /* Chocolate Dreams */ }
    },
    labels: { /* UI icons and text */ }
  },
  'battery': {
    product: { /* EV Battery specs */ },
    stakeholders: {
      miner: { /* Lithium Minerals */ },
      manufacturer: { /* EuroBatt */ }
    }
  },
  // ... fashion, electronics
}
```

All data is:
- ✅ Realistic and industry-appropriate
- ✅ Follows DPP best practices
- ✅ Includes proper certifications
- ❌ Completely fictional

## What This Demo CAN Do ✅

1. **Show Complete UX Flow**
   - Create identity → Issue credential → Verify chain
   - Demonstrates all user interactions
   - Proves the UI/UX works

2. **Demonstrate 4 Industries**
   - Food & Beverage (Chocolate)
   - Batteries (EV)
   - Fashion (Textiles)
   - Electronics (Smartphones)

3. **Credential Chaining**
   - Factory verifies farmer's credential
   - Consumer verifies entire chain
   - Shows dependencies between steps

4. **Professional Presentation**
   - Dark, modern UI
   - Mobile responsive
   - Instant performance (no network delays)

## What This Demo CANNOT Do ❌

1. **Blockchain Verification**
   - DIDs don't exist on IOTA Tangle
   - Can't independently verify via blockchain explorer
   - No cryptographic proof

2. **Real Security**
   - Credentials not cryptographically signed
   - Anyone could forge a credential
   - No private key protection

3. **Persistence**
   - Data only in browser localStorage
   - Clears on browser reset
   - Not shared between devices

## Use Cases

### ✅ Perfect For:
- **Client Demonstrations** - Show what DPP looks like
- **Conference Presentations** - Explain the concept
- **Sales Pitches** - Prove you understand the domain
- **UI/UX Testing** - Validate user workflows
- **Educational Tools** - Teach DID concepts

### ❌ Not Suitable For:
- **Production Applications** - Needs real blockchain
- **Security Audits** - No cryptographic verification
- **Compliance Demos** - Can't prove authenticity
- **Pilot Programs** - Needs actual ledger persistence

## Migration Path to Real Blockchain

When ready for production, you have 3 options:

### Option 1: Separate Backend Service (Recommended)

```
Architecture:
┌─────────────┐      API       ┌─────────────┐      IOTA      ┌─────────┐
│  Next.js    │────────────────▶│   Node.js   │───────────────▶│  Tangle │
│  Frontend   │  /api/did/...  │   Backend   │  WASM Works!  │         │
└─────────────┘                 └─────────────┘                 └─────────┘
```

**Steps:**
1. Create Express/Fastify backend
2. Use `@iota/identity-wasm/node` (works in pure Node.js)
3. Frontend calls backend API instead of direct WASM
4. Backend handles all blockchain operations

**Pros:**
- ✅ WASM works perfectly in Node.js
- ✅ Keep Next.js frontend
- ✅ Separation of concerns

**Cons:**
- Requires deploying 2 services
- More infrastructure complexity

### Option 2: Migrate to Vite/SvelteKit

Rebuild frontend with framework that has native WASM support.

**Pros:**
- ✅ Client-side WASM works
- ✅ Single deployment

**Cons:**
- Complete rewrite
- Lose Next.js ecosystem

### Option 3: Wait for Next.js WASM Fix

Monitor:
- Next.js WASM support improvements
- IOTA Identity SDK updates
- Community solutions

**Pros:**
- Keep current codebase
- Minimal changes when fixed

**Cons:**
- Unknown timeline
- May never be fixed

## Code Structure

```
lib/
  iotaIdentity.ts       - Mock DID/credential functions
  iotaExplorer.ts       - Explorer links (point to docs)

data/
  industry-data.ts      - All industry-specific mock data

components/
  FarmerOrigin.tsx      - Step 1: Issue origin credential
  FactoryProduction.tsx - Step 2: Verify + issue production
  ConsumerJourney.tsx   - Step 3: Verify complete chain

app/
  page.tsx              - Main demo page with industry selector
```

## Testing

To test the demo flow:

1. **Select Industry** - Choose from 4 options
2. **Create Origin** - Farmer/Miner/Supplier issues certificate
   - Credential saved to localStorage
3. **Factory Production** - Verifies origin, issues production cert
   - Auto-loads previous credential
   - Creates chained credential
4. **Consumer Verification** - Scans and verifies full chain
   - Shows complete journey
   - Displays all verified steps

All steps complete instantly with no network calls.

## Deployment

```bash
# Build static Next.js app
npm run build

# Deploy to Vercel/Netlify/etc
vercel deploy
```

No environment variables or external services required!

## Summary

This is a **high-fidelity prototype** that:
- ✅ Shows exactly what a DPP solution looks like
- ✅ Demonstrates the complete user experience
- ✅ Works perfectly for demonstrations
- ❌ Doesn't use actual blockchain (yet)

Perfect for validating the concept before investing in full blockchain integration.

