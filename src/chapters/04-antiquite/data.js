/* ============================================================
   CHAPITRE 4 — Antiquité : la villa de Caius, à Pompéi (an 79)
   ============================================================
   3 tableaux, tous à Pompéi (même fond : la ville + le Vésuve) :
   l'entrée de la villa · la bibliothèque · le jardin & l'atelier.
   QUÊTE : Caius, marchand d'olives, rénove sa villa et prépare
   une grande fête ; il fait venir l'étranger (toi) et ses artisans.
   On note, on invite, on peint, on grave, on écrit — et le Vésuve
   couve, que personne ne regarde…
   ============================================================ */

import SceneEntree from "./scenes/ScenePompei.jsx";
import SceneBibliotheque from "./scenes/SceneAlexandrie.jsx";
import SceneJardin from "./scenes/SceneForum.jsx";
import SceneForumPompei from "./scenes/SceneForumPompei.jsx";
import SceneThermes from "./scenes/SceneThermes.jsx";
import ScenePort from "./scenes/ScenePort.jsx";
import { PortraitCaius } from "./scenes/portraits.jsx";
import CarteAntiquite from "./scenes/CarteAntiquite.jsx";

/* ------------------------------------------------------------
   LES ÉLÉMENTS
   ------------------------------------------------------------ */
