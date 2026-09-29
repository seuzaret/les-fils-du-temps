/* ============================================================
   CHAPITRE 2 — Néolithique : la cité de Göbekli Tepe (refonte)
   ============================================================
   5 tableaux + une QUÊTE d'intégration à la cité :
   Guna (garde) → le roi Tannis → Jala (potière) & Ahmid
   (marchand) → Imir (prêtre) & Doka (tailleur) → Ötzi (mineur).
   Le joueur, étranger, gagne sa place en aidant chacun.

   ⚠ Liberté narrative assumée : la cité concentre plusieurs
   millénaires du Néolithique (poterie, comptage, mégalithes,
   cuivre, tatouages d'Ötzi). MARTINE le souligne avec humour.

   Tout le contenu est ici ; les décors (simples pour l'instant)
   sont dans scenes/. Le moteur n'a pas besoin d'être touché.
   ============================================================ */

import SceneMuraille from "./scenes/SceneMuraille.jsx";
import SceneTrone from "./scenes/SceneTrone.jsx";
import SceneArtisans from "./scenes/SceneArtisans.jsx";
import ScenePlaine from "./scenes/ScenePlaine.jsx";
import SceneMontagne from "./scenes/SceneMontagne.jsx";
import { PortraitGuna, PortraitTannis, PortraitJala, PortraitAhmid, PortraitImir, PortraitDoka, PortraitOtzi } from "./scenes/portraits.jsx";
import CarteNeolithique from "./scenes/CarteNeolithique.jsx";

/* ------------------------------------------------------------
   LES ÉLÉMENTS
   ------------------------------------------------------------ */
const ITEMS = {
  /* ANACHRONISME — déchet temporel à jeter dans la poubelle 🗑️ */
  canette: { name: "Canette de soda", emoji: "🥤", anachronic: true, desc: "Une canette en aluminium — l'aluminium ne sera isolé qu'en 1825, et les canettes n'existent pas avant 1935 !" },

  /* T1 — la muraille et la grève */
  coquillage: { name: "Coquillage", emoji: "🐚", desc: "Un coquillage nacré ramassé sur la grève. Broyé ou incrusté, il fait la beauté des poteries d'ici." },

  /* T3 — les artisans (supports fixes : le tour, le four, le troupeau) */
  argile:   { name: "Argile", emoji: "🟫", desc: "Terre grasse du fleuve, malléable. Elle garde la forme qu'on lui donne." },
  tour:     { name: "Le tour du potier", emoji: "⚙️", support: true, desc: "La roue qu'on fait tourner du pied : la terre y monte en une belle forme régulière." },
  feu:      { name: "Le four", emoji: "🔥", support: true, desc: "Une fosse chauffée à blanc. Ce qui en sort est dur comme la pierre — et l'on peut y fondre le métal." },
  pigments: { name: "Pigments", emoji: "🎨", desc: "Ocres, oxydes, blanc de craie : de quoi peindre des motifs éclatants." },
  troupeau: { name: "Le troupeau", emoji: "🐑", support: true, desc: "Les moutons et bœufs d'Ahmid, à mener au marché. Trop nombreux pour les compter de tête." },

  /* T4 — la plaine aux mégalithes + le fleuve */
  cailloux:      { name: "Cailloux noirs", emoji: "⚫", desc: "Une poignée de petits cailloux du fleuve. Un par bête : le premier moyen de compter." },
  grande_pierre: { name: "Grande pierre", emoji: "🪨", desc: "Un bloc de plusieurs tonnes, couché sur la plaine. À graver, puis à dresser." },
  hommes:        { name: "Les hommes de Doka", emoji: "🧑‍🤝‍🧑", support: true, desc: "Toute l'équipe du tailleur, avec cordes et rondins. À plusieurs, on dresse des montagnes." },

  /* T5 — la montagne et la mine */
  minerai:  { name: "Minerai de cuivre", emoji: "🟢", desc: "Une pierre verte, de la malachite, arrachée au filon. Chauffée fort, elle « sue » du métal." },
  pierre_marteler: { name: "Pierre à marteler", emoji: "⚒️", support: true, desc: "Une enclume de pierre : pour battre le cuivre en outils et y graver des signes." },
  silex:    { name: "Hache de silex", emoji: "🔪", desc: "Une belle hache de silex, empruntée à l'armurerie du roi. Tranchante comme un rasoir : rien de tel pour percer l'os et tailler de fins outils." },
  os:       { name: "Os", emoji: "🦴", desc: "Un os de l'animal rôti à la broche. Taillé, il fait de belles aiguilles." },
  bol:      { name: "Bol d'argile", emoji: "🥣", desc: "Un petit bol de terre. Placé au-dessus du feu, il recueille la suie noire." },

  /* fabriqués */
  pot_cru:       { name: "Pot cru", emoji: "🫙", desc: "Façonné sur le tour, mais encore mou : il faut le cuire, sinon il fond à la pluie." },
  ceramique:     { name: "Poterie", emoji: "⚱️", desc: "Cuite au four, dure et étanche. Une belle surface, qui attend d'être décorée." },
  poterie_peinte:{ name: "Poterie peinte", emoji: "🏺", desc: "Ornée de motifs aux couleurs de la cité. Il ne manque qu'une touche : la nacre." },
  compte:        { name: "Compte en cailloux", emoji: "🔢", desc: "Un caillou par bête, alignés. Le troupeau est compté ! Mais en vrac, ça roule et se perd…" },
  cuivre:        { name: "Cuivre", emoji: "🟠", desc: "Un lingot de métal rougeoyant, tout juste coulé. Mou, brillant : à marteler." },
  burin:         { name: "Burin de cuivre", emoji: "🖋", desc: "Un outil de métal, dur et pointu : de quoi graver la pierre bien mieux que le silex." },
  pierre_gravee: { name: "Pierre gravée", emoji: "🗿", desc: "La grande pierre, couverte de symboles sacrés au burin. Reste à la dresser — mais seul, impossible." },
  aiguille:      { name: "Aiguille d'os", emoji: "🪡", desc: "Fine et pointue, taillée au silex. Elle pique la peau juste ce qu'il faut." },
  suie:          { name: "Suie", emoji: "⚫", desc: "Du noir de fumée recueilli dans le bol. Frotté dans une piqûre, il marque à vie." },
};

