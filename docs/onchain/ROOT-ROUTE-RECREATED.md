# Root Route Recreated - Fix for 404 Error

## Problem
Catch-all route `[...path]` in Next.js 15 does **NOT** match empty path arrays. When the SDK POSTs to `/api/iota`, Next.js can't match it to the catch-all route because `path = []`.

## Solution
Recreated the **root route** `app/api/iota/route.ts` to handle exact `/api/iota` matches.

## Route Structure Now

```
app/api/iota/
├── route.ts                    # ✅ Handles /api/iota exactly (for empty path)
└── [...path]/
    └── route.ts                # Handles /api/iota/* (for sub-paths)
```

## How It Works

1. **Root route** (`/api/iota/route.ts`):
   - Matches `POST /api/iota` exactly
   - Proxies to `/api/core/v2/blocks` for POST requests
   - Proxies to `/api/core/v2/info` for GET requests

2. **Catch-all route** (`/api/iota/[...path]/route.ts`):
   - Matches `/api/iota/api/core/v2/blocks` and similar sub-paths
   - Forwards path segments to IOTA API

## Next Steps

**Restart dev server** to pick up the new route:
```bash
# Stop server (Ctrl+C)
rm -rf .next
npm run dev
```

## Testing

After restart, when SDK makes POST to `/api/iota`:
- Should hit root route handler
- Should see logs: `🟢 [IOTA Proxy Root] POST request received`
- Should proxy to IOTA API successfully

## Why This Works

In Next.js App Router:
- **Exact routes** (`route.ts`) match before catch-all routes
- **Catch-all routes** (`[...path]`) require at least one path segment
- For empty paths (root), you **must** use an exact route file

This is the correct pattern for Next.js 15!

