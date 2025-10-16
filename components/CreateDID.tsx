'use client';

import React, { useState } from 'react';
import { createDID } from '@/lib/iotaIdentity';
import { DIDCreationResult } from '@/types';
import { Loader2, CheckCircle2, Copy, AlertCircle } from 'lucide-react';

/**
 * CreateDID Component
 * 
 * Allows users to create a new Decentralized Identifier (DID) on the IOTA Tangle.
 * 
 * What happens when you click "Create DID":
 * 1. Generate a new keypair (public + private keys)
 * 2. Create a DID Document with your public key
 * 3. Publish it to IOTA Tangle (testnet)
 * 4. Get back your DID identifier (did:iota:0x...)
 * 
 * This takes ~10-20 seconds because we're writing to the blockchain!
 */
export function CreateDID() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DIDCreationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreateDID = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const didResult = await createDID();
      setResult(didResult);
      
      // Save to localStorage so it persists
      const savedDIDs = JSON.parse(localStorage.getItem('iota-dids') || '[]');
      savedDIDs.push({
        ...didResult,
        created: new Date().toISOString(),
      });
      localStorage.setItem('iota-dids', JSON.stringify(savedDIDs));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create DID');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers or non-HTTPS contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (execErr) {
          console.error('Fallback copy failed:', execErr);
          alert('Failed to copy. Please copy manually: ' + text);
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard. Please copy manually.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create Decentralized Identity
        </h2>
        <p className="text-gray-600">
          Generate a new DID and publish it to the IOTA Tangle. This creates a unique
          identifier that you control forever - no company can take it away.
        </p>
      </div>

      {/* Explanation Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 What is a DID?</h3>
        <p className="text-sm text-blue-800 mb-2">
          A DID (Decentralized Identifier) is like an email address or username, but:
        </p>
        <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
          <li>You own it forever (no company controls it)</li>
          <li>It&apos;s cryptographically secure (uses public/private keys)</li>
          <li>It&apos;s stored on a blockchain (IOTA Tangle)</li>
          <li>Anyone can verify your identity without asking a central authority</li>
        </ul>
      </div>

      {/* Create Button */}
      <button
        onClick={handleCreateDID}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating DID... (this may take 10-20 seconds)
          </>
        ) : (
          <>
            Create New DID
          </>
        )}
      </button>

      {/* Success Result */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle2 className="w-6 h-6" />
            <h3 className="text-lg font-semibold">DID Created Successfully!</h3>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Your DID:
            </label>
            <div className="bg-white border border-green-300 rounded-lg p-3 font-mono text-sm break-all flex items-start justify-between gap-2">
              <span className="text-gray-800">{result.did}</span>
              <button
                onClick={() => copyToClipboard(result.did)}
                className="text-green-600 hover:text-green-700 flex-shrink-0"
                title="Copy to clipboard"
              >
                {copied ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-white border border-green-300 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-2">
              <strong>✅ What just happened:</strong>
            </p>
            <ol className="text-sm text-gray-600 space-y-1 ml-4 list-decimal">
              <li>Generated a new cryptographic keypair (public + private keys)</li>
              <li>Created a DID Document containing your public key</li>
              <li>Published your DID Document to the IOTA Tangle (testnet)</li>
              <li>Received your unique DID identifier</li>
            </ol>
          </div>

          <p className="text-sm text-gray-600">
            💾 <strong>Important:</strong> Your DID has been saved to browser storage.
            Copy it now to use in the next steps!
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-2 text-red-800">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">Error Creating DID</h3>
              <p className="text-sm">{error}</p>
              <p className="text-sm mt-2 text-red-700">
                💡 Tip: Make sure you have internet connection. The IOTA testnet
                might also be temporarily down.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Technical Details */}
      <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <summary className="cursor-pointer font-medium text-gray-700">
          🔧 Technical Details (for developers)
        </summary>
        <div className="mt-3 text-sm text-gray-600 space-y-2">
          <p>
            <strong>Testnet:</strong> We&apos;re using IOTA&apos;s testnet at{' '}
            <code className="bg-gray-200 px-1 rounded">
              https://api.testnet.shimmer.network
            </code>
          </p>
          <p>
            <strong>Keys:</strong> We generate Ed25519 keypairs (military-grade encryption)
          </p>
          <p>
            <strong>Storage:</strong> Private keys are stored in browser memory (demo only).
            Production apps should use IOTA Stronghold for secure key storage.
          </p>
          <p>
            <strong>Format:</strong> DIDs follow the W3C DID standard: <code>did:iota:0x...</code>
          </p>
        </div>
      </details>
    </div>
  );
}

