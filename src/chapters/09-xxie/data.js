/* ============================================================
   CHAPITRE 9 — Le XXIe siècle : tout dans la poche (aujourd'hui)
   ============================================================
   2 tableaux en ÉNIGMES : la chambre d'ado et le datacenter.
   Idée forte : tout converge dans un seul objet… et le support
   semble disparaître (streaming, cloud). En réalité il n'a pas
   disparu : il est CHEZ QUELQU'UN D'AUTRE.

   DEUX messages perdus, les plus importants du jeu :
   - la DISQUETTE héritée du chapitre 8 → illisible en 30 ans ;
   - les photos d'enfance → le service ferme, tout disparaît.
   Voir docs/AJOUTER-UN-CHAPITRE.md.
   ============================================================ */

import SceneChambre from "./scenes/SceneChambre.jsx";
import SceneCanapeSoir from "./scenes/SceneCanapeSoir.jsx";
import SceneDatacenter from "./scenes/SceneDatacenter.jsx";
import CarteXXIe from "./scenes/CarteXXIe.jsx";

/* ------------------------------------------------------------
   LES ÉLÉMENTS
   ------------------------------------------------------------ */
const ITEMS = {
  /* ANACHRONISME — venu du FUTUR cette fois ! Un agent du temps de 2140
     l'a fait tomber lors d'un saut. Objet inventé, années 2140. */
  neurolien: { name: "Neuro-Lien™", emoji: "🧠", anachronic: true, desc: "Un petit disque translucide bio-imprimé qui se pose sur la tempe : le NEURO-LIEN™ (breveté en 2141). Il transmet directement les pensées sur le web. En 2025 il n'existe pas encore — et ça vaut mieux !" },

  /* HÉRITAGE du chapitre 8 — elle voyage dans la besace */
  disquette: { name: "Disquette", emoji: "💾", heirloom: true, desc: "Ta disquette des années 80, rapportée du chapitre précédent. Il y a un fichier dessus. Elle a 30 ans à peine… ça devrait aller, non ?" },

  /* T1 — la chambre d'ado */
  memoire_flash:  { name: "Mémoire flash", emoji: "🔲", desc: "Une puce grosse comme un ongle. Elle retient des données toute seule : sans bande, sans disque qui tourne, sans électricité pour tenir." },
  poche:          { name: "Poche", emoji: "👖", desc: "La poche de ton jean. Minuscule. Le défi : y faire tenir plus de livres que dans la bibliothèque d'Alexandrie." },
  ecran_tactile:  { name: "Écran tactile", emoji: "📱", desc: "Une vitre qui sent ton doigt. Plus de boutons, plus de clavier : l'objet devient tout ce qu'on veut afficher dessus." },
  /* support: true → fixe, ne va pas au sac : on lui apporte un objet
     (le moteur l'affiche en cyan). */
  reseau_mobile:  { name: "Réseau mobile", emoji: "📶", support: true, desc: "L'antenne-relais, là, derrière la fenêtre. Elle te relie au monde entier, partout, tout le temps." },
  pc_moderne:     { name: "PC moderne", emoji: "💻", support: true, desc: "Ton ordinateur d'aujourd'hui. Fin, rapide, puissant. Et… tiens, il n'a aucun lecteur de disquette." },
  photos_enfance: { name: "Photos d'enfance", emoji: "🖼️", desc: "Toutes tes photos depuis que tu es petit. Elles ne sont pas ici : elles sont « dans le nuage ». C'est-à-dire… ailleurs." },

  /* T2 — le datacenter */
  serveurs:      { name: "Serveurs lointains", emoji: "🗄️", support: true, desc: "Des milliers de machines qui tournent jour et nuit, dans un hangar réfrigéré, à des centaines de kilomètres de chez toi." },
  abonnement:    { name: "Abonnement", emoji: "💳", desc: "Tu ne possèdes rien : tu paies pour ACCÉDER. Tant que tu paies, tout est là. Et si tu arrêtes ? Et si c'est EUX qui arrêtent ?" },
  service_ferme: { name: "Service fermé", emoji: "⛔", support: true, desc: "Un écriteau : « Ce service ferme le 31 décembre. Merci de votre fidélité. » Et tes photos, alors ?" },
};

