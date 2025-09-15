// path: src/lib/utils.ts
export function slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD') // Normalise les caractères accentués
      .replace(/[\u0300-\u036f]/g, '') // Supprime les diacritiques
      .trim()
      .replace(/\s+/g, '-') // Remplace les espaces par -
      .replace(/[^\w-]+/g, '') // Supprime les caractères non alphanumériques
      .replace(/--+/g, '-'); // Remplace les doubles tirets par un seul
  }