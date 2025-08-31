// path: src/components/ProductInteractions.tsx
'use client';

import { useState } from 'react';
import { formatCents } from '@/lib/money';
import { useCart } from '@/lib/useCart';
import type { Product, ProductImage, Variant } from '@prisma/client';

type ProductWithDetails = Product & {
  images: ProductImage[];
  variants: Variant[];
};

export default function ProductInteractions({ product }: { product: ProductWithDetails }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants?.[0]?.id || null
  );

  // On récupère la fonction pour ajouter au panier depuis notre hook
  const { addItem } = useCart();

  const handleAddToCart = () => {
    const selectedVariant = product.variants.find(v => v.id === selectedVariantId);
    
    // On crée l'identifiant unique pour le panier
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
  className="flex-1 bg-gray-800 text-white font-semibold py-3 px-6 rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
>
  Ajouter au panier
</button>
      </div>
    </>
  );
}