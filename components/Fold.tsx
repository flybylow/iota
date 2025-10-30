'use client';

import React, { ReactNode, useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface FoldProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Fold({ title, children, defaultOpen = false, className = '' }: FoldProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`rounded-xl bg-dpp-bg-secondary/60 backdrop-blur-sm shadow-sm shadow-black/10 border-[0.5px] border-white/10 ${className}`}>
      <button
        type="button"
        className="w-full flex items-center gap-3 px-5 py-4 md:px-6 md:py-5 text-left hover:bg-white/5 transition-colors focus:outline-none rounded-t-xl"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <ChevronRight
          className={`w-5 h-5 md:w-6 md:h-6 text-blue-400 transition-transform ${open ? 'rotate-90' : ''}`}
        />
        <span className="font-medium text-base md:text-lg text-blue-300">{title}</span>
      </button>
      {open && (
        <div className="px-5 md:px-7 pb-6 md:pb-7 pt-3 space-y-4 md:space-y-5 text-xs md:text-sm">
          {children}
        </div>
      )}
    </div>
  );
}
