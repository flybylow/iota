/**
 * Identity Publishing Microservice
 *
 * Runs in a long-lived Node.js environment to avoid the WASM restrictions of
 * Next.js API routes. The frontend calls this service to publish DIDs on-chain.
 */

const express = require('express');
const path = require('path');
const { IotaClient } = require('@iota/iota-sdk/client');

const PORT = Number(process.env.IDENTITY_SERVICE_PORT || 4000);
const IOTA_API_ENDPOINT =
  process.env.IOTA_API_ENDPOINT ||
  process.env.NEXT_PUBLIC_IOTA_API_ENDPOINT ||
  'https://api.testnet.iota.cafe';
const CORS_ORIGIN = process.env.IDENTITY_SERVICE_CORS_ORIGIN || '*';

let identityModulePromise = null;
let iotaClientPromise = null;

async function loadIdentityModule() {
  if (!identityModulePromise) {
    identityModulePromise = (async () => {
      const identityModule = require('@iota/identity-wasm/node');

      if (typeof identityModule.init === 'function') {
        try {
          await identityModule.init();
        } catch (error) {
          // Fallback: supply explicit WASM path if the default load fails.
          const wasmPath = path.join(
            path.dirname(require.resolve('@iota/identity-wasm/node/package.json')),
            'identity_wasm_bg.wasm'
          );
          await identityModule.init(wasmPath);
        }
      }

      return identityModule;
    })();
  }

  return identityModulePromise;
}

async function loadIotaClient() {
  if (!iotaClientPromise) {
    iotaClientPromise = (async () => {
      const client = new IotaClient({
        url: IOTA_API_ENDPOINT,
      });

      try {
        const info = await client.getInfo?.();
        if (info) {
          console.log('[Identity Service] Connected to IOTA node:', info);
        }
      } catch {
        console.log('[Identity Service] Connected to IOTA node.');
      }

      return client;
    })();
  }

  return iotaClientPromise;
}

async function ensureReady() {
  await Promise.all([loadIdentityModule(), loadIotaClient()]);
}

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', CORS_ORIGIN);
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'Identity service healthy' });
});

app.post('/identity/publish', async (req, res) => {
  const startedAt = Date.now();
  try {
    // ARCHITECTURAL LIMITATION:
    // IdentityClient.create() requires a WasmTransactionSigner which needs:
    // 1. The wallet's address (for gas payment)
    // 2. The wallet's private key in storage (for signing)
    //
    // We cannot have the wallet's private key in the microservice for security reasons.
    // The wallet should stay in the user's browser/wallet extension.
    //
    // This microservice approach won't work for DID publishing because:
    // - IdentityClient needs a signer to pay gas
    // - The signer needs the private key
    // - We can't have the private key server-side
    //
    // SOLUTION: Use client-side wallet signing via @iota/dapp-kit instead.
    
    res.status(501).json({
      success: false,
      error: 'DID publishing via microservice is not supported',
      reason: 'IdentityClient requires wallet private key for signing, which cannot be stored server-side',
      suggestion: 'Use client-side wallet signing via @iota/dapp-kit instead',
      details: 'The IdentityClient.create() method sets up a WasmTransactionSigner internally that requires the wallet\'s private key to be in storage. For security reasons, private keys should remain in the user\'s wallet (browser extension), not in a microservice.'
    });
  } catch (error) {
    console.error('[Identity Service] Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

async function start() {
  await ensureReady();

  app.listen(PORT, () => {
    console.log(`[Identity Service] Listening on port ${PORT}`);
  });
}

start().catch((error) => {
  console.error('[Identity Service] Failed to start:', error);
  process.exit(1);
});

