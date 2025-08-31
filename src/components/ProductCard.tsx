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
      className="group block overflow-hidden border border-gray-200 rounded-lg shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-64 w-full">
        {firstImage ? (
          <Image
            src={firstImage.url}
            alt={firstImage.alt || product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">Image indisponible</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {product.title}
        </h3>
        <p className="mt-2 text-md font-bold text-indigo-600">
          {formatCents(product.price_cents, product.currency)}
        </p>
      </div>
    </Link>
  );
}