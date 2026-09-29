/* ============================================================
   CHAPITRE 1 — Paléolithique (vers −18 000)
   ============================================================
   CE FICHIER CONTIENT TOUT LE CONTENU DU CHAPITRE.
   Pour modifier un texte, une recette, un indice : c'est ici.
   Les décors (dessins) sont dans le dossier scenes/.
   Le moteur du jeu (src/engine/) n'a jamais besoin d'être touché.
   ============================================================ */

import SceneInterieur from "./scenes/SceneInterieur.jsx";
import SceneExterieur from "./scenes/SceneExterieur.jsx";
import SceneCampement from "./scenes/SceneCampement.jsx";
import SceneRiviere from "./scenes/SceneRiviere.jsx";
import SceneAtelier from "./scenes/SceneAtelier.jsx";
import SceneGue from "./scenes/SceneGue.jsx";
import SceneCrete from "./scenes/SceneCrete.jsx";
import { PortraitAna, PortraitRaya, PortraitDoru, PortraitKyan } from "./scenes/portraits.jsx";
import CartePaleo from "./scenes/CartePaleo.jsx";

/* ------------------------------------------------------------
   LES ÉLÉMENTS
   id : { name (nom affiché), emoji, desc (texte quand on le ramasse) }
   ------------------------------------------------------------ */
const ITEMS = {
  /* ANACHRONISME — un SEUL par époque, à jeter dans la poubelle temporelle. */
  allumettes: { name: "Boîte d'allumettes", emoji: "🔥", anachronic: true, desc: "Une boîte d'allumettes en carton — ça n'existera pas avant 1826 !" },

  /* ─── OBJETS D'ÉPOQUE INUTILES (ephemere) ───
     Marqués `ephemere: true` → disparaissent du sac au changement de tableau.
     Aucune utilité pour la mission — juste pour peupler les scènes, ralentir
     l'exploration, et faire sourire avec les répliques de MARTINE. */
  feuille_morte: { name: "Feuille morte", emoji: "🍂", ephemere: true, desc: "Une feuille morte. Très paléolithique. Absolument inutile pour rentrer chez toi." },
  coccinelle:    { name: "Coccinelle", emoji: "🐞", ephemere: true, desc: "Une coccinelle à sept points. Ça porte bonheur, dit-on. Ça ne recharge pas MARTINE." },
  plume:         { name: "Plume d'oiseau", emoji: "🪶", ephemere: true, desc: "Sûrement d'un tétras. Décorative, sans plus. Repose-la avant que quelqu'un ne t'accuse de vol." },
  escargot:      { name: "Escargot", emoji: "🐌", ephemere: true, desc: "Un escargot préhistorique. Il t'apprend la patience — pas la communication." },
  caillou_rond:  { name: "Joli caillou", emoji: "🪨", ephemere: true, desc: "Un galet parfaitement rond. Il fera un beau presse-papier dans 20 000 ans. En attendant : rien." },
  champignon:    { name: "Champignon", emoji: "🍄", ephemere: true, desc: "Un champignon rouge à points blancs. Sans info sur sa comestibilité, tu le reposes très vite." },
  brindille:     { name: "Brindille", emoji: "🌿", ephemere: true, desc: "Une brindille sèche. On peut faire du feu avec, mais tu as mieux." },
  fleur:         { name: "Petite fleur", emoji: "🌸", ephemere: true, desc: "Une fleur bleue sauvage. Jolie. Aucune vertu magique connue." },


  branche:  { name: "Branche souple", emoji: "🌿", desc: "Du noisetier, souple et solide. De quoi fabriquer bien des choses." },
  liane:    { name: "Liane", emoji: "🪢", desc: "Fibre végétale, résistante et élastique. Ça s'étire… et ça revient." },
  silex_brut: { name: "Silex brut", emoji: "🪨", desc: "Un rognon de silex ramassé au fond de la grotte. Brut, gris, encore recouvert de sa croûte blanche : il ne coupe rien tel quel. À TAILLER au percuteur sur le rocher de l'atelier." },
  silex:    { name: "Silex taillé", emoji: "🔪", desc: "Un éclat détaché du silex brut par une frappe bien placée. Tranchant comme un rasoir : l'outil de base de la Préhistoire." },
  ocre:     { name: "Ocre rouge", emoji: "🟠", desc: "Pigment minéral. Broyé, mélangé à de la graisse : de la peinture." },
  /* SUPPORTS (support: true) : fixes, ne vont PAS dans le sac. On leur
     APPORTE un objet (glisser un outil dessus). Le moteur les affiche
     d'une autre couleur (cyan) et refuse de les ramasser. */
  paroi:    { name: "Paroi de la grotte", emoji: "🪨", support: true, desc: "Immense, lisse, à l'abri du vent et de la pluie. Un écran naturel." },
  rocher_taille: { name: "Rocher de taille", emoji: "🪨", support: true, desc: "Un rocher plat, cerné d'éclats de silex : la table de travail d'Ough." },
  feu:      { name: "Feu de camp", emoji: "🔥", support: true, desc: "Chaleur, lumière… et le lieu où le clan se rassemble le soir." },
  voix:     { name: "Le chant", emoji: "🎵", desc: "Un cri, un mot, une mélodie. Le tout premier média — livré d'origine avec chaque être humain." },
  tronc:    { name: "Tronc creux", emoji: "🪵", desc: "Un tronc échoué, évidé par l'eau. Ça résonne quand on tape dessus." },
  /* SUPPORT (support: true) : le cerf ne se ramasse PAS. Il boit à la
     rivière, dans le décor : on lui envoie l'ARC ARMÉ (glisser dessus)
     pour le chasser. */
  cerf:     { name: "Cerf", emoji: "🦌", support: true, desc: "Il boit à la rivière, aux aguets. Impossible de l'approcher à pied — il faut le viser de loin, à l'arc." },
  arc:      { name: "Arc", emoji: "🏹", desc: "Branche courbée + liane tendue. Il ne manque qu'un projectile." },
  fleche:   { name: "Flèche", emoji: "➶", desc: "Branche droite, pointe de silex. Elle vole droit." },
  arcarme:  { name: "Arc armé", emoji: "🎯", desc: "Arc + flèche. Prêt pour la chasse." },
  peau:     { name: "Peau de cerf", emoji: "🟤", desc: "Grattée au silex, séchée. Une surface souple… on pourrait y peindre." },
  os:       { name: "Os", emoji: "🦴", desc: "Un long os de cerf, léger et creux à l'intérieur. Taillé au silex, il donnerait de beaux outils." },
  outils_os:{ name: "Outils en os", emoji: "🪡", desc: "Une aiguille fine, un poinçon… et un os creux percé de quelques trous. La trousse à outils du clan, taillée au silex." },
  charbon:  { name: "Charbon de bois", emoji: "⚫", desc: "Bois passé au feu. Ça noircit les doigts — et tout ce qu'on touche." },
};

