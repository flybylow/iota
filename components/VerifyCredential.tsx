'use client';

import React, { useState, useEffect } from 'react';
import { verifyCredential } from '@/lib/iotaIdentity';
import { VerificationResult } from '@/types';
import { Loader2, CheckCircle2, XCircle, Shield, AlertCircle } from 'lucide-react';

/**
 * VerifyCredential Component
 * 
 * Allows users to verify a Verifiable Credential.
 * 
 * Verification process:
 * 1. Parse the credential JWT
 * 2. Extract the issuer's DID
 * 3. Fetch issuer's DID Document from IOTA Tangle
 * 4. Verify the signature using issuer's public key
 * 5. Check expiration dates
 * 6. Display validation result
 */
export function VerifyCredential() {
  const [credentialInput, setCredentialInput] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState<Array<{ jwt: string; issued: string; subject: string }>>([]);

  // Load saved credentials from localStorage
  useEffect(() => {
    const creds = JSON.parse(localStorage.getItem('iota-credentials') || '[]');
    setSavedCredentials(creds);
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    if (!credentialInput.trim()) {
      setResult({
        isValid: false,
        error: 'Please enter a credential to verify',
      });
      setLoading(false);
      return;
    }

    try {
      const verificationResult = await verifyCredential(credentialInput);
      setResult(verificationResult);
    } catch (err) {
      setResult({
        isValid: false,
        error: err instanceof Error ? err.message : 'Verification failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSavedCredential = (jwt: string) => {
    setCredentialInput(jwt);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verify Credential
        </h2>
        <p className="text-gray-600">
          Check if a credential is valid by verifying its cryptographic signature
          and checking against the issuer&apos;s DID on the IOTA Tangle.
        </p>
      </div>

      {/* Explanation Card */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          How Verification Works
        </h3>
        <p className="text-sm text-indigo-800 mb-2">
          When you verify a credential, we:
        </p>
        <ol className="text-sm text-indigo-800 space-y-1 ml-4 list-decimal">
          <li>Parse the credential to extract the issuer&apos;s DID</li>
          <li>Fetch the issuer&apos;s DID Document from IOTA Tangle</li>
          <li>Extract the issuer&apos;s public key from their DID Document</li>
          <li>Verify the credential&apos;s signature using that public key</li>
          <li>Check if the credential has expired</li>
        </ol>
        <p className="text-sm text-indigo-800 mt-2">
          ✅ If all checks pass, the credential is <strong>valid</strong>!
        </p>
      </div>

      {/* Saved Credentials */}
      {savedCredentials.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">
            📝 Recently Issued Credentials
          </h3>
          <div className="space-y-2">
            {savedCredentials.slice(-3).reverse().map((cred, idx) => (
              <button
                key={idx}
                onClick={() => loadSavedCredential(cred.jwt)}
                className="w-full text-left px-3 py-2 bg-white border border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-800">
                  {cred.subject || 'Credential'}
                </div>
                <div className="text-xs text-gray-500">
                  Issued {new Date(cred.issued).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste Credential (JWT)
          </label>
          <textarea
            value={credentialInput}
            onChange={(e) => setCredentialInput(e.target.value)}
            placeholder="Paste the credential JWT here..."
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            💡 Tip: Paste the credential you received from the &quot;Issue Credential&quot; tab
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !credentialInput.trim()}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              Verify Credential
            </>
          )}
        </button>
      </form>

      {/* Verification Result - Valid */}
      {result && result.isValid && (
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 text-green-800">
            <div className="bg-green-600 rounded-full p-2">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Credential is Valid! ✅</h3>
              <p className="text-sm text-green-700">
                This credential has been verified and is authentic.
              </p>
            </div>
          </div>

          {/* Credential Details */}
          {result.credential && (
            <div className="bg-white border border-green-300 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-gray-800 mb-2">Credential Details:</h4>
              
              <div className="text-sm text-gray-800 space-y-2">
                <pre className="bg-gray-50 p-3 rounded overflow-auto text-xs">
                  {JSON.stringify(result.credential, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="bg-green-100 border border-green-300 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <strong>✅ What this means:</strong> The credential&apos;s signature is valid,
              it hasn&apos;t expired, and it was issued by the stated issuer. You can trust
              the claims made in this credential!
            </p>
          </div>
        </div>
      )}

      {/* Verification Result - Invalid */}
      {result && !result.isValid && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 text-red-800">
            <div className="bg-red-600 rounded-full p-2">
              <XCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Credential is Invalid ❌</h3>
              <p className="text-sm text-red-700">
                This credential could not be verified.
              </p>
            </div>
          </div>

          {result.error && (
            <div className="bg-white border border-red-300 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Error Details:</h4>
              <p className="text-sm text-red-700">{result.error}</p>
            </div>
          )}

          <div className="bg-red-100 border border-red-300 rounded-lg p-3">
            <p className="text-sm text-red-800">
              <strong>⚠️ Possible reasons:</strong>
            </p>
            <ul className="text-sm text-red-700 ml-4 list-disc mt-1 space-y-1">
              <li>The credential has been tampered with</li>
              <li>The credential has expired</li>
              <li>The issuer&apos;s DID could not be found</li>
              <li>Invalid credential format</li>
              <li>The signature doesn&apos;t match the issuer&apos;s public key</li>
            </ul>
          </div>
        </div>
      )}

      {/* How it Works */}
      <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <summary className="cursor-pointer font-medium text-gray-700">
          🔧 Technical Details
        </summary>
        <div className="mt-3 text-sm text-gray-600 space-y-2">
          <p>
            <strong>Signature Verification:</strong> We use the issuer&apos;s public key (from
            their DID Document) to verify the credential wasn&apos;t tampered with.
          </p>
          <p>
            <strong>Public Key Cryptography:</strong> The issuer signs with their private
            key, anyone can verify with the public key. If the signature is valid, the
            credential hasn&apos;t been modified.
          </p>
          <p>
            <strong>Onchain Verification:</strong> The issuer&apos;s DID Document is stored on
            IOTA Tangle, so we can always fetch the current public key to verify.
          </p>
          <p>
            <strong>Demo Note:</strong> This demo does basic validation. Production apps
            should also check revocation lists and verify the full JWT signature.
          </p>
        </div>
      </details>

      {/* Security Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-700 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <strong>Security Note:</strong> This is a demo application. In production,
            you should also check credential revocation status, use proper JWT verification,
            and validate against trusted issuer lists.
          </div>
        </div>
      </div>
    </div>
  );
}

