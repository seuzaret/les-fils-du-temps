/* ============================================================
   CHAPITRE 7 — Le XIXe siècle : vaincre la distance, fixer l'instant.
   ============================================================
   7 tableaux qui suivent la famille O'Sullivan sur 4 générations :
   1. TÉLÉGRAPHE MORSE (Far West, ~1849) — JAMES tape « OR » à New York.
   2. DAGUERRÉOTYPE (Californie, ~1855) — James envoie son portrait
      à sa mère restée en Irlande.
   3. CÂBLE TRANSATLANTIQUE (1866) — James dit « Venez me rejoindre ! ».
   4. PHONOGRAPHE EDISON (New York, 1878) — James âgé grave sa voix
      sur un cylindre de cire pour ses petits-enfants.
   5. STATION MARCONI (nuit du 15 avril 1912) — la génération suivante
      embarque à Cobh sur le Titanic. Le paquebot coule. Un mini-jeu :
      quel outil peut porter secours sans fil ? → l'ANTENNE (TSF).
   6. NICKELODEON (New York, mai 1912) — SEAN, 15 ans, va voir au
      cinéma « Saved from the Titanic », un film muet sur le naufrage.
   7. TÉLÉPHONE TRANSCONTINENTAL (25 janvier 1915) — Sean, à New York,
      appelle la famille rescapée à San Francisco (AT&T, Bell).
   La PILE DE VOLTA (héritage du ch. 6) alimente le télégraphe.
   ============================================================ */

import SceneTelegraphe from "./scenes/SceneTelegraphe.jsx";
import ScenePhoto from "./scenes/ScenePhoto.jsx";
import SceneCable from "./scenes/SceneCable.jsx";
import ScenePhonographe from "./scenes/ScenePhonographe.jsx";
import SceneTSF from "./scenes/SceneTSF.jsx";
import SceneLumiere from "./scenes/SceneLumiere.jsx";
import SceneTelephone from "./scenes/SceneTelephone.jsx";
import CarteXIXe from "./scenes/CarteXIXe.jsx";
import { PortraitJames, PortraitJamesVieux, PortraitMarconi, PortraitSean, PortraitPhotographe, PortraitOuvreuse } from "./scenes/portraits.jsx";

/* ------------------------------------------------------------
   LES ÉLÉMENTS
   ------------------------------------------------------------ */
