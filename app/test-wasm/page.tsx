/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { testWasmInit, testCreateDID } from '@/lib/wasm-test';
import Link from 'next/link';

interface TestResult {
  success: boolean;
  message: string;
  exports?: string[];
  error?: unknown;
}

/**
 * WASM Test Page
 * Tests IOTA Identity WASM initialization and basic operations
 */

export default function TestWasmPage() {
  const [initResult, setInitResult] = useState<TestResult | null>(null);
  const [didResult, setDidResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const runInitTest = async () => {
    setLoading('init');
    setInitResult(null);
    
    const result = await testWasmInit();
    setInitResult(result);
    setLoading(null);
  };

  const runDIDTest = async () => {
    setLoading('did');
    setDidResult(null);
    
    const result = await testCreateDID();
    setDidResult(result);
    setLoading(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            IOTA Identity SDK Test Suite
          </h1>
          <p className="text-zinc-400 text-sm">
            Testing @iota/identity-wasm v1.7 integration with Next.js 15
          </p>
        </div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WASM Initialization Test */}
          <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">
                Test 1: WASM Initialization
              </h2>
              <p className="text-sm text-zinc-400">
                Can we load and initialize the WASM module?
              </p>
            </div>

            <button
              onClick={runInitTest}
              disabled={loading === 'init'}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'init' ? 'Testing...' : 'Run Init Test'}
            </button>

            {initResult && (
              <div className={`p-4 rounded-lg border ${
                initResult.success 
                  ? 'bg-green-500/10 border-green-500/20' 
                  : 'bg-red-500/10 border-red-500/20'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">
                    {initResult.success ? '✅' : '❌'}
                  </span>
                  <p className={`font-medium text-sm ${
                    initResult.success ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {initResult.success ? 'Success!' : 'Failed'}
                  </p>
                </div>
                
                <p className="text-xs text-zinc-300 mb-2">
                  {initResult.message}
                </p>
                
                {initResult.exports && (
                  <details className="mt-2">
                    <summary className="text-xs text-zinc-400 cursor-pointer hover:text-zinc-300">
                      Available exports ({initResult.exports.length})
                    </summary>
                    <pre className="text-xs text-zinc-500 mt-2 overflow-auto max-h-32 bg-[#0a0a0a] p-2 rounded">
                      {initResult.exports.join('\n')}
                    </pre>
                  </details>
                )}
                
                {initResult.error !== undefined && (
                  <details className="mt-2">
                    <summary className="text-xs text-zinc-400 cursor-pointer hover:text-zinc-300">
                      Error Details
                    </summary>
                    <pre className="text-xs text-zinc-500 mt-2 overflow-auto max-h-48 bg-[#0a0a0a] p-2 rounded">
                      {typeof initResult.error === 'string' 
                        ? initResult.error 
                        : JSON.stringify(initResult.error, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>

          {/* DID Creation Test */}
          <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">
                Test 2: DID Creation
              </h2>
              <p className="text-sm text-zinc-400">
                Can we create a DID on Shimmer testnet?
              </p>
            </div>

            <button
              onClick={runDIDTest}
              disabled={loading === 'did'}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'did' ? 'Testing...' : 'Run DID Test'}
            </button>

            {didResult && (
              <div className={`p-4 rounded-lg border ${
                didResult.success 
                  ? 'bg-green-500/10 border-green-500/20' 
                  : 'bg-red-500/10 border-red-500/20'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">
                    {didResult.success ? '✅' : '❌'}
                  </span>
                  <p className={`font-medium text-sm ${
                    didResult.success ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {didResult.success ? 'Success!' : 'Failed'}
                  </p>
                </div>
                
                <p className="text-xs text-zinc-300">
                  {didResult.message}
                </p>
                
                {didResult.error !== undefined && (
                  <details className="mt-2">
                    <summary className="text-xs text-zinc-400 cursor-pointer hover:text-zinc-300">
                      Error Details
                    </summary>
                    <pre className="text-xs text-zinc-500 mt-2 overflow-auto max-h-48 bg-[#0a0a0a] p-2 rounded">
                      {typeof didResult.error === 'string' 
                        ? didResult.error 
                        : JSON.stringify(didResult.error, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-[#1a1a1a] border border-blue-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            🎯 What We're Testing
          </h3>
          <div className="space-y-3 text-sm text-zinc-300">
            <div>
              <strong className="text-white">Test 1:</strong> Verifies that the WASM module can be imported 
              and initialized in the Next.js browser environment. This is the foundation for everything else.
            </div>
            <div>
              <strong className="text-white">Test 2:</strong> Attempts to create an IOTA Client that connects 
              to the Shimmer testnet. If this works, we can create DIDs and credentials.
            </div>
            <div className="pt-2 border-t border-[#27272a]">
              <strong className="text-blue-400">Expected Result:</strong> Both tests should pass. If Test 1 
              fails, we need to adjust webpack config. If Test 2 fails, there may be network/API issues.
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            📋 Next Steps Based on Results
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-400">✅</span>
              <div>
                <strong className="text-white">If both pass:</strong>
                <span className="text-zinc-400"> Proceed to implement real createDID(), issueCredential(), and verifyCredential() functions</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400">⚠️</span>
              <div>
                <strong className="text-white">If Test 1 fails:</strong>
                <span className="text-zinc-400"> Try adjusting Next.js webpack config or implement Approach 2 (Server-Side API)</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400">❌</span>
              <div>
                <strong className="text-white">If both fail:</strong>
                <span className="text-zinc-400"> Fall back to Server-Side API routes or keep mock implementation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