/* ------------------------------------------------------------
   LES TABLEAUX (ordre de navigation ‹ ›)
   ------------------------------------------------------------ */
const SCENES = [
  { id: "muraille", name: "La porte de la cité",       Component: SceneMuraille },
  { id: "trone",    name: "Le roi Tannis",             Component: SceneTrone },
  { id: "artisans", name: "Les artisans de la cité",   Component: SceneArtisans },
  { id: "plaine",   name: "La plaine aux mégalithes",  Component: ScenePlaine },
  { id: "montagne", name: "La mine de cuivre",         Component: SceneMontagne },
];

/* Où trouver chaque élément de base (indices ; supports exclus). */
const WHERE = {
  coquillage: "sur la grève, devant la porte de la cité",
  argile: "au bord du fleuve, sur la plaine aux mégalithes",
  pigments: "chez la potière",
  cailloux: "au bord du fleuve, sur la plaine",
  grande_pierre: "sur la plaine aux mégalithes",
  minerai: "au filon, dans la montagne",
  silex: "dans la salle du roi Tannis (son armurerie)", os: "à la montagne", bol: "à la montagne",
};

const HIDDEN_BY_FLAG = {};

/* ------------------------------------------------------------
   LES RECETTES
   ------------------------------------------------------------ */
const RECIPES = [
  /* — La poterie de Jala (chaîne en 4 temps) — */
  { a: "argile", b: "tour", out: "pot_cru",
    line: "Sur le tour qui tourne, la terre se centre et monte toute seule : un POT prend forme. Encore mou, il faut le cuire." },
  { a: "pot_cru", b: "feu", out: "ceramique",
    line: "Passé au four, le pot durcit et devient étanche : de la POTERIE. Le premier matériau que l'humanité fabrique de toutes pièces." },
  { a: "ceramique", b: "pigments", out: "poterie_peinte",
    line: "Aux pigments, tu couvres le pot de motifs vifs, aux couleurs du clan. Presque une œuvre… il manque la signature de la cité." },
  { a: "poterie_peinte", b: "coquillage", out: "msg_poterie", msg: true },

  /* — Le compte d'Ahmid (calculi) — */
  { a: "troupeau", b: "cailloux", out: "compte",
    line: "Tu poses un caillou par bête : le troupeau est compté ! Mais ces cailloux en vrac, un coup de vent, une main maladroite… et le compte est faux." },
  { a: "compte", b: "argile", out: "msg_calculi", msg: true },

  /* — Le cuivre et le mégalithe (Doka) — */
  { a: "minerai", b: "feu", out: "cuivre",
    line: "Chauffée à blanc, la pierre verte « sue » du métal rouge : du CUIVRE. Un support tout neuf — mais il faudra le marteler." },
  { a: "cuivre", b: "pierre_marteler", out: "burin",
    line: "Sur l'enclume, tu martèles le cuivre en un BURIN dur et pointu : de quoi graver la pierre bien mieux qu'au silex." },
  { a: "burin", b: "grande_pierre", out: "pierre_gravee",
    line: "Au burin de cuivre, tu couvres la grande pierre de symboles sacrés. Reste à la dresser — mais seul, impossible." },
  { a: "pierre_gravee", b: "hommes", out: "msg_megalithe", msg: true },

  /* — Les tatouages d'Ötzi — */
  { a: "os", b: "silex", out: "aiguille",
    line: "Au silex, tu tailles l'os en une AIGUILLE fine et solide. De quoi coudre… ou piquer la peau." },
  { a: "bol", b: "feu", out: "suie",
    line: "Le bol au-dessus des flammes se tapisse de noir : tu récupères de la SUIE. Le premier pigment à faire entrer sous la peau." },
  { a: "suie", b: "aiguille", out: "msg_tatouage", msg: true },
];

