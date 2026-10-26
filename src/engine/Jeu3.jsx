import { useState, useRef, useEffect } from "react";
import SceneFrame from "./SceneFrame.jsx";
import useEcran from "./useEcran.js";
import { writeSave } from "./save.js";
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
import BunkerCantine from "../chapters/jeu3/scenes/BunkerCantine.jsx";
import BunkerInfirmerie from "../chapters/jeu3/scenes/BunkerInfirmerie.jsx";
import BunkerAtelier from "../chapters/jeu3/scenes/BunkerAtelier.jsx";
import BunkerChapelle from "../chapters/jeu3/scenes/BunkerChapelle.jsx";
import BunkerServeurs from "../chapters/jeu3/scenes/BunkerServeurs.jsx";
import BunkerDormants from "../chapters/jeu3/scenes/BunkerDormants.jsx";
import BunkerSerres from "../chapters/jeu3/scenes/BunkerSerres.jsx";
import BunkerBibliotheque from "../chapters/jeu3/scenes/BunkerBibliotheque.jsx";
import BunkerMinimap from "../chapters/jeu3/BunkerMinimap.jsx";
import MediadexPanel from "../chapters/jeu3/MediadexPanel.jsx";
import BilletOverlay from "../chapters/jeu3/BilletOverlay.jsx";
import InterviewPanel from "../chapters/jeu3/InterviewPanel.jsx";
import EnqueteCarnet from "../chapters/jeu3/EnqueteCarnet.jsx";
import CaillouxPanel from "../chapters/jeu3/CaillouxPanel.jsx";
import { MISSIONS_RUMEURS, getActiveMission, pickMissionOrder } from "../chapters/jeu3/missions.js";
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

   Sauvegarde (slot « jeu3 », écrite à chaque changement) : salle,
   flags, PNJ entendus, pièce précédente, questions posées dans
   l'enquête en cours, prénom et choix de fin du Jeu 2. « Reprendre »
   repasse cet état dans startAt. Une salle reprend à son début : ses
   étapes internes ne sont pas gardées, ce qui compte est dans les
   flags (un voyage K reprend au départ, sa cible est dans un flag).
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
  cantine:    { Comp: BunkerCantine,    label: "Cantine commune" },
  infirmerie: { Comp: BunkerInfirmerie, label: "Infirmerie" },
  atelier:    { Comp: BunkerAtelier,    label: "Atelier des Ingénieurs" },
  chapelle:   { Comp: BunkerChapelle,   label: "Chapelle des Anciens" },
  bibliotheque: { Comp: BunkerBibliotheque, label: "Bibliothèque" },
  serres:     { Comp: BunkerSerres,     label: "Serres hydroponiques · Niveau -2" },
  dormants:   { Comp: BunkerDormants,   label: "⚠ Niveau -3 · « Salle de repos »" },
  serveurs:   { Comp: BunkerServeurs,   label: "⚠ Niveau -3 · Serveurs" },
};

