'use client';

import Link from 'next/link';
import { ShoppingBagIcon, UserIcon, ArrowRightOnRectangleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/lib/useCart';
import { useAuth } from '@/lib/useAuth'; // Importer le hook d'authentification
import { useEffect } from 'react';

const Header = () => {
  const totalItems = useCart((state) => state.totalItems);
  const { user, checkUserStatus, setUser } = useAuth(); // Utiliser le hook

  // Vérifier le statut de l'utilisateur au chargement initial
  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]);

  const handleLogout = async () => {
    // Logique de déconnexion (supprimer le cookie)
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null); // Mettre à jour l'état local
  };

  return (
    <header className="sticky top-0 z-20 w-full border-b border-gray-200 bg-brand-light/80 backdrop-blur-md">
      <div className="container-page flex h-20 items-center justify-between">
        
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/" className="text-brand-dark hover:text-brand-gray">Accueil</Link>
          <Link href="/products" className="text-brand-dark hover:text-brand-gray">Collection</Link>
        </nav>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/" className="text-2xl font-serif font-bold text-brand-dark">
            LeBazare
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button aria-label="Rechercher" className="p-2 text-brand-dark hover:text-brand-gray">
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>
          
          {/* --- CORRECTION DU LIEN PANIER --- */}
          <Link href="/cart" aria-label="Panier" className="relative p-2 text-brand-dark hover:text-brand-gray">
            <ShoppingBagIcon className="h-6 w-6" />
            {/* Affiche le compteur seulement s'il y a des articles */}
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
         {/* SECTION DYNAMIQUE D'AUTHENTIFICATION */}
         {user ? (
            <>
              <Link href="/account" className="p-2 text-brand-dark hover:text-brand-gray">
                <UserIcon className="h-6 w-6" />
              </Link>
              <button onClick={handleLogout} className="p-2 text-brand-dark hover:text-brand-gray">
                 <ArrowRightOnRectangleIcon className="h-6 w-6" />
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm font-medium text-brand-dark hover:text-brand-gray">
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;