/* ------------------------------------------------------------
   LES MESSAGES (fiches documentaires + jauges 1 à 5)
   ------------------------------------------------------------ */
const MESSAGES = {
  msg_poterie: { title: "Poterie décorée", emoji: "🏺",
    jauges: { vitesse: 2, portee: 2, capacite: 2, durabilite: 4 },
    fact: "Un pot cuit, peint de motifs et incrusté de nacre : chaque cité, chaque clan a ses dessins. Ces motifs ne « disent » rien avec des mots, mais ils SIGNENT : « c'est nous qui l'avons fait ». C'est l'ancêtre lointain de la marque et du logo. Et pour les archéologues, une aubaine : en suivant les styles de poterie, on date les sites et on « trace » les peuples sur des milliers de kilomètres. La terre cuite, cassée en tessons, traverse les millénaires.",
    wiki: "https://fr.wikipedia.org/wiki/Poterie" },
  msg_calculi: { title: "Les calculi (compter dans l'argile)", emoji: "🔘",
    jauges: { vitesse: 1, portee: 1, capacite: 2, durabilite: 3 },
    fact: "Ahmid enferme un petit caillou par bête dans une boule d'argile, qu'il scelle. Impossible de tricher sur le nombre ! Ce geste porte un nom : un « calcul » — du latin calculus, « petit caillou » (c'est de là que vient CALCULER). C'est presque de l'écriture : la boule dit COMBIEN. Bientôt, on dessinera les signes SUR l'argile au lieu d'y cacher des cailloux — et ce sera l'écriture. Rendez-vous en Mésopotamie…",
    wiki: "https://fr.wikipedia.org/wiki/Bulle-enveloppe" },
  msg_megalithe: { title: "Pierre gravée (mégalithe)", emoji: "🗿",
    jauges: { vitesse: 1, portee: 3, capacite: 2, durabilite: 5 },
    fact: "Des dizaines d'hommes tirent une pierre de plusieurs tonnes pour la dresser, gravée de symboles au burin de cuivre. Un mégalithe, c'est un message MONUMENTAL : pour les dieux, pour le roi, et pour les voisins — « ce territoire est à nous ». Le cairn de Barnenez, en Bretagne, date de ~−4500 : plus vieux que les pyramides ! Visible de loin, presque éternel… mais sans écriture complète, nous ignorons encore ce que ses bâtisseurs voulaient exactement nous dire.",
    wiki: "https://fr.wikipedia.org/wiki/Cairn_de_Barnenez" },
  msg_tatouage: { title: "Tatouage du corps", emoji: "✒️",
    jauges: { vitesse: 1, portee: 1, capacite: 2, durabilite: 4 },
    fact: "En 1991, deux randonneurs découvrent dans un glacier des Alpes un homme mort il y a ~5300 ans : « Ötzi ». Sa peau porte 61 tatouages, faits en frottant de la suie dans de fines piqûres — souvent placés sur des articulations douloureuses : peut-être des soins, un « dossier médical » à même la peau. Le corps devient support : un message qu'on porte à vie. La glace l'a conservé cinq millénaires… mais un tatouage disparaît avec celui qui le porte." },
};