const ITEMS = {
  /* ANACHRONISME */
  lunettes_soleil: { name: "Lunettes de soleil", emoji: "🕶️", anachronic: true, desc: "Des Ray-Ban en plastique noir — modèle Aviator. Les lunettes de soleil modernes datent des années 1930. Ni verre bombé, ni plastique en Antiquité." },

  /* Tableau 1 — l'entrée de la villa */
  voix:     { name: "Ta voix (avec Argos)", emoji: "🗣️", desc: "« Pas le temps d'écrire mille invitations ! On va les CRIER sur la place », dit Argos. Ta voix, lancée à la foule : vite et large… mais demain, il n'en restera rien." },
  foule:    { name: "La foule", emoji: "👥", support: true, desc: "La foule de Pompéi, sur la place. Une annonce criée ici fait vite le tour de la ville — mais rien n'en restera demain." },
  pierre:   { name: "Dalle de pierre", emoji: "🪨", support: true, desc: "Une belle dalle à l'entrée de la villa. De quoi graver des lettres que tous verront… pour très longtemps." },

  /* Tableau 2 — la bibliothèque */
  mur:      { name: "Mur enduit frais", emoji: "🧱", support: true, desc: "Un pan de mur tout juste plâtré, encore humide. Peint maintenant, la couleur entrera DANS le mur." },
  pigments: { name: "Pigments", emoji: "🎨", desc: "Rouge cinabre, bleu égyptien, ocres : les couleurs des maîtres de Pompéi." },
  encre:    { name: "Encre", emoji: "🖤", desc: "Un encrier sur le bureau. Avec une bonne page, on peut copier un texte entier." },
  ombilicus:{ name: "Umbilicus", emoji: "🪄", desc: "Le bâton central autour duquel on enroule une page pour en faire un rouleau (volumen)." },
  bibliotheque: { name: "La bibliothèque", emoji: "📚", support: true, desc: "Les rayonnages de Caius. Comme à Alexandrie, on y range les rouleaux pour garder le savoir en un seul lieu." },

  /* Tableau 3 — le jardin & l'atelier */
  cire_abeille: { name: "Cire d'abeille", emoji: "🍯", desc: "De la cire tiède, prise aux ruches du jardin. Coulée sur une planche, elle fait une surface où écrire." },
  planche:  { name: "Planche de bois", emoji: "🪵", desc: "Une planchette bien plane, prise à l'atelier. Creusée et remplie de cire, elle devient une tablette." },
  branche:  { name: "Stylet (branche taillée)", emoji: "✒️", desc: "Une branchette taillée : la pointe pour écrire dans la cire, le côté plat pour tout lisser et effacer. Le stylet du scribe." },
  vache:    { name: "La vache", emoji: "🐄", support: true, desc: "La vache du jardin. Sa peau, bien préparée, deviendra un support solide : le parchemin." },
  epee:     { name: "Épée", emoji: "⚔️", desc: "Une lame de l'atelier. De quoi prélever et parer une peau." },
  burin:    { name: "Burin", emoji: "🔨", desc: "Un ciseau et un maillet : pour entailler la pierre, lettre après lettre." },
  grattoir: { name: "Grattoir & ponce", emoji: "🔪", desc: "Une lame et une pierre ponce : pour racler et lisser la peau jusqu'à obtenir un parchemin." },

  /* ÉPHÉMÈRES (disparaissent au changement de tableau) */
  denier:       { name: "Denier romain", emoji: "🪙", ephemere: true, desc: "Une pièce d'argent : le denier, monnaie de tous les jours à Rome." },
  tesson:       { name: "Tesson d'amphore", emoji: "🧱", ephemere: true, desc: "Un bout d'amphore cassée, sûrement plein de garum autrefois." },
  fiole_cassee: { name: "Fiole cassée", emoji: "💎", ephemere: true, desc: "Un fragment de verre bleuté — flacon à parfum brisé aux thermes." },
  tessera:      { name: "Tessera de mosaïque", emoji: "◾", ephemere: true, desc: "Un petit cube de pierre noire, tombé d'une mosaïque." },
  oursin:       { name: "Oursin séché", emoji: "🦔", ephemere: true, desc: "Un test d'oursin échoué sur le quai, tout hérissé." },
  cordage:      { name: "Bout de cordage", emoji: "🪢", ephemere: true, desc: "Un morceau de corde en fibre, comme celles des voiles romaines." },

  /* fabriqués */
  tablette_cire: { name: "Tablette de cire", emoji: "🟨", desc: "Une planche remplie de cire : on y écrit au stylet… et on lisse tout pour recommencer. Le brouillon de l'Antiquité." },
  peau:     { name: "Peau brute", emoji: "🟫", desc: "Une peau fraîche. Grattée et poncée, elle deviendra un parchemin." },
  parchemin:{ name: "Parchemin", emoji: "📃", desc: "Une peau devenue page : lisse, solide, durable… mais chère (un troupeau pour un gros livre)." },
  ode:      { name: "L'ode manuscrite", emoji: "📝", desc: "Le poème de Caius, copié à l'encre sur le parchemin. Reste à l'enrouler pour en faire un rouleau." },
  volumen:  { name: "Volumen (rouleau)", emoji: "📜", desc: "Le parchemin enroulé autour de son bâton : un rouleau, qu'on lit en le déroulant. Sa place est à la bibliothèque." },
};

/* ------------------------------------------------------------
   LES TABLEAUX  (tous à Pompéi ; navigation libre dans la villa)
   ------------------------------------------------------------ */
const SCENES = [
  /* Les 3 tableaux d'AMBIANCE (le monde autour de la villa) viennent
     à gauche ; on démarre à la villa (index 3) et on peut naviguer en
     arrière (le port, les thermes, le forum) via les flèches ‹. */
  { id: "port",         name: "Le port et le Vésuve",  Component: ScenePort },
  { id: "thermes",      name: "Les thermes",           Component: SceneThermes },
  { id: "forum",        name: "Le forum de Pompéi",    Component: SceneForumPompei },
  { id: "entree",       name: "L'entrée de la villa",  Component: SceneEntree },
  { id: "bibliotheque", name: "La bibliothèque",       Component: SceneBibliotheque },
  { id: "jardin",       name: "Le jardin & l'atelier", Component: SceneJardin },
];

const WHERE = {
  voix: "à l'entrée de la villa, près d'Argos",
  pigments: "dans la bibliothèque", encre: "sur le bureau de la bibliothèque", ombilicus: "dans la bibliothèque",
  cire_abeille: "aux ruches du jardin", planche: "à l'atelier du jardin", branche: "près de l'arbre du jardin",
  epee: "à l'atelier du jardin", burin: "à l'atelier du jardin", grattoir: "à l'atelier du jardin",
};

