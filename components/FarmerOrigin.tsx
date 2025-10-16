'use client';

import React, { useState } from 'react';
import { createDID } from '@/lib/iotaIdentity';
import { industryData, type IndustryId } from '@/data/industry-data';
import { Loader2, CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import { getExplorerURL } from '@/lib/iotaExplorer';
import type { DPPCredential, OriginCertificationData } from '@/types/dpp';

/**
 * Origin Certification Component
 * Step 1 in the supply chain - dynamic for all industries
 */

interface FarmerOriginProps {
  industry: string | null;
}

export function FarmerOrigin({ industry }: FarmerOriginProps) {
  // Get industry-specific data with safety check
  const industryKey = (industry && industry in industryData) 
    ? industry as IndustryId 
    : 'food-beverage';
  const data = industryData[industryKey];
  
  const originStakeholder = ('farmer' in data.stakeholders) 
    ? data.stakeholders.farmer 
    : ('miner' in data.stakeholders) 
      ? data.stakeholders.miner 
      : data.stakeholders.supplier;
  const product = data.product;
  const labels = data.labels;
  const [loading, setLoading] = useState(false);
  const [credential, setCredential] = useState<DPPCredential | null>(null);
  const [copied, setCopied] = useState(false);

  const issueOriginCertificate = async () => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create origin certification data
      const certificationData: OriginCertificationData = {
        certificationBody: originStakeholder.certifications[0],
        certificationNumber: `${industry?.toUpperCase()}-CERT-2025-12345`,
        origin: {
          country: originStakeholder.country,
          region: originStakeholder.location,
          farm: originStakeholder.name,
          coordinates: originStakeholder.coordinates || { lat: 0, lng: 0 }
        },
        harvestDate: "2025-10-01",
        batchWeight: 2500, // kg
        cocoaVariety: "Premium",
        fermentationDays: 6,
        dryingMethod: "Standard"
      };
      
      // Create mock credential (in real app, this would use IOTA Identity SDK)
      const dppCredential: DPPCredential = {
        jwt: btoa(JSON.stringify({
          issuer: originStakeholder.did,
          subject: product.did,
          type: labels.originCredential,
          data: certificationData,
          issuedAt: new Date().toISOString()
        })),
        issuer: originStakeholder.name,
        issuerDID: originStakeholder.did,
        subject: product.did,
        credentialType: labels.originCredential,
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
          <span className="text-3xl">{labels.originIcon}</span>
          <h2 className="text-2xl font-semibold text-white">
            Step 1: Origin Certification
          </h2>
        </div>
        <p className="text-zinc-300 text-sm">
          {labels.originStep} certifies {product.type.replace('_', ' ')} origin
        </p>
      </div>

      {/* Stakeholder Info Card */}
      <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-5">
        <h3 className="text-lg font-semibold text-white mb-3">
          {originStakeholder.name}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-zinc-400">📍 Location:</span>
            <span className="text-white">{originStakeholder.location}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-zinc-400">✅ Certified:</span>
            <span className="text-white">{originStakeholder.certifications.join(', ')}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-zinc-400">📅 Established:</span>
            <span className="text-white">{originStakeholder.established}</span>
          </div>
        </div>
      </div>

      {!credential && !loading && (
        <>
          {/* Harvest Details Form */}
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-5 space-y-4">
            <h4 className="text-base font-medium text-white">{labels.batchLabel}</h4>
            
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
                <label className="block text-sm text-zinc-300 mb-1.5">Variety/Type</label>
                <input
                  defaultValue="Premium"
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white text-sm"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm text-zinc-300 mb-1.5">Certification #</label>
                <input
                  defaultValue={`${industry?.toUpperCase()}-CERT-2025-12345`}
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
              <span className="text-lg">{labels.originIcon}</span>
              Issue Origin Certificate
            </button>
          </div>

          {/* Explainer - Collapsible */}
          <details className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-4">
            <summary className="text-sm font-medium text-white cursor-pointer hover:text-blue-400 transition-colors flex items-center gap-2">
              <span>💡 What This Does</span>
            </summary>
            <div className="mt-3 space-y-3">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Creates a cryptographically signed certificate proving:
              </p>
              <ul className="text-xs text-zinc-400 ml-4 space-y-1">
                <li>• Origin from {originStakeholder.location}</li>
                <li>• Harvested/extracted on specific date with batch traceability</li>
                <li>• Meets certification standards: {originStakeholder.certifications.join(', ')}</li>
              </ul>
              <p className="text-xs text-blue-400">
                <strong>For DPP:</strong> This is the first link in an unbreakable chain. Every claim is verifiable on the blockchain.
              </p>
            </div>
          </details>
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
                <span className="text-zinc-200">{originStakeholder.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Batch:</span>
                <span className="text-zinc-200">2,500 kg Premium grade</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Certified:</span>
                <span className="text-zinc-200">{originStakeholder.certifications.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Issued:</span>
                <span className="text-zinc-200">{new Date(credential.issuedAt).toLocaleString()}</span>
              </div>
            </div>
            
            {/* IOTA Identity Info */}
            <div className="mt-3 pt-3 border-t border-[#3a3a3a]">
              <a
                href={getExplorerURL(originStakeholder.did)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Learn about IOTA Identity & DIDs</span>
              </a>
              <p className="text-xs text-zinc-500 mt-1.5">
                💡 In production, this would link to verifiable blockchain proof
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

