// path: components/ProductCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { formatCents } from '@/lib/money';

// Définition simplifiée du type pour les props du composant
interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    title: string;
    price_cents: number;
    currency: string;
    images: {
      url: string;
      alt: string | null;
    }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.images?.[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden transition-all duration-300"
    >
      {/* Conteneur d'image avec un fond et un ratio fixe */}
      <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
        {firstImage ? (
          <Image
            src={firstImage.url}
            alt={firstImage.alt || product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          // Placeholder stylisé si pas d'image
          <div className="h-full w-full flex items-center justify-center">
            <span className="text-gray-400 font-serif">{product.title}</span>
          </div>
        )}
      </div>

      {/* Informations produit */}
      <div className="mt-3">
        <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
        <p className="mt-1 text-md font-bold text-gray-900">
          {formatCents(product.price_cents, product.currency)}
        </p>
      </div>
    </Link>
  );
}