# Implementation Details

**Last Updated**: October 16, 2025

This document explains how each component works and the technical decisions made.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│              User Interface (UI)                │
│         Next.js App Router + Tailwind           │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│           React Components Layer                │
│  CreateDID │ IssueCredential │ VerifyCredential │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│         Business Logic Layer (lib/)             │
│           iotaIdentity.ts utilities             │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│          IOTA Identity SDK (WASM)               │
│          @iota/identity-wasm/web                │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│            IOTA Tangle (Testnet)                │
│    https://api.testnet.shimmer.network          │
└─────────────────────────────────────────────────┘
```

---

## File-by-File Breakdown

### 1. `lib/iotaIdentity.ts`

**Purpose**: Wrapper functions for IOTA Identity SDK

**Key Functions**:

#### `initWasm()`
```typescript
async function initWasm()
```
- Initializes the WASM module (required before any IOTA Identity operations)
- Only runs once (tracked by `wasmInitialized` flag)
- Must be called in all public functions

**Why WASM?**
- IOTA Identity SDK is written in Rust
- Compiled to WebAssembly for browser use
- Provides cryptographic operations (signing, verification)

#### `createDID()`
```typescript
export async function createDID(): Promise<DIDCreationResult>
```

**Flow**:
1. Initialize WASM
2. Create IOTA client connected to testnet
3. Create IotaIdentityClient
4. Generate new IotaDocument
5. Generate Ed25519 keypair
6. Add verification method to document
7. Publish document to Tangle
8. Return DID and document

**Key Concepts**:
- **Ed25519**: Military-grade elliptic curve cryptography
- **Verification Method**: Links a public key to the DID
- **Publishing**: Writes to IOTA Tangle (immutable)

#### `issueCredential()`
```typescript
export async function issueCredential(
  issuerDID: string,
  holderDID: string,
  claimData: CredentialData
): Promise<string>
```

**Flow**:
1. Initialize WASM
2. Create credential subject (claims about the holder)
3. Build Credential object
4. Set issuance date (now)
5. Set expiration date (1 year from now)
6. Return as JSON string

**Demo Simplification**:
- In production, you'd sign with the issuer's private key
- Would return a proper JWT with signature
- We return JSON for simplicity

#### `verifyCredential()`
```typescript
export async function verifyCredential(credentialJWT: string): Promise<VerificationResult>
```

**Flow**:
1. Parse credential JSON
2. Validate required fields (issuer, subject)
3. Check expiration date
4. Return validation result

**Demo Simplification**:
- In production, you'd fetch issuer's DID Document from Tangle
- Extract issuer's public key
- Verify JWT signature
- We do basic validation for simplicity

---

### 2. `components/CreateDID.tsx`

**Purpose**: UI for creating new DIDs

**State Management**:
```typescript
const [loading, setLoading] = useState(false);
const [result, setResult] = useState<DIDCreationResult | null>(null);
const [error, setError] = useState<string | null>(null);
const [copied, setCopied] = useState(false);
```

**Key Features**:
- **Loading State**: Shows spinner during DID creation (~10-20 seconds)
- **Success Display**: Shows created DID with copy button
- **LocalStorage**: Saves DIDs to browser storage
- **Educational Tooltips**: Explains what's happening

**LocalStorage Schema**:
```typescript
{
  did: string,
  document: any,
  created: string (ISO date)
}[]
```

---

### 3. `components/IssueCredential.tsx`

**Purpose**: UI for issuing verifiable credentials

**Form State**:
```typescript
const [formData, setFormData] = useState({
  issuerDID: '',
  holderDID: '',
  name: '',
  degree: '',
  university: '',
});
```

**Key Features**:
- **DID Selector**: Loads saved DIDs from localStorage
- **Form Validation**: Checks all required fields
- **Auto-fill**: Pre-fills issuer DID if available
- **Credential Preview**: Shows issued credential as JSON

**LocalStorage Schema**:
```typescript
{
  jwt: string,
  issued: string (ISO date),
  subject: string (name)
}[]
```

---

### 4. `components/VerifyCredential.tsx`

**Purpose**: UI for verifying credentials

**Verification States**:
- ✅ **Valid**: Green success message with credential details
- ❌ **Invalid**: Red error message with failure reason
- 🔄 **Loading**: Spinner during verification

**Key Features**:
- **Recent Credentials**: Shows last 3 issued credentials
- **Quick Load**: Click to load saved credentials
- **Detailed Results**: Displays all credential fields
- **Error Handling**: Clear error messages

---

### 5. `app/page.tsx`

**Purpose**: Main application with tab navigation

**Tab State**:
```typescript
const [activeTab, setActiveTab] = useState<TabType>('create');
```

**Design Decisions**:
- **Tab Navigation**: Sequential flow (1 → 2 → 3)
- **Gradient Background**: Modern, appealing design
- **Icons**: Visual indicators for each step
- **Footer Tips**: Contextual help

---

### 6. `types/index.ts`

**Purpose**: TypeScript type definitions

**Why TypeScript?**
- Catches errors at compile time
- Better IDE autocomplete
- Self-documenting code
- Easier refactoring

---

## Technical Decisions

### Why Next.js App Router?

**Pros**:
- Server and client components
- File-based routing
- Built-in optimization
- Great developer experience

**Cons**:
- Requires `'use client'` for interactive components
- Learning curve for those familiar with Pages Router

**Decision**: App Router is the future of Next.js, good for new projects.

---

### Why Client-Side Only?

**Current Approach**: All components use `'use client'`

**Why?**
- IOTA Identity SDK requires browser APIs (WebAssembly, Crypto)
- DIDs are created in the browser
- Private keys stay local (better security)

**Trade-off**: No SEO benefits, but that's okay for this tool.

---

### Why LocalStorage?

**Pros**:
- Simple to implement
- No backend needed
- Data persists across sessions

**Cons**:
- Not secure for production
- Limited to 5-10MB
- Can be cleared by user

**Production Alternative**: Use IOTA Stronghold for secure key storage.

---

### Why Testnet?

**Pros**:
- Free to use (no real tokens needed)
- Safe for experimentation
- Same features as mainnet

**Cons**:
- Slower than mainnet (~10-20 seconds)
- Data might be purged periodically
- Not for production use

**Decision**: Perfect for learning and demos.

---

## Data Flow

### Creating a DID

```
User clicks "Create DID"
    ↓
