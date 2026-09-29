/* ============================================================
   CHAPITRE 5 — Moyen Âge : du manuscrit à l'imprimerie (1450)
   ============================================================
   2 périodes, façon Mésopotamie (navigation guidée) :
   AVANT l'imprimerie — le château du seigneur Charles Bannister
   (la broderie de ses exploits) puis le monastère du moine Jorge
   (assembler le codex, commander une copie de Galien, et PAYER la
   note salée : un livre coûtait une fortune).
   APRÈS — l'atelier de Gutenberg : la presse qui change tout.
   ============================================================ */

import SceneChateau from "./scenes/SceneChateau.jsx";
import SceneMonastere from "./scenes/SceneScriptorium.jsx";
import SceneMoulin from "./scenes/SceneMoulin.jsx";
import SceneGutenberg from "./scenes/SceneGutenberg.jsx";
import SceneBourg from "./scenes/SceneBourg.jsx";
import SceneCathedrale from "./scenes/SceneCathedrale.jsx";
import SceneFoire from "./scenes/SceneFoire.jsx";
import { PortraitCharles, PortraitJorge, PortraitGutenberg, PortraitPapetier } from "./scenes/portraits.jsx";
import CarteMoyenAge from "./scenes/CarteMoyenAge.jsx";

/* ------------------------------------------------------------
   LES ÉLÉMENTS
   ------------------------------------------------------------ */
const ITEMS = {
  /* ANACHRONISME — clin d'œil à Dr Who */
  tournevis_sonique: { name: "Tournevis sonique", emoji: "🪛", anachronic: true, desc: "Un tube métallique argenté qui bourdonne, avec une pointe cristalline qui s'allume en vert. Il ressemble étrangement à l'outil d'un Docteur voyageur… Il n'ouvrira aucune serrure au scriptorium — laisse-le repartir avec son propriétaire." },

  /* Le château */
  fil_laine: { name: "Fil de laine coloré", emoji: "🧶", desc: "Teint de couleurs vives : rouge, ocre, bleu. De quoi broder tout un récit, image après image." },
  toile_lin: { name: "Toile de lin", emoji: "🟫", desc: "Une longue bande de lin écru, tendue sur le mur : la surface d'un immense récit cousu." },

  /* Le monastère */
  parchemin: { name: "Feuilles de parchemin", emoji: "📃", desc: "Des feuilles de peau prêtes à écrire. Si chères qu'un livre entier vaut un troupeau." },
  aiguille:  { name: "Aiguille & fil à relier", emoji: "🪡", desc: "Pour plier les feuilles en cahiers et les COUDRE : c'est ainsi qu'on fabrique un livre à pages." },
  or_enlumine: { name: "Or et couleurs d'enluminure", emoji: "✨", desc: "De la feuille d'OR fin et des pigments vifs (rouge vermillon, bleu outremer). De quoi orner les lettrines et peindre de petites scènes : c'est ce qui rend un manuscrit précieux… et hors de prix." },
  /* SUPPORTS (support:true) : fixes, on leur APPORTE un objet (cyan). */
  rayon:     { name: "Les rayonnages", emoji: "📚", support: true, desc: "Les étagères du scriptorium, où dorment les précieux manuscrits recopiés à la main." },
  flamme:    { name: "Flamme de la bougie", emoji: "🔥", support: true, desc: "Une bougie vacille près des parchemins. La hantise du copiste : une abbaye entière peut brûler en une nuit." },

  /* L'atelier de Gutenberg */
  plomb_fondu: { name: "Plomb fondu", emoji: "🫗", desc: "Un métal en fusion, coulé dans des moules. Il durcit en un instant en petites lettres identiques." },
  moule:       { name: "Moule à lettres", emoji: "🔠", desc: "Une matrice pour couler des caractères tous semblables — et réutilisables à l'infini." },
  presse:      { name: "Presse à vis", emoji: "🗜️", support: true, desc: "Une grosse vis qui écrase la feuille sur les lettres encrées. La même page, encore et encore." },
  encre:       { name: "Bouteille d'encre", emoji: "🖋️", desc: "Une encre noire et grasse, spéciale imprimerie. On la tamponne sur les lettres SERRÉES dans la presse — jamais sur des caractères en vrac, ça baverait partout." },
  chiffons:    { name: "Vieux chiffons de lin", emoji: "🧵", desc: "Des chiffons de lin et de chanvre usés. En Chine, on sait depuis mille ans qu'en les broyant on obtient… du papier. La recette a voyagé jusqu'ici par les marchands arabes." },
  cuve:        { name: "Cuve du papetier", emoji: "🪣", support: true, desc: "Une cuve pleine d'eau où l'on broie les chiffons en bouillie. On y puise ensuite la pâte avec un tamis pour former les feuilles." },

  /* fabriqués */
  codex:      { name: "Codex (livre à pages)", emoji: "📕", desc: "Des feuilles pliées et cousues : un LIVRE À PAGES qu'on feuillette. Fini le rouleau — on saute à la page voulue. Mais il est encore nu : il faut l'enluminer." },
  codex_enlumine: { name: "Codex enluminé", emoji: "📖", desc: "Le livre orné à la main : lettrines dorées, rinceaux, petites scènes peintes à l'or et aux couleurs vives. Des mois de travail — un objet de luxe. Reste à le ranger précieusement." },
  traite_galien: { name: "Traité de médecine de Galien", emoji: "📗", desc: "La copie payée au prix fort : le remède pour le fils du paysan est écrit là-dedans. Encore faut-il savoir le LIRE…" },
  caracteres: { name: "Caractères mobiles", emoji: "🔡", desc: "Des centaines de petites lettres de plomb, qu'on assemble en mots, puis en pages, puis qu'on démonte pour recommencer." },
  papier:      { name: "Feuille de papier de chiffon", emoji: "📄", desc: "Une feuille tirée de la pâte de chiffons. Bien moins chère que le parchemin (fait de peau) : sans ce papier bon marché, imprimer par milliers ne servirait à rien." },

  /* ÉPHÉMÈRES (disparaissent au changement de tableau) */
  plume_oie:     { name: "Plume d'oie", emoji: "🪶", ephemere: true, desc: "Une plume d'oie ramassée près du poulailler du bourg." },
  bout_bougie:   { name: "Bout de bougie", emoji: "🕯️", ephemere: true, desc: "Un reste de bougie en cire, à moitié consumé." },
  verre_colore:  { name: "Morceau de verre coloré", emoji: "🔴", ephemere: true, desc: "Un éclat de vitrail rouge cassé — chef-d'œuvre miniature perdu." },
  copeau_pierre: { name: "Copeau de pierre", emoji: "🪨", ephemere: true, desc: "Un éclat de calcaire tombé du chapiteau que sculpte le maçon." },
  plume_taillee: { name: "Plume taillée", emoji: "✒️", ephemere: true, desc: "Une plume d'oie taillée en bec : l'outil du copiste, tombé sur le pavé." },
  libelle:       { name: "Libelle imprimé", emoji: "📜", ephemere: true, desc: "Une feuille imprimée bon marché, tombée du colporteur. La nouvelle ancêtre du tract." },
};

