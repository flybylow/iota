# Testing Guide

**Last Updated**: October 16, 2025

Complete guide for testing the IOTA DID Explorer application.

---

## Quick Start

```bash
# Start the development server
npm run dev

# Open in browser
http://localhost:3000
```

---

## Test Scenario 1: Create Your First DID

### Steps

1. **Navigate to Tab 1: "Create DID"**
   - You should see a blue gradient button "Create New DID"

2. **Click "Create New DID"**
   - Button changes to show "Creating... (this may take 10-20 seconds)"
   - Spinner appears

3. **Wait for Completion**
   - Takes ~10-20 seconds on testnet
   - Success message appears in green

4. **Verify Output**
   - ✅ Green success box appears
   - ✅ DID is displayed (starts with `did:iota:0x`)
   - ✅ Copy button appears next to DID
   - ✅ Explanation of what happened is shown

5. **Copy the DID**
   - Click the copy button
   - Icon changes to checkmark briefly
   - DID is now in your clipboard

### Expected Result

```
✅ DID Created!
did:iota:0x1234567890abcdef... (actual value will be different)

💾 Important: Your DID has been saved to browser storage.
```

### Troubleshooting

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| "Failed to fetch" error | No internet connection | Check network connection |
| Takes longer than 30 seconds | Testnet slow or down | Wait or try again later |
| "Failed to initialize WASM" | Browser compatibility | Try Chrome/Firefox/Safari |

---

## Test Scenario 2: Issue a Credential

### Prerequisites
- You need at least one DID (from Scenario 1)

### Steps

1. **Navigate to Tab 2: "Issue Credential"**

2. **Select Issuer DID**
   - Dropdown should show your created DID(s)
   - Select the DID you just created
   - Alternatively, paste a DID in the text field below

3. **Enter Holder DID**
   - Option A: Paste the same DID (self-issued credential)
   - Option B: Create another DID and paste it here

4. **Fill in Credential Details**
   ```
   Student Name: Alice Johnson
   Degree: Bachelor of Science in Computer Science
   University: Massachusetts Institute of Technology
   ```

5. **Click "Issue Credential"**
   - Button shows "Issuing Credential..."
   - Should be fast (~1-2 seconds, no network needed)

6. **Verify Output**
   - ✅ Green success box appears
   - ✅ Credential JWT is displayed in a text area
   - ✅ Copy button appears
   - ✅ Can scroll through the credential

7. **Copy the Credential**
   - Click the copy button
   - Entire credential JWT is copied

### Expected Result

```
✅ Credential Issued Successfully!

Credential (JWT):
{"id":"did:iota:0x...#credential-1697468400000","type":...}

💾 Next step: Copy this credential and verify it in the "Verify Credential" tab!
```

### Troubleshooting

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| "Both Issuer DID and Holder DID are required" | Missing fields | Fill in all DID fields |
| "Please fill in all credential fields" | Missing claim data | Fill in name, degree, university |
| No DIDs in dropdown | Haven't created any DIDs | Go to Tab 1 and create a DID |

---

## Test Scenario 3: Verify a Credential

### Prerequisites
- You need a credential (from Scenario 2)

### Steps

1. **Navigate to Tab 3: "Verify Credential"**

2. **Option A: Load Recent Credential**
   - If you just issued a credential, you'll see "Recently Issued Credentials"
   - Click one to auto-load it

3. **Option B: Paste Credential**
   - Paste the credential JWT in the text area

4. **Click "Verify Credential"**
   - Button shows "Verifying..."
   - Should be fast (~100-200ms)

5. **Verify Valid Credential**
   - ✅ Large green success box appears
   - ✅ "Credential is Valid! ✅" message
   - ✅ Credential details are displayed:
     - Issuer DID
     - Subject information (name, degree, university)
     - Issuance date
     - Expiration date

### Expected Result (Valid)

```
✅ Credential is Valid! ✅
This credential has been verified and is authentic.

Credential Details:
Issuer: did:iota:0x...
Subject:
  - id: did:iota:0x...
  - name: Alice Johnson
  - degree: Bachelor of Science in Computer Science
  - university: Massachusetts Institute of Technology
Issued: 10/16/2025, 2:30:00 PM
Expires: 10/16/2026, 2:30:00 PM
```

