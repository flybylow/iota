'use client';

import React from 'react';
import { Coffee, Battery, Shirt, Smartphone, ChevronRight } from 'lucide-react';

/**
 * Industry Selector Component
 * Allows users to see the demo adapted for their industry
 */

interface IndustrySelectorProps {
  onSelectIndustry: (industry: string) => void;
  selectedIndustry: string | null;
}

export function IndustrySelector({ onSelectIndustry, selectedIndustry }: IndustrySelectorProps) {
  const industries = [
    {
      id: 'food',
      name: 'Food & Beverage',
      icon: Coffee,
      emoji: '🍫',
      examples: 'Chocolate, Coffee, Wine',
      color: 'green',
      urgency: 'Growing demand',
      description: 'Track farm-to-table journey with verified organic, Fair Trade, and origin claims'
    },
    {
      id: 'battery',
      name: 'Batteries',
      icon: Battery,
      emoji: '🔋',
      examples: 'EV Batteries, Energy Storage',
      color: 'yellow',
      urgency: 'EU mandatory 2027',
      description: 'Digital Battery Passport required by EU regulation for all EV batteries'
    },
    {
      id: 'textile',
      name: 'Fashion & Textiles',
      icon: Shirt,
      emoji: '👕',
      examples: 'Clothing, Shoes, Accessories',
      color: 'purple',
      urgency: 'Transparency required',
      description: 'Verify sustainable materials, ethical labor, and carbon footprint claims'
    },
    {
      id: 'electronics',
      name: 'Electronics',
      icon: Smartphone,
      emoji: '📱',
      examples: 'Phones, Laptops, Appliances',
      color: 'blue',
      urgency: 'ESPR compliance',
      description: 'Track components, materials, repairability, and recycling information'
    }
  ];

  if (selectedIndustry) {
    const selected = industries.find(i => i.id === selectedIndustry);
    
    return (
      <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-5 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selected?.emoji}</span>
            <div>
              <p className="text-sm text-zinc-400">Selected Industry:</p>
              <p className="text-base font-semibold text-white">{selected?.name}</p>
            </div>
          </div>
          <button
            onClick={() => onSelectIndustry('')}
            className="text-xs text-blue-400 hover:text-blue-300 underline"
          >
            Change Industry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-6 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">
          Choose Your Industry
        </h2>
        <p className="text-sm text-zinc-400">
          See how Digital Product Passports work for your sector
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {industries.map((industry) => {
          const Icon = industry.icon;
          
          return (
            <button
              key={industry.id}
              onClick={() => onSelectIndustry(industry.id)}
              className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-5 text-left hover:border-blue-500/40 transition-all hover:bg-[#2f2f2f] group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{industry.emoji}</span>
                  <div>
                    <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {industry.name}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{industry.examples}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-blue-400 transition-colors" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`
                    text-xs px-2 py-1 rounded-full
                    ${industry.id === 'battery' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                      'bg-blue-500/10 text-blue-400 border border-blue-500/20'}
                  `}>
                    {industry.urgency}
                  </span>
                </div>
                
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {industry.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 pt-5 border-t border-[#27272a]">
        <p className="text-xs text-zinc-500 text-center">
          This demo uses chocolate as an example, but the same patterns apply to all industries
        </p>
      </div>
    </div>
  );
}

