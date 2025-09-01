// path: src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { CubeTransparentIcon, HandRaisedIcon, GlobeAltIcon } from '@heroicons/react/24/outline'; // Nouvelles icônes plus appropriées

// La fonction getFeaturedProducts reste inchangée
async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { featured: true },
    take: 4,
    include: {
      images: { orderBy: { position: 'asc' }, take: 2 },
      variants: true,
      categories: { include: { category: true } },
    },
  });
  return products;
}

// Icônes pour la section "Engagement" - utilise les nouvelles icônes
const ValuePropIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full bg-brand-light border border-gray-200 text-brand-dark">
    {children}
  </div>
);

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {/* Section Héros "Moodboard" */}
      <section className="container-page py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-6 h-[80vh] md:h-[90vh] lg:h-[70vh]"> {/* Ajustement de la hauteur pour différents écrans */}
          {/* Cellule de Texte */}
          <div className="lg:row-span-2 flex flex-col justify-center p-6 md:p-8 bg-white rounded-lg shadow-sm"> {/* Ajout de bg-white et shadow-sm pour un effet plus premium */}
            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-brand-dark">
              L'art de vivre bohème.
            </h1>
            <p className="mt-4 text-lg text-brand-gray leading-relaxed">
              Chaque pièce est une promesse, un voyage. Découvrez des objets faits main qui ont une âme.
            </p>
            <Link href="/products" className="btn-primary mt-8 w-fit">
              Explorer la collection
            </Link>
          </div>

          {/* Image 1 (Plein cadre) */}
          <div className="relative h-full w-full rounded-lg overflow-hidden lg:col-span-1 lg:row-span-1">
            <Image
              src="https://res.cloudinary.com/dggbfnfdl/image/upload/v1756662339/miroir-dore-ovale-fes_szbken.webp"
              alt="Miroirs dorés artisanaux"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover object-center"
            />
          </div>

          {/* Image 2 (Plein cadre) */}
          <div className="relative h-full w-full rounded-lg overflow-hidden lg:col-span-1 lg:row-span-1">
             <Image
              src="https://res.cloudinary.com/dggbfnfdl/image/upload/v1756662339/suspension-raphia-soleil_vg1yhn.webp"
              alt="Suspension en raphia naturel"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover object-center"
            />
          </div>

          {/* Image 3 (Plein cadre, prend 2 colonnes) */}
          <div className="relative lg:col-span-2 h-full w-full rounded-lg overflow-hidden">
             <Image
              src="https://res.cloudinary.com/dggbfnfdl/image/upload/v1756663466/hero_jh9fut.png"
              alt="Ambiance avec des paniers et tabourets"
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Section Engagement / "Why Us?" - Mise à jour des icônes */}
      <section className="bg-brand-light">
          <div className="container-page py-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                  <div className="flex flex-col items-center">
                      <ValuePropIcon>
                        <CubeTransparentIcon className="w-8 h-8" /> {/* Icône plus "naturelle" */}
                      </ValuePropIcon>
                      <h3 className="text-xl font-semibold font-serif mt-4 text-brand-dark">100% Naturel</h3>
                      <p className="text-brand-gray mt-1">Des matériaux bruts et durables pour un intérieur sain.</p>
                  </div>
                  <div className="flex flex-col items-center">
                      <ValuePropIcon>
                        <HandRaisedIcon className="w-8 h-8" /> {/* Icône plus "fait main" */}
                      </ValuePropIcon>
                      <h3 className="text-xl font-semibold font-serif mt-4 text-brand-dark">Fait Main</h3>
                      <p className="text-brand-gray mt-1">Chaque pièce est unique, façonnée par des artisans passionnés.</p>
                  </div>
                  <div className="flex flex-col items-center">
                      <ValuePropIcon>
                        <GlobeAltIcon className="w-8 h-8" /> {/* Icône plus "internationale" */}
                      </ValuePropIcon>
                      <h3 className="text-xl font-semibold font-serif mt-4 text-brand-dark">Livraison Internationale</h3>
                      <p className="text-brand-gray mt-1">Nous expédions nos trésors partout dans le monde.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* Section Produits Mis en Avant */}
      <section className="container-page py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-serif tracking-tight text-brand-dark">Notre Sélection</h2>
          <p className="mt-2 text-brand-gray">Quelques coups de cœur choisis pour vous.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
        <div className="text-center mt-12">
            <Link href="/products" className="btn-secondary">
                Voir toute la collection
            </Link>
        </div>
      </section>
    </>
  );
}