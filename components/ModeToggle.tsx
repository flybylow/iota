'use client';

import React, { useState, useEffect } from 'react';
import { getDPPMode, setDPPMode, type DPPMode } from '@/lib/dppMode';
import { Settings, Zap, Network } from 'lucide-react';

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
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    setMode(getDPPMode());
  }, []);

  const toggleMode = (newMode: DPPMode) => {
    setMode(newMode);
    setDPPMode(newMode);
    // Reload page to apply mode change
    window.location.reload();
  };

  const handleConnectWallet = async () => {
    try {
      console.log('🔗 Attempting to connect IOTA Wallet...');
      console.log('📋 Step 1: Importing wallet connection module');
      const { connectWallet } = await import('@/lib/wallet-connection');
      console.log('📋 Step 2: Calling connectWallet()');
      const address = await connectWallet();
      console.log('📋 Step 3: Got address result:', address ? 'connected' : 'not connected');
      
      if (address) {
        setWalletConnected(true);
        console.log('✅ Wallet connected:', address);
        alert('✅ Wallet connected!\n\nAddress: ' + address.substring(0, 20) + '...');
      } else {
        console.log('❌ Wallet not connected - checking extension status...');
        const isExtensionInstalled = (typeof window !== 'undefined' && (window as unknown as { chrome?: { runtime?: { id?: string } } }).chrome?.runtime?.id) || (typeof window !== 'undefined' && (window as unknown as { browser?: { runtime?: { id?: string } } }).browser?.runtime?.id);
        console.log('📋 Extension check result:', isExtensionInstalled ? 'extension detected' : 'no extension');
        
        console.log('💡 Wallet connection is optional - app works without it!');
        console.log('📋 Note: The IOTA Wallet extension was reinstalled');
        console.log('✅ App works perfectly without wallet connection!');
        alert('⚠️ Cannot Connect to Browser Extension\n\nPossible reasons:\n• IOTA Wallet extension not installed\n• Extension service worker inactive\n• Extension API not responding\n\n✅ What You Can Still Do:\n• Create DIDs with cryptographic keys\n• Issue UNTP-compliant credentials\n• View complete supply chain traceability\n• All features work without wallet connection!\n\n💡 The app creates and verifies credentials locally. Wallet is only needed for on-chain publishing.');
      }
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      console.error('❌ Error details:', error);
      alert('Failed to connect wallet. Please check the browser console for details.');
    }
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
          <div className="absolute top-full right-0 mt-2 w-80 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="p-4 border-b border-[#3a3a3a]">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Settings className="w-4 h-4" />
                DPP Mode Settings
              </h3>
              <p className="text-xs text-white mt-1">
                Choose how the demo operates
              </p>
            </div>

            <div className="p-3 space-y-2">
              {/* Demo Mode Option */}
              <button
                onClick={() => toggleMode('demo')}
                className={`w-full text-left p-3 rounded-lg transition-colors cursor-pointer border ${
                  mode === 'demo'
                    ? 'bg-blue-500/10 border-blue-500/30'
                    : 'bg-black border-[#3a3a3a] hover:border-blue-500/20'
                }`}
                style={mode !== 'demo' ? { backgroundColor: '#000000' } : {}}
              >
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">Demo Mode</span>
                      {mode === 'demo' && (
                        <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white leading-relaxed">
                      Instant • Uses mock data • No blockchain connection needed
                    </p>
                  </div>
                </div>
              </button>

              {/* Blockchain Mode Option */}
              <button
                onClick={() => toggleMode('blockchain')}
                className={`w-full text-left p-3 rounded-lg transition-colors cursor-pointer border ${
                  mode === 'blockchain'
                    ? 'bg-black border-gray-500/30'
                    : 'bg-black border-[#3a3a3a] hover:border-gray-500/20'
                }`}
                style={{ backgroundColor: '#000000' }}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Network className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-white">Blockchain Mode</span>
                    {mode === 'blockchain' && (
                      <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <ul className="text-xs text-white space-y-0.5 ml-6">
                    <li>• Real IOTA Identity SDK</li>
                    <li>• Creates actual DIDs</li>
                    <li>• Requires testnet tokens</li>
                  </ul>
                </div>
              </button>
            </div>

            {/* Blockchain Mode Info Section */}
            {mode === 'blockchain' && (
              <>
                {/* Wallet Connection Button */}
                <div className="p-3 border-t border-[#3a3a3a]">
                  <button
                    onClick={handleConnectWallet}
                    disabled={walletConnected}
                    className={`w-full p-3 rounded-lg text-sm font-medium transition-colors border-2 ${
                      walletConnected
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-black border-white text-white hover:bg-gray-900'
                    }`}
                    style={{ color: walletConnected ? '#86efac' : '#ffffff', backgroundColor: walletConnected ? 'rgba(34, 197, 94, 0.1)' : '#000000', borderColor: walletConnected ? 'rgba(34, 197, 94, 0.3)' : '#ffffff' }}
                  >
                    {walletConnected ? '✓ Wallet Connected' : '🔗 Connect IOTA Wallet'}
                  </button>
                </div>

                {/* Info Section */}
                <div className="p-4 bg-blue-500/5 border-t border-[#3a3a3a]">
                <p className="text-xs text-blue-400 mb-2 font-medium">
                  ⚠️ Blockchain Mode Info:
                </p>
                <ul className="text-xs text-white space-y-1 ml-4">
                  <li>• Creates real DIDs with cryptographic keys ✅</li>
                  <li>• WASM initialized and working</li>
                  <li>• UNTP-compliant credentials</li>
                  <li>• Full supply chain verification</li>
                </ul>
                <div className="mt-3 p-2 bg-green-500/10 border border-green-500/20 rounded">
                  <p className="text-xs text-green-400 font-medium mb-1 flex items-center gap-1.5">
                    ✅ Everything Works Without Wallet
                  </p>
                  <p className="text-xs text-white leading-relaxed">
                    The app creates and verifies DIDs locally. Wallet connection is optional and only needed for on-chain publishing of credentials to the blockchain.
                  </p>
                </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