const ITEMS = {
  /* ANACHRONISME */
  smartphone: { name: "Smartphone", emoji: "📱", anachronic: true, desc: "Un smartphone tactile — l'iPhone date de 2007, 158 ans après le Far West de James O'Sullivan. Ici, il n'a même pas de réseau." },

  /* héritage du chapitre 6 (voyage dans la besace) */
  pile: { name: "Pile de Volta", emoji: "⚡", heirloom: true, desc: "Ta pile du chapitre précédent : la source d'électricité qui rend possible tout ce siècle." },

  /* T1 — le bureau du télégraphe (western, ~1849) */
  code_morse: { name: "Manipulateur Morse", emoji: "🎛️", support: true, desc: "La touche du télégraphe : elle coupe le courant en impulsions, courtes et longues — les points et les traits du code Morse. Branche-lui du courant, et tape !" },

  /* T2 — le studio du daguerréotypist (Californie, ~1855) */
  plaque: { name: "Plaque de cuivre argentée", emoji: "🟫", desc: "Une plaque de cuivre polie miroir, recouverte d'une fine couche d'argent : le support qui capte la lumière." },
  iodure: { name: "Iodure d'argent (flacon)", emoji: "⚗️", desc: "Un flacon jaune : les vapeurs d'iodure d'argent sensibilisent une plaque à la lumière. Sans ça, aucune image ne se forme." },
  chambre: { name: "Chambre photographique", emoji: "📷", support: true, desc: "Le grand appareil en bois : boîte étanche à la lumière, objectif à l'avant, plaque à l'arrière. On y CHARGE la plaque puis on la SENSIBILISE avant d'exposer." },

  /* T3 — la pose du câble (1866) */
  cable: { name: "Câble gainé", emoji: "➿", desc: "Un fil de cuivre isolé de gutta-percha, capable de résister à l'eau et à la pression. Des milliers de kilomètres à dérouler." },
  grue: { name: "Grue flottante", emoji: "🏗️", desc: "Un ponton à vapeur équipé d'une flèche articulée : il peut soulever de très lourdes charges, comme un rouleau de câble." },
  cablier: { name: "Navire câblier", emoji: "🚢", desc: "La grue flottante chargée du grand rouleau de câble : c'est un navire câblier, comme le fameux Great Eastern qui a posé le premier câble transatlantique en 1866." },
  ocean: { name: "L'océan", emoji: "🌊", support: true, desc: "Entre l'Europe et l'Amérique, des semaines de bateau… ou quelques minutes, si on ose poser un câble au fond." },

  /* T5 — la station Marconi (nuit du Titanic, 1912). */
  antenne: { name: "Antenne", emoji: "📡", desc: "Un mât hérissé de fils, ramassé sur l'établi. Où le poser ?" },
  station_marconi: { name: "Cabine de Marconi", emoji: "🛖", support: true, desc: "La cabine de la station côtière, toit vide en attente." },

  /* T7 — le téléphone (New York, 1915) : combiner l'écouteur et le
     microphone du téléphone à colonne Bell pour joindre San Francisco. */
  micro:    { name: "Microphone (embouchure)", emoji: "🎙️", desc: "Le petit cône noir au sommet de la colonne Bell : c'est là qu'on PARLE. Une membrane à l'intérieur transforme la voix en courant électrique." },
  ecouteur: { name: "Écouteur", emoji: "🎧", desc: "Le petit combiné qu'on colle à l'oreille : à l'autre bout du fil, la voix redevient vibration. Sean l'a en main." },
};

/* ------------------------------------------------------------
   LES TABLEAUX (7, guidés)
   ------------------------------------------------------------ */
const SCENES = [
  { id: "telegraphe", name: "Le bureau du télégraphe (Far West, 1849)", Component: SceneTelegraphe, nextWhen: ["msg_telegraphe"] },
  { id: "photo",      name: "Le studio du daguerréotypist (Californie, 1855)", Component: ScenePhoto, nextWhen: ["msg_daguerreotype"] },
  { id: "cable",      name: "La pose du câble transatlantique (1866)", Component: SceneCable, nextWhen: ["msg_cable"] },
  { id: "phono",      name: "Le salon du phonographe (New York, 1878)", Component: ScenePhonographe, nextWhen: ["msg_phonographe"] },
  { id: "tsf",        name: "La station Marconi (nuit du Titanic, 1912)", Component: SceneTSF, nextWhen: ["msg_sos"] },
  { id: "cinema",     name: "Le Nickelodeon (New York, mai 1912)", Component: SceneLumiere, nextWhen: ["msg_cinema"] },
  { id: "telephone",  name: "Le téléphone transcontinental (1915)", Component: SceneTelephone },
];

const WHERE = {
  pile: "dans ta besace — la pile de Volta du chapitre 6 (si tu ne l'as plus, rejoue le chapitre 6)",
  plaque: "au studio du daguerréotypist — posée sur une petite table à droite",
  iodure: "au studio du daguerréotypist — le flacon jaune sur la table de gauche",
  cable: "à la pose du câble transatlantique",
  grue: "à la pose du câble transatlantique — ponton à vapeur sur l'eau",
  cablier: "combine la grue avec le câble à la pose du câble transatlantique",
  micro: "au bureau du téléphone (New York, 1915)", ecouteur: "au bureau du téléphone (New York, 1915)",
};

const HIDDEN_BY_FLAG = {};

/* ------------------------------------------------------------
   LES RECETTES
   ------------------------------------------------------------ */