/* ------------------------------------------------------------
   LES TABLEAUX (2 périodes ; navigation guidée = linéaire)
   nextWhen : ce qu'il faut avoir fait pour PARTIR au lieu suivant.
   ------------------------------------------------------------ */
const SCENES = [
  { id: "chateau",   name: "Le château de Charles Bannister", Component: SceneChateau,  nextWhen: ["accord"] },
  /* `retour: true` → depuis ce tableau on REVIENT sur ses pas (au château) :
     la flèche d'avancée pointe alors vers la GAUCHE. */
  { id: "monastere", name: "Le monastère du frère Jorge",      Component: SceneMonastere, nextWhen: ["paye"], retour: true },
  /* RETOUR au château (même décor) : rapporter le remède au prêtre. */
  { id: "retour",    name: "Retour au château — le remède",   Component: SceneChateau,  nextWhen: ["remis"], jeu2Hide: true },
  /* Fin du chapitre : l'atelier de Gutenberg ET le moulin à papier, juste
     à côté, se parcourent LIBREMENT par les flèches ‹ › (`free`). Gutenberg
     réclame du papier → on va le fabriquer au moulin (à droite) → on revient. */
  { id: "gutenberg", name: "L'atelier de Gutenberg",           Component: SceneGutenberg, free: true },
  /* 3 tableaux libres supplémentaires — le monde médiéval autour de Mayence */
  { id: "bourg",       name: "La place du bourg",              Component: SceneBourg,      free: true },
  { id: "cathedrale",  name: "Le chantier de la cathédrale",   Component: SceneCathedrale, free: true },
  { id: "foire",       name: "La foire aux livres de Francfort", Component: SceneFoire,    free: true },
  /* le moulin à papier reste EN BOUT DE CHAÎNE : c'est là qu'on va
     chercher le papier pour Gutenberg, à l'extrémité droite. */
  { id: "moulin",    name: "Le moulin à papier",              Component: SceneMoulin,    free: true },
];

const WHERE = {
  fil_laine: "au château", toile_lin: "au château",
  parchemin: "au monastère", aiguille: "au monastère", or_enlumine: "au monastère",
  plomb_fondu: "à l'atelier de Gutenberg", moule: "à l'atelier de Gutenberg", encre: "à l'atelier de Gutenberg", chiffons: "au moulin à papier",
};

const HIDDEN_BY_FLAG = {};

/* ------------------------------------------------------------
   LES RECETTES
   ------------------------------------------------------------ */
