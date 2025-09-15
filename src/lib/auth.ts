// path: src/lib/auth.ts
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function verifyAdmin(request: NextRequest) {
  // CORRECTION : On attend que la Promise se résolve pour obtenir le 'cookie store'
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role === 'admin') {
      return payload; // Retourne les infos de l'admin si la vérification est réussie
    }
    return null;
  } catch (e) {
    return null;
  }
}