const HIDDEN_BY_FLAG = {};

/* ------------------------------------------------------------
   LES RECETTES
   ------------------------------------------------------------ */
const RECIPES = [
  /* Noter les travaux : la tablette de cire (support effaçable) */
  { a: "cire_abeille", b: "planche", out: "tablette_cire",
    line: "Tu coules la cire tiède sur la planche creusée : une TABLETTE DE CIRE, prête à écrire." },
  { a: "tablette_cire", b: "branche", out: "msg_cire", msg: true },

  /* Lancer les invitations : la voix + la foule (annonce publique) */
  { a: "voix", b: "foule", out: "invites", gives: [], consume: ["voix"], flag: "invited",
    line: "Tu cries l'invitation de Caius sur la place : la foule se la répète de bouche à oreille, et toute la ville est au courant avant midi. Rapide et large… mais demain, il n'en restera rien." },

  /* La fresque sur le mur frais */
  { a: "pigments", b: "mur", out: "msg_fresque", msg: true },

  /* Graver la gloire de Rome dans la pierre */
  { a: "burin", b: "pierre", out: "msg_inscription", msg: true },

  /* L'ode : peau → parchemin → écrit → rouleau → bibliothèque */
  { a: "vache", b: "epee", out: "peau",
    line: "Tu prélèves et pares une peau sur la bête : brute et poilue, elle ne vaut encore rien pour écrire." },
  { a: "grattoir", b: "peau", out: "parchemin",
    line: "Grattée à la lame, lissée à la ponce : la peau devient PARCHEMIN. Solide et durable… mais il en faut un troupeau pour un gros livre." },
  { a: "parchemin", b: "encre", out: "ode",
    line: "À l'encre, tu copies l'ode de Caius sur le parchemin : un vrai manuscrit. Cher — le savoir écrit redevient un luxe de riches." },
  { a: "ode", b: "ombilicus", out: "volumen",
    line: "Tu enroules le parchemin autour de son bâton : un VOLUMEN. On le lira en le déroulant — impossible de sauter à la page 50." },
  { a: "volumen", b: "bibliotheque", out: "msg_bibliotheque", msg: true },
];

/* ------------------------------------------------------------
   LES MESSAGES (fiches + jauges 1 à 5)
   ------------------------------------------------------------ */
const MESSAGES = {
  msg_cire: { title: "Écrire sur la cire", emoji: "🪧",
    jauges: { vitesse: 2, portee: 1, capacite: 2, durabilite: 1 },
    fact: "Une planchette de bois remplie de cire : on y écrit au stylet, puis d'un coup du dos plat on LISSE tout pour recommencer. C'est le premier support réinscriptible de l'Histoire — le brouillon, la liste de courses, l'exercice d'écolier. Il ne dure pas, et c'est justement le but. Son lointain descendant ? L'ardoise… et la mémoire réinscriptible de nos ordinateurs (la RAM), qu'on efface et réécrit des milliards de fois." },
  msg_fresque: { title: "Peindre le mur (fresque)", emoji: "🖼️",
    jauges: { vitesse: 1, portee: 3, capacite: 3, durabilite: 4 },
    fact: "Sur un enduit encore frais, on peint à même le mur : les couleurs pénètrent le plâtre et deviennent le mur lui-même — la fresque. À Pompéi, figée par la cendre du Vésuve en l'an 79, les villas en sont couvertes. Et sur les murs des rues, des milliers de GRAFFITIS — publicités électorales, insultes, déclarations d'amour, comptes de taverne : les « réseaux sociaux » de l'Antiquité, gelés d'un coup par la lave. L'image qui décore, qui vend, qui bavarde.",
    wiki: "https://fr.wikipedia.org/wiki/Peinture_romaine" },
  msg_inscription: { title: "Graver dans le marbre", emoji: "🏛",
    jauges: { vitesse: 1, portee: 3, capacite: 2, durabilite: 5 },
    fact: "Graver la gloire (ou la loi) dans la pierre, à l'entrée, là où tout le monde passe : voilà comment on PUBLIE officiellement dans l'Antiquité. « Nul n'est censé ignorer la loi » prend ici son sens littéral. Lent à produire, immobile… mais public, solennel et quasi éternel. Aujourd'hui encore, on grave dans la pierre ce qu'on veut rendre incontestable : monuments, plaques, mémoriaux." },
  msg_bibliotheque: { title: "Écrire sur du parchemin", emoji: "📚",
    jauges: { vitesse: 1, portee: 3, capacite: 5, durabilite: 2 },
    fact: "Peau → parchemin → manuscrit → rouleau : un vrai livre antique, rangé à la bibliothèque. Le rêve d'Alexandrie était de rassembler en un seul lieu TOUT le savoir du monde — jusqu'à ~700 000 rouleaux. Une capacité de stockage inouïe… mais tout au même endroit, sur un support fragile. Et Alexandrie a brûlé. La leçon-mère de l'archivage, encore vraie aujourd'hui : un stock UNIQUE qui disparaît, et tout est perdu. Il faut des COPIES, réparties — jamais tous ses œufs dans le même panier." },
};

