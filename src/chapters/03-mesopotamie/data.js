/* ============================================================
   CHAPITRE 3 — Mésopotamie & Égypte : naître de l'écriture (−3300)
   ============================================================
   Tableau 1 (Ur) : QUÊTE narrative — le roi Mesannepada accueille
   l'étranger ; son collecteur d'impôt Narâm-Sîn ne retient plus les
   comptes → on invente l'ÉCRITURE (mini-jeu du registre), puis le
   roi la fait sceller. On file ensuite en Égypte (le Nil), puis en
   Phénicie (l'alphabet) — le voyage est montré par la CARTE (🗺).

   ⚠ Liberté narrative assumée : Ur, Mesannepada et Narâm-Sîn ne
   sont pas exactement contemporains de −3300. MARTINE le sait et en
   sourit ; l'essentiel est vrai : l'écriture naît pour COMPTER.
   ============================================================ */

import SceneUruk from "./scenes/SceneUruk.jsx";
import SceneEcoleScribe from "./scenes/SceneEcoleScribe.jsx";
import SceneNil from "./scenes/SceneNil.jsx";
import ScenePyramide from "./scenes/ScenePyramide.jsx";
import ScenePhenicie from "./scenes/ScenePhenicie.jsx";
import SceneByblos from "./scenes/SceneByblos.jsx";
import CarteMesopotamie from "./scenes/CarteMesopotamie.jsx";
import { PortraitMesannepada, PortraitNaram, PortraitSnefrou } from "./scenes/portraits.jsx";

/* ------------------------------------------------------------
   LES ÉLÉMENTS
   ------------------------------------------------------------ */
