# Developer Onboarding Guide

**Welcome to the IOTA Supply Chain Verification System!**

This guide will get you up and running as a developer in minutes.

---

## 🎯 What This Project Is

A **blockchain-enabled supply chain verification system** that creates Digital Product Passports (DPP) using:
- **IOTA** - For blockchain infrastructure and DIDs
- **UNTP** - UN/CEFACT standard for global trade interoperability
- **Next.js** - Modern web application
- **TypeScript** - Type-safe development

### What It Does

Creates verifiable certificates for supply chain products:
1. **Farmer/Origin** - Issues origin certification with IOTA DID
2. **Factory/Production** - Issues production certification (chains with origin)
3. **Consumer** - Verifies the complete supply chain

All certificates use **IOTA Identity** with **UNTP compliance** (EU DPP standard).

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
```bash
Node.js 18+ installed
A web browser
Basic TypeScript knowledge
```

### Installation
```bash
# Clone/navigate to project
cd iota

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# http://localhost:3000
```

### First Run
1. Browser opens at `http://localhost:3000`
2. Click "Connect Wallet" (or continue in Demo mode)
3. Create a certificate - watch it work!

---

## 📁 Project Structure

```
iota/
├── components/           # React components
│   ├── FarmerOrigin.tsx        # Origin certification (UNTP ✅)
│   ├── FactoryProduction.tsx   # Production certification (UNTP ✅)
│   ├── ConsumerJourney.tsx     # Consumer verification (UNTP ✅)
│   └── ModeToggle.tsx          # Blockchain/Demo toggle
│
├── lib/                 # Core logic
│   ├── iotaIdentityReal.ts     # IOTA Identity SDK (real DIDs)
│   ├── iotaExplorer.ts         # Blockchain explorer links
│   ├── publishDID.ts           # DID publishing logic
│   └── schemas/
│       └── untp/               # UNTP schema implementation
│           ├── contexts.ts     # UNTP context URLs
│           └── dpp-builder.ts # UNTP credential builder
│
├── data/                # Supply chain data
│   ├── stakeholders.ts         # DID identities
│   ├── industry-data.ts       # Products & certifications
│   └── chocolate-product.ts   # Product info
│
└── docs/                # Documentation
    ├── STATUS.md              # Current status
    ├── CHANGELOG.md           # Recent changes
    └── DEVELOPER-ONBOARDING.md # This file!
```

---

## 🏗️ Architecture Overview

### Technology Stack

**Frontend:**
- Next.js 15 (React 19)
- TypeScript
- Tailwind CSS
- Framer Motion

**Blockchain:**
- IOTA Identity SDK (`@iota/identity-wasm`)
- IOTA dApp Kit (`@iota/dapp-kit`)
- IOTA SDK (`@iota/iota-sdk`)

**Standards:**
- UNTP (UN/CEFACT DPP)
- W3C Verifiable Credentials
- IOTA DID

### Key Concepts

**1. IOTA DIDs**
```typescript
// Format: did:iota:0x<64-hex-chars>
const did = "did:iota:0xfarmermaria001234567890...";

// Created with IOTA Identity SDK
const doc = new IotaDocument('iota');
const did = doc.id().toString();
```

**2. UNTP Credentials**
```typescript
const untpCredential = buildUNTPDPPCredential(
  issuerDID,
  productDID,
  {
    name: "Organic Cocoa",
    countryOfOrigin: "Ecuador",
    manufacturer: { name, did }
  },
  certificationData
);
```

**3. Credential Chaining**
```
Farmer Certificate
    ↓ (product DID passed to factory)
Factory Certificate (uses same product DID)
    ↓
Consumer Verification (sees full chain)
```

---

## 💻 Development Guide

### How Certificate Creation Works

#### 1. Farmer Issues Certificate
```typescript
// In FarmerOrigin.tsx
const credential = await issueCredential(
  farmerDID,
  productDID,
  {
    type: 'origin',
    certificationData: {
      origin: { country, region, farm },
      harvestDate,
      batchWeight,
      cocoaVariety
    },
    untpCredential: buildUNTPDPPCredential(...) // UNTP structure
  }
);
```

#### 2. Factory Issues Certificate
```typescript
// In FactoryProduction.tsx
const credential = await issueCredential(
  factoryDID,
  productDID, // Same product DID from farmer!
  {
    type: 'production',
    certificationData: productionData,
    untpCredential: buildUNTPDPPCredential(...), // UNTP structure
    previousCredentials: [farmerCredential.jwt] // Chaining!
  }
);
```

