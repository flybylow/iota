# 🚀 Milestone 2: Blockchain Integration Plan

**Current Status:** Phase 1 Complete ✅  
**Next Milestone:** Full Blockchain Publishing  
**Estimated Time:** 4-8 hours  
**Current Date:** January 2025

---

## ✅ What We Have (Phase 1 - COMPLETE)

- ✅ All integration tests passing
- ✅ WASM initialization working
- ✅ Local DID creation
- ✅ Credential issuance & verification
- ✅ IOTA testnet configuration
- ✅ 20 IOTA testnet tokens available
- ✅ Mode toggle (Demo/Blockchain)
- ✅ Encrypted key storage

**Status:** All local operations working perfectly. Ready for blockchain publishing.

---

## 🎯 Milestone 2 Goal

**Enable full blockchain publishing** so DIDs are published to IOTA testnet.

---

## 📋 Implementation Plan

### **Step 1: Install Dependencies** (15 min)

```bash
# Install IOTA SDK for wallet integration
npm install @iota/sdk

# If needed, install additional identity SDK components
npm install @iota/identity-wasm-web
```

**Why:** Need SDK for wallet operations and transaction signing.

---

### **Step 2: Create Wallet Connection Module** (2-3 hours)

**New file:** `lib/wallet-connection.ts`

```typescript
/**
 * Wallet Connection Module
 * 
 * Handles connection to IOTA Wallet browser extension
 * Manages wallet operations for DID publishing
 */

// Detect wallet extension
export async function isWalletInstalled(): Promise<boolean> {
  // Check for IOTA wallet extension
  return typeof window !== 'undefined' && 
         typeof (window as any).iota !== 'undefined';
}

// Connect to wallet
export async function connectWallet(): Promise<string | null> {
  try {
    if (!await isWalletInstalled()) {
      throw new Error('IOTA Wallet extension not installed');
    }
    
    // Connect to extension
    const wallet = (window as any).iota?.wallet;
    
    if (!wallet) {
      throw new Error('Wallet not available');
    }
    
    // Get wallet address
    const accounts = await wallet.getAccounts();
    const address = accounts[0]?.receiveAddress;
    
    return address || null;
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    return null;
  }
}

// Sign transaction
export async function signTransaction(transaction: any): Promise<string> {
  const wallet = (window as any).iota?.wallet;
  if (!wallet) throw new Error('Wallet not connected');
  
  // Sign transaction
  const signed = await wallet.sign(transaction);
  return signed;
}
```

**Purpose:** Bridge between app and IOTA Wallet extension.

---

### **Step 3: Implement Blockchain Publishing** (2-3 hours)

**Update:** `lib/didPublishing.ts`

```typescript
import { connectWallet, signTransaction } from './wallet-connection';
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
    
    // 4. Calculate storage deposit
    const minimumStorageDeposit = client.getMinimumStorageDeposit(aliasOutput);
    
    // 5. Create and sign transaction
    const transaction = await client.createTransaction({
      output: aliasOutput,
      // Add inputs from wallet
    });
    
    // 6. Submit to network
    const transactionId = await client.postTransaction(transaction);
    
    // 7. Wait for confirmation
    await client.getTransactionId(transactionId);
    
    return { 
      published: true, 
      transactionId 
    };
    
  } catch (error) {
    console.error('Publishing failed:', error);
    return { 
      published: false, 
      error: error.message 
    };
  }
}
```

**Purpose:** Implement actual blockchain publishing.

---

### **Step 4: Add Wallet Connection UI** (1-2 hours)

**Update:** `components/ModeToggle.tsx`

Add wallet connection status:

```typescript
const [walletConnected, setWalletConnected] = useState(false);
const [walletAddress, setWalletAddress] = useState<string | null>(null);

// Add button to connect wallet
<button onClick={handleConnectWallet}>
  {walletConnected ? 'Connected' : 'Connect Wallet'}
</button>
```

