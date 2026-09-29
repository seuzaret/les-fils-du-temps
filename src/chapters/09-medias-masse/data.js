/* ============================================================
   CHAPITRE 9 — Médias de masse (1969-1990)
   ============================================================
   3 tableaux, la fin du XXe siècle :
   - T1 SALON, 21 juillet 1969, 3h56 : Nathalie et sa mère
     regardent Armstrong marcher sur la Lune en direct. Antenne
     à orienter pour avoir l'image nette. 600 millions de
     spectateurs simultanés — record historique.
   - T2 CHAMBRE D'ADO, 1985 : Julien enregistre un tube de la
     radio sur cassette. Il a aussi une DISQUETTE 3½ » sur son
     bureau (héritage pour le chapitre suivant).
   - T3 BUREAU, 1990 : Céline sur un PC beige. Elle grave un
     CD-Rom. La disquette de Julien vient dormir dans le tiroir…
     jusqu'au chapitre suivant, où on essaiera de la lire.
   ============================================================ */

import SceneSalon1969 from "./scenes/SceneSalon1969.jsx";
import SceneKiosque1980 from "./scenes/SceneKiosque1980.jsx";
import SceneChambre1985 from "./scenes/SceneChambre1985.jsx";
import SceneSalonJT1989 from "./scenes/SceneSalonJT1989.jsx";
import SceneBureau1990 from "./scenes/SceneBureau1990.jsx";
import CarteMedias from "./scenes/CarteMedias.jsx";
import { PortraitNathalie, PortraitJulien, PortraitCeline } from "./scenes/portraits.jsx";

/* ------------------------------------------------------------
   LES ÉLÉMENTS
   ------------------------------------------------------------ */
const ITEMS = {
  /* ANACHRONISME */
  airpods: { name: "AirPods", emoji: "🎧", anachronic: true, desc: "Des AirPods d'Apple — commercialisés en 2016. Dans une chambre d'ado de 1985, ça détonne au milieu des cassettes." },

  /* T1 — le salon 1969 */
  antenne_rateau: { name: "Antenne râteau", emoji: "📡", desc: "L'antenne du toit, redescendue au salon pour bricolage. Une fois posée sur la TV, il faudra encore l'orienter." },
  antenne_lapin:  { name: "Oreilles de lapin", emoji: "📶", desc: "Deux tiges télescopiques en V à poser sur le téléviseur pour affiner la réception. Sans elles, l'image reste neigeuse." },
  television:     { name: "Téléviseur cathodique", emoji: "📺", support: true, desc: "Un gros meuble bois avec un tube au centre, deux gros boutons rotatifs. Aujourd'hui, un rendez-vous mondial." },

  /* T1 — les JOUETS et bric-à-brac de Nathalie (fausses pistes).
     Marqués `ephemere: true` → ils disparaissent de ton sac
     dès que tu changes de tableau. Ils ne servent à rien : c'est
     pour rendre la recherche de l'antenne moins évidente. */
  poupee:         { name: "Poupée en robe rose", emoji: "🪆", ephemere: true, desc: "Une poupée bien coiffée. Ravissante — mais totalement inutile pour capter la Lune." },
  ours:           { name: "Ours en peluche", emoji: "🧸", ephemere: true, desc: "Doux, rassurant, et sans la moindre antenne intégrée. Repose-le, va." },
  cubes:          { name: "Cubes en bois A/B", emoji: "🎲", ephemere: true, desc: "Pour apprendre l'alphabet. La lettre H comme… « Homme sur la Lune ». Mais ça n'aide pas la réception." },
  balle:          { name: "Balle rayée", emoji: "🏐", ephemere: true, desc: "Elle rebondit très bien. Voilà. C'est tout." },
  livre_enfant:   { name: "Petit livre vert", emoji: "📗", ephemere: true, desc: "Un livre d'images. Nathalie l'a déjà lu trois fois. Il ne remplace pas une antenne." },
  toupie:         { name: "Toupie violette", emoji: "🪀", ephemere: true, desc: "Elle tourne à merveille. Elle ne capte hélas aucune onde hertzienne." },
  pot_ceramique:  { name: "Pot en céramique", emoji: "🏺", ephemere: true, desc: "Purement décoratif. Souvenir de Vallauris — vraiment inutile ici." },
  reveil_vintage: { name: "Radio-réveil", emoji: "⏰", ephemere: true, desc: "Il affiche 3:56 en digits rouges. Pas le temps de rêver — la Lune n'attend pas !" },
  photo_encadree: { name: "Photo de famille", emoji: "🖼️", ephemere: true, desc: "Papa, maman, Nathalie sur la plage. Émouvant, mais toujours pas d'image sur la télé." },
  vase_fleurs:    { name: "Petit vase à fleurs", emoji: "🌹", ephemere: true, desc: "Fleurs artificielles poussiéreuses. Ça ne se mange pas, ça ne capte rien." },

  /* T2 — la chambre d'ado 1985 */
  cassette_vierge: { name: "Cassette vierge", emoji: "📼", desc: "Une TDK 60 minutes. Face A pour les tubes, face B pour les slows. À enrouler avant d'enregistrer — un stylo Bic pour rembobiner si besoin." },
  radio_cassette:  { name: "Radio-cassette double platine", emoji: "🎚️", support: true, desc: "L'objet-culte de 1985 : radio FM à droite, deux platines à gauche pour copier. Une cassette qui joue, une qui enregistre." },

  /* HÉRITAGE pour ch.10 — la disquette 3½ » de Julien */
  disquette: { name: "Disquette 3½ »", emoji: "💾", heirloom: true, desc: "Une disquette Verbatim toute neuve. Julien y sauvegarde ses parties de jeu vidéo. Il t'en donne une : « Elle durera bien 100 ans, non ? » On verra dans 30 ans." },

  /* T3 — le bureau 1990 */
  cd_vierge:  { name: "CD-Rom vierge", emoji: "💿", desc: "Un disque brillant qui fait des arcs-en-ciel. On grave avec un laser des creux si petits qu'on ne les voit pas. Vendu « inaltérable ». Vraiment ?" },
  pc_beige:   { name: "PC beige (unité centrale)", emoji: "🖥️", support: true, desc: "Une tour beige avec un lecteur de disquette 3½ », un lecteur CD, un ventilateur bruyant. Windows 3.0. On y grave, on y calcule, on y écrit." },
};

