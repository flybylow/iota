/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';

/**
 * Simple Browser Test for IOTA Identity Flow
 * Click buttons to test each step
 */

export default function SimpleTestPage() {
  const [farmer, setFarmer] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [credential, setCredential] = useState<string | null>(null);
  const [verification, setVerification] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const log = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const clearLogs = () => setLogs([]);

  const testStep1 = async () => {
    setLoading('step1');
    clearLogs();
    try {
      log('🚀 Starting Step 1: Create Farmer DID');
      
      const { createDID } = await import('@/lib/iotaIdentityReal');
      log('📦 Module imported');
      
      const result = await createDID();
      setFarmer(result);
      
      log('✅ SUCCESS!');
      log(`DID: ${result.did}`);
      log(`Key Stored: ${result.keyStored}`);
    } catch (error) {
      log('❌ ERROR: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(null);
    }
  };

  const testStep2 = async () => {
    setLoading('step2');
    try {
      log('🚀 Starting Step 2: Create Product DID');
      
      const { createDID } = await import('@/lib/iotaIdentityReal');
      const result = await createDID();
      setProduct(result);
      
      log('✅ SUCCESS!');
      log(`DID: ${result.did}`);
      log(`Key Stored: ${result.keyStored}`);
    } catch (error) {
      log('❌ ERROR: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(null);
    }
  };

  const testStep3 = async () => {
    if (!farmer || !product) {
      log('❌ ERROR: Must complete steps 1 and 2 first!');
      return;
    }

    setLoading('step3');
    try {
      log('🚀 Starting Step 3: Issue Credential');
      
      const { issueCredential } = await import('@/lib/iotaIdentityReal');
      
      const cred = await issueCredential(farmer.did, product.did, {
        type: 'OrganicOriginCertification',
        origin: 'Ecuador',
        certification: 'EU Organic',
        harvestDate: '2025-10-01',
        batchWeight: 2500,
        variety: 'Nacional'
      });
      
      setCredential(cred);
      
      log('✅ SUCCESS!');
      log(`Credential Length: ${cred.length} characters`);
      log(`Preview: ${cred.substring(0, 100)}...`);
    } catch (error) {
      log('❌ ERROR: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(null);
    }
  };

  const testStep4 = async () => {
    if (!credential) {
      log('❌ ERROR: Must complete step 3 first!');
      return;
    }

    setLoading('step4');
    try {
      log('🚀 Starting Step 4: Verify Credential');
      
      const { verifyCredential } = await import('@/lib/iotaIdentityReal');
      
      const result = await verifyCredential(credential);
      setVerification(result);
      
      log('✅ SUCCESS!');
      log(`Is Valid: ${result.isValid}`);
      if (result.note) log(`Note: ${result.note}`);
    } catch (error) {
      log('❌ ERROR: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(null);
    }
  };

  const runAllSteps = async () => {
    clearLogs();
    setFarmer(null);
    setProduct(null);
    setCredential(null);
    setVerification(null);

    log('🎬 Running Complete Flow Test...\n');

    // Step 1
    await testStep1();
    await new Promise(resolve => setTimeout(resolve, 500));

    // Step 2
    if (farmer) {
      await testStep2();
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Step 3
    if (product) {
      await testStep3();
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Step 4
    if (credential) {
      await testStep4();
    }

    log('\n🎉 Complete Flow Test Finished!');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            🧪 Simple IOTA Identity Test
          </h1>
          <p className="text-zinc-400 text-sm">
            Click buttons to test each step of the DID flow
          </p>
        </div>

        {/* Quick Test Button */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-white mb-3">
            🚀 Run Complete Flow Test
          </h2>
          <button
            onClick={runAllSteps}
            disabled={loading !== null}
            className="bg-white text-blue-600 font-medium py-3 px-8 rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Testing...' : 'Test All Steps Automatically'}
          </button>
        </div>

        {/* Individual Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Step 1 */}
          <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">
              👨‍🌾 Step 1: Create Farmer DID
            </h3>
            <button
              onClick={testStep1}
              disabled={loading !== null}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50"
            >
              {loading === 'step1' ? 'Creating...' : 'Create Farmer DID'}
            </button>
            {farmer && (
              <div className="bg-[#0a0a0a] rounded p-3 text-xs">
                <p className="text-green-400 font-medium mb-1">✅ Created!</p>
                <p className="text-zinc-400 break-all">{farmer.did}</p>
              </div>
            )}
          </div>

          {/* Step 2 */}
          <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">
              📦 Step 2: Create Product DID
            </h3>
            <button
              onClick={testStep2}
              disabled={loading !== null}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50"
            >
              {loading === 'step2' ? 'Creating...' : 'Create Product DID'}
            </button>
            {product && (
              <div className="bg-[#0a0a0a] rounded p-3 text-xs">
                <p className="text-blue-400 font-medium mb-1">✅ Created!</p>
                <p className="text-zinc-400 break-all">{product.did}</p>
              </div>
            )}
          </div>

          {/* Step 3 */}
          <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">
              📝 Step 3: Issue Credential
            </h3>
            <button
              onClick={testStep3}
              disabled={loading !== null || !farmer || !product}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50"
            >
              {loading === 'step3' ? 'Issuing...' : 'Issue Credential'}
            </button>
            {credential && (
              <div className="bg-[#0a0a0a] rounded p-3 text-xs">
                <p className="text-purple-400 font-medium mb-1">✅ Issued!</p>
                <p className="text-zinc-400">{credential.length} characters</p>
              </div>
            )}
          </div>

          {/* Step 4 */}
          <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">
              🔍 Step 4: Verify Credential
            </h3>
            <button
              onClick={testStep4}
              disabled={loading !== null || !credential}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50"
            >
              {loading === 'step4' ? 'Verifying...' : 'Verify Credential'}
            </button>
            {verification && (
              <div className={`bg-[#0a0a0a] rounded p-3 text-xs ${
                verification.isValid ? 'border border-green-500/20' : 'border border-red-500/20'
              }`}>
                <p className={`font-medium mb-1 ${verification.isValid ? 'text-green-400' : 'text-red-400'}`}>
                  {verification.isValid ? '✅ Valid!' : '❌ Invalid'}
                </p>
                {verification.note && (
                  <p className="text-zinc-400 text-xs">{verification.note}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Logs */}
        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">📋 Test Logs</h3>
            <button
              onClick={clearLogs}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Clear Logs
            </button>
          </div>
          <div className="bg-[#0a0a0a] rounded p-4 h-64 overflow-y-auto font-mono text-xs">
            {logs.length === 0 ? (
              <p className="text-zinc-600">No logs yet. Click a test button to start.</p>
            ) : (
              logs.map((log, i) => (
                <p key={i} className="text-zinc-300 mb-1">{log}</p>
              ))
            )}
          </div>
        </div>

        {/* Summary */}
        {farmer && product && credential && verification && (
          <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>🎉</span> Flow Test Complete!
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-zinc-400">Farmer DID:</p>
                <p className="text-white font-mono text-xs break-all">{farmer.did.substring(0, 50)}...</p>
              </div>
              <div>
                <p className="text-zinc-400">Product DID:</p>
                <p className="text-white font-mono text-xs break-all">{product.did.substring(0, 50)}...</p>
              </div>
              <div>
                <p className="text-zinc-400">Credential:</p>
                <p className="text-white">{credential.length} characters</p>
              </div>
              <div>
                <p className="text-zinc-400">Verification:</p>
                <p className={verification.isValid ? 'text-green-400' : 'text-red-400'}>
                  {verification.isValid ? '✅ VALID' : '❌ INVALID'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-[#1a1a1a] border border-blue-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">ℹ️ What This Tests</h3>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li>✅ WASM initialization and SDK loading</li>
            <li>✅ DID creation (locally, not published)</li>
            <li>✅ Key storage (encrypted in localStorage)</li>
            <li>✅ Credential issuance (W3C format)</li>
            <li>✅ Credential verification (structural)</li>
          </ul>
          <p className="text-xs text-zinc-500 mt-4">
            💡 Check browser console (F12) for detailed logs
          </p>
        </div>
      </div>
    </div>
  );
}