/* ------------------------------------------------------------
   LES TABLEAUX (dans l'ordre de navigation ‹ ›)
   Component = le dessin correspondant, dans scenes/
   ------------------------------------------------------------ */
const SCENES = [
  /* `ambience: "grotte"` : un fond sonore discret (tambour + chants du
     clan, synthétisés) démarre dans ce tableau et s'arrête en le quittant. */
  { id: "interieur", name: "Au fond de la grotte", Component: SceneInterieur, ambience: "grotte" },
  { id: "exterieur", name: "Devant la grotte",     Component: SceneExterieur },
  { id: "atelier",   name: "L'atelier de silex",   Component: SceneAtelier },
  { id: "campement", name: "Le campement",         Component: SceneCampement },
  { id: "crete",     name: "Le point de vue",      Component: SceneCrete },
  { id: "riviere",   name: "La rivière",           Component: SceneRiviere },
  { id: "gue",       name: "Le gué",               Component: SceneGue },
];

/* Pour les indices : où trouver chaque élément de base. */
const WHERE = {
  liane: "devant la grotte", ocre: "devant la grotte",
  silex_brut: "au fond de la grotte, ou au pied du tas de silex à l'atelier",
  silex: "à l'atelier — mais il faut d'abord le TAILLER (mini-jeu, silex brut + rocher)",
  voix: "au campement", branche: "au campement",
  tronc: "à la rivière",
};

/* Éléments qui disparaissent du jeu quand un drapeau est levé
   (ici : plus de cerf à trouver une fois la chasse réussie). */
const HIDDEN_BY_FLAG = { hunted: ["cerf"] };

/* ------------------------------------------------------------
   LES RECETTES : a + b → out
   - line : réplique de MARTINE en cas de réussite
   - msg: true → c'est un MESSAGE pour le futur (fiche documentaire)
   - Recette-événement (ex. la chasse) :
       gives   : éléments gagnés
       consume : éléments retirés de la besace
       flag    : drapeau levé (les décors peuvent y réagir)
   ------------------------------------------------------------ */
const RECIPES = [
  { a: "branche", b: "liane",  out: "arc",
    line: "Une branche qui plie, une liane qui tire : un ARC. Les humains viennent d'inventer le stockage d'énergie." },
  { a: "branche", b: "silex",  out: "fleche",
    line: "Branche droite + pointe de silex = FLÈCHE. Aérodynamique validée par mes capteurs." },
  { a: "arc",     b: "fleche", out: "arcarme",
    line: "Arc armé. Rappel de sécurité : ne vise que le gibier, pas la machine temporelle." },
  { a: "arcarme", b: "cerf",   out: "chasse", gives: ["peau", "os"], consume: ["cerf"], flag: "hunted",
    line: "Chasse réussie, d'une seule flèche. Respect au cerf : rien ne sera gaspillé. Tu récupères une PEAU et un OS. Retiens : avant de communiquer, les humains ont d'abord dû survivre — et la chasse a fourni les premiers supports." },
  { a: "branche", b: "feu",    out: "charbon",
    line: "Du bois, du feu, et voilà du CHARBON. Le premier crayon de l'humanité sort du foyer." },
  /* le charbon se fait aussi bien avec un gros tronc qu'avec une branche :
     du bois, du feu, et le bois noirci qui reste sert à dessiner. */
  { a: "tronc",   b: "feu",    out: "charbon",
    line: "Tu pousses le tronc dans les braises. Le bois se consume lentement, noircit, et tu en retires du CHARBON — de quoi tracer bien des traits." },
  /* Les OUTILS EN OS : le silex taille l'os → aiguille, poinçon, os percé.
     C'est le passage obligé vers la tenue (coudre) ET la flûte (souffler). */
  { a: "os",      b: "silex",  out: "outils_os",
    line: "Au silex, tu tailles l'os : une AIGUILLE fine, un poinçon… et un os creux percé de quelques trous. Toute une trousse à outils !" },
  { a: "outils_os", b: "voix", out: "msg_flute", msg: true },
  { a: "charbon", b: "paroi",  out: "msg_peinture", msg: true },
  { a: "ocre",    b: "paroi",  out: "msg_mains", msg: true },
  { a: "peau",    b: "charbon", out: "msg_peau", msg: true },
  { a: "peau",    b: "ocre",   out: "msg_peau", msg: true },
  { a: "peau",    b: "tronc",  out: "msg_tambour", msg: true },
  /* La MODE, un mode de communication : avec l'aiguille d'os, on coud la
     peau → la tenue du clan. S'habiller, c'est déjà DIRE qui on est. */
  { a: "outils_os", b: "peau", out: "msg_mode", msg: true },
  { a: "voix",    b: "feu",    out: "msg_veillee", msg: true },
  /* MESSAGE PERDU (perdu: true) : la combinaison réussit, mais le
     support ne parvient pas au futur → fragment au lieu de cristal.
     Ne compte pas pour le saut temporel. */
  { a: "tronc",   b: "silex",  out: "msg_baton", msg: true, perdu: true },
];

