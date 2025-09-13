// path: src/components/MobileFilters.tsx
'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import ProductFilters from './ProductFilters'; // On réutilise le même composant de filtres !
import type { Category } from '@prisma/client';

interface MobileFiltersProps {
  categories: Category[];
  totalProducts: number;
}

export default function MobileFilters({ categories, totalProducts }: MobileFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Bouton qui ouvre la modale, visible uniquement sur mobile */}
      <button
        type="button"
        className="mb-6 flex items-center gap-2 text-sm font-medium text-brand-dark lg:hidden"
        onClick={() => setOpen(true)}
      >
        <FunnelIcon className="h-5 w-5" />
        <span>Filtres & Tri</span>
      </button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          {/* Fond de la modale */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filtres</h2>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Contenu des filtres */}
                <div className="mt-4 border-t border-gray-200 px-4">
                  <ProductFilters categories={categories} totalProducts={totalProducts} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}