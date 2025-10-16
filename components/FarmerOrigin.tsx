'use client';

import React, { useState } from 'react';
import { createDID } from '@/lib/iotaIdentity';
import { stakeholders } from '@/data/stakeholders';
import { chocolateProduct } from '@/data/chocolate-product';
import { Loader2, CheckCircle2, Copy, Sprout, ExternalLink } from 'lucide-react';
import { getExplorerURL } from '@/lib/iotaExplorer';
import type { DPPCredential, OriginCertificationData } from '@/types/dpp';

/**
 * Farmer Origin Certification Component
 * Step 1 in the chocolate supply chain
 */

export function FarmerOrigin() {
  const [loading, setLoading] = useState(false);
  const [credential, setCredential] = useState<DPPCredential | null>(null);
  const [copied, setCopied] = useState(false);

  const issueOriginCertificate = async () => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create origin certification data
      const certificationData: OriginCertificationData = {
        certificationBody: "EU Organic",
        certificationNumber: "EU-ORG-2025-12345",
        origin: {
          country: stakeholders.farmer.country,
          region: stakeholders.farmer.location,
          farm: stakeholders.farmer.name,
          coordinates: stakeholders.farmer.coordinates
        },
        harvestDate: "2025-10-01",
        batchWeight: 2500, // kg
        cocoaVariety: "Nacional",
        fermentationDays: 6,
        dryingMethod: "Sun-dried"
      };
      
      // Create mock credential (in real app, this would use IOTA Identity SDK)
      const dppCredential: DPPCredential = {
        jwt: btoa(JSON.stringify({
          issuer: stakeholders.farmer.did,
          subject: chocolateProduct.did,
          type: "OrganicOriginCertification",
          data: certificationData,
          issuedAt: new Date().toISOString()
        })),
        issuer: stakeholders.farmer.name,
        issuerDID: stakeholders.farmer.did,
        subject: chocolateProduct.did,
        credentialType: "OrganicOriginCertification",
        issuedAt: new Date().toISOString(),
        certificationData
      };
      
      // Save to localStorage for demo
      localStorage.setItem('farmer-credential', JSON.stringify(dppCredential));
      
      setCredential(dppCredential);
    } catch (err) {
      console.error('Failed to issue credential:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyCredential = async () => {
    if (!credential) return;
    
    try {
      await navigator.clipboard.writeText(credential.jwt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sprout className="w-8 h-8 text-green-500" />
          <h2 className="text-2xl font-semibold text-white">
            Step 1: Origin Certification
          </h2>
        </div>
        <p className="text-zinc-300 text-sm">
          Farmer certifies organic cocoa harvest
        </p>
      </div>

      {/* Farmer Info Card */}
      <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-5">
        <h3 className="text-lg font-semibold text-white mb-3">
          {stakeholders.farmer.name}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-zinc-400">📍 Location:</span>
            <span className="text-white">{stakeholders.farmer.location}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-zinc-400">🌱 Certified:</span>
            <span className="text-white">{stakeholders.farmer.certifications.join(', ')}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-zinc-400">📅 Established:</span>
            <span className="text-white">{stakeholders.farmer.established}</span>
          </div>
        </div>
      </div>

      {!credential && !loading && (
        <>
          {/* Harvest Details Form */}
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-5 space-y-4">
            <h4 className="text-base font-medium text-white">Cocoa Batch Details</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-300 mb-1.5">Harvest Date</label>
                <input
                  type="date"
                  defaultValue="2025-10-01"
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white text-sm"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm text-zinc-300 mb-1.5">Batch Weight (kg)</label>
                <input
                  type="number"
                  defaultValue="2500"
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white text-sm"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm text-zinc-300 mb-1.5">Cocoa Variety</label>
                <input
                  defaultValue="Nacional"
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white text-sm"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm text-zinc-300 mb-1.5">Organic Cert #</label>
                <input
                  defaultValue="EU-ORG-2025-12345"
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white text-sm"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Issue Button */}
          <div className="flex justify-center">
            <button
              onClick={issueOriginCertificate}
              className="bg-green-600 hover:bg-green-500 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 text-sm flex items-center gap-2"
            >
              <Sprout className="w-4 h-4" />
              Issue Origin Certificate
            </button>
          </div>

          {/* Explainer */}
          <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">💡 What This Does</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Creates a cryptographically signed certificate proving:
            </p>
            <ul className="text-xs text-zinc-400 mt-2 ml-4 space-y-1">
              <li>• Cocoa is from certified organic farm in Ecuador</li>
              <li>• Harvested on specific date with batch traceability</li>
              <li>• Meets EU organic standards and Fair Trade requirements</li>
            </ul>
            <p className="text-xs text-blue-400 mt-3">
              <strong>For DPP:</strong> This is the first link in an unbreakable chain. Every claim is verifiable on the blockchain.
            </p>
          </div>
        </>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-8">
          <div className="text-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-green-500 mx-auto" />
            <p className="text-white font-medium">Issuing certificate...</p>
            <p className="text-xs text-zinc-400">Publishing to IOTA network</p>
          </div>
        </div>
      )}

      {/* Success State */}
      {credential && (
        <div className="bg-[#2a2a2a] border border-green-500/20 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 text-green-400">
            <CheckCircle2 className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Origin Certificate Issued!</h3>
          </div>

          <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs text-zinc-400 mb-1">Certificate JWT:</p>
                <code className="text-xs text-zinc-300 break-all block">{credential.jwt.substring(0, 100)}...</code>
              </div>
              <button
                onClick={copyCredential}
                className="flex-shrink-0 text-zinc-400 hover:text-white transition-colors"
                title="Copy certificate"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4 text-sm">
            <p className="text-white font-medium mb-2">Certificate Details:</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Origin:</span>
                <span className="text-zinc-200">{stakeholders.farmer.location}, Ecuador</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Batch:</span>
                <span className="text-zinc-200">2,500 kg Nacional cocoa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Certified:</span>
                <span className="text-zinc-200">EU Organic, Fair Trade</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Issued:</span>
                <span className="text-zinc-200">{new Date(credential.issuedAt).toLocaleString()}</span>
              </div>
            </div>
            
            {/* External Proof */}
            <div className="mt-3 pt-3 border-t border-[#3a3a3a]">
              <a
                href={getExplorerURL(stakeholders.farmer.did)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>View DID on IOTA Explorer (External Proof)</span>
              </a>
              <p className="text-xs text-zinc-500 mt-1.5">
                🔒 Independently verify this identity on the blockchain
              </p>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-sm text-green-400 font-medium mb-1">✅ Ready for Next Step</p>
            <p className="text-xs text-zinc-300">
              This certificate can now be verified by the factory before production.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

