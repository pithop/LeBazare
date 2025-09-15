// path: src/app/api/categories/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}