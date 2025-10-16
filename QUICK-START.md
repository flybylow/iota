# 🚀 Quick Start Guide

**Get up and running in 2 minutes!**

---

## Step 1: Install Dependencies

```bash
npm install
```

⏱️ Takes ~30 seconds

---

## Step 2: Run Development Server

```bash
npm run dev
```

⏱️ Starts immediately

---

## Step 3: Open in Browser

```
http://localhost:3000
```

🎉 **You should see the IOTA DID Explorer!**

---

## Step 4: Try It Out

### A. Create a DID (Tab 1)

1. Click **"Create New DID"** button
2. Wait ~10-20 seconds ⏳
3. Copy the DID that appears
4. ✅ Done!

### B. Issue a Credential (Tab 2)

1. Your DID from Tab 1 should auto-fill as "Issuer"
2. Paste the same DID as "Holder" (or create a new one)
3. Fill in:
   - Student Name: **Alice Johnson**
   - Degree: **Bachelor of Science**
   - University: **MIT**
4. Click **"Issue Credential"**
5. Copy the credential that appears
6. ✅ Done!

### C. Verify the Credential (Tab 3)

1. Paste the credential from Tab 2
2. Click **"Verify Credential"**
3. See ✅ **"Credential is Valid!"**
4. ✅ Done!

---

## 🎉 Success!

You've just:
- ✅ Created a decentralized identity
- ✅ Issued a verifiable credential
- ✅ Verified it cryptographically

---

## 📚 Learn More

### Understanding What You Just Did

**Tab 1 - Create DID**:
- Generated cryptographic keys
- Created a DID Document
- Published it to IOTA blockchain (testnet)
- Got a unique identifier you own forever

**Tab 2 - Issue Credential**:
- Created a digital certificate
- Signed it with your DID
- Formatted it as JSON
- Ready to share

**Tab 3 - Verify Credential**:
- Parsed the credential
- Checked the signature
- Validated expiration
- Confirmed it's authentic

---

## 📖 Full Documentation

For deep dives:
- **README.md** - Full overview
- **documents/00-PROJECT-OVERVIEW.md** - Architecture
- **documents/02-IMPLEMENTATION.md** - Technical details
- **documents/03-TESTING-GUIDE.md** - Complete testing guide

---

## 🆘 Troubleshooting

### "Failed to fetch" error
- **Cause**: Can't reach IOTA testnet
- **Fix**: Check internet connection

### DID creation takes forever
- **Cause**: Testnet is slow
- **Fix**: Wait up to 30 seconds, or try again

### Keys disappear on refresh
- **Cause**: Demo app - keys in memory only
- **Fix**: This is expected! Create new DIDs after refresh

---

## 🎯 What's Next?

1. **Read the docs** - Understand how it works
2. **Modify the code** - Try changing something
3. **Build something new** - Apply to your use case!

---

**Total time**: 2 minutes to running app + 5 minutes to test all features = **7 minutes total!**

🚀 **Happy exploring!**