/* ------------------------------------------------------------
   LES TABLEAUX
   ------------------------------------------------------------ */
const SCENES = [
  { id: "salon69",  name: "Salon, 21 juillet 1969, 3h56 du matin", Component: SceneSalon1969,   nextWhen: ["msg_tv_lune"] },
  { id: "kiosque",  name: "Kiosque à journaux, années 80",          Component: SceneKiosque1980, nextWhen: ["msg_ligneEditoriale"] },
  { id: "chambre",  name: "Chambre d'ado, 1985",                    Component: SceneChambre1985, nextWhen: ["msg_cassette"] },
  { id: "salonjt",  name: "Salon devant le JT, 9 novembre 1989",    Component: SceneSalonJT1989, nextWhen: ["msg_evenement"] },
  { id: "bureau",   name: "Bureau, 1990",                            Component: SceneBureau1990 },
];

const WHERE = {
  antenne_rateau: "au salon 1969 — posée par terre à côté de la TV",
  antenne_lapin:  "au salon 1969 — sur le meuble TV",
  cassette_vierge: "chambre d'ado 1985 — pile de cassettes sur le bureau",
  disquette: "chambre d'ado 1985 — sur l'étagère à côté du ZX Spectrum (Julien te la donne)",
  cd_vierge: "bureau 1990 — pile de CD-Rom vierges sur le bureau",
};

const HIDDEN_BY_FLAG = {};

/* ------------------------------------------------------------
   LES RECETTES
   ------------------------------------------------------------ */
