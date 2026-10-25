/* ============================================================
   JEU 3 — La bibliothèque du Puits (niveau +1)
   ------------------------------------------------------------
   L'ancienne bibliothèque de papier de la station, descendue au
   Puits en 2047. Plus personne n'y va : « tout est dans mes
   archives », dit MARTINE. Elle réécrit les archives numériques,
   mais ne relit pas le papier : c'est là qu'Al3x1a a semé ses
   « cailloux » (voir cailloux.js).

   Rangement : classification décimale de Melvil Dewey (1876),
   en version simplifiée comme dans les CDI. Chaque livre a une
   cote = l'indice Dewey + les trois premières lettres du nom de
   l'auteur (ou du titre pour un ouvrage collectif).
   Les livres d'un rayon sont triés par cote, comme sur une vraie
   étagère.

   La RÉSERVE : les livres que MARTINE a fait retirer des rayons le
   12 mars 2047, jour du scellement (clin d'œil à Fahrenheit 451,
   Bradbury, 1953). Leur place est restée vide dans leur rayon,
   avec une fiche « retiré · voir la réserve ». Jorge en a la clé.

   Sources des indices : classification décimale de Dewey (DDC),
   classes et divisions courantes utilisées en CDI (004 informatique,
   070 journalisme, 153 mémoire, 292 mythologie grecque, 398.2
   contes, 411 écritures, 529 chronologie et mesure du temps,
   551.2 volcans, 551.6 climat, 609 inventions, 621.38
   télécommunications, 631.585 culture hors-sol, 686.2 imprimerie,
   770 photographie, 791.43 cinéma, 823 roman anglais, 843 roman
   français, 912 atlas, 932 Égypte ancienne…). Œuvres réelles :
   Perrault, Contes (1697) ; Grimm, Contes (1812) ; La Fontaine,
   Fables (1668) ; Molière, Le Médecin malgré lui (1666) ; Hugo,
   Notre-Dame de Paris (1831) ; Sand, La Petite Fadette (1849) ;
   Verne, Le Tour du monde en quatre-vingts jours (1872) ; Wells,
   La Machine à explorer le temps (1895) ; Homère, L'Odyssée.
   Les autres livres et auteurs sont inventés pour le jeu.
   ============================================================ */

/* Les dix classes, telles que sur l'affiche de l'entrée. */
export const CLASSES = [
  { id: "000", nom: "Généralités", couleur: "#8a8f99", exemples: "encyclopédies, informatique, presse et journaux, bibliothèques" },
  { id: "100", nom: "Philosophie, psychologie", couleur: "#9a6ab0", exemples: "penser, la mémoire, les émotions, le bien et le mal" },
  { id: "200", nom: "Religions, mythologies", couleur: "#c08a3a", exemples: "religions du monde, dieux grecs, égyptiens, nordiques" },
  { id: "300", nom: "Société", couleur: "#d0603a", exemples: "vivre ensemble, lois, école, environnement, contes et légendes" },
  { id: "400", nom: "Langues", couleur: "#d0b040", exemples: "écritures du monde, français, anglais, dictionnaires" },
  { id: "500", nom: "Sciences", couleur: "#4aa86a", exemples: "nombres, étoiles, mesure du temps, physique, Terre, plantes, animaux" },
  { id: "600", nom: "Techniques", couleur: "#3a8ac8", exemples: "inventions, corps humain, radio, robots, jardinage, cuisine, imprimerie" },
  { id: "700", nom: "Arts, loisirs, sports", couleur: "#c84a8a", exemples: "BD, photographie, musique, cinéma, jeux, sports" },
  { id: "800", nom: "Littérature", couleur: "#b03a3a", exemples: "romans, poésie, théâtre" },
  { id: "900", nom: "Histoire, géographie", couleur: "#7a5a3a", exemples: "voyages, atlas, préhistoire, Égypte, Moyen Âge, histoire de France" },
];

/* Index des sujets (à côté de l'affiche) : pour passer d'un sujet
   à sa cote. Ordre alphabétique. */
