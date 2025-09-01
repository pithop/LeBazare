// path: src/app/(auth)/layout.tsx
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container-page flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-serif font-extrabold text-gray-900 tracking-tight">
            LeBazare
          </Link>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}