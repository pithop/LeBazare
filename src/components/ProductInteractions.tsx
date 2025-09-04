// path: src/components/ProductInteractions.tsx
'use client';

import { useState } from 'react';
import { formatCents } from '@/lib/money';
import { useCart } from '@/lib/useCart';
import type { Product, ProductImage, Variant } from '@prisma/client';
import toast from 'react-hot-toast'; // Importer la fonction toast

type ProductWithDetails = Product & {
  images: ProductImage[];
  variants: Variant[];
};

export default function ProductInteractions({ product }: { product: ProductWithDetails }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants?.[0]?.id || null
  );

  const { addItem } = useCart();

  const handleAddToCart = () => {
    const selectedVariant = product.variants.find(v => v.id === selectedVariantId);
    const cartItemId = selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id;

    addItem({
      id: cartItemId,
      productId: product.id,
      title: product.title,
      price_cents: product.price_cents + (selectedVariant?.price_delta_cents || 0),
      image: product.images?.[0]?.url || null,
      quantity: quantity,
      variant: selectedVariant ? { id: selectedVariant.id, name: selectedVariant.name } : undefined,
    });
    
    // --- L'ANCIENNE ALERTE EST REMPLACÉE PAR CECI ---
    toast.success(`${quantity} "${product.title}" ajouté(s) au panier !`);
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
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
          className="w-20 rounded-md border-gray-300 text-center"
        />
        <button
          onClick={handleAddToCart}
          className="flex-1 rounded-md bg-brand-dark px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-dark focus:ring-offset-2"
        >
          Ajouter au panier
        </button>
      </div>
    </>
  );
}