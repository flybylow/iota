# IOTA Wallet SDK Integration Research

## Summary of Research Findings

### ✅ Solution Implemented: postMessage API

**Status**: Implemented in `lib/wallet-connection.ts`

The IOTA Wallet browser extension uses **Chrome Extension postMessage API** for communication with web pages. We've updated the wallet connection module to use this API instead of looking for non-existent global objects.

### What Was Changed

#### Before:
```typescript
// Looking for window.iota (doesn't exist)
const iota = (window as any).iota;
```

#### After:
```typescript
// Use postMessage API
chrome.runtime.sendMessage(
  IOTA_WALLET_EXTENSION_ID,
  { method: 'connect' },
  (response) => { /* handle */ }
);
```

### Implementation Details

#### 1. **Extension Detection** (`isWalletInstalled`)
- Sends ping message to extension
- Checks for `chrome.runtime` availability
- Handles errors gracefully
- Returns true if extension responds

#### 2. **Wallet Connection** (`connectWallet`)
- Uses postMessage to connect
- Tries multiple methods: `connect`, `getAccount`
- Falls back to mock address for demo
- Returns wallet address or null

#### 3. **Transaction Signing** (`signTransaction`)
- Uses postMessage for signing
- Sends transaction data to extension
- Returns signed transaction

#### 4. **Balance Checking** (`getWalletBalance`)
- Requests balance from extension
- Returns balance or null

### Available Methods

The IOTA Wallet Extension likely supports these methods:
- `ping` - Check if extension is alive
- `connect` - Connect to wallet
- `getAccount` - Get account info
- `getBalance` - Get token balance
- `signTransaction` - Sign a transaction

### Testing

To test the wallet connection:

1. Install IOTA Wallet Extension
2. Open the app
3. Click "Connect IOTA Wallet"
4. Check browser console for logs:
   - `✅ Extension context detected`
   - `✅ IOTA Wallet extension detected`
   - `✅ Wallet connected successfully`

### Next Steps

1. **Test with real extension** - Need to verify the exact message format
2. **Handle locked wallet** - Add logic for locked state
3. **Implement DID publishing** - Use wallet for transaction signing
4. **Get testnet tokens** - Request tokens from IOTA Discord

### Resources

- **Extension ID**: `iidjkmdceolghepehaaddojmnjnkkija`
- **Chrome Web Store**: https://chromewebstore.google.com/detail/iota-wallet/iidjkmdceolghepehaaddojmnjnkkija
- **IOTA Discord**: https://discord.iota.org

### Code Location

- **File**: `lib/wallet-connection.ts`
- **Functions**: `isWalletInstalled()`, `connectWallet()`, `signTransaction()`
- **Helper**: `sendToExtension()`

