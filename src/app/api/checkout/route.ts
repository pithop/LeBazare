// path: src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

// Initialisation de Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Définition des types pour la requête
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
  // Ajoutez ici les informations client si nécessaire (ex: customerId)
  // customerInfo: { customerId: string; shippingAddressId: string; billingAddressId: string; };
}

export async function POST(request: NextRequest) {
  try {
    const { cartItems /*, customerInfo */ }: RequestBody = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: 'Le panier est vide.' }, { status: 400 });
    }

    // --- 1. Création de la commande "PENDING" en base de données ---

    // Calculez le total en centimes depuis le backend pour la sécurité
    const totalCents = cartItems.reduce(
      (acc, item) => acc + item.price_cents * item.quantity,
      0
    );

    // NOTE: Pour une application en production, vous devriez créer/récupérer
    // le client et ses adresses ici avant de créer la commande.
    const newOrder = await prisma.order.create({
      data: {
        total_cents: totalCents,
        status: 'PENDING',
        shippingAddress: {
          connect: { id: 'shippingAddressId' }, // Replace with actual shipping address ID
        },
        billingAddress: {
          connect: { id: 'billingAddressId' }, // Replace with actual billing address ID
        },
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

    // --- 2. Création de la session de paiement Stripe ---

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.title,
          // Vous pouvez ajouter plus de détails ici, comme une description ou des images
        },
        unit_amount: item.price_cents,
      },
      quantity: item.quantity,
    }));
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
      line_items: line_items,
      mode: 'payment',
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart?canceled=true`,
      // CRUCIAL: on attache l'ID de notre commande à la session Stripe
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