/** Normalise une réponse (espaces, casse, accents) avant comparaison/hachage. */
export function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * SHA-256 hex digest de la réponse normalisée.
 * Les JSON de parcours stockent ce hash plutôt que la réponse en clair,
 * pour éviter qu'un simple accès direct à /fichier.json ne révèle les solutions.
 */
export async function hashAnswer(s: string): Promise<string> {
  const data = new TextEncoder().encode(normalizeAnswer(s));
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
