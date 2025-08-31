// path: app/cart/page.tsx
'use client';

import { useCart } from '@/lib/useCart';
import { formatCents } from '@/lib/money';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const router = useRouter();
  const { items, totalItems, totalCents, updateItemQuantity, removeItem } = useCart();

  const handleCheckout = () => {
    // Redirige vers la page de paiement. Cette page récupérera le panier depuis le même hook.
    router.push('/checkout');
  };
  
  // Scénario où le panier est vide
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Votre panier est vide</h1>
        <p className="text-gray-600 mb-6">Il semble que vous n'ayez encore rien ajouté.</p>
        <Link href="/products" className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors">
          Découvrir nos produits
        </Link>
      </div>
    );
  }

  // Affichage du panier avec des articles
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">Mon Panier</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Liste des articles */}
        <div className="lg:col-span-2">
          <ul role="list" className="divide-y divide-gray-200 border-y">
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
                        className="w-16 rounded-md border-gray-300 text-center"
                      />
                    </div>
                    <div className="flex">
                      <button type="button" onClick={() => removeItem(item.id)} className="font-medium text-indigo-600 hover:text-indigo-500">
                        Retirer
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Résumé de la commande */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">Résumé</h2>
            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Sous-total ({totalItems} articles)</dt>
                <dd className="text-sm font-medium text-gray-900">{formatCents(totalCents)}</dd>
              </div>
              {/* Ajoutez ici les lignes pour la livraison, taxes, etc. */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Total</dt>
                <dd className="text-base font-medium text-gray-900">{formatCents(totalCents)}</dd>
              </div>
            </dl>
            <div className="mt-6">
              <button onClick={handleCheckout} className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors">
                Passer la commande
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}