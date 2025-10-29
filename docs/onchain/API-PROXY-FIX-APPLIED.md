# API Proxy Fix - Route Precedence Issue

## Problem
404 errors persist when SDK makes POST requests to `/api/iota`, even though route files exist.

## Root Cause
Next.js route precedence conflict between:
- Exact route: `app/api/iota/route.ts` 
- Catch-all route: `app/api/iota/[...path]/route.ts`

In Next.js 15, there can be conflicts when both routes exist, and one may prevent the other from matching.

## Solution Applied

### 1. Removed Root Route
**Deleted**: `app/api/iota/route.ts`

**Reason**: The catch-all route `[...path]` can handle both:
- Empty path array (`[]`) for `/api/iota`
- Path segments like `['api', 'core', 'v2', 'blocks']` for `/api/iota/api/core/v2/blocks`

### 2. Enhanced Catch-All Route
**Updated**: `app/api/iota/[...path]/route.ts`

**Improvements**:
- Comprehensive logging to verify route handler is called
- Better path detection and handling
- Explicit handling of empty path arrays (root requests)

## How It Works Now

```typescript
// Request: POST http://localhost:3002/api/iota
// Path array: [] (empty)
// Handler detects: isEmptyPath = true
// Maps to: /api/core/v2/blocks
// Proxies to: https://api.testnet.iotaledger.net/api/core/v2/blocks
```

## Debugging

### Check Terminal Logs
When SDK makes a request, you should see:

```
🔵 [IOTA Proxy] ========================================
   ROUTE HANDLER CALLED
   Method: POST
   Pathname: /api/iota
   Full URL: http://localhost:3002/api/iota
   Path array: []
   Path length: 0
   Query: 
========================================

[IOTA Proxy] isEmptyPath: true, isExactMatch: true
[IOTA Proxy] ✅ Root POST → /api/core/v2/blocks (transaction)
[IOTA Proxy] POST /api/iota -> https://api.testnet.iotaledger.net/api/core/v2/blocks
```

### If No Logs Appear
- Next.js isn't recognizing the route
- **Fix**: Full dev server restart required
  ```bash
  # Stop dev server (Ctrl+C)
  rm -rf .next
  npm run dev
  ```

### If 404 Persists
1. Verify route file exists: `ls -la app/api/iota/\[...path\]/route.ts`
2. Check for TypeScript errors: `npm run build`
3. Verify route exports: File must export `GET`, `POST`, etc. functions
4. Check Next.js version: Should be 15.x (we're using 15.5.5)

## Files Changed

1. **Deleted**: `app/api/iota/route.ts`
2. **Updated**: `app/api/iota/[...path]/route.ts` - Enhanced logging and path handling

## Testing

After restarting dev server, try submitting a transaction again. Check terminal for route handler logs to confirm the route is being called.

