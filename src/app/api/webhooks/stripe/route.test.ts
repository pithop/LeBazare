// path: src/app/api/webhooks/stripe/route.test.ts

import { POST } from './route';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

// --- Mocks des dépendances externes ---

// 1. Mock de `next/headers`
jest.mock('next/headers', () => ({
  headers: jest.fn(() => new Map([['stripe-signature', 'mock-signature']])),
}));

// 2. Mock complet de Prisma pour contrôler son comportement
jest.mock('@/lib/prisma', () => {
  const mockTx = {
    order: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    variant: {
      update: jest.fn(),
    },
  };
  return {
    __esModule: true,
    default: {
      $transaction: jest.fn().mockImplementation(async (callback) => callback(mockTx)),
      // On expose les mocks pour pouvoir les manipuler dans les tests
      _mockTx: mockTx,
    },
  };
});

// 3. Mock de la librairie Stripe
// On crée une fonction mock séparée pour constructEvent afin de la contrôler facilement
const mockConstructEvent = jest.fn();
jest.mock('stripe', () => {
  // On mock la classe Stripe elle-même
  return jest.fn().mockImplementation(() => ({
    webhooks: {
      constructEvent: mockConstructEvent,
    },
  }));
});

// --- Préparation des données de test ---

// On type explicitement notre mock de Prisma pour avoir l'autocomplétion
const prismaMock = prisma as jest.Mocked<typeof prisma> & { _mockTx: unknown };
const mockTx = prismaMock._mockTx as {
  order: { findUnique: jest.Mock; update: jest.Mock };
  variant: { update: jest.Mock };
};

// Création d'un événement Stripe simulé et valide
const mockStripeEvent = {
  id: 'evt_123',
  object: 'event',
  api_version: '2022-11-15',
  type: 'checkout.session.completed',
  data: {
    object: {
      id: 'cs_test_123',
      object: 'checkout.session',
      metadata: {
        orderId: 'order_test_123',
      },
      payment_intent: 'pi_test_123',
    },
  },
} as unknown as Stripe.Event;


// --- Suite de tests ---

describe('Stripe Webhook Endpoint (/api/webhooks/stripe)', () => {

  beforeEach(() => {
    // On réinitialise tous les mocks avant chaque test pour éviter les interférences
    jest.clearAllMocks();
  });

  it('devrait traiter `checkout.session.completed` et mettre à jour la commande', async () => {
    // ARRANGE: Configurer les mocks pour ce scénario
    mockConstructEvent.mockReturnValue(mockStripeEvent);
    mockTx.order.findUnique.mockResolvedValue({
      id: 'order_test_123',
      payment_intent_id: null, // La commande n'est pas encore payée
      items: [{ variantId: 'variant_abc', qty: 2 }],
    });

    const requestBody = JSON.stringify(mockStripeEvent);
    const request = new NextRequest('http://localhost/api/webhooks/stripe', {
      method: 'POST',
      body: requestBody,
    });

    // ACT: Appeler la fonction de l'endpoint
    const response = await POST(request);

    // ASSERT: Vérifier que tout s'est bien passé
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true });

    // Vérifier que la transaction a été appelée
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    
    // Vérifier que la commande a été mise à jour correctement
    expect(mockTx.order.update).toHaveBeenCalledWith({
      where: { id: 'order_test_123' },
      data: { status: 'PAID', payment_intent_id: 'pi_test_123' },
    });

    // Vérifier que le stock a été décrémenté
    expect(mockTx.variant.update).toHaveBeenCalledWith({
      where: { id: 'variant_abc' },
      data: { stock: { decrement: 2 } },
    });
  });

  it('ne devrait rien faire si la commande est déjà traitée (idempotence)', async () => {
    // ARRANGE
    mockConstructEvent.mockReturnValue(mockStripeEvent);
    // La commande retournée par la DB a déjà un `payment_intent_id`
    mockTx.order.findUnique.mockResolvedValue({
      id: 'order_test_123',
      payment_intent_id: 'pi_already_processed',
      items: [],
    });

    const request = new NextRequest('http://localhost/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify(mockStripeEvent),
    });

    // ACT
    await POST(request);

    // ASSERT
    // Aucune opération d'écriture ne doit avoir eu lieu
    expect(mockTx.order.update).not.toHaveBeenCalled();
    expect(mockTx.variant.update).not.toHaveBeenCalled();
  });

  it('devrait retourner une erreur 400 si la signature du webhook est invalide', async () => {
    // ARRANGE
    const errorMessage = 'Mocked signature verification error';
    mockConstructEvent.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const request = new NextRequest('http://localhost/api/webhooks/stripe', {
      method: 'POST',
      body: '{}',
    });

    // ACT
    const response = await POST(request);
    const responseBody = await response.json();

    // ASSERT
    expect(response.status).toBe(400);
    expect(responseBody.message).toContain(errorMessage);
  });
});