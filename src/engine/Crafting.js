/* ============================================================
   MOTEUR — Résolution des recettes
   Fonctions pures : elles reçoivent les données du chapitre
   en paramètre, elles ne connaissent aucun contenu.
   ============================================================ */

/** Trouve la recette qui correspond aux deux éléments, dans n'importe quel ordre.
 *  `isValid` : prédicat optionnel pour départager plusieurs recettes
 *  partageant la même paire (a,b) — ex. une avec needsFlag et une sans.
 *  On renvoie la première satisfaisant le prédicat, sinon la toute première
 *  (pour que les messages d'erreur de l'appelant restent les mêmes qu'avant).
 */
export function findRecipe(recipes, a, b, isValid = () => true) {
  const pair = recipes.filter((r) => (r.a === a && r.b === b) || (r.a === b && r.b === a));
  if (pair.length === 0) return undefined;
  return pair.find(isValid) || pair[0];
}

/** Trouve une réplique spéciale « presque ! » (erreur logique prévue par l'auteur). */
export function findNearMiss(nearMiss, a, b) {
  return nearMiss.find((n) => (n.pair[0] === a && n.pair[1] === b) || (n.pair[0] === b && n.pair[1] === a));
}

/** Pioche une réplique d'échec au hasard. */
export function randomLine(lines) {
  return lines[Math.floor(Math.random() * lines.length)];
}
