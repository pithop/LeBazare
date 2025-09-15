// path: src/app/admin/layout.tsx
import Link from 'next/link';
import { ReactNode } from 'react';
import { HomeIcon, ShoppingBagIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col">
        <div className="h-20 flex items-center justify-center text-2xl font-bold font-serif text-white">LeBazare</div>
        <nav className="flex-grow p-4">
          <ul className="space-y-2">
            <li><Link href="/admin/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:text-white hover:bg-gray-700"><HomeIcon className="h-5 w-5" />Tableau de bord</Link></li>
            <li><Link href="/admin/products" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:text-white hover:bg-gray-700"><ShoppingBagIcon className="h-5 w-5" />Produits</Link></li>
          </ul>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="h-20 bg-white border-b flex items-center justify-end px-8">
          {/* Vous pourrez ajouter ici le nom de l'admin et un bouton de déconnexion */}
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}