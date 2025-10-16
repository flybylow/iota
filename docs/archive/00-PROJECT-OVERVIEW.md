# IOTA DID React Exploration - Project Overview

**Project**: IOTA DID Explorer  
**Tech Stack**: Next.js 15, TypeScript, Tailwind CSS, IOTA Identity SDK  
**Started**: October 16, 2025  
**Location**: `/Users/warddem/dev/iota`

---

## Purpose

Build a Next.js application to explore Decentralized Identifiers (DIDs) on IOTA. This project helps developers understand:
- How DIDs work in practice
- IOTA's identity framework
- Verifiable credentials (VCs)
- Onchain vs offchain data

---

## Core Features

1. **Create DID** - Generate decentralized identities and publish to IOTA Tangle
2. **Issue Credentials** - Create verifiable credentials (like digital certificates)
3. **Verify Credentials** - Validate credentials using cryptographic signatures
4. **Educational UI** - Clear explanations for each step

---

## Key Concepts

### What is a DID?
A Decentralized Identifier is like an email address, but you own it forever and no company can take it away. Format: `did:iota:0x1234567890abcdef...`

### What is a Verifiable Credential?
A digitally signed statement about someone/something. Example: "Alice has a Bachelor's degree from MIT"

### IOTA Tangle
IOTA's distributed ledger (uses DAG structure instead of traditional blockchain). Benefits:
- No transaction fees
- Fast and scalable
- Environmentally friendly

---

## Project Structure

```
iota/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   └── layout.tsx         # Root layout
├── components/
│   ├── CreateDID.tsx      # DID creation component
│   ├── IssueCredential.tsx # Credential issuance component
│   ├── VerifyCredential.tsx # Credential verification component
│   └── DIDViewer.tsx      # Display DID information
├── lib/
│   └── iotaIdentity.ts    # IOTA Identity helper functions
├── types/
│   └── index.ts           # TypeScript type definitions
├── documents/             # Project documentation
│   ├── 00-PROJECT-OVERVIEW.md
│   ├── 01-SETUP-STEPS.md
│   └── [progress docs...]
└── package.json
```

---

## Technology Choices

### Why Next.js?
- Server and client components
- Built-in TypeScript support
- Excellent developer experience
- Easy deployment

### Why IOTA?
- Fee-less transactions
- Designed for IoT and identity
- Active development community
- Good documentation

### Why Tailwind CSS?
- Rapid UI development
- Consistent design system
- Small bundle size
- Great with Next.js

---

## Development Approach

1. **Educational First** - Clear explanations for developers new to blockchain/DIDs
2. **Iterative** - Build features one at a time
3. **Well Documented** - Document every step in `/documents`
4. **Production Aware** - Note what's demo vs production-ready

---

## Next Steps

See `documents/01-SETUP-STEPS.md` for detailed setup instructions.

