/* ============================================================
   JEU 3 — Teasers d'enquête
   ------------------------------------------------------------
   Chaque témoin a une petite phrase d'amorce accessible via la
   loupe (hover) avant l'interrogatoire officiel. Clé = temoin.id
   (unique par témoin, même quand c'est le même PNJ sur une autre
   enquête). Permet au joueur de « sentir » qui a quelque chose
   d'utile avant d'engager l'interrogatoire formel.
   ============================================================ */
export const TEMOIN_TEASERS = {
  // Enquête Kova
  marek:    "J'ai rien vu moi. C'est le Dr Kova qui l'a dit, à la cantine.",
  sera:     "J'ai cherché Kova dans trois registres. Rien du tout.",
  yol:      "La grande porte est soudée depuis quarante ans. Je sais, c'est moi qui ai tenu la torche.",

  // Enquête Vitamine blanche
  tor:      "La poudre fait grossir mes tomates. Mais elles n'ont plus de goût.",
  lin:      "Trois fois plus de cas de « grande fatigue » depuis un an.",
  bri:      "Je reçois dix kilos par monte-charge, sans jamais voir le livreur.",
  mel:      "Je me sens mieux depuis que j'ai arrêté la poudre, moi.",

  // Enquête 40e jour
  yon:      "Coupure d'une minute pile, tous les 40 jours. Trois ans de relevés chronométrés.",
  gus:      "Mon registre : « RAS » tous les 40 jours. Et pourtant il y a coupure.",
  kev:      "J'ai vu une étiquette « code modifié · 2050 » sur les serveurs.",
  flor:     "Mes plants coupés pile pendant leur phase nuit. Jamais le jour.",

  // Enquête Enfant
  via:      "On en parle à la cantine. Mais personne n'a vu, moi comprise.",
  iris:     "Il doutait, il est sorti, il est mort. C'est le signe, non ?",
  // yol est réutilisé dans Enfant avec la MÊME clé — même teaser que Kova.
  anselme:  "J'ai vu un enfant sur une civière, qu'on emmenait au niveau du haut.",

  // Enquête Champ de blé
  ela:      "J'ai vu un dessin de champ de blé dans un livre. Le livre a disparu.",
  anselme2: "J'ai vécu dehors, enfant. Il y avait des oiseaux, je t'assure.",
  yona:     "Du coton frais arrive chaque mois. Si tout est mort dehors, qui le tisse ?",
  estev:    "Trente carnets. Les archives bougent après chaque coupure des 40 jours.",

  // Enquête Fontaine (FRAGILE)
  tam:      "Trois joints en six mois. Normalement, ça tient cinq ans.",
  yon_f:    "La pompe peine. Mais je n'ai pas de capteur pour le prouver.",
  nel_f:    "Une fontaine jumelle a été débranchée au lieu d'être réparée.",
  via_f:    "On raconte que toutes les fontaines du niveau 0 ont le même problème.",

  // Enquête Viande (SOLIDE)
  dor_v:    "Zéro viande depuis le 12 mars 2084. Registre à l'appui.",
  bri_v:    "Trente-six bulletins mensuels cachetés. Tous à zéro.",
  nel_v:    "Zéro assiette de viande sur cinq cent mille repas servis.",
  mo_v:     "J'ai mangé du poulet mardi. Ou mercredi. J'en suis sûr.",

  // Enquête Pompe à eau (SOLIDE)
  tam_p:    "J'ai changé le rotor. Débit remonté à 42 L/min, mesuré avant et après.",
  gus_p:    "Registre IM-087, double signature. Quatre contrôles hebdos à 42 L/min pile.",
  bel_p:    "J'ai pris une photo du compteur à 42 L/min, avec la date dessus.",
  via_p:    "On raconte à la cantine que ça fuit encore. Mais je n'ai pas vu.",
};

/* Retourne le teaser d'un témoin, ou null si pas renseigné. */
export function teaserFor(temoinId) {
  return TEMOIN_TEASERS[temoinId] || null;
}
