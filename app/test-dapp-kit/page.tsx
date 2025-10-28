'use client';

import { useWalletStatus } from '@/lib/hooks/useWalletStatus';
import { useCurrentAccount, ConnectButton } from '@iota/dapp-kit';
import { useState } from 'react';
import { useIOTAPublishing } from '@/lib/hooks/useIOTAPublishing';
import { createDID } from '@/lib/iotaIdentityReal';

export default function TestDAppKitPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [createdDID, setCreatedDID] = useState<{did: string; document: unknown} | null>(null);
  const { isConnected, address } = useWalletStatus();
  const account = useCurrentAccount();
  const { publishDID, publishing } = useIOTAPublishing();

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const testWalletDetection = () => {
    addLog('🔍 Testing wallet detection...');
    addLog(`✅ Connected: ${isConnected}`);
    addLog(`📍 Address: ${address || 'not set'}`);
    addLog(`👤 Account: ${account ? 'exists' : 'none'}`);
    
    if (account) {
      addLog(`   - Account address: ${account.address}`);
      addLog(`   - Account chains: ${account.chains.length}`);
    }
  };

  const testBasicConnection = async () => {
    try {
      addLog('🔗 Testing basic dApp Kit connection...');
      addLog(`✅ Wallet connected: ${isConnected}`);
      addLog(`📋 Address: ${address || 'N/A'}`);
      
      if (isConnected && account) {
        addLog('✅ dApp Kit is working!');
        addLog(`   Address: ${account.address}`);
        addLog(`   Chains: ${account.chains.map(c => c.id).join(', ')}`);
      } else {
        addLog('⚠️ Not connected. Click "Connect Wallet" first.');
      }
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  const testCreateAndPublishDID = async () => {
    try {
      addLog('📝 Step 1: Creating DID...');
      const didResult = await createDID();
      setCreatedDID({ did: didResult.did, document: didResult.document });
      addLog(`✅ DID created: ${didResult.did}`);
      
      addLog('📤 Step 2: Publishing DID to blockchain...');
      const publishResult = await publishDID(didResult.did, didResult.document as Record<string, unknown>);
      
      if (publishResult.success) {
        addLog(`✅ DID published!`);
        addLog(`   Transaction: ${publishResult.transactionId}`);
        addLog(`   Explorer: ${publishResult.explorerUrl}`);
        addLog(`🔗 View at: ${publishResult.explorerUrl}`);
      } else {
        addLog(`❌ Publishing failed: ${publishResult.error}`);
      }
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">IOTA dApp Kit Test</h1>
      
      {/* Connect Wallet Button */}
      <div className="mb-6">
        <ConnectButton className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-black rounded" style={{ color: '#000000' }} />
      </div>
      
      <div className="space-y-4 mb-8">
        <button
          onClick={testWalletDetection}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Test Wallet Detection
        </button>
        
        <button
          onClick={testBasicConnection}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
        >
          Test Basic Connection
        </button>
        
        <button
          onClick={testCreateAndPublishDID}
          disabled={!isConnected || publishing}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50"
        >
          {publishing ? 'Publishing...' : 'Create & Publish DID'}
        </button>
      </div>

      <div className="bg-zinc-900 rounded p-4">
        <h2 className="font-bold mb-2">Test Logs:</h2>
        <div className="space-y-1 font-mono text-sm">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-zinc-900 rounded p-4">
        <h2 className="font-bold mb-2">Current State:</h2>
        <ul className="space-y-1 text-sm">
          <li>Connected: {isConnected ? '✅ Yes' : '❌ No'}</li>
          <li>Address: {address || 'N/A'}</li>
          <li>Account: {account ? '✅ Loaded' : '❌ None'}</li>
          <li>Publishing: {publishing ? '⏳ In Progress' : '✅ Ready'}</li>
          {createdDID && (
            <li>Created DID: {createdDID.did.substring(0, 30)}...</li>
          )}
        </ul>
      </div>
    </div>
  );
}

