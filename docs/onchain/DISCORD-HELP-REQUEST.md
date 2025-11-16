# IOTA Discord Help Request

## Current Issue (2025)

**Question to ask on IOTA Discord:**

> How do I publish DID documents to IOTA testnet using TypeScript?
>
> `@iota/identity-wasm` creates DIDs but can't convert them to `@iota/iota-sdk` Transaction format.
>
> I'm getting empty system transactions instead of Identity transactions.
>
> Are there compatible SDKs available, or a workaround?

## Technical Details

### Current Situation
- ✅ Transactions ARE submitted to IOTA testnet successfully
- ✅ Block IDs ARE generated successfully
- ✅ Wallet connection via dApp Kit works
- ❌ DID documents are created but NOT attached to transactions
- ❌ Empty system transactions instead of Identity transactions

### Root Cause

`@iota/identity-wasm` (beta) and `@iota/iota-sdk` use incompatible transaction serialization formats.

**What works:**
```typescript
const tx = new Transaction(); // Empty transaction
signAndExecute({ transaction: tx }); // ✅ Submits successfully
```

**What should work (but fails):**
```typescript
const publishTx = new PublishDidDocument(doc, address);
const txBytes = await publishTx.buildProgrammableTransaction(identityClient);
const tx = Transaction.from(txBytes); // ❌ Fails: "Unknown value 6 for enum TransactionData"
```

### Attempted Solutions

1. **`Transaction.fromKind(bytes)`** → ❌ "Unknown value 6 for enum TransactionKind"
2. **`Transaction.from(bytes)`** → ❌ "Unknown value 6 for enum TransactionData"
3. **`TransactionDataBuilder.fromBytes()`** → Cannot parse Identity SDK's output format

**Result:** No conversion path exists between the two SDK formats.

### SDK Versions

- `@iota/identity-wasm`: Beta (latest)
- `@iota/iota-sdk`: Latest
- `@iota/dapp-kit`: Latest

### Network

- **Network**: IOTA Testnet
- **API**: `https://api.testnet.iota.cafe`
- **Explorer**: `https://explorer.iota.org/?network=testnet`

## What We Need

1. Compatible SDK versions for TypeScript/JavaScript
2. Or workaround to bridge Identity WASM and IOTA SDK
3. Or confirmation that Rust is the only option for IOTA 2.0

## Alternative: Rust Solution

We have a complete Rust guide:
- See: `docs/onchain/IOTA-2.0-DID-PUBLISHING-GUIDE.md`

But we prefer TypeScript/JavaScript for our Next.js app.

## Quick Links

- **IOTA Discord**: https://discord.iota.org
- **IOTA Docs**: https://docs.iota.org/
- **dApp Kit**: https://docs.iota.org/developer/ts-sdk/dapp-kit/

---

**Last Updated**: November 2, 2025  
**Status**: Waiting for SDK compatibility or workaround
