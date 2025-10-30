# Documentation Agent Rules & Log

**Purpose**: Rules and patterns for keeping all documentation clean, organized, and maintainable.

**Last Updated**: January 2025  
**Maintained by**: Documentation Agent

---

## 📋 Table of Contents

1. [File Organization](#file-organization)
2. [Naming Conventions](#naming-conventions)
3. [File Structure Patterns](#file-structure-patterns)
4. [Content Standards](#content-standards)
5. [Folder Hierarchy](#folder-hierarchy)
6. [Documentation Lifecycle](#documentation-lifecycle)
7. [Maintenance Tasks](#maintenance-tasks)
8. [Quality Checklist](#quality-checklist)

---

## 📁 File Organization

### Folder Structure Rules

**Main Folders (Root `docs/`):**
- `archive/` - Historical/completed documentation (immutable)
- `changelog/` - Change history
- `deployment/` - Deployment guides
- `dpp/` - Digital Product Passport specific docs
- `getting-started/` - Onboarding guides
- `history/` - Milestone/historical events
- `knowledge/` - Knowledge base (solutions, patterns, cross-project)
- `meta/` - Meta documentation (this file, developer exports, next steps)
- `migrations/` - Network/version migration records
- `onchain/` - Blockchain implementation details
- `untp/` - UNTP compliance documentation
- `ux/` - UX documentation
- `writing/` - Writing style guides

**Root Files:**
- `README.md` - Main documentation index
- `STATUS.md` - Current project status
- `CHANGELOG.md` - Recent changes summary
- `PROJECT-OVERVIEW.md` - High-level project overview
- `AI-RULES.md` - AI collaboration rules
- `DEVELOPER-ONBOARDING.md` - Developer quick start

### Folder Naming Rules

1. **Lowercase with hyphens**: `getting-started/`, `onchain/`
2. **Singular nouns**: `changelog/` not `changelogs/`
3. **Short, clear names**: `ux/` not `user-experience/`
4. **No nesting beyond 2 levels**: `knowledge/cross-project/` is max depth

---

## 📝 Naming Conventions

### File Naming Rules

**Status/Completion Files:**
- Format: `UPPERCASE-KEBAB-CASE.md`
- Examples: `STATUS.md`, `BLOCKCHAIN-SUCCESS.md`, `TRANSACTION-ERROR-FIX.md`
- Use for: Major status updates, completion announcements, critical fixes

**Guide Files:**
- Format: `UPPERCASE-TITLE.md` or `Title-Case.md`
- Examples: `QUICK-START.md`, `DEPLOYMENT-GUIDE.md`, `TROUBLESHOOTING.md`
- Use for: How-to guides, tutorials, references

**Index Files:**
- Format: `README.md` (always)
- Use in: Every folder that has organized subcontent
- Purpose: Navigation and quick access

**Troubleshooting Files:**
- Format: `PROBLEM-NAME-SOLUTION.md` or `PROBLEM-FIX.md`
- Examples: `TRANSACTION-ERROR-FIX.md`, `WASM-MODULE-RESOLUTION.md`
- Include: Problem description, solution, prevention

### File Naming Don'ts

❌ Avoid:
- Dates in filenames: `STATUS-2025-01.md` (use "Last Updated" in content)
- Version numbers: `STATUS-v2.md` (archive old versions if needed)
- Spaces: `STATUS UPDATE.md` (use hyphens)
- Special characters: `STATUS#2.md` (only hyphens and dots)

---

## 📄 File Structure Patterns

### Standard Document Template

```markdown
# Document Title

**Purpose**: Brief description  
**Last Updated**: [Date]  
**Status**: [✅ Complete | ⏳ In Progress | 📋 Planned]

---

## Section 1

Content here.

### Subsection

More content.

---

## Related Documents

- [`RELATED-DOC.md`](./related-doc.md) - Description
- [`FOLDER/OTHER-DOC.md`](./folder/other-doc.md) - Description

---

**Last Updated**: [Date]
```

### Status Document Pattern

```markdown
# Status Title

## ✅ Current Status: [Status Name]

### Feature/Component Status

**Feature Name:**
- ✅ Completed
- ⏳ In progress
- ❌ Not started
- ⚠️ Needs attention

**Details:**
[Specific information]

---

## Key Points

1. Point 1
2. Point 2

---

## Recent Changes

- Date: Change description
```

### Guide Document Pattern

```markdown
# Guide Title

**Purpose**: What this guide teaches  
**Audience**: Who should read this  
**Time Required**: ~X minutes

---

## Quick Start

Step 1...
Step 2...

---

## Detailed Steps

### Step 1: Title

Content...

### Step 2: Title

Content...

---

## Troubleshooting

**Problem**: Description  
**Solution**: How to fix

---

## Related Resources

- [Link 1](./doc1.md)
- [External Link](https://...)

---

**Last Updated**: [Date]
```

---

## ✍️ Content Standards

### Writing Style

**Follow**: `docs/writing/TONE-GUIDE.md`

**Key Principles:**
1. **Friendly & Approachable** - Conversational, not corporate
2. **Clear & Concise** - Short sentences, one idea per sentence
3. **Positive & Empowering** - Focus on what users CAN do
4. **Visual & Scannable** - Emojis sparingly, bullets, checkmarks

### Required Metadata

Every document should include at the top:
- **Purpose**: One-line description (if needed)
- **Last Updated**: Date (YYYY-MM-DD or Month YYYY)
- **Status**: If applicable (✅ ⏳ ❌ ⚠️)

### Headers Hierarchy

```markdown
# Main Title (H1 - only one per document)
## Major Section (H2)
### Subsection (H3)
#### Sub-subsection (H4 - use sparingly)
```

### Status Indicators

Use consistently:
- ✅ Complete/Working
- ❌ Not working/Removed
- ⏳ In Progress
- ⚠️ Warning/Needs Attention
- 🔧 To Fix
- 📋 Planned

### Links

**Internal Links:**
```markdown
- [`Document Name`](./path/to/doc.md) - Description
- [`../folder/doc.md`](../folder/doc.md) - Description
```

**External Links:**
```markdown
- [Link Text](https://example.com) - Description
```

### Code Blocks

**For examples:**
```typescript
// Code example
const example = "use language tags";
```

**For file references:**
```12:14:path/to/file.ts
// Existing code from codebase
const code = reference.code;
```

---

## 🗂️ Folder Hierarchy

### Category Classification

**When creating new docs, place in appropriate folder:**

| Content Type | Folder | Examples |
|-------------|--------|----------|
| Onboarding | `getting-started/` | START-HERE.md, QUICK-START.md |
| Implementation details | `onchain/`, `dpp/`, `untp/` | Feature-specific |
| Problem solving | `knowledge/problems-solved/` | wasm-integration.md |
| Historical | `history/`, `archive/` | Milestones, completed work |
| Status updates | Root or relevant folder | STATUS.md, onchain/BLOCKCHAIN-SUCCESS.md |
| Meta docs | `meta/` | This file, NEXT-STEPS.md |
| Guides | Root or topic folder | DEPLOYMENT-GUIDE.md |

### When to Create New Folder

Create a new folder when:
- ✅ You have 3+ related documents
- ✅ Documents belong to a distinct feature/domain
- ✅ Documents will grow over time

Don't create when:
- ❌ Only 1-2 documents
- ❌ One-off documentation
- ❌ Temporary/troubleshooting docs

---

## 🔄 Documentation Lifecycle

### Document States

**Active:**
- Current, frequently updated
- In root or appropriate feature folder
- Linked from README or index

**Stable:**
- Complete, rarely changed
- In appropriate folder
- May be linked from multiple places

**Historical:**
- Completed work, no longer current
- Move to `archive/` or `history/`
- Keep for reference

**Deprecated:**
- Replaced by newer docs
- Mark clearly: `⚠️ DEPRECATED: See [NEW-DOC.md](./new-doc.md)`
- Can archive after transition period

### Archiving Rules

**Move to `archive/` when:**
- Work is complete and replaced
- Document is outdated but valuable for history
- Document is superseded by newer version

**Move to `history/` when:**
- Milestone or important event
- Significant project phase completion
- Worth preserving as project history

**Delete when:**
- Completely wrong/incorrect
- Superseded with no historical value
- Duplicate content

---

## 🧹 Maintenance Tasks

### Regular Tasks

**Weekly:**
- Review `CHANGELOG.md` - ensure recent changes documented
- Check `STATUS.md` - update if needed

**Monthly:**
- Audit broken links
- Review `archive/` - remove if truly obsolete
- Update "Last Updated" dates on active docs
- Review file organization - move misplaced docs

**Quarterly:**
- Major documentation review
- Consolidate duplicate content
- Update cross-references
- Review folder structure

### Link Maintenance

**Check for broken links:**
- Internal links between docs
- External links (may break over time)
- File paths in code examples

**Update links when:**
- Files are moved or renamed
- External URLs change
- Documentation structure changes

### Content Freshness

**Update "Last Updated" when:**
- Content changes significantly
- Status changes
- New information added
- Errors corrected

**Don't update when:**
- Only formatting changes
- Minor typo fixes
- Link-only updates

---

## ✅ Quality Checklist

Before considering documentation complete:

### Structure
- [ ] Document has clear title
- [ ] Purpose/description at top
- [ ] "Last Updated" date present
- [ ] Proper header hierarchy (H1 → H2 → H3)
- [ ] Sections logically organized

### Content
- [ ] Follows tone guide (friendly, clear)
- [ ] Status indicators used correctly
- [ ] Code examples work (if applicable)
- [ ] Links tested and valid
- [ ] No broken references

### Organization
- [ ] In correct folder
- [ ] Named according to conventions
- [ ] Linked from appropriate README/index
- [ ] Cross-references to related docs

### Completeness
- [ ] All sections filled (no TODOs)
- [ ] Examples provided where helpful
- [ ] Related documents linked
- [ ] Troubleshooting included (if applicable)

---

## 📊 Documentation Patterns

### Problem-Solution Pattern

Use in `knowledge/problems-solved/` or troubleshooting docs:

```markdown
# Problem Name

**Problem**: Clear description  
**Impact**: What was affected  
**Solution**: How it was fixed  
**Prevention**: How to avoid in future

---

## Details

[Detailed explanation]

---

## References

- Related docs
- Related code files
```

### Implementation Pattern

Use for feature documentation:

```markdown
# Feature Name Implementation

**Status**: ✅ Complete  
**Date**: YYYY-MM-DD

---

## Overview

What was implemented.

---

## Implementation Steps

1. Step 1
2. Step 2

---

## Key Files

- `path/to/file.ts` - Description

---

## Testing

How to test...

---

## Future Enhancements

- Enhancement 1
- Enhancement 2
```

---

## 🔍 Discovery & Search

### Finding Documentation

**By topic:**
- Check `docs/README.md` for main index
- Look in feature-specific folders (`onchain/`, `dpp/`)
- Search knowledge base (`knowledge/`)

**By status:**
- `STATUS.md` for current project status
- `CHANGELOG.md` for recent changes
- `history/` for milestones

**By purpose:**
- `getting-started/` for onboarding
- `deployment/` for deployment
- `knowledge/problems-solved/` for solutions

---

## 📝 Documenting Changes

### When Creating New Docs

1. **Choose location** - Based on folder rules
2. **Name correctly** - Follow naming conventions
3. **Use template** - Standard structure
4. **Link appropriately** - From README or index
5. **Update indexes** - If needed (README, file lists)

### When Updating Existing Docs

1. **Update content** - Make changes
2. **Update "Last Updated"** - Change date
3. **Update cross-references** - If structure changed
4. **Check links** - Ensure still valid
5. **Update CHANGELOG** - Document significant changes

### When Archiving Docs

1. **Mark as archived** - Add note at top if keeping
2. **Move to archive/** - Move file
3. **Update links** - Point to new location or replacement
4. **Update indexes** - Remove from active lists

---

## 🚨 Anti-Patterns to Avoid

### ❌ Don't Do This

**Duplicate content:**
- Don't copy entire sections - link instead
- Don't maintain multiple versions - archive old

**Poor organization:**
- Don't put random docs in root
- Don't create folders for 1-2 files
- Don't nest too deeply (max 2 levels)

**Stale information:**
- Don't leave outdated status
- Don't forget to update "Last Updated"
- Don't keep broken links

**Poor naming:**
- Don't use dates in filenames
- Don't use spaces or special chars
- Don't use vague names like `doc1.md`

**Inconsistent style:**
- Don't mix formatting styles
- Don't ignore tone guide
- Don't skip metadata

---

## 📚 Key Reference Documents

**For Content:**
- [`writing/TONE-GUIDE.md`](../writing/TONE-GUIDE.md) - Writing style
- [`AI-RULES.md`](../AI-RULES.md) - AI collaboration rules

**For Structure:**
- [`README.md`](../README.md) - Main documentation index
- [`PROJECT-OVERVIEW.md`](../PROJECT-OVERVIEW.md) - Project structure

**For Status:**
- [`STATUS.md`](../STATUS.md) - Current status
- [`CHANGELOG.md`](../CHANGELOG.md) - Changes log

---

## 🔄 Rules Update Log

**2025-01** - Initial documentation rules created
- Collected patterns from existing docs
- Established naming conventions
- Defined folder hierarchy
- Created quality checklist

---

**Last Updated**: January 2025  
**Maintained by**: Documentation Agent  
**Purpose**: Keep all documentation clean, organized, and maintainable