/* ------------------------------------------------------------
   LES INDICES (bouton 💡)
   ------------------------------------------------------------ */
const HINTS = [
  { needs: ["argile", "tour"], out: "pot_cru", text: "De l'argile molle sur le tour du potier qui tourne : façonne un pot." },
  { needs: ["pot_cru", "feu"], out: "ceramique", text: "Ton pot est encore fragile. Que se passe-t-il au four ?" },
  { needs: ["ceramique", "pigments"], out: "poterie_peinte", text: "Une belle surface cuite, des pigments… décore-la aux couleurs de la cité." },
  { needs: ["poterie_peinte", "coquillage"], out: "msg_poterie", text: "La signature d'ici, c'est la nacre : incruste un coquillage ramassé sur la grève." },
  { needs: ["troupeau", "cailloux"], out: "compte", text: "Un caillou noir par bête : compte le troupeau d'Ahmid." },
  { needs: ["compte", "argile"], out: "msg_calculi", text: "Tes cailloux se perdent ? Enferme-les dans une boule d'argile scellée : plus moyen de tricher." },
  { needs: ["minerai", "feu"], out: "cuivre", text: "Cette pierre verte cache du métal. Il lui faut la chaleur du four, poussée à fond." },
  { needs: ["cuivre", "pierre_marteler"], out: "burin", text: "Le cuivre est mou. Sur l'enclume, martèle-le en un outil pointu : un burin." },
  { needs: ["burin", "grande_pierre"], out: "pierre_gravee", text: "Avec le burin de cuivre, grave les symboles sacrés sur la grande pierre." },
  { needs: ["pierre_gravee", "hommes"], out: "msg_megalithe", text: "La pierre est gravée mais pèse des tonnes. Seul, impossible — appelle les hommes de Doka." },
  { needs: ["os", "silex"], out: "aiguille", text: "Un os, un silex tranchant : taille une aiguille fine." },
  { needs: ["bol", "feu"], out: "suie", text: "Place le bol au-dessus des flammes : il se couvre de suie noire." },
  { needs: ["suie", "aiguille"], out: "msg_tatouage", text: "Une aiguille, de la suie : marque les points de douleur d'Ötzi, pour toujours." },
];

/* Répliques « presque ! » (erreurs logiques) */
const NEAR_MISS = [
  { pair: ["argile", "feu"], line: "Enfourner de l'argile molle et informe ? Tu obtiens une brique tordue. Façonne-la d'abord sur le tour." },
  { pair: ["cuivre", "feu"], line: "Le cuivre refond au four — et tu tournes en rond. Pour un outil, il faut le MARTELER sur l'enclume." },
  { pair: ["silex", "grande_pierre"], line: "Graver ce granit au silex ? Ta lame s'émousse en un instant. Il te faut du métal : un burin de cuivre." },
  { pair: ["troupeau", "pigments"], line: "Peindre un numéro sur chaque mouton ? La pluie lave tout en une nuit. Il te faut un vrai compte durable." },
];

