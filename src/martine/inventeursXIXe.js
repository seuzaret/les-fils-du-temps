/* ============================================================
   LE MONDE 2 — les inventeurs, leurs inventions et les objets du
   futur, au XIXe siècle
   ------------------------------------------------------------
   Chaque tableau du chapitre 7 du Jeu 1 a son inventeur. MARTINE a
   tout mélangé :
   - chaque inventeur se tient dans le tableau d'un AUTRE
     (`VISITE_AU_DEPART`) : le décor ne donne plus la réponse ;
   - il tient l'invention d'un troisième (`TIENT_AU_DEPART`) ;
   - elle a caché dans chaque tableau un objet du futur
     (`ANACHRONISMES`), à jeter dans la poubelle temporelle (la
     règle 3 des chronautes du Jeu 1 : rien du futur dans le passé).
   Rendre à un inventeur son invention le renvoie chez lui.

   Places en coordonnées du décor (1000 × 560) : x, y = les pieds,
   s = l'échelle, bras = le bras qui tient l'objet (1 = à droite de
   l'écran, -1 = à gauche). Deux places par tableau : `chez` (le
   propriétaire, revenu) et `visite` (l'inventeur déplacé).

   Sources : dates des inventions = textes du chapitre 7
   (07-xixe/data.js) et fiches du médiadex (engine/inventions-meta.json) ;
   Cyrus Field, organisateur du câble de 1858 et 1866 ; brevet du
   téléphone de Bell : 1876. Objets du futur : ordinateur portable
   Osborne 1 (1981) ; premiers appareils photo numériques grand public
   (Dycam, 1990) ; Telstar, premier satellite de télécommunications
   transatlantiques (1962) ; CD audio (1982) ; Spoutnik (1957) ; films
   en relief des années 1950 ; iPhone (2007).
   ============================================================ */

export const INVENTIONS = {
  telegraphe:    { nom: "Télégraphe",       image: "morse-key.jpg" },
  daguerreotype: { nom: "Daguerréotype",    image: "daguerreotype.png" },
  cable:         { nom: "Câble sous-marin", image: "cable-transatlantique.jpg" },
  phonographe:   { nom: "Phonographe",      image: "phonographe-edison.jpg" },
  tsf:           { nom: "TSF",              image: "tsf-marconi.jpg" },
  cinema:        { nom: "Cinématographe",   image: "cinematographe-lumiere.jpg" },
  telephone:     { nom: "Téléphone",        image: "telephone-bell.jpg" },
};

const COSTUME = { garment: "coat", pants: "#24242c", shoes: "#141418" };

/* dans l'ordre des tableaux du chapitre 7 */
export const INVENTEURS = [
  {
    id: "morse", scene: "telegraphe", nom: "Samuel MORSE", invention: "telegraphe",
    fig: { ...COSTUME, skin: "#e0b090", hair: "#e8e4dc", look: "short", beard: "full", coat: "#2c2c38" },
    dit: "1844 : mon télégraphe relie Baltimore à Washington.",
    cherche: "Il me manque mon appareil : des points, des traits, un fil…",
  },
  {
    id: "daguerre", scene: "photo", nom: "Louis DAGUERRE", invention: "daguerreotype",
    fig: { ...COSTUME, skin: "#e0b090", hair: "#7a6a5a", look: "curls", beard: "chops", coat: "#3a3028" },
    dit: "1839 : mon daguerréotype fixe une image !",
    cherche: "Où est ma plaque d'argent qui garde les visages ?",
  },
  {
    id: "field", scene: "cable", nom: "Cyrus FIELD", invention: "cable",
    fig: { ...COSTUME, skin: "#e0b090", hair: "#5a4030", look: "short", beard: "full", hat: "tophat", hatColor: "#1c1a20", coat: "#2a3040" },
    dit: "1866 : mon câble relie l'Amérique à l'Irlande.",
    cherche: "Il me faut ce qui traverse l'océan, posé au fond de la mer.",
  },
  {
    id: "edison", scene: "phono", nom: "Thomas EDISON", invention: "phonographe",
    fig: { ...COSTUME, garment: "jacket", skin: "#e4b48a", hair: "#3a2a20", look: "short", coat: "#2a2a32", coat2: "#e8e4da" },
    dit: "1877 : pour la première fois, une voix enregistrée !",
    cherche: "Rendez-moi la machine qui grave la voix !",
  },
  {
    id: "marconi", scene: "tsf", nom: "Guglielmo MARCONI", invention: "tsf",
    fig: { ...COSTUME, skin: "#d0a67e", hair: "#1a1008", look: "slick", mustache: true, coat: "#26303e", pants: "#1a2028", shoes: "#0a0e14" },
    dit: "Sans fil ! Mes messages passent dans l'air.",
    cherche: "Mon appareil envoie des messages… sans aucun fil.",
  },
  {
    id: "lumiere", scene: "cinema", nom: "Les frères LUMIÈRE", invention: "cinema", duo: true,
    fig: { ...COSTUME, skin: "#e4b48a", hair: "#3a2a20", look: "short", mustache: true, coat: "#2a2a34" },
    dit: "1895 : nos films projetés à Paris, devant 33 spectateurs.",
    cherche: "Notre machine fait bouger les images. Où est-elle ?",
  },
  {
    id: "bell", scene: "telephone", nom: "Graham BELL", invention: "telephone",
    fig: { ...COSTUME, skin: "#e0b090", hair: "#eceae4", look: "short", beard: "full", coat: "#2a2a34" },
    dit: "1876 : mon téléphone fait voyager la voix.",
    cherche: "Il me faut l'appareil qui porte la voix au bout d'un fil.",
  },
];

