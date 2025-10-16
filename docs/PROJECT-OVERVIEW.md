# Digital Product Passport Demo - Project Overview

**Project**: IOTA DPP Demo  
**Tech Stack**: Next.js 15, TypeScript, Tailwind CSS, IOTA Identity SDK  
**Focus**: Digital Product Passport for Supply Chain Transparency  
**Started**: October 16, 2025  
**Status**: ✅ Production Demo Ready + On-Chain Implementation Available

---

## Purpose

A production-ready demonstration of **Digital Product Passports (DPP)** using IOTA Decentralized Identifiers and Verifiable Credentials. Shows how blockchain-powered identities enable transparent, verifiable supply chains.

### Key Use Cases:
- Supply chain transparency (track products from origin to consumer)
- EU DPP regulation compliance demonstration
- Multi-industry support (Food, Battery, Fashion, Electronics)
- Credential chaining (immutable chain of custody)

---

## Core Features

### 1. **Multi-Industry Support**
Choose from 4 industries:
- 🍫 Food & Beverage (Chocolate supply chain)
- 🔋 Batteries (EU Battery Passport ready)
- 👕 Fashion & Textiles (Sustainable fashion)
- 📱 Electronics (Conflict-free minerals)

### 2. **Three-Step Supply Chain Journey**

**🌱 Origin (Farmer/Miner/Supplier)**
- Issue origin certification
- Record harvest/extraction details
- Certify organic/sustainable/conflict-free status

**🏭 Production (Factory/Manufacturer)**
- Verify origin certificate
- Issue production certificate
- Credential chaining (MUST verify before producing)

**✅ Consumer Verification**
- Scan QR code
- Verify complete supply chain
- View transparent journey timeline

### 3. **Dual Mode Operation**

**Demo Mode (Current Default)**
- Works immediately, no setup
- Mock DIDs and credentials
- Perfect for presentations
- Shows all concepts clearly

**On-Chain Mode (Available)**
- Real IOTA Identity SDK integration
- Creates real DIDs locally
- W3C Verifiable Credentials format
- Can publish to Shimmer testnet (requires tokens)

---

## Project Structure

```
iota/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Main application (industry selector + journey)
│   ├── simple-test/page.tsx     # Visual test UI for on-chain
│   └── test-wasm/page.tsx       # WASM initialization tests
├── components/
│   ├── FarmerOrigin.tsx         # Step 1: Origin certification
│   ├── FactoryProduction.tsx    # Step 2: Production + verification
│   ├── ConsumerJourney.tsx      # Step 3: Consumer verification
│   └── IndustrySelector.tsx     # Industry selection UI
├── lib/
│   ├── iotaIdentity.ts          # Mock implementation (demo mode)
│   ├── iotaIdentityReal.ts      # Real IOTA SDK (on-chain mode)
│   ├── keyStorage.ts            # Encrypted key management
│   ├── config.ts                # Network configuration
│   └── iotaExplorer.ts          # Blockchain explorer URLs
├── data/
│   └── industry-data.ts         # Dynamic data for all 4 industries
├── types/
│   ├── index.ts                 # TypeScript definitions
│   └── dpp.ts                   # DPP-specific types
├── docs/                        # 📚 All documentation
│   ├── getting-started/
│   ├── onchain/
│   ├── deployment/
│   ├── dpp/
│   └── ux/
└── documents/                   # (Legacy technical docs - archived)
```

---

## Technology Choices

### Why Next.js 15?
- Server and client components
- Built-in TypeScript support
- Excellent developer experience
- Easy deployment (Vercel, Netlify, etc.)

### Why IOTA?
- Fee-less transactions (on testnet)
- Identity framework designed for IoT and supply chain
- W3C DID standards compliant
- Shimmer testnet available for testing

### Why Tailwind CSS?
- Rapid UI development
- Consistent design system
- Dark theme out of the box
- Mobile-responsive utilities

### Why Mock Data + Real Implementation?
- **Mock**: Instant demos, no blockchain complexity
- **Real**: Production-ready when needed
- **Both**: Best of both worlds!

---

## Key Concepts

### What is a DID?
A Decentralized Identifier - like a username, but you own it forever and no company can take it away.  
Format: `did:iota:smr:0x1234567890abcdef...`

### What is a Verifiable Credential?
A digitally signed certificate that proves something about an entity.  
Example: "This batch of cocoa is certified organic by EU Organic #12345"

### What is Credential Chaining?
Each credential references the previous one, creating an immutable chain.  
Example: Factory production certificate MUST reference valid farmer origin certificate.

### IOTA Tangle
IOTA's distributed ledger (uses DAG structure). Benefits:
- No transaction fees (testnet)
- Fast and scalable
- Environmentally friendly
- Identity-focused

---

## Development Approach

1. **Educational First** - Clear explanations at every step
2. **Production Quality** - Real W3C standards, proper crypto
3. **Flexible** - Demo mode OR real blockchain
4. **Well Documented** - Complete guides in `/docs`
5. **Multi-Industry** - One codebase, 4 industries

---

## Current Status

### ✅ Complete:
- Full DPP demo with 4 industries
- Mock data mode (works perfectly)
- Real IOTA Identity SDK integration
- W3C Verifiable Credentials format
- Key management (encrypted localStorage)
- Visual test UIs
- Comprehensive documentation

### ⏳ Optional Enhancements:
- Full blockchain publishing (requires testnet tokens + IOTA Client)
- Cryptographic signing (requires SDK Storage setup)
- Hardware wallet integration
- Production deployment

---

## Quick Start

### Run Demo (Immediate):
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### Test On-Chain (SDK Integration):
```bash
# Visual test UI
open http://localhost:3000/simple-test

# Or WASM tests
open http://localhost:3000/test-wasm
```

### Documentation:
- **New Users**: `docs/getting-started/START-HERE.md`
- **On-Chain**: `docs/onchain/ON-CHAIN-STEPS.md`
- **Deployment**: `docs/deployment/DEPLOYMENT-GUIDE.md`

---

## What Makes This Special

1. **Production-Ready Demo** - Not just a toy, real W3C standards
2. **Multi-Industry** - One demo, 4 different use cases
3. **Dual Mode** - Mock for demos, real for production
4. **Complete Documentation** - Everything explained
5. **EU DPP Focused** - Built for real regulatory needs

---

## Next Steps

### For Demo:
→ Already works! Just run `npm run dev`

### For Production:
→ See `docs/onchain/ON-CHAIN-STEPS.md`

### For Deployment:
→ See `docs/deployment/DEPLOYMENT-GUIDE.md`

---

**Last Updated**: October 16, 2025  
**Version**: 2.0 (DPP Focus + On-Chain Ready)  
**Branch**: `main` (demo), `feature/simple-onchain` (on-chain)

