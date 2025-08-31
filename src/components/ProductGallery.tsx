// path: components/ProductGallery.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ProductImage } from '@prisma/client';

interface ProductGalleryProps {
  images: ProductImage[];
  defaultAlt: string;
}

export default function ProductGallery({ images, defaultAlt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Aucune image</span>
      </div>
    );
  }

  const activeImage = images[activeIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Image principale */}
      <div className="aspect-square w-full relative overflow-hidden rounded-lg border">
        <Image
          key={activeImage.id} // La clé force le re-rendu et l'animation si vous en ajoutez une
          src={activeImage.url}
          alt={activeImage.alt || defaultAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover animate-fade-in"
        />
      </div>

      {/* Vignettes */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setActiveIndex(index)}
            className={`aspect-square relative overflow-hidden rounded-md border-2 transition-colors ${
              activeIndex === index ? 'border-indigo-500' : 'border-transparent hover:border-gray-300'
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt || defaultAlt}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}