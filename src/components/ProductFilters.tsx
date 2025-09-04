// path: src/components/ProductFilters.tsx
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { Category } from '@prisma/client';
import CustomSelect from './ui/CustomSelect';

interface ProductFiltersProps {
  categories: Category[];
  totalProducts: number;
}

export default function ProductFilters({ categories, totalProducts }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const categoryOptions = [
    { value: '', label: 'Tous les produits' },
    ...categories.map((cat) => ({ value: cat.slug, label: cat.name })),
  ];
  
  const sortOptions = [
    { value: 'creation-desc', label: 'Nouveautés' },
    { value: 'price-asc', label: 'Prix: Croissant' },
    { value: 'price-desc', label: 'Prix: Décroissant' },
  ];

  return (
    // --- CORRECTION DES CLASSES FLEXBOX ICI ---
    <div className="mb-8 flex flex-col items-center justify-between gap-4 border-b border-gray-200 pb-4 md:flex-row">
      <div className="w-full md:w-auto">
        <CustomSelect
          placeholder="Type de produit"
          options={categoryOptions}
          value={searchParams.get('category') || ''}
          onChange={(value) => handleFilterChange('category', value)}
        />
      </div>

      <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-end">
        <span className="flex-shrink-0 text-sm text-brand-gray">{totalProducts} produits</span>
        <div className="w-full md:w-auto">
           <CustomSelect
            placeholder="Trier par"
            options={sortOptions}
            value={searchParams.get('sort') || 'creation-desc'}
            onChange={(value) => handleFilterChange('sort', value)}
          />
        </div>
      </div>
    </div>
  );
}