/* ------------------------------------------------------------
   LES TABLEAUX
   ------------------------------------------------------------ */
const SCENES = [
  { id: "chambre",    name: "Ta chambre",     Component: SceneChambre },
  { id: "canape",     name: "Canapé du soir", Component: SceneCanapeSoir },
  { id: "datacenter", name: "Le datacenter",  Component: SceneDatacenter },
];

const WHERE = {
  disquette: "dans ta besace — la disquette du chapitre 8 (si tu ne l'as plus, rejoue le chapitre 8 et ramasse-la au labo)",
  memoire_flash: "dans ta chambre", poche: "dans ta chambre", ecran_tactile: "dans ta chambre",
  photos_enfance: "dans ta chambre",
  abonnement: "au datacenter",
};

const HIDDEN_BY_FLAG = {};

/* ------------------------------------------------------------
   LES RECETTES
   ------------------------------------------------------------ */
const RECIPES = [
  { a: "memoire_flash", b: "poche", out: "msg_usb", msg: true },
  { a: "ecran_tactile", b: "reseau_mobile", out: "msg_smartphone", msg: true },
  { a: "serveurs", b: "abonnement", out: "msg_streaming", msg: true },
  /* MESSAGE PERDU 1 — LE clou du jeu : la disquette du chapitre 8, 30 ans après. */
  { a: "disquette", b: "pc_moderne", out: "msg_disquette", msg: true, perdu: true },
  /* MESSAGE PERDU 2 — la mémoire confiée à quelqu'un d'autre. */
  { a: "photos_enfance", b: "service_ferme", out: "msg_compte", msg: true, perdu: true },
];

/* ------------------------------------------------------------
   LES MESSAGES (fiches + jauges 1 à 5)
   ------------------------------------------------------------ */
