// path: scripts/createAdmin.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Script pour créer un utilisateur administrateur.
 * Usage:
 * npx ts-node --compiler-options '{\"module\":\"CommonJS\"}' scripts/createAdmin.ts <email> <password>
 *
 * Exemple:
 * npx ts-node --compiler-options '{\"module\":\"CommonJS\"}' scripts/createAdmin.ts admin@lebazare.com motdepassesecurise
 */
async function main() {
  const args = process.argv.slice(2);
  const [email, password] = args;

  if (!email || !password) {
    console.error('Erreur: Veuillez fournir un email et un mot de passe.');
    console.log('Usage: npx ts-node scripts/createAdmin.ts <email> <password>');
    process.exit(1);
  }

  console.log(`Création de l'admin avec l'email: ${email}...`);

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const admin = await prisma.admin.create({
      data: {
        email,
        hashed_password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin créé avec succès!');
    console.log(admin);
  } catch (e: any) {
    if (e.code === 'P2002') { // Erreur de contrainte unique de Prisma
      console.error(`❌ Erreur: Un admin avec l'email "${email}" existe déjà.`);
    } else {
      console.error('❌ Une erreur est survenue lors de la création de l\'admin:', e);
    }
    process.exit(1);
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });