# IOTA Digital Product Passport - Developer Export

**Last Updated**: October 27, 2025  
**Purpose**: Complete reference for understanding the IOTA DPP project, including human-computer interaction patterns, AI collaboration rules, and technical architecture.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Setup & Environment](#setup--environment)
3. [AI Collaboration Rules](#ai-collaboration-rules)
4. [Project Goals & Phases](#project-goals--phases)
5. [Human-Computer Interaction (HCI) Insights](#human-computer-interaction-hci-insights)
6. [Technical Architecture](#technical-architecture)
7. [Key Learnings & Patterns](#key-learnings--patterns)
8. [Development Workflow](#development-workflow)
9. [Important Reminders](#important-reminders)

---

## Project Overview

### What We're Building

A **supply chain traceability demo** using IOTA Identity SDK to prove Digital Product Passport (DPP) implementation capability. The demo shows how blockchain-powered identity enables transparent, verifiable supply chains from farm to consumer.

### Business Context

- **Target Audience**: Manufacturers needing DPP compliance (batteries, textiles, food)
- **Use Case**: Proving capability to build EU Digital Product Passport systems
- **Value Proposition**: Show clients we can implement W3C DIDs and VCs for supply chain transparency
- **Demo Flow**: Ecuador farmer → Belgian factory → Netherlands consumer

### Tech Foundation

- Next.js 15 (React 19, TypeScript, TailwindCSS v4)
- IOTA Identity WASM SDK (@iota/identity-wasm)
- Demo mode (localStorage) for rapid iteration
- Blockchain mode (incomplete) for real IOTA Tangle integration

---

## Setup & Environment

### Prerequisites

```bash
# Required
Node.js 20+
npm or yarn
Git

# Optional (for blockchain mode)
IOTA testnet tokens (Shimmer)
IOTA wallet/cli tools
```

### Initial Setup

```bash
# Clone repository
git clone https://github.com/flybylow/iota.git
cd iota

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Structure

```
iota/
├── app/                   # Next.js app router pages
├── components/            # React components
│   ├── FarmerOrigin.tsx   # Step 1: Harvest input
│   ├── FactoryProduction.tsx  # Step 2: Verification & production
│   └── ConsumerJourney.tsx    # Step 3: Consumer view
├── lib/                   # Core logic
│   ├── iotaIdentity.ts        # Demo mode (localStorage)
│   └── iotaIdentityReal.ts    # Blockchain mode (IOTA Tangle)
├── types/                 # TypeScript definitions
└── docs/                  # Project documentation
    ├── meta/              # Developer documentation
    ├── dpp/               # DPP-specific docs
    └── onchain/           # Blockchain integration docs
```

### Key Configuration Files

- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript strict mode
- `tailwind.config.js` - TailwindCSS v4 configuration

---

## AI Collaboration Rules

### Core Principles

This project follows 4 fundamental AI collaboration rules:

#### Rule 1: Code Work First ⚡

**"Always do code work first so we can see results fast and documentation afterwards"**

- Priority: Working code → Testing → Documentation → Optimization
- Rationale: Fast iteration, immediate feedback, rapid prototyping
- Practice: Implement features before writing docs

#### Rule 2: No Code Yet (NCY) 🚫

**"Do not write code before I say so"**

- When active: Provide plans, specs, analysis only
- When lifted: Implement immediately, focus on working code
- Purpose: Prevent premature implementation

#### Rule 3: KISS (Keep It Simple, Stupid) 🎯

**"Go to basics, build from there, no long titles/explanations, get to core"**

- Implementation: Simple interfaces, essential features first
- Avoid: Over-engineering, complex explanations, feature creep
- Practice: Remove verbose UI, focus on core POC flow

#### Rule 4: Documentation Rule 📝

**"When (abbreviation) is used, add to ABBREVIATIONS.md; when : (dox) format used, create docs"**

- Abbreviations: Add to `.ai-instructions/core/ABBREVIATIONS.md`
- Docs format: Create comprehensive documentation
- Purpose: Maintain knowledge repository

### AI Rules Location

AI collaboration rules and guidance are documented in:
- `docs/meta/DEVELOPER-EXPORT.md` (this file) - Complete AI rules and patterns
- See "AI Collaboration Rules" section above for details

---

## Project Goals & Phases

### Overall Goal

Build a **working demo** that proves DPP implementation capability using IOTA Identity SDK. Focus on **business value over technical complexity**.

### Phase 1: Farmer Input & Factory Verification ✅ COMPLETE

**Goal**: Interactive harvest data input and traceability verification

**Key Features**:
- Farmer enters real harvest details (batch weight, variety, fermentation, drying)
- Factory verifies actual farmer data (not hardcoded)
- Production calculations from input (X kg cocoa → Y bars)
- Full traceability chain visible

**Learnings**:
- Interactive forms > static data for demos
- Calculate output from input to show value
- Display actual data throughout chain
- Remove verbose explanatory text (KISS principle)

### Phase 2: Consumer Journey Enhancement 🔄 IN PROGRESS

**Goal**: Display complete harvest and production details in consumer view

**Features**:
- Show actual harvest data from farmer credential
- Display production calculations from factory
- Visual timeline (Harvest → Production → Verified)
- Traceability metrics

### Phase 3: QR Code Integration 📋 PLANNED

**Goal**: Generate/scan QR codes for real-world product interaction

**Features**:
- QR code generation with product DIDs
- Mobile-friendly scanning interface
- Print-ready labels

### Phase 4: Blockchain Integration ⏸️ OPTIONAL

**Goal**: Real IOTA Tangle publishing (currently incomplete)

**Requirements**:
- IOTA testnet/mainnet tokens
- Wallet integration
- Publishing DID documents to Tangle
- Currently: Demo mode recommended

---

## Human-Computer Interaction (HCI) Insights

### Critical HCI Lessons Learned

#### 1. Interactive Forms Beat Static Data

**Observation**: Static placeholder data doesn't convince users of traceability.

**Solution**: Made harvest data fully interactive with real-time validation.

**Impact**: Users see their actual input throughout the chain, building trust.

**Pattern**:
```typescript
// ❌ Before: Static placeholder
const certificationData = { batchWeight: 2500 }; // Hardcoded

// ✅ After: User-driven input
const [harvestData, setHarvestData] = useState({
  batchWeight: 2500 // Default, but editable
});
```

#### 2. Input → Output Calculations Demonstrate Value

**Observation**: Users don't understand abstract data flows.

**Solution**: Show "2,500 kg cocoa → 17,500 bars" with clear formula.

**Impact**: Users immediately see how input affects output.

**Pattern**:
```typescript
// Calculate production units dynamically
const calculateProductionUnits = (harvestWeight: number): number => {
  return Math.floor(harvestWeight * 7); // 1 kg = 7 bars
};

// Display with context
<p>Input → Output: {input} kg cocoa → {output} bars (100g each)</p>
```

#### 3. Remove Verbose Explanatory Text

**Observation**: Marketing copy distracts from core POC flow.

**Solution**: Removed "Meet the Producer" collapsibles, long intro stories.

**Impact**: Users focus on supply chain verification, not prose.

**Pattern**: Apply KISS principle - show code first, explain later.

#### 4. White Input Fields Improve UX

**Observation**: Dark input fields blend with dark UI, hard to read.

**Solution**: Made inputs white background (`bg-white`) with dark text.

**Impact**: Better contrast, easier to read, professional appearance.

**Pattern**:
```tsx
<input className="bg-white text-gray-900 border border-gray-300" />
```

#### 5. Phase-by-Phase Implementation Maintains Focus

**Observation**: Trying to build everything at once causes scope creep.

**Solution**: Phased approach - one feature at a time, tested before next.

**Impact**: Each phase delivers value independently.

**Pattern**:
- Phase 1: Core data flow (farmer → factory)
- Phase 2: Consumer display enhancement
- Phase 3: QR integration
- Phase 4: Blockchain (optional)

#### 6. Visual Timeline Clarifies Journey

**Observation**: Text-based flows are hard to parse.

**Solution**: Visual timeline showing "Harvest → Production → Verified".

**Impact**: Users instantly understand supply chain steps.

**Pattern**:
```tsx
<div className="flex items-center gap-2">
  <Sprout /> Harvest →
  <Factory /> Production →
  <CheckCircle /> Verified
</div>
```

### User Testing Observations

#### What Works Well

- ✅ Interactive number inputs with min/max validation
- ✅ Dropdown selects for constrained choices (cocoa variety, drying method)
- ✅ Date pickers for temporal data
- ✅ Real-time calculation updates
- ✅ Success messages showing actual data entered

#### What Confused Users

- ❌ Too much explanatory text (removed in Phase 1)
- ❌ Collapsible sections (removed for simplicity)
- ❌ Marketing-style badges and features list (removed)
- ❌ Footer with regulatory compliance jargon (simplified)

### Accessibility Considerations

- Form labels for screen readers
- Keyboard navigation support
- Color contrast (white inputs on dark background)
- Responsive design (mobile-friendly)
- Clear error states (validation feedback)

---

## Technical Architecture

### Component Structure

```
app/page.tsx (Main orchestrator)
├── TabNavigation (Industry selection)
└── Step Components
    ├── FarmerOrigin
    │   ├── HarvestDataForm (state management)
    │   ├── CertificationIssue (credential creation)
    │   └── SuccessDisplay (certificate summary)
    ├── FactoryProduction
    │   ├── CertificateVerification (verify farmer credential)
    │   ├── ProductionCalculation (calculate output)
    │   └── IssueProductionCert (credential creation)
    └── ConsumerJourney
        ├── QRScannerSimulation
        ├── JourneyTimeline (display full chain)
        └── VerificationSummary
```

### Data Flow Pattern

```
1. User Input (Farmer)
   ↓
2. Credential Creation (DID + VC)
   ↓
3. localStorage Persistence
   ↓
4. Credential Retrieval (Factory)
   ↓
5. Data Parsing & Display
   ↓
6. Calculation Logic
   ↓
7. New Credential Creation (chains to previous)
   ↓
8. localStorage Persistence
   ↓
9. Consumer Display (full journey)
```

### Key Type Definitions

```typescript
// Credential Types
interface OriginCertificationData {
  batchWeight: number;
  cocoaVariety: string;
  harvestDate: string;
  fermentationDays: number;
  dryingMethod: string;
  origin: { country: string; region: string; farm: string };
}

interface ProductionCertificationData {
  unitsProduced: number;
  productionDate: string;
  qualityChecks: Array<{ test: string; result: string }>;
  recipe: { cocoaMass: number; sugar: number; cocoaButter: number };
}

// Main Credential Container
interface DPPCredential {
  jwt: string;
  issuerDID: string;
  credentialType: string;
  certificationData: OriginCertificationData | ProductionCertificationData;
  previousCredentials?: string[];
  onChain?: boolean;
}
```

### State Management Pattern

**Local Component State** (React hooks):
```typescript
const [harvestData, setHarvestData] = useState({
  batchWeight: 2500,
  cocoaVariety: 'Nacional',
  // ...
});
```

**Cross-Component State** (localStorage):
```typescript
// Save credential
localStorage.setItem('farmer-credential', JSON.stringify(credential));

// Retrieve credential
const farmer = JSON.parse(localStorage.getItem('farmer-credential') || '{}');
```

### IOTA Integration Layers

**Demo Mode** (`lib/iotaIdentity.ts`):
- Mock DID creation (string-based, no blockchain)
- JWT generation (unsigned for demo)
- localStorage persistence
- Fast, no network calls

**Blockchain Mode** (`lib/iotaIdentityReal.ts`):
- Real IOTA Identity WASM SDK
- DID document creation
- Private key generation (encrypted storage)
- ⚠️ Currently incomplete (DIDs created locally but not published)

---

## Key Learnings & Patterns

### Development Patterns That Work

#### 1. Controlled Form Inputs

**Always** use controlled components with `value` + `onChange`:
```typescript
<input
  type="number"
  value={harvestData.batchWeight}
  onChange={(e) => setHarvestData({...harvestData, batchWeight: parseInt(e.target.value) || 0})}
  min={100}
  max={10000}
/>
```

#### 2. Type-Safe Data Parsing

**Always** check if field exists before accessing:
```typescript
if (farmerCredential?.certificationData && 'batchWeight' in farmerCredential.certificationData) {
  const weight = farmerCredential.certificationData.batchWeight as number;
}
```

#### 3. Helper Functions for Calculations

**Extract** calculation logic into reusable functions:
```typescript
const calculateProductionUnits = (harvestWeight: number): number => {
  return Math.floor(harvestWeight * 7); // Formula: 1 kg = 7 bars
};
```

#### 4. Localized Formatting

**Always** format numbers and dates for locale:
```typescript
const formattedWeight = weight.toLocaleString(); // "2,500"
const formattedDate = new Date(date).toLocaleDateString(); // "10/27/2025"
```

### Anti-Patterns to Avoid

#### ❌ Don't Use defaultValue for Controlled Inputs

```typescript
// ❌ Wrong - only sets initial value
<input defaultValue={harvestData.batchWeight} />

// ✅ Correct - controlled value
<input value={harvestData.batchWeight} onChange={handleChange} />
```

#### ❌ Don't Cast Types Without Checking

```typescript
// ❌ Wrong - might crash if field missing
const weight = step.certificationData.batchWeight as number;

// ✅ Correct - check first
if ('batchWeight' in step.certificationData) {
  const weight = step.certificationData.batchWeight as number;
}
```

#### ❌ Don't Skip Error Handling

```typescript
// ❌ Wrong - no error handling
const cred = JSON.parse(localStorage.getItem('farmer-credential'));

// ✅ Correct - handle errors
try {
  const cred = JSON.parse(localStorage.getItem('farmer-credential') || '{}');
} catch (err) {
  console.error('Failed to parse credential:', err);
}
```

### Performance Considerations

- ✅ Use React hooks efficiently (useState, useEffect)
- ✅ Avoid unnecessary re-renders (memoization where needed)
- ✅ LocalStorage for demo data (fast, no server calls)
- ✅ TypeScript strict mode catches errors early

---

## Development Workflow

### Daily Development Cycle

1. **Pull latest changes** (including submodule updates)
   ```bash
   git pull
   git submodule update --remote
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Make changes** following:
   - AI rules (Code First, KISS)
   - HCI patterns (interactive forms, calculated outputs)
   - Type safety (TypeScript strict mode)

4. **Test changes**:
   - Clear localStorage: `localStorage.clear()`
   - Run through full flow: Farmer → Factory → Consumer
   - Verify calculations match expectations

5. **Commit changes** with descriptive messages
   ```bash
   git add .
   git commit -m "Phase 2: Add harvest details to consumer view"
   git push
   ```

### Debugging Tips

**Reset Demo State**:
```javascript
// Browser console
localStorage.clear();
location.reload();
```

**Inspect Credentials**:
```javascript
// Browser console
JSON.parse(localStorage.getItem('farmer-credential'));
JSON.parse(localStorage.getItem('factory-credential'));
```

**Check TypeScript Errors**:
```bash
npx tsc --noEmit
```

### Testing Checklist

Before marking a feature complete:

- [ ] All form inputs are functional
- [ ] Data flows correctly through all steps
- [ ] Calculations produce expected results
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] UI responsive on mobile
- [ ] Clear localStorage test passes
- [ ] Full flow works from start to finish

---

## Important Reminders

### Critical Success Factors

1. **Code First, Docs After** - Working code is more valuable than perfect documentation
2. **KISS Principle** - Simplicity over complexity, core features over nice-to-haves
3. **Interactive > Static** - Real inputs and calculations beat placeholder data
4. **Phase-by-Phase** - One feature at a time, tested and complete before next

### Common Pitfalls

- ❌ Over-engineering UI (keep it simple)
- ❌ Hardcoded data (use real user input)
- ❌ Skipping calculations (show value through output)
- ❌ Too much text (let the demo speak)
- ❌ Ignoring type safety (TypeScript catches bugs)

### When Stuck

1. **Re-read AI rules** - Apply Code First, KISS
2. **Check existing patterns** - Look at FarmerOrigin/FactoryProduction components
3. **Review HCI insights** - What worked in Phase 1?
4. **Test in browser** - Actual behavior > assumptions
5. **Ask for clarification** - Better questions than wrong assumptions

### Technology Decisions

**Why Demo Mode (localStorage)?**
- No blockchain setup required
- Fast iteration cycles
- No faucet/token issues
- Perfect for demonstrations

**Why IOTA Identity SDK?**
- W3C DID/VC standards compliance
- Feeless transactions (no gas fees)
- Production-ready SDK
- EU DPP compatible

**Why Next.js + TypeScript?**
- Fast development
- Type safety catches errors early
- Modern React patterns
- Excellent DX (Developer Experience)

---

## Quick Reference

### Key Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run lint             # ESLint check

# Git
git submodule update --init  # Initialize AI instructions
git submodule update --remote  # Update submodule

# Testing
# 1. Open browser console
# 2. Clear localStorage: localStorage.clear()
# 3. Refresh page
# 4. Run through full flow
```

### Key Files

- `components/FarmerOrigin.tsx` - Step 1: Harvest input
- `components/FactoryProduction.tsx` - Step 2: Verification
- `components/ConsumerJourney.tsx` - Step 3: Consumer view
- `types/dpp.ts` - Type definitions
- `lib/iotaIdentity.ts` - Demo mode logic
- `.ai-instructions/` - AI collaboration rules

### Key Patterns

- Controlled form inputs with useState
- Type-safe data parsing with type guards
- Helper functions for calculations
- LocalStorage for cross-component state
- Visual timeline for supply chain flow

---

## Conclusion

This project demonstrates how to build a **working DPP demo** that proves implementation capability. The key lessons are:

1. **Start simple** (Demo Mode, localStorage)
2. **Make it interactive** (real inputs, calculations)
3. **Focus on value** (traceability, calculations)
4. **Remove distractions** (verbose text, unnecessary features)
5. **Iterate fast** (Code First, KISS principles)

The demo is now at a point where it can be shown to potential clients as proof of DPP implementation capability. Future phases (QR codes, blockchain integration) are optional enhancements.

**Remember**: The goal is to prove capability, not build production software. Keep it simple, interactive, and focused on demonstrating supply chain traceability.
