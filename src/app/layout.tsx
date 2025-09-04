// path: src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast'; // Importer le Toaster

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LeBazare - Votre boutique en ligne',
  description: 'Découvrez notre sélection de produits uniques et de qualité.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body className="flex min-h-screen flex-col">
        {/* Le Toaster peut être placé n'importe où, ici c'est un bon endroit */}
        <Toaster
          position="bottom-center"
          toastOptions={{
            // Styles pour correspondre à notre design
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        {/* Nous n'avons pas encore créé le Footer, mais la structure est prête */}
        {/* <Footer /> */}
      </body>
    </html>
  );
}