const ITEMS = {
  /* ANACHRONISME */
  stylo_bic: { name: "Stylo Bic", emoji: "🖊️", anachronic: true, desc: "Un stylo à bille en plastique — inventé par László Bíró en 1938. En cunéiforme, il ne servirait à rien !" },

  /* Ur */
  roseaux:  { name: "Roseaux du fleuve", emoji: "🌾", desc: "Des tiges droites et creuses, coupées au bord du canal. Taillées en pointe, elles écrivent." },
  couteau:  { name: "Couteau de silex", emoji: "🔪", desc: "Une lame tranchante. De quoi tailler un roseau en biseau — la pointe du scribe." },
  argile:   { name: "Argile fraîche", emoji: "🟤", desc: "Une motte de terre du fleuve, molle et docile. Elle garde tout ce qu'on y presse." },
  calame:   { name: "Calame", emoji: "🖊", desc: "Un roseau taillé en biseau. Enfoncé dans l'argile, il laisse une marque en forme de coin." },
  sceau:    { name: "Sceau-cylindre", emoji: "🔷", desc: "Un petit cylindre de pierre gravé, celui du roi. Roulé sur l'argile, il imprime une image unique — sa signature." },
  /* SUPPORTS (support: true) : fixes, ne vont pas au sac — repérés en cyan
     par le moteur ; on leur APPORTE un objet (glisser dessus). */
  four:     { name: "Four à tablettes", emoji: "🔥", support: true, desc: "La chaleur transforme l'argile molle en pierre. Ce qui en sort peut défier les millénaires." },
  eau:      { name: "Flaque d'eau", emoji: "💧", support: true, desc: "Une flaque, un canal, une averse… l'ennemie jurée de l'argile encore molle." },

  /* Nil (Égypte) */
  papyrus_tiges: { name: "Tiges de papyrus", emoji: "🌿", desc: "La plante-roi du Nil. Coupée et pressée, elle donne des feuilles." },
  roseau_nil:    { name: "Roseaux du Nil", emoji: "🌾", desc: "De fines tiges du bord du fleuve. Taillées en pointe, elles deviennent des calames de scribe." },
  bol:           { name: "Bol de terre", emoji: "🥣", desc: "Un petit bol. Passé au feu, son fond se couvre d'une suie noire — le noir de l'encre." },
  acacia:        { name: "Acacia", emoji: "🌳", support: true, desc: "Un arbre du désert. Entaille son écorce et il pleure une sève collante : le liant de l'encre." },
  feu:           { name: "Feu de camp", emoji: "🔥", support: true, desc: "Un feu vif. On y noircit le bol pour récolter la suie." },
  pierre:        { name: "Pierre à presser", emoji: "🪨", support: true, desc: "Une pierre plate et lourde. On y presse les lamelles de papyrus pour qu'elles se collent et sèchent en feuille." },

  /* Phénicie */
  signes:   { name: "L'alphabet (22 signes)", emoji: "🅰️", desc: "L'alphabet que tu viens d'apprendre : 22 signes, un pour chaque son. Confie-le aux navires pour qu'il fasse le tour de la mer." },
  navires:  { name: "Navires marchands", emoji: "⛵", desc: "Les bateaux phéniciens sillonnent la Méditerranée. Ils transportent des marchandises… et des idées." },

  /* fabriqués */
  tablette_vierge: { name: "Tablette d'argile", emoji: "🟫", desc: "Une galette d'argile aplatie, lisse, prête à recevoir des signes. Il ne manque que la main du scribe." },
  papyrus_coupe: { name: "Lamelles de papyrus", emoji: "🎋", desc: "Les tiges tranchées en fines lamelles. Croisées et pressées, elles se colleront en une feuille." },
  feuille_papyrus:{ name: "Feuille de papyrus", emoji: "📄", keep: true, desc: "Lisse, légère, souple : on peut la rouler, la transporter, l'offrir. Prête à recevoir l'écriture." },
  seve:          { name: "Sève d'acacia", emoji: "💧", desc: "Une gomme collante tirée de l'écorce. Mélangée à la suie, elle fait tenir l'encre." },
  suie:          { name: "Suie noire", emoji: "⚫", desc: "Le noir de fumée récolté au fond du bol. Il ne demande qu'un liant pour devenir de l'encre." },
  encre:         { name: "Encre noire", emoji: "🖤", desc: "Suie + sève : une belle encre noire. Trempes-y ton calame pour tracer des signes." },
  calame_nil:    { name: "Calame", emoji: "🖊", desc: "Un roseau du Nil taillé en pointe fine, la plume du scribe égyptien." },
  calame_encre:  { name: "Calame encré", emoji: "🖋", keep: true, desc: "Le calame trempé dans l'encre noire : prêt à tracer les hiéroglyphes sur la feuille." },

  /* ÉPHÉMÈRES (jetés au changement de tableau — de la déco à ramasser) */
  boulette_argile: { name: "Boulette d'argile", emoji: "🟤", ephemere: true, desc: "Un petit brouillon roulé par un élève scribe." },
  tablette_cassee: { name: "Bout de tablette cassée", emoji: "🧩", ephemere: true, desc: "Une exercice raté, cassé en deux. Les scribes aussi se trompaient !" },
  eclat_calcaire:  { name: "Éclat de calcaire", emoji: "🪨", ephemere: true, desc: "Un éclat tombé du chantier de Snéfrou." },
  scarabee:        { name: "Scarabée", emoji: "🪲", ephemere: true, desc: "Kheper, le scarabée sacré : symbole du soleil qui renaît chaque matin." },
  coquillage_murex:{ name: "Coquillage murex", emoji: "🐚", ephemere: true, desc: "Un mollusque à épines. Écrasé, il donne la pourpre — la couleur des rois." },
  algue_seche:     { name: "Algue sèche", emoji: "🌿", ephemere: true, desc: "Une algue rejetée par la Méditerranée sur la plage de Byblos." },
};

/* ------------------------------------------------------------
   LES TABLEAUX
   ------------------------------------------------------------ */
const SCENES = [
  /* 6 tableaux : chaque lieu principal a un « voisin » libre où l'on peut
     flâner (école du scribe, chantier de la pyramide, port de Byblos). */
  { id: "uruk",           name: "La cité d'Ur",             Component: SceneUruk },
  { id: "ecole_scribe",   name: "L'école du scribe (é-dubba)", Component: SceneEcoleScribe },
  { id: "nil",            name: "Les bords du Nil",         Component: SceneNil },
  { id: "pyramide",       name: "Le chantier de la pyramide", Component: ScenePyramide },
  { id: "phenicie",       name: "La côte phénicienne",      Component: ScenePhenicie },
  { id: "byblos",         name: "Le port de Byblos",        Component: SceneByblos },
];

const WHERE = {
  roseaux: "au bord du canal, dans la cité d'Ur", couteau: "près des artisans (à Ur comme au bord du Nil)",
  argile: "au bord du canal d'Ur, ou dans le panier de l'école du scribe", sceau: "auprès du roi, dans la cité d'Ur",
  papyrus_tiges: "au bord du Nil", roseau_nil: "au bord du Nil", bol: "au bord du Nil",
  navires: "sur la côte phénicienne",
};