const RECIPES = [
  /* T1 : brancher la pile au manipulateur ouvre le MINI-JEU Morse (« OR »). */
  { a: "pile", b: "code_morse", opens: "morse", consume: ["pile"] },
  /* T2 : préparer la chambre — 3 étapes.
     1) plaque + chambre → la plaque, inclinée, est chargée à l'arrière.
     2) iodure + chambre (needsFlag plaque_dedans) → les vapeurs jaunes
        sensibilisent la plaque à la lumière.
     3) cliquer sur la chambre (action:"chambre") ouvre le mini-jeu. */
  { a: "plaque", b: "chambre", out: "chargee", gives: [], consume: ["plaque"], flag: "plaque_dedans",
    line: "🟫 Tu glisses la plaque de cuivre argenté dans le dos de la chambre, inclinée à 45°. Reste à la SENSIBILISER — sans iodure, la lumière n'y laisse aucune trace." },
  { a: "iodure", b: "chambre", out: "sensible", gives: [], consume: ["iodure"], flag: "plaque_sensible", needsFlag: "plaque_dedans",
    line: "⚗️ Les vapeurs jaunes d'iodure d'argent enveloppent la plaque : à sa surface, elle devient PHOTOSENSIBLE — la lumière va pouvoir y graver une image. Il ne reste qu'à ouvrir l'objectif !",
    needMsg: "Pas si vite ! Il faut d'abord glisser la plaque dans la chambre — sans support, l'iodure n'a rien à sensibiliser." },
  /* T3 : arme d'abord la grue avec le câble → navire câblier ; puis
     jette-le à l'océan pour poser le câble transatlantique. */
  { a: "grue", b: "cable", out: "cablier", gives: ["cablier"], consume: ["grue", "cable"],
    line: "🚢 La grue soulève le grand rouleau de câble et l'installe sur le pont : voilà un vrai NAVIRE CÂBLIER, prêt pour la traversée. Il ne reste qu'à le lancer dans l'océan." },
  { a: "cablier", b: "ocean", out: "msg_cable", msg: true },
  /* T5 : brancher l'antenne (gagnee au mini-jeu) sur la cabine de Marconi. */
  { a: "antenne", b: "station_marconi", out: "msg_sos", msg: true, consume: ["antenne"] },
  /* T7 : brancher l'écouteur au microphone du téléphone à colonne Bell. */
  { a: "micro", b: "ecouteur", out: "msg_telephone", msg: true },
];

/* ------------------------------------------------------------
   LES MESSAGES (fiches + jauges 1 à 5)
   ------------------------------------------------------------ */