const MESSAGES = {
  msg_usb: { title: "Enregistrer un message sur clé USB", emoji: "🔌",
    jauges: { vitesse: 2, portee: 2, capacite: 5, durabilite: 2 },
    fact: "Une puce grosse comme un ongle, et voilà plus de livres que n'en contenait toute la bibliothèque d'Alexandrie — dans ta poche. En un siècle, la quantité d'informations qu'on peut ranger dans un objet a été multipliée par des milliards. Mais attention à la blague : une clé USB tient environ 10 ans avant de devenir illisible. La bibliothèque d'Alexandrie, elle, a tenu des siècles. Le plus petit et le plus puissant n'est pas le plus solide." },
  msg_smartphone: { title: "Enregistrer un vocal sur une messagerie en ligne", emoji: "📱",
    jauges: { vitesse: 5, portee: 5, capacite: 4, durabilite: 2 },
    fact: "Un écran tactile, le réseau mobile, et TOUS les médias de ton voyage tiennent dans un seul objet : l'appareil photo, le téléphone, la télé, la radio, le journal, le courrier, la bibliothèque, le cinéma. Tout ce que tu as fabriqué depuis Lascaux est là, dans ta main. Mais pose-toi une question : cet objet est fabriqué pour capter ton attention le plus longtemps possible. Alors à qui profite ton temps d'écran ?" },
  msg_streaming: { title: "Enregistrer un message en direct sur le web", emoji: "☁️",
    jauges: { vitesse: 5, portee: 5, capacite: 5, durabilite: 1 },
    fact: "Musique, films, photos, devoirs : plus besoin de support ! Enfin… c'est ce qu'on dit. En vrai le support existe toujours, mais il est CHEZ QUELQU'UN D'AUTRE, dans un hangar rempli de serveurs. Tu ne possèdes plus : tu accèdes, tant que tu paies et tant que le service existe. Et le jour où l'entreprise ferme, change ses règles ou supprime ton compte ? La vraie question de ton époque : à qui confies-tu tes messages ?" },
  /* MESSAGES PERDUS */
  msg_disquette: { title: "Fichier illisible", emoji: "💾", perdu: true,
    jauges: { vitesse: 1, portee: 1, capacite: 2, durabilite: 1 },
    fact: "Tu as gardé ta disquette pendant 30 ans. Elle n'est ni cassée, ni mouillée, ni brûlée : elle est intacte. Le fichier est toujours dessus. Mais plus aucun ordinateur n'a de lecteur de disquette, et le format du fichier ne s'ouvre plus nulle part. Le message n'a pas été effacé : il est devenu ILLISIBLE. Et pour toi, ça revient exactement au même. 30 ans ont suffi. La paroi de Lascaux, elle, se lit encore après 20 000 ans." },
  msg_compte: { title: "Compte supprimé", emoji: "⛔", perdu: true,
    jauges: { vitesse: 4, portee: 3, capacite: 4, durabilite: 1 },
    fact: "Toutes tes photos d'enfance étaient « dans le nuage ». Et puis le service a fermé. Ou ton compte a été supprimé. Ou tu as oublié le mot de passe. En une seconde, des années de souvenirs disparaissent — et tu n'y peux rien, parce qu'ils n'étaient pas chez toi. Comment se protéger ? Faire plusieurs copies, à plusieurs endroits, dans des formats ouverts. C'est le métier des archivistes : la BnF, par exemple, archive le web français pour qu'il en reste quelque chose." },

  /* ═════ NOUVEAUX MESSAGES — canapé du soir ═════ */
  msg_algorithme: { title: "L'algorithme t'a choisi(e)", emoji: "🎯",
    jauges: { vitesse: 5, portee: 5, capacite: 5, durabilite: 3 },
    fact: "Tu crois défiler ton fil librement. En réalité, une IA regarde CHAQUE seconde de ce que tu regardes, aimes ou ignores. En 10 vidéos, elle a construit un modèle de toi et va te servir surtout ce qui te retient. Deux élèves de la même classe voient DEUX MONDES DIFFÉRENTS sur la même appli — c'est ce qu'on appelle une bulle de filtre. Le média du XXIe siècle ne s'adresse plus à « tout le monde en même temps » comme le JT de 1989 : il s'adresse à toi, tout·e seul·e, en te suivant. Le vrai support, aujourd'hui, ce n'est plus l'antenne : c'est le modèle qui décide pour toi." },
  msg_deepfake: { title: "Vrai, faux ou fabriqué", emoji: "🔎",
    jauges: { vitesse: 5, portee: 5, capacite: 5, durabilite: 2 },
    fact: "Une image ne prouve plus rien à elle seule. Un logiciel peut créer un visage qui n'a jamais existé, ou coller le visage d'un politicien sur une autre vidéo. On appelle ça un DEEPFAKE. Trois réflexes pour tenir bon : 1) qui l'a prise ? (chercher la source, l'auteur, la date), 2) est-ce qu'on la retrouve ailleurs de sérieux ? (AFP, Reuters, un vrai journal), 3) qu'est-ce qui cloche visuellement ? (mains bizarres, oreilles asymétriques, lumière incohérente). Ne pas partager avant d'avoir vérifié : sinon, c'est TOI qui deviens le canal du mensonge." },
};

/* ------------------------------------------------------------
   LES INDICES (bouton 💡)
   ------------------------------------------------------------ */
