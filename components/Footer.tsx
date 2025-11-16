'use client';

import React from 'react';

/**
 * Footer Component
 */
export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-12 pt-8 pb-8">
      <div className="text-center space-y-4">
        <p className="text-xs md:text-sm text-dpp-text-secondary">
          Built with ❤️ for a more transparent, sustainable supply chain future
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-dpp-text-tertiary">
          <a
            href="https://github.com/flybylow/iota"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-dpp-text-secondary transition-colors"
          >
            GitHub
          </a>
          <span>•</span>
          <a
            href="https://docs.iota.org/developer/iota-identity/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-dpp-text-secondary transition-colors"
          >
            IOTA Identity Docs
          </a>
          <span>•</span>
          <a
            href="https://cirpass2.eu/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-dpp-text-secondary transition-colors"
          >
            CIRPASS-2
          </a>
import React from 'react';

export function Footer() {
  return (
    <footer className="mt-12 w-full">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-dpp-border-default to-transparent" />
      <div className="w-full px-4 py-10">
        <div className="flex flex-col items-center gap-6 text-sm md:text-base">
          <div className="flex items-center gap-3 md:gap-4 text-dpp-text-secondary">
            <span className="text-xl">⚡</span>
            <span className="uppercase tracking-widest font-semibold">Built with</span>
          </div>
          <div className="flex items-center gap-5 md:gap-8 text-dpp-text-tertiary">
            {/* Next.js */}
            <span className="flex items-center gap-2 hover:text-dpp-text-primary transition-colors">
              <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 394 80" fill="currentColor">
                <path d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0zM81 0L53 24v56h14V28l11-11 11 11v52h14V24L81 0zm151 0v12.7h-35v53.9h-13.6V12.7h-35V0h83.6zm46.3 0L237 24v56h13.6V28L258 19l7.6 9v52h13.6V24L278.3 0zm73.8 0v79.3h-13.7V0h13.7z"/>
              </svg>
              <span className="font-medium">Next.js</span>
            </span>
            <span className="opacity-40">•</span>
            {/* IOTA */}
            <span className="flex items-center gap-2 hover:text-dpp-text-primary transition-colors">
              <span className="text-lg">🌐</span>
              <span className="font-medium">IOTA</span>
            </span>
            <span className="opacity-40">•</span>
            {/* React */}
            <span className="flex items-center gap-2 hover:text-dpp-text-primary transition-colors">
              <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="2" opacity="0.3"/>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                <circle cx="12" cy="12" r="1.5"/>
                <path d="M7 12c0-2.76 2.24-5 5-5s5 2.24 5 5M17 12c0 2.76-2.24 5-5 5s-5-2.24-5-5" opacity="0.5"/>
              </svg>
              <span className="font-medium">React</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

