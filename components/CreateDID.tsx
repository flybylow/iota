'use client';

import React, { useState } from 'react';
import { createDID } from '@/lib/iotaIdentity';
import { DIDCreationResult } from '@/types';
import { Loader2, CheckCircle2, Copy, AlertCircle, Sparkles } from 'lucide-react';

/**
 * CreateDID Component
 * 
 * Simplified UX for creating decentralized identities.
 * Focus: Plain language, progressive loading.
 */

export function CreateDID() {
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [result, setResult] = useState<DIDCreationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Confetti moved to verification step

  const handleCreateDID = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Progressive loading states
      setLoadingStep('Generating cryptographic keys...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoadingStep('Creating identity document...');
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setLoadingStep('Publishing to IOTA network...');
      const didResult = await createDID();
      
      setLoadingStep('Waiting for confirmation...');
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setResult(didResult);
      
      // Save to localStorage so it persists
      const savedDIDs = JSON.parse(localStorage.getItem('iota-dids') || '[]');
      savedDIDs.push({
        ...didResult,
        created: new Date().toISOString(),
      });
      localStorage.setItem('iota-dids', JSON.stringify(savedDIDs));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create identity');
    } finally {
      setLoading(false);
      setLoadingStep('');
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
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          🆔 Create Your Digital Identity
        </h2>
        <p className="text-lg text-gray-700">
          A permanent identity that you own forever and no company can take away.
        </p>
      </div>

      {/* What is This Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 mb-3 text-lg">🤔 What is this?</h3>
        <p className="text-blue-800 mb-4">
          A <strong>Decentralized Identifier (DID)</strong> is a permanent digital identity that:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-green-600 text-lg">✓</span>
            <span className="text-blue-900"><strong>You own forever</strong> - no expiration</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 text-lg">✓</span>
            <span className="text-blue-900"><strong>Works everywhere</strong> globally</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 text-lg">✓</span>
            <span className="text-blue-900"><strong>No company can take away</strong></span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 text-lg">✓</span>
            <span className="text-blue-900"><strong>Anyone can verify</strong> it&apos;s real</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white border-2 border-blue-300 rounded-xl p-8">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900">Creating your identity...</h3>
            <div className="bg-blue-50 rounded-lg p-4 text-left space-y-2">
              <p className="text-sm font-medium text-blue-900 mb-3">What&apos;s happening right now:</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-blue-600">⚡</span>
                  <span className={loadingStep.includes('keys') ? 'font-semibold text-blue-900' : ''}>
                    Generating cryptographic keys
                  </span>
                  {loadingStep.includes('keys') && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-blue-600">📄</span>
                  <span className={loadingStep.includes('document') ? 'font-semibold text-blue-900' : ''}>
                    Creating identity document
                  </span>
                  {loadingStep.includes('document') && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-blue-600">🌐</span>
                  <span className={loadingStep.includes('network') ? 'font-semibold text-blue-900' : ''}>
                    Publishing to IOTA network
                  </span>
                  {loadingStep.includes('network') && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-blue-600">✓</span>
                  <span className={loadingStep.includes('confirmation') ? 'font-semibold text-blue-900' : ''}>
                    Waiting for confirmation
                  </span>
                  {loadingStep.includes('confirmation') && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Button */}
      {!loading && !result && (
        <button
          onClick={handleCreateDID}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg py-4 px-8 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
        >
          <Sparkles className="w-6 h-6" />
          🚀 Create Identity
        </button>
      )}

      {!loading && !result && (
        <div className="text-center text-sm text-gray-600 flex items-center justify-center gap-3">
          <span>⏱️ Takes ~5 seconds</span>
          <span>•</span>
          <span>💰 Free on testnet</span>
        </div>
      )}

      {/* Success Result */}
      {result && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-8 space-y-6">
          {/* Success Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3 text-green-700">
              <CheckCircle2 className="w-10 h-10" />
              <h3 className="text-2xl font-bold">✨ Identity Created Successfully! ✨</h3>
            </div>
          </div>

          {/* DID Display */}
          <div className="bg-white border-2 border-green-400 rounded-xl p-6 space-y-3">
            <label className="text-sm font-semibold text-gray-700 block">
              🎉 Your unique identifier:
            </label>
            <div className="bg-gray-50 border border-green-300 rounded-lg p-4 font-mono text-sm break-all flex items-start justify-between gap-2">
              <span className="text-gray-900">{result.did}</span>
              <button
                onClick={() => copyToClipboard(result.did)}
                className="text-green-600 hover:text-green-700 flex-shrink-0 p-1 hover:bg-green-100 rounded transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <span className="text-xs font-semibold">✅ Copied!</span>
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* What You Just Did */}
          <div className="bg-white border border-green-300 rounded-xl p-5 space-y-3">
            <p className="font-semibold text-gray-800 text-base">
              ℹ️ What you just did:
            </p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Created a <strong>permanent digital identity</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>It&apos;s now <strong>published on IOTA network</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Anyone in the world</strong> can verify it</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>No company controls it</strong> - you do</span>
              </li>
            </ul>
          </div>

          {/* DPP Use Case */}
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">
              💡 For Digital Product Passport use case:
            </p>
            <p className="text-sm text-blue-800">
              This could be a product batch, a supplier, or a manufacturing facility.
              Each gets a permanent, verifiable identity.
            </p>
          </div>

          {/* Next Step */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-5 text-center">
            <p className="text-lg font-semibold mb-2">
              Ready for the next step?
            </p>
            <p className="text-sm opacity-90">
              Click <strong>Step 2: Verify Identity</strong> above to continue!
            </p>
          </div>
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

      {/* Expandable Help Sections */}
      {!loading && (
        <>
          <details className="bg-gray-50 border border-gray-300 rounded-xl p-5">
            <summary className="cursor-pointer font-semibold text-gray-800 hover:text-blue-600 transition-colors">
              ❓ What is a Decentralized Identifier (DID)?
            </summary>
            <div className="mt-4 text-sm text-gray-700 space-y-3">
              <p>
                A DID is like a username or email address, but with superpowers:
              </p>
              <ol className="ml-5 space-y-2 list-decimal">
                <li><strong>No company owns it</strong> (decentralized)</li>
                <li><strong>You control it forever</strong> (self-sovereign)</li>
                <li><strong>Anyone can verify it</strong> (public)</li>
                <li><strong>Can&apos;t be taken away</strong> (permanent)</li>
              </ol>
              <p className="text-xs text-gray-600 mt-3">
                <strong>Technical:</strong> W3C standard for digital identity • 
                <a href="https://www.w3.org/TR/did-core/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                  Learn more →
                </a>
              </p>
            </div>
          </details>

          <details className="bg-gray-50 border border-gray-300 rounded-xl p-5">
            <summary className="cursor-pointer font-semibold text-gray-800 hover:text-blue-600 transition-colors">
              🔧 Technical Details (for developers)
            </summary>
            <div className="mt-4 text-sm text-gray-700 space-y-2">
              <p>
                <strong>Testnet:</strong> IOTA Shimmer testnet
              </p>
              <p>
                <strong>Keys:</strong> Ed25519 keypairs (military-grade encryption)
              </p>
              <p>
                <strong>Storage:</strong> Browser localStorage (demo only - use IOTA Stronghold in production)
              </p>
              <p>
                <strong>Format:</strong> W3C DID standard: <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">did:iota:smr:0x...</code>
              </p>
            </div>
          </details>
        </>
      )}
    </div>
  );
}