#### 3. Consumer Verifies
```typescript
// In ConsumerJourney.tsx
const result = await verifyCredential(credential.jwt);
if (result.isValid) {
  // Display UNTP fields
  // Show supply chain journey
}
```

### Key Functions to Know

**IOTA Identity:**
- `createDID()` - Creates IOTA DID
- `issueCredential()` - Issues verifiable credential
- `verifyCredential()` - Verifies credential

**UNTP:**
- `buildUNTPDPPCredential()` - Builds UNTP structure
- `getUNTPContext()` - Gets UNTP context URLs
- `getUNTPTypes()` - Gets UNTP type definitions

**Explorer:**
- `getTransactionURL()` - Get explorer link
- `storeTransactionLink()` - Store link
- `getBlockExplorerURL()` - Format for blocks

---

## 🔧 Configuration

### Network (lib/config.ts)
```typescript
IOTA_CONFIG = {
  apiEndpoint: 'https://api.testnet.iotaledger.net',
  network: 'testnet',
  explorerUrl: 'https://explorer.iota.org/testnet'
}
```

**To switch to mainnet:**
```typescript
network: 'mainnet'
apiEndpoint: 'https://api.iota.org' // Or mainnet URL
```

### Mode Toggle (lib/dppMode.ts)
```typescript
// Toggle between blockchain and demo
isBlockchainMode() → true/false

// Set mode
localStorage.setItem('dpp-mode', 'blockchain');
```

---

## 📊 Current Implementation Status

### ✅ What Works

**Certificates:**
- ✅ Create origin certificates
- ✅ Create production certificates  
- ✅ Verify credentials
- ✅ Display supply chain journey
- ✅ UNTP compliance

**IOTA:**
- ✅ DID creation (IOTA format)
- ✅ Wallet connection
- ✅ IOTA Identity SDK
- ✅ Cryptographic structure

**Cost:** $0.00 (local mode, no blockchain publishing)

### ⚠️ Important: Blockchain Publishing Status

**Current Reality (CORRECTED):**
- ❌ **NOT publishing** to blockchain yet
- ✅ DID creation works (local mode)
- ✅ Wallet connection works
- ✅ Transaction format needs proper IOTA SDK integration
- ✅ All infrastructure ready, just missing transaction builder

**What the Code Does:**
```typescript
// lib/publishDID.ts - Creates real IotaDocument
const doc = new IotaDocument('iota');
const didString = doc.id().toString();
const packedDoc = new TextEncoder().encode(docJson);
// Returns DID ready for blockchain (but not published yet)

// components/FarmerOrigin.tsx - Skips transaction submission
// Why: signAndExecute requires proper IOTA SDK transaction object
// Current: Just logs "DID ready" without submitting
```

**Why Not Publishing:**
- `signAndExecute()` expects proper IOTA SDK transaction object
- Needs `AliasOutput` from `@iota/iota-sdk`
- Transaction object must have `.toJSON()` method
- Current plain object causes "Cannot read properties of undefined (reading 'toJSON')" error

**How it works now:**
1. ✅ Creates DID with IOTA Identity SDK
2. ✅ Packs DID document for blockchain  
3. ⏸️ Skips transaction submission (avoids error)
4. ✅ Returns local success
5. ✅ Everything works perfectly for demo

**Cost:** $0.00 (local mode, no actual blockchain transactions)

**See:** `docs/knowledge/problems-solved/ERROR-TOJSON-FIX.md` for full details on the transaction error

---

## 🧪 Testing

### Manual Testing
```bash
# 1. Start app
npm run dev

# 2. Create Farmer Certificate
- Go to Farmer Origin
- Fill in form
- Click "Issue Origin Certificate"
- ✅ Credential created with UNTP structure

# 3. Create Factory Certificate
- Go to Factory Production
- Verify origin certificate
- Fill in form
- Click "Issue Production Certificate"
- ✅ Credential chains with origin

# 4. Consumer Verification
- Go to Consumer Journey
- Click "Simulate QR Scan & Verify"
- ✅ See UNTP fields displayed
- ✅ Complete supply chain visible
```

### Console Output
Look for:
```
🌍 Building UNTP-compliant credential
✅ UNTP credential structure created
✅ Credential created
✅ Credential verified
```

