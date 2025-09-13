// path: src/app/api/products/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Le contexte inclut les paramètres dynamiques de la route, ici `slug`.
export async function GET(
  request: NextRequest,
  // Voici la correction. On accepte un 'context' et on en extrait les 'params'.
  // C'est la manière la plus standard et robuste.
  context: { params: { slug: string } }
) {
  try {
    const { slug } = context.params;

    if (!slug) {
      return NextResponse.json(
        { message: "Le paramètre 'slug' est manquant." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
      },
      include: {
        images: {
          orderBy: {
            position: 'asc',
          },
        },
        variants: true,
        categories: {
          include: {
            category: true, // Pour obtenir les détails de la catégorie
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: 'Produit non trouvé.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('[API_PRODUCT_SLUG_GET]', error);
    return NextResponse.json(
      { message: 'Une erreur interne est survenue.' },
      { status: 500 }
    );
  }
}