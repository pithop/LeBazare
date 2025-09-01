// path: src/app/cart/page.tsx
'use client';

import { useState } from 'react';
import { useCart } from '@/lib/useCart';
import { formatCents } from '@/lib/money';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { TrashIcon, ShoppingBagIcon, XCircleIcon } from '@heroicons/react/24/outline';

// Message affiché si l'utilisateur annule depuis la page Stripe
function CancellationMessage() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="rounded-md bg-yellow-50 p-4 mb-6 border border-yellow-200">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">Commande annulée</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Votre session de paiement a été annulée. Votre panier a été conservé si vous souhaitez réessayer.
            </p>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <button onClick={() => setIsVisible(false)} className="-mx-1.5 -my-1.5 p-1.5 rounded-md text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50">
            <span className="sr-only">Fermer</span>
            <XCircleIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, totalItems, totalCents, updateItemQuantity, removeItem } = useCart();
  
  const isCanceled = searchParams.get('canceled') === 'true';

  // Scénario où le panier est vide
  if (items.length === 0) {
    return (
      <div className="container-page text-center">
        <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 font-serif">
          Votre panier est vide
        </h1>
        <p className="mt-2 text-text-muted">
          Il semble que vous n'ayez encore rien ajouté.
        </p>
        <div className="mt-6">
          <Link href="/products" className="btn-primary">
            Découvrir nos produits
          </Link>
        </div>
      </div>
    );
  }

  // Affichage du panier avec des articles
  return (
    <div className="bg-white">
      <div className="container-page">
        {isCanceled && <CancellationMessage />}
        <h1 className="text-3xl font-serif font-bold tracking-tight text-gray-900 sm:text-4xl">
          Mon Panier
        </h1>

        <div className="mt-10 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
          {/* Liste des articles */}
          <section className="lg:col-span-7">
            <ul role="list" className="divide-y divide-gray-200 border-y border-gray-200">
              {items.map((item) => (
                <li key={item.id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                    <Image
                      src={item.image || '/placeholder.svg'}
                      alt={item.title}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3><Link href={`/products/${item.productId}`}>{item.title}</Link></h3>
                        <p className="ml-4">{formatCents(item.price_cents * item.quantity)}</p>
                      </div>
                      {item.variant && <p className="mt-1 text-sm text-gray-500">{item.variant.name}</p>}
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <label htmlFor={`quantity-${item.id}`} className="sr-only">Quantité</label>
                        <input
                          id={`quantity-${item.id}`}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value))}
                          className="form-input w-20 text-center"
                        />
                      </div>
                      <div className="flex">
                        <button type="button" onClick={() => removeItem(item.id)} className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1">
                          <TrashIcon className="h-4 w-4" />
                          <span>Retirer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Résumé de la commande */}
          <section className="lg:col-span-5 mt-10 lg:mt-0">
            <div className="rounded-lg border bg-gray-50 p-6 shadow-sm">
              <h2 className="text-lg font-medium text-gray-900">Résumé</h2>
              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Sous-total ({totalItems} articles)</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatCents(totalCents)}</dd>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <dt>Livraison</dt>
                  <dd>Calculée à l'étape suivante</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-bold text-gray-900">Total</dt>
                  <dd className="text-base font-bold text-gray-900">{formatCents(totalCents)}</dd>
                </div>
              </dl>
              <div className="mt-6">
                <button onClick={() => router.push('/checkout')} className="btn-primary w-full">
                  Passer la commande
                </button>
              </div>
              <div className="mt-4 text-center">
                <Link href="/products" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}