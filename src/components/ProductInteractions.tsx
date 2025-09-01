// path: src/components/ProductInteractions.tsx
'use client';

import { useState } from 'react';
import { formatCents } from '@/lib/money';
import { useCart } from '@/lib/useCart'; // Importer le hook
import type { Product, ProductImage, Variant } from '@prisma/client';

// ... (Le type ProductWithDetails reste le même)

export default function ProductInteractions({ product }: { product: ProductWithDetails }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants?.[0]?.id || null
  );
  const { addItem } = useCart(); // Récupérer la fonction addItem

  const handleAddToCart = () => {
    const selectedVariant = product.variants.find(v => v.id === selectedVariantId);
    
    // Un identifiant unique pour le panier (produit + variante)
    const cartItemId = selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id;

    // L'objet à ajouter au panier
    const itemToAdd = {
      id: cartItemId,
      productId: product.id,
      title: product.title,
      price_cents: product.price_cents + (selectedVariant?.price_delta_cents || 0),
      image: product.images?.[0]?.url || null,
      variant: selectedVariant ? { id: selectedVariant.id, name: selectedVariant.name } : undefined,
      quantity,
    };

    addItem(itemToAdd); // Utiliser la fonction du store
    
    alert(`${quantity} "${product.title}" ajouté(s) au panier !`);
  };

  // ... (le JSX reste le même, juste le bouton est mis à jour)
  return (
    <>
      {/* ... sélecteur de variantes et de quantité ... */}
      <div className="mt-6 flex items-center gap-4">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          className="w-20 rounded-md border-gray-300 text-center"
        />
        <button
          onClick={handleAddToCart}
          className="btn-primary flex-1" // Utilisation de la classe personnalisée
        >
          Ajouter au panier
        </button>
      </div>
    </>
  );
}