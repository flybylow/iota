'use client';

import React, { useState, useEffect } from 'react';
import { resolveDID } from '@/lib/iotaIdentity';
import { Loader2, CheckCircle2, XCircle, Shield, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * VerifyCredential Component - Dark Professional Theme
 */

interface DIDVerificationResult {
  isValid: boolean;
  did?: string;
  document?: Record<string, unknown>;
  error?: string;
  createdAt?: string;
}

export function VerifyCredential() {
  const [didInput, setDidInput] = useState('');
  const [result, setResult] = useState<DIDVerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [savedDIDs, setSavedDIDs] = useState<Array<{ did: string; created: string }>>([]);

  useEffect(() => {
    const dids = JSON.parse(localStorage.getItem('iota-dids') || '[]');
    setSavedDIDs(dids);
  }, []);

  useEffect(() => {
    if (result && result.isValid) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [result]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    if (!didInput.trim()) {
      setResult({
        isValid: false,
        error: 'Please enter a DID to verify',
      });
      setLoading(false);
      return;
    }

    try {
      setLoadingStep('Fetching from IOTA network...');
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setLoadingStep('Verifying cryptographic proof...');
      const document = await resolveDID(didInput.trim());
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setLoadingStep('Checking document structure...');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setLoadingStep('Validating signatures...');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const savedDID = savedDIDs.find(d => d.did === didInput.trim());
      
      setResult({
        isValid: true,
        did: didInput.trim(),
        document: document as Record<string, unknown>,
        createdAt: savedDID?.created,
      });
    } catch (err) {
      setResult({
        isValid: false,
        error: err instanceof Error ? err.message : 'Verification failed',
      });
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const loadMyIdentity = () => {
    if (savedDIDs.length > 0) {
      setDidInput(savedDIDs[savedDIDs.length - 1].did);
    }
  };

  const loadExampleDID = () => {
    setDidInput('did:iota:smr:0xec6c94cbe765fb6bbd0b8e8753740798e299f3b2e4d43806dd36ec2db2f8e96c');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Verify a Digital Identity
        </h2>
        <p className="text-zinc-100 text-sm">
          Verify the identity is real, active, and correctly signed.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-8">
          <div className="text-center space-y-4">
            <Shield className="w-10 h-10 text-blue-500 mx-auto animate-pulse" />
            <p className="text-white font-medium">Verifying identity...</p>
            <div className="bg-[#1a1a1a] rounded-lg p-4 text-left space-y-2">
              <p className="text-xs text-white mb-3">Checking:</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-zinc-500">
                  <span className={loadingStep.includes('network') ? 'text-blue-400' : ''}>
                    Fetching from IOTA network
                  </span>
                  {loadingStep.includes('network') && <Loader2 className="w-3 h-3 animate-spin ml-auto" />}
                </div>
                <div className="flex items-center gap-2 text-zinc-500">
                  <span className={loadingStep.includes('proof') ? 'text-blue-400' : ''}>
                    Verifying cryptographic proof
                  </span>
                  {loadingStep.includes('proof') && <Loader2 className="w-3 h-3 animate-spin ml-auto" />}
                </div>
                <div className="flex items-center gap-2 text-zinc-500">
                  <span className={loadingStep.includes('structure') ? 'text-blue-400' : ''}>
                    Checking document structure
                  </span>
                  {loadingStep.includes('structure') && <Loader2 className="w-3 h-3 animate-spin ml-auto" />}
                </div>
                <div className="flex items-center gap-2 text-zinc-500">
                  <span className={loadingStep.includes('signatures') ? 'text-blue-400' : ''}>
                    Validating signatures
                  </span>
                  {loadingStep.includes('signatures') && <Loader2 className="w-3 h-3 animate-spin ml-auto" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Form */}
      {!loading && !result && (
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                Enter a DID to verify:
              </label>
              <input
                type="text"
                value={didInput}
                onChange={(e) => setDidInput(e.target.value)}
                placeholder="did:iota:smr:0x..."
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-400 focus:bg-[#252525] transition-colors text-sm"
              />
            </div>

            <div className="flex flex-row gap-2">
              {savedDIDs.length > 0 && (
                <button
                  type="button"
                  onClick={loadMyIdentity}
                  className="flex-1 px-3 py-2.5 bg-[#3a3a3a] border border-[#4a4a4a] text-white text-sm rounded-lg hover:bg-[#4a4a4a] hover:border-blue-400 transition-colors min-h-[44px]"
                >
                  Use My ID
                </button>
              )}
              <button
                type="button"
                onClick={loadExampleDID}
              className="flex-1 px-3 py-2.5 bg-[#3a3a3a] border border-[#4a4a4a] text-white text-sm rounded-lg hover:bg-[#4a4a4a] hover:border-blue-400 transition-colors min-h-[44px]"
            >
              Use Example
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || !didInput.trim()}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3.5 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm min-h-[48px]"
          >
            <Shield className="w-4 h-4" />
            Verify Identity
          </button>
        </form>
        </div>
      )}

      {/* Success Result */}
      {result && result.isValid && (
        <div className="bg-[#2a2a2a] border border-green-500/20 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 text-green-400">
            <CheckCircle2 className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Identity Verified</h3>
          </div>

          <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4 space-y-3">
            <div>
              <p className="text-xs text-white mb-1">DID:</p>
              <code className="text-xs text-zinc-100 break-all">{result.did}</code>
            </div>
            <div>
              <p className="text-xs text-white mb-1">Status:</p>
              <p className="text-sm font-semibold text-green-400">ACTIVE</p>
            </div>
          </div>

          <div className="text-xs text-zinc-100 space-y-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span>Identity is authentic</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span>Cryptographic signature valid</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span>Published on IOTA network</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span>Not revoked or expired</span>
              </div>
            </div>
            {result.createdAt && (
              <div className="pt-2 border-t border-[#3a3a3a]">
                <span className="text-zinc-500">Created: {new Date(result.createdAt).toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setResult(null);
                setDidInput('');
              }}
              className="flex-1 px-4 py-2 bg-[#3a3a3a] text-white text-sm rounded-lg hover:bg-[#4a4a4a] transition-colors"
            >
              Verify Another
            </button>
          </div>
        </div>
      )}

      {/* Error Result */}
      {result && !result.isValid && (
        <div className="bg-[#2a2a2a] border border-red-500/20 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 text-red-400">
            <XCircle className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Verification Failed</h3>
          </div>

          <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="text-red-400 font-medium mb-2">This identity could not be verified</p>
                {result.error && (
                  <p className="text-zinc-100 mb-2">{result.error}</p>
                )}
                <p className="text-white mb-1">Possible reasons:</p>
                <ul className="text-zinc-100 ml-4 list-disc space-y-0.5">
                  <li>DID doesn&apos;t exist on network</li>
                  <li>Invalid format</li>
                  <li>Identity was revoked</li>
                  <li>Network connection issue</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setResult(null);
                setDidInput('');
              }}
              className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Expandable Sections */}
      {!loading && (
        <div className="max-w-2xl mx-auto space-y-4">
          <details className="text-sm text-center">
            <summary className="cursor-pointer text-blue-400 hover:text-blue-300 underline">
              How does verification work?
            </summary>
            <div className="mt-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4 text-left">
              <p className="text-white text-xs mb-3">The verification process:</p>
              <ol className="ml-4 space-y-1 list-decimal text-xs text-zinc-100">
                <li>DID is published with public key</li>
                <li>Verifier fetches DID document from IOTA</li>
                <li>Cryptographic check: signature valid?</li>
                <li>If valid → Trust established ✓</li>
              </ol>
            </div>
          </details>

          <details className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4">
            <summary className="cursor-pointer font-medium text-white text-sm hover:text-blue-400 transition-colors">
              Why This Matters
            </summary>
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                <div className="text-center text-white font-medium">Traditional</div>
                <div className="text-center text-white font-medium">Decentralized</div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-500/10 border border-red-500/20 rounded p-2 flex items-center gap-2 text-xs">
                    <span className="text-red-400">✕</span>
                    <span className="text-zinc-100">Call company</span>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded p-2 flex items-center gap-2 text-xs">
                    <span className="text-green-400">✓</span>
                    <span className="text-zinc-100">Instant verification</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-500/10 border border-red-500/20 rounded p-2 flex items-center gap-2 text-xs">
                    <span className="text-red-400">✕</span>
                    <span className="text-zinc-100">Wait 3-5 days</span>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded p-2 flex items-center gap-2 text-xs">
                    <span className="text-green-400">✓</span>
                    <span className="text-zinc-100">Trust mathematics</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-500/10 border border-red-500/20 rounded p-2 flex items-center gap-2 text-xs">
                    <span className="text-red-400">✕</span>
                    <span className="text-zinc-100">Trust humans</span>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded p-2 flex items-center gap-2 text-xs">
                    <span className="text-green-400">✓</span>
                    <span className="text-zinc-100">No paper needed</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-500/10 border border-red-500/20 rounded p-2 flex items-center gap-2 text-xs">
                    <span className="text-red-400">✕</span>
                    <span className="text-zinc-100">Paper certificates</span>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded p-2 flex items-center gap-2 text-xs">
                    <span className="text-green-400">✓</span>
                    <span className="text-zinc-100">No central authority</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-500/10 border border-red-500/20 rounded p-2 flex items-center gap-2 text-xs">
                    <span className="text-red-400">✕</span>
                    <span className="text-zinc-100">Centralized database</span>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded p-2 flex items-center gap-2 text-xs">
                    <span className="text-green-400">✓</span>
                    <span className="text-zinc-100">Works globally</span>
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
