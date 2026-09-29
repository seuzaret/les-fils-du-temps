/* ============================================================
   CHAPITRE 6 — Temps modernes : l'histoire de Jules le journaliste
   ============================================================
   Fil narratif (guidé, linéaire) :
   1. EN PROVINCE — Jules assiste au vol d'une montgolfière (Annonay,
      1783). Il note tout et envoie son article à Paris par la POSTE.
   2. L'IMPRIMERIE — le rédacteur en chef Sigismond reçoit l'article,
      explique l'ESSOR DE LA PRESSE, et on l'imprime en gazette.
   3. APRÈS LA RÉVOLUTION (1794) — la victoire des révolutionnaires à
      Condé file par le TÉLÉGRAPHE DE CHAPPE. Parmi les badauds,
      Alessandro Volta veut améliorer le système → on l'aide à
      fabriquer la PILE (objet héritage, indispensable au ch.7).
   ============================================================ */

import SceneProvince from "./scenes/SceneProvince.jsx";
import SceneImprimerie from "./scenes/SceneImprimerie.jsx";
import SceneApres from "./scenes/SceneChappe.jsx";
import { PortraitJules, PortraitSigismond, PortraitVolta } from "./scenes/portraits.jsx";
import CarteModerne from "./scenes/CarteModerne.jsx";

/* ------------------------------------------------------------
   LES ÉLÉMENTS
   ------------------------------------------------------------ */
const ITEMS = {
  /* ANACHRONISME */
  ecouteurs: { name: "Écouteurs sans fil", emoji: "🎧", anachronic: true, desc: "Une paire de True Wireless — la première Bluetooth date de 1999, les vrais sans-fil de 2016. À l'époque de Gutenberg, ça ne captera rien !" },

  /* En province */
  plume:        { name: "Plume et encrier", emoji: "🖋️", desc: "De quoi écrire vite et bien. Un journaliste sans sa plume n'est qu'un badaud de plus." },
  montgolfiere: { name: "La montgolfière", emoji: "🎈", support: true, desc: "Un globe de taffetas qui s'élève au-dessus de la foule ébahie. LE spectacle du jour — un scoop pour qui saura le raconter." },
  chevaux:      { name: "Relais de chevaux", emoji: "🐴", support: true, desc: "Au relais de poste, on change de monture pour repartir aussitôt vers Paris. Confie-lui ton pli : il ira de relais en relais." },

  /* L'imprimerie */
  sigismond:    { name: "Sigismond, rédacteur en chef", emoji: "📰", support: true, desc: "Il tient le journal d'une main de fer. Avec un bon article, il en fait une gazette tirée à des centaines d'exemplaires." },

  /* Après la Révolution — la tour de Chappe */
  bras:      { name: "Bras articulés", emoji: "🚦", support: true, desc: "Les grands bras de bois de la tour. En les positionnant selon le code, on forme des signes visibles à des kilomètres." },
  cahier:    { name: "Cahier de codes", emoji: "📓", desc: "Le code secret qui traduit les positions des bras en mots. Sans lui, les signaux ne veulent rien dire." },
  longuevue: { name: "Longue-vue", emoji: "🔭", desc: "Pour lire les signaux de la tour suivante, là-bas sur la colline, et les répéter aussitôt." },
  espion:    { name: "L'espion", emoji: "🕵️", support: true, desc: "Tapi dans les buissons, il observe la tour à la longue-vue et note tout. Un code n'est secret que si personne ne regarde…" },
  zinc_cuivre: { name: "Disques de zinc & cuivre", emoji: "🔘", desc: "Deux métaux différents, en rondelles. Empilés en alternance, il s'y passe quelque chose d'électrique." },
  saumure:     { name: "Chiffons à la saumure", emoji: "🧂", desc: "Des feutres imbibés d'eau salée : la touche finale de l'invention de Volta." },

  /* fabriqués */
  article:     { name: "L'article de Jules", emoji: "📝", desc: "Le récit fébrile du vol de la montgolfière, signé Jules. À envoyer à Paris — et à confier au journal pour qu'il touche tout le pays." },
  signal_code: { name: "Signal codé", emoji: "🔣", desc: "Les bras placés selon le code forment un mot, visible à des kilomètres. Reste à ce que la tour suivante le repère et le répète." },

  /* fabriqué — OBJET HÉRITAGE (voyage au chapitre 7) */
  pile: { name: "Pile de Volta", emoji: "⚡", heirloom: true, desc: "Le tout premier générateur d'électricité continue (1800). Pas un média… mais SANS ELLE, tout le siècle prochain n'existe pas. Garde-la précieusement : elle voyage avec toi." },
};

