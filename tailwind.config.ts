import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'Liberation Sans',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Design System - Use nested structure for proper Tailwind syntax
        dpp: {
          // Backgrounds
          'bg-primary': 'var(--bg-primary)',
          'bg-secondary': 'var(--bg-secondary)',
          'bg-tertiary': 'var(--bg-tertiary)',
          'bg-card': 'var(--bg-card)',
          // Text
          'text-primary': 'var(--text-primary)',
          'text-secondary': 'var(--text-secondary)',
          'text-tertiary': 'var(--text-tertiary)',
          // Borders
          'border-default': 'var(--border)',
          'border-hover': 'var(--border-hover)',
          // Card System
          'card-bg-primary': 'var(--card-bg-primary)',
          'card-bg-secondary': 'var(--card-bg-secondary)',
          'card-bg-tertiary': 'var(--card-bg-tertiary)',
          'card-border-primary': 'var(--card-border-primary)',
          'card-border-secondary': 'var(--card-border-secondary)',
        },
      },
    },
  },
  plugins: [],
};

export default config;