const HINTS = [
  { needs: ["memoire_flash", "poche"], out: "msg_usb", text: "Une puce de mémoire flash, et hop, dans ta poche : la clé USB. Des bibliothèques entières dans ton jean." },
  { needs: ["ecran_tactile", "reseau_mobile"], out: "msg_smartphone", text: "Un écran tactile + le réseau mobile de l'antenne, dehors : tu obtiens le smartphone, qui contient TOUS les médias du jeu." },
  { needs: ["serveurs", "abonnement"], out: "msg_streaming", text: "Des serveurs très loin + un abonnement que tu paies : c'est le streaming. Tu n'as plus de support… enfin, tu crois." },
  { needs: ["disquette", "pc_moderne"], out: "msg_disquette", text: "Tu meurs d'envie de savoir ce qu'il y a sur cette vieille disquette ? Essaie donc de la lire sur ton PC moderne…" },
  { needs: ["photos_enfance", "service_ferme"], out: "msg_compte", text: "Tes photos d'enfance sont sur un service qui ferme le 31 décembre. Regarde ce qui se passe…" },
];

const NEAR_MISS = [
  { pair: ["disquette", "memoire_flash"], line: "Copier la disquette sur la puce flash ? Excellente idée ! Encore faudrait-il pouvoir la LIRE, ta disquette. Essaie sur le PC, tu verras." },
  { pair: ["ecran_tactile", "serveurs"], line: "Un écran tactile branché sur un datacenter ? Il te manque le lien entre les deux : le réseau mobile." },
  { pair: ["photos_enfance", "poche"], line: "Tu voudrais mettre tes photos dans ta poche ? Mauvaise nouvelle : elles ne sont pas chez toi. Elles sont au datacenter." },
  { pair: ["abonnement", "poche"], line: "Un abonnement dans la poche… Tu paies, mais tu ne possèdes toujours rien. C'est bien ça, le problème." },
];

const FAIL_LINES = [
  "Bzzt. Même ton époque n'a pas inventé ça.",
  "Combinaison rejetée. Un support, un message : concentre-toi.",
  "Mes archives ne connaissent pas. Réessaie.",
  "Erreur : ces deux-là ne feront pas un message.",
  "Zéro invention détectée. On tente autre chose ?",
];

const INTRO = [
  "Nous y voilà : TON époque. Tout ce qu'on a fabriqué en 20 000 ans va tenir dans un seul objet, au fond d'une poche.",
  "Deux personnes, deux vérités qui grincent. L'ado veut que TOUT — téléphone, photos, musique, jeux — tienne dans un seul truc. Le technicien, lui, sourit : « tes souvenirs ? Ils ne sont pas chez toi. Ils sont ICI, dans mes serveurs. Chez quelqu'un d'autre. »",
  "Aide-les, remplis ma jauge une dernière fois — et garde bien ta disquette du chapitre 8. J'ai une petite expérience à te proposer avant de te ramener chez toi.",
];

