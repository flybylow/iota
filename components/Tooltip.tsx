'use client';

import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

/**
 * Tooltip Component
 * 
 * Shows a tooltip on hover with the provided content.
 * 
 * @example
 * <Tooltip content="Issues Certificate">
 *   <button>👨‍🌾</button>
 * </Tooltip>
 */
export function Tooltip({ content, children, side = 'bottom', delay = 200 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const getPositionClasses = () => {
    switch (side) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
    }
  };

  const getArrowClasses = () => {
    switch (side) {
      case 'top':
        return 'top-full left-1/2 -translate-x-1/2 border-t-[#1a1a1a] border-x-transparent border-b-transparent';
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 border-b-[#1a1a1a] border-x-transparent border-t-transparent';
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 border-l-[#1a1a1a] border-y-transparent border-r-transparent';
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 border-r-[#1a1a1a] border-y-transparent border-l-transparent';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 border-b-[#1a1a1a] border-x-transparent border-t-transparent';
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute ${getPositionClasses()} z-50 pointer-events-none`}
          role="tooltip"
        >
          <div className="bg-[#1a1a1a] text-white text-xs px-2 py-1 rounded border border-[#3a3a3a] shadow-lg whitespace-nowrap">
            {content}
          </div>
          <div className={`absolute ${getArrowClasses()} border-4`} />
        </div>
      )}
    </div>
  );
}

