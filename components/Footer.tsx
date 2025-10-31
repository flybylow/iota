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
        </div>
      </div>
    </footer>
  );
}

