/* ============================================================
   JEU 3 — Architecture du bunker sur 5 niveaux
   ------------------------------------------------------------
   Chaque niveau a une couleur d'ambiance qui se propage à sa
   mini-carte latérale et à ses décors (via une teinte discrète
   plus tard). L'ascenseur (`elevator`) permet de passer de l'un
   à l'autre — chaque niveau a son propre mini-hub.

   ordre : de haut en bas (surface au sommet, serveurs tout en bas)
   ============================================================ */
export const LEVELS = [
  { id: "+2", name: "Surface",  hubRoom: "surface",  color: "#e0a848",
    rooms: [{ id: "surface", label: "Sortie scellée C-3" }] },
  { id: "+1", name: "Communal", hubRoom: "hubHaut",  color: "#c88060",
    rooms: [
      { id: "cantine",  label: "Cantine commune" },
      { id: "chapelle", label: "Chapelle des Anciens" },
    ] },
  { id: "0",  name: "Habitat",  hubRoom: "hub",      color: "#7fd8ff",
    rooms: [
      { id: "chambreN24", label: "Chambre N-24 · Lior" },
      { id: "chambre",    label: "Ma chambre (N-27)" },
      { id: "chambreN30", label: "Chambre N-30 · Yona" },
      { id: "chambreN32", label: "Chambre N-32 · Estev" },
    ] },
  { id: "-1", name: "Services", hubRoom: "hubBas",   color: "#5eff9e",
    rooms: [
      { id: "rumeurs",    label: "Bureau des Rumeurs" },
      { id: "archives",   label: "Salle des Archives" },
      { id: "infirmerie", label: "Infirmerie" },
      { id: "atelier",    label: "Atelier des Ingénieurs" },
      { id: "prison",     label: "Cellules disciplinaires" },
    ] },
  { id: "-2", name: "Hydroponie", hubRoom: "serres", color: "#8aff70",
    rooms: [{ id: "serres", label: "Serres hydroponiques" }] },
  { id: "-3", name: "Serveurs", hubRoom: "serveurs", color: "#ff5030",
    rooms: [{ id: "serveurs", label: "Salle MARTINE" }] },
  /* Étage K : niveau caché, inconnu de l'ascenseur tant que le joueur
     n'a pas récupéré l'indice de Jorge. Salle temporelle abandonnée
     construite avant Léa. */
  { id: "K",  name: "— Niveau K", hubRoom: "salleK", color: "#c8a848",
    rooms: [{ id: "salleK", label: "Salle temporelle abandonnée" }],
    hidden: true },
];

/* Map inverse : d'une roomId → l'id du niveau où elle est. */
export const ROOM_TO_LEVEL = (() => {
  const m = {};
  for (const lvl of LEVELS) {
    m[lvl.hubRoom] = lvl.id;
    for (const r of lvl.rooms) m[r.id] = lvl.id;
  }
  m.awake = "0";       // le réveil se fait dans la chambre → niveau 0
  m.dormants = "-3";   // salle secrète, hors du plan de l'ascenseur
  m.elevator = null;   // l'ascenseur n'a pas de niveau propre
  m.voyageK = null;    // voyages via chronographe K (hors-bunker)
  m.epilogueJeu3 = null; // écran plein, pas rattaché à un niveau
  return m;
})();

/* Une pièce est-elle accessible à l'ascenseur ? Le niveau -3 est
   l'étage de MARTINE : l'ascenseur refuse d'y descendre. On y va par
   l'escalier de service (trappe rouge du couloir de l'Habitat), que
   Jorge indique après les trois voyages K (flag phase5_done, voir
   CONFRONTATION.prerequisites). L'ascenseur ne s'ouvre au -3 qu'une
   fois la confrontation terminée. */
export function isLevelUnlocked(levelId, flags) {
  if (levelId === "-3") {
    return !!flags?.mission_finale_done;
  }
  if (levelId === "K") {
    return !!flags?.elevator_k_unlocked;
  }
  return true;
}

/* Un étage HIDDEN n'apparaît sur le tableau de l'ascenseur et dans la
   mini-carte que s'il est aussi déverrouillé. */
export function isLevelVisible(level, flags) {
  if (!level?.hidden) return true;
  return isLevelUnlocked(level.id, flags);
}