const HIDDEN_BY_FLAG = {};

/* ------------------------------------------------------------
   LES RECETTES
   (le cunéiforme n'est PAS ici : il s'obtient par le mini-jeu du
   registre — voir chapters/mesopotamie-tablette.jsx)
   ------------------------------------------------------------ */
const RECIPES = [
  { a: "roseaux", b: "couteau", out: "calame",
    line: "Tu tailles le roseau en biseau : voilà un CALAME, la pointe du scribe. Enfoncé dans l'argile, il laissera des marques en forme de coins." },
  { a: "calame", b: "argile", out: "tablette_vierge",
    line: "Tu aplatis l'argile en une belle galette lisse : une TABLETTE, prête à écrire. Reste à y porter le registre du collecteur. ⚠ Tant qu'elle n'est pas cuite, garde-la LOIN de l'eau : molle, elle fondrait !" },
  /* MESSAGE PERDU : la tablette laissée à l'eau avant d'être cuite. */
  { a: "tablette_vierge", b: "eau", out: "msg_effacee", msg: true, perdu: true },
  { a: "sceau", b: "argile", out: "msg_sceau", msg: true },

  /* ── Égypte (le Nil) : fabriquer papyrus + encre, puis écrire ── */
  { a: "couteau", b: "acacia", out: "seve",
    line: "Tu entailles l'écorce de l'acacia : une sève collante perle. Ce sera le LIANT de l'encre." },
  { a: "couteau", b: "papyrus_tiges", out: "papyrus_coupe",
    line: "Tu tranches les tiges de papyrus en fines LAMELLES. Il reste à les presser pour qu'elles se collent." },
  { a: "papyrus_coupe", b: "pierre", out: "feuille_papyrus",
    line: "Tu croises les lamelles et tu les presses sous la pierre lourde : la sève les colle, elles sèchent en une FEUILLE de papyrus, légère et souple." },
  { a: "couteau", b: "roseau_nil", out: "calame_nil",
    line: "Tu tailles un roseau du Nil en pointe fine : un CALAME, la plume du scribe égyptien." },
  { a: "bol", b: "feu", out: "suie",
    line: "Tu noircis le fond du bol au-dessus des flammes : tu récoltes une belle SUIE noire." },
  { a: "suie", b: "seve", out: "encre",
    line: "Suie + sève d'acacia : tu obtiens une ENCRE noire qui accroche au papyrus." },
  { a: "encre", b: "calame_nil", out: "calame_encre",
    line: "Tu trempes le calame dans l'encre : voilà un CALAME ENCRÉ, prêt à tracer les hiéroglyphes." },
  /* poser le calame encré sur la feuille LANCE le mini-jeu du cartouche
     (on y écrit le nom de Snéfrou → msg_hieroglyphes). */
  { a: "calame_encre", b: "feuille_papyrus", opens: "cartouche",
    needMsg: "Il te faut d'abord une feuille de papyrus ET un calame trempé dans l'encre." },

  { a: "signes", b: "navires", out: "msg_alphabet", msg: true },
];

/* ------------------------------------------------------------
   LES MESSAGES (fiches + jauges 1 à 5)
   ------------------------------------------------------------ */