/* ------------------------------------------------------------
   LES MESSAGES POUR LE FUTUR (fiches documentaires)

   Chaque message porte 4 JAUGES notées de 1 à 5 (le fil rouge
   pédagogique du jeu). Échelle commune à TOUS les chapitres :
   🏃 vitesse    1=il faut se déplacer · 2=voyage avec un porteur
                 3=instantané à portée de voix/vue
                 4=instantané sur des km · 5=instantané mondial
   🌍 portee     1=quelques personnes · 2=un clan/village
                 3=une région · 4=un pays · 5=le monde
   📦 capacite   1=une seule idée · 2=quelques signes/une émotion
                 3=un récit/une image · 4=des récits entiers · 5=tout
   ⏳ durabilite 1=disparaît aussitôt · 2=des décennies
                 3=des siècles · 4=des millénaires
                 5=des dizaines de millénaires
   ------------------------------------------------------------ */
const MESSAGES = {
  msg_peinture: { title: "Peindre la paroi", emoji: "🐂",
    jauges: { vitesse: 1, portee: 1, capacite: 3, durabilite: 5 },
    fact: "Au charbon et aux pigments, les humains couvrent les parois de chevaux, bisons, aurochs — comme à Lascaux, vers −18 000. Ces images nous « parlent » encore 20 000 ans plus tard : c'est le plus ancien média conservé. Un message sans mots, mais pas sans sens — et sans son auteur pour l'expliquer : à nous d'interpréter, prudemment.",
    wiki: "https://fr.wikipedia.org/wiki/Grotte_de_Lascaux" },
  msg_mains: { title: "Marquer sa main", emoji: "🖐️",
    jauges: { vitesse: 1, portee: 1, capacite: 1, durabilite: 5 },
    fact: "Main plaquée sur la roche, ocre soufflé autour : une main « en négatif ». La grotte de Gargas, dans les Hautes-Pyrénées, en compte plus de 200, vieilles de 27 000 ans ! Le message le plus simple du monde : « J'existe, j'étais là. » L'ancêtre lointain de la signature… et du selfie.",
    wiki: "https://fr.wikipedia.org/wiki/Grotte_de_Gargas" },
  msg_flute: { title: "Musique (flûte)", emoji: "🪈", sfx: "flute",
    jauges: { vitesse: 3, portee: 1, capacite: 2, durabilite: 4 },
    fact: "Un os creux, quelques trous percés au silex : une flûte. Les plus anciennes connues ont 35 000 ans (grotte de Hohle Fels) — et la grotte d'Isturitz, au Pays basque, en a livré plus de vingt ! La musique transmet des émotions sans aucun mot : un langage qui n'a pas besoin de traduction. (L'os a survécu 35 000 ans… mais les mélodies, elles, sont perdues à jamais.)",
    wiki: "https://fr.wikipedia.org/wiki/Grottes_d'Isturitz_et_d'Oxocelhaya" },
  msg_tambour: { title: "Musique (tambour)", emoji: "🥁",
    jauges: { vitesse: 4, portee: 2, capacite: 2, durabilite: 1 },
    fact: "Une peau tendue sur un tronc creux : le son porte loin, bien plus loin que la voix. Frapper des rythmes codés, c'est envoyer un message à distance — bien plus tard, les « tambours parleurs » d'Afrique transmettront des nouvelles de village en village, à des kilomètres. Le son fut le premier réseau longue distance… mais un son ne laisse aucune trace, et peau et bois pourrissent." },
  msg_peau: { title: "Peau ornée", emoji: "🟤",
    jauges: { vitesse: 2, portee: 2, capacite: 3, durabilite: 2 },
    fact: "Des signes peints sur une peau : un récit qu'on peut rouler, transporter, offrir. Mais attention : contrairement à la pierre, la peau pourrit — presque rien de tel ne nous est parvenu. Grande leçon des médias : un message ne survit que si son SUPPORT survit. (La vraie écriture, elle, naîtra vers −3300 en Mésopotamie.)" },
  msg_mode: { title: "Vêtement de cuir", emoji: "🧥",
    jauges: { vitesse: 1, portee: 2, capacite: 2, durabilite: 2 },
    fact: "Au silex, on découpe et on assemble la peau : un vêtement. Mais dès le Paléolithique, se couvrir ne sert pas qu'à avoir chaud — on perce des coquillages, des dents, on taille des perles d'ivoire pour se PARER. La mode est un mode de communication : d'un coup d'œil, la parure dit le groupe, le rang, l'âge, le clan de celui qui la porte. C'est un des plus vieux langages visuels, un message qu'on porte sur soi. À Sungir (Russie), une sépulture d'il y a ~34 000 ans a livré 13 300 perles d'ivoire de mammouth, cousues sur les habits d'un chef et de deux enfants : la panoplie du prestige.",
    wiki: "https://fr.wikipedia.org/wiki/Sungir" },
  msg_veillee: { title: "Raconter au coin du feu", emoji: "🌙",
    jauges: { vitesse: 3, portee: 2, capacite: 4, durabilite: 1 },
    fact: "Le soir, autour du feu, les anciens racontent : mythes, techniques de chasse, histoire du clan. Pendant des dizaines de milliers d'années, TOUT le savoir passe par la parole. Sa limite : à chaque fois qu'on le répète, le récit se déforme un peu — comme un secret qui passe d'oreille en oreille. Sans trace écrite, impossible de vérifier la version « originale »." },
  /* MESSAGE PERDU (perdu: true) : durabilité au plancher. */
  msg_baton: { title: "Gravure sur bois", emoji: "🪵", perdu: true,
    jauges: { vitesse: 1, portee: 1, capacite: 2, durabilite: 1 },
    fact: "Sur un bâton, un tronc, on entaille des signes au silex : un compte, un nom, un message. C'était sans doute le support le PLUS utilisé de toute la Préhistoire — le bois est partout, tendre, facile à graver. Mais voilà : le bois pourrit, brûle, se perd. Des dizaines de milliers de messages de bois ont existé… et pas UN SEUL ne nous est parvenu. C'est la grande injustice de l'archéologie : ce qui a le plus servi a le plus disparu. Un message ne survit que si son support survit." },
};

