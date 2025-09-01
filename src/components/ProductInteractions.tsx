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
  const { addItem } = useCart();

  const handleAddToCart = () => {
    const selectedVariant = product.variants.find(v => v.id === selectedVariantId);
    const cartItemId = selectedVariant ? `${product.id}-${selectedVariant.id}` : `${product.id}`;
    const itemToAdd = {
      id: cartItemId,
      productId: product.id,
      title: product.title,
      price_cents: product.price_cents + (selectedVariant?.price_delta_cents || 0),
      image: product.images?.[0]?.url || null,
      variant: selectedVariant ? { id: selectedVariant.id, name: selectedVariant.name } : undefined,
      quantity,
    };
    addItem(itemToAdd);
    alert(`${quantity} "${product.title}" ajouté(s) au panier !`);
  };

  return (
    <div className="space-y-6">
      {/* Sélecteur de variantes */}
      {product.variants && product.variants.length > 0 && (
        <div>
          <label htmlFor="variant" className="form-label">
            Option
          </label>
          <select
            id="variant"
            value={selectedVariantId || ''}
            onChange={(e) => setSelectedVariantId(e.target.value)}
            className="form-input"
          >
            {product.variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.name} ({variant.price_delta_cents >= 0 ? '+' : ''}{formatCents(variant.price_delta_cents)})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Sélecteur de quantité et bouton d'ajout */}
      <div className="flex items-center gap-4">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          className="form-input w-24 text-center"
        />
        <button
          onClick={handleAddToCart}
          className="btn-primary flex-1"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}