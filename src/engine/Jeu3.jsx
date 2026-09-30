import { useState, useRef, useEffect } from "react";
import SceneFrame from "./SceneFrame.jsx";
import BunkerAwake from "../chapters/jeu3/scenes/BunkerAwake.jsx";
import BunkerHub from "../chapters/jeu3/scenes/BunkerHub.jsx";
import BunkerHubHaut from "../chapters/jeu3/scenes/BunkerHubHaut.jsx";
import BunkerHubBas from "../chapters/jeu3/scenes/BunkerHubBas.jsx";
import BunkerSurface from "../chapters/jeu3/scenes/BunkerSurface.jsx";
import BunkerElevator from "../chapters/jeu3/scenes/BunkerElevator.jsx";
import BunkerChambre from "../chapters/jeu3/scenes/BunkerChambre.jsx";
import BunkerChambre24 from "../chapters/jeu3/scenes/BunkerChambre24.jsx";
import BunkerChambre30 from "../chapters/jeu3/scenes/BunkerChambre30.jsx";
import BunkerChambre32 from "../chapters/jeu3/scenes/BunkerChambre32.jsx";
import BunkerRumeurs from "../chapters/jeu3/scenes/BunkerRumeurs.jsx";
import BunkerArchives from "../chapters/jeu3/scenes/BunkerArchives.jsx";
import BunkerCantine from "../chapters/jeu3/scenes/BunkerCantine.jsx";
import BunkerInfirmerie from "../chapters/jeu3/scenes/BunkerInfirmerie.jsx";
import BunkerAtelier from "../chapters/jeu3/scenes/BunkerAtelier.jsx";
import BunkerChapelle from "../chapters/jeu3/scenes/BunkerChapelle.jsx";
import BunkerVoyage from "../chapters/jeu3/scenes/BunkerVoyage.jsx";
import BunkerServeurs from "../chapters/jeu3/scenes/BunkerServeurs.jsx";
import BunkerSerres from "../chapters/jeu3/scenes/BunkerSerres.jsx";
import BunkerMinimap from "../chapters/jeu3/BunkerMinimap.jsx";
import { MISSIONS_RUMEURS, MISSIONS_TEMPS, MISSIONS_OSINT } from "../chapters/jeu3/missions.js";
import { LEVELS, ROOM_TO_LEVEL } from "../chapters/jeu3/levels.js";

/* ============================================================
   MOTEUR — JEU 3 : « Le bunker 2087 »
   ------------------------------------------------------------
   Architecture multi-niveaux (5 étages : +2 Surface, +1 Communal,
   0 Habitat, -1 Services, -3 Serveurs). Chaque étage a son mini-
   hub. L'ascenseur (room "elevator") permet de sauter d'un étage
   à l'autre. Une mini-carte latérale (BunkerMinimap) montre en
   permanence où on est et clique pour se déplacer.

   État partagé (j3) :
     flags        — flags de mission (mission_kova_done, ...)
     heardPnj     — set des PNJ déjà interviewés
     previousRoom — pièce d'où l'on vient (utilisé par l'ascenseur
                    pour connaître le niveau courant)
     missions     — catalogue de toutes les missions
   ============================================================ */
const ROOMS = {
  awake:      { Comp: BunkerAwake,      label: "Réveil" },
  hub:        { Comp: BunkerHub,        label: "Couloir · Niveau 0" },
  hubHaut:    { Comp: BunkerHubHaut,    label: "Couloir · Niveau +1" },
  hubBas:     { Comp: BunkerHubBas,     label: "Couloir · Niveau -1" },
  surface:    { Comp: BunkerSurface,    label: "Surface · Niveau +2" },
  elevator:   { Comp: BunkerElevator,   label: "Ascenseur" },
  chambre:    { Comp: BunkerChambre,    label: "Ma chambre" },
  chambreN24: { Comp: BunkerChambre24,  label: "Chambre N-24 · Lior" },
  chambreN30: { Comp: BunkerChambre30,  label: "Chambre N-30 · Yona" },
  chambreN32: { Comp: BunkerChambre32,  label: "Chambre N-32 · Estev" },
  rumeurs:    { Comp: BunkerRumeurs,    label: "Bureau des Rumeurs" },
  archives:   { Comp: BunkerArchives,   label: "Salle des Archives" },
  cantine:    { Comp: BunkerCantine,    label: "Cantine commune" },
  infirmerie: { Comp: BunkerInfirmerie, label: "Infirmerie" },
  atelier:    { Comp: BunkerAtelier,    label: "Atelier des Ingénieurs" },
  chapelle:   { Comp: BunkerChapelle,   label: "Chapelle des Anciens" },
  voyage:     { Comp: BunkerVoyage,     label: "⏳ Retour dans le temps" },
  serres:     { Comp: BunkerSerres,     label: "Serres hydroponiques · Niveau -2" },
  serveurs:   { Comp: BunkerServeurs,   label: "⚠ Niveau -3 · Serveurs" },
};

