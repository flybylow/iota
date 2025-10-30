'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Shield, ExternalLink, Sprout, Factory } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { getExplorerURL, getRealExplorerURL, getBlockExplorerURL } from '@/lib/iotaExplorer';
import { isBlockchainMode } from '@/lib/dppMode';
import { verifyCredential } from '@/lib/iotaIdentityReal';
import { industryData, type IndustryId } from '@/data/industry-data';
import type { DPPCredential, OriginCertificationData, ProductionCertificationData } from '@/types/dpp';
import { CTAButton } from './CTAButton';
import { Tabs } from './Tabs';

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

  // Helper function to calculate production units from harvest data
  const calculateProductionUnits = (harvestWeight: number): number => {
    // Formula: 1 kg cocoa = 7 bars (100g each with 70% cocoa content)
    return Math.floor(harvestWeight * 7);
  };
  
  // Helper to extract UNTP data from credential
  const getUNTPData = (credential: DPPCredential) => {
    try {
      const parsed = typeof credential.jwt === 'string' ? JSON.parse(credential.jwt) : credential.jwt;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (parsed as any).untpCredential || null;
    } catch {
      return null;
    }
  };

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
      // Load credentials from localStorage
      loadCredentials();
      
      if (isBlockchainMode()) {
        // BLOCKCHAIN MODE: Verify each credential in the chain
        console.log('🔗 Blockchain Mode: Verifying credential chain...');
        
        const farmer = localStorage.getItem('farmer-credential');
        const factory = localStorage.getItem('factory-credential');
        
        const creds = [];
        if (farmer) creds.push(JSON.parse(farmer));
        if (factory) creds.push(JSON.parse(factory));
        
        // Verify each credential
        for (const cred of creds) {
          console.log(`Verifying ${cred.credentialType}...`);
          const result = await verifyCredential(cred.jwt);
          
          if (!result.isValid) {
            console.error(`❌ Verification failed for ${cred.credentialType}:`, result.error);
            alert(`Verification failed for ${cred.credentialType}: ${result.error}`);
            return;
          }
          
          console.log(`✅ ${cred.credentialType} verified`);
        }
        
        console.log('✅ All credentials in chain verified successfully!');
        setVerified(true);
      } else {
        // DEMO MODE: Simulate verification
        console.log('🎭 Demo Mode: Simulating QR scan and verification...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        setVerified(true);
      }
    } catch (err) {
      console.error('Verification failed:', err);
      alert('Verification failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="consumer-verification" className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h4 className="text-sm font-medium text-white">
          <Shield className="w-3.5 h-3.5 text-purple-500 inline mr-1 align-middle" />
          {' '}Consumer
        </h4>
        <h3 className="text-base font-medium text-white mt-1">Product Verification</h3>
      </div>

      {/* Consumer Info Card with Background */}
      <div className="border-2 border-purple-500/80 rounded-lg p-6 relative overflow-hidden ring-2 ring-purple-500/20">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ 
            backgroundImage: 'url(/cea77f55-cab8-48f0-82fa-aee8cfbbbeef.jpeg)',
            opacity: 0.3
          }}
        />
        <div className="absolute inset-0 bg-purple-900/40 z-[1]"></div>
        <div className="relative z-10">
          <div className="text-center mb-4">
            <p className="text-sm text-zinc-300">Scan QR code to verify complete supply chain</p>
          </div>
        </div>
      </div>

      {!verified && !loading && (
        <>
          {/* QR Code Scanner Simulation */}
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-7 space-y-6">
            <div className="text-center space-y-6">
              <div className="bg-white border-2 border-dashed border-[#3a3a3a] rounded-lg p-8 mx-auto max-w-sm flex flex-col items-center">
                <QRCodeSVG 
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify?batch=${product.batchNumber}&product=${encodeURIComponent(product.name)}`}
                  size={160}
                  level="H"
                  includeMargin={true}
                  className="mx-auto"
                />
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-900 font-medium">QR Code on {product.name}</p>
                  <p className="text-xs text-gray-600 mt-2">Batch: {product.batchNumber}</p>
                </div>
              </div>
              
              <div className="flex justify-center pt-2">
                <CTAButton
                  icon="📱"
                  label="Simulate QR Scan & Verify"
                  onClick={scanAndVerify}
                  loading={loading}
                  disabled={loading}
                  variant="primary"
                  size="lg"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-7">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
            </div>
            <p className="text-white font-medium">Verifying Supply Chain...</p>
            <div className="bg-[#1a1a1a] rounded-lg p-5 text-left max-w-md mx-auto">
              <p className="text-xs text-white mb-2">Checking:</p>
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
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
              <h3 className="text-xl font-semibold text-white">
                ✅ Full Supply Chain Verified!
              </h3>
            </div>
            <p className="text-sm text-zinc-300 mb-4">
              Complete traceability from farm harvest to production. Data verified using IOTA Identity with cryptographic signatures.
            </p>
          </div>

          {/* What happens here? Explanation */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-400 mb-2">💡 What happens here?</h4>
            <div className="space-y-2 text-xs text-zinc-300 leading-relaxed">
              <p>
                <strong className="text-white">Verification confirmed:</strong> All supply chain steps have been 
                cryptographically verified. Each certificate&apos;s signature proves authenticity.
              </p>
              <p>
                <strong className="text-white">Storage:</strong> The complete chain is permanently stored on the <a 
                  href="https://docs.iota.org/developer/iota-identity/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 underline"
                >IOTA network</a>. Anyone can verify this product&apos;s history anytime, anywhere.
              </p>
              <p>
                <strong className="text-white">Why it matters:</strong> You can trust this product. The blockchain 
                proof is immutable—no one can alter or fake the origin, production, or quality data.
              </p>
            </div>
          </div>

          {/* Tabs for organized content */}
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-6">
            <Tabs
              tabs={[
                {
                  id: 'journey',
                  label: 'Journey',
                  content: (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span>🗺️</span> Verified Supply Chain Journey
                      </h3>
                      {/* Visual Timeline */}
                      <div className="flex items-center justify-center gap-2 text-sm mb-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <Sprout className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 font-medium">Harvest</span>
                        </div>
                        <span className="text-zinc-500">→</span>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <Factory className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400 font-medium">Production</span>
                        </div>
                        <span className="text-zinc-500">→</span>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                          <CheckCircle2 className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-400 font-medium">Verified</span>
                        </div>
                      </div>
                      <div className="space-y-4">
              {journey.map((step, index) => (
                <div 
                  key={index}
                  className="bg-[#1a1a1a] border border-green-500/20 rounded-lg p-5 relative"
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
                            {step.credentialType === 'OrganicOriginCertification' && '🌱  Origin Certification'}
                            {step.credentialType === 'ProductionCertification' && '🏭  Production Certification'}
                          </h4>
                          <p className="text-xs text-white mt-0.5">{step.issuer}</p>
                        </div>
                        <span className="text-green-400 text-xs font-medium">✓ Verified</span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {/* Display UNTP fields if available */}
                        {step.credentialType === 'OrganicOriginCertification' && (() => {
                          const data = step.certificationData as unknown as OriginCertificationData;
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          const untpData = step as any;
                          void untpData;
                          return (
                            <>
                              {/* UNTP Fields */}
                              {getUNTPData(step) && (
                                <div className="border-t border-green-500/20 pt-2 mt-2 mb-2">
                                  <div className="flex items-center gap-1 mb-1.5">
                                    <Shield className="w-3 h-3 text-green-400" />
                                    <span className="text-[10px] text-green-400 font-medium">UNTP Compliant</span>
                                  </div>
                                  {getUNTPData(step)?.productName && (
                                    <div className="flex justify-between">
                                      <span className="text-zinc-500">Product:</span>
                                      <span className="text-zinc-300">{getUNTPData(step)?.productName}</span>
                                    </div>
                                  )}
                                  {getUNTPData(step)?.countryOfOrigin && (
                                    <div className="flex justify-between">
                                      <span className="text-zinc-500">Origin Country:</span>
                                      <span className="text-zinc-300">{getUNTPData(step)?.countryOfOrigin}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {data && 'origin' in data && (
                                <div className="flex justify-between">
                                  <span className="text-zinc-500">Origin:</span>
                                  <span className="text-zinc-300">{data.origin.country}</span>
                                </div>
                              )}
                              {data && 'batchWeight' in data && (
                                <div className="flex justify-between">
                                  <span className="text-zinc-500">Batch Weight:</span>
                                  <span className="text-zinc-300">{data.batchWeight?.toLocaleString()} kg</span>
                                </div>
                              )}
                              {data && 'cocoaVariety' in data && (
                                <div className="flex justify-between">
                                  <span className="text-zinc-500">Variety:</span>
                                  <span className="text-zinc-300">{data.cocoaVariety}</span>
                                </div>
                              )}
                              {data && 'harvestDate' in data && (
                                <div className="flex justify-between">
                                  <span className="text-zinc-500">Harvest Date:</span>
                                  <span className="text-zinc-300">{new Date(data.harvestDate).toLocaleDateString()}</span>
                                </div>
                              )}
                              {data && 'fermentationDays' in data && (
                                <div className="flex justify-between">
                                  <span className="text-zinc-500">Fermentation:</span>
                                  <span className="text-zinc-300">{data.fermentationDays} days</span>
                                </div>
                              )}
                              {data && 'dryingMethod' in data && (
                                <div className="flex justify-between">
                                  <span className="text-zinc-500">Drying:</span>
                                  <span className="text-zinc-300">{data.dryingMethod}</span>
                                </div>
                              )}
                            </>
                          );
                        })()}
                        {step.credentialType === 'ProductionCertification' && (() => {
                          const data = step.certificationData as unknown as ProductionCertificationData;
                          return (
                            <>
                              {/* UNTP Fields */}
                              {getUNTPData(step) && (
                                <div className="border-t border-blue-500/20 pt-2 mt-2 mb-2">
                                  <div className="flex items-center gap-1 mb-1.5">
                                    <Shield className="w-3 h-3 text-blue-400" />
                                    <span className="text-[10px] text-blue-400 font-medium">UNTP Compliant</span>
                                  </div>
                                  {getUNTPData(step)?.productName && (
                                    <div className="flex justify-between">
                                      <span className="text-zinc-500">Product:</span>
                                      <span className="text-zinc-300">{getUNTPData(step)?.productName}</span>
                                    </div>
                                  )}
                                  {getUNTPData(step)?.countryOfOrigin && (
                                    <div className="flex justify-between">
                                      <span className="text-zinc-500">Origin Country:</span>
                                      <span className="text-zinc-300">{getUNTPData(step)?.countryOfOrigin}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {data && 'unitsProduced' in data && (
                                <div className="flex justify-between">
                                  <span className="text-zinc-500">Units Produced:</span>
                                  <span className="text-zinc-300 font-semibold">{data.unitsProduced?.toLocaleString()} bars</span>
                                </div>
                              )}
                              {(() => {
                                // Find farmer credential from journey to get input data
                                const farmerCred = journey.find(c => c.credentialType === 'OrganicOriginCertification');
                                if (farmerCred && farmerCred.certificationData && 'batchWeight' in farmerCred.certificationData) {
                                  const farmerData = farmerCred.certificationData as unknown as OriginCertificationData;
                                  const inputKg = farmerData.batchWeight || 0;
                                  const outputUnits = calculateProductionUnits(inputKg);
                                  return (
                                    <div className="flex justify-between bg-blue-500/10 px-2 py-1 rounded mt-1">
                                      <span className="text-white text-xs">Input → Output:</span>
                                      <span className="text-blue-400 font-semibold text-xs">
                                        {inputKg.toLocaleString()} kg → {outputUnits.toLocaleString()} bars
                                      </span>
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                              {data && 'productionDate' in data && (
                                <div className="flex justify-between">
                                  <span className="text-zinc-500">Produced:</span>
                                  <span className="text-zinc-300">{new Date(data.productionDate).toLocaleDateString()}</span>
                                </div>
                              )}
                              {data && 'qualityChecks' in data && (
                                <div className="flex justify-between">
                                  <span className="text-zinc-500">Quality:</span>
                                  <span className="text-green-400">All checks passed ✓</span>
                                </div>
                              )}
                            </>
                          );
                        })()}
                        <div className="flex justify-between border-t border-[#27272a] pt-1.5 mt-1.5">
                          <span className="text-zinc-500">Issued:</span>
                          <span className="text-white">{new Date(step.issuedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                      ))}
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'summary',
                  label: 'Summary',
                  content: (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#2a2a2a] border border-green-500/20 rounded-lg p-6">
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

            <div className="bg-[#2a2a2a] border border-blue-500/20 rounded-lg p-6">
              <h4 className="text-sm font-medium text-blue-400 mb-3">🌍 Sustainability</h4>
              <ul className="space-y-1.5 text-xs">
                <li className="flex justify-between">
                  <span className="text-white">Carbon Footprint:</span>
                  <span className="text-zinc-200">850g CO₂</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white">Packaging:</span>
                  <span className="text-zinc-200">Compostable</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white">Fair Trade:</span>
                  <span className="text-green-400">Yes ✓</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white">Recyclable:</span>
                  <span className="text-green-400">100% ✓</span>
                </li>
                      </ul>
                    </div>
                    </div>
                  </div>
                  ),
                },
                {
                  id: 'proof',
                  label: 'Proof',
                  content: (
                    <div className="space-y-4">
                      <div className="bg-[#1a1a1a] border border-blue-500/20 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <ExternalLink className="w-5 h-5 text-blue-400" />
                          <h4 className="text-sm font-medium text-blue-400">🔒 External Proof</h4>
                        </div>
                        
                        <p className="text-xs text-white mb-4">
                          {journey.some(step => step.onChain)
                            ? 'All identities and credentials are verifiable on the IOTA Tangle. Click below to independently verify on the blockchain:'
                            : 'In production, these would link to verifiable blockchain proof. Click to learn about IOTA Identity:'
                          }
                        </p>
                        
                        <div className="space-y-2">
                          {journey.map((step, index) => {
                            // Use transaction block ID if available
                            const explorerUrl = step.transactionId 
                              ? getBlockExplorerURL(step.transactionId, 'testnet')
                              : null;
                            
                            return (
                              <div
                                key={index}
                                className="p-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg"
                              >
                                <div className="flex items-center justify-between">
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
                                      {step.transactionId && (
                                        <p className="text-xs text-green-400 mt-0.5">
                                          ✅ Published to blockchain
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  {explorerUrl ? (
                                    <a
                                      href={explorerUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                      <span>View</span>
                                    </a>
                                  ) : (
                                    <span className="text-xs text-zinc-600">No link</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-[#27272a]">
                          <p className="text-xs text-zinc-500">
                            {journey.some(step => step.onChain)
                              ? '💡 These identities exist on a public, immutable blockchain. Anyone, anywhere can verify them independently without trusting this website.'
                              : '💡 In blockchain mode, these identities would exist on the IOTA Tangle, allowing independent verification by anyone.'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'info',
                  label: 'How It Works',
                  content: (
                    <div className="space-y-4">
                      <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-5">
                        <h4 className="text-sm font-medium text-white mb-2">🔐 How Verification Works</h4>
                        <p className="text-xs text-white leading-relaxed mb-3">
                          Each step in the supply chain is cryptographically signed and stored on the{' '}
                          <a 
                            href="https://docs.iota.org/developer/iota-identity/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            IOTA network
                          </a>
                          . The factory&apos;s certificate <strong>references</strong> the farmer&apos;s certificate, 
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

                      <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4">
                        <h3 className="text-base font-semibold text-white mb-3 text-center">
                          Traditional vs Blockchain Identity
                        </h3>
                        
                        <div className="overflow-x-auto">
                          <div className="min-w-[400px]">
                            {/* Header Row */}
                            <div className="grid grid-cols-3 gap-px bg-[#3a3a3a] rounded-t-lg overflow-hidden">
                              <div className="bg-[#1a1a1a] px-2 py-1.5"></div>
                              <div className="bg-[#1a1a1a] px-2 py-1.5">
                                <p className="text-[10px] font-medium text-white text-center">Traditional</p>
                              </div>
                              <div className="bg-blue-500/10 px-2 py-1.5">
                                <p className="text-[10px] font-semibold text-blue-400 text-center">With DIDs</p>
                              </div>
                            </div>
                            
                            {/* Data Rows */}
                            <div className="grid grid-cols-3 gap-px bg-[#3a3a3a]">
                              <div className="bg-[#1a1a1a] px-2 py-1.5">
                                <p className="text-[10px] font-medium text-zinc-300">Speed</p>
                              </div>
                              <div className="bg-[#1a1a1a] px-2 py-1.5">
                                <p className="text-[10px] text-white">3-5 days</p>
                              </div>
                              <div className="bg-green-500/5 px-2 py-1.5">
                                <p className="text-[10px] font-medium text-green-400">2 seconds ⚡</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-px bg-[#3a3a3a]">
                              <div className="bg-[#1a1a1a] px-2 py-1.5">
                                <p className="text-[10px] font-medium text-zinc-300">Cost</p>
                              </div>
                              <div className="bg-[#1a1a1a] px-2 py-1.5">
                                <p className="text-[10px] text-white">Phone, emails</p>
                              </div>
                              <div className="bg-green-500/5 px-2 py-1.5">
                                <p className="text-[10px] font-medium text-green-400">$0.001 per verification</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-px bg-[#3a3a3a]">
                              <div className="bg-[#1a1a1a] px-2 py-1.5">
                                <p className="text-[10px] font-medium text-zinc-300">Trust Model</p>
                              </div>
                              <div className="bg-[#1a1a1a] px-2 py-1.5">
                                <p className="text-[10px] text-white">Reputation & processes</p>
                              </div>
                              <div className="bg-green-500/5 px-2 py-1.5">
                                <p className="text-[10px] font-medium text-green-400">Cryptographic verifiable ✅</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-px bg-[#3a3a3a]">
                              <div className="bg-[#1a1a1a] px-2 py-1.5">
                                <p className="text-[10px] font-medium text-zinc-300">Forgery Risk</p>
                              </div>
                              <div className="bg-[#1a1a1a] px-2 py-1.5">
                                <p className="text-[10px] text-white">Paper certificates can be faked</p>
                              </div>
                              <div className="bg-green-500/5 px-2 py-1.5">
                                <p className="text-[10px] font-medium text-green-400">Mathematically impossible ✅</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-px bg-[#3a3a3a] rounded-b-lg overflow-hidden">
                              <div className="bg-[#1a1a1a] px-2 py-1.5">
                                <p className="text-[10px] font-medium text-zinc-300">Availability</p>
                              </div>
                              <div className="bg-[#1a1a1a] px-2 py-1.5">
                                <p className="text-[10px] text-white">9-5 hours</p>
                              </div>
                              <div className="bg-green-500/5 px-2 py-1.5">
                                <p className="text-[10px] font-medium text-green-400">24/7 global ✅</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-3 text-center">
                          💡 For Digital Product Passports
                        </h3>
                        <p className="text-sm text-zinc-300 mb-4 text-center">
                          This demo shows the core technology behind EU Digital Product Passports. 
                          Every product will have a verifiable identity and supply chain history.
                        </p>
                        
                        <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-5">
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
                    </div>
                  ),
                },
              ]}
              variant="content"
              defaultTab="journey"
            />
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
            <p className="text-xs text-white">
              Please complete Steps 1 and 2 first to create the supply chain credentials.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