const RECIPES = [
  /* T1 — assembler l'antenne pour capter la Lune */
  { a: "antenne_rateau", b: "television", out: "rateau_pose", gives: [], consume: ["antenne_rateau"], flag: "rateau_pose",
    line: "📡 Tu poses l'antenne râteau sur le toit — enfin, en bricolage, sur le meuble TV. L'image se dessine mais reste neigeuse : il manque les oreilles de lapin." },
  { a: "antenne_lapin", b: "television", out: "msg_tv_lune", msg: true, consume: ["antenne_lapin"], needsFlag: "rateau_pose",
    line: "📶 Tu poses les oreilles de lapin, tu les ajustes en V. L'image se stabilise — noir et blanc mais net. Sur l'écran, Armstrong descend l'échelle du LM. « That's one small step for man, one giant leap for mankind. »" },

  /* T2 — insérer la cassette dans la platine (ouvre ensuite le mini-jeu PLAY+REC) */
  { a: "cassette_vierge", b: "radio_cassette", out: "cassette_chargee", gives: [], consume: ["cassette_vierge"], flag: "cassette_chargee",
    line: "📼 Tu glisses la cassette dans la platine de droite. Clac. Maintenant clique sur la radio-cassette : il va falloir attendre le bon moment pour presser PLAY+REC." },

  /* T3 — insérer le CD dans le lecteur, ouvre ensuite le mini-jeu de gravure */
  { a: "cd_vierge", b: "pc_beige", out: "cd_charge", gives: [], consume: ["cd_vierge"], flag: "cd_charge",
    line: "💿 Tu glisses le CD-Rom vierge dans le lecteur. Windows 3.0 détecte le disque. Reste à choisir ce qu'on grave dessus — clique sur le PC pour lancer l'assistant de gravure." },
];

/* ------------------------------------------------------------
   LES MESSAGES (fiches + jauges 1 à 5)
   ------------------------------------------------------------ */
const MESSAGES = {
  msg_tv_lune: { title: "Passer à la TV", emoji: "🌕",
    jauges: { vitesse: 5, portee: 5, capacite: 3, durabilite: 2 },
    fact: "21 juillet 1969, 3h56 (heure de Paris). Neil Armstrong pose le pied sur la Lune. Grâce au satellite (Intelsat III), l'image et le son voyagent en direct jusqu'aux téléviseurs de la planète : environ 600 millions de spectateurs regardent en même temps — un humain sur quatre. C'est le PLUS GRAND rendez-vous médiatique de l'Histoire à ce moment. Fait moins connu : la phrase d'Armstrong était préparée depuis des semaines. Et un point d'EMI : la TV met le monde en direct dans le salon, mais un MONDE CHOISI — une rédaction décide quel plan on montre, combien de temps, avec quel commentaire. Regarder le journal télévisé, ce n'est pas voir le monde, c'est voir ce que quelqu'un a sélectionné pour toi." },
  msg_cassette: { title: "Enregistrer une cassette", emoji: "📼",
    jauges: { vitesse: 3, portee: 3, capacite: 3, durabilite: 2 },
    fact: "Cassette audio (Philips, 1963) puis magnétoscope VHS (JVC, 1976) : pour la PREMIÈRE FOIS de l'Histoire, chaque foyer peut ENREGISTRER chez soi la radio, la télé, la musique des copains — puis la copier, la prêter, l'échanger. L'industrie du disque crie déjà au « piratage » (le débat Napster de la fin des années 90 commence là). Mais attention : la bande magnétique se démagnétise avec le temps, se casse, s'aimante par erreur (un simple aimant peut tout effacer). Des archives entières de radio et de télé ont été perdues : les bandes étaient trop chères, on effaçait pour ré-enregistrer par-dessus. Un support qui EXISTE ne garantit pas la SURVIE du message." },
  msg_ligneEditoriale: { title: "La ligne éditoriale", emoji: "📰",
    jauges: { vitesse: 3, portee: 4, capacite: 3, durabilite: 2 },
    fact: "Dans un kiosque des années 80, il y a des dizaines de journaux et magazines. Chacun fait des CHOIX : quelles infos il garde, quels titres il met en Une, comment il en parle. Deux journaux qui reçoivent la MÊME information peuvent sortir des Unes très différentes. C'est ça, une « ligne éditoriale » : le point de vue d'un journal sur ce qui compte. Aucun journal n'est complètement neutre. Bien lire un journal, c'est se demander : qui l'écrit ? pour qui ? avec quel angle ? Aujourd'hui, sur un fil d'actu ou un réseau social, c'est un ordinateur qui choisit à ta place ce que tu vois — mais quelqu'un (ou quelque chose) choisit toujours." },

  msg_evenement: { title: "L'événement mondial en direct", emoji: "📺",
    jauges: { vitesse: 5, portee: 5, capacite: 3, durabilite: 2 },
    fact: "Le 9 novembre 1989, le mur de Berlin tombe. Pour la première fois, un événement historique majeur est vu EN DIRECT par des millions de gens sur toute la planète, en même temps. La TV devient un « village mondial » : chacun sait ce que sait le voisin. Mais attention : le journaliste choisit UNE image pour ouvrir son édition. La foule qui danse ? Un garde-frontière hébété ? Un couple qui s'embrasse ? Chaque choix raconte l'événement autrement. Cadrer, c'est déjà interpréter. C'est ça, la force et la limite du direct : on voit le monde entier — mais on voit ce qu'un rédacteur a décidé de nous montrer." },

  msg_cd: { title: "CD-Rom & disque optique", emoji: "💿",
    jauges: { vitesse: 3, portee: 4, capacite: 4, durabilite: 2 },
    fact: "CD audio (Philips + Sony, 1982) puis CD-Rom pour l'ordinateur (1985) : un laser lit des creux minuscules gravés sur une couche métallique sous du plastique. On vend le CD comme un support « inaltérable » qui durerait à jamais. La réalité, 30 ans plus tard : beaucoup de CD gravés dans les années 90 sont ILLISIBLES — la couche métallique s'oxyde et se décolle, on appelle ça la « maladie du disque ». Le support censé tout garder ne tient parfois même pas 20 ans. Prochaine étape (chapitre suivant) : on verra ce que devient une disquette héritée d'ici, 30 ans plus tard…" },
};

