// path: app/products/page.tsx
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

// Définition du type de la réponse attendue de notre API
interface ApiResponse {
  items: any[]; // Remplacez `any` par un type produit plus strict si disponible
  total: number;
  page: number;
  totalPages: number;
}

// Fonction pour récupérer les données côté serveur
async function getProducts(page: number): Promise<ApiResponse> {
  // On utilise une variable d'environnement pour l'URL de base de l'API
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/products?page=${page}&limit=12`, {
    cache: 'no-store', // Important pour les données dynamiques
  });

  if (!res.ok) {
    throw new Error('Impossible de charger les produits.');
  }
  return res.json();
}

// La page est un Server Component asynchrone
export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const currentPage = Number(searchParams?.page) || 1;
  const data = await getProducts(currentPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
        Notre Catalogue
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination simple */}
      <div className="flex items-center justify-center gap-4 mt-12">
        <Link
          href={`/products?page=${currentPage - 1}`}
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
          href={`/products?page=${currentPage + 1}`}
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