/* ------------------------------------------------------------
   LES TABLEAUX (linéaire : on suit Jules)
   ------------------------------------------------------------ */
const SCENES = [
  { id: "province",   name: "En province — le vol de la montgolfière", Component: SceneProvince,   nextWhen: ["msg_poste"] },
  { id: "imprimerie", name: "L'imprimerie du journal",                 Component: SceneImprimerie, nextWhen: ["msg_gazettes"] },
  { id: "apres",      name: "Après la Révolution — la victoire de Condé", Component: SceneApres },
];

const WHERE = {
  plume: "en province (le vol de la montgolfière)",
  cahier: "à la tour de Chappe", longuevue: "à la tour de Chappe",
  zinc_cuivre: "à la tour de Chappe", saumure: "à la tour de Chappe",
};

const HIDDEN_BY_FLAG = {};

/* ------------------------------------------------------------
   LES RECETTES
   ------------------------------------------------------------ */
const RECIPES = [
  /* En province : écrire l'article, puis l'envoyer à Paris par la poste */
  { a: "plume", b: "montgolfiere", out: "article",
    line: "Jules griffonne fébrilement : « Ce matin, à Annonay, un immense globe de taffetas s'est élevé dans les airs devant la foule ébahie… » Un scoop ! Reste à le faire parvenir à Paris." },
  { a: "article", b: "chevaux", out: "msg_poste", msg: true },

  /* L'imprimerie : confier l'article à Sigismond → la gazette */
  { a: "article", b: "sigismond", out: "msg_gazettes", msg: true },

  /* Après la Révolution : le télégraphe de Chappe (2 temps).
     1) apporter le CAHIER DE CODES aux bras ouvre le MINI-JEU : placer
        les bras selon le code → on gagne le « signal codé ». */
  { a: "bras", b: "cahier", opens: "chappe" },
  /* 2) la tour suivante LIT le signal à la longue-vue et le relaie. */
  { a: "signal_code", b: "longuevue", out: "msg_chappe", msg: true },
  /* MESSAGE PERDU : le code observé par un espion. */
  { a: "cahier", b: "espion", out: "msg_code", msg: true, perdu: true },
  /* OBJET HÉRITAGE : la pile de Volta. */
  { a: "zinc_cuivre", b: "saumure", out: "pile",
    line: "⚡ LA PILE DE VOLTA ! Disques de zinc et de cuivre, chiffons salés, empilés : un courant électrique constant, pour la première fois. Ce n'est pas un message… mais EMPORTE-LA à tout prix : sans électricité, le siècle prochain n'existe pas." },
];

/* ------------------------------------------------------------
   LES MESSAGES (fiches + jauges 1 à 5)
   ------------------------------------------------------------ */