---

## 📝 Common Tasks

### Adding a New Certificate Type

1. **Create schema:**
```typescript
// lib/schemas/untp/dpp-builder.ts
export function buildMyNewCredential(
  issuerDID: string,
  data: MyData
): Record<string, unknown> {
  return {
    '@context': getUNTPContext('mytype'),
    type: getUNTPTypes('mytype'),
    // ... structure
  };
}
```

2. **Create component:**
```typescript
// components/MyComponent.tsx
import { buildMyNewCredential } from '@/lib/schemas/untp/dpp-builder';

// In issue function:
const untpCredential = buildMyNewCredential(issuerDID, data);
const credential = await issueCredential(issuerDID, productDID, {
  untpCredential,
  // ...
});
```

3. **Display in Consumer:**
```typescript
// components/ConsumerJourney.tsx
{step.credentialType === 'MyNewType' && (
  // Display fields
)}
```

### Switching to Real Blockchain Publishing

If you want to actually publish DIDs to blockchain:

1. **Get IOTA tokens:**
   - Testnet: https://faucet.testnet.iotaledger.net
   - Or IOTA Discord

2. **Integrate Client:**
```typescript
import { Client } from '@iota/sdk';

const client = await Client.create({
  nodes: ['https://api.testnet.iotaledger.net']
});

// Publish DID
await doc.publish(client);
```

3. **Update publish function:**
   - Modify `lib/publishDID.ts`
   - Use real transaction building
   - Sign with wallet
   - Submit to blockchain

---

## 🐛 Troubleshooting

### "Cannot read properties of undefined"
- Check if IOTA Identity WASM is initialized
- Look for `initWasm()` calls
- Refresh browser if needed

### "DID not found" or "Missing DID"
- DIDs come from `data/stakeholders.ts`
- Check file for proper format
- Should be `did:iota:0x...` (not `smr:`)

### "No private key found"
- Normal warning in local mode
- Credentials are unsigned (by design)
- No cryptographic signing happening
- This is expected

---

## 🎓 Learning Resources

### IOTA
- **IOTA Identity**: https://wiki.iota.org/identity.rs/
- **IOTA SDK**: https://wiki.iota.org/sdk/
- **dApp Kit**: https://docs.iota.org/developer/ts-sdk/dapp-kit/

### UNTP
- **UNTP Spec**: https://uncefact.github.io/spec-untp/
- **GitHub**: https://github.com/uncefact/spec-untp

### Next.js
- **Docs**: https://nextjs.org/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

## 📦 Key Files Reference

**Must Read:**
- `components/FarmerOrigin.tsx` - Certificate creation
- `lib/iotaIdentityReal.ts` - IOTA SDK usage
- `lib/schemas/untp/dpp-builder.ts` - UNTP structure
- `data/stakeholders.ts` - DID definitions

**Configuration:**
- `lib/config.ts` - Network settings
- `lib/dppMode.ts` - Demo/Blockchain toggle

**Documentation:**
- `docs/STATUS.md` - Current status
- `docs/CHANGELOG.md` - Recent changes
- `docs/untp/UNTP-INTEGRATION.md` - UNTP details

---

## 🚀 Next Steps

1. **Run the app** - `npm run dev`
2. **Create a certificate** - See the flow
3. **Check console** - Watch IOTA SDK in action
4. **Read the code** - Start with `components/FarmerOrigin.tsx`
5. **Make changes** - Experiment!

**You're ready to develop!** The project is working, documented, and ready for you to build on. 🎉

---

## 📞 Quick Reference

**Create Certificate:**
- File: `components/FarmerOrigin.tsx`
- Function: `issueOriginCertificate()`
- Returns: DPPCredential with UNTP structure

**Verify Certificate:**
- File: `lib/iotaIdentityReal.ts`
- Function: `verifyCredential()`
- Returns: VerificationResult

**Build UNTP Credential:**
- File: `lib/schemas/untp/dpp-builder.ts`
- Function: `buildUNTPDPPCredential()`
- Returns: UNTP-compliant structure

**Network Config:**
- File: `lib/config.ts`
- Set `network: 'testnet'` or `'mainnet'`
- Set `apiEndpoint` accordingly

---

**Questions?** Check `docs/` folder for detailed guides!

**Happy Coding!** 🚀

