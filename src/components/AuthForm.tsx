// path: src/components/AuthForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isLogin = mode === 'login';
  const apiUrl = isLogin ? '/api/auth/login' : '/api/auth/signup';
  const buttonText = isLogin ? 'Se connecter' : "S'inscrire";

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: isLogin ? undefined : name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Une erreur est survenue.');
      }
      
      setUser(isLogin ? data : data.customer);
      toast.success(isLogin ? 'Connexion réussie !' : 'Compte créé avec succès !');
      router.push('/products');

    } catch (err) { // CORRECTION : Retirer ': any'
      const error = err instanceof Error ? err : new Error('Une erreur est survenue.');
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 font-serif">
        {isLogin ? 'Bienvenue' : 'Créer un compte'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CORRECTION : Chaque champ est maintenant dans sa propre div */}
        {!isLogin && (
          <div>
            <label className="form-label" htmlFor="name">
              Nom complet
            </label>
            <input
              className="form-input"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            className="form-input"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="form-label" htmlFor="password">
            Mot de passe
          </label>
          <input
            className="form-input"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <div>
          <button
            className="btn-primary w-full"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Chargement...' : buttonText}
          </button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        {isLogin ? "Pas encore de compte ?" : 'Déjà un compte ?'}
        <Link href={isLogin ? '/signup' : '/login'} className="font-semibold text-brand-accent hover:text-brand-dark ml-1">
          {isLogin ? "Inscrivez-vous" : 'Connectez-vous'}
        </Link>
      </p>
    </div>
  );
}