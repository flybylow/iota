# Blockchain Completion Plan

## Current Status: Wallet Lock Issue + Next Steps

### ✅ What's Working Now
- **IOTA Identity SDK**: Fully integrated, WASM working
- **DID Creation**: Creating real IOTA DIDs locally
- **Credential Issuance**: Issuing Verifiable Credentials with proper structure
- **Credential Verification**: Structural validation working
- **Key Management**: Encrypted storage in localStorage
- **UI Integration**: Complete mode toggle and blockchain/demo switching

### ❌ What's Blocking
1. **Wallet Connection**: Cannot connect to IOTA Wallet extension
2. **On-Chain Publishing**: Need wallet to pay storage deposit
3. **Transaction Signing**: Requires wallet signature
4. **Full Cryptographic Verification**: Needs on-chain DID resolution

---

## The Problem: Why Wallet Connection Fails

### Current Implementation Issues

#### 1. **IOTA Wallet Extension API Detection**
```typescript
// lib/wallet-connection.ts
export async function isWalletInstalled(): Promise<boolean> {
  // Current approach checks:
  // - window.iota
  // - window.iotaWallet
  // - chrome.runtime
  // - browser.runtime
  
  // PROBLEM: IOTA Wallet uses postMessage API, not window object
}
```

**Issue**: The IOTA Wallet browser extension doesn't expose a standard `window.iota` object. It uses the **postMessage API** to communicate with web pages.

### 2. **How IOTA Wallet Actually Works**

The IOTA Wallet Extension:
1. Runs in isolated context (content script)
2. Uses `postMessage` for communication
3. Requires the dApp to send messages requesting connection
4. Returns wallet data via message events

#### Correct IOTA Wallet Integration Pattern:

```typescript
// Correct approach for IOTA Wallet Extension
async function connectIOTAWallet() {
  // Step 1: Check if extension is installed
  if (!window.chrome?.runtime) {
    throw new Error('IOTA Wallet extension not found');
  }
  
  // Step 2: Send message to extension
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      'iidjkmdceolghepehaaddojmnjnkkija', // Extension ID
      { method: 'connect' },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      }
    );
  });
}
```

---

## Solution 1: IOTA Wallet SDK Integration

### Use `@iota/wallet` Package

Instead of trying to detect the extension manually, use the official SDK:

```bash
npm install @iota/wallet
```

Then implement proper wallet connection:

```typescript
// lib/iotaWalletIntegration.ts
import { Wallet } from '@iota/wallet';

export class IOTAWalletManager {
  private wallet: Wallet | null = null;
  
  async connect(): Promise<string> {
    if (!this.wallet) {
      // Initialize wallet with provider URL
      this.wallet = await Wallet.create({
        storage: 'storage',
        client: {
          nodes: ['https://api.testnet.iota.org'],
        },
      });
    }
    
    // Get account
    const account = await this.wallet.getAccount('Alice');
    
    // Get address
    const address = account.addresses()[0];
    return address.bech32Address();
  }
  
  async getBalance(address: string): Promise<number> {
    if (!this.wallet) throw new Error('Wallet not connected');
    
    const account = await this.wallet.getAccount('Alice');
    const balance = await account.balance();
    return balance.baseCoin.available;
  }
  
  async prepareTransaction(output: any) {
    if (!this.wallet) throw new Error('Wallet not connected');
    
    const account = await this.wallet.getAccount('Alice');
    
    // Prepare block for alias output
    const prepared = await account.prepareSend(
      output,
      /* recipient address and amount */
    );
    
    return prepared;
  }
}
```

### Steps:
1. Install `@iota/wallet` package
2. Create wallet manager class
3. Replace current `wallet-connection.ts` logic
4. Update UI to use new wallet manager

---

## Solution 2: Server-Side API (Alternative)

Since browser limitations exist with native modules, create a server API:

### Architecture:
```
Browser → Next.js API Route → IOTA Node → Blockchain
        (wallet signing)    (execution)
```

### Implementation:

#### 1. Create API Route: `app/api/iota/publish-did/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { Wallet } from '@iota/wallet';

// Server-side wallet instance
const wallet = await Wallet.create({
  storage: './wallet',
  client: { nodes: ['https://api.testnet.iota.org'] },
});

