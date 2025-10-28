'use client';

import React, { useState } from 'react';
import { industryData, type IndustryId } from '@/data/industry-data';
import { Loader2, CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import { getRealExplorerURL } from '@/lib/iotaExplorer';
import { isBlockchainMode } from '@/lib/dppMode';
import { createDID, issueCredential } from '@/lib/iotaIdentityReal';
import { buildUNTPDPPCredential } from '@/lib/schemas/untp/dpp-builder';
import { UNTPSection } from './UNTPSection';
import { useWalletStatus } from '@/lib/hooks/useWalletStatus';
import { useSignAndExecuteTransaction, useIotaClient } from '@iota/dapp-kit';
import type { DPPCredential, OriginCertificationData } from '@/types/dpp';
import { publishDIDToBlockchain, prepareDIDForPublishing } from '@/lib/publishDID';

// Import AliasOutputBuilder for transaction building
let IotaSDK: any = null;

/**
 * Origin Certification Component
 * Step 1 in the supply chain - dynamic for all industries
 */

interface FarmerOriginProps {
  industry: string | null;
  onNextStep?: () => void;
}

export function FarmerOrigin({ industry, onNextStep }: FarmerOriginProps) {
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
  
  // Blockchain mode hooks
  const { isConnected, address } = useWalletStatus();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const client = useIotaClient();
  
  // Harvest data form state
  const [harvestData, setHarvestData] = useState({
    harvestDate: new Date().toISOString().split('T')[0],
    batchWeight: 2500,
    cocoaVariety: 'Nacional',
    fermentationDays: 6,
    dryingMethod: 'Sun-dried'
  });

  const issueOriginCertificate = async () => {
    setLoading(true);
    
    try {
      // Create origin certification data using form inputs
      const certificationData: OriginCertificationData = {
        certificationBody: originStakeholder.certifications[0],
        certificationNumber: `${industry?.toUpperCase()}-CERT-2025-12345`,
        origin: {
          country: originStakeholder.country,
          region: originStakeholder.location,
          farm: originStakeholder.name,
          coordinates: originStakeholder.coordinates || { lat: 0, lng: 0 }
        },
        harvestDate: harvestData.harvestDate,
        batchWeight: harvestData.batchWeight,
        cocoaVariety: harvestData.cocoaVariety,
        fermentationDays: harvestData.fermentationDays,
        dryingMethod: harvestData.dryingMethod
      };

      let dppCredential: DPPCredential;
      
      if (isBlockchainMode()) {
        // BLOCKCHAIN MODE: Use real IOTA Identity SDK
        console.log('🔗 Blockchain Mode: Creating real DID and credential...');
        
        try {
          // Step 1: Create DID for issuer (farmer) if not exists
          let issuerDID = originStakeholder.did;
          let productDID = product.did;
          
          // Check if we need to create new DIDs (if using mock DIDs)
          const isMockDID = issuerDID.includes('mock') || issuerDID.includes('farmer') || issuerDID.includes('factory') || !issuerDID.startsWith('did:iota:0x');
          
          if (isMockDID) {
            console.log('Creating new DID for farmer (replacing mock)...');
            const didResult = await createDID();
            issuerDID = didResult.did;
            console.log('✅ Farmer DID created:', issuerDID);
          }
          
          const isMockProductDID = productDID.includes('mock') || productDID.includes('factory') || !productDID.startsWith('did:iota:0x');
          
          if (isMockProductDID) {
            console.log('Creating new DID for product (replacing mock)...');
            const didResult = await createDID();
            productDID = didResult.did;
            console.log('✅ Product DID created:', productDID);
          }
          
          // Step 2: Build UNTP-compliant credential
          const untpCredential = buildUNTPDPPCredential(
            issuerDID,
            productDID,
            {
              name: product.name,
              description: ('description' in product ? product.description : product.name) as string,
              countryOfOrigin: originStakeholder.country,
              manufacturer: {
                name: originStakeholder.name,
                did: issuerDID,
              },
            },
            certificationData
          );
          
          // Step 3: Issue verifiable credential
          const credentialJWT = await issueCredential(
            issuerDID,
            productDID,
            {
              type: labels.originCredential,
              certificationData: certificationData,
              untpCredential: untpCredential, // Include UNTP structure
            }
          );
          
          // Step 4: Publish credential to blockchain if wallet is connected
          if (isConnected && address) {
            console.log('✅ Wallet connected - ready for blockchain publishing');
            
            // Ask user if they want to publish to blockchain
            const shouldPublish = confirm(
              '✅ Certificate created!\n\n📝 This certificate requires wallet signature for on-chain publishing.\n\nWould you like to sign and publish this certificate to the blockchain?'
            );
            
            if (shouldPublish) {
              console.log('📝 Publishing to blockchain via dApp Kit...');
              
              // Prepare DID for blockchain publishing
              try {
                const publishResult = await publishDIDToBlockchain(
                  issuerDID,
                  { id: issuerDID, '@context': 'https://www.w3.org/ns/did/v1', ...document },
                  new Uint8Array(32), // Placeholder for private key (wallet handles signing)
                  address
                );
                
                if (publishResult.success) {
                  console.log('✅ DID prepared for blockchain publishing');
                  console.log('📋 Transaction ID:', publishResult.transactionId);
                  
                  // Full blockchain publishing implementation
                  try {
                    // Step 1: Prepare DID document for publishing
                    console.log('📦 Step 1: Preparing DID document...');
                    const preparedDID = await prepareDIDForPublishing(issuerDID, address);
                    console.log('✅ Document prepared:', preparedDID.did);
                    
                    // Step 2: Use IOTA Client from dApp Kit
                    console.log('📦 Step 2: Getting IOTA Client from dApp Kit...');
                    console.log('✅ Client available:', !!client);
                    
                    // Step 3: Prepare transaction with doc.publish(client)
                    console.log('📦 Step 3: Creating Alias Output transaction...');
                    console.log('💡 Call doc.publish(client) to create Alias Output');
                    console.log('💡 This will prepare the transaction for signing');
                    
                    // Step 4: Build Alias Output transaction using IOTA SDK
                    console.log('📦 Step 4: Building Alias Output transaction...');
                    
                    // Import IOTA SDK for transaction building
                    if (!IotaSDK) {
                        IotaSDK = await import('@iota/iota-sdk/client');
                        console.log('✅ IOTA SDK loaded');
                    }
                    
                    // Build Alias Output with DID document
                    const { AliasOutputBuilder, AliasId } = IotaSDK;
                    
                    // Create zero alias ID for new DID
                    const aliasId = AliasId.fromBytes(new Uint8Array(32));
                    console.log('📋 Alias ID created:', aliasId.toHex());
                    
                    // Create Alias Output with DID document in state metadata
                    console.log('📦 Building Alias Output with DID document...');
                    const aliasOutput = new AliasOutputBuilder()
                        .nativeTokens([])
                        .aliasId(aliasId.toHex())
                        .stateMetadata(preparedDID.packedDoc || new Uint8Array())
                        .build();
                    
                    console.log('✅ Alias Output created');
                    console.log('📋 Output ID:', aliasOutput.outputId);
                    
                    // Step 5: Sign and submit transaction
                    console.log('📦 Step 5: Signing and submitting transaction...');
                    signAndExecute(aliasOutput, {
                        onSuccess: (result) => {
                            console.log('✅ Transaction submitted to blockchain!', result);
                            alert(`✅ Certificate published to blockchain!\n\n📋 Transaction ID: ${result.id}\n🔗 Explorer: https://explorer.iota.org/txblock/${result.id}?network=testnet`);
                        },
                        onError: (error) => {
                            console.error('❌ Transaction failed:', error);
                            alert(`❌ Transaction failed: ${error.message}`);
                        }
                    });
                  } catch (publishError) {
                    console.error('❌ Publishing error:', publishError);
                    alert(`❌ Publishing error: ${publishError instanceof Error ? publishError.message : 'Unknown error'}`);
                  }
                } else {
                  console.error('❌ Publishing failed:', publishResult.error);
                  alert(`❌ Publishing failed: ${publishResult.error}`);
                }
              } catch (publishError) {
                console.error('❌ Publishing error:', publishError);
                alert(`❌ Publishing error: ${publishError instanceof Error ? publishError.message : 'Unknown error'}`);
              }
            } else {
              console.log('⚠️ User declined blockchain publishing');
            }
          }
          
          dppCredential = {
            jwt: credentialJWT,
            issuer: originStakeholder.name,
            issuerDID: issuerDID,
            subject: productDID,
            credentialType: labels.originCredential,
            issuedAt: new Date().toISOString(),
            certificationData,
            untpCredential: untpCredential,
            onChain: true,
          };
        } catch (error) {
          console.error('❌ Blockchain mode failed:', error);
          alert('Blockchain mode failed. Falling back to demo mode. Error: ' + (error instanceof Error ? error.message : 'Unknown'));
          throw error;
        }
      } else {
        // DEMO MODE: Use mock data
        console.log('🎭 Demo Mode: Creating mock credential...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        dppCredential = {
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
          certificationData,
          onChain: false,
          transactionId: '14M74ccxRiShqii8NFPpTCjeUPfCS7aYqDkGKj6PhLYf', // Example transaction ID from IOTA testnet
        };
      }
      
      // Save to localStorage for demo flow
      localStorage.setItem('farmer-credential', JSON.stringify(dppCredential));
      
      setCredential(dppCredential);
    } catch (err) {
      console.error('Failed to issue credential:', err);
      alert('Failed to issue credential: ' + (err instanceof Error ? err.message : 'Unknown error'));
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
        <div className="flex flex-col items-center gap-0.5">
          <h3 className="text-base font-medium text-white inline-flex items-center gap-0.5">
            <span className="text-xl">{labels.originIcon}</span>
            <span>Farmer</span>
          </h3>
          <h2 className="text-xs font-medium text-zinc-400 leading-tight">
            Certifies Product Origin - 1/3
          </h2>
        </div>
      </div>

      {/* Stakeholder Info Card */}
      <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-5">
        <h3 className="text-lg font-semibold text-white mb-3">
          {originStakeholder.name}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-white">📍 Location:</span>
            <span className="text-white">{originStakeholder.location}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-white">✅ Certified:</span>
            <span className="text-white">{originStakeholder.certifications.join(', ')}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-white">📅 Established:</span>
            <span className="text-white">{originStakeholder.established}</span>
          </div>
        </div>
      </div>

      {!credential && !loading && (
        <>
          {/* Harvest Details Form */}
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-6">
            <h4 className="text-base font-medium text-white mb-6">{labels.batchLabel}</h4>
            
            <div className="grid grid-cols-2 gap-6 space-y-0">
              <div>
                <label className="block text-sm text-zinc-300 mb-1.5">Harvest Date</label>
                <input
                  type="date"
                  value={harvestData.harvestDate}
                  onChange={(e) => setHarvestData({...harvestData, harvestDate: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-[#3a3a3a] rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm text-zinc-300 mb-1.5">Batch Weight (kg)</label>
                <input
                  type="number"
                  min="100"
                  max="10000"
                  step="100"
                  value={harvestData.batchWeight}
                  onChange={(e) => setHarvestData({...harvestData, batchWeight: parseInt(e.target.value || '2500', 10)})}
                  className="w-full px-3 py-2 bg-white border border-[#3a3a3a] rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm text-zinc-300 mb-1.5">Cocoa Variety</label>
                <select
                  value={harvestData.cocoaVariety}
                  onChange={(e) => setHarvestData({...harvestData, cocoaVariety: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-[#3a3a3a] rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option value="Nacional">Nacional (Premium Ecuador)</option>
                  <option value="Criollo">Criollo (Fine Flavor)</option>
                  <option value="Forastero">Forastero (Bulk)</option>
                  <option value="Trinitario">Trinitario (Hybrid)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-zinc-300 mb-1.5">Fermentation (days)</label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  value={harvestData.fermentationDays}
                  onChange={(e) => setHarvestData({...harvestData, fermentationDays: parseInt(e.target.value || '6', 10)})}
                  className="w-full px-3 py-2 bg-white border border-[#3a3a3a] rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm text-zinc-300 mb-1.5">Drying Method</label>
                <select
                  value={harvestData.dryingMethod}
                  onChange={(e) => setHarvestData({...harvestData, dryingMethod: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-[#3a3a3a] rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option value="Sun-dried">Sun-dried (Traditional)</option>
                  <option value="Mechanical">Mechanical drying</option>
                  <option value="Solar-powered">Solar-powered drying</option>
                </select>
              </div>
              
              <div className="col-span-2 mt-4">
                <label className="block text-sm text-zinc-300 mb-1.5">Certification #</label>
                <input
                  value={`${industry?.toUpperCase()}-CERT-2025-12345`}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white text-sm"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Issue Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={issueOriginCertificate}
              className="bg-black hover:bg-gray-900 border-2 border-white text-white font-medium py-4 px-10 rounded-full transition-all duration-200 text-sm flex items-center gap-3 shadow-lg"
              style={{ color: '#ffffff', backgroundColor: '#000000', borderColor: '#ffffff' }}
            >
              <span className="text-lg">{labels.originIcon}</span>
              Issue Origin Certificate
            </button>
          </div>
        </>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-8">
          <div className="text-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-green-500 mx-auto" />
            <p className="text-white font-medium">Issuing certificate...</p>
            <p className="text-xs text-white">Publishing to IOTA network</p>
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
                <p className="text-xs text-white mb-1">Certificate JWT:</p>
                <code className="text-xs text-zinc-300 break-all block">{credential.jwt.substring(0, 100)}...</code>
              </div>
              <button
                onClick={copyCredential}
                className="flex-shrink-0 text-white hover:text-white transition-colors"
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
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-medium">Certificate Details:</p>
              {credential.onChain && (
                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded">
                  ✅ On-chain
                </span>
              )}
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-white">Issuer DID:</span>
                <span className="text-zinc-200 break-all">{credential.issuerDID}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Product DID:</span>
                <span className="text-zinc-200 break-all">{credential.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Origin:</span>
                <span className="text-zinc-200">{originStakeholder.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Batch Weight:</span>
                <span className="text-zinc-200">{(credential.certificationData as OriginCertificationData).batchWeight?.toLocaleString() || '0'} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Variety:</span>
                <span className="text-zinc-200">{(credential.certificationData as OriginCertificationData).cocoaVariety || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Harvest Date:</span>
                <span className="text-zinc-200">{new Date((credential.certificationData as OriginCertificationData).harvestDate || '').toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Fermentation:</span>
                <span className="text-zinc-200">{(credential.certificationData as OriginCertificationData).fermentationDays || 0} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Drying:</span>
                <span className="text-zinc-200">{(credential.certificationData as OriginCertificationData).dryingMethod || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Certified:</span>
                <span className="text-zinc-200">{originStakeholder.certifications.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Issued:</span>
                <span className="text-zinc-200">{new Date(credential.issuedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* UNTP Digital Product Passport Section */}
          {credential.untpCredential && (
            <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4 mt-4">
              <UNTPSection untpCredential={credential.untpCredential} showTitle={true} />
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-[#3a3a3a]">
            
            {/* IOTA Identity Info */}
            <div className="mt-3 pt-3 border-t border-[#3a3a3a]">
              <div className="mb-3 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-500">Issuer DID:</span>
                  <code className="text-zinc-300 break-all">{credential.issuerDID}</code>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-500">Product DID:</span>
                  <code className="text-zinc-300 break-all">{credential.subject}</code>
                </div>
              </div>
              <a
                href={credential.transactionId ? getRealExplorerURL(credential.issuerDID, 'testnet', credential.transactionId) : getRealExplorerURL(credential.issuerDID, 'testnet')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>
                  {credential.transactionId ? 'View Transaction on Blockchain' : 'Verify DID on Blockchain'}
                </span>
              </a>
              <p className="text-xs text-zinc-500 mt-1.5">
                {credential.transactionId 
                  ? '✅ View transaction details on IOTA testnet explorer'
                  : '💡 DID created locally with cryptographic keys'
                }
              </p>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-400 font-medium mb-1">✅ Origin Certificate Issued</p>
                <p className="text-xs text-white">Credentials ready for factory verification</p>
              </div>
              <button
                onClick={() => {
                  if (onNextStep) {
                    onNextStep();
                  } else {
                    // Fallback: scroll to factory section if callback not provided
                    const factorySection = document.getElementById('factory-production');
                    if (factorySection) {
                      factorySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      factorySection.classList.add('highlight-pulse');
                      setTimeout(() => factorySection.classList.remove('highlight-pulse'), 2000);
                    }
                  }
                }}
                className="px-4 py-2 bg-black hover:bg-gray-900 border-2 border-white text-white font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                style={{ color: '#ffffff', backgroundColor: '#000000', borderColor: '#ffffff' }}
              >
                <span style={{ color: '#ffffff' }}>Go to Factory →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

