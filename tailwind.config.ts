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
        // Votre configuration est déjà parfaite, nous la conservons.
        sans: ['var(--font-sans)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
      },
      colors: {
        'brand-dark': '#1a1a1a',
        'brand-light': '#f9f9f9',
        'brand-accent': '#a18a68',
        'brand-gray': '#737373',
      },
      // --- AJOUT DE CETTE SECTION ---
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        // Ceci nous permettra d'utiliser la classe `animate-fadeInUp`
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
      },
      // --- FIN DE L'AJOUT ---
    },
  },
  plugins: [],
};
export default config;