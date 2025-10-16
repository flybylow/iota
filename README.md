# 🍫 Digital Product Passport - Chocolate Supply Chain Demo

Interactive demonstration of blockchain-powered supply chain transparency using **IOTA Decentralized Identifiers (DIDs)** and **Verifiable Credentials**.

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![IOTA](https://img.shields.io/badge/IOTA-Identity-teal) ![DPP](https://img.shields.io/badge/DPP-EU%20Ready-green)

## 🌐 Live Demo

**[View Live Demo →](https://iota-snowy-nine.vercel.app)**

---

## 🎯 What This Demonstrates

A **working reference implementation** showing how **W3C Decentralized Identifiers** and **Verifiable Credentials** enable transparent, verifiable supply chains for **EU Digital Product Passport** compliance.

**Journey:** Ecuador farm → Belgian factory → Dutch consumer  
**Tech:** IOTA Tangle + W3C DID standards + Next.js  
**Purpose:** Prove DPP implementation expertise for consulting clients

### Real-World Business Value

This demo proves you can build production DPP solutions. Perfect for showing:
- 🍫 Food & Beverage manufacturers (chocolate, coffee, wine)
- 🔋 Battery producers (EU mandatory 2027)
- 👕 Fashion brands (textile transparency)
- 📱 Electronics companies (ESPR compliance)

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/flybylow/iota.git
cd iota

# Install dependencies
npm install

# Run development server
npm run dev
```

Then open: **http://localhost:3000**

---

## ✨ What You'll See

### Interactive 3-Step Supply Chain Journey

**Step 1: 🌱 Farmer** (Maria's Organic Cocoa Farm, Ecuador)
- Issues organic origin certificate
- Certifies harvest date, batch weight, Fair Trade compliance
- Cryptographically signs with farmer's DID

**Step 2: 🏭 Factory** (Chocolate Dreams, Belgium)
- **Verifies** farmer's certificate before producing
- Issues production certificate (batch #, recipe, quality checks)
- **Credential chaining** - links to farmer's certificate

**Step 3: ✅ Consumer** (Amsterdam, Netherlands)
- Scans QR code on chocolate bar
- Sees complete verified supply chain journey
- Instant cryptographic proof of all claims

### Key Features

- ✅ **Credential Chaining** - Each step verifies previous steps
- ✅ **Real Stakeholders** - Farmer, Factory, Lab, Consumer roles
- ✅ **Visual Timeline** - See complete product journey
- ✅ **Instant Verification** - No phone calls, no waiting
- ✅ **EU Compliant** - Built for ESPR regulations
- ✅ **Production-Ready Pattern** - Adaptable to any supply chain

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 + TypeScript |
| **Blockchain** | IOTA Tangle (Shimmer Testnet) |
| **Identity** | IOTA Identity SDK (W3C compliant) |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **State** | React Hooks + LocalStorage |

---

## 📖 How It Works - Chocolate Supply Chain

### The Journey: Bean-to-Bar Traceability

```
🌱 Farmer            🏭 Factory          ✅ Consumer
(Ecuador)            (Belgium)           (Netherlands)
    |                    |                     |
    | 1. Issue Origin    |                     |
    |    Certificate     |                     |
    |------------------->|                     |
    |                    |                     |
    |                    | 2. Verify Origin    |
    |                    |    ✓ Valid          |
    |                    |                     |
    |                    | 3. Issue Production |
    |                    |    Certificate      |
    |                    |-------------------->|
    |                    |                     |
    |                    |                     | 4. Scan QR Code
    |                    |                     |    
    |                    |                     | 5. Verify Complete
    |                    |                     |    Chain ✓
```

### Stakeholder Details

**Maria's Organic Cocoa Farm** (Ecuador)
- **DID:** `did:iota:smr:0xfarmer...`
- **Role:** Origin certification
- **Certifications:** EU Organic, Fair Trade
- **Issues:** Harvest certificate (date, weight, variety, fermentation)

**Chocolate Dreams Factory** (Belgium)
- **DID:** `did:iota:smr:0xfactory...`
- **Role:** Production certification  
- **Certifications:** ISO 22000, BRC Food Safety
- **Issues:** Production certificate (batch #, recipe, quality checks)
- **Critical:** Verifies farmer's certificate BEFORE producing

**Consumer** (Amsterdam)
- Scans QR code on chocolate bar
- Sees complete verified journey in seconds
- Trusts organic and Fair Trade claims

### Why This Matters

**Traditional verification:**
- ❌ Call supplier → Wait 3-5 days
- ❌ Trust humans (can lie)
- ❌ Paper certificates (can be forged)

**With DIDs:**
- ✅ Instant verification (2 seconds)
- ✅ Trust mathematics (can't lie)
- ✅ Cryptographic proof (can't be forged)
- ✅ Complete chain of custody

---

## 🔧 Technical Implementation

### Credential Chaining Pattern

The key innovation is **credential chaining** - each step references previous steps:

```typescript
// Farmer issues origin certificate
const originCert = {
  issuer: "did:iota:smr:0xfarmer...",
  subject: "did:iota:smr:0xproduct-ch-2025-001",
  type: "OrganicOriginCertification",
  data: {
    farm: "Maria's Organic Cocoa",
    harvest: "2025-10-01",
    certified: "EU Organic"
  }
};

// Factory MUST verify farmer's cert before producing
const verify = await verifyCredential(originCert);
if (!verify.isValid) {
  throw new Error("Cannot produce: Invalid organic cert!");
}

// Factory issues production cert that LINKS to farmer's cert
const productionCert = {
  issuer: "did:iota:smr:0xfactory...",
  subject: "did:iota:smr:0xproduct-ch-2025-001",
  type: "ProductionCertification",
  data: { /* production details */ },
  previousCredentials: [originCert] // 🔗 THE CHAIN
};
```

### W3C Standards Compliance

- **DIDs:** W3C Decentralized Identifier v1.0
- **VCs:** W3C Verifiable Credentials Data Model v1.1
- **Signatures:** Ed25519 cryptographic signatures
- **Storage:** IOTA Tangle (distributed ledger)

---

## 🌍 Digital Product Passport Context

### EU Regulations Driving DPP Adoption

- **ESPR** (Ecodesign for Sustainable Products Regulation) - Requires DPPs for many products
- **Battery Regulation** - Mandatory DPP for batteries from 2027
- **CBAM** (Carbon Border Adjustment Mechanism) - Needs supply chain transparency
- **CSRD** (Corporate Sustainability Reporting Directive) - ESG data tracking

### Why Blockchain DIDs for DPP?

✅ **Decentralized** - No single point of failure  
✅ **Immutable** - Data can't be tampered with  
✅ **Verifiable** - Instant cryptographic proof  
✅ **Privacy-Preserving** - Selective disclosure possible  
✅ **Interoperable** - W3C standards-based  
✅ **Cost-Effective** - IOTA has no transaction fees  

---

## 📚 Learn More

### Standards & Frameworks
- **[CIRPASS-2 DPP Standards](https://cirpass2.eu/)** - EU DPP implementation framework
- **[W3C DID Specification](https://www.w3.org/TR/did-core/)** - Decentralized identifier standard
- **[W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)** - Credential data model
- **[GS1 Digital Link](https://www.gs1.org/standards/gs1-digital-link)** - Product identification

### IOTA Resources
- **[IOTA Identity Docs](https://docs.iota.org/developer/iota-identity/)** - Full SDK documentation
- **[IOTA Tangle](https://www.iota.org/)** - Feeless distributed ledger
- **[Shimmer Network](https://shimmer.network/)** - IOTA staging network (we use testnet)

### DPP Use Cases
- **[Battery Passport](https://www.batterypass.eu/)** - Battery traceability initiative
- **[Textile Exchange](https://textileexchange.org/)** - Fashion supply chain transparency
- **[Sourcemap](https://www.sourcemap.com/)** - Supply chain mapping

---

## 🚀 Extending for Your Use Case

### Add Custom Credential Types

Currently supports: University degrees (demo)

**Easy to adapt for:**

1. **Product Certifications**
   ```typescript
   // In lib/iotaIdentity.ts
   credentialSubject: {
     productId: "BAT-2024-001",
     type: "Lithium-Ion Battery",
     capacity: "50 kWh",
     manufacturer: "GreenBatt GmbH",
     certifications: ["CE", "UN38.3"]
   }
   ```

2. **Quality Test Results**
   ```typescript
   credentialSubject: {
     batchId: "COCOA-GH-2024-001",
     testDate: "2024-01-15",
     heavyMetals: "Pass (< 0.5 ppm)",
     cadmium: "Pass (< 0.3 mg/kg)",
     lab: "TÜV SÜD"
   }
   ```

3. **Origin Certificates**
   ```typescript
   credentialSubject: {
     product: "Cocoa Beans",
     origin: "Ghana, Western Region",
     farmId: "GH-WR-001",
     harvestDate: "2024-01-10",
     certification: "Organic, Fair Trade"
   }
   ```

### Add QR Code Generation

```bash
npm install qrcode
```

Then update components to include QR generation for easy consumer scanning.

---

## 🤝 Contributing

This is a learning project exploring DPP implementations. PRs welcome for:

- ✅ Additional credential types (sustainability, carbon footprint, recycling info)
- ✅ QR code generation and scanning
- ✅ Supply chain visualization
- ✅ Better mobile UI
- ✅ Multi-language support
- ✅ Real IOTA mainnet integration
- ✅ Documentation improvements

### Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

---

## ⚠️ Important Notes

### This is a Demo/POC

**✅ Good for:**
- Learning about DIDs and VCs
- Prototyping DPP concepts
- Demonstrating supply chain transparency
- Educational purposes
- Proof of concept presentations

**❌ Not production-ready for:**
- Real product passports (needs mainnet + proper key management)
- Regulatory compliance (requires audit)
- Sensitive data (needs encryption layer)
- High-scale deployments (needs infrastructure)

### Production Checklist

To make this production-ready:

- [ ] Switch from testnet to IOTA mainnet
- [ ] Implement IOTA Stronghold for secure key storage
- [ ] Add proper authentication and authorization
- [ ] Implement revocation lists for credentials
- [ ] Add encryption for sensitive data
- [ ] Set up proper credential schemas
- [ ] Add comprehensive logging and monitoring
- [ ] Implement rate limiting and security measures
- [ ] Add backup and recovery procedures
- [ ] Complete security audit
- [ ] Ensure GDPR compliance
- [ ] Add multi-language support for EU markets

---

## 📝 License

MIT License - feel free to adapt for your own DPP implementations.

See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

**Research:** Digital Product Passports for supply chain transparency  
**Inspired by:** EU ESPR regulations and circular economy initiatives  
**Built with:** Next.js 15, TypeScript, IOTA Identity SDK, Tailwind CSS

**Special thanks to:**
- IOTA Foundation for the feeless, scalable Identity SDK
- W3C for open DID/VC standards
- CIRPASS-2 project for DPP framework guidance
- Next.js and Vercel teams for excellent developer experience

---

## 🎬 Demo Script for Sales Calls

**Opening (30 seconds):**
> "Let me show you a working example of how blockchain-powered identity solves supply chain trust. 
> This is a chocolate bar traveling from Ecuador to Netherlands."

**Step 1 (60 seconds):**
> "Here's Maria, an organic cocoa farmer in Ecuador. She issues a digital certificate proving her 
> cocoa is organic. This certificate is cryptographically signed - can't be forged."

**Step 2 (60 seconds):**
> "The chocolate factory receives the cocoa. Before producing, they VERIFY the organic certificate. 
> Only if it's valid do they proceed. They then issue their own production certificate that 
> references Maria's certificate."

**Step 3 (30 seconds):**
> "Now a consumer scans the QR code. In 2 seconds, they see the entire verified supply chain. 
> No phone calls. No waiting. Just instant cryptographic verification."

**Closing (30 seconds):**
> "This is what we build for companies. We can adapt this exact pattern for your products - 
> batteries, textiles, electronics, whatever you make."

**CTA:**
> "Want to see how this would work for YOUR products? Let's schedule 30 minutes next week."

---

## 📞 Contact & Support

**Questions?** Open an issue on GitHub  
**Research Collaboration?** Contact via Howest University

**Useful Links:**
- [GitHub Repository](https://github.com/flybylow/iota)
- [IOTA Discord](https://discord.iota.org)
- [DPP Working Group](https://cirpass2.eu/)

---

## 🎓 Educational Use

Perfect for:
- University courses on blockchain and supply chain
- DPP workshops and hackathons
- Industry demos on decentralized identity
- Learning W3C DID/VC standards
- Prototyping sustainable supply chain solutions

---

**Built with ❤️ for a more transparent, sustainable supply chain future**

*Last Updated: October 16, 2025*