### Test Invalid Credential

6. **Modify the Credential**
   - Paste a valid credential
   - Change one character in the JSON
   - Click "Verify Credential"

7. **Verify Invalid Result**
   - ❌ Red error box appears
   - ❌ "Credential is Invalid ❌" message
   - ❌ Error details explain what's wrong

### Expected Result (Invalid)

```
❌ Credential is Invalid ❌

Error Details:
Unexpected token in JSON at position 123

⚠️ Possible reasons:
- The credential has been tampered with
- Invalid credential format
```

### Troubleshooting

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| "Please enter a credential to verify" | Empty text field | Paste a credential |
| "Missing issuer in credential" | Malformed credential | Check credential format |
| Always shows invalid | Not using a credential from this app | Issue a new credential in Tab 2 |

---

## Test Scenario 4: Full End-to-End Flow

### Complete User Journey

1. **Create Issuer DID** (Tab 1)
   - Create a DID for the university
   - Copy it

2. **Create Holder DID** (Tab 1)
   - Create a second DID for the student
   - Copy it

3. **Issue Credential** (Tab 2)
   - Use first DID as issuer
   - Use second DID as holder
   - Fill in student information
   - Issue credential
   - Copy credential

4. **Verify Credential** (Tab 3)
   - Paste credential
   - Verify it's valid
   - Check all details match

### Expected Timeline
- Total time: ~25-30 seconds
- DID creation (×2): ~20-40 seconds
- Credential issue: ~1 second
- Credential verify: ~0.2 seconds

---

## Browser Compatibility Testing

### Recommended Browsers

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 120+ | ✅ Fully supported |
| Firefox | 120+ | ✅ Fully supported |
| Safari | 17+ | ✅ Fully supported |
| Edge | 120+ | ✅ Fully supported |

### Features to Test

1. **WebAssembly Support**
   - IOTA SDK requires WASM
   - Test: Create a DID

2. **LocalStorage**
   - DIDs/credentials should persist
   - Test: Refresh page, check dropdown still has DIDs

3. **Clipboard API**
   - Copy buttons should work
   - Test: Click copy, paste in notepad

4. **Modern JavaScript**
   - Async/await, ES modules
   - Test: All features work without console errors

---

## Performance Testing

### Metrics to Check

1. **Initial Page Load**
   - **Target**: < 3 seconds
   - **Test**: Open DevTools Network tab, refresh page

2. **WASM Initialization**
   - **Target**: < 500ms
   - **Test**: Click "Create DID" for first time, check console

3. **DID Creation**
   - **Target**: 10-20 seconds
   - **Test**: Time from click to success message

4. **Credential Issue**
   - **Target**: < 1 second
   - **Test**: Time from click to credential display

5. **Credential Verify**
   - **Target**: < 500ms
   - **Test**: Time from click to validation result

---

## Local Storage Testing

### Check Saved Data

1. **Open DevTools**
   - Press F12 or Right-click → Inspect

2. **Go to Application Tab** (Chrome) or **Storage Tab** (Firefox)

3. **Check LocalStorage**
   - Look for `iota-dids` key
   - Look for `iota-credentials` key

4. **Verify Data Structure**

```json
// iota-dids
[
  {
    "did": "did:iota:0x...",
    "document": {...},
    "created": "2025-10-16T14:30:00.000Z"
  }
]

// iota-credentials
[
  {
    "jwt": "{...}",
    "issued": "2025-10-16T14:35:00.000Z",
    "subject": "Alice Johnson"
  }
]
```

### Test Persistence

1. Create a DID
2. Refresh the page
3. Go to "Issue Credential" tab
4. Check if the DID appears in the dropdown
5. ✅ If yes, persistence works!

### Clear Storage

To start fresh:
```javascript
// In browser console
localStorage.removeItem('iota-dids');
localStorage.removeItem('iota-credentials');
```

---

