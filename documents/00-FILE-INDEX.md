# File Index - Quick Reference

**Quick navigation guide to all project files**

---

## 📂 Application Files

### Core Application
| File | Purpose | Lines |
|------|---------|-------|
| `app/page.tsx` | Main app UI with tab navigation | ~120 |
| `app/layout.tsx` | Root layout + metadata | ~35 |
| `app/globals.css` | Global styles | ~50 |

### Components
| File | Purpose | Lines |
|------|---------|-------|
| `components/CreateDID.tsx` | Create DID interface | ~200 |
| `components/IssueCredential.tsx` | Issue credential interface | ~280 |
| `components/VerifyCredential.tsx` | Verify credential interface | ~250 |

### Business Logic
| File | Purpose | Lines |
|------|---------|-------|
| `lib/iotaIdentity.ts` | IOTA SDK wrapper functions | ~300 |
| `types/index.ts` | TypeScript type definitions | ~20 |

---

## 📚 Documentation Files

### User-Facing
| File | Purpose | Audience |
|------|---------|----------|
| `README.md` | Quick start + overview | All users |

### Developer Documentation
| File | Purpose | Audience |
|------|---------|----------|
| `documents/00-FILE-INDEX.md` | This file - quick reference | Developers |
| `documents/00-PROJECT-OVERVIEW.md` | High-level architecture | All |
| `documents/01-SETUP-STEPS.md` | Build progress log | Developers |
| `documents/02-IMPLEMENTATION.md` | Technical deep dive | Developers |
| `documents/03-TESTING-GUIDE.md` | Testing scenarios | Testers/QA |
| `documents/04-FINAL-SUMMARY.md` | Project completion summary | All |

---

## ⚙️ Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies + scripts |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.ts` | Tailwind CSS setup |
| `next.config.ts` | Next.js configuration |
| `.gitignore` | Git ignore rules |
| `postcss.config.mjs` | PostCSS setup |
| `.eslintrc.json` | ESLint rules |

---

## 🗂️ Directory Structure

```
iota/
│
├── app/                          # Next.js App Router
│   ├── page.tsx                 ⭐ Main application
│   ├── layout.tsx               ⭐ Root layout
│   ├── globals.css              ⭐ Global styles
│   └── favicon.ico
│
├── components/                   # React Components
│   ├── CreateDID.tsx            ⭐ Tab 1: Create DID
│   ├── IssueCredential.tsx      ⭐ Tab 2: Issue Credential
│   └── VerifyCredential.tsx     ⭐ Tab 3: Verify Credential
│
├── lib/                          # Business Logic
│   └── iotaIdentity.ts          ⭐ IOTA SDK wrapper
│
├── types/                        # Type Definitions
│   └── index.ts                 ⭐ Shared types
│
├── documents/                    # Documentation
│   ├── 00-FILE-INDEX.md         📖 This file
│   ├── 00-PROJECT-OVERVIEW.md   📖 Architecture
│   ├── 01-SETUP-STEPS.md        📖 Build log
│   ├── 02-IMPLEMENTATION.md     📖 Technical details
│   ├── 03-TESTING-GUIDE.md      📖 Testing guide
│   └── 04-FINAL-SUMMARY.md      📖 Summary
│
├── node_modules/                 # Dependencies (gitignored)
├── .next/                        # Next.js build (gitignored)
│
├── package.json                  ⚙️ Dependencies
├── tsconfig.json                 ⚙️ TypeScript config
├── tailwind.config.ts           ⚙️ Tailwind config
├── next.config.ts               ⚙️ Next.js config
├── .gitignore                   ⚙️ Git ignore
├── postcss.config.mjs           ⚙️ PostCSS config
├── .eslintrc.json               ⚙️ ESLint config
└── README.md                     📖 Main README

⭐ = Core files you'll edit
📖 = Documentation
⚙️ = Configuration
```

---

## 🎯 Quick Access by Task

### I want to...

#### Understand the project
1. Read `README.md`
2. Read `documents/00-PROJECT-OVERVIEW.md`
3. Read `documents/04-FINAL-SUMMARY.md`

#### Learn how it was built
1. Read `documents/01-SETUP-STEPS.md`
2. Read `documents/02-IMPLEMENTATION.md`

#### Test the application
1. Read `documents/03-TESTING-GUIDE.md`
2. Read `README.md` (Quick Start section)

#### Modify the UI
1. Edit `app/page.tsx` (tab navigation)
2. Edit `components/*.tsx` (individual tabs)
3. Edit `app/globals.css` (styles)

#### Change business logic
1. Edit `lib/iotaIdentity.ts`
2. Update `types/index.ts` if types change

#### Add new features
1. Read `documents/02-IMPLEMENTATION.md`
2. Read `documents/04-FINAL-SUMMARY.md` (Extensions section)
3. Create new components in `components/`

---

## 📊 File Statistics

### By Category
- **Application Code**: 8 files (~1,500 lines)
- **Documentation**: 6 files (~3,500 lines)
- **Configuration**: 7 files (~200 lines)
- **Total**: 21 files (~5,200 lines)

### By Language
- **TypeScript/TSX**: ~1,500 lines
- **Markdown**: ~3,500 lines
- **CSS**: ~50 lines
- **JSON/Config**: ~200 lines

