'use client';

import React, { useState } from 'react';
import { CreateDID } from '@/components/CreateDID';
import { VerifyCredential } from '@/components/VerifyCredential';
import { KeyRound, ShieldCheck } from 'lucide-react';

/**
 * Main Application Page
 * 
 * A tabbed interface for exploring IOTA DIDs and Verifiable Credentials.
 * Users progress through three main flows:
 * 1. Create a DID
 * 2. Issue a credential
 * 3. Verify a credential
 */

type TabType = 'create' | 'verify';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('create');

  const tabs = [
    {
      id: 'create' as TabType,
      label: 'Create Identity',
      icon: KeyRound,
      color: 'blue',
    },
    {
      id: 'verify' as TabType,
      label: 'Verify Identity',
      icon: ShieldCheck,
      color: 'indigo',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#27272a]">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-white mb-1">
              Decentralized Identity
            </h1>
            <p className="text-zinc-400 text-sm">on IOTA</p>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-[#1a1a1a] border-b border-[#27272a]">
        <div className="max-w-5xl mx-auto px-6">
          <nav className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-5 py-3.5 text-sm transition-all font-medium
                    border-b-2
                    ${isActive
                      ? 'text-white border-blue-500'
                      : 'text-zinc-400 border-transparent hover:text-zinc-200'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg p-8">
          {activeTab === 'create' && <CreateDID />}
          {activeTab === 'verify' && <VerifyCredential />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#27272a] mt-16">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-zinc-400">
              Decentralized Identity Demo • Built with Next.js & IOTA
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
