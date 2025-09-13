// path: src/app/account/page.tsx
'use client';

import { useAuth } from '@/lib/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si le chargement est terminé et qu'il n'y a pas d'utilisateur,
    // le middleware devrait déjà avoir redirigé, mais c'est une sécurité supplémentaire.
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="container-page text-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="container-page max-w-2xl">
      <h1 className="text-3xl font-serif font-bold tracking-tight text-brand-dark mb-8">
        Mon Compte
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-500">Nom</h3>
            <p className="text-gray-800">{user.name || 'Non renseigné'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-500">Email</h3>
            <p className="text-gray-800">{user.email}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-500">Rôle</h3>
            <p className="text-gray-800 capitalize">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}