/* ------------------------------------------------------------
   LES INDICES (bouton 💡) — le premier indice dont l'élève
   possède tous les ingrédients (needs) est proposé.
   ------------------------------------------------------------ */
const HINTS = [
  { needs: ["silex_brut"], out: "silex", text: "Un silex brut ne coupe rien. Va le tailler sur le ROCHER de l'atelier — clique dessus pour ouvrir le mini-jeu." },
  { needs: ["branche", "liane"], out: "arc", text: "Quelque chose qui plie… avec quelque chose qui s'étire. Ça pourrait propulser." },
  { needs: ["branche", "silex"], out: "fleche", text: "Une branche bien droite avec une pointe qui coupe : ça pourrait voler." },
  { needs: ["arc", "fleche"], out: "arcarme", text: "Tu as l'arme et le projectile. Réunis-les." },
  { needs: ["arcarme"], out: "chasse", text: "Ton arc est armé ! Le cerf boit à la rivière, là-bas. Vise-le : glisse ton arc directement sur lui." },
  { needs: ["branche", "feu"], out: "charbon", text: "Que devient le bois quand il passe dans le feu ? Un outil pour dessiner, peut-être." },
  { needs: ["os", "silex"], out: "outils_os", text: "Cet os et un silex tranchant : de quoi tailler des outils fins — une aiguille, un poinçon… et percer l'os." },
  { needs: ["outils_os", "voix"], out: "msg_flute", text: "L'os percé de ta trousse à outils ne demande qu'un souffle. Le tien." },
  { needs: ["charbon", "paroi"], out: "msg_peinture", text: "Tu as de quoi tracer du noir. Et au fond de la grotte, un immense écran de pierre…" },
  { needs: ["ocre", "paroi"], out: "msg_mains", text: "Du pigment rouge, une paroi… et ta main comme pochoir ?" },
  { needs: ["peau", "charbon"], out: "msg_peau", text: "La peau du cerf est une surface souple. De quoi y tracer un récit ?" },
  { needs: ["peau", "tronc"], out: "msg_tambour", text: "Une peau bien tendue sur quelque chose qui résonne…" },
  { needs: ["outils_os", "peau"], out: "msg_mode", text: "Avec l'aiguille d'os et la peau de ta chasse, tu peux coudre la tenue du clan." },
  { needs: ["voix", "feu"], out: "msg_veillee", text: "Le soir, le clan se rassemble quelque part. Ta voix y trouverait un public." },
  { needs: ["tronc", "silex"], out: "msg_baton", text: "Un morceau de bois, un silex tranchant… tu pourrais y graver des signes. Mais le bois traverse-t-il vraiment le temps ?" },
];

