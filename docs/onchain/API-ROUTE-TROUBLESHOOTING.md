# API Route Troubleshooting - Deep Search Results

## Problem
POST requests to `/api/iota` return 404, even though route files exist and are correctly structured.

## Investigation Summary

### 1. Route Structure ✅
- `app/api/iota/route.ts` - Exists and exports POST handler
- `app/api/iota/[...path]/route.ts` - Exists and exports POST handler
- Both files use correct Next.js 15 syntax with async params

### 2. Next.js Route Precedence
According to Next.js App Router:
- **Exact routes** (`route.ts`) should match before catch-all (`[...path]/route.ts`)
- However, catch-all routes `[...path]` CAN match empty paths in some cases
- Route matching is determined by Next.js internal routing system

### 3. Key Findings from Web Search

**Next.js 15 API Route Requirements:**
- Files must be named `route.ts` or `route.js`
- Must be in `app/api` directory
- Must export named functions (GET, POST, etc.) not default export
- Route handlers receive `NextRequest` and return `NextResponse`

**Common Causes of 404:**
1. Dev server not restarted after route creation
2. Cached route handlers in `.next` directory
3. Route file syntax errors preventing compilation
4. Route precedence conflicts

### 4. SDK Request Construction

The IOTA dApp Kit SDK:
- Uses `createNetworkConfig({ testnet: { url: 'http://localhost:3002/api/iota' } })`
- SDK then makes requests to this base URL
- For transactions: `POST http://localhost:3002/api/iota`
- SDK may append paths: `GET http://localhost:3002/api/iota/api/core/v2/info`

### 5. Debugging Actions Taken

1. ✅ Added comprehensive logging to both routes
2. ✅ Verified file structure
3. ✅ Cleared `.next` cache
4. ✅ Created test route (`/api/test`) to verify Next.js recognizes routes
5. ✅ Checked for syntax errors
6. ✅ Added async params handling for Next.js 15

## Recommended Solution

### Option A: Use Only Catch-All Route (Simplest)

**Remove** `app/api/iota/route.ts` and handle everything in catch-all:

The catch-all route `[...path]` handles:
- `/api/iota` → path = `[]` (empty array)
- `/api/iota/something` → path = `['something']`
- `/api/iota/api/core/v2/blocks` → path = `['api', 'core', 'v2', 'blocks']`

This eliminates route precedence issues.

### Option B: Verify Route Compilation

Check Next.js build output to see if routes are registered:
```bash
npm run build 2>&1 | grep -i "route\|api\|iota"
```

### Option C: Test with Simple Route First

We created `/api/test/route.ts` to verify Next.js is recognizing routes at all.

If `/api/test` works but `/api/iota` doesn't, it suggests:
- Route naming conflict
- Directory structure issue
- Next.js caching problem

## Next Steps

1. **Test `/api/test` route** - If this works, routes are being recognized
2. **Remove root route** - Test with only catch-all route
3. **Check server logs** - Verify if route handlers are being called at all
4. **Full server restart** - Stop, clear cache, restart

## Files Created/Updated

1. `app/api/iota/route.ts` - Root route handler
2. `app/api/iota/[...path]/route.ts` - Catch-all route handler  
3. `app/api/test/route.ts` - Test route to verify Next.js routing
4. `docs/onchain/API-PROXY-ROUTE-SETUP.md` - Setup documentation
5. `docs/onchain/API-PROXY-SOLUTION.md` - Solution documentation
6. `docs/onchain/API-ROUTE-TROUBLESHOOTING.md` - This file

## Status

**Current**: Routes exist but return 404  
**Solution Applied**: 
1. ✅ Removed root route (`app/api/iota/route.ts`) to eliminate precedence conflicts
2. ✅ Enhanced catch-all route with comprehensive logging
3. ✅ Catch-all route now handles both root (`/api/iota`) and sub-paths

**Expected Behavior**:
- POST to `/api/iota` → Empty path array `[]` → Proxy to `/api/core/v2/blocks`
- All requests should hit catch-all route and show logs starting with `🔵 [IOTA Proxy]`

**If Still Not Working**:
- Check terminal/console for route handler logs - if none appear, Next.js isn't recognizing routes
- Verify dev server fully restarted: `rm -rf .next && npm run dev`
- Check for TypeScript/build errors preventing route compilation