export default function Jeu3({ prenom, onExit }) {
  const [room, setRoom] = useState("awake");
  const [flags, setFlags] = useState({});
  const [heardPnj, setHeardPnj] = useState({});
  /* Mode triche : Ctrl+Shift+C toggle. Quand actif, la mini-carte redevient
     cliquable pour se téléporter d'un étage à l'autre sans passer par
     l'ascenseur. Sinon, la mini-carte est purement informative — il faut
     utiliser l'ascenseur pour changer d'étage (immersion). */
  const [cheat, setCheat] = useState(false);
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c")) {
        setCheat((c) => !c);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  /* previousRoom permet à l'ascenseur de savoir depuis quel étage
     on l'a appelé (pour surligner "ici" dans le sélecteur). */
  const prevRef = useRef("awake");
  const goTo = (r) => { prevRef.current = room; setRoom(r); };

  const setFlag = (k, v = true) => setFlags((f) => ({ ...f, [k]: v }));
  const hear = (pnjId) => setHeardPnj((h) => ({ ...h, [pnjId]: true }));
  /* Le hub à rejoindre depuis la pièce courante : chaque pièce a un
     niveau associé, et chaque niveau a son propre couloir. Ainsi
     "Retour au couloir" depuis Cantine (niveau +1) renvoie à hubHaut,
     depuis Rumeurs (niveau -1) à hubBas, etc. */
  const levelHere = ROOM_TO_LEVEL[room];
  const lvlHubRoom = LEVELS.find((l) => l.id === levelHere)?.hubRoom;
  /* Pour un niveau à une seule salle (Surface, Hydroponie, Serveurs), hubRoom
     vaut la salle elle-même — auquel cas "Retour au couloir" doit renvoyer à
     l'ascenseur plutôt que sur la salle courante. */
  const hubRoom = lvlHubRoom && lvlHubRoom !== room ? lvlHubRoom : "elevator";
  const j3 = { flags, heardPnj, setFlag, hear,
    previousRoom: prevRef.current,
    hubRoom,
    missions: { ...MISSIONS_RUMEURS, ...MISSIONS_TEMPS, ...MISSIONS_OSINT } };

  const current = ROOMS[room] || ROOMS.hub;
  const Comp = current.Comp;

  /* La mini-carte latérale n'a pas de sens dans quelques écrans très
     immersifs (réveil, voyage dans le temps, confrontation finale). */
  const showMinimap = !["awake", "voyage", "serveurs"].includes(room);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#050810", zIndex: 60, fontFamily: "Palatino, Georgia, serif", color: "#e8eef5", display: "flex", flexDirection: "column" }}>
      {/* Barre du haut : lieu courant + bouton menu */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "#0a1020", borderBottom: "1px solid #1a2536" }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 3, color: "#7fd8ff" }}>
          🌑 LE PUITS · 2087 · <span style={{ color: "#e8eef5" }}>{current.label}</span>
          {cheat && <span style={{ marginLeft: 12, color: "#ff5030", fontWeight: 800 }}>🐛 TRICHE</span>}
        </div>
        <button onClick={onExit}
          style={{ background: "transparent", color: "#8fa3bd", border: "1px solid #2a3648", borderRadius: 8, padding: "6px 12px", fontSize: 11, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
          ← Menu
        </button>
      </div>

      {/* Zone principale : mini-carte à gauche + scène à droite */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {showMinimap && <BunkerMinimap room={room} flags={flags} onGo={goTo} cheat={cheat} />}
        <SceneFrame style={{ padding: 6 }}>
          <Comp prenom={prenom} onGo={goTo} j3={j3} />
        </SceneFrame>
      </div>
    </div>
  );
}

/* On ré-exporte LEVELS pour d'éventuels tests ou pour un futur écran de fin. */
export { LEVELS };