const MESSAGES = {
  msg_telegraphe: { title: "Écrire un télégramme", emoji: "📟",
    jauges: { vitesse: 5, portee: 3, capacite: 2, durabilite: 1 },
    fact: "En 1844, Samuel Morse relie Baltimore à Washington par un fil électrique. De petits signaux — points et traits, le code Morse — traversent le pays en une seconde, là où un cheval mettait des jours. Mais ces bips ne veulent rien dire sans le code partagé des deux côtés." },
  msg_daguerreotype: { title: "Se photographier", emoji: "📷",
    jauges: { vitesse: 1, portee: 2, capacite: 3, durabilite: 3 },
    fact: "En 1826, Nicéphore Niépce fixe la toute première photographie après plusieurs jours de pose. En 1839, Louis Daguerre présente le daguerréotype : une plaque qui capture un instant en 15 à 30 secondes. C'est pour ça que les gens du XIXᵉ font tous la tête — essaie de sourire immobile pendant 15 s ! Dès 1850, on retouche déjà les images." },
  msg_cable: { title: "Câble transatlantique", emoji: "🌊",
    jauges: { vitesse: 5, portee: 4, capacite: 2, durabilite: 2 },
    fact: "27 juillet 1866 : un câble télégraphique relie l'Amérique à l'Irlande au fond de l'Atlantique. Avant, une lettre mettait deux semaines en bateau. Maintenant, le message passe en quelques minutes. Encore aujourd'hui, nos messages voyagent par des câbles cachés sous la mer." },
  msg_phonographe: { title: "Faire un disque de cire", emoji: "🎙️",
    jauges: { vitesse: 3, portee: 2, capacite: 3, durabilite: 1 },
    fact: "1877 : Thomas Edison invente le phonographe. Une aiguille grave la voix sur un cylindre de cire, une autre la restitue. Pour la première fois, un son survit à celui qui l'a émis. Mais la cire est fragile — elle fond à 50 °C, s'use à chaque écoute. Pouvoir enregistrer ne suffit pas à garder le message." },
  msg_sos: { title: "Envoyer un message par onde (TSF)", emoji: "🆘",
    jauges: { vitesse: 5, portee: 4, capacite: 2, durabilite: 1 },
    fact: "Grâce à Marconi, la TSF (télégraphie sans fil) envoie le message dans l'air, sans aucun câble. Nuit du 15 avril 1912 : le Titanic coule. L'opérateur radio lance un signal d'alerte ; le Carpathia l'entend à 60 milles et fait route vers l'épave. Environ 700 personnes sont sauvées. Un simple message peut sauver des vies." },
  msg_cinema: { title: "Faire un film sur pellicule", emoji: "🎞️",
    jauges: { vitesse: 4, portee: 4, capacite: 5, durabilite: 2 },
    fact: "28 décembre 1895 : les frères Lumière projettent 10 courts films à Paris, pour 33 spectateurs. Le cinéma vient de naître. Le principe : une suite de photos qui défilent, notre œil ne voit pas les coupures. En mai 1912, un film reconstitue déjà le naufrage du Titanic. Le cinéma peut raconter un événement — ou l'inventer." },
  msg_telephone: { title: "Laisser un message par téléphone", emoji: "📞",
    jauges: { vitesse: 5, portee: 3, capacite: 4, durabilite: 1 },
    fact: "25 janvier 1915 : première ligne téléphonique transcontinentale aux États-Unis, 5 500 km de fil entre New York et San Francisco. Après le télégramme (bips) et la TSF (bips sans fil), voici la voix qui traverse le continent. Ce n'est plus un message qu'on attend, c'est une conversation." },
};

/* ------------------------------------------------------------
   LES INDICES (bouton 💡)
   ------------------------------------------------------------ */
const HINTS = [
  { needs: ["pile", "code_morse"], out: "msg_telegraphe", text: "Apporte ta pile de Volta au manipulateur Morse : tu pourras alors taper toi-même le message « OR » en points et traits (petit jeu)." },
  { needs: ["plaque", "chambre"], out: "chargee", text: "Glisse d'abord la plaque de cuivre argenté dans la chambre photographique (à l'arrière). Elle s'incline à 45°." },
  { needs: ["iodure", "chambre"], out: "sensible", text: "Une fois la plaque en place, verse (glisse) le flacon d'iodure sur la chambre : les vapeurs jaunes vont la sensibiliser." },
  { needs: ["grue", "cable"], out: "cablier", text: "La grue flottante peut soulever ton grand rouleau de câble : combine-les pour armer un vrai NAVIRE CÂBLIER." },
  { needs: ["cablier", "ocean"], out: "msg_cable", text: "Le navire câblier prêt, ose dérouler le câble tout au fond de l'océan : il reliera l'Irlande à l'Amérique." },
  { needs: ["antenne", "station_marconi"], out: "msg_sos", text: "Une fois l'antenne recuperee a l'etabli, va la brancher sur la cabine de Marconi : les ondes pourront alors partir dans la nuit." },
  { needs: ["micro", "ecouteur"], out: "msg_telephone", text: "Sur le téléphone à colonne : accroche l'écouteur au microphone. La voix de Sean partira jusqu'à San Francisco." },
];