const ACTIONS = {
  wreck: { mood: "vexe", say: "Je me suis posée entre ta console et trois chargeurs. Personne n'a rien remarqué : tout le monde regardait son écran. C'est vexant, je te l'avoue." },

  ado: { mood: "neutre",
    bubble: "Regarde ce bazar : un téléphone, un appareil photo, un baladeur, une console, une télé, un réveil, un plan de la ville, une pile de courrier… Ça fait BEAUCOUP d'objets à trimballer ! Et si tout ça tenait dans un seul truc, dans ma poche ?",
    say: "Le smartphone : TOUS les médias de ton voyage dans un seul objet. Fait pour capter ton attention, aussi — à qui profite ton temps d'écran ?",
    jeu2Variants: [
      { bubble: "Une chronaute est venue dans MA CHAMBRE. Elle a posé un truc tout à gauche sur mon lit. Genre chelou. Va voir.",
        say: "L'ado : ICI DANS LA CHAMBRE, tout à gauche sur le lit." },
      { bubble: "Ouais, elle est passée ICI. Elle a collé un mot derrière mon POSTER K-POP. Trop rebelle.",
        say: "L'ado : ICI DANS LA CHAMBRE, sur le poster K-POP." },
      { bubble: "Elle est partie au datacenter voisin. Elle a stocké son fichier tout en haut à gauche des serveurs.",
        say: "L'ado renvoie AU DATACENTER, en haut à gauche sur les serveurs." },
    ] },

  /* ═════ mini-jeux du canapé du soir ═════ */
  fil_algo: { modal: "fil_algo", mood: "neutre",
    say: "L'algo t'a fabriqué une bulle en 10 vidéos. Ton fil n'est pas celui de ton voisin." },
  verifier_images: { modal: "verifier_images", mood: "neutre",
    say: "Trois réflexes : source, recoupement, indices visuels. Sinon, tu deviens toi-même le relais du mensonge." },

  technicien: { mood: "neutre",
    bubble: "Tes photos, ta musique, tes devoirs… tu crois qu'ils sont dans ton téléphone ? Regarde autour de toi : ils sont ICI, dans ces serveurs. Chez quelqu'un d'autre. Et tant que tu paies, tout va bien.",
    say: "Le cloud : « plus de support » ? Faux — il est chez quelqu'un d'autre. Posséder ou accéder ? Et si le service ferme ?",
    jeu2Variants: [
      { bubble: "La chronaute a laissé quelque chose DANS LA CHAMBRE D'ADO à côté, tout à gauche sur son lit.",
        say: "Le technicien renvoie DANS LA CHAMBRE, tout à gauche sur le lit." },
      { bubble: "Elle a collé son mot derrière le poster K-POP de l'ado. La chambre à côté.",
        say: "Le technicien renvoie DANS LA CHAMBRE, sur le poster K-POP." },
      { bubble: "Elle a stocké un fichier ICI même, tout en haut à gauche de mes serveurs. Beaucoup plus stable qu'un smartphone.",
        say: "Le technicien : ICI DANS LE DATACENTER, en haut à gauche sur les serveurs." },
    ] },
};

/* ------------------------------------------------------------
   LA FICHE DU CHAPITRE
   ------------------------------------------------------------ */
const chapter = {
  id: "09-xxie",
  bandeau: "CHAPITRE 10 · AUJOURD'HUI",
  date: "AUJOURD'HUI",
  epoque: "XXIe siècle",
  emoji: "📱",

  titre: "MARTINE",
  sousTitre: "Machine À Remonter le Temps Intelligente Néanmoins Excellente",
  presentationTitre: "Chapitre 10 — Ton époque.",
  presentation: "Tout converge : l'appareil photo, le téléphone, la télé, la radio, le journal, la bibliothèque… tout tient désormais dans un seul objet, dans ta poche. Et le support semble avoir disparu — streaming, cloud, « le nuage ». Sauf qu'il n'a pas disparu du tout : il est chez quelqu'un d'autre. Deux lieux : ta chambre, et le hangar où dorment vraiment tes souvenirs.",
  accroche: "La clé USB 🔌 · le smartphone 📱 · le cloud ☁️ · et deux messages qui se perdent…",

  finTitre: "VOYAGE TERMINÉ",
  finTexte: "« Circuits rechargés à {pct} %. Regarde ta frise, humain. Toute l'histoire est là, en un coup d'œil : la vitesse explose, la portée explose, la capacité explose… et la durabilité tombe au fond du trou. Ta disquette avait 30 ans et elle est déjà illisible. La paroi de Lascaux a 20 000 ans et on la lit encore. Alors avant que je te ramène : j'ai UNE dernière question pour toi. » — MARTINE",

  required: 4,
  startScene: 0,
  destination: "ÉPILOGUE",

  items: ITEMS,
  scenes: SCENES,
  carte: CarteXXIe,
  where: WHERE,
  hiddenByFlag: HIDDEN_BY_FLAG,
  recipes: RECIPES,
  messages: MESSAGES,
  hints: HINTS,
  nearMiss: NEAR_MISS,
  failLines: FAIL_LINES,
  intro: INTRO,
  actions: ACTIONS,
};

export default chapter;
