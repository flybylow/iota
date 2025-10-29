'use client';

import React from 'react';
import { Tooltip } from './Tooltip';

interface Tab {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'navigation' | 'content';
  className?: string;
  onTabChange?: (tabId: string) => void;
  controlledActiveTab?: string;
}

/**
 * Reusable Tabs Component
 * 
 * Supports two variants:
 * - 'navigation': Main navigation tabs with descriptions and dividers (farmer/factory/consumer)
 * - 'content': Content tabs with equal width buttons (Certificate Details/UNTP)
 * 
 * @example
 * // Navigation variant
 * <Tabs
 *   tabs={[
 *     { id: 'farmer', label: '👨‍🌾 Farmer', description: 'Issues Certificate', content: <FarmerComponent /> },
 *     { id: 'factory', label: '🏭 Factory', description: 'Verifies & Produces', content: <FactoryComponent /> },
 *   ]}
 *   variant="navigation"
 * />
 * 
 * @example
 * // Content variant
 * <Tabs
 *   tabs={[
 *     { id: 'details', label: 'Certificate Details', content: <DetailsComponent /> },
 *     { id: 'untp', label: 'UNTP Passport', content: <UNTPSection /> },
 *   ]}
 *   variant="content"
 * />
 */
export function Tabs({
  tabs,
  defaultTab,
  variant = 'content',
  className = '',
  onTabChange,
  controlledActiveTab,
}: TabsProps) {
  // Safety check
  if (!tabs || tabs.length === 0) {
    return null;
  }

  const [internalActiveTab, setInternalActiveTab] = React.useState(
    defaultTab || tabs[0]?.id || ''
  );

  // Use controlled or internal state
  const activeTab = controlledActiveTab ?? internalActiveTab;
  
  // Find active tab content
  const activeTabData = tabs.find(tab => tab.id === activeTab);

  const handleTabChange = (tabId: string) => {
    const clickedTab = tabs.find(t => t.id === tabId);
    if (clickedTab?.disabled) return;
    
    // Always update internal state (for uncontrolled mode)
    if (!controlledActiveTab) {
      setInternalActiveTab(tabId);
    }
    
    // Always call the onChange callback (parent handles controlled state)
    onTabChange?.(tabId);
  };

  if (variant === 'navigation') {
    // Navigation tabs: elegant rounded buttons like secondary CTA
    return (
      <div className={`w-full ${className}`}>
        {/* Tab header - can be placed outside card */}
        <div className="w-[80%] mx-auto">
          <div className="flex items-center justify-center gap-3">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                disabled={tab.disabled}
                className={`
                  relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-black text-white border-2 border-blue-500 shadow-lg shadow-blue-500/30'
                    : 'bg-[#1a1a1a] text-zinc-400 border-2 border-transparent hover:bg-[#2a2a2a] hover:text-zinc-300'
                  }
                  ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <span className="flex items-center gap-1.5">
                  {tab.icon && (
                    <span className="flex items-center text-sm">{tab.icon}</span>
                  )}
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        {/* Content - rendered separately so it can be wrapped in card */}
        <div className="w-full">
          {activeTabData?.content}
        </div>
      </div>
    );
  }

  // Content tabs: equal width buttons in a row
  return (
    <div className={className}>
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-black border-2 border-blue-500 shadow-sm'
                : 'bg-[#0f0f0f] text-white border-2 border-transparent hover:bg-[#1a1a1a]'
            } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {activeTabData?.content}
      </div>
    </div>
  );
}