/* ------------------------------------------------------------
   LES INDICES (bouton 💡)
   ------------------------------------------------------------ */
const HINTS = [
  { needs: ["cire_abeille", "planche"], out: "tablette_cire", text: "Coule la cire d'abeille sur la planche : tu auras une tablette où écrire." },
  { needs: ["tablette_cire", "branche"], out: "msg_cire", text: "Une tablette de cire, une branche taillée en pointe : note la liste des travaux — et souviens-toi qu'on peut tout effacer." },
  { needs: ["voix", "foule"], out: "invites", text: "Va sur la place avec Argos : crie l'invitation de Caius à toute la foule." },
  { needs: ["pigments", "mur"], out: "msg_fresque", text: "Le mur de la bibliothèque est encore frais : peins-le MAINTENANT avec les pigments." },
  { needs: ["burin", "pierre"], out: "msg_inscription", text: "Cette dalle à l'entrée, ce burin : grave la gloire de Rome pour que tous la voient — et pour l'éternité." },
  { needs: ["vache", "epee"], out: "peau", text: "Pour un parchemin, il faut d'abord une peau : la vache du jardin, une lame…" },
  { needs: ["grattoir", "peau"], out: "parchemin", text: "Gratte et ponce la peau jusqu'à la rendre lisse : un beau parchemin." },
  { needs: ["parchemin", "encre"], out: "ode", text: "Sur ce parchemin, à l'encre du bureau, copie l'ode de Caius." },
  { needs: ["ode", "ombilicus"], out: "volumen", text: "Enroule ton manuscrit autour du bâton (umbilicus) : ça fait un rouleau." },
  { needs: ["volumen", "bibliotheque"], out: "msg_bibliotheque", text: "Range ton rouleau à la bibliothèque, parmi les autres — comme à Alexandrie." },
];

const NEAR_MISS = [
  { pair: ["pierre", "encre"], line: "Écrire sur la pierre à l'encre ? Ça glisse et ça sèche mal. La pierre, ça se GRAVE — prends un burin." },
  { pair: ["peau", "encre"], line: "Écrire sur une peau brute et poilue ? Prépare-la d'abord : gratte-la et ponce-la en parchemin." },
  { pair: ["tablette_cire", "burin"], line: "Un burin sur la cire ? Tu traverses la planche. Une simple branche taillée suffit." },
  { pair: ["parchemin", "ombilicus"], line: "Enrouler un parchemin VIERGE ? Écris d'abord l'ode dessus, sinon ton rouleau ne raconte rien." },
  { pair: ["voix", "pierre"], line: "Crier vers une pierre ? Elle n'écoute pas. Pour une annonce, il te faut une FOULE." },
];

