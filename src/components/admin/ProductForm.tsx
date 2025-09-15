// path: src/components/admin/ProductForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { Category } from '@prisma/client';

// IMPORTANT : Remplacez ces valeurs par vos informations Cloudinary
const CLOUDINARY_UPLOAD_PRESET = 'Lebzare'; // Votre "Upload Preset"
const CLOUDINARY_CLOUD_NAME = 'dggbfnfdl';   // Votre "Cloud Name"

export default function ProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error('Veuillez sélectionner au moins une image.');
      return;
    }
    setIsSubmitting(true);
    toast.loading('Création du produit en cours...');

    const formData = new FormData(e.currentTarget);
    
    try {
      // 1. Téléverser les images sur Cloudinary
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const uploadFormData = new FormData();
          uploadFormData.append('file', file);
          uploadFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
          const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: uploadFormData,
          });
          const data = await res.json();
          if (!res.ok) throw new Error('Échec du téléversement de l\'image.');
          return { url: data.secure_url, publicId: data.public_id };
        })
      );

      // 2. Préparer les données du produit pour notre API
      const productData = {
        title: formData.get('title'),
        slug: formData.get('slug'),
        description: formData.get('description'),
        price_cents: Math.round(parseFloat(formData.get('price') as string) * 100),
        categoryId: formData.get('categoryId'),
        images: uploadedImages,
      };

      // 3. Envoyer les données à notre API d'administration
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'La création a échoué');
      }

      toast.dismiss(); // Enlève le message "loading"
      toast.success('Produit créé avec succès !');
      router.push('/admin/products');
      router.refresh(); // Important pour rafraîchir la liste des produits

    } catch (error) {
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
      {/* Champs de texte */}
      <div>
        <label htmlFor="title" className="form-label">Titre</label>
        <input name="title" id="title" type="text" className="form-input" required />
      </div>
      <div>
        <label htmlFor="slug" className="form-label">Slug (URL)</label>
        <input name="slug" id="slug" type="text" className="form-input" required />
      </div>
      <div>
        <label htmlFor="description" className="form-label">Description</label>
        <textarea name="description" id="description" rows={5} className="form-input" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="form-label">Prix (€)</label>
          <input name="price" id="price" type="number" step="0.01" className="form-input" required />
        </div>
        <div>
          <label htmlFor="categoryId" className="form-label">Catégorie</label>
          <select name="categoryId" id="categoryId" className="form-input" required>
            <option value="">Sélectionnez une catégorie</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
      </div>
      {/* Champ pour les images */}
      <div>
        <label htmlFor="images" className="form-label">Images (plusieurs possibles)</label>
        <input name="images" id="images" type="file" multiple onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>
      <div className="border-t pt-6">
        <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Création en cours...' : 'Créer le produit'}
        </button>
      </div>
    </form>
  );
}