/* Répliques spéciales pour les erreurs « logiques » (presque !) */
const NEAR_MISS = [
  { pair: ["arc", "cerf"], line: "Un arc sans flèche ? Le cerf te remercie pour la petite brise." },
  { pair: ["fleche", "cerf"], line: "Lancer une flèche à la main… ambitieux. Il te faudrait un engin pour la propulser. Un arc, par exemple." },
  { pair: ["silex", "cerf"], line: "Approcher un cerf avec un silex ? Il court à 60 km/h. Toi non. Trouve une arme à distance." },
  { pair: ["voix", "paroi"], line: "OHÉ !… ohé… ohé… Joli écho. Mais l'écho ne transmet rien au futur : il radote." },
  { pair: ["voix", "cerf"], line: "Tu as parlé au cerf. Il t'a écouté poliment, puis il a continué à boire. Le dialogue inter-espèces attendra." },
  { pair: ["ocre", "feu"], line: "Chauffer l'ocre le fonce — joli, mais ce n'est pas encore un message." },
  { pair: ["os", "voix"], line: "Tu souffles de toutes tes forces dans un os plein. Résultat : tu es rouge, et l'os est toujours muet. Taille-le d'abord au silex — il faut le percer." },
  { pair: ["silex", "peau"], line: "Découper la peau à même le silex ? Tu vas la gâcher. Taille d'abord de vrais outils dans un os — une aiguille, ça coud." },
];

/* Répliques d'échec génériques (piochées au hasard) */
const FAIL_LINES = [
  "Bzzt. Ces deux-là n'ont rien à se dire. Essaie autre chose.",
  "Combinaison rejetée. Même mes circuits de secours sont perplexes.",
  "Hmm. Créatif, mais l'Histoire n'a pas retenu cette invention — il y a une raison.",
  "Erreur 404 : invention non trouvée.",
  "Mes capteurs détectent 0 % d'idée et 100 % de bricolage. On réessaie ?",
];

/* Introduction de MARTINE au lancement du chapitre */
const INTRO = [
  "◈ Atterrissage en −18 000. Bienvenue au Paléolithique, chronaute. Tu es le premier humain de ton siècle à poser le pied ici.",
  "Regarde autour de toi : ce clan m'a déjà croisée — un autre chronaute est passé avant toi. Gagne leur confiance, aide chacun à laisser sa trace : elles remplissent ma jauge, à droite.",
  "Explore avec ‹ ›, touche ce qui t'intrigue, et va saluer Raya, le chef, au campement — c'est en parlant aux gens qu'on découvre qui attend quelque chose de toi.",
];

/* Actions spéciales des décors (zones cliquables qui ne ramassent rien).
   say : réplique de MARTINE · goto : numéro du tableau où aller (0 = premier)
   mood : expression de l'avatar ("neutre", "content", "vexe") */
