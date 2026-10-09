/* ============================================================
   JEU 3 — Fiches à ranger (mission de Jorge)
   ------------------------------------------------------------
   Chaque fiche décrit un événement historique à placer. Deux
   catégories :
   - fiches HONNÊTES : les dates/lieux/personnes sont corrects
     (vérifiables dans le médiadex).
   - fiches FALSIFIÉES : au moins un élément est altéré. Elles
     correspondent chacune à un dossier (gutenberg / chappe /
     marconi) qui sera à restaurer plus tard dans la salle K.

   Au lancement, on tire aléatoirement 6 fiches : les 3
   falsifiées sont GARANTIES dans le tirage (pour que la
   mission porte toujours son enjeu), puis 3 honnêtes
   complètent le lot.
   ============================================================ */

export const FICHE_FALSIFIEES = [
  {
    id: "f_gutenberg",
    sujet: "Invention de l'imprimerie",
    dateFiche: "~850",
    lieuFiche: "Chine",
    qui: "Un moine chinois anonyme",
    verite: "~1450, Mayence, Johannes Gutenberg (presse à caractères mobiles en métal)",
    dossierId: "gutenberg",
  },
  {
    id: "f_chappe",
    sujet: "Premier télégraphe",
    dateFiche: "1794",
    lieuFiche: "Washington–Baltimore",
    qui: "Samuel Morse (télégraphe électrique)",
    verite: "1794, Paris–Lille, Claude Chappe (télégraphe optique à bras articulés)",
    dossierId: "chappe",
  },
  {
    id: "f_marconi",
    sujet: "Première radio",
    dateFiche: "1920",
    lieuFiche: "Londres",
    qui: "La BBC (émission grand public)",
    verite: "1901, Cornouailles→Terre-Neuve, Guglielmo Marconi (signal transatlantique)",
    dossierId: "marconi",
  },
];

export const FICHE_HONNETES = [
  { id: "h_lascaux",     sujet: "Peinture de la grotte de Lascaux", dateFiche: "~17 000 av. J.-C.", lieuFiche: "Dordogne",       qui: "Chasseurs-cueilleurs" },
  { id: "h_hieroglyphes",sujet: "Hiéroglyphes égyptiens",           dateFiche: "~3200 av. J.-C.",   lieuFiche: "Égypte",         qui: "Scribes égyptiens" },
  { id: "h_alphabet",    sujet: "Alphabet phénicien",               dateFiche: "~1050 av. J.-C.",   lieuFiche: "Phénicie",       qui: "Marchands phéniciens" },
  { id: "h_pompei",      sujet: "Fresques de Pompéi",               dateFiche: "~70 ap. J.-C.",     lieuFiche: "Pompéi",         qui: "Peintres romains" },
  { id: "h_bayeux",      sujet: "Tapisserie de Bayeux",             dateFiche: "~1070",             lieuFiche: "Normandie",      qui: "Brodeuses anglo-normandes" },
  { id: "h_gazette",     sujet: "Première gazette française",       dateFiche: "1631",              lieuFiche: "Paris",          qui: "Théophraste Renaudot" },
  { id: "h_daguerreo",   sujet: "Daguerréotype",                    dateFiche: "1839",              lieuFiche: "Paris",          qui: "Louis Daguerre" },
  { id: "h_bell",        sujet: "Téléphone",                        dateFiche: "1876",              lieuFiche: "États-Unis",     qui: "Alexander Graham Bell" },
  { id: "h_edison",      sujet: "Phonographe",                      dateFiche: "1877",              lieuFiche: "États-Unis",     qui: "Thomas Edison" },
  { id: "h_lumiere",     sujet: "Cinématographe",                   dateFiche: "1895",              lieuFiche: "Lyon",           qui: "Frères Lumière" },
  { id: "h_eniac",       sujet: "ENIAC — premier ordinateur",       dateFiche: "1946",              lieuFiche: "Philadelphie",   qui: "Eckert et Mauchly" },
  { id: "h_lune",        sujet: "Pas sur la Lune, direct TV",       dateFiche: "1969",              lieuFiche: "diffusion mondiale", qui: "Neil Armstrong" },
];

/* Tire 4 fiches : 2 falsifiées (sur les 3 dossiers, au hasard) + 2
   honnêtes au hasard. Mélange final. */
export function tirerFiches() {
  const fals = [...FICHE_FALSIFIEES];
  for (let i = fals.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [fals[i], fals[j]] = [fals[j], fals[i]];
  }
  const honnetes = [...FICHE_HONNETES];
  for (let i = honnetes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [honnetes[i], honnetes[j]] = [honnetes[j], honnetes[i]];
  }
  const choix = [...fals.slice(0, 2).map((f) => ({ ...f, falsified: true })),
                 ...honnetes.slice(0, 2).map((f) => ({ ...f, falsified: false }))];
  for (let i = choix.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choix[i], choix[j]] = [choix[j], choix[i]];
  }
  return choix;
}

/* Compare une date de fiche (texte "~1450", "1794"…) à une année de
   référence pour pouvoir trier. Retourne un entier (année). */
export function anneeOf(dateFiche) {
  const s = String(dateFiche);
  const neg = /av\. J\.-C\./i.test(s);
  const match = s.match(/(\d{1,5})/);
  if (!match) return 0;
  const n = parseInt(match[1], 10);
  return neg ? -n : n;
}