/* Répliques d'échec génériques */
const FAIL_LINES = [
  "Bzzt. La cité de Tannis n'a pas retenu cette idée-là.",
  "Combinaison rejetée. Reviens aux bases : un support + un outil.",
  "Hmm. Créatif… mais mes archives restent muettes. Réessaie.",
  "Erreur : ces deux-là ne feront pas un message.",
];

/* Intro de MARTINE à l'arrivée */
const INTRO = [
  "Impact numéro deux. Et cette fois… une VILLE. Une vraie : muraille de bois, porte gardée, toits carrés bien blancs. On se croirait à Göbekli Tepe.",
  "Un garde vient vers toi, lance à la main. Pas franchement un comité d'accueil chaleureux. Gagne la confiance de cette cité, aide ses habitants — chaque trace laissée remplit ma jauge.",
  "Le « ? » doré te montre toujours QUI attend quelque chose de toi. Commence par ce garde… et suis-le jusqu'au roi.",
];

/* ------------------------------------------------------------
   ACTIONS — répliques « par défaut » des personnages (hors quête)
   + l'épave. `bubble` = paroles du perso · `say` = MARTINE.
   ------------------------------------------------------------ */
const ACTIONS = {
  wreck: { mood: "vexe", say: "Oui, je me suis encore plantée. Non merci, pas de garde pour m'aider à me relever. Aide plutôt les habitants — dans cet ordre." },

  guna: { mood: "neutre",
    bubble: "Je garde cette porte jour et nuit. Personne n'entre sans l'accord du roi.",
    say: "Guna, le garde. Peu causant, mais c'est lui qui ouvre la porte de la cité.",
    chitchat: [
      "Je vois passer tout le monde. Personne ne me remarque, moi. Ça m'arrange plutôt.",
      "Un jour, un chien s'est faufilé sous la porte. J'ai dû lui courir après devant toute la cité. On en rit encore.",
      "Il fait chaud avec ce casque. Sans casque, on a moins l'air sérieux, tu vois le problème ?",
    ] },
  /* La porte elle-même : clic direct vers la salle du trône (scène 1). */
  porte_cite: { mood: "content", goto: 1,
    say: "Les battants s'écartent en grinçant. La cité de Tannis s'ouvre à nous." },
  tannis: { mood: "neutre",
    bubble: "Une cité, ça se mérite : du grain engrangé, des impôts, des murs. Rends-toi utile, étranger.",
    say: "Le roi Tannis. Un chef, des impôts, une cité fortifiée : au Néolithique, l'humanité s'organise pour de bon.",
    chitchat: [
      "Diriger, c'est écouter tout le monde et décider seul. Éprouvant.",
      "Mes greniers sont pleins, ma cité prospère. Cela dit, il pleut trop cet été.",
      "Les rois de la région ont des couronnes. Moi j'ai un bâton bien poli. Simple, efficace, et je ne le perds jamais.",
    ] },
  jala: { mood: "content",
    bubble: "Nos poteries sont les plus belles du pays. Chaque motif dit : « ça vient de chez nous ».",
    say: "Jala, la potière. Ses motifs sont la « marque » de la cité — l'ancêtre du logo.",
    chitchat: [
      "Regarde la spirale sur ce pot : c'est notre marque à nous. Toutes mes pièces la portent, on nous reconnaît de loin.",
      "L'argile sèche trop vite au soleil. Je travaille surtout à l'ombre, avec les mouches pour compagnie.",
      "Ma fille tourne déjà mieux que moi à son âge. Un jour, elle prendra ma place — et elle changera le motif, je le sens.",
    ],
    jeu2Variants: [
      { bubble: "Une chronaute a filé à la porte de la cité, tout en haut. Elle a laissé un signe sur la petite fenêtre noire de la tour de guet.",
        say: "Jala : signe À LA PORTE, sur la fenêtre noire de la tour de guet." },
      { bubble: "Une drôle de voyageuse m'a acheté un pot, puis elle est partie graver une pierre dans la plaine des mégalithes. Au pied du plus grand, m'a-t-on dit.",
        say: "Jala renvoie DANS LA PLAINE, au pied du grand mégalithe." },
      { bubble: "Une chronaute a passé du temps chez nous les artisans. Elle a laissé un signe près du four à poteries — je le vois encore de temps en temps.",
        say: "Jala : la trace est ICI, chez les ARTISANS, près du four." },
    ] },
  ahmid: { mood: "vexe",
    bubble: "Compter des bêtes de tête, c'est se faire voler à coup sûr. Il me faut mieux.",
    say: "Ahmid, le marchand. Son problème de comptes va faire naître… l'écriture. Rien que ça.",
    chitchat: [
      "Sept vaches partent d'ici, sept vaches doivent arriver là-bas. Sept, pas six.",
      "Mes hommes sont d'honnêtes filous. Il suffit de leur montrer qu'on compte, et ils redeviennent tout à fait honnêtes.",
      "La route jusqu'à la cité voisine, trois jours. Trois jours à surveiller le troupeau et surtout les gens.",
    ] },
  imir: { mood: "neutre",
    bubble: "Nous dressons des pierres pour honorer le roi et les dieux. Elles nous survivront de mille ans.",
    say: "Imir, le prêtre. Le mégalithe : un message monumental, pour l'éternité.",
    chitchat: [
      "Je bénis chaque pierre avant qu'on la grave. Sans bénédiction, elle finirait par tomber, c'est bien connu.",
      "Cette plaine n'avait pas de nom, autrefois. Maintenant les voisins l'appellent « la plaine aux pierres ». C'est déjà quelque chose.",
      "Un mégalithe bien dressé regarde le ciel pour mille ans. Les dieux aiment ces attentions, et les voyageurs aussi, semble-t-il.",
    ],
    chatOnce: {
      q: "Nous dressons des pierres pour honorer le roi et les dieux. Elles nous survivront de mille ans. Dis-moi, voyageur — tu viens de loin — connais-tu une bonne méthode pour planter ces énormes pierres ?",
      choices: [
        { a: "On creuse une fosse penchée et on la bascule dedans avec des cordes.",
          r: "Une fosse penchée pour l'accueillir… tu parles comme un tailleur. Doka va aimer ton idée." },
        { a: "On la fait glisser sur des rondins de bois qui roulent.",
          r: "Faire rouler la pierre sur des troncs ? Astucieux. On tirerait moins fort, et les hommes rentreraient plus tôt chez eux." },
        { a: "On construit une rampe de terre pour la hisser, puis on retire la terre.",
          r: "Une pente qu'on efface ensuite… j'aime cette idée. Les dieux auront leur pierre, et les hommes leurs muscles épargnés." },
      ],
    },
    jeu2Variants: [
      { bubble: "Une voyageuse aux mains blanches est montée jusqu'à la tour de guet, à la porte de la cité. Elle a marqué la petite fenêtre noire, tout en haut.",
        say: "Imir : trace SUR LA FENÊTRE NOIRE de la tour de guet." },
      { bubble: "Une chronaute est venue prier au pied de nos mégalithes. Elle a gravé un petit signe sur la base du plus grand menhir, dans la plaine.",
        say: "Imir renvoie DANS LA PLAINE, au pied du grand mégalithe." },
      { bubble: "Elle est passée chez les artisans, cette voyageuse. Elle a laissé une marque près du four — sûrement pour qu'elle dure à la chaleur.",
        say: "Imir : la marque est CHEZ LES ARTISANS, près du four." },
    ] },
  doka: { mood: "neutre",
    bubble: "Le silex, ça casse. Depuis qu'on connaît le métal, plus rien ne m'arrête… si j'en ai.",
    say: "Doka, le tailleur de pierre. Il lui faut des outils de cuivre, solides.",
    chitchat: [
      "Le cuivre rouge, c'est de l'orfèvrerie. Ça se plie, ça se martèle, ça revient. Une révolution, pour nous.",
      "Un burin bien affûté, ça grave la pierre comme le beurre. Un burin usé, ça fait rebondir. Tu vois la différence.",
      "Mes ancêtres taillaient les silex pendant des jours. Moi, en une matinée j'ai fait mieux avec le métal. Le progrès, ça change tout.",
    ] },
  otzi: { mood: "vexe",
    bubble: "Cette mine me ronge les os. Le froid, l'humidité… j'ai mal partout.",
    say: "L'homme des glaces — notre Ötzi. Il cherche des tatouages de soin qui ne s'effacent jamais.",
    chitchat: [
      "Aujourd'hui, ce sont les genoux. Hier, c'était le dos. Demain, je ne sais pas encore. Le corps décide, moi je subis.",
      "Le guérisseur dit que la fumée d'herbes soulage. Elle soulage surtout ses honoraires, je crois.",
      "Un tatouage bien placé, c'est un remède qui ne s'efface pas. Encore faut-il tomber sur un bon aiguilleur.",
    ],
    jeu2Variants: [
      { bubble: "Al3x1A ? Elle voulait un tatouage — une petite étoile. Puis elle a filé vers la porte, tout en haut. Elle a marqué la petite fenêtre noire de la tour.",
        say: "Ötzi : marque SUR LA FENÊTRE NOIRE de la tour de guet." },
      { bubble: "Al3x1A m'a laissé la marque de son doigt sur la peau. Elle est repartie graver un signe dans la plaine, au pied d'un mégalithe.",
        say: "Ötzi : la marque est DANS LA PLAINE, au pied d'un mégalithe." },
      { bubble: "Al3x1A m'a demandé une étoile sur la main. Puis elle a suivi la fumée, chez les artisans, et a laissé un signe près de leur four.",
        say: "Ötzi : la marque est CHEZ LES ARTISANS, près du four." },
    ] },
};

