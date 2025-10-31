'use client';

import React, { useState, useEffect } from 'react';
import { Sprout, Factory, Shield, ShieldCheck, Link as LinkIcon, Zap, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ModeToggle } from '@/components/ModeToggle';
import { setDPPMode, isBlockchainMode } from '@/lib/dppMode';
import { CTAButton } from '@/components/CTAButton';
import { Fold } from '@/components/Fold';
import { Footer } from '@/components/Footer';

/**
 * Home Page - Marketing Page
 * Comparison table, pros/cons, and what it does explained simply
 */

const heroCards = [
  { 
    icon: '🌱', 
    label: 'Farm', 
    title: 'ORIGIN CERTIFICATE',
    subtitle: '🌱 Maria\'s Organic Farm',
    action: 'is issuing a certificate, 400kg of Organic cacao she harvested',
    details: 'As a farmer, she proofs the harvest and quality of origin product on-chain.',
    gradient: 'from-green-600 via-emerald-700 to-teal-800',
    gradientOverlay: 'from-green-400/20 via-emerald-500/20 to-teal-600/20',
    accent: 'green'
  },
  { 
    icon: '🏭', 
    label: 'Factory', 
    title: 'PRODUCTION CERTIFICATE',
    subtitle: '🏭 Chocolate Dreams Factory',
    action: 'verifies the origin certificate and certifies production of 50,000 bars',
    details: 'They proof on-chain that they verified the origin certificate and produced 50,000 quality chocolate bars.',
    gradient: 'from-blue-600 via-indigo-700 to-purple-800',
    gradientOverlay: 'from-blue-400/20 via-indigo-500/20 to-purple-600/20',
    accent: 'blue'
  },
  { 
    icon: '✅', 
    label: 'Consumer', 
    title: 'VERIFICATION COMPLETE',
    subtitle: '✅ Blockchain Verified',
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
    <div className="relative w-full mt-6 mb-6">
      <div className="flex items-center justify-center gap-4 mb-6">
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
          {/* Credit Card Style Container using home-step-card visuals */}
          <div className={`
            relative home-step-card p-6
            w-[340px] aspect-[1.586/1]
            shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]
            transform transition-all duration-700
            flex flex-col justify-between
          `}
          style={{ overflow: 'hidden' }}>
          {/* Animated Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${currentCard.gradientOverlay} animate-pulse`} />
          
          {/* Shine Effect - More Pronounced */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/50 to-white/0 opacity-60" />
          
          {/* Card Pattern Background - Enhanced */}
          <div className="absolute inset-0 opacity-[0.05]">
            <div className="absolute top-0 right-0 w-52 h-52 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full blur-3xl" />
          </div>
          
          {/* Decorative Pattern - Geometric */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-6 left-6 w-32 h-32 border-2 border-white/40 rounded-full" />
            <div className="absolute bottom-8 right-8 w-20 h-20 border-2 border-white/40 rounded-full" />
            <div className="absolute top-1/2 left-8 w-24 h-24 border border-white/30 rounded-2xl rotate-45" />
          </div>
          
          {/* Subtle Mesh Overlay */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:12px_12px]" />
          
          {/* Card Content */}
          <div className="relative z-10 flex flex-col justify-between h-full">
            {/* Top Section */}
            <div className="space-y-4">
              {/* Issuer Badge removed per request */}
              
              {/* Certificate Title */}
              <div>
                <p className="text-white/70 text-[11px] font-semibold tracking-[0.2em] uppercase mb-1">
                  {currentCard.title} ({currentIndex + 1}/{heroCards.length})
                </p>
                <p className="text-white text-[13px] font-medium mb-2">
                  {currentCard.subtitle}
                </p>
                <p className="text-white text-[12px] leading-relaxed opacity-90">
                  {currentCard.action}
                </p>
              </div>
              
              {/* Card Number Style - Enhanced */}
              <div className="flex items-center gap-1 pt-3 border-t border-white/30">
                <div className="flex gap-1">
                  {[1,2,3,4].map((num) => (
                    <div key={num} className="w-2.5 h-2.5 rounded-full bg-white/80 shadow-md" />
                  ))}
                </div>
                <div className="flex gap-1">
                  {[1,2,3,4].map((num) => (
                    <div key={num} className="w-2.5 h-2.5 rounded-full bg-white/80 shadow-md" />
                  ))}
                </div>
                <div className="flex gap-1">
                  {[1,2,3,4].map((num) => (
                    <div key={num} className="w-2.5 h-2.5 rounded-full bg-white/80 shadow-md" />
                  ))}
                </div>
                <div className="flex gap-1">
                  {[1,2,3,4].map((num) => (
                    <div key={num} className="w-2.5 h-2.5 rounded-full bg-white/80 shadow-md" />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Bottom Section */}
            <div className="flex flex-col gap-2">
              <div className="space-y-1">
                <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider">
                  What This Means:
                </p>
                <p className="text-white text-[11px] leading-relaxed">
                  {currentCard.details}
                </p>
              </div>
              
              {/* Chip Effect - Enhanced */}
              <div className="flex justify-end">
                <div className="home-hero-chip w-12 h-8 bg-gradient-to-br from-white/50 via-white/20 to-white/5 rounded-lg border-2 border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.2)] backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
                  {/* Chip shine effect */}
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
                  <div className="grid grid-cols-2 gap-0.5 p-1.5 z-10">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-white/70 rounded-sm shadow-sm" />
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
      <div className="flex justify-center gap-3">
        {heroCards.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all rounded-full ${
              currentIndex === idx
                ? 'w-14 h-3 bg-blue-500 md:w-16 md:h-3'
                : 'w-3 h-3 bg-gray-300 hover:bg-blue-500/60 md:w-3 md:h-3'
            }`}
            aria-label={`Go to card ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

interface Keyword {
  label: string;
  info: string;
}

interface KeywordGridProps {
  keywords: Keyword[];
}

function KeywordGrid({ keywords }: KeywordGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-stretch">
      {keywords.map((kw, i) => (
        <div
          key={i}
          className="flex flex-col items-start gap-2 group bg-dpp-bg-secondary/60 rounded-xl p-4 md:p-5 transition-colors duration-200 hover:bg-dpp-bg-tertiary/80"
          tabIndex={0}
          aria-label={kw.label + ': ' + kw.info}
        >
          <span className="font-semibold text-dpp-text-primary flex items-center gap-2 text-base">
            <span className="text-green-400">✓</span> {kw.label}
          </span>
          <div className="w-full">
            <div className="mt-1 bg-black/40 text-white text-sm px-3 py-2 rounded-md leading-snug hidden group-hover:block transition-opacity duration-150" role="tooltip">
              {kw.info}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StepsCarousel() {
    const steps = ['/1.png','/2.png','/3.png','/4.png','/5.png','/6.png','/7.png','/8.png'];
    const [index, setIndex] = React.useState(0);
    const [imageError, setImageError] = React.useState<Record<number, boolean>>({});
    const [imageLoaded, setImageLoaded] = React.useState<Record<number, boolean>>({});
    const next = () => setIndex((p) => (p + 1) % steps.length);
    const prev = () => setIndex((p) => (p - 1 + steps.length) % steps.length);

    // Preload next and previous images
    React.useEffect(() => {
      const nextIndex = (index + 1) % steps.length;
      const prevIndex = (index - 1 + steps.length) % steps.length;
      
      [nextIndex, prevIndex].forEach((idx) => {
        if (!imageError[idx] && !imageLoaded[idx]) {
          const img = new Image();
          img.onload = () => setImageLoaded((prev) => ({ ...prev, [idx]: true }));
          img.onerror = () => setImageError((prev) => ({ ...prev, [idx]: true }));
          img.src = steps[idx];
        }
      });
    }, [index, steps, imageError, imageLoaded]);

    const handleImageLoad = () => {
      setImageLoaded((prev) => ({ ...prev, [index]: true }));
    };

    const handleImageError = () => {
      setImageError((prev) => ({ ...prev, [index]: true }));
    };

    const currentImageError = imageError[index];
    const currentImageLoaded = imageLoaded[index];

    return (
      <section className="relative w-full mt-6 mb-8">
        <div className="relative home-step-card w-[95%] md:w-[60%] mx-auto h-[460px] md:h-[640px] overflow-hidden">
          {currentImageError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="text-6xl mb-4">📸</div>
              <p className="text-lg text-white mb-2">Screenshot {index + 1} / {steps.length}</p>
              <p className="text-sm text-zinc-400">
                Image not found: {steps[index]}
              </p>
              <p className="text-xs text-zinc-500 mt-4">
                Please add {steps[index]} to the /public directory
              </p>
            </div>
          ) : (
            <>
              {!currentImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                  <div className="text-white text-lg">Loading...</div>
                </div>
              )}
              <img
                key={index}
                src={steps[index]}
                alt={`Step ${index + 1}`}
                className="absolute inset-0 w-full h-full object-contain object-left block"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </>
          )}
          <div className="absolute top-3 right-3 text-sm md:text-base px-3 py-1.5 rounded bg-black/80 text-white border border-white/30 shadow">
            Step {index + 1} / {steps.length}
          </div>

          <button onClick={prev} aria-label="Previous"
            className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-black rounded-full w-9 h-9 md:w-12 md:h-12 grid place-items-center shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <button onClick={next} aria-label="Next"
            className="absolute right-2 md:right-3 top-[calc(50%+40px)] -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-black rounded-full w-9 h-9 md:w-12 md:h-12 grid place-items-center shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex justify-center gap-3 mt-3">
          {steps.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`transition-all rounded-full ${
                i === index
                  ? 'w-12 h-3 bg-blue-500'
                  : 'w-3 h-3 bg-gray-300 hover:bg-blue-400'
              }`}
            />
          ))}
        </div>
      </section>
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
      <div className="min-h-screen bg-dpp-bg-primary w-full max-w-md md:max-w-[800px] mx-auto shadow-2xl">
        {/* Top Navigation - match main */}
        <div className="fixed top-0 left-0 right-0 w-screen bg-gradient-to-b from-[#1c1c1c] to-[#0f0f0f] border-b border-[#2a2a2e] z-[100] overflow-x-hidden" style={{ isolation: 'isolate' }}>
          <div className="flex items-center justify-between px-4 py-4 w-full gap-4 min-w-0 relative z-[100]">
            {/* Logo - Left */}
            <Link href="/home">
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <span className="text-2xl">👛</span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white leading-tight">DPP</span>
                  <span className="text-[9px] text-white leading-tight">Digital Product Passport</span>
                </div>
              </div>
            </Link>

            {/* Mode Toggle - Right */}
            <ModeToggle />
          </div>
        </div>

        {/* Main Content */}
        <main className="w-full px-4 md:px-8 py-8 md:py-12">
          {/* Spacer for fixed topnav */}
          <div className="h-[73px]" />
          {/* Hero Section */}
          <div className="rounded-lg p-8 md:p-12 mb-8 md:mb-12 relative overflow-hidden shadow-sm shadow-black/20">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
              style={{ 
                backgroundImage: 'url(/cea77f55-cab8-48f0-82fa-aee8cfbbbeef.jpeg)',
                opacity: 0.4
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-purple-900/50 to-green-900/60 z-[1]"></div>
            <div className="relative z-10 text-center">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-5">
                Transparent Supply Chains
              </h1>
              <p className="text-lg md:text-2xl font-semibold text-zinc-100 leading-relaxed mb-4 md:mb-6 max-w-2xl mx-auto">
                with IOTA blockchain-powered credentials.
              </p>
              {/* badge hidden per request */}
              <HeroCarousel />
            </div>
          </div>

          {/* Content Container - 800px max width */}
          <div className="max-w-[800px] mx-auto">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-green-500/10 rounded-xl p-8 md:p-12 mb-8 md:mb-12 text-center shadow-sm shadow-black/10 space-y-8 md:space-y-10">
            
            {/* How It Works */}
            <div className="mb-6 md:mb-8">
              <h3 className="text-base md:text-lg font-semibold text-dpp-text-primary mb-4 md:mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                How It Works
              </h3>
              
              {/* Horizontal Flow with Arrows */}
              <div className="home-how-it-works">
                {/* Step 1: Farmer */}
                <div className="home-step-card">
                  <div className="flex justify-center mb-3">
                    <Sprout className="w-8 h-8 text-green-400" />
                  </div>
                  <p className="text-base md:text-lg font-semibold text-dpp-text-primary mb-2">1. Farmer</p>
                  <p className="text-sm md:text-base text-dpp-text-tertiary leading-relaxed">Issues origin certificate on-chain for product and harvest</p>
                </div>
                
                {/* Arrow 1 */}
                <div className="hidden md:flex items-center justify-center text-blue-400 flex-shrink-0 px-1">
                  <ChevronRight className="w-8 h-8" />
                </div>
                <div className="md:hidden flex items-center justify-center text-blue-400 py-2">
                  <ChevronRight className="w-8 h-8" />
                </div>
                
                {/* Step 2: Factory */}
                <div className="home-step-card">
                  <div className="flex justify-center mb-3">
                    <Factory className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-base md:text-lg font-semibold text-dpp-text-primary mb-2">2. Factory</p>
                  <p className="text-sm md:text-base text-dpp-text-tertiary leading-relaxed">Verifies origin, adds production data and certifies output</p>
                </div>
                
                {/* Arrow 2 */}
                <div className="hidden md:flex items-center justify-center text-blue-400 flex-shrink-0 px-1">
                  <ChevronRight className="w-8 h-8" />
                </div>
                <div className="md:hidden flex items-center justify-center text-blue-400 py-2">
                  <ChevronRight className="w-8 h-8" />
                </div>
                
                {/* Step 3: Consumer */}
                <div className="home-step-card">
                  <div className="flex justify-center mb-3">
                    <Shield className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-base md:text-lg font-semibold text-dpp-text-primary mb-2">3. Consumer</p>
                  <p className="text-sm md:text-base text-dpp-text-tertiary leading-relaxed">Scans QR → sees supply chain instantly</p>
                </div>
              </div>
            </div>

            {/* Mode Selection - Visual Card */}
            <div className="mb-6 md:mb-8">
              <div className="home-step-card">
                <h2 className="text-2xl md:text-3xl font-bold text-dpp-text-primary text-center mt-0 mb-0">DEMO</h2>
                <div className="grid grid-cols-2 gap-6 md:gap-10 items-start">
                  <div className="flex justify-center">
                    <button
                      onClick={handleDemoMode}
                      aria-label="Demo Mode"
                      style={{
                        transition: '0.3s',
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 50%, #06b6d4 100%)',
                        boxShadow: '0 0 20px rgba(56,189,248,0.5), 0 6px 20px rgba(59,130,246,0.35)'
                      }}
                      className="font-bold rounded-full flex items-center gap-3 justify-start disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-500 hover:from-sky-300 hover:via-blue-400 hover:to-cyan-400 text-white border-0 shadow-[0_0_20px_rgba(56,189,248,0.5)] hover:shadow-[0_0_40px_rgba(56,189,248,0.8)] transition-all"
                    >
                      <span className="text-xl">⚡</span>
                      <span className="text-base md:text-lg">Demo Mode</span>
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={handleBlockchainMode}
                      aria-label="Blockchain Mode"
                      style={{
                        transition: '0.3s',
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 50%, #06b6d4 100%)',
                        boxShadow: '0 0 20px rgba(56,189,248,0.5), 0 6px 20px rgba(59,130,246,0.35)'
                      }}
                      className="font-bold rounded-full flex items-center gap-3 justify-start disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-500 hover:from-sky-300 hover:via-blue-400 hover:to-cyan-400 text-white border-0 shadow-[0_0_20px_rgba(56,189,248,0.5)] hover:shadow-[0_0_40px_rgba(56,189,248,0.8)] transition-all"
                    >
                      <span className="text-xl">🌐</span>
                      <span className="text-base md:text-lg">Blockchain Mode</span>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 md:gap-6 mt-6">
                  <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4">
                    <ul className="space-y-1.5 list-none text-dpp-text-secondary text-sm">
                      <li>No wallet connection required</li>
                      <li>Instant access to all features</li>
                      <li>Mock data</li>
                    </ul>
                  </div>
                  <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4">
                    <ul className="space-y-1.5 list-none text-dpp-text-secondary text-sm">
                      <li>Real blockchain transactions</li>
                      <li>Connect with IOTA wallet</li>
                      <li>On-chain DID publishing on IOTA testnet</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps Carousel - below demo buttons */}
            <h2 className="text-2xl md:text-3xl font-bold text-dpp-text-primary text-center mb-2">
              SCREENSHOTS
            </h2>
            <StepsCarousel />
          </div>

          {/* FAQ Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-dpp-text-primary text-center mb-3">
            FAQ
          </h2>

          {/* About Ward - Personal Intro */}
          <div className="max-w-[800px] mx-auto mb-6 md:mb-8">
            <div className="card card-secondary p-5 md:p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl select-none">
                👋
              </div>
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-semibold text-dpp-text-primary mb-1">About Ward</h3>
                <p className="text-sm md:text-base text-dpp-text-secondary leading-relaxed">
                  Hi, I’m Ward — building trustworthy digital identities and product passport. This demo shows how any product can have verifiable origin and production data that’s fast to check and impossible to fake.
                </p>
              </div>
            </div>
          </div>

          {/* Highlights: Advantages + Key Features in grid with hover info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 md:mb-8">
            <Fold title={<>Advantages</>} defaultOpen={false}>
              <KeywordGrid
                keywords={[
                  { label: 'Instant Verification', info: '2 seconds vs 3-5 days' },
                  { label: 'Ultra-Low Cost', info: '$0.001 per verification' },
                  { label: 'Tamper-Proof', info: 'Mathematically impossible to fake' },
                  { label: 'Always Available', info: '24/7 global access' },
                  { label: 'EU Compliant', info: 'UN/CEFACT UNTP standard' },
                  { label: 'No Middleman', info: 'Direct verification, no trusted parties needed' },
                ]}
              />
            </Fold>
            <Fold title={<>Key Features</>} defaultOpen={false}>
              <KeywordGrid
                keywords={[
                  { label: 'Decentralized Identifiers (DIDs)', info: 'Unique blockchain addresses for every stakeholder and product' },
                  { label: 'Verifiable Credentials (VCs)', info: 'Cryptographically signed certificates that can\'t be faked' },
                  { label: 'UNTP Compliance', info: 'UN/CEFACT Digital Product Passport schema for standardized data' },
                  { label: 'Credential Chaining', info: 'Each credential references the previous, creating an immutable chain' },
                  { label: 'Blockchain Publishing', info: 'Real transactions on IOTA testnet with explorer links' },
                  { label: 'Multi-Industry Support', info: 'Food & Beverage, Battery, Fashion, Electronics' },
                ]}
              />
            </Fold>
          </div>

          {/* Why This Matters */}
          <Fold title={<><span className="text-purple-400">Traditional vs DIDs</span></>}>
            {/* Horizontal Comparison Table */}
            <div className="mb-6 bg-zinc-800/70 rounded-xl shadow-md overflow-hidden">
              <div className="grid grid-cols-3 text-center font-semibold text-zinc-300 text-xs md:text-base">
                <div></div>
                <div>Traditional Method</div>
                <div className="text-green-400">With DIDs</div>
              </div>
              <div className="divide-y divide-zinc-700/70">
                {/* Speed */}
                <div className="grid grid-cols-3 py-2 text-xs md:text-sm text-zinc-100 items-center">
                  <div className="text-zinc-400 font-medium text-left pl-2">Speed</div>
                  <div>3-5 business days</div>
                  <div className="text-green-400 font-semibold">2 seconds ⚡</div>
                </div>
                {/* Cost */}
                <div className="grid grid-cols-3 py-2 text-xs md:text-sm text-zinc-100 items-center">
                  <div className="text-zinc-400 font-medium text-left pl-2">Cost</div>
                  <div>Phone calls, emails, labor</div>
                  <div className="text-green-400 font-semibold">$0.001 per verification</div>
                </div>
                {/* Trust Model */}
                <div className="grid grid-cols-3 py-2 text-xs md:text-sm text-zinc-100 items-center">
                  <div className="text-zinc-400 font-medium text-left pl-2">Trust Model</div>
                  <div>Rely on reputation</div>
                  <div className="text-green-400 font-semibold">Cryptographically verifiable ✅</div>
                </div>
                {/* Forgery Risk */}
                <div className="grid grid-cols-3 py-2 text-xs md:text-sm text-zinc-100 items-center">
                  <div className="text-zinc-400 font-medium text-left pl-2">Forgery Risk</div>
                  <div>Paper certificates can be faked</div>
                  <div className="text-green-400 font-semibold">Mathematically impossible ✅</div>
                </div>
                {/* Availability */}
                <div className="grid grid-cols-3 py-2 text-xs md:text-sm text-zinc-100 items-center">
                  <div className="text-zinc-400 font-medium text-left pl-2">Availability</div>
                  <div>9-5 business hours</div>
                  <div className="text-green-400 font-semibold">24/7 global access ✅</div>
                </div>
              </div>
            </div>
          </Fold>

          {/* Technical & Legal Info */}
          <Fold title={<><span className="text-purple-400">Technical & Legal Info</span></>}>
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
          </Fold>

          {/* Built With - moved here under Technical & Legal Info */}
          <Fold title="Built With" defaultOpen={false} className="mb-6 md:mb-8">
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
          </Fold>

          {/* Features */}
          {/* This section is now redundant as features are moved to the new Highlights section */}
          {/* <div className="card card-secondary p-6 mb-6">
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
          </div> */}

          {/* Documentation Section - Foldable */}
          <Fold title={<><span className="text-blue-400">📚 Technical Documentation</span></>} defaultOpen={false}>
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
          </Fold>

          {/* Removed Start Journey CTA */}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}