// path: src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import { CubeTransparentIcon, HandRaisedIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { featured: true },
    take: 4,
    include: {
      images: { orderBy: { position: 'asc' }, take: 1 },
      variants: true,
    },
  });
  return products;
}

const ValuePropIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-brand-dark shadow-sm">
    {children}
  </div>
);

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {/* Section Héros "Moodboard" */}
      <section className="container-page py-12 md:py-16">
        <div className="grid h-[70vh] grid-cols-1 gap-6 lg:grid-cols-3 lg:grid-rows-2">
          {/* Cellule de Texte avec animation */}
          <div
            className="flex animate-fadeInUp flex-col justify-center rounded-lg bg-white/60 p-8 shadow-sm backdrop-blur-sm lg:row-span-2"
            style={{ animationDelay: '0.2s', opacity: 0 }} // opacity:0 est essentiel pour que l'animation soit visible
          >
            <h1 className="text-4xl font-bold tracking-tight text-brand-dark md:text-5xl">
              L&apos;art de vivre bohème.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-brand-gray">
              Chaque pièce est une promesse, un voyage. Découvrez des objets faits main qui ont une âme.
            </p>
            <Link href="/products" className="btn-primary mt-8 w-fit">
              Explorer la collection
            </Link>
          </div>

          {/* Images avec effet de survol */}
          <div className="relative h-full w-full overflow-hidden rounded-lg shadow-md transition-transform duration-500 ease-in-out hover:scale-[1.03]">
            <Image
              src="https://res.cloudinary.com/dggbfnfdl/image/upload/v1757854753/Gemini_Generated_Image_dp0xqhdp0xqhdp0x_jnaedt.png"
              alt="Suspension en raphia naturel dans un intérieur lumineux"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover object-center"
              priority // Important pour le LCP (Largest Contentful Paint)
            />
          </div>
          <div className="relative h-full w-full overflow-hidden rounded-lg shadow-md transition-transform duration-500 ease-in-out hover:scale-[1.03]">
            <Image
              src="https://res.cloudinary.com/dggbfnfdl/image/upload/v1757854754/Gemini_Generated_Image_mmaogfmmaogfmmao_mukgwr.png"
              alt="Miroir doré ovale artisanal"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover object-center"
            />
          </div>
          <div className="relative h-full w-full overflow-hidden rounded-lg shadow-md transition-transform duration-500 ease-in-out lg:col-span-2 hover:scale-[1.03]">
            <Image
              src="https://res.cloudinary.com/dggbfnfdl/image/upload/v1757854752/WhatsApp_Image_2025-09-06_at_20.22.31_f90eyy.jpg"
              alt="Ambiance intérieure avec des paniers et tabourets artisanaux"
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Section Engagement / "Why Us?" */}
      <section className="bg-white">
        <div
          className="container-page animate-fadeInUp py-16 md:py-20"
          style={{ animationDelay: '0.4s', opacity: 0 }}
        >
          <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3">
            <div className="flex flex-col items-center">
              <ValuePropIcon><CubeTransparentIcon className="h-8 w-8" /></ValuePropIcon>
              <h3 className="mt-5 text-xl font-semibold text-brand-dark">100% Naturel</h3>
              <p className="mt-2 text-brand-gray">Des matériaux bruts et durables pour un intérieur sain.</p>
            </div>
            <div className="flex flex-col items-center">
              <ValuePropIcon><HandRaisedIcon className="h-8 w-8" /></ValuePropIcon>
              <h3 className="mt-5 text-xl font-semibold text-brand-dark">Fait Main</h3>
              <p className="mt-2 text-brand-gray">Chaque pièce est unique, façonnée par des artisans passionnés.</p>
            </div>
            <div className="flex flex-col items-center">
              <ValuePropIcon><GlobeAltIcon className="h-8 w-8" /></ValuePropIcon>
              <h3 className="mt-5 text-xl font-semibold text-brand-dark">Éthique & Responsable</h3>
              <p className="mt-2 text-brand-gray">Nous collaborons directement avec les artisans pour un commerce équitable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Produits Mis en Avant */}
      <section
        className="container-page animate-fadeInUp py-16 md:py-20"
        style={{ animationDelay: '0.6s', opacity: 0 }}
      >
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-brand-dark lg:text-4xl">Notre Sélection</h2>
          <p className="mt-3 text-lg text-brand-gray">Quelques coups de cœur choisis pour vous.</p>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link href="/products" className="btn-secondary">
            Voir toute la collection
          </Link>
        </div>
      </section>
    </>
  );
}