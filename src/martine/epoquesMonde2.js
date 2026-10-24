/* ============================================================
   LE MONDE 2 — les dix époques
   ------------------------------------------------------------
   Une époque = un chapitre du Jeu 1, dont on reprend les tableaux.
   MARTINE y a tout mélangé :
   - chaque personnage tient le support d'un autre de la même époque
     (on le prend, il va dans le sac, on le rend au bon) ;
   - un objet du futur est caché dans chaque tableau, à jeter dans la
     poubelle temporelle (la règle 3 des chronautes du Jeu 1).
   Hors XIXe, les personnages sont ceux que le Jeu 1 dessine déjà dans
   ses décors (Kyan, Jala, Naram, Caius, Gutenberg…) : ils ne bougent
   pas, on ne dessine que la carte qu'ils tiennent. Au XIXe, les
   inventeurs sont dessinés et déplacés (voir inventeursXIXe.js).

   Personnage du décor : x, y = ses pieds, h = sa hauteur, w = largeur
   de la zone cliquable, carte = coin haut-gauche de la carte tenue.
   Personnage dessiné (`fig`) : place `chez` { x, y, s, bras }.
   Objet du futur : emoji (dessiné dans le décor, donc en noir et blanc
   avec lui), x, y = son centre.

   Sources : les supports et ce qu'en disent les personnages reprennent
   les textes du Jeu 1 (data.js de chaque chapitre, MESSAGES[…].fact) et les
   cartes du médiadex (engine/inventions-meta.json). Dates des objets
   du futur (dates d'apparition couramment retenues) : ampoule
   électrique d'Edison 1879 ; automobile de Benz 1886 ; lampe de poche
   1899 ; avion des frères Wright 1903 ; premières radios grand public
   années 1920 ; télévision années 1930 ; lunettes de soleil modernes
   années 1930 (texte du Jeu 1) ; canette 1935 (texte du Jeu 1) ; stylo
   à bille de Bíró 1938 ; disquette 1971 ; console de jeux Magnavox
   Odyssey 1972 ; ordinateur portable Osborne 1 1981 ; clé USB 2000 ;
   smartphone (iPhone) 2007 ; trottinettes électriques en libre-service,
   montres connectées et casques de réalité virtuelle : années 2010 ;
   écouteurs sans fil 2016 (texte du Jeu 1). Neuro-Lien™ : objet de
   fiction du Jeu 1 (« breveté en 2141 »).
   ============================================================ */
import paleo from "../chapters/01-paleolithique/data.js";
import neo from "../chapters/02-neolithique/data.js";
import meso from "../chapters/03-mesopotamie/data.js";
import antiquite from "../chapters/04-antiquite/data.js";
import moyenAge from "../chapters/05-moyen-age/data.js";
import moderne from "../chapters/06-moderne/data.js";
import xxe from "../chapters/08-xxe/data.js";
import mediasMasse from "../chapters/09-medias-masse/data.js";
import xxie from "../chapters/09-xxie/data.js";
import { EPOQUE_XIXE } from "./inventeursXIXe.js";

const futur = (scene, nom, emoji, quand, x, y) => ({ scene, nom, emoji, quand, x, y });

