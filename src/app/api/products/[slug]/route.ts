// path: src/app/api/products/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

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
            category: true,
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