## Error Scenario Testing

### Test Network Failure

1. **Disconnect Internet**
2. **Try to Create DID**
3. **Expected Result**: Error message about network

### Test Invalid Input

1. **Go to Verify Credential**
2. **Paste Invalid Text**: `this is not a credential`
3. **Click Verify**
4. **Expected Result**: Error about invalid format

### Test Empty Forms

1. **Go to Issue Credential**
2. **Leave All Fields Empty**
3. **Click Issue**
4. **Expected Result**: Error about required fields

---

## Accessibility Testing

### Keyboard Navigation

1. **Tab through the interface**
   - All buttons should be reachable
   - Tab order should be logical

2. **Enter to submit**
   - Forms should submit with Enter key

3. **Escape to dismiss**
   - Modals/dialogs should close with Escape

### Screen Reader Testing

1. **Use NVDA (Windows) or VoiceOver (Mac)**
2. **Navigate through tabs**
   - Tab labels should be announced
3. **Fill in forms**
   - Labels should be associated with inputs
4. **Check results**
   - Success/error messages should be announced

---

## Mobile Testing

### Responsive Design

1. **Open DevTools**
2. **Toggle Device Toolbar** (Ctrl+Shift+M)
3. **Test Different Viewports**:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - Desktop (1920px)

### Touch Interactions

1. **Buttons should be large enough** (min 44x44px)
2. **Text should be readable** (min 16px font)
3. **No horizontal scrolling**

---

## Automated Testing (Future)

### Unit Tests

```bash
# Example test structure (not yet implemented)
npm test

# Test files to create:
# - lib/iotaIdentity.test.ts
# - components/CreateDID.test.tsx
# - components/IssueCredential.test.tsx
# - components/VerifyCredential.test.tsx
```

### E2E Tests

```bash
# Example with Playwright (not yet implemented)
npx playwright test

# Test scenarios:
# - Full DID creation flow
# - Full credential issuance flow
# - Full verification flow
```

---

## Common Issues & Solutions

### Issue: DID Creation Hangs

**Symptoms**: Button stuck on "Creating..." for > 1 minute

**Diagnosis**:
1. Check browser console for errors
2. Check network tab for failed requests
3. Check if testnet is operational

**Solutions**:
1. Refresh page and try again
2. Try different browser
3. Wait 5 minutes and retry (testnet might be overloaded)

### Issue: Credentials Not Saving

**Symptoms**: Dropdown doesn't show previously issued credentials

**Diagnosis**:
1. Check localStorage in DevTools
2. Check browser console for errors

**Solutions**:
1. Ensure cookies/localStorage not blocked
2. Check if in private/incognito mode (storage limited)
3. Try different browser

### Issue: Copy Button Not Working

**Symptoms**: Click copy button, nothing happens

**Diagnosis**:
1. Check if HTTPS (clipboard API requires secure context)
2. Check browser console for errors

**Solutions**:
1. Use localhost (counts as secure)
2. Manually select and copy text
3. Try different browser

---

## Next Testing Steps

### After Initial Testing

1. **Invite Others to Test**
   - Get feedback on UX
   - Find edge cases

2. **Test on Real Devices**
   - Not just DevTools simulation
   - iOS Safari, Android Chrome

3. **Load Testing**
   - Create 10+ DIDs
   - Issue 50+ credentials
   - Check performance

4. **Security Testing**
   - Try to tamper with credentials
   - Try malicious inputs
   - Check XSS vulnerabilities

---

## Success Criteria

The app is working correctly if:

- ✅ Can create DIDs on testnet
- ✅ DIDs persist in localStorage
- ✅ Can issue credentials
- ✅ Can verify valid credentials
- ✅ Can detect invalid credentials
- ✅ All explanatory text is clear
- ✅ UI is responsive and accessible
- ✅ No console errors in normal usage

---

## Report Bugs

If you find issues:

1. Note the exact steps to reproduce
2. Check browser console for errors
3. Note browser/OS version
4. Take screenshots if helpful
5. Document expected vs actual behavior

---

**Happy Testing!** 🧪

