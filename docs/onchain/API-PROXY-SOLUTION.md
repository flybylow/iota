# IOTA API Proxy Solution - Complete Guide

## Problem Statement

The IOTA SDK makes HTTP requests to `https://api.testnet.iotaledger.net`, which causes CORS errors in the browser. We need to proxy these requests through Next.js API routes.

## Root Cause Analysis

### Issue 1: Next.js Route Recognition
- Routes exist at `app/api/iota/route.ts` and `app/api/iota/[...path]/route.ts`
- Requests to `/api/iota` return 404
- No console logs appear, suggesting routes aren't being recognized

### Issue 2: SDK Request Format
The IOTA SDK constructs URLs like:
- Base URL: `http://localhost:3002/api/iota` (from `window.location.origin + '/api/iota'`)
- SDK then makes: `POST http://localhost:3002/api/iota` (for transactions)
- SDK may also append paths: `GET http://localhost:3002/api/iota/api/core/v2/info`

### Issue 3: Route Precedence
In Next.js App Router:
- **Exact route** (`route.ts`) should take precedence over catch-all (`[...path]/route.ts`)
- However, catch-all routes might intercept requests before exact routes in some cases

## Verified Route Structure

```
app/api/iota/
├── route.ts                    ✅ Exists - Handles /api/iota exactly
└── [...path]/
    └── route.ts                ✅ Exists - Handles /api/iota/*
```

Both files are correctly structured with:
- Proper exports (`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`)
- Next.js 15 async params handling (`Promise<{ path: string[] }>`)
- Error handling and logging

## Debugging Steps Performed

1. ✅ Verified route files exist
2. ✅ Checked file naming (`route.ts`)
3. ✅ Verified directory structure (`app/api/iota/`)
4. ✅ Added comprehensive logging
5. ✅ Cleared `.next` cache
6. ✅ Checked for syntax errors

## Potential Solutions

### Solution 1: Use Only Catch-All Route (Recommended)

Remove the root route file and handle everything in the catch-all:

**Remove**: `app/api/iota/route.ts`

**Update**: `app/api/iota/[...path]/route.ts` to always handle root requests:
```typescript
// Check if path array is empty
const isEmptyPath = !path || path.length === 0;

if (isEmptyPath || requestUrl === '/api/iota' || requestUrl === '/api/iota/') {
  // Handle root request
  actualPath = request.method === 'POST' ? '/api/core/v2/blocks' : '/api/core/v2/info';
}
```

### Solution 2: Use Next.js Rewrites

Add rewrites in `next.config.ts`:
```typescript
async rewrites() {
  return [
    {
      source: '/api/iota/:path*',
      destination: 'https://api.testnet.iotaledger.net/:path*',
    },
    {
      source: '/api/iota',
      destination: 'https://api.testnet.iotaledger.net/api/core/v2/info',
    },
  ];
}
```

**Limitation**: Less control over request/response handling.

### Solution 3: Middleware Approach

Create `middleware.ts` at root:
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/iota')) {
    // Proxy logic here
    return NextResponse.rewrite(...);
  }
}
```

### Solution 4: Verify SDK URL Construction

Check how the SDK actually constructs URLs. The issue might be:
- SDK appends `/api/core/v2/blocks` to base URL → `/api/iota/api/core/v2/blocks`
- We need to handle both `/api/iota` AND `/api/iota/api/core/v2/blocks`

## Current Status

**Routes Created**: ✅
- `/app/api/iota/route.ts`
- `/app/api/iota/[...path]/route.ts`

**Routes Working**: ❌
- 404 errors persist
- No console logs appearing
- Routes not being recognized

**Next Steps**:
1. Try removing root route and using only catch-all
2. Verify dev server is fully restarted
3. Check Next.js version compatibility
4. Consider middleware approach if routes continue to fail

## Testing Checklist

- [ ] Dev server fully restarted (stopped + started)
- [ ] `.next` cache cleared
- [ ] Route files verified in filesystem
- [ ] Console logs appear in terminal (not browser)
- [ ] Test with `curl` to verify route exists
- [ ] Check Next.js build output for route registration

## Files Involved

1. `components/Providers.tsx` - Network config using proxy URL
2. `app/api/iota/route.ts` - Root route handler
3. `app/api/iota/[...path]/route.ts` - Catch-all route handler
4. `next.config.ts` - Next.js configuration (currently no rewrites)

## Error Logs

Current error:
```
POST http://localhost:3002/api/iota 404 (Not Found)
IotaHTTPStatusError: Unexpected status code: 404
```

This suggests the route isn't being matched at all by Next.js.

