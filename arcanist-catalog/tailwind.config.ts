import type { Config } from 'tailwindcss';

// Arcanist's Dice brand tokens. See docs/brand-ui.md.
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          indigo: '#2E3192',
          deep: '#1F2170',
          violet: '#A57FFF',
          lavender: '#D7CEEA',
          lilac: '#EFEBF7',
          mint: '#3FFFB1',
          line: '#5357C2',
          field: '#25277C',
          danger: '#FF7A9A',
        },
        whatsapp: '#25D366',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Staatliches', 'Impact', 'Arial Narrow', 'sans-serif'],
        sans: ['var(--font-sans)', 'Nunito', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      borderWidth: {
        1.5: '1.5px',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #3FFFB1, #A57FFF)',
        'brand-page': 'radial-gradient(ellipse at top, #3a3db0 0%, #2E3192 40%, #1F2170 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
