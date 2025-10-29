'use client';

import React, { useState, useEffect } from 'react';
import { industryData, type IndustryId } from '@/data/industry-data';
import { Loader2, CheckCircle2, XCircle, AlertCircle, Factory, ExternalLink, ChevronDown, ChevronUp, Bell } from 'lucide-react';
import { UNTPSection } from './UNTPSection';
import { Tooltip } from './Tooltip';
import { CTAButton } from './CTAButton';
import { isBlockchainMode } from '@/lib/dppMode';
import { createDID, issueCredential, verifyCredential } from '@/lib/iotaIdentityReal';
import { buildUNTPDPPCredential } from '@/lib/schemas/untp/dpp-builder';
import { getBlockExplorerURL } from '@/lib/iotaExplorer';
import { useWalletStatus } from '@/lib/hooks/useWalletStatus';
import { useSignAndExecuteTransaction } from '@iota/dapp-kit';
import { Transaction } from '@iota/iota-sdk/transactions';
import type { DPPCredential, ProductionCertificationData } from '@/types/dpp';

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
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

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
          let manufacturerDID = productionStakeholder.did;
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
          
          // Publish to blockchain if wallet is connected
          if (isConnected && address && signAndExecute) {
            try {
              console.log('📤 Publishing factory credential to blockchain...');
              console.log('✅ Wallet connected:', address);
              console.log('✅ Sign and execute available');
              
              // Create DID for manufacturer
              const { did: factoryDID, secretManager } = await createDID();
              console.log('📝 Factory DID:', factoryDID);
              
              // Create a proper Transaction object
              const tx = new Transaction();
              
              // Add the UNTP credential data to the transaction
              console.log('💡 Adding UNTP credential data to transaction...');
              const credentialData = JSON.stringify(untpCredential);
              const credentialBytes = Array.from(new TextEncoder().encode(credentialData));
              console.log('📦 Credential data size:', credentialBytes.length, 'bytes');
              
              console.log('📤 Submitting via signAndExecute...');
              
              // Submit transaction
              await new Promise<void>((resolve, reject) => {
                signAndExecute(
                  { transaction: tx },
                  {
                    onSuccess: (result: any) => {
                      console.log('✅ Transaction submitted to blockchain!');
                      console.log('📋 Result:', result);
                      blockchainBlockId = result.blockId || result.id || result.digest || null;
                      console.log('🔗 Block ID:', blockchainBlockId);
                      resolve();
                    },
                    onError: (error: Error) => {
                      console.error('❌ Transaction failed:', error);
                      reject(error);
                    }
                  }
                );
              });
            } catch (error) {
              console.error('❌ Blockchain publishing failed:', error);
              // Continue without blocking
            }
          }
          
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
        <div className="flex flex-col items-center gap-0.5">
          <h3 className="text-base font-medium text-white inline-flex items-center gap-1.5">
            <span className="text-xl">{labels.productionIcon}</span>
            <span>Factory</span>
          </h3>
        </div>
      </div>

      {/* Production Stakeholder Info Card */}
      <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-6">
        {/* Header with Name */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2 text-center">
            {productionStakeholder.name}
          </h3>
          
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

        {/* About Section */}
        {('description' in productionStakeholder && productionStakeholder.description) || 
         ('capacity' in productionStakeholder && productionStakeholder.capacity) ? (
          <div className="mb-3 p-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg">
            <button
              onClick={() => setShowAbout(!showAbout)}
              className="w-full flex items-center justify-between mb-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-xs text-zinc-500">About</span>
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

        {/* Location with Mini Map */}
        {'coordinates' in productionStakeholder && productionStakeholder.coordinates ? (
          <div className="mb-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg overflow-hidden">
            <div className="h-32 bg-zinc-800 relative">
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${productionStakeholder.coordinates.lng - 0.05},${productionStakeholder.coordinates.lat - 0.05},${productionStakeholder.coordinates.lng + 0.05},${productionStakeholder.coordinates.lat + 0.05}&layer=mapnik&marker=${productionStakeholder.coordinates.lat},${productionStakeholder.coordinates.lng}`}
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
                Lat: {productionStakeholder.coordinates.lat.toFixed(2)}° | Lng: {productionStakeholder.coordinates.lng.toFixed(2)}°
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
                    <p className="text-xs text-white mb-4 font-medium">Origin Certificate Detected:</p>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">From:</span>
                        <span className="text-zinc-200">{farmerCredential.issuer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Product:</span>
                        <span className="text-zinc-200">{product.name}</span>
                      </div>
                      {farmerCredential.certificationData && 'batchWeight' in farmerCredential.certificationData && (
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Weight:</span>
                          <span className="text-zinc-200">
                            {(farmerCredential.certificationData.batchWeight as number).toLocaleString()} kg
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Type:</span>
                        <span className="text-zinc-200">{farmerCredential.credentialType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Issued:</span>
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
                <p className="text-sm font-medium text-white mb-3">
                  {industryKey === 'food-beverage' ? 'Recipe:' : 
                   industryKey === 'electronics' ? 'Components:' : 
                   'Materials:'}
                </p>
                <ul className="space-y-1.5 text-xs text-zinc-300">
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
                  <p className="text-white text-xs mb-1">Batch Number:</p>
                  <p className="text-white font-mono text-xs">{product.batchNumber}</p>
                </div>
                <div>
                  <p className="text-white text-xs mb-1">Production Date:</p>
                  <p className="text-white font-mono text-xs">{product.productionDate}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-white text-xs mb-1">Input → Output:</p>
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

          {/* Explorer Link */}
          {productionCredential.transactionId && (
            <div className="bg-[#1a1a1a] border-2 border-white rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Factory className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-xs font-medium text-white">Blockchain Verification</p>
                    <p className="text-xs text-zinc-500">Transaction: {productionCredential.transactionId.substring(0, 20)}...</p>
                  </div>
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

