// path: src/components/Header.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/useCart';
import { useAuth } from '@/lib/useAuth';
import { ShoppingBagIcon, UserCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { totalItems } = useCart();
  const { user, checkUserStatus } = useAuth();

  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]);

  return (
    <header className="sticky top-0 z-50 bg-brand-light border-b border-gray-200">
      <div className="container-page py-6">
        <div className="flex justify-between items-center">
          {/* Section Gauche (placeholder pour l'équilibre) */}
          <div className="w-1/3">
            {/* Vous pourriez ajouter un sélecteur de langue/devise ici */}
          </div>

          {/* Logo Centré */}
          <div className="w-1/3 text-center">
            <Link href="/" className="text-4xl font-serif font-bold text-brand-dark tracking-wider">
              LeBazare
            </Link>
          </div>

          {/* Icônes Droite */}
          <div className="w-1/3 flex justify-end items-center gap-6">
            <button className="text-brand-dark hover:text-brand-gray">
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <Link href={user ? "/account" : "/login"} className="text-brand-dark hover:text-brand-gray">
              <UserCircleIcon className="h-6 w-6" />
            </Link>
            <Link href="/cart" className="relative text-brand-dark hover:text-brand-gray">
              <ShoppingBagIcon className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-dark text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
        
        {/* Navigation Centrée */}
        <nav className="mt-4 flex justify-center items-center gap-8 text-sm font-medium tracking-wider uppercase text-brand-dark">
            <Link href="/" className="hover:text-brand-gray">Accueil</Link>
            <Link href="/products" className="hover:text-brand-gray">Collection</Link>
            {/* Ajoutez d'autres liens de navigation ici */}
        </nav>
      </div>
    </header>
  );
}