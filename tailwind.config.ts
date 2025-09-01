// path: tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
      },
      colors: {
        // Nouvelle palette de couleurs inspirée de libitiishop
        'brand-dark': '#1a1a1a', // Un noir doux pour le texte et les éléments forts
        'brand-light': '#f9f9f9', // Un fond légèrement cassé, plus doux que le blanc pur
        'brand-accent': '#a18a68', // Un accent neutre et terreux (optionnel)
        'brand-gray': '#737373', // Pour les textes secondaires
      },
    },
  },
  plugins: [],
};
export default config;