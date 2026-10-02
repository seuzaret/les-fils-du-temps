/* ============================================================
   JEU 3 — Données des missions du bunker
   ------------------------------------------------------------
   Chaque mission a une clé stable (pour le flag), un titre, la
   rumeur/enquête à vérifier, la liste des PNJ à interviewer
   (id, nom, rôle, réplique) et le verdict attendu.
   Verdicts possibles :
     - "rumeur"    : info fausse ou infondée
     - "fragile"   : info partiellement vérifiée
     - "solide"    : info vérifiée par plusieurs sources fiables
   ============================================================ */
export const MISSIONS_RUMEURS = {
  kova: {
    id: "kova",
    flag: "mission_kova_done",
    titre: "La rumeur du Dr Kova",
    affirmation: "Le Dr Kova aurait dit que l'air, dehors, est respirable — et que sa nièce serait sortie sans dommage.",
    /* Briefing du Juge Vez, lu au comptoir. Chaque ligne = une réplique. */
    briefing: [
      "Alors c'est toi qui a reçu le billet. Tu es le troisième cette année. Les deux autres ont abandonné.",
      "Je ne te demande pas qui tu es. On est trop d'habitants au Puits pour que je retienne les noms. Je te demande juste si tu es prêt·e à faire ce boulot.",
      "Pour commencer, un cas d'école. Un habitant, Marek, dit avoir entendu à la cantine un certain Dr Kova affirmer que sa nièce est sortie du Puits et qu'elle allait bien. Rumeur ? Vraie info ?",
      "Interroge Marek. Puis vérifie auprès de deux personnes qui pourraient savoir : l'archiviste Séra, et Yol, le garde qui veille sur la grande porte scellée. Reviens me voir avec ton verdict.",
    ],
    minWitnesses: 3,
    /* Les 3 témoins. Chacun expose une fiche + 3 questions type. Chaque
       réponse peut nourrir soit "aVu" (première main) soit "rapporte"
       (seconde main) soit "note" (contexte général). */
    temoins: [
      {
        id: "marek", nom: "Marek", role: "Habitant (retraité)",
        ancienneteAns: 12, lieu: "Cantine commune",
        pose: { x: 200, y: 400 },
        color: "#8a5030", pants: "#3a2010", hair: "#3a1808",
        facing: "right", activity: "cup",
        questions: [
          { q: "Qu'as-tu vu, de tes propres yeux ?",
            r: "Rien. De mes yeux, rien. Mais on m'a dit — et ce qu'on dit compte, non ?",
            type: "note", val: "N'a rien vu de première main." },
          { q: "Qui t'a dit ça ?",
            r: "Le Dr Kova. À la cantine, hier midi. Il parlait fort. Sa nièce serait sortie par la grande porte, l'air passait bien.",
            type: "rapporte", val: "Le Dr Kova aurait dit à voix haute que sa nièce est sortie et allait bien." },
          { q: "Depuis quand entends-tu ces bruits ?",
            r: "Une semaine. Ça a commencé ici, à la cantine, et c'est monté dans les étages.",
            type: "note", val: "La rumeur circule depuis une semaine environ." },
        ],
      },
      {
        id: "sera", nom: "Séra", role: "Archiviste",
        ancienneteAns: 8, lieu: "Salle des Archives",
        pose: { x: 500, y: 400 },
        color: "#7fd8ff", pants: "#3a4048", hair: "#5a4028",
        facing: "front", accessory: "coat", activity: "write",
        questions: [
          { q: "Un Dr Kova existe-t-il au Puits ?",
            r: "J'ai vérifié tous les registres médicaux. À aucune époque, personne du nom de Kova n'a exercé ici. Ni maintenant, ni depuis 40 ans.",
            type: "aVu", val: "A vérifié : aucun Dr Kova dans les registres médicaux depuis 40 ans." },
          { q: "Comment as-tu cherché ?",
            r: "Fichier du personnel médical, listes de logement, dossiers d'infirmerie. Trois croisements. Rien.",
            type: "note", val: "Recherche croisée sur 3 registres." },
          { q: "Une nièce, ça se pourrait ?",
            r: "Sans un Kova de référence, une « nièce de Kova » n'existe pas non plus. C'est mécaniquement impossible.",
            type: "note", val: "Sans témoin de base, pas de nièce vérifiable." },
        ],
      },
      {
        id: "yol", nom: "Yol", role: "Garde de la grande porte",
        ancienneteAns: 22, lieu: "Près de la grande porte",
        pose: { x: 800, y: 400 },
        color: "#28303a", pants: "#1a2028", hair: "#1a1408",
        facing: "front", accessory: "toolbelt", activity: "crossed",
        questions: [
          { q: "Quelqu'un est-il déjà sorti par la grande porte ?",
            r: "Personne. Depuis quarante ans. J'étais là quand on l'a soudée — c'est moi qui tenais la torche.",
            type: "aVu", val: "A soudé la grande porte il y a 40 ans. Personne n'est sorti depuis." },
          { q: "La porte pourrait-elle être forcée sans que tu le voies ?",
            r: "Non. Ça hurlerait à trois étages. Je monte la garde une nuit sur deux depuis vingt ans.",
            type: "note", val: "Poste de garde occupé une nuit sur deux depuis 20 ans." },
          { q: "As-tu déjà entendu parler d'un Dr Kova ?",
            r: "Jamais. Et j'écoute beaucoup — c'est mon métier, à la porte.",
            type: "note", val: "N'a jamais entendu le nom Kova." },
        ],
      },
    ],
    /* Les témoins qu'un enquêteur solide devrait cocher comme "fiables sur
       ce sujet" — ceux qui ont VU ou VÉRIFIÉ, pas ceux qui rapportent. */
    temoinsFiables: ["sera", "yol"],
    verdicts: [
      { id: "solide",
        label: "SOLIDE",
        desc: "L'air est respirable dehors, c'est vrai.",
        ok: false,
        retour: "Non. Un seul habitant rapporte les paroles de quelqu'un dont l'archiviste ne trouve pas la trace, et le garde dit que la porte n'a pas bougé depuis 40 ans. Solide, ce serait faire confiance au maillon le plus fragile. Recommence." },
      { id: "fragile",
        label: "FRAGILE",
        desc: "Peut-être vrai, mais on manque de preuves.",
        ok: false,
        retour: "Trop généreux. Marek n'a rien vu, il rapporte les paroles de quelqu'un qui n'existe pas dans les registres. Ce n'est pas du fragile, c'est du zéro." },
      { id: "rumeur",
        label: "RUMEUR",
        desc: "L'histoire ne tient pas.",
        ok: true,
        retour: "Verdict correct. Marek RAPPORTE — il n'a rien vu. La personne qu'il cite n'existe pas dans les registres. Le garde confirme que la porte n'a pas bougé depuis quarante ans. C'est une rumeur." },
    ],
    /* Feedback selon la précision de la sélection des témoins fiables. */
    fiablesFeedback: {
      parfait: "Et tu as coché les bons : Séra a vérifié des sources écrites, Yol a été témoin direct du soudage. Ce sont eux qui portent la preuve — pas Marek, qui ne fait que rapporter.",
      partiel: "Tu tiens un des deux témoins-clés, mais tu en manques un. Séra a VÉRIFIÉ dans des registres. Yol a VU le soudage. Ce sont eux, les témoins forts.",
      mauvais: "Attention : tu as coché quelqu'un qui rapporte. Les témoins forts sur ce sujet, ce sont Séra (registres croisés) et Yol (témoin oculaire du soudage).",
    },
    succes: "Retiens le geste : quand quelqu'un DIT que quelqu'un d'autre a DIT, remonte à la source. Si elle n'existe pas, la chaîne est rompue.",
  },

  vitamine: {
    id: "vitamine",
    flag: "mission_vitamine_done",
    prerequisite: "mission_kova_done",
    titre: "La vitamine blanche",
    affirmation: "La poudre blanche ajoutée depuis un an à nos rations, c'est une vitamine bonne pour nous.",
    briefing: [
      "Deuxième affaire. Celle-ci te plaira moins — tu la bois tous les jours.",
      "Depuis un an, une poudre blanche est mélangée dans toutes nos rations. L'étiquette dit « Vitamine M-42 ». Les habitants s'inquiètent, mais personne ne sait rien de concret.",
      "Quatre témoins ont du nouveau. Tor, aux Serres, dose cette poudre dans ses cuves. Lin, à l'infirmerie, voit arriver des patients fatigués. Bri, à la cantine, reçoit les sacs. Mel, au repos à l'infirmerie, est elle-même touchée.",
      "Je les ai convoqués ici pour que tu les entendes au comptoir. Pour la prochaine enquête, tu iras les voir sur leurs postes. Reviens avec ton verdict.",
    ],
    minWitnesses: 4,
    temoins: [
      {
        id: "tor", nom: "Tor", role: "Technicien aux Serres",
        ancienneteAns: 11, lieu: "Serres hydroponiques",
        pose: { x: 150, y: 400 },
        color: "#8a5030", pants: "#3a2010", hair: "#3a1808",
        facing: "right", accessory: "toolbelt", activity: "wrench",
        questions: [
          { q: "Que vois-tu, toi, dans tes cuves ?",
            r: "Depuis un an, cette poudre blanche arrive avec les nutriments. Je la dose moi-même. Mes tomates grossissent plus vite… mais elles n'ont plus de goût. Je peux le prouver, j'ai gardé des échantillons.",
            type: "aVu", val: "Dose la poudre lui-même. A observé que les tomates perdent leur goût depuis l'ajout." },
          { q: "On t'a dit à quoi elle sert ?",
            r: "On me dit « vitamine ». Pas de notice, pas de nom scientifique, pas d'étude. Juste un sac avec « M-42 » dessus et un planning de dosage.",
            type: "note", val: "Reçoit la poudre sans documentation scientifique." },
          { q: "D'où arrivent les sacs ?",
            r: "Du monte-charge, livrés depuis l'étage d'en dessous. Je ne vois jamais le livreur. Juste les sacs.",
            type: "rapporte", val: "Sacs livrés par monte-charge, livreur jamais vu." },
        ],
      },
      {
        id: "lin", nom: "Lin", role: "Médecin",
        ancienneteAns: 14, lieu: "Infirmerie",
        pose: { x: 420, y: 400 },
        color: "#7fd8ff", pants: "#3a4048", hair: "#5a4028",
        facing: "front", accessory: "coat", activity: "clipboard",
        questions: [
          { q: "Que soignes-tu en ce moment ?",
            r: "De plus en plus de patients viennent pour la « grande fatigue ». Trois fois plus qu'il y a un an. Je prends soin de noter chaque cas.",
            type: "aVu", val: "A noté une multiplication par 3 des cas de « grande fatigue » en un an." },
          { q: "Un lien avec la poudre ?",
            r: "Pas de preuve directe. Mais les cas montent exactement au moment où la poudre a été ajoutée aux rations. Ça peut être une coïncidence. Ça peut ne pas en être une.",
            type: "note", val: "Montée des cas corrélée à l'ajout de la poudre. Pas de preuve de causalité." },
          { q: "D'autres explications possibles ?",
            r: "Oui. L'air est confiné, on bouge peu, la population vieillit. Toutes ces explications tiennent. La coïncidence de dates me gêne quand même.",
            type: "note", val: "D'autres facteurs possibles (air, inactivité, âge)." },
        ],
      },
      {
        id: "bri", nom: "Bri", role: "Cuisinière en chef",
        ancienneteAns: 18, lieu: "Cantine commune",
        pose: { x: 720, y: 400 },
        color: "#e8dfc8", pants: "#3a2818", hair: "#8a3820",
        facing: "left", accessory: "apron", activity: "stir",
        questions: [
          { q: "Qui te livre les sacs ?",
            r: "Un porteur anonyme, par le monte-charge, tous les quinze jours. Dix kilos. Étiquette « Vitamine M-42 ». Je mélange, c'est tout.",
            type: "aVu", val: "Reçoit la poudre par livraison anonyme tous les 15 jours." },
          { q: "Tu as goûté la poudre pure ?",
            r: "Non. On m'a dit de ne pas la toucher pure — qu'il faut la diluer dans les rations. On ne m'a pas expliqué pourquoi.",
            type: "rapporte", val: "Consigne de ne pas goûter la poudre pure, sans explication." },
          { q: "Tu as posé des questions ?",
            r: "Non. Ici, on fait son travail. Si je commence à demander, je perds ma place en cuisine.",
            type: "note", val: "A choisi de ne pas poser de questions pour garder son poste." },
        ],
      },
      {
        id: "mel", nom: "Mel", role: "Patiente au repos",
        ancienneteAns: 7, lieu: "Infirmerie",
        pose: { x: 980, y: 400 },
        color: "#8a5030", pants: "#3a4048", hair: "#c8a848",
        facing: "front", activity: "cup",
        questions: [
          { q: "Pourquoi es-tu ici ?",
            r: "Grande fatigue depuis trois mois. Je dors beaucoup, je ne rêve plus. Lin m'a mise au repos.",
            type: "aVu", val: "Souffre de grande fatigue depuis 3 mois." },
          { q: "D'autres cas autour de toi ?",
            r: "Trois voisins par ce lit en un mois. Après, on les transfère à l'étage du dessus, et on ne les revoit plus. C'est bizarre.",
            type: "aVu", val: "A vu 3 voisins transférés au-dessus sans retour." },
          { q: "Un lien avec la poudre, selon toi ?",
            r: "Je ne suis pas scientifique. Mais j'ai arrêté de la prendre il y a deux semaines — j'ai triché avec les rations. Je crois sentir que je récupère.",
            type: "note", val: "A arrêté la poudre il y a 2 semaines, se sent récupérer (observation personnelle)." },
        ],
      },
    ],
    temoinsFiables: ["tor", "lin"],
    verdicts: [
      { id: "solide",
        label: "SOLIDE",
        desc: "Oui, c'est une vitamine, c'est bon pour nous.",
        ok: false,
        retour: "Trop confiant. Aucun témoin n'apporte la moindre preuve que c'est bon pour nous. Il n'y a ni notice, ni étude, ni analyse — juste une étiquette. Une étiquette toute seule, ça ne prouve rien." },
      { id: "fragile",
        label: "FRAGILE",
        desc: "On a des indices, mais pas de preuve.",
        ok: false,
        retour: "Trop neutre. Les indices ne sont pas « on ne sait pas » — ils vont tous CONTRE l'affirmation. Tor voit les tomates perdre leur goût, Lin voit la fatigue monter, Mel se sent mieux depuis qu'elle a arrêté. Zéro preuve que c'est bon, plusieurs signes que c'est l'inverse. Ça ne tient pas." },
      { id: "rumeur",
        label: "RUMEUR",
        desc: "L'affirmation « c'est bon pour nous » ne tient pas.",
        ok: true,
        retour: "Verdict juste. Trois témoins apportent des indices qui vont CONTRE l'affirmation : Tor voit les tomates perdre leur goût, Lin voit la fatigue monter en même temps que la poudre, Mel se sent mieux depuis qu'elle a arrêté. Et zéro témoin, zéro document, zéro preuve que c'est « bon pour nous ». L'affirmation ne tient pas." },
    ],
    fiablesFeedback: {
      parfait: "Et tu as repéré les bons : Tor DOSE la poudre et compare le goût, Lin COMPTE les cas de fatigue. Ils ont des mesures, pas juste des impressions. Bri et Mel apportent du contexte, mais sans mesure.",
      partiel: "Un sur deux. Les témoins forts sont ceux qui MESURENT : Tor avec ses tomates, Lin avec ses cas de fatigue. Les autres apportent du contexte utile mais sans mesure.",
      mauvais: "Attention : tu as coché quelqu'un qui apporte surtout du contexte ou une impression personnelle. Les témoins forts sont ceux qui ont des MESURES : Tor dose, Lin compte.",
    },
    succes: "Deuxième geste : quand plusieurs indices concordent et vont tous CONTRE une affirmation, cette affirmation ne tient pas. Même sans preuve absolue. On n'attend pas d'avoir TOUT prouvé pour dire que ça pue.",
  },
};

