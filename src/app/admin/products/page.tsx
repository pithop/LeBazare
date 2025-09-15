// path: src/app/admin/products/page.tsx
'use client';

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import ProductForm from '@/components/admin/ProductForm';
import type { Product, Category } from '@prisma/client';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour charger toutes les données nécessaires
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories') // Assurez-vous que cette route API existe
      ]);
      if (!productsRes.ok || !categoriesRes.ok) throw new Error("Erreur réseau");
      
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      setProducts(productsData.items || []);
      setCategories(categoriesData || []);
    } catch (error) {
      toast.error("Erreur de chargement des données.");
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les données au premier rendu
  useEffect(() => {
    fetchData();
  }, []);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  // C'est cette fonction que le formulaire utilisera pour communiquer
  const onProductCreated = () => {
    closeModal();
    toast.success('La liste va être rafraîchie...');
    fetchData(); // Rafraîchit la liste des produits
  };

  if (isLoading) return <div className="text-center p-12">Chargement...</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produits ({products.length})</h1>
        <button onClick={openModal} className="btn-primary">
          Ajouter un produit
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        {/* Ici, vous afficherez la liste de vos produits dans un tableau */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(p => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap">{p.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{(p.price_cents / 100).toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fenêtre Modale pour Ajouter un Produit */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={closeModal}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-3xl transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900 p-6 border-b">
                    Ajouter un nouveau produit
                  </Dialog.Title>
                  <div className="p-6">
                    {/* On passe les catégories ET la fonction onProductCreated au formulaire */}
                    <ProductForm categories={categories} onProductCreated={onProductCreated} />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}