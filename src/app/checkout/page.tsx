// path: src/app/checkout/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/useCart';
import { useAuth } from '@/lib/useAuth';
import { formatCents } from '@/lib/money';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalCents, totalItems } = useCart();
  const { user } = useAuth(); // On récupère l'utilisateur connecté
  const [guestEmail, setGuestEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (totalItems === 0 && !isProcessing) {
      router.replace('/cart');
    }
  }, [totalItems, router, isProcessing]);

  const handlePayment = async () => {
    // Vérification de l'email pour les invités
    if (!user && !guestEmail) {
      setError('Veuillez entrer votre adresse email pour continuer.');
      return;
    }
    
    setError(null);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            cartItems: items,
            email: user ? undefined : guestEmail // On envoie l'email seulement si c'est un invité
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue.');
      }

      window.location.href = data.url;

    } catch (err) { // CORRECTION : Retirer ': any'
      const error = err instanceof Error ? err : new Error('Une erreur inconnue est survenue.');
      setError(error.message);
      setIsProcessing(false);
    }
  };

  if (totalItems === 0) return <p className="container-page text-center">Redirection...</p>;

  return (
    <div className="container-page max-w-2xl">
      <h1 className="text-3xl font-serif font-bold tracking-tight text-brand-dark mb-8">
        Finaliser ma commande
      </h1>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-brand-dark">Résumé de la commande</h2>
        
        <ul role="list" className="divide-y divide-gray-200 my-6">
          {items.map((item) => (
            <li key={item.id} className="flex py-4 justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{item.title} (x{item.quantity})</p>
                {item.variant && <p className="text-sm text-gray-500">{item.variant.name}</p>}
              </div>
              <p className="font-medium">{formatCents(item.price_cents * item.quantity)}</p>
            </li>
          ))}
        </ul>

        {/* Section pour l'email de l'invité */}
        {!user && (
            <div className="my-6 border-t pt-6">
                <h3 className="text-md font-medium text-brand-dark">Vos informations</h3>
                <p className="text-sm text-gray-500 mt-1">Nous utiliserons cet email pour vous envoyer la confirmation de commande.</p>
                <div className="mt-4">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input 
                        type="email" 
                        id="email"
                        className="form-input"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="vous@exemple.com"
                    />
                </div>
            </div>
        )}

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-base font-bold text-gray-900">
            <p>Total à payer</p>
            <p>{formatCents(totalCents)}</p>
          </div>
          {error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>}
          <p className="text-sm text-gray-500">
            Vous serez redirigé vers notre partenaire de paiement sécurisé Stripe.
          </p>
        </div>

        <div className="mt-6">
          <button onClick={handlePayment} disabled={isProcessing} className="btn-primary w-full">
            {isProcessing ? 'Redirection...' : `Payer ${formatCents(totalCents)}`}
          </button>
        </div>
      </div>
    </div>
  );
}