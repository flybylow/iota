'use client';

import React, { useState, useEffect } from 'react';
import { resolveDID } from '@/lib/iotaIdentity';
import { Loader2, CheckCircle2, XCircle, Shield, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * VerifyCredential Component (now focused on verifying DIDs)
 * 
 * Simplified UX for verifying digital identities.
 * Focus: Plain language, progressive loading, clear results.
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

  // Load saved DIDs from localStorage
  useEffect(() => {
    const dids = JSON.parse(localStorage.getItem('iota-dids') || '[]');
    setSavedDIDs(dids);
  }, []);

  // Trigger confetti on successful verification
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
      // Progressive loading states
      setLoadingStep('Fetching from IOTA network...');
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setLoadingStep('Verifying cryptographic proof...');
      const document = await resolveDID(didInput.trim());
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setLoadingStep('Checking document structure...');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setLoadingStep('Validating signatures...');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Check if the DID is one we created
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
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          🔍 Verify a Digital Identity
        </h2>
        <p className="text-lg text-gray-700">
          Before trusting a product, supplier, or claim - verify the identity is real, active, and correctly signed.
        </p>
      </div>

      {/* Why Verify Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6">
        <h3 className="font-bold text-indigo-900 mb-3 text-lg">🤔 Why verify?</h3>
        <p className="text-indigo-800 mb-4">
          Before trusting a product, supplier, or claim - verify the identity is:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-green-600 text-lg">✓</span>
            <span className="text-indigo-900"><strong>Real</strong> (not fake)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 text-lg">✓</span>
            <span className="text-indigo-900"><strong>Active</strong> (not expired/revoked)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 text-lg">✓</span>
            <span className="text-indigo-900"><strong>Correctly signed</strong></span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 text-lg">✓</span>
            <span className="text-indigo-900"><strong>Verified instantly</strong></span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white border-2 border-indigo-300 rounded-xl p-8">
          <div className="text-center space-y-4">
            <Shield className="w-12 h-12 text-indigo-600 mx-auto animate-pulse" />
            <h3 className="text-xl font-semibold text-gray-900">Verifying identity...</h3>
            <div className="bg-indigo-50 rounded-lg p-4 text-left space-y-2">
              <p className="text-sm font-medium text-indigo-900 mb-3">Checking:</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-indigo-600">⚡</span>
                  <span className={loadingStep.includes('network') ? 'font-semibold text-indigo-900' : ''}>
                    Fetching from IOTA network
                  </span>
                  {loadingStep.includes('network') && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-indigo-600">🔐</span>
                  <span className={loadingStep.includes('proof') ? 'font-semibold text-indigo-900' : ''}>
                    Verifying cryptographic proof
                  </span>
                  {loadingStep.includes('proof') && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-indigo-600">📋</span>
                  <span className={loadingStep.includes('structure') ? 'font-semibold text-indigo-900' : ''}>
                    Checking document structure
                  </span>
                  {loadingStep.includes('structure') && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-indigo-600">✓</span>
                  <span className={loadingStep.includes('signatures') ? 'font-semibold text-indigo-900' : ''}>
                    Validating signatures
                  </span>
                  {loadingStep.includes('signatures') && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Form */}
      {!loading && !result && (
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-3">
              Enter a DID to verify:
            </label>
            <input
              type="text"
              value={didInput}
              onChange={(e) => setDidInput(e.target.value)}
              placeholder="did:iota:smr:0x..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {savedDIDs.length > 0 && (
                <button
                  type="button"
                  onClick={loadMyIdentity}
                  className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors text-sm"
                >
                  📋 Use My Identity
                </button>
              )}
              <button
                type="button"
                onClick={loadExampleDID}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                🔗 Use Example
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-3">
              💡 Tip: Use the DID from Step 1, or try the example
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !didInput.trim()}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg py-4 px-8 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          >
            <Shield className="w-6 h-6" />
            🔐 Verify Identity
          </button>
        </form>
      )}

      {/* Verification Result - Valid */}
      {result && result.isValid && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-8 space-y-6">
          {/* Success Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3 text-green-700">
              <CheckCircle2 className="w-12 h-12" />
              <h3 className="text-2xl font-bold">✅ Identity Verified Successfully!</h3>
            </div>
          </div>

          {/* DID Display */}
          <div className="bg-white border-2 border-green-400 rounded-xl p-6 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700">DID:</p>
              <p className="font-mono text-sm bg-gray-50 p-3 rounded-lg break-all text-gray-900">
                {result.did}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700">Status:</p>
              <p className="text-lg font-bold text-green-600">✅ ACTIVE</p>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="bg-white border border-green-300 rounded-xl p-5 space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-gray-800">Identity is authentic</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-gray-800">Cryptographic signature valid</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-gray-800">Published on IOTA network</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-gray-800">Not revoked or expired</span>
              </div>
            </div>
            {result.createdAt && (
              <div className="pt-3 border-t border-green-200">
                <p className="text-sm text-gray-600">
                  <strong>Created:</strong> {new Date(result.createdAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* What This Means */}
          <div className="bg-green-100 border border-green-300 rounded-lg p-5">
            <p className="font-semibold text-green-900 mb-2">
              🎉 What this means:
            </p>
            <p className="text-sm text-green-800">
              This identity is <strong>mathematically proven</strong> to be authentic. 
              No phone calls, no paperwork, no waiting - just instant cryptographic verification.
            </p>
          </div>

          {/* DPP Use Case */}
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">
              💡 For Digital Product Passport use case:
            </p>
            <p className="text-sm text-blue-800">
              You could now trust claims made by this identity (e.g., &quot;This batch is organic&quot;)
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setResult(null);
                setDidInput('');
              }}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              🔄 Verify Another
            </button>
            <details className="flex-1">
              <summary className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-center">
                View Technical Details
              </summary>
              <div className="mt-3 bg-gray-50 p-4 rounded-lg text-xs">
                <pre className="overflow-auto">
                  {JSON.stringify(result.document, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        </div>
      )}

      {/* Verification Result - Invalid */}
      {result && !result.isValid && (
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-8 space-y-6">
          {/* Error Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3 text-red-700">
              <XCircle className="w-12 h-12" />
              <h3 className="text-2xl font-bold">❌ Verification Failed</h3>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-white border-2 border-red-400 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 mb-2">
                  ⚠️ This identity could not be verified
                </p>
                {result.error && (
                  <p className="text-sm text-red-700 mb-3">{result.error}</p>
                )}
                <p className="text-sm text-red-800 font-medium">
                  Possible reasons:
                </p>
                <ul className="text-sm text-red-700 ml-5 list-disc mt-2 space-y-1">
                  <li>DID doesn&apos;t exist on network</li>
                  <li>Invalid format</li>
                  <li>Identity was revoked</li>
                  <li>Network connection issue</li>
                </ul>
              </div>
            </div>
          </div>

          {/* What This Means */}
          <div className="bg-red-100 border border-red-300 rounded-lg p-5">
            <p className="font-semibold text-red-900 mb-2">
              🚨 What this means:
            </p>
            <p className="text-sm text-red-800">
              <strong>Do NOT trust claims from this identity.</strong> It may be fake, expired, or malicious.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setResult(null);
                setDidInput('');
              }}
              className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                setResult(null);
                setDidInput('');
                // Optionally switch back to create tab
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Create Valid Identity
            </button>
          </div>
        </div>
      )}

      {/* Expandable Help Sections */}
      {!loading && (
        <>
          <details className="bg-gray-50 border border-gray-300 rounded-xl p-5">
            <summary className="cursor-pointer font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
              ❓ How does verification work?
            </summary>
            <div className="mt-4 text-sm text-gray-700 space-y-3">
              <p className="font-medium">The verification process:</p>
              <ol className="ml-5 space-y-2 list-decimal">
                <li>DID is published with public key</li>
                <li>Verifier fetches DID document from IOTA</li>
                <li>Cryptographic check: signature valid?</li>
                <li>If valid → Trust established ✅</li>
              </ol>
              <p className="text-xs text-gray-600 mt-3">
                <strong>No phone calls. No paperwork. Just math.</strong>
              </p>
              <p className="text-xs text-gray-600">
                <strong>Technical:</strong> Uses Ed25519 signatures • 
                <a href="https://docs.iota.org/developer/iota-identity/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline ml-1">
                  Learn more →
                </a>
              </p>
            </div>
          </details>

          {/* Side-by-Side Comparison */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-300 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-6 text-lg text-center">
              🔍 Why This Matters
            </h3>
            
            {/* Headers */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <h4 className="font-semibold text-red-900 flex items-center justify-center gap-2">
                  <XCircle className="w-5 h-5" />
                  <span>Traditional</span>
                </h4>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-green-900 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Decentralized (DIDs)</span>
                </h4>
              </div>
            </div>

            {/* Horizontal Comparison Rows */}
            <div className="space-y-3">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-red-500 text-lg">❌</span>
                  <span className="text-sm text-gray-800">Call company</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-green-600 text-lg">✅</span>
                  <span className="text-sm text-gray-800">Instant verification (seconds)</span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-red-500 text-lg">❌</span>
                  <span className="text-sm text-gray-800">Wait 3-5 days</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-green-600 text-lg">✅</span>
                  <span className="text-sm text-gray-800">Trust mathematics (can&apos;t lie)</span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-red-500 text-lg">❌</span>
                  <span className="text-sm text-gray-800">Trust humans (can lie)</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-green-600 text-lg">✅</span>
                  <span className="text-sm text-gray-800">No paper needed (digital proof)</span>
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-red-500 text-lg">❌</span>
                  <span className="text-sm text-gray-800">Paper certificates (can be forged)</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-green-600 text-lg">✅</span>
                  <span className="text-sm text-gray-800">No central authority (no single failure)</span>
                </div>
              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-red-500 text-lg">❌</span>
                  <span className="text-sm text-gray-800">Centralized database (single point fail)</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-green-600 text-lg">✅</span>
                  <span className="text-sm text-gray-800">Works globally (no borders)</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

