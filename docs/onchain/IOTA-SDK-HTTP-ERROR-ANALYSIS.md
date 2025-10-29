# IOTA SDK HTTP Error Analysis

## Error Understanding

Based on [IOTA SDK Documentation](https://docs.iota.org/developer/ts-sdk/api/client/classes/IotaHTTPStatusError):

### Error Class: `IotaHTTPStatusError`
- **Extends**: `IotaHTTPTransportError`
- **Properties**: 
  - `status`: number (HTTP status code)
  - `statusText`: string (HTTP status text)
- **Thrown when**: HTTP request returns unexpected status code

### Error Flow
```
signAndExecuteTransaction()
  → executeTransactionBlock() (IotaClient)
    → transport.request() (IotaHTTPTransport)
      → HTTP POST to configured URL
        → If 404: throws IotaHTTPStatusError
```

## Current Error

```
IotaHTTPStatusError: Unexpected status code: 404
    at IotaHTTPTransport.request (http-transport.js:56:13)
    at async IotaClient.executeTransactionBlock (client.js:268:20)
```

**What This Means**:
1. `IotaClient.executeTransactionBlock` is called
2. It makes HTTP POST via `IotaHTTPTransport`
3. The request goes to `${window.location.origin}/api/iota` (our proxy)
4. Next.js returns 404, meaning our route handler isn't being matched

## Root Cause

**The route handler is not being recognized by Next.js**

Even though:
- ✅ Route file exists: `app/api/iota/[...path]/route.ts`
- ✅ Exports POST handler correctly
- ✅ Uses Next.js 15 async params syntax
- ✅ Handles empty path arrays

Next.js is still returning 404, indicating the route isn't compiled or matched.

## Solution Status

### Applied Fixes
1. ✅ Removed root route (`app/api/iota/route.ts`) to eliminate precedence conflicts
2. ✅ Enhanced catch-all route with comprehensive logging
3. ✅ Added explicit empty path handling

### Expected Behavior

When SDK makes POST to `/api/iota`:
```
Path array: [] (empty)
→ Handler detects isEmptyPath = true
→ Maps to /api/core/v2/blocks
→ Proxies to https://api.testnet.iotaledger.net/api/core/v2/blocks
```

### Verification Steps

**1. Check if route handler is called:**
Look for these logs in terminal (NOT browser console):
```
🔵 [IOTA Proxy] ========================================
   ROUTE HANDLER CALLED
   Method: POST
   Pathname: /api/iota
```

**2. If NO logs appear:**
- Next.js isn't recognizing the route
- **Action**: Full dev server restart required:
  ```bash
  # Stop server (Ctrl+C)
  rm -rf .next
  npm run dev
  ```

**3. If logs appear but 404 persists:**
- Route handler is working
- Issue is in forwarding/proxy logic
- Check logs for actual target URL being fetched

## IOTA SDK URL Construction

According to dApp Kit documentation:
- `createNetworkConfig({ testnet: { url: 'http://localhost:3002/api/iota' } })`
- SDK uses this as **base URL** for all RPC calls
- `executeTransactionBlock` POSTs directly to this base URL
- Our proxy must handle: `POST /api/iota`

## Current Route Handler

**File**: `app/api/iota/[...path]/route.ts`

**Handles**:
- Empty path `[]` → `/api/core/v2/blocks` (POST)
- Sub-paths → Forwarded as-is

**Next Steps**:
1. **Restart dev server completely**
2. **Test transaction submission**
3. **Check terminal for route handler logs**
4. **If logs appear**: Route is working, investigate proxy forwarding
5. **If no logs**: Next.js route recognition issue, try alternative approaches

## Alternative Solutions (If Route Still Fails)

### Option 1: Next.js Middleware
Create `middleware.ts` at root to intercept and proxy requests

### Option 2: Re-enable Root Route
Some Next.js versions prefer explicit routes over catch-all

### Option 3: Different Path Structure
Use `/api/iota-proxy` to avoid potential conflicts

