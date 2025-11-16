'use client';

import React, { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FoldProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Fold Component - Collapsible section
 * 
 * @example
 * <Fold title="Advantages" defaultOpen={false}>
 *   <p>Content here</p>
 * </Fold>
 */
export function Fold({ title, children, defaultOpen = false, className = '' }: FoldProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border-[0.5px] border-white/10 rounded-lg overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 md:px-6 py-4 text-left hover:bg-white/5 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          {typeof title === 'string' ? (
            <span className="text-sm md:text-base font-medium text-dpp-text-primary">{title}</span>
          ) : (
            title
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-dpp-text-secondary flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-dpp-text-secondary flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-5 md:px-6 pb-5 md:pb-6 pt-2 text-xs md:text-sm">
          {children}
        </div>
      )}
    </div>
  );
}

