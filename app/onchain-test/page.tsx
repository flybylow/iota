'use client';

import { useState } from 'react';

/**
 * Simple On-Chain Test Page
 * Tests real IOTA Identity WASM initialization
 */
export default function OnChainTestPage() {
  const [status, setStatus] = useState<string>('Ready to test');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testWasmInit = async () => {
    setLoading(true);
    setStatus('Initializing WASM...');
    setResult(null);

    try {
      const { initSimpleWasm } = await import('@/lib/simpleWasm');
      
      const Identity = await initSimpleWasm();
      
      setStatus('✅ WASM Initialized Successfully!');
      setResult({
        success: true,
        message: 'IOTA Identity WASM is ready',
        exports: Object.keys(Identity).slice(0, 20),
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      setStatus('❌ WASM Initialization Failed');
      setResult({
        success: false,
        error: error.message,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  const testCreateDID = async () => {
    setLoading(true);
    setStatus('Creating DID...');
    setResult(null);

    try {
      const { testCreateSimpleDID } = await import('@/lib/simpleWasm');
      
      const didResult = await testCreateSimpleDID();
      
      if (didResult.success) {
        setStatus('✅ DID Created Successfully!');
      } else {
        setStatus('❌ DID Creation Failed');
      }
      setResult(didResult);
    } catch (error: any) {
      setStatus('❌ DID Creation Failed');
      setResult({
        success: false,
        error: error.message,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    setStatus('✅ Cache Cleared! Refresh the page.');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🧪 On-Chain Test Page</h1>
          <p className="text-zinc-400">Test real IOTA Identity WASM implementation</p>
        </div>

        {/* Status */}
        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            {loading && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            )}
            <p className="text-lg">{status}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <button
            onClick={testWasmInit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Test WASM Init
          </button>
          
          <button
            onClick={testCreateDID}
            disabled={loading}
            className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Test Create DID
          </button>

          <button
            onClick={clearCache}
            disabled={loading}
            className="bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Clear Cache
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Result:</h3>
            <pre className="bg-[#0a0a0a] p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-400">📋 Instructions</h3>
          <ol className="space-y-2 text-sm text-zinc-300">
            <li>1. Click "Test WASM Init" to initialize the IOTA Identity WASM module</li>
            <li>2. If successful, click "Test Create DID" to create a real DID document</li>
            <li>3. Check the console (F12) for detailed logs</li>
            <li>4. Use "Clear Cache" to reset localStorage if needed</li>
          </ol>
        </div>

        {/* Note */}
        <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <p className="text-sm text-yellow-400">
            ⚠️ <strong>Note:</strong> This page uses the real IOTA Identity implementation. 
            DIDs are created locally but not yet published to the blockchain (requires testnet tokens).
          </p>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <a
            href="/"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            ← Back to Demo
          </a>
        </div>
      </div>
    </div>
  );
}

