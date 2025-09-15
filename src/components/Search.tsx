// path: src/components/Search.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDebouncedCallback } from 'use-debounce';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    params.set('page', '1'); // Revenir à la page 1 à chaque nouvelle recherche
    router.replace(`/products?${params.toString()}`);
  }, 300); // Attend 300ms après la dernière frappe avant de chercher

  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">Rechercher</label>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id="search"
        name="search"
        className="block w-full rounded-md border-0 bg-white py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
        placeholder="Rechercher..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('q')?.toString()}
      />
    </div>
  );
}