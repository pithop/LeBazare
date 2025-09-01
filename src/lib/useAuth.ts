// path: src/lib/useAuth.ts
'use client';

import { create } from 'zustand';

// Définition du type pour les informations de l'utilisateur
interface User {
  id: string;
  name: string | null;
  email: string;
  role: 'customer' | 'admin';
}

// Définition du type pour l'état d'authentification
interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  checkUserStatus: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // On commence en chargement pour vérifier le statut au démarrage
  
  // Action pour définir l'utilisateur
  setUser: (user) => set({ user, isLoading: false }),

  // Action pour vérifier si un utilisateur est déjà connecté via le cookie
  checkUserStatus: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const { user } = await response.json();
        set({ user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du statut de l'utilisateur", error);
      set({ user: null, isLoading: false });
    }
  },
}));