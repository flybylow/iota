# 🔗 On-Chain Publishing Steps

You have testnet coins! Here's how to enable **real blockchain publishing**.

---

## Current Status

✅ **What Works Now (Local):**
- DID creation (local documents)
- Credential issuance (W3C format)
- Credential verification (structural)
- Key storage (encrypted)

⏳ **What Needs Implementation (On-Chain):**
- Publishing DIDs to Shimmer testnet
- On-chain DID resolution
- Cryptographic signature verification

---

## 🛠️ What You Need to Implement

### **1. IOTA Client Integration**

The SDK v1.7 requires a proper IOTA Client to publish transactions. You need to:

#### Option A: Use @iota/sdk (Recommended)

Install the IOTA SDK:
```bash
npm install @iota/sdk
```

This provides the `Client` class needed for blockchain interactions.

#### Option B: Use iota.js (Alternative)

```bash
npm install @iota/iota.js
```

---

### **2. Update iotaIdentityReal.ts**

You need to add these functions:

#### **A. Create IOTA Client**

```typescript
// Add to iotaIdentityReal.ts
import { Client } from '@iota/sdk';

async function createClient() {
  const client = new Client({
    nodes: ['https://api.testnet.shimmer.network'],
  });
  
  return client;
}
```

#### **B. Get Wallet Address**

You need to manage your wallet that has the testnet coins:

```typescript
async function getWalletAddress() {
  // Option 1: Use environment variable
  const address = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
  
  // Option 2: Use MetaMask or wallet connection
  // Option 3: Use mnemonic/seed phrase
  
  return address;
}
```

#### **C. Publish DID to Blockchain**

Update the `createDID()` function:

```typescript
export async function createDID(): Promise<DIDCreationResult> {
  try {
    await initWasm();
    
    const { IotaDocument, AliasOutput } = Identity;
    
    // 1. Create DID document (local)
    const document = new IotaDocument('smr');
    const didString = document.id().toString();
    
    console.log('📝 DID created locally:', didString);
    
    // 2. Create IOTA Client
    const client = await createClient();
    
    // 3. Get your wallet address (with coins)
    const walletAddress = await getWalletAddress();
    
    if (!walletAddress) {
      console.warn('⚠️  No wallet address - skipping blockchain publishing');
      return {
        did: didString,
        document: document,
        needsPublishing: true,
      };
    }
    
    // 4. Create Alias Output (DID Document container)
    const aliasOutput = await client.buildAliasOutput({
      aliasId: '0x0000000000000000000000000000000000000000000000000000000000000000',
      stateController: walletAddress,
      governor: walletAddress,
      stateMetadata: document.pack(),
    });
    
    // 5. Build and submit transaction
    const blockId = await client.buildAndPostBlock({
      outputs: [aliasOutput],
    });
    
    console.log('✅ DID published to blockchain!');
    console.log('Block ID:', blockId);
    console.log('Explorer:', `https://explorer.shimmer.network/testnet/block/${blockId}`);
    
    // Save private key
    const privateKey = new Uint8Array(32);
    crypto.getRandomValues(privateKey);
    await savePrivateKey(didString, privateKey);
    
    return {
      did: didString,
      document: document,
      blockId: blockId,
      needsPublishing: false,
      published: true,
      explorerUrl: `https://explorer.shimmer.network/testnet/block/${blockId}`,
    };
    
  } catch (error) {
    console.error('❌ Error publishing DID:', error);
    throw error;
  }
}
```

---

### **3. Environment Variables**

Create `.env.local`:

```bash
# Your wallet address with testnet coins
NEXT_PUBLIC_WALLET_ADDRESS=smr1qp...

# Or use mnemonic (KEEP SECRET!)
WALLET_MNEMONIC="your twelve word mnemonic phrase here"

# Network
NEXT_PUBLIC_IOTA_API_ENDPOINT=https://api.testnet.shimmer.network
NEXT_PUBLIC_NETWORK=testnet
```

---

### **4. Wallet Integration Options**

Choose one:

#### **Option A: Direct Address (Simplest for Testing)**
```typescript
// Just use your address directly
const address = 'smr1qp...your-address...';
```

#### **Option B: Mnemonic/Seed Phrase**
```typescript
import { Wallet } from '@iota/sdk';