---

## 🔍 Key Files Explained

### `app/page.tsx`
**What**: Main application UI  
**Contains**: Tab navigation, gradient header, footer  
**Uses**: All three component modules  
**Edit when**: Changing overall layout or navigation

### `components/CreateDID.tsx`
**What**: DID creation interface  
**Contains**: Create button, loading state, success display  
**Uses**: `lib/iotaIdentity.createDID()`  
**Edit when**: Changing DID creation UX

### `components/IssueCredential.tsx`
**What**: Credential issuance interface  
**Contains**: Form, DID selection, credential display  
**Uses**: `lib/iotaIdentity.issueCredential()`  
**Edit when**: Changing credential types or fields

### `components/VerifyCredential.tsx`
**What**: Credential verification interface  
**Contains**: Input area, recent credentials, validation display  
**Uses**: `lib/iotaIdentity.verifyCredential()`  
**Edit when**: Changing verification logic or display

### `lib/iotaIdentity.ts`
**What**: IOTA SDK wrapper  
**Contains**: `createDID()`, `issueCredential()`, `verifyCredential()`  
**Uses**: `@iota/identity-wasm`  
**Edit when**: Changing IOTA integration or adding features

### `types/index.ts`
**What**: TypeScript type definitions  
**Contains**: `DIDCreationResult`, `CredentialData`, etc.  
**Uses**: Throughout the app  
**Edit when**: Adding new data structures

---

## 🚀 Getting Started Fast

### 1. Run the App
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### 2. Understand the Code
Read in order:
1. `README.md` (5 min)
2. `documents/00-PROJECT-OVERVIEW.md` (10 min)
3. `app/page.tsx` (5 min)
4. `lib/iotaIdentity.ts` (10 min)
5. One component file (10 min)

**Total**: ~40 minutes to full understanding

### 3. Make Your First Change
Try:
1. Change a color in `app/page.tsx`
2. Add a new field to credentials in `components/IssueCredential.tsx`
3. Change validation logic in `lib/iotaIdentity.ts`

---

## 📝 Documentation Reading Order

### For Non-Technical Users
1. `README.md` - Overview
2. `documents/04-FINAL-SUMMARY.md` - What it does
3. `documents/03-TESTING-GUIDE.md` - How to use it

### For Developers
1. `README.md` - Quick start
2. `documents/00-PROJECT-OVERVIEW.md` - Architecture
3. `documents/02-IMPLEMENTATION.md` - Technical details
4. `documents/01-SETUP-STEPS.md` - How it was built
5. `documents/03-TESTING-GUIDE.md` - Testing
6. `documents/04-FINAL-SUMMARY.md` - Summary

### For Learning DID/VC Concepts
1. `README.md` - Basic concepts
2. `documents/00-PROJECT-OVERVIEW.md` - Key concepts section
3. Use the app - hands-on learning
4. `documents/02-IMPLEMENTATION.md` - Technical deep dive

---

## 🔗 File Dependencies

### Component Dependencies
```
app/page.tsx
  ├── components/CreateDID.tsx
  │   └── lib/iotaIdentity.ts
  ├── components/IssueCredential.tsx
  │   └── lib/iotaIdentity.ts
  └── components/VerifyCredential.tsx
      └── lib/iotaIdentity.ts

All use: types/index.ts
```

### Import Chain
```
Components
  ↓ import from
lib/iotaIdentity.ts
  ↓ import from
@iota/identity-wasm
  ↓ fetches from
IOTA Testnet (Shimmer)
```

---

## 💡 Tips for Navigation

### Finding Things Fast

**Search by concept**:
- DID creation → `components/CreateDID.tsx`, `lib/iotaIdentity.ts`
- Styling → `app/globals.css`, `tailwind.config.ts`
- Types → `types/index.ts`
- Documentation → `documents/` folder

**Search by feature**:
- Tab navigation → `app/page.tsx`
- Forms → `components/IssueCredential.tsx`
- Validation → `components/VerifyCredential.tsx`

**Search by file type**:
- `.tsx` = React components (UI)
- `.ts` = TypeScript utilities (logic)
- `.css` = Styles
- `.md` = Documentation
- `.json` / `.ts` config = Configuration

---

## 🎓 Learning Path

### Beginner
1. Use the app (no code)
2. Read `README.md`
3. Read inline comments in `app/page.tsx`

### Intermediate
1. Understand component structure
2. Read `documents/02-IMPLEMENTATION.md`
3. Modify a component

### Advanced
1. Deep dive into `lib/iotaIdentity.ts`
2. Read IOTA SDK docs
3. Add production features

---

## 📞 Where to Get Help

### Code Questions
- Inline comments in files
- `documents/02-IMPLEMENTATION.md`

### Usage Questions
- `README.md`
- `documents/03-TESTING-GUIDE.md`

### Concept Questions
- `documents/00-PROJECT-OVERVIEW.md`
- W3C DID/VC specs (linked in docs)

### IOTA-Specific Questions
- IOTA Identity docs
- IOTA Discord community

---

**Last Updated**: October 16, 2025

**Navigate confidently!** 🧭