export default function Jeu3({ prenom, onExit, startAt, endChoice }) {
  /* le choix de fin du Jeu 2 : celui de la sauvegarde, sinon celui de la partie en cours */
  const choixJeu2 = startAt && "endChoice" in startAt ? startAt.endChoice : endChoice;
  const [room, setRoom] = useState(startAt?.room || "awake");
  const [flags, setFlags] = useState(() => {
    const initial = { ...(startAt?.flags || {}) };
    if (!initial.mission_order) initial.mission_order = pickMissionOrder();
    /* Les 3 destinations du Chronographe K-01 sont tirées au hasard
       une fois par partie, dans un pool de 8 inventions. Jorge les
       révèle une à une au joueur. */
    if (!initial.k_voyage_order) {
      const pool = ["gutenberg", "chappe", "marconi", "daguerre", "bell", "edison", "lumiere", "eniac"];
      /* Fisher-Yates */
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      initial.k_voyage_order = pool.slice(0, 3);
    }
    /* L'indice du puzzle de la Salle K pointe sur la PREMIÈRE
       destination (celle que Jorge révélera en premier). */
    if (!initial.k_puzzle_invention) {
      const metaId = {
        gutenberg: "presse-gutenberg",
        chappe:    "telegraphe-chappe",
        marconi:   "tsf-marconi",
        daguerre:  "daguerreotype",
        bell:      "telephone-bell",
        edison:    "phonographe-edison",
        lumiere:   "cinematographe-lumiere",
        eniac:     "eniac",
      };
      initial.k_puzzle_invention = metaId[initial.k_voyage_order[0]];
    }
    return initial;
  });
  const [heardPnj, setHeardPnj] = useState(startAt?.heardPnj || {});
  /* État partagé de l'enquête active, remonté au niveau Jeu3 pour que
     les interviews puissent se faire dans n'importe quelle pièce et
     que le carnet persiste entre les changements de pièce. */
  const [enqAnswered, setEnqAnswered] = useState(() => // { temoinId: Set<qidx> }
    Object.fromEntries(Object.entries(startAt?.enqAnswered || {}).map(([id, q]) => [id, new Set(q)])));
  const [interviewTemoinId, setInterviewTemoinId] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(null);
  const [carnetOpen, setCarnetOpen] = useState(false);
  const [mediadexOpen, setMediadexOpen] = useState(false);
  const [caillouxOpen, setCaillouxOpen] = useState(false);
  /* Téléphone : la mini-carte se replie dans un tiroir (bouton 🗺),
     les boutons de la barre perdent leur texte, la flèche de retour
     monte dans la barre, et en portrait la salle prend toute la
     hauteur (SceneFrame « remplir »). */
  const ecran = useEcran();
  const compact = ecran.etroit || ecran.bas;
  const [planOpen, setPlanOpen] = useState(false);
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
  const prevRef = useRef(startAt?.previousRoom || "awake");
  const goTo = (r) => { prevRef.current = room; setRoom(r); setPlanOpen(false); };

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
  const missions = MISSIONS_RUMEURS;
  const activeMission = getActiveMission(missions, flags);

  /* Reset de l'état d'enquête quand la mission active change
     (mission résolue → suivante prend sa place). Pas au premier
     affichage : une partie reprise garde les questions déjà posées. */
  const missionVue = useRef(activeMission?.id);
  useEffect(() => {
    if (missionVue.current === activeMission?.id) return;
    missionVue.current = activeMission?.id;
    setEnqAnswered({});
    setInterviewTemoinId(null);
    setCurrentQuestionIdx(null);
  }, [activeMission?.id]);

  /* SAUVEGARDE AUTOMATIQUE (voir l'en-tête) */
  useEffect(() => {
    writeSave({ room, flags, heardPnj, previousRoom: prevRef.current, prenom, endChoice: choixJeu2 ?? null,
      enqAnswered: Object.fromEntries(Object.entries(enqAnswered).map(([id, q]) => [id, [...q]])) }, "jeu3");
  }, [room, flags, heardPnj, enqAnswered, prenom, choixJeu2]);

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

  const j3 = { flags, heardPnj, setFlag, hear,
    previousRoom: prevRef.current,
    hubRoom,
    missions,
    activeMission,
    enqAnswered,
    openInterview, closeInterview, askQuestion,
    endChoice: choixJeu2 };

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
  const showMinimap = !["awake", "voyageK", "dormants", "serveurs", "epilogueJeu3"].includes(room);
  /* Flèche de retour visible dans les pièces individuelles. Masquée
     dans les couloirs (où l'on clique directement sur l'ascenseur
     dessiné dans le décor) et dans les écrans immersifs. */
  const showBack = !["awake", "voyageK", "dormants", "serveurs", "elevator",
                     "hub", "hubHaut", "hubBas", "epilogueJeu3"].includes(room);
  const backTarget = hubRoom;

  /* Billet glissé : apparaît automatiquement quand le joueur a entendu
     les 3 PNJ d'accroche (voisin_lior en N-24, chapelle_anselme à la
     chapelle, cantine_via à la cantine). Déverrouille le Bureau des
     Rumeurs via le flag "puits_billet". */
  const billetReady = heardPnj.voisin_lior && heardPnj.chapelle_anselme && heardPnj.cantine_via;
  const showBillet = billetReady && !flags.puits_billet;

  const btnBarre = (fond, texte, bord) => ({ background: fond, color: texte, border: `2px solid ${bord}`, borderRadius: 6, padding: compact ? "5px 8px" : "5px 12px", fontFamily: "ui-monospace,monospace", fontSize: compact ? 13 : 11, fontWeight: 700, cursor: "pointer", letterSpacing: 1, flex: "0 0 auto", lineHeight: 1.2 });

  return (
    <div style={{ position: "fixed", inset: 0, background: "#050810", zIndex: 60, fontFamily: "Palatino, Georgia, serif", color: "#e8eef5", display: "flex", flexDirection: "column" }}>
      {/* Barre du haut : lieu courant + bouton menu */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, padding: compact ? "6px 8px" : "10px 16px", background: "#0a1020", borderBottom: "1px solid #1a2536" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, flex: "1 1 auto" }}>
          {compact && showBack && (
            <button onClick={() => goTo(backTarget)} title={backTarget === "elevator" ? "Ascenseur" : "Couloir"} data-retour="1"
              style={{ ...btnBarre("rgba(255,209,102,0.25)", "#ffe8a8", "rgba(255,209,102,0.75)"), fontSize: 18, padding: "1px 10px", fontWeight: 800 }}>‹</button>
          )}
          {compact && showMinimap && (
            <button onClick={() => setPlanOpen((o) => !o)} title="Plan du Puits" data-plan="1"
              style={btnBarre(planOpen ? "#1a2a40" : "#0e1626", "#7fd8ff", "#2a4a6a")}>🗺</button>
          )}
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: compact ? 11 : 12, letterSpacing: compact ? 1 : 3, color: "#7fd8ff", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {compact ? "🌑 " : "🌑 LE PUITS · 2087 · "}<span style={{ color: "#e8eef5" }}>{current.label}</span>
            {cheat && <span style={{ marginLeft: 12, color: "#ff5030", fontWeight: 800 }}>🐛 TRICHE</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flex: "0 0 auto" }}>
          {flags.mediadex_retrouve && (
            <button onClick={() => setMediadexOpen(true)} title="Médiadex" style={btnBarre("#2a1808", "#ffd166", "#c8a848")}>
              {compact ? "📘" : "📘 Médiadex"}
            </button>
          )}
          {flags.caillou_veste && (
            <button onClick={() => setCaillouxOpen(true)} data-cailloux="1" title="Les cailloux d'A." style={btnBarre("#1a1408", "#e8dfc8", "#8a7a5a")}>
              {compact ? "🪨" : "🪨 Cailloux"}
            </button>
          )}
          {activeMission && flags.puits_billet && (
            <button onClick={() => setCarnetOpen(true)} title="Carnet d'enquête" style={btnBarre("#f2e6cc", "#3a2010", "#5a3818")}>
              {compact ? "📓" : "📓 Carnet"}
            </button>
          )}
          <button onClick={onExit} title="Menu"
            style={{ background: "transparent", color: "#8fa3bd", border: "1px solid #2a3648", borderRadius: 8, padding: compact ? "6px 8px" : "6px 12px", fontSize: 11, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
            {compact ? "☰" : "← Menu"}
          </button>
        </div>
      </div>

      {/* Zone principale : mini-carte à gauche + scène à droite */}
      <div style={{ flex: 1, display: "flex", minHeight: 0, position: "relative" }}>
        {showMinimap && !compact && <BunkerMinimap room={room} flags={flags} onGo={goTo} cheat={cheat} />}
        {/* téléphone : la mini-carte dans un tiroir, par-dessus la scène */}
        {showMinimap && compact && planOpen && (
          <div onClick={() => setPlanOpen(false)} style={{ position: "absolute", inset: 0, zIndex: 70, background: "rgba(2,4,10,0.6)", display: "flex" }}>
            <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", maxHeight: "100%", boxShadow: "6px 0 24px rgba(0,0,0,0.6)" }}>
              <BunkerMinimap room={room} flags={flags} onGo={goTo} cheat={cheat} />
            </div>
          </div>
        )}
        <SceneFrame style={{ padding: compact ? 2 : 6 }} remplir={compact && ecran.portrait && !["voyageK", "epilogueJeu3"].includes(room)}>
          {room === "epilogueJeu3"
            ? <EpilogueJeu3 prenom={prenom} onDone={onExit} />
            : <Comp prenom={prenom} onGo={goTo} j3={j3} />}
        </SceneFrame>
        {showBack && !compact && (
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

      {mediadexOpen && (
        <MediadexPanel onClose={() => setMediadexOpen(false)} />
      )}

      {caillouxOpen && (
        <CaillouxPanel flags={flags} setFlag={setFlag} onClose={() => setCaillouxOpen(false)} />
      )}
    </div>
  );
}

/* On ré-exporte LEVELS pour d'éventuels tests ou pour un futur écran de fin. */
export { LEVELS };