export const INDEX = [
  ["Animaux", "590"], ["Astronomie, étoiles", "520"], ["Atlas", "912"], ["Bande dessinée", "741.5"],
  ["Calendriers, mesure du temps", "529"], ["Cinéma", "791.43"], ["Climat, météo", "551.6"],
  ["Contes et légendes", "398.2"], ["Corps humain", "612"], ["Cuisine", "641.5"], ["Dictionnaires de français", "443"],
  ["École, éducation", "370"], ["Écritures du monde", "411"], ["Émotions", "152.4"], ["Encyclopédies", "030"],
  ["Environnement", "363.7"], ["Égypte ancienne", "932"], ["Histoire de France", "944"], ["Histoire du monde", "909"],
  ["Imprimerie", "686.2"], ["Informatique, ordinateurs", "004"], ["Inventions", "609"], ["Jardinage hors-sol", "631.585"],
  ["Jeux", "793"], ["Journalisme, presse", "070"], ["Langue française", "440"], ["Lois", "340"],
  ["Mathématiques", "510"], ["Mémoire", "153.1"], ["Moyen Âge", "940.1"], ["Musique", "780"],
  ["Mythologie grecque", "292"], ["Photographie", "770"], ["Physique", "530"], ["Plantes", "580"],
  ["Poésie", "841"], ["Préhistoire", "930.1"], ["Radio, télégraphe", "621.38"], ["Religions du monde", "200"],
  ["Robots", "629.8"], ["Romans français", "843"], ["Sports", "796"], ["Théâtre", "842"],
  ["Vérifier une information", "070.4"], ["Volcans, séismes", "551.2"], ["Voyages", "910"],
];

/* Un livre : cote (indice), lettres (3 premières lettres de l'auteur
   ou du titre), titre, auteur, resume. `reserve` : retiré par
   MARTINE, rangé dans la réserve (sa place reste vide au rayon). */
const L = (indice, lettres, titre, auteur, resume, extra = {}) => ({ indice, lettres, titre, auteur, resume, ...extra });

