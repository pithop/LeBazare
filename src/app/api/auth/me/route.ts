// path: src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // CORRECTION : On utilise la méthode native de Next.js
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

interface JwtPayload {
  userId: string;
  email: string;
  role: 'admin' | 'customer';
}

export async function GET(request: NextRequest) {
  try {
    // CORRECTION : On utilise cookies() pour récupérer le token de manière fiable
    const token = cookies().get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded !== 'object' || !('userId' in decoded) || !('role' in decoded)) {
      throw new Error('Token malformé');
    }
    
    const payload = decoded as JwtPayload;
    let user = null;

    if (payload.role === 'admin') {
      user = await prisma.admin.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, role: true },
      });
    } else if (payload.role === 'customer') {
      user = await prisma.customer.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, name: true },
      });
    }

    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ user: { ...user, role: payload.role } });

  } catch (error) {
    // Ce catch gère les erreurs de jwt.verify (token invalide/expiré) et autres erreurs
    return NextResponse.json({ message: 'Token invalide ou expiré' }, { status: 401 });
  }
}