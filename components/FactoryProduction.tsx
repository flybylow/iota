'use client';

import React, { useState, useEffect } from 'react';
import { industryData, type IndustryId } from '@/data/industry-data';
import { Loader2, CheckCircle2, XCircle, AlertCircle, Factory, ExternalLink, ChevronDown, ChevronUp, Bell } from 'lucide-react';
import { UNTPSection } from './UNTPSection';
import { Tooltip } from './Tooltip';
import { CTAButton } from './CTAButton';
import { Fold } from './Fold';
import { isBlockchainMode, isDemoMode } from '@/lib/dppMode';
import { createDID, issueCredential, verifyCredential } from '@/lib/iotaIdentityReal';
import { buildUNTPDPPCredential } from '@/lib/schemas/untp/dpp-builder';
import { getBlockExplorerURL, getDIDExplorerURL, getDIDViewerURL } from '@/lib/iotaExplorer';
import { useWalletStatus } from '@/lib/hooks/useWalletStatus';
import { useSignAndExecuteTransaction } from '@iota/dapp-kit';
// Note: No longer using Transaction from @iota/iota-sdk
// Using object-based Identity model instead (no Alias Outputs)
import type { DPPCredential, ProductionCertificationData } from '@/types/dpp';
import { initWasm } from '@/lib/iotaIdentityReal';

/**
 * Production Component
 * Step 2 in the supply chain - dynamic for all industries
 * Verifies origin certificate before producing
 */

interface FactoryProductionProps {
  industry: string | null;
  onNextStep?: () => void;
}