const ACTIONS = {
  wreck: { mood: "content", say: "Je t'attends là, tranquille. Quand tu auras récupéré assez de flux temporel, on redécolle." },
  /* Le TARDIS caché dans la plaine du point de vue : clin d'œil au Docteur.
     `grant: "tardis_gone"` mémorise le clic pour qu'il ne revienne pas. */
  tardis: { mood: "content", grant: "tardis_gone",
    say: "Attends… une petite cabine bleue qui pulse et disparaît en gémissant. Un Docteur me doit un café." },
  cave:  { goto: 0, say: "Tu entres dans la grotte. Il y fait sombre… mais la lumière du matin éclaire une paroi magnifique, au fond." },

  /* LE CLAN — quatre personnages, une histoire (voir QUETE plus bas).
     Ici : leur réplique « par défaut », quand ce n'est pas leur tour dans
     la quête. `bubble` = leurs paroles (phylactère), `say` = MARTINE. */
  ana: { mood: "content",
    bubble: "Alors, comment trouves-tu le clan ? Prends ton temps, regarde tout… Et si tu es perdu, parle à chacun : quelqu'un a toujours besoin de toi quelque part.",
    say: "Ana. C'est elle qui t'a ouvert les portes du clan — reste poli, on est invités.",
    chitchat: [
      "Ma petite Ila commence à nommer les choses. Hier, elle a dit « feu ». Ça, c'est un vrai jour !",
      "J'ai vu des traces d'ours ce matin, au sud. On restera à l'est pour ramasser.",
      "Regarde le ciel : les grands nuages froids arrivent. La saison change vite, cette année.",
      "Tu veux goûter ? On a fait sécher des myrtilles au soleil. C'est sucré comme rien.",
    ],
    jeu2Variants: [
      { bubble: "Toi ? Encore ? Une autre comme toi est venue autrefois. Elle voulait entrer dans la grotte, tout au fond. Elle est ressortie les mains couvertes d'ocre.",
        say: "Ana se souvient d'Al3x1A : elle est entrée AU FOND DE LA GROTTE, sur la Grande Paroi." },
      { bubble: "Une chronaute est venue avant toi, oui. Elle s'est assise au campement, près du feu, et a laissé une marque étrange sur les pierres du foyer.",
        say: "Ana pointe LE CAMPEMENT, près du feu. Cherche par là." },
      { bubble: "Une autre étrangère est descendue au gué. Elle a laissé quelque chose sur une des grandes pierres, près du pêcheur.",
        say: "Ana l'oriente AU GUÉ, sur une des grandes pierres près du pêcheur." },
    ] },

  raya: { mood: "neutre",
    bubble: "Un chef veille sur tout : le feu, les bêtes, les histoires. Fais ta part, voyageur, et le clan fera la sienne.",
    say: "Raya, le chef. Peu de mots, beaucoup d'autorité. Je l'aime bien.",
    chitchat: [
      "Le feu ne doit pas s'éteindre. Jamais. Le rallumer prend un jour entier.",
      "Un bon chef écoute beaucoup. Il parle peu.",
      "Aujourd'hui, tout va bien. Demain, on verra. C'est notre règle.",
      "Il faudra bientôt lever le camp. La harde est déjà passée deux fois près d'ici.",
    ],
    jeu2Variants: [
      { bubble: "Une drôle de voyageuse aux cheveux courts est venue avant toi. Elle a peint une marque étrange au fond de la grotte, sur la Grande Paroi.",
        say: "Le chef confirme : fond de la grotte, sur la paroi peinte." },
      { bubble: "Une drôle de voyageuse s'est réchauffée à notre feu. Puis elle a gravé un signe sur une pierre du foyer, avant de repartir.",
        say: "Raya : la marque est au CAMPEMENT, sur une pierre près du feu." },
      { bubble: "Une voyageuse aux cheveux courts est passée au gué, là où pêche le vieux. Elle a laissé une trace sur une des grandes pierres.",
        say: "Raya : la trace est AU GUÉ, sur une grande pierre près du pêcheur." },
    ] },

  doru: { mood: "neutre",
    bubble: "Chut ! Le gibier a l'oreille fine. Parle bas, marche léger.",
    say: "Doru, le chasseur du clan. Lui, c'est la rivière et le silence.",
    chitchat: [
      "Chuuut. Tu marches trop fort. Le gibier t'entend à cent pas.",
      "J'ai vu un renard tout à l'heure. Trop rapide pour moi ce matin.",
      "Un bon chasseur sait aussi rentrer bredouille. Ça arrive.",
      "Le vent vient du nord. C'est mauvais : le cerf va nous flairer.",
    ],
    jeu2Variants: [
      { bubble: "Une chasseuse d'un autre temps a bu à cette rivière avant toi. Elle n'a pas tué. Elle a filé au fond de la grotte pour peindre.",
        say: "Doru l'a vue partir vers LA GROTTE. Elle y a laissé une peinture." },
      { bubble: "Elle est passée près de moi, cette étrangère. Elle est remontée au campement, s'est assise près du feu. C'est là qu'elle a laissé quelque chose.",
        say: "Doru la renvoie AU CAMPEMENT, près du feu." },
      { bubble: "Une étrange chasseuse est restée longtemps au gué du pêcheur. Elle a gravé une des grandes pierres, puis elle est partie.",
        say: "Doru : elle a grave AU GUÉ, sur une grande pierre du pêcheur." },
    ] },

  kyan: { mood: "neutre",
    bubble: "Je suis la mémoire du clan. Tout ce qui s'oublie meurt une seconde fois — c'est pour ça que je me souviens.",
    say: "Kyan, la mémoire du clan. Ce qu'elle sait tient dans une seule tête… fragile, non ?",
    chatOnce: {
      q: "Ah, tu tombes bien ! Demain je monte peindre sur la Grande Paroi et je bloque : un animal me manque, quelque chose que le clan n'a pas encore. À ton avis, lequel ?",
      choices: [
        { a: "Un cheval sauvage — ceux qui galopent dans la plaine.",
          r: "Un cheval… personne n'a osé ici. Tu me donnes une drôle d'idée. Merci, voyageur — je vais essayer." },
        { a: "Un mammouth — impressionnant, personne ne l'oubliera.",
          r: "Ah, le mammouth ! Grand chantier. Une semaine et beaucoup d'ocre. Mais j'aime les défis — c'est peut-être le bon jour pour commencer." },
        { a: "Un poisson — le pêcheur en serait fier.",
          r: "Un poisson ! Ha ! Personne n'y pense jamais. Le vieux du gué en serait tout ému. Tu es plein d'idées, toi." },
      ],
    },
    chitchat: [
      "Chaque nom qu'on oublie, c'est un ancêtre qui meurt une seconde fois.",
      "J'apprends à Ila les chants du clan. Elle en retient déjà trois.",
      "Autrefois, la grotte était plus grande. Ou nous étions plus petits, qui sait.",
      "Je connais tous les prénoms de tous les enfants nés ici depuis mon enfance. Cinquante-deux.",
    ],
    jeu2Variants: [
      { bubble: "Je me souviens d'elle comme si c'était hier. Al3x1A. Je l'ai vue peindre juste là, sur la Grande Paroi, au fond de la grotte.",
        say: "Kyan garde tout : la trace d'Al3x1A est AU FOND DE LA GROTTE." },
      { bubble: "Al3x1A. Je me rappelle : elle s'est arrêtée au campement, près de notre feu. Elle a gravé une pierre du foyer, un signe étrange.",
        say: "Kyan renvoie AU CAMPEMENT, près du feu. Cherche sur les pierres." },
      { bubble: "Al3x1A a passé beaucoup de temps au gué du pêcheur. Elle a marqué une des grandes pierres, personne n'a osé l'effacer.",
        say: "Kyan : marque d'Al3x1A AU GUÉ, sur une grande pierre." },
    ] },

  /* ─── Nouveaux personnages / actions des tableaux ajoutés (atelier, gué, crête) ─── */
  ough: { mood: "neutre",
    bubble: "Je suis Ough, tailleur de silex. Ramasse un caillou brut là-bas, pose-le sur le rocher, et frappe-le au bon moment : un éclat tranchant s'en détache.",
    say: "Ough, le tailleur de silex. Un savoir-faire transmis de la main à la main depuis 2 millions d'années — sans un mot écrit.",
    chitchat: [
      "Frapper au bon angle, au bon moment. C'est tout un art. Ma main sait ce que ma tête a oublié.",
      "Regarde ces éclats à mes pieds : chacun a raté quelque chose de mieux.",
      "Un bon silex, on le reconnaît au bruit qu'il fait quand on le tape. Écoute…",
      "Ma grand-mère m'a montré. Je fais pareil avec les petits, main sur la main. C'est comme ça qu'on apprend.",
    ] },

  pecheur: { mood: "neutre",
    bubble: "Assis, silencieux, patient. La rivière donne à qui sait attendre.",
    say: "Le pêcheur du gué. La patience comme technique — un savoir sans mots.",
    chitchat: [
      "…",
      "Le poisson ne parle pas — mais il écoute très bien. C'est nous qui devons nous taire.",
      "Assis là depuis l'aube. Deux truites. Ce sera assez pour ce soir.",
      "L'eau descend plus vite aujourd'hui. Les truites remontent. C'est bon signe.",
    ] },

  aine: { mood: "neutre",
    bubble: "D'ici, on voit tout. Le troupeau au sud, l'orage à l'ouest. On garde l'œil, on prévient le clan.",
    say: "L'aîné en observation sur la crête. Un « poste-relais » avant l'invention du télégraphe.",
    chitchat: [
      "L'orage viendra du nord d'ici deux jours. Je le sens dans mes vieux os.",
      "Les bisons descendent la vallée à la même saison, chaque année. Toujours la même piste.",
      "D'ici, on voit tout. Sauf ce qu'on cherche vraiment.",
      "J'ai passé plus de journées ici que dans ma propre grotte. Et je ne m'en lasse pas.",
    ] },

  cairn: { mood: "neutre",
    bubble: "Un petit tas de pierres empilées — laissé par les chasseurs qui sont passés ici. Un message très simple : « quelqu'un est venu ». Ancêtre du panneau routier.",
    say: "Un cairn de repère. Message minimal, universel, durable." },

  troupeau_loin: { mood: "neutre",
    bubble: "Les bisons ! Une centaine, au moins, en train de brouter dans la plaine.",
    say: "Le troupeau — nourriture, peaux, os. Il faudra le chasser un jour." },

  aigle: { mood: "content",
    bubble: "Un aigle qui plane sans battre les ailes. Il voit la souris à 300 mètres — meilleur observateur que nous.",
    say: "L'aigle royal, œil du ciel." },

  pecher: { mood: "neutre", say: "Un poisson ! Trop rapide pour l'attraper à la main. Il faudrait une lance ou un filet — pour plus tard." },

  /* Actions qui ouvrent des mini-jeux */
  tailler_silex: { modal: "taille_silex", needsItem: "silex_brut", consumeItem: "silex_brut",
    needItemMsg: "Il te faut d'abord un SILEX BRUT à tailler. Va en ramasser un au fond de la grotte, ou dans le tas à l'atelier." },
  traverser_gue: { mood: "neutre", say: "Les pierres du gué sont glissantes — sans bâton, tu risques la chute. Mieux vaut trouver un chemin plus sûr… ou attendre." },
};

