import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        hacker: {
          bg: '#0a0a0a',
          fg: '#00ff41',
          accent: '#00cc33',
          muted: '#1a3a1a',
          dark: '#0d0d0d',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
