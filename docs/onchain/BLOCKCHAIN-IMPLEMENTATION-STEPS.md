# 🚀 Step-by-Step: Make Blockchain Functionality Work

**Current Status:** 80% Complete - All local operations working ✅  
**What's Left:** Wallet integration + blockchain publishing (~4-6 hours)

---

## 📋 Quick Overview

**What Works Now:**
- ✅ WASM initialization
- ✅ DID creation (locally)
- ✅ Credential issuance
- ✅ Credential verification
- ✅ Testnet tokens available (20 IOTA)
- ✅ All tests passing

**What Needs Work:**
- ⚠️ Wallet connection
- ⚠️ Blockchain publishing
- ⚠️ Transaction signing

---

## 🎯 Implementation Steps

### **STEP 1: Install Required Package** (5 min)

```bash
npm install @iota/sdk
```

**Why:** Need this SDK for wallet operations and blockchain publishing.

---

### **STEP 2: Create Wallet Connection Module** (1-2 hours)

Create new file: `lib/wallet-connection.ts`

```typescript
/**
 * Wallet Connection Module
 * Connects to IOTA Wallet browser extension
 */

export async function isWalletInstalled(): Promise<boolean> {
  return typeof window !== 'undefined' && 
         typeof (window as any).iota !== 'undefined';
}

export async function connectWallet(): Promise<string | null> {
  try {
    if (!await isWalletInstalled()) {
      throw new Error('IOTA Wallet extension not installed');
    }
    
    const wallet = (window as any).iota?.wallet;
    if (!wallet) {
      throw new Error('Wallet not available');
    }
    
    const accounts = await wallet.getAccounts();
    const address = accounts[0]?.receiveAddress;
    
    return address || null;
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    return null;
  }
}

export async function getWalletAddress(): Promise<string | null> {
  return await connectWallet();
}
```

---

### **STEP 3: Update DID Publishing** (2-3 hours)

Edit `lib/didPublishing.ts` to use wallet connection:

```typescript
import { connectWallet } from './wallet-connection';
import { Client } from '@iota/sdk';

export async function publishDIDToBlockchain(
  document: any,
  privateKey: Uint8Array
): Promise<{ published: boolean; transactionId?: string; error?: string }> {
  try {
    // 1. Connect to wallet
    const walletAddress = await connectWallet();
    if (!walletAddress) {
      return { published: false, error: 'Wallet not connected' };
    }
    
    console.log('✅ Wallet connected:', walletAddress);
    
    // 2. Initialize IOTA SDK client
    const client = new Client({
      nodes: ['https://api.testnet.iotaledger.net'],
      network: 'testnet',
    });
    
    // 3. Create DID alias output
    const aliasOutput = await client.buildAliasOutput({
      address: walletAddress,
      stateMetadata: JSON.stringify(document),
    });
    
    // 4. Sign and submit transaction
    const transaction = await client.signAndSubmitTransaction({
      output: aliasOutput,
      // Add inputs from wallet
    });
    
    console.log('✅ DID published to blockchain!');
    return { 
      published: true, 
      transactionId: transaction 
    };
    
  } catch (error) {
    console.error('❌ Publishing failed:', error);
    return { 
      published: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
```

---

### **STEP 4: Add Wallet Connection UI** (1 hour)

Update `components/ModeToggle.tsx` to show wallet status:

```typescript
const [walletConnected, setWalletConnected] = useState(false);

const handleConnectWallet = async () => {
  const address = await connectWallet();
  if (address) {
    setWalletConnected(true);
    console.log('Wallet connected:', address);
  }
};

// Add button in UI:
{!walletConnected && (
  <button onClick={handleConnectWallet}>
    Connect IOTA Wallet
  </button>
)}
```

---

### **STEP 5: Test End-to-End** (1 hour)

1. **Run the app:**
   ```bash
   npm run dev
   ```

2. **Visit:** `http://localhost:3000`

3. **Click "Connect Wallet"** button

4. **Switch to Blockchain Mode**

5. **Create a DID** - should publish to chain!

6. **Check explorer:** `https://explorer.iota.org/iota-testnet`

---

## 🔧 Alternative: Simplified Approach

If wallet integration is too complex, consider **server-side publishing:**

