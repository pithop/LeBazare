// path: src/components/Footer.tsx
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container-page py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Section Newsletter */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-brand-dark">Rejoignez notre univers</h3>
            <p className="mt-2 text-sm text-brand-gray">Recevez nos offres exclusives et découvrez nos nouveautés en avant-première.</p>
            <form className="mt-4 flex">
              <input type="email" placeholder="Votre email" className="form-input flex-grow rounded-r-none" />
              <button type="submit" className="p-3 bg-brand-dark text-white rounded-r-md hover:bg-brand-gray">
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Section Liens */}
          <div>
            <h3 className="font-semibold text-brand-dark">Boutique</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/products" className="text-brand-gray hover:text-brand-dark">Collection</Link></li>
              <li><Link href="#" className="text-brand-gray hover:text-brand-dark">À propos</Link></li>
              <li><Link href="#" className="text-brand-gray hover:text-brand-dark">Contact</Link></li>
            </ul>
          </div>

          {/* Section Support */}
          <div>
            <h3 className="font-semibold text-brand-dark">Support</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="text-brand-gray hover:text-brand-dark">FAQ</Link></li>
              <li><Link href="#" className="text-brand-gray hover:text-brand-dark">Livraison & Retours</Link></li>
              <li><Link href="#" className="text-brand-gray hover:text-brand-dark">Mentions Légales</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-brand-gray">
          <p>&copy; {new Date().getFullYear()} LeBazare. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}