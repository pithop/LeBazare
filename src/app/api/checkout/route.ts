// path: src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  price_cents: number;
  quantity: number;
}

interface RequestBody {
  cartItems: CartItem[];
}

export async function POST(request: NextRequest) {
  try {
    const { cartItems }: RequestBody = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: 'Le panier est vide.' }, { status: 400 });
    }

    // --- SOLUTION TEMPORAIRE : Création d'un client et d'une adresse de substitution ---
    // En production, ces données viendraient de l'utilisateur authentifié.
    const customer = await prisma.customer.upsert({
      where: { email: 'placeholder-customer@lebazare.fr' },
      update: {},
      create: {
        email: 'placeholder-customer@lebazare.fr',
        name: 'Client Test',
        hashed_password: 'not-applicable', // Requis par le schéma mais non utilisé ici
      },
    });

    // On crée une nouvelle adresse à chaque fois pour cet exemple.
    // En production, on réutiliserait une adresse existante du client.
    const address = await prisma.address.create({
      data: {
        customerId: customer.id,
        type: 'SHIPPING',
        line1: '123 Rue du Test',
        city: 'Paris',
        postalCode: '75001',
        country: 'FR',
      },
    });
    // --- FIN DE LA SOLUTION TEMPORAIRE ---


    const totalCents = cartItems.reduce(
      (acc, item) => acc + item.price_cents * item.quantity,
      0
    );

    const newOrder = await prisma.order.create({
      data: {
        total_cents: totalCents,
        status: 'PENDING',
        customerId: customer.id,          // <-- Utilise l'ID du client de substitution
        shippingAddressId: address.id, // <-- Utilise l'ID de l'adresse réelle
        billingAddressId: address.id,  // <-- On utilise la même pour la facturation
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            qty: item.quantity,
            price_cents: item.price_cents,
          })),
        },
      },
    });

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.title,
        },
        unit_amount: item.price_cents,
      },
      quantity: item.quantity,
    }));
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart?canceled=true`,
      metadata: {
        orderId: newOrder.id,
      },
    });

    if (!session.url) {
      throw new Error('La création de la session Stripe a échoué.');
    }

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la création du paiement.' },
      { status: 500 }
    );
  }
}