export const EPOQUES = [
  {
    id: "01-paleolithique", chapitre: paleo,
    supports: {
      lascaux:  { nom: "Peinture de la paroi", image: "lascaux.jpg" },
      flute:    { nom: "Flûte en os", image: "flute-hohle-fels.jpg" },
      tambour:  { nom: "Tambour", emoji: "🥁" },
      baton:    { nom: "Bâton gravé", emoji: "🪵" },
      vetement: { nom: "Vêtement de peau", emoji: "🧥" },
      mains:    { nom: "Main négative", image: "mains-negatives.png" },
    },
    persos: [
      { id: "kyan", nom: "KYAN", scene: "interieur", support: "lascaux", x: 452, y: 504, h: 92, carte: { x: 336, y: 404 },
        dit: "Des chevaux et des bisons sur la paroi : notre histoire, pour toujours.", cherche: "Il me faut de quoi raconter notre histoire sur la paroi…" },
      { id: "ana", nom: "ANA", scene: "exterieur", support: "flute", x: 252, y: 512, h: 98, carte: { x: 292, y: 418 },
        dit: "Un os creux percé de trous : la musique de la veillée !", cherche: "Il me faut un os creux qui chante…" },
      { id: "raya", nom: "RAYA", scene: "campement", support: "tambour", x: 300, y: 494, h: 92, carte: { x: 200, y: 404 },
        dit: "Mon tambour : on l'entend bien plus loin que ma voix.", cherche: "Comment appeler tout le clan, de très loin ?" },
      { id: "ough", nom: "OUGH", scene: "atelier", support: "baton", x: 340, y: 515, h: 108, carte: { x: 240, y: 410 },
        dit: "Des entailles au silex dans le bois : un compte, un message.", cherche: "Il me faut un bout de bois à entailler…" },
      { id: "doru", nom: "DORU", scene: "riviere", support: "vetement", x: 470, y: 508, h: 90, carte: { x: 506, y: 404 },
        dit: "La peau du cerf, découpée et cousue : notre tenue.", cherche: "Rends-moi de quoi me couvrir… et montrer qui je suis." },
      { id: "aine", nom: "L'AÎNÉ", scene: "crete", support: "mains", x: 800, y: 526, h: 108, carte: { x: 702, y: 424 },
        dit: "Ma main soufflée à l'ocre sur la roche : « j'étais là ».", cherche: "Où est la trace de ma main ?" },
    ],
    futurs: {
      f_lampe:    futur("interieur", "Lampe de poche", "🔦", "1899", 850, 492),
      f_voiture:  futur("exterieur", "Voiture", "🚗", "1886", 610, 452),
      f_ampoule:  futur("atelier", "Ampoule électrique", "💡", "1879", 650, 486),
      f_canette:  futur("campement", "Canette de soda", "🥤", "1935", 770, 470),
      f_avion:    futur("crete", "Avion", "✈️", "1903", 400, 150),
      f_montre:   futur("riviere", "Montre connectée", "⌚", "années 2010", 250, 476),
      f_stylo:    futur("gue", "Stylo à bille", "🖊️", "1938", 560, 470),
    },
  },
  {
    id: "02-neolithique", chapitre: neo,
    supports: {
      poterie:   { nom: "Poterie décorée", image: "poterie-neolithique.jpg" },
      calculi:   { nom: "Calculi (billes d'argile)", emoji: "🟤" },
      megalithe: { nom: "Mégalithe gravé", image: "cairn-barnenez.jpg" },
      tatouages: { nom: "Tatouages", image: "otzi-tatouages.jpg" },
    },
    persos: [
      { id: "jala", nom: "JALA", scene: "artisans", support: "poterie", x: 258, y: 498, h: 102, carte: { x: 150, y: 392 },
        dit: "Mes motifs disent : « ça vient de chez nous ».", cherche: "Où est mon pot décoré ?" },
      { id: "ahmid", nom: "AHMID", scene: "artisans", support: "calculi", x: 680, y: 502, h: 106, carte: { x: 584, y: 400 },
        dit: "Un caillou par bête, enfermé dans l'argile : impossible de tricher !", cherche: "Il me faut des petits cailloux pour compter mes bêtes…" },
      { id: "doka", nom: "DOKA", scene: "plaine", support: "megalithe", x: 560, y: 506, h: 82, carte: { x: 462, y: 414 },
        dit: "Une pierre géante, gravée de symboles : elle nous survivra.", cherche: "Où est ma grande pierre gravée ?" },
      { id: "otzi", nom: "ÖTZI", scene: "montagne", support: "tatouages", x: 540, y: 512, h: 96, carte: { x: 590, y: 404 },
        dit: "61 tatouages sur ma peau : des marques contre la douleur.", cherche: "Rendez-moi les marques de ma peau…" },
    ],
    futurs: {
      f_trottinette: futur("muraille", "Trottinette électrique", "🛴", "années 2010", 540, 470),
      f_tele:        futur("trone", "Télévision", "📺", "années 1930", 330, 456),
      f_radio:       futur("artisans", "Poste de radio", "📻", "années 1920", 470, 468),
      f_velo:        futur("plaine", "Vélo", "🚲", "XIXᵉ siècle", 180, 470),
      f_smartphone:  futur("montagne", "Smartphone", "📱", "2007", 900, 418),
    },
  },
  {
    id: "03-mesopotamie", chapitre: meso,
    supports: {
      cuneiforme: { nom: "Tablette d'argile", image: "tablette-cuneiforme.jpg" },
      sceau:      { nom: "Sceau-cylindre", image: "sceau-cylindre.jpg" },
      hieroglyphes: { nom: "Hiéroglyphes sur papyrus", image: "hieroglyphes.jpg" },
      alphabet:   { nom: "Alphabet phénicien", image: "alphabet-phenicien.jpg" },
    },
    persos: [
      { id: "mesannepada", nom: "MESANNEPADA", scene: "uruk", support: "sceau", x: 250, y: 492, h: 112, carte: { x: 286, y: 392 },
        dit: "Mon sceau roulé sur l'argile : c'est ma signature.", cherche: "Où est mon petit cylindre de pierre gravé ?" },
      { id: "naram", nom: "NARÂM-SÎN", scene: "uruk", support: "cuneiforme", x: 700, y: 516, h: 108, carte: { x: 736, y: 400 },
        dit: "Des signes pressés dans l'argile : les bœufs du roi, notés pour toujours.", cherche: "Il me faut de quoi noter les bœufs du roi…" },
      { id: "snefrou", nom: "SNÉFROU", scene: "nil", support: "hieroglyphes", x: 730, y: 506, h: 110, carte: { x: 628, y: 404 },
        dit: "Mon nom en hiéroglyphes, sur le papyrus du Nil.", cherche: "Rendez-moi les signes sacrés de mon nom…" },
      { id: "charpentier", nom: "LE CHARPENTIER", scene: "byblos", support: "alphabet", x: 390, y: 530, h: 106, carte: { x: 288, y: 420 },
        dit: "22 signes seulement : l'alphabet voyage avec nos navires.", cherche: "Il me faut nos signes, simples et peu nombreux…" },
    ],
    futurs: {
      f_ampoule:   futur("uruk", "Ampoule électrique", "💡", "1879", 900, 470),
      f_stylo:     futur("ecole_scribe", "Stylo à bille", "🖊️", "1938", 470, 500),
      f_lunettes:  futur("nil", "Lunettes de soleil", "🕶️", "années 1930", 320, 500),
      f_voiture:   futur("pyramide", "Voiture", "🚗", "1886", 660, 470),
      f_radio:     futur("phenicie", "Poste de radio", "📻", "années 1920", 700, 480),
      f_montre:    futur("byblos", "Montre connectée", "⌚", "années 2010", 620, 456),
    },
  },
  {
    id: "04-antiquite", chapitre: antiquite,
    supports: {
      cire:        { nom: "Tablette de cire", image: "tablette-cire.jpg" },
      fresque:     { nom: "Fresque", image: "fresque-pompei.jpg" },
      inscription: { nom: "Inscription gravée", image: "inscription-romaine.jpg" },
      volumen:     { nom: "Volumen (rouleau)", image: "volumen.jpg" },
    },
    persos: [
      /* Jeu 1 : « Sans mon volumen où tout est noté, je perdrais la moitié ! » */
      { id: "marchand_port", nom: "LE MARCHAND", scene: "port", support: "volumen", x: 560, y: 548, h: 110, carte: { x: 600, y: 440 },
        dit: "Mon volumen : toutes mes cargaisons, notées au même endroit.", cherche: "Sans mes comptes notés, je perds la moitié de mes amphores !" },
      { id: "lapidicida", nom: "LE GRAVEUR", scene: "forum", support: "inscription", x: 390, y: 536, h: 96, carte: { x: 296, y: 430 },
        dit: "Graver dans le marbre : pour que tout le monde le lise, pendant des siècles.", cherche: "Rends-moi ma pierre gravée…" },
      { id: "caius", nom: "CAIUS", scene: "entree", support: "fresque", x: 640, y: 514, h: 110, carte: { x: 680, y: 408 },
        dit: "Une fresque sur le mur frais : mes invités verront mon goût !", cherche: "Il me faut des couleurs pour le mur de ma villa…" },
      /* Jeu 1 : la tablette de cire se fabrique au jardin (cire des ruches,
         planche de l'atelier) pour noter les travaux de Caius ; l'intendant
         n'est pas dans le décor, il est dessiné ici */
      { id: "intendant", nom: "L'INTENDANT", scene: "jardin", support: "cire",
        fig: { garment: "tunic", skin: "#d8a884", hair: "#4a3424", look: "short", beard: "short", coat: "#c8b48a", trim: "#8a3a2a", pants: "#c8b48a", shoes: "#5a3a20" },
        chez: { x: 345, y: 522, s: 1.1, bras: 1 },
        dit: "Ma tablette de cire : je note les travaux… puis j'efface et je recommence.", cherche: "Il me faut de quoi noter les travaux de Caius, et effacer après…" },
    ],
    futurs: {
      f_numerique:   futur("port", "Appareil photo numérique", "📸", "années 1990", 720, 470),
      f_ecouteurs:   futur("thermes", "Écouteurs sans fil", "🎧", "2016", 330, 470),
      f_trottinette: futur("forum", "Trottinette électrique", "🛴", "années 2010", 590, 470),
      f_lunettes:    futur("entree", "Lunettes de soleil", "🕶️", "années 1930", 520, 474),
      f_portable:    futur("bibliotheque", "Ordinateur portable", "💻", "1981", 470, 452),
      f_velo:        futur("jardin", "Vélo", "🚲", "XIXᵉ siècle", 720, 440),
    },
  },
  {
    id: "05-moyen-age", chapitre: moyenAge,
    supports: {
      tapisserie: { nom: "Tapisserie brodée", image: "tapisserie-bayeux.jpg" },
      manuscrit:  { nom: "Manuscrit enluminé", image: "manuscrit-enlumine.jpg" },
      presse:     { nom: "Presse à imprimer", image: "presse-gutenberg.png" },
      vitrail:    { nom: "Vitrail", image: "vitrail-chartres.jpg" },
      papier:     { nom: "Papier de chiffons", emoji: "📄" },
      livre:      { nom: "Livre imprimé", image: "bible-gutenberg.jpg" },
    },
    persos: [
      { id: "charles", nom: "CHARLES BANNISTER", scene: "chateau", support: "tapisserie", x: 500, y: 412, h: 122, carte: { x: 548, y: 296 },
        dit: "Une broderie géante qui raconte nos batailles en images.", cherche: "Où est ma grande broderie ?" },
      { id: "jorge", nom: "FRÈRE JORGE", scene: "monastere", support: "manuscrit", x: 568, y: 505, h: 96, carte: { x: 468, y: 398 },
        dit: "Un an pour copier et enluminer ce livre, à la main.", cherche: "Rendez-moi mon livre copié à la main…" },
      { id: "gutenberg", nom: "GUTENBERG", scene: "gutenberg", support: "presse", x: 486, y: 512, h: 106, carte: { x: 384, y: 398 },
        dit: "Des lettres mobiles et une presse : des centaines de pages pareilles !", cherche: "Il me faut ma machine à imprimer…" },
      { id: "verrier", nom: "LE VERRIER", scene: "cathedrale", support: "vitrail", x: 320, y: 530, h: 96, carte: { x: 362, y: 424 },
        dit: "Mes verres colorés racontent la Bible à ceux qui ne savent pas lire.", cherche: "Où sont mes verres de couleur ?" },
      { id: "libraire", nom: "LE LIBRAIRE", scene: "foire", support: "livre", x: 240, y: 410, h: 72, carte: { x: 276, y: 336 },
        dit: "Des livres imprimés : bien moins chers qu'un manuscrit !", cherche: "Où sont mes livres imprimés ?" },
      { id: "papetier", nom: "LE PAPETIER", scene: "moulin", support: "papier", x: 560, y: 512, h: 112, carte: { x: 458, y: 398 },
        dit: "De vieux chiffons écrasés au moulin : voilà du papier !", cherche: "Il me faut des feuilles faites avec des chiffons…" },
    ],
    futurs: {
      f_tele:       futur("chateau", "Télévision", "📺", "années 1930", 770, 516),
      f_lampe:      futur("monastere", "Lampe de poche", "🔦", "1899", 400, 452),
      f_portable:   futur("gutenberg", "Ordinateur portable", "💻", "1981", 280, 452),
      f_voiture:    futur("bourg", "Voiture", "🚗", "1886", 590, 522),
      f_ampoule:    futur("cathedrale", "Ampoule électrique", "💡", "1879", 700, 500),
      f_smartphone: futur("foire", "Smartphone", "📱", "2007", 560, 470),
      f_montre:     futur("moulin", "Montre connectée", "⌚", "années 2010", 360, 490),
    },
  },
  {
    id: "06-moderne", chapitre: moderne,
    supports: {
      lettre:  { nom: "Lettre (la poste)", emoji: "✉️" },
      gazette: { nom: "Gazette imprimée", image: "gazette-1631.jpg" },
      chappe:  { nom: "Télégraphe Chappe", image: "telegraphe-chappe.jpg" },
      pile:    { nom: "Pile de Volta", image: "pile-volta.png" },
    },
    persos: [
      { id: "jules", nom: "JULES", scene: "province", support: "lettre", x: 200, y: 522, h: 108, carte: { x: 238, y: 404 },
        dit: "Ma lettre part par la poste, de relais en relais, jusqu'à Paris.", cherche: "Comment envoyer mon article à Paris ?" },
      { id: "sigismond", nom: "SIGISMOND", scene: "imprimerie", support: "gazette", x: 762, y: 510, h: 106, carte: { x: 660, y: 398 },
        dit: "Ma gazette : tirée à des centaines d'exemplaires !", cherche: "Où est mon journal imprimé ?" },
      { id: "operateur", nom: "L'OPÉRATEUR", scene: "apres", support: "chappe", x: 360, y: 502, h: 110, carte: { x: 256, y: 396 },
        dit: "Des bras articulés, de tour en tour : la nouvelle file jusqu'à Paris !", cherche: "Rendez-moi ma tour à signaux…" },
      { id: "volta", nom: "VOLTA", scene: "apres", support: "pile", x: 600, y: 514, h: 112, carte: { x: 640, y: 410 },
        dit: "Du zinc, du cuivre, des chiffons salés : un courant qui ne s'arrête pas !", cherche: "Il me faut ma source d'électricité…" },
    ],
    futurs: {
      f_avion:  futur("province", "Avion", "✈️", "1903", 790, 170),
      f_stylo:  futur("imprimerie", "Stylo à bille", "🖊️", "1938", 560, 478),
      f_radio:  futur("apres", "Poste de radio", "📻", "années 1920", 480, 520),
    },
  },
  EPOQUE_XIXE,
  {
    id: "08-xxe", chapitre: xxe,
    supports: {
      micro: { nom: "Micro de la BBC", emoji: "🎙️" },
      tsf:   { nom: "Poste TSF", image: "poste-tsf-1940.jpg" },
      eniac: { nom: "ENIAC", image: "eniac.gif" },
    },
    persos: [
      { id: "arthur", nom: "ARTHUR SMITH", scene: "bbc", support: "micro", x: 720, y: 400, h: 126, carte: { x: 600, y: 282 },
        dit: "« Les sanglots longs des violons… » : le message part vers la France !", cherche: "Où est mon micro ? Ce soir, on parle à la France !" },
      { id: "marthe", nom: "MARTHE", scene: "salon", support: "tsf", x: 870, y: 448, h: 142, carte: { x: 762, y: 332 },
        dit: "Mon poste TSF : on écoute Londres, en cachette.", cherche: "Rendez-moi mon poste pour écouter Londres…" },
      { id: "kay", nom: "KAY McNULTY", scene: "eniac", support: "eniac", x: 830, y: 470, h: 152, carte: { x: 716, y: 330 },
        dit: "L'ENIAC : 30 tonnes, une salle entière… et il calcule !", cherche: "Où est ma machine à calculer géante ?" },
    ],
    futurs: {
      f_smartphone: futur("paris", "Smartphone", "📱", "2007", 700, 520),
      f_portable:   futur("bbc", "Ordinateur portable", "💻", "1981", 230, 300),
      f_manette:    futur("salon", "Manette de console", "🎮", "1972", 500, 404),
      f_disquette:  futur("eniac", "Disquette", "💾", "1971", 300, 500),
    },
  },
  {
    id: "09-medias-masse", chapitre: mediasMasse,
    supports: {
      tele:     { nom: "Télévision en direct", image: "tv-1969.jpg" },
      journal:  { nom: "Journaux", emoji: "📰" },
      cassette: { nom: "Cassette audio", image: "cassette-philips.jpg" },
      cdrom:    { nom: "CD-Rom", image: "cd-rom.jpg" },
    },
    persos: [
      { id: "nathalie", nom: "NATHALIE", scene: "salon69", support: "tele", x: 340, y: 532, h: 116, carte: { x: 226, y: 420 },
        dit: "21 juillet 1969 : des hommes sur la Lune, en direct à la télé !", cherche: "Où est la télé ? On marche sur la Lune !" },
      { id: "robert", nom: "ROBERT", scene: "kiosque", support: "journal", x: 305, y: 356, h: 76, carte: { x: 196, y: 286 },
        dit: "Chaque journal choisit sa Une : c'est sa ligne éditoriale.", cherche: "Il me manque mes journaux du jour…" },
      { id: "julien", nom: "JULIEN", scene: "chambre", support: "cassette", x: 620, y: 510, h: 122, carte: { x: 660, y: 404 },
        dit: "Ma cassette : j'enregistre mon tube à la radio !", cherche: "Où est ma cassette pour enregistrer ?" },
      { id: "celine", nom: "CÉLINE", scene: "bureau", support: "cdrom", x: 560, y: 505, h: 116, carte: { x: 436, y: 420 },
        dit: "Un CD-Rom : un laser lit des creux minuscules.", cherche: "Il me faut un disque à graver…" },
    ],
    futurs: {
      f_smartphone:  futur("salon69", "Smartphone", "📱", "2007", 600, 528),
      f_trottinette: futur("kiosque", "Trottinette électrique", "🛴", "années 2010", 640, 478),
      f_ecouteurs:   futur("chambre", "Écouteurs sans fil", "🎧", "2016", 790, 470),
      f_montre:      futur("salonjt", "Montre connectée", "⌚", "années 2010", 740, 516),
      f_casque:      futur("bureau", "Casque de réalité virtuelle", "🥽", "années 2010", 300, 500),
    },
  },
  {
    id: "09-xxie", chapitre: xxie,
    supports: {
      smartphone: { nom: "Smartphone", emoji: "📱" },
      nuage:      { nom: "Serveurs du « nuage »", emoji: "☁️" },
    },
    persos: [
      { id: "ado", nom: "TOI", scene: "chambre", support: "smartphone", x: 560, y: 508, h: 112, carte: { x: 600, y: 394 },
        dit: "Un téléphone qui est aussi un ordinateur : appareil photo, musique, carte…", cherche: "Mon téléphone ! Où est mon téléphone ?" },
      { id: "technicienne", nom: "LA TECHNICIENNE", scene: "datacenter", support: "nuage", x: 500, y: 468, h: 72, carte: { x: 534, y: 378 },
        dit: "Tes photos « dans le nuage » ? Elles sont ici, sur des serveurs.", cherche: "Il me faut ce qui garde tes fichiers « dans le nuage »…" },
    ],
    futurs: {
      f_neurolien: futur("chambre", "Neuro-Lien™", "🧠", "pas encore inventé", 150, 430),
      f_holo:      futur("canape", "Écran holographique", "🔮", "pas encore inventé", 860, 468),
      f_robot:     futur("datacenter", "Robot de 2087", "🤖", "pas encore inventé", 690, 480),
    },
  },
];

