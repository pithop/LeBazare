// path: src/components/Header.tsx
'use client';

import Link from 'next/link';
import { useCart } from '@/lib/useCart';
import { ShoppingBagIcon } from '@heroicons/react/24/outline'; // Assure-toi d'installer heroicons: npm install @heroicons/react

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 lg:px-8 flex justify-between items-center py-4">
        <Link href="/" className="text-2xl font-bold font-serif text-gray-800">
          LeBazare
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/products" className="text-gray-600 hover:text-primary-600 transition-colors">
            Catalogue
          </Link>
          <Link href="/cart" className="relative text-gray-600 hover:text-primary-600 transition-colors">
            <ShoppingBagIcon className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}