/* ------------------------------------------------------------
   LA QUÊTE — l'histoire du chapitre, étape par étape.
   Le joueur est un étranger que le clan accueille… s'il fait ses
   preuves. Chaque étape :
   - perso  : QUI parle (le « ? » doré se place sur lui)
   - bubble : ses paroles · say : le commentaire de MARTINE
   - attend : ce qu'il faut accomplir pour passer à la suite
              (un id de message/objet fabriqué, ou un drapeau comme
              "hunted" ; une liste = n'importe lequel suffit).
              Sans `attend`, l'étape passe dès qu'on a parlé.
   - suite  : petite phrase de MARTINE quand l'étape est accomplie
              (elle indique vers qui aller ensuite).
   ------------------------------------------------------------ */
const QUETE = [
  /* `portrait: "…"` : l'étape s'affiche en GROS PLAN — le personnage
     s'avance devant l'écran pour parler (dessins dans scenes/portraits.jsx,
     déclarés dans `portraits` en bas de ce fichier). On l'ouvre en cliquant
     le personnage dans le décor ; `auto: true` = elle s'ouvre toute seule
     (l'accueil d'Ana, au tout début). */
  { perso: "ana", portrait: "ana", auto: true,
    bubble: "Bienvenue au clan de Ceux-qui-marchent-debout ! C'est rare de rencontrer de nouvelles personnes : viens donc passer quelque temps avec nous. Commence par saluer Raya, notre chef — près du grand feu, au campement." },

  { perso: "raya", portrait: "raya",
    bubble: "Bienvenue à toi, voyageur. Si tu veux nous aider et être correctement accueilli, va voir Doru, au bord de la rivière : il t'attend.",
    say: "Le chef te met à l'épreuve. Direction la rivière ›." },

  { perso: "doru", portrait: "doru",
    bubble: "Doucement, pas de bruit ! Ici, c'est notre terrain de chasse. Trouve de quoi nous ramener ce joli cerf — de loin, sans le faire fuir.",
    say: "Une arme de jet, donc : quelque chose qui plie, quelque chose qui tire, quelque chose qui pique. Fouille les environs.",
    attend: "hunted",
    suite: "Doru siffle, admiratif. Raya veut te voir : retourne au campement." },

  { perso: "raya", portrait: "raya",
    bubble: "Parfait, bien visé ! Rien ne sera gaspillé : la viande, la peau, les os. Maintenant va voir Kyan, la mémoire du clan, au fond de la grotte : c'est elle qui fait entrer les nouveaux dans la famille.",
    say: "La grotte est au bout du sentier ‹, et la mémoire du clan t'y attend. Ne la fais pas patienter." },

  { perso: "kyan", portrait: "kyan",
    bubble: "Approche, étranger. Pour faire partie de la famille, chacun laisse une trace de lui dans notre grotte sacrée. Quelque chose qui dise, pour toujours : « moi aussi, j'étais là ».",
    say: "Une trace de TOI… ta main, par exemple ? J'ai vu de l'ocre rouge devant la grotte.",
    attend: "msg_mains",
    suite: "Kyan pose sa main sur la tienne : te voilà du clan. Reparle-lui — elle n'a pas fini." },

  { perso: "kyan", portrait: "kyan",
    bubble: "Te voilà des nôtres ! Il te faut maintenant la tenue que nous portons tous. La peau de ta chasse fera l'affaire… mais il te faudra de bons outils pour la travailler.",
    say: "Des outils fins : dans l'os, taillé au silex — aiguille, poinçon. Puis la peau.",
    attend: "msg_mode",
    suite: "Superbe tenue ! Raya t'appelle près du feu : le repas est prêt." },

  { perso: "raya", portrait: "raya",
    bubble: "Te voilà un vrai membre du clan ! Allons manger. Ce soir, nous fêtons ton arrivée : autour du feu, chacun raconte ses chasses.",
    say: "Une veillée ! Ta voix + le feu du clan. C'est comme ça que TOUT se transmettait, avant l'écriture.",
    attend: "msg_veillee",
    suite: "Les récits s'éteignent doucement… Ana te cherche, devant la grotte." },

  { perso: "ana", portrait: "ana",
    bubble: "Toi qui viens de loin… n'aurais-tu pas une idée pour embellir la soirée, après ces récits merveilleux ?",
    say: "De la musique ! Un os percé qui chante… ou une peau tendue sur un tronc, qui batte le rythme.",
    attend: ["msg_flute", "msg_tambour"],
    suite: "Le clan danse encore ! Kyan t'attend dans la grotte sacrée, pour finir." },

  { perso: "kyan", portrait: "kyan",
    bubble: "Après ce bon repas, il est temps de rejoindre les ancêtres dans la grotte et de raconter notre histoire — la tienne aussi, désormais. Trouve un moyen d'illustrer mes mots, veux-tu ?",
    say: "Illustrer un récit sur la paroi… il te faut de quoi DESSINER. Le feu laisse du charbon, tu sais.",
    attend: "msg_peinture",
    suite: "Les images dansent à la lueur du feu. Le clan entier s'en souviendra — et le futur aussi. Va saluer Raya." },

  { perso: "raya", portrait: "raya",
    bubble: "Tu es arrivé étranger : te voilà de la famille. Ta drôle de noix qui clignote t'appelle, là-bas… Va. Et où que tu ailles, souviens-toi de nous.",
    say: "Ma jauge est pleine grâce à eux. Snif. Le bouton PARTIR n'attend que toi — quand tu seras prêt." },
];

