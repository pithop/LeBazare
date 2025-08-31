// path: /app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { setCookie } from 'cookies-next';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email et mot de passe sont requis.' },
        { status: 400 }
      );
    }

    let user: any = null;
    let role: 'admin' | 'customer' | null = null;
    
    // 1. Chercher un admin
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (admin) {
      const passwordMatch = await bcrypt.compare(password, admin.hashed_password);
      if (passwordMatch) {
        user = admin;
        role = 'admin';
      }
    }

    // 2. Si pas d'admin, chercher un client
    // NOTE: Cette partie nécessite un champ `password` sur le modèle `Customer`.
    if (!user) {
        // const customer = await prisma.customer.findUnique({ where: { email } });
        // if (customer && customer.password) { // Assumant que `password` existe
        //   const passwordMatch = await bcrypt.compare(password, customer.password);
        //   if (passwordMatch) {
        //     user = customer;
        //     role = 'customer';
        //   }
        // }
    }

    if (!user || !role) {
      return NextResponse.json(
        { message: 'Identifiants invalides.' },
        { status: 401 }
      );
    }

    // --- Génération du Token JWT ---
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' } // Le token expire dans 7 jours
    );
    
    // --- Création de la réponse et stockage du cookie ---
    const response = NextResponse.json({
        id: user.id,
        email: user.email,
        name: user.name, // `name` est sur Customer, pas sur Admin par défaut
        role: role
    }, { status: 200 });

    setCookie('auth_token', token, {
        req: request,
        res: response,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 jours
        path: '/',
    });

    return response;
  } catch (error) {
    console.error('[LOGIN_API_ERROR]', error);
    return NextResponse.json(
      { message: 'Une erreur interne est survenue.' },
      { status: 500 }
    );
  }
}