/* ------------------------------------------------------------
   LES INDICES (bouton 💡)
   ------------------------------------------------------------ */
const HINTS = [
  { needs: ["antenne_rateau", "television"], out: "rateau_pose", text: "Pose d'abord l'antenne râteau sur le téléviseur (glisse-la sur la TV)." },
  { needs: ["antenne_lapin", "television"], out: "msg_tv_lune", text: "Puis pose les oreilles de lapin sur la TV pour affiner : l'image devient nette." },
  { needs: ["cassette_vierge", "radio_cassette"], out: "msg_cassette", text: "Glisse la cassette vierge dans la radio-cassette : Julien enregistre le tube de la radio." },
  { needs: ["cd_vierge", "pc_beige"], out: "msg_cd", text: "Glisse le CD-Rom vierge dans le lecteur du PC : Céline le grave." },
];

const NEAR_MISS = [
  { pair: ["cassette_vierge", "television"], line: "Une cassette dans la TV ? Non — la TV cathodique n'a pas de lecteur. Va dans la chambre d'ado, la radio-cassette t'attend." },
  { pair: ["cd_vierge", "radio_cassette"], line: "Un CD dans une radio-cassette ? En 1985, on ne mélange pas encore les formats. Le CD, c'est pour le PC du bureau." },
];

const FAIL_LINES = [
  "Bzzt. Cette combinaison n'a pas de sens à cette époque.",
  "Non — le média du salon, le média de la chambre et le média du bureau ne se mélangent pas encore.",
  "Erreur : ces deux-là ne feront pas un message ici.",
];

const INTRO = [
  "Le XXe siècle finit avec un boom : la télévision entre dans chaque salon, le magnétoscope dans chaque chambre, l'ordinateur dans chaque bureau. Chacun devient à la fois SPECTATEUR et enregistreur — un basculement historique.",
  "Trois arrêts : 21 juillet 1969, l'Homme sur la Lune en direct devant 600 millions de spectateurs. 1985, un ado enregistre les tubes à la radio pour se faire sa cassette. 1990, une jeune femme grave son premier CD-Rom.",
  "Chaque support promet la durée éternelle. Mais la bande se démagnétise, le CD s'oxyde, la disquette devient illisible. Ne quitte pas ce chapitre sans la disquette que Julien te donne — elle survivra jusqu'au chapitre suivant. Enfin, si elle survit.",
];

