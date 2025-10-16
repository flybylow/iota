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
    <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-5 mb-6">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-white mb-1">
          Choose Your Industry
        </h2>
        <p className="text-xs text-zinc-400">
          This demo uses chocolate, but applies to all sectors
        </p>
      </div>

      <div className="space-y-2">
        {industries.map((industry) => (
          <label
            key={industry.id}
            className="flex items-center gap-3 p-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg cursor-pointer hover:bg-[#2f2f2f] hover:border-blue-500/30 transition-colors"
          >
            <input
              type="radio"
              name="industry"
              value={industry.id}
              onChange={() => onSelectIndustry(industry.id)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-xl">{industry.emoji}</span>
            <span className="text-sm font-medium text-white">{industry.name}</span>
            {industry.id === 'battery' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 ml-auto">
                {industry.urgency}
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

