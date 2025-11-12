/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * IOTA Identity Client Integration (Object-Based Model)
 *
 * Handles connection to the IOTA testnet for DID resolution.
 * This implementation uses the TypeScript SDK (`@iota/iota-sdk`) together
 * with the web build of `@iota/identity-wasm` to obtain an `IdentityClientReadOnly`
 * instance that can resolve DIDs created with the object-based model.
 */

import { IOTA_CONFIG } from './config';

type IdentityConnection = {
  apiEndpoint: string;
  network: string;
  iotaClient: any;
  identityClientReadOnly: any;
  identityModule: any;
};

let identityConnection: IdentityConnection | null = null;
let clientInitialized = false;
let initializingPromise: Promise<IdentityConnection | null> | null = null;

async function createConnection(): Promise<IdentityConnection | null> {
  if (typeof window === 'undefined') {
    console.warn('⚠️ Identity client can only be initialized in the browser');
    return null;
  }

  try {
    console.log('🔄 Initializing IOTA client...');
    console.log('📡 Connecting to:', IOTA_CONFIG.apiEndpoint);

    const identityModule = await import('@iota/identity-wasm/web');

    if (typeof (identityModule as any).init === 'function') {
      await (identityModule as any).init({});
    } else if (typeof (identityModule as any).start === 'function') {
      (identityModule as any).start();
    }

    const IdentityClientReadOnly = (identityModule as any).IdentityClientReadOnly;

    if (!IdentityClientReadOnly) {
      console.warn('⚠️ IdentityClientReadOnly not available in this @iota/identity-wasm build');
      return null;
    }

    const { IotaClient } = await import('@iota/iota-sdk/client');

    if (!IotaClient) {
      console.warn('⚠️ IotaClient class not available in @iota/iota-sdk/client');
      return null;
    }

    const baseClient = new IotaClient({ url: IOTA_CONFIG.apiEndpoint });
    const readOnlyClient = await IdentityClientReadOnly.create(baseClient);

    console.log('✅ IdentityClientReadOnly initialized');
    console.log('🌐 Network:', IOTA_CONFIG.network);

    return {
      apiEndpoint: IOTA_CONFIG.apiEndpoint,
      network: IOTA_CONFIG.network,
      iotaClient: baseClient,
      identityClientReadOnly: readOnlyClient,
      identityModule,
    };
  } catch (error) {
    console.error('❌ Failed to initialize Identity Client:', error);
    console.warn('⚠️ DIDs will be created locally only');
    return null;
  }
}

/**
 * Initialize Identity Client for network operations
 * This uses the object-based IOTA Identity model via IdentityClientReadOnly
 */
export async function initIdentityClient(): Promise<IdentityConnection | null> {
  if (clientInitialized && identityConnection) {
    return identityConnection;
  }

  if (initializingPromise) {
    return initializingPromise;
  }

  initializingPromise = (async () => {
    const connection = await createConnection();

    if (connection) {
      identityConnection = connection;
      clientInitialized = true;
    } else {
      identityConnection = null;
      clientInitialized = false;
    }

    return identityConnection;
  })();

  const result = await initializingPromise;
  initializingPromise = null;
  return result;
}

/**
 * Check if we have an active network connection
 */
export function isClientConnected(): boolean {
  return clientInitialized && Boolean(identityConnection?.identityClientReadOnly);
}

/**
 * Get client info for debugging
 */
export async function getClientInfo() {
  if (!identityConnection) {
    return {
      connected: false,
      message: 'No Identity Client connection - creating DIDs locally only',
    };
  }

  try {
    const [protocolConfig, rpcVersion] = await Promise.all([
      identityConnection.iotaClient?.getProtocolConfig?.().catch(() => null),
      identityConnection.iotaClient?.getRpcApiVersion?.().catch(() => undefined),
    ]);

    return {
      connected: true,
      network: identityConnection.network,
      message: `Connected to IOTA testnet via ${identityConnection.apiEndpoint}`,
      rpcVersion,
      protocolConfig,
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Connection check failed',
    };
  }
}

/**
 * Get the active Identity Client connection bundle (may be null)
 */
export function getIdentityClient(): IdentityConnection | null {
  return identityConnection;
}

/**
 * Legacy function name for backwards compatibility
 */
export function getClient(): IdentityConnection | null {
  return getIdentityClient();
}

/**
 * Access the underlying read-only Identity client
 */
export function getReadOnlyIdentityClient() {
  return identityConnection?.identityClientReadOnly ?? null;
}

/**
 * Access the low-level IOTA RPC client
 */
export function getIotaClient() {
  return identityConnection?.iotaClient ?? null;
}

/**
 * Access the loaded identity WASM module for helper utilities
 */
export function getIdentityModule() {
  return identityConnection?.identityModule ?? null;
}

/**
 * Legacy init function for backwards compatibility
 * @deprecated Use initIdentityClient() instead
 */
export async function initClient() {
  return initIdentityClient();
}

