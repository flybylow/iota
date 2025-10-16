'use client';

import React, { useState } from 'react';
import { FarmerOrigin } from '@/components/FarmerOrigin';
import { FactoryProduction } from '@/components/FactoryProduction';
import { ConsumerJourney } from '@/components/ConsumerJourney';
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

  const tabs = [
    {
      id: 'farmer' as TabType,
      label: '🌱 Farmer',
      description: 'Origin',
      icon: Sprout,
      color: 'green',
    },
    {
      id: 'factory' as TabType,
      label: '🏭 Factory',
      description: 'Production',
      icon: Factory,
      color: 'blue',
    },
    {
      id: 'consumer' as TabType,
      label: '✅ Consumer',
      description: 'Verification',
      icon: Shield,
      color: 'purple',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#27272a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              🍫 Digital Product Passport Demo
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto">
              See how blockchain-powered identities enable transparent, verifiable supply chains
            </p>
            <p className="text-xs text-zinc-400">
              Follow a chocolate bar from Ecuador farm → Belgian factory → Dutch consumer
            </p>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-[#1a1a1a] border-b border-[#27272a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {tabs.map((tab, index) => (
              <React.Fragment key={tab.id}>
                <div className="flex flex-col items-center">
                  <div 
                    className={`
                      w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                      border-2 transition-all cursor-pointer
                      ${activeTab === tab.id 
                        ? 'bg-' + tab.color + '-500/20 border-' + tab.color + '-500 scale-110' 
                        : 'bg-[#2a2a2a] border-[#3a3a3a] hover:border-zinc-500'
                      }
                    `}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="text-xl">{tab.label.split(' ')[0]}</span>
                  </div>
                  <p className={`
                    text-xs mt-1.5 font-medium transition-colors
                    ${activeTab === tab.id ? 'text-white' : 'text-zinc-500'}
                  `}>
                    {tab.description}
                  </p>
                </div>
                {index < tabs.length - 1 && (
                  <div className="flex-1 h-0.5 bg-[#3a3a3a] mx-2 sm:mx-4"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-[#1a1a1a] border-b border-[#27272a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1 sm:gap-2 justify-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-3 sm:px-5 py-3.5 text-xs sm:text-sm transition-all font-medium
                    border-b-2
                    ${isActive
                      ? 'text-white border-' + tab.color + '-500'
                      : 'text-zinc-400 border-transparent hover:text-zinc-200'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-5 sm:p-8">
          {activeTab === 'farmer' && <FarmerOrigin />}
          {activeTab === 'factory' && <FactoryProduction />}
          {activeTab === 'consumer' && <ConsumerJourney />}
        </div>
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
              product authentication, and regulatory compliance using W3C DID standards and IOTA.
            </p>
            <div className="flex flex-wrap justify-center items-stretch gap-3 mt-4">
              <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 flex items-center gap-2">
                <p className="text-sm font-medium text-white">⚡ Fast</p>
                <span className="text-zinc-600">•</span>
                <p className="text-xs text-zinc-400">Instant verification</p>
              </div>
              <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 flex items-center gap-2">
                <p className="text-sm font-medium text-white">✅ Compliant</p>
                <span className="text-zinc-600">•</span>
                <p className="text-xs text-zinc-400">ESPR ready</p>
              </div>
              <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 flex items-center gap-2">
                <p className="text-sm font-medium text-white">🔗 Interoperable</p>
                <span className="text-zinc-600">•</span>
                <p className="text-xs text-zinc-400">W3C standards</p>
              </div>
              <a
                href="https://explorer.shimmer.network/testnet"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2a2a2a] border border-blue-500/20 rounded-lg px-4 py-3 flex items-center gap-2 hover:border-blue-500/40 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-blue-400 group-hover:text-blue-300">🔒 Verifiable</p>
                  <ExternalLink className="w-3 h-3 text-blue-400 group-hover:text-blue-300" />
                </div>
                <span className="text-zinc-600">•</span>
                <p className="text-xs text-zinc-400">IOTA Explorer</p>
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