const MESSAGES = {
  msg_poste: { title: "Envoyer une lettre", emoji: "📯",
    jauges: { vitesse: 3, portee: 3, capacite: 3, durabilite: 2 },
    fact: "Pour faire parvenir son article à Paris, Jules le confie à la POSTE. Depuis Louis XI (1477), des messagers à cheval se relaient de poste en poste : on change de monture toutes les quelques lieues pour ne jamais s'arrêter. Ce n'est pas seulement porter une lettre — c'est un RÉSEAU, avec ses routes, ses relais, ses horaires. Le message va aussi vite que l'infrastructure qui le porte. Une idée toujours vraie : derrière chaque message qui voyage, il y a des tuyaux, des câbles, des antennes qu'on oublie… jusqu'à la panne." },
  msg_gazettes: { title: "Écrire un article de presse", emoji: "📰",
    jauges: { vitesse: 2, portee: 4, capacite: 4, durabilite: 2 },
    fact: "L'article de Jules devient une GAZETTE, tirée à des centaines d'exemplaires. La presse imprimée existe depuis Renaudot et La Gazette (1631), sous l'œil du pouvoir (Richelieu). Mais avec la Révolution, c'est l'EXPLOSION : des centaines de journaux naissent en quelques années, on lit les nouvelles à voix haute dans les cafés, chacun a son opinion imprimée. La presse devient une force politique. Toujours se demander : qui publie cette feuille, qui la finance, et dans quel intérêt ?" },
  msg_chappe: { title: "Envoyer un message par télégraphe optique", emoji: "🚦",
    jauges: { vitesse: 4, portee: 1, capacite: 2, durabilite: 1 },
    fact: "En 1794, Claude Chappe dresse des tours à bras articulés, de colline en colline, à portée de longue-vue. Justement, la première grande nouvelle transmise ainsi fut une VICTOIRE : la reprise de Condé-sur-l'Escaut, annoncée à Paris en moins d'une heure — au lieu de plusieurs jours à cheval ! Une vitesse stupéfiante… mais réservée à l'État : le journaliste Jules, lui, n'y a pas accès. Leçon essentielle : aller vite ne veut pas dire pour tous. Un média peut être ultra-rapide ET fermé." },
  /* MESSAGE PERDU */
  msg_code: { title: "Code intercepté", emoji: "🔓", perdu: true,
    jauges: { vitesse: 3, portee: 1, capacite: 2, durabilite: 1 },
    fact: "La nouvelle filait par le télégraphe, codée, secrète… mais quelqu'un observait la tour à la longue-vue et a noté les signaux. Le code percé, le message se retourne : l'ennemi sait tout. Un message chiffré n'est sûr que tant que son code reste secret. C'est le début d'une longue guerre — le chiffrement contre le décryptage — qui culminera avec des machines comme Enigma. Coder, ce n'est pas cacher : c'est parier que l'autre ne trouvera pas la clé." },
};

/* ------------------------------------------------------------
   LES INDICES (bouton 💡)
   ------------------------------------------------------------ */
const HINTS = [
  { needs: ["plume", "montgolfiere"], out: "article", text: "Le globe s'élève, la foule crie : c'est LE moment. Prends ta plume et écris l'article sur ce vol de montgolfière." },
  { needs: ["article", "chevaux"], out: "msg_poste", text: "Ton article doit filer à Paris : confie-le au relais de chevaux frais, il ira de relais en relais." },
  { needs: ["article", "sigismond"], out: "msg_gazettes", text: "Ton article est arrivé à Paris : porte-le au rédacteur en chef Sigismond, il en fera une gazette." },
  { needs: ["bras", "cahier"], out: "signal_code", text: "Apporte le cahier de codes aux bras du télégraphe : tu pourras alors les placer toi-même selon le code (petit jeu)." },
  { needs: ["signal_code", "longuevue"], out: "msg_chappe", text: "Ton signal est formé, mais il faut que la tour suivante le LISE : donne-lui une longue-vue pour le repérer et le répéter." },
  { needs: ["cahier", "espion"], out: "msg_code", text: "Méfie-toi : un espion guette ta tour. Ton code si secret pourrait bien ne plus l'être…" },
  { needs: ["zinc_cuivre", "saumure"], out: "pile", text: "Aide Volta : empile les disques de zinc et de cuivre en intercalant les chiffons salés → de l'électricité !" },
];

