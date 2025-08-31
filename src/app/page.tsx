// path: src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Section Héros */}
      <section className="relative h-[60vh] flex items-center justify-center text-white bg-gray-800">
        {/* Tu mettras une belle image de fond ici */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold">L'Art de l'Artisanat Marocain</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
            Des pièces uniques, confectionnées à la main, pour une décoration authentique et chaleureuse.
          </p>
          <Link href="/products" className="mt-8 inline-block bg-white text-gray-800 font-bold py-3 px-8 rounded-md hover:bg-gray-200 transition-transform hover:scale-105">
            Découvrir la collection
          </Link>
        </div>
      </section>

      {/* Section "À propos" simple */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-serif font-bold mb-4">Notre Philosophie</h2>
        <p className="max-w-3xl mx-auto text-gray-600">
          Chez Le Bazare, chaque objet raconte une histoire. Nous collaborons directement avec des artisans talentueux pour vous offrir des créations qui ont une âme, alliant tradition et design contemporain.
        </p>
      </section>
    </div>
  );
}