# IOTA dApp Kit Integration

## Solution from Discord

From Dr.Electron[IF] on IOTA Discord:
> The easiest way is to use the dApp kit. You don't need any extension ID or similar.
> https://docs.iota.org/developer/ts-sdk/dapp-kit/

## What Changed

### Old Approach (Broken)
- Used `chrome.runtime.sendMessage()` with extension ID
- Got error: "Could not establish connection. Receiving end does not exist"
- Required manual extension ID: `iidjkmdceolghepehaaddojmnjnkkija`

### New Approach (dApp Kit)
- Uses `@iota/dapp-kit` React components
- No extension ID needed
- Automatic wallet detection
- Standard Wallet Standard API
- Testable at: https://docs.iota.org/developer/ts-sdk/dapp-kit/wallet-components/ConnectButton

## Implementation Steps

1. ✅ Install `@iota/dapp-kit`
2. Replace custom wallet connection logic with dApp Kit components
3. Use `DAppKitProvider` to wrap the app
4. Use `<ConnectButton />` for wallet connection
5. Use hooks like `useAccount()` to interact with connected wallet

## Resources

- **Main docs**: https://docs.iota.org/developer/ts-sdk/dapp-kit/
- **ConnectButton**: https://docs.iota.org/developer/ts-sdk/dapp-kit/wallet-components/ConnectButton
- **Hooks**: https://docs.iota.org/developer/ts-sdk/dapp-kit/wallet-hooks/

## Package Info

- **Package**: `@iota/dapp-kit`
- **Version**: `0.5.3`
- **Published**: 2025-08-28
- **Type**: React components and hooks for IOTA wallet interaction

## Benefits

1. No manual extension IDs
2. Automatic wallet detection
3. Wallet Standard API compliance
4. React components for easy integration
5. Better error handling
6. Works with multiple IOTA wallets