export async function POST(request: NextRequest) {
  try {
    const { didDocument, privateKey } = await request.json();
    
    // Get account
    const account = await wallet.getAccount('server');
    
    // Calculate storage deposit
    const aliasOutput = await account.prepareAliasOutput({
      aliasId: didDocument.id,
      stateMetadata: didDocument,
    });
    
    // Sign and submit
    const signed = await account.signTransaction(aliasOutput);
    const blockId = await wallet.submit(signed);
    
    return NextResponse.json({
      success: true,
      blockId,
      did: didDocument.id,
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

#### 2. Update Client: `lib/didPublishing.ts`

```typescript
export async function publishDIDToBlockchain(
  document: any,
  privateKey: Uint8Array
): Promise<{ published: boolean; transactionId?: string; error?: string }> {
  try {
    // Send to API route
    const response = await fetch('/api/iota/publish-did', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ didDocument: document, privateKey }),
    });
    
    const result = await response.json();
    
    if (result.success) {
      return {
        published: true,
        transactionId: result.blockId,
      };
    } else {
      return {
        published: false,
        error: result.error,
      };
    }
  } catch (error) {
    return {
      published: false,
      error: error.message,
    };
  }
}
```

---

## Solution 3: Use Firefly Wallet (Official)

Firefly is the official IOTA wallet with better developer tools:

### Integration Steps:

1. **User connects Firefly**
   - Open Firefly wallet
   - Authorize connection
   - Get public address

2. **Get Balance**
   - Check if user has testnet tokens
   - Show balance in UI
   - Prompt if insufficient funds

3. **Use Firefly API**
   ```typescript
   // Check if user has tokens
   const balance = await firefly.checkBalance(address);
   
   if (balance < requiredDeposit) {
     // Redirect to faucet or show error
     return { error: 'Insufficient tokens' };
   }
   ```

4. **Submit Transaction**
   - Create transaction payload
   - User signs in Firefly
   - Submit to network

---

## Recommended Approach: Hybrid Solution

### Phase 1: Immediate Fix (Use Mock for Demo)
```typescript
// lib/wallet-connection.ts
export async function connectWallet(): Promise<string | null> {
  // Return mock address for demo
  return 'iot1q...demo';
}
```

### Phase 2: SDK Integration (1-2 days)
1. Install `@iota/wallet`
2. Implement wallet manager
3. Test with funded account

### Phase 3: Full Publishing (3-5 days)
1. Create Alias Output
2. Sign transaction
3. Submit to network
4. Verify on-chain

### Phase 4: Production Hardening (1 week)
1. Error handling
2. Token management
3. Transaction retry logic
4. State persistence

---

## Immediate Next Steps

### For This Project (Right Now):

1. **Fix Wallet Connection**
   ```bash
   npm install @iota/wallet
   ```
   
2. **Update lib/wallet-connection.ts**
   - Remove manual detection
   - Use SDK wallet manager
   - Proper connection flow

3. **Get Testnet Tokens**
   - Use IOTA Discord (#developers or #help)
   - Ask: "Need testnet tokens for wallet ID: [your-address]"
   - Wait for verification

4. **Test Publishing**
   - Connect wallet
   - Create DID
   - Pay deposit
   - Submit transaction
   - Verify on explorer

---

## Success Criteria

### Minimum Viable Blockchain Publishing:
- ✅ Connect to wallet (Firefly or SDK)
- ✅ Check token balance
- ✅ Create Alias Output for DID
- ✅ Sign transaction
- ✅ Submit to network
- ✅ Get block ID
- ✅ Verify on explorer

### Full Production Ready:
- ✅ Handle all error cases
- ✅ Retry failed transactions
- ✅ Show transaction status
- ✅ Implement state management
- ✅ Handle wallet lock/unlock
- ✅ Support multiple networks

---

## Resources

### Official Documentation:
- **IOTA Identity**: https://wiki.iota.org/identity.rs/
- **IOTA Wallet SDK**: https://wiki.iota.org/smart-contracts/tools
- **Firefly**: https://firefly.iota.org/

### Community:
- **Discord**: https://discord.iota.org
- **Discord Dev Channel**: #developers, #help

### Test Pages:
- **IOTA Testnet Faucet**: https://faucet.testnet.iota.org (currently down)
- **Testnet Explorer**: https://explorer.iota.org/testnet

---

## Estimated Timeline

| Task | Time | Complexity |
|------|------|------------|
| Install and integrate SDK | 2 hours | Low |
| Implement wallet connection | 4 hours | Medium |
| Fix DID publishing | 6 hours | High |
| Get testnet tokens | 1-24 hours | Low (waiting) |
| End-to-end testing | 4 hours | Medium |
| Error handling & polish | 8 hours | Medium |
| **Total** | **25-49 hours** | **Medium-High** |

---

## Quick Start Command

Once SDK is installed:

```typescript
// lib/iotaWalletConnection.ts
import { Wallet } from '@iota/wallet';

export async function connectWallet(): Promise<{
  address: string;
  balance: number;
  connected: boolean;
}> {
  const wallet = await Wallet.create({
    storage: 'storage',
    client: { 
      nodes: ['https://api.testnet.iota.org'],
    },
  });
  
  const account = await wallet.getAccount('Alice');
  const address = account.addresses()[0];
  const balance = await account.balance();
  
  return {
    address: address.bech32Address(),
    balance: balance.baseCoin.available,
    connected: true,
  };
}
```

Then update `components/ModeToggle.tsx` to use the new connection.

---

**Status**: Ready to implement when you give the go-ahead! 🚀