const MESSAGES = {
  msg_cuneiforme: { title: "Écrire dans l'argile", emoji: "🔠",
    jauges: { vitesse: 2, portee: 2, capacite: 4, durabilite: 5 },
    fact: "Vers −3300, dans les cités de Sumer (Uruk, Ur…), on ne compte plus les moutons de tête : trop nombreux. On presse dans l'argile molle, avec un roseau taillé (le calame), des signes en forme de coins : l'écriture cunéiforme. Elle naît pour la COMPTABILITÉ — stocks de grain, impôts, contrats. Détail énorme : le message survit désormais à celui qui l'a émis, sans se déformer. Fini le récit qui s'abîme d'oreille en oreille (le chapitre 1 !) — l'Histoire, avec un grand H, commence là. Et cuite (souvent par accident, dans l'incendie d'un palais), l'argile devient presque éternelle : on a retrouvé des centaines de milliers de tablettes.",
    wiki: "https://fr.wikipedia.org/wiki/Écriture_cunéiforme" },
  msg_sceau: { title: "Sceau / signature", emoji: "🔏",
    jauges: { vitesse: 2, portee: 2, capacite: 1, durabilite: 5 },
    fact: "Un petit cylindre de pierre gravé, qu'on roule sur l'argile fraîche : il y laisse une empreinte unique, impossible à imiter. Un sceau ne dit pas grand-chose, mais il prouve QUI a écrit, qui possède, qui s'engage. C'est l'ancêtre direct de la signature, du cachet officiel… et, à sa manière, du certificat et de la signature numérique d'aujourd'hui : comment être sûr de l'identité de celui qui envoie un message ?" },
  msg_hieroglyphes: { title: "Écrire sur le papyrus", emoji: "📜",
    jauges: { vitesse: 3, portee: 2, capacite: 4, durabilite: 2 },
    fact: "En Égypte, on écrit sur du PAPYRUS : les tiges de la plante du Nil, tranchées, pressées, séchées, deviennent une feuille légère qu'on roule et qu'on transporte. Le Nil se change en autoroute à messages. On y trace des hiéroglyphes à l'encre. Mais ce support léger est FRAGILE : sans le climat très sec de l'Égypte, presque rien n'aurait survécu. Et écrire reste le privilège d'une petite élite de scribes — savoir écrire, c'est déjà un pouvoir." },
  msg_alphabet: { title: "Alphabet phénicien", emoji: "🔤",
    jauges: { vitesse: 2, portee: 4, capacite: 3, durabilite: 3 },
    fact: "Les Phéniciens, marchands de toute la Méditerranée, en ont assez des centaines de signes du cunéiforme et des hiéroglyphes. Ils ramènent tout à ~22 signes, un par son : l'ALPHABET. Un code simple s'apprend vite et se diffuse partout — porté non par un empire, mais par le COMMERCE, de port en port. Nos lettres A, B, C en descendent (alpha, bêta…). La leçon : pour toucher le plus de monde, un code simple bat un code savant." },
  /* MESSAGE PERDU */
  msg_effacee: { title: "Tablette effacée", emoji: "🟫", perdu: true,
    jauges: { vitesse: 1, portee: 1, capacite: 3, durabilite: 1 },
    fact: "Tu avais tout écrit sur l'argile… mais tu l'as laissée molle, sous la pluie. En une nuit, elle est redevenue une motte de boue : le message a fondu. Terrible ironie de l'archéologie : les tablettes qui nous sont parvenues sont souvent celles qu'un INCENDIE a cuites par accident. Sans cette chance, elles auraient disparu comme celle-ci. La survie d'un message tient parfois à un pur hasard." },
};

/* ------------------------------------------------------------
   LES INDICES (bouton 💡)
   ------------------------------------------------------------ */
const HINTS = [
  { needs: ["roseaux", "couteau"], out: "calame", text: "Ces roseaux sont creux et droits. Taille-en un en pointe avec le couteau : tu auras un calame." },
  { needs: ["calame", "argile"], out: "tablette_vierge", text: "Aplatis une motte d'argile en galette lisse : une tablette, prête pour ton calame." },
  { needs: ["tablette_vierge", "eau"], out: "msg_effacee", text: "Surtout, ne laisse pas cette tablette molle près de l'eau : elle fondrait…" },
  { needs: ["sceau", "argile"], out: "msg_sceau", text: "Le cylindre gravé du roi : roule-le sur un peu d'argile fraîche, il y laissera sa marque." },
  { needs: ["calame_encre", "feuille_papyrus"], out: "msg_hieroglyphes", text: "Pose ton calame encré sur la feuille de papyrus : tu vas écrire le nom de Snéfrou dans son cartouche !" },
  { needs: ["encre", "calame_nil"], out: "calame_encre", text: "Trempe le calame dans l'encre noire : tu auras un calame encré." },
  { needs: ["suie", "seve"], out: "encre", text: "Mélange la suie noire à la sève collante de l'acacia : tu obtiendras une belle encre." },
  { needs: ["couteau", "papyrus_tiges"], out: "papyrus_coupe", text: "Tranche les tiges de papyrus au couteau, en fines lamelles." },
  { needs: ["papyrus_coupe", "pierre"], out: "feuille_papyrus", text: "Croise les lamelles et presse-les sous la pierre lourde : elles sécheront en une feuille." },
  { needs: ["couteau", "roseau_nil"], out: "calame_nil", text: "Taille un roseau du Nil en pointe fine avec le couteau : un calame de scribe." },
  { needs: ["bol"], out: "suie", text: "Passe le bol au-dessus du feu : son fond se couvrira d'une suie noire (le noir de l'encre)." },
  { needs: ["couteau"], out: "seve", text: "Entaille l'écorce de l'acacia avec le couteau : il pleure une sève collante." },
  { needs: ["signes", "navires"], out: "msg_alphabet", text: "Ces 22 signes si simples : confie-les aux navires marchands, ils les porteront de port en port." },
];

