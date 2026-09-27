/* ============================================================
   CHAPITRE 9 — Le XXIe siècle : tout dans la poche (aujourd'hui)
   ============================================================
   3 tableaux : chambre d'ado, canapé du soir, datacenter.
   Idée forte : le téléphone se transforme, avale toute la
   communication humaine, puis se prolonge dans le nuage.

   La progression des recettes suit l'histoire elle-même :
     TÉLÉPHONE + PRISE          → l'APPEL (la voix, à distance)
     TÉLÉPHONE + ANTENNE        → le MOBILE (la voix, partout)
     TÉLÉPHONE + ORDINATEUR     → le SMARTPHONE (voix + tout)
     SMARTPHONE + WI-FI         → les RÉSEAUX SOCIAUX
     SERVEURS  + ABONNEMENT     → le STREAMING/CLOUD
   Puis les DEUX messages PERDUS :
     DISQUETTE + ORDINATEUR     → fichier ILLISIBLE en 30 ans
     PHOTOS    + SERVICE FERMÉ  → compte SUPPRIMÉ
   ============================================================ */

import SceneChambre from "./scenes/SceneChambre.jsx";
import SceneCanapeSoir from "./scenes/SceneCanapeSoir.jsx";
import SceneDatacenter from "./scenes/SceneDatacenter.jsx";
import CarteXXIe from "./scenes/CarteXXIe.jsx";

/* ------------------------------------------------------------
   LES ÉLÉMENTS
   ------------------------------------------------------------ */
const ITEMS = {
  /* ANACHRONISME — venu du FUTUR cette fois ! */
  neurolien: { name: "Neuro-Lien™", emoji: "🧠", anachronic: true, desc: "Un petit disque translucide bio-imprimé qui se pose sur la tempe : le NEURO-LIEN™ (breveté en 2141). Il transmet directement les pensées sur le web. En 2025 il n'existe pas encore — et ça vaut mieux !" },

  /* HÉRITAGE du chapitre 8 */
  disquette: { name: "Disquette", emoji: "💾", heirloom: true, desc: "Ta disquette des années 80, rapportée du chapitre précédent. Il y a un fichier dessus. Elle a 30 ans à peine… ça devrait aller, non ?" },

  /* ═════ Chambre : les briques du téléphone à travers le temps ═════ */
  telephone:   { name: "Téléphone à cadran", emoji: "📞", desc: "Un vieux téléphone en bakélite, avec un cadran rotatif. Il traînait chez tes grands-parents. C'est l'ancêtre de tout : la voix, transportée sur un fil." },
  /* support: true → fixe, ne va pas au sac : on lui apporte un objet */
  prise:       { name: "Prise murale", emoji: "🔌", support: true, desc: "La ligne téléphonique : un fil qui va d'ici jusqu'au central, puis aux quatre coins du pays. Sans lui, ton téléphone n'est qu'un bibelot." },
  antenne:     { name: "Antenne relais", emoji: "📡", support: true, desc: "L'antenne 4G/5G derrière la fenêtre. Elle capte ton téléphone et le relie au monde entier, partout, tout le temps." },
  ordinateur:  { name: "Ordinateur", emoji: "💻", support: true, desc: "Ton ordinateur d'aujourd'hui. Un vrai cerveau miniature. Colle un téléphone dessus, tu obtiens un objet qui fait TOUT — le smartphone." },

  /* ═════ Canapé du soir : le prolongement en réseau ═════ */
  smartphone:  { name: "Smartphone", emoji: "📱", desc: "L'objet le plus utilisé du XXIe siècle. Il tient dans la main et remplace le téléphone, l'appareil photo, la télé, le baladeur, la carte, le courrier, la presse… TOUT ton voyage tient dedans." },
  wifi:        { name: "Wi-Fi de la box", emoji: "📶", support: true, desc: "La box internet à la maison. Elle donne à ton smartphone l'accès aux réseaux sociaux et à toutes les messageries du monde. Sans elle, ton smartphone reste muet côté web." },

  /* ═════ Chambre / Datacenter : les photos + le service ═════ */
  photos_enfance: { name: "Photos d'enfance", emoji: "🖼️", desc: "Toutes tes photos depuis que tu es petit. Elles ne sont pas ici : elles sont « dans le nuage ». C'est-à-dire… ailleurs." },

  /* ═════ Datacenter ═════ */
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
  disquette:      "dans ta besace — la disquette du chapitre 8 (si tu ne l'as plus, rejoue le chapitre 8 et ramasse-la au labo)",
  telephone:      "dans ta chambre — un vieux téléphone à cadran, sur une commode",
  photos_enfance: "dans ta chambre — la tablette photos",
  smartphone:     "sur le canapé du soir — dans la main de l'ado",
  abonnement:     "au datacenter",
};