### **Option B: API Endpoint**

Create an API route: `app/api/publish-did/route.ts`

```typescript
import { Client } from '@iota/sdk';

export async function POST(request: Request) {
  const { document } = await request.json();
  
  const client = new Client({
    nodes: ['https://api.testnet.iotaledger.net'],
  });
  
  // Publish on server-side
  const transaction = await client.publishDID(document);
  
  return Response.json({ transactionId: transaction });
}
```

**Benefits:**
- Easier to implement
- Wallet on server only
- No browser extension needed

---

## 📝 Detailed Implementation

### **Getting Started (Today - 30 min)**

```bash
# 1. Install SDK
npm install @iota/sdk

# 2. Check your tokens
# Open IOTA Wallet extension
# Verify you have 20 IOTA at: 0xd175...b3c1

# 3. Test connection
# Try connecting to wallet in extension
```

### **Implement Core (This Week - 4 hours)**

```bash
# Create wallet connection file
touch lib/wallet-connection.ts

# Edit didPublishing.ts
code lib/didPublishing.ts

# Update ModeToggle component
code components/ModeToggle.tsx
```

### **Test & Debug (2 hours)**

```bash
# Run app
npm run dev

# Test steps:
# 1. Connect wallet
# 2. Create DID
# 3. Check if published
# 4. Verify in explorer
```

---

## 🎯 What Success Looks Like

**When It's Working:**
1. ✅ Click "Connect Wallet" → shows your address
2. ✅ Switch to Blockchain Mode
3. ✅ Create DID → publishes to IOTA testnet
4. ✅ See transaction ID
5. ✅ Click "View on Explorer" → shows on blockchain
6. ✅ Verify credentials work with on-chain DIDs

**You'll See:**
- Real DID on blockchain: `did:iota:testnet:0x...`
- Transaction ID: `0x...`
- Can verify in explorer
- All credentials cryptographically signed

---

## 🆘 Troubleshooting

### **"Wallet not connected"**
- Check IOTA Wallet extension installed
- Enable extension for this domain
- Refresh page

### **"Insufficient balance"**
- You have 20 IOTA ✅
- Check address: `0xd175...b3c1`
- Should be enough for testnet

### **"Transaction failed"**
- Check network: IOTA testnet
- Verify API endpoint
- Check console for errors

---

## 🚀 Quick Start Command

```bash
# 1. Install SDK
npm install @iota/sdk

# 2. Start implementing (follow steps above)

# 3. Test
npm run dev
```

---

## 📚 Resources

**Documentation:**
- Milestone Plan: `MILESTONE-2-BLOCKCHAIN-INTEGRATION.md`
- Implementation: `BLOCKCHAIN-STATUS-AND-PLAN.md`
- Current Status: `SUMMARY.md`

**SDK Docs:**
- IOTA SDK: https://wiki.iota.org/
- Identity SDK: https://wiki.iota.org/identity.rs/
- Wallet API: Check IOTA Wallet extension docs

---

## ✅ Checklist

### **Today (Setup):**
- [ ] Install `@iota/sdk`
- [ ] Verify wallet extension works
- [ ] Check token balance

### **This Week (Implementation):**
- [ ] Create `wallet-connection.ts`
- [ ] Update `didPublishing.ts`
- [ ] Add wallet UI
- [ ] Test DID publishing
- [ ] Verify in explorer

### **Final (Testing):**
- [ ] Test end-to-end flow
- [ ] Verify on blockchain
- [ ] Check all credentials work
- [ ] Demo to stakeholders

---

## 💡 Tips

1. **Start Simple:** Get wallet connection working first
2. **Test Incrementally:** Don't try everything at once
3. **Use Console:** Browser console is your friend
4. **Check Explorer:** Use IOTA explorer to verify
5. **Ask for Help:** IOTA Discord if stuck

---

## 🎉 You're Ready!

**You Have:**
- ✅ Working app (80% done)
- ✅ Testnet tokens
- ✅ Clear implementation plan
- ✅ All prerequisites met

**Next:** Follow these steps one by one, and you'll have blockchain publishing working!

---

**Start with Step 1:** `npm install @iota/sdk`

**Status:** Ready to implement! 🚀

