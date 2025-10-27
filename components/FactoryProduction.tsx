'use client';

import React, { useState, useEffect } from 'react';
import { industryData, type IndustryId } from '@/data/industry-data';
import { Loader2, CheckCircle2, XCircle, AlertCircle, Factory } from 'lucide-react';
import { isBlockchainMode } from '@/lib/dppMode';
import { createDID, issueCredential, verifyCredential } from '@/lib/iotaIdentityReal';
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
          // Get manufacturer DID
          let manufacturerDID = productionStakeholder.did;
          let productDID = product.did;
          
          // Check if we need to create new DIDs (if using mock DIDs)
          const isMockManufacturerDID = manufacturerDID.includes('mock') || manufacturerDID.includes('factory') || manufacturerDID.includes('choco') || !manufacturerDID.startsWith('did:iota:0x');
          
          if (isMockManufacturerDID) {
            console.log('Creating new DID for manufacturer (replacing mock)...');
            const didResult = await createDID();
            manufacturerDID = didResult.did;
            console.log('✅ Manufacturer DID created:', manufacturerDID);
          }
          
          const isMockProductDID = productDID.includes('mock') || productDID.includes('factory') || !productDID.startsWith('did:iota:0x');
          
          if (isMockProductDID) {
            console.log('Creating new DID for product (replacing mock)...');
            // Use the same product DID from farmer credential if available
            if (farmerCredential && farmerCredential.subject && !farmerCredential.subject.includes('mock') && !farmerCredential.subject.includes('factory')) {
              productDID = farmerCredential.subject;
              console.log('✅ Using product DID from farmer credential:', productDID);
            } else {
              // Create new product DID
              const didResult = await createDID();
              productDID = didResult.did;
              console.log('✅ Product DID created:', productDID);
            }
          }
          
          // Issue production credential with credential chaining
          console.log('Issuing production credential...');
          const credentialJWT = await issueCredential(
            manufacturerDID,
            productDID,
            {
              type: labels.productionCredential,
              certificationData: certificationData,
              previousCredentials: [farmerCredential?.jwt] // Credential chaining!
            }
          );
          
          console.log('✅ Production credential issued successfully');
          
          dppCredential = {
            jwt: credentialJWT,
            issuer: productionStakeholder.name,
            issuerDID: manufacturerDID,
            subject: productDID,
            credentialType: labels.productionCredential,
            issuedAt: new Date().toISOString(),
            certificationData,
            previousCredentials: [farmerCredential?.jwt || ''],
            onChain: true,
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
        <h2 className="text-sm font-semibold text-white inline-flex items-center gap-3">
          <span className="text-base">{labels.productionIcon}</span>
          <span>Verifies & Produces - 2/3</span>
        </h2>
      </div>

      {/* Production Stakeholder Info Card */}
      <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-5">
        <h3 className="text-lg font-semibold text-white mb-3">
          {productionStakeholder.name}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-white">📍 Location:</span>
            <span className="text-white">{productionStakeholder.location}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-white">✅ Certified:</span>
            <span className="text-white">{productionStakeholder.certifications.join(', ')}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-white">⚡ Capacity:</span>
            <span className="text-white">{productionStakeholder.capacity}</span>
          </div>
        </div>
      </div>

      {!productionCredential && (
        <>
          {/* Verification Step */}
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-5 space-y-4">
            <h4 className="text-base font-medium text-white">1. Verify Incoming Materials</h4>
            
            {farmerCredential ? (
              <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4">
                <p className="text-xs text-white mb-2">Origin Certificate Detected:</p>
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
                    No origin certificate found. Complete Step 1 first.
                  </p>
                </div>
              </div>
            )}

            {verificationStatus === 'pending' && farmerCredential && (
              <div className="flex justify-center">
                <button
                  onClick={verifyFarmerCertificate}
                  disabled={loading}
                  className="bg-black hover:bg-gray-900 border-2 border-white text-white font-medium py-3 px-8 rounded-full transition-all duration-200 disabled:opacity-50 text-sm shadow-lg"
                  style={{ color: '#ffffff', backgroundColor: '#000000', borderColor: '#ffffff' }}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span style={{ color: '#ffffff' }}>Verifying on IOTA network...</span>
                    </div>
                  ) : (
                    <span style={{ color: '#ffffff' }}>Verify Certificate</span>
                  )}
                </button>
              </div>
            )}

            {verificationStatus === 'verified' && farmerCredential && (
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

          {/* Production Step */}
          {verificationStatus === 'verified' && (
            <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-5 space-y-4">
              <h4 className="text-base font-medium text-white">2. Record Production</h4>

              <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4">
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
                <button
                  onClick={issueProductionCertificate}
                  disabled={loading}
                  className="bg-black hover:bg-gray-900 border-2 border-white text-white font-medium py-3 px-8 rounded-full transition-all duration-200 disabled:opacity-50 text-sm flex items-center gap-2 shadow-lg"
                  style={{ color: '#ffffff', backgroundColor: '#000000', borderColor: '#ffffff' }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span style={{ color: '#ffffff' }}>Issuing Production Certificate...</span>
                    </>
                  ) : (
                    <>
                      <Factory className="w-4 h-4" />
                      <span style={{ color: '#ffffff' }}>Issue Production Certificate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
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

          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-sm text-green-400 font-medium">✅ Ready for Step 3: Consumer Verification</p>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                if (onNextStep) {
                  onNextStep();
                } else {
                  // Fallback: scroll to consumer section if callback not provided
                  const consumerSection = document.getElementById('consumer-verification');
                  if (consumerSection) {
                    consumerSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    consumerSection.classList.add('highlight-pulse');
                    setTimeout(() => consumerSection.classList.remove('highlight-pulse'), 2000);
                  }
                }
              }}
              className="px-4 py-2 bg-black hover:bg-gray-900 border-2 border-white text-white font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
              style={{ color: '#ffffff', backgroundColor: '#000000', borderColor: '#ffffff' }}
            >
              <span style={{ color: '#ffffff' }}>Go to Consumer Verification →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

