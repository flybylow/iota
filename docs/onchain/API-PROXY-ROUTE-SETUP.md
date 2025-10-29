# IOTA API Proxy Route Setup

## Problem

The IOTA SDK makes HTTP requests directly to `https://api.testnet.iotaledger.net/api/core/v2/blocks` (or similar endpoints), which causes CORS errors in the browser.

## Solution: Next.js API Route Proxy

We created Next.js API routes that proxy requests to the IOTA API, bypassing CORS restrictions.

## Route Structure

```
app/api/iota/
├── route.ts                    # Handles /api/iota (exact match)
└── [...path]/
    └── route.ts                # Handles /api/iota/* (catch-all)
```

## How It Works

1. **SDK Configuration** (`components/Providers.tsx`):
   - Sets testnet URL to `${window.location.origin}/api/iota`
   - SDK uses this as base URL for all requests

2. **Route Handling**:
   - **Root route** (`/api/iota/route.ts`): Handles POST to `/api/iota` → proxies to `/api/core/v2/blocks`
   - **Catch-all route** (`/api/iota/[...path]/route.ts`): Handles `/api/iota/*` → proxies to corresponding IOTA API paths

3. **Path Mapping**:
   - `POST /api/iota` → `POST https://api.testnet.iotaledger.net/api/core/v2/blocks`
   - `GET /api/iota/api/core/v2/info` → `GET https://api.testnet.iotaledger.net/api/core/v2/info`
   - Any other `/api/iota/*` → Forwarded to IOTA API with path preserved

## Current Status

**Issue**: Routes return 404 even though files exist and are correctly structured.

**Possible Causes**:
1. Dev server needs full restart (stop, clear `.next`, restart)
2. Next.js 15 route resolution might have changed
3. Catch-all route precedence vs exact route

## Route Files

### `/app/api/iota/route.ts`
- Handles exact `/api/iota` requests
- POST requests → `/api/core/v2/blocks`
- GET requests → `/api/core/v2/info`

### `/app/api/iota/[...path]/route.ts`
- Handles `/api/iota/*` requests with path segments
- Extracts path after `/api/iota` and forwards to IOTA API
- Handles empty path array (root requests) appropriately

## Debugging Steps

1. **Check route recognition**:
   ```bash
   curl -X POST http://localhost:3002/api/iota -H "Content-Type: application/json" -d '{"test":"data"}'
   ```

2. **Check server logs**:
   - Look for `[IOTA Proxy Root]` or `[IOTA Proxy]` console logs
   - If no logs appear, route isn't being hit

3. **Verify file structure**:
   ```bash
   ls -la app/api/iota/
   ls -la app/api/iota/\[...path\]/
   ```

4. **Clear cache and restart**:
   ```bash
   rm -rf .next
   npm run dev
   ```

## Next.js Route Precedence

In Next.js App Router:
- More specific routes should take precedence
- `/api/iota/route.ts` should match `/api/iota` before catch-all

However, catch-all routes `[...path]` might match empty paths differently in Next.js 15.

## Alternative Approaches

If routes continue to fail:

1. **Use middleware** to intercept and proxy requests
2. **Use Next.js rewrites** in `next.config.ts` (tried, but less control)
3. **Configure CORS on IOTA API** (not possible, we don't control it)
4. **Use server actions** instead of API routes

## Testing

Once working, verify:
- ✅ POST to `/api/iota` returns response from IOTA API
- ✅ Console shows proxy logs
- ✅ Transaction submission succeeds
- ✅ No CORS errors in browser

