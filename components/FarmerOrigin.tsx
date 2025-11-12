'use client';

import React, { useState } from 'react';
import { industryData, type IndustryId } from '@/data/industry-data';
import { Loader2, CheckCircle2, Copy, ExternalLink, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { getRealExplorerURL, getBlockExplorerURL, getDIDViewerURL, getDIDExplorerURL } from '@/lib/iotaExplorer';
import { isBlockchainMode } from '@/lib/dppMode';
import { createDID, issueCredential } from '@/lib/iotaIdentityReal';
import { buildUNTPDPPCredential } from '@/lib/schemas/untp/dpp-builder';
import { UNTPSection } from './UNTPSection';
import { Tabs } from './Tabs';
import { Tooltip } from './Tooltip';
import { CTAButton } from './CTAButton';
import { useWalletStatus } from '@/lib/hooks/useWalletStatus';
import { useSignAndExecuteTransaction } from '@iota/dapp-kit';
// Note: No longer using Transaction from @iota/iota-sdk
// Using object-based Identity model instead (no Alias Outputs)
import type { DPPCredential, OriginCertificationData } from '@/types/dpp';
// Removed: publishDIDToBlockchain - now using publishIdentityToChain for object-based publishing

// Note: Using object-based Identity model (no Alias Outputs, no Transaction building)

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
  const [showDIDInfo, setShowDIDInfo] = useState(false);
  const [farmerInfoTab, setFarmerInfoTab] = useState<'certifications' | 'batch'>('certifications');
  const [showAbout, setShowAbout] = useState(false);
  const [showHarvestForm, setShowHarvestForm] = useState(false);
  
  // Blockchain mode hooks
  const { isConnected, address } = useWalletStatus();
  
  // dApp Kit transaction signing hook
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  
  // Harvest data form state
  const [harvestData, setHarvestData] = useState({
    harvestDate: new Date().toISOString().split('T')[0],
    batchWeight: 400,
    cocoaVariety: 'Nacional',
    fermentationDays: 6,
    dryingMethod: 'Sun-dried'
  });

  const issueOriginCertificate = async () => {
    setLoading(true);
    
    // Store block ID from blockchain submission
    let blockchainBlockId: string | null = null;
    
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
          // Step 1: Create new DIDs for this certificate (or use existing ones)
          const issuerDID = originStakeholder.did;
          const productDID = product.did;
          
          console.log('📋 Using stakeholder DID:', issuerDID);
          console.log('📋 Using product DID:', productDID);
          
          // Note: These DIDs are from the stakeholder data
          // They are valid IOTA DID format but not yet published to blockchain
          // Each certificate will use these predefined stakeholder DIDs
          
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
          
          // Note: Certificate creation doesn't require blockchain publishing
          // DIDs and credentials are created locally and stored
          // Publishing DIDs to blockchain is optional and requires wallet signing
          // Credentials work locally without blockchain publishing
          console.log('✅ Certificate created successfully (local)');
          console.log('💡 Credential is ready to use - no blockchain publishing needed');
          console.log('📋 DID publishing to blockchain is optional and requires wallet signing');
          
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
            transactionId: blockchainBlockId || undefined,
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
        <h4 className="text-sm font-medium text-white">
          {labels.originIcon} {' '} Farmer
        </h4>
        <h3 className="text-base font-medium text-white mt-1">{originStakeholder.name}</h3>
      </div>

      {/* Stakeholder Info Card */}
      <div className="border border-[#3a3a3a] rounded-lg p-6 relative overflow-hidden bg-green-900/30">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: 'url(/CACAO4.jpeg)' }}
        />
        <div className="relative z-10">
          {/* Header with Name */}
          <div className="mb-4">
            {/* Layout: Left div (Country/Since) and Right div (Certifications) */}
            <div className="flex items-start justify-between">
            {/* Left div: Country and Since */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-base">🇪🇨</span>
                <span className="text-xs text-zinc-400">{originStakeholder.country}</span>
              </div>
              <div>
                <span className="text-xs text-zinc-400">Since {originStakeholder.established}</span>
              </div>
            </div>

            {/* Right div: Certifications */}
            <div className="flex items-center gap-3">
              {originStakeholder.certifications.map((cert, index) => {
                const logoHeight = cert === 'EU Organic' ? 'h-8' : 'h-10';
                const maxWidth = cert === 'EU Organic' ? 'max-w-[40px]' : 'max-w-[80px]';
                return (
                  <Tooltip key={index} content={cert} side="bottom">
                    <div className="flex items-center cursor-help">
                      <img 
                        src={cert === 'EU Organic' ? '/eu-organic-logo.svg' : '/fairtrade-logo.svg'} 
                        alt={cert}
                        className={`${logoHeight} w-auto ${maxWidth}`}
                      />
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>

          {/* Location with Mini Map */}
          <div className="mb-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg overflow-hidden">
            <div className="h-32 bg-zinc-800 relative">
              {originStakeholder.coordinates && (
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${originStakeholder.coordinates.lng - 0.05},${originStakeholder.coordinates.lat - 0.05},${originStakeholder.coordinates.lng + 0.05},${originStakeholder.coordinates.lat + 0.05}&layer=mapnik&marker=${originStakeholder.coordinates.lat},${originStakeholder.coordinates.lng}`}
                  width="100%"
                  height="128"
                  frameBorder="0"
                  style={{ border: 0, filter: 'grayscale(100%) invert(100%) contrast(0.9) brightness(1.3) hue-rotate(180deg)' }}
                  allowFullScreen
                  loading="lazy"
                  title="Location Map"
                  className="grayscale"
                />
              )}
              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                📍 {originStakeholder.location}
              </div>
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                Lat: {originStakeholder.coordinates.lat.toFixed(2)}° | Lng: {originStakeholder.coordinates.lng.toFixed(2)}°
              </div>
            </div>
          </div>

          {/* More Section */}
          <div className="mb-3 p-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg">
            <div className="space-y-3">
              <div className="bg-[#0f0f0f] border border-[#3a3a3a] rounded-lg p-3">
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
                <p className="text-xs text-white leading-relaxed">{originStakeholder.description}</p>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>

      {!credential && !loading && (
        <>
          {/* New Harvest Button */}
          {!showHarvestForm && (
            <div className="flex justify-center w-[80%] mx-auto">
              <CTAButton
                icon="+"
                label="New Harvest"
                onClick={() => setShowHarvestForm(true)}
                variant="primary"
                size="lg"
              />
            </div>
          )}

          {/* Harvest Details Form */}
          {showHarvestForm && (
            <>
            <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-8 py-8 w-[80%] mx-auto">
              <h4 className="text-base font-medium text-white mb-6">{labels.batchLabel}</h4>
            
            <div className="grid grid-cols-2 gap-x-10 gap-y-8 space-y-0">
              <div>
                <label className="block text-[10px] text-zinc-300 mb-2">Harvest Date</label>
                <input
                  type="date"
                  value={harvestData.harvestDate}
                  onChange={(e) => setHarvestData({...harvestData, harvestDate: e.target.value})}
                  className="w-auto min-w-[140px] px-4 py-2.5 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-[10px] text-zinc-300 mb-2">Batch Weight (kg)</label>
                <input
                  type="number"
                  min="100"
                  max="10000"
                  step="100"
                  value={harvestData.batchWeight}
                  onChange={(e) => setHarvestData({...harvestData, batchWeight: parseInt(e.target.value || '400', 10)})}
                  className="w-auto min-w-[100px] px-4 py-2.5 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-[10px] text-zinc-300 mb-2">Cocoa Variety</label>
                <select
                  value={harvestData.cocoaVariety}
                  onChange={(e) => setHarvestData({...harvestData, cocoaVariety: e.target.value})}
                  className="w-auto min-w-[160px] px-4 py-2.5 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option value="Nacional">Nacional (Premium Ecuador)</option>
                  <option value="Criollo">Criollo (Fine Flavor)</option>
                  <option value="Forastero">Forastero (Bulk)</option>
                  <option value="Trinitario">Trinitario (Hybrid)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] text-zinc-300 mb-2">Fermentation (days)</label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  value={harvestData.fermentationDays}
                  onChange={(e) => setHarvestData({...harvestData, fermentationDays: parseInt(e.target.value || '6', 10)})}
                  className="w-auto min-w-[80px] px-4 py-2.5 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-[10px] text-zinc-300 mb-2">Drying Method</label>
                <select
                  value={harvestData.dryingMethod}
                  onChange={(e) => setHarvestData({...harvestData, dryingMethod: e.target.value})}
                  className="w-auto min-w-[200px] px-4 py-2.5 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option value="Sun-dried">Sun-dried (Traditional)</option>
                  <option value="Mechanical">Mechanical drying</option>
                  <option value="Solar-powered">Solar-powered drying</option>
                </select>
              </div>
              
              <div className="col-span-2 mt-6">
                <label className="block text-[10px] text-zinc-300 mb-2">Certification #</label>
                <input
                  value={`${industry?.toUpperCase()}-CERT-2025-12345`}
                  className="w-auto min-w-[250px] px-4 py-2.5 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white text-sm"
                  disabled
                />
              </div>
            </div>
            </div>

            {/* Issue Button */}
            <div className="flex justify-center mt-6 mb-4">
              <CTAButton
                icon={labels.originIcon}
                label="Issue Origin Certificate"
                onClick={issueOriginCertificate}
                loading={loading}
                disabled={loading}
                variant="primary"
                size="lg"
              />
            </div>
            </>
          )}
        </>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-7">
          <div className="text-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-green-500 mx-auto" />
            <p className="text-white font-medium">Issuing certificate...</p>
            <p className="text-xs text-white">Publishing to IOTA network</p>
          </div>
        </div>
      )}

      {/* Success State */}
      {credential && (
        <div className="bg-[#2a2a2a] border border-green-500/20 rounded-lg p-7 space-y-4">
          
          {/* What happens here? Explanation */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-blue-400 mb-2">💡 What happens here?</h4>
            <div className="space-y-2 text-xs text-zinc-300 leading-relaxed">
              <p>
                <strong className="text-white">Certificate issued:</strong> A cryptographically signed credential 
                proving the origin and quality of your harvest batch.
              </p>
              <p>
                <strong className="text-white">Storage:</strong> Stored on the <a 
                  href="https://docs.iota.org/developer/iota-identity/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >IOTA network</a> as an immutable record that cannot be altered or faked.
              </p>
              <p>
                <strong className="text-white">Why it matters:</strong> This certificate is the foundation of your 
                supply chain. Factories must verify it before producing, creating trust without middlemen.
              </p>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-5 space-y-3">
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

          {/* Publish DID to Blockchain Button */}
          {credential.issuerDID && isConnected && address && (
            <div className="mb-4 space-y-2">
              <button
                onClick={async () => {
                  if (!credential || !credential.certificationData) {
                    alert('Credential data missing. Please issue the credential again before publishing on-chain.');
                    return;
                  }

                  try {
                    setLoading(true);
                    console.log('📡 Starting client-side DID publishing with wallet signing...');

                    if (!address) {
                      throw new Error('Wallet not connected. Please connect your IOTA Wallet.');
                    }

                    // Create a wrapper function for the dApp Kit mutation
                    const signAndExecute = async (transaction: any) => {
                      console.log('🔏 Signing transaction with wallet...');
                      const result = await signAndExecuteTransaction({
                        transaction,
                        waitForTransaction: true, // Wait for confirmation
                      });
                      return result;
                    };

                    const { publishIdentityToChain } = await import('@/lib/publishIdentityToChain');
                    const result = await publishIdentityToChain(null, address, signAndExecute);

                    if (!result.success || !result.did) {
                      const message = result.error || 'Unknown error while publishing DID.';
                      throw new Error(message);
                    }

                    const did = result.did;
                    const digest = result.blockId;

                    console.log('✅ DID published on-chain:', did);

                    const certificationData = credential.certificationData as OriginCertificationData;
                    const untpCredential = buildUNTPDPPCredential(
                      did,
                      product.did,
                      {
                        name: product.name,
                        description: ('description' in product ? product.description : product.name) as string,
                        countryOfOrigin: originStakeholder.country,
                        manufacturer: {
                          name: originStakeholder.name,
                          did,
                        },
                      },
                      certificationData
                    );

                    const credentialJWT = await issueCredential(
                      did,
                      product.did,
                      {
                        type: labels.originCredential,
                        certificationData,
                        untpCredential,
                      }
                    );

                    const updatedCredential: DPPCredential = {
                      ...credential,
                      jwt: credentialJWT,
                      issuerDID: did,
                      onChain: true,
                      transactionId: digest,
                      untpCredential,
                    };

                    localStorage.setItem('farmer-credential', JSON.stringify(updatedCredential));
                    setCredential(updatedCredential);

                    const explorerHint = result.explorerUrl ? `\nExplorer: ${result.explorerUrl}` : '';
                    alert(`DID published successfully!${digest ? `\nTransaction ID: ${digest}` : ''}${explorerHint}`);
                  } catch (error) {
                    console.error('❌ Failed to publish DID on-chain:', error);
                    const message = error instanceof Error ? error.message : 'Unknown error';
                    
                    // Check if this is the microservice limitation error
                    if (message.includes('DID publishing via microservice is not supported') || 
                        message.includes('wallet private key')) {
                      alert(
                        'DID Publishing Not Available\n\n' +
                        'On-chain DID publishing requires wallet signing, which must happen client-side.\n\n' +
                        'This feature is not yet implemented. For now, DIDs are created locally and can be used for credential issuance.\n\n' +
                        'To publish DIDs on-chain, you would need to:\n' +
                        '1. Build the identity transaction client-side\n' +
                        '2. Sign it with your wallet via @iota/dapp-kit\n' +
                        '3. Submit the signed transaction to the network'
                      );
                    } else {
                      alert(`Publishing failed: ${message}`);
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="block w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-lg transition-all duration-200 text-center"
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
              
              {/* DID Link */}
              <a
                href={getDIDViewerURL(credential.issuerDID, 'testnet')}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#0f0f0f] border-2 border-white text-white font-bold py-3.5 px-6 rounded-lg transition-all duration-200 text-center hover:bg-[#1a1a1a]"
              >
                <ExternalLink className="w-4 h-4 inline-block mr-2 mb-0.5" />
                View Your DID on Blockchain
              </a>
              
              {/* Transaction Link (if available) */}
              {credential.transactionId && (
                <a
                  href={getBlockExplorerURL(credential.transactionId, 'testnet')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-[#1a1a1a] border border-[#3a3a3a] text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 text-center hover:bg-[#2a2a2a] text-sm"
                >
                  <ExternalLink className="w-3 h-3 inline-block mr-2 mb-0.5" />
                  View Transaction
                </a>
              )}
            </div>
          )}
          
          {/* DID Link (when not connected) */}
          {credential.issuerDID && (!isConnected || !address) && (
            <div className="mb-4">
              <a
                href={getDIDViewerURL(credential.issuerDID, 'testnet')}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#0f0f0f] border-2 border-white text-white font-bold py-3.5 px-6 rounded-lg transition-all duration-200 text-center hover:bg-[#1a1a1a]"
              >
                <ExternalLink className="w-4 h-4 inline-block mr-2 mb-0.5" />
                View Your DID (Local)
              </a>
              <p className="text-xs text-zinc-500 mt-2 text-center">
                Connect wallet to publish DID to blockchain
              </p>
            </div>
          )}

          <div className="bg-[#1a1a1a] border-2 border-white rounded-lg p-5 text-sm">
            <Tabs
              tabs={[
                {
                  id: 'details',
                  label: 'Certificate Details',
                  content: (
                    <>
                      <div className="flex items-center justify-end mb-3">
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
                    </>
                  ),
                },
                {
                  id: 'untp',
                  label: 'UNTP Passport',
                  content: credential.untpCredential ? (
                    <UNTPSection untpCredential={credential.untpCredential} showTitle={true} />
                  ) : (
                    <div className="text-xs text-zinc-400">No UNTP data available</div>
                  ),
                  disabled: !credential.untpCredential,
                },
              ]}
              variant="content"
              defaultTab="details"
            />
          </div>

          {/* Collapsible IOTA Identity Info */}
          <div className="mt-4 border-t-2 border-white">
            <button
              onClick={() => setShowDIDInfo(!showDIDInfo)}
              className="w-full flex items-center justify-between py-3 px-0 text-left hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-white" />
                <span className="text-white font-medium">IOTA Identity Info</span>
              </div>
              {showDIDInfo ? (
                <ChevronUp className="w-4 h-4 text-white" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white" />
              )}
            </button>
            
            {showDIDInfo && (
              <div className="pb-3 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-500">Issuer DID:</span>
                  <code className="text-zinc-300 break-all">{credential.issuerDID}</code>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-500">Product DID:</span>
                  <code className="text-zinc-300 break-all">{credential.subject}</code>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-xs text-zinc-500">
                    {credential.transactionId 
                      ? '✅ Transaction published to IOTA testnet'
                      : '💡 DID created with cryptographic keys (not yet published to blockchain)'
                    }
                  </p>
                  {credential.transactionId ? (
                    <a
                      href={getBlockExplorerURL(credential.transactionId, 'testnet')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View</span>
                    </a>
                  ) : credential.issuerDID ? (
                    <a
                      href={getDIDViewerURL(credential.issuerDID, 'testnet')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View DID</span>
                    </a>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* Next Step Button - Single CTA */}
          <div className="flex justify-center">
            <CTAButton
              icon="→"
              label="Go to Factory"
              onClick={() => {
                if (onNextStep) {
                  onNextStep();
                } else {
                  // Fallback: scroll to factory section if callback not provided
                  const factorySection = document.getElementById('factory-production');
                  if (factorySection) {
                    factorySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    factorySection.classList.add('highlight-pulse');
                    setTimeout(() => {
                      requestAnimationFrame(() => {
                        factorySection.classList.remove('highlight-pulse');
                      });
                    }, 2000);
                  }
                }
              }}
              variant="primary"
              size="md"
              active={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

