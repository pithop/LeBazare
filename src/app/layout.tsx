// path: src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";

// Configuration des polices (inchangé)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "Le Bazare - Artisanat Authentique",
  description: "Décoration et mobilier bohème fait main.",
};

// Header mis à jour pour utiliser les nouvelles couleurs
function Header() {
  return (
    <header className="border-b border-gray-200 bg-beige-fond/80 backdrop-blur-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 lg:px-8 flex justify-between items-center py-4">
        <a href="/" className="text-2xl font-bold font-serif text-texte-principal">LeBazare</a>
        <div className="flex items-center gap-6">
          <a href="/products" className="text-texte-principal hover:text-accent transition-colors">Catalogue</a>
          <a href="/cart" className="text-texte-principal hover:text-accent transition-colors">Panier</a>
        </div>
      </nav>
    </header>
  );
}

// Footer mis à jour
function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-8 text-center text-gray-500">
        <p>&copy; 2025 Le Bazare. Tous droits réservés.</p>
      </div>
    </footer>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // On ajoute la classe "light" ici pour forcer le thème clair
    <html lang="fr" className="light">
      <body 
        className={`${inter.variable} ${lora.variable} font-sans bg-beige-fond text-texte-principal`}
      >
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}