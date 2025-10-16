'use client';

import React, { useState, useEffect } from 'react';
import { issueCredential } from '@/lib/iotaIdentity';
import { Loader2, CheckCircle2, Copy, AlertCircle, Award } from 'lucide-react';

/**
 * IssueCredential Component
 * 
 * Allows users to issue a Verifiable Credential (VC).
 * 
 * What is a Verifiable Credential?
 * - A digital statement that one entity makes about another
 * - Like a diploma, but digital and cryptographically verifiable
 * - Contains: issuer, subject, claims, signature, expiration
 * 
 * Example: "University of MIT certifies that Alice completed a Bachelor of Science"
 */
export function IssueCredential() {
  const [formData, setFormData] = useState({
    issuerDID: '',
    holderDID: '',
    name: 'Alice Johnson',
    degree: 'Bachelor of Science in Computer Science',
    university: 'Massachusetts Institute of Technology (MIT)',
  });
  const [credential, setCredential] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedDIDs, setSavedDIDs] = useState<Array<{ did: string; created: string; document: unknown }>>([]);

  // Load saved DIDs from localStorage
  useEffect(() => {
    const dids = JSON.parse(localStorage.getItem('iota-dids') || '[]');
    setSavedDIDs(dids);
    
    // Auto-fill issuer DID if available
    if (dids.length > 0 && !formData.issuerDID) {
      setFormData(prev => ({ ...prev, issuerDID: dids[0].did }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCredential(null);

    // Validation
    if (!formData.issuerDID || !formData.holderDID) {
      setError('Both Issuer DID and Holder DID are required');
      setLoading(false);
      return;
    }

    if (!formData.name || !formData.degree || !formData.university) {
      setError('Please fill in all credential fields');
      setLoading(false);
      return;
    }

    try {
      const jwt = await issueCredential(
        formData.issuerDID,
        formData.holderDID,
        {
          name: formData.name,
          degree: formData.degree,
          university: formData.university,
        }
      );
      setCredential(jwt);
      
      // Save to localStorage
      const savedCreds = JSON.parse(localStorage.getItem('iota-credentials') || '[]');
      savedCreds.push({
        jwt,
        issued: new Date().toISOString(),
        subject: formData.name,
      });
      localStorage.setItem('iota-credentials', JSON.stringify(savedCreds));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to issue credential');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Issue Verifiable Credential
        </h2>
        <p className="text-gray-600">
          Create a digital certificate that makes verifiable claims about someone.
          Think of it like issuing a diploma or professional certification.
        </p>
      </div>

      {/* Explanation Card */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
          <Award className="w-5 h-5" />
          What is a Verifiable Credential?
        </h3>
        <p className="text-sm text-purple-800 mb-2">
          A Verifiable Credential (VC) is a tamper-proof digital certificate:
        </p>
        <ul className="text-sm text-purple-800 space-y-1 ml-4 list-disc">
          <li><strong>Issuer:</strong> Who issued the credential (e.g., university)</li>
          <li><strong>Holder:</strong> Who the credential is about (e.g., student)</li>
          <li><strong>Claims:</strong> What is being certified (e.g., degree earned)</li>
          <li><strong>Signature:</strong> Cryptographic proof it&apos;s authentic</li>
          <li><strong>Expiration:</strong> When the credential expires</li>
        </ul>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Issuer DID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issuer DID (Who is issuing this credential?)
          </label>
          <select
            value={formData.issuerDID}
            onChange={(e) => setFormData({ ...formData, issuerDID: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">
              {savedDIDs.length === 0 
                ? '⚠️ No DIDs found - Create one in Tab 1 first' 
                : 'Select a DID or paste one below'}
            </option>
            {savedDIDs.map((did, idx) => (
              <option key={idx} value={did.did}>
                🆔 {did.did.substring(0, 40)}... (created {new Date(did.created).toLocaleDateString()})
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Or paste issuer DID here (did:iota:smr:0x...)"
            value={formData.issuerDID}
            onChange={(e) => setFormData({ ...formData, issuerDID: e.target.value })}
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
          />
          {savedDIDs.length > 0 && !formData.holderDID && (
            <button
              type="button"
              onClick={() => setFormData({ ...formData, holderDID: formData.issuerDID })}
              className="mt-2 text-sm text-purple-600 hover:text-purple-700 underline"
            >
              💡 Use same DID as holder (self-issued credential)
            </button>
          )}
        </div>

        {/* Holder DID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Holder DID (Who will receive this credential?)
          </label>
          <input
            type="text"
            placeholder="Paste holder DID here (did:iota:smr:0x...)"
            value={formData.holderDID}
            onChange={(e) => setFormData({ ...formData, holderDID: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
          />
          <div className="mt-2 flex gap-2 flex-wrap">
            {savedDIDs.slice(0, 3).map((did, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setFormData({ ...formData, holderDID: did.did })}
                className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
              >
                Use DID #{idx + 1}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Create another DID in tab 1, or use the same DID (self-issued credential)
          </p>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-800 mb-3">Credential Claims</h3>
          
          {/* Name */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Name
            </label>
            <input
              type="text"
              placeholder="e.g., Alice Johnson"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Degree */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Degree / Certification
            </label>
            <input
              type="text"
              placeholder="e.g., Bachelor of Science in Computer Science"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* University */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              University / Institution
            </label>
            <input
              type="text"
              placeholder="e.g., Massachusetts Institute of Technology"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Issuing Credential...
            </>
          ) : (
            <>
              <Award className="w-5 h-5" />
              Issue Credential
            </>
          )}
        </button>
      </form>

      {/* Success Result */}
      {credential && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle2 className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Credential Issued Successfully!</h3>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Credential (JWT):
            </label>
            <div className="bg-white border border-green-300 rounded-lg p-3 max-h-40 overflow-y-auto">
              <div className="flex items-start justify-between gap-2">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap break-all font-mono">
                  {credential}
                </pre>
                <button
                  onClick={() => copyToClipboard(credential)}
                  className="text-green-600 hover:text-green-700 flex-shrink-0 sticky top-0"
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
          </div>

          <p className="text-sm text-gray-600">
            💾 <strong>Next step:</strong> Copy this credential and verify it in the
            &quot;Verify Credential&quot; tab!
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-2 text-red-800">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">Error Issuing Credential</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Technical Details */}
      <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <summary className="cursor-pointer font-medium text-gray-700">
          🔧 Technical Details
        </summary>
        <div className="mt-3 text-sm text-gray-600 space-y-2">
          <p>
            <strong>Format:</strong> Credentials are formatted as JSON Web Tokens (JWT)
          </p>
          <p>
            <strong>Signing:</strong> In production, credentials are signed with the issuer&apos;s
            private key. This demo creates unsigned credentials for simplicity.
          </p>
          <p>
            <strong>Expiration:</strong> Credentials expire after 1 year from issuance
          </p>
          <p>
            <strong>Standard:</strong> Follows W3C Verifiable Credentials specification
          </p>
        </div>
      </details>
    </div>
  );
}

