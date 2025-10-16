# Troubleshooting Guide

**Common Issues and Solutions**

---

## Internal Server Error ❌

### Problem
Getting "Internal Server Error" when accessing the app.

### Cause
The IOTA Identity WASM module needs special webpack configuration in Next.js.

### Solution ✅

**1. Updated `next.config.ts`** with WASM support:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    
    // Handle WASM files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    return config;
  },
};

export default nextConfig;
```

**2. Restart the dev server**:
```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

**3. Clear cache if needed**:
```bash
rm -rf .next
npm run dev
```

---

## WASM Initialization Failed ❌

### Problem
Console shows: "Failed to initialize WASM"

### Solution
1. Make sure you're using a modern browser (Chrome 120+, Firefox 120+, Safari 17+)
2. Check internet connection (WASM files need to load)
3. Clear browser cache
4. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)

---

## DID Creation Takes Forever ⏳

### Problem
"Creating DID..." spinner never completes

### Cause
This is a demo app - DID creation is intentionally instant (mock mode).

### Check
1. Open browser console (F12)
2. Look for errors
3. If you see "✅ DID created", it worked!
4. If you see errors, the WASM module might not have loaded

---

## No DIDs in Dropdown ❌

### Problem
Tab 2 shows "⚠️ No DIDs found"

### Solution
1. Go to **Tab 1** first
2. Click **"Create New DID"**
3. Wait for success message
4. Go back to **Tab 2**
5. Dropdown should now show your DID

---

## LocalStorage Not Persisting 🔄

### Problem
DIDs/credentials disappear after page refresh

### Causes & Solutions

**Private/Incognito Mode**:
- LocalStorage is cleared on close
- Solution: Use regular browser mode

**Browser Settings**:
- Cookies/storage might be blocked
- Solution: Allow storage for localhost

**Cache Clearing**:
- Browser extension might be clearing storage
- Solution: Disable extensions for localhost

---

## Build Errors 🔨

### TypeScript Errors

**Error**: "Type 'any' is not allowed"
```bash
# Solution: Already fixed in types/index.ts
# Use Record<string, unknown> instead
```

**Error**: "Module not found"
```bash
# Solution: Restart dev server
npm run dev
```

### Linting Errors

```bash
# Check for errors:
npm run lint

# Most common: Unescaped quotes in JSX
# Use &apos; for ' and &quot; for "
```

---

## Runtime Errors 💥

### "Cannot read property 'issuer' of undefined"

**Cause**: Trying to access credential properties that don't exist

**Solution**: Already handled with proper type checking:
```typescript
{'issuer' in result.credential && result.credential.issuer && (
  <div>...</div>
)}
```

### "crypto is not defined"

**Cause**: Running in server-side context

**Solution**: All components use `'use client'` directive - already implemented

---

## Network Issues 🌐

### "Failed to fetch"

**Not applicable** - This demo doesn't make real network calls to IOTA.

If you see this:
1. Check browser console for actual error
2. Make sure dev server is running
3. Try accessing http://localhost:3000 directly

---

## Performance Issues 🐌

### Slow Page Load

**Check**:
```bash
# Build size:
npm run build

# Should show ~121 KB bundle
```

**If larger**:
- Clear .next folder
- Rebuild

### Slow DID Creation

**Expected**: Instant (demo mode)

**If slow**:
- Check browser console for WASM initialization errors
- Hard refresh page

---

## Browser Compatibility 🌍

### Supported Browsers

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 120+ | ✅ Full support |
| Firefox | 120+ | ✅ Full support |
| Safari | 17+ | ✅ Full support |
| Edge | 120+ | ✅ Full support |

### Unsupported

- Internet Explorer (any version)
- Old mobile browsers
- Browsers without WASM support

---

## Development Server Issues 🔧

### Port 3000 Already in Use

```bash
# Find and kill process:
lsof -ti:3000 | xargs kill -9

# Or use different port:
PORT=3001 npm run dev
```

### Hot Reload Not Working

```bash
# Restart dev server
# Clear .next folder:
rm -rf .next
npm run dev
```

---

## Quick Diagnostics 🔍

Run this checklist:

```bash
# 1. Check dependencies
npm list @iota/identity-wasm
# Should show: @iota/identity-wasm@1.7.0-beta.1

# 2. Check build
npm run build
# Should complete without errors

# 3. Check lint
npm run lint
# Should show: 0 errors, 0 warnings

# 4. Check types
npx tsc --noEmit
# Should show: no errors

# 5. Start fresh
rm -rf .next node_modules
npm install
npm run dev
```

---

## Still Having Issues? 🆘

### Debug Steps

1. **Check Browser Console** (F12 → Console tab)
   - Look for red errors
   - Note the error message

2. **Check Terminal**
   - Look at dev server output
   - Note any compilation errors

3. **Check File Structure**
   ```bash
   ls -la components/
   ls -la lib/
   ls -la types/
   # All files should be present
   ```

4. **Verify Configuration**
   ```bash
   cat next.config.ts
   # Should include webpack WASM config
   ```

---

## Common Error Messages 📋

### "Hydration failed"

**Solution**: Component using browser-only APIs
- Already handled with `'use client'`
- If persists, check for localStorage calls outside useEffect

### "Text content does not match"

**Solution**: Server/client mismatch
- Already handled with proper client components
- Clear cache and hard refresh

### "Module parse failed"

**Solution**: WASM configuration issue
- Check next.config.ts has webpack WASM config
- Restart dev server

---

## Prevention Tips 💡

### Before Starting

1. ✅ Use Node.js 18+
2. ✅ Use modern browser
3. ✅ Have stable internet

### During Development

1. ✅ Check console regularly
2. ✅ Restart server after config changes
3. ✅ Clear cache when strange behavior occurs

### Before Deploying

1. ✅ Run `npm run build`
2. ✅ Run `npm run lint`
3. ✅ Test in multiple browsers

---

## Getting Help 📞

### Documentation
- Check `/documents` folder
- Read START-HERE.md
- Read QUICK-START.md

### External Resources
- [Next.js WASM Docs](https://nextjs.org/docs/app/api-reference/next-config-js/webpack)
- [IOTA Identity Docs](https://docs.iota.org/identity)
- [IOTA Discord](https://discord.iota.org)

---

## Success Indicators ✅

Your app is working correctly if:

- ✅ Dev server starts without errors
- ✅ Page loads at http://localhost:3000
- ✅ No red errors in browser console
- ✅ Can create DIDs instantly
- ✅ Can issue credentials
- ✅ Can verify credentials
- ✅ Data persists in localStorage

---

*Last Updated: October 16, 2025*