const RECIPES = [
  /* Château : la broderie des exploits (façon Bayeux) */
  { a: "fil_laine", b: "toile_lin", out: "msg_broderie", msg: true },

  /* Monastère : relier le codex, l'ENLUMINER, puis le ranger (manuscrit) */
  { a: "parchemin", b: "aiguille", out: "codex",
    line: "Plié en cahiers, cousu, relié : voici le CODEX — un livre à pages. Révolution du format : on l'annote, on l'indexe, on saute où l'on veut. Mais il est encore nu…" },
  { a: "codex", b: "or_enlumine", out: "codex_enlumine",
    line: "Lettrines à l'or fin, rinceaux, miniatures peintes : le codex devient un CODEX ENLUMINÉ. Chaque page est une œuvre — et réclame des mois de travail. Voilà pourquoi un seul livre coûte une fortune." },
  { a: "codex_enlumine", b: "rayon", out: "msg_manuscrit", msg: true, consume: ["codex_enlumine"] },
  /* MESSAGE PERDU : le manuscrit enluminé UNIQUE, des mois de travail,
     part en fumée pour une bougie renversée. */
  { a: "codex_enlumine", b: "flamme", out: "msg_oeuvre", msg: true, perdu: true, consume: ["codex_enlumine"] },

  /* Retour au château : remettre le traité au PRÊTRE (qui sait lire) →
     le remède est préparé. Le geste ouvre la route vers Gutenberg. */
  { a: "traite_galien", b: "pretre", out: "remis", gives: [], consume: ["traite_galien"], flag: "remis",
    line: "Le prêtre ouvre le traité, lit à mi-voix, hoche la tête : « Fièvre chaude… écorce de saule, repos, tisanes. Je sais quoi faire. Avec ça, ce petit a bien plus de chances de s'en sortir. » Le savoir a traversé le pays — mais il fallait quelqu'un pour le LIRE." },

  /* Gutenberg : il faut TROIS choses pour imprimer — des caractères, du
     papier bon marché, et la presse. */
  { a: "plomb_fondu", b: "moule", out: "caracteres",
    line: "Coulé dans le moule, le plomb donne des centaines de lettres identiques : les CARACTÈRES MOBILES. On les assemble, on imprime, on démonte, on recommence." },
  /* le papier de chiffon (au MOULIN À PAPIER, la recette venue de Chine) */
  { a: "chiffons", b: "cuve", out: "papier",
    line: "On jette les vieux chiffons dans la cuve, on les broie en bouillie (le moulin à eau fait tourner les maillets), on puise la pâte au tamis, on presse et on sèche : voilà une feuille de PAPIER. La recette vient de Chine (par les Arabes) — et le papier coûte dix fois moins que le parchemin." },
  /* Gutenberg — les étapes de la PRESSE sont des ÉTATS (drapeaux), pas des
     objets : rien ne traîne dans le sac, la presse « se souvient ».
     1) ranger et serrer les caractères dans la presse… */
  { a: "caracteres", b: "presse", out: "presse_composee", gives: [], flag: "presse_composee", consume: ["caracteres"],
    line: "Tu ranges les lettres en lignes et tu les serres dans la presse : la forme est COMPOSÉE. Mais elle est encore sèche — sans encre, rien ne s'imprimera." },
  /* …2) …seulement ALORS on peut encrer la forme sur la presse… */
  { a: "encre", b: "presse", out: "presse_encree", gives: [], flag: "presse_encree", consume: ["encre"], needsFlag: "presse_composee",
    needMsg: "Encrer une presse vide ? Range et serre d'abord tes caractères dedans (caractères + presse).",
    line: "Tu tamponnes l'encre grasse sur les lettres serrées dans la presse : la forme est ENCRÉE, toute noire, prête à mordre le papier." },
  /* …3) puis poser le PAPIER sur la presse encrée et abaisser la vis ! */
  { a: "papier", b: "presse", out: "msg_imprimerie", msg: true, needsFlag: "presse_encree", consume: ["papier"],
    needMsg: "La forme n'est pas encore encrée ! Tamponne d'abord l'encre sur les caractères de la presse, puis pose la feuille." },
];

/* ------------------------------------------------------------
   LES MESSAGES (fiches + jauges 1 à 5)
   ------------------------------------------------------------ */
const MESSAGES = {
  msg_broderie: { title: "Broder une tapisserie", emoji: "🧵",
    jauges: { vitesse: 1, portee: 3, capacite: 4, durabilite: 4 },
    fact: "Près de 70 mètres de lin brodé de laine, racontant en images la conquête de l'Angleterre par Guillaume en 1066. Une BD géante, lisible même par ceux qui ne lisent pas les mots. Mais cette histoire est celle du VAINQUEUR, commandée par ses proches : c'est de la propagande. La question à se poser devant tout message : qui l'a commandé, et pour dire quoi ? (Étonnamment, cette broderie fragile a survécu près de 1000 ans.)",
    wiki: "https://fr.wikipedia.org/wiki/Tapisserie_de_Bayeux" },
  msg_manuscrit: { title: "Enluminer et écrire un livre", emoji: "📖",
    jauges: { vitesse: 2, portee: 2, capacite: 4, durabilite: 4 },
    fact: "Au scriptorium, des moines copient les livres à la main, un par un, pendant des mois. Ils enluminent les pages : lettrines dorées, miniatures peintes. Le résultat est magnifique… mais chaque livre coûte une fortune et prend une éternité. Le savoir écrit reste rare, cher, et CONTRÔLÉ par l'Église : celui qui copie choisit ce qui sera recopié — donc ce qui survivra." },
  msg_imprimerie: { title: "Imprimer avec Gutenberg sur du papier", emoji: "🖨️",
    jauges: { vitesse: 3, portee: 5, capacite: 4, durabilite: 3 },
    fact: "Vers 1450, à Mayence, Gutenberg assemble des lettres de plomb mobiles et une presse à vis : la même page peut être tirée à des centaines d'exemplaires, vite et à bas prix. Rien de tout cela ne servirait sans un support bon marché : le PAPIER, inventé en Chine et fait de vieux chiffons broyés, dix fois moins cher que le parchemin. C'est LE grand basculement de l'histoire des médias. Les livres se multiplient, leur prix s'effondre, les lecteurs explosent — et les idées ÉCHAPPENT au contrôle (la Réforme se diffuse par l'imprimé). Pour la première fois, un message touche des MASSES. Journaux, tracts, affiches : tout en découle." },
  /* MESSAGE PERDU */
  msg_oeuvre: { title: "Œuvre disparue", emoji: "📕", perdu: true,
    jauges: { vitesse: 1, portee: 1, capacite: 4, durabilite: 1 },
    fact: "Ce livre n'existait qu'en UN seul exemplaire, copié à la main. Une bougie renversée, un incendie d'abbaye… et il disparaît pour toujours, avec tout ce qu'il contenait. Combien d'œuvres se sont ainsi évanouies ? Tant qu'un texte n'existe qu'en un exemplaire, il ne tient qu'à un fil. La bonne nouvelle arrive justement : en multipliant les copies, l'imprimerie va rendre les œuvres bien plus difficiles à faire disparaître." },
};

