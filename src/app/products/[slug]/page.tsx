// path: app/products/[slug]/page.tsx
import ProductGallery from '@/components/ProductGallery';
import { formatCents } from '@/lib/money';
import { notFound } from 'next/navigation';
import type { Product, ProductImage, Variant } from '@prisma/client';

// Ce composant gère l'état (quantité, variante choisie) et l'action d'ajout.
// Il doit donc être un Client Component.
'use client';
import { useState } from 'react';

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


// --- Composant Client pour les interactions ---
function ProductInteractions({ product }: { product: ProductWithDetails }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants?.[0]?.id || null
  );

  const handleAddToCart = () => {
    // Logique d'ajout au panier (ex: appeler un contexte, une API, etc.)
    console.log({
      productId: product.id,
      variantId: selectedVariantId,
      quantity,
    });
    alert(`${quantity} "${product.title}" ajouté(s) au panier !`);
  };

  return (
    <>
      {/* Sélecteur de variantes */}
      {product.variants && product.variants.length > 0 && (
        <div className="mt-4">
          <label htmlFor="variant" className="block text-sm font-medium text-gray-700">
            Option
          </label>
          <select
            id="variant"
            value={selectedVariantId || ''}
            onChange={(e) => setSelectedVariantId(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {product.variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.name} (+{formatCents(variant.price_delta_cents)})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Sélecteur de quantité et bouton d'ajout */}
      <div className="mt-6 flex items-center gap-4">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-20 border-gray-300 rounded-md text-center"
        />
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Ajouter au panier
        </button>
      </div>
    </>
  );
}

// --- La page principale reste un Server Component ---
export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getProduct(params.slug);

  if (!data) {
    notFound(); // Affiche la page 404 de Next.js
  }

  const { product } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Colonne de gauche : Galerie */}
        <ProductGallery images={product.images} defaultAlt={product.title} />

        {/* Colonne de droite : Informations */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
            {product.title}
          </h1>
          <p className="mt-4 text-2xl font-semibold text-indigo-600">
            {formatCents(product.price_cents, product.currency)}
          </p>
          <div className="mt-6 prose lg:prose-lg text-gray-600">
            <p>{product.description}</p>
          </div>
          
          <div className="mt-6 border-t pt-6">
            <ProductInteractions product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}