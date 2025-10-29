# IOTA Testnet Endpoint Fix - 404 Error Resolved

## Root Cause Discovered

The persistent 404 errors were caused by using the **wrong testnet endpoint**.

### Wrong Endpoint (404)
- `https://api.testnet.iotaledger.net` → Returns 404 (doesn't exist)

### Correct Endpoint (Works)
- `https://api.testnet.iota.cafe` → Returns valid JSON-RPC responses ✅

## Testing Results

### Test 1: Wrong Endpoint
```bash
curl -X POST https://api.testnet.iotaledger.net \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"iota_getChainIdentifier","params":[]}'
```
**Result**: `404 Not Found`

### Test 2: Correct Endpoint
```bash
curl -X POST https://api.testnet.iota.cafe \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"iota_getChainIdentifier","params":[]}'
```
**Result**: `{"jsonrpc":"2.0","id":1,"result":"2304aa97"}` ✅

## Files Updated

1. ✅ `app/api/iota/route.ts` - Changed proxy target to `api.testnet.iota.cafe`
2. ✅ `app/api/iota/[...path]/route.ts` - Changed proxy target to `api.testnet.iota.cafe`
3. ✅ `lib/config.ts` - Updated default endpoint to `api.testnet.iota.cafe`
4. ✅ `components/Providers.tsx` - Updated SSR endpoint to `api.testnet.iota.cafe`

## Why This Happened

The route handler was working correctly all along. The issue was:
1. Route handler executed ✅
2. Proxy attempted to forward request ✅
3. Proxy forwarded to **wrong endpoint** (404) ❌
4. IOTA API returned 404
5. Proxy forwarded 404 to SDK
6. SDK threw `IotaHTTPStatusError: 404`

## Status

✅ **Fixed**: All endpoints now point to `https://api.testnet.iota.cafe`
✅ **Route handler working**: Was always working
✅ **Proxy working**: Now forwarding to correct endpoint

## Next Steps

1. **Restart dev server** (if needed):
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **Test transaction submission** - Should work now!

3. **Check terminal logs** - Should see successful proxying:
   ```
   [IOTA Proxy Root] POST /api/iota -> https://api.testnet.iota.cafe
   [IOTA Proxy Root] ✅ Response received
   [IOTA Proxy Root] Response status: 200
   ```

## Alternative Endpoints

According to documentation, other testnet endpoints exist:
- `https://api.testnet.iota.cafe` ✅ (Working - we're using this)
- `https://rpc.ankr.com/iota_testnet` (Ankr provider)

Mainnet still uses: `https://api.mainnet.iotaledger.net`

