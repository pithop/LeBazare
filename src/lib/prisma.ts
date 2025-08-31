// path: lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Déclare une variable globale pour stocker le client Prisma.
// Cela évite de créer une nouvelle instance à chaque rechargement à chaud en développement.
declare global {
  var prisma: PrismaClient | undefined;
}

// Initialise le client Prisma. Si `globalThis.prisma` existe, on le réutilise.
// Sinon, on en crée un nouveau. En production, `globalThis.prisma` n'existera jamais.
const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Exporte l'instance unique du client Prisma pour l'utiliser dans toute l'application.
export default prisma;