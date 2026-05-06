import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3D35B5',
        'primary-dark': '#1A1640',
        'primary-light': '#5548CC',
        silver: '#C8C5E8',
        teal: '#40E0C8',
        'teal-dark': '#2DBFAA',
        arcane: {
          purple: '#7B5EA7',
          bg: '#0F0D2E',
          card: '#1A1640',
          border: '#2D2870',
        },
      },
      fontFamily: {
        cinzel: ['var(--font-cinzel)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