/* ------------------------------------------------------------
   LA FACTURE du livre de Galien (modifiable par l'enseignant).
   `euroParLt` : ordre de grandeur d'un « livre tournois » en euros
   d'aujourd'hui, pour saisir le prix fou d'un livre médiéval.
   ------------------------------------------------------------ */
const FACTURE = {
  titre: "La note du frère Jorge — une copie du traité de Galien",
  lignes: [
    { poste: "Acquérir le traité de Galien (le trouver, négocier)", lt: 8 },
    { poste: "Parchemin & reliure du codex", lt: 6 },
    { poste: "Copie à la main (un an de travail du moine)", lt: 10 },
    { poste: "Enluminures & lettrines à l'or fin", lt: 5 },
    { poste: "Transport par escorte sûre", lt: 1 },
  ],
  euroParLt: 150,
  note: "30 livres tournois, c'était PLUSIEURS ANNÉES de salaire d'un ouvrier — le prix d'une petite maison. Un seul livre valait un trésor : voilà pourquoi le savoir restait réservé aux riches et à l'Église… jusqu'à l'imprimerie.",
  /* pièces d'époque aux valeurs « pas rondes » : atteindre EXACTEMENT 30
     demande de combiner (ex. 12 + 12 + 4 + 2, ou 12 + 7 + 7 + 4). */
  coins: [12, 7, 4, 2],
};

/* ------------------------------------------------------------
   LES INDICES (bouton 💡)
   ------------------------------------------------------------ */
const HINTS = [
  { needs: ["fil_laine", "toile_lin"], out: "msg_broderie", text: "Du fil de laine coloré, une longue toile de lin : brode les exploits du seigneur, image après image." },
  { needs: ["parchemin", "aiguille"], out: "codex", text: "Ces feuilles de parchemin : plie-les en cahiers et couds-les pour faire un vrai livre à pages." },
  { needs: ["codex", "or_enlumine"], out: "codex_enlumine", text: "Ton codex est encore nu : enlumine-le. De l'or et des couleurs vives sur les lettrines, et de petites scènes peintes." },
  { needs: ["codex_enlumine", "rayon"], out: "msg_manuscrit", text: "Ton manuscrit enluminé est fini : range-le précieusement sur les rayonnages, parmi les autres trésors." },
  { needs: ["codex_enlumine", "flamme"], out: "msg_oeuvre", text: "Attention à cette bougie près de ton manuscrit enluminé unique… un rien, et des mois de travail partent en fumée." },
  { needs: ["plomb_fondu", "moule"], out: "caracteres", text: "Coule le plomb fondu dans le moule à lettres : tu obtiendras des caractères tous identiques." },
  { needs: ["chiffons", "cuve"], out: "papier", text: "Ces vieux chiffons : broie-les dans la cuve du papetier pour en faire une feuille de papier — la recette venue de Chine, bien moins chère que le parchemin." },
  { needs: ["caracteres", "presse"], out: "presse_composee", text: "Range tes caractères en page dans la presse et serre-les : la forme est composée (encore sèche)." },
  { needs: ["encre", "presse"], out: "presse_encree", text: "Tamponne l'encre sur les caractères SERRÉS dans la presse : la forme devient encrée." },
  { needs: ["papier", "presse"], out: "msg_imprimerie", text: "Pose une feuille de papier sur la presse encrée et abaisse la vis : la page s'imprime ! Et on recommence, mille fois." },
];

const NEAR_MISS = [
  { pair: ["parchemin", "rayon"], line: "Ranger une feuille volante sur l'étagère ? Fais-en d'abord un livre : plie, couds, relie." },
  { pair: ["codex", "rayon"], line: "Ranger un codex encore NU parmi les trésors ? Enlumine-le d'abord — or et couleurs — sinon quel manuscrit précieux ?" },
  { pair: ["traite_galien", "paysan"], line: "Le paysan baisse les yeux : « Pardon, mon bon seigneur… je n'ai fait que porter des pierres et labourer. Je ne sais pas lire une seule ligne. Portez-le au prêtre, lui saura. » — un livre ne sert qu'à qui sait le lire." },
  { pair: ["fil_laine", "aiguille"], line: "Broder sans support ? Il te faut une grande toile de lin à couvrir." },
  { pair: ["caracteres", "flamme"], line: "Approcher tes lettres de plomb de la flamme ? Le plomb fond ! Garde-les pour la presse." },
  { pair: ["plomb_fondu", "presse"], line: "Écraser du plomb fondu à la presse ? Coule-le d'abord en LETTRES dans le moule." },
  { pair: ["chiffons", "presse"], line: "Écraser des chiffons secs à la presse ne fait pas du papier : il faut d'abord les BROYER dans l'eau de la cuve." },
  { pair: ["caracteres", "papier"], line: "Poser la feuille sur des lettres nues ? Sans les encrer, rien ne s'imprime : serre-les et encre-les d'abord dans la presse." },
  { pair: ["encre", "caracteres"], line: "De l'encre sur des lettres en vrac ? Ça bave partout. Range-les d'abord dans la presse — on n'encre la forme QUE sur la presse." },
];

