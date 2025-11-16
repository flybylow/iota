'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

export const BlockchainCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const cards = [
    {
      id: 'origin',
      icon: '🌱',
      title: 'Origin Certification',
      subtitle: "Maria's Organic Cocoa Farm",
      status: 'Verified',
      preview: {
        origin: 'Ecuador',
        batch: '400 kg',
        variety: 'Nacional'
      },
      full: {
        'Batch Weight': '400 kg',
        'Variety': 'Nacional',
        'Harvest Date': '29-10-2025',
        'Fermentation': '6 days',
        'Drying': 'Sun-dried',
        'Issued': '29-10-2025'
      }
    },
    {
      id: 'production',
      icon: '🏭',
      title: 'Production Certification',
      subtitle: 'Chocolate Dreams Factory',
      status: 'Verified',
      preview: {
        units: '50,000 bars',
        produced: '15-10-2025',
        quality: 'All checks ✓'
      },
      full: {
        'Units Produced': '50,000 bars',
        'Input → Output': '400 kg → 2,800 bars',
        'Produced': '15-10-2025',
        'Quality': 'All checks passed ✓',
        'Issued': '29-10-2025'
      }
    },
    {
      id: 'verification',
      icon: '✅',
      title: 'Verification Summary',
      subtitle: 'Compliance & Sustainability',
      status: 'Complete',
      preview: {
        certification: 'Valid',
        custody: 'Unbroken',
        fairTrade: 'Yes ✓'
      },
      full: {
        'Organic certification': 'Valid',
        'Origin claims': 'Ecuador, verified',
        'Production records': 'Complete',
        'Chain of custody': 'Unbroken',
        'Carbon Footprint': '850g CO₂',
        'Packaging': 'Compostable',
        'Fair Trade': 'Yes ✓',
        'Recyclable': '100% ✓'
      }
    },
    {
      id: 'blockchain',
      icon: '🔒',
      title: 'External Proof',
      subtitle: 'Blockchain Verification',
      status: 'Published',
      preview: {
        network: 'IOTA Tangle',
        entities: '2 verified',
        immutable: 'Yes'
      },
      full: {
        entities: [
          {
            name: "Maria's Organic Cocoa Farm",
            did: 'did:iota:0x:0xfarmermaria0012345678...',
            status: 'Published to blockchain'
          },
          {
            name: 'Chocolate Dreams Factory',
            did: 'did:iota:0x:0xfactorychoco123456789...',
            status: 'Published to blockchain'
          }
        ],
        note: 'These identities exist on a public, immutable blockchain. Anyone, anywhere can verify them independently without trusting this website.'
      }
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
    setExpandedCard(null);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setExpandedCard(null);
  };

  const toggleExpand = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <div className="w-full p-4 md:p-8 bg-dpp-bg-primary">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-dpp-text-primary mb-2">
            Supply Chain Transparency
          </h1>
          <p className="text-dpp-text-secondary">Blockchain-verified from farm to consumer</p>
        </div>

        <div className="relative bg-dpp-bg-primary rounded-lg">
          {/* Carousel Container */}
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {cards.map((card) => (
                <div key={card.id} className="w-full flex-shrink-0 px-4 min-w-0">
                  <div
                    onClick={() => toggleExpand(card.id)}
                    className={`bg-dpp-card-bg-secondary border-2 border-dpp-card-border-primary rounded-2xl cursor-pointer transition-all duration-300 min-h-[400px] ${
                      expandedCard === card.id
                        ? 'shadow-2xl scale-105 border-blue-500/50 bg-dpp-card-bg-tertiary'
                        : 'shadow-xl hover:shadow-2xl hover:border-blue-500/30'
                    }`}
                    style={{
                      boxShadow: expandedCard === card.id
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        : '0 10px 30px -5px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    {/* Card Header */}
                    <div className="p-6 md:p-8 border-b border-dpp-card-border-primary">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl md:text-5xl">{card.icon}</div>
                          <div>
                            <h2 className="text-xl md:text-2xl font-bold text-dpp-text-primary mb-1">
                              {card.title}
                            </h2>
                            <p className="text-dpp-text-secondary text-sm">{card.subtitle}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-semibold border border-green-500/30">
                          <span className="text-lg md:text-xl">✓</span>
                          {card.status}
                        </div>
                      </div>
                    </div>

                    {/* Card Content - Preview */}
                    <div className="p-6 md:p-8">
                      {card.id !== 'blockchain' ? (
                        <div className="grid grid-cols-3 gap-4 md:gap-6">
                          {Object.entries(card.preview).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <p className="text-xs text-dpp-text-tertiary uppercase tracking-wider mb-1">
                                {key}
                              </p>
                              <p className="text-base md:text-lg font-semibold text-dpp-text-primary">{value}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <p className="text-sm text-dpp-text-secondary">
                            {card.preview.entities} on {card.preview.network}
                          </p>
                          <p className="text-xs text-dpp-text-tertiary">
                            Immutable verification available
                          </p>
                        </div>
                      )}

                      {/* Expand Indicator */}
                      <div className="mt-6 text-center">
                        <button className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center justify-center gap-2 mx-auto transition-colors">
                          {expandedCard === card.id ? 'Show less' : 'View full details'}
                          <span className={`transform transition-transform ${expandedCard === card.id ? 'rotate-180' : ''}`}>
                            ↓
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedCard === card.id && (
                      <div className="px-6 md:px-8 pb-6 md:pb-8 pt-4 border-t border-dpp-card-border-primary animate-fadeIn">
                        {card.id !== 'blockchain' ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(card.full).map(([key, value]) => (
                              <div key={key} className="flex justify-between items-center py-3 border-b border-dpp-card-border-primary">
                                <span className="text-xs md:text-sm text-dpp-text-secondary font-medium">{key}</span>
                                <span className="text-xs md:text-sm text-dpp-text-primary font-semibold">{value}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {(card.full.entities as Array<{name: string; did: string; status: string}>).map((entity, idx) => (
                              <div key={idx} className="bg-dpp-card-bg-tertiary border border-dpp-card-border-primary rounded-xl p-4 md:p-6">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h3 className="font-bold text-dpp-text-primary mb-1 text-sm md:text-base">{entity.name}</h3>
                                    <p className="text-xs text-dpp-text-secondary font-mono bg-dpp-bg-primary px-2 md:px-3 py-1 rounded inline-block break-all">
                                      {entity.did}
                                    </p>
                                  </div>
                                  <span className="text-green-400 text-xs font-semibold bg-green-500/20 px-2 md:px-3 py-1 rounded-full border border-green-500/30">
                                    ✅ {entity.status}
                                  </span>
                                </div>
                                <button className="mt-4 flex items-center gap-2 text-xs md:text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
                                  <ExternalLink size={16} />
                                  View on blockchain
                                </button>
                              </div>
                            ))}
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                              <p className="text-xs md:text-sm text-dpp-text-secondary flex items-start gap-2">
                                <span className="text-lg md:text-xl">💡</span>
                                <span>{card.full.note}</span>
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 bg-dpp-card-bg-secondary border border-dpp-card-border-primary rounded-full p-2 md:p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 z-10"
            aria-label="Previous"
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6 text-dpp-text-primary" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 bg-dpp-card-bg-secondary border border-dpp-card-border-primary rounded-full p-2 md:p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 z-10"
            aria-label="Next"
          >
            <ChevronRight size={20} className="md:w-6 md:h-6 text-dpp-text-primary" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2.5 mt-6 md:mt-8">
            {cards.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setExpandedCard(null);
                }}
                className={`transition-all rounded-full ${
                  currentIndex === idx
                    ? 'w-16 h-[15px] bg-blue-500 md:w-20 md:h-[15px] shadow-[0_10px_15px_-3px_rgba(59,130,246,0.5),0_4px_6px_-2px_rgba(59,130,246,0.3),0_0_0_2px_rgba(96,165,250,1),inset_0_0_0_1px_rgba(255,255,255,1)]'
                    : 'w-3 h-[15px] bg-dpp-card-border-primary/60 hover:bg-dpp-card-border-primary opacity-50 hover:opacity-75'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 md:mt-12 text-xs md:text-sm text-dpp-text-tertiary">
          <p>Click on any card to view complete certification details</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

