// path: src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { setCookie } from 'cookies-next';
import type { Admin, Customer } from '@prisma/client'; // AJOUT : Importer les types

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email et mot de passe sont requis.' },
        { status: 400 }
      );
    }

    // CORRECTION : Remplacer 'any' par un type plus précis
    let user: Omit<Admin, 'hashed_password'> | Omit<Customer, 'hashed_password'> | null = null;
    let role: 'admin' | 'customer' | null = null;
    
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (admin) {
      const passwordMatch = await bcrypt.compare(password, admin.hashed_password);
      if (passwordMatch) {
        const { hashed_password: _hashed_password, ...adminData } = admin;
        user = adminData;
        role = 'admin';
      }
    }

    if (!user) {
        const customer = await prisma.customer.findUnique({ where: { email } });
        if (customer) {
          const passwordMatch = await bcrypt.compare(password, customer.hashed_password);
          if (passwordMatch) {
            // CORRECTION : Préfixer la variable inutilisée avec '_'
            const { hashed_password: _hashed_password, ...customerData } = customer;
            user = customerData;
            role = 'customer';
          }
        }
    }

    if (!user || !role) {
      return NextResponse.json(
        { message: 'Identifiants invalides.' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    const response = NextResponse.json({
        ...user, // user contient déjà les bonnes données
        role: role
    }, { status: 200 });

    setCookie('auth_token', token, {
        req: request,
        res: response,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
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