const FAIL_LINES = [
  "Bzzt. Le Moyen Âge n'a pas retenu cette idée.",
  "Combinaison rejetée. Un support, un outil : reviens aux bases.",
  "Mes archives médiévales restent muettes là-dessus. Réessaie.",
  "Erreur : ces deux-là ne feront pas un message.",
  "Zéro invention détectée. On tente autre chose ?",
];

const INTRO = [
  "Le Moyen Âge, vers 1450. Dehors, la peste rôde et vide des villages entiers ; et le peu qu'on sait pour soigner dort dans des livres qu'un seul moine recopie… à la bougie.",
  "Le seigneur Charles Bannister t'accueille dans son château : aide-le à gérer son domaine. Il veut d'abord qu'on brode ses exploits. Puis, un paysan supplie qu'on soigne son fils — et le remède est dans un livre, au monastère.",
  "Tu iras chez le frère Jorge assembler un codex et PAYER la copie de Galien (accroche-toi, c'est cher !). Alors seulement s'ouvrira la grande nouveauté : l'imprimerie. Trois traces me suffisent pour repartir.",
];

const ACTIONS = {
  wreck: { mood: "vexe", say: "Oui, j'ai atterri dans la cour du château. Les gardes ont cru à un dragon de fer. Recharge-moi avant qu'ils ne sortent les lances." },

  /* Charles Bannister & le frère Jorge : leurs vraies répliques sont dans QUETE. */
  charles: { mood: "neutre",
    bubble: "Je suis Charles Bannister, seigneur de ce château. Sers-moi bien, l'étranger, et tu seras logé et nourri.",
    say: "Un seigneur médiéval : il tient la terre, la justice, et veut qu'on chante sa gloire.",
    jeu2Variants: [
      { bubble: "Une dame étrange a laissé une enluminure ICI, dans MON CHÂTEAU. Regarde derrière la tenture au-dessus de mon trône.",
        say: "Charles : ICI au CHÂTEAU, derrière la tenture au-dessus du trône." },
      { bubble: "La chronaute est allée s'enfermer au monastère du frère Jorge. Elle a glissé une enluminure sur les manuscrits des rayonnages à gauche.",
        say: "Charles renvoie AU MONASTÈRE, sur les manuscrits des rayonnages à gauche." },
      { bubble: "Elle est descendue sur la place du bourg. Elle a gravé quelque chose sur la margelle du puits au centre.",
        say: "Charles renvoie SUR LA PLACE DU BOURG, sur le puits au centre." },
    ] },
  jorge: { mood: "neutre",
    bubble: "Bienvenue au monastère, voyageur. Ici, nous gardons et recopions le savoir du monde, une page à la fois.",
    say: "Le moine copiste : la mémoire du monde tient sur ses épaules… et sur une seule bougie.",
    jeu2Variants: [
      { bubble: "La voyageuse a laissé sa note au château de Charles, derrière la tenture au-dessus du trône. Va voir là-bas.",
        say: "Jorge renvoie AU CHÂTEAU, derrière la tenture du trône." },
      { bubble: "Elle a laissé son enluminure ICI, sur un manuscrit des rayonnages à gauche. Regarde bien, tout en haut.",
        say: "Jorge : ICI au MONASTÈRE, sur les manuscrits des rayonnages à gauche." },
      { bubble: "Elle est descendue sur la place du bourg, la voyageuse. Elle a gravé son signe sur la margelle du puits au centre.",
        say: "Jorge renvoie SUR LA PLACE DU BOURG, sur le puits au centre." },
    ] },
  gutenberg: { mood: "neutre",
    bubble: "Un moine met un an à copier un livre, et y glisse des fautes. Moi, j'en veux MILLE, tous pareils ! Il me faut des lettres SÉPARÉES, qu'on range et qu'on réutilise.",
    say: "Ça, c'est LA grande idée : les caractères mobiles. Fonds-lui des lettres de plomb, et donne-lui une presse.",
    jeu2Variants: [
      { bubble: "La chronaute a mis un exemplaire chez le seigneur Charles, dans son château, derrière la tenture du trône. Malin.",
        say: "Gutenberg renvoie AU CHÂTEAU, derrière la tenture du trône." },
      { bubble: "Elle a préféré cacher son exemplaire au monastère, sur les manuscrits des rayonnages à gauche. Le frère Jorge ne l'a pas remarqué.",
        say: "Gutenberg renvoie AU MONASTÈRE, sur les manuscrits des rayonnages à gauche." },
      { bubble: "Elle a fait imprimer sa note, puis l'a collée sur la margelle du puits, place du bourg. Un vrai coup médiatique !",
        say: "Gutenberg renvoie SUR LA PLACE DU BOURG, sur le puits au centre." },
    ] },

  /* Le moulin à papier : le papetier (guide) et le chiffonnier (ramasseur). */
  papetier: { mood: "neutre",
    bubble: "Bienvenue à mon moulin ! Tu viens pour du papier ? Prends de vieux chiffons au chiffonnier, jette-les dans ma cuve : la roue à eau les broie en pâte, je puise au tamis, je presse, je sèche. Une recette venue de Chine — dix fois moins cher que le parchemin !",
    say: "Le papetier : prends les chiffons du chiffonnier, broie-les dans sa cuve → une feuille de PAPIER. Rapporte-la à Gutenberg (‹). Sans ce papier bon marché, l'imprimerie n'imprimerait que pour les riches." },
  chiffonnier: { mood: "content",
    bubble: "« Chiffons ! Chiffons à vendre ! Vieux linge, vieilles hardes ! » Tiens, prends ce que tu veux dans ma hotte, l'ami — le papetier m'en débarrasse à bon prix.",
    say: "Le chiffonnier parcourt les rues en criant, pour ramasser le vieux linge : c'est la matière première du papier. Prends ses chiffons." },

  /* le paysan et le prêtre, devant le trône (contexte de la quête de Galien).
     Ces répliques par DÉFAUT servent HORS séquence de quête ; en cours de
     quête, ce sont les bulles de QUETE qui priment. Le prêtre, tant qu'on
     n'a pas d'abord écouté le paysan, ne fait qu'accueillir poliment. */
  paysan: { mood: "vexe",
    bubble: "Pitié ! Mon fils brûle de fièvre. Le médecin est parti soigner les pestiférés… Où trouver un remède ?",
    say: "La peste vide les villages, et les médecins manquent. Le savoir qui sauve est enfermé dans de rares livres." },
  pretre: { mood: "neutre",
    bubble: "Bienvenue en ce château, étranger. La paix soit avec toi.",
    say: "Le prêtre t'accueille poliment. Écoute d'abord ce paysan agenouillé devant le trône : il a une requête pressante." },

  /* ouvre la FACTURE + le jeu de paiement (quand le codex/manuscrit est prêt) */
  facture: { modal: "facture" },

  /* ── LA PLACE DU BOURG ── */
  crieur: { mood: "content",
    bubble: "Oyez, oyez, bonnes gens ! Par ordre du seigneur, les fours banaux seront ouverts trois jours pour la Saint-Michel ! Et le colporteur passe demain à la halle !",
    say: "Le crieur public : l'ANCÊTRE DE LA RADIO. Sur la place, à voix forte, il diffuse les décrets, les ventes, les nouvelles — pour les 95 % qui ne lisent pas." },
  moine_mendiant: { mood: "neutre",
    bubble: "Une piécette pour l'amour de Dieu, mon frère ? Je prie pour ton âme.",
    say: "Un moine mendiant. Les ordres mendiants (franciscains, dominicains) prêchent aussi en public : l'Église est un des grands médias du Moyen Âge." },
  puits: { mood: "content",
    bubble: "Le puits de la place : on y vient chercher l'eau… et surtout jaser ! Toutes les rumeurs du bourg passent par ici.",
    say: "L'endroit-clé du village. Nouvelles, ragots, mariages… la vraie information circule à l'oral, autour du puits." },
  charrette: { mood: "neutre",
    bubble: "Une charrette de foin pour l'écurie du seigneur. Tirée par un cheval, guidée par le paysan.",
    say: "Les charrettes n'apportent pas que de la marchandise : elles apportent les NOUVELLES d'un village à l'autre. Un réseau lent, mais dense." },
  taverne: { mood: "content",
    bubble: "L'auberge « Au Cochon d'Or ». On y boit, on y mange, on y raconte — et parfois on y complote.",
    say: "La taverne : lieu de sociabilité, de rumeur et parfois de sédition. Les autorités s'en méfient depuis toujours." },
  apothicaire: { mood: "neutre",
    bubble: "L'apothicaire vend onguents, tisanes, et parfois du bon parchemin. Regarde l'enseigne : un mortier et son pilon.",
    say: "Les enseignes de métier : un DESSIN parle à tous, même aux illettrés. Ancêtre direct du pictogramme et du logo." },
  clocher: { mood: "neutre",
    bubble: "Le clocher de l'église : ses cloches sonnent l'angélus, la mort, l'alarme, la messe. Toute la vie du bourg y est rythmée.",
    say: "Les CLOCHES : un des plus vieux médias sonores. Un code (un coup = un homme mort, deux = une femme, sonnerie rapide = incendie). Une info à des kilomètres, sans mots." },

  /* ── LE CHANTIER DE LA CATHÉDRALE ── */
  verrier: { mood: "content",
    bubble: "Trois ans que je taille et j'assemble ces verres colorés. Le peuple ne sait pas lire ? Alors je vais leur RACONTER la Bible en images de lumière.",
    say: "Le VITRAIL : la bande dessinée pour les 95 % d'illettrés. Le maître verrier est un raconteur d'histoires, avec le soleil comme rétro-projecteur." },
  rose: { mood: "content",
    bubble: "La GRANDE ROSE : mon plus grand ouvrage. Quand le soleil la traverse, elle projette des couleurs sur tout le sol de la nef.",
    say: "Une rose de vitrail : bijou technique ET théologique. Le message : la lumière divine qui inonde le monde. Média sensoriel absolu." },
  vitrail: { mood: "neutre",
    bubble: "Chaque panneau raconte une scène de la Bible pour ceux qui ne savent pas lire.",
    say: "La « Biblia pauperum » (la Bible des pauvres) : mêmes histoires que le texte, mais racontées en IMAGES. Séquentielles, comme une BD." },
  tympan: { mood: "neutre",
    bubble: "Passé cette porte, tu entres dans le royaume de Dieu.",
    say: "Le tympan : premier « poster » d'entrée. Signalétique religieuse — message clair, tout de suite lisible." },
  echafaudage: { mood: "neutre",
    bubble: "Cinquante ans qu'on bâtit cette cathédrale. Nous mourrons avant qu'elle soit finie — mais nos petits-enfants la verront debout.",
    say: "Les cathédrales sont des chantiers d'un siècle : générations d'ouvriers, quantité colossale de moyens. Le plus grand message monumental de l'époque." },

  /* ── LA FOIRE AUX LIVRES DE FRANCFORT ── */
  libraire: { mood: "content",
    bubble: "Approche, bon ami ! Grâce à Herr Gutenberg, je vends aujourd'hui des livres qui coûtaient autrefois un troupeau ! Latin, allemand, romans de chevalerie, tout est là !",
    say: "La Buchmesse de Francfort naît vers 1480 : première grande FOIRE AU LIVRE du monde. Les livres imprimés circulent enfin, à un prix accessible aux marchands." },
  client_livre: { mood: "content",
    bubble: "Un livre de médecine à ce prix ? Je le prends ! Ma femme sait lire, elle saura le déchiffrer.",
    say: "L'imprimerie fait chuter le prix du livre de x100 ou plus. Une nouvelle classe (marchands, artisans) peut enfin lire chez elle." },
  colporteur: { mood: "content",
    bubble: "Libelles ! Feuilles volantes ! Une bataille en Italie, un miracle en Bavière, un scandale à Rome ! Six deniers seulement !",
    say: "Le COLPORTEUR : distributeur de la presse populaire naissante. Feuilles bon marché, nouvelles récentes, rumeurs. Ancêtre direct du kiosque et du buzz." },
  livres_etal: { mood: "neutre",
    bubble: "Des LIVRES IMPRIMÉS reliés à la mode nouvelle : cuir, tranche marquée, page de titre. On les feuillette, on choisit, on emporte.",
    say: "Reliure moderne, page de titre, format standard : l'objet-livre prend sa forme définitive vers 1500. Une révolution technique invisible mais énorme." },
  banderole: { mood: "neutre",
    bubble: "« Buchmesse MCDLXXX » = Foire au livre de 1480. Depuis Gutenberg, on en organise chaque printemps et chaque automne.",
    say: "La banderole = affiche publicitaire, autre nouvelle habitude. Communiquer sur l'événement, attirer la foule : le marketing culturel existait déjà." },
  moulin_vent: { mood: "neutre",
    bubble: "Un moulin à vent — pour broyer le grain OU les chiffons du papetier. L'imprimerie a besoin de beaucoup, beaucoup de papier.",
    say: "Sans moulins pour broyer les chiffons en masse, pas d'imprimerie à grande échelle. Toute révolution médiatique repose aussi sur des révolutions matérielles." },
};