const FAIL_LINES = [
  "Bzzt. Ni la Grèce ni Rome n'ont retenu cette idée.",
  "Combinaison rejetée. Un support, un outil : reviens aux bases.",
  "Mes archives latines restent muettes là-dessus. Réessaie.",
  "Erreur : ces deux-là ne feront pas un message.",
  "Zéro invention détectée. On tente autre chose ?",
];

const INTRO = [
  "Du marbre, des colonnes, une villa cossue… on a changé de standing ! Nous voilà à Pompéi, l'an 79, chez Caius, marchand d'olives. Ne regarde pas trop la montagne, là, au fond : le Vésuve couve — et personne ici ne le sait encore.",
  "Caius rénove sa maison et prépare une grande fête. Il a fait venir des artisans… dont toi, l'étranger. Il va falloir tout noter, inviter la ville, peindre, graver, écrire.",
  "Aide-le : chaque support inventé remplit ma jauge. Trois suffiront pour repartir. Et devine laquelle de ces belles idées va très mal finir…",
];

const ACTIONS = {
  wreck: { mood: "vexe", say: "Oui, je me suis posée dans l'atrium. Non, ce n'était pas prévu. Et non, tu ne graveras pas ça sur la dalle de Caius." },

  /* Caius (repli ; ses vraies répliques sont dans QUETE) */
  caius: { mood: "neutre",
    bubble: "Ma villa doit être la plus belle de Pompéi pour ma fête ! Aide mes artisans, l'étranger.",
    say: "Un riche marchand qui veut éblouir ses invités. À Pompéi, comme partout : montrer qu'on a réussi.",
    jeu2Variants: [
      { bubble: "Ta cousine à la tunique grise a glissé son rouleau À LA BIBLIOTHÈQUE, contre le mur enduit frais. Elle disait que c'était urgent.",
        say: "Caius : rouleau À LA BIBLIOTHÈQUE, sur le mur enduit frais (à gauche)." },
      { bubble: "Al3x1A est allée au forum, pour cacher son rouleau sur la grande stèle. Celle qui commence par SPQR — le monument bien visible.",
        say: "Caius renvoie AU FORUM, sur la stèle SPQR au centre." },
      { bubble: "La chronaute a préféré la bibliothèque : elle a glissé son rouleau tout en haut du meuble, avec les autres. Mon bibliothécaire n'a rien vu.",
        say: "Caius renvoie À LA BIBLIOTHÈQUE, en haut du meuble à rouleaux." },
    ] },

  /* ── LE FORUM DE POMPÉI ── */
  praeco: { mood: "content",
    bubble: "Citoyens ! Marcvs Holconivs Rufus vous invite aux JEUX du forum, sous la protection d'Isis ! Trois jours de combats, entrée libre !",
    say: "Le PRAECO, crieur public : la radio de l'Antiquité. Une voix forte, une place bondée, et hop, tout Pompéi est au courant.",
    jeu2Variants: [
      { bubble: "La chronaute est repartie vers la bibliothèque de Caius. Elle a laissé son rouleau contre le mur enduit frais, à gauche.",
        say: "Le praeco renvoie À LA BIBLIOTHÈQUE, sur le mur enduit frais (à gauche)." },
      { bubble: "Elle a caché son rouleau ICI, sur la stèle SPQR au centre du forum. Un support qui traverse les siècles !",
        say: "Le praeco : ICI, au forum, sur la stèle SPQR au centre." },
      { bubble: "La voyageuse a filé à la bibliothèque. Elle a glissé son rouleau tout en haut du meuble — un endroit qu'on regarde rarement.",
        say: "Le praeco renvoie À LA BIBLIOTHÈQUE, en haut du meuble à rouleaux." },
    ] },
  lapidicida: { mood: "neutre",
    bubble: "Trois lettres par heure, pas une de plus. Grave la loi, grave la dédicace : moi, je fais l'éternité au marteau et au burin.",
    say: "Le lapidicida, tailleur de pierre. Métier lent, métier de patience — mais son travail va durer 2000 ans.",
    jeu2Variants: [
      { bubble: "La voyageuse a filé écrire à la bibliothèque, sur le mur enduit frais. Un papyrus, pas de la pierre. Fragile.",
        say: "Le lapidicida renvoie À LA BIBLIOTHÈQUE, sur le mur enduit frais." },
      { bubble: "Elle a collé son rouleau ICI, sur MA stèle SPQR ! Sans me demander, la peste. Enfin — au moins la pierre durera.",
        say: "Le lapidicida : ICI au forum, sur la stèle SPQR." },
      { bubble: "Elle a filé à la bibliothèque et a glissé son rouleau tout en haut du meuble. Papyrus, encore ! Rien ne durera. La pierre seule dure.",
        say: "Le lapidicida renvoie À LA BIBLIOTHÈQUE, en haut du meuble à rouleaux." },
    ] },
  stele_edile: { mood: "neutre",
    bubble: "Cette stèle honore l'édile qui a payé la restauration du forum. Elle sera lue par des générations d'habitants.",
    say: "Publier officiellement dans l'Antiquité, c'est GRAVER dans la pierre. La forme physique du droit et de la mémoire de la cité." },
  graffitis: { mood: "content",
    bubble: "Ce mur, c'est le VRAI journal des Pompéiens : pubs électorales, insultes, déclarations d'amour, notes de taverne… On y trouve tout !",
    say: "« Admire, mur, de n'être pas encore tombé, tant tu portes d'inepties d'écrivains ! » : ce vrai graffiti pompéien serait comme un tweet aujourd'hui." },
  temple: { mood: "neutre",
    bubble: "Le grand temple de Jupiter Optimus Maximus. Au fronton, l'aigle de Rome.",
    say: "Le temple : lui aussi porte des inscriptions, dédicaces des donateurs. Écrire, à Rome, c'est aussi honorer les dieux." },
  vesuve_forum: { mood: "vexe",
    bubble: "La montagne ? Bof, elle fume un peu depuis quelques semaines, ce n'est rien. Les augures ont dit que c'était bon signe.",
    say: "Rien à signaler, disent-ils. Or on est le 24 octobre 79. Dans quelques jours, tout Pompéi sera sous six mètres de cendre. Personne ne verra venir." },

  /* ── LES THERMES ── */
  baigneurs: { mood: "content",
    bubble: "…et je te dis que le nouvel affranchi de Trebius Valens a acheté DEUX esclaves grecs pour lui lire ses volumens pendant qu'il mange !",
    say: "Les thermes : LA place publique de Rome. On s'y lave, on s'y masse, on y ragote — et surtout on y RÉPAND l'info. L'ancêtre du café du commerce." },
  labrum: { mood: "neutre",
    bubble: "Le LABRUM, vasque d'eau froide. Regarde la gravure sur le rebord : le nom du magistrat qui l'a offerte à la ville. La générosité gravée pour l'éternité !",
    say: "Un mécène offre un équipement public → on grave son nom dessus. Publicité + reconnaissance sociale. La communication institutionnelle existait déjà." },
  mosaique: { mood: "content",
    bubble: "Regarde cette mosaïque : un dauphin ! On adore les dauphins à Pompéi : symbole de bonheur, de voyage… et de bains !",
    say: "Une mosaïque, c'est un message décoratif ET narratif — parfois avec CAVE CANEM (attention au chien) à l'entrée, ancêtre du panneau. Les images parlent." },
  strigile: { mood: "neutre",
    bubble: "Le strigile, ça sert à racler la peau après l'huile — on ne connaît pas le savon comme toi ! Et la fiole, c'est de l'huile parfumée.",
    say: "Petits objets du quotidien romain. Ils portent parfois le nom de leur propriétaire, gravé au poinçon : marque personnelle avant l'heure." },
  statue: { mood: "neutre",
    bubble: "Une statue d'Apollon (ou de Diane, on ne sait plus). Elle veille sur les baigneurs.",
    say: "Statue = message visuel PUISSANT. Non-verbal, universel, imposant. Toujours efficace aujourd'hui : monuments, statues publiques… ou déboulonnées." },

  /* ── LE PORT ET LE VÉSUVE ── */
  marchand_port: { mood: "content",
    bubble: "Deux cents amphores de garum vers Ostia, cent d'huile de Bétique vers Marseille… Sans mon volumen où tout est noté, je perdrais la moitié !",
    say: "Écrire, ça permet aussi de FAIRE DU COMMERCE. Contrats, comptes, factures : sans écriture, pas d'économie complexe possible." },
  debardeur: { mood: "content",
    bubble: "Hop, encore une amphore de garum ! Cinquante par jour, ça me fait des bras — mais ça paie mes trois enfants et deux ânes.",
    say: "Un porteur, un « saccarius ». Métier dur, méprisé — mais essentiel. Sans lui, rien ne quitte Pompéi." },
  amphores_port: { mood: "neutre",
    bubble: "Chaque amphore porte son ÉTIQUETTE peinte : contenu, poids, nom du producteur, année consulaire. Traçable !",
    say: "Les tituli picti : de vraies étiquettes de bouteille il y a 2000 ans ! Nom, contenu, date, origine. Base de la traçabilité — et de la publicité commerciale." },
  navire_port: { mood: "neutre",
    bubble: "Le CORBITA, gros navire marchand romain. Il file plein sud, vers l'Afrique, chargé jusqu'à la ligne de flottaison.",
    say: "Les routes maritimes romaines transportent les marchandises… et les VOLUMEN. La bibliothèque d'Alexandrie doit une part de ses trésors à ces bateaux." },
  vesuve_port: { mood: "vexe",
    bubble: "Le Vésuve fume noir depuis l'aube, et ça pue le soufre. Bizarre… mais on prépare le déchargement, allez !",
    say: "24 octobre 79. Dans quelques heures, la colonne éruptive va monter à 33 kilomètres de haut. Pompéi et Herculanum seront ensevelies. Personne ne s'échappera à temps. Frisson." },
};