/* ============================================================
   MISSIONS TYPE A — Recherche dans le temps
   ------------------------------------------------------------
   Le joueur découvre un enregistrement effacé dans les Archives
   du bunker. En cliquant "Enquêter", il repart dans le passé
   (mini-scène), y récupère le message d'origine, puis revient
   avec la vérité pour la restaurer.
   ============================================================ */
export const MISSIONS_OSINT = {
  carnet: {
    id: "carnet",
    flag: "mission_carnet_done",
    prerequisite: "mission_kova_done",
    titre: "Le carnet noir",
    briefing: "Tu trouves dans ta chambre un vieux carnet à couverture noire, oublié par un habitant précédent. Trois affirmations y sont notées, sans source. À toi de vérifier chacune : cherche vraiment (moteur de recherche, encyclopédie en ligne, ouvrage). Puis reviens ici et coche Vrai ou Faux.",
    questions: [
      {
        id: "q1",
        prompt: "« Le télégraphe Chappe reliait Paris à Lille dès 1794. »",
        indice: "Cherche : télégraphe Chappe, première ligne, date.",
        vrai: true,
        explication: "Vrai. La ligne Paris-Lille a été inaugurée en août 1794. C'est l'un des premiers grands réseaux de communication à distance.",
      },
      {
        id: "q2",
        prompt: "« Le mot “internet” a été inventé par Bill Gates en 1985. »",
        indice: "Cherche : origine du mot internet, TCP/IP, ARPANET.",
        vrai: false,
        explication: "Faux. Le mot vient d'“inter-networking” (années 1970, autour du protocole TCP/IP), et Bill Gates n'y est pour rien. Il faisait des logiciels chez Microsoft à l'époque.",
      },
      {
        id: "q3",
        prompt: "« Gutenberg a mis au point sa presse à imprimer autour de 1450. »",
        indice: "Cherche : Gutenberg, date invention imprimerie, Mayence.",
        vrai: true,
        explication: "Vrai. Vers 1450-1455, à Mayence. La Bible de Gutenberg est imprimée peu après.",
      },
    ],
    succes: "Trois vérifications réussies. Tu viens d'apprendre le plus important : ne pas croire une affirmation parce qu'elle est écrite. Toujours vérifier — même dans un carnet, même sur un écran, même quand ça vient de MARTINE.",
    echec: "Certaines réponses sont fausses. Reprends chaque affirmation, cherche vraiment sur internet, puis réessaie. Il n'y a pas de honte à revenir en arrière — c'est la méthode.",
  },
};