const NEAR_MISS = [
  { pair: ["plume", "chevaux"], line: "Envoyer une plume vierge par la poste ? Écris d'abord ton article — va voir la montgolfière qui s'élève." },
  { pair: ["article", "espion"], line: "Cet espion se moque bien de ton article sur un ballon : c'est le code du télégraphe qu'il guette, plus tard." },
  { pair: ["bras", "longuevue"], line: "Tu agites les bras, et la tour d'en face les VOIT bien à la longue-vue… mais sans code partagé, elle voit des gestes sans comprendre un mot. Il te faut d'abord le cahier de codes." },
  { pair: ["espion", "longuevue"], line: "L'espion adorerait ta longue-vue, mais ce n'est pas ainsi qu'on transmet un message au futur. Cherche autre chose." },
  { pair: ["zinc_cuivre", "longuevue"], line: "Observer des disques de métal à la longue-vue ? Fascinant, mais stérile. Il leur faut de la saumure pour s'électriser." },
];

const FAIL_LINES = [
  "Bzzt. L'époque moderne n'a pas retenu cette idée.",
  "Combinaison rejetée. Un message, un moyen de le porter : reviens aux bases.",
  "Mes archives modernes restent muettes là-dessus. Réessaie.",
  "Erreur : ces deux-là ne feront pas un message.",
  "Zéro invention détectée. On tente autre chose ?",
];

const INTRO = [
  "Temps modernes. On suit JULES, un jeune journaliste plein d'énergie. Ce matin, en province, un événement extraordinaire : une montgolfière va s'élever devant la foule !",
  "Jules veut être le premier à le raconter. Aide-le : écris l'article, envoie-le à Paris par la poste, puis fais-en une gazette avec le rédacteur en chef Sigismond.",
  "Ensuite, cap sur 1794, après la Révolution : une victoire à télégraphier par les tours de Chappe. Et n'oublie pas d'aider un certain Volta à fabriquer sa PILE — sans elle, le siècle prochain sera bien silencieux.",
];

