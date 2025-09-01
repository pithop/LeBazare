// path: app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // --- Parsing des paramètres de la requête ---
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const q = searchParams.get('q');
    const category = searchParams.get('category');

    // Validation des entrées de pagination
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return NextResponse.json(
        { message: "Les paramètres 'page' et 'limit' doivent être des nombres positifs." },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // --- Construction de la clause WHERE pour Prisma ---
    const where: Prisma.ProductWhereInput = {};

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.categories = {
        some: {
          category: {
            slug: category,
          },
        },
      };
    }

    // --- Exécution des requêtes en parallèle ---
    const [items, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        take: limit,
        skip: skip,
        orderBy: { createdAt: 'desc' },
        include: {
          images: {
            orderBy: { position: 'asc' },
            take: 2,
          },
          variants: true,
          categories: { // <-- AJOUTER CECI
            include: {
              category: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // --- Réponse ---
    return NextResponse.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[API_PRODUCTS_GET]', error);
    return NextResponse.json(
      { message: 'Une erreur interne est survenue.' },
      { status: 500 }
    );
  }
}