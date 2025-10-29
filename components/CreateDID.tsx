'use client';

import React, { useState } from 'react';
import { createDID } from '@/lib/iotaIdentity';
import { DIDCreationResult } from '@/types';
import { Loader2, CheckCircle2, Copy, AlertCircle } from 'lucide-react';

/**
 * CreateDID Component - Dark Professional Theme
 */

export function CreateDID() {
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [result, setResult] = useState<DIDCreationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [identityType, setIdentityType] = useState<string>('other');
  const [identityName, setIdentityName] = useState<string>('');

  const handleCreateDID = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    console.log('Creating DID with:', { identityType, identityName });
    
    try {
      setLoadingStep('Generating cryptographic keys...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoadingStep('Creating identity document...');
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setLoadingStep('Publishing to IOTA network...');
      const didResult = await createDID();
      
      setLoadingStep('Waiting for confirmation...');
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setResult(didResult);
      
      const savedDIDs = JSON.parse(localStorage.getItem('iota-dids') || '[]');
      savedDIDs.push({
        ...didResult,
        created: new Date().toISOString(),
        type: identityType,
        name: identityName.trim() || undefined,
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
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
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
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Create Your Digital Identity
        </h2>
        <p className="text-zinc-100 text-sm">
          An identity that you own forever.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-8">
          <div className="text-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto" />
            <p className="text-white font-medium">Creating your identity...</p>
            <div className="bg-[#1a1a1a] rounded-lg p-4 text-left space-y-2">
              <p className="text-xs text-white mb-3">What&apos;s happening:</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-zinc-500">
                  <span className={loadingStep.includes('keys') ? 'text-blue-400' : ''}>
                    Generating cryptographic keys
                  </span>
                  {loadingStep.includes('keys') && <Loader2 className="w-3 h-3 animate-spin ml-auto" />}
                </div>
                <div className="flex items-center gap-2 text-zinc-500">
                  <span className={loadingStep.includes('document') ? 'text-blue-400' : ''}>
                    Creating identity document
                  </span>
                  {loadingStep.includes('document') && <Loader2 className="w-3 h-3 animate-spin ml-auto" />}
                </div>
                <div className="flex items-center gap-2 text-zinc-500">
                  <span className={loadingStep.includes('network') ? 'text-blue-400' : ''}>
                    Publishing to IOTA network
                  </span>
                  {loadingStep.includes('network') && <Loader2 className="w-3 h-3 animate-spin ml-auto" />}
                </div>
                <div className="flex items-center gap-2 text-zinc-500">
                  <span className={loadingStep.includes('confirmation') ? 'text-blue-400' : ''}>
                    Waiting for confirmation
                  </span>
                  {loadingStep.includes('confirmation') && <Loader2 className="w-3 h-3 animate-spin ml-auto" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Identity Type Selection */}
      {!loading && !result && (
        <div className="w-[80%] mx-auto space-y-6">
          <div className="space-y-4">
            <label className="block text-xs font-medium text-white mb-3">
              What type of identity to create?
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg cursor-pointer hover:bg-[#3a3a3a] transition-colors">
                <input
                  type="radio"
                  name="identityType"
                  value="supplier"
                  checked={identityType === 'supplier'}
                  onChange={(e) => setIdentityType(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-white text-sm">👨‍🌾 Supplier/Farmer</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg cursor-pointer hover:bg-[#3a3a3a] transition-colors">
                <input
                  type="radio"
                  name="identityType"
                  value="manufacturer"
                  checked={identityType === 'manufacturer'}
                  onChange={(e) => setIdentityType(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-white text-sm">🏭 Manufacturer</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg cursor-pointer hover:bg-[#3a3a3a] transition-colors">
                <input
                  type="radio"
                  name="identityType"
                  value="product"
                  checked={identityType === 'product'}
                  onChange={(e) => setIdentityType(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-white text-sm">📦 Product/Batch</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg cursor-pointer hover:bg-[#3a3a3a] transition-colors">
                <input
                  type="radio"
                  name="identityType"
                  value="other"
                  checked={identityType === 'other'}
                  onChange={(e) => setIdentityType(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-white text-sm">🧪 Other (Demo)</span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-medium text-white mb-2">
              Optional: Give it a name
            </label>
            <input
              type="text"
              value={identityName}
              onChange={(e) => setIdentityName(e.target.value)}
              placeholder="e.g., Acme Coffee Farm, Batch #12345"
              className="w-auto min-w-[250px] px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg !text-white placeholder-zinc-500 focus:outline-none focus:border-blue-400 focus:bg-[#252525] transition-colors text-sm"
              style={{ color: '#ffffff' }}
            />
          </div>
        </div>
      )}

      {/* Create Button */}
      {!loading && !result && (
        <div className="flex justify-center">
          <button
            onClick={handleCreateDID}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-4 px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm min-h-[48px]"
          >
            Create Identity
          </button>
        </div>
      )}

      {/* What is This - Collapsible */}
      {!loading && !result && (
        <div className="max-w-2xl mx-auto">
          <details className="text-sm text-center">
            <summary className="cursor-pointer text-blue-400 hover:text-blue-300 underline">
              What is this?
            </summary>
            <div className="mt-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4 text-left">
              <p className="text-white mb-3 text-sm">
                A <strong>Decentralized Identifier (DID)</strong> is a digital identity that:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-zinc-100">You own forever - no expiration</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-zinc-100">Works everywhere globally</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-zinc-100">No company can take away</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-zinc-100">Anyone can verify it&apos;s real</span>
                </div>
              </div>
            </div>
          </details>
        </div>
      )}

      {/* Success Result */}
      {result && (
        <div className="bg-[#2a2a2a] border border-green-500/20 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 text-green-400">
            <CheckCircle2 className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Identity Created</h3>
          </div>

          <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4 space-y-2">
            {identityName.trim() && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-white w-24">Identity Name:</span>
                <span className="text-sm text-zinc-100 font-medium">{identityName.trim()}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white w-24">Type:</span>
              <span className="text-sm text-zinc-100">
                {identityType === 'supplier' && '👨‍🌾 Supplier/Farmer'}
                {identityType === 'manufacturer' && '🏭 Manufacturer'}
                {identityType === 'product' && '📦 Product/Batch'}
                {identityType === 'other' && '🧪 Other (Demo)'}
              </span>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4">
            <p className="text-xs text-white mb-2">Your DID:</p>
            <div className="flex items-start justify-between gap-2">
              <code className="text-xs text-zinc-100 break-all flex-1">{result.did}</code>
              <button
                onClick={() => copyToClipboard(result.did)}
                className="text-zinc-400 hover:text-white transition-colors flex-shrink-0"
                title="Copy to clipboard"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="text-xs text-zinc-100 space-y-2">
            <p className="font-medium text-white">What happened:</p>
            <ul className="space-y-1 ml-4">
              <li>• Created a permanent digital identity</li>
              <li>• Published on IOTA network</li>
              <li>• Anyone can verify it</li>
              <li>• You control it</li>
            </ul>
          </div>

          <div className="text-xs text-zinc-100 pt-3 border-t border-[#3a3a3a]">
            Click <strong className="text-white">Verify</strong> tab to continue
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-[#2a2a2a] border border-red-500/20 rounded-lg p-4">
          <div className="flex items-start gap-2 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Error</p>
              <p className="text-xs text-zinc-100">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
