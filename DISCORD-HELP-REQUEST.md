# IOTA Discord Help Request

## Your Situation

You have a working Digital Product Passport app that needs to connect to your IOTA testnet wallet for blockchain publishing.

### Current Status
- ✅ App creates real DIDs with cryptographic keys
- ✅ UNTP-compliant credentials ready
- ✅ 20 IOTA testnet tokens in wallet
- ❌ Cannot connect from app to wallet extension
- ❌ Extension service worker shows "Inactief" (Inactive)

## Discord Message

**Channel:** #development or #help

**Subject:** Need help connecting IOTA Wallet extension to Next.js app

**Message:**

```
Hi IOTA community! 👋

I'm building a Digital Product Passport (DPP) app with IOTA Identity and need help connecting to the IOTA Wallet browser extension.

**What I have:**
- Working Next.js app with IOTA Identity SDK
- App creates DIDs with cryptographic keys
- 20 IOTA testnet tokens in wallet
- Wallet extension installed (ID: iidjkmdceolghepehaaddojmnjnkkija)

**Problem:**
When trying to connect from the app, I get "Could not establish connection. Receiving end does not exist." The extension service worker shows as inactive.

**What I need:**
1. How to connect the IOTA Wallet extension to a web app? (Currently using chrome.runtime.sendMessage)
2. What extension ID should I use? (Tried: iidjkmdceolghepehaaddojmnjnkkija)
3. How to publish DIDs to testnet with IOTA Identity SDK?
4. What methods/APIs does the wallet extension expose for DID publishing?

**Research findings:**
- Service worker inactive is a known issue that sometimes resolves with extension reload
- IOTA Identity SDK creates DIDs locally, but publishing requires wallet connection
- Need guidance on proper DID publishing flow for testnet

**Technical details:**
- Extension ID in code: iidjkmdceolghepehaaddojmnjnkkija
- Error: chrome.runtime.sendMessage() returns "Receiving end does not exist"
- Browser: Chrome
- Network: IOTA testnet
- Wallet version: 1.4.2

Thanks for any guidance! 🙏
```

## What They'll Need to Know

### 1. Your Extension Details
- **Extension ID:** `iidjkmdceolghepehaaddojmnjnkkija`
- **Version:** 1.4.2
- **Status:** Service worker inactive ("Inactief")

### 2. Your Current Setup
- App framework: Next.js 15
- IOTA SDK: `@iota/identity-wasm` v1.7.0-beta.1
- Network: IOTA testnet
- Tokens: 20 IOTA

### 3. The Error
```
Could not establish connection. Receiving end does not exist.
This happens when chrome.runtime.sendMessage() is called.
```

## Alternative Approach: Direct Extension Communication

The IOTA Wallet extension uses standard Chrome extension APIs. You're already using `chrome.runtime.sendMessage()` which is the correct approach. The issue is likely:

1. Extension service worker not active
2. Extension ID might be incorrect
3. Extension may not expose the API your code expects

**Current approach:**
```javascript
chrome.runtime.sendMessage(IOTA_WALLET_EXTENSION_ID, { method: 'ping' }, callback)
```

This is the standard way to communicate with Chrome extensions. The connection failure suggests the extension's service worker isn't responding.

## Quick Links

- **IOTA Discord:** https://discord.iota.org
- **Wallet docs:** https://docs.iota.org/users/iota-wallet/FAQ
- **IOTA Forum:** https://forum.iota.org/
- **IOTA Stack Exchange:** https://iota.stackexchange.com/
- **Wallet Standard:** https://docs.iota.org/developer/standards/wallet-standard

## Troubleshooting Steps to Try First

1. **Reload Extension**: Go to `chrome://extensions/`, find IOTA Wallet, click reload
2. **Clear Cache**: Clear browser cache and cookies
3. **Disable Conflicting Extensions**: Temporarily disable other extensions
4. **Restart Browser**: Fully close and restart Chrome
5. **Check Network**: Ensure wallet is set to testnet, not mainnet

## What Works Right Now

Even without wallet connection, your app:
- ✅ Creates real cryptographic DIDs
- ✅ Issues UNTP-compliant credentials
- ✅ Stores keys securely
- ✅ Shows blockchain-ready structure

You just need help connecting the wallet extension!

