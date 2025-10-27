# WASM Integration - IOTA Identity SDK

**Date**: October 2025  
**Category**: WASM, SDK Integration, Next.js  
**Complexity**: Medium  
**Time to Solve**: ~2 hours

---

## Context

Integrating IOTA Identity WASM SDK into the Next.js app for real DID creation and credential signing, moving from demo mode to blockchain mode.

---

## The Problem

The SDK wasn't initializing properly in the browser:
- WASM module import errors
- Module resolution issues with Next.js webpack
- Runtime errors when calling SDK functions
- Type mismatches between SDK and TypeScript

**Symptoms**:
- `Module not found` errors for `@iota/identity-wasm`
- `Cannot read property` errors on SDK objects
- Webpack configuration conflicts
- Build failures

---

## Your Original Prompt

"Integrate real IOTA Identity SDK for DID creation and credential issuance, replacing the mock implementation in demo mode."

---

## Solution Approach

### Step 1: Dynamic WASM Import
```typescript
// lib/iotaIdentityReal.ts
let IdentitySDK: any = null;

export const initSDK = async () => {
  if (!IdentitySDK) {
    IdentitySDK = await import('@iota/identity-wasm/web');
    await IdentitySDK.init();
  }
  return IdentitySDK;
};
```

### Step 2: Next.js Configuration
```javascript
// next.config.ts
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        crypto: false,
      };
    }
    config.experiments = {
      asyncWebAssembly: true,
    };
    return config;
  },
};
```

### Step 3: Graceful Error Handling
```typescript
try {
  const sdk = await initSDK();
  const did = await createDID(sdk);
  return { success: true, did };
} catch (error) {
  console.error('SDK initialization failed:', error);
  return { success: false, error: error.message };
}
```

---

## Code Pattern

```typescript
// Complete working pattern
export const useIOTAIdentity = () => {
  const [sdk, setSDK] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSDK = async () => {
      try {
        const identitySDK = await import('@iota/identity-wasm/web');
        await identitySDK.init();
        setSDK(identitySDK);
      } catch (err) {
        setError(err);
      }
    };
    loadSDK();
  }, []);

  return { sdk, error };
};
```

---

## Why This Solution Works

1. **Dynamic Import**: Loads WASM only when needed, avoiding SSR issues
2. **Init Function**: Ensures WASM memory is initialized before use
3. **Error Boundaries**: Graceful fallback to demo mode if SDK fails
4. **Webpack Config**: Tells Next.js to handle WASM properly
5. **Type Safety**: Uses TypeScript for IDE support and error catching

---

## Related Files

- `lib/iotaIdentityReal.ts` - Main SDK integration
- `lib/test-integration.ts` - Test suite for WASM loading
- `next.config.ts` - Webpack configuration
- `app/integration-test/page.tsx` - Browser test UI

---

## Cross-Project Applicability

- **aigo**: Could use similar WASM patterns for any WASM-based SDK
- **Any Next.js Project**: Pattern applies to WASM SDKs in general
- **Other Frameworks**: Adaptation needed for different frameworks

---

## Alternative Approaches Considered

1. **Static Import**: ❌ Breaks on initial page load
2. **Worker Thread**: ❌ Over-complicated for this use case
3. **SSR Full Load**: ❌ Heavy, slows down page load

---

## Future Improvements

- [ ] Add caching for SDK instance to avoid re-initialization
- [ ] Implement progress indicators during WASM loading
- [ ] Add telemetry for WASM load times
- [ ] Consider code-splitting for better performance

---

## Learnings

1. WASM modules need explicit initialization via `init()`
2. Dynamic imports are essential for WASM in Next.js
3. Webpack configuration must enable async WASM
4. Always have fallback mode for WASM-dependent features
5. Test WASM loading in browser, not just in build

---

**Tags**: #WASM #SDK #Next.js #IOTA #TypeScript
