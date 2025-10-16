'use client';

import { useState } from 'react';
import { testWasmInit, testServerSideAPI } from '@/lib/wasm-test';

/**
 * WASM Test Page
 * Tests both client-side WASM (fails) and server-side API (works)
 */

export default function TestWasmPage() {
  const [clientResult, setClientResult] = useState<any>(null);
  const [serverResult, setServerResult] = useState<any>(null);
  const [loading, setLoading] = useState<'client' | 'server' | null>(null);

  const runClientTest = async () => {
    setLoading('client');
    setClientResult(null);
    
    const testResult = await testWasmInit();
    setClientResult(testResult);
    setLoading(null);
  };

  const runServerTest = async () => {
    setLoading('server');
    setServerResult(null);
    
    const testResult = await testServerSideAPI();
    setServerResult(testResult);
    setLoading(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">
          IOTA Identity Integration Test
        </h1>
        <p className="text-zinc-400 text-sm mb-8">
          Testing two approaches: Client-side WASM (known issue) vs Server-side API (solution)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Client-Side WASM Test */}
          <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white">Approach 1: Client-Side WASM</h2>
            <p className="text-zinc-400 text-sm">
              Load @iota/identity-wasm directly in browser
            </p>

            <button
              onClick={runClientTest}
              disabled={loading === 'client'}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50"
            >
              {loading === 'client' ? 'Testing...' : 'Test Client WASM'}
            </button>

            {clientResult && (
              <div className={`p-4 rounded-lg border ${
                clientResult.success 
                  ? 'bg-green-500/10 border-green-500/20' 
                  : 'bg-red-500/10 border-red-500/20'
              }`}>
                <p className={`font-medium text-sm ${clientResult.success ? 'text-green-400' : 'text-red-400'}`}>
                  {clientResult.success ? '✅ Works!' : '❌ Failed (Expected)'}
                </p>
                <p className="text-xs text-zinc-300 mt-2">{clientResult.message}</p>
                
                {clientResult.error && (
                  <details className="mt-2">
                    <summary className="text-xs text-zinc-400 cursor-pointer">
                      Error Details
                    </summary>
                    <pre className="text-xs text-zinc-500 mt-1 overflow-auto max-h-32">
                      {JSON.stringify(clientResult.error, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>

          {/* Server-Side API Test */}
          <div className="bg-[#1a1a1a] border border-blue-500/20 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white">Approach 2: Server API ⭐</h2>
            <p className="text-zinc-400 text-sm">
              Use WASM in Node.js via API routes
            </p>

            <button
              onClick={runServerTest}
              disabled={loading === 'server'}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50"
            >
              {loading === 'server' ? 'Testing...' : 'Test Server API'}
            </button>

            {serverResult && (
              <div className={`p-4 rounded-lg border ${
                serverResult.success 
                  ? 'bg-green-500/10 border-green-500/20' 
                  : 'bg-red-500/10 border-red-500/20'
              }`}>
                <p className={`font-medium text-sm ${serverResult.success ? 'text-green-400' : 'text-red-400'}`}>
                  {serverResult.success ? '✅ Success!' : '❌ Failed'}
                </p>
                <p className="text-xs text-zinc-300 mt-2">{serverResult.message}</p>
                
                {serverResult.data && serverResult.data.did && (
                  <div className="mt-3 p-3 bg-[#0a0a0a] rounded-lg">
                    <p className="text-xs text-zinc-400 mb-1">Generated DID:</p>
                    <code className="text-xs text-green-400 break-all">{serverResult.data.did}</code>
                  </div>
                )}
                
                {serverResult.error && (
                  <details className="mt-2">
                    <summary className="text-xs text-zinc-400 cursor-pointer">
                      Error Details
                    </summary>
                    <pre className="text-xs text-zinc-500 mt-1 overflow-auto max-h-32">
                      {JSON.stringify(serverResult.error, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-3">📝 Conclusion</h3>
          <div className="space-y-2 text-sm text-zinc-300">
            <p>
              <span className="text-red-400">❌ Approach 1:</span> Client-side WASM fails in Next.js due to webpack/bundling issues with binary .wasm files
            </p>
            <p>
              <span className="text-green-400">✅ Approach 2:</span> Server-side API works! WASM runs perfectly in Node.js environment
            </p>
            <p className="pt-3 border-t border-[#27272a] text-zinc-400">
              💡 <strong className="text-white">Recommendation:</strong> Use API routes for all DID operations. Client calls /api/did/create instead of direct WASM.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <a 
            href="/"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            ← Back to Demo
          </a>
          <p className="text-xs text-zinc-500">
            Check browser console for detailed logs
          </p>
        </div>
      </div>
    </div>
  );
}

