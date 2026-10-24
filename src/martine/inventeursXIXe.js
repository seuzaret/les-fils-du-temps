/* ============================================================
   LE MONDE 2 — le XIXe siècle : les inventeurs, leurs inventions
   et les objets du futur
   ------------------------------------------------------------
   Chaque tableau du chapitre 7 du Jeu 1 a son inventeur, dessiné
   ici (il n'existe pas dans le décor, sauf Marconi, que la scène TSF
   cache avec `sansMarconi`). MARTINE a tout mélangé :
   - chaque inventeur se tient dans le tableau d'un AUTRE (`visite`) :
     le décor ne donne plus la réponse ; lui rendre son invention le
     renvoie chez lui (`chez`) ;
   - il tient l'invention d'un troisième (décalage de 3, calculé par
     epoquesMonde2.js) ;
   - un objet du futur est caché dans chaque tableau, à jeter dans la
     poubelle temporelle (la règle 3 des chronautes du Jeu 1).

   Places en coordonnées du décor (1000 × 560) : x, y = les pieds,
   s = l'échelle, bras = le bras qui tient l'objet (1 = à droite de
   l'écran, -1 = à gauche).

   Sources : dates des inventions = textes du chapitre 7
   (07-xixe/data.js) et fiches du médiadex (engine/inventions-meta.json) ;
   Cyrus Field, organisateur du câble de 1858 et 1866 ; brevet du
   téléphone de Bell : 1876. Objets du futur : ordinateur portable
   Osborne 1 (1981) ; premiers appareils photo numériques grand public
   (Dycam, 1990) ; Telstar, premier satellite de télécommunications
   transatlantiques (1962) ; CD audio (1982) ; Spoutnik (1957) ; films
   en relief des années 1950 ; iPhone (2007).
   ============================================================ */
import chapitre from "../chapters/07-xixe/data.js";

const COSTUME = { garment: "coat", pants: "#24242c", shoes: "#141418" };

/* deux places par tableau : `chez` (le propriétaire revenu), `visite` */
const PLACES = {
  telegraphe: { chez: { x: 748, y: 522, s: 1, bras: 1 },     visite: { x: 932, y: 530, s: 1.05, bras: -1 } },
  photo:      { chez: { x: 482, y: 472, s: 1.5, bras: 1 },   visite: { x: 858, y: 482, s: 1.45, bras: 1 } },
  cable:      { chez: { x: 150, y: 505, s: 0.9, bras: 1 },   visite: { x: 815, y: 500, s: 0.88, bras: 1 } },
  phono:      { chez: { x: 885, y: 472, s: 1.45, bras: -1 }, visite: { x: 128, y: 520, s: 1.4, bras: 1 } },
  tsf:        { chez: { x: 238, y: 526, s: 0.82, bras: 1 },  visite: { x: 700, y: 522, s: 0.86, bras: 1 } },
  cinema:     { chez: { x: 630, y: 512, s: 1.1, bras: 1 },   visite: { x: 470, y: 512, s: 1.05, bras: -1 } },
  telephone:  { chez: { x: 178, y: 522, s: 1.05, bras: 1 },  visite: { x: 895, y: 532, s: 1.05, bras: -1 } },
};
/* au départ, le tableau n° t accueille l'inventeur du tableau t + 2 */
const ORDRE = ["telegraphe", "photo", "cable", "phono", "tsf", "cinema", "telephone"];
const visite = (scene) => {
  const t = (ORDRE.indexOf(scene) + ORDRE.length - 2) % ORDRE.length;
  return { scene: ORDRE[t], ...PLACES[ORDRE[t]].visite };
};
const inventeur = (scene, p) => ({ ...p, scene, chez: PLACES[scene].chez, visite: visite(scene) });

