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
import BunkerPrison from "../chapters/jeu3/scenes/BunkerPrison.jsx";
import BunkerSalleK from "../chapters/jeu3/scenes/BunkerSalleK.jsx";
import BunkerVoyageK from "../chapters/jeu3/scenes/BunkerVoyageK.jsx";
import EpilogueJeu3 from "../chapters/jeu3/scenes/EpilogueJeu3.jsx";
import BunkerSas from "../chapters/jeu3/scenes/BunkerSas.jsx";
import BunkerCantine from "../chapters/jeu3/scenes/BunkerCantine.jsx";
import BunkerInfirmerie from "../chapters/jeu3/scenes/BunkerInfirmerie.jsx";
import BunkerAtelier from "../chapters/jeu3/scenes/BunkerAtelier.jsx";
import BunkerChapelle from "../chapters/jeu3/scenes/BunkerChapelle.jsx";
import BunkerVoyage from "../chapters/jeu3/scenes/BunkerVoyage.jsx";
import BunkerServeurs from "../chapters/jeu3/scenes/BunkerServeurs.jsx";
import BunkerSerres from "../chapters/jeu3/scenes/BunkerSerres.jsx";
import BunkerMinimap from "../chapters/jeu3/BunkerMinimap.jsx";
import BilletOverlay from "../chapters/jeu3/BilletOverlay.jsx";
import InterviewPanel from "../chapters/jeu3/InterviewPanel.jsx";
import EnqueteCarnet from "../chapters/jeu3/EnqueteCarnet.jsx";
import { MISSIONS_RUMEURS, MISSIONS_TEMPS, MISSIONS_OSINT, DOSSIERS_REECRITS, DOSSIERS_ORDER, getActiveMission, pickMissionOrder } from "../chapters/jeu3/missions.js";
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
  prison:     { Comp: BunkerPrison,     label: "Cellules disciplinaires" },
  salleK:     { Comp: BunkerSalleK,     label: "Salle temporelle · K-01" },
  voyageK:    { Comp: BunkerVoyageK,    label: "⟡ Voyage via Chronographe K-01" },
  epilogueJeu3: { Comp: null, label: "ÉPILOGUE · Le Discernement" },
  sas:        { Comp: BunkerSas,        label: "Sas de voyage · machine de Léa" },
  cantine:    { Comp: BunkerCantine,    label: "Cantine commune" },
  infirmerie: { Comp: BunkerInfirmerie, label: "Infirmerie" },
  atelier:    { Comp: BunkerAtelier,    label: "Atelier des Ingénieurs" },
  chapelle:   { Comp: BunkerChapelle,   label: "Chapelle des Anciens" },
  voyage:     { Comp: BunkerVoyage,     label: "⏳ Retour dans le temps" },
  serres:     { Comp: BunkerSerres,     label: "Serres hydroponiques · Niveau -2" },
  serveurs:   { Comp: BunkerServeurs,   label: "⚠ Niveau -3 · Serveurs" },
};

