'use client';

import React, { useState } from 'react';
import { FarmerOrigin } from '@/components/FarmerOrigin';
import { FactoryProduction } from '@/components/FactoryProduction';
import { ConsumerJourney } from '@/components/ConsumerJourney';
import { IndustrySelector } from '@/components/IndustrySelector';
import { Sprout, Factory, Shield, ExternalLink } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<TabType>('farmer');
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>('food-beverage');

  const tabs = [
    {
      id: 'farmer' as TabType,
      label: '👨‍🌾 Step 1',
      description: 'Farmer Issues Certificate',
      icon: Sprout,
      color: 'green',
    },
    {
      id: 'factory' as TabType,
      label: '🏭 Step 2',
      description: 'Factory Verifies & Produces',
      icon: Factory,
      color: 'blue',
    },
    {
      id: 'consumer' as TabType,
      label: '✅ Step 3',
      description: 'Consumer Verifies Chain',
      icon: Shield,
      color: 'purple',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-b border-[#27272a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Hero Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
              <span className="text-lg">🔐</span>
              <span className="text-sm text-green-400 font-medium">Digital Product Passport Demo</span>
            </div>
          </div>

          {/* Hero Title */}
          <div className="text-center space-y-4 mb-8">
            <h1 
              onClick={() => {
                setActiveTab('farmer');
                setSelectedIndustry(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-3xl sm:text-5xl font-bold text-white cursor-pointer hover:text-blue-400 transition-colors leading-tight"
            >
              Transparent Supply Chains
            </h1>
            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
              From farm to your shopping cart.
            </p>
          </div>
        </div>
      </header>

      {/* Industry Selector */}
      <div className="bg-[#1a1a1a] border-b border-[#27272a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
          <IndustrySelector 
            onSelectIndustry={setSelectedIndustry}
            selectedIndustry={selectedIndustry}
          />
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-[#1a1a1a] border-b border-[#27272a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {tabs.map((tab, index) => (
              <React.Fragment key={tab.id}>
                <button 
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (!selectedIndustry) {
                      // Scroll to industry selector if none selected
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="flex flex-col items-center group"
                >
                  <div 
                    className={`
                      w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                      border-2 transition-all cursor-pointer
                      ${activeTab === tab.id 
                        ? tab.color === 'green' ? 'bg-green-500/20 border-green-500 scale-110'
                          : tab.color === 'blue' ? 'bg-blue-500/20 border-blue-500 scale-110'
                          : 'bg-purple-500/20 border-purple-500 scale-110'
                        : 'bg-[#2a2a2a] border-[#3a3a3a] hover:border-blue-500/50 hover:bg-[#2f2f2f]'
                      }
                    `}
                  >
                    <span className="text-xl">{tab.label.split(' ')[0]}</span>
                  </div>
                  <p className={`
                    text-xs mt-1.5 font-medium transition-colors
                    ${activeTab === tab.id ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}
                  `}>
                    {tab.description}
                  </p>
                </button>
                {index < tabs.length - 1 && (
                  <div className="flex-1 h-0.5 bg-[#3a3a3a] mx-2 sm:mx-4"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {selectedIndustry && (
          <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-5 sm:p-8">
            {activeTab === 'farmer' && <FarmerOrigin industry={selectedIndustry} />}
            {activeTab === 'factory' && <FactoryProduction industry={selectedIndustry} />}
            {activeTab === 'consumer' && <ConsumerJourney industry={selectedIndustry} />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#27272a] mt-8 sm:mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3 text-center">
              Built for EU Digital Product Passport Regulation
            </h3>
            <p className="text-sm text-zinc-400 text-center max-w-2xl mx-auto mb-4">
              This demo shows real-world DPP implementation for supply chain transparency, 
              product authentication, and regulatory compliance.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3 mt-4">
              <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] border border-[#3a3a3a] rounded-full px-5 py-2.5 shadow-lg">
                <p className="text-sm font-medium text-white">⚡ Fast</p>
              </div>
              <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] border border-[#3a3a3a] rounded-full px-5 py-2.5 shadow-lg">
                <p className="text-sm font-medium text-white">✅ Compliant</p>
              </div>
              <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] border border-[#3a3a3a] rounded-full px-5 py-2.5 shadow-lg">
                <p className="text-sm font-medium text-white">🔗 Interoperable</p>
              </div>
              <a
                href="https://wiki.iota.org/identity.rs/introduction/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-full px-5 py-2.5 shadow-lg hover:border-blue-500/50 hover:from-blue-500/15 hover:to-blue-600/10 transition-all group no-underline"
              >
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-blue-400 group-hover:text-blue-300">🔒 Verifiable</p>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300" />
                </div>
              </a>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-center text-xs text-zinc-500">
              Free on IOTA testnet • Instant verification
            </p>
            <p className="text-center text-xs text-zinc-600">
              DPP Reference Implementation • Built with Next.js & IOTA Identity
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
