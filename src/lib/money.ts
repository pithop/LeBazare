// path: lib/money.ts
/**
 * Formate un montant en centimes en une chaîne de caractères monétaire localisée.
 * @param cents Le montant en centimes (ex: 7900 pour 79,00 €).
 * @param currency Le code de la devise (ex: 'eur', 'usd').
 * @param locale La locale pour le formatage (ex: 'fr-FR').
 * @returns Une chaîne de caractères formatée (ex: "79,00 €").
 */
export function formatCents(
    cents: number,
    currency: string = 'eur',
    locale: string = 'fr-FR'
  ): string {
    const amount = cents / 100;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  }