const ACTIONS = {
  wreck: { mood: "vexe", say: "Oui, j'ai froissé un champ en atterrissant. Les paysans ont cru à un second ballon. Recharge-moi avant qu'ils ne vendent des billets." },

  /* Jules, Sigismond, Volta : leurs vraies répliques sont dans QUETE. */
  jules: { mood: "content",
    bubble: "Jules, reporter ! Il se passe toujours quelque chose, et moi je le raconte avant tout le monde.",
    say: "Le journaliste : témoin d'un événement, il le met en mots pour ceux qui n'y étaient pas.",
    jeu2Variants: [
      { bubble: "Une chronaute a laissé une gazette EN PROVINCE, roulée dans la nacelle de la montgolfière. J'ai vu où elle l'a cachée.",
        say: "Jules : gazette EN PROVINCE, dans la nacelle de la montgolfière." },
      { bubble: "La voyageuse a filé à l'imprimerie. Elle a posé sa gazette directement sur la presse, à gauche. Malin.",
        say: "Jules renvoie À L'IMPRIMERIE, sur la presse à gauche." },
      { bubble: "Elle a couru à la tour Chappe après la Révolution. Elle voulait afficher sa gazette sur le mur de la tour, dit-on.",
        say: "Jules renvoie APRÈS LA RÉVOLUTION, sur le mur de la tour Chappe." },
    ] },
  sigismond: { mood: "neutre",
    bubble: "Sigismond, rédacteur en chef. Apporte-moi du solide, du vrai, du vérifié — et j'en tire mille exemplaires avant ce soir.",
    say: "Le rédacteur en chef : c'est lui qui décide ce qu'on imprime… et ce qu'on tait.",
    jeu2Variants: [
      { bubble: "La gazette d'Al3x1A est partie EN PROVINCE, roulée dans la nacelle de la montgolfière. Cherche là.",
        say: "Sigismond : EN PROVINCE, dans la nacelle de la montgolfière." },
      { bubble: "Une chronaute a publié un entrefilet dans ma gazette. Un exemplaire est resté sur la presse, ICI, à gauche.",
        say: "Sigismond : ICI À L'IMPRIMERIE, sur la presse à gauche." },
      { bubble: "La chronaute a filé après la Révolution, à la tour Chappe. Elle a collé son article sur le mur de la tour, malin coup de com.",
        say: "Sigismond renvoie À LA TOUR CHAPPE (après-Rév.), sur le mur." },
    ] },
  volta: { mood: "neutre",
    bubble: "Alessandro Volta, pour vous servir. Ce télégraphe me fascine — mais il lui manque quelque chose : une source d'énergie CONSTANTE. J'y travaille…",
    say: "Le savant : il ne fait pas de médias, mais son invention va TOUT permettre au siècle suivant.",
    jeu2Variants: [
      { bubble: "La chronaute est repartie EN PROVINCE, elle a glissé sa gazette dans la nacelle de la montgolfière avant qu'elle décolle.",
        say: "Volta renvoie EN PROVINCE, dans la nacelle de la montgolfière." },
      { bubble: "Elle a couru à l'imprimerie et a laissé son exemplaire directement sur la presse, à gauche de l'atelier.",
        say: "Volta renvoie À L'IMPRIMERIE, sur la presse à gauche." },
      { bubble: "Elle est venue ICI, juste après la Révolution, pour la tour Chappe. Elle a placardé sa gazette sur le mur de la tour.",
        say: "Volta : ICI, à la tour Chappe, sur le mur." },
    ] },

  /* l'opérateur de la tour (badaud + technicien) et l'espion */
  operateur: { mood: "neutre",
    bubble: "Poste ! La reprise de Condé ! Ordre de télégraphier la nouvelle à Paris À L'INSTANT. Place les bras selon le code, et que la tour d'en face répète… Non, l'ami, pas de place pour ton journal : cette ligne est à l'État seul.",
    say: "Le télégraphe de Chappe : instantané sur des lieues ! Mais réservé à l'État, et codé pour rester secret." },
  espion: { mood: "vexe",
    bubble: "Chut… Je note chaque position des bras. Un code n'est secret que tant que personne ne l'observe. Bientôt, je le percerai.",
    say: "L'espion guette la tour : si on lit le code, le message chiffré se retourne contre son auteur." },
};

/* ------------------------------------------------------------
   LA QUÊTE — Jules (province), Sigismond (imprimerie),
   l'opérateur puis Volta (après la Révolution).
   ------------------------------------------------------------ */
