// path: src/app/admin/layout.tsx
import Link from 'next/link';
import { ReactNode } from 'react';
import { HomeIcon, ShoppingBagIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center text-2xl font-bold font-serif">LeBazare</div>
        <nav className="flex-grow p-4">
          <ul>
            <li><Link href="/admin/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-700"><HomeIcon className="h-5 w-5" />Dashboard</Link></li>
            <li><Link href="/admin/products" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-700"><ShoppingBagIcon className="h-5 w-5" />Produits</Link></li>
            {/* Liens pour futures fonctionnalités */}
            <li className="opacity-50"><span className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500"><UsersIcon className="h-5 w-5" />Commandes</span></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}