// path: src/app/(auth)/layout.tsx
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // On utilise min-h-screen pour prendre toute la hauteur et centrer verticalement
    <div className="container-page flex min-h-[calc(100vh-80px)] flex-col items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-serif font-extrabold text-brand-dark tracking-tight">
            LeBazare
          </Link>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
}