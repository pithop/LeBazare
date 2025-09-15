// path: src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ message: 'Accès interdit' }, { status: 403 });

  try {
    const body = await request.json();
    const { title, slug, description, price_cents, categoryId, images, variants } = body;

    if (!title || !slug || !price_cents || !categoryId) {
      return NextResponse.json({ message: 'Champs requis manquants' }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price_cents: parseInt(price_cents, 10),
        categories: { create: { categoryId: categoryId } },
        images: {
          create: images.map((img: { url: string; publicId: string }, index: number) => ({
            url: img.url,
            publicId: img.publicId,
            position: index,
          })),
        },
        variants: {
          create: variants.map((v: { name: string; stock: number }) => ({
            name: v.name,
            stock: parseInt(String(v.stock), 10) || 0,
          })),
        },
      },
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
      return NextResponse.json({ message: 'Ce slug existe déjà.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Erreur interne' }, { status: 500 });
  }
}