const NEAR_MISS = [
  { pair: ["roseaux", "argile"], line: "Planter des roseaux bruts dans l'argile ? Taille-les d'abord en calame, sinon ça ne marque rien." },
  { pair: ["tablette_vierge", "four"], line: "Cuire une tablette VIERGE ? Tu obtiendrais une jolie brique muette. Écris D'ABORD ton registre dessus." },
  { pair: ["papyrus_tiges", "encre"], line: "Écrire sur des tiges brutes ? L'encre coule entre les fibres. Fabrique d'abord une vraie feuille." },
  { pair: ["papyrus_tiges", "pierre"], line: "Presser les tiges ENTIÈRES ? Ça ne colle pas. Coupe-les d'abord en fines lamelles au couteau." },
  { pair: ["feuille_papyrus", "feu"], line: "Le papyrus près du feu ? Il part en fumée ! C'est toute sa faiblesse : léger et pratique… mais bien fragile." },
  { pair: ["sceau", "four"], line: "Cuire ton sceau de pierre ? Il ne craint pas le feu — mais ce n'est pas là qu'il laisse un message. Roule-le sur l'argile." },
  { pair: ["navires", "argile"], line: "Charger des tonnes d'argile sur un navire ? Il coule. Les Phéniciens, eux, transportent quelque chose de bien plus léger : une idée." },
];

const FAIL_LINES = [
  "Bzzt. Ni Sumer ni l'Égypte n'ont retenu cette idée.",
  "Combinaison rejetée. Un support, un outil : reviens aux bases.",
  "Mes archives cunéiformes restent muettes là-dessus. Réessaie.",
  "Erreur : ces deux-là ne feront pas un message.",
  "Zéro invention détectée. On tente autre chose ?",
];

const INTRO = [
  "Ur, vers −3300 ! Une vraie cité : des murs, un roi, un temple… et surtout des IMPÔTS. Or, devine pourquoi l'écriture est sur le point de naître ici : pas pour la poésie — pour compter le grain et les bêtes.",
  "Le roi Mesannepada t'accueille. Son collecteur, Narâm-Sîn, se noie dans les comptes : impossible de tout retenir de tête. Aide-le à INVENTER une trace qu'on ne puisse pas discuter.",
  "Puis le roi voudra sa signature dans l'argile, et tu descendras le fleuve vers l'Égypte, et la côte des Phéniciens. Suis la carte 🗺 — et recharge-moi une écriture après l'autre.",
];

