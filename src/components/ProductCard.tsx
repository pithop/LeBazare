// path: src/components/ProductCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCents } from '@/lib/money';
import { useCart, CartItem } from '@/lib/useCart';
import QuickAddModal from './QuickAddModal';
import { PlusIcon } from '@heroicons/react/24/outline';
import type { Product, ProductImage, Variant, Category, ProductCategory } from '@prisma/client';

// On enrichit le type pour inclure la catégorie (assurez-vous que votre API la fournit)
type ProductWithDetails = Product & {
  images: ProductImage[];
  variants: Variant[];
  categories: (ProductCategory & { category: Category })[];
};

interface ProductCardProps {
  product: ProductWithDetails;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const firstImage = product.images?.[0];
  const categoryName = product.categories?.[0]?.category.name;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Empêche la navigation via le Link parent
    e.stopPropagation(); // Empêche l'événement de se propager au Link parent
    
    if (!product.variants || product.variants.length === 0) {
      const itemToAdd: Omit<CartItem, 'quantity'> = {
        id: product.id,
        productId: product.id,
        title: product.title,
        price_cents: product.price_cents,
        image: firstImage?.url || null,
      };
      addItem(itemToAdd);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="group relative">
        <Link href={`/products/${product.slug}`}>
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 relative">
            {firstImage ? (
              <Image
                src={firstImage.url}
                alt={firstImage.alt || product.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <span className="text-gray-500 font-serif">{product.title}</span>
              </div>
            )}
             
            {/* Bouton d'ajout rapide - apparaît au survol */}
             <div 
                onClick={handleQuickAdd}
                className="absolute bottom-4 right-4 flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full text-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out hover:bg-white hover:scale-110 cursor-pointer"
                title="Ajouter au panier"
             >
                <PlusIcon className="h-5 w-5" />
             </div>
          </div>
        
          <div className="mt-4">
            {/* Nom de la catégorie - apparaît au survol */}
            {categoryName && (
                <p className="text-sm text-gray-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {categoryName}
                </p>
            )}
            <h3 className="text-lg text-gray-800 font-medium">
                {product.title}
            </h3>
            <p className="mt-1 text-xl font-semibold text-gray-900">
              {formatCents(product.price_cents, product.currency)}
            </p>
          </div>
        </Link>
      </div>
      
      {product.variants && product.variants.length > 0 && (
          <QuickAddModal product={product} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}