const QUETE = [
  { perso: "jules", portrait: "jules", auto: true,
    bubble: "Vite, vite ! Regarde ce globe de taffetas qui gonfle — il va s'élever dans le ciel ! Personne à Paris ne le croira. Aide-moi : il faut RACONTER ça, et vite le faire partir vers la capitale.",
    say: "Le message : la poste royale, un vrai réseau. À toi de trouver comment fabriquer l'article et le faire filer à Paris.",
    attend: "msg_poste",
    suite: "L'article file vers Paris au galop ! Suis-le : direction l'imprimerie du journal, chez le rédacteur en chef Sigismond." },

  { perso: "sigismond", portrait: "sigismond", auto: true,
    bubble: "Un ballon qui vole ? Voilà qui fera vendre ! Donne-moi cet article, mon garçon. Regarde ma presse : ce que ta plume a écrit une fois, je le tire à des CENTAINES d'exemplaires. Voilà l'essor de la presse — et le pouvoir d'imprimer les esprits.",
    say: "Confie l'article à Sigismond (glisse-le sur lui) : il en fait une gazette diffusée partout. L'essor de la presse.",
    attend: "msg_gazettes",
    suite: "Ta gazette se lit dans tous les cafés ! Le temps passe, la Révolution gronde… Bond jusqu'en 1794 : une victoire à annoncer, et une invention à ne pas manquer." },

  { perso: "operateur", portrait: null,
    bubble: "Ordre de l'État : télégraphier la victoire de Condé à Paris ! Place les bras de la tour selon le cahier de codes, puis que la tour suivante lise le signal à la longue-vue et le répète, de colline en colline.",
    say: "Le télégraphe de Chappe (1794) : bras + cahier de codes → un signal, puis la longue-vue de la tour suivante le relaie. Ultra-rapide… mais réservé à l'État.",
    attend: "msg_chappe",
    suite: "Condé annoncé à Paris en une heure ! Reste une rencontre à ne pas rater : ce curieux badaud qui prend des notes sur l'électricité…" },

  { perso: "volta", portrait: "volta", auto: true,
    bubble: "Ce télégraphe est ingénieux, mais tributaire du beau temps et de la lumière du jour. Il lui faudrait une énergie CONSTANTE… J'ai une idée : des disques de zinc et de cuivre, séparés par des chiffons salés. Aidez-moi à les empiler !",
    say: "Aide Volta : disques de zinc & cuivre + chiffons à la saumure → la PILE. Ce n'est pas un média, mais EMPORTE-LA : le prochain siècle en dépend.",
    attend: "pile",
    suite: "⚡ La pile fonctionne ! Montre-la à Volta (son « ? » brille encore) : il a une idée de tout ce qu'elle va rendre possible." },

  /* CONCLUSION : Volta contemple sa pile et énumère ce qu'elle va permettre */
  { perso: "volta", portrait: "volta",
    bubble: "Incroyable… un courant qui ne s'arrête JAMAIS ! Vous rendez-vous compte ? Avec cette pile, on enverra bientôt des messages par un simple FIL, d'un continent à l'autre en un éclair. On fera voyager la VOIX elle-même le long de ce fil. On gravera les sons pour les réentendre. Et un jour, j'en suis sûr, on éclairera les villes entières sans la moindre flamme. Gardez-la précieusement, voyageur : montrez au futur ce qu'un peu de zinc et de cuivre ont rendu possible.",
    say: "Volta voit juste : sa pile va allumer TOUT le XIXe siècle — télégraphe électrique, téléphone, son enregistré, lumière. Garde-la bien : le prochain saut en a besoin dès l'arrivée.",
    suite: "En route pour le XIXe siècle ! La pile de Volta dans la besace, l'électricité va tout accélérer. Le bouton PARTIR nous y emmène." },
];

/* ------------------------------------------------------------
   LA FICHE DU CHAPITRE
   ------------------------------------------------------------ */
const chapter = {
  id: "06-moderne",
  bandeau: "CHAPITRE 6 · TEMPS MODERNES",
  date: "1783-1794",
  epoque: "Temps modernes",
  emoji: "📰",

  titre: "MARTINE",
  sousTitre: "Machine À Remonter le Temps Intelligente Néanmoins Excellente",
  presentationTitre: "Chapitre 6 — Jules, journaliste des Temps modernes.",
  presentation: "Suis Jules le journaliste : en province, il voit une montgolfière et raconte l'exploit par la poste. À l'imprimerie, Sigismond en fait une gazette. Puis, en 1794, une victoire file par le télégraphe de Chappe. Et Volta a besoin d'aide pour inventer la pile.",
  accroche: "Écris un scoop 📝 · lance-le par la poste 📯 · imprime la gazette 📰 · télégraphie Condé 🚦 · fabrique la pile de Volta ⚡",

  finTitre: "SAUT TEMPOREL RÉUSSI",
  finTexte: "« Circuits rechargés à {pct} %. Le message file plus vite, mais tout reste tenu par le pouvoir : gazette surveillée, télégraphe réservé à l'État. Ça va changer. Direction le XIXe : grâce à ta pile, l'électricité va lancer les messages autour du globe — et on va apprendre à enregistrer le son et l'image. Prêt·e ? » — MARTINE",

  required: 3,
  startScene: 0,
  destination: "XIXe SIÈCLE",
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
  portraits: { jules: PortraitJules, sigismond: PortraitSigismond, volta: PortraitVolta },
  carte: CarteModerne,
};

export default chapter;