const ACTIONS = {
  wreck: { mood: "vexe", say: "Oui, encore un atterrissage « créatif ». Note-le sur une tablette si tu veux, mais recharge-moi d'abord." },

  /* LE ROI ET SON COLLECTEUR — `bubble` = leurs paroles, `say` = MARTINE.
     Leurs vraies répliques d'étape sont dans QUETE ; ceci sert de repli. */
  mesannepada: { mood: "neutre",
    bubble: "Je suis Mesannepada, roi d'Ur. Rends-toi utile, étranger, et tu seras traité en ami.",
    say: "Un vrai roi, dans une vraie cité. On est loin de la grotte du chapitre 1 !",
    jeu2Variants: [
      { bubble: "La dernière chronaute a gravé quelque chose ICI, dans MA cité, sur la porte sombre du grenier. Mes gardes n'ont rien osé effacer.",
        say: "Le roi : la marque est DANS LA CITÉ D'UR, sur la porte sombre du grenier." },
      { bubble: "La voyageuse est partie vers le Nil. Elle a gravé un signe sur le mât de la felouque qui longe la rive. Snefrou a laissé faire.",
        say: "Le roi renvoie AU NIL, sur le mât de la felouque." },
      { bubble: "Elle a filé chez les Phéniciens. Mes marchands l'ont vue graver la grande tour au fond de leur port, à l'entrée.",
        say: "Le roi renvoie SUR LA CÔTE PHÉNICIENNE, sur la grande tour au fond du port." },
    ] },
  naram: { mood: "vexe",
    bubble: "Le berger jure vingt bêtes, le prêtre en note dix-huit… et moi, je perds la tête ! Il me faut une trace SÛRE.",
    say: "Et c'est comme ça, pour compter, que va naître l'écriture. Fabrique-lui de quoi noter." },

  /* ouvre le mini-jeu du registre (« 6 bœufs et 3 blés dans l'étable ») */
  tablette: { modal: "tablette" },

  /* Égypte : le pharaon Snéfrou + le mini-jeu du cartouche */
  snefrou: { mood: "neutre",
    bubble: "Je suis Snéfrou, fils du Soleil. Fais-moi un papyrus et de l'encre, et grave mon nom pour l'éternité.",
    say: "Un pharaon qui veut son nom éternel — sur du papyrus, léger mais fragile. Fabrique feuille, calame et encre." },
  cartouche: { modal: "cartouche" },

  /* Nil & Phénicie (inchangés) */
  scribe: { mood: "neutre",
    bubble: "L'argile, c'est solide : ça durera mille ans. Mais le pharaon veut que son ordre parte à l'autre bout du royaume, et ce pauvre âne n'en porte que vingt tablettes ! Il me faudrait un support LÉGER. Quelque chose qui pousse ici, au bord de l'eau…",
    say: "Léger et transportable : le papyrus. Plus pratique que l'argile… mais bien plus fragile. On n'a rien sans rien.",
    jeu2Variants: [
      { bubble: "Une voyageuse m'a laissé une tablette en échange de papyrus. Va la chercher dans la CITÉ D'UR, elle l'a coincée sur la porte sombre du grenier.",
        say: "Le scribe : tablette DANS LA CITÉ D'UR, sur la porte sombre du grenier." },
      { bubble: "La voyageuse a gravé son message ici, sur le mât de la felouque qui descend le Nil. Elle voulait que le fleuve porte son signe.",
        say: "Le scribe : la marque est ICI, sur le mât de la felouque." },
      { bubble: "Al3x1A est repartie vers la Phénicie. Elle a laissé un signe sur la grande tour au fond, à l'entrée du port.",
        say: "Le scribe renvoie SUR LA CÔTE PHÉNICIENNE, sur la grande tour au fond." },
    ] },
  assurbanipal: { mood: "neutre",
    bubble: "Je suis Assurbanipal, roi et grand amasseur de tablettes : j'ai réuni tout le savoir du monde en cunéiforme… sept cents signes ! Mais regarde ces marchands : avec seulement 22 signes, un par son, leurs mousses apprennent à écrire en quelques jours. Apprends ce code simple, toi aussi.",
    say: "Un code SIMPLE se répand plus vite qu'un code savant : tout le secret de l'alphabet. Grave-le sur la tablette pour l'apprendre — puis confie-le aux navires marchands.",
    jeu2Variants: [
      { bubble: "Ma bibliothèque garde tout — même la tablette d'une drôle de voyageuse. Elle est ICI, dans la cité d'Ur, calée sur la porte sombre du grenier.",
        say: "Assurbanipal : tablette DANS LA CITÉ D'UR, sur la porte sombre du grenier." },
      { bubble: "Al3x1A est descendue vers le Nil. Elle a gravé un signe sur le mât de la felouque qui remonte le fleuve. Malin — le vent porte son message.",
        say: "Assurbanipal renvoie AU NIL, sur le mât de la felouque." },
      { bubble: "La voyageuse a filé vers la mer, chez les Phéniciens. Elle a marqué la grande tour au fond de leur port.",
        say: "Assurbanipal renvoie SUR LA CÔTE PHÉNICIENNE, sur la grande tour du port." },
    ] },
  alphabet: { modal: "alphabet" },

  /* ── École du scribe (adjacent à Ur) ── */
  ummia: { mood: "neutre",
    bubble: "Je suis l'ummia, le maître de la maison des tablettes. Ici, les fils des grandes familles copient CENT signes par jour, sous ma canne. Un scribe qui écrit vite vaut plus qu'un guerrier.",
    say: "L'é-dubba : « la maison des tablettes ». Peut-être la plus vieille école du monde ! Écrire, c'est déjà un métier — et un pouvoir." },
  apprenti: { mood: "content",
    bubble: "J'écris depuis l'aube, mes doigts n'en peuvent plus… mais un jour, je serai scribe du roi !",
    say: "Recopier, recopier, recopier… c'est comme ça qu'un signe entre dans la tête. Pas très glamour, mais efficace." },
  mur_exercices: { mood: "vexe",
    bubble: "Ce sont des tablettes RATÉES. Le maître les accroche là pour que tout le monde voie nos fautes !",
    say: "Le mur de la honte du scribe. Preuve rassurante : eux aussi, ils se trompaient." },

  /* ── Chantier de la pyramide (adjacent au Nil) ── */
  contremaitre: { mood: "neutre",
    bubble: "Bienvenue au chantier du roi Snéfrou. Deux mille ouvriers, deux mille bouches à nourrir… Sans mes rouleaux de papyrus pour compter les rations, tout s'effondre en un jour.",
    say: "Une pyramide, c'est de la logistique GÉANTE — comptes des ouvriers, des rations, des blocs. Sans l'écriture, impossible." },
  ouvrier: { mood: "content",
    bubble: "Un bloc de plus… j'en pousse dix par jour ! Pour la gloire du roi et une double ration de pain.",
    say: "Non, les pyramides n'ont pas été bâties par des esclaves : ce sont des ouvriers payés (en pain et en bière), organisés en équipes." },
  pyramide: { mood: "neutre",
    bubble: "La pyramide de Snéfrou n'est pas encore finie. Le sommet monte, pierre après pierre.",
    say: "Snéfrou est le pharaon qui a construit LE PLUS de pyramides. Celle de Meidoum, la Rhomboïdale, la Rouge… il expérimentait." },
  blocs: { mood: "neutre",
    bubble: "Des blocs de calcaire, coupés à la carrière, prêts à monter la rampe.",
    say: "2,3 tonnes en moyenne par bloc. Multiplie par plusieurs millions… l'exploit reste hallucinant." },

  /* ── Port de Byblos (adjacent à la Phénicie) ── */
  charpentier: { mood: "content",
    bubble: "Je taille du cèdre du Liban depuis mon enfance. Les navires que je construis portent nos idées jusqu'en Grèce, en Espagne, jusqu'aux Colonnes d'Hercule.",
    say: "Byblos donnera son nom au grec « biblios » (livre) puis à… Bible ! Ce petit port a beaucoup pesé." },
  squelette_navire: { mood: "neutre",
    bubble: "Le squelette du navire : la quille et les membrures en cèdre. Bientôt il fendra les vagues.",
    say: "Les Phéniciens sont LES marins de l'Antiquité. Pas d'empire militaire — un empire de commerce." },
  rondins: { mood: "neutre",
    bubble: "Du cèdre du Liban. Les Égyptiens en achetaient des cargaisons entières pour leurs temples.",
    say: "Le cèdre pousse haut et droit, résiste à l'eau et sent bon : bois idéal pour un navire." },
  pourpre: { mood: "neutre",
    bubble: "Ces amphores contiennent de la POURPRE, teinture tirée du murex. Une drachme le gramme — plus cher que l'or !",
    say: "« Phénicien » vient d'un mot grec qui veut dire « pourpre ». Toute leur richesse vient de cette teinture." },
  navire_large: { mood: "content",
    bubble: "Regarde ce navire ! Il file vers l'ouest, chargé de pourpre, d'huile, d'idées… et de nos 22 signes.",
    say: "Ce sont ces bateaux qui vont diffuser l'alphabet à toute la Méditerranée. Un code voyage aussi bien qu'une marchandise." },
};

