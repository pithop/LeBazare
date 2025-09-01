// path: src/components/AuthForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import Link from 'next/link';

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
      router.push('/products');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {isLogin ? 'Bienvenue' : 'Créez votre compte'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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
            className="btn-primary w-full disabled:opacity-50"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Chargement...' : buttonText}
          </button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        {isLogin ? "Pas encore de compte ?" : 'Déjà un compte ?'}
        <Link href={isLogin ? '/signup' : '/login'} className="font-semibold ml-1">
          {isLogin ? "Inscrivez-vous" : 'Connectez-vous'}
        </Link>
      </p>
    </div>
  );
}