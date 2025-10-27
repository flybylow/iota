'use client';

import React, { useState } from 'react';
import { FarmerOrigin } from '@/components/FarmerOrigin';
import { FactoryProduction } from '@/components/FactoryProduction';
import { ConsumerJourney } from '@/components/ConsumerJourney';
import { IndustrySelector } from '@/components/IndustrySelector';
import { ModeToggle } from '@/components/ModeToggle';
import { Sprout, Factory, Shield } from 'lucide-react';

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
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);

  const tabs = [
    {
      id: 'farmer' as TabType,
      label: '👨‍🌾 Farmer',
      description: 'Issues Certificate',
      icon: Sprout,
      color: 'green',
    },
    {
      id: 'factory' as TabType,
      label: '🏭 Factory',
      description: 'Verifies & Produces',
      icon: Factory,
      color: 'blue',
    },
    {
      id: 'consumer' as TabType,
      label: '✅ Consumer',
      description: 'Verifies Chain',
      icon: Shield,
      color: 'purple',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Mobile-width container - forced on all screens */}
      <div className="min-h-screen bg-[#0f0f0f] max-w-md mx-auto shadow-2xl">
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-[#1c1c1c] to-[#0f0f0f] border-b border-[#2a2a2e]">
        <div className="max-w-md mx-auto px-4 py-6">
          {/* Top Bar - Logo, Industry, Mode Toggle */}
          <div className="flex items-center justify-between mb-8 gap-4 px-2">
            {/* Logo - Top Left */}
            <div 
              onClick={() => {
                setActiveTab('farmer');
                setSelectedIndustry(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">👛</span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white leading-tight">DPP</span>
                  <span className="text-[9px] text-zinc-500 leading-tight">Digital Product Passport</span>
                </div>
              </div>
            </div>
            
            {/* Industry Selector - Center */}
            <div className="relative">
              <button 
                onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
                className="flex items-center gap-2 px-3 py-2 bg-[#262626] border border-[#3a3a3e] rounded-lg hover:border-blue-500/30 transition-colors text-white"
              >
                <span className="text-sm font-medium">
                  {selectedIndustry === 'food-beverage' && '🍫 Food'}
                  {selectedIndustry === 'battery' && '🔋 Battery'}
                  {selectedIndustry === 'fashion' && '👕 Fashion'}
                  {selectedIndustry === 'electronics' && '📱 Electronics'}
                  {!selectedIndustry && 'Industry ▼'}
                </span>
              </button>

              {/* Dropdown */}
              {showIndustryDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowIndustryDropdown(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-64 bg-[#1a1a1a] border border-[#3a3a3e] rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => {
                          setSelectedIndustry('food-beverage');
                          setShowIndustryDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-white hover:bg-[#262626] rounded transition-colors flex items-center gap-2"
                      >
                        🍫 Food & Beverage
                      </button>
                      <button
                        onClick={() => {
                          setSelectedIndustry('battery');
                          setShowIndustryDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-white hover:bg-[#262626] rounded transition-colors flex items-center gap-2"
                      >
                        🔋 Batteries
                      </button>
                      <button
                        onClick={() => {
                          setSelectedIndustry('fashion');
                          setShowIndustryDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-white hover:bg-[#262626] rounded transition-colors flex items-center gap-2"
                      >
                        👕 Fashion & Textiles
                      </button>
                      <button
                        onClick={() => {
                          setSelectedIndustry('electronics');
                          setShowIndustryDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-white hover:bg-[#262626] rounded transition-colors flex items-center gap-2"
                      >
                        📱 Electronics
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mode Toggle - Top Right */}
            <ModeToggle />
          </div>

        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-[#171717] border-b border-[#2a2a2e]">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {tabs.map((tab, index) => (
              <React.Fragment key={tab.id}>
                <div className="flex flex-col items-center group" style={{ width: 'fit-content' }}>
                  <button 
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (!selectedIndustry) {
                        // Scroll to industry selector if none selected
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`
                      px-4 py-2 rounded-lg text-lg font-semibold transition-all whitespace-nowrap
                      ${activeTab === tab.id 
                        ? 'bg-white text-black' 
                        : 'bg-transparent text-zinc-500 hover:text-zinc-300 hover:bg-[#262626]'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                  <p className={`
                    text-[10px] mt-1 transition-all whitespace-nowrap text-center opacity-0 group-hover:opacity-100
                    ${activeTab === tab.id ? 'text-zinc-400 opacity-100' : 'text-zinc-600'}
                  `}>
                    {tab.description}
                  </p>
                </div>
                {index < tabs.length - 1 && (
                  <div className="flex-1 h-0.5 bg-[#3a3a3a] mx-2"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-8">
        {selectedIndustry && (
          <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-5">
            {activeTab === 'farmer' && <FarmerOrigin industry={selectedIndustry} onNextStep={() => setActiveTab('factory')} />}
            {activeTab === 'factory' && <FactoryProduction industry={selectedIndustry} />}
            {activeTab === 'consumer' && <ConsumerJourney industry={selectedIndustry} />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2a2a2e] mt-8">
        <div className="max-w-md mx-auto px-4 py-6">
          <p className="text-center text-xs text-zinc-500">
            Built with Next.js & IOTA Identity
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
}
