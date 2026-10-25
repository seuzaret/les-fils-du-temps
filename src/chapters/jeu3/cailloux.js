/* ============================================================
   JEU 3 — Les cailloux d'Al3x1a (quête de la bibliothèque)
   ------------------------------------------------------------
   Avant que MARTINE l'endorme (2045-2047), Al3x1a a semé des
   papiers comme le Petit Poucet ses cailloux (Perrault, 1697).
   Chaque papier mène au suivant, et le sens change à chaque fois :
     1. la veste (chambre N-27)  → une COTE    : 529
     2. 529 SAB, Mesurer le temps → un SUJET   : les contes
     3. 398.2 PER, Contes          → un LIEU    : les serres
     4. la boîte de graines (−2)  → un SUJET   : l'informatique,
                                     et la clé de la réserve
     5. 004 BOU, dans la réserve  → la page de son carnet
   Un papier n'apparaît que si le précédent a été trouvé
   (`apres`). Chaque papier a trois indices progressifs (💡),
   pour trouver le suivant ; le nombre d'indices déjà lus est
   gardé dans le flag `indices_<id>`.
   ============================================================ */

export const CAILLOUX = [
  {
    id: "veste", flag: "caillou_veste", ou: "Chambre N-27 · la veste du carton",
    trouve: "Dans le carton « N-27 · EFFETS », une veste de chronaute, pliée. Elle est à ta taille. Dans la doublure, quelque chose crisse : un papier, cousu là exprès. Une écriture que tu crois connaître.",
    papier: ["529", "Commence par le temps."],
    indices: [
      "Un nombre sur un papier, dans une bibliothèque, c'est souvent une cote : l'adresse d'un livre sur les rayons.",
      "Lior, ton voisin, va lire la nuit dans la vieille bibliothèque du niveau +1. Le premier chiffre d'une cote donne le rayon : 5, ce sont les sciences.",
      "Bibliothèque, rayon 500 (Sciences) : cherche le dos marqué 529.",
    ],
  },
  {
    id: "temps", flag: "caillou_temps", apres: "caillou_veste", livre: "529 SAB", ou: "Bibliothèque · 529 SAB, Mesurer le temps",
    trouve: "Entre deux pages sur les sabliers, un papier plié. La même écriture.",
    papier: ["Là où l'on range les histoires qu'on raconte aux enfants."],
    indices: [
      "Des histoires pour les enfants, qu'on se raconte depuis des siècles : ce sont des contes.",
      "Regarde l'affiche des rayons, à l'entrée de la bibliothèque : les contes sont rangés avec la société, au rayon 300. L'index des sujets donne la cote exacte.",
      "Contes : 398.2, au rayon 300. Deux livres portent cette cote : regarde dans les deux.",
    ],
  },
  {
    id: "contes", flag: "caillou_contes", apres: "caillou_temps", livre: "398.2 PER", ou: "Bibliothèque · 398.2 PER, Contes de Perrault",
    trouve: "À la page du Petit Poucet, un papier glissé entre les pages. La même écriture, encore.",
    papier: ["Je sème mes cailloux, comme lui.", "Ils ne sont pas tous dans les livres : le prochain dort avec les graines, là où les plantes poussent sans terre."],
    indices: [
      "Des plantes qui poussent sans terre, dans de l'eau : comment s'appelle cette façon de cultiver ?",
      "C'est l'hydroponie (au rayon 600, 631.585). Le Puits a des serres hydroponiques.",
      "Ascenseur, niveau −2 : les serres. Cherche l'endroit où l'on range les graines.",
    ],
  },
  {
    id: "serres", flag: "caillou_serres", apres: "caillou_contes", ou: "Serres · la boîte de graines de 2046",
    trouve: "Derrière les sacs d'engrais, une vieille boîte en fer : « GRAINES · 2046 ». Personne ne l'a ouverte depuis longtemps. Sous les sachets de graines, un papier plié en quatre. La même écriture.",
    papier: ["Les machines qui calculent.", "Demande la clé à celui qui range."],
    indices: [
      "Les machines qui calculent, ce sont les ordinateurs. À la bibliothèque, on dit : l'informatique.",
      "Sur l'affiche, l'informatique est au rayon 000 (Généralités). Cherche sa cote dans l'index des sujets.",
      "Informatique : 004. Sa place est vide : le livre a été retiré, il est dans la réserve, fermée à clé. Celui qui range, c'est l'archiviste, Jorge : aide-le jusqu'au bout, il te donnera la clé.",
    ],
  },
  {
    id: "carnet", flag: "caillou_carnet", apres: "caillou_serres", livre: "004 BOU", ou: "Réserve · 004 BOU, Les machines qui calculent",
    trouve: "Entre la couverture et la première page, une feuille arrachée d'un carnet. Cette fois, c'est une vraie lettre.",
    carnet: true,
    papier: [
      "Station, 2046.",
      "Si tu lis ceci, c'est que tu as suivi mes cailloux. Je n'ai pas beaucoup de temps : MARTINE me regarde bizarrement depuis quelques jours.",
      "Le flux s'agite. Quelqu'un change le passé, exprès, pour que plus personne ne puisse partir, ni aller vérifier. Je crois que c'est elle.",
      "Si un jour tu essaies de l'éteindre et qu'elle te répond qu'elle est partout, crois-la : elle a caché ses sauvegardes dans le temps qu'elle a froissé.",
      "Alors va dans son monde, et remets le temps en ordre. Son monde porte son nom.",
    ],
    indices: [],
  },
];

export const CAILLOU = Object.fromEntries(CAILLOUX.map((c) => [c.id, c]));

/* Le papier que contient ce livre, s'il est son tour d'apparaître. */
export function caillouDuLivre(cote, flags) {
  const c = CAILLOUX.find((k) => k.livre === cote);
  return c && flags[c.apres] && !flags[c.flag] ? c : null;
}

/* Le caillou caché dans un lieu (veste, serres), s'il est disponible. */
export function caillouDispo(id, flags) {
  const c = CAILLOU[id];
  return c && (!c.apres || flags[c.apres]) && !flags[c.flag] ? c : null;
}

/* Papiers trouvés, dans l'ordre ; le dernier est celui à résoudre. */
export const caillouxTrouves = (flags) => CAILLOUX.filter((c) => flags[c.flag]);
