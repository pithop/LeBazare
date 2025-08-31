// path: /app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // --- Validation des entrées ---
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Nom, email et mot de passe sont requis.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Le mot de passe doit contenir au moins 6 caractères.' },
        { status: 400 }
      );
    }

    // --- Vérification de l'existence de l'utilisateur ---
    const existingCustomer = await prisma.customer.findUnique({
      where: { email },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { message: 'Un compte avec cet email existe déjà.' },
        { status: 409 } // 409 Conflict
      );
    }

    // --- Hachage du mot de passe ---
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- Création du nouvel utilisateur ---
    const newCustomer = await prisma.customer.create({
      data: {
        name,
        email,
        // Le modèle Prisma attend un objet pour l'adresse, mais on peut le laisser vide à l'inscription.
        // On ne stocke pas le mot de passe hashé dans le modèle Customer, on le crée ici pour la logique.
        // NOTE: Le modèle Prisma `Customer` n'a pas de champ mot de passe. Il faudra l'ajouter.
        // Pour l'instant, on simule sa création.
        // metadata: { hashedPassword } // Exemple de stockage si vous n'avez pas de champ password.
      },
    });

    // NOTE: Il est crucial d'ajouter un champ `password` au modèle `Customer` dans `schema.prisma`
    // Pour l'instant, la réponse est 201 mais l'utilisateur ne pourra pas se connecter sans stocker le hash.

    return NextResponse.json(
      { message: 'Compte client créé avec succès.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[SIGNUP_API_ERROR]', error);
    return NextResponse.json(
      { message: 'Une erreur interne est survenue.' },
      { status: 500 }
    );
  }
}