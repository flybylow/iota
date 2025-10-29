# Understanding DIDs vs Blockchain Addresses

## The Issue

You're trying to look up a DID on the IOTA explorer, but getting:
```
Failed to extract transactions
Transactions could not be extracted on the following specified address: 
0xfarmermaria001234567890123456789012345678901234567890123456789
```

## Explanation

### DIDs are NOT Blockchain Addresses

**DID (Decentralized Identifier):**
- Format: `did:iota:0x1234567890...`
- Purpose: Identifier for digital credentials
- Example: `did:iota:0xfarmermaria0012345678901234567890123456789012345678901234567890`

**Blockchain Address:**
- Format: `iota1...` or `atoi1...` (Bech32)
- Purpose: For sending/receiving IOTA tokens
- Example: `iota1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq`

### The Difference

1. **DIDs** are identifiers used in verifiable credentials
2. **Addresses** are for blockchain transactions (sending/receiving tokens)
3. DIDs can be published on the blockchain but have different formats
4. You can't look up a DID like a blockchain address

## Current Status

### What We Have:
- ✅ DIDs in the stakeholder data (`data/stakeholders.ts`)
- ✅ DIDs created with IOTA Identity SDK
- ✅ Proper cryptographic structure

### What's Missing:
- ❌ DIDs are NOT actually published to blockchain yet
- ❌ No blockchain transaction ID associated with DIDs
- ❌ DIDs exist only as local identifiers

## How DIDs Work

### DID Document Location

When a DID is published to IOTA blockchain:
1. The DID document is stored in an **Alias Output**
2. You need the **block ID** where the alias was published
3. Look up the **block ID** on explorer, not the DID itself

### Example Flow

```
1. Create DID: did:iota:0x123...
2. Publish to blockchain → Returns Block ID: 0xabc...
3. Look up on explorer using Block ID (not DID)
4. Explorer shows the DID document stored in that block
```

## Current Implementation

Our implementation creates DIDs but doesn't yet publish them:

```typescript
// Creates DID with proper structure
const did = "did:iota:0x123...";

// But doesn't actually publish to blockchain
// Blockchain submission requires:
// 1. Build Alias Output transaction
// 2. Sign transaction with wallet
// 3. Submit to IOTA network
// 4. Get block ID back
```

## To Find a DID on Explorer

If a DID was properly published, you would:

1. **Look up the block ID** (not the DID)
   ```
   https://explorer.iota.org/txblock/0xABC123...
   ```

2. **Inspect the Alias Output**
   - The DID document is stored in the Alias Output's state metadata
   - Shows the DID document structure

3. **Can't just search for the DID string**
   - The explorer doesn't index DIDs
   - Must use block/transaction IDs

## Summary

- ✅ DIDs created with proper format
- ❌ DIDs not yet published to blockchain
- ✅ Ready for blockchain submission when needed
- ❌ Can't look up DIDs like blockchain addresses

## Next Steps

To make DIDs findable on the explorer:
1. Implement actual blockchain publishing
2. Store the block ID when publishing
3. Use block ID to look up DID on explorer
4. Show DID document from blockchain data

---

**Bottom Line:** DIDs and blockchain addresses are different things. Our DIDs exist as cryptographic identifiers but aren't published to the blockchain yet, so they can't be found on the explorer.

