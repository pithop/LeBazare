// path: src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

interface CartItem {
  id: string;
  productId: string;
  variant?: { id: string };
  title: string;
  price_cents: number;
  quantity: number;
}

interface RequestBody {
  cartItems: CartItem[];
  email?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { cartItems, email: guestEmail }: RequestBody = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: 'Le panier est vide.' }, { status: 400 });
    }

    let customer;

    // CORRECTION : On ajoute 'await' pour attendre la résolution de la Promise
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (token) {
      // --- CAS 1 : UTILISATEUR CONNECTÉ ---
      const { payload } = await jwtVerify(token, secret);
      const userId = payload.userId as string;
      customer = await prisma.customer.findUnique({ where: { id: userId } });

      if (!customer) {
        throw new Error('Client authentifié non trouvé.');
      }

    } else if (guestEmail) {
      // --- CAS 2 : INVITÉ ---
      customer = await prisma.customer.upsert({
        where: { email: guestEmail },
        update: {},
        create: {
          email: guestEmail,
          name: 'Client Invité',
          hashed_password: randomBytes(16).toString('hex'),
        },
      });
    } else {
      return NextResponse.json({ message: 'Informations client manquantes pour la commande.' }, { status: 400 });
    }

    // --- LOGIQUE COMMUNE ---
    const shippingAddress = await prisma.address.findFirst({
        where: { customerId: customer.id, type: 'SHIPPING' },
    }) || await prisma.address.create({
        data: {
            customerId: customer.id,
            type: 'SHIPPING',
            line1: 'Adresse à compléter', city: 'Inconnue', postalCode: '00000', country: 'FR',
        },
    });

    const totalCents = cartItems.reduce((acc, item) => acc + item.price_cents * item.quantity, 0);

    const newOrder = await prisma.order.create({
      data: {
        total_cents: totalCents,
        status: 'PENDING',
        customerId: customer.id,
        shippingAddressId: shippingAddress.id,
        billingAddressId: shippingAddress.id,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            variantId: item.variant?.id,
            qty: item.quantity,
            price_cents: item.price_cents,
          })),
        },
      },
    });
    
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: { name: item.title },
        unit_amount: item.price_cents,
      },
      quantity: item.quantity,
    }));

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart?canceled=true`,
      customer_email: customer.email,
      metadata: { orderId: newOrder.id },
    });
    
    if (!session.url) {
      throw new Error('La création de la session Stripe a échoué.');
    }

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur interne est survenue.';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}