// path: src/lib/auth.ts
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function verifyAdmin(request: NextRequest) {
  const token = (await cookies()).get('auth_token')?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role === 'admin') {
      return payload; // Succès : retourne les infos de l'admin
    }
    return null;
  } catch (e) {
    return null;
  }
}