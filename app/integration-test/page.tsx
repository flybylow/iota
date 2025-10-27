'use client';

import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { runAllTests, type TestResult } from '@/lib/test-integration';

/**
 * Integration Test Page
 * 
 * Provides a UI for running the complete test suite
 * following the testing strategy from the implementation plan
 */

export default function IntegrationTestPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Record<string, TestResult> | null>(null);
  const [overall, setOverall] = useState<boolean | null>(null);

  const runTests = async () => {
    setRunning(true);
    setResults(null);
    setOverall(null);

    try {
      const testResults = await runAllTests();
      setResults(testResults.tests);
      setOverall(testResults.overall);
    } catch (error) {
      console.error('Test suite error:', error);
    } finally {
      setRunning(false);
    }
  };

  const getStatusIcon = (result: TestResult) => {
    if (result.passed) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🧪 IOTA Identity Integration Tests
          </h1>
          <p className="text-zinc-400">
            Comprehensive testing of the real IOTA Identity SDK integration
          </p>
        </div>

        {/* Test Info Card */}
        <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Test Suite Overview</h2>
          <div className="space-y-2 text-sm text-zinc-300">
            <p>✅ Phase 1: WASM Initialization</p>
            <p>✅ Phase 2: Network Connection</p>
            <p>✅ Phase 3: DID Creation</p>
            <p>✅ Phase 4: Credential Issuance</p>
            <p>✅ Phase 5: Credential Verification</p>
          </div>
          
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded">
            <p className="text-xs text-blue-400">
              <strong>Note:</strong> Tests will run in both online and offline modes. 
              Network connectivity is not required - DIDs can be created locally.
            </p>
          </div>
        </div>

        {/* Run Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={runTests}
            disabled={running}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center gap-3 text-lg shadow-lg"
          >
            {running ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Run All Tests
              </>
            )}
          </button>
        </div>

        {/* Overall Result */}
        {overall !== null && (
          <div className={`mb-6 p-4 rounded-lg border ${
            overall
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-center gap-3">
              {overall ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="text-lg font-semibold text-green-400">All Tests Passed!</p>
                    <p className="text-sm text-green-300">IOTA Identity integration is working correctly</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="text-lg font-semibold text-red-400">Some Tests Failed</p>
                    <p className="text-sm text-red-300">Check individual test results below</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Test Results */}
        {results && (
          <div className="space-y-4">
            {Object.entries(results).map(([testName, result]) => (
              <div
                key={testName}
                className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-5"
              >
                <div className="flex items-start gap-3 mb-3">
                  {getStatusIcon(result)}
                  <div className="flex-1">
                    <h3 className="text-white font-semibold capitalize">
                      {testName.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <p className={`text-sm mt-1 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                      {result.message}
                    </p>
                  </div>
                </div>

                {result.error && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded">
                    <p className="text-xs text-red-400 font-medium mb-1">Error:</p>
                    <p className="text-xs text-red-300">{result.error}</p>
                  </div>
                )}

                {result.details && (
                  <details className="mt-3">
                    <summary className="text-xs text-zinc-400 cursor-pointer hover:text-zinc-300">
                      View Details
                    </summary>
                    <pre className="mt-2 p-3 bg-[#0a0a0a] rounded text-xs text-zinc-400 overflow-x-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-[#1a1a1a] border border-blue-500/20 rounded-lg p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-zinc-300">
              <p className="font-medium text-white mb-2">About These Tests</p>
              <ul className="space-y-1 text-xs">
                <li>• Tests run entirely in your browser</li>
                <li>• No data is sent to external servers</li>
                <li>• DIDs are created locally if no network connection</li>
                <li>• Publishing to blockchain requires testnet tokens</li>
                <li>• Check browser console for detailed logs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