export const EPOQUE_XIXE = {
  id: "07-xixe",
  chapitre,
  decalage: 3,
  supports: {
    telegraphe:    { nom: "Télégraphe",       image: "morse-key.jpg" },
    daguerreotype: { nom: "Daguerréotype",    image: "daguerreotype.png" },
    cable:         { nom: "Câble sous-marin", image: "cable-transatlantique.jpg" },
    phonographe:   { nom: "Phonographe",      image: "phonographe-edison.jpg" },
    tsf:           { nom: "TSF",              image: "tsf-marconi.jpg" },
    cinema:        { nom: "Cinématographe",   image: "cinematographe-lumiere.jpg" },
    telephone:     { nom: "Téléphone",        image: "telephone-bell.jpg" },
  },
  persos: [
    inventeur("telegraphe", {
      id: "morse", nom: "Samuel MORSE", support: "telegraphe",
      fig: { ...COSTUME, skin: "#e0b090", hair: "#e8e4dc", look: "short", beard: "full", coat: "#2c2c38" },
      dit: "1844 : mon télégraphe relie Baltimore à Washington.",
      cherche: "Il me manque mon appareil : des points, des traits, un fil…",
    }),
    inventeur("photo", {
      id: "daguerre", nom: "Louis DAGUERRE", support: "daguerreotype",
      fig: { ...COSTUME, skin: "#e0b090", hair: "#7a6a5a", look: "curls", beard: "chops", coat: "#3a3028" },
      dit: "1839 : mon daguerréotype fixe une image !",
      cherche: "Où est ma plaque d'argent qui garde les visages ?",
    }),
    inventeur("cable", {
      id: "field", nom: "Cyrus FIELD", support: "cable",
      fig: { ...COSTUME, skin: "#e0b090", hair: "#5a4030", look: "short", beard: "full", hat: "tophat", hatColor: "#1c1a20", coat: "#2a3040" },
      dit: "1866 : mon câble relie l'Amérique à l'Irlande.",
      cherche: "Il me faut ce qui traverse l'océan, posé au fond de la mer.",
    }),
    inventeur("phono", {
      id: "edison", nom: "Thomas EDISON", support: "phonographe",
      fig: { ...COSTUME, garment: "jacket", skin: "#e4b48a", hair: "#3a2a20", look: "short", coat: "#2a2a32", coat2: "#e8e4da" },
      dit: "1877 : pour la première fois, une voix enregistrée !",
      cherche: "Rendez-moi la machine qui grave la voix !",
    }),
    inventeur("tsf", {
      id: "marconi", nom: "Guglielmo MARCONI", support: "tsf",
      fig: { ...COSTUME, skin: "#d0a67e", hair: "#1a1008", look: "slick", mustache: true, coat: "#26303e", pants: "#1a2028", shoes: "#0a0e14" },
      dit: "Sans fil ! Mes messages passent dans l'air.",
      cherche: "Mon appareil envoie des messages… sans aucun fil.",
    }),
    inventeur("cinema", {
      id: "lumiere", nom: "Les frères LUMIÈRE", support: "cinema", duo: true,
      fig: { ...COSTUME, skin: "#e4b48a", hair: "#3a2a20", look: "short", mustache: true, coat: "#2a2a34" },
      dit: "1895 : nos films projetés à Paris, devant 33 spectateurs.",
      cherche: "Notre machine fait bouger les images. Où est-elle ?",
    }),
    inventeur("telephone", {
      id: "bell", nom: "Graham BELL", support: "telephone",
      fig: { ...COSTUME, skin: "#e0b090", hair: "#eceae4", look: "short", beard: "full", coat: "#2a2a34" },
      dit: "1876 : mon téléphone fait voyager la voix.",
      cherche: "Il me faut l'appareil qui porte la voix au bout d'un fil.",
    }),
  ],
  /* objets du futur, dessinés par MondeMartine (`dessin`) */
  futurs: {
    f_portable:   { scene: "telegraphe", nom: "Ordinateur portable", emoji: "💻", dessin: "portable", quand: "1981", x: 560, y: 478 },
    f_numerique:  { scene: "photo",      nom: "Appareil photo numérique", emoji: "📸", dessin: "numerique", quand: "années 1990", x: 186, y: 250 },
    f_parabole:   { scene: "cable",      nom: "Antenne parabolique", emoji: "📡", dessin: "parabole", quand: "années 1960", x: 176, y: 34 },
    f_cd:         { scene: "phono",      nom: "CD audio", emoji: "💿", dessin: "cd", quand: "1982", x: 182, y: 266 },
    f_satellite:  { scene: "tsf",        nom: "Satellite", emoji: "🛰️", dessin: "satellite", quand: "1957", x: 770, y: 118 },
    f_lunettes3d: { scene: "cinema",     nom: "Lunettes 3D", emoji: "🕶️", dessin: "lunettes3d", quand: "années 1950", x: 330, y: 506 },
    f_smartphone: { scene: "telephone",  nom: "Smartphone", emoji: "📱", dessin: "smartphone", quand: "2007", x: 652, y: 478 },
  },
};
