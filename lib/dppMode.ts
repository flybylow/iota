/**
 * DPP Mode Configuration
 * 
 * Controls whether the demo uses mock data or real blockchain integration
 */

export type DPPMode = 'demo' | 'blockchain';

// Default mode - start with demo
let currentMode: DPPMode = 'demo';

export function getDPPMode(): DPPMode {
  // Check if we're in browser
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('dpp-mode');
    if (stored === 'demo' || stored === 'blockchain') {
      currentMode = stored;
    }
  }
  return currentMode;
}

export function setDPPMode(mode: DPPMode): void {
  currentMode = mode;
  if (typeof window !== 'undefined') {
    localStorage.setItem('dpp-mode', mode);
  }
}

export function isBlockchainMode(): boolean {
  return getDPPMode() === 'blockchain';
}

export function isDemoMode(): boolean {
  return getDPPMode() === 'demo';
}

