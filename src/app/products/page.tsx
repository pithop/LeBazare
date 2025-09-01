// path: src/app/products/page.tsx
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import type { Product, ProductImage, Variant, Category, ProductCategory } from '@prisma/client';

// Type complet pour nos produits, incluant les relations
type ProductWithDetails = Product & {
  images: ProductImage[];
  variants: Variant[];
  categories: (ProductCategory & { category: Category })[];
};

interface ApiResponse {
  items: ProductWithDetails[];
  total: number;
  page: number;
  totalPages: number;
}

// La fonction getProducts est mise à jour pour gérer le filtrage par catégorie
async function getProducts(page: number, categorySlug?: string): Promise<ApiResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = new URL(`${baseUrl}/api/products`);
  url.searchParams.set('page', String(page));
  url.searchParams.set('limit', '9'); // On affiche 9 produits par page pour une grille 3x3
  if (categorySlug) {
    url.searchParams.set('category', categorySlug);
  }
  
  const res = await fetch(url.toString(), { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Impossible de charger les produits.');
  }
  return res.json();
}

// Nouvelle fonction pour récupérer toutes les catégories
async function getCategories() {
    return prisma.category.findMany({
        orderBy: { name: 'asc' },
    });
}

// Le composant de la barre latérale est maintenant dynamique
async function FilterSidebar({ activeCategorySlug }: { activeCategorySlug?: string }) {
  const categories = await getCategories();
  return (
    <aside className="w-full lg:w-1/4 lg:pr-12">
      <h2 className="text-lg font-semibold mb-4 text-brand-dark tracking-wider">Catégories</h2>
      <div className="space-y-3">
        <Link 
            href="/products" 
            className={`block transition-colors ${!activeCategorySlug ? 'text-brand-dark font-semibold' : 'text-brand-gray hover:text-brand-dark'}`}>
            Toute la collection
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className={`block transition-colors ${activeCategorySlug === category.slug ? 'text-brand-dark font-semibold' : 'text-brand-gray hover:text-brand-dark'}`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </aside>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { page?: string, category?: string };
}) {
  const awaitedSearchParams = await searchParams;
  const currentPage = Number(awaitedSearchParams?.page) || 1;
  const currentCategorySlug = awaitedSearchParams?.category;
  
  const [data, categories] = await Promise.all([
      getProducts(currentPage, currentCategorySlug),
      getCategories(),
  ]);

  const activeCategory = categories.find(cat => cat.slug === currentCategorySlug);

  return (
    <div className="bg-white">
      <div className="container-page py-12">
        <div className="text-left mb-12">
          <h1 className="text-4xl font-serif font-bold text-brand-dark">
            {activeCategory ? activeCategory.name : 'Toute la Collection'}
          </h1>
          <p className="mt-2 text-lg text-brand-gray">
            Découvrez des trésors d'artisanat uniques, façonnés à la main avec passion.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row">
          <FilterSidebar activeCategorySlug={currentCategorySlug} />
          
          <main className="w-full mt-10 lg:mt-0">
            {data.items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                {data.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold">Aucun produit trouvé</h3>
                <p className="mt-2 text-brand-gray">Essayez de sélectionner une autre catégorie.</p>
              </div>
            )}

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-16">
                <Link
                  href={{ query: { ...awaitedSearchParams, page: currentPage - 1 } }}
                  className={`font-medium text-sm ${currentPage <= 1 ? 'pointer-events-none text-gray-400' : 'text-brand-dark hover:text-brand-gray'}`}
                >
                  Précédent
                </Link>
                <span className="text-sm text-brand-gray">
                  Page {data.page} / {data.totalPages}
                </span>
                <Link
                  href={{ query: { ...awaitedSearchParams, page: currentPage + 1 } }}
                  className={`font-medium text-sm ${currentPage >= data.totalPages ? 'pointer-events-none text-gray-400' : 'text-brand-dark hover:text-brand-gray'}`}
                >
                  Suivant
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}