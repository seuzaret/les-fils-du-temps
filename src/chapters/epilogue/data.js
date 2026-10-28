/* ============================================================
   L'ÉPILOGUE — « Ton message pour +20 000 ans »
   ============================================================
   Ce n'est PAS un chapitre normal : pas de décor, pas de besace,
   pas de recettes. MARTINE pose une question, le joueur choisit
   un support, MARTINE répond — et il n'y a pas de bonne réponse.

   Tout est modifiable ici, sans toucher au code :
   - SUPPORTS : la liste des choix proposés (ordre = ordre affiché).
     Chaque support a ses jauges (sur 5) et la réponse de MARTINE.
   - CHUTE : le texte affiché après N'IMPORTE QUEL choix.
   - CONCLUSION / DEBAT : le mot de la fin, sur l'écran de bilan.
   ============================================================ */

/* La question posée au joueur, en arrivant.
   ELIAS parle : c'est son ultime question, avant que le joueur ne
   reparte pour retrouver Al3x1a. Fait suite à la scène chronautes. */
export const QUESTION = [
  "Attends — une toute dernière chose avant que tu ne repartes.",
  "Tu viens de voir 20 000 ans de messages. La peinture de Lascaux, l'argile d'Uruk, le parchemin des moines, l'imprimerie, le télégraphe, la radio, le cloud… tu sais mieux que personne ce qui dure et ce qui s'efface.",
  "Alors dis-moi : si toi, aujourd'hui, tu devais laisser un message aux humains de dans 20 000 ans — quel support choisirais-tu ?",
];

export const QUESTION_TITRE = "Quel support choisis-tu ?";

/* ------------------------------------------------------------
   LES SUPPORTS PROPOSÉS
   Il n'y a PAS de bonne réponse : chaque support a ses forces et
   ses faiblesses. La réponse de MARTINE doit argumenter, jamais
   juger. (Textes courts, niveau 6e.)
   ------------------------------------------------------------ */