/* ------------------------------------------------------------
   LA QUÊTE — Charles au château, Jorge au monastère.
   ------------------------------------------------------------ */
const QUETE = [
  { perso: "charles", portrait: "charles", auto: true,
    bubble: "Approche, l'étranger ! Je suis Charles Bannister, seigneur de ces terres. Aide-moi à tenir mon château et tu seras des nôtres. Pour commencer : je veux que mes exploits guerriers soient racontés à tous, sur une grande tenture — que chacun sache qui je suis, même ceux qui ne lisent pas.",
    say: "Un seigneur qui veut sa gloire en images : la BD géante de l'époque, façon broderie de Bayeux. Fil de laine coloré + la grande toile de lin, au fond de la salle.",
    attend: "msg_broderie",
    suite: "Superbe tenture ! Maintenant, écoute ce paysan agenouillé devant mon trône — il te supplie." },

  /* le paysan supplie (clic → on avance) */
  { perso: "paysan",
    bubble: "Pitié, noble étranger ! Mon petit garçon brûle de fièvre, la peste le prend. Notre médecin est parti soigner d'autres malades… Sans remède, il va mourir. Aide-moi, je t'en supplie !",
    say: "Un enfant malade, aucun médecin disponible. Le remède existe pourtant — écrit dans un livre. Va voir ce que le prêtre en sait.",
    suite: "Écoute à présent le prêtre : lui sait où trouver le savoir des médecins." },

  /* le prêtre oriente vers Galien (seulement à SON tour ; hors tour, il ne
     fait qu'accueillir — voir ACTIONS.pretre) */
  { perso: "pretre",
    bubble: "Le savoir des médecins anciens — Galien, Hippocrate — dort dans les livres des monastères. Le seigneur en a justement commandé une copie au frère Jorge. Il faut aller la chercher… mais un tel livre coûte une fortune : il faudra la bourse du seigneur.",
    say: "Le remède est écrit noir sur blanc dans un traité de Galien, au monastère. Reste à obtenir de quoi le payer : retourne voir le seigneur.",
    suite: "Retourne voir le seigneur Bannister : c'est lui qui décide, et lui qui tient la bourse." },

  /* le seigneur donne son accord ET la bourse → drapeau « accord » qui
     ouvre le départ vers le monastère */
  { perso: "charles", portrait: "charles",
    bubble: "Ainsi mon prêtre t'a tout dit. Ce paysan est des miens, je ne le laisserai pas perdre son fils. Voici ma bourse — trente livres tournois, une petite fortune, mais la vie d'un enfant n'a pas de prix. Va au monastère du frère Jorge, rapporte la copie de Galien, et paie-le rubis sur l'ongle.",
    say: "Le seigneur te confie sa bourse : c'est LUI qui finance le livre. Direction le monastère du frère Jorge (le signal t'y mène) — tu paieras là-bas.",
    grant: "accord",
    suite: "Tu as l'accord et l'or du seigneur ! File au monastère du frère Jorge chercher — et payer — le traité de Galien." },

  { perso: "jorge", portrait: "jorge",
    bubble: "Bienvenue au monastère, voyageur. Tu viens pour la commande du seigneur ? Elle sera prête — mais d'abord, aide-moi à fabriquer ce livre : plie et couds les feuilles de parchemin, ENLUMINE-le à l'or et aux couleurs, puis range-le aux rayonnages. On garde ainsi le savoir du monde, une page à la fois.",
    say: "Trois gestes du copiste : (1) parchemin + aiguille → codex, (2) codex + or et couleurs → codex enluminé, (3) range-le aux rayonnages → le manuscrit est sauvé. Ensuite, Jorge te présentera sa note…",
    attend: "msg_manuscrit",
    suite: "Beau travail ! Le frère Jorge va maintenant chercher ta commande — et te présenter l'addition. Ouvre la NOTE DE FRAIS (elle brille près du pupitre) et règle-la." },

  { perso: "jorge", portrait: null,
    bubble: "Voici ta copie du traité de Galien, recopiée et enluminée à la main pendant près d'un an. Mais un livre ne se donne pas, voyageur : règle d'abord ma note. Tu verras ce que coûte le savoir, en ce temps-là.",
    say: "La note de frais brille près du pupitre : ouvre-la, découvre le prix FOU d'un livre médiéval, et paie la somme exacte avec les pièces.",
    attend: "paye",
    suite: "Payé ! Tu empoches le traité de Galien. Retourne au château (le signal t'y ramène) et remets-le au PRÊTRE : lui saura le lire et préparer le remède." },

  /* de retour au château : remettre le traité à quelqu'un qui sait LIRE */
  { perso: "pretre",
    bubble: "Tu rapportes le traité de Galien ? Confie-le-moi, mon enfant : je sais lire le latin des médecins. Je vais préparer le remède pour ce petit — encore fallait-il que le livre arrive… et qu'un lettré le lise.",
    say: "Remets le traité au PRÊTRE : glisse-le sur lui. (Essaie sur le paysan si tu veux : il t'avouera qu'il ne sait pas lire — un livre ne sert qu'à qui sait le déchiffrer.)",
    attend: "remis",
    suite: "L'enfant a maintenant bien plus de chances de s'en sortir ! Un livre, ET quelqu'un pour le lire : voilà comment le savoir agit. Mais tout ça reste lent et rare tant qu'on copie à la main… Direction l'atelier d'un certain Gutenberg, la machine qui va TOUT changer." },

  { perso: "gutenberg", portrait: "gutenberg",
    bubble: "Bienvenue dans mon atelier ! Un moine met un an à copier un livre. Moi, j'en veux MILLE, tous pareils. Il me faut des lettres de plomb, une presse… et surtout du PAPIER, bien moins cher que le parchemin. Je n'en ai plus : va au moulin à papier, juste à côté (la flèche › t'y mène), rapporte-m'en une feuille — et on imprime !",
    say: "Gutenberg réclame du PAPIER. Va au moulin à papier (flèche › à droite) le fabriquer, puis reviens (‹) et imprime : (1) plomb + moule → caractères, (2) caractères + presse → forme composée, (3) encre + presse → forme encrée, (4) papier + presse → la page ! Le grand basculement !",
    attend: "msg_imprimerie",
    suite: "Mille exemplaires ! Le savoir échappe enfin au monastère et aux riches. Ma jauge déborde : le bouton PARTIR nous emmène aux Temps modernes." },
];

