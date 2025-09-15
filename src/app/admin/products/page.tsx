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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories') // Assurez-vous de créer cette route API simple
      ]);
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

  useEffect(() => {
    fetchData();
  }, []);

  const onProductCreated = () => {
    setIsOpen(false);
    fetchData(); // Rafraîchit la liste
  };

  if (isLoading) return <div className="text-center p-12">Chargement des produits...</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produits ({products.length})</h1>
        <button onClick={() => setIsOpen(true)} className="btn-primary">Ajouter un produit</button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* ... (votre code de tableau ici) ... */}
        </table>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={() => setIsOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-3xl transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900 p-6 border-b">Ajouter un nouveau produit</Dialog.Title>
                  <ProductForm categories={categories} onProductCreated={onProductCreated} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}