// path: src/app/page.tsx
export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header de test */}
      <header className="mb-12">
        <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          LeBazare
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Si vous voyez ce texte stylisé, Tailwind fonctionne ! 🎉
        </p>
      </header>

      {/* Grille de test des couleurs */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Test des Couleurs</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-red-500 text-white p-6 rounded-lg text-center font-bold shadow-lg">
            Rouge
          </div>
          <div className="bg-green-500 text-white p-6 rounded-lg text-center font-bold shadow-lg">
            Vert
          </div>
          <div className="bg-blue-500 text-white p-6 rounded-lg text-center font-bold shadow-lg">
            Bleu
          </div>
          <div className="bg-yellow-500 text-white p-6 rounded-lg text-center font-bold shadow-lg">
            Jaune
          </div>
        </div>
      </section>

      {/* Test des composants */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Composants LeBazare</h2>
        <div className="space-y-4">
          {/* Card produit test */}
          <div className="product-card p-6">
            <h3 className="text-xl font-semibold mb-2">Produit Test</h3>
            <p className="text-gray-600 mb-4">
              Description du produit avec styles Tailwind
            </p>
            <button className="btn-primary">
              Ajouter au panier
            </button>
          </div>
          
          {/* Test du responsive */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl">
              Texte responsive (change selon la taille de l'écran)
            </p>
          </div>
        </div>
      </section>

      {/* Test des animations */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Test Animation</h2>
        <div className="h-20 animate-shimmer rounded-lg"></div>
      </section>
    </main>
  )
}