**Purpose:** Let users connect their wallet.

---

### **Step 5: Test End-to-End** (1 hour)

**Test flow:**
1. Connect wallet
2. Create DID → should publish to chain
3. Check explorer → verify DID on chain
4. Issue credential → sign with on-chain DID
5. Verify credential → resolve from chain

**Expected result:** Full blockchain integration working.

---

## 📊 Success Criteria

✅ **Must Have:**
- [ ] Wallet connection working
- [ ] DIDs publish to IOTA testnet
- [ ] DIDs visible in explorer
- [ ] Can issue credentials with published DIDs
- [ ] Can verify credentials on-chain

✅ **Nice to Have:**
- [ ] Transaction status updates
- [ ] Error handling for failed transactions
- [ ] Storage deposit estimation
- [ ] Gas fee display

---

## 🔧 Alternative Implementation

If wallet integration is complex, consider **simplified approach:**

### **Option B: Use IOTA Identity Service**

Instead of direct wallet integration, use IOTA Identity Service:

```typescript
// Use IOTA Identity Service API
export async function publishDIDViaService(
  document: any,
  serviceEndpoint: string
): Promise<string> {
  const response = await fetch(`${serviceEndpoint}/dids`, {
    method: 'POST',
    body: JSON.stringify(document),
  });
  
  return response.json().then(data => data.transactionId);
}
```

**Benefits:**
- Easier to implement
- No wallet required
- Handles complexity

**Drawbacks:**
- Requires separate service
- Less decentralized

---

## 📝 Documentation Updates Needed

- [ ] Update `IMPLEMENTATION-STATUS.md` with Milestone 2
- [ ] Add wallet integration guide
- [ ] Update demo to show blockchain mode working
- [ ] Add troubleshooting section

---

## 🎯 Next Actions

### **Today (Quick Start):**
1. Install `@iota/sdk`
2. Create `lib/wallet-connection.ts` structure
3. Test wallet detection

### **This Week:**
4. Implement publishing logic
5. Add UI for wallet connection
6. Test end-to-end

### **Before Hackathon:**
7. Polish UI
8. Add error handling
9. Test thoroughly
10. Create demo script

---

## 💡 Hacking Tips

**For Hackathon, Consider:**
1. **Show working Demo Mode** (already done ✅)
2. **Explain architecture** - blockchain-ready code
3. **Demonstrate mode toggle** - shows both approaches
4. **Mention wallet integration** - "20% remaining, documented"
5. **Have plan ready** - can implement if time permits

**Key Message:**
> "Built blockchain-ready architecture with 80% complete. Local operations work perfectly. Remaining 20% is wallet integration for publishing - architecture is ready, just needs token operations."

---

## 📁 Files to Create/Modify

### **New Files:**
- `lib/wallet-connection.ts` - Wallet integration
- `MILESTONE-2-STATUS.md` - Progress tracking
- `docs/onchain/WALLET-INTEGRATION.md` - Guide

### **Files to Modify:**
- `lib/didPublishing.ts` - Add real publishing
- `lib/iotaIdentityReal.ts` - Update DID creation
- `components/ModeToggle.tsx` - Add wallet status
- `app/integration-test/page.tsx` - Add blockchain tests

---

## 🎉 Current Achievement

**You Have:**
- ✅ Working blockchain-ready app
- ✅ All tests passing
- ✅ Clear architecture
- ✅ Mode switching
- ✅ Testnet tokens available
- ✅ Foundation for full blockchain

**You're 80% There!**

The hardest parts (architecture, WASM, SDK integration) are done. What remains is wallet integration - a well-defined problem with clear solutions.

---

**Ready to implement?** Start with Step 1 (install SDK) and work through the plan.

**Want to demo as-is?** Your current state is impressive - all tests pass, architecture is sound, blockchain-ready.

**Status:** Ready for Milestone 2 implementation! 🚀

