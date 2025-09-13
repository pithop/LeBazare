// path: src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  // --- 1. Sécurité : Vérification de la signature du webhook ---
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown webhook error';
    console.error(`❌ Erreur de vérification du webhook: ${message}`);
    return NextResponse.json({ message: `Webhook Error: ${message}` }, { status: 400 });
  }

  // --- 2. Traitement des événements ---

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;

  // Événement principal pour confirmer une commande
  if (event.type === 'checkout.session.completed') {
    if (!orderId) {
      console.error('❌ orderId manquant dans les métadonnées de la session Stripe.');
      return NextResponse.json({ message: 'Metadata manquante.' }, { status: 400 });
    }

    try {
      // --- 3. Idempotence et mise à jour de la commande ---
      
      // On utilise une transaction pour s'assurer que toutes les opérations réussissent ou échouent ensemble.
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });

        // Si la commande n'existe pas ou a déjà été payée (idempotence)
        if (!order || order.payment_intent_id) {
            console.log(`❕ Webhook reçu pour une commande inexistante ou déjà traitée: ${orderId}`);
            return;
        }

        // Mettre à jour la commande
        await tx.order.update({
          where: { id: orderId },
          data: {
            status: 'PAID',
            payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
          },
        });

        // --- 4. Réduction du stock ---
        for (const item of order.items) {
          if (item.variantId) {
            await tx.variant.update({
              where: { id: item.variantId },
              data: { stock: { decrement: item.qty } },
            });
          }
          // Ajoutez ici la logique si vous gérez le stock au niveau du produit
        }

        // --- 5. Simulation de l'envoi d'email ---
        console.log(`✅ Commande ${orderId} payée. Envoi de l'email de confirmation...`);
        // Placeholder pour l'envoi d'email
        // await sendGrid.send({ to: customer.email, from: '...', subject: '...' });
      });

    } catch (error) {
        console.error(`❌ Erreur lors du traitement de la commande ${orderId}:`, error);
        return NextResponse.json({ message: 'Erreur interne lors du traitement.' }, { status: 500 });
    }
  }

  // Stripe attend une réponse 200 pour savoir que l'événement a été reçu.
  return NextResponse.json({ received: true });
}