const wallet = new Wallet({
  storagePath: './wallet-db',
});

await wallet.storeMnemonic(process.env.WALLET_MNEMONIC!);
const address = await wallet.generateEd25519Address();
```

#### **Option C: Browser Wallet (MetaMask/etc)**
```typescript
// Connect to user's wallet
const address = await connectWallet();
```

---

## 📝 **Step-by-Step Implementation**

### **Phase 1: Install SDK**
```bash
npm install @iota/sdk
```

### **Phase 2: Add Client Creation**
Update `iotaIdentityReal.ts`:
- Add `@iota/sdk` import
- Add `createClient()` function
- Add wallet address management

### **Phase 3: Update createDID()**
- Add Alias Output creation
- Add transaction building
- Add block posting
- Return explorer URL

### **Phase 4: Test**
```javascript
// In browser console
const { createDID } = await import('/lib/iotaIdentityReal.js');
const result = await createDID();
console.log('Published!', result.explorerUrl);
```

### **Phase 5: Update resolveDID()**
```typescript
export async function resolveDID(did: string) {
  const client = await createClient();
  
  // Resolve from blockchain
  const document = await client.resolveDid(did);
  
  return document;
}
```

---

## 🔧 **Quick Start (Minimal Implementation)**

Here's the absolute minimum to get publishing working:

### **1. Install SDK**
```bash
npm install @iota/sdk
```

### **2. Add to iotaIdentityReal.ts**

```typescript
import { Client } from '@iota/sdk';

// Add this after initWasm()
async function publishToBlockchain(document: any, walletAddress: string) {
  const client = new Client({
    nodes: ['https://api.testnet.shimmer.network'],
  });
  
  // Create alias output with DID document
  const output = {
    type: 4, // Alias Output
    amount: '50000', // Minimum amount
    aliasId: '0x0000000000000000000000000000000000000000000000000000000000000000',
    stateController: walletAddress,
    governor: walletAddress,
    stateIndex: 0,
    foundryCounter: 0,
    unlockConditions: [
      {
        type: 1, // State Controller
        address: {
          type: 0,
          pubKeyHash: walletAddress.replace('smr1', ''),
        },
      },
    ],
    features: [
      {
        type: 2, // Metadata
        data: document.pack(), // DID document
      },
    ],
  };
  
  const blockId = await client.buildAndPostBlock({
    outputs: [output],
  });
  
  return blockId;
}
```

---

## 🎯 **Testing Checklist**

Once implemented:

- [ ] Install `@iota/sdk`
- [ ] Add Client creation
- [ ] Add your wallet address to `.env.local`
- [ ] Update `createDID()` to publish
- [ ] Test: Create DID → Check explorer
- [ ] Update `resolveDID()` to query blockchain
- [ ] Test: Resolve DID → Should return document
- [ ] Update verification to check on-chain

---

## 🚨 **Important Notes**

### **Costs:**
- Each DID publish costs ~50,000 Glow (testnet tokens)
- You need enough tokens for gas fees
- Testnet is free, mainnet costs real money

### **Security:**
- Never commit private keys or mnemonics to git
- Use environment variables
- In production, use hardware wallets

### **Current Demo:**
- Works locally without blockchain
- Publishing requires additional SDK integration
- This is the next phase of implementation

---

## 📚 **Resources**

- IOTA SDK Docs: https://wiki.iota.org/shimmer/iota-sdk/getting-started/
- Identity Docs: https://wiki.iota.org/identity.rs/introduction/
- Explorer: https://explorer.shimmer.network/testnet
- Faucet: https://faucet.testnet.shimmer.network

---

## 💡 **Quick Decision**

**Do you want to:**

### **Option A: Keep Demo Mode**
- Current implementation works great for demos
- Shows all concepts without blockchain complexity
- Faster, simpler, no costs
- **Recommended for MVP/Demo**

### **Option B: Add Full Blockchain**
- Requires @iota/sdk integration (~2-4 hours work)
- Real DIDs on blockchain
- Real verification
- More complex but production-ready
- **Recommended for Production**

---

**Which do you prefer?** I can help implement Option B if you want real blockchain publishing! 🚀

