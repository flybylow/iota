# IOTA DID Explorer for Digital Product Passports

A working demonstration of decentralized identity (DIDs) and verifiable credentials on IOTA, adapted for supply chain and Digital Product Passport (DPP) use cases.

![IOTA DID Explorer](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![IOTA](https://img.shields.io/badge/IOTA-Identity-teal) ![DPP](https://img.shields.io/badge/DPP-Ready-green)

---

## 🎯 What This Is

This is a **proof-of-concept** showing how **IOTA Decentralized Identifiers (DIDs)** and **Verifiable Credentials (VCs)** can power the next generation of **Digital Product Passports** for EU compliance.

**Built for:** Supply chain transparency, product authentication, and regulatory compliance  
**Based on:** W3C DID standards + IOTA Identity SDK  
**Use case:** Adaptable for chocolate, batteries, textiles, electronics supply chains

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

## ✨ Features

### Current Implementation
- ✅ **Create Decentralized Identities (DIDs)** - Each supply chain actor gets a unique DID
- ✅ **Issue Verifiable Credentials** - Certifications, origin certificates, quality tests
- ✅ **Verify Credentials** - Cryptographic verification without central authority
- ✅ **Pre-filled Demo Data** - Test instantly with example credentials
- ✅ **Browser Persistence** - LocalStorage for demo purposes
- ✅ **Beautiful UI** - Modern interface with educational tooltips

### Digital Product Passport Ready
- ✅ **W3C DID Standard Compliant** - Future-proof identity framework
- ✅ **IOTA Tangle Integration** - Fee-less, scalable blockchain
- ✅ **Supply Chain Tracking** - Track products from origin to consumer
- ✅ **No Transaction Fees** - Perfect for high-volume product authentication
- ✅ **Offline-First Ready** - Credentials work without constant connectivity

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

## 📖 Use Cases

### Current Demo: University Degrees
1. **University** creates DID → Issues degree credential to student
2. **Student** holds credential in digital wallet
3. **Employer** verifies authenticity cryptographically
4. ✅ **Result:** Tamper-proof, instantly verifiable degree

### Adapted for DPP: Chocolate Supply Chain

#### Scenario: Bean-to-Bar Traceability

**Supply Chain Actors:**
1. 🌱 **Cocoa Farmer** (Ghana)
   - DID: `did:iota:smr:0x1a2b3c...`
   - Issues: Organic farming credential

2. 🏭 **Processing Factory** (Belgium)
   - DID: `did:iota:smr:0x4d5e6f...`
   - Verifies: Farmer's organic cert
   - Issues: Production credential (batch #, date, factory cert)

3. 🔬 **Quality Lab** (TÜV)
   - DID: `did:iota:smr:0x7g8h9i...`
   - Verifies: Factory credential
   - Issues: Quality test results (heavy metals, purity)

4. 🛍️ **Consumer** (EU)
   - Scans QR code on chocolate bar
   - Sees complete, verified supply chain
   - Trusts product origin and quality

#### How It Works

```
Farmer              Factory             Lab                 Consumer
  |                    |                  |                     |
  | 1. Create DID      |                  |                     |
  |----------------    |                  |                     |
  |                    |                  |                     |
  | 2. Issue Organic   |                  |                     |
  |    Credential      |                  |                     |
  |------------------->|                  |                     |
  |                    | 3. Verify Farmer |                     |
  |                    |    Credential    |                     |
  |                    |---------------   |                     |
  |                    |                  |                     |
  |                    | 4. Issue         |                     |
  |                    |    Production    |                     |
  |                    |    Credential    |                     |
  |                    |----------------->|                     |
  |                    |                  | 5. Verify Factory   |
  |                    |                  |    Credential       |
  |                    |                  |----------------     |
  |                    |                  |                     |
  |                    |                  | 6. Issue Test       |
  |                    |                  |    Results          |
  |                    |                  |-------------------->|
  |                    |                  |                     |
  |                    |                  |                     | 7. Scan QR
  |                    |                  |                     |    See Chain
  |                    |                  |                     |<-----------
```

---

## 🔧 How It Works

### Tab 1: Create DID
**For:** Supply chain actors (farmers, factories, labs)
- Generates unique decentralized identifier
- Format: `did:iota:smr:0x...` (Shimmer testnet)
- No central authority required
- Cryptographically secure

### Tab 2: Issue Credential
**For:** Issuing certifications, test results, origin proofs
- Issuer DID required (created in Tab 1)
- Holder DID (recipient - can be product, batch, or company)
- Claims: Customizable data (origin, quality, certifications)
- Digitally signed and tamper-proof

### Tab 3: Verify Credential
**For:** Anyone in supply chain or end consumers
- Paste credential to verify
- Cryptographic validation
- Check expiration dates
- See full credential details

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

**Built at:** Howest University of Applied Sciences  
**Research Area:** Digital Product Passports for supply chain transparency  
**Inspired by:** EU ESPR regulations and circular economy initiatives

**Special thanks to:**
- IOTA Foundation for the Identity SDK
- W3C for DID/VC standards
- CIRPASS-2 project for DPP framework guidance
- Next.js team for excellent developer experience

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