/* ------------------------------------------------------------
   LA QUÊTE — Caius commande les préparatifs de sa fête.
   ------------------------------------------------------------ */
const QUETE = [
  { perso: "caius", portrait: "caius", auto: true,
    bubble: "Bienvenue chez moi, l'étranger ! Je suis Caius, le plus gros marchand d'olives de Pompéi, et je rénove ma villa pour une fête inoubliable. J'ai fait venir des artisans — sers-toi de leurs outils. Commençons par le commencement : trouve-moi de quoi NOTER toutes les courses et tous les travaux à faire.",
    say: "De quoi noter, effacer, recommencer : une TABLETTE DE CIRE. Cire d'abeille + planche (à l'atelier du jardin), puis une branche taillée en pointe pour écrire dedans.",
    attend: "msg_cire",
    suite: "Parfait, tout est noté ! Maintenant, préviens la ville : va sur la place avec mon esclave Argos pour lancer les invitations." },

  { perso: "caius", portrait: "caius",
    bubble: "Il me faut du MONDE à ma fête ! Accompagne Argos sur la place et lance les invitations à tout Pompéi.",
    say: "Pas le temps d'écrire mille cartons : on CRIE l'annonce. Ta voix + la foule sur la place.",
    attend: "invited",
    suite: "Toute la ville est invitée ! Maintenant, place au décor : je veux d'abord une belle FRESQUE sur mon mur." },

  { perso: "caius", portrait: "caius",
    bubble: "Que mes invités, en entrant, voient tout de suite mon goût et ma richesse ! Je veux une belle fresque sur le mur frais de ma bibliothèque.",
    say: "Une image qui frime pour son propriétaire… la pub existait déjà ! Peins les pigments sur le mur ENCORE FRAIS : la couleur entrera dans le plâtre et tiendra des siècles.",
    attend: "msg_fresque",
    suite: "Splendide fresque ! Puis je veux graver la GLOIRE DE ROME à mon entrée, que tout le monde la voie." },

  { perso: "caius", portrait: "caius",
    bubble: "À l'entrée, sur la belle dalle de pierre, grave la gloire de Rome — et la mienne au passage ! Que tous ceux qui passent la lisent, aujourd'hui et dans mille ans.",
    say: "« Nul n'est censé l'ignorer » : on grave dans la pierre, à l'entrée, là où tout le monde passe. Burin (à l'atelier) + la dalle de l'entrée.",
    attend: "msg_inscription",
    suite: "Magnifique, c'est gravé pour l'éternité ! Dernière chose : une ODE à la montagne, écrite et rangée dans ma bibliothèque." },

  { perso: "caius", portrait: "caius",
    bubble: "J'ai composé une ode à cette belle montagne qui domine la baie (le Vésuve, oui). Va me chercher du PARCHEMIN, copie mon poème, et range-le bien dans ma bibliothèque, comme à Alexandrie.",
    say: "Le parchemin, c'est de la peau : la vache + une épée → peau ; grattoir → parchemin ; encre → l'ode écrite ; umbilicus → rouleau ; puis range-le à la bibliothèque.",
    attend: "msg_bibliotheque",
    suite: "Mon ode est en sûreté dans ma bibliothèque ! Tout est prêt pour la fête. Va donc te reposer, l'étranger — moi je surveille cette montagne, elle fume drôlement aujourd'hui…" },

  { perso: "caius", portrait: "caius",
    bubble: "Grâce à toi, ma villa est prête et ma fête sera la plus belle de Pompéi ! Ta drôle de machine t'appelle… File, l'étranger. Et si un jour on parle encore de moi, ce sera grâce à ce que tu as gravé et écrit ici.",
    say: "Il ne le sait pas, mais c'est le Vésuve qui gardera Pompéi pour l'éternité, sous la cendre… Ma jauge est pleine : le bouton PARTIR nous emmène au Moyen Âge." },
];

