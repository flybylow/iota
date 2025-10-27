# Knowledge Management System

**Purpose**: Track prompts, problems, and solutions across projects for better collaboration.

---

## System Overview

This system allows you to:
1. **Track important prompts** - Document what you asked and how AI responded
2. **Store solutions** - Record problems solved with reusable patterns
3. **Cross-project learning** - Reference other projects (like aigo) and apply learnings here
4. **Quick lookup** - Find solutions faster in future work

---

## Directory Structure

```
docs/knowledge/
├── README.md                    # Main index
├── SYSTEM.md                    # This file - system explanation
├── cross-project/               # External project references
│   ├── aigo-reference.md        # Patterns from aigo
│   ├── templates/              # Standard templates
│   │   ├── problem-template.md
│   │   └── solution-template.md
│   └── README.md
├── problems-solved/            # Solutions documented
│   ├── wasm-integration.md     # ✅ WASM fix
│   ├── onchain-implementation.md # ✅ Blockchain integration
│   └── README.md
└── prompts/                    # Important prompts
    └── README.md
```

---

## How It Works

### When We Solve a Problem

1. I document it in `problems-solved/[problem-name].md`
2. I include:
   - Your original prompt
   - The problem description
   - Solution approach
   - Code patterns
   - Why it worked
   - Cross-project applicability

### When You Give an Important Prompt

1. I add it to `prompts/[date]-[topic].md`
2. Includes:
   - The prompt
   - Context
   - What AI understood
   - The solution
   - Whether it worked

### When We Reference Other Projects

1. I create/reference files in `cross-project/`
2. Document patterns from other repos (like aigo)
3. Show how to adapt them here

---

## Template Usage

### Problem Template
Use when documenting a solved problem:
- Copy from `cross-project/templates/problem-template.md`
- Fill in details
- Save to `problems-solved/`

### Solution Template
Use when documenting a cross-project pattern:
- Copy from `cross-project/templates/solution-template.md`
- Fill in adaptation details
- Save to `cross-project/`

---

## Quick Start

### For You
- **Find solutions**: Check `problems-solved/README.md`
- **See prompts**: Check `prompts/` folder
- **Cross-references**: Check `cross-project/`

### For AI (Me)
When starting a task:
1. Check knowledge base for similar problems
2. Reference `cross-project/` if relevant
3. Document new solutions as we work
4. Update indexes

---

## Adding New Content

### Problem Solved
```bash
# I'll create this automatically when we solve a problem
docs/knowledge/problems-solved/your-problem-name.md
```

### Important Prompt
```bash
# I'll document important prompts we encounter
docs/knowledge/prompts/2025-10-prompt-topic.md
```

### Cross-Project Reference
```bash
# When referencing other projects
docs/knowledge/cross-project/project-name-reference.md
```

---

## Current Status

### ✅ Documented (2 problems)
- WASM Integration - Next.js + IOTA SDK
- On-Chain Implementation - Blockchain integration

### 📝 Coming Soon
- Prompt examples
- More cross-project references
- Additional problems as they're solved

---

## Benefits

1. **Faster Problem Solving** - Reuse solutions from before
2. **Pattern Recognition** - Spot repeated patterns
3. **Cross-Project Learning** - Apply what works elsewhere
4. **Knowledge Preservation** - Don't lose learnings
5. **Better Collaboration** - Shared understanding

---

## AI Behavior

When you ask me to work on something:
1. I check knowledge base first
2. Reference similar problems
3. Apply proven patterns
4. Document new solutions
5. Update indexes

---

**Last Updated**: October 2025  
**Status**: Active - System Ready
