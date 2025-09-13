// path: src/components/ProductCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { formatCents } from '@/lib/money';
import type { Product, ProductImage, Variant } from '@prisma/client';

type ProductWithVariants = Product & {
  images: ProductImage[];
  variants: Variant[];
};

interface ProductCardProps {
  product: ProductWithVariants;
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.images?.[0];
  const hasVariants = product.variants && product.variants.length > 0;
  
  // Le texte du bouton change en fonction de la présence de variantes
  const buttonText = hasVariants ? 'Choisir des options' : 'Voir le produit';

  return (
    <div className="group text-left animate-fadeInUp" style={{ opacity: 0 }}>
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-100">
          {firstImage ? (
            <Image
              src={firstImage.url}
              alt={firstImage.alt || product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-serif text-gray-400">{product.title}</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="mt-4 flex flex-col">
        <h3 className="text-md text-brand-dark">
          <Link href={`/products/${product.slug}`}>
            {product.title}
          </Link>
        </h3>
        <p className="mt-1 text-md text-brand-gray">
          {formatCents(product.price_cents, product.currency)}
        </p>
        
        <div className="mt-4">
          <Link 
            href={`/products/${product.slug}`}
            className="w-full text-center inline-block border border-gray-300 px-4 py-2 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-dark hover:text-white"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
}