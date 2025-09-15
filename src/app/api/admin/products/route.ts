// path: src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdmin } from '@/lib/auth'; // Nous créerons ce helper juste après

// API pour CRÉER un nouveau produit
export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ message: 'Accès interdit' }, { status: 403 });

  try {
    const body = await request.json();
    const { title, slug, description, price_cents, images, categoryId } = body;

    if (!title || !slug || !price_cents || !categoryId) {
      return NextResponse.json({ message: 'Champs requis manquants' }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price_cents: parseInt(price_cents, 10),
        images: {
          create: images.map((img: { url: string, publicId: string }, index: number) => ({
            url: img.url,
            publicId: img.publicId,
            position: index,
          })),
        },
        categories: {
          create: {
            categoryId: categoryId,
          },
        },
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('[API_ADMIN_PRODUCTS_POST]', error);
    return NextResponse.json({ message: 'Erreur interne' }, { status: 500 });
  }
}