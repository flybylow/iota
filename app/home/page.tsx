'use client';

import React, { useState, useEffect } from 'react';
import { Sprout, Factory, Shield, ShieldCheck, Link as LinkIcon, Zap, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ModeToggle } from '@/components/ModeToggle';
import { setDPPMode, isBlockchainMode } from '@/lib/dppMode';
import { CTAButton } from '@/components/CTAButton';

/**
 * Home Page - Marketing Page
 * Comparison table, pros/cons, and what it does explained simply
 */

const heroCards = [
  { 
    icon: '🌱', 
    label: 'Farm', 
    title: 'ORIGIN CERTIFICATE',
    subtitle: 'Maria\'s Organic Farm',
    action: 'is issuing a certificate for 400kg of Organic cacao she harvested',
    details: 'She proofs on-chain that she as a farmer registered the harvest and quality of origin product.',
    gradient: 'from-green-600 via-emerald-700 to-teal-800',
    gradientOverlay: 'from-green-400/20 via-emerald-500/20 to-teal-600/20',
    accent: 'green'
  },
  { 
    icon: '🏭', 
    label: 'Factory', 
    title: 'PRODUCTION CERTIFICATE',
    subtitle: 'Chocolate Dreams Factory',
    action: 'verifies the origin certificate and certifies production of 50,000 bars',
    details: 'They proof on-chain that they verified Maria\'s certificate and produced 50,000 quality chocolate bars.',
    gradient: 'from-blue-600 via-indigo-700 to-purple-800',
    gradientOverlay: 'from-blue-400/20 via-indigo-500/20 to-purple-600/20',
    accent: 'blue'
  },
  { 
    icon: '✅', 
    label: 'Consumer', 
    title: 'VERIFICATION COMPLETE',
    subtitle: 'Blockchain Verified',
    action: 'scans QR code and verifies the complete supply chain in 2 seconds',
    details: 'Consumers can instantly verify that the chocolate comes from Maria\'s certified harvest and was produced by the factory.',
    gradient: 'from-purple-600 via-pink-700 to-rose-800',
    gradientOverlay: 'from-purple-400/20 via-pink-500/20 to-rose-600/20',
    accent: 'purple'
  }
];
function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % heroCards.length);
  };
  
  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + heroCards.length) % heroCards.length);
  };
  
  const currentCard = heroCards[currentIndex];
  
  return (
    <>
      <div className="relative w-full max-w-2xl mx-auto mt-6 mb-6 flex items-center justify-center gap-4">
        {/* Previous Button */}
        <button
          onClick={prevCard}
          className="bg-white/90 hover:bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 flex-shrink-0 z-10"
          aria-label="Previous card"
        >
          <ChevronRight 
            size={24} 
            className="text-gray-800 rotate-180" 
          />
        </button>
        
        <div className="group perspective-1000 flex justify-center">
          {/* Credit Card Style Container */}
          <div className={`
            relative bg-gradient-to-br ${currentCard.gradient}
            rounded-2xl p-6
            w-full max-w-[340px] aspect-[1.586/1]
            shadow-[0_8px_30px_rgb(0,0,0,0.12)]
            transform transition-all duration-700
            border border-white/20
            flex flex-col justify-between
            overflow-hidden
          `}>
          {/* Animated Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${currentCard.gradientOverlay} animate-pulse`} />
          
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 rounded-2xl" />
          
          {/* Card Pattern Background */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl" />
          </div>
          
          {/* Decorative Circles */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-8 left-8 w-24 h-24 border border-white/30 rounded-full" />
            <div className="absolute bottom-12 right-12 w-16 h-16 border border-white/30 rounded-full" />
          </div>
          
          {/* Card Content */}
          <div className="relative z-10 flex flex-col justify-between h-full">
            {/* Top Section */}
            <div className="space-y-4">
              {/* Issuer Badge */}
              <div className="flex justify-between items-start">
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                  <p className="text-white text-[10px] font-bold tracking-wider uppercase">
                    DPP
                  </p>
                </div>
                <div className="text-3xl">{currentCard.icon}</div>
              </div>
              
              {/* Certificate Title */}
              <div>
                <p className="text-white/70 text-[10px] font-semibold tracking-[0.2em] uppercase mb-1">
                  {currentCard.title}
                </p>
                <p className="text-white text-xs font-medium mb-2">
                  {currentCard.subtitle}
                </p>
                <p className="text-white text-[11px] leading-relaxed opacity-90">
                  {currentCard.action}
                </p>
              </div>
              
              {/* Card Number Style */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-white/20">
                <div className="flex gap-1">
                  {[1,2,3,4].map((num) => (
                    <div key={num} className="w-2 h-2 rounded-full bg-white/70" />
                  ))}
                </div>
                <div className="flex gap-1">
                  {[1,2,3,4].map((num) => (
                    <div key={num} className="w-2 h-2 rounded-full bg-white/70" />
                  ))}
                </div>
                <div className="flex gap-1">
                  {[1,2,3,4].map((num) => (
                    <div key={num} className="w-2 h-2 rounded-full bg-white/70" />
                  ))}
                </div>
                <div className="flex gap-1">
                  {[1,2,3,4].map((num) => (
                    <div key={num} className="w-2 h-2 rounded-full bg-white/70" />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Bottom Section */}
            <div className="flex flex-col gap-2">
              <div className="space-y-1">
                <p className="text-white/80 text-[9px] font-bold uppercase tracking-wider">
                  What This Means:
                </p>
                <p className="text-white text-[10px] leading-relaxed">
                  {currentCard.details}
                </p>
              </div>
              
              {/* Chip Effect */}
              <div className="flex justify-end">
                <div className="w-9 h-7 bg-gradient-to-br from-white/40 to-white/10 rounded-md border border-white/30 shadow-lg backdrop-blur-sm flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-0.5 p-1">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-white/60 rounded-sm" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Next Button */}
      <button
        onClick={nextCard}
        className="bg-white/90 hover:bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 flex-shrink-0 z-10"
        aria-label="Next card"
      >
        <ChevronRight 
          size={24} 
          className="text-gray-800" 
        />
      </button>
      </div>
      
      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {heroCards.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all rounded-full ${
              currentIndex === idx
                ? 'w-12 bg-blue-500 h-2'
                : 'w-2 bg-gray-300 h-2 hover:bg-blue-500/50'
            }`}
            aria-label={`Go to card ${idx + 1}`}
          />
        ))}
      </div>
    </>
  );
}

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
          <div className="border border-[#3a3a3a] rounded-lg p-8 md:p-12 mb-8 md:mb-12 relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
              style={{ 
                backgroundImage: 'url(/cea77f55-cab8-48f0-82fa-aee8cfbbbeef.jpeg)',
                opacity: 0.4
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-purple-900/50 to-green-900/60 z-[1]"></div>
            <div className="relative z-10 text-center">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">
                Digital Product Passport
              </h1>
              <p className="text-base md:text-xl text-zinc-200 leading-relaxed mb-6 md:mb-8 max-w-2xl mx-auto">
                Verify your product&apos;s entire supply chain in <strong className="text-green-400">2 seconds</strong> with blockchain-powered credentials.
              </p>
              <HeroCarousel />
            </div>
          </div>

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
                💡 What happens here?
              </h4>
            </summary>
            <div className="px-5 md:px-6 pb-5 md:pb-6 pt-2 space-y-4 md:space-y-5">
              <div>
                <h4 className="text-sm md:text-base font-medium text-dpp-text-primary mb-2 md:mb-3">For Consumers</h4>
                <p className="text-sm md:text-base text-dpp-text-secondary leading-relaxed">
                  You can instantly verify product authenticity with your phone. No more wondering if claims 
                  about organic, fair trade, or origin are true. Get complete transparency in seconds, not days.
                </p>
              </div>
              <div>
                <h4 className="text-sm md:text-base font-medium text-blue-400 mb-2 md:mb-3">For Your Business</h4>
                <p className="text-sm md:text-base text-dpp-text-secondary leading-relaxed">
                  You can build trust with customers by showing verified supply chain data. Meet EU Digital 
                  Product Passport requirements, prevent fraud, and differentiate your products with 
                  blockchain-backed transparency.
                </p>
              </div>
            </div>
          </details>

          {/* Technical & Legal Info */}
          <details className="card card-purple overflow-hidden group mb-6 md:mb-8">
            <summary className="p-5 md:p-6 cursor-pointer list-none hover:bg-purple-500/10 transition-colors flex items-center gap-3">
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-purple-400 transition-transform group-open:rotate-90 flex-shrink-0" />
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl md:text-3xl">🍫</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-base md:text-lg font-semibold text-dpp-text-primary">
                    Technical & Legal Info
                  </h3>
                </div>
              </div>
            </summary>
            <div className="px-5 md:px-6 pb-5 md:pb-6 pt-2 space-y-4 md:space-y-5">
              <div className="card card-nested p-4 md:p-5 space-y-3 md:space-y-4">
                <div>
                  <p className="text-xs md:text-sm font-medium text-purple-400 mb-1 md:mb-2">🔧 Technical Standards:</p>
                  <p className="text-xs md:text-sm text-dpp-text-secondary leading-relaxed">
                    <strong>W3C Verifiable Credentials:</strong> Industry-standard format for digital certificates.
                    <br />
                    <strong>Ed25519 Signatures:</strong> Cryptographic proof of authenticity. 
                    <br />
                    <strong>IOTA Identity SDK:</strong> Decentralized identity on IOTA network.
                  </p>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-blue-400 mb-1 md:mb-2">⚖️ Legal Compliance:</p>
                  <p className="text-xs md:text-sm text-dpp-text-secondary leading-relaxed">
                    <strong>EU Digital Product Passport:</strong> Complies with upcoming 2027 regulations for batteries, textiles, and electronics.
                    <br />
                    <strong>UN/CEFACT UNTP:</strong> Standardized data schema for global trade.
                    <br />
                    <strong>GDPR Compliant:</strong> Privacy-preserving identity without centralized data storage.
                  </p>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-green-400 mb-1 md:mb-2">🔐 Security & Immutability:</p>
                  <p className="text-xs md:text-sm text-dpp-text-secondary leading-relaxed">
                    Each certificate is cryptographically signed and stored on the <a 
                      href="https://docs.iota.org/developer/iota-identity/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 underline"
                    >IOTA Tangle</a>, creating an immutable chain that cannot be altered or falsified once recorded.
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
                <span><strong>Verifiable Credentials (VCs):</strong> Cryptographically signed certificates that can&apos;t be faked</span>
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