export function FactoryProduction({ industry, onNextStep }: FactoryProductionProps) {
  // Get industry-specific data with safety check
  const industryKey = (industry && industry in industryData) 
    ? industry as IndustryId 
    : 'food-beverage';
  const data = industryData[industryKey];
  
  const productionStakeholder = ('factory' in data.stakeholders) 
    ? data.stakeholders.factory 
    : data.stakeholders.manufacturer;
  const originStakeholder = ('farmer' in data.stakeholders) 
    ? data.stakeholders.farmer 
    : ('miner' in data.stakeholders) 
      ? data.stakeholders.miner 
      : data.stakeholders.supplier;
  const product = data.product;
  const labels = data.labels;
  const [farmerCredential, setFarmerCredential] = useState<DPPCredential | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  const [loading, setLoading] = useState(false);
  const [productionCredential, setProductionCredential] = useState<DPPCredential | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showVerificationDetails, setShowVerificationDetails] = useState(false);
  
  // Wallet status for blockchain publishing
  const { isConnected, address } = useWalletStatus();
  
  // dApp Kit transaction signing hook
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  // Calculate production units from harvest data
  const calculateProductionUnits = () => {
    if (farmerCredential?.certificationData && 'batchWeight' in farmerCredential.certificationData) {
      const cocoaKg = farmerCredential.certificationData.batchWeight as number;
      // Formula: 1 kg cocoa produces approximately 7 bars (100g each with 70% cocoa content)
      // Calculation: 1000g ÷ 100g per bar = 10 bars, but 70% cocoa content means 10 * 0.7 = 7 bars per kg
      const estimatedBars = Math.floor(cocoaKg * 7);
      return estimatedBars;
    }
    return 17500; // Default fallback (2500 kg * 7)
  };

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
      if (isBlockchainMode()) {
        // BLOCKCHAIN MODE: Use real verification
        console.log('🔗 Blockchain Mode: Verifying credential on-chain...');
        
        const verificationResult = await verifyCredential(farmerCredential.jwt);
        
        if (verificationResult.isValid) {
          console.log('✅ Credential verified successfully');
          setVerificationStatus('verified');
        } else {
          console.error('❌ Credential verification failed:', verificationResult.error);
          setVerificationStatus('failed');
          alert('Credential verification failed: ' + (verificationResult.error || 'Unknown error'));
        }
      } else {
        // DEMO MODE: Basic structure check
        console.log('🎭 Demo Mode: Simulating verification...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (farmerCredential.credentialType === labels.originCredential) {
          setVerificationStatus('verified');
        } else {
          setVerificationStatus('failed');
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('failed');
      alert('Verification error: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
      const certificationData: ProductionCertificationData = {
        manufacturer: productionStakeholder.name,
        productionDate: "2025-10-15",
        batchNumber: product.batchNumber,
        recipe: {
          cocoaMass: 70,
          sugar: 25,
          cocoaButter: 5
        },
        qualityChecks: [
          { test: "Quality control", result: "Pass - All standards met" },
          { test: "Material verification", result: "Pass - Origin verified" },
          { test: "Safety check", result: "Pass - Compliant" }
        ],
        packaging: "Sustainable packaging",
        unitsProduced: 50000
      };

      let dppCredential: DPPCredential;

      if (isBlockchainMode()) {
        // BLOCKCHAIN MODE: Use real IOTA Identity SDK
        console.log('🔗 Blockchain Mode: Issuing production credential...');
        
        try {
          // Use existing DIDs from stakeholder data
          const manufacturerDID = productionStakeholder.did;
          let productDID = product.did;
          
          console.log('📋 Using manufacturer DID:', manufacturerDID);
          console.log('📋 Using product DID:', productDID);
          
          // Use product DID from previous farmer credential if available
          if (farmerCredential && farmerCredential.subject) {
            productDID = farmerCredential.subject;
            console.log('✅ Using product DID from farmer credential:', productDID);
          }
          
          // Note: These DIDs are from the stakeholder data
          // They are valid IOTA DID format and maintain consistency across certificates
          
          // Build UNTP-compliant credential
          console.log('🌍 Building UNTP-compliant production credential...');
          const untpCredential = buildUNTPDPPCredential(
            manufacturerDID,
            productDID,
            {
              name: product.name,
              description: ('description' in product ? product.description : product.name) as string,
              countryOfOrigin: productionStakeholder.country,
              manufacturer: {
                name: productionStakeholder.name,
                did: manufacturerDID,
              },
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            certificationData as any // Type conversion for UNTP
          );
          
          console.log('✅ UNTP credential structure created');
          
          // Issue production credential with credential chaining
          console.log('Issuing production credential...');
          const credentialJWT = await issueCredential(
            manufacturerDID,
            productDID,
            {
              type: labels.productionCredential,
              certificationData: certificationData,
              untpCredential: untpCredential, // Include UNTP structure
              previousCredentials: [farmerCredential?.jwt] // Credential chaining!
            }
          );
          
          console.log('✅ Production credential issued successfully');
          
          // Store block ID from blockchain submission
          let blockchainBlockId: string | null = null;
          
          // Note: Certificate creation doesn't require blockchain publishing
          // DIDs and credentials are created locally and stored
          // Publishing DIDs to blockchain is optional and requires wallet signing
          // Credentials work locally without blockchain publishing
          console.log('✅ Certificate created successfully (local)');
          console.log('💡 Credential is ready to use - no blockchain publishing needed');
          console.log('📋 DID publishing to blockchain is optional and requires wallet signing');
          
          dppCredential = {
            jwt: credentialJWT,
            issuer: productionStakeholder.name,
            issuerDID: manufacturerDID,
            subject: productDID,
            credentialType: labels.productionCredential,
            issuedAt: new Date().toISOString(),
            certificationData,
            previousCredentials: [farmerCredential?.jwt || ''],
            onChain: blockchainBlockId !== null, // Only true if successfully published
            untpCredential: untpCredential, // Include UNTP structure
            transactionId: blockchainBlockId || undefined, // Include transaction ID if published
          };
        } catch (error) {
          console.error('❌ Blockchain mode failed:', error);
          alert('Blockchain mode failed. Error: ' + (error instanceof Error ? error.message : 'Unknown'));
          throw error;
        }
      } else {
        // DEMO MODE: Use mock data
        console.log('🎭 Demo Mode: Creating mock production credential...');
        await new Promise(resolve => setTimeout(resolve, 1800));
        
        dppCredential = {
          jwt: btoa(JSON.stringify({
            issuer: productionStakeholder.did,
            subject: product.did,
            type: labels.productionCredential,
            data: certificationData,
            issuedAt: new Date().toISOString(),
            previousCredentials: [farmerCredential?.jwt] // Credential chaining!
          })),
          issuer: productionStakeholder.name,
          issuerDID: productionStakeholder.did,
          subject: product.did,
          credentialType: labels.productionCredential,
          issuedAt: new Date().toISOString(),
          certificationData,
          previousCredentials: [farmerCredential?.jwt || ''],
          onChain: false,
        };
      }

      localStorage.setItem('factory-credential', JSON.stringify(dppCredential));
      setProductionCredential(dppCredential);
    } catch (err) {
      console.error('Failed to issue production credential:', err);
      alert('Failed to issue credential: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="factory-production" className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h4 className="text-sm font-medium text-white">
          {labels.productionIcon} {' '} Factory
        </h4>
        <h3 className="text-base font-medium text-white mt-1">{productionStakeholder.name}</h3>
      </div>

      {/* Production Stakeholder Info Card */}
      <div className="border border-[#3a3a3a] rounded-lg p-6 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ 
            backgroundImage: 'url(/fact.jpeg)',
            opacity: 0.4
          }}
        />
        <div className="absolute inset-0 bg-blue-900/50 z-[1]"></div>
        <div className="relative z-10">
        {/* Header with Name */}
        <div className="mb-4">
          
          {/* Layout: Left div (Country/Since) and Right div (Certifications) */}
          <div className="flex items-start justify-between">
            {/* Left div: Country and Since */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-base">
                  {productionStakeholder.country === 'Belgium' ? '🇧🇪' 
                   : productionStakeholder.country === 'Taiwan' ? '🇹🇼' 
                   : productionStakeholder.country === 'China' ? '🇨🇳' 
                   : productionStakeholder.country === 'Germany' ? '🇩🇪'
                   : '🏭'}
                </span>
                <span className="text-xs text-zinc-400">{productionStakeholder.country}</span>
              </div>
              
              {'established' in productionStakeholder && productionStakeholder.established && (
                <div>
                  <span className="text-xs text-zinc-400">Since {productionStakeholder.established}</span>
                </div>
              )}
            </div>

            {/* Right div: Certifications */}
            <div className="flex flex-col items-end gap-1">
              {productionStakeholder.certifications && productionStakeholder.certifications.map((cert: string, index: number) => (
                <Tooltip key={index} content={cert} side="bottom">
                  <div className="flex items-center px-2 py-1 bg-blue-500/10 rounded-lg cursor-help">
                    <span className="text-xs text-blue-400 font-medium">{cert}</span>
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>

        {/* Location with Mini Map */}
        {'coordinates' in productionStakeholder && productionStakeholder.coordinates && typeof productionStakeholder.coordinates === 'object' && 'lat' in productionStakeholder.coordinates && 'lng' in productionStakeholder.coordinates ? (
          <div className="mb-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg overflow-hidden">
            <div className="h-32 bg-zinc-800 relative">
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${(productionStakeholder.coordinates as { lat: number; lng: number }).lng - 0.05},${(productionStakeholder.coordinates as { lat: number; lng: number }).lat - 0.05},${(productionStakeholder.coordinates as { lat: number; lng: number }).lng + 0.05},${(productionStakeholder.coordinates as { lat: number; lng: number }).lat + 0.05}&layer=mapnik&marker=${(productionStakeholder.coordinates as { lat: number; lng: number }).lat},${(productionStakeholder.coordinates as { lat: number; lng: number }).lng}`}
                width="100%"
                height="128"
                frameBorder="0"
                style={{ border: 0, filter: 'grayscale(100%) invert(100%) contrast(0.9) brightness(1.3) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                title="Location Map"
                className="grayscale"
              />
              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                📍 {productionStakeholder.location}
              </div>
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                Lat: {(productionStakeholder.coordinates as { lat: number; lng: number }).lat.toFixed(2)}° | Lng: {(productionStakeholder.coordinates as { lat: number; lng: number }).lng.toFixed(2)}°
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-3 p-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span>📍</span>
              <span>{productionStakeholder.location}</span>
            </div>
          </div>
        )}

        {/* About Section */}
        {('description' in productionStakeholder && productionStakeholder.description) || 
         ('capacity' in productionStakeholder && productionStakeholder.capacity) ? (
          <div className="mb-3 p-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg">
            <button
              onClick={() => setShowAbout(!showAbout)}
              className="w-full flex items-center justify-between mb-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-xs text-zinc-500">More</span>
              <div className="flex items-center gap-2">
                <span className="text-lg">📖</span>
                {showAbout ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </div>
            </button>
            {showAbout && (
              <div className="space-y-2">
                {'capacity' in productionStakeholder && productionStakeholder.capacity && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-white">⚡ Capacity:</span>
                    <span className="text-zinc-200">{productionStakeholder.capacity}</span>
                  </div>
                )}
                {'description' in productionStakeholder && productionStakeholder.description && (
                  <p className="text-xs text-white leading-relaxed">{productionStakeholder.description}</p>
                )}
              </div>
            )}
          </div>
        ) : null}
        </div>
      </div>

      {!productionCredential && (
        <>
          {/* Verification Step - Foldable Section */}
          {farmerCredential ? (
            <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-6">
              <button
                onClick={() => setShowVerificationDetails(!showVerificationDetails)}
                className="w-full flex items-center justify-between text-left mb-4"
              >
                <h4 className="text-base font-medium text-blue-400 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-400" />
                  Verify Incoming Materials
                </h4>
                {showVerificationDetails ? (
                  <ChevronUp className="w-5 h-5 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-zinc-400" />
                )}
              </button>

              {showVerificationDetails && (
                <div className="space-y-4">
                  <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-5">
                    <p className="typ-label text-white mb-3">Origin Certificate Detected:</p>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between">
                        <span className="typ-label text-zinc-500">From:</span>
                        <span className="text-zinc-200">{farmerCredential.issuer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="typ-label text-zinc-500">Product:</span>
                        <span className="text-zinc-200">{product.name}</span>
                      </div>
                      {farmerCredential.certificationData && 'batchWeight' in farmerCredential.certificationData && (
                        <div className="flex justify-between">
                          <span className="typ-label text-zinc-500">Weight:</span>
                          <span className="text-zinc-200">
                            {(farmerCredential.certificationData.batchWeight as number).toLocaleString()} kg
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="typ-label text-zinc-500">Type:</span>
                        <span className="text-zinc-200">{farmerCredential.credentialType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="typ-label text-zinc-500">Issued:</span>
                        <span className="text-zinc-200">
                          {new Date(farmerCredential.issuedAt).toLocaleDateString('en-GB', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {verificationStatus === 'pending' && (
                    <div className="flex justify-center">
                      <CTAButton
                        icon="✓"
                        label="Verify Certificate"
                        onClick={verifyFarmerCertificate}
                        loading={loading}
                        disabled={loading}
                        variant="primary"
                        size="lg"
                      />
                    </div>
                  )}

                  {verificationStatus === 'verified' && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-start gap-2 text-green-400">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium mb-2">✅ Origin Verified!</p>
                          <ul className="space-y-1 text-xs text-green-300">
                            <li>• From: {originStakeholder.name}, {originStakeholder.country}</li>
                            <li>• Certification: {originStakeholder.certifications[0]}</li>
                            {farmerCredential.certificationData && 'batchWeight' in farmerCredential.certificationData && (
                              <>
                                <li>• Batch Weight: {(farmerCredential.certificationData.batchWeight as number).toLocaleString()} kg</li>
                                <li>• Variety: {farmerCredential.certificationData.cocoaVariety as string}</li>
                                <li>• Harvest Date: {new Date(farmerCredential.certificationData.harvestDate as string).toLocaleDateString()}</li>
                                <li>• Fermentation: {farmerCredential.certificationData.fermentationDays as number} days</li>
                                <li>• Drying: {farmerCredential.certificationData.dryingMethod as string}</li>
                              </>
                            )}
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
              )}
            </div>
          ) : (
            <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-6">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <p className="text-sm text-yellow-400">
                    No origin certificate found. Complete Step 1 first.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Production Step */}
          {verificationStatus === 'verified' && (
            <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-6 space-y-4">
              <h4 className="text-base font-medium text-white">2. Record Production</h4>

              <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-5">
                <p className="typ-subtitle mb-3">
                  {industryKey === 'food-beverage' ? 'Recipe:' : 
                   industryKey === 'electronics' ? 'Components:' : 
                   'Materials:'}
                </p>
                <ul className="space-y-1.5 typ-small text-zinc-300">
                  {/* Food & Beverage - ingredients */}
                  {'ingredients' in product && (product.ingredients as Array<{percentage: number, name: string, origin: string}>).map((ingredient, idx: number) => (
                    <li key={idx}>
                      • {ingredient.percentage}% {ingredient.name} 
                      {idx === 0 ? ` (verified from ${originStakeholder.name} ✓)` : ` (${ingredient.origin})`}
                    </li>
                  ))}
                  
                  {/* Battery & Fashion - materials */}
                  {'materials' in product && (product.materials as Array<{percentage: number, name: string, origin: string}>).map((material, idx: number) => (
                    <li key={idx}>
                      • {material.percentage}% {material.name} 
                      {idx === 0 ? ` (verified from ${originStakeholder.name} ✓)` : ` (${material.origin})`}
                    </li>
                  ))}
                  
                  {/* Electronics - components */}
                  {'components' in product && (product.components as Array<{name: string, origin: string}>).map((component, idx: number) => (
                    <li key={idx}>
                      • {component.name} ({component.origin})
                      {idx === 0 ? ' ✓' : ''}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="typ-label text-white mb-1">Batch Number:</p>
                  <p className="text-white font-mono text-xs">{product.batchNumber}</p>
                </div>
                <div>
                  <p className="typ-label text-white mb-1">Production Date:</p>
                  <p className="text-white font-mono text-xs">{product.productionDate}</p>
                </div>
                <div className="col-span-2">
                  <p className="typ-label text-white mb-1">Input → Output:</p>
                  <p className="text-white font-mono text-xs">
                    {industryKey === 'food-beverage' ? (
                      <>
                        {farmerCredential?.certificationData && 'batchWeight' in farmerCredential.certificationData 
                          ? `${(farmerCredential.certificationData.batchWeight as number).toLocaleString()} kg cocoa` 
                          : '2,500 kg cocoa'
                        } → {calculateProductionUnits().toLocaleString()} bars (100g each)
                      </>
                    ) :
                     industryKey === 'battery' ? '5,000 kg materials → 500 units' :
                     industryKey === 'fashion' ? '3,000 kg cotton → 10,000 pieces' :
                     '2,000 kg materials → 5,000 units'}
                  </p>
                  <p className="text-zinc-500 text-xs mt-1">
                    {industryKey === 'food-beverage' && '(70% cocoa content = ~7 bars per kg)'}
                  </p>
                </div>
                <div>
                  <p className="text-white text-xs mb-1">
                    {industryKey === 'battery' ? 'Certification:' : 'Packaging:'}
                  </p>
                  <p className="text-white font-mono text-xs">
                    {industryKey === 'food-beverage' ? 'Compostable PLA' :
                     industryKey === 'battery' ? 'EU Battery Passport' :
                     industryKey === 'fashion' ? 'Recycled cardboard' :
                     'Minimal eco-packaging'}
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <CTAButton
                  icon="🏭"
                  label="Issue Production Certificate"
                  onClick={issueProductionCertificate}
                  loading={loading}
                  disabled={loading}
                  variant="primary"
                  size="lg"
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Success State */}
      {productionCredential && (
        <div className="bg-[#2a2a2a] border border-blue-500/20 rounded-lg p-7 space-y-4">
          <div className="flex items-center gap-3 text-blue-400">
            <CheckCircle2 className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Production Certificate Issued!</h3>
          </div>

          {/* Mode Indicator */}
          <div className={`border rounded-lg p-3 mb-4 ${isBlockchainMode() ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
            <div className="flex items-center gap-2 mb-2">
              {isBlockchainMode() ? (
                <>
                  <span className="text-base">🔗</span>
                  <span className="text-sm font-semibold text-green-400">Blockchain Mode</span>
                </>
              ) : (
                <>
                  <span className="text-base">🎭</span>
                  <span className="text-sm font-semibold text-yellow-400">Demo Mode</span>
                </>
              )}
            </div>
            <div className="text-xs text-zinc-300 space-y-1">
              {isBlockchainMode() ? (
                <>
                  <p>✅ <strong>Real cryptographic signatures</strong> using IOTA Identity SDK</p>
                  <p>✅ <strong>Credential chaining</strong> with cryptographic links</p>
                  <p>✅ <strong>Cryptographically verifiable</strong> - tamper-proof JWT</p>
                  <p>ℹ️ DIDs created locally (blockchain publishing requires wallet approval)</p>
                </>
              ) : (
                <>
                  <p>🎭 <strong>Mock credentials</strong> for demonstration</p>
                  <p>🎭 <strong>Simulated credential chaining</strong> (not cryptographically linked)</p>
                  <p>🎭 <strong>No real crypto verification</strong> - just simulation</p>
                  <p>💡 Switch to Blockchain Mode to see real cryptographic signatures</p>
                </>
              )}
            </div>
          </div>

          {/* What happens here? Explanation - Foldable */}
          <Fold 
            title={<span className="text-blue-400">💡 What happens here?</span>} 
            defaultOpen={false}
            className="mb-4"
          >
            <div className="space-y-2 text-xs text-zinc-300 leading-relaxed">
              <p>
                <strong className="text-white">Transaction confirmed:</strong> {isBlockchainMode()
                  ? 'Your production certificate is cryptographically linked to the origin certificate, creating an immutable chain.'
                  : 'Your production certificate is linked to the origin certificate (simulated, not cryptographically signed).'}
              </p>
              <p>
                <strong className="text-white">Storage:</strong> {isBlockchainMode()
                  ? <>Both certificates are stored locally with cryptographic signatures. Can be published to the <a 
                      href="https://docs.iota.org/developer/iota-identity/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >IOTA network</a>, creating a permanent record of the complete supply chain.</>
                  : 'Both certificates are stored locally for demonstration (not published to blockchain).'}
              </p>
              <p>
                <strong className="text-white">Why it matters:</strong> {isBlockchainMode()
                  ? 'Consumers can now verify the entire journey from farm to factory instantly. No one can fake or alter this proof.'
                  : 'Demonstrates how consumers can verify the supply chain. Switch to Blockchain Mode for real cryptographic verification.'}
              </p>
            </div>
          </Fold>

          <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4">
            <p className="text-sm text-white font-medium mb-3">Production Summary:</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-white">Batch:</span>
                <span className="text-zinc-200">{product.batchNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Product:</span>
                <span className="text-zinc-200">{product.name}</span>
              </div>
              {farmerCredential?.certificationData && 'batchWeight' in farmerCredential.certificationData && (
                <div className="flex justify-between">
                  <span className="text-white">Input Cocoa:</span>
                  <span className="text-zinc-200">{(farmerCredential.certificationData.batchWeight as number).toLocaleString()} kg</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-white">Units Produced:</span>
                <span className="text-zinc-200">
                  {industryKey === 'food-beverage' ? `${calculateProductionUnits().toLocaleString()} bars` :
                   industryKey === 'battery' ? '500 units' :
                   industryKey === 'fashion' ? '10,000 pieces' :
                   '5,000 units'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Quality Checks:</span>
                <span className="text-green-400">All Passed ✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Traceability:</span>
                <span className="text-green-400">Complete ✓</span>
              </div>
            </div>
          </div>

          {/* UNTP Digital Product Passport Section */}
          {productionCredential.untpCredential && (
            <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4">
              <UNTPSection untpCredential={productionCredential.untpCredential} showTitle={true} />
            </div>
          )}

          {/* Publish DID to Blockchain Button */}
          {/* Hide blockchain publishing for hackathon demo to avoid wallet rejection errors */}
          {false && productionCredential.issuerDID && isConnected && address && (
            <div className="mb-4">
              <button
                onClick={async () => {
                  if (!productionCredential || !productionCredential.certificationData) {
                    alert('Production credential data missing. Issue the credential again before publishing.');
                    return;
                  }

                  try {
                    setLoading(true);
                    console.log('📡 Starting client-side factory DID publishing with wallet signing...');

                    if (!address) {
                      throw new Error('Wallet not connected. Please connect your IOTA Wallet.');
                    }

                    // Create a wrapper function for the dApp Kit mutation
                    const signAndExecute = async (transaction: any) => {
                      console.log('🔏 Signing transaction with wallet...');
                      console.log('📋 Transaction type:', typeof transaction);
                      console.log('📋 Transaction length:', typeof transaction === 'string' ? transaction.length : 'N/A');
                      
                      try {
                        const result = await signAndExecuteTransaction({
                          transaction,
                          waitForTransaction: true, // Wait for confirmation
                        });
                        return result;
                      } catch (error) {
                        console.error('❌ Wallet transaction error:', error);
                        // Re-throw with better context
                        if (error instanceof Error && error.message.includes('Rejected')) {
                          throw new Error(
                            'Transaction was rejected by your wallet. ' +
                            'Make sure:\n' +
                            '• You\'re on IOTA testnet\n' +
                            '• You have sufficient balance\n' +
                            '• The transaction is approved in the wallet popup\n\n' +
                            'Note: Local DIDs work perfectly for credentials without blockchain publishing.'
                          );
                        }
                        throw error;
                      }
                    };

                    const { publishIdentityToChain } = await import('@/lib/publishIdentityToChain');
                    const result = await publishIdentityToChain(null, address, signAndExecute);

                    if (!result.success || !result.did) {
                      const message = result.error || 'Unknown error while publishing DID.';
                      throw new Error(message);
                    }

                    const did = result.did;
                    const digest = result.blockId;

                    console.log('✅ Factory DID published on-chain:', did);

                    const certificationData = productionCredential.certificationData as ProductionCertificationData;

                    const untpCredential = buildUNTPDPPCredential(
                      did,
                      productionCredential.subject || product.did,
                      {
                        name: product.name,
                        description: ('description' in product ? product.description : product.name) as string,
                        countryOfOrigin: productionStakeholder.country,
                        manufacturer: {
                          name: productionStakeholder.name,
                          did,
                        },
                      },
                      certificationData as any
                    );

                    const credentialJWT = await issueCredential(
                      did,
                      productionCredential.subject || product.did,
                      {
                        type: labels.productionCredential,
                        certificationData,
                        untpCredential,
                        previousCredentials: [farmerCredential?.jwt].filter(Boolean),
                      }
                    );

                    const updatedCredential: DPPCredential = {
                      ...productionCredential,
                      jwt: credentialJWT,
                      issuerDID: did,
                      onChain: true,
                      transactionId: digest,
                      untpCredential,
                    };

                    localStorage.setItem('factory-credential', JSON.stringify(updatedCredential));
                    setProductionCredential(updatedCredential);

                    const explorerHint = result.explorerUrl ? `\nExplorer: ${result.explorerUrl}` : '';
                    alert(`Factory DID published successfully!${digest ? `\nTransaction ID: ${digest}` : ''}${explorerHint}`);
                  } catch (error) {
                    console.error('❌ Failed to publish factory DID on-chain:', error);
                    const message = error instanceof Error ? error.message : 'Unknown error';
                    
                    // Show user-friendly error message
                    if (message.includes('rejected') || message.includes('Rejected')) {
                      alert(
                        'Transaction Rejected\n\n' +
                        message + '\n\n' +
                        '💡 Tip: The demo works perfectly with local DIDs. ' +
                        'Credentials can be issued and verified locally without blockchain publishing.'
                      );
                    } else if (message.includes('DID publishing via microservice is not supported') || 
                               message.includes('wallet private key')) {
                      alert(
                        'DID Publishing Not Available\n\n' +
                        'On-chain DID publishing requires wallet signing, which must happen client-side.\n\n' +
                        'For now, DIDs are created locally and work perfectly for credential issuance.\n\n' +
                        'Note: Local DIDs are fully functional for demo purposes.'
                      );
                    } else {
                      alert(`Publishing failed: ${message}\n\nTip: The demo works perfectly with local DIDs.`);
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="block w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-lg transition-all duration-200 text-center mb-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 inline-block mr-2 mb-0.5 animate-spin" />
                    Publishing DID...
                  </>
                ) : (
                  <>
                    📡 Publish DID to Blockchain
                  </>
                )}
              </button>
            </div>
          )}

          {/* DID and Transaction Links - Hidden in demo mode */}
          {productionCredential.issuerDID && !isDemoMode() && (
            <div className="bg-[#1a1a1a] border-2 border-white rounded-lg p-5 space-y-3">
              {/* DID Link */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Factory className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-xs font-medium text-white">Your Factory DID</p>
                    <p className="text-xs text-zinc-500 font-mono break-all">
                      {productionCredential.issuerDID.substring(0, 30)}...
                    </p>
                  </div>
                </div>
                <a
                  href={getDIDViewerURL(productionCredential.issuerDID, 'testnet')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>View DID</span>
                </a>
              </div>
              
              {/* Transaction Link (if available) */}
              {productionCredential.transactionId && (
                <div className="flex items-center justify-between pt-3 border-t border-[#3a3a3a]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Transaction:</span>
                    <span className="text-xs text-zinc-500 font-mono">
                      {productionCredential.transactionId.substring(0, 20)}...
                    </span>
                  </div>
                  <a
                    href={getBlockExplorerURL(productionCredential.transactionId, 'testnet')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View Transaction</span>
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-sm text-green-400 font-medium">✅ Ready for Step 3: Consumer Verification</p>
          </div>

          <div className="flex justify-center mt-4">
            <CTAButton
              icon="→"
              label="Go to Consumer Verification"
              onClick={() => {
                if (onNextStep) {
                  onNextStep();
                } else {
                  // Fallback: scroll to consumer section if callback not provided
                  const consumerSection = document.getElementById('consumer-verification');
                  if (consumerSection) {
                    consumerSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    consumerSection.classList.add('highlight-pulse');
                    setTimeout(() => {
                      requestAnimationFrame(() => {
                        consumerSection.classList.remove('highlight-pulse');
                      });
                    }, 2000);
                  }
                }
              }}
              variant="primary"
              size="lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

