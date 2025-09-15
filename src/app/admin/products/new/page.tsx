// path: src/app/admin/products/new/page.tsx
import ProductForm from '@/components/admin/ProductForm';
import prisma from '@/lib/prisma';

async function getCategories() {
  return prisma.category.findMany();
}

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Ajouter un nouveau produit</h1>
      {/* On passe les catégories au formulaire */}
      <ProductForm categories={categories} />
    </div>
  );
}