/* ------------------------------------------------------------
   LA FICHE DU CHAPITRE — c'est l'objet que lit le moteur.
   ------------------------------------------------------------ */
const chapter = {
  id: "01-paleolithique",
  bandeau: "CHAPITRE 1 · −18 000",       // petit texte en haut de l'écran de jeu
  date: "−18 000",                       // affichée sur l'écran de bord de MARTINE
  epoque: "Paléolithique",               // nom de l'époque (menu, transitions)
  emoji: "🦣",

  /* Écran titre */
  titre: "MARTINE",
  sousTitre: "Machine À Remonter le Temps Intelligente Néanmoins Excellente",
  presentation: "Un accident vous jette en −18 000. Fouille la grotte, le campement, la rivière. Trouve des objets cachés, combine-les deux par deux pour fabriquer des outils et laisser des messages pour le futur.",
  presentationTitre: "Chapitre 1 — Préhistoire.",
  accroche: "Fabrique un arc 🏹 · chasse 🦌 · invente la flûte, le tambour, la peinture…",

  /* Écran de fin — {pct} sera remplacé par le pourcentage de recharge */
  finTitre: "SAUT TEMPOREL RÉUSSI",
  finTexte: "« Circuits rechargés à {pct} %. Retiens ça : un média, c'est une idée + un support + un outil. Et souvent, il faut d'abord fabriquer le support. Direction l'Antiquité : les humains vont y inventer un truc fou — l'écriture. » — MARTINE",

  /* Règles du chapitre */
  required: 3,          // nombre de messages pour débloquer le saut temporel
  startScene: 1,        // on démarre devant la grotte
  destination: "NÉOLITHIQUE", // affiché sur le bouton de saut

  /* Contenu */
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
  portraits: { ana: PortraitAna, raya: PortraitRaya, doru: PortraitDoru, kyan: PortraitKyan },
  carte: CartePaleo,
};

export default chapter;
