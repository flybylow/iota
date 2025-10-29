'use client';

import React, { useState, useEffect } from 'react';
import { Sprout, Factory, Shield, Globe, ShieldCheck, Link as LinkIcon, Network, Zap, ChevronRight, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ModeToggle } from '@/components/ModeToggle';
import { setDPPMode, isBlockchainMode } from '@/lib/dppMode';
import { CTAButton } from '@/components/CTAButton';

/**
 * Home Page - Marketing Page
 * Comparison table, pros/cons, and what it does explained simply
 */

export default function HomePage() {
  const router = useRouter();
  // Use state to avoid hydration mismatch - start with false, update after mount
  const [isBlockchain, setIsBlockchain] = useState(false);

  useEffect(() => {
    // Only check localStorage after component mounts (client-side)
    setIsBlockchain(isBlockchainMode());
  }, []);

  const handleDemoMode = () => {
    setDPPMode('demo');
    router.push('/');
  };

  const handleBlockchainMode = () => {
    setDPPMode('blockchain');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-dpp-bg-primary w-full">
      {/* Desktop-optimized marketing page container - 800px max width */}
      <div className="min-h-screen bg-dpp-bg-primary w-full max-w-md md:max-w-[800px] mx-auto shadow-2xl overflow-x-hidden">
        {/* Header */}
        <header className="bg-gradient-to-b from-dpp-bg-card to-dpp-bg-primary border-b border-dpp-border-default mb-8 md:mb-12 w-full">
          <div className="w-full px-4 md:px-8 py-6 md:py-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-3xl">👛</span>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-dpp-text-primary leading-tight">DPP</span>
                  <span className="text-xs text-dpp-text-primary leading-tight">Digital Product Passport</span>
                </div>
              </div>
              <ModeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full px-4 md:px-8 py-8 md:py-12 overflow-x-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-green-500/10 border border-blue-500/20 rounded-xl p-8 md:p-12 mb-8 md:mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-dpp-text-primary mb-4 md:mb-6">
              Digital Product Passport
            </h1>
            <p className="text-base md:text-lg text-dpp-text-secondary leading-relaxed mb-6 md:mb-8 max-w-md md:max-w-[700px] mx-auto">
              Verify your product&apos;s entire supply chain in <strong className="text-green-400">2 seconds</strong> with blockchain-powered credentials. Every product gets a unique identity (DID) that follows it from farm → factory → consumer. Each step creates cryptographically signed certificates that can&apos;t be faked.
            </p>
            
            {/* How It Works */}
            <div className="bg-dpp-card-bg-tertiary/50 border border-dpp-card-border-primary rounded-lg p-4 md:p-6 mb-6 md:mb-8 text-left max-w-md md:max-w-[700px] mx-auto">
              <h3 className="text-sm md:text-base font-semibold text-dpp-text-primary mb-3 md:mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                How It Works
              </h3>
              <div className="space-y-2 md:space-y-3 text-xs md:text-sm text-dpp-text-secondary">
                <p>1. <strong className="text-dpp-text-primary">Farmer</strong> issues origin certificate with blockchain identity</p>
                <p>2. <strong className="text-dpp-text-primary">Factory</strong> verifies origin and adds production data</p>
                <p>3. <strong className="text-dpp-text-primary">Consumer</strong> scans QR code → sees verified chain in 2 seconds</p>
              </div>
            </div>

            {/* Mode Selection - Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-4 md:mb-6">
              {/* Demo Mode Card */}
              <div className="bg-dpp-card-bg-secondary border border-dpp-card-border-primary rounded-lg p-6 md:p-8">
                <div className="flex items-center justify-center mb-6">
                  <CTAButton
                    icon="⚡"
                    label="Try Demo Mode"
                    onClick={handleDemoMode}
                    variant="secondary"
                    size="md"
                    active={!isBlockchain}
                    className="border-2 border-white"
                  />
                </div>
                <div className="space-y-3 text-left">
                  <h3 className="text-base md:text-lg font-semibold text-dpp-text-primary">
                    Demo Mode
                  </h3>
                  <p className="text-sm md:text-base text-dpp-text-secondary leading-relaxed">
                    Try it instantly with mock data—no setup needed. Perfect for exploring the supply chain journey without wallet configuration.
                  </p>
                  <ul className="text-xs md:text-sm text-dpp-text-tertiary space-y-1.5 list-disc list-inside">
                    <li>No wallet connection required</li>
                    <li>Instant access to all features</li>
                    <li>Mock blockchain data</li>
                  </ul>
                </div>
              </div>
              
              {/* Blockchain Mode Card */}
              <div className="bg-dpp-card-bg-secondary border border-dpp-card-border-primary rounded-lg p-6 md:p-8">
                <div className="flex items-center justify-center mb-6">
                  <CTAButton
                    icon="🌐"
                    label="Start Blockchain Mode"
                    onClick={handleBlockchainMode}
                    variant="primary"
                    size="md"
                    active={isBlockchain}
                  />
                </div>
                <div className="space-y-3 text-left">
                  <h3 className="text-base md:text-lg font-semibold text-dpp-text-primary">
                    Blockchain Mode
                  </h3>
                  <p className="text-sm md:text-base text-dpp-text-secondary leading-relaxed">
                    Real IOTA blockchain transactions with wallet connection. Experience actual DID publishing and credential verification on the testnet.
                  </p>
                  <ul className="text-xs md:text-sm text-dpp-text-tertiary space-y-1.5 list-disc list-inside">
                    <li>Connect IOTA wallet</li>
                    <li>Real blockchain transactions</li>
                    <li>On-chain DID resolution</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* What It Does - Simple Explanation */}
          <div className="card card-secondary p-6 md:p-8 mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-dpp-text-primary mb-4 md:mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
              What It Does
            </h2>
            <p className="text-sm md:text-base text-dpp-text-secondary leading-relaxed mb-6 md:mb-8">
              Every product gets a unique blockchain identity (DID). As it moves through your supply chain—from farm to factory to consumer—each step creates a cryptographically signed certificate that can&apos;t be faked.
            </p>
            
            {/* Horizontal Flow with Arrows */}
            <div className="w-full flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-4">
              {/* Step 1: Farmer */}
              <div className="card card-tertiary border-green-500/30 p-4 md:p-6 flex-1 w-full text-center hover:border-green-500/50 transition-all">
                <div className="flex justify-center mb-3 md:mb-4">
                  <Sprout className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
                </div>
                <p className="text-sm md:text-base font-semibold text-dpp-text-primary mb-2 md:mb-3">Farmer Issues Certificate</p>
                <p className="text-xs md:text-sm text-dpp-text-tertiary leading-relaxed">Origin, harvest date, certifications—all verified on blockchain</p>
              </div>
              
              {/* Arrow 1 */}
              <div className="hidden md:flex items-center justify-center text-blue-400 flex-shrink-0 px-2">
                <ChevronRight className="w-6 h-6" />
              </div>
              <div className="md:hidden flex items-center justify-center text-blue-400 py-2">
                <ChevronRight className="w-6 h-6 rotate-90" />
              </div>
              
              {/* Step 2: Factory */}
              <div className="card card-tertiary border-blue-500/30 p-4 md:p-6 flex-1 w-full text-center hover:border-blue-500/50 transition-all">
                <div className="flex justify-center mb-3 md:mb-4">
                  <Factory className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
                </div>
                <p className="text-sm md:text-base font-semibold text-dpp-text-primary mb-2 md:mb-3">Factory Verifies & Produces</p>
                <p className="text-xs md:text-sm text-dpp-text-tertiary leading-relaxed">Checks origin certificate, adds production data, chains credentials</p>
              </div>
              
              {/* Arrow 2 */}
              <div className="hidden md:flex items-center justify-center text-blue-400 flex-shrink-0 px-2">
                <ChevronRight className="w-6 h-6" />
              </div>
              <div className="md:hidden flex items-center justify-center text-blue-400 py-2">
                <ChevronRight className="w-6 h-6 rotate-90" />
              </div>
              
              {/* Step 3: Consumer */}
              <div className="card card-tertiary border-purple-500/30 p-4 md:p-6 flex-1 w-full text-center hover:border-purple-500/50 transition-all">
                <div className="flex justify-center mb-3 md:mb-4">
                  <Shield className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                </div>
                <p className="text-sm md:text-base font-semibold text-dpp-text-primary mb-2 md:mb-3">Consumer Scans QR Code</p>
                <p className="text-xs md:text-sm text-dpp-text-tertiary leading-relaxed">2 seconds later—entire supply chain verified with cryptographic proof</p>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="card card-secondary p-6 md:p-8 mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-dpp-text-primary mb-4 md:mb-6 text-center">
              Traditional vs Blockchain Identity
            </h2>
            
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Header Row */}
                <div className="grid grid-cols-3 gap-px bg-dpp-card-border-primary rounded-t-lg overflow-hidden">
                  <div className="bg-dpp-card-bg-tertiary p-3"></div>
                  <div className="bg-dpp-card-bg-tertiary p-3">
                    <p className="text-xs font-medium text-dpp-text-primary text-center">Traditional Method</p>
                  </div>
                  <div className="bg-blue-500/10 p-3 border border-blue-500/20">
                    <p className="text-xs font-semibold text-blue-400 text-center">With DIDs</p>
                  </div>
                </div>
                
                {/* Data Rows */}
                <div className="grid grid-cols-3 gap-px bg-dpp-card-border-primary">
                  <div className="bg-dpp-card-bg-tertiary p-3">
                    <p className="text-xs font-medium text-dpp-text-secondary">Speed</p>
                  </div>
                  <div className="bg-dpp-card-bg-tertiary p-3">
                    <p className="text-xs text-dpp-text-primary">3-5 business days</p>
                  </div>
                  <div className="bg-green-500/5 p-3 border border-green-500/10">
                    <p className="text-xs font-medium text-green-400">2 seconds ⚡</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-px bg-dpp-card-border-primary">
                  <div className="bg-dpp-card-bg-tertiary p-3">
                    <p className="text-xs font-medium text-dpp-text-secondary">Cost</p>
                  </div>
                  <div className="bg-dpp-card-bg-tertiary p-3">
                    <p className="text-xs text-dpp-text-primary">Phone calls, emails, labor</p>
                  </div>
                  <div className="bg-green-500/5 p-3 border border-green-500/10">
                    <p className="text-xs font-medium text-green-400">$0.001 per verification</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-px bg-dpp-card-border-primary">
                  <div className="bg-dpp-card-bg-tertiary p-3">
                    <p className="text-xs font-medium text-dpp-text-secondary">Trust Model</p>
                  </div>
                  <div className="bg-dpp-card-bg-tertiary p-3">
                    <p className="text-xs text-dpp-text-primary">Rely on reputation</p>
                  </div>
                  <div className="bg-green-500/5 p-3 border border-green-500/10">
                    <p className="text-xs font-medium text-green-400">Cryptographically verifiable ✅</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-px bg-dpp-card-border-primary">
                  <div className="bg-dpp-card-bg-tertiary p-3">
                    <p className="text-xs font-medium text-dpp-text-secondary">Forgery Risk</p>
                  </div>
                  <div className="bg-dpp-card-bg-tertiary p-3">
                    <p className="text-xs text-dpp-text-primary">Paper certificates can be faked</p>
                  </div>
                  <div className="bg-green-500/5 p-3 border border-green-500/10">
                    <p className="text-xs font-medium text-green-400">Mathematically impossible ✅</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-px bg-dpp-card-border-primary rounded-b-lg overflow-hidden">
                  <div className="bg-dpp-card-bg-tertiary p-3">
                    <p className="text-xs font-medium text-dpp-text-secondary">Availability</p>
                  </div>
                  <div className="bg-dpp-card-bg-tertiary p-3">
                    <p className="text-xs text-dpp-text-primary">9-5 business hours</p>
                  </div>
                  <div className="bg-green-500/5 p-3 border border-green-500/10">
                    <p className="text-xs font-medium text-green-400">24/7 global access ✅</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* On-Chain Verification Note */}
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-400 leading-relaxed">
                💡 <strong>Full Cryptographic Verification:</strong> For complete on-chain DID resolution and verification, DIDs must be published to the blockchain. This enables independent verification without trusting any server.
              </p>
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            {/* Pros */}
            <div className="card card-secondary p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-semibold text-dpp-text-primary mb-4 md:mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                Advantages
              </h2>
              <ul className="space-y-3 md:space-y-4 text-sm md:text-base text-dpp-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span><strong className="text-dpp-text-primary">Instant Verification:</strong> 2 seconds vs 3-5 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span><strong className="text-dpp-text-primary">Ultra-Low Cost:</strong> $0.001 per verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span><strong className="text-dpp-text-primary">Tamper-Proof:</strong> Mathematically impossible to fake</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span><strong className="text-dpp-text-primary">Always Available:</strong> 24/7 global access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span><strong className="text-dpp-text-primary">EU Compliant:</strong> UN/CEFACT UNTP standard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span><strong className="text-dpp-text-primary">No Middleman:</strong> Direct verification, no trusted parties needed</span>
                </li>
              </ul>
            </div>

            {/* Cons */}
            <div className="card card-secondary p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-semibold text-dpp-text-primary mb-4 md:mb-6 flex items-center gap-2">
                <XCircle className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                Considerations
              </h2>
              <ul className="space-y-3 md:space-y-4 text-sm md:text-base text-dpp-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">⚠</span>
                  <span><strong className="text-dpp-text-primary">Initial Setup:</strong> Requires blockchain infrastructure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">⚠</span>
                  <span><strong className="text-dpp-text-primary">Data Entry:</strong> Suppliers need to adopt new systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">⚠</span>
                  <span><strong className="text-dpp-text-primary">Internet Required:</strong> Verification needs network connection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">⚠</span>
                  <span><strong className="text-dpp-text-primary">Learning Curve:</strong> Team training on DIDs/VCs</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Why This Matters */}
          <details className="card card-primary overflow-hidden group mb-6 md:mb-8">
            <summary className="p-5 md:p-6 cursor-pointer list-none hover:bg-dpp-bg-tertiary transition-colors flex items-center gap-3">
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-purple-400 transition-transform group-open:rotate-90 flex-shrink-0" />
              <h4 className="text-base md:text-lg font-medium text-purple-400">
                💡 Why This Matters
              </h4>
            </summary>
            <div className="px-5 md:px-6 pb-5 md:pb-6 pt-2 space-y-4 md:space-y-5">
              <div>
                <h4 className="text-sm md:text-base font-medium text-dpp-text-primary mb-2 md:mb-3">For Consumers</h4>
                <p className="text-sm md:text-base text-dpp-text-secondary leading-relaxed">
                  Scan any product QR code and instantly see the verified supply chain. 
                  No waiting, no phone calls, just instant cryptographic verification.
                </p>
              </div>
              <div>
                <h4 className="text-sm md:text-base font-medium text-blue-400 mb-2 md:mb-3">For Your DPP Business</h4>
                <p className="text-sm md:text-base text-dpp-text-secondary leading-relaxed">
                  This proves your solution works. Show this to chocolate brands, coffee roasters, 
                  fashion companies - anyone with supply chain transparency needs.
                </p>
              </div>
            </div>
          </details>

          {/* You Buy the Chocolate */}
          <details className="card card-purple overflow-hidden group mb-6 md:mb-8">
            <summary className="p-5 md:p-6 cursor-pointer list-none hover:bg-purple-500/10 transition-colors flex items-center gap-3">
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-purple-400 transition-transform group-open:rotate-90 flex-shrink-0" />
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl md:text-3xl">🍫</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-base md:text-lg font-semibold text-dpp-text-primary">
                    You Buy the Chocolate
                  </h3>
                </div>
              </div>
            </summary>
            <div className="px-5 md:px-6 pb-5 md:pb-6 pt-2 space-y-4 md:space-y-5">
              <p className="text-sm md:text-base text-dpp-text-secondary leading-relaxed">
                You&apos;re standing in a supermarket in Amsterdam. The chocolate bar 
                claims to be &quot;Single-origin Ecuador, Organic, Fair Trade.&quot; 
                But is it true?
              </p>
              <div className="card card-nested p-4 space-y-3">
                <div>
                  <p className="text-xs font-medium text-dpp-text-primary mb-1">❌ Traditional Method:</p>
                  <p className="text-xs text-dpp-text-tertiary leading-relaxed">
                    Rely on brand reputation. Call suppliers to verify (takes days).
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-green-400 mb-1">✅ With DIDs:</p>
                  <p className="text-xs text-dpp-text-secondary leading-relaxed">
                    Scan QR code. Verify entire supply chain in 2 seconds with cryptographic proof.
                  </p>
                </div>
              </div>
            </div>
          </details>

          {/* Features */}
          <div className="card card-secondary p-6 mb-6">
            <h2 className="text-lg font-semibold text-dpp-text-primary mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              Key Features
            </h2>
            
            <ul className="space-y-3 text-xs text-dpp-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span><strong>Decentralized Identifiers (DIDs):</strong> Unique blockchain addresses for every stakeholder and product</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span><strong>Verifiable Credentials (VCs):</strong> Cryptographically signed certificates that can't be faked</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span><strong>UNTP Compliance:</strong> UN/CEFACT Digital Product Passport schema for standardized data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span><strong>Credential Chaining:</strong> Each credential references the previous, creating an immutable chain</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span><strong>Blockchain Publishing:</strong> Real transactions on IOTA testnet with explorer links</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span><strong>Multi-Industry Support:</strong> Food & Beverage, Battery, Fashion, Electronics</span>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="card card-secondary p-6 mb-6">
            <h2 className="text-lg font-semibold text-dpp-text-primary mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-blue-400" />
              Built With
            </h2>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="card card-tertiary p-3">
                <p className="font-semibold text-dpp-text-primary mb-1">Next.js 15</p>
                <p className="text-dpp-text-tertiary">React framework</p>
              </div>
              <div className="card card-tertiary p-3">
                <p className="font-semibold text-dpp-text-primary mb-1">IOTA Identity</p>
                <p className="text-dpp-text-tertiary">DID & VCs</p>
              </div>
              <div className="card card-tertiary p-3">
                <p className="font-semibold text-dpp-text-primary mb-1">dApp Kit</p>
                <p className="text-dpp-text-tertiary">Wallet connection</p>
              </div>
              <div className="card card-tertiary p-3">
                <p className="font-semibold text-dpp-text-primary mb-1">TypeScript</p>
                <p className="text-dpp-text-tertiary">Type safety</p>
              </div>
            </div>
          </div>

          {/* Documentation Section - Foldable */}
          <details className="card card-secondary mb-6 md:mb-8 overflow-hidden group">
            <summary className="p-5 md:p-6 cursor-pointer list-none hover:bg-dpp-bg-tertiary transition-colors flex items-center gap-3">
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-blue-400 transition-transform group-open:rotate-90 flex-shrink-0" />
              <h4 className="text-base md:text-lg font-medium text-blue-400">
                📚 Technical Documentation
              </h4>
            </summary>
            <div className="px-5 md:px-6 pb-5 md:pb-6 pt-2 space-y-4 md:space-y-5">
              <div>
                <h4 className="text-sm md:text-base font-medium text-dpp-text-primary mb-2 md:mb-3">Architecture Overview</h4>
                <p className="text-sm md:text-base text-dpp-text-secondary leading-relaxed mb-3">
                  This application demonstrates a complete Digital Product Passport (DPP) system using IOTA Identity SDK for decentralized identifiers (DIDs) and verifiable credentials (VCs). The system follows the UN/CEFACT UNTP standard for standardized data exchange.
                </p>
                <ul className="text-sm md:text-base text-dpp-text-secondary space-y-2 list-disc list-inside">
                  <li>Decentralized Identifiers (DIDs) for unique stakeholder and product identities</li>
                  <li>Verifiable Credentials (VCs) with cryptographic signatures</li>
                  <li>Credential chaining creating immutable supply chain history</li>
                  <li>Blockchain publishing on IOTA testnet with explorer integration</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm md:text-base font-medium text-dpp-text-primary mb-2 md:mb-3">Key Technologies</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm md:text-base text-dpp-text-secondary">
                  <div>
                    <strong className="text-dpp-text-primary">Frontend:</strong> Next.js 15, React, TypeScript
                  </div>
                  <div>
                    <strong className="text-dpp-text-primary">Blockchain:</strong> IOTA Identity SDK, IOTA dApp Kit
                  </div>
                  <div>
                    <strong className="text-dpp-text-primary">Standards:</strong> W3C DIDs, W3C VCs, UN/CEFACT UNTP
                  </div>
                  <div>
                    <strong className="text-dpp-text-primary">Network:</strong> IOTA Testnet
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm md:text-base font-medium text-dpp-text-primary mb-2 md:mb-3">Implementation Notes</h4>
                <p className="text-sm md:text-base text-dpp-text-secondary leading-relaxed">
                  The application supports multiple industries (Food & Beverage, Battery, Fashion, Electronics) with industry-specific data schemas. All credentials are cryptographically signed and can be verified independently. In blockchain mode, transactions are published to the IOTA testnet with explorer links for transparency.
                </p>
              </div>
            </div>
          </details>

          {/* Start Journey Button - Big CTA */}
          <div className="flex justify-center mb-6 md:mb-8">
            <CTAButton
              icon="→"
              label="Start Journey"
              onClick={() => router.push('/')}
              variant="primary"
              size="lg"
              active={true}
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-dpp-border-default mt-8 w-full">
          <div className="w-full px-4 py-6">
            <div className="flex items-center justify-center gap-3 text-xs text-dpp-text-tertiary">
              <span className="flex items-center gap-1.5">
                <span className="text-base">⚡</span>
                <span>Built with</span>
              </span>
              <span className="flex items-center gap-1.5 hover:text-dpp-text-primary transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 394 80" fill="currentColor">
                  <path d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0zM81 0L53 24v56h14V28l11-11 11 11v52h14V24L81 0zm151 0v12.7h-35v53.9h-13.6V12.7h-35V0h83.6zm46.3 0L237 24v56h13.6V28L258 19l7.6 9v52h13.6V24L278.3 0zm73.8 0v79.3h-13.7V0h13.7z"/>
                </svg>
                <span>Next.js</span>
              </span>
              <span className="text-dpp-text-tertiary opacity-50">•</span>
              <span className="flex items-center gap-1.5 hover:text-dpp-text-primary transition-colors">
                <span className="text-base">🌐</span>
                <span>IOTA</span>
              </span>
              <span className="text-dpp-text-tertiary opacity-50">•</span>
              <span className="flex items-center gap-1.5 hover:text-dpp-text-primary transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="2" opacity="0.3"/>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  <circle cx="12" cy="12" r="1.5"/>
                  <path d="M7 12c0-2.76 2.24-5 5-5s5 2.24 5 5M17 12c0 2.76-2.24 5-5 5s-5-2.24-5-5" opacity="0.5"/>
                </svg>
                <span>React</span>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