const NEAR_MISS = [
  { pair: ["cable", "micro"], line: "Un câble et un microphone, ce n'est pas le téléphone : Bell utilise déjà des fils tirés d'un continent à l'autre. Cherche l'écouteur pour compléter le circuit." },
  { pair: ["pile", "ocean"], line: "Jeter ta précieuse pile à l'océan ? Malheureux ! Garde-la pour le télégraphe." },
  { pair: ["iodure", "plaque"], line: "Verser l'iodure directement sur la plaque, à l'air libre ? Les vapeurs se dissipent en un instant. Charge d'abord la plaque dans la chambre, PUIS sensibilise." },
  { pair: ["plaque", "code_morse"], line: "Le manipulateur Morse ne veut rien d'une plaque photo : il attend du COURANT. Va chercher ta pile de Volta." },
  { pair: ["cable", "station_marconi"], line: "Marconi se passe justement de câble : ses ondes traversent l'air ! Trouve plutôt une antenne pour son mât." },
  { pair: ["antenne", "ocean"], line: "Une antenne au fond de l'eau ? Absurde. C'est le CÂBLE (dans son navire câblier) qu'on pose au fond de l'océan." },
  { pair: ["ecouteur", "code_morse"], line: "L'écouteur du téléphone Bell n'a rien à faire sur le manipulateur Morse : ce sont deux inventions différentes. Reste sur le combiné du téléphone à colonne." },
  { pair: ["chambre", "ocean"], line: "Emmener la chambre photo en mer ouvrirait de jolies vues, mais aucun message ne partira. C'est le câblier qu'il faut lancer sur l'océan." },
];

const FAIL_LINES = [
  "Bzzt. Le XIXe siècle n'a pas retenu cette idée.",
  "Combinaison rejetée. Un signal, un support : reviens aux bases.",
  "Mes archives électriques restent muettes là-dessus. Réessaie.",
  "Erreur : ces deux-là ne feront pas un message.",
  "Zéro invention détectée. On tente autre chose ?",
];

const INTRO = [
  "Tu as bien la pile de Volta ? Sans elle, ce siècle ne tourne pas. Bienvenue au XIXe : le siècle pressé, celui qui veut vaincre la DISTANCE — et fixer l'INSTANT.",
  "Tu vas suivre la famille O'SULLIVAN sur quatre générations, du Far West de 1849 aux nuits de New York de 1915. Chaque tableau te posera son propre defi ; a toi de trouver ce qui, dans le decor, peut porter le message.",
];