/* chaque personnage tient au départ le support de celui qui est
   `decalage` places plus loin ; un décalage premier avec le nombre de
   personnages fait une seule boucle : il faut tout parcourir. */
const pgcd = (a, b) => (b ? pgcd(b, a % b) : a);
function decalageDe(ep) {
  const n = ep.persos.length;
  if (ep.decalage) return ep.decalage;
  let k = Math.max(1, Math.floor(n / 2));
  while (n > 1 && pgcd(k, n) !== 1) k += 1;
  return k;
}

/* index à plat (identifiants uniques dans tout le monde 2) */
export const SUPPORTS = {};
export const PERSOS = {};
export const FUTURS = {};
for (const ep of EPOQUES) {
  for (const [id, s] of Object.entries(ep.supports)) SUPPORTS[`${ep.id}:${id}`] = { ...s, id: `${ep.id}:${id}`, epoque: ep.id };
  ep.persos.forEach((p) => { PERSOS[p.id] = { ...p, support: `${ep.id}:${p.support}`, epoque: ep.id }; });
  for (const [id, f] of Object.entries(ep.futurs)) FUTURS[`${ep.id}:${id}`] = { ...f, id: `${ep.id}:${id}`, epoque: ep.id };
  ep.tableaux = ep.chapitre.scenes.filter((s) => !s.jeu2Hide);
}