/* ------------------------------------------------------------
   LA QUÊTE — l'histoire d'Ur, étape par étape (façon ch.2).
   perso : qui parle · portrait : gros plan · attend : ce qu'il faut
   accomplir · suite : phrase de MARTINE quand c'est réussi.
   ------------------------------------------------------------ */
const QUETE = [
  { perso: "mesannepada", portrait: "mesannepada", auto: true,
    bubble: "Étranger, te voilà devant Ur, ma cité entre les fleuves. Je suis le roi Mesannepada. Ici, on ne vole ni le grain ni les impôts — et on se rend utile. Va donc voir Narâm-Sîn, mon collecteur : il se noie dans ses comptes. Aide-le, et tu seras des nôtres.",
    say: "Un roi, des murs, des impôts… nous voilà en pleine cité ! Et c'est justement pour compter ces impôts qu'on va inventer l'écriture. File voir le collecteur ›." },

  { perso: "naram", portrait: "naram",
    bubble: "Ah, un peu d'aide ! Écoute mon malheur : je dois noter ce qui entre à l'étable du roi — aujourd'hui, SIX bœufs et TROIS ballots de blé. Mais de mémoire, tout se mélange, et chacun me ment ! Trouve-moi un moyen de garder une trace qu'on ne puisse pas discuter.",
    say: "Voilà l'acte de naissance de l'écriture. Il te faut un calame (taille un roseau au couteau), puis une tablette d'argile — et grave le registre : 6 bœufs, 3 blés.",
    attend: "msg_cuneiforme",
    suite: "Le registre est gravé, cuit dans l'Histoire ! Le roi Mesannepada a eu vent de ton exploit : retourne le voir." },

  { perso: "mesannepada", portrait: "mesannepada",
    bubble: "Magnifique ! Voilà des comptes qu'on ne peut plus contester. Mais pour qu'on sache que ce registre vient de MOI, il y manque ma marque. Prends mon sceau-cylindre et scelle l'argile.",
    say: "Le sceau-cylindre du roi, roulé sur l'argile fraîche : sa signature. L'ancêtre du cachet officiel — et du certificat numérique.",
    attend: "msg_sceau",
    suite: "Ta marque royale est dans l'argile ! Le roi te laisse partir. Descends le fleuve vers l'Égypte : le pharaon Snéfrou t'y attend." },

  { perso: "snefrou", portrait: "snefrou",
    bubble: "Sois le bienvenu en Égypte, voyageur. Je suis Snéfrou, fils du Soleil. Le Nil nous offre une plante magique, le papyrus, sur laquelle on écrit. Rends-moi un service digne d'un roi : fabrique-moi une feuille et de l'encre, et grave mon NOM pour qu'il traverse les millénaires.",
    say: "Un pharaon qui veut son nom éternel ! Fabrique : une feuille de papyrus (couteau puis pierre), un calame (couteau + roseau), et de l'encre (suie du bol au feu + sève d'acacia). Trempe le calame dans l'encre, pose-le sur la feuille — et écris son cartouche.",
    attend: "msg_hieroglyphes",
    suite: "Le nom de Snéfrou file vers l'éternité, tracé sur son papyrus ! Il ne te reste qu'un dernier port : la côte des Phéniciens." },

  { perso: "snefrou", portrait: "snefrou",
    bubble: "Tu as écrit mon nom pour l'éternité — les dieux t'en sauront gré. Ta machine scintillante t'appelle. Vogue vers la côte des Phéniciens : on y invente, dit-on, une écriture si simple qu'un enfant l'apprend. Va, et que Rê t'éclaire.",
    say: "Direction la côte phénicienne : l'ALPHABET nous attend — 22 signes, un par son. Le code le plus simple… et le plus contagieux de l'Histoire." },
];

