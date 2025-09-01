// path: src/app/checkout/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/useCart';
import { formatCents } from '@/lib/money';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalCents, totalItems } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (totalItems === 0 && !isProcessing) {
      router.replace('/cart');
    }
  }, [totalItems, router, isProcessing]);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: items }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue.');
      }

      window.location.href = data.url; // Redirection complète vers Stripe

    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      alert('Impossible de procéder au paiement. Veuillez réessayer.');
      setIsProcessing(false);
    }
  };

  if (totalItems === 0) {
    return <p className="text-center p-12">Redirection...</p>;
  }

  return (
    <div className="container-page max-w-2xl">
      <h1 className="text-3xl font-serif font-bold tracking-tight text-gray-900 mb-8">
        Finaliser ma commande
      </h1>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900">Résumé</h2>
        
        <ul role="list" className="divide-y divide-gray-200 my-6">
          {items.map((item) => (
            <li key={item.id} className="flex py-4 justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{item.title} (x{item.quantity})</p>
                {item.variant && <p className="text-sm text-text-muted">{item.variant.name}</p>}
              </div>
              <p className="font-medium">{formatCents(item.price_cents * item.quantity)}</p>
            </li>
          ))}
        </ul>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-base font-bold text-gray-900">
            <p>Total à payer</p>
            <p>{formatCents(totalCents)}</p>
          </div>
          <p className="text-sm text-text-muted">
            Vous serez redirigé vers notre partenaire de paiement sécurisé Stripe.
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="btn-primary w-full"
          >
            {isProcessing ? 'Redirection en cours...' : `Payer ${formatCents(totalCents)}`}
          </button>
        </div>
      </div>
    </div>
  );
}