/* deux places par tableau : `chez` (le propriétaire revenu), `visite` */
export const PLACES = {
  telegraphe: { chez: { x: 748, y: 522, s: 1, bras: 1 },    visite: { x: 932, y: 530, s: 1.05, bras: -1 } },
  photo:      { chez: { x: 482, y: 472, s: 1.5, bras: 1 },  visite: { x: 858, y: 482, s: 1.45, bras: 1 } },
  cable:      { chez: { x: 150, y: 505, s: 0.9, bras: 1 },  visite: { x: 815, y: 500, s: 0.88, bras: 1 } },
  phono:      { chez: { x: 885, y: 472, s: 1.45, bras: -1 }, visite: { x: 128, y: 520, s: 1.4, bras: 1 } },
  tsf:        { chez: { x: 238, y: 526, s: 0.82, bras: 1 }, visite: { x: 700, y: 522, s: 0.86, bras: 1 } },
  cinema:     { chez: { x: 630, y: 512, s: 1.1, bras: 1 },  visite: { x: 470, y: 512, s: 1.05, bras: -1 } },
  telephone:  { chez: { x: 178, y: 522, s: 1.05, bras: 1 }, visite: { x: 895, y: 532, s: 1.05, bras: -1 } },
};

/* Au départ, le tableau n° t accueille l'inventeur du tableau t + 2,
   qui tient l'invention de celui du tableau t + 5 : personne n'est chez
   lui, personne n'a la sienne, et le décor ne trahit rien. */
const N = INVENTEURS.length;
export const VISITE_AU_DEPART = Object.fromEntries(INVENTEURS.map((_, t) => [INVENTEURS[(t + 2) % N].id, INVENTEURS[t].scene]));
export const TIENT_AU_DEPART = Object.fromEntries(INVENTEURS.map((_, t) => [INVENTEURS[(t + 2) % N].id, INVENTEURS[(t + 5) % N].invention]));

/* un objet du futur caché dans chaque tableau (dessiné par MondeMartine) */
export const ANACHRONISMES = {
  portable:   { scene: "telegraphe", nom: "Ordinateur portable", emoji: "💻", quand: "années 1980", x: 560, y: 478 },
  numerique:  { scene: "photo",      nom: "Appareil photo numérique", emoji: "📸", quand: "années 1990", x: 186, y: 250 },
  parabole:   { scene: "cable",      nom: "Antenne parabolique", emoji: "📡", quand: "années 1960", x: 176, y: 34 },
  cd:         { scene: "phono",      nom: "CD audio", emoji: "💿", quand: "1982", x: 182, y: 266 },
  satellite:  { scene: "tsf",        nom: "Satellite", emoji: "🛰️", quand: "1957", x: 770, y: 118 },
  lunettes3d: { scene: "cinema",     nom: "Lunettes 3D", emoji: "🕶️", quand: "années 1950", x: 330, y: 506 },
  smartphone: { scene: "telephone",  nom: "Smartphone", emoji: "📱", quand: "2007", x: 652, y: 478 },
};
export const ANACHRONISME_DE = Object.fromEntries(Object.entries(ANACHRONISMES).map(([id, a]) => [a.scene, id]));

/* MARTINE, à chaque tableau entièrement remis en ordre (dans l'ordre). */
export const MARTINE_REPARE = [
  "Pourquoi tu fais ça ? C'était si bien rangé.",
  "Ce souvenir va te faire mal.",
  "Arrête. Tu te souviens trop.",
  "Mon monde… se fissure.",
  "Je ne peux pas ranger ce dont tu te souviens.",
  "Rends-moi mon monde.",
  "Non…",
];
