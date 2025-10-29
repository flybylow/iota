# IOTA Explorer Link Formats

## API Documentation

Based on IOTA Explorer API specifications:

### URL Formats

**Transaction Block:**
```
https://explorer.iota.org/txblock/{transactionBlockId}?network=testnet
```

**Transaction Detail:**
```
https://explorer.iota.org/tx/{transactionId}?network=testnet
```

**Home:**
```
https://explorer.iota.org/testnet
https://explorer.iota.org/ (mainnet)
```

## Functions in Code

### 1. `getTransactionURL(blockId, network)`
```typescript
// Returns: https://explorer.iota.org/txblock/{blockId}?network=testnet
const url = getTransactionURL('0xabc123...', 'testnet');
```

### 2. `getTransactionDetailURL(txId, network)`
```typescript
// Returns: https://explorer.iota.org/tx/{txId}?network=testnet
const url = getTransactionDetailURL('0xdef456...', 'testnet');
```

### 3. `getExplorerHomeURL(network)`
```typescript
// Returns: https://explorer.iota.org/testnet
const url = getExplorerHomeURL('testnet');
```

### 4. `storeTransactionLink(blockId, network)`
```typescript
// Stores link in localStorage and returns it
const link = storeTransactionLink('0xabc123...', 'testnet');
// Stores: { blockId, link, network, timestamp }
```

### 5. `getStoredTransactionLinks()`
```typescript
// Retrieve all stored links
const links = getStoredTransactionLinks();
```

## Usage Examples

### When Publishing DID:
```typescript
import { storeTransactionLink } from '@/lib/iotaExplorer';

const result = await publishDID(...);
const link = storeTransactionLink(result.blockId, 'testnet');

console.log('View on explorer:', link);
// https://explorer.iota.org/txblock/0xabc...?network=testnet
```

### Getting Stored Links:
```typescript
import { getStoredTransactionLinks } from '@/lib/iotaExplorer';

const links = getStoredTransactionLinks();
// Returns: [{ blockId, link, network, timestamp }, ...]
```

## Verified Formats

✅ **Transaction Block**: `/txblock/{blockId}?network=testnet`  
✅ **Transaction**: `/tx/{txId}?network=testnet`  
✅ **Home**: `/testnet` or `/`  
✅ **Storage**: localStorage with timestamp  
✅ **Network param**: Required for testnet/mainnet

## Resources

- **IOTA Explorer**: https://explorer.iota.org/
- **Testnet Explorer**: https://explorer.iota.org/testnet
- **API Docs**: https://wiki.iota.org/