/* ------------------------------------------------------------
   LA FICHE DU CHAPITRE
   ------------------------------------------------------------ */
const chapter = {
  id: "03-mesopotamie",
  bandeau: "CHAPITRE 3 · −3300",
  date: "−3300",
  epoque: "Mésopotamie",
  emoji: "🏺",

  titre: "MARTINE",
  sousTitre: "Machine À Remonter le Temps Intelligente Néanmoins Excellente",
  presentationTitre: "Chapitre 3 — Naissance de l'écriture.",
  presentation: "Vers −3300 à Ur : l'écriture naît, dans l'argile. Aide le roi Mesannepada et son collecteur d'impôt. Puis descends le fleuve : l'Égypte a ses hiéroglyphes, la côte phénicienne a son alphabet.",
  accroche: "Grave le cunéiforme 🔠 · scelle le sceau du roi 🔏 · trace des hiéroglyphes 📜 · diffuse l'alphabet 🔤",

  finTitre: "SAUT TEMPOREL RÉUSSI",
  finTexte: "« Circuits rechargés à {pct} %. Voilà : l'Histoire commence quand on écrit. Un message peut survivre à son auteur, voyager, être copié. Mais c'est encore réservé aux scribes. Direction l'Antiquité — Grèce, Rome, Pompéi. Que peut-il arriver à une bibliothèque de milliers de rouleaux ? » — MARTINE",

  required: 3,
  startScene: 0,
  destination: "ANTIQUITÉ",
  /* 6 tableaux navigables librement (‹ ›) ; la QUÊTE (portraits + bulles)
     guide l'ordre par les paroles, pas par une flèche verte unique. */

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
  portraits: { mesannepada: PortraitMesannepada, naram: PortraitNaram, snefrou: PortraitSnefrou },
  carte: CarteMesopotamie,
};

export default chapter;
