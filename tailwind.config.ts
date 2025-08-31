// path: tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'beige-fond': '#F8F5F2',
        'texte-principal': '#3A3A3A',
        'accent': '#E27D60',
        'accent-hover': '#D96C4E',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-lora)', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config