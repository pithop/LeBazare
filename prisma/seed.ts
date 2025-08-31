// path: prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';
import { join } from 'path';
import type { Product } from '@prisma/client';

const prisma = new PrismaClient();

// Définition du type pour nos données de seed pour plus de sécurité
type SeedProduct = Omit<
  Product,
  'id' | 'createdAt' | 'updatedAt' | 'featured'
> & {
  category: string;
  image_urls: string[];
};

async function main() {
  console.log('🚀 Démarrage du script de seed...');

  // --- 1. Création de l'administrateur initial ---
  // IMPORTANT: Dans une vraie application, ce mot de passe doit être "hashé"
  // avec une librairie comme bcrypt avant d'être inséré en base de données.
  // Exemple: const hashedPassword = await bcrypt.hash('motdepassesecurise', 10);
  const adminPasswordPlaceholder =
    'HASHED_PASSWORD_PLACEHOLDER_DO_NOT_USE_IN_PRODUCTION';

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@lebazare.com' },
    update: {},
    create: {
      email: 'admin@lebazare.com',
      hashed_password: adminPasswordPlaceholder,
      role: 'ADMIN',
    },
  });
  console.log(`👤 Administrateur "${admin.email}" créé ou mis à jour.`);

  // --- 2. Lecture du fichier JSON de produits ---
  const productsPath = join(__dirname, '..', 'data', 'seed-products.json');
  const productsFile = await readFile(productsPath, 'utf-8');
  const seedProducts: SeedProduct[] = JSON.parse(productsFile);

  // --- 3. Création des catégories uniques ---
  const categoryNames = [
    ...new Set(seedProducts.map((p) => p.category)),
  ];
  const categoryMap = new Map<string, { id: string }>();

  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { slug: name.toLowerCase().replace(/ /g, '-') },
      update: {},
      create: {
        name: name,
        slug: name.toLowerCase().replace(/ /g, '-'),
      },
    });
    categoryMap.set(name, { id: category.id });
  }
  console.log(`📚 ${categoryMap.size} catégories créées ou mises à jour.`);

  // --- 4. Création des produits et de leurs images ---
  let productsCreatedCount = 0;
  for (const p of seedProducts) {
    const categoryId = categoryMap.get(p.category)?.id;
    if (!categoryId) {
      console.warn(`Catégorie "${p.category}" non trouvée pour le produit "${p.title}". Skip.`);
      continue;
    }

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        price_cents: p.price_cents,
        currency: p.currency,
        weight_g: p.weight_g,
        length_mm: p.length_mm,
        width_mm: p.width_mm,
        height_mm: p.height_mm,
        processing_time_days: p.processing_time_days,
        images: {
          create: p.image_urls.map((url, index) => ({
            url: url,
            alt: p.title,
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
    productsCreatedCount++;

    // Ajout de variants pour un produit spécifique
    if (p.slug === 'tabouret-beldi-en-bois-et-corde') {
      await prisma.variant.createMany({
        data: [
          {
            productId: product.id,
            name: 'Taille - Petit',
            price_delta_cents: -500, // 5€ de moins
            stock: 15,
          },
          {
            productId: product.id,
            name: 'Taille - Grand',
            price_delta_cents: 800, // 8€ de plus
            stock: 10,
          },
          {
            productId: product.id,
            name: 'Finition - Bois Naturel',
            price_delta_cents: 0,
            stock: 25,
          },
        ],
      });
      console.log(`   -> 3 variants créés pour "${product.title}"`);
    }
  }

  console.log(`📦 ${productsCreatedCount} produits créés ou mis à jour.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('✅ Script de seed terminé.');
    await prisma.$disconnect();
  });