'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FarmerOrigin } from '@/components/FarmerOrigin';
import { FactoryProduction } from '@/components/FactoryProduction';
import { ConsumerJourney } from '@/components/ConsumerJourney';
import { ModeToggle } from '@/components/ModeToggle';
import { Tabs } from '@/components/Tabs';
import { Sprout, Factory, Shield, ChevronRight } from 'lucide-react';

/**
 * Digital Product Passport Demo - Chocolate Supply Chain
 * 
 * Interactive demonstration of blockchain-powered supply chain transparency
 * using IOTA Decentralized Identifiers and Verifiable Credentials.
 * 
 * Journey:
 * 1. Farmer issues organic origin certificate
 * 2. Factory verifies origin and issues production certificate
 * 3. Consumer scans QR code to verify entire chain
 */

type TabType = 'farmer' | 'factory' | 'consumer';

export default function Home() {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>('food-beverage');
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<'farmer' | 'factory' | 'consumer'>('farmer');

  const tabs = [
    {
      id: 'farmer' as TabType,
      label: '👨‍🌾  Farmer',
      description: 'Issues Certificate',
      icon: Sprout,
      color: 'green',
    },
    {
      id: 'factory' as TabType,
      label: '🏭  Factory',
      description: 'Verifies & Produces',
      icon: Factory,
      color: 'blue',
    },
    {
      id: 'consumer' as TabType,
      label: '✅  Consumer',
      description: 'Verifies Chain',
      icon: Shield,
      color: 'purple',
    },
  ];

  return (
    <>
      {/* Top Navigation - Full Width (outside body container) */}
      <div className="fixed top-0 left-0 right-0 w-screen bg-gradient-to-b from-[#1c1c1c] to-[#0f0f0f] border-b border-[#2a2a2e] z-[100] overflow-x-hidden" style={{ isolation: 'isolate' }}>
        <div className="flex items-center justify-between px-4 py-4 w-full gap-4 min-w-0 relative z-[100]">
          {/* Logo - Left */}
          <Link href="/home">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <span className="text-2xl">👛</span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white leading-tight">DPP</span>
                <span className="text-[9px] text-white leading-tight">Digital Product Passport</span>
              </div>
            </div>
          </Link>

          {/* Industry Selector - Center (left of mode toggle) */}
          <div className="relative flex-1 flex justify-end z-[101]">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowIndustryDropdown(!showIndustryDropdown);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-[#262626] border border-[#3a3a3e] rounded-lg hover:border-blue-500/30 transition-colors text-white relative z-[101]"
              style={{ position: 'relative' }}
            >
              <span className="text-sm font-medium">
                {selectedIndustry === 'food-beverage' && '🍫  Food'}
                {selectedIndustry === 'battery' && '🔋  Battery'}
                {selectedIndustry === 'fashion' && '👕  Fashion'}
                {selectedIndustry === 'electronics' && '📱  Electronics'}
                {!selectedIndustry && 'Industry ▼'}
              </span>
            </button>

            {/* Dropdown */}
            {showIndustryDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-[98]"
                  onClick={() => setShowIndustryDropdown(false)}
                  style={{ pointerEvents: 'auto', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                />
                <div className="fixed right-4 w-64 bg-[#1a1a1a] border border-[#3a3a3e] rounded-lg shadow-xl z-[110] overflow-hidden"
                     style={{ 
                       top: '73px', // Height of topnav
                       position: 'fixed',
                       isolation: 'isolate'
                     }}
                     onClick={(e) => e.stopPropagation()}>
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        setSelectedIndustry('food-beverage');
                        setShowIndustryDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-[#262626] rounded transition-colors flex items-center gap-2"
                    >
                      🍫  Food & Beverage
                    </button>
                    <button
                      onClick={() => {
                        setSelectedIndustry('battery');
                        setShowIndustryDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-[#262626] rounded transition-colors flex items-center gap-2"
                    >
                      🔋  Batteries
                    </button>
                    <button
                      onClick={() => {
                        setSelectedIndustry('fashion');
                        setShowIndustryDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-[#262626] rounded transition-colors flex items-center gap-2"
                    >
                      👕  Fashion & Textiles
                    </button>
                    <button
                      onClick={() => {
                        setSelectedIndustry('electronics');
                        setShowIndustryDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-[#262626] rounded transition-colors flex items-center gap-2"
                    >
                      📱  Electronics
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Mode Toggle - Right */}
          <ModeToggle />
        </div>
      </div>
      
      {/* Body container - Mobile-width constrained */}
      <div className="min-h-screen relative z-0" style={{ backgroundColor: '#0f0f0f', backgroundImage: activeMainTab === 'factory' ? 'url(/fact.jpeg)' : activeMainTab === 'farmer' ? 'url(/CACAO4.jpeg)' : activeMainTab === 'consumer' ? 'url(/cea77f55-cab8-48f0-82fa-aee8cfbbbeef.jpeg)' : 'none', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundBlendMode: 'overlay' }}>
        <div className="absolute inset-0 bg-[#0f0f0f]/90" style={{ zIndex: 0 }}></div>
        {/* Spacer for fixed topnav */}
        <div className="h-[73px] relative z-10"></div>

        {/* Mobile-width container - forced on all screens - Passport style */}
        <div className="min-h-screen max-w-[448px] w-full mx-auto shadow-2xl relative z-10" style={{ backgroundColor: 'transparent' }}>
          {/* Navigation Tabs - Outside card for minimal mobile design */}
          <div className="px-4 pt-2 pb-2">
            <Tabs
              tabs={[
                {
                  id: 'farmer',
                  label: '🌱 Farmer',
                  description: tabs[0].description,
                  content: selectedIndustry ? (
                    <div className="w-full m-4 border-4 border-white/90 rounded-[2rem] overflow-hidden bg-[#0f0f0f] shadow-[0_0_0_2px_rgba(255,255,255,0.1)] ring-2 ring-white/20">
                      <div className="px-6 py-6">
                        <FarmerOrigin industry={selectedIndustry} onNextStep={() => {
                          setActiveMainTab('factory');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full m-4 border-4 border-white/90 rounded-[2rem] overflow-hidden bg-[#0f0f0f] shadow-[0_0_0_2px_rgba(255,255,255,0.1)] ring-2 ring-white/20">
                      <div className="px-6 py-4">
                        <p className="text-white text-center py-8">Please select an industry first</p>
                      </div>
                    </div>
                  ),
                  disabled: !selectedIndustry,
                },
                {
                  id: 'factory',
                  label: tabs[1].label,
                  description: tabs[1].description,
                  content: selectedIndustry ? (
                    <div className="w-full m-4 border-4 border-white rounded-[2rem] overflow-hidden relative">
                      {/* Background Image - Factory Tab */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ 
                          backgroundImage: 'url(/fact.jpeg)',
                          opacity: 0.25,
                          zIndex: 0
                        }}
                      />
                      <div className="absolute inset-0 bg-[#0f0f0f]/80" style={{ zIndex: 1 }}></div>
                      <div className="relative" style={{ zIndex: 10 }}>
                        <div className="px-6 py-6">
                          <FactoryProduction industry={selectedIndustry} onNextStep={() => {
                            setActiveMainTab('consumer');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full m-4 border-4 border-white rounded-[2rem] overflow-hidden bg-[#0f0f0f]">
                      <div className="px-6 py-8">
                        <p className="text-white text-center py-8">Please select an industry first</p>
                      </div>
                    </div>
                  ),
                  disabled: !selectedIndustry,
                },
                {
                  id: 'consumer',
                  label: '🛡️ Consumer',
                  description: tabs[2].description,
                  content: selectedIndustry ? (
                    <div className="w-full m-4 border-4 border-white rounded-[2rem] overflow-hidden bg-[#0f0f0f]">
                      <div className="px-6 py-8 pb-12">
                        <ConsumerJourney industry={selectedIndustry} />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full m-4 border-4 border-white rounded-[2rem] overflow-hidden bg-[#0f0f0f]">
                      <div className="px-6 py-8 pb-12">
                        <p className="text-white text-center py-8">Please select an industry first</p>
                      </div>
                    </div>
                  ),
                  disabled: !selectedIndustry,
                },
              ]}
              variant="navigation"
              defaultTab="farmer"
              controlledActiveTab={activeMainTab}
              onTabChange={(tabId) => {
                const newTab = tabId as 'farmer' | 'factory' | 'consumer';
                setActiveMainTab(newTab);
                // Scroll to top when switching tabs
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        </div>

        {/* Bottom Sections - Outside Card, Bottom of Screen - Only show on Consumer page */}
        {activeMainTab === 'consumer' && (
          <div className="max-w-[448px] mx-auto px-4 pb-8 space-y-6">
            {/* Why This Matters - Card */}
            <details className="card card-primary overflow-hidden group">
              <summary className="p-5 cursor-pointer list-none hover:bg-[#2f2f2f] transition-colors flex items-center gap-3">
                <ChevronRight className="w-5 h-5 text-purple-400 transition-transform group-open:rotate-90 flex-shrink-0" />
                <h4 className="text-base font-medium text-purple-400">
                  💡 What happens here?
                </h4>
              </summary>
              <div className="px-5 pb-5 pt-2 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">For Consumers</h4>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    You can instantly verify product authenticity with your phone. No more wondering if claims 
                    about organic, fair trade, or origin are true. Get complete transparency in seconds, not days.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-400 mb-2">For Your Business</h4>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    You can build trust with customers by showing verified supply chain data. Meet EU Digital 
                    Product Passport requirements, prevent fraud, and differentiate your products with 
                    blockchain-backed transparency.
                  </p>
                </div>
              </div>
            </details>

            {/* Technical & Legal Info - Card */}
            <details className="card card-purple overflow-hidden group">
              <summary className="p-5 cursor-pointer list-none hover:bg-purple-500/10 transition-colors flex items-center gap-3">
                <ChevronRight className="w-5 h-5 text-purple-400 transition-transform group-open:rotate-90 flex-shrink-0" />
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🍫</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white">
                      Technical & Legal Info
                    </h3>
                  </div>
                </div>
              </summary>
              <div className="px-5 pb-5 pt-2 space-y-4">
                <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-purple-400 mb-1">🔧 Technical Standards:</p>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      <strong>W3C Verifiable Credentials:</strong> Industry-standard format for digital certificates.
                      <br />
                      <strong>Ed25519 Signatures:</strong> Cryptographic proof of authenticity. 
                      <br />
                      <strong>IOTA Identity SDK:</strong> Decentralized identity on IOTA network.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-blue-400 mb-1">⚖️ Legal Compliance:</p>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      <strong>EU Digital Product Passport:</strong> Complies with upcoming 2027 regulations for batteries, textiles, and electronics.
                      <br />
                      <strong>UN/CEFACT UNTP:</strong> Standardized data schema for global trade.
                      <br />
                      <strong>GDPR Compliant:</strong> Privacy-preserving identity without centralized data storage.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-400 mb-1">🔐 Security & Immutability:</p>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Each certificate is cryptographically signed and stored on the <a 
                        href="https://docs.iota.org/developer/iota-identity/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 underline"
                      >IOTA Tangle</a>, creating an immutable chain that cannot be altered or falsified once recorded.
                    </p>
                  </div>
                </div>
              </div>
            </details>
          </div>
        )}
      </div> {/* Closes body container */}
      
      {/* Footer - Full Width (outside all containers) */}
      <footer className="w-full border-t border-[#2a2a2e] bg-[#0f0f0f]">
        <div className="max-w-[448px] mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="text-base">⚡</span>
              <span>Built with</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 394 80" fill="currentColor">
                <path d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0zM81 0L53 24v56h14V28l11-11 11 11v52h14V24L81 0zm151 0v12.7h-35v53.9h-13.6V12.7h-35V0h83.6zm46.3 0L237 24v56h13.6V28L258 19l7.6 9v52h13.6V24L278.3 0zm73.8 0v79.3h-13.7V0h13.7z"/>
              </svg>
              <span>Next.js</span>
            </span>
            <span className="text-zinc-600">•</span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <span className="text-base">🌐</span>
              <span>IOTA</span>
            </span>
            <span className="text-zinc-600">•</span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="2" opacity="0.3"/>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                <circle cx="12" cy="12" r="1.5"/>
                <path d="M7 12c0-2.76 2.24-5 5-5s5 2.24 5 5M17 12c0 2.76-2.24 5-5 5s-5-2.24-5-5" opacity="0.5"/>
              </svg>
              <span>React</span>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
