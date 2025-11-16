'use client';

import React from 'react';

interface CTAButtonProps {
  icon?: string | React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  active?: boolean;
}

/**
 * CTA Button Component
 * 
 * Flashy, prominent call-to-action button using brand color palette.
 * 
 * Design System Colors:
 * - Primary: Vibrant cyan-blue gradient (#00D4FF → #0099CC)
 * - Secondary: Clean white/black
 * 
 * @example
 * <CTAButton 
 *   icon="🌱" 
 *   label="Issue Origin Certificate" 
 *   onClick={handleClick}
 *   loading={isLoading}
 * />
 */
export function CTAButton({
  icon,
  label,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'lg', // Default to larger size
  className = '',
  active = true,
}: CTAButtonProps) {
  // Define padding styles - BIGGER for lg size
  const paddingStyles = {
    sm: { padding: '0.625rem 1.25rem' }, // 10px vertical, 20px horizontal
    md: { padding: '0.875rem 1.75rem' }, // 14px vertical, 28px horizontal  
    lg: { padding: '1.5rem 4rem' },      // 24px vertical, 64px horizontal - MUCH BIGGER!
  };

  const baseClasses = `
    font-bold rounded-full transition-all duration-300 
    flex items-center gap-6 justify-center
    disabled:opacity-50 disabled:cursor-not-allowed
    transform hover:scale-110 active:scale-105
    relative overflow-hidden
  `;

  // SUPER FLASHY brand color: Bright electric cyan-blue gradient
  // Active state: full brightness, inactive: reduced opacity and muted colors
  const variantClasses = {
    primary: active ? `
      bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-500
      hover:from-sky-300 hover:via-blue-400 hover:to-cyan-400
      text-white border-0
      shadow-[0_0_30px_rgba(56,189,248,0.6)]
      hover:shadow-[0_0_40px_rgba(56,189,248,0.8)]
      hover:brightness-110
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
    ` : `
      bg-gradient-to-r from-sky-600/50 via-blue-600/50 to-cyan-600/50
      hover:from-sky-500/60 hover:via-blue-500/60 hover:to-cyan-500/60
      text-white/70 border-0
      shadow-[0_0_15px_rgba(56,189,248,0.3)]
      hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]
      opacity-70
    `,
    secondary: active ? `
      bg-black text-white hover:bg-gray-900 border-2 border-white
      hover:shadow-lg hover:shadow-white/20
    ` : `
      bg-black/50 text-white/70 hover:bg-black/60 border-2 border-white/50
      opacity-70
    `,
  };

  const sizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-3xl', // EVEN BIGGER - SUPER FLASHY!
  };

  const iconSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl', // EVEN BIGGER icons for maximum visibility
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        background: variant === 'primary' 
          ? active
            ? 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 50%, #06b6d4 100%)'
            : 'linear-gradient(135deg, rgba(56, 189, 248, 0.5) 0%, rgba(59, 130, 246, 0.5) 50%, rgba(6, 182, 212, 0.5) 100%)'
          : undefined,
        boxShadow: variant === 'primary' 
          ? active
            ? '0 0 30px rgba(56, 189, 248, 0.6), 0 10px 40px rgba(59, 130, 246, 0.4)'
            : '0 0 15px rgba(56, 189, 248, 0.3), 0 5px 20px rgba(59, 130, 246, 0.2)'
          : undefined,
        transition: 'all 0.3s ease',
        ...paddingStyles[size], // Apply padding as inline style
      }}
      onMouseEnter={(e) => {
        if (variant === 'primary' && !disabled && !loading) {
          if (active) {
            e.currentTarget.style.background = 'linear-gradient(135deg, #7dd3fc 0%, #60a5fa 50%, #22d3ee 100%)';
            e.currentTarget.style.boxShadow = '0 0 50px rgba(56, 189, 248, 0.9), 0 15px 50px rgba(59, 130, 246, 0.6)';
          } else {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(56, 189, 248, 0.6) 0%, rgba(59, 130, 246, 0.6) 50%, rgba(6, 182, 212, 0.6) 100%)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(56, 189, 248, 0.4), 0 8px 25px rgba(59, 130, 246, 0.3)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          if (active) {
            e.currentTarget.style.background = 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 50%, #06b6d4 100%)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(56, 189, 248, 0.6), 0 10px 40px rgba(59, 130, 246, 0.4)';
          } else {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(56, 189, 248, 0.5) 0%, rgba(59, 130, 246, 0.5) 50%, rgba(6, 182, 212, 0.5) 100%)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(56, 189, 248, 0.3), 0 5px 20px rgba(59, 130, 246, 0.2)';
          }
        }
      }}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {loading ? (
        <>
          <svg 
            className={`animate-spin ${iconSizeClasses[size]}`} 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Issuing...</span>
        </>
      ) : (
        <div className="relative z-10 flex items-center gap-4">
          {icon && (
            <span className={iconSizeClasses[size]}>
              {typeof icon === 'string' ? icon : icon}
            </span>
          )}
          <div>{label}</div>
        </div>
      )}
    </button>
  );
}

