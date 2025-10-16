'use client';

import React, { useState, useEffect } from 'react';
import { stakeholders } from '@/data/stakeholders';
import { chocolateProduct } from '@/data/chocolate-product';
import { Loader2, CheckCircle2, XCircle, Factory, AlertCircle } from 'lucide-react';
import type { DPPCredential, ProductionCertificationData } from '@/types/dpp';

/**
 * Factory Production Component
 * Step 2 in the chocolate supply chain
 * Verifies farmer's certificate before producing
 */

export function FactoryProduction() {
  const [farmerCredential, setFarmerCredential] = useState<DPPCredential | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  const [loading, setLoading] = useState(false);
  const [productionCredential, setProductionCredential] = useState<DPPCredential | null>(null);

  useEffect(() => {
    // Auto-load farmer credential from localStorage
    const saved = localStorage.getItem('farmer-credential');
    if (saved) {
      try {
        const cred = JSON.parse(saved);
        setFarmerCredential(cred);
      } catch (err) {
        console.error('Failed to load farmer credential:', err);
      }
    }
  }, []);

  const verifyFarmerCertificate = async () => {
    if (!farmerCredential) {
      setVerificationStatus('failed');
      return;
    }

    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, verify signature on IOTA network
      // For demo, check if it exists and has correct structure
      if (farmerCredential.credentialType === 'OrganicOriginCertification') {
        setVerificationStatus('verified');
      } else {
        setVerificationStatus('failed');
      }
    } catch (err) {
      setVerificationStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const issueProductionCertificate = async () => {
    if (verificationStatus !== 'verified') {
      alert("❌ Cannot produce: Farmer's certificate must be verified first!");
      return;
    }

    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      const certificationData: ProductionCertificationData = {
        manufacturer: stakeholders.factory.name,
        productionDate: "2025-10-15",
        batchNumber: chocolateProduct.batchNumber,
        recipe: {
          cocoaMass: 70,
          sugar: 25,
          cocoaButter: 5
        },
        qualityChecks: [
          { test: "Temperature control", result: "Pass - 45°C maintained" },
          { test: "Mixing time", result: "Pass - 12 hours" },
          { test: "Conching duration", result: "Pass - 48 hours" }
        ],
        packaging: "Compostable PLA wrapper",
        unitsProduced: 50000
      };

      const dppCredential: DPPCredential = {
        jwt: btoa(JSON.stringify({
          issuer: stakeholders.factory.did,
          subject: chocolateProduct.did,
          type: "ProductionCertification",
          data: certificationData,
          issuedAt: new Date().toISOString(),
          previousCredentials: [farmerCredential?.jwt] // Credential chaining!
        })),
        issuer: stakeholders.factory.name,
        issuerDID: stakeholders.factory.did,
        subject: chocolateProduct.did,
        credentialType: "ProductionCertification",
        issuedAt: new Date().toISOString(),
        certificationData,
        previousCredentials: [farmerCredential?.jwt || '']
      };

      localStorage.setItem('factory-credential', JSON.stringify(dppCredential));
      setProductionCredential(dppCredential);
    } catch (err) {
      console.error('Failed to issue production credential:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Factory className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-semibold text-white">
            Step 2: Factory Production
          </h2>
        </div>
        <p className="text-zinc-300 text-sm">
          Verify ingredients, then produce chocolate
        </p>
      </div>

      {/* Factory Info Card */}
      <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-5">
        <h3 className="text-lg font-semibold text-white mb-3">
          {stakeholders.factory.name}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-zinc-400">📍 Location:</span>
            <span className="text-white">{stakeholders.factory.location}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-zinc-400">✅ Certified:</span>
            <span className="text-white">{stakeholders.factory.certifications.join(', ')}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-zinc-400">⚡ Capacity:</span>
            <span className="text-white">{stakeholders.factory.capacity}</span>
          </div>
        </div>
      </div>

      {!productionCredential && (
        <>
          {/* Verification Step */}
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-5 space-y-4">
            <h4 className="text-base font-medium text-white">1. Verify Incoming Cocoa</h4>
            
            {farmerCredential ? (
              <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4">
                <p className="text-xs text-zinc-400 mb-2">Farmer Certificate Detected:</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">From:</span>
                    <span className="text-zinc-200">{farmerCredential.issuer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Type:</span>
                    <span className="text-zinc-200">{farmerCredential.credentialType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Issued:</span>
                    <span className="text-zinc-200">{new Date(farmerCredential.issuedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <p className="text-sm text-yellow-400">
                    No farmer certificate found. Complete Step 1 first.
                  </p>
                </div>
              </div>
            )}

            {verificationStatus === 'pending' && farmerCredential && (
              <button
                onClick={verifyFarmerCertificate}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 text-sm"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying on IOTA network...
                  </div>
                ) : (
                  'Verify Certificate'
                )}
              </button>
            )}

            {verificationStatus === 'verified' && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-start gap-2 text-green-400">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium mb-2">✅ Cocoa Origin Verified!</p>
                    <ul className="space-y-1 text-xs text-green-300">
                      <li>• From: Maria&apos;s Organic Cocoa Farm, Ecuador</li>
                      <li>• Certification: EU Organic #EU-ORG-2025-12345</li>
                      <li>• Harvest: October 1, 2025</li>
                      <li>• Batch: 2,500 kg Nacional variety</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {verificationStatus === 'failed' && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-start gap-2 text-red-400">
                  <XCircle className="w-5 h-5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">❌ Verification Failed</p>
                    <p className="text-xs text-red-300 mt-1">
                      Certificate is invalid or has been revoked. Cannot proceed with production.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Production Step */}
          {verificationStatus === 'verified' && (
            <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-5 space-y-4">
              <h4 className="text-base font-medium text-white">2. Record Production</h4>

              <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4">
                <p className="text-sm font-medium text-white mb-3">Recipe:</p>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  <li>• 70% Cocoa mass (verified from Maria&apos;s Farm ✓)</li>
                  <li>• 25% Organic cane sugar (France)</li>
                  <li>• 5% Cocoa butter (Belgium)</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-zinc-400 text-xs mb-1">Batch Number:</p>
                  <p className="text-white font-mono text-xs">{chocolateProduct.batchNumber}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-xs mb-1">Units Produced:</p>
                  <p className="text-white font-mono text-xs">50,000 bars</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-xs mb-1">Production Date:</p>
                  <p className="text-white font-mono text-xs">Oct 15, 2025</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-xs mb-1">Packaging:</p>
                  <p className="text-white font-mono text-xs">Compostable PLA</p>
                </div>
              </div>

              <button
                onClick={issueProductionCertificate}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Issuing Production Certificate...
                  </>
                ) : (
                  <>
                    <Factory className="w-4 h-4" />
                    Issue Production Certificate
                  </>
                )}
              </button>
            </div>
          )}

          {/* Explainer */}
          <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">💡 Credential Chaining</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The factory <strong>MUST verify</strong> the farmer&apos;s certificate before producing. 
              The production certificate then <strong>references</strong> the origin certificate, 
              creating an immutable chain of custody.
            </p>
            <p className="text-xs text-blue-400 mt-3">
              <strong>For DPP:</strong> This prevents fraud. You can&apos;t claim &quot;organic&quot; chocolate if the organic cocoa certificate doesn&apos;t verify!
            </p>
          </div>
        </>
      )}

      {/* Success State */}
      {productionCredential && (
        <div className="bg-[#2a2a2a] border border-blue-500/20 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 text-blue-400">
            <CheckCircle2 className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Production Certificate Issued!</h3>
          </div>

          <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4">
            <p className="text-sm text-white font-medium mb-3">Production Summary:</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Batch:</span>
                <span className="text-zinc-200">{chocolateProduct.batchNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Product:</span>
                <span className="text-zinc-200">{chocolateProduct.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Units:</span>
                <span className="text-zinc-200">50,000 bars</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Quality Checks:</span>
                <span className="text-green-400">All Passed ✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Traceability:</span>
                <span className="text-green-400">Complete ✓</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-blue-400 font-medium mb-1">🔗 Credential Chain Created</p>
            <p className="text-xs text-zinc-300">
              This production certificate is cryptographically linked to the farmer&apos;s origin certificate. 
              The full supply chain is now verifiable by anyone.
            </p>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-sm text-green-400 font-medium mb-1">✅ Ready for Consumer Verification</p>
            <p className="text-xs text-zinc-300">
              Consumers can now scan the QR code to see the complete verified journey.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