const ACTIONS = {
  wreck: { mood: "vexe", say: "J'ai atterri dans un salon des années 60, en plein direct lunaire. Un enfant a cru à un vaisseau spatial. Recharge-moi, on a beaucoup de médias à voir." },

  nathalie: { mood: "content",
    bubble: "Nathalie, 12 ans ! Cette nuit, papa m'a réveillée à 3h du matin : les Américains marchent sur la LUNE ! Sauf que l'image est TOUTE NEIGEUSE. Aide-moi à régler l'antenne, sinon je vais rater l'Histoire !",
    say: "Nathalie : 600 millions de personnes regardent en même temps. Il faut vite régler l'antenne râteau, puis les oreilles de lapin.",
    jeu2Variants: [
      { bubble: "Une dame en tunique grise est venue voir la Lune avec nous, ICI dans le salon. Elle a posé un CD directement sur le téléviseur.",
        say: "Nathalie : ICI AU SALON DE 1969, sur le téléviseur." },
      { bubble: "La chronaute est repartie 15 ans plus tard, dans ma chambre d'ado. Elle a caché son CD sur la radio-cassette.",
        say: "Nathalie renvoie À LA CHAMBRE 1985, sur la radio-cassette." },
      { bubble: "Elle a filé au bureau de ma tante, dans les années 90. Elle a laissé son CD sur l'imprimante à gauche.",
        say: "Nathalie renvoie AU BUREAU 1990, sur l'imprimante matricielle à gauche." },
    ] },

  julien: { mood: "content",
    bubble: "Julien, 15 ans ! Mon groupe préféré passe à 17h à la radio ! J'ai une cassette TDK 60 minutes prête dans la platine de droite. Aide-moi à appuyer sur PLAY+REC pile au bon moment pour l'avoir sans le speaker par-dessus.",
    say: "Julien : avec la cassette, chacun peut enregistrer chez soi. L'industrie du disque n'est PAS contente.",
    jeu2Variants: [
      { bubble: "Une dame chronaute a laissé un CD à mes parents, LA NUIT DE LA LUNE en 69. Elle l'a posé sur le téléviseur.",
        say: "Julien renvoie AU SALON DE 1969, sur le téléviseur." },
      { bubble: "Une chronaute est passée ICI, dans ma chambre. Elle a glissé son CD sur ma radio-cassette, camouflé.",
        say: "Julien : ICI DANS LA CHAMBRE 1985, sur la radio-cassette." },
      { bubble: "Elle a filé au bureau du studio graphique. Sa dernière version du CD est sur l'imprimante à gauche.",
        say: "Julien renvoie AU BUREAU 1990, sur l'imprimante matricielle à gauche." },
    ] },

  platine_rec: { modal: "cassette", needsFlag: "cassette_chargee",
    needMsg: "Il faut d'abord glisser une cassette dans la platine." },

  robert: { mood: "content",
    bubble: "Robert, kioskier de père en fils depuis 1962 ! Justement, un de mes amis journalistes vient d'appeler — il aurait besoin d'un coup de main pour faire la Une du soir. Chaque journal vise un public différent, tu sais. Tu veux bien lui donner un coup de main ?",
    say: "Robert te branche avec la rédaction d'un journal. Ligne éditoriale, public cible : la Une doit être adaptée.",
    chitchat: [
      "Un jour je ferme boutique, je vais dans le Sud. Mais qui va vendre le journal aux gens du quartier, hein ? Alors je reste.",
      "Ma fille dit que dans le futur, on lira les journaux sur des petits écrans. Sans papier ! Je veux bien voir ça de mon vivant.",
      "Trente ans que je suis là. J'ai vu passer trois présidents, deux monnaies, et toute une génération de lecteurs.",
    ] },

  faire_la_une: { modal: "faire_la_une",
    needMsg: "Approche-toi du kiosque et clique dessus : un journal a besoin d'aide pour composer sa Une." },

  cadrer_evenement: { modal: "cadrer_evenement",
    needMsg: "Clique sur la télé pour rejoindre la rédaction du JT du soir." },

  papa_jt: { mood: "neutre",
    bubble: "…",
    say: "Papa. Absorbé, muet devant l'écran. Il ne pensait pas voir ça de son vivant.",
    chitchat: [
      "Trente ans que ce mur est debout. Trente ans qu'on nous dit qu'il ne tombera jamais.",
      "Je vais garder cette cassette VHS toute ma vie. Toute ma vie.",
      "Chuuut… j'écoute le journaliste.",
    ] },

  maman_jt: { mood: "content",
    bubble: "Allô, Mamie ? Allume la deux ! Berlin ! LE MUR ! Non mais tu te rends compte ?",
    say: "Maman appelle grand-mère au téléphone à fil. Elle veut que TOUT LE MONDE regarde en même temps.",
    chitchat: [
      "Allô, Sylvie ? Allume la télé, vite ! … Comment ça, tu regardais un film ? Change de chaîne !",
      "Ma mère habite à côté de Strasbourg. Elle entend parler allemand tous les jours. Elle doit être bouleversée.",
      "J'ai appelé toute la famille. Tout le monde regarde en direct, dans son salon. C'est fou, non ?",
    ] },

  ado_jt: { mood: "neutre",
    bubble: "C'est quoi ce mur, en fait ? Pourquoi ils l'ont mis, pourquoi ils le cassent ?",
    say: "L'ado, 13 ans. Elle voit la joie sans comprendre pourquoi. Une image qui la marquera quand même.",
    chitchat: [
      "Papa m'a expliqué trois fois. J'ai retenu qu'il y avait deux Allemagnes. Pas plus.",
      "Mes copines vont pas y croire demain au collège. Je vais tout leur raconter.",
      "Je peux enregistrer sur ma cassette moi aussi ? Papa veut me tuer si je touche à la platine.",
    ] },

  grandpere_jt: { mood: "content",
    bubble: "J'ai vu construire ce mur en 61. Je vais le voir tomber en 89. C'est la fin de quelque chose, ma petite.",
    say: "Grand-père. Il a le regard qui brille. Il a connu l'après-guerre, il a vu ce mur monter — il le voit tomber.",
    chitchat: [
      "J'ai vu tomber le mur, comme j'ai vu tomber le maréchal. Deux fois dans une vie, ce n'est pas rien.",
      "En 61, personne n'aurait parié un franc là-dessus. Regardez-moi ces gens qui dansent.",
      "Enregistrez, enregistrez ! Vos enfants voudront voir ça.",
    ] },

  cadrer_evenement: { modal: "cadrer_evenement",
    needMsg: "Clique sur la télé pour rejoindre la rédaction du JT du soir." },

  papa_jt: { mood: "neutre",
    bubble: "…",
    say: "Papa. Absorbé, muet devant l'écran. Il ne pensait pas voir ça de son vivant.",
    chitchat: [
      "Trente ans que ce mur est debout. Trente ans qu'on nous dit qu'il ne tombera jamais.",
      "Je vais garder cette cassette VHS toute ma vie. Toute ma vie.",
      "Chuuut… j'écoute le journaliste.",
    ] },

  maman_jt: { mood: "content",
    bubble: "Allô, Mamie ? Allume la deux ! Berlin ! LE MUR ! Non mais tu te rends compte ?",
    say: "Maman appelle grand-mère au téléphone à fil. Elle veut que TOUT LE MONDE regarde en même temps.",
    chitchat: [
      "Allô, Sylvie ? Allume la télé, vite ! … Comment ça, tu regardais un film ? Change de chaîne !",
      "Ma mère habite à côté de Strasbourg. Elle entend parler allemand tous les jours. Elle doit être bouleversée.",
      "J'ai appelé toute la famille. Tout le monde regarde en direct, dans son salon. C'est fou, non ?",
    ] },

  ado_jt: { mood: "neutre",
    bubble: "C'est quoi ce mur, en fait ? Pourquoi ils l'ont mis, pourquoi ils le cassent ?",
    say: "L'ado, 13 ans. Elle voit la joie sans comprendre pourquoi. Une image qui la marquera quand même.",
    chitchat: [
      "Papa m'a expliqué trois fois. J'ai retenu qu'il y avait deux Allemagnes. Pas plus.",
      "Mes copines vont pas y croire demain au collège. Je vais tout leur raconter.",
      "Je peux enregistrer sur ma cassette moi aussi ? Papa veut me tuer si je touche à la platine.",
    ] },

  grandpere_jt: { mood: "content",
    bubble: "J'ai vu construire ce mur en 61. Je vais le voir tomber en 89. C'est la fin de quelque chose, ma petite.",
    say: "Grand-père. Il a le regard qui brille. Il a connu l'après-guerre, il a vu ce mur monter — il le voit tomber.",
    chitchat: [
      "J'ai vu tomber le mur, comme j'ai vu tomber le maréchal. Deux fois dans une vie, ce n'est pas rien.",
      "En 61, personne n'aurait parié un franc là-dessus. Regardez-moi ces gens qui dansent.",
      "Enregistrez, enregistrez ! Vos enfants voudront voir ça.",
    ] },

  cadre_presse: { mood: "neutre",
    bubble: "Un Monde et un ticket de métro, s'il vous plaît. Vite, je suis pressé.",
    say: "Un cadre du quartier. Il achète Le Monde tous les matins depuis douze ans — sans jamais le lire dans le métro.",
    chitchat: [
      "Toujours Le Monde. Toujours. Depuis que je suis étudiant.",
      "J'ai essayé Libé une fois. Trop de couleur pour moi.",
    ] },

  lyceenne: { mood: "content",
    bubble: "Star Hebdo est arrivé ! Il y a Sabrina en couverture. Ma mère va râler mais je le lirai sous les couvertures.",
    say: "Une lycéenne devant le mag people. Achat plaisir, achat furtif — la moitié du kiosque vit de ces achats-là.",
    chitchat: [
      "L'année prochaine je passe au Nouvel Obs. Enfin, je crois. C'est ma sœur qui le lit, elle est prof.",
      "Tu savais qu'ils inventent la moitié des trucs sur les stars ? Ma mère me l'a dit.",
    ] },

  celine: { mood: "neutre",
    bubble: "Céline, 25 ans, cadre en informatique. On vient de me livrer un GRAVEUR de CD-Rom au bureau — la classe ! Aide-moi à graver mon premier disque. On dit qu'un CD dure 100 ans… on verra bien.",
    say: "Céline : le CD-Rom, censé être « inaltérable ». Sauf que 30 ans plus tard, la couche métallique se décolle.",
    jeu2Variants: [
      { bubble: "Al3x1A m'a emprunté un CD vierge, puis a couru le déposer dans le SALON DE 1969, sur le téléviseur. Souvenir lunaire.",
        say: "Céline renvoie AU SALON 1969, sur le téléviseur." },
      { bubble: "Elle a laissé un exemplaire dans la chambre d'ado de Julien, sur sa radio-cassette. Camouflé au milieu des tubes.",
        say: "Céline renvoie À LA CHAMBRE 1985, sur la radio-cassette." },
      { bubble: "Elle a laissé un exemplaire ICI, sur l'imprimante matricielle à gauche. Combien de temps sera-t-il encore lisible ?",
        say: "Céline : ICI AU BUREAU 1990, sur l'imprimante matricielle à gauche." },
    ] },

  graver_cd: { modal: "graver_cd", needsFlag: "cd_charge",
    needMsg: "Insère d'abord un CD-Rom vierge dans le lecteur du PC (glisse la pile de CD sur l'unité centrale)." },
};