/* ------------------------------------------------------------
   LA QUÊTE — l'histoire du chapitre, étape par étape.
   perso : qui parle (le « ? » doré se pose sur lui)
   attend : ce qu'il faut accomplir (id de message/objet, ou drapeau)
   suite : phrase de MARTINE quand l'étape est réussie (vers qui aller)
   ------------------------------------------------------------ */
const QUETE = [
  { perso: "guna", portrait: "guna", auto: true,
    bubble: "Halte, étranger ! On n'entre pas dans la cité du roi Tannis comme dans un moulin. Suis-moi : je te mène à lui. C'est lui qui décidera si tu restes.",
    say: "Un accueil… au bout d'une lance. Restons polis. Le roi t'attend plus loin ›." },

  { perso: "tannis", portrait: "tannis",
    bubble: "Bienvenue dans ma cité de Göbekli Tepe. Si tu ne viens pas voler mon grain ni fuir mes impôts, tu seras bien traité. Prouve ta valeur : va donner un coup de main à mes artisans et à mes marchands.",
    say: "Un roi qui parle d'impôts et de grain à engranger… nous voilà en pleine révolution néolithique ! File aider le petit peuple ›." },

  { perso: "jala", portrait: "jala",
    bubble: "Ah, un coup de main ! On façonne ici les plus belles poteries du pays. Aide-moi à en faire une, digne de notre cité : trouve tout ce qu'il faut.",
    say: "La chaîne du potier : la terre sur le tour, la cuisson, les couleurs… et la touche d'ici, la nacre du coquillage.",
    attend: "msg_poterie",
    suite: "Jala serre la poterie contre elle, ravie. À côté, le marchand Ahmid se ronge les sangs — va le voir." },

  { perso: "ahmid", portrait: "ahmid",
    bubble: "Toi qui aides si bien, sauve-moi ! Je dois mener tout ce bétail à la cité voisine, mais mes hommes sont des filous… Comment prouver à l'acheteur le nombre EXACT de bêtes ?",
    say: "Un caillou par bête, scellés dans l'argile : impossible de tricher. Ni plus ni moins que l'ancêtre de l'écriture.",
    attend: "msg_calculi",
    suite: "Ahmid t'embrasse : son compte est en sûreté. On te réclame sur la plaine, là où l'on dresse les pierres ›." },

  { perso: "imir", portrait: "imir",
    bubble: "Approche, ami du roi. Ici, nous honorons Tannis et nos dieux en dressant des pierres géantes, gravées de symboles. Prête-nous tes bras et ton adresse.",
    say: "Un prêtre, des mégalithes pour le roi et les dieux : la pierre qui parle aux siècles. Son tailleur, Doka, va te dire comment." },

  { perso: "doka", portrait: "doka",
    bubble: "Avant de dresser cette pierre, je dois y graver les symboles sacrés. Mais le silex s'émousse trop vite… il me faut des outils de MÉTAL. Trouve-moi de quoi les forger.",
    say: "Du cuivre ! Il y a un filon dans la montagne, plus haut ›. Fonds-le au four, martèle-le en burin, grave la pierre, puis dresse-la avec les hommes.",
    attend: "msg_megalithe",
    suite: "La pierre gravée se dresse enfin vers le ciel. Doka t'acclame. Il reste un blessé, à la mine…" },

  { perso: "otzi", portrait: "otzi",
    bubble: "Étranger… cette mine me ronge les os. Le guérisseur dit qu'il faut marquer les points de douleur — des tatouages, qui ne s'effacent jamais. M'aideras-tu ?",
    say: "Une aiguille d'os, de la suie noire frottée sous la peau : les 61 tatouages de soin d'Ötzi. Le corps comme support.",
    attend: "msg_tatouage",
    suite: "Ötzi respire, soulagé. Tu as aidé toute la cité : ma jauge déborde. Le roi voudra te saluer avant ton départ." },

  { perso: "tannis", portrait: "tannis",
    bubble: "Tu es entré en étranger : te voilà l'ami de Göbekli Tepe. Ta drôle de machine qui clignote t'appelle. Va — et raconte au monde ce que tu as vu ici.",
    say: "Rechargée à bloc, merci ces braves gens. Le bouton PARTIR t'emmène en Mésopotamie… là où ces petits cailloux d'argile vont devenir l'ÉCRITURE." },
];