/* ------------------------------------------------------------
   LA FICHE DU CHAPITRE
   ------------------------------------------------------------ */
const chapter = {
  id: "04-antiquite",
  bandeau: "CHAPITRE 4 · AN 79",
  date: "an 79",
  epoque: "Antiquité",
  emoji: "🏛",

  titre: "MARTINE",
  sousTitre: "Machine À Remonter le Temps Intelligente Néanmoins Excellente",
  presentationTitre: "Chapitre 4 — L'Antiquité, à Pompéi.",
  presentation: "An 79, à Pompéi : Caius prépare une grande fête dans sa villa. Aide ses artisans : tablette de cire, invitations, fresque, gravure, manuscrit pour sa bibliothèque. Le tout à l'ombre du Vésuve.",
  accroche: "Note sur la cire 🪧 · peins une fresque 🖼️ · grave le marbre 🏛 · copie un manuscrit 📚",

  finTitre: "SAUT TEMPOREL RÉUSSI",
  finTexte: "« Circuits rechargés à {pct} %. La leçon de Pompéi : un savoir sans copies ne tient qu'à un fil — un volcan et tout brûle. Au prochain saut, on change le livre (fini les rouleaux, place aux pages !) et une machine va bientôt tout copier par centaines. Direction Gutenberg. » — MARTINE",

  required: 3,
  /* on démarre à la villa (Caius t'accueille), pas au port : les 3
     tableaux d'ambiance sont à gauche et se visitent librement. */
  startScene: 3,
  destination: "MOYEN ÂGE",

  items: ITEMS,
  scenes: SCENES,
  where: WHERE,
  hiddenByFlag: HIDDEN_BY_FLAG,
  recipes: RECIPES,
  messages: MESSAGES,
  hints: HINTS,
  nearMiss: NEAR_MISS,
  failLines: FAIL_LINES,
  intro: INTRO,
  actions: ACTIONS,
  quete: QUETE,
  portraits: { caius: PortraitCaius },
  carte: CarteAntiquite,
};

export default chapter;
