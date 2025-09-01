// path: src/app/checkout/success/page.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/useCart';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

// Un composant interne pour gérer la logique client
function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  // Vider le panier une seule fois au montage du composant
  useEffect(() => {
    // On s'assure que la redirection vient bien de Stripe avant de vider le panier
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="container-page text-center">
      <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
      <h1 className="mt-4 text-4xl font-serif font-bold tracking-tight text-gray-900">
        Merci pour votre commande !
      </h1>
      <p className="mt-4 text-lg text-text-muted">
        Votre paiement a été accepté. Un email de confirmation va vous être envoyé d'ici quelques instants.
      </p>
      <div className="mt-8">
        <Link href="/products" className="btn-primary">
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}


export default function CheckoutSuccessPage() {
  // On utilise Suspense au cas où les searchParams ne sont pas immédiatement disponibles
  return (
      <SuccessContent />
  );
}