// path: app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // --- Parsing des paramètres ---
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort'); // Nouveau: paramètre de tri

    const skip = (page - 1) * limit;

    // --- Construction de la clause WHERE (filtre) ---
    const where: Prisma.ProductWhereInput = {};
    if (category) {
      where.categories = {
        some: {
          category: { slug: category },
        },
      };
    }
    // Note : Pour la disponibilité ou la couleur, il faudrait ajouter des champs au schéma Prisma.

    // --- Construction de la clause ORDER BY (tri) ---
    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sort === 'price-asc') {
      orderBy.price_cents = 'asc';
    } else if (sort === 'price-desc') {
      orderBy.price_cents = 'desc';
    } else {
      orderBy.createdAt = 'desc'; // Tri par défaut
    }

    // --- Exécution des requêtes ---
    const [items, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        take: limit,
        skip: skip,
        orderBy, // Utilisation de notre nouvelle clause de tri
        include: {
          images: {
            orderBy: { position: 'asc' },
            take: 1,
          },
          // On inclut les variants pour savoir si on doit afficher "Choisir des options"
          variants: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

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