'use client';

import React, { useState, useEffect } from 'react';
import { getDPPMode, setDPPMode, type DPPMode } from '@/lib/dppMode';
import { Settings, Zap, Network, Info } from 'lucide-react';
import { ConnectButton } from '@iota/dapp-kit';
import { useWalletStatus } from '@/lib/hooks/useWalletStatus';

/**
 * Mode Toggle Component
 * 
 * Allows switching between:
 * - Demo Mode: Mock data, no blockchain interaction (default)
 * - Blockchain Mode: Real IOTA Identity SDK integration
 */

export function ModeToggle() {
  const [mode, setMode] = useState<DPPMode>('demo');
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const { isConnected, address } = useWalletStatus();

  useEffect(() => {
    setMode(getDPPMode());
  }, []);

  const toggleMode = (newMode: DPPMode) => {
    setMode(newMode);
    setDPPMode(newMode);
    // Reload page to apply mode change
    window.location.reload();
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="flex items-center gap-2 px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg hover:border-blue-500/30 transition-colors cursor-pointer"
        title="Toggle DPP Mode"
      >
        <Settings className="w-4 h-4" style={{ color: '#ffffff' }} />
        <span className="text-sm font-medium" style={{ color: '#ffffff' }}>
          {mode === 'demo' ? '🎭 Demo Mode' : '⛓️ Blockchain Mode'}
        </span>
      </button>

      {/* Settings Dropdown */}
      {showSettings && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowSettings(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-[500px] bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="p-4 border-b border-[#3a3a3a]">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Settings className="w-4 h-4" />
                DPP Mode Settings
              </h3>
              <p className="text-xs text-white mt-1">
                Choose how the demo operates
              </p>
            </div>

            <div className="space-y-2">
              {/* Demo Mode Option */}
              <button
                onClick={() => toggleMode('demo')}
                className={`w-full text-left transition-colors cursor-pointer rounded-lg ${
                  mode === 'demo'
                    ? 'bg-blue-500/10 border-2 border-blue-500/50'
                    : 'bg-[#1a1a1a] border border-[#3a3a3a] hover:border-blue-500/30'
                }`}
              >
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-white">Demo Mode</span>
                      {mode === 'demo' && (
                        <>
                          <span className="mx-2 text-zinc-500">:</span>
                          <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                            Active
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </button>

              {/* Blockchain Mode Option */}
              <button
                onClick={() => toggleMode('blockchain')}
                className={`w-full text-left transition-colors cursor-pointer rounded-lg ${
                  mode === 'blockchain'
                    ? 'bg-[#1a1a1a] border-2 border-green-500/50'
                    : 'bg-[#1a1a1a] border border-[#3a3a3a] hover:border-green-500/30'
                }`}
              >
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Network className="w-4 h-4 text-green-400" />
                    <div>
                      <span className="text-sm font-medium text-white">Blockchain Mode</span>
                      {mode === 'blockchain' && (
                        <>
                          <span className="mx-2 text-zinc-500">:</span>
                          <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded">
                            Active
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Blockchain Mode Info Section */}
            {mode === 'blockchain' && (
              <>
                {/* Wallet Connection Button */}
                <div className="border-t border-[#3a3a3a] pt-3">
                  {isConnected ? (
                    <div className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-green-500/10 border border-green-500/30 text-green-400 text-center">
                      ✓ Connected: {address?.substring(0, 10)}...
                    </div>
                  ) : (
                    <ConnectButton
                      connectText="🔗 Connect IOTA Wallet"
                      className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors border bg-black border-white text-white hover:bg-gray-900"
                      style={{ backgroundColor: '#000000', borderColor: '#ffffff', color: '#ffffff' }}
                    />
                  )}
                </div>

                {/* Info Button */}
                <div className="border-t border-[#3a3a3a] pt-2 bg-black">
                  <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="w-full px-4 py-2 text-left flex items-center justify-between text-xs text-zinc-400 hover:text-white transition-colors bg-black"
                    style={{ backgroundColor: '#000000' }}
                  >
                    <span className="flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      <span>About Blockchain Mode</span>
                    </span>
                    <span>{showInfo ? '−' : '+'}</span>
                  </button>
                </div>

                {/* Collapsible Info Section */}
                {showInfo && (
                  <div className="border-t border-[#3a3a3a] bg-black px-4 py-3 text-xs text-white space-y-2">
                    <ul className="space-y-1">
                      <li>• Creates real DIDs with cryptographic keys ✅</li>
                      <li>• WASM initialized and working</li>
                      <li>• UNTP-compliant credentials</li>
                      <li>• Full supply chain verification</li>
                    </ul>
                    <div className="mt-2 pt-2 border-t border-[#3a3a3a]">
                      <p className="text-green-400 font-medium mb-1">
                        ✅ {isConnected ? 'Wallet Connected!' : 'Works Without Wallet'}
                      </p>
                      <p className="text-zinc-400 leading-relaxed">
                        {isConnected 
                          ? 'DIDs can be published to the blockchain using dApp Kit.'
                          : 'App creates and verifies DIDs locally. Wallet needed for on-chain publishing.'}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