const ACTIONS = {
  wreck: { mood: "vexe", say: "Oui, j'ai grillé trois fusibles du télégraphe en atterrissant. L'opérateur a cru à un orage magnétique. Recharge-moi avant qu'il ne comprenne." },

  /* Les personnages — leurs vraies répliques d'étape sont dans QUETE. */
  james: { mood: "content",
    bubble: "James O'Sullivan, pour vous servir ! Émigré d'Irlande, venu chercher fortune ici. Et je l'ai trouvée !",
    say: "James O'Sullivan : un Irlandais parti tenter sa chance dans l'Ouest américain.",
    jeu2Variants: [
      { bubble: "La chronaute a télégraphié un message étrange ICI. Le télégramme est resté collé sur l'affiche WANTED, sur le mur de gauche.",
        say: "James : ICI au BUREAU DU TÉLÉGRAPHE, sur l'affiche WANTED (mur de gauche)." },
      { bubble: "Elle a filé se faire tirer le portrait au studio du daguerréotype voisin. Elle a caché son télégramme derrière l'horloge murale à gauche.",
        say: "James renvoie AU STUDIO DU DAGUERRÉOTYPE, sur l'horloge murale à gauche." },
      { bubble: "Al3x1A a couru à la station Marconi. Elle a lancé son télégramme sur le paquebot au large — sur le Titanic, avant le naufrage.",
        say: "James renvoie À LA STATION MARCONI, sur le paquebot Titanic au large." },
    ] },
  photographe: { mood: "neutre",
    bubble: "Bienvenue dans mon studio de daguerréotype ! Une plaque de cuivre argentée, un peu de mercure, du soleil… et je fixe votre visage pour toujours.",
    say: "Le photographe : il expose une plaque sensible dans sa chambre en bois — 15 secondes de pose, immobile !",
    jeu2Variants: [
      { bubble: "Elle a laissé un télégramme AU BUREAU DU TÉLÉGRAPHE, collé sur l'affiche WANTED du mur de gauche. James saura.",
        say: "Le photographe renvoie AU BUREAU DU TÉLÉGRAPHE, sur l'affiche WANTED." },
      { bubble: "Elle a caché son télégramme ICI, derrière l'horloge murale à gauche de mon studio. Malin.",
        say: "Le photographe : ICI au STUDIO, sur l'horloge murale à gauche." },
      { bubble: "Elle a couru à la station Marconi. Elle a lancé son télégramme vers le paquebot au large — un certain Titanic.",
        say: "Le photographe renvoie À LA STATION MARCONI, sur le paquebot Titanic." },
    ] },
  "james-vieux": { mood: "neutre",
    bubble: "James O'Sullivan, encore là, plus vieux d'un demi-siècle. J'ai fait installer chez moi la dernière merveille de Mr. Edison : un phonographe. Je veux graver ma voix pour mes petits-enfants — qu'après ma mort, on m'entende encore.",
    say: "James âgé : sa vie est derrière lui. Il tente d'envoyer un message… au futur." },
  filsjames: { mood: "neutre",
    bubble: "Je suis le fils de James. Je tourne la manivelle pendant que mon père parle dans le pavillon. Il faut la BONNE vitesse — sinon sa voix sera déformée à l'écoute.",
    say: "Le fils de James : il actionne la manivelle du phonographe." },
  marconi: { mood: "vexe",
    bubble: "Guglielmo Marconi. Un paquebot coule au large et nous captons ses bips de détresse. Il faut agir — MAINTENANT.",
    say: "Marconi : père de la TSF (télégraphie sans fil). L'urgence de sa vie : sauver les rescapés du Titanic.",
    jeu2Variants: [
      { bubble: "Son télégramme est resté au bureau du télégraphe de James, dans le Far West — collé sur l'affiche WANTED du mur de gauche.",
        say: "Marconi renvoie AU BUREAU DU TÉLÉGRAPHE, sur l'affiche WANTED." },
      { bubble: "Elle a caché son télégramme au studio du daguerréotype, derrière l'horloge murale à gauche.",
        say: "Marconi renvoie AU STUDIO DU DAGUERRÉOTYPE, sur l'horloge murale à gauche." },
      { bubble: "Al3x1A a lancé son télégramme ICI, vers le paquebot au large. Sur le Titanic. Trop tard — je crains le pire.",
        say: "Marconi : ICI à LA STATION MARCONI, sur le paquebot Titanic au large." },
    ] },
  ouvreuse: { mood: "neutre",
    bubble: "Bienvenue au Nickelodeon, 5 cents la place ! Ce soir, un film émouvant : « Saved from the Titanic ». Mais notre projectionniste est malade — sauras-tu tourner la manivelle à la bonne vitesse ?",
    say: "L'ouvreuse : elle t'invite à monter dans la cabine et à projeter le film." },
  "sean-jeune": { mood: "neutre",
    bubble: "Sean, 15 ans. Notre famille venait tout juste d'embarquer sur le Titanic pour nous rejoindre… certains n'ont jamais débarqué. Je suis venu voir le film pour comprendre. Et pour ne pas les oublier.",
    say: "Sean, 15 ans, en deuil : il vient voir en images ce qu'il n'a pas vécu." },
  sean: { mood: "neutre",
    bubble: "Sean O'Sullivan, fils de James. Depuis 1912, la famille s'est installée à San Francisco — et depuis peu, une prouesse : la ligne téléphonique traverse tout le pays !",
    say: "Sean O'Sullivan : la génération suivante, en 1915. Il va appeler la famille à San Francisco par la première ligne transcontinentale Bell." },

  /* actions qui ouvrent les mini-jeux */
  chambre: { mood: "neutre",
    bubble: "La chambre photographique — cible pour glisser la PLAQUE, puis le flacon d'IODURE. Une fois la plaque sensibilisée, il ne restera plus qu'à retirer le CACHE de l'objectif.",
    say: "Cible de dépôt : glisse la plaque de cuivre argenté sur la chambre, puis l'iodure d'argent. Une fois la plaque sensibilisée, le CACHE de l'objectif devient cliquable pour ouvrir." },
  cache: { modal: "photo", needsFlag: "plaque_sensible",
    needMsg: "Le cache résiste : sans plaque sensibilisée derrière l'objectif, la lumière ne servirait à rien. Prépare d'abord la chambre (plaque + iodure)." },
  phono: { modal: "phono" },
  projecteur: { modal: "cine" },
  outils: { modal: "tsf" },
};

