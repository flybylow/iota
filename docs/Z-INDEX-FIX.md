# Z-Index Fix for Dropdown Panels

## Problem
Dropdown panels (industry selector and mode toggle) were appearing behind the main content on mobile devices, making them inaccessible.

## Root Cause Analysis

### Issue 1: Absolute Positioning
Dropdowns were using `position: absolute` which positions them relative to their nearest positioned parent. When parent containers have:
- `position: relative`
- Transform properties (creates stacking context)
- Isolation properties
- Other stacking context creators

The `absolute` positioned dropdowns get constrained within that stacking context, preventing them from appearing above sibling elements.

### Issue 2: Z-Index Hierarchy
Even with correct z-index values, when dropdowns are `absolute` positioned, they're still part of the parent's stacking context, which may be below the main content.

## Solution

### Changed to Fixed Positioning
Changed dropdowns from `absolute` to `fixed` positioning, which positions them relative to the viewport, not the parent container.

**Before:**
```tsx
<div className="absolute top-full right-0 ... z-[110]">
```

**After:**
```tsx
<div 
  className="fixed right-4 ... z-[110]"
  style={{ top: '73px' }} // Height of topnav
>
```

### Why Fixed Positioning Works
1. **Viewport-Relative**: `fixed` positions relative to the viewport, escaping parent stacking contexts
2. **Consistent Positioning**: `top: 73px` ensures dropdown appears right below the topnav
3. **No Parent Dependencies**: Not affected by parent transforms, isolation, or other properties

### Final Z-Index Hierarchy
```
Topnav container: z-[100] (fixed, isolation: isolate)
  ├─ Industry dropdown backdrop: z-[98] (fixed, full screen)
  ├─ Industry dropdown panel: z-[110] (fixed, below topnav)
  ├─ Mode toggle backdrop: z-[98] (fixed, full screen)
  └─ Mode toggle panel: z-[120] (fixed, below topnav)
Main content: z-0 (explicitly set, stays below topnav)
```

## Files Changed
- `app/page.tsx`: 
  - Changed industry dropdown from `absolute` to `fixed` positioning
  - Added explicit `top: 73px` positioning
- `components/ModeToggle.tsx`: 
  - Changed mode toggle dropdown from `absolute` to `fixed` positioning
  - Added explicit `top: 73px` positioning

## Testing
- ✅ Dropdowns appear above main content on mobile
- ✅ Dropdowns position correctly below topnav
- ✅ Backdrops properly darken the background
- ✅ Click outside dropdown closes it
- ✅ No stacking context conflicts
- ✅ Works across all screen sizes

