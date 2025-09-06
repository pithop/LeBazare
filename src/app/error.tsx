'use client'; // Les composants d'erreur doivent être des Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Idéalement, logger l'erreur dans un service externe (Sentry, etc.)
    console.error(error);
  }, [error]);

  return (
    <div className="container-page text-center">
      <h2 className="text-2xl font-bold font-serif text-brand-dark mt-12">
        Oups, quelque chose s'est mal passé !
      </h2>
      <p className="mt-4 text-brand-gray">
        Nous avons été notifiés de l'erreur et travaillons à sa résolution.
      </p>
      <button
        onClick={() => reset()}
        className="btn-primary mt-6"
      >
        Réessayer
      </button>
    </div>
  );
}