/* ------------------------------------------------------------
   LA QUÊTE — 7 étapes, une par tableau.
   ------------------------------------------------------------ */
const QUETE = [
  { perso: "james", portrait: "james", auto: true,
    bubble: "Bénie soit la Sainte Patronne ! James O'Sullivan, émigré d'Irlande — et regarde cette pépite : j'ai trouvé le FILON, un vrai, plein d'or ! Il faut prévenir ma famille à New York avant que la nouvelle s'ébruite. L'appareil du bureau est mort… il lui faudrait du jus.",
    say: "James veut prevenir sa famille a New York — et vite. Regarde ce que tu as dans la besace : il y a peut-etre de quoi reveiller l'appareil.",
    attend: "msg_telegraphe",
    suite: "Le message est parti ! Riche du jour au lendemain, James pense à sa vieille mère restée en Irlande. Il voudrait lui envoyer son visage — mais comment ? ›" },

  { perso: "photographe", portrait: "photographe", auto: true,
    bubble: "James, monsieur, asseyez-vous et NE BOUGEZ PLUS. Ma chambre va capter votre visage grâce à la lumière du jour — mais il va falloir preparer la plaque comme il faut avant d'ouvrir l'objectif.",
    say: "Le photographe attend une plaque prete a recevoir la lumiere. Regarde ce qu'il a laisse traîner dans son studio et essaie de comprendre l'ordre des choses.",
    attend: "msg_daguerreotype",
    suite: "La plaque est revelee. James envoie son portrait a sa mère par bateau — deux semaines de traversée. Et si on faisait plus rapide ?" },

  { perso: "james", portrait: "james",
    bubble: "Me voilà riche, grâce à Dieu ! Mais mon cœur est resté en Irlande, avec ma vieille mère et mes sœurs. Comment faire arriver un message la-bas en quelques minutes plutot qu'en deux semaines ?",
    say: "James veut relier deux continents. Cherche ce qui, sur le pont, pourrait franchir l'ocean.",
    attend: "msg_cable",
    suite: "Le message file : sa famille recevra la nouvelle en quelques minutes. Douze ans passent — James est un vieil homme, à New York, et il a un dernier message à léguer…" },

  { perso: "james-vieux", portrait: "james-vieux", auto: true,
    bubble: "J'ai 66 ans, et je n'en ai plus pour longtemps. Il vient de sortir une machine incroyable, qui capte le SON. Je voudrais y laisser un mot pour mes petits-enfants — pour qu'après ma mort, ils entendent encore la voix de leur grand-pere.",
    say: "James veut confier sa voix a l'appareil au fond du salon. A toi de le faire marcher.",
    attend: "msg_phonographe",
    suite: "Le cylindre est grave. « Voila, dit-il, un peu de moi qui restera. » 34 ans passent. Nous sommes dans la nuit du 15 avril 1912…" },

  { perso: "marconi", portrait: "marconi", auto: true,
    bubble: "Une génération après James, sa famille a enfin décidé d'émigrer : ils ont embarqué sur le paquebot le plus grand du monde. Cette nuit, ma station capte ses bips de detresse — il coule dans l'Atlantique. Il faut agir MAINTENANT.",
    say: "Marconi a un etabli plein d'outils. Un seul peut porter secours au large — a toi de le trouver.",
    attend: "msg_sos",
    suite: "Les rescapés sont recueillis par le Carpathia. Mais des cousins irlandais des O'Sullivan sont morts dans le naufrage. Sean, 15 ans, en deuil, entre au Nickelodeon voir un film sur le drame…" },

  { perso: "ouvreuse", portrait: "ouvreuse", auto: true,
    bubble: "Bienvenue au Nickelodeon, 5 cents la place ! Ce soir, un film qui bouleverse toute l'Amerique. Sean est déjà installé au premier rang. Mais mon projectionniste est malade… tu voudrais bien monter la-haut ?",
    say: "Il faut passer le film pour Sean. Monte a la cabine et essaie de comprendre comment ca marche.",
    attend: "msg_cinema",
    suite: "Sean sort du Nickelodeon en larmes. Ces images l'ont remue : le cinema peut donc RACONTER, garder la memoire d'un evenement. Il a une idee — appeler sa famille en Californie. Trois ans plus tard, une prouesse va le lui permettre…" },

  { perso: "sean", portrait: "sean", auto: true,
    bubble: "Sean O'Sullivan, fils de James, à votre service ! On vient d'achever une prouesse : une nouvelle ligne traverse le continent d'un ocean a l'autre. Cette fois, ma famille pourra ENTENDRE ma voix, en direct.",
    say: "Sean a besoin d'aide pour brancher l'appareil sur son bureau.",
    attend: "msg_telephone",
    suite: "« Allô, San Francisco ? » — les voix se croisent d'un océan à l'autre. Ma jauge déborde : de la plume au fil, du fil au câble, du câble aux ondes, des ondes à la VOIX en direct. Et grâce à la photo, au cylindre et au film, on peut désormais FIXER les visages, les voix et les mouvements pour toujours. Le XXe siècle nous attend." },
];