export default function Jeu3({ prenom, onExit, startAt, endChoice }) {
  const [room, setRoom] = useState(startAt?.room || "awake");
  const [flags, setFlags] = useState(() => {
    const initial = { ...(startAt?.flags || {}) };
    if (!initial.mission_order) initial.mission_order = pickMissionOrder();
    /* L'indice du puzzle Salle K pointe sur l'une des 3 inventions
       dont Jorge a glissé la fiche falsifiée. Tiré au hasard une
       seule fois par partie, pour que la date à décoder change. */
    if (!initial.k_puzzle_invention) {
      const pool = ["presse-gutenberg", "telegraphe-chappe", "tsf-marconi"];
      initial.k_puzzle_invention = pool[Math.floor(Math.random() * pool.length)];
    }
    return initial;
  });
  const [heardPnj, setHeardPnj] = useState(startAt?.heardPnj || {});
  /* État partagé de l'enquête active, remonté au niveau Jeu3 pour que
     les interviews puissent se faire dans n'importe quelle pièce et
     que le carnet persiste entre les changements de pièce. */
  const [enqAnswered, setEnqAnswered] = useState({}); // { temoinId: Set<qidx> }
  const [interviewTemoinId, setInterviewTemoinId] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(null);
  const [carnetOpen, setCarnetOpen] = useState(false);
  /* État des dossiers réécrits (mission appel) : quel dossier le joueur
     est en train de restaurer, et son bordereau en 3 cases rempli lors
     du voyage. Remis à zéro quand le dossier est validé (ou annulé). */
  const [activeDossierId, setActiveDossierId] = useState(null);
  const [bordereau, setBordereau] = useState({}); // { qui?, ouQuand?, quoi? }
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
  const missions = { ...MISSIONS_RUMEURS, ...MISSIONS_TEMPS, ...MISSIONS_OSINT };
  const activeMission = getActiveMission(missions, flags);

  /* Reset de l'état d'enquête quand la mission active change
     (mission résolue → suivante prend sa place). */
  useEffect(() => {
    setEnqAnswered({});
    setInterviewTemoinId(null);
    setCurrentQuestionIdx(null);
  }, [activeMission?.id]);

  const openInterview = (temoinId) => {
    setInterviewTemoinId(temoinId);
    setCurrentQuestionIdx(null);
    /* Signal au carnet : au moins une interaction avec ce témoin. */
    setEnqAnswered((a) => a[temoinId] ? a : { ...a, [temoinId]: new Set() });
  };
  const closeInterview = () => {
    setInterviewTemoinId(null);
    setCurrentQuestionIdx(null);
  };
  const askQuestion = (temoinId, idx) => {
    setEnqAnswered((a) => {
      const next = { ...a };
      const set = new Set(next[temoinId] || []);
      set.add(idx);
      next[temoinId] = set;
      return next;
    });
    setCurrentQuestionIdx(idx);
  };

  /* API dossiers réécrits (mission appel). */
  const dossiers = DOSSIERS_REECRITS;
  const activeDossier = activeDossierId ? dossiers[activeDossierId] : null;
  const startDossier = (id) => { setActiveDossierId(id); setBordereau({}); };
  const fillBordereau = (key, value) => setBordereau((b) => ({ ...b, [key]: value }));
  const finishDossier = () => {
    if (activeDossier) setFlag(activeDossier.flag);
    setActiveDossierId(null);
    setBordereau({});
    /* Marque la mission appel comme finie quand les 3 dossiers sont restaurés. */
    const nextFlags = { ...flags, [activeDossier?.flag]: true };
    if (DOSSIERS_ORDER.every((id) => nextFlags[dossiers[id].flag])) {
      setFlag("mission_appel_done");
    }
  };
  const cancelDossier = () => { setActiveDossierId(null); setBordereau({}); };

  const j3 = { flags, heardPnj, setFlag, hear,
    previousRoom: prevRef.current,
    hubRoom,
    missions,
    activeMission,
    enqAnswered,
    openInterview, closeInterview, askQuestion,
    dossiers, dossiersOrder: DOSSIERS_ORDER,
    activeDossier, bordereau,
    startDossier, fillBordereau, finishDossier, cancelDossier,
    endChoice };

  /* Témoin actuellement en interview (modal top-level). */
  const interviewTemoin = interviewTemoinId && activeMission
    ? activeMission.temoins.find((t) => t.id === interviewTemoinId)
    : null;
  const currentAnswer = interviewTemoin && currentQuestionIdx !== null
    ? interviewTemoin.questions[currentQuestionIdx]
    : null;

  const current = ROOMS[room] || ROOMS.hub;
  const Comp = current.Comp;

  /* La mini-carte latérale n'a pas de sens dans quelques écrans très
     immersifs (réveil, voyage dans le temps, confrontation finale). */
  const showMinimap = !["awake", "voyage", "voyageK", "serveurs", "epilogueJeu3"].includes(room);
  /* Flèche de retour visible dans les pièces individuelles. Masquée
     dans les couloirs (où l'on clique directement sur l'ascenseur
     dessiné dans le décor) et dans les écrans immersifs. */
  const showBack = !["awake", "voyage", "voyageK", "serveurs", "elevator",
                     "hub", "hubHaut", "hubBas", "epilogueJeu3"].includes(room);
  const backTarget = hubRoom;

  /* Billet glissé : apparaît automatiquement quand le joueur a entendu
     les 3 PNJ d'accroche (voisin_lior en N-24, chapelle_anselme à la
     chapelle, cantine_via à la cantine). Déverrouille le Bureau des
     Rumeurs via le flag "puits_billet". */
  const billetReady = heardPnj.voisin_lior && heardPnj.chapelle_anselme && heardPnj.cantine_via;
  const showBillet = billetReady && !flags.puits_billet;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#050810", zIndex: 60, fontFamily: "Palatino, Georgia, serif", color: "#e8eef5", display: "flex", flexDirection: "column" }}>
      {/* Barre du haut : lieu courant + bouton menu */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "#0a1020", borderBottom: "1px solid #1a2536" }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 3, color: "#7fd8ff" }}>
          🌑 LE PUITS · 2087 · <span style={{ color: "#e8eef5" }}>{current.label}</span>
          {cheat && <span style={{ marginLeft: 12, color: "#ff5030", fontWeight: 800 }}>🐛 TRICHE</span>}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {activeMission && flags.puits_billet && (
            <button onClick={() => setCarnetOpen(true)}
              style={{ background: "#f2e6cc", color: "#3a2010", border: "2px solid #5a3818", borderRadius: 6, padding: "5px 12px", fontFamily: "ui-monospace,monospace", fontSize: 11, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>
              📓 Carnet
            </button>
          )}
          <button onClick={onExit}
            style={{ background: "transparent", color: "#8fa3bd", border: "1px solid #2a3648", borderRadius: 8, padding: "6px 12px", fontSize: 11, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
            ← Menu
          </button>
        </div>
      </div>

      {/* Zone principale : mini-carte à gauche + scène à droite */}
      <div style={{ flex: 1, display: "flex", minHeight: 0, position: "relative" }}>
        {showMinimap && <BunkerMinimap room={room} flags={flags} onGo={goTo} cheat={cheat} />}
        <SceneFrame style={{ padding: 6 }}>
          {room === "epilogueJeu3"
            ? <EpilogueJeu3 prenom={prenom} onDone={onExit} />
            : <Comp prenom={prenom} onGo={goTo} j3={j3} />}
        </SceneFrame>
        {showBack && (
          <button onClick={() => goTo(backTarget)}
            title={backTarget === "elevator" ? "Ascenseur" : "Couloir"}
            style={{ position: "absolute",
              top: "50%", left: showMinimap ? 180 : 32,
              transform: "translateY(-50%)", zIndex: 50,
              width: 44, height: 60, borderRadius: 12,
              border: "1.5px solid rgba(255,209,102,0.75)",
              background: "rgba(255,209,102,0.35)", color: "#ffe8a8",
              fontSize: 30, fontWeight: 800, cursor: "pointer",
              backdropFilter: "blur(2px)", lineHeight: 1,
              boxShadow: "0 0 14px rgba(255,209,102,0.35)" }}>
            ‹
          </button>
        )}
      </div>

      {showBillet && (
        <BilletOverlay onKeep={() => setFlag("puits_billet")} />
      )}

      {interviewTemoin && (
        <InterviewPanel
          temoin={interviewTemoin}
          asked={enqAnswered[interviewTemoin.id]}
          answer={currentAnswer}
          onAsk={(idx) => askQuestion(interviewTemoin.id, idx)}
          onClose={closeInterview} />
      )}

      {carnetOpen && (
        <EnqueteCarnet
          mission={activeMission}
          temoins={activeMission?.temoins || []}
          answered={enqAnswered}
          onClose={() => setCarnetOpen(false)} />
      )}
    </div>
  );
}

/* On ré-exporte LEVELS pour d'éventuels tests ou pour un futur écran de fin. */
export { LEVELS };
