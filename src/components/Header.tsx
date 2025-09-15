// path: src/components/Header.tsx
'use client';

import { Fragment, useState, useEffect } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import {
  ShoppingBagIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  WrenchScrewdriverIcon, // AJOUT : Icône pour l'admin
} from '@heroicons/react/24/outline';
import { useCart } from '@/lib/useCart';
import { useAuth } from '@/lib/useAuth';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = useCart((state) => state.totalItems);
  const { user, checkUserStatus, setUser } = useAuth();

  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };
  
  const navLinks = [
      { name: 'Accueil', href: '/' },
      { name: 'Collection', href: '/products' },
  ];

  return (
    <header className="sticky top-0 z-20 w-full border-b border-gray-200 bg-brand-light/80 backdrop-blur-md">
      <div className="container-page flex h-20 items-center justify-between">
        
        {/* Navigation principale pour Desktop */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-brand-dark hover:text-brand-gray">
                  {link.name}
              </Link>
          ))}
        </nav>
        
        {/* Bouton Hamburger pour Mobile */}
        <div className="flex items-center md:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Ouvrir le menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
        </div>


        {/* Logo au centre */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:relative md:left-0 md:top-0 md:translate-x-0 md:translate-y-0">
          <Link href="/" className="text-2xl font-serif font-bold text-brand-dark">
            LeBazare
          </Link>
        </div>

        {/* Icônes de droite */}
        <div className="flex items-center gap-4">
          <button aria-label="Rechercher" className="p-2 text-brand-dark hover:text-brand-gray hidden sm:block">
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>
          
          <Link href="/cart" aria-label="Panier" className="relative p-2 text-brand-dark hover:text-brand-gray">
            <ShoppingBagIcon className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
          
          <div className="hidden sm:flex sm:items-center sm:gap-4">
            {user ? (
              <>
                {/* AJOUT : Lien Admin pour la vue Desktop */}
                {user.role === 'admin' && (
                  <Link href="/admin/dashboard" title="Panneau Admin" className="p-2 text-brand-dark hover:text-indigo-600">
                    <WrenchScrewdriverIcon className="h-6 w-6" />
                  </Link>
                )}
                <Link href="/account" title="Mon Compte" className="p-2 text-brand-dark hover:text-brand-gray">
                  <UserIcon className="h-6 w-6" />
                </Link>
                <button onClick={handleLogout} title="Déconnexion" className="p-2 text-brand-dark hover:text-brand-gray">
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
      </div>

      {/* Panneau du menu mobile (avec Headless UI) */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="md:hidden" onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-30" />
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="fixed inset-y-0 left-0 z-40 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5 text-2xl font-serif font-bold text-brand-dark">
                    LeBazare
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navLinks.map((link) => (
                       <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                           {link.name}
                       </Link>
                    ))}
                  </div>
                  <div className="py-6">
                    {user ? (
                         <div className="space-y-2">
                             {/* AJOUT : Lien Admin pour le menu Mobile */}
                             {user.role === 'admin' && (
                                <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="-mx-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-indigo-600 hover:bg-gray-50">
                                    <WrenchScrewdriverIcon className="h-6 w-6" />
                                    Panneau Admin
                                </Link>
                             )}
                             <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Mon Compte</Link>
                             <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full text-left -mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Déconnexion</button>
                         </div>
                    ) : (
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                            Se connecter
                        </Link>
                    )}
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </header>
  );
};

export default Header;