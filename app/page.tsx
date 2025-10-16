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
      label: 'Step 1: Create Identity',
      icon: KeyRound,
      color: 'blue',
    },
    {
      id: 'verify' as TabType,
      label: 'Step 2: Verify Identity',
      icon: ShieldCheck,
      color: 'indigo',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                IOTA DID Explorer
              </h1>
              <p className="text-gray-600 text-sm">
                Learn about Decentralized Identity on IOTA
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 font-semibold transition-all duration-200
                    border-b-2 relative
                    ${isActive
                      ? 'text-blue-600 border-blue-600 bg-blue-50'
                      : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {activeTab === 'create' && <CreateDID />}
          {activeTab === 'verify' && <VerifyCredential />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              💡 <strong>Quick Demo:</strong> Create an identity, then verify it - takes 60 seconds!
            </p>
            <p className="text-xs text-gray-500">
              Decentralized Identity Demo • Built with Next.js & IOTA • No blockchain fees on testnet
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