const HIDDEN_BY_FLAG = {};

/* ------------------------------------------------------------
   LES RECETTES — la vie du téléphone en 4 étapes + streaming + perdus
   ------------------------------------------------------------ */
const RECIPES = [
  { a: "telephone",     b: "prise",         out: "msg_appel",      msg: true },
  { a: "telephone",     b: "antenne",       out: "msg_mobile",     msg: true },
  { a: "telephone",     b: "ordinateur",    out: "msg_smartphone", msg: true },
  { a: "smartphone",    b: "wifi",          out: "msg_reseaux",    msg: true },
  { a: "serveurs",      b: "abonnement",    out: "msg_streaming",  msg: true },
  /* MESSAGE PERDU 1 — la disquette du chapitre 8, 30 ans après. */
  { a: "disquette",     b: "ordinateur",    out: "msg_disquette",  msg: true, perdu: true },
  /* MESSAGE PERDU 2 — la mémoire confiée à quelqu'un d'autre. */
  { a: "photos_enfance", b: "service_ferme", out: "msg_compte",    msg: true, perdu: true },
];

/* ------------------------------------------------------------
   LES MESSAGES (fiches + jauges 1 à 5)
   ------------------------------------------------------------ */
const MESSAGES = {
  msg_appel: { title: "Passer un appel téléphonique", emoji: "📞",
    jauges: { vitesse: 4, portee: 3, capacite: 1, durabilite: 2 },
    fact: "Fin XIXe : Alexander Graham Bell fait passer la voix humaine dans un fil de cuivre. Un siècle plus tard, la ligne fixe est partout : dans chaque maison, un poste noir avec un cadran rotatif relié à une prise murale. Tu décroches, tu tournes des chiffres — et tu parles instantanément avec quelqu'un à 500 km. C'est le média oublié de ta grand-mère : la voix, à distance. Toute la messagerie moderne descend de là." },
  msg_mobile: { title: "Passer un appel mobile", emoji: "📱",
    jauges: { vitesse: 5, portee: 4, capacite: 1, durabilite: 2 },
    fact: "Années 1990-2000 : le téléphone abandonne le fil. Une antenne-relais tous les kilomètres, un petit boîtier dans la poche — et voilà la voix qui te suit PARTOUT. En vingt ans, l'usage explose : en 2025, il y a plus d'abonnements mobiles que d'êtres humains sur Terre. Le média n'a pas changé (c'est toujours la voix), mais le SUPPORT s'est affranchi du fil. C'est un tournant : pour la première fois, le message n'est plus lié à un lieu." },
  msg_smartphone: { title: "Faire du téléphone un ordinateur", emoji: "📲",
    jauges: { vitesse: 5, portee: 5, capacite: 4, durabilite: 2 },
    fact: "2007 : Apple sort l'iPhone. C'est un téléphone qui contient aussi un vrai ordinateur : appareil photo, baladeur, carte, encyclopédie, réveil, télévision, journal, courrier… TOUS les médias de ton voyage — de Lascaux à aujourd'hui — tiennent maintenant dans un seul objet, au fond de ta poche. Mais rappelle-toi : cet objet est fabriqué pour capter ton attention le plus longtemps possible. Alors à qui profite ton temps d'écran ?" },
  msg_reseaux: { title: "Publier sur un réseau social", emoji: "🌐",
    jauges: { vitesse: 5, portee: 5, capacite: 5, durabilite: 2 },
    fact: "Un smartphone branché sur le Wi-Fi = un poste d'émission mondial. Pour la première fois de l'histoire, chaque personne peut publier vers TOUT LE MONDE, gratuitement, immédiatement. C'est vertigineux — et c'est le vrai basculement du XXIe siècle : de « quelques diffuseurs pour des millions de spectateurs » (JT, presse) à « des millions d'émetteurs, chacun dans sa bulle ». Attention : sans ce Wi-Fi (ou la 4G/5G), un smartphone redevient un simple caillou lumineux." },
  msg_streaming: { title: "Regarder un film en streaming", emoji: "☁️",
    jauges: { vitesse: 5, portee: 5, capacite: 5, durabilite: 1 },
    fact: "Musique, films, séries, photos, devoirs : plus besoin de support à la maison ! Enfin… c'est ce qu'on dit. En vrai, le support existe toujours, mais il est CHEZ QUELQU'UN D'AUTRE, dans un hangar rempli de serveurs. Tu ne possèdes plus : tu accèdes, tant que tu paies et tant que le service existe. Et le jour où l'entreprise ferme, change ses règles ou supprime ton compte ? La vraie question de ton époque : à qui confies-tu tes messages ?" },

  /* MESSAGES PERDUS */
  msg_disquette: { title: "Fichier illisible", emoji: "💾", perdu: true,
    jauges: { vitesse: 1, portee: 1, capacite: 2, durabilite: 1 },
    fact: "Tu as gardé ta disquette pendant 30 ans. Elle n'est ni cassée, ni mouillée, ni brûlée : elle est intacte. Le fichier est toujours dessus. Mais plus aucun ordinateur n'a de lecteur de disquette, et le format du fichier ne s'ouvre plus nulle part. Le message n'a pas été effacé : il est devenu ILLISIBLE. Et pour toi, ça revient exactement au même. 30 ans ont suffi. La paroi de Lascaux, elle, se lit encore après 20 000 ans." },
  msg_compte: { title: "Compte supprimé", emoji: "⛔", perdu: true,
    jauges: { vitesse: 4, portee: 3, capacite: 4, durabilite: 1 },
    fact: "Toutes tes photos d'enfance étaient « dans le nuage ». Et puis le service a fermé. Ou ton compte a été supprimé. Ou tu as oublié le mot de passe. En une seconde, des années de souvenirs disparaissent — et tu n'y peux rien, parce qu'ils n'étaient pas chez toi. Comment se protéger ? Faire plusieurs copies, à plusieurs endroits, dans des formats ouverts. C'est le métier des archivistes : la BnF, par exemple, archive le web français pour qu'il en reste quelque chose." },

  /* ═════ Canapé du soir — mini-jeux EMI ═════ */
  msg_algorithme: { title: "L'algorithme t'a choisi(e)", emoji: "🎯",
    jauges: { vitesse: 5, portee: 5, capacite: 5, durabilite: 3 },
    fact: "Tu crois défiler ton fil librement. En réalité, une IA regarde CHAQUE seconde de ce que tu regardes, aimes ou ignores. En 10 vidéos, elle a construit un modèle de toi et va te servir surtout ce qui te retient. Deux élèves de la même classe voient DEUX MONDES DIFFÉRENTS sur la même appli — c'est ce qu'on appelle une bulle de filtre. Le média du XXIe siècle ne s'adresse plus à « tout le monde en même temps » comme le JT de 1989 : il s'adresse à toi, tout·e seul·e, en te suivant." },
  msg_deepfake: { title: "Vrai, faux ou fabriqué", emoji: "🔎",
    jauges: { vitesse: 5, portee: 5, capacite: 5, durabilite: 2 },
    fact: "Une image ne prouve plus rien à elle seule. Un logiciel peut créer un visage qui n'a jamais existé, ou coller le visage d'un politicien sur une autre vidéo. On appelle ça un DEEPFAKE. Trois réflexes pour tenir bon : 1) qui l'a prise ? (chercher la source, l'auteur, la date), 2) est-ce qu'on la retrouve ailleurs de sérieux ? (AFP, Reuters, un vrai journal), 3) qu'est-ce qui cloche visuellement ? (mains bizarres, oreilles asymétriques, lumière incohérente). Ne pas partager avant d'avoir vérifié : sinon, c'est TOI qui deviens le canal du mensonge." },
};

