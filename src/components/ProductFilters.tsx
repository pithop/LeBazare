// path: src/components/ProductFilters.tsx
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { Category } from '@prisma/client';
import CustomSelect from './ui/CustomSelect';
import Link from 'next/link'; // NOUVEAU: On importe Link pour nos catégories

interface ProductFiltersProps {
  categories: Category[];
  totalProducts: number;
}

export default function ProductFilters({ categories, totalProducts }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // On récupère la catégorie et le tri actuels depuis l'URL
  const currentCategory = searchParams.get('category');
  const currentSort = searchParams.get('sort');

  // NOUVEAU: Fonction pour créer l'URL pour chaque filtre de catégorie
  const createCategoryURL = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category'); // Si slug est null, c'est pour "Toutes les catégories"
    }
    params.delete('page'); // On réinitialise toujours la page
    return `${pathname}?${params.toString()}`;
  };
  
  // MODIFIÉ: On utilise maintenant une fonction séparée pour le tri
  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const sortOptions = [
    { value: 'creation-desc', label: 'Nouveautés' },
    { value: 'price-asc', label: 'Prix : Croissant' },
    { value: 'price-desc', label: 'Prix : Décroissant' },
  ];

  return (
    <div className="flex flex-col gap-y-8">
      {/* NOUVEAU : La liste des catégories */}
      <div>
        <h3 className="font-semibold mb-4 text-brand-dark">Catégories</h3>
        <ul className="space-y-2">
          {/* Option "Toutes les catégories" */}
          <li>
            <Link 
              href={createCategoryURL(null)} 
              className={`block text-sm transition-colors ${
                !currentCategory 
                  ? 'text-brand-dark font-semibold' 
                  : 'text-brand-gray hover:text-brand-dark'
              }`}
            >
              Toutes les catégories
            </Link>
          </li>
          {/* On mappe sur les catégories pour créer les autres liens */}
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={createCategoryURL(cat.slug)}
                className={`block text-sm transition-colors ${
                  currentCategory === cat.slug
                    ? 'text-brand-dark font-semibold'
                    : 'text-brand-gray hover:text-brand-dark'
                }`}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Le sélecteur pour le tri reste le même, c'est une bonne UX */}
      <div>
        <h3 className="font-semibold mb-2 text-brand-dark">Trier par</h3>
        <CustomSelect
          options={sortOptions}
          value={currentSort || 'creation-desc'}
          onChange={handleSortChange}
        />
      </div>
      
      <p className="text-sm text-brand-gray border-t pt-4 mt-2">
        {totalProducts} produits trouvés.
      </p>
    </div>
  );
}