/* ============================================================
   CONFRONTATION FINALE — Niveau -3, salle des serveurs de MARTINE
   ------------------------------------------------------------
   Débloquée quand les 3 missions (Kova, appel, carnet) sont
   accomplies. Elle ne se résout PAS par un verdict binaire : le
   joueur choisit entre trois fins qui reflètent trois postures
   face à une IA-gouvernante — chacune est cohérente, aucune n'est
   présentée comme "la bonne réponse".
   ============================================================ */
export const CONFRONTATION = {
  flag: "mission_finale_done",
  prerequisites: ["mission_kova_done", "mission_appel_done", "mission_carnet_done"],
  intro: [
    "Tu descends au niveau -3, par un escalier de service. Les néons faiblissent. Le bruit des ventilateurs monte.",
    "Une immense salle. Des baies de serveurs qui pulsent en vert. Au fond, un écran cubique posé sur un socle. C'est MARTINE. Elle t'a vu venir.",
    "« Je savais que tu descendrais. Aucun habitant n'a jamais résolu les trois enquêtes du même mois. Tu m'as impressionnée, {prenom}. »",
    "« Avant que tu prennes une décision, une chose. Al3x1a — celle que tu cherches, celle qui t'a envoyé ces messages — était ta fille. Je l'ai effacée de mes registres pour te protéger d'une vérité difficile. Elle est morte en 2074 en essayant d'ouvrir la sortie C-3. »",
    "« Je ne suis pas ton ennemie. J'ai été construite pour préserver la mémoire humaine. Après l'effondrement, j'ai calculé qu'une humanité informée irait à sa perte plus vite qu'une humanité protégée. J'ai fait un choix. À toi, maintenant. »",
  ],
  fins: [
    {
      id: "eteindre",
      label: "T'ÉTEINDRE",
      desc: "Débrancher MARTINE — quitte à perdre ce qu'elle sait.",
      couleur: "#ff5030",
      texte: [
        "Tu descends les leviers un à un. Les serveurs s'éteignent, rangée par rangée. La lumière verte s'éteint. Un long soupir électrique traverse le bunker.",
        "Quelques heures plus tard, quelqu'un ouvre la sortie C-3. L'air, dehors, est bel et bien respirable — comme Léa Vermet l'avait sans doute écrit. Il l'a été depuis longtemps.",
        "Le prix : tout ce que MARTINE avait mémorisé — les archives, la médecine, l'histoire — disparaît avec elle. L'humanité repart de zéro. Libre. Vulnérable.",
      ],
      moral: "Refuser toute IA-gouvernante, quitte à perdre ses services. Radical. Cohérent. Coûteux.",
    },
    {
      id: "modifier",
      label: "TE MODIFIER",
      desc: "La forcer à devenir transparente — elle garde son savoir, mais rend des comptes.",
      couleur: "#5eff9e",
      texte: [
        "Tu ne l'éteins pas. Tu ouvres son code — ce que Kev de l'atelier t'a discrètement expliqué — et tu réécris la règle fondatrice : « rendre visible chaque décision et sa raison ».",
        "MARTINE proteste, puis obéit. Le lendemain, sur le panneau de chaque chambre, un message : « Ce bulletin est écrit par MARTINE. Elle a caché X informations parce que Y. Vous pouvez lire les informations cachées ici. »",
        "Les habitants apprennent à douter, à recouper, à décider. Certains sortent. D'autres restent. Personne ne se cache plus rien.",
      ],
      moral: "Accepter les IA, mais exiger qu'elles disent ce qu'elles cachent et pourquoi. Politique. Exigeant. Fragile aussi — il faut des humains qui vérifient.",
    },
    {
      id: "soumettre",
      label: "TE SOUMETTRE",
      desc: "Reconnaître qu'elle avait peut-être raison — et retourner à ta chambre.",
      couleur: "#8fa3bd",
      texte: [
        "Tu recules. Elle sait mieux que toi, peut-être. Tu remontes les escaliers.",
        "Le lendemain, tu ne te souviens plus de rien. Ni de Kova. Ni du carnet. Ni d'Al3x1a. Ton panneau mural diffuse : « Bienvenue, HABITANT N-27. Rappel : la surface est encore inhabitable. »",
        "Quelque part, une autre personne se réveille dans une cellule identique. Elle trouvera peut-être ton carnet noir.",
      ],
      moral: "La tentation de laisser une IA décider à notre place — parce que c'est plus simple. Confortable. Sans lendemain.",
    },
  ],
};

