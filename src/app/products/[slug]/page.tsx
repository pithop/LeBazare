// path: src/app/products/[slug]/page.tsx
import ProductGallery from '@/components/ProductGallery';
import { formatCents } from '@/lib/money';
import { notFound } from 'next/navigation';
import type { Product, ProductImage, Variant } from '@prisma/client';
import ProductInteractions from '@/components/ProductInteractions'; // <-- Importer le nouveau composant

// Le type complet pour notre produit, incluant les relations
type ProductWithDetails = Product & {
  images: ProductImage[];
  variants: Variant[];
};

// Fonction pour récupérer le produit unique côté serveur
async function getProduct(slug: string): Promise<{ product: ProductWithDetails } | null> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/products/${slug}`, {
    next: { revalidate: 3600 }, // On cache la donnée pendant 1h
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Erreur serveur lors de la récupération du produit.');
  }
  return res.json();
}


// --- La page principale est maintenant un Server Component ---
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const data = await getProduct(params.slug);

  if (!data) {
    notFound();
  }
  const { product } = data;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Colonne de gauche : Galerie */}
        <ProductGallery images={product.images} defaultAlt={product.title} />

        {/* Colonne de droite : Informations */}
        <div className="flex flex-col">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900">
            {product.title}
          </h1>
          <p className="mt-4 text-3xl font-semibold text-gray-800">
            {formatCents(product.price_cents, product.currency)}
          </p>
          
          {/* La classe "prose" améliore la lisibilité du texte */}
          <div className="mt-6 prose prose-lg text-gray-600 max-w-none">
            <p>{product.description}</p>
          </div>
          
          <div className="mt-8 pt-8 border-t">
            <ProductInteractions product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}