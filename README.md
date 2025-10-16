# IOTA DID Explorer

A Next.js application for exploring Decentralized Identifiers (DIDs) and Verifiable Credentials on the IOTA Tangle.

![IOTA DID Explorer](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![IOTA](https://img.shields.io/badge/IOTA-Identity-teal)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

---

## 📖 What This Project Does

This is an educational application that teaches developers about:

1. **Decentralized Identifiers (DIDs)** - Self-sovereign digital identities
2. **Verifiable Credentials (VCs)** - Tamper-proof digital certificates
3. **IOTA Tangle** - Fee-less distributed ledger for identity data
4. **Public Key Cryptography** - How signatures prove authenticity

### Features

- ✅ **Create DIDs** - Generate new decentralized identities on IOTA testnet
- ✅ **Issue Credentials** - Create verifiable credentials (like digital diplomas)
- ✅ **Verify Credentials** - Validate credentials using cryptographic signatures
- ✅ **Educational UI** - Clear explanations at every step
- ✅ **Browser Storage** - Save DIDs and credentials locally
- ✅ **Modern Stack** - Built with Next.js 15, TypeScript, and Tailwind CSS

---

## 🏗️ Project Structure

```
iota/
├── app/                        # Next.js app directory
│   ├── page.tsx               # Main application (tabs interface)
│   ├── layout.tsx             # Root layout with metadata
│   └── globals.css            # Global styles
├── components/                 # React components
│   ├── CreateDID.tsx          # DID creation component
│   ├── IssueCredential.tsx    # Credential issuance component
│   └── VerifyCredential.tsx   # Credential verification component
├── lib/                        # Utility functions
│   └── iotaIdentity.ts        # IOTA Identity SDK wrapper
├── types/                      # TypeScript definitions
│   └── index.ts               # Shared types
├── documents/                  # Project documentation
│   ├── 00-PROJECT-OVERVIEW.md # High-level overview
│   ├── 01-SETUP-STEPS.md      # Setup progress tracking
│   ├── 02-IMPLEMENTATION.md   # Implementation details
│   └── 03-TESTING-GUIDE.md    # How to test the app
└── package.json
```

---

## 🧪 How to Use

### Step 1: Create a DID

1. Go to the "Create DID" tab
2. Click "Create New DID"
3. Wait ~10-20 seconds for it to publish to IOTA testnet
4. Copy your new DID (format: `did:iota:0x...`)

### Step 2: Issue a Credential

1. Go to "Issue Credential" tab
2. Select or paste the DID you just created as the "Issuer"
3. For "Holder", either:
   - Create another DID and use it, OR
   - Use the same DID (self-issued credential)
4. Fill in the credential details (name, degree, university)
5. Click "Issue Credential"
6. Copy the generated credential (JWT)

### Step 3: Verify the Credential

1. Go to "Verify Credential" tab
2. Paste the credential you just created
3. Click "Verify"
4. See the verification result! ✅

---

## 🔑 Key Concepts

### What is a DID?

A **Decentralized Identifier** is like an email address or username, but:
- You own it forever (no company can revoke it)
- It's cryptographically secured
- It's stored on a blockchain (IOTA Tangle)
- Anyone can verify your identity without a central authority

Example: `did:iota:0x1234567890abcdef...`

### What is a Verifiable Credential?

A **Verifiable Credential** is a digitally signed statement about someone/something:
- **Example**: "MIT certifies that Alice has a Bachelor of Science"
- **Components**:
  - Issuer (who issued it)
  - Subject (who it's about)
  - Claims (what's being certified)
  - Signature (cryptographic proof)
  - Expiration (when it expires)

### How Verification Works

1. Parse the credential to extract the issuer's DID
2. Fetch the issuer's DID Document from IOTA Tangle
3. Extract the issuer's public key
4. Verify the credential's signature with that public key
5. Check expiration dates

If all checks pass → **Valid!** ✅

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Blockchain**: IOTA Tangle (testnet)
- **Identity SDK**: `@iota/identity-wasm`

---

## 📚 Documentation

Detailed documentation is available in the `/documents` folder:

- **[00-PROJECT-OVERVIEW.md](./documents/00-PROJECT-OVERVIEW.md)** - Project overview and architecture
- **[01-SETUP-STEPS.md](./documents/01-SETUP-STEPS.md)** - Step-by-step setup guide with progress tracking
- **[02-IMPLEMENTATION.md](./documents/02-IMPLEMENTATION.md)** - Implementation details and code explanations
- **[03-TESTING-GUIDE.md](./documents/03-TESTING-GUIDE.md)** - How to test and use the application

---

## 🌐 IOTA Testnet

This app uses IOTA's **testnet** (Shimmer testnet):
- **Endpoint**: `https://api.testnet.shimmer.network`
- **Cost**: Free (no real funds needed)
- **Purpose**: Testing and development
- **Speed**: ~10-20 seconds per transaction

---

## ⚠️ Important Notes

### This is a Demo App

- ✅ Great for learning and experimentation
- ❌ NOT production-ready
- Private keys are stored in browser memory (lost on refresh)
- No proper JWT signature verification (simplified for demo)

### For Production Use

If you want to build a real app:
1. Use **IOTA Stronghold** for secure key storage
2. Implement proper **JWT signature verification**
3. Add **revocation list** checking
4. Use **mainnet** instead of testnet
5. Add **proper error handling** and logging
6. Implement **credential schemas** for validation

---

## 🚧 Troubleshooting

### "Failed to fetch" error
- **Problem**: Can't connect to IOTA testnet
- **Solution**: Check internet connection; testnet might be temporarily down

### "Failed to initialize WASM" error
- **Problem**: IOTA Identity SDK WASM module didn't load
- **Solution**: Refresh the page; ensure you're using a modern browser

### Keys lost on page refresh
- **Problem**: This is expected behavior in this demo
- **Solution**: For persistence, we'd need to implement secure storage (not recommended in browser)

---

## 📖 Learn More

### IOTA Resources
- [IOTA Identity Docs](https://docs.iota.org/identity/introduction)
- [IOTA GitHub](https://github.com/iotaledger/identity.rs)
- [IOTA Discord](https://discord.iota.org)

### W3C Standards
- [DID Core Specification](https://www.w3.org/TR/did-core/)
- [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

---

## 🤝 Contributing

This is an educational project. Feel free to:
- Fork and experiment
- Report issues
- Suggest improvements
- Share with others learning about DIDs

---

## 📄 License

MIT License - feel free to use this for learning and experimentation.

---

## 🎯 Next Steps

### Extend This Project

1. **Add More Credential Types**
   - Professional certifications
   - Membership cards
   - Product certifications (DPP use case!)

2. **QR Code Support**
   - Generate QR codes for DIDs
   - Scan QR codes to import credentials

3. **Better Key Management**
   - Integrate IOTA Stronghold
   - Export/import keypairs safely

4. **Credential Schemas**
   - Define JSON schemas for credentials
   - Validate credentials against schemas

5. **Apply to Products (DPP)**
   - Create DIDs for physical products
   - Issue certificates for origin, sustainability, etc.
   - Scan products to verify authenticity

---

**Built with ❤️ for learning about decentralized identity**

Questions? Check the `/documents` folder or IOTA's official docs!
