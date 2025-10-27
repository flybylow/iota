# Getting IOTA Testnet Tokens

## ✅ IOTA Testnet Faucet (October 2025)

**Good news!** The IOTA testnet faucet should be available at `faucet.testnet.iotaledger.net`.

## 🎯 What You Can Do

### Option 1: Use Demo Mode (Recommended)
The easiest way to test the DPP app is using **Demo Mode**:
- No testnet tokens required
- Works instantly
- Perfect for demonstrations and testing the UI/UX
- Toggle via the settings icon in the top-right

### Option 2: Get Tokens from Community

If you need actual testnet tokens for blockchain publishing:

#### 1. **IOTA Discord** (Most Active)
- 🔗 Join: https://discord.iota.org
- 📢 Look for: Developer, help, or testnet-related channels
- 💬 Politely explain you need Shimmer testnet tokens for DID development
- 💡 Channels may include: general help, developer support, or shimmer-specific channels
- ⏰ Response time: Usually within a few hours (depending on community activity)

#### 2. **Community Forums**
- Check IOTA/Shimmer community forums
- Other developers may share tokens

#### 3. **Developer Programs**
- If you're building a serious project, reach out to IOTA Foundation directly
- They may provide testnet tokens for legitimate development

## 🔧 What You Need

To actually publish DIDs on-chain (not implemented yet), you'll need:

1. **Wallet**: Firefly Wallet configured for Shimmer Testnet
2. **Address**: In `rms1...` format (Bech32)
3. **Tokens**: ~0.5 SMR per DID (very small amount)
4. **Implementation**: Full publishing flow (currently creates locally only)

## 📋 Current App Behavior

### Demo Mode (Default) 🎭
- ✅ Works immediately
- ✅ No tokens needed
- ✅ Perfect for testing
- ❌ Not on blockchain

### Blockchain Mode ⛓️
- ✅ Creates real DID structures
- ✅ Uses IOTA Identity SDK
- ✅ Signs credentials with keys
- ⚠️ **Creates DIDs locally only** (not published)
- ❌ Publishing requires implementation + tokens

## 🚀 Future Implementation

To make blockchain mode fully functional:

1. Integrate IOTA Client for transactions
2. Implement Alias Output creation
3. Handle storage deposits
4. Submit transactions to testnet
5. Wait for confirmation

Until then, **Demo Mode is the recommended way to test the app!**

## 📚 Resources

- **IOTA Discord**: https://discord.iota.org
- **Shimmer Docs**: https://wiki.iota.org/shimmer/
- **IOTA Identity**: https://wiki.iota.org/identity.rs/
- **Explorer**: https://explorer.shimmer.network/shimmer-testnet/

---

**Last Updated**: October 2025  
**Status**: Faucet down, use Discord for tokens

