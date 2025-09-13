// path: lib/useCart.ts
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Définition du type pour un article dans le panier
export interface CartItem {
  id: string; // ID combiné du produit et de la variante si elle existe
  productId: string;
  title: string;
  price_cents: number;
  image: string | null;
  quantity: number;
  variant?: {
    id:string;
    name: string;
  };
}

// Définition du type pour l'état public du panier (ce que les composants voient)
interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalCents: number;
}


export const useCart = create<CartState>()(
  persist(
    (set, get) => {
      // --- Fonction utilitaire interne ---
      // On la définit ici pour qu'elle soit accessible par toutes les actions
      const calculateTotals = (items: CartItem[]) => {
        const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
        const totalCents = items.reduce(
          (acc, item) => acc + item.price_cents * item.quantity,
          0
        );
        return { totalItems, totalCents };
      };

      // --- État initial et actions publiques ---
      return {
        items: [],
        totalItems: 0,
        totalCents: 0,
        
        addItem: (itemToAdd) => {
          const items = get().items;
          const existingItem = items.find((item) => item.id === itemToAdd.id);
          let updatedItems;

          if (existingItem) {
            updatedItems = items.map((item) =>
              item.id === itemToAdd.id
                ? { ...item, quantity: item.quantity + (itemToAdd.quantity || 1) }
                : item
            );
          } else {
            updatedItems = [...items, { ...itemToAdd, quantity: itemToAdd.quantity || 1 }];
          }

          set({
            items: updatedItems,
            ...calculateTotals(updatedItems), // Appel direct de l'utilitaire
          });
        },

        removeItem: (itemId) => {
          const updatedItems = get().items.filter((item) => item.id !== itemId);
          set({
            items: updatedItems,
            ...calculateTotals(updatedItems), // Appel direct
          });
        },
        
        updateItemQuantity: (itemId, quantity) => {
          const updatedItems = quantity > 0
            ? get().items.map((item) => item.id === itemId ? { ...item, quantity } : item)
            : get().items.filter((item) => item.id !== itemId);
          
          set({
            items: updatedItems,
            ...calculateTotals(updatedItems), // Appel direct
          });
        },

        clearCart: () => {
          set({ items: [], totalItems: 0, totalCents: 0 });
        },
      };
    },
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      // La réhydratation doit maintenant se faire avec une fonction externe au state
      onRehydrateStorage: () => (state) => {
        if (state) {
          const { totalItems, totalCents } = state.items.reduce(
            (acc, item) => {
              acc.totalItems += item.quantity;
              acc.totalCents += item.price_cents * item.quantity;
              return acc;
            },
            { totalItems: 0, totalCents: 0 }
          );
          state.totalItems = totalItems;
          state.totalCents = totalCents;
        }
      }
    }
  )
);