/* ------------------------------------------------------------
   LA FICHE DU CHAPITRE
   ------------------------------------------------------------ */
const chapter = {
  id: "02-neolithique",
  bandeau: "CHAPITRE 2 · NÉOLITHIQUE",
  date: "−5000",
  epoque: "Néolithique",
  emoji: "🏛️",

  titre: "MARTINE",
  sousTitre: "Machine À Remonter le Temps Intelligente Néanmoins Excellente",
  presentationTitre: "Chapitre 2 — Néolithique.",
  presentation: "Les humains se sont posés : villages, champs, cité fortifiée. Aide les habitants de Göbekli Tepe — la potière, le marchand, le prêtre, le tailleur, un mineur malade — pour gagner ta place dans la cité.",
  accroche: "Deviens l'ami de la cité : poterie 🏺 · calculi 🔘 · mégalithe 🗿 · tatouages ✒️",

  finTitre: "SAUT TEMPOREL RÉUSSI",
  finTexte: "« Circuits rechargés à {pct} %. Tu as vu naître la cité, la marque, le compte, le monument. Et chez Ahmid, ces cailloux d'argile qui appellent déjà autre chose : bientôt, on va inventer des petits signes pour noter. L'écriture. Direction la Mésopotamie. » — MARTINE",

  required: 3,
  startScene: 0,
  destination: "MÉSOPOTAMIE",

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
  portraits: { guna: PortraitGuna, tannis: PortraitTannis, jala: PortraitJala, ahmid: PortraitAhmid, imir: PortraitImir, doka: PortraitDoka, otzi: PortraitOtzi },
  carte: CarteNeolithique,
};

export default chapter;