/* ------------------------------------------------------------
   LES INDICES (bouton 💡)
   ------------------------------------------------------------ */
const HINTS = [
  { needs: ["telephone", "prise"],       out: "msg_appel",      text: "Le vieux téléphone à cadran + la prise murale = un appel filaire. C'est ainsi que ta grand-mère parlait à ses amis." },
  { needs: ["telephone", "antenne"],     out: "msg_mobile",     text: "Le téléphone + l'antenne-relais à la fenêtre = la voix sans fil, dans ta poche." },
  { needs: ["telephone", "ordinateur"],  out: "msg_smartphone", text: "Le téléphone + l'ordinateur = un smartphone, un objet qui fait TOUT à la fois." },
  { needs: ["smartphone", "wifi"],       out: "msg_reseaux",    text: "Le smartphone du canapé + la Wi-Fi de la box : tu publies sur les réseaux sociaux — un émetteur mondial dans ta main." },
  { needs: ["serveurs", "abonnement"],   out: "msg_streaming",  text: "Des serveurs très loin + un abonnement que tu paies : c'est le streaming. Tu n'as plus de support… enfin, tu crois." },
  { needs: ["disquette", "ordinateur"],  out: "msg_disquette",  text: "Cette vieille disquette de 30 ans, essaie donc de la lire sur l'ordinateur d'aujourd'hui…" },
  { needs: ["photos_enfance", "service_ferme"], out: "msg_compte", text: "Tes photos d'enfance sont sur un service qui ferme le 31 décembre. Regarde ce qui se passe…" },
];

