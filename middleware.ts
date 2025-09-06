// path: middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Si pas de token, on redirige vers la page de connexion
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (typeof payload.role !== 'string') {
        throw new Error('Rôle manquant ou invalide dans le token');
    }

    // Protection des routes admin
    if (pathname.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error('Erreur de vérification du token dans le middleware:', err);
    const loginUrl = new URL('/login', request.url);
    // Supprimer le cookie invalide
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('auth_token');
    return response;
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*'
    ],
};