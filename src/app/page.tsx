// path: src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <>
      {/* Section Héros */}
      <section className="relative h-[70vh] flex items-center justify-center text-center bg-gray-200 overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dggbfnfdl/image/upload/v1756663466/hero_jh9fut.png"
          alt="Artisanat Marocain"
          fill
          className="object-cover animate-slide-hero"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-white p-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold">
            L'Art de l'Artisanat Marocain
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
            Des pièces uniques, confectionnées à la main, pour une décoration authentique et chaleureuse.
          </p>
          <Link href="/products" className="btn-primary mt-8 inline-block">
            Découvrir la collection
          </Link>
        </div>
      </section>

      {/* Section Philosophie */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-serif font-bold mb-4 text-gray-800">Notre Philosophie</h2>
        <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed">
          Chez Le Bazare, chaque objet raconte une histoire. Nous collaborons directement avec des artisans talentueux pour vous offrir des créations qui ont une âme, alliant tradition et design contemporain.
        </p>
      </section>
    </>
  );
}