/* ------------------------------------------------------------
   LA FICHE DU CHAPITRE
   ------------------------------------------------------------ */
const chapter = {
  id: "09-medias-masse",
  bandeau: "CHAPITRE 9 · MÉDIAS DE MASSE",
  date: "1969-1990",
  epoque: "Fin XXe siècle",
  emoji: "📺",

  titre: "MARTINE",
  sousTitre: "Machine À Remonter le Temps Intelligente Néanmoins Excellente",
  presentationTitre: "Chapitre 9 — Les médias entrent à la maison.",
  presentation: "En vingt ans, la télévision, le magnétoscope, le CD et l'ordi entrent dans chaque foyer. Trois arrêts : la Lune en direct (1969), une chambre d'ado (1985), un bureau (1990). Et n'oublie pas la disquette de Julien — on la retrouvera dans 30 ans.",
  accroche: "TV cathodique 📺 · cassettes 📼 · CD-Rom 💿 · disquette 3½ » 💾",

  finTitre: "SAUT TEMPOREL RÉUSSI",
  finTexte: "« Circuits rechargés à {pct} %. Trois révolutions en vingt ans : la Lune en direct, l'enregistrement chez soi, la gravure sur CD. Chaque support s'est vendu comme « éternel ». Regarde ta frise : ça dure de moins en moins. J'ai gardé la disquette de Julien — on va voir ce qu'elle vaut aujourd'hui. » — MARTINE",

  required: 5,
  startScene: 0,
  destination: "XXIe SIÈCLE",
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
  portraits: {
    nathalie: PortraitNathalie,
    julien: PortraitJulien,
    celine: PortraitCeline,
  },
  carte: CarteMedias,
};

export default chapter;
