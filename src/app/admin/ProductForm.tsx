// path: src/components/admin/ProductForm.tsx
'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { Category } from '@prisma/client';
import { XCircleIcon, PhotoIcon, PlusIcon } from '@heroicons/react/24/solid';

const slugify = (text: string) =>
  text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

// --- Configuration Cloudinary ---
// IMPORTANT : Remplacez ces valeurs par VOS informations
const CLOUDINARY_UPLOAD_PRESET = 'Lebzare'; // Le nom de votre "Upload Preset" Unsigned
const CLOUDINARY_CLOUD_NAME = 'dggbfnfdl';   // Votre "Cloud Name"

type Variant = { id: number; name: string; stock: number };

export default function ProductForm({ categories, onProductCreated }: { categories: Category[]; onProductCreated: () => void; }) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([{ id: Date.now(), name: 'Taille unique', stock: 1 }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSlug(slugify(title));
  }, [title]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
    setPreviews(previews.filter((_, index) => index !== indexToRemove));
  };

  const handleVariantChange = (id: number, field: 'name' | 'stock', value: string) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: field === 'stock' ? parseInt(value) || 0 : value } : v));
  };

  const addVariant = () => {
    setVariants([...variants, { id: Date.now(), name: '', stock: 0 }]);
  };

  const removeVariant = (id: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter(v => v.id !== id));
    } else {
      toast.error('Un produit doit avoir au moins une variante.');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error('Veuillez ajouter au moins une image.');
      return;
    }
    setIsSubmitting(true);
    toast.loading('Création du produit en cours...');
  
    try {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
          const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          if (!res.ok) throw new Error(`Échec de l'upload: ${data.error.message}`);
          return { url: data.secure_url, publicId: data.public_id };
        })
      );
  
      // Use FormData to safely read form values
      const formData = new FormData(e.currentTarget);
      const productData = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string,
        price_cents: Math.round(parseFloat(formData.get('price') as string) * 100),
        categoryId: formData.get('categoryId') as string,
        images: uploadedImages,
        variants: variants.map(({ name, stock }) => ({ name, stock })),
      };
  
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'La création a échoué.');
      }
  
      toast.dismiss();
      toast.success('Produit créé avec succès !');
      onProductCreated();
    } catch (error) {
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : 'Une erreur inconnue est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-1 pr-4 space-y-8">
      <section>
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Informations Générales</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="form-label">Titre du produit</label>
            <input name="title" id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" required placeholder="Ex: Suspension en Raphia Naturel"/>
          </div>
          <div>
            <label htmlFor="slug" className="form-label">URL (Slug)</label>
            <input name="slug" id="slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="form-input bg-gray-50" required />
            <p className="text-xs text-gray-500 mt-1">Généré automatiquement, mais vous pouvez le modifier.</p>
          </div>
          <div>
            <label htmlFor="description" className="form-label">Description</label>
            <textarea name="description" id="description" rows={5} className="form-input" placeholder="Décrivez votre produit en détail..."></textarea>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Prix & Organisation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="form-label">Prix de base (€)</label>
            <input name="price" id="price" type="number" step="0.01" className="form-input" required placeholder="Ex: 79.99"/>
          </div>
          <div>
            <label htmlFor="categoryId" className="form-label">Catégorie</label>
            <select name="categoryId" id="categoryId" className="form-input" required>
              <option value="">Sélectionnez...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>
      
      <section>
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Variantes & Stock</h3>
        <div className="space-y-3">
          {variants.map((variant) => (
            <div key={variant.id} className="grid grid-cols-[1fr,100px,auto] gap-3 items-center">
              <input type="text" placeholder="Nom (ex: Taille S, Couleur Rouge)" value={variant.name} onChange={(e) => handleVariantChange(variant.id, 'name', e.target.value)} className="form-input" required />
              <input type="number" placeholder="Stock" value={variant.stock} onChange={(e) => handleVariantChange(variant.id, 'stock', e.target.value)} className="form-input text-center" required />
              <button type="button" onClick={() => removeVariant(variant.id)} disabled={variants.length <= 1}>
                <XCircleIcon className="h-6 w-6 text-gray-400 hover:text-red-500 transition-colors" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addVariant} className="flex items-center gap-2 mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-800">
          <PlusIcon className="h-4 w-4" />
          Ajouter une autre variante
        </button>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Images</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative aspect-square">
              <img src={preview} alt={`Aperçu ${index + 1}`} className="w-full h-full object-cover rounded-lg"/>
              <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-white rounded-full">
                <XCircleIcon className="h-6 w-6 text-red-500 hover:text-red-700"/>
              </button>
            </div>
          ))}
          <label htmlFor="image-upload" className="cursor-pointer aspect-square flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors">
            <PhotoIcon className="h-8 w-8" />
            <span className="text-xs mt-1 text-center">Ajouter</span>
            <input id="image-upload" name="images" type="file" multiple onChange={handleImageChange} className="sr-only" />
          </label>
        </div>
      </section>

      <div className="border-t pt-6 flex justify-end">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Création en cours...' : 'Enregistrer le produit'}
        </button>
      </div>
    </form>
  );
}