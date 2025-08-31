// path: src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css' // Import CRUCIAL - doit être présent

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LeBazare - Votre boutique en ligne',
  description: 'Découvrez nos produits exceptionnels',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      {/* Test immédiat avec des classes Tailwind */}
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-50 to-gray-100`}>
        {/* Container principal avec styles Tailwind */}
        <div className="relative">
          {children}
        </div>
      </body>
    </html>
  )
}