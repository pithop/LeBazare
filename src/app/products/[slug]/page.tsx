// path: src/app/products/[slug]/page.tsx
import ProductGallery from '@/components/ProductGallery';
import { formatCents } from '@/lib/money';
import { notFound } from 'next/navigation';
import type { Product, ProductImage, Variant, Category, ProductCategory } from '@prisma/client';
import ProductInteractions from '@/components/ProductInteractions';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

type ProductWithDetails = Product & {
  images: ProductImage[];
  variants: Variant[];
  categories: (ProductCategory & { category: Category })[];
};

async function getProduct(slug: string): Promise<{ product: ProductWithDetails } | null> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/products/${slug}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Erreur serveur lors de la récupération du produit.');
  }
  return res.json();
}

// Composant pour le fil d'Ariane
function Breadcrumbs({ product }: { product: ProductWithDetails }) {
    const category = product.categories?.[0]?.category;
    return (
        <nav aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-2 text-sm">
                <li>
                    <Link href="/products" className="font-medium text-gray-500 hover:text-gray-700">Produits</Link>
                </li>
                {category && (
                    <>
                        <li><ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" /></li>
                        <li>
                            <Link href={`/products?category=${category.slug}`} className="font-medium text-gray-500 hover:text-gray-700">
                                {category.name}
                            </Link>
                        </li>
                    </>
                )}
            </ol>
        </nav>
    )
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // Dans Next.js 15, params est une Promise qui doit être awaitée
  const { slug } = await params;
  const data = await getProduct(slug);

  if (!data) {
    notFound();
  }
  const { product } = data;

  return (
    <div className="bg-white">
      <div className="container-page pt-6">
        <Breadcrumbs product={product} />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
          
          <ProductGallery images={product.images} defaultAlt={product.title} />

          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900">
              {product.title}
            </h1>
            <p className="mt-3 text-3xl font-sans font-semibold text-gray-800">
              {formatCents(product.price_cents, product.currency)}
            </p>
            
            <div className="mt-6 prose prose-lg text-text-muted max-w-none">
              <p>{product.description}</p>
            </div>
            
            <div className="mt-8">
              <ProductInteractions product={product} />
            </div>

            <div className="mt-10 border-t pt-8">
                <h3 className="text-lg font-semibold font-serif text-gray-900">Caractéristiques</h3>
                <ul className="mt-4 space-y-2 text-sm text-text-muted">
                    {product.weight_g && <li>Poids : {product.weight_g / 1000} kg</li>}
                    {product.width_mm && product.length_mm && <li>Dimensions : {product.length_mm / 10}cm x {product.width_mm / 10}cm</li>}
                    <li>Temps de préparation : {product.processing_time_days} jour(s)</li>
                </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}