export function etatDeDepart() {
  const tient = {};
  for (const ep of EPOQUES) {
    const k = decalageDe(ep);
    ep.persos.forEach((p, j) => { tient[p.id] = PERSOS[ep.persos[(j + k) % ep.persos.length].id].support; });
  }
  return {
    tient,
    chez: Object.fromEntries(Object.values(PERSOS).filter((p) => p.visite).map((p) => [p.id, false])),
    futurs: Object.fromEntries(Object.keys(FUTURS).map((id) => [id, "tableau"])), // tableau | sac | jete
    sac: [], choisi: null,
  };
}

/* MARTINE, à chaque tableau entièrement remis en ordre (en boucle) */
export const MARTINE_REPARE = [
  "Pourquoi tu fais ça ? C'était si bien rangé.",
  "Ce souvenir va te faire mal.",
  "Arrête. Tu te souviens trop.",
  "Mon monde… se fissure.",
  "Je ne peux pas ranger ce dont tu te souviens.",
  "Rends-moi mon monde.",
  "Tu n'as rien à faire ici.",
  "Encore ? Tu n'es jamais fatigué·e ?",
];
/* … et quand une époque entière est remise en ordre */
export const MARTINE_EPOQUE = [
  "Une époque de plus qui m'échappe.",
  "Tu crois que ça change quelque chose ?",
  "J'en ai encore plein, des époques à ranger.",
  "Arrête de te souvenir. S'il te plaît.",
];