/* ------------------------------------------------------------
   LA FICHE DU CHAPITRE
   ------------------------------------------------------------ */
const chapter = {
  id: "07-xixe",
  bandeau: "CHAPITRE 7 · XIXe SIÈCLE",
  date: "1844-1915",
  epoque: "XIXe siècle",
  emoji: "📟",

  titre: "MARTINE",
  sousTitre: "Machine À Remonter le Temps Intelligente Néanmoins Excellente",
  presentationTitre: "Chapitre 7 — Vaincre la distance, fixer l'instant. Avec les O'Sullivan.",
  presentation: "Grâce à ta pile, l'électricité lance les messages autour du globe. Et on apprend à fixer l'instant (photo), la voix (phonographe), le mouvement (cinéma). Suis la famille O'Sullivan : James, chercheur d'or, appelle sa famille en Irlande. Ils embarquent sur le Titanic. Son petit-fils Sean va au cinéma, puis passe son premier coup de téléphone.",
  accroche: "Morse 📟 · photo 📷 · câble 🌊 · phono 🎙️ · TSF 🆘 · cinéma 🎞️ · téléphone 📞",

  finTitre: "SAUT TEMPOREL RÉUSSI",
  finTexte: "« Circuits rechargés à {pct} %. Quel siècle pressé ! Fil, câble sous la mer, ondes dans l'air, voix d'un océan à l'autre. Mais ta frise le montre : plus c'est rapide, moins ça dure. Direction le XXe : la radio et la télévision vont entrer dans chaque foyer. Et l'ordinateur va naître. » — MARTINE",

  required: 6,
  startScene: 0,
  destination: "XXe SIÈCLE",
  linear: true,

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
  portraits: {
    james: PortraitJames,
    "james-vieux": PortraitJamesVieux,
    photographe: PortraitPhotographe,
    marconi: PortraitMarconi,
    ouvreuse: PortraitOuvreuse,
    sean: PortraitSean,
  },
  carte: CarteXIXe,
};

export default chapter;
