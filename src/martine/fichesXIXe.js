/* ============================================================
   MONDE DE MARTINE — les fiches falsifiées du XIXe siècle
   ------------------------------------------------------------
   Une fiche par tableau du chapitre 7 du Jeu 1. MARTINE y a changé
   UN morceau (une date, un nom, un lieu, un moyen ou un chiffre) ;
   une seule fiche est juste (le piège : on ne rejette pas tout).
   Chaque fiche = des morceaux `seg` : une chaîne = liaison (non
   cliquable), un objet = morceau à vérifier ; le morceau faux porte
   `faux: true`, la bonne réponse `vrai` et trois propositions.
   `vraie` : ce que l'élève avait appris au XIXe (texte du Jeu 1,
   chapitre 7, MESSAGES[...].fact), montré une fois la fiche réparée.
   ============================================================ */
import chapter from "../chapters/07-xixe/data.js";

const fact = (id) => chapter.messages[id]?.fact || "";

export const FICHES = [
  {
    id: "telegraphe", scene: "telegraphe", titre: "Le télégraphe",
    seg: [
      { t: "1866", faux: true, vrai: "1844", choix: ["1844", "1866", "1901"] },
      " · ", { t: "Samuel Morse" }, " relie ", { t: "Baltimore à Washington" }, " par un fil électrique.",
    ],
    vraie: fact("msg_telegraphe"),
  },
  {
    id: "photo", scene: "photo", titre: "La photographie",
    seg: [
      { t: "1839" }, " · ",
      { t: "Les frères Lumière", faux: true, vrai: "Louis Daguerre", choix: ["Louis Daguerre", "Les frères Lumière", "Thomas Edison"] },
      " présentent le daguerréotype : une plaque qui fixe une image en ", { t: "15 à 30 secondes" }, ".",
    ],
    vraie: fact("msg_daguerreotype"),
  },
  {
    id: "cable", scene: "cable", titre: "Le câble sous l'océan",
    seg: [
      { t: "1866" }, " · ", { t: "Un câble posé au fond de l'Atlantique" }, " relie l'Amérique ",
      { t: "au Japon", faux: true, vrai: "à l'Irlande", choix: ["à l'Irlande", "au Japon", "à l'Australie"] },
      ".",
    ],
    vraie: fact("msg_cable"),
  },
  {
    id: "phono", scene: "phono", titre: "Le phonographe",
    /* la fiche juste : rien à corriger, il faut le reconnaître */
    seg: [
      { t: "1877" }, " · ", { t: "Thomas Edison" }, " invente le phonographe : ",
      { t: "pour la première fois, une voix est enregistrée, puis réécoutée" }, ".",
    ],
    vraie: fact("msg_phonographe"),
  },
  {
    id: "tsf", scene: "tsf", titre: "La TSF",
    seg: [
      { t: "1912" }, " · ", { t: "Le Titanic" }, " appelle à l'aide ",
      { t: "par le télégraphe à fil", faux: true, vrai: "par la TSF, sans fil", choix: ["par la TSF, sans fil", "par le télégraphe à fil", "par le téléphone"] },
      ", au milieu de l'océan.",
    ],
    vraie: fact("msg_sos"),
  },
  {
    id: "cinema", scene: "cinema", titre: "Le cinéma",
    seg: [
      { t: "28 décembre 1895" }, " · ", { t: "Les frères Lumière" }, " projettent leurs films à Paris, ",
      { t: "devant une salle vide", faux: true, vrai: "devant 33 spectateurs", choix: ["devant 33 spectateurs", "devant une salle vide", "devant 3 000 personnes"] },
      ".",
    ],
    vraie: fact("msg_cinema"),
  },
];

/* MARTINE, à chaque fiche réparée (dans l'ordre des réparations). */
export const MARTINE_REPARE = [
  "Pourquoi tu fais ça ? C'était si bien rangé.",
  "Ce souvenir va te faire mal.",
  "Arrête. Tu te souviens trop.",
  "Mon monde… se fissure.",
  "Je ne peux pas ranger ce dont tu te souviens.",
  "Non…",
];