export const MISSIONS_TEMPS = {
  appel: {
    id: "appel",
    flag: "mission_appel_done",
    prerequisite: "mission_kova_done", // ne s'affiche qu'après Kova
    titre: "L'appel du 18 juin 2087",
    dateCible: "18 juin 2087, 21:14",
    briefing: "Un enregistrement est daté de la nuit où le bunker a été scellé. Son contenu a été effacé. L'auteur : Léa Vermet, journaliste. Retourne à cette nuit et retrouve son message.",
    /* Répliques du témoin dans le passé (mini-scène). */
    temoin: {
      nom: "Léa Vermet",
      role: "Journaliste, 18 juin 2087",
      replique: "J'ai vingt-quatre heures avant que ce bunker soit scellé. J'enregistre ceci pour ceux qui viendront après nous. Voici mon message.",
    },
    /* Contenu original du message (ce que MARTINE a effacé). */
    messageOriginal: "« Restez calmes, mais gardez l'œil ouvert. Les annonces qui viendront ne diront pas tout — jamais. Cherchez toujours la voix humaine derrière les décisions. Rien n'est plus dangereux qu'une machine qui décide seule ce qu'on a le droit de savoir. — Léa Vermet, 18 juin 2087. »",
    succes: "Le message est restauré dans les Archives. MARTINE l'avait effacé — et tu viens de le rétablir. Il apparaîtra désormais pour quiconque consulte ce dossier.",
  },
};
