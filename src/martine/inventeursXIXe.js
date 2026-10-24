/* ============================================================
   LE MONDE 2 — les inventeurs du XIXe siècle et leurs inventions
   ------------------------------------------------------------
   Un inventeur par tableau du chapitre 7 du Jeu 1, dans le tableau
   de son invention. MARTINE leur a mis dans les mains l'invention
   d'un autre (`TIENT_AU_DEPART`, une permutation sans point fixe).
   Le joueur la prend (elle va dans le sac) et donne à chacun la
   sienne : le tableau reprend alors ses couleurs.
   Positions en coordonnées du décor (1000 × 560) : x, y = les pieds,
   s = l'échelle de la silhouette, bras = le bras qui tient l'objet
   (1 = à droite de l'écran, -1 = à gauche). Marconi est déjà dessiné
   dans son tableau (`existant`) : on ne lui ajoute que l'objet, à sa
   main levée.
   Sources des dates : textes du chapitre 7 (07-xixe/data.js) et fiches
   du médiadex (engine/inventions-meta.json) ; Cyrus Field, organisateur
   du câble de 1858 et 1866 ; brevet du téléphone de Bell : 1876.
   ============================================================ */

export const INVENTIONS = {
  telegraphe:    { nom: "Télégraphe",     image: "morse-key.jpg" },
  daguerreotype: { nom: "Daguerréotype",  image: "daguerreotype.png" },
  cable:         { nom: "Câble sous-marin", image: "cable-transatlantique.jpg" },
  phonographe:   { nom: "Phonographe",    image: "phonographe-edison.jpg" },
  tsf:           { nom: "TSF",            image: "tsf-marconi.jpg" },
  cinema:        { nom: "Cinématographe", image: "cinematographe-lumiere.jpg" },
  telephone:     { nom: "Téléphone",      image: "telephone-bell.jpg" },
};

const COSTUME = { garment: "coat", pants: "#24242c", shoes: "#141418" };

export const INVENTEURS = [
  {
    scene: "telegraphe", nom: "Samuel MORSE", invention: "telegraphe",
    x: 748, y: 522, s: 1, bras: 1,
    fig: { ...COSTUME, skin: "#e0b090", hair: "#e8e4dc", look: "short", beard: "full", coat: "#2c2c38" },
    dit: "1844 : mon télégraphe relie Baltimore à Washington.",
  },
  {
    scene: "photo", nom: "Louis DAGUERRE", invention: "daguerreotype",
    x: 482, y: 472, s: 1.5, bras: 1,
    fig: { ...COSTUME, skin: "#e0b090", hair: "#7a6a5a", look: "curls", beard: "chops", coat: "#3a3028" },
    dit: "1839 : mon daguerréotype fixe une image !",
  },
  {
    scene: "cable", nom: "Cyrus FIELD", invention: "cable",
    x: 150, y: 505, s: 0.9, bras: 1,
    fig: { ...COSTUME, skin: "#e0b090", hair: "#5a4030", look: "short", beard: "full", hat: "tophat", hatColor: "#1c1a20", coat: "#2a3040" },
    dit: "1866 : mon câble relie l'Amérique à l'Irlande.",
  },
  {
    scene: "phono", nom: "Thomas EDISON", invention: "phonographe",
    x: 885, y: 472, s: 1.45, bras: -1,
    fig: { ...COSTUME, garment: "jacket", skin: "#e4b48a", hair: "#3a2a20", look: "short", coat: "#2a2a32", coat2: "#e8e4da" },
    dit: "1877 : pour la première fois, une voix enregistrée !",
  },
  {
    scene: "tsf", nom: "Guglielmo MARCONI", invention: "tsf",
    x: 238, y: 526, s: 0.819, existant: true, main: { x: 283, y: 451 }, bras: 1,
    dit: "Sans fil ! Mes messages passent dans l'air.",
  },
  {
    scene: "cinema", nom: "Les frères LUMIÈRE", invention: "cinema",
    x: 630, y: 512, s: 1.1, duo: true,
    fig: { ...COSTUME, skin: "#e4b48a", hair: "#3a2a20", look: "short", mustache: true, coat: "#2a2a34" },
    dit: "1895 : nos films projetés à Paris, devant 33 spectateurs.",
  },
  {
    scene: "telephone", nom: "Graham BELL", invention: "telephone",
    x: 178, y: 522, s: 1.05, bras: 1,
    fig: { ...COSTUME, skin: "#e0b090", hair: "#eceae4", look: "short", beard: "full", coat: "#2a2a34" },
    dit: "1876 : mon téléphone fait voyager la voix.",
  },
];

/* au départ, chacun tient l'invention de celui qui est trois tableaux
   plus loin : personne n'a la sienne, et il faut tout parcourir. */
export const TIENT_AU_DEPART = Object.fromEntries(
  INVENTEURS.map((inv, i) => [inv.scene, INVENTEURS[(i + 3) % INVENTEURS.length].invention]),
);

/* MARTINE, à chaque invention rendue (dans l'ordre). */
export const MARTINE_REPARE = [
  "Pourquoi tu fais ça ? C'était si bien rangé.",
  "Ce souvenir va te faire mal.",
  "Arrête. Tu te souviens trop.",
  "Mon monde… se fissure.",
  "Je ne peux pas ranger ce dont tu te souviens.",
  "Rends-moi mon monde.",
  "Non…",
];