/* ------------------------------------------------------------
   LA FICHE DU CHAPITRE
   ------------------------------------------------------------ */
const chapter = {
  id: "05-moyen-age",
  bandeau: "CHAPITRE 5 · 1450",
  date: "1450",
  epoque: "Moyen Âge",
  emoji: "📖",

  titre: "MARTINE",
  sousTitre: "Machine À Remonter le Temps Intelligente Néanmoins Excellente",
  presentationTitre: "Chapitre 5 — Du manuscrit à l'imprimerie.",
  presentation: "Vers 1450 : la peste rôde, les remèdes dorment dans de rares livres. Au monastère de frère Jorge, assemble un codex et fais copier un traité — c'est hors de prix. Puis découvre la machine qui va tout changer : l'imprimerie de Gutenberg.",
  accroche: "Brode Bayeux 🧵 · relie un codex 📕 · paie une fortune 💰 · imprime avec Gutenberg 🖨️",

  finTitre: "SAUT TEMPOREL RÉUSSI",
  finTexte: "« Circuits rechargés à {pct} %. Avant Gutenberg, un livre valait une petite maison. Après, il se copie par milliers. Regarde ta frise : ça va plus loin, il y en a plus… mais ça dure de moins en moins. Retiens ça. Direction les Temps modernes — presse, poste, télégraphe. » — MARTINE",

  required: 3,
  startScene: 0,
  destination: "TEMPS MODERNES",
  linear: true,   // 2 périodes guidées : on avance au signal de MARTINE

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
  portraits: { charles: PortraitCharles, jorge: PortraitJorge, gutenberg: PortraitGutenberg, papetier: PortraitPapetier },
  facture: FACTURE,
  carte: CarteMoyenAge,
};

export default chapter;
