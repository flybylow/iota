import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Design System - Flat structure for dpp-* classes
        'dpp-bg-primary': 'var(--bg-primary)',
        'dpp-bg-secondary': 'var(--bg-secondary)',
        'dpp-bg-tertiary': 'var(--bg-tertiary)',
        'dpp-bg-card': 'var(--bg-card)',
        'dpp-text-primary': 'var(--text-primary)',
        'dpp-text-secondary': 'var(--text-secondary)',
        'dpp-text-tertiary': 'var(--text-tertiary)',
        'dpp-border-default': 'var(--border)',
        'dpp-border-hover': 'var(--border-hover)',
        // Card System
        'dpp-card-bg-primary': 'var(--card-bg-primary)',
        'dpp-card-bg-secondary': 'var(--card-bg-secondary)',
        'dpp-card-bg-tertiary': 'var(--card-bg-tertiary)',
        'dpp-card-border-primary': 'var(--card-border-primary)',
        'dpp-card-border-secondary': 'var(--card-border-secondary)',
      },
    },
  },
  plugins: [],
};

export default config;

