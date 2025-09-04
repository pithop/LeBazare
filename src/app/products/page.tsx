// path: src/app/products/page.tsx
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import type { Product, ProductImage, Variant, Category } from '@prisma/client';

type ProductWithDetails = Product & {
  images: ProductImage[];
  variants: Variant[];
};

interface ApiResponse {
  items: ProductWithDetails[];
  total: number;
  page: number;
  totalPages: number;
}

// **CORRECTION 1**: La fonction accepte maintenant des valeurs simples (string, number)
async function getProducts(
  page: number,
  category?: string,
  sort?: string
): Promise<ApiResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // On peut maintenant construire les paramètres sans risque
  const params = new URLSearchParams({
    page: String(page),
    limit: '9',
  });
  if (category) params.set('category', category);
  if (sort) params.set('sort', sort);

  const res = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Impossible de charger les produits.');
  }
  return res.json();
}

async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // **CORRECTION 2**: On extrait les valeurs de searchParams ici, au plus haut niveau.
  const currentPage = Number(searchParams.page) || 1;
  const currentCategory = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const currentSort = typeof searchParams.sort === 'string' ? searchParams.sort : undefined;

  // On passe ensuite ces valeurs simples aux fonctions
  const [data, categories] = await Promise.all([
    getProducts(currentPage, currentCategory, currentSort),
    getCategories(),
  ]);
  
  // **CORRECTION 3**: La fonction de pagination utilise aussi les valeurs extraites.
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (currentCategory) params.set('category', currentCategory);
    if (currentSort) params.set('sort', currentSort);
    params.set('page', String(pageNumber));
    return `/products?${params.toString()}`;
  };

  return (
    <div className="container-page py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-bold tracking-tight text-brand-dark">
          Collection
        </h1>
        <p className="mt-2 text-brand-gray">Découvrez nos trésors faits main.</p>
      </div>

      <ProductFilters categories={categories} totalProducts={data.total} />

      {data.items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brand-gray">Aucun produit ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
          {data.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* La pagination utilise maintenant la fonction sécurisée */}
      <div className="mt-12 flex items-center justify-center gap-4">
        <Link
          href={createPageURL(currentPage - 1)}
          className={`px-4 py-2 border rounded-md ${
            currentPage <= 1 ? 'pointer-events-none bg-gray-100 text-gray-400' : 'hover:bg-gray-50'
          }`}
        >
          Précédent
        </Link>
        <span className="text-gray-700">
          Page {data.page} / {data.totalPages}
        </span>
        <Link
          href={createPageURL(currentPage + 1)}
          className={`px-4 py-2 border rounded-md ${
            currentPage >= data.totalPages ? 'pointer-events-none bg-gray-100 text-gray-400' : 'hover:bg-gray-50'
          }`}
        >
          Suivant
        </Link>
      </div>
    </div>
  );
}