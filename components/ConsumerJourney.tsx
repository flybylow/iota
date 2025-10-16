'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Shield, QrCode, ExternalLink, Sprout, Factory } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getExplorerURL } from '@/lib/iotaExplorer';
import { industryData, type IndustryId } from '@/data/industry-data';
import type { DPPCredential } from '@/types/dpp';

/**
 * Consumer Journey Component
 * Step 3: Consumer scans QR code and verifies complete supply chain - dynamic for all industries
 */

interface ConsumerJourneyProps {
  industry: string | null;
}

export function ConsumerJourney({ industry }: ConsumerJourneyProps) {
  // Get industry-specific data with safety check
  const industryKey = (industry && industry in industryData) 
    ? industry as IndustryId 
    : 'food-beverage';
  const data = industryData[industryKey];
  
  const product = data.product;
  const [journey, setJourney] = useState<DPPCredential[]>([]);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Auto-load credentials if available
    loadCredentials();
  }, []);

  useEffect(() => {
    if (verified) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  }, [verified]);

  const loadCredentials = () => {
    const farmer = localStorage.getItem('farmer-credential');
    const factory = localStorage.getItem('factory-credential');
    
    const creds: DPPCredential[] = [];
    
    if (farmer) {
      try {
        creds.push(JSON.parse(farmer));
      } catch (err) {
        console.error('Failed to parse farmer credential:', err);
      }
    }
    
    if (factory) {
      try {
        creds.push(JSON.parse(factory));
      } catch (err) {
        console.error('Failed to parse factory credential:', err);
      }
    }
    
    if (creds.length > 0) {
      setJourney(creds);
    }
  };

  const scanAndVerify = async () => {
    setLoading(true);
    setVerified(false);
    
    try {
      // Simulate QR code scan and verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      loadCredentials();
      setVerified(true);
    } catch (err) {
      console.error('Verification failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full">
          <span className="text-sm text-purple-400 font-medium">Step 3 of 3</span>
        </div>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Shield className="w-8 h-8 text-purple-500" />
          <h2 className="text-2xl font-semibold text-white">
            Consumer Verifies Complete Chain
          </h2>
        </div>
        <p className="text-zinc-300 text-sm">
          Scan QR code to verify entire supply chain
        </p>
      </div>

      {/* Context/Story Card - Collapsible */}
      {!verified && !loading && (
        <details className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-lg overflow-hidden group">
          <summary className="p-5 cursor-pointer list-none hover:bg-purple-500/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🍫</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  You Buy the Chocolate
                  <span className="text-xs text-zinc-400 group-open:rotate-180 transition-transform">▼</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">Click to learn more about the consumer story</p>
              </div>
            </div>
          </summary>
          <div className="px-5 pb-5 pt-2 space-y-3">
            <p className="text-sm text-zinc-300 leading-relaxed">
              You&apos;re standing in a supermarket in Amsterdam. The chocolate bar 
              claims to be &quot;Single-origin Ecuador, Organic, Fair Trade.&quot; 
              But is it true?
            </p>
            <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-3 space-y-2">
              <div>
                <p className="text-xs font-medium text-zinc-400 mb-1">❌ Traditional Method:</p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Rely on brand reputation. Call suppliers to verify (takes days).
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-green-400 mb-1">✅ With DIDs:</p>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Scan QR code. Verify entire supply chain in 2 seconds with cryptographic proof.
                </p>
              </div>
            </div>
          </div>
        </details>
      )}

      {!verified && !loading && (
        <>
          {/* QR Code Scanner Simulation */}
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-8">
            <div className="text-center space-y-4">
              <div className="bg-[#1a1a1a] border-2 border-dashed border-[#3a3a3a] rounded-lg p-8 mx-auto max-w-xs">
                <QrCode className="w-24 h-24 text-zinc-600 mx-auto mb-3" />
                <p className="text-sm text-zinc-400">QR Code on {product.name}</p>
                <p className="text-xs text-zinc-500 mt-2">Batch: {product.batchNumber}</p>
              </div>
              
              <p className="text-sm text-zinc-400">
                In a real app, use your phone camera to scan
              </p>
              
              <button
                onClick={scanAndVerify}
                className="bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 px-8 rounded-full transition-all duration-200 text-sm inline-flex items-center gap-2 shadow-lg"
              >
                <QrCode className="w-4 h-4" />
                Simulate QR Scan & Verify
              </button>
            </div>
          </div>

          {/* Explainer - Collapsible */}
          <details className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-4">
            <summary className="text-sm font-medium text-white cursor-pointer hover:text-blue-400 transition-colors flex items-center gap-2">
              <span>💡 Why This Matters</span>
            </summary>
            <div className="mt-3 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-white mb-2">For Consumers</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Scan any product QR code and instantly see the verified supply chain. 
                  No waiting, no phone calls, just instant cryptographic verification.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-400 mb-2">For Your DPP Business</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  This proves your solution works. Show this to chocolate brands, coffee roasters, 
                  fashion companies - anyone with supply chain transparency needs.
                </p>
              </div>
            </div>
          </details>
        </>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-8">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
            </div>
            <p className="text-white font-medium">Verifying Supply Chain...</p>
            <div className="bg-[#1a1a1a] rounded-lg p-4 text-left max-w-md mx-auto">
              <p className="text-xs text-zinc-400 mb-2">Checking:</p>
              <ul className="space-y-1.5 text-xs text-zinc-500">
                <li>• Fetching credentials from IOTA network...</li>
                <li>• Verifying cryptographic signatures...</li>
                <li>• Validating credential chain...</li>
                <li>• Checking for revocations...</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Verified Journey */}
      {verified && journey.length > 0 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
              <h3 className="text-xl font-semibold text-white">
                ✅ All Claims Verified!
              </h3>
            </div>
            <p className="text-sm text-zinc-300">
              This chocolate bar&apos;s journey from Ecuador farm to Belgian factory has been 
              cryptographically verified on the IOTA network.
            </p>
          </div>

          {/* Supply Chain Timeline */}
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>🗺️</span> Verified Supply Chain Journey
            </h3>

            <div className="space-y-4">
              {journey.map((step, index) => (
                <div 
                  key={index}
                  className="bg-[#1a1a1a] border border-green-500/20 rounded-lg p-4 relative"
                >
                  {/* Connection Line */}
                  {index < journey.length - 1 && (
                    <div className="absolute left-8 top-full h-4 w-0.5 bg-green-500/30" />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center">
                        {step.credentialType === 'OrganicOriginCertification' && (
                          <Sprout className="w-6 h-6 text-green-400" />
                        )}
                        {step.credentialType === 'ProductionCertification' && (
                          <Factory className="w-6 h-6 text-blue-400" />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-semibold text-white">
                            {step.credentialType === 'OrganicOriginCertification' && '🌱 Origin Certification'}
                            {step.credentialType === 'ProductionCertification' && '🏭 Production Certification'}
                          </h4>
                          <p className="text-xs text-zinc-400 mt-0.5">{step.issuer}</p>
                        </div>
                        <span className="text-green-400 text-xs font-medium">✓ Verified</span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {step.credentialType === 'OrganicOriginCertification' && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Origin:</span>
                              <span className="text-zinc-300">Ecuador</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Certification:</span>
                              <span className="text-zinc-300">EU Organic, Fair Trade</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Harvest:</span>
                              <span className="text-zinc-300">October 1, 2025</span>
                            </div>
                          </>
                        )}
                        {step.credentialType === 'ProductionCertification' && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Manufacturer:</span>
                              <span className="text-zinc-300">Chocolate Dreams Factory, Belgium</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Batch:</span>
                              <span className="text-zinc-300">CH-2025-001</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Produced:</span>
                              <span className="text-zinc-300">October 15, 2025</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Quality:</span>
                              <span className="text-green-400">All checks passed ✓</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between border-t border-[#27272a] pt-1.5 mt-1.5">
                          <span className="text-zinc-500">Issued:</span>
                          <span className="text-zinc-400">{new Date(step.issuedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#2a2a2a] border border-green-500/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-400 mb-3">✅ Verification Summary</h4>
              <ul className="space-y-1.5 text-xs">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300">Organic certification: Valid</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300">Origin claims: Ecuador, verified</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300">Production records: Complete</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300">Chain of custody: Unbroken</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#2a2a2a] border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-400 mb-3">🌍 Sustainability</h4>
              <ul className="space-y-1.5 text-xs">
                <li className="flex justify-between">
                  <span className="text-zinc-400">Carbon Footprint:</span>
                  <span className="text-zinc-200">850g CO₂</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-zinc-400">Packaging:</span>
                  <span className="text-zinc-200">Compostable</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-zinc-400">Fair Trade:</span>
                  <span className="text-green-400">Yes ✓</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-zinc-400">Recyclable:</span>
                  <span className="text-green-400">100% ✓</span>
                </li>
              </ul>
            </div>
          </div>

          {/* External Proof - IOTA Explorer */}
          <div className="bg-[#1a1a1a] border border-blue-500/20 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <ExternalLink className="w-5 h-5 text-blue-400" />
              <h4 className="text-sm font-medium text-blue-400">🔒 External Proof</h4>
            </div>
            
            <p className="text-xs text-zinc-400 mb-4">
              All identities and credentials are verifiable on the IOTA Tangle. 
              Click below to independently verify on the blockchain:
            </p>
            
            <div className="space-y-2">
              {journey.map((step, index) => (
                <a
                  key={index}
                  href={getExplorerURL(step.issuerDID)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg hover:border-blue-500/30 transition-colors group no-underline"
                >
                  <div className="flex items-center gap-3">
                    {step.credentialType === 'OrganicOriginCertification' && (
                      <Sprout className="w-4 h-4 text-green-400" />
                    )}
                    {step.credentialType === 'ProductionCertification' && (
                      <Factory className="w-4 h-4 text-blue-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{step.issuer}</p>
                      <p className="text-xs text-white">
                        DID: {step.issuerDID.substring(0, 35)}...
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                </a>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t border-[#27272a]">
              <p className="text-xs text-zinc-500">
                💡 <strong className="text-zinc-400">What this proves:</strong> These identities exist on a public, 
                immutable blockchain. Anyone, anywhere can verify them independently without 
                trusting this website.
              </p>
            </div>
          </div>

          {/* Technical Proof */}
          <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">🔐 How Verification Works</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Each step in the supply chain is cryptographically signed and stored on the IOTA network. 
              The factory&apos;s certificate <strong>references</strong> the farmer&apos;s certificate, 
              creating an immutable chain that cannot be faked.
            </p>
            <p className="text-xs text-zinc-500">
              <strong>Technical:</strong> Uses W3C Verifiable Credentials with Ed25519 signatures • 
              <a 
                href="https://docs.iota.org/developer/iota-identity/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-400 hover:underline ml-1 inline-flex items-center gap-1"
              >
                Learn more
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          {/* Comparison Section */}
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">
              Traditional vs Blockchain Identity
            </h3>
            
            <div className="overflow-x-auto">
              <div className="min-w-[500px]">
                {/* Header Row */}
                <div className="grid grid-cols-3 gap-px bg-[#3a3a3a] rounded-t-lg overflow-hidden">
                  <div className="bg-[#1a1a1a] p-3"></div>
                  <div className="bg-[#1a1a1a] p-3">
                    <p className="text-xs font-medium text-zinc-400 text-center">Traditional Method</p>
                  </div>
                  <div className="bg-blue-500/10 p-3">
                    <p className="text-xs font-semibold text-blue-400 text-center">With DIDs</p>
                  </div>
                </div>
                
                {/* Data Rows */}
                <div className="grid grid-cols-3 gap-px bg-[#3a3a3a]">
                  <div className="bg-[#1a1a1a] p-3">
                    <p className="text-xs font-medium text-zinc-300">Speed</p>
                  </div>
                  <div className="bg-[#1a1a1a] p-3">
                    <p className="text-xs text-zinc-400">3-5 business days</p>
                  </div>
                  <div className="bg-green-500/5 p-3">
                    <p className="text-xs font-medium text-green-400">2 seconds ⚡</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-px bg-[#3a3a3a]">
                  <div className="bg-[#1a1a1a] p-3">
                    <p className="text-xs font-medium text-zinc-300">Cost</p>
                  </div>
                  <div className="bg-[#1a1a1a] p-3">
                    <p className="text-xs text-zinc-400">Phone calls, emails, labor</p>
                  </div>
                  <div className="bg-green-500/5 p-3">
                    <p className="text-xs font-medium text-green-400">$0.001 per verification</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-px bg-[#3a3a3a]">
                  <div className="bg-[#1a1a1a] p-3">
                    <p className="text-xs font-medium text-zinc-300">Trust Model</p>
                  </div>
                  <div className="bg-[#1a1a1a] p-3">
                    <p className="text-xs text-zinc-400">Rely on reputation & processes</p>
                  </div>
                  <div className="bg-green-500/5 p-3">
                    <p className="text-xs font-medium text-green-400">Cryptographically verifiable ✅</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-px bg-[#3a3a3a]">
                  <div className="bg-[#1a1a1a] p-3">
                    <p className="text-xs font-medium text-zinc-300">Forgery Risk</p>
                  </div>
                  <div className="bg-[#1a1a1a] p-3">
                    <p className="text-xs text-zinc-400">Paper certificates can be faked</p>
                  </div>
                  <div className="bg-green-500/5 p-3">
                    <p className="text-xs font-medium text-green-400">Mathematically impossible ✅</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-px bg-[#3a3a3a] rounded-b-lg overflow-hidden">
                  <div className="bg-[#1a1a1a] p-3">
                    <p className="text-xs font-medium text-zinc-300">Availability</p>
                  </div>
                  <div className="bg-[#1a1a1a] p-3">
                    <p className="text-xs text-zinc-400">9-5 business hours</p>
                  </div>
                  <div className="bg-green-500/5 p-3">
                    <p className="text-xs font-medium text-green-400">24/7 global access ✅</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DPP Use Cases */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3 text-center">
              💡 For Digital Product Passports
            </h3>
            <p className="text-sm text-zinc-300 mb-4 text-center">
              This demo shows the core technology behind EU Digital Product Passports. 
              Every product will have a verifiable identity and supply chain history.
            </p>
            
            <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4">
              <p className="text-xs font-medium text-white mb-3">Works for any product:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <span>🔋</span>
                  <span>EV Batteries (mandatory Feb 2027)</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <span>👕</span>
                  <span>Textiles & Fashion (2027)</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <span>📱</span>
                  <span>Electronics (2028)</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <span>🪑</span>
                  <span>Furniture (2028)</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <span>🍫</span>
                  <span>Food & Beverage (voluntary)</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <span>🏗️</span>
                  <span>Construction Materials (2028)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 sm:p-8 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Ready to Implement DPP for Your Products?
            </h3>
            <p className="text-sm text-white/90 mb-6 max-w-xl mx-auto">
              We help manufacturers design and build Digital Product Passport systems 
              using this exact technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <button className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm">
                📅 Book 30-Minute Consultation
              </button>
              <button className="px-6 py-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition-colors text-sm border-2 border-white/20">
                📧 Get Implementation Guide
              </button>
            </div>
            
            <p className="text-xs text-white/70">
              No sales pitch. Let&apos;s discuss your specific needs.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setVerified(false);
                setJourney([]);
              }}
              className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors text-sm"
            >
              Scan Another Product
            </button>
            <button
              className="flex-1 px-6 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-zinc-300 font-medium rounded-lg transition-colors text-sm border border-[#3a3a3a]"
            >
              Share Journey
            </button>
          </div>
        </div>
      )}

      {/* No Credentials Available */}
      {verified && journey.length === 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
          <div className="text-center space-y-3">
            <p className="text-sm text-yellow-400 font-medium">
              ⚠️ No supply chain data found
            </p>
            <p className="text-xs text-zinc-400">
              Please complete Steps 1 and 2 first to create the supply chain credentials.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

