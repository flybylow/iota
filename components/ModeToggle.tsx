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
      const { connectWallet } = await import('@/lib/wallet-connection');
      const address = await connectWallet();
      if (address) {
        setWalletConnected(true);
        console.log('✅ Wallet connected:', address);
        alert('✅ Wallet connected!\n\nAddress: ' + address.substring(0, 20) + '...');
      } else {
        console.log('❌ Wallet not connected');
        const isExtensionInstalled = chrome?.runtime?.id || browser?.runtime?.id;
        
        if (isExtensionInstalled) {
          alert('IOTA Wallet extension is installed but LOCKED.\n\nPlease:\n1. Unlock your wallet in the extension\n2. Then try connecting again');
        } else {
          alert('IOTA Wallet extension not installed.\n\nOpening Chrome Web Store to install...');
          setTimeout(() => {
            window.open('https://chromewebstore.google.com/detail/iota-wallet/iidjkmdceolghepehaaddojmnjnkkija', '_blank');
          }, 100);
        }
      }
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
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
              <p className="text-xs text-zinc-400 mt-1">
                Choose how the demo operates
              </p>
            </div>

            <div className="p-3 space-y-2">
              {/* Demo Mode Option */}
              <button
                onClick={() => toggleMode('demo')}
                className={`w-full text-left p-3 rounded-lg transition-colors cursor-pointer ${
                  mode === 'demo'
                    ? 'bg-blue-500/10 border border-blue-500/30'
                    : 'bg-[#2a2a2a] border border-[#3a3a3a] hover:border-blue-500/20'
                }`}
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
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Instant • Uses mock data • No blockchain connection needed
                    </p>
                  </div>
                </div>
              </button>

              {/* Blockchain Mode Option */}
              <button
                onClick={() => toggleMode('blockchain')}
                className={`w-full text-left p-3 rounded-lg transition-colors cursor-pointer ${
                  mode === 'blockchain'
                    ? 'bg-blue-500/10 border border-blue-500/30'
                    : 'bg-[#2a2a2a] border border-[#3a3a3a] hover:border-blue-500/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Network className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">Blockchain Mode</span>
                      {mode === 'blockchain' && (
                        <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Real IOTA Identity SDK • Creates actual DIDs • Requires testnet tokens
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Wallet Connection Button - Show in Blockchain Mode */}
            {mode === 'blockchain' && (
              <div className="p-3 border-t border-[#3a3a3a]">
                <button
                  onClick={handleConnectWallet}
                  disabled={walletConnected}
                  className={`w-full p-3 rounded-lg text-sm font-medium transition-colors ${
                    walletConnected
                      ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                      : 'bg-purple-600 hover:bg-purple-500 text-white'
                  }`}
                >
                  {walletConnected ? '✓ Wallet Connected' : '🔗 Connect IOTA Wallet'}
                </button>
              </div>
            )}

            {mode === 'blockchain' && (
              <div className="p-4 bg-blue-500/5 border-t border-[#3a3a3a]">
                <p className="text-xs text-blue-400 mb-2 font-medium">
                  ⚠️ Blockchain Mode Info:
                </p>
                <ul className="text-xs text-zinc-400 space-y-1 ml-4">
                  <li>• Creates DIDs locally (not published to chain)</li>
                  <li>• WASM initialization required</li>
                  <li>• Publishing requires testnet tokens</li>
                </ul>
                <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                  <p className="text-xs text-yellow-400 font-medium mb-1">
                    🚧 Testnet Faucet Currently Down
                  </p>
                  <p className="text-xs text-zinc-400 mb-2">
                    The public faucet is unavailable. For development, use Demo Mode or:
                  </p>
                  <a
                    href="https://discord.iota.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 inline-block"
                  >
                    Join IOTA Discord →
                  </a>
                  <p className="text-xs text-zinc-500 mt-1">
                    Ask for testnet tokens in developer/help channels
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