const NEAR_MISS = [
  { pair: ["disquette", "telephone"], line: "Copier une disquette dans un téléphone ? Ils ne se parlent pas. Essaie plutôt l'ordinateur." },
  { pair: ["telephone", "wifi"],      line: "Un téléphone à cadran sur la Wi-Fi ? Il n'a même pas d'écran. Le Wi-Fi, c'est pour le SMARTPHONE." },
  { pair: ["smartphone", "prise"],    line: "Tu voudrais brancher ton smartphone sur la prise du téléphone ? Il faut du Wi-Fi ou une antenne, plus du cuivre." },
  { pair: ["smartphone", "antenne"],  line: "Un smartphone se relie à l'antenne, oui — mais c'est le TÉLÉPHONE tout court qui a inventé le mobile. Ton smartphone, lui, veut le WI-FI pour les réseaux." },
  { pair: ["photos_enfance", "smartphone"], line: "Tu voudrais mettre tes photos dans ton smartphone ? Mauvaise nouvelle : elles ne sont pas chez toi. Elles sont au datacenter, sur un service qui ferme…" },
  { pair: ["abonnement", "smartphone"], line: "Un abonnement dans ton smartphone… Tu paies, mais tu ne possèdes toujours rien. C'est bien ça, le problème." },
];

const FAIL_LINES = [
  "Bzzt. Même ton époque n'a pas inventé ça.",
  "Combinaison rejetée. Un support, un message : concentre-toi.",
  "Mes archives ne connaissent pas. Réessaie.",
  "Erreur : ces deux-là ne feront pas un message.",
  "Zéro invention détectée. On tente autre chose ?",
];

const INTRO = [
  "Nous y voilà : TON époque. En un siècle, le téléphone est passé du cadran à la poche, puis a avalé tous les médias du monde.",
  "Trois lieux : ta chambre (où traîne le vieux téléphone), le canapé du soir (ton smartphone à la main), et le hangar où dorment vraiment tes souvenirs.",
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
  presentation: "Un vieux téléphone à cadran, une antenne, un ordinateur, une Wi-Fi… et voilà comment, en un siècle, la voix humaine est passée d'un fil de cuivre à un écran de poche relié au monde entier. Suis la ligne : appel, mobile, smartphone, réseaux sociaux. Puis va voir où vivent vraiment tes souvenirs — dans un hangar, chez quelqu'un d'autre.",
  accroche: "L'appel 📞 · le mobile 📱 · le smartphone 📲 · les réseaux 🌐 · le cloud ☁️ · et deux messages qui se perdent…",

  finTitre: "VOYAGE TERMINÉ",
  finTexte: "« Circuits rechargés à {pct} %. Regarde ta frise, humain. Toute l'histoire est là, en un coup d'œil : la vitesse explose, la portée explose, la capacité explose… et la durabilité tombe au fond du trou. Ta disquette avait 30 ans et elle est déjà illisible. La paroi de Lascaux a 20 000 ans et on la lit encore. Alors avant que je te ramène : j'ai UNE dernière question pour toi. » — MARTINE",

  required: 5,
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