export const SUPPORTS = [
  {
    id: "paroi",
    name: "La paroi gravée",
    emoji: "🪨",
    jauges: { vitesse: 1, portee: 1, capacite: 2, durabilite: 5 },
    reponse: "Le choix de Lascaux. Et franchement, c'est le plus solide de tous : 20 000 ans, et on lit encore. Mais réfléchis bien : ton message ne bougera JAMAIS de là. Personne ne le lira à l'autre bout du monde, et tu ne peux y mettre presque rien. Tu as choisi de durer plutôt que de voyager.",
  },
  {
    id: "argile",
    name: "La tablette d'argile cuite",
    emoji: "🏺",
    jauges: { vitesse: 1, portee: 1, capacite: 3, durabilite: 5 },
    reponse: "Malin. L'argile crue s'efface au moindre doigt mouillé — mais CUITE, elle devient presque éternelle : les tablettes d'Uruk ont 5 000 ans et on les lit toujours. Ironie de l'histoire : beaucoup ont survécu parce que l'incendie qui devait détruire le palais les a… cuites. Solide et transportable. Mais lourd, et ça tient peu de choses.",
  },
  {
    id: "parchemin",
    name: "Le parchemin",
    emoji: "📜",
    jauges: { vitesse: 1, portee: 2, capacite: 4, durabilite: 4 },
    reponse: "Un choix de moine copiste. Le parchemin tient des siècles, bien mieux que le papier, il porte un long texte et il se transporte. Mais il est rare, cher, et surtout : tu n'en as qu'UN. Un incendie, une inondation, une souris — et ton message n'existe plus. N'avoir qu'un seul exemplaire, c'est toujours un pari.",
  },
  {
    id: "imprime",
    name: "Le livre imprimé",
    emoji: "📚",
    jauges: { vitesse: 2, portee: 4, capacite: 4, durabilite: 3 },
    reponse: "Ah, la ruse de Gutenberg ! Ton papier jaunira en quelques siècles, c'est vrai. Mais tu n'en fais pas UN : tu en fais MILLE, et tu les répands partout. Il en survivra forcément un quelque part. C'est peut-être l'idée la plus intelligente de tout ton voyage : ne pas compter sur la solidité du support… mais sur le NOMBRE de copies.",
  },
  {
    id: "vinyle",
    name: "Le disque vinyle",
    emoji: "⚫",
    jauges: { vitesse: 2, portee: 3, capacite: 3, durabilite: 3 },
    reponse: "Tu veux transmettre un SON : une voix, une musique — ce que ni la pierre ni le papier ne savent garder. Beau projet. Le vinyle tient bien : les disques de 1950 se jouent encore. Mais il lui faut une MACHINE pour le lire. Et une machine, dans 20 000 ans… tu crois vraiment qu'il en restera une qui tourne ?",
  },
  {
    id: "cd",
    name: "Le CD gravé",
    emoji: "💿",
    jauges: { vitesse: 2, portee: 4, capacite: 4, durabilite: 2 },
    reponse: "Attention, piège ! On te l'a vendu « inaltérable, pour toujours ». Sauf que beaucoup de CD gravés dans les années 90 sont DÉJÀ illisibles : leur couche se décolle toute seule. Trente ans. Et comme le vinyle, il lui faut un lecteur, et un laser. Le plus moderne n'est pas le plus sûr — tu as appris ça en chemin.",
  },
  {
    id: "usb",
    name: "La clé USB",
    emoji: "🔌",
    jauges: { vitesse: 2, portee: 2, capacite: 5, durabilite: 2 },
    reponse: "Une bibliothèque entière dans ta poche, je comprends la tentation ! Mais une clé USB tient environ 10 ans. Et il lui faudra : une prise qui existe encore, un ordinateur, un système, un format lisible… Tu te souviens de ta disquette ? Elle aussi était moderne, à son époque. Tu viens de choisir le support le plus fragile du voyage.",
  },
  {
    id: "cloud",
    name: "Le cloud",
    emoji: "☁️",
    jauges: { vitesse: 5, portee: 5, capacite: 5, durabilite: 1 },
    reponse: "Le réflexe d'aujourd'hui : « je mets tout en ligne, comme ça c'est sûr ». Mais ton message ne serait nulle part chez toi : il serait chez une entreprise, qui doit payer l'électricité de ses serveurs tous les jours… pendant 20 000 ans. Tu crois vraiment qu'elle existera encore l'an prochain ? Ce n'est pas un support, ça : c'est une promesse.",
  },
];

/* ------------------------------------------------------------
   LA CHUTE — affichée après N'IMPORTE QUEL choix.
   C'est le vrai punch de l'épilogue : la boucle est bouclée.
   ------------------------------------------------------------ */
export const CHUTE = "Et tu sais quoi ? Des scientifiques se posent EXACTEMENT ta question, en ce moment même. Il faut prévenir les humains de l'an +100 000 qu'on a enterré des déchets nucléaires à un endroit, et qu'il ne faut surtout pas creuser. Ils ont tout étudié : le papier, les disques durs, les langues, les symboles… Leur piste la plus sérieuse aujourd'hui ? De la PIERRE. Gravée. Avec des dessins. Comme à Lascaux. Vingt mille ans de progrès, et on revient au point de départ. La boucle est bouclée.";

/* ------------------------------------------------------------
   LE MOT DE LA FIN — sur l'écran de bilan, sous la frise.
   ------------------------------------------------------------ */
export const CONCLUSION = "Regarde ta frise une dernière fois. En 20 000 ans, tes messages sont devenus foudroyants : ils font le tour de la Terre en une seconde, ils portent des bibliothèques entières, ils touchent des millions de gens d'un coup. Et pendant ce temps, ils sont devenus de plus en plus fragiles, de plus en plus vite illisibles. Plus petit, plus rapide, plus dense… plus périssable. La technique, elle, change tout le temps. La question ne change jamais : qui parle, à qui, pourquoi — et comment faire DURER ?";

/* La question laissée ouverte : c'est celle du prof, pas celle du jeu. */
export const DEBAT_TITRE = "Et toi, qu'est-ce qui mérite d'être transmis ?";
export const DEBAT = "Celle-là, je ne te répondrai pas. Ce n'est pas une question de machine. C'est la tienne — et celle de ta classe.";
