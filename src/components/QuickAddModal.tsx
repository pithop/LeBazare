// path: src/components/QuickAddModal.tsx
'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { formatCents } from '@/lib/money';
import { useCart, CartItem } from '@/lib/useCart';
import type { Product, ProductImage, Variant } from '@prisma/client';

// On étend le type Product pour inclure les relations
type ProductWithDetails = Product & {
  images: ProductImage[];
  variants: Variant[];
};

interface QuickAddModalProps {
  product: ProductWithDetails;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickAddModal({ product, isOpen, onClose }: QuickAddModalProps) {
  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(product.variants?.[0]?.id || null);

  const handleAddToCart = () => {
    const selectedVariant = product.variants.find(v => v.id === selectedVariantId);
    if (!selectedVariant) return;

    const cartItemId = `${product.id}-${selectedVariant.id}`;
    const itemToAdd: CartItem = {
      id: cartItemId,
      productId: product.id,
      title: product.title,
      price_cents: product.price_cents + (selectedVariant.price_delta_cents || 0),
      image: product.images?.[0]?.url || null,
      variant: { id: selectedVariant.id, name: selectedVariant.name },
      quantity: 1, // Ajoute une unité par défaut
    };

    addItem(itemToAdd);
    onClose(); // Ferme la modale après l'ajout
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <Dialog.Panel className="flex w-full max-w-md transform text-left text-base transition">
                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded-lg">
                  <button
                    type="button"
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Fermer</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <div className="w-full">
                    <h2 className="text-2xl font-bold font-serif text-gray-900">{product.title}</h2>
                    
                    <div className="mt-4">
                      <label htmlFor="variant" className="form-label">
                        Sélectionnez une option
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

                    <button
                      onClick={handleAddToCart}
                      className="btn-primary w-full mt-6"
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}