CreateDID.handleCreateDID()
    ↓
lib/iotaIdentity.createDID()
    ↓
initWasm() [if not initialized]
    ↓
Create IotaDocument
    ↓
Generate Ed25519 keypair
    ↓
Publish to IOTA Tangle (HTTP request to testnet)
    ↓
Wait for confirmation (~10-20 seconds)
    ↓
Return DID string
    ↓
Save to localStorage
    ↓
Display in UI
```

### Issuing a Credential

```
User fills form + clicks "Issue"
    ↓
IssueCredential.handleSubmit()
    ↓
Validate form fields
    ↓
lib/iotaIdentity.issueCredential()
    ↓
Create Credential object
    ↓
Set issuance/expiration dates
    ↓
Convert to JSON (simplified JWT)
    ↓
Return JWT string
    ↓
Save to localStorage
    ↓
Display in UI
```

### Verifying a Credential

```
User pastes JWT + clicks "Verify"
    ↓
VerifyCredential.handleVerify()
    ↓
lib/iotaIdentity.verifyCredential()
    ↓
Parse JSON
    ↓
Check required fields
    ↓
Check expiration date
    ↓
Return validation result
    ↓
Display in UI (green/red)
```

---

## Performance Considerations

### WASM Initialization
- **Time**: ~100-200ms
- **Optimization**: Only initialize once (singleton pattern)
- **User Impact**: Minimal (happens on first interaction)

### DID Creation
- **Time**: ~10-20 seconds
- **Bottleneck**: Network request to IOTA testnet
- **Optimization**: Show loading state, explain why it's slow

### Credential Operations
- **Time**: ~50-100ms
- **Bottleneck**: JSON parsing, validation
- **Optimization**: Fast enough, no optimization needed

---

## Security Considerations

### What's Secure ✅

- Private keys generated in browser (never sent to server)
- Public key cryptography (Ed25519)
- DIDs published to immutable ledger
- HTTPS for all API calls

### What's NOT Secure ❌

- Private keys in browser memory (lost on refresh)
- No proper JWT signing (simplified for demo)
- LocalStorage for sensitive data (not encrypted)
- No revocation checking

### Production Improvements

1. **Use IOTA Stronghold**
   - Hardware-backed key storage
   - Encrypted local storage
   - Secure key derivation

2. **Proper JWT Signing**
   - Sign credentials with issuer's private key
   - Include proper JWT headers
   - Use JWS (JSON Web Signature)

3. **Revocation Lists**
   - Check if credentials have been revoked
   - Maintain revocation registry
   - Update regularly

4. **Credential Schemas**
   - Define JSON schemas for credential types
   - Validate credentials against schemas
   - Ensure data consistency

---

## Error Handling

### Network Errors
```typescript
try {
  await identityClient.publishDidDocument(storage, document);
} catch (error) {
  // Show user-friendly error
  setError('Failed to connect to IOTA testnet. Check your internet connection.');
}
```

### Validation Errors
```typescript
if (!formData.issuerDID || !formData.holderDID) {
  setError('Both Issuer DID and Holder DID are required');
  return;
}
```

### WASM Initialization Errors
```typescript
try {
  await init();
  wasmInitialized = true;
} catch (error) {
  throw new Error('Failed to initialize IOTA Identity SDK');
}
```

---

## Next Implementation Steps

### Near-term Improvements

1. **Add DID Resolver Component**
   - Fetch any DID from Tangle
   - Display DID Document
   - Show verification methods

2. **Credential Templates**
   - Pre-defined credential types
   - Dropdown to select type
   - Auto-fill schema

3. **Export/Import**
   - Export DIDs as JSON
   - Import DIDs from file
   - Backup/restore functionality

### Long-term Features

1. **Multi-Signature Credentials**
   - Multiple issuers
   - Threshold signatures
   - Co-signing flow

2. **Credential Presentation**
   - Selective disclosure (show only some fields)
   - Zero-knowledge proofs
   - Privacy-preserving verification

3. **Product DPP Integration**
   - Create DIDs for products
   - Issue sustainability certificates
   - Verify product authenticity

---

## Resources

- [IOTA Identity SDK Docs](https://docs.iota.org/identity/introduction)
- [W3C DID Spec](https://www.w3.org/TR/did-core/)
- [W3C VC Spec](https://www.w3.org/TR/vc-data-model/)
- [Next.js Docs](https://nextjs.org/docs)

