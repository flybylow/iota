# Testing Phase 1: Harvest Input & Traceability

## Quick Test Guide

Your dev server should be running at: **http://localhost:3000**

---

## Test the Complete Flow

### ✅ Test 1: Default Values (2,500 kg)

1. Open http://localhost:3000
2. **Select Industry**: Click "Food & Beverage" (chocolate)
3. **Step 1 - Farmer**:
   - Notice the form has editable fields (no longer disabled!)
   - Default values: 2,500 kg, Nacional variety, 6 days fermentation
   - Click **"Issue Origin Certificate"**
   - ✅ **Verify**: Certificate shows all 5 harvest details

4. **Step 2 - Factory**:
   - Click **"Verify Certificate"**
   - ✅ **Verify**: Shows farmer's actual data:
     - Batch Weight: 2,500 kg
     - Variety: Nacional
     - Fermentation: 6 days
     - Drying: Sun-dried
   - Scroll down to production section
   - ✅ **Verify**: Shows calculation:
     ```
     Input → Output:
     2,500 kg cocoa → 17,500 bars (100g each)
     (70% cocoa content = ~7 bars per kg)
     ```
   - Click **"Issue Production Certificate"**
   - ✅ **Verify**: Production summary shows:
     - Input Cocoa: 2,500 kg
     - Units Produced: 17,500 bars

5. **Step 3 - Consumer**:
   - View complete verified chain

---

### ✅ Test 2: Custom Values (3,000 kg)

1. Refresh page (or click title to reset)
2. **Step 1 - Farmer**:
   - Change **Batch Weight** to: `3000`
   - Change **Variety** to: `Criollo`
   - Change **Fermentation** to: `7` days
   - Click **"Issue Origin Certificate"**
   - ✅ **Verify**: Certificate shows YOUR new values

3. **Step 2 - Factory**:
   - Click **"Verify Certificate"**
   - ✅ **Verify**: Shows YOUR custom data:
     - Batch Weight: **3,000 kg** (not 2,500!)
     - Variety: **Criollo** (not Nacional!)
     - Fermentation: **7 days** (not 6!)
   - ✅ **Verify**: Shows NEW calculation:
     ```
     3,000 kg cocoa → 21,000 bars
     ```
     (Math: 3,000 × 7 = 21,000 ✓)

---

### ✅ Test 3: Large Batch (5,000 kg)

1. Refresh page
2. Enter: **5,000 kg** batch weight
3. Complete flow
4. ✅ **Verify**: Factory shows **35,000 bars** (5,000 × 7)

---

### ✅ Test 4: Small Batch (500 kg)

1. Refresh page
2. Enter: **500 kg** batch weight
3. Complete flow
4. ✅ **Verify**: Factory shows **3,500 bars** (500 × 7)

---

## What Changed vs. Before?

### Before Phase 1:
❌ Form fields were **disabled** (read-only)  
❌ Always showed hardcoded "2,500 kg Premium grade"  
❌ Factory couldn't see variety, fermentation, drying details  
❌ Production output was static "50,000 bars"  

### After Phase 1:
✅ Form fields are **editable** (you control the data!)  
✅ Shows YOUR exact input values  
✅ Factory sees all 5 harvest details  
✅ Production calculates dynamically: `kg × 7 = bars`  
✅ Full traceability from input to output  

---

## Key Features to Notice

### 1. Editable Form Inputs
The farmer form now has:
- Date picker for harvest date
- Number input for batch weight (with +/- buttons)
- Dropdown for cocoa variety (4 options)
- Number input for fermentation days
- Dropdown for drying method (3 options)

### 2. Real-time State Management
Try changing values before clicking submit - they update instantly!

### 3. Type-safe Data Flow
All data flows correctly:
```
Farmer Input → Credential → Factory Display → Calculation
```

### 4. Smart Calculations
The formula is transparent:
```
1 kg cocoa = 7 bars (100g each)
Logic: 1000g ÷ 100g/bar × 70% cocoa = 7 bars/kg
```

### 5. Responsive Design
Try resizing your browser - the form adapts!

---

## Troubleshooting

### Issue: Still seeing disabled inputs
**Solution**: Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

### Issue: Factory shows old data
**Solution**: 
```javascript
// In browser console:
localStorage.clear()
// Then refresh page
```

### Issue: Numbers not updating
**Solution**: Make sure you complete Step 1 before Step 2

---

## Demo Talking Points

When showing this to stakeholders:

1. **"This is live data entry"**
   - Show typing in the batch weight field
   - Change from 2,500 to 3,000 and show calculation updates

2. **"Full traceability"**
   - Point to how factory sees EXACT farmer data
   - Show the Input → Output calculation

3. **"No blockchain complexity"**
   - This works instantly (Demo Mode)
   - No tokens, no faucets, no delays
   - Perfect for POC and demonstrations

4. **"Production-ready structure"**
   - Real TypeScript types
   - Proper state management
   - Clean component architecture

---

## Next Steps

If everything works ✅, you can:

1. **Show the demo** to stakeholders
2. **Add more fields** (quality metrics, photos, etc.)
3. **Implement QR codes** (Phase 3)
4. **Add consumer enhancements** (Phase 2)
5. **Enable real blockchain** (if needed - currently not required)

---

## Documentation

Full implementation details: `docs/dpp/PHASE-1-IMPLEMENTATION.md`

**Status**: ✅ Phase 1 Complete  
**All Features**: Working  
**Ready for**: Demo & stakeholder review