export const LIVRES = [
  /* 000 · Généralités */
  L("001", "SAV", "Le Grand Livre du savoir", "Claire Savard", "Comment les humains ont appris tout ce qu'ils savent, et comment ils le transmettent."),
  L("004", "BOU", "Les machines qui calculent", "Inès Boulier", "Du boulier à l'ENIAC (1946), puis aux intelligences artificielles : comment une machine calcule, et pourquoi il faut toujours vérifier ce qu'elle dit.", { reserve: true }),
  L("005", "COD", "Programmer pas à pas", "Lucas Codet", "Donner des ordres à un ordinateur, une ligne après l'autre."),
  L("020", "BIB", "Comment marche une bibliothèque", "Marie Bibault", "La classification de Melvil Dewey (1876), les cotes sur le dos des livres, les rayons de 000 à 900 : tout pour trouver un livre sans aide.", { aide: "Une page est cornée : « La cote est l'adresse du livre. Le premier chiffre donne le rayon, la suite précise le sujet, les trois lettres viennent de l'auteur. »" }),
  L("030", "ENC", "Encyclopédie des juniors", "collectif", "Dix mille articles, de « abeille » à « zèbre »."),
  L("070", "JOU", "Fabriquer un journal", "Henri Jourdan", "Le rôle d'une rédaction, le choix des titres, la une."),
  L("070.4", "VER", "Vérifier une information", "Paul Vérin", "Qui parle ? D'où vient l'information ? Comment la recouper avec d'autres sources ?", { reserve: true }),
  /* 100 · Philosophie, psychologie */
  L("100", "PEN", "Penser par soi-même", "Agathe Penvern", "Les grandes questions, posées simplement : qu'est-ce qui est vrai ? qui décide ?"),
  L("152.4", "EME", "Les émotions", "Julien Émery", "La peur, la colère, la joie : à quoi servent nos émotions."),
  L("153.1", "MEM", "La mémoire", "Lou Mémet", "Comment on se souvient, comment on oublie, et comment un souvenir peut changer sans qu'on s'en aperçoive.", { reserve: true }),
  L("170", "BIE", "Le bien, le mal", "Sophie Bienvenu", "Faire ce qui est juste, même quand personne ne regarde."),
  /* 200 · Religions, mythologies */
  L("200", "REL", "Les religions du monde", "collectif", "Croyances, fêtes et lieux sacrés, sur les cinq continents."),
  L("292", "ARG", "Dieux et héros grecs", "Hélène Argos", "Zeus, Athéna, Ulysse et les autres."),
  L("293", "NOR", "Les dieux du Nord", "Erik Nordahl", "Odin, Thor et le grand arbre du monde."),
  L("299.31", "KAR", "Les dieux de l'Égypte", "Nadia Karnak", "Râ, Isis, Osiris et la pesée du cœur."),
  /* 300 · Société */
  L("305.23", "ENF", "Être un enfant dans le monde", "Ana Enfantin", "Jouer, apprendre, avoir des droits : la vie des enfants d'un pays à l'autre."),
  L("340", "LOI", "Les lois, à quoi ça sert ?", "Jean Loiseau", "Qui écrit les règles, et pourquoi tout le monde doit les connaître."),
  L("363.7", "VER", "Protéger la planète", "Lina Verdier", "L'air, l'eau, les forêts : ce qui les abîme, ce qui les protège."),
  L("370", "ECO", "L'école d'autrefois", "Paul Écolier", "Plumes, ardoises et tableaux noirs."),
  L("398.2", "GRI", "Contes", "Jacob et Wilhelm Grimm", "Blanche-Neige, Hansel et Gretel, Le Loup et les Sept Chevreaux… (1812)."),
  L("398.2", "PER", "Contes", "Charles Perrault", "Le Petit Chaperon rouge, Cendrillon, le Petit Poucet… parus en 1697."),
  /* 400 · Langues */
  L("411", "CAL", "Les écritures du monde", "Myriam Calame", "Cunéiformes, hiéroglyphes, alphabets : comment on a appris à écrire."),
  L("420", "DOV", "Mon premier anglais", "Kate Dover", "Les mots de tous les jours, avec des images."),
  L("440", "LAN", "Le français, d'où vient-il ?", "Jules Langlois", "Du latin au français d'aujourd'hui."),
  L("443", "DIC", "Dictionnaire de français", "collectif", "Cinquante mille mots et leur définition."),
  /* 500 · Sciences */
  L("510", "NOM", "Le monde des nombres", "Théo Nombret", "Compter, mesurer, partager."),
  L("520", "ETO", "Les étoiles et les planètes", "Stéphane Étoile", "Le Soleil, la Lune, les constellations."),
  L("529", "SAB", "Mesurer le temps", "Anne Sablier", "Cadrans solaires, sabliers, calendriers, horloges : comment les humains ont appris à compter le temps."),
  L("530", "PHY", "La physique en s'amusant", "Max Physalis", "La lumière, le son, l'énergie… et une page sur les tachyons, des particules plus rapides que la lumière que personne n'a jamais observées."),
  L("551.2", "LAV", "Volcans et séismes", "Inès Lavaud", "Pourquoi la Terre tremble et crache du feu."),
  L("551.6", "CLI", "Le climat de la Terre", "Nora Climent", "Vents, pluies, saisons : comment on mesure l'air que l'on respire dehors.", { reserve: true }),
  L("580", "PLA", "Les plantes", "Rose Plantier", "Des graines aux arbres géants."),
  L("590", "ANI", "Les animaux du monde", "collectif", "Mille animaux, des pôles à l'équateur."),
  /* 600 · Techniques */
  L("609", "TRO", "Le grand livre des inventions", "Léon Trouvé", "Du silex taillé au smartphone : qui a inventé quoi, et quand."),
  L("612", "COR", "Le corps humain", "Alice Cordier", "Le cœur, les poumons, le cerveau."),
  L("621.38", "OND", "Du télégraphe à la radio", "Marc Ondel", "Chappe, Morse, Marconi : envoyer un message de plus en plus loin."),
  L("629.8", "AUT", "Les robots", "Yuki Automa", "Des automates d'autrefois aux robots d'aujourd'hui."),
  L("631.585", "POT", "Jardiner sans terre", "Basile Potager", "La culture hors-sol, ou hydroponie : des plantes qui poussent dans l'eau.", { serres: true }),
  L("641.5", "TOQ", "La cuisine des enfants", "Paul Toque", "Trente recettes faciles."),
  L("686.2", "PLO", "Gutenberg et l'imprimerie", "Hélène Plomb", "Vers 1450, à Mayence, des caractères mobiles en métal changent le monde."),
  /* 700 · Arts, loisirs, sports */
  L("741.5", "BUL", "Faire sa bande dessinée", "Hugo Bulle", "Cases, bulles et onomatopées."),
  L("770", "OMB", "Les débuts de la photographie", "Louise Ombrel", "Niépce, Daguerre, et les premières images fixées sur une plaque."),
  L("780", "HAR", "Les instruments de musique", "Lucie Harpin", "Cordes, vents, percussions."),
  L("791.43", "BOB", "Les frères Lumière et le cinéma", "Antoine Bobine", "28 décembre 1895, Grand Café, Paris : la première séance payante."),
  L("793", "LUD", "Jeux pour les jours de pluie", "Tom Ludo", "Devinettes, énigmes et jeux à plusieurs."),
  L("796", "STA", "Les sports olympiques", "Marie Stade", "Courir, sauter, nager, plus vite et plus loin."),
  /* 800 · Littérature */
  L("823", "WEL", "La Machine à explorer le temps", "H. G. Wells", "Un inventeur voyage jusqu'en l'an 802 701. Roman paru en 1895."),
  L("841", "LAF", "Fables", "Jean de La Fontaine", "La Cigale et la Fourmi, Le Corbeau et le Renard… (1668)."),
  L("842", "MOL", "Le Médecin malgré lui", "Molière", "Un bûcheron forcé de jouer au médecin (1666)."),
  L("843", "HUG", "Notre-Dame de Paris", "Victor Hugo", "Quasimodo, Esmeralda et la cathédrale (1831)."),
  L("843", "SAN", "La Petite Fadette", "George Sand", "Une jeune fille du Berry dont tout le village se moque, à tort (1849)."),
  L("843", "VER", "Le Tour du monde en quatre-vingts jours", "Jules Verne", "Phileas Fogg parie qu'il fera le tour de la Terre en quatre-vingts jours (1872)."),
  L("883", "HOM", "L'Odyssée", "Homère", "Le long retour d'Ulysse vers Ithaque."),
  /* 900 · Histoire, géographie */
  L("909", "HIS", "Une histoire du monde", "collectif", "De la préhistoire à 2047, toutes les grandes dates.", { reserve: true }),
  L("910", "BOU", "Voyages autour du monde", "Anna Boussole", "Déserts, forêts, montagnes et grandes villes."),
  L("912", "ATL", "Atlas du monde", "collectif", "Toutes les cartes, tous les pays."),
  L("930.1", "SIL", "La préhistoire", "Paul Silex", "Les premiers outils, le feu, les peintures des grottes."),
  L("932", "NIL", "L'Égypte des pharaons", "Nadia Nil", "Pyramides, hiéroglyphes et papyrus."),
  L("940.1", "DON", "Le Moyen Âge", "Jeanne Donjon", "Châteaux, moines copistes et cathédrales."),
  L("944", "DUR", "L'histoire de France", "Marc Durand", "Deux mille ans d'histoire, date après date.", { reserve: true }),
];

/* Identifiant stable d'un livre : « 398.2 PER ». */
export const coteDe = (l) => `${l.indice} ${l.lettres}`;
export const classeDe = (l) => `${l.indice[0]}00`;

/* Tri des cotes comme sur une étagère : indice décimal, puis lettres. */
const cle = (l) => [parseFloat(l.indice), l.lettres];
export function trierCotes(a, b) {
  const [na, la] = cle(a), [nb, lb] = cle(b);
  return na !== nb ? na - nb : la.localeCompare(lb);
}

/* Livres d'un rayon (y compris les places vides des livres retirés). */
export function livresDuRayon(classeId) {
  return LIVRES.filter((l) => classeDe(l) === classeId).sort(trierCotes);
}
export const LIVRES_RESERVE = LIVRES.filter((l) => l.reserve).sort(trierCotes);
export const DATE_RETRAIT = "12 mars 2047";
