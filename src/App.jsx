import { useState, useEffect, useRef, Component } from "react";
import Martine, { Avatar } from "./engine/Martine.jsx";
import Scene from "./engine/Scene.jsx";
import { InventoryBar } from "./engine/Inventory.jsx";
import { DragProvider } from "./engine/DragDrop.jsx";
import Particles from "./engine/Particles.jsx";
import Gauges from "./engine/Gauges.jsx";
import Frise, { trendSentence } from "./engine/Frise.jsx";
import { playSfx, isMuted, setMuted, startAmbience, stopAmbience } from "./engine/audio.js";
import { loadSave, writeSave, clearSave, hasSave, exportSaveString, importSaveString } from "./engine/save.js";
import { computeBadge } from "./engine/badge.js";
import JaugeTemporelle from "./engine/JaugeTemporelle.jsx";
import CheatPanel from "./engine/CheatPanel.jsx";
import TransitionScreen from "./engine/TransitionScreen.jsx";
import EndScreen from "./engine/EndScreen.jsx";
import Jeu2Placeholder from "./engine/Jeu2Placeholder.jsx";
import EpilogueScreen from "./engine/EpilogueScreen.jsx";
import CarnetPrint from "./engine/CarnetPrint.jsx";
import PortraitAl3x1AInScene from "./engine/PortraitAl3x1AInScene.jsx";
import SosChooserOverlay from "./engine/SosChooserOverlay.jsx";
import { findRecipe, findNearMiss, randomLine } from "./engine/Crafting.js";
import { lastHotspotClick } from "./engine/Hotspot.jsx";
import { CHAPTERS } from "./chapters/index.js";
import { ILLUSTRATIONS } from "./chapters/illustrations.jsx";
import { AlphabetGame } from "./chapters/alphabet.jsx";
import { TabletteGame } from "./chapters/mesopotamie-tablette.jsx";
import { CartoucheGame } from "./chapters/egypte-cartouche.jsx";
import { FactureGame } from "./chapters/moyen-age-facture.jsx";
import { ChappeGame } from "./chapters/moderne-chappe.jsx";
import { MorseGame } from "./chapters/xixe-morse.jsx";
import { TsfGame } from "./chapters/xixe-tsf.jsx";
import { PhotoGame } from "./chapters/xixe-photo.jsx";
import { PhonoGame } from "./chapters/xixe-phono.jsx";
import { CineGame } from "./chapters/xixe-cine.jsx";
import { TsfReglageGame } from "./chapters/xxe-tsf-reglage.jsx";
import { CassetteGame } from "./chapters/xxe-cassette.jsx";
import { GraverCdGame } from "./chapters/xxe-graver-cd.jsx";
import { FaireLaUneGame } from "./chapters/xxe-faire-la-une.jsx";
import { CadrerEvenementGame } from "./chapters/xxe-cadrer-evenement.jsx";
import { EniacDebugGame } from "./chapters/xxe-eniac-debug.jsx";
import { FilAlgoGame } from "./chapters/xxie-fil-algo.jsx";
import { VraiFauxIAGame } from "./chapters/xxie-vrai-faux-ia.jsx";
import { TailleSilexGame } from "./chapters/paleo-taille-silex.jsx";
import Mediadex from "./engine/Mediadex.jsx";
import MediaCard from "./engine/MediaCard.jsx";
import { TimeVessel } from "./engine/TimeVessel.jsx";
import { getCardMeta, playCardSound } from "./engine/mediadex.js";
import { SosButton, SosOverlay } from "./engine/SosSignal.jsx";
import IntroStory from "./engine/IntroStory.jsx";
import Jeu3 from "./engine/Jeu3.jsx";
import { WorldMap, MiniMap } from "./engine/WorldMap.jsx";
import * as EPILOGUE from "./chapters/epilogue/data.js";
import StationChronautes, { PortraitElias } from "./chapters/epilogue/StationChronautes.jsx";
import BriefingMission from "./chapters/epilogue/BriefingMission.jsx";
import { JEU2 } from "./chapters/epilogue/jeu2Data.js";
import NoteAl3x1A from "./chapters/epilogue/NoteAl3x1A.jsx";
import RetrouvaillesAl3x1A from "./chapters/epilogue/RetrouvaillesAl3x1A.jsx";
import FinJeu2 from "./chapters/epilogue/FinJeu2.jsx";

/* Police « épique » du titre : on tente d'abord de belles polices gravées
   (souvent présentes sur les PC scolaires via Office), avec repli élégant.
   Aucun fichier chargé : tout reste hors-ligne. */
const TITRE_FONT = "'Cinzel', 'Trajan Pro', 'Copperplate Gothic Bold', 'Perpetua Titling MT', 'Constantia', 'Palatino Linotype', Georgia, serif";

/* Petit filet de securite : quand un decor crashe (ex. path SVG invalide
   sur un navigateur pointilleux, prop manquante), on affiche une carte
   d'erreur discrete et le reste du jeu continue. Sans ca, l'app entiere
   se de-monte et l'eleve retourne au titre — perte de partie perçue. */
class DecorErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err) { try { console.error("[decor crash]", err); } catch { /* rien */ } }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div style={{ padding: "18px 22px", background: "#0e1420", border: "1px solid #5a3020", borderRadius: 12, textAlign: "center", color: "#e8c090", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
        <div style={{ fontSize: 34 }}>⚠️</div>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 1.5, color: "#e0a848" }}>DÉCOR TEMPORAIREMENT INSTABLE</div>
        <div style={{ fontSize: 13, color: "#c8b8a0", maxWidth: 400, margin: "6px auto 0", lineHeight: 1.55 }}>
          MARTINE a des interférences sur ce tableau. Utilise le TEMPOSCOPE en haut pour aller ailleurs, ta partie est sauvegardée.
        </div>
        <button onClick={() => this.setState({ err: null })}
          style={{ marginTop: 12, background: "#141b26", color: "#e0a848", border: "1px solid #5a4028", borderRadius: 10, padding: "8px 18px", fontSize: 12, fontFamily: "ui-monospace,monospace", letterSpacing: 1, cursor: "pointer" }}>
          Réessayer
        </button>
      </div>
    );
  }
}

/* Petite silhouette d'Al3x1A dessinee dans le decor du jeu 2 quand on la
   trouve : tunique grise, cheveux mi-longs, halo bleute discret. Se rend
   au sein d'un <svg viewBox="0 0 1000 560"> (le viewBox partage du decor).
   Coordonnees relatives au groupe parent (translate deja applique). Taille
   totale : ~80 px de haut. */
/* ============================================================
   MARTINE — Application principale
   Trois écrans : titre → jeu → fin.
   L'écran de jeu tient sur UNE SEULE VUE, sans défilement :
   ┌──────────────────────────────────────┐
   │ bandeau : lieu · compteur · boutons · saut │
   │ TABLEAU (prend toute la place libre) │
   │ console MARTINE                      │
   │ besace (barre d'icônes)              │
   └──────────────────────────────────────┘
   Plus de creuset : on combine par glisser-déposer (élément →
   élément, ou élément → objet du décor) ou par tap-tap.

   Nettoyage automatique : un élément est retiré de la besace
   quand PLUS AUCUNE recette restante ne l'utilise — jamais
   avant, pour ne jamais bloquer une chaîne (la branche sert
   trois fois !). `made` garde la liste de tout ce qui a déjà
   été créé ou découvert.
   ============================================================ */

/* ============================================================
   LA JAUGE TEMPORELLE — colonne à DROITE du décor (écran large).
   Elle se remplit à chaque trace transmise (chaque personne aidée) ;
   pleine, elle débloque le départ vers l'époque suivante. En dessous,
   un suivi de « trouvailles » (pastilles) montre où l'on en est.
   Aucun état propre : tout vient des props (moteur/contenu séparés).
   ============================================================ */
export default function App() {
  /* Le chapitre COURANT est choisi dans le registre CHAPTERS.
     Il devient dynamique : le saut temporel charge le suivant. */
  const [chapterIndex, setChapterIndex] = useState(0);
  const chapter = CHAPTERS[chapterIndex];

  /* Messages TRANSMIS du chapitre courant (compteur « X/N » + saut).
     Les messages perdus (fragments) en sont exclus : ils comptent
     pour la frise/collection cumulative, mais pas pour le saut. */
  const ALL_MSGS = Object.keys(chapter.messages).filter((id) => !chapter.messages[id].perdu);

  /* Un élément est-il encore utile ? (au moins une recette pas
     encore réalisée l'utilise) — utilise le chapitre courant.
     Les objets « héritage » (heirloom) ne sont JAMAIS nettoyés :
     ils ne servent pas dans ce chapitre, mais voyageront au suivant.
     `keep` : objet à conserver dans la besace même si aucune RECETTE ne
     l'utilise (ex. ingrédients d'un mini-jeu : encre, calame, papyrus). */
  const isUseful = (id, made) =>
    chapter.items[id]?.heirloom ||
    chapter.items[id]?.keep ||
    chapter.recipes.some((r) => (r.a === id || r.b === id) && !made.includes(r.out));
  const cleanup = (invArr, made) => invArr.filter((id) => isUseful(id, made));

  const [screen, setScreen] = useState("title"); // title | play | transition | end
  const [transitionTo, setTransitionTo] = useState(null); // chapitre visé pendant la transition
  const [maxReached, setMaxReached] = useState(0); // plus haut chapitre débloqué (menu titre)
  const [mode, setMode] = useState("jeu1");        // "jeu1" (voyage principal) | "jeu2" (enquête Al3x1A) | "jeu3" (bunker 2087)
  const [jeu3Start, setJeu3Start] = useState(null); // triche : pièce + flags + heardPnj initiaux pour Jeu3
  const [jeu3Nonce, setJeu3Nonce] = useState(0);    // bump → remonte Jeu3 (triche appliquée dès useState)
  const [jeu2Target, setJeu2Target] = useState(-1); // index du chapitre où Al3x1A est bloqué·e
  const [jeu2Notes, setJeu2Notes] = useState([]);  // chapitres où la note a été lue (indices)
  const [jeu2Found, setJeu2Found] = useState(false); // Al3x1A a été trouvé·e ?
  /* Tirages au sort de l'ENQUETE : quel emplacement pour chaque note
     (10 indices 0-2), et quelle cachette pour Al3x1A (un index 0-2 dans
     son chapitre cible). Perse dans la save : deux parties differentes
     = deux enquetes differentes, meme si le chapitre cible est le meme. */
  const [jeu2NotePicks, setJeu2NotePicks] = useState(() => Array(10).fill(0));
  const [jeu2AlxPick, setJeu2AlxPick] = useState(0);
  const [openNote, setOpenNote] = useState(null);  // { chapitre } → affiche la modale de note
  const [openRetrouvailles, setOpenRetrouvailles] = useState(false);
  const [tab, setTab] = useState(CHAPTERS[0].startScene); // tableau courant
  const [dialog, setDialog] = useState({ lines: CHAPTERS[0].intro, idx: 0, mood: "neutre" });
  const [inv, setInv] = useState([]);            // besace (identifiants d'objets)
  const [msgs, setMsgs] = useState([]);          // messages transmis au futur
  const [collection, setCollection] = useState([]); // frise cumulative : {id, titre, emoji, date, jauges, perdu}
  const [made, setMade] = useState([]);          // tout ce qui a déjà été créé/découvert
  const [flags, setFlags] = useState({});        // drapeaux d'événements (ex. hunted)
  const [quete, setQuete] = useState(0);         // étape en cours de la quête du chapitre (voir data.js)
  const [portraitOpen, setPortraitOpen] = useState(false); // le gros plan de l'étape est-il affiché ?
  const [modal, setModal] = useState(null);      // fiche documentaire ou carnet
  const [restartAsk, setRestartAsk] = useState(null); // "chapter" | "game" | null — confirmation « recommencer »
  const [bubble, setBubble] = useState(null);    // phylactère d'un personnage {text, x, y}
  const [shake, setShake] = useState(false);     // animation d'échec (besace)
  const [sparkle, setSparkle] = useState(false); // halo de réussite (tableau)
  const [reveal, setReveal] = useState(false);   // bouton 👁
  const [fx, setFx] = useState(null);            // particules {x, y, big, key}
  const [dust, setDust] = useState(null);        // effet poussière d'un message perdu {x, y, emoji, key}
  const [muted, setMutedState] = useState(isMuted()); // bouton 🔇 (mémorisé)
  const [cheat, setCheat] = useState(false);     // mode triche (dev) — tape « triche » pour l'ouvrir
  const [debugNotes, setDebugNotes] = useState(false); // mode calage : voir les 3 emplacements de note du chapitre — tape « notes »
  const [epiChoice, setEpiChoice] = useState(null); // épilogue : le support choisi par le joueur
  const [prenom, setPrenom] = useState("");      // carnet imprimable : le prénom de l'élève
  const [mediadex, setMediadex] = useState([]);  // msg_ids des cartes-inventions découvertes
  const [cardShowing, setCardShowing] = useState(null); // {card, message} pendant l'apparition
  const [showMediadex, setShowMediadex] = useState(false); // l'écran Mediadex plein écran est-il ouvert ?
  const [sosPending, setSosPending] = useState(null);   // msg_id dont on peut encore émettre le SOS
  const [sosOpen, setSosOpen] = useState(false);         // l'animation Morse est-elle en cours ?
  const [sosSent, setSosSent] = useState([]);            // msg_ids pour lesquels le SOS a été émis
  const [flux, setFlux] = useState(0);                   // ⚡ jauge du chapitre courant (remise à 0 au saut)
  const [fluxTotal, setFluxTotal] = useState(0);         // ⚡ score cumulé du voyage entier (jamais remis à 0)
  const [bonusChapters, setBonusChapters] = useState([]);// indices des chapitres où le bonus a été debloqué (flux à ≥ target+10)
  const [fluxBubble, setFluxBubble] = useState(null);    // {delta, key} — anim +N/-N flottante
  const [sosChooserOpen, setSosChooserOpen] = useState(false); // choix du support SOS fin de chapitre
  const [vesselOpen, setVesselOpen] = useState(false);          // Vaisseau temporel (fin de chapitre)
  const [anachronismLearned, setAnachronismLearned] = useState(false); // MARTINE a-t-elle déjà expliqué les déchets temporels ?
  const [anachronismesJetesCount, setAnachronismesJetesCount] = useState(0); // combien de déchets ont déjà été jetés (pour éviter que Martine ré-explique)
  /* Confort de lecture (accessibilité) — mémorisé sur l'appareil, à part
     de la sauvegarde de partie (une même classe garde ses réglages). */
  const [a11y, setA11y] = useState(() => {
    try { return { gros: false, dys: false, calme: false, ...JSON.parse(localStorage.getItem("martine.a11y") || "{}") }; }
    catch { return { gros: false, dys: false, calme: false }; }
  });
  const [isFull, setIsFull] = useState(false);   // plein écran (mode classe)
  /* Le décor est en 16/9 : sur un écran LARGE il est bloqué par la hauteur et
     il reste de la place perdue sur les côtés → on met la besace en colonne à
     gauche (le décor gagne ~38 % de surface sur un 1366×768). Sur un écran
     étroit ou une tablette 4/3, c'est la largeur qui manque : la besace
     revient en bas, où le pouce l'atteint. */
  const REQ_LARGE = "(min-width: 1000px) and (min-aspect-ratio: 8/5)";
  const [large, setLarge] = useState(() => typeof window !== "undefined" && window.matchMedia(REQ_LARGE).matches);
  useEffect(() => {
    const mq = window.matchMedia(REQ_LARGE);
    /* on écoute AUSSI le redimensionnement : c'est la ceinture et les
       bretelles (passage en plein écran, rotation d'une tablette…). */
    const sync = () => setLarge(mq.matches);
    mq.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    return () => { mq.removeEventListener("change", sync); window.removeEventListener("resize", sync); };
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next); setMutedState(next);
    /* on vient d'ACTIVER le son ? un petit bip de confirmation, joué dans
       ce clic (donc autorisé par Firefox) : test direct que le son sort. */
    if (!next) setTimeout(() => playSfx("test"), 40);
  };
  /* `mood` pilote l'expression de l'avatar : "neutre" | "content" | "vexe" */
  const say = (line, mood = "neutre") => setDialog({ lines: Array.isArray(line) ? line : [line], idx: 0, mood });
  const flash = () => { setSparkle(true); setTimeout(() => setSparkle(false), 800); };

  /* Volée de particules au point de la combinaison.
     `big` : version amplifiée pour les messages transmis au futur. */
  const boom = (point, big = false) => {
    const p = point && point.x ? point : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    setFx({ ...p, big, key: Date.now() });
    setTimeout(() => setFx(null), 1100);
  };

  /* Effet « poussière » d'un message perdu : le pictogramme s'envole
     du point de la combinaison et se désintègre. */
  const poof = (point, emoji) => {
    const p = point && point.x ? point : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    setDust({ ...p, emoji, key: Date.now() });
    setTimeout(() => setDust(null), 1000);
  };

  /* SAUVEGARDE AUTOMATIQUE : dès qu'un élément important change
     pendant une partie, on écrit l'état dans le navigateur. On ne
     sauvegarde PAS sur l'écran titre (pour ne pas écraser une
     partie existante avec un état vide). */
  useEffect(() => {
    if (screen === "play" || screen === "end") {
      writeSave({ chapterIndex, maxReached, screen, tab, inv, msgs, made, flags, collection, quete, mediadex, sosSent, flux, fluxTotal, bonusChapters, anachronismLearned, prenom, mode, jeu2Target, jeu2Notes, jeu2Found, jeu2NotePicks, jeu2AlxPick }, mode);
    }
  }, [chapterIndex, maxReached, screen, tab, inv, msgs, made, flags, collection, quete, mediadex, sosSent, flux, fluxTotal, bonusChapters, anachronismLearned, prenom, mode, jeu2Target, jeu2Notes, jeu2Found, jeu2NotePicks, jeu2AlxPick]);

  /* CONFORT DE LECTURE : applique les classes sur <html> (le CSS fait le
     reste, moteur compris) et mémorise le choix sur l'appareil. */
  useEffect(() => {
    const r = document.documentElement;
    r.classList.toggle("a11y-gros", a11y.gros);
    r.classList.toggle("a11y-dys", a11y.dys);
    r.classList.toggle("a11y-calme", a11y.calme);
    try { localStorage.setItem("martine.a11y", JSON.stringify(a11y)); } catch { /* stockage indisponible */ }
  }, [a11y]);

  /* Pose data-mode="jeu1"/"jeu2" sur <body> : le CSS global s'en sert pour
     cacher les elements pertinents seulement dans un mode (ex. pastilles
     jaunes « ? » sur les PNJ, cachees en jeu 2). */
  useEffect(() => {
    try { document.body.dataset.mode = mode; } catch { /* rien */ }
  }, [mode]);

  /* la bulle d'un personnage disparaît quand on change de tableau */
  useEffect(() => { setBubble(null); }, [tab]);

  /* Animation JS-piloté des lettres du titre (utile même quand le CSS
     `prefers-reduced-motion: reduce` désactive les animations CSS). */
  const titleLetterRefs = useRef([]);
  useEffect(() => {
    if (screen !== "title") return;
    let raf;
    const t0 = performance.now();
    const step = (t) => {
      const dt = (t - t0) / 1000;
      titleLetterRefs.current.forEach((el, i) => {
        if (!el) return;
        const y = Math.sin(dt * 1.85 + i * 0.55) * 6;
        const glow = 0.5 + 0.4 * (Math.sin(dt * 1.5 + i * 0.4) * 0.5 + 0.5);
        el.style.transform = `translateY(${y.toFixed(2)}px)`;
        el.style.textShadow = `0 0 ${(6 + 12 * glow).toFixed(1)}px rgba(255,209,102,${(0.35 + 0.55 * glow).toFixed(2)}), 0 2px 22px rgba(232,150,74,${(0.35 + 0.3 * glow).toFixed(2)})`;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [screen]);

  /* le bouton SOS en attente se ferme dès qu'on change de tableau ou de
     chapitre (on n'accumule pas les SOS non émis entre deux scènes). */
  useEffect(() => { setSosPending(null); setSosOpen(false); }, [tab, chapterIndex]);

  /* les objets marqués `ephemere: true` (fausses pistes d'un tableau —
     jouets, bric-à-brac…) disparaissent du sac dès qu'on change de
     tableau. Le champ `made` reste : ils ne réapparaîtront pas si on
     revient dans le décor. */
  useEffect(() => {
    const items = chapter?.items || {};
    setInv((v) => v.filter((id) => !items[id]?.ephemere));
  }, [tab, chapterIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  /* …et dès qu'on clique AILLEURS (n'importe où sur l'écran). L'écouteur
     est en phase de CAPTURE : si le clic vise un autre personnage, la bulle
     s'efface d'abord, puis son action réaffiche aussitôt la nouvelle.
     EXCEPTION : quand la bulle porte un mini-dialogue à choix, ne pas la
     fermer sur le clic du choix (sinon la sélection est perdue avant que
     pickChoice n'ait le temps d'inscrire la réponse). */
  useEffect(() => {
    if (!bubble) return;
    const fermer = (ev) => {
      const inChoices = ev.target && ev.target.closest && ev.target.closest('[data-bubble-choice]');
      if (inChoices) return;
      setBubble(null);
    };
    document.addEventListener("click", fermer, true);
    return () => document.removeEventListener("click", fermer, true);
  }, [bubble]);

  /* Dimensionnement du décor : on mesure la place disponible (la cellule
     centrale) et on calcule le PLUS GRAND cadre au ratio 1000/560 qui y
     tient ENTIÈREMENT — largeur OU hauteur selon ce qui limite. Ainsi le
     décor n'est jamais « trop zoomé » (pas de rognage au-delà de la légère
     sur-échelle de la parallaxe), quelle que soit la taille d'écran. */
  const decorCellRef = useRef(null);
  const [decorBox, setDecorBox] = useState(null);
  useEffect(() => {
    const el = decorCellRef.current;
    if (!el) return;
    const R = 1000 / 560;
    const mesurer = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      const box = w / h > R ? { w: Math.round(h * R), h } : { w, h: Math.round(w / R) };
      setDecorBox(box);
    };
    mesurer();
    const ro = new ResizeObserver(mesurer);
    ro.observe(el);
    return () => ro.disconnect();
  }, [screen]);

  /* PLEIN ÉCRAN (mode classe) : suit l'état réel du navigateur, car on
     peut aussi en sortir avec la touche Échap. */
  useEffect(() => {
    const onFsChange = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);
  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.();
  };

  /* MODE TRICHE (pour l'enseignant, pas les élèves) : tape le mot
     « triche » au clavier n'importe où pour afficher/masquer le
     petit panneau de test. Aucun conflit avec les raccourcis du
     navigateur. Tout est dans App.jsx (le moteur n'est pas touché). */
  useEffect(() => {
    let buf = "";
    const onKey = (e) => {
      if (e.key && e.key.length === 1) {
        buf = (buf + e.key.toLowerCase()).slice(-6);
        if (buf === "triche") setCheat((c) => !c);
        if (buf.endsWith("notes")) setDebugNotes((c) => !c);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Actions du mode triche */
  const cheatGiveAll = () => setInv(Object.keys(chapter.items)); // tous les éléments du chapitre dans la besace
  const cheatUnlockAll = () => setMaxReached(CHAPTERS.length - 1); // débloque tous les chapitres du menu
  const cheatFillFrise = () => {                                  // remplit la frise de TOUTES les époques
    const all = [];
    CHAPTERS.forEach((ch) => Object.entries(ch.messages).forEach(([id, m]) =>
      all.push({ id, titre: m.title, emoji: m.emoji, date: ch.date, jauges: m.jauges, fact: m.fact, perdu: !!m.perdu })));
    setCollection(all);
  };

  /* Démarre une NOUVELLE partie (tout remis à zéro, chapitre 1).
     Passe d'abord par l'intro narrative (6 tableaux illustrés). */
  const newGame = () => {
    setMode("jeu1");
    setChapterIndex(0); setMaxReached(0);
    setInv([]); setMsgs([]); setMade([]); setFlags({}); setCollection([]); setQuete(0);
    setMediadex([]); setSosSent([]); setFlux(0); setFluxTotal(0); setBonusChapters([]);
    setTab(CHAPTERS[0].startScene); setDialog({ lines: CHAPTERS[0].intro, idx: 0, mood: "neutre" });
    setScreen("intro");
  };

  /* Démarre une NOUVELLE PARTIE DE JEU 2 (« Al3x1A »). Tire au sort
     l'époque cible parmi les 9 chapitres du voyage principal, puis
     démarre au chapitre 0 (ex : la Préhistoire) pour laisser le joueur
     explorer. Notes vides, Al3x1A pas encore trouvé·e. */
  /* JEU 3 — squelette PR J3-A : réveil dans le bunker + hub avec 3
     pièces (chambre, Bureau des Rumeurs, Salle des Archives). Aucune
     mission jouable pour l'instant. Le composant Jeu3 est autonome
     (état interne de la pièce courante), on lui passe juste le prénom
     et une callback de sortie qui remet le titre. */
  const newGameJeu3 = () => {
    setMode("jeu3");
    setScreen("jeu3");
    setJeu3Start(null);
    setJeu3Nonce((n) => n + 1);
  };

  /* Triche : plonge direct dans l'enquête Kova (bureau déverrouillé,
     3 PNJ d'accroche déjà entendus). Évite l'intro. */
  const cheatJeu3Kova = () => {
    setMode("jeu3");
    setScreen("jeu3");
    setJeu3Start({
      room: "rumeurs",
      flags: { puits_billet: true },
      heardPnj: { voisin_lior: true, chapelle_anselme: true, cantine_via: true },
    });
    setJeu3Nonce((n) => n + 1);
  };

  /* Triche : Kova déjà résolue, Vitamine prête à briefer. */
  const cheatJeu3Vitamine = () => {
    setMode("jeu3");
    setScreen("jeu3");
    setJeu3Start({
      room: "rumeurs",
      flags: { puits_billet: true, mission_kova_done: true },
      heardPnj: { voisin_lior: true, chapelle_anselme: true, cantine_via: true },
    });
    setJeu3Nonce((n) => n + 1);
  };

  /* Triche : les 2 premières enquêtes faites, 40e jour prête. */
  const cheatJeu3Jour40 = () => {
    setMode("jeu3");
    setScreen("jeu3");
    setJeu3Start({
      room: "rumeurs",
      flags: { puits_billet: true, mission_kova_done: true, mission_vitamine_done: true },
      heardPnj: { voisin_lior: true, chapelle_anselme: true, cantine_via: true },
    });
    setJeu3Nonce((n) => n + 1);
  };

  /* Triche : les 3 premières enquêtes faites, Enfant prête. */
  const cheatJeu3Enfant = () => {
    setMode("jeu3");
    setScreen("jeu3");
    setJeu3Start({
      room: "rumeurs",
      flags: { puits_billet: true, mission_kova_done: true, mission_vitamine_done: true, mission_jour40_done: true },
      heardPnj: { voisin_lior: true, chapelle_anselme: true, cantine_via: true },
    });
    setJeu3Nonce((n) => n + 1);
  };

  /* Triche : les 4 premières enquêtes faites, Champ de blé prête. */
  const cheatJeu3Champble = () => {
    setMode("jeu3");
    setScreen("jeu3");
    setJeu3Start({
      room: "rumeurs",
      flags: { puits_billet: true, mission_kova_done: true, mission_vitamine_done: true, mission_jour40_done: true, mission_enfant_done: true },
      heardPnj: { voisin_lior: true, chapelle_anselme: true, cantine_via: true },
    });
    setJeu3Nonce((n) => n + 1);
  };

  /* Triche : enquête 6 Fontaine (FRAGILE) prête. */
  const cheatJeu3Fontaine = () => {
    setMode("jeu3");
    setScreen("jeu3");
    setJeu3Start({
      room: "rumeurs",
      flags: { puits_billet: true, mission_kova_done: true, mission_vitamine_done: true, mission_jour40_done: true, mission_enfant_done: true, mission_champble_done: true },
      heardPnj: { voisin_lior: true, chapelle_anselme: true, cantine_via: true },
    });
    setJeu3Nonce((n) => n + 1);
  };

  /* Triche : enquête 7 Viande (SOLIDE) prête. */
  const cheatJeu3Viande = () => {
    setMode("jeu3");
    setScreen("jeu3");
    setJeu3Start({
      room: "rumeurs",
      flags: { puits_billet: true, mission_kova_done: true, mission_vitamine_done: true, mission_jour40_done: true, mission_enfant_done: true, mission_champble_done: true, mission_fontaine_done: true },
      heardPnj: { voisin_lior: true, chapelle_anselme: true, cantine_via: true },
    });
    setJeu3Nonce((n) => n + 1);
  };

  const newGameJeu2 = () => {
    setMode("jeu2");
    const target = Math.floor(Math.random() * JEU2.length);
    setJeu2Target(target);
    setJeu2Notes([]);
    setJeu2Found(false);
    /* Tirages au sort de l'enquete : pour chaque chapitre, un emplacement
       de note parmi les 3 candidats. Et pour Al3x1A, une cachette parmi
       les 3 dans son chapitre cible. Assure la re-jouabilite : deux
       parties donnent des enquetes vraiment differentes. */
    setJeu2NotePicks(JEU2.map((c) => Math.floor(Math.random() * (c.noteSpots?.length || 1))));
    setJeu2AlxPick(Math.floor(Math.random() * (JEU2[target].al3x1aSpots?.length || 1)));
    setChapterIndex(0); setMaxReached(CHAPTERS.length - 1);
    setInv([]); setMsgs([]); setMade([]); setFlags({}); setCollection([]); setQuete(0);
    setFlux(0); setFluxTotal(0); setBonusChapters([]);
    setTab(CHAPTERS[0].startScene);
    setDialog({ lines: [
      `Nouvelle mission, ${prenom || "chronaute"} : retrouver Al3x1A.`,
      "Cette personne a laissé des notes dans les époques qu'elle a traversées, chacune sur le support de son temps : peinture, argile, papyrus, manuscrit, gazette, télégramme…",
      "Trouve-les, lis-les, et déduis dans quelle époque Al3x1A est bloqué·e. Fouille les scènes — cette personne est cachée quelque part. Ta MARTINE t'attend.",
    ], idx: 0, mood: "neutre" });
    setScreen("play");
  };

  /* Charge un chapitre. L'inventaire et l'état du chapitre repartent
     de zéro (nouvelle époque)… SAUF les objets « héritage »
     (heirloom: true) qui voyagent d'une époque à l'autre — à
     condition d'exister aussi dans le chapitre d'arrivée. La frise
     et les messages découverts, eux, sont CUMULATIFS. */
  const goToChapter = (i) => {
    const carried = inv.filter((id) => chapter.items[id]?.heirloom && CHAPTERS[i].items[id]);
    /* AVANT de changer de chapitre : si le flux du chapitre courant
       depasse la cible + 10, on débloque le BONUS de ce chapitre
       (carte secrète dans la Mediadex + mention dans le carnet). */
    const req = (chapter.required || 3) * 5;
    if (flux >= req + 10 && !bonusChapters.includes(chapterIndex)) {
      setBonusChapters((b) => [...b, chapterIndex]);
    }
    setChapterIndex(i);
    setMaxReached((m) => Math.max(m, i));
    setInv(carried); setMsgs([]); setMade([]); setFlags({}); setQuete(0);
    /* Le flux du CHAPITRE se remet à zéro (chaque chapitre a sa cible) ;
       le score CUMULÉ (fluxTotal) est preservé pour le badge final. */
    setFlux(0);
    setTab(CHAPTERS[i].startScene);
    setDialog({ lines: CHAPTERS[i].intro, idx: 0, mood: "neutre" });
    setScreen("play");
  };

  /* Rejoue un chapitre depuis le menu titre (repart de son début,
     sans toucher à la frise/collection cumulative). Les objets
     HÉRITAGE (heirloom) du chapitre sont pré-remplis dans le sac
     pour qu'un enseignant puisse tester une époque sans avoir dû
     rejouer toutes les précédentes. */
  const playChapter = (i) => {
    const seed = Object.entries(CHAPTERS[i].items || {})
      .filter(([, it]) => it.heirloom).map(([id]) => id);
    setChapterIndex(i);
    setMaxReached((m) => Math.max(m, i));
    setInv(seed); setMsgs([]); setMade([]); setFlags({}); setQuete(0);
    setFlux(0); /* rejouer un chapitre : jauge fraîche, mais fluxTotal/bonus conservés */
    setTab(CHAPTERS[i].startScene);
    setDialog({ lines: CHAPTERS[i].intro, idx: 0, mood: "neutre" });
    setScreen("play");
  };

  /* JEU 2 : voyage temporel LIBRE. Le joueur clique une époque dans le
     sélecteur (colonne de droite ou barre en bas) → petit tourbillon
     temporel plein écran (style TARDIS), puis atterrissage. On ne remet
     pas l'inv/l'historique à zéro : les notes trouvées et Al3x1A restent
     acquis. L'atterrissage EVITE le tableau qui contient la note — sinon
     l'élève la voit tout de suite, aucune exploration. */
  const [jeu2Warp, setJeu2Warp] = useState(null);  // { i, nom, phase } pendant l'anim ; phase "vortex" puis "flash"
  const travelJeu2 = (i) => {
    if (i === chapterIndex) return;
    /* GARDE anti-course : si un saut est deja en cours, on l'ignore.
       Sinon on peut empiler deux setTimeouts qui se marchent dessus
       (setChapterIndex/setTab d'un saut plus ancien qui reecrit le nouveau
       apres coup) — bug potentiel « on atterrit dans le mauvais chapitre »
       ou « ecran vortex qui ne finit pas ». */
    if (jeu2Warp) return;
    playSfx("warp");
    setBubble(null);
    const nom = CHAPTERS[i].epoque || CHAPTERS[i].bandeau || `chapitre ${i + 1}`;
    setJeu2Warp({ i, nom, fading: false });
    /* Choix du tableau d'arrivée : startScene par défaut, MAIS si c'est
       le tableau de la note d'Al3x1A on décale de 1 (modulo nb de tableaux)
       — l'élève doit fouiller pour trouver la note. */
    const scenes = CHAPTERS[i]?.scenes || [];
    const notePick = Number.isInteger(jeu2NotePicks?.[i]) ? jeu2NotePicks[i] : 0;
    const spotsI = JEU2[i]?.noteSpots;
    const noteTab = (Array.isArray(spotsI) && spotsI[notePick]?.tab) ?? -1;
    let landingTab = CHAPTERS[i]?.startScene ?? 0;
    if (landingTab === noteTab && scenes.length > 1) {
      landingTab = (landingTab + 1) % scenes.length;
    }
    /* Anim TARDIS avec UN SEUL overlay + 2 timers separes pour laisser
       LE TEMPS au decor de s'installer sous l'overlay opaque avant le fondu.
       Anti-ecran-noir Firefox : les gros SVG des decors (feTurbulence...)
       demandent un peu de temps pour se peindre ; sinon le fondu revele
       un fond noir.
       0.0 → 1.4 s : vortex qui tourne + son warp
       1.4 s       : swap du chapitre (le decor commence a se monter,
                    cache derriere l'overlay quasi-opaque)
       2.4 s       : `fading` a true, l'overlay glisse de 1 a 0
       3.6 s       : overlay retire, le decor est visible et bien peint */
    setTimeout(() => {
      setChapterIndex(i);
      setTab(landingTab);
      /* Anti-crash : les objets du sac appartiennent aux data.js de
         l'epoque OU on les a ramasses. En jeu 2, quand on saute d'epoque,
         les ids ne matchent plus les items du nouveau chapitre — l'inv
         essaye d'afficher un item inconnu et crashe (items[id].desc).
         Le sac est de toute facon inutile en jeu 2, on le vide. */
      setInv([]);
      setMade([]);
      say(`🌀 Cap sur ${nom}. Explore les tableaux — les notes ne se laissent pas trouver toutes seules.`, "neutre");
    }, 1400);
    setTimeout(() => {
      setJeu2Warp((w) => w && { ...w, fading: true });
    }, 2400);
    setTimeout(() => setJeu2Warp(null), 3600);
  };

  /* Reprend la partie sauvegardée (bouton « Reprendre »). Le SLOT à
     charger est passé en argument : "jeu1" par défaut, "jeu2" quand
     on reprend le jeu 2. */
  const resume = (slot = "jeu1") => {
    const s = loadSave(slot);
    if (!s) { newGame(); return; }
    setMode(s.mode || slot);
    const i = s.chapterIndex ?? 0;
    setChapterIndex(i);
    setMaxReached(s.maxReached ?? i);
    setInv(s.inv || []); setMsgs(s.msgs || []); setMade(s.made || []);
    setFlags(s.flags || {}); setCollection(s.collection || []); setQuete(s.quete || 0);
    setMediadex(s.mediadex || []); setSosSent(s.sosSent || []); setFlux(s.flux || 0);
    setFluxTotal(s.fluxTotal || 0); setBonusChapters(s.bonusChapters || []);
    setAnachronismLearned(s.anachronismLearned || false);
    if (s.prenom) setPrenom(s.prenom);
    /* état spécifique jeu 2 (silencieusement ignoré si absent) */
    setJeu2Target(s.jeu2Target ?? -1);
    setJeu2NotePicks(Array.isArray(s.jeu2NotePicks) && s.jeu2NotePicks.length === 10 ? s.jeu2NotePicks : Array(10).fill(0));
    setJeu2AlxPick(typeof s.jeu2AlxPick === "number" ? s.jeu2AlxPick : 0);
    setJeu2Notes(s.jeu2Notes || []);
    setJeu2Found(s.jeu2Found || false);
    setTab(s.tab ?? CHAPTERS[i].startScene);
    const nom = s.prenom ? `, ${s.prenom}` : "";
    setDialog({ lines: [`Reprise du voyage${nom}. Je remets les circuits en route là où on s'était arrêtés.`], idx: 0, mood: "neutre" });
    setScreen(s.screen === "end" ? "end" : "play");
  };

  /* Ramasser un élément dans le décor.
     Les SUPPORTS (support: true dans le data.js — ex. la paroi, le feu,
     le four) ne se ramassent PAS : ils sont fixes, on les laisse dans le
     décor et on leur APPORTE un objet (glisser un outil dessus, ou le
     sélectionner puis toucher le support). Seuls les OUTILS vont au sac. */
  const collect = (id) => {
    /* JEU 2 : aucun ramassage. Le joueur n'a que la mission d'enquete
       (trouver les notes d'Al3x1A). Les objets du decor et les dechets
       anachroniques ne servent pas ici — on ignore silencieusement. */
    if (mode === "jeu2") return;
    const it = chapter.items[id];
    if (it.support) {
      say(`${it.emoji} ${it.name} — ${it.desc} Ça ne se range pas dans le sac : apporte-lui un objet (glisse quelque chose dessus).`);
      return;
    }
    if (!inv.includes(id)) {
      setInv((v) => [...v, id]);
      /* on garde une trace « obtenu » (même après usage) pour que les décors
         puissent réagir durablement — ex. la ruche décrochée, le bœuf abattu. */
      setMade((v) => (v.includes(id) ? v : [...v, id]));
      playSfx("pickup");
      /* ANACHRONISME : cet objet n'a rien à faire à cette époque !
         Première fois : MARTINE explique la mécanique de nettoyage temporel.
         Fois suivantes : petite phrase courte, sans redite. */
      if (it.anachronic) {
        /* Au ramassage, MARTINE ne donne QUE le nom + le signal
           « déchet temporel » — pas la description (spoiler). C'est
           quand l'élève JETTE l'objet dans la poubelle qu'il découvre
           l'explication complète, en récompense. */
        if (!anachronismLearned) {
          setAnachronismLearned(true);
          say(`${it.emoji} ${it.name} — 🚨 DÉCHET TEMPOREL ! Cet objet n'a rien à faire ici : un agent du temps peu soigneux l'a laissé traîner et ça POLLUE la ligne temporelle. Vite, une POUBELLE TEMPORELLE 🗑️ vient d'apparaître en bas à gauche — glisse le déchet dedans pour nettoyer et gagner du flux. Il y en a un caché à chaque époque, ouvre l'œil.`, "vexe");
        } else {
          say(`${it.emoji} ${it.name} — dans la poubelle 🗑️.`, "vexe");
        }
      } else {
        say(`${it.emoji} ${it.name} — ${it.desc}`);
      }
    } else {
      say(`${it.name} : déjà noté. ${it.desc}`);
    }
  };

  /* Action spéciale d'un décor (ex. entrer dans la grotte) */
  const action = (name, point) => {
    const act = chapter.actions[name];
    if (!act) return;
    /* JEU 2 : on desactive tous les mini-jeux (alphabet, tablette,
       cartouche, phonographe, cinema, TSF...). Ils appartiennent au
       parcours du jeu 1 (fabriquer les messages) et n'ont pas de sens
       dans l'enquete sur Al3x1A. Cliquer un objet-declencheur en jeu 2
       ne fait rien de particulier. */
    if (mode === "jeu2" && act.modal) return;
    /* certaines « actions » ouvrent un mini-jeu (ex. l'alphabet). Elles
       peuvent exiger un drapeau préalable — sinon MARTINE explique ce qui
       manque via `needMsg`, et la modale reste fermée. */
    if (act.modal) {
      if (act.needsFlag) {
        const list = Array.isArray(act.needsFlag) ? act.needsFlag : [act.needsFlag];
        const manque = list.find((f) => !flags[f] && !made.includes(f));
        if (manque) { say(act.needMsg || "Il y a une étape à faire avant.", "vexe"); return; }
      }
      /* mini-jeu qui demande un OBJET dans le sac (ex. tailler_silex
         a besoin d'un silex_brut à consommer). */
      if (act.needsItem) {
        const list = Array.isArray(act.needsItem) ? act.needsItem : [act.needsItem];
        const manque = list.find((it) => !inv.includes(it));
        if (manque) { say(act.needItemMsg || `Il te faut d'abord un ${manque}.`, "vexe"); return; }
      }
      /* Certains mini-jeux CONSOMMENT immédiatement l'objet à leur
         ouverture (le silex brut posé sur le rocher : il n'est plus
         dans ton sac). Réussite ou échec, l'objet ne revient pas. */
      if (act.consumeItem) {
        const list = Array.isArray(act.consumeItem) ? act.consumeItem : [act.consumeItem];
        setInv((v) => v.filter((x) => !list.includes(x)));
      }
      setModal({ type: act.modal }); return;
    }
    if (act.goto !== undefined) setTab(act.goto);
    /* Une action peut octroyer un drapeau (ex. un easter egg cliqué se
       souvient qu'il a été activé et ne revient pas). */
    if (act.grant) grantFlag(act.grant);
    /* LA QUÊTE (si le chapitre en a une) : quand on clique le personnage
       de l'étape en cours, il dit SA réplique d'étape (pas sa réplique
       par défaut). Une étape sans tâche (`attend`) passe aussitôt à la
       suivante : le « ? » doré se déplace. */
    /* La QUÊTE (portrait grand plan + repliques d'étape + avancée) n'est
       PAS jouée en jeu 2 : elle raconte la progression du jeu 1 et
       n'aurait aucun sens quand on enquête sur Al3x1A. */
    const step = mode === "jeu2" ? null : chapter.quete?.[quete];
    /* étape en GROS PLAN : cliquer le personnage ouvre son portrait
       (le texte, l'avancée et le `say` passent par le bouton Continuer) */
    if (step && step.perso === name && step.portrait) {
      setBubble(null);
      setPortraitOpen(true);
      return;
    }
    let bubbleText = act.bubble, sayText = act.say, mood = act.mood;
    let stepMatched = false;
    if (step && step.perso === name) {
      bubbleText = step.bubble ?? act.bubble;
      sayText = step.say ?? act.say;
      mood = step.mood ?? act.mood;
      stepMatched = true;
      if (!step.attend) {
        setQuete((q) => q + 1);
        /* une étape peut OCTROYER un drapeau en s'achevant (ex. l'accord
           du seigneur qui remet la bourse) → jalon de navigation. */
        if (step.grant) grantFlag(step.grant);
        if (step.suite) setTimeout(() => say(`➜ ${step.suite}`), 1400);
      }
    }
    /* BANALITÉS ALÉATOIRES (jeu 1) : quand on reparle à un PNJ qui n'est
       PAS son tour dans la quête, on peut :
       - lui montrer UNE FOIS un mini-dialogue à choix (`chatOnce`) pour
         du contact plus riche (question + 2-3 réponses, flavor pur) ;
       - sinon tirer une réplique de son pool `chitchat` au hasard.
       MARTINE reste silencieuse pendant ces échanges anodins. */
    let bubbleChoices = null;
    if (mode === "jeu1" && !stepMatched) {
      /* Le flag est nommé v2 pour ignorer les anciens flags `chat_*`
         d'une itération précédente qui restaient dans les saves. */
      const chatFlag = `chatv2_${name}`;
      if (act.chatOnce && !flags[chatFlag]) {
        bubbleText = act.chatOnce.q;
        bubbleChoices = act.chatOnce.choices;
        sayText = null;
        grantFlag(chatFlag);
      } else if (Array.isArray(act.chitchat) && act.chitchat.length > 0) {
        /* On tire UN SEUL index de chitchat par PNJ et par partie
           (mémorisé dans les flags du chapitre), pour que chaque
           relance donne un autre parfum de banalité — plus de
           rejouabilité, mais cohérence en session. Les flags se
           réinitialisent au début d'un nouveau chapitre / d'une
           nouvelle partie. */
        const idxKey = `chitidx_${name}`;
        let idx = flags[idxKey];
        if (typeof idx !== "number") {
          idx = Math.floor(Math.random() * act.chitchat.length);
          setFlags((f) => ({ ...f, [idxKey]: idx }));
        }
        bubbleText = act.chitchat[idx];
        sayText = null;
      }
    }
    /* MODE JEU 2 : la variante du personnage prime en toute fin. Deux
       schemas supportes :
       - `jeu2Variants` (nouveau) : tableau de 3 variantes, indexe sur
          jeu2NotePicks[chapterIndex] pour rester COHERENT avec l'emplacement
          tire au sort de la note du chapitre.
       - `jeu2` (legacy) : une seule variante, utilisee tel quel.
       Comme ca on peut migrer les PNJ progressivement. */
    if (mode === "jeu2") {
      const variants = act.jeu2Variants;
      const pickIdx = Number.isInteger(jeu2NotePicks?.[chapterIndex]) ? jeu2NotePicks[chapterIndex] : 0;
      const variant = Array.isArray(variants) && variants.length > 0
        ? variants[pickIdx % variants.length]
        : act.jeu2;
      if (variant) {
        bubbleText = variant.bubble ?? bubbleText;
        sayText = variant.say ?? sayText;
        mood = variant.mood ?? mood;
      } else if (act.bubble) {
        /* PNJ sans variante jeu 2 : reponse generique evasive. */
        const generiques = [
          { bubble: "Je vaque à mes affaires, chronaute. Je n'ai rien vu d'étrange.",
            say: "Il ne sait rien d'Al3x1A. Va voir un autre personnage." },
          { bubble: "Passe ton chemin, voyageur — je suis occupé·e.",
            say: "Peu bavard. Cherche ailleurs des indices sur Al3x1A." },
          { bubble: "Al3x1A ? Ça ne me dit rien. Demande plutôt aux plus âgés du coin.",
            say: "Cherche un personnage plus âgé, il aura peut-être vu passer Al3x1A." },
        ];
        const g = generiques[pickIdx % generiques.length];
        bubbleText = g.bubble;
        sayText = g.say;
        mood = "neutre";
      } else {
        /* Decor cliquable sans bubble (statue, mur, temple, stele) :
           en jeu 2 on ne dit RIEN (silence). Le decor reste cliquable
           mais MARTINE ne parle pas — pas de commentaire hors-sujet
           quand on enquête sur Al3x1A. */
        bubbleText = null;
        sayText = null;
      }
    }
    /* un personnage qui a des paroles propres (`bubble`) les affiche en
       phylactère à côté de lui (ancré à la dernière position cliquée) ;
       MARTINE, elle, commente dans sa console (`say`). Les deux tombent
       en même temps. */
    const pt = point || lastHotspotClick;
    if (bubbleText) setBubble({ text: bubbleText, x: pt.x, y: pt.y, choices: bubbleChoices, speaker: name });
    else setBubble(null);
    if (sayText) say(sayText, mood);
  };

  /* La quête avance toute seule quand la tâche de l'étape est accomplie
     (un objet/message de `made`, ou un drapeau ; une liste = un parmi).
     MARTINE annonce la suite un instant après le feu d'artifice. */
  useEffect(() => {
    const step = chapter.quete?.[quete];
    if (!step || !step.attend) return;
    const liste = Array.isArray(step.attend) ? step.attend : [step.attend];
    if (liste.some((id) => made.includes(id) || flags[id])) {
      setQuete((q) => q + 1);
      if (step.suite) setTimeout(() => say(`➜ ${step.suite}`), 1800);
    }
  }, [made, flags, quete]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Le gros plan : il s'ouvre TOUT SEUL sur les étapes `auto` (l'accueil
     d'Ana) et se referme dès que l'étape change — pour les autres, c'est
     le clic sur le personnage qui l'ouvre (voir `action`).
     ⚠ Une étape auto ne doit se déclencher QU'UNE FOIS : quand on change
     de tableau, l'accueil ne se relance pas si on est resté sur la même
     étape. On mémorise donc « chapitre#etape » déjà déclenché. */
  const autoFiredRef = useRef(new Set());
  useEffect(() => {
    /* En JEU 2, la quête de jeu 1 n'est pas active — pas de portrait
       auto qui viendrait re-jouer une étape du voyage principal alors
       qu'on enquête sur Al3x1A. */
    if (mode === "jeu2") { setPortraitOpen(false); return; }
    const st = chapter.quete?.[quete];
    if (!st?.portrait || !st.auto) { setPortraitOpen(false); return; }
    const key = `${chapterIndex}#${quete}`;
    if (autoFiredRef.current.has(key)) { setPortraitOpen(false); return; }
    autoFiredRef.current.add(key);
    setPortraitOpen(true);
    /* dépendance sur `tab` uniquement (pas `quete`) : l'auto se
       déclenche à l'ARRIVÉE sur un nouveau tableau, pas dès qu'une
       étape s'achève. Sinon, quand un message est transmis, l'étape
       suivante (souvent située sur le tableau SUIVANT) s'ouvre en
       force sur le tableau courant — bug « portrait un tableau trop
       tôt ». Le joueur clique sur le personnage suivant pour parler. */
  }, [tab, chapterIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  /* AMBIANCE SONORE : si le tableau courant en déclare une (champ
     `ambience` dans les SCENES du data.js), elle démarre en douceur et
     s'arrête dès qu'on change de tableau, d'écran, ou qu'on coupe le son. */
  useEffect(() => {
    const amb = screen === "play" && !muted ? chapter.scenes[tab]?.ambience : null;
    if (amb) startAmbience(amb);
    return stopAmbience;
  }, [screen, chapterIndex, tab, muted]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ⚡ Modifie la jauge de FLUX TEMPOREL avec une petite bulle animée
     +N / -N flottante. Peut passer en négatif (plafond du chapitre non
     bloquant pour l'instant — on calibrera). */
  const bumpFlux = (delta) => {
    if (!delta) return;
    /* Jauge du CHAPITRE : plafonnée à 0 en bas — impossible de creuser
       un trou invisible. Le -N s'affiche quand même en bulle flottante. */
    setFlux((v) => Math.max(0, Math.round((v + delta) * 10) / 10));
    /* Score CUMULÉ du voyage : ne compte que les gains positifs. C'est
       ton total « d'énergie gagnée » sur tout le voyage, qui décide de
       ton badge final. Les erreurs ne pénalisent pas le score global. */
    if (delta > 0) setFluxTotal((t) => Math.round((t + delta) * 10) / 10);
    setFluxBubble({ delta, key: Date.now() });
    setTimeout(() => setFluxBubble((b) => (b && b.key ? null : b)), 1400);
  };

  /* Ouvre la CARTE-INVENTION (façon Pokémon) si le message a une image
     Wikimedia dans le Mediadex. La carte apparaît par-dessus la fiche
     pédagogique et se ferme au bout de quelques secondes. Idempotent.
     Déclenche aussi le bouton SOS flottant : le joueur peut émettre le
     signal de détresse ··· −−− ··· pour être retrouvé par l'équipe. */
  const unlockCard = (msgId, msgData) => {
    // Le SOS n'apparaît plus par transmission — il se choisit en fin de chapitre
    // Carte-invention (uniquement si mappée dans le Mediadex)
    const card = getCardMeta(msgId);
    if (!card) return;
    setMediadex((v) => v.includes(msgId) ? v : [...v, msgId]);
    setTimeout(() => {
      setCardShowing({ card, message: msgData });
      playCardSound(muted);
    }, 500);
  };

  /* Octroyer un message SANS combinaison d'objets — pour les mini-jeux
     (ex. réussir « Écris MARTINE » transmet vraiment l'alphabet).
     Idempotent : pas de doublon si le cristal est déjà obtenu. */
  const grantMessage = (id) => {
    if (made.includes(id)) return;
    const m = chapter.messages[id];
    if (!m) return;
    setMade((v) => (v.includes(id) ? v : [...v, id]));
    setMsgs((v) => (v.includes(id) ? v : [...v, id]));
    setCollection((c) => c.some((x) => x.id === id) ? c
      : [...c, { id, titre: m.title, emoji: m.emoji, date: chapter.date, jauges: m.jauges, fact: m.fact, perdu: false }]);
    flash(); playSfx("message");
    /* Un message principal transmis pèse plus qu'un bonus (anachronisme, SOS,
       mini-jeu à +3) : +5 sur la jauge flux. Un chapitre required:3 se remplit
       donc pile avec 3 messages, et les bonus AJOUTENT au-delà. */
    bumpFlux(5);
    say(`◆ « ${m.title} » transmis au futur ! Tu l'as gagné en l'écrivant toi-même. Mes circuits se rechargent (+5).`, "content");
    unlockCard(id, m);
  };

  /* Octroyer un OBJET (dans la besace) — pour les mini-jeux qui font GAGNER
     un ingrédient à combiner ensuite (ex. l'alphabet, à mettre sur les navires). */
  const grantItem = (id) => {
    if (inv.includes(id)) return;
    const it = chapter.items[id];
    if (!it) return;
    setMade((v) => (v.includes(id) ? v : [...v, id]));
    setInv((v) => (v.includes(id) ? v : [...v, id]));
    flash(); playSfx("craft");
    say(`✨ Tu as gagné : ${it.emoji} ${it.name}. ${it.desc}`, "content");
  };

  /* Poser un DRAPEAU d'événement franchi (ex. « paye » : la note du
     copiste réglée). On l'inscrit AUSSI dans `made` car les jalons de
     navigation (nextWhen) et de quête (attend) le cherchent là. */
  const grantFlag = (id) => {
    setMade((v) => (v.includes(id) ? v : [...v, id]));
    setFlags((f) => ({ ...f, [id]: true }));
    flash(); playSfx("message");
  };

  const doReveal = () => { setReveal(true); setTimeout(() => setReveal(false), 2200); };

  /* Un élément est-il caché par un drapeau ? (ex. le cerf après la chasse) */
  const isHidden = (id) =>
    Object.entries(chapter.hiddenByFlag || {}).some(([flag, ids]) => flags[flag] && ids.includes(id));

  /* Tenter la combinaison de deux éléments — appelé par le
     glisser-déposer et par le tap sur une cible.
     `point` : position à l'écran, pour les particules. */
  const combinePair = (a, b, point) => {
    const rec = findRecipe(chapter.recipes, a, b);
    if (rec) {
      /* `needsInv` : objets qu'il faut AUSSI avoir en main pour que la
         recette parte (ex. la forme encrée avant de presser une feuille).
         Vaut pour TOUS les types de recettes. */
      if (rec.needsInv) {
        const manque = rec.needsInv.find((id) => !inv.includes(id));
        if (manque) { setShake(true); setTimeout(() => setShake(false), 500); playSfx("fail"); say(rec.needMsg || `Il te manque : ${chapter.items[manque]?.name}.`, "vexe"); return; }
      }
      /* `needsFlag` : ÉTAT préalable requis (drapeau ou jalon `made`), sans
         objet dans le sac — ex. la presse déjà composée/encrée. */
      if (rec.needsFlag) {
        const list = Array.isArray(rec.needsFlag) ? rec.needsFlag : [rec.needsFlag];
        const manque = list.find((f) => !flags[f] && !made.includes(f));
        if (manque) { setShake(true); setTimeout(() => setShake(false), 500); playSfx("fail"); say(rec.needMsg || "Il manque une étape avant celle-ci.", "vexe"); return; }
      }
      /* recette qui OUVRE un mini-jeu (ex. encre + papyrus → cartouche).
         Honore `consume` : les ingrédients consommés partent du sac
         immédiatement (ex. la pile de Volta apporte le courant au
         télégraphe et n'a plus lieu d'être ensuite). */
      if (rec.opens) {
        if (rec.consume) setInv((v) => cleanup(v.filter((x) => !rec.consume.includes(x)), made));
        boom(point); playSfx("craft");
        setModal({ type: rec.opens });
        return;
      }
      /* déjà réalisé ? pas de doublon */
      if (made.includes(rec.out)) {
        say(rec.perdu
          ? "Celui-là s'est déjà perdu une fois. Le bois pourrit tout aussi bien la seconde."
          : rec.msg
            ? "Déjà transmis, celui-là. Mes cristaux refusent les doublons — question de principe."
            : "Déjà fabriqué. L'artisanat, oui ; la surproduction, non.", "vexe");
        return;
      }
      const newMade = [...made, rec.out];
      setMade(newMade);

      /* Recette-événement (ex. la chasse) : donne/retire des objets, lève un drapeau */
      if (rec.gives) {
        if (rec.flag) setFlags((f) => ({ ...f, [rec.flag]: true }));
        setInv((v) => cleanup([...v.filter((x) => !(rec.consume || []).includes(x)), ...rec.gives.filter((g) => !v.includes(g))], newMade));
        flash(); boom(point); playSfx("success");
        say(rec.line, "content");
        return;
      }
      /* Message PERDU : la combinaison réussit… mais le support ne
         parvient pas au futur. Fragment (pas cristal), il rejoint la
         collection/frise mais PAS `msgs` (donc pas le saut). Ton
         mélancolique, jamais punitif. */
      if (rec.msg && rec.perdu) {
        const m = chapter.messages[rec.out];
        setCollection((c) => c.some((x) => x.id === rec.out) ? c : [...c, { id: rec.out, titre: m.title, emoji: m.emoji, date: chapter.date, jauges: m.jauges, fact: m.fact, perdu: true }]);
        setInv((v) => cleanup(v.filter((x) => !(rec.consume || []).includes(x)), newMade));
        poof(point, m.emoji); playSfx("dissolve");
        bumpFlux(2); /* message perdu = fragment récupéré, +2 flux (partiel) */
        say(`💨 « ${m.title} »… envolé. Le message a bien existé, mais son support ne nous est jamais parvenu. Tu récupères un fragment (+2⚡) — et une leçon.`, "neutre");
        setTimeout(() => setModal({ type: "lost", id: rec.out }), 850);
        return;
      }
      /* Message pour le futur : gros feu d'artifice, PUIS la fiche documentaire.
         Support optionnel `rec.give: "itemId"` : la recette FABRIQUE en plus
         un objet, ajouté à l'inventaire — utile quand un message-recette
         produit conceptuellement un objet utilisable ensuite (ex. le smartphone
         obtenu par téléphone + ordinateur, réutilisé avec le Wi-Fi). */
      if (rec.msg) {
        const m = chapter.messages[rec.out];
        setMsgs((v) => [...v, rec.out]);
        setCollection((c) => c.some((x) => x.id === rec.out) ? c : [...c, { id: rec.out, titre: m.title, emoji: m.emoji, date: chapter.date, jauges: m.jauges, fact: m.fact, perdu: false }]);
        setInv((v) => {
          const base = v.filter((x) => !(rec.consume || []).includes(x));
          const withGive = rec.give && !base.includes(rec.give) ? [...base, rec.give] : base;
          return cleanup(withGive, newMade);
        });
        flash(); boom(point, true); playSfx("message");
        /* certains messages ont leur propre son (ex. la flûte joue sa
           mélodie) : il part juste après l'arpège de transmission */
        if (m.sfx) setTimeout(() => playSfx(m.sfx), 950);
        say(`◆ « ${chapter.messages[rec.out].title} » transmis au futur ! Mes circuits se rechargent, je sens l'excellence revenir (+5⚡).`, "content");
        bumpFlux(5);
        setTimeout(() => setModal({ type: "fact", id: rec.out }), 750);
        unlockCard(rec.out, m);
        return;
      }
      /* Objet fabriqué classique */
      setInv((v) => cleanup([...v.filter((x) => !(rec.consume || []).includes(x)), rec.out], newMade));
      flash(); boom(point); playSfx("craft");
      say(`✨ NOUVEL OBJET : ${chapter.items[rec.out].emoji} ${chapter.items[rec.out].name}. ${rec.line}`, "content");
      return;
    }
    /* Échec : réplique « presque ! » si prévue, sinon réplique au hasard.
       Les éléments ne sont jamais consommés : ils restent dans la besace. */
    const nm = findNearMiss(chapter.nearMiss, a, b);
    setShake(true); setTimeout(() => setShake(false), 500);
    playSfx("fail");
    /* Malus : -1 flux si t'aurais DÛ savoir (near-miss = idée pas absurde,
       simplement mal branchée), -2 flux si combinaison au HASARD (bzzt). Le
       hasard coûte cher pour pousser à réfléchir avant de combiner. */
    bumpFlux(nm ? -1 : -2);
    say(nm ? nm.line : randomLine(chapter.failLines), "vexe");
  };

  /* Résolution d'un dépôt : élément `src` lâché sur la cible `key`.
     On combine directement dans la besace (un élément sur un autre,
     kind "item") ou sur un objet du décor (kind "hot"). */
  const handleDrop = (src, key, point) => {
    const [kind, val] = key.split(":");
    /* POUBELLE TEMPORELLE : anachronisme jeté → +flux ; mauvais objet → bzzt. */
    if (kind === "hot" && val === "poubelle_temporelle") {
      const it = chapter.items?.[src];
      if (it?.anachronic) {
        setInv((v) => v.filter((x) => x !== src));
        bumpFlux(3);
        flash(); playSfx("success");
        /* Recompense pedagogique : le TOUT PREMIER dechet jete (celui de la
           Prehistoire) merite l'explication complete pour que l'eleve
           comprenne le principe. Les suivants ne meritent qu'une petite
           confirmation — inutile que Martine re-explique a chaque fois. */
        if (anachronismesJetesCount === 0) {
          say(`✓ ${it.emoji} ${it.name} — jeté dans la poubelle temporelle. ${it.desc || ""} La ligne temporelle respire. +3 flux.`, "content");
        } else {
          say(`✓ ${it.emoji} ${it.name} — jeté. +3 flux.`, "content");
        }
        setAnachronismesJetesCount((n) => n + 1);
      } else {
        setShake(true); setTimeout(() => setShake(false), 500);
        playSfx("fail");
        say("La poubelle temporelle sert à jeter les OBJETS ANACHRONIQUES — pas tes vraies affaires !", "vexe");
      }
      return;
    }
    /* ROCHER DE TAILLE (préhistoire) : on glisse un silex brut dessus →
       le silex quitte le sac, le mini-jeu de taille s'ouvre. Tout autre
       objet déposé rebondit avec une réplique. */
    if (kind === "hot" && val === "rocher_taille") {
      if (src === "silex_brut") {
        setInv((v) => v.filter((x) => x !== src));
        setModal({ type: "taille_silex", from: "drop" });
      } else {
        setShake(true); setTimeout(() => setShake(false), 500);
        playSfx("fail");
        say("Ce n'est pas un silex brut. Le rocher de taille n'accepte que ça.", "vexe");
      }
      return;
    }
    if ((kind === "item" || kind === "hot") && val !== src) combinePair(src, val, point);
  };

  /* Bouton 💡 : propose le prochain indice utile */
  const hint = () => {
    const h = chapter.hints.find((h) => h.needs.every((n) => inv.includes(n)) && !made.includes(h.out) && !msgs.includes(h.out));
    if (h) { say(`💡 Indice : ${h.text}`); return; }
    const missing = Object.keys(chapter.where).find((id) => !inv.includes(id) && !isHidden(id) && isUseful(id, made));
    if (missing) say(`💡 Indice : il reste des choses à découvrir ${chapter.where[missing]}. Observe bien le décor… (le bouton 👁 peut aider)`);
    else say("💡 Tu as tout trouvé. Il ne reste plus qu'à combiner — glisse un élément sur un autre, ou sur le décor.");
  };

  const restart = () => {
    setChapterIndex(0);
    setInv([]); setMsgs([]); setMade([]); setFlags({}); setCollection([]); setQuete(0);
    setTab(CHAPTERS[0].startScene); setScreen("title");
  };

  /* Exporter : télécharge la progression dans un petit fichier .json
     (pour la reprendre sur un autre poste du CDI). */
  const doExport = () => {
    const text = exportSaveString();
    if (!text) { say("Rien à exporter pour l'instant — commence une partie d'abord."); return; }
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "martine-sauvegarde.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* Importer : lit le fichier .json choisi par l'élève et reprend
     la partie qu'il contient. */
  const doImport = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (importSaveString(String(reader.result))) {
        setModal(null);
        resume();
      } else {
        /* message affiché DANS le menu réglages (visible par-dessus) */
        setModal({ type: "settings", error: "Ce fichier n'est pas une sauvegarde MARTINE valide. Vérifie que c'est bien le bon fichier .json." });
      }
    };
    reader.readAsText(file);
  };

  /* Les objets HÉRITAGE (heirloom) du chapitre courant DOIVENT être en
     besace avant de partir SI le chapitre suivant les attend (ex. la
     disquette de ch8 pour ch9). On ne bloque PAS quand l'heirloom est
     consommé dans le chapitre lui-même (ex. la pile de Volta brûlée au
     télégraphe Morse, absente de ch8). */
  const nextItems = CHAPTERS[chapterIndex + 1]?.items || {};
  const heritagesManquants = Object.entries(chapter.items)
    .filter(([id, it]) => it.heirloom && nextItems[id] && !inv.includes(id))
    .map(([, it]) => it.name);
  /* FUSION : la jauge unique du chapitre est le FLUX. Chaque chapitre
     exige un total = required × 5 flux (soit exactement N messages, ou
     un mix messages + bonus). Les bonus (SOS, anachronismes, mini-jeux)
     ne sont plus un score à part : ils comptent pour le départ. */
  const fluxRequis = (chapter.required || 3) * 5;
  const canJump = flux >= fluxRequis && heritagesManquants.length === 0;
  const jumpBloque = flux >= fluxRequis && heritagesManquants.length > 0
    ? `Fabrique d'abord : ${heritagesManquants.join(", ")}` : null;
  const isLastChapter = chapterIndex >= CHAPTERS.length - 1;
  /* Saut temporel : écran de transition vers le chapitre suivant s'il
     existe. Après le DERNIER chapitre, place à l'ÉPILOGUE : MARTINE pose
     sa question (« ton message pour +20 000 ans »), puis on enchaîne sur
     l'écran de bilan. */
  const jump = () => {
    if (!canJump) return;
    playSfx("jump");
    /* Avant le saut : le joueur choisit UN support SOS parmi les inventions
       du chapitre. Le choix octroie des points de flux temporel selon la
       durabilité du support. Ensuite l'animation Morse joue, puis le saut. */
    setSosChooserOpen(true);
  };

  /* petit style commun des boutons du bandeau */
  const headBtn = { background: "#141b26", border: "1px solid #2a3648", color: "#c8d4e2", borderRadius: 10, padding: "7px 11px", cursor: "pointer", fontSize: 13 };

  /* Panneau du MODE TRICHE — visible seulement après avoir tapé
     « triche ». Réutilisé dans tous les écrans via <CheatPanel />. */
  const cheatPanel = (
    <CheatPanel
      cheat={cheat}
      onClose={() => setCheat(false)}
      chapters={CHAPTERS}
      jeu2={JEU2}
      mode={mode}
      chapterIndex={chapterIndex}
      jeu2Target={jeu2Target}
      jeu2Notes={jeu2Notes}
      onGiveAll={cheatGiveAll}
      onUnlockAll={cheatUnlockAll}
      onFillFrise={cheatFillFrise}
      onPlayChapter={playChapter}
      onSetChapterIndex={setChapterIndex}
      onSetScreen={setScreen}
      onSetEpiChoice={setEpiChoice}
      onSetTab={setTab}
      onNewGameJeu2={newGameJeu2}
      onNewGameJeu3={newGameJeu3}
      onCheatJeu3Kova={cheatJeu3Kova}
      onCheatJeu3Vitamine={cheatJeu3Vitamine}
      onCheatJeu3Jour40={cheatJeu3Jour40}
      onCheatJeu3Enfant={cheatJeu3Enfant}
      onCheatJeu3Champble={cheatJeu3Champble}
      onCheatJeu3Fontaine={cheatJeu3Fontaine}
      onCheatJeu3Viande={cheatJeu3Viande}
    />
  );

  /* Un interrupteur on/off réutilisable (avec case à cocher accessible). */
  const Toggle = ({ on, onToggle, label, hint }) => (
    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, background: on ? "#14251c" : "#141b26", border: `1px solid ${on ? "#2a5a3a" : "#2a3648"}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer" }}>
      <input type="checkbox" checked={on} onChange={onToggle} style={{ width: 20, height: 20, accentColor: "#5eff9e", marginTop: 1, flex: "0 0 auto", cursor: "pointer" }} />
      <span>
        <span style={{ fontWeight: 700, color: "#e8eef5", fontSize: 14 }}>{label}</span>
        <span style={{ display: "block", fontSize: 12, color: "#a8b6c8", marginTop: 2, lineHeight: 1.4 }}>{hint}</span>
      </span>
    </label>
  );

  /* Menu Réglages : confort de lecture + exporter / importer la sauvegarde.
     Réutilisé depuis l'écran titre et depuis le jeu (bouton ⚙). */
  const SettingsModal = () => (
    <div style={overlay} onClick={() => setModal(null)}>
      <div style={{ ...card, maxHeight: "88vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0, color: "#5eff9e", fontFamily: "ui-monospace,monospace", letterSpacing: 2, fontSize: 16 }}>⚙ RÉGLAGES</h2>

        {/* ---- Actions rapides pendant le jeu ---- */}
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10.5, letterSpacing: 2, color: "#7a879e", margin: "2px 0 8px" }}>🎮 ACTIONS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button onClick={() => { setModal(null); toggleMute(); }}
            style={{ background: "#141b26", color: muted ? "#5a6678" : "#c8d4e2", border: "1px solid #2a3648", borderRadius: 10, padding: "11px 12px", fontWeight: 700, cursor: "pointer", fontSize: 14, textAlign: "left" }}>
            {muted ? "🔇 Son coupé" : "🔊 Son activé"}
          </button>
          <button onClick={() => { setModal(null); hint(); }}
            style={{ background: "#141b26", color: "#ffd166", border: "1px solid #2a3648", borderRadius: 10, padding: "11px 12px", fontWeight: 700, cursor: "pointer", fontSize: 14, textAlign: "left" }}>
            💡 Indice
          </button>
          <button onClick={() => { setModal(null); doReveal(); }}
            style={{ background: "#141b26", color: "#c8d4e2", border: "1px solid #2a3648", borderRadius: 10, padding: "11px 12px", fontWeight: 700, cursor: "pointer", fontSize: 14, textAlign: "left" }}>
            👁 Révéler les zones
          </button>
          <button onClick={() => setModal({ type: "journal" })}
            style={{ background: "#141b26", color: "#c8d4e2", border: "1px solid #2a3648", borderRadius: 10, padding: "11px 12px", fontWeight: 700, cursor: "pointer", fontSize: 14, textAlign: "left" }}>
            📔 Carnet de bord
          </button>
        </div>

        {/* ---- Recommencer : ce chapitre / toute la partie ---- */}
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10.5, letterSpacing: 2, color: "#7a879e", margin: "16px 0 8px" }}>🔄 RECOMMENCER</div>
        {restartAsk ? (
          <div style={{ background: "#2a1a10", border: "1px solid #6a3820", borderRadius: 10, padding: "12px 14px" }}>
            <p style={{ margin: "0 0 10px", fontSize: 13.5, color: "#ffd8b0", lineHeight: 1.5 }}>
              {restartAsk === "chapter"
                ? "Recommencer ce chapitre depuis le début ? Ta progression dans les autres chapitres est conservée."
                : "Effacer TOUTE la partie et repartir du début ? Cette action est définitive."}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setRestartAsk(null)}
                style={{ flex: 1, background: "#141b26", color: "#c8d4e2", border: "1px solid #2a3648", borderRadius: 8, padding: "10px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                Non, annuler
              </button>
              <button onClick={() => {
                  if (restartAsk === "chapter") {
                    playChapter(chapterIndex);
                  } else {
                    clearSave("jeu1");
                    newGame();
                  }
                  setRestartAsk(null);
                  setModal(null);
                }}
                style={{ flex: 1, background: "#c04a2a", color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontWeight: 800, cursor: "pointer", fontSize: 13 }}>
                Oui, recommencer
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button onClick={() => setRestartAsk("chapter")}
              style={{ background: "#141b26", color: "#ffd166", border: "1px solid #2a3648", borderRadius: 10, padding: "11px 12px", fontWeight: 700, cursor: "pointer", fontSize: 14, textAlign: "left" }}>
              ↺ Ce chapitre
            </button>
            <button onClick={() => setRestartAsk("game")}
              style={{ background: "#141b26", color: "#ff8a6a", border: "1px solid #4a2a20", borderRadius: 10, padding: "11px 12px", fontWeight: 700, cursor: "pointer", fontSize: 14, textAlign: "left" }}>
              ↺ Toute la partie
            </button>
          </div>
        )}

        {/* ---- Confort de lecture (accessibilité) ---- */}
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10.5, letterSpacing: 2, color: "#7a879e", margin: "16px 0 8px" }}>👁 CONFORT DE LECTURE</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <Toggle on={a11y.gros} onToggle={() => setA11y((s) => ({ ...s, gros: !s.gros }))}
            label="Texte plus grand" hint="Pour le vidéoprojecteur et le fond de la classe." />
          <Toggle on={a11y.dys} onToggle={() => setA11y((s) => ({ ...s, dys: !s.dys }))}
            label="Lecture facilitée (dys)" hint="Police plus simple et lettres plus espacées." />
          <Toggle on={a11y.calme} onToggle={() => setA11y((s) => ({ ...s, calme: !s.calme }))}
            label="Animations calmes" hint="Réduit les mouvements et les scintillements." />
          <button onClick={toggleFullscreen} style={{ background: "#141b26", color: "#c8d4e2", border: "1px solid #2a3648", borderRadius: 10, padding: "11px 12px", fontWeight: 700, cursor: "pointer", fontSize: 14, textAlign: "left" }}>
            {isFull ? "⛶ Quitter le plein écran" : "⛶ Plein écran (mode classe)"}
          </button>
        </div>

        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10.5, letterSpacing: 2, color: "#7a879e", margin: "16px 0 8px" }}>💾 SAUVEGARDE</div>
        <p style={{ fontSize: 13.5, color: "#c8d4e2", lineHeight: 1.6, marginTop: 4 }}>
          Ta partie est enregistrée sur cet ordinateur. Pour la continuer sur un
          autre poste (au CDI, à la maison), <strong>exporte</strong> ton fichier ici,
          puis <strong>importe</strong>-le là-bas.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
          <button onClick={doExport} style={{ background: "#1a2536", color: "#5eff9e", border: "1px solid #2a4a38", borderRadius: 10, padding: "12px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
            ⬇ Exporter ma partie (fichier .json)
          </button>
          <label style={{ background: "#1a2536", color: "#ffd166", border: "1px solid #4a4228", borderRadius: 10, padding: "12px", fontWeight: 700, cursor: "pointer", fontSize: 14, textAlign: "center" }}>
            ⬆ Importer une partie…
            <input type="file" accept="application/json,.json" style={{ display: "none" }}
              onChange={(e) => doImport(e.target.files?.[0])} />
          </label>
        </div>
        {modal?.error && (
          <p style={{ fontSize: 12.5, color: "#ff9b8a", marginTop: 10, lineHeight: 1.5 }}>⚠ {modal.error}</p>
        )}
        <button onClick={() => setModal(null)} style={{ marginTop: 14, width: "100%", background: "transparent", color: "#8fa3bd", border: "1px solid #2a3648", borderRadius: 10, padding: "10px", fontWeight: 700, cursor: "pointer" }}>
          Fermer
        </button>
      </div>
    </div>
  );

  /* ---------- écran titre ---------- */
  if (screen === "title") {
    const saved = loadSave("jeu1");
    const saveExists = saved !== null;
    /* JEU 2 débloqué si le voyage principal a été terminé au moins
       une fois (l'écran end a été atteint). Le save existe encore et
       porte ce marqueur. */
    const jeu1Fini = !!(saved && saved.screen === "end");
    const savedJeu2 = loadSave("jeu2");
    /* chapitres débloqués : le plus haut atteint, lu aussi dans la
       sauvegarde (car `maxReached` repart à 0 tant qu'on n'a pas repris) */
    const menuMax = Math.max(maxReached, saved?.maxReached ?? saved?.chapterIndex ?? 0);
    return (
      <div style={{ minHeight: "100vh", background: "#080d16", position: "relative", overflow: "hidden", fontFamily: "Palatino, Georgia, serif" }}>
        {cheatPanel}
        {/* Illustration plein ecran : desert 3/4 avec grande pyramide et hieroglyphes */}
        <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} aria-hidden="true">
            <defs>
              <linearGradient id="ttlSky" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0"    stopColor="#2d69a8" />
                <stop offset="0.55" stopColor="#7fb8e0" />
                <stop offset="1"    stopColor="#f0c078" />
              </linearGradient>
              <radialGradient id="ttlSun" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0"    stopColor="#fff2c8" stopOpacity="1" />
                <stop offset="0.4"  stopColor="#ffd166" stopOpacity="0.85" />
                <stop offset="1"    stopColor="#ffd166" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="ttlPyrLit" x1="0" x2="1" y1="0.2" y2="1">
                <stop offset="0" stopColor="#f0c574" />
                <stop offset="1" stopColor="#c48b3a" />
              </linearGradient>
              <linearGradient id="ttlPyrDark" x1="1" x2="0" y1="0.2" y2="1">
                <stop offset="0" stopColor="#8b5a24" />
                <stop offset="1" stopColor="#5a3a14" />
              </linearGradient>
              <linearGradient id="ttlSand" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#e8b96a" />
                <stop offset="1" stopColor="#b07836" />
              </linearGradient>
              <linearGradient id="ttlNile" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#3b78a8" />
                <stop offset="1" stopColor="#1e4a6e" />
              </linearGradient>
              {/* scrim degrade pour la lisibilite du titre et des boutons */}
              <linearGradient id="ttlScrim" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0"    stopColor="#080d16" stopOpacity="0.55" />
                <stop offset="0.35" stopColor="#080d16" stopOpacity="0.15" />
                <stop offset="0.7"  stopColor="#080d16" stopOpacity="0.15" />
                <stop offset="1"    stopColor="#080d16" stopOpacity="0.7" />
              </linearGradient>
            </defs>

            {/* ciel dégradé */}
            <rect width="800" height="450" fill="url(#ttlSky)" />

            {/* soleil chaud haut-droit + halo brumeux (plus petit) */}
            <circle cx="670" cy="105" r="130" fill="url(#ttlSun)" opacity="0.85" />
            <circle cx="670" cy="105" r="28" fill="#fff2c8" />

            {/* --- DESERT ARRIERE-PLAN ---
                 D'abord un aplat de sable solide qui monte jusqu'a la
                 ligne d'horizon (comme la pyramide, sans transparence),
                 puis les couches de dunes floues et transparentes
                 par-dessus pour la profondeur. */}
            <path d="M 0 285 Q 200 275 400 285 Q 600 295 800 285 L 800 450 L 0 450 Z"
              fill="url(#ttlSand)" opacity="1" />
            {/* dunes les plus lointaines (bleu/violet, floues) */}
            <path d="M 0 300 Q 120 275 240 292 Q 340 305 460 285 Q 580 268 700 288 Q 760 297 800 292 L 800 315 L 0 315 Z"
              fill="#a58aa8" opacity="0.35" style={{ filter: "blur(2px)" }} />
            {/* dunes moyenne distance (chaud, un peu floues) */}
            <path d="M 0 320 Q 140 300 300 315 Q 420 328 540 310 Q 660 298 800 320 L 800 345 L 0 345 Z"
              fill="#c99060" opacity="0.55" style={{ filter: "blur(1.2px)" }} />

            {/* --- PYRAMIDE (recule, POV plus haut) : apex 310,180 - base autour --- */}
            {/* face droite (ombre) : apex -> front-bas -> right-bas */}
            <polygon points="310,180 310,395 500,352" fill="url(#ttlPyrDark)" opacity="0.95" />
            {/* face gauche (lumiere) : apex -> left-bas -> front-bas */}
            <polygon points="310,180 120,352 310,395" fill="url(#ttlPyrLit)" opacity="0.95" />
            {/* aretes principales */}
            <line x1="310" y1="180" x2="310" y2="395" stroke="#3a2410" strokeWidth="1"   opacity="0.55" />
            <line x1="310" y1="180" x2="120" y2="352" stroke="#3a2410" strokeWidth="1.2" opacity="0.55" />
            <line x1="310" y1="180" x2="500" y2="352" stroke="#3a2410" strokeWidth="1.2" opacity="0.55" />
            {/* pierres : lignes horizontales sur les 2 faces */}
            {[0.15, 0.32, 0.5, 0.68, 0.85].map((t, i) => {
              const y  = 180 + (395 - 180) * t;
              const xL = 310 - (310 - 120) * t;
              const yR = 180 + (352 - 180) * t;
              const xR = 310 + (500 - 310) * t;
              return (
                <g key={`sto${i}`}>
                  <line x1={xL} y1={y}  x2="310" y2={y}  stroke="#3a2410" strokeWidth="0.7" opacity="0.25" />
                  <line x1="310" y1={y} x2={xR} y2={yR} stroke="#3a2410" strokeWidth="0.7" opacity="0.25" />
                </g>
              );
            })}

            {/* --- PYRAMIDE INVERSEE (transparent), effet sablier --- */}
            {/* Meme apex partage (310,180), base ouverte vers le HAUT.
                Faces tres transparentes pour un effet cristal / temps. */}
            <polygon points="310,180 310,-35 500,10" fill="url(#ttlPyrDark)" opacity="0.16" />
            <polygon points="310,180 120,10 310,-35" fill="url(#ttlPyrLit)" opacity="0.20" />
            <line x1="310" y1="180" x2="310" y2="-35" stroke="#f5e0a8" strokeWidth="0.9" opacity="0.35" />
            <line x1="310" y1="180" x2="120" y2="10"  stroke="#f5e0a8" strokeWidth="1"   opacity="0.32" />
            <line x1="310" y1="180" x2="500" y2="10"  stroke="#f5e0a8" strokeWidth="1"   opacity="0.32" />
            {/* petit "sable" qui tombe entre les deux pyramides */}
            <line x1="310" y1="120" x2="310" y2="200" stroke="#ffe08a" strokeWidth="1.6" strokeLinecap="round" opacity="0.7">
              <animate attributeName="opacity" values="0.3;0.85;0.3" dur="2.6s" repeatCount="indefinite" />
            </line>

            {/* dune tres proche (premier plan) — dessinée APRES la pyramide pour la placer derriere */}
            <path d="M 0 380 Q 180 358 380 378 Q 540 396 800 372 L 800 450 L 0 450 Z"
              fill="url(#ttlSand)" opacity="0.98" />
            {/* motifs de sable (rides du desert) sur la dune proche */}
            {[
              "M 60 405 Q 130 401 200 405",
              "M 240 411 Q 320 407 400 411",
              "M 440 405 Q 520 402 600 405",
              "M 60 424 Q 140 421 220 424",
              "M 260 430 Q 340 427 420 430",
              "M 480 424 Q 560 422 640 424",
              "M 660 417 Q 720 414 790 417",
            ].map((d, i) => (
              <path key={`rp${i}`} d={d} fill="none" stroke="#8a5822" strokeWidth="0.8" opacity="0.35" strokeLinecap="round" />
            ))}
            {/* petits cailloux epars sur le premier plan */}
            {[[95, 418, 2], [175, 428, 1.4], [280, 421, 1.8], [410, 435, 2.2],
              [520, 423, 1.6], [615, 431, 2], [700, 421, 1.4], [760, 435, 1.8]].map(([cx, cy, r], i) => (
              <ellipse key={`rk${i}`} cx={cx} cy={cy} rx={r} ry={r * 0.55} fill="#5a3a14" opacity="0.55" />
            ))}
            {/* touffes d'herbe seche isolees */}
            <g transform="translate(465 398)" opacity="0.7">
              <path d="M0 4 L-2 -3 M0 4 L0 -4 M0 4 L2 -3" stroke="#8a7040" strokeWidth="1" fill="none" strokeLinecap="round" />
            </g>
            <g transform="translate(720 408)" opacity="0.6">
              <path d="M0 3 L-2 -3 M0 3 L0 -4 M0 3 L2 -3" stroke="#8a7040" strokeWidth="1" fill="none" strokeLinecap="round" />
            </g>

            {/* --- SABLE QUI VOLE (particules horizontales de droite a gauche) --- */}
            {Array.from({ length: 36 }).map((_, i) => {
              const y = 160 + (i * 43) % 260;
              const dur = 4 + (i % 5);
              const size = 1 + (i % 3) * 0.7;
              return (
                <circle key={`sd${i}`} cx="820" cy={y} r={size} fill="#e8c47a" opacity={0.5 + (i % 3) * 0.15}>
                  <animate attributeName="cx" from="820" to="-40" dur={`${dur}s`} begin={`${(i * 0.3) % 5}s`} repeatCount="indefinite" />
                  <animate attributeName="cy" values={`${y};${y - 7};${y + 5};${y}`} dur={`${dur}s`} begin={`${(i * 0.3) % 5}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.1;0.85;1" dur={`${dur}s`} begin={`${(i * 0.3) % 5}s`} repeatCount="indefinite" />
                </circle>
              );
            })}

            {/* petites bandes de sable soufflees au sol */}
            {[340, 360, 380, 405].map((y, i) => (
              <path key={`bd${i}`} d={`M 0 ${y} Q 200 ${y - 3} 400 ${y} T 800 ${y}`}
                fill="none" stroke="#e8c47a" strokeWidth="1.2" opacity="0.55">
                <animate attributeName="opacity" values="0.15;0.6;0.15" dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />
              </path>
            ))}

            {/* scrim vertical pour lisibilite du titre / boutons superposes */}
            <rect width="800" height="450" fill="url(#ttlScrim)" />
          </svg>

          {/* Contenu superpose (titre en haut, boutons en bas), plein ecran */}
          <div style={{ position: "relative", zIndex: 2, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "32px 20px 40px", textAlign: "center" }}>
          <h1 style={{ fontFamily: TITRE_FONT, fontSize: "clamp(38px,9.5vw,72px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", margin: "4px 0 0", lineHeight: 1.08, display: "inline-block", alignSelf: "flex-start", marginLeft: "20vw" }}>
            {"Les fils du temps".split("").map((ch, i) => (
              <span key={i}
                ref={(el) => { titleLetterRefs.current[i] = el; }}
                style={{
                  display: "inline-block",
                  whiteSpace: "pre",
                  color: i % 2 === 0 ? "#ffd166" : "#e8a24a",
                  transition: "none",
                  willChange: "transform, text-shadow",
                }}>
                {ch === " " ? " " : ch}
              </span>
            ))}
          </h1>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            {saveExists ? (
              <>
                {saved?.prenom && (
                  <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, color: "#5eff9e", opacity: 0.85, letterSpacing: 2 }}>
                    ► Salut, {saved.prenom} !
                  </div>
                )}
                <button onClick={() => resume("jeu1")}
                  style={{ background: "#5eff9e", color: "#06110b", border: "none", borderRadius: 12, padding: "14px 34px", fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 2, boxShadow: "0 0 24px rgba(94,255,158,0.4)" }}>
                  ▶ REPRENDRE
                </button>
                <button onClick={() => setModal({ type: "confirmNew" })}
                  style={{ background: "transparent", color: "#8fa3bd", border: "1px solid #2a3648", borderRadius: 12, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "ui-monospace,monospace" }}>
                  ↺ Nouvelle partie
                </button>
              </>
            ) : (
              <button onClick={() => setModal({ type: "askPrenom", after: newGame })}
                style={{ background: "#5eff9e", color: "#06110b", border: "none", borderRadius: 12, padding: "14px 34px", fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 2, boxShadow: "0 0 24px rgba(94,255,158,0.4)" }}>
                ▶ DÉMARRER
              </button>
            )}

            {/* ─── BOUTON JEU 2 ─── se débloque après avoir fini le jeu 1 */}
            <div style={{ marginTop: 8, padding: "10px 16px", border: `1px ${jeu1Fini ? "solid" : "dashed"} ${jeu1Fini ? "#7fd8ff" : "#2a3648"}`, borderRadius: 12, minWidth: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: jeu1Fini ? 1 : 0.55 }}>
              <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 3, color: "#7fd8ff" }}>SUITE DE L'AVENTURE</div>
              {savedJeu2 ? (
                <>
                  <button onClick={() => resume("jeu2")}
                    style={{ background: "#7fd8ff", color: "#06110b", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 2, boxShadow: "0 0 18px rgba(127,216,255,0.45)" }}>
                    ▶ REPRENDRE JEU 2 — AL3X1A
                  </button>
                  <button onClick={() => setModal({ type: "confirmNewJeu2" })}
                    style={{ background: "transparent", color: "#8fa3bd", border: "1px solid #2a3648", borderRadius: 8, padding: "6px 14px", fontSize: 11, cursor: "pointer", fontFamily: "ui-monospace,monospace" }}>
                    ↺ Nouvelle enquête
                  </button>
                </>
              ) : jeu1Fini ? (
                <button onClick={() => setModal({ type: "askPrenom", after: newGameJeu2 })}
                  style={{ background: "#7fd8ff", color: "#06110b", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 2, boxShadow: "0 0 18px rgba(127,216,255,0.45)" }}>
                  ▶ JEU 2 — AL3X1A
                </button>
              ) : (
                <div style={{ fontSize: 12, color: "#5a6678", fontStyle: "italic", textAlign: "center" }}>
                  🔒 À débloquer en terminant le voyage principal.
                </div>
              )}
              {/* JEU 3 — squelette PR J3-A : disponible sans conditions
                  pour tester. À gater ultérieurement sur la fin du Jeu 2. */}
              <button onClick={() => { setModal({ type: "askPrenom", after: newGameJeu3 }); }}
                style={{ background: "transparent", color: "#c8a8f0", border: "1px solid #4a3a68", borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 2, marginTop: 6 }}>
                ▶ JEU 3 — BUNKER 2087 (BETA)
              </button>
            </div>

            <div style={{ display: "flex", gap: 20, marginTop: 4 }}>
              <button onClick={() => setModal({ type: "settings" })}
                style={{ background: "transparent", color: "#5a6678", border: "none", cursor: "pointer", fontSize: 12, fontFamily: "ui-monospace,monospace" }}>
                ⚙ Réglages · sauvegarde
              </button>
              <button onClick={() => setShowMediadex(true)}
                style={{ background: "transparent", color: "#c8963e", border: "none", cursor: "pointer", fontSize: 12, fontFamily: "ui-monospace,monospace" }}>
                🃏 Mediadex
              </button>
            </div>
          </div>
        </div>

        {/* menu réglages (export / import de la sauvegarde) */}
        {modal?.type === "settings" && <SettingsModal />}

        {/* confirmation avant d'effacer une partie */}
        {modal?.type === "confirmNew" && (
          <div style={overlay} onClick={() => setModal(null)}>
            <div style={card} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ marginTop: 0, color: "#e8934a", fontSize: 20, textAlign: "center" }}>Effacer la partie en cours ?</h2>
              <p style={{ fontSize: 14, color: "#c8d4e2", lineHeight: 1.6 }}>
                Une nouvelle partie remplacera définitivement ta progression sauvegardée.
                Pense à l'<strong>exporter</strong> d'abord si tu veux la garder.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={() => setModal(null)} style={{ flex: 1, background: "#1a2536", color: "#e8eef5", border: "1px solid #2a3648", borderRadius: 10, padding: "12px", fontWeight: 700, cursor: "pointer" }}>Annuler</button>
                <button onClick={() => { clearSave("jeu1"); setModal({ type: "askPrenom", after: newGame }); }} style={{ flex: 1, background: "#e8934a", color: "#111", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, cursor: "pointer" }}>Nouvelle partie</button>
              </div>
            </div>
          </div>
        )}
        {modal?.type === "confirmNewJeu2" && (
          <div style={overlay} onClick={() => setModal(null)}>
            <div style={card} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ marginTop: 0, color: "#7fd8ff", fontSize: 20, textAlign: "center" }}>Effacer l'enquête en cours ?</h2>
              <p style={{ fontSize: 14, color: "#c8d4e2", lineHeight: 1.6 }}>
                Une nouvelle enquête Al3x1A remplacera ta progression jeu 2 sauvegardée. Ton voyage principal (jeu 1) est indépendant, il ne sera pas touché.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={() => setModal(null)} style={{ flex: 1, background: "#1a2536", color: "#e8eef5", border: "1px solid #2a3648", borderRadius: 10, padding: "12px", fontWeight: 700, cursor: "pointer" }}>Annuler</button>
                <button onClick={() => { clearSave("jeu2"); setModal({ type: "askPrenom", after: newGameJeu2 }); }} style={{ flex: 1, background: "#7fd8ff", color: "#06110b", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, cursor: "pointer" }}>Nouvelle enquête</button>
              </div>
            </div>
          </div>
        )}
        {modal?.type === "askPrenom" && (
          <div style={overlay} onClick={() => setModal(null)}>
            <div style={{ ...card, textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
              <div style={{ fontSize: 40, marginBottom: 6 }}>👋</div>
              <h2 style={{ marginTop: 0, color: "#5eff9e", fontFamily: "ui-monospace,monospace", letterSpacing: 2, fontSize: 16 }}>COMMENT T'APPELLES-TU ?</h2>
              <p style={{ fontSize: 13.5, color: "#c8d4e2", lineHeight: 1.55, margin: "8px 0 14px" }}>
                MARTINE veut noter ton prénom pour ton carnet de bord, et te reconnaître si tu reviens jouer.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); const cb = modal.after; setModal(null); if (cb) cb(); }}
                style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input autoFocus value={prenom} onChange={(e) => setPrenom(e.target.value.slice(0, 24))}
                  placeholder="Ton prénom (ou un pseudo)"
                  style={{ background: "#0e1420", color: "#e8eef5", border: "1px solid #2a3648", borderRadius: 10, padding: "12px 14px", fontSize: 16, fontFamily: "Palatino, Georgia, serif", textAlign: "center" }} />
                <button type="submit"
                  style={{ background: "#5eff9e", color: "#06110b", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, cursor: "pointer", fontSize: 15, fontFamily: "ui-monospace,monospace", letterSpacing: 2 }}>
                  ▶ EMBARQUER
                </button>
                <button type="button" onClick={() => { const cb = modal.after; setModal(null); if (cb) cb(); }}
                  style={{ background: "transparent", color: "#5a6678", border: "none", cursor: "pointer", fontSize: 12, fontFamily: "ui-monospace,monospace" }}>
                  (passer)
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ---------- écran d'INTRODUCTION narrative (6 tableaux) ---------- */
  if (screen === "intro") {
    return <IntroStory onDone={() => setScreen("play")} />;
  }

  /* ---------- écran de transition entre deux époques ---------- */
  if (screen === "transition") {
    return (
      <>
        {cheatPanel}
        <TransitionScreen
          target={CHAPTERS[transitionTo]}
          transitionTo={transitionTo}
          onLand={goToChapter}
        />
      </>
    );
  }

  /* ---------- écran CHRONAUTES : rencontre au futur (2287) ---------------
     S'affiche juste après le saut depuis le DERNIER chapitre, avant
     l'épilogue. Elias, Mira, portrait-cadre d'Al3x1A. Séquence de
     dialogues scriptée. Fin de la séquence → écran épilogue. */
  /* ---------- écran FIN JEU 2 ------------------------------------------ */
  if (screen === "finJeu2") {
    return (
      <>
        {cheatPanel}
        <FinJeu2
          prenom={prenom}
          remede={jeu2Target >= 0 ? JEU2[jeu2Target]?.remede : null}
          onRetour={() => { setMode("jeu1"); setScreen("title"); }}
          onLancerJeu3={() => { setMode("jeu3"); setScreen("jeu3"); }} />
      </>
    );
  }

  /* ---------- écran PLACEHOLDER du JEU 2 (obsolète mais gardé pour compat) */
  if (screen === "jeu2Placeholder") {
    return (
      <>
        {cheatPanel}
        <Jeu2Placeholder onRetourMenu={() => { setMode("jeu1"); setScreen("title"); }} />
      </>
    );
  }

  /* ---------- JEU 3 : bunker 2087 (PR J3-A, squelette) ---------- */
  if (screen === "jeu3") {
    return (
      <>
        {cheatPanel}
        <Jeu3 key={jeu3Nonce} prenom={prenom} startAt={jeu3Start} onExit={() => { setMode("jeu1"); setScreen("title"); setJeu3Start(null); }} />
      </>
    );
  }

  if (screen === "chronautes") {
    return (
      <>
        {cheatPanel}
        {/* Après la rencontre des chronautes, on passe par la SALLE
            TEMPORELLE (briefing) où MARTINE réparée remet la frise, puis
            on enchaîne sur l'épilogue "Ton support pour +20 000 ans". */}
        <StationChronautes prenom={prenom} onContinue={() => setScreen("briefing")} />
      </>
    );
  }

  if (screen === "briefing") {
    return (
      <>
        {cheatPanel}
        <BriefingMission prenom={prenom} onAccept={() => setScreen("epilogue")} />
      </>
    );
  }

  /* ---------- écran ÉPILOGUE : « Ton message pour +20 000 ans » ---------- */
  if (screen === "epilogue") {
    return (
      <>
        {cheatPanel}
        <EpilogueScreen
          epiChoice={epiChoice}
          onChoose={setEpiChoice}
          onReset={() => setEpiChoice(null)}
          onEnd={() => setScreen("end")}
        />
      </>
    );
  }

  /* ---------- écran fin ---------- */
  if (screen === "end") {
    return (
      <>
        {cheatPanel}
        <EndScreen
          chapter={chapter}
          isLastChapter={isLastChapter}
          msgs={msgs}
          ALL_MSGS={ALL_MSGS}
          fluxTotal={fluxTotal}
          bonusChapters={bonusChapters}
          collection={collection}
          chapters={CHAPTERS}
          onRestart={restart}
          onStartJeu2={newGameJeu2}
        />
      </>
    );
  }

  /* ---------- écran de jeu : une seule vue, sans défilement ---------- */
  /* `made` (tout ce qui a été fabriqué) et `inv` sont transmis aux décors
     pour qu'ils puissent RÉAGIR : faire apparaître une invention une fois
     assemblée, réagir à un objet ramassé, etc. Un décor qui n'en a pas
     besoin les ignore simplement (rétro-compatible). */
  /* `queteQui` : le personnage de l'étape en cours — les décors y posent
     le « ? » doré (null quand la quête est finie ou absente). */
  /* JEU 2 : `queteQui` (le « ? » dore qui pointe le PNJ de l'etape en
     cours) est desactive — la quete de jeu 1 ne joue plus, et les
     personnages parlent librement d'Al3x1A.
     Les decors regardent `mode` pour masquer les dechets temporels
     (allumettes, canette, stylo Bic…) : visuel + hotspot cachés. On
     ajoute aussi une garde ceinture-et-bretelles au niveau de `inv`
     (les items anachroniques y apparaissent comme deja possedes) : si
     un decor teste `inv.includes(id)` au lieu de `mode`, l'objet reste
     invisible. */
  const effectiveInv = mode === "jeu2"
    ? Object.keys(chapter.items || {}).filter((id) => chapter.items[id]?.anachronic)
    : inv;
  /* Le "?" doré au-dessus des personnages est masqué partout sauf dans les
     scènes où la quête est vraiment chronologique (château de Bannister au
     Moyen Âge). Ailleurs le joueur explore librement. */
  const CHRONO_SCENES = new Set(["chateau", "retour"]);
  const queteQuiVal = mode === "jeu2"
    ? null
    : (CHRONO_SCENES.has(tab) ? (chapter.quete?.[quete]?.perso ?? null) : null);
  const sceneProps = { collect, action, reveal, flags, made, inv: effectiveInv, mode, queteQui: queteQuiVal };

  /* ---- le carnet imprimable est dans engine/CarnetPrint.jsx ---- */

  /* Le « plus » d'une fiche : une reproduction dessinée (si elle existe pour
     ce message) et un lien « En savoir plus » vers Wikipédia (champ `wiki`
     du message). Les deux sont facultatifs : une fiche sans rien de tout ça
     s'affiche exactement comme avant. */
  const FicheExtras = ({ id }) => {
    const m = chapter.messages[id];
    const Illo = ILLUSTRATIONS[id];
    if (!Illo && !m.wiki) return null;
    return (
      <>
        {Illo && (
          <div style={{ marginTop: 12, background: "#14100a", border: "1px solid #3a3020", borderRadius: 10, padding: "10px 10px 6px" }}>
            <Illo />
            <div style={{ fontSize: 10.5, color: "#8a97ad", fontStyle: "italic", textAlign: "center", marginTop: 4, fontFamily: "ui-monospace,monospace" }}>reproduction dessinée</div>
          </div>
        )}
        {m.wiki && (
          <a href={m.wiki} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-block", marginTop: 10, fontSize: 13, color: "#7fd8ff", fontWeight: 700, textDecoration: "none" }}>
            🔗 En savoir plus sur Wikipédia →
          </a>
        )}
      </>
    );
  };

  return (
    <DragProvider items={chapter.items} onDrop={handleDrop}>
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden", background: "#080d16", fontFamily: "Palatino, Georgia, serif", color: "#e8eef5" }}>
      {cheatPanel}

      {/* la signature du jeu, CENTRÉE — avec le chapitre · date sur la même
          ligne (à gauche). Présente sur chaque tableau. */}
      <div style={{ position: "relative", textAlign: "center", padding: "6px 12px 0", minHeight: 20 }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: "#e8934a", whiteSpace: "nowrap" }}>{chapter.bandeau}</span>
        {prenom && (
          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: "#5eff9e", whiteSpace: "nowrap", opacity: 0.85 }} title="C'est toi qui joues cette partie">
            👤 {prenom}
          </span>
        )}
        <span style={{ fontFamily: TITRE_FONT, fontSize: 19, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", background: "linear-gradient(100deg, #e8a24a, #ffd166 45%, #e86a4a)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
          Les fils du temps
        </span>
        {/* la date de destination, sous le titre, en vert MARTINE (afficheur de bord) */}
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12.5, fontWeight: 700, letterSpacing: 3, color: "#5eff9e", textShadow: "0 0 10px rgba(94,255,158,0.45)", marginTop: 1 }}>
          {chapter.date}
        </div>
      </div>

      {/* le lieu · compteur · boutons · saut temporel */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "2px 12px 6px", flexWrap: "wrap" }}>
        <span style={{ fontSize: 17, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>{chapter.emoji} {chapter.scenes[tab].name}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {/* JEU 2 : compteur de notes trouvées à la place de la jauge flux */}
          {mode === "jeu2" ? (
            <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 14, fontWeight: 700, color: "#7fd8ff" }} title="Notes d'Al3x1A trouvées">
              🔎 {jeu2Notes.length}/{JEU2.length} notes
            </span>
          ) : (
          <span style={{ position: "relative", fontFamily: "ui-monospace,monospace", fontSize: 14, fontWeight: 700, color: canJump ? "#ffd166" : "#7fd8ff" }} title={`Flux temporel — ${canJump ? "prêt à partir !" : `encore ${Math.max(0, Math.ceil(fluxRequis - flux))} pour partir`}`}>
            ⚡ {flux}/{fluxRequis}
            {fluxBubble && (
              <span style={{ position: "absolute", left: "50%", top: -18, transform: "translateX(-50%)",
                fontSize: 13, fontWeight: 800, letterSpacing: 1,
                color: fluxBubble.delta > 0 ? "#5eff9e" : "#ff7a5a",
                animation: "fluxRise 1.3s ease-out forwards",
                pointerEvents: "none", whiteSpace: "nowrap" }}>
                {fluxBubble.delta > 0 ? "+" : ""}{fluxBubble.delta}
              </span>
            )}
          </span>
          )}
          {/* deux boutons seulement dans le bandeau — Mediadex et Réglages.
              Le son, l'indice, la révélation, le carnet sont dans Réglages. */}
          <button onClick={() => setShowMediadex(true)} title={`Mediadex (${mediadex.length} cartes)`} style={headBtn}>🃏</button>
          <button onClick={() => setModal({ type: "settings" })} title="Réglages, son, indice, carnet…" style={headBtn}>⚙</button>
          {/* Sur écran étroit uniquement, le bouton compact de SAUT reste
              dans le bandeau (sinon on l'a dans la jauge temporelle à droite). */}
          {!large && mode !== "jeu2" && (
            <button onClick={jump} disabled={!canJump}
              title={canJump ? `Saut vers ${chapter.destination}` : (jumpBloque || `Encore ${Math.max(0, Math.ceil(fluxRequis - flux))} flux pour partir`)}
              style={{ background: canJump ? "#e8934a" : "#1a2230", color: canJump ? "#111" : "#4a5568", border: "none", borderRadius: 10, padding: "7px 12px", fontSize: 13, fontWeight: 800, cursor: canJump ? "pointer" : "not-allowed", fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              🌀 {canJump ? `SAUT → ${chapter.destination}` : `${Math.min(flux, fluxRequis)}/${fluxRequis}⚡`}
            </button>
          )}
        </div>
      </div>

      {/* JEU 2 : FRISE CHRONOLOGIQUE — remplacée à la colonne de droite
          et à la barre du bas. Une seule bande horizontale, tout en haut
          juste sous le titre, qui EST le fil du temps : les 10 époques
          alignées de gauche à droite, reliées par une ligne de fond,
          chacune cliquable pour voyager. La courante est mise en avant,
          les notes trouvées ont un ✓. Compact (~66 px de hauteur). */}
      {mode === "jeu2" && (
        <div style={{ position: "relative", padding: "4px 12px 8px", background: "linear-gradient(180deg, rgba(14,28,42,0.55), transparent)", flex: "0 0 auto" }}>
          {/* Le "fil du temps" : dégradé horizontal derrière les pastilles */}
          <div style={{ position: "absolute", left: 30, right: 30, top: "50%", height: 2, marginTop: -1, background: "linear-gradient(90deg, #26324a 0%, #7fd8ff 50%, #26324a 100%)", opacity: 0.55, borderRadius: 2 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 4, position: "relative", maxWidth: 1080, margin: "0 auto" }}>
            {CHAPTERS.map((c, i) => {
              const has = jeu2Notes.includes(i);
              const isHere = i === chapterIndex;
              return (
                <button key={c.id} onClick={() => travelJeu2(i)}
                  title={`${c.epoque || 'Chapitre ' + (i + 1)} · ${c.date || ''} — ${has ? 'note trouvée ✓' : 'à explorer'}`}
                  style={{
                    position: "relative",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
                    background: "transparent", border: "none", padding: "2px 4px",
                    cursor: isHere ? "default" : "pointer",
                    color: "#e8eef5",
                    opacity: isHere || has ? 1 : 0.7,
                    transition: "opacity .15s, transform .15s",
                    flex: "0 1 auto",
                  }}
                  onMouseEnter={(e) => { if (!isHere) e.currentTarget.style.transform = "translateY(-2px) scale(1.06)"; }}
                  onMouseLeave={(e) => { if (!isHere) e.currentTarget.style.transform = "none"; }}>
                  {/* La pastille elle-même */}
                  <span style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: isHere ? 40 : 34, height: isHere ? 40 : 34,
                    fontSize: isHere ? 22 : 18,
                    borderRadius: "50%",
                    background: isHere
                      ? "radial-gradient(circle at 50% 40%, #ffd166 0%, #e8934a 60%, #a05828 100%)"
                      : has
                        ? "radial-gradient(circle at 50% 40%, #a8dcff 0%, #4a80b8 100%)"
                        : "linear-gradient(180deg, #1a2a3e, #0a1420)",
                    border: `2px solid ${isHere ? "#ffe1a0" : has ? "#7fd8ff" : "#26324a"}`,
                    boxShadow: isHere
                      ? "0 0 16px rgba(255,209,102,0.75), inset 0 -2px 4px rgba(0,0,0,0.35)"
                      : has
                        ? "0 0 8px rgba(127,216,255,0.4)"
                        : "inset 0 -1px 2px rgba(0,0,0,0.4)",
                    transition: "all .2s",
                    animation: isHere ? "pulse 2.4s ease-in-out infinite" : "none",
                  }}>
                    {c.emoji || "•"}
                  </span>
                  {/* Badge ✓ pour note trouvée */}
                  {has && !isHere && (
                    <span style={{ position: "absolute", top: -1, right: 0, fontSize: 9, background: "#5eff9e", color: "#062516", borderRadius: "50%", width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, boxShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>✓</span>
                  )}
                  {/* Date en petit, alignée sous la pastille */}
                  <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 8.5, letterSpacing: 0.5, color: isHere ? "#ffd166" : has ? "#7fd8ff" : "#6a7a8e", whiteSpace: "nowrap" }}>
                    {c.date || `ch.${i + 1}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Le décor occupe toute la place restante. Sur écran large, il partage
          cette rangée avec la besace, en colonne à gauche (voir `large`). */}
      <div style={{ flex: 1, minHeight: 0, padding: "0 12px", display: "flex", justifyContent: "center", gap: 8 }}>
        {/* écran large : la besace en colonne à gauche du décor — cachee
            en jeu 2 (elle ne sert a rien pour l'enquete Al3x1A). */}
        {large && mode !== "jeu2" && (
          <div style={{ width: 104, flex: "0 0 auto", display: "flex", flexDirection: "column", minHeight: 0 }}>
            <InventoryBar items={chapter.items} inv={inv} shake={shake} vertical mode={mode} />
            {/* mini-carte dockée sous la besace (si le chapitre a une carte) */}
            {chapter.carte && <MiniMap Carte={chapter.carte} tab={tab} label={chapter.scenes[tab].name} onOpen={() => setModal({ type: "carte" })} />}
          </div>
        )}
        <div ref={decorCellRef} style={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
          {/* taille exacte calculée (le plus grand cadre 1000/560 qui tient
              dans la cellule) → jamais rogné, jamais de débordement. */}
          <div style={{ width: decorBox ? decorBox.w : "100%", height: decorBox ? decorBox.h : "100%", position: "relative" }}>
            {/* Boundary de secours : si le decor crashe (Firefox + SVG lourds,
                path invalide...), on garde le reste de l'interface intacte
                (frise, sac, MARTINE) au lieu de retourner au titre. */}
            <DecorErrorBoundary>
            {/* JEU 2 : on FORCE la navigation libre (chapter.linear ignore),
                sinon les chapitres 5-9 (Moyen Age → Médias) bloquent l'élève
                sur leur premier tableau — les `nextWhen` de jeu 1 exigent
                des messages fabriques qu'on ne cree jamais en jeu 2. */}
            <Scene scenes={chapter.scenes} tab={tab} onTab={setTab} sceneProps={sceneProps} sparkle={sparkle}
              linear={mode === "jeu2" ? false : chapter.linear}
              canAdvance={!!(chapter.linear && mode !== "jeu2" && !chapter.scenes[tab].free && chapter.scenes[tab + 1] && (chapter.scenes[tab].nextWhen || []).every((id) => made.includes(id)))} />
            {/* ═══ JEU 2 : overlay des hotspots note + Al3x1A ═══
                On dessine par-dessus la scène (viewBox aligné 1000×560,
                position absolute, pointerEvents:none pour laisser passer
                les clics ailleurs). Les hotspots eux-mêmes captent leurs
                propres clics. */}
            {mode === "jeu2" && !openRetrouvailles && (
              (() => {
                const cfg = JEU2[chapterIndex];
                if (!cfg) return null;
                /* Emplacements TIRES AU SORT au demarrage. Acces defensif :
                   toute valeur manquante (save corrompue, index hors bornes)
                   tombe sur 0. Si le spot lui-meme n'existe pas, on ne rend
                   rien plutot que crasher. */
                const spots = Array.isArray(cfg.noteSpots) ? cfg.noteSpots : [];
                const alxSpots = Array.isArray(cfg.al3x1aSpots) ? cfg.al3x1aSpots : [];
                const notePickIdx = Number.isInteger(jeu2NotePicks?.[chapterIndex]) ? jeu2NotePicks[chapterIndex] : 0;
                const alxPickIdx = Number.isInteger(jeu2AlxPick) ? jeu2AlxPick : 0;
                const noteSpot = spots[notePickIdx] || spots[0];
                const al3x1aSpot = alxSpots[alxPickIdx] || alxSpots[0];
                const noteHere = noteSpot && noteSpot.tab === tab && !jeu2Notes.includes(chapterIndex);
                const al3x1aHere = chapterIndex === jeu2Target && al3x1aSpot && al3x1aSpot.tab === tab && !jeu2Found;
                return (
                  <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                    <g style={{ pointerEvents: "auto" }}>
                      {noteHere && (
                        <g transform={`translate(${noteSpot.cx},${noteSpot.cy})`}>
                          {/* Le hitbox invisible cliquable. L'eleve trouve
                              l'endroit grace aux indications des PNJ + au
                              landmark evident sur lequel on l'a positionne. */}
                          <circle onClick={() => setOpenNote({ chapitre: chapterIndex })}
                            r={(noteSpot.r || 34) * 1.8}
                            fill="rgba(0,0,0,0.001)"
                            style={{ cursor: "pointer" }}>
                            <title>quelque chose de bizarre ici…</title>
                          </circle>
                        </g>
                      )}
                      {/* DEBUG NOTES : mode calage — tape « notes » au clavier.
                          Affiche les 3 emplacements candidats du chapitre courant
                          avec leur numero et un cercle colore, uniquement sur le
                          tableau qui les contient. Pour ajuster les coords sans
                          coder : tu vois direct si chaque spot tombe sur le bon
                          landmark. */}
                      {debugNotes && spots.map((s, i) => s.tab === tab && (
                        <g key={`dbg-${i}`} transform={`translate(${s.cx},${s.cy})`}>
                          <circle r={s.r || 34}
                            fill={i === 0 ? "rgba(255,100,100,0.28)" : i === 1 ? "rgba(100,255,100,0.28)" : "rgba(100,180,255,0.28)"}
                            stroke={i === 0 ? "#ff6060" : i === 1 ? "#60ff60" : "#60b0ff"}
                            strokeWidth="3" strokeDasharray="6 4" />
                          <text y="6" textAnchor="middle" fontSize="26" fontWeight="900"
                            fill="#fff" stroke="#000" strokeWidth="0.8" style={{ paintOrder: "stroke" }}>
                            {i + 1}
                          </text>
                          <text y="-14" textAnchor="middle" fontSize="10"
                            fill="#fff" stroke="#000" strokeWidth="0.6" style={{ paintOrder: "stroke", fontFamily: "ui-monospace,monospace" }}>
                            ({s.cx},{s.cy})
                          </text>
                        </g>
                      ))}
                      {al3x1aHere && (
                        <g onClick={() => { setJeu2Found(true); setOpenRetrouvailles(true); }}
                          transform={`translate(${al3x1aSpot.cx},${al3x1aSpot.cy})`}
                          style={{ cursor: "pointer", animation: "float 2.4s ease-in-out infinite" }}>
                          <PortraitAl3x1AInScene />
                          <title>quelqu'un se cache ici…</title>
                        </g>
                      )}
                    </g>
                  </svg>
                );
              })()
            )}
            </DecorErrorBoundary>
          </div>
        </div>
        {/* écran large : la jauge temporelle à droite */}
        {large && mode !== "jeu2" && (
          <JaugeTemporelle transmis={flux} requis={fluxRequis} total={ALL_MSGS.length}
            destination={chapter.destination} canJump={canJump} onJump={jump} isLast={isLastChapter} bloque={jumpBloque} />
        )}
        {/* NB : en jeu 2, le sélecteur d'époques est la frise chronologique
            horizontale placée en HAUT du jeu (voir plus haut), pas ici. */}
      </div>

      {/* console MARTINE + le SIGNAL D'AVANCÉE (mode linéaire) : en l'absence
          de flèches, un repère lumineux clignote près de MARTINE dès que le
          tableau courant est bouclé, et emmène au lieu suivant. */}
      <div style={{ padding: "8px 12px 6px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 980, position: "relative" }}>
          {(() => {
            const next = chapter.scenes[tab + 1];
            const ready = chapter.linear && next && !chapter.scenes[tab].free
              && (chapter.scenes[tab].nextWhen || []).every((id) => made.includes(id));
            if (!ready) return null;
            return (
              <button onClick={() => setTab(tab + 1)} title={`Partir pour ${next.name}`}
                style={{ position: "absolute", left: "50%", top: -18, transform: "translateX(-50%)", zIndex: 6, display: "flex", alignItems: "center", gap: 8, background: "#5eff9e", color: "#06110b", border: "none", borderRadius: 20, padding: "7px 16px", fontFamily: "ui-monospace,monospace", fontWeight: 800, fontSize: 13, letterSpacing: 1, cursor: "pointer", boxShadow: "0 0 20px rgba(94,255,158,0.65)", whiteSpace: "nowrap", animation: "floaty 1.7s ease-in-out infinite" }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#06110b", animation: "pulse 1s infinite" }} />
                ➜ Partir pour {next.name}
              </button>
            );
          })()}
          <Martine lines={dialog.lines} idx={dialog.idx} mood={dialog.mood} date={chapter.date} onNext={() => setDialog((d) => ({ ...d, idx: d.idx + 1 }))} />
        </div>
      </div>

      {/* besace : en bas, seulement sur écran étroit / tablette */}
      {!large && mode !== "jeu2" && <InventoryBar items={chapter.items} inv={inv} shake={shake} mode={mode} />}

      {/* particules de réussite (au point de la combinaison) */}
      {fx && <Particles key={fx.key} x={fx.x} y={fx.y} big={fx.big} />}

      {/* message perdu : le pictogramme s'envole et se désintègre */}
      {dust && (
        <span key={dust.key} style={{ position: "fixed", left: dust.x, top: dust.y, zIndex: 90, pointerEvents: "none", fontSize: 42, filter: "grayscale(0.5)", animation: "dissolve 1s ease-out forwards" }}>
          {dust.emoji}
        </span>
      )}

      {/* ---------- modales ---------- */}
      {modal?.type === "fact" && (
        <div style={overlay} onClick={() => setModal(null)}>
          <div style={{ ...card, maxHeight: "88vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: "center", fontSize: 46 }}>{chapter.messages[modal.id].emoji}</div>
            <div style={{ textAlign: "center", fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#5eff9e" }}>◆ MESSAGE TRANSMIS AU FUTUR</div>
            <h2 style={{ textAlign: "center", margin: "6px 0 10px", color: "#e8934a", fontSize: 22 }}>{chapter.messages[modal.id].title}</h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#d8e2ee", margin: 0 }}>{chapter.messages[modal.id].fact}</p>
            {/* les 4 jauges — s'afficheront quand les fiches en auront (jalon M2) */}
            <Gauges values={chapter.messages[modal.id].jauges} />
            <FicheExtras id={modal.id} />
            <button onClick={() => setModal(null)} style={{ marginTop: 16, width: "100%", background: "#e8934a", color: "#111", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, cursor: "pointer", fontSize: 15 }}>
              Continuer
            </button>
          </div>
        </div>
      )}

      {/* carte d'un message PERDU : ton gris, pas de « transmis au futur » */}
      {modal?.type === "lost" && (
        <div style={overlay} onClick={() => setModal(null)}>
          <div style={{ ...card, borderColor: "#5a667866", maxHeight: "88vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: "center", fontSize: 46, filter: "grayscale(0.7)", opacity: 0.75 }}>{chapter.messages[modal.id].emoji}</div>
            <div style={{ textAlign: "center", fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#8fa3bd" }}>💨 MESSAGE PERDU EN ROUTE</div>
            <h2 style={{ textAlign: "center", margin: "6px 0 10px", color: "#8fa3bd", fontSize: 22 }}>{chapter.messages[modal.id].title}</h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#c8d4e2", margin: 0 }}>{chapter.messages[modal.id].fact}</p>
            <Gauges values={chapter.messages[modal.id].jauges} />
            <FicheExtras id={modal.id} />
            <div style={{ fontSize: 12, color: "#7a879e", fontStyle: "italic", marginTop: 10 }}>
              Ce fragment rejoint ta frise, mais ne recharge pas MARTINE : un message perdu ne parvient pas au futur.
            </div>
            <button onClick={() => setModal(null)} style={{ marginTop: 14, width: "100%", background: "#5a6678", color: "#0e1420", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, cursor: "pointer", fontSize: 15 }}>
              Continuer
            </button>
          </div>
        </div>
      )}

      {/* ---- PHYLACTÈRE : les paroles d'un personnage, à côté de lui ----
          Ancré au point renvoyé par la zone cliquable. Se place au-dessus du
          personnage (ou en dessous s'il est trop haut), et se recadre pour ne
          pas sortir de l'écran. Un clic dessus le referme. */}
      {/* LE GROS PLAN de la quête : quand l'étape en cours porte
          `portrait`, le personnage s'avance devant l'écran pour parler
          (ex. Ana qui accueille le joueur). Le bouton fait avancer la
          quête ; s'il y a un `say`, MARTINE enchaîne. */}
      {screen === "play" && portraitOpen && (() => {
        const st = chapter.quete?.[quete];
        const Portrait = st?.portrait && chapter.portraits?.[st.portrait];
        if (!Portrait) return null;
        const nom = st.nom ?? st.perso.charAt(0).toUpperCase() + st.perso.slice(1);
        return (
          <div style={{ position: "fixed", inset: 0, zIndex: 65, background: "rgba(4,8,14,0.8)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 20, maxWidth: 860, animation: "fadein .5s ease-out" }}>
              <div style={{ width: "min(44vh, 300px)", flex: "0 0 auto" }}><Portrait /></div>
              <div style={{ flex: "1 1 300px", maxWidth: 400 }}>
                <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 2, color: "#ffd166", marginBottom: 8 }}>✦ {nom.toUpperCase()}</div>
                <div style={{ background: "#f4e8cc", color: "#2a1c10", border: "1px solid #cbb489", borderRadius: 16, padding: "16px 18px", fontFamily: "Palatino, Georgia, serif", fontSize: 16.5, lineHeight: 1.6, boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>
                  {st.bubble}
                </div>
                {/* fermer = avancer si l'étape n'a pas de tâche à accomplir ;
                    sinon on referme simplement, et MARTINE donne son indice */}
                <button onClick={() => { setPortraitOpen(false); if (!st.attend) { setQuete((q) => q + 1); if (st.grant) grantFlag(st.grant); if (st.suite) setTimeout(() => say(`➜ ${st.suite}`), 1400); } if (st.say) say(st.say, st.mood); }}
                  style={{ marginTop: 14, width: "100%", background: "#e8934a", color: "#1a0e02", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, cursor: "pointer", fontSize: 15, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
                  Continuer
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      {bubble && (() => {
        const hasChoices = Array.isArray(bubble.choices) && bubble.choices.length > 0;
        const hasExchange = !!bubble.playerLine;
        const isDialog = hasChoices || hasExchange;
        const pickChoice = (c) => setBubble((b) => b ? { ...b, playerLine: c.a, followUp: c.r, choices: null } : b);

        /* CAS 1 — mini-dialogue à choix (chatOnce) : bandeau RPG cinématique
           en bas de l'écran, laissant place à la console de MARTINE. */
        if (isDialog) {
          const speakerId = bubble.speaker;
          const Portrait = speakerId && chapter?.portraits?.[speakerId];
          const speakerName = speakerId ? speakerId.charAt(0).toUpperCase() + speakerId.slice(1) : "";
          return (
            <div style={{ position: "fixed", left: 0, right: 0, bottom: 110, zIndex: 60,
              display: "flex", justifyContent: "center", pointerEvents: "none" }}>
              <div data-bubble-choice
                style={{ pointerEvents: "auto", width: "min(880px, calc(100vw - 24px))",
                  margin: "0 12px",
                  background: "linear-gradient(180deg,#1a2130,#0b1018)",
                  border: "1px solid #d9a34a", borderRadius: 14,
                  boxShadow: "0 -6px 30px rgba(0,0,0,0.7), 0 0 22px rgba(217,163,74,0.22)",
                  padding: "12px 14px", display: "flex", gap: 14, alignItems: "flex-start",
                  color: "#eadfc4", fontFamily: "Palatino, Georgia, serif",
                  animation: "fadein .22s ease-out" }}>
                {Portrait && (
                  <div style={{ width: 92, height: 92, flex: "0 0 auto", borderRadius: "50%",
                    overflow: "hidden", border: "2px solid #d9a34a",
                    background: "#000", boxShadow: "0 0 14px rgba(217,163,74,0.35)" }}>
                    <div style={{ width: 92, height: "auto" }}><Portrait /></div>
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {speakerName && (
                    <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3,
                      color: "#ffd166", marginBottom: 6 }}>✦ {speakerName.toUpperCase()}</div>
                  )}
                  <div style={{ fontSize: 15.5, lineHeight: 1.5, color: "#f4e8cc" }}>{bubble.text}</div>
                  {hasChoices && (
                    <div style={{ marginTop: 12, paddingTop: 8, borderTop: "1px dashed #614a2a" }}>
                      <div style={{ fontSize: 11, color: "#a89468", fontStyle: "italic", marginBottom: 4 }}>Tu peux répondre…</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {bubble.choices.map((c, i) => (
                          <button key={i} onClick={(e) => { e.stopPropagation(); pickChoice(c); }}
                            style={{ textAlign: "left", background: "transparent", border: "none",
                              padding: "6px 6px 6px 12px", fontFamily: "Palatino, Georgia, serif", fontSize: 14.5,
                              color: "#d8c9a0", cursor: "pointer", lineHeight: 1.4,
                              borderLeft: "2px solid transparent",
                              transition: "border-color .15s, color .15s, background .15s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderLeftColor = "#ffd166"; e.currentTarget.style.color = "#fff8ea"; e.currentTarget.style.background = "rgba(255,209,102,0.08)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderLeftColor = "transparent"; e.currentTarget.style.color = "#d8c9a0"; e.currentTarget.style.background = "transparent"; }}>
                            — {c.a}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {hasExchange && (
                    <>
                      <div style={{ marginTop: 12, marginLeft: "18%", padding: "7px 12px",
                        background: "#fdfaf0", border: "1px solid #a17c3a", borderRadius: 10,
                        fontStyle: "italic", color: "#2a1c10", fontSize: 14, lineHeight: 1.4 }}>
                        — {bubble.playerLine}
                      </div>
                      <div style={{ marginTop: 10, fontSize: 15.5, lineHeight: 1.5, color: "#f4e8cc" }}>{bubble.followUp}</div>
                    </>
                  )}
                </div>
                {!hasChoices && (
                  <button onClick={(e) => { e.stopPropagation(); setBubble(null); }}
                    title="Fermer"
                    style={{ flex: "0 0 auto", background: "transparent", border: "none",
                      color: "#a89468", fontSize: 22, cursor: "pointer",
                      padding: "0 6px", fontFamily: "ui-monospace,monospace", lineHeight: 1 }}>
                    ×
                  </button>
                )}
              </div>
            </div>
          );
        }

        /* CAS 2 — bulle flottante ancrée au personnage : pour les répliques
           simples (défaut ou banalité aléatoire). Reprend le look phylactère
           d'origine, qui reste plus vivant que le bandeau sur ces échanges
           courts. */
        const W = Math.min(300, window.innerWidth - 24);
        const dessous = bubble.y < 240;
        const cx = Math.min(Math.max(bubble.x, 12 + W / 2), window.innerWidth - 12 - W / 2);
        return (
          <div onClick={() => setBubble(null)}
            style={{
              position: "fixed", zIndex: 60, left: cx, width: W, transform: "translateX(-50%)",
              ...(dessous ? { top: bubble.y + 18 } : { bottom: window.innerHeight - bubble.y + 16 }),
              background: "#f4e8cc", color: "#2a1c10", border: "1px solid #cbb489", borderRadius: 14,
              padding: "11px 14px", fontFamily: "Palatino, Georgia, serif", fontSize: 14.5, lineHeight: 1.5,
              boxShadow: "0 8px 26px rgba(0,0,0,0.5)", cursor: "pointer", animation: "fadein .18s ease-out",
            }}>
            {bubble.text}
            <div style={{ fontSize: 10, color: "#8a7250", fontStyle: "italic", marginTop: 5, textAlign: "right" }}>clique n'importe où pour fermer</div>
            <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: 0, height: 0,
              borderLeft: "10px solid transparent", borderRight: "10px solid transparent",
              ...(dessous ? { top: -11, borderBottom: "12px solid #f4e8cc" } : { bottom: -11, borderTop: "12px solid #f4e8cc" }) }} />
          </div>
        );
      })()}

      {modal?.type === "settings" && <SettingsModal />}

      {modal?.type === "alphabet" && (
        <AlphabetGame onClose={() => setModal(null)} onWin={() => grantItem("signes")} />
      )}

      {modal?.type === "tablette" && (
        <TabletteGame onClose={() => setModal(null)} onWin={() => grantMessage("msg_cuneiforme")} />
      )}

      {modal?.type === "cartouche" && (
        <CartoucheGame onClose={() => setModal(null)} onWin={() => grantMessage("msg_hieroglyphes")} />
      )}

      {modal?.type === "facture" && (
        <FactureGame facture={chapter.facture} onClose={() => setModal(null)}
          onWin={() => { grantFlag("paye"); grantItem("traite_galien"); }} />
      )}

      {modal?.type === "chappe" && (
        <ChappeGame onClose={() => setModal(null)} onWin={() => grantItem("signal_code")} />
      )}

      {modal?.type === "morse" && (
        <MorseGame onClose={() => setModal(null)} onWin={() => grantMessage("msg_telegraphe")} />
      )}

      {modal?.type === "tsf" && (
        <TsfGame onClose={() => setModal(null)} onWin={() => grantItem("antenne")} />
      )}

      {modal?.type === "photo" && (
        <PhotoGame onClose={() => setModal(null)} onWin={() => grantMessage("msg_daguerreotype")} />
      )}

      {modal?.type === "phono" && (
        <PhonoGame onClose={() => setModal(null)} onWin={() => grantMessage("msg_phonographe")} />
      )}

      {modal?.type === "cine" && (
        <CineGame onClose={() => setModal(null)} onWin={() => grantMessage("msg_cinema")} />
      )}

      {modal?.type === "tsf_reglage" && (
        <TsfReglageGame onClose={() => setModal(null)} onWin={() => grantMessage("msg_debarquement")} />
      )}

      {modal?.type === "cassette" && (
        <CassetteGame onClose={() => setModal(null)} onWin={() => grantMessage("msg_cassette")} />
      )}

      {modal?.type === "graver_cd" && (
        <GraverCdGame onClose={() => setModal(null)} onWin={() => grantMessage("msg_cd")} />
      )}

      {modal?.type === "faire_la_une" && (
        <FaireLaUneGame onClose={() => setModal(null)} onWin={() => grantMessage("msg_ligneEditoriale")} />
      )}

      {modal?.type === "cadrer_evenement" && (
        <CadrerEvenementGame onClose={() => setModal(null)} onWin={() => grantMessage("msg_evenement")} />
      )}

      {modal?.type === "eniac_debug" && (
        <EniacDebugGame onClose={() => setModal(null)} onWin={() => grantMessage("msg_eniac")} />
      )}

      {modal?.type === "fil_algo" && (
        <FilAlgoGame onClose={() => setModal(null)} onWin={() => grantMessage("msg_algorithme")} />
      )}

      {modal?.type === "verifier_images" && (
        <VraiFauxIAGame onClose={() => setModal(null)} onWin={() => grantMessage("msg_deepfake")} />
      )}

      {/* Modales spécifiques au JEU 2 */}
      {openNote && (() => {
        const cfg = JEU2[openNote.chapitre];
        const isRight = openNote.chapitre === jeu2Target;
        const text = isRight ? cfg.noteRightText : cfg.noteWrongText;
        return (
          <NoteAl3x1A
            support={cfg.support}
            text={text}
            chapitreNom={CHAPTERS[openNote.chapitre]?.epoque || ""}
            onClose={() => {
              /* Marque la note comme lue (retire le hotspot) */
              setJeu2Notes((v) => v.includes(openNote.chapitre) ? v : [...v, openNote.chapitre]);
              setOpenNote(null);
            }} />
        );
      })()}
      {openRetrouvailles && jeu2Target >= 0 && (
        <RetrouvaillesAl3x1A
          prenom={prenom}
          remede={JEU2[jeu2Target]?.remede}
          chapitreNom={CHAPTERS[jeu2Target]?.epoque || ""}
          onDone={() => { setOpenRetrouvailles(false); setScreen("finJeu2"); }} />
      )}

      {modal?.type === "taille_silex" && (
        <TailleSilexGame
          onClose={() => setModal(null)}
          /* Réussite : le silex brut se transforme en silex taillé. */
          onWin={() => {
            setInv((s) => {
              const i = s.indexOf("silex_brut");
              if (i < 0) return s.includes("silex") ? s : [...s, "silex"];
              const next = [...s.slice(0, i), ...s.slice(i + 1)];
              if (!next.includes("silex")) next.push("silex");
              return next;
            });
            bumpFlux(2);
            say("Silex taillé ! Un vrai outil tranchant vient de rejoindre ton sac.", "content");
          }}
          /* Échec : le silex brut se casse en miettes (perdu). */
          onFail={() => {
            setInv((s) => {
              const i = s.indexOf("silex_brut");
              if (i < 0) return s;
              return [...s.slice(0, i), ...s.slice(i + 1)];
            });
            say("Craac ! Le silex a cassé — va en chercher un autre.", "vexe");
          }}
        />
      )}

      {/* CARTE-INVENTION (façon Pokémon) qui apparaît quand un nouveau message est transmis */}
      {cardShowing && (
        <MediaCard card={cardShowing.card} message={cardShowing.message}
          onClose={() => setCardShowing(null)} />
      )}

      {/* MEDIADEX plein écran (bouton 🃏) */}
      {showMediadex && (
        <Mediadex unlocked={mediadex} onClose={() => setShowMediadex(false)}
          fluxTotal={fluxTotal} bonusChapters={bonusChapters} />
      )}

      {/* POUBELLE TEMPORELLE — apparaît quand l'élève ramasse son
          PREMIER déchet anachronique (via `anachronismLearned`). Elle
          sort en même temps que le message de MARTINE qui explique la
          mécanique → l'élève voit littéralement l'outil apparaître
          quand il en a besoin. Cible de drop pour les items marqués
          `anachronic: true`. Mode jeu 1 uniquement. */}
      {screen === "play" && mode !== "jeu2" && anachronismLearned && (
        <div data-drop="hot:poubelle_temporelle"
          title="Poubelle temporelle — glisse-y les objets qui n'ont rien à faire à cette époque (+3 flux)"
          style={{
            position: "fixed", bottom: 18, left: 18, zIndex: 55,
            width: 48, height: 56, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: "linear-gradient(180deg, #4a3020 0%, #1a0e08 100%)",
            border: "2px solid #8a5828", borderRadius: 8,
            boxShadow: "0 3px 14px rgba(0,0,0,0.55), inset 0 -2px 0 rgba(255,255,255,0.06)",
            fontSize: 24, cursor: "help", userSelect: "none",
            animation: "poubelleAppear 0.6s ease-out",
          }}>
          🗑️
          <span style={{ fontSize: 7, color: "#c8963e", fontFamily: "ui-monospace,monospace", letterSpacing: 1, marginTop: -3 }}>TEMPS</span>
          <style>{`@keyframes poubelleAppear { 0% { transform: scale(0.2) rotate(-30deg); opacity: 0; } 60% { transform: scale(1.15); } 100% { transform: scale(1); opacity: 1; } }`}</style>
        </div>
      )}

      {/* JEU 2 : anim TARDIS quand on change d'epoque via la frise.
          UN SEUL overlay pour tout le trajet (Firefox rendait des ecrans
          noirs quand deux overlays se remplacaient au milieu). L'overlay
          reste opaque pendant la phase vortex, puis son opacite glisse
          de 1 a 0 des que `fading` passe a true (transition CSS simple,
          bien plus fiable que keyframes cross-browser). Le decor est deja
          en place derriere : le fondu le decouvre en douceur. */}
      {jeu2Warp && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 90, pointerEvents: "auto",
          background: "radial-gradient(circle at 50% 50%, rgba(127,216,255,0.32), rgba(4,10,20,0.96) 60%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: jeu2Warp.fading ? 0 : 1,
          transition: "opacity 1.05s ease-out",
        }}>
          {/* Le vortex : 3 anneaux qui tournent + un cœur lumineux. Halo
              bleute cree par un radial-gradient SVG (evite `filter:
              drop-shadow`, capricieux sur Firefox). Le vortex disparait
              en fondu avec l'overlay -- on ne re-mount rien pendant la
              transition, evitant les flashes noirs. */}
          <svg viewBox="-100 -100 200 200" style={{ width: "min(72vmin, 620px)", height: "min(72vmin, 620px)" }}>
            <defs>
              <radialGradient id="warp-core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="35%" stopColor="#7fd8ff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#5aa8d8" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="warp-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7fd8ff" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#7fd8ff" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle r="98" fill="url(#warp-glow)" />
            {[
              { r: 88, w: 3, dur: "2.4s", dir: 1, op: 0.75, dash: "8 6" },
              { r: 66, w: 2.4, dur: "1.6s", dir: -1, op: 0.85, dash: "12 4" },
              { r: 46, w: 2, dur: "1s", dir: 1, op: 0.9, dash: "6 3" },
            ].map((a, i) => (
              /* SVG animateTransform natif : marche partout (Firefox/Edge/Chrome/Safari)
                 sans dependre d'un keyframe CSS et sans se battre avec transform-origin. */
              <g key={i}>
                <circle r={a.r} fill="none" stroke="#7fd8ff" strokeWidth={a.w} strokeDasharray={a.dash} opacity={a.op}>
                  <animateTransform attributeName="transform" type="rotate"
                    from={a.dir === 1 ? "0 0 0" : "360 0 0"}
                    to={a.dir === 1 ? "360 0 0" : "0 0 0"}
                    dur={a.dur} repeatCount="indefinite" />
                </circle>
              </g>
            ))}
            <circle r="30" fill="url(#warp-core)">
              <animate attributeName="opacity" values="1;0.35;1" dur="1.4s" repeatCount="indefinite" />
            </circle>
            <circle r="8" fill="#ffffff">
              <animate attributeName="opacity" values="1;0.35;1" dur="0.9s" repeatCount="indefinite" />
            </circle>
          </svg>
          {/* Nom de l'epoque, superpose au vortex */}
          <div style={{ position: "absolute", textAlign: "center", pointerEvents: "none" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 4, color: "#7fd8ff", opacity: 0.9, marginBottom: 6, textShadow: "0 0 10px rgba(127,216,255,0.8)" }}>SAUT TEMPOREL</div>
            <div style={{ fontFamily: TITRE_FONT, fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#fff", textShadow: "0 0 22px rgba(127,216,255,0.9), 0 0 40px rgba(127,216,255,0.6)" }}>{jeu2Warp.nom}</div>
          </div>
        </div>
      )}

      {/* ANIMATION SOS Morse ··· −−− ··· jouée après le choix en fin de chapitre.
          Puis on ouvre le VAISSEAU TEMPOREL (sauf apres le dernier chapitre). */}
      {sosOpen && (
        <SosOverlay muted={muted} onDone={() => {
          setSosOpen(false);
          if (isLastChapter) setEpiChoice(null);
          /* On ouvre le vaisseau temporel AUSSI pour le dernier saut
             (XXIe → station des chronautes en 2287), pour que la
             transition soit tangible et symétrique avec les autres. */
          setVesselOpen(true);
        }} />
      )}

      {/* VAISSEAU TEMPOREL : Martine annonce -> materialisation -> cockpit -> boussole.
          - Succes : on enchaine sur la transition classique vers le chapitre suivant.
          - Echec (tachyons) : geré en interne (retour au cockpit) par TimeVessel. */}
      {vesselOpen && (() => {
        const nextChap = CHAPTERS[chapterIndex + 1];
        const label = nextChap?.epoque || nextChap?.scenes?.[0]?.name || "Chapitre suivant";
        /* Fond du cockpit = premier tableau du chapitre COURANT (celui qu'on
           vient de finir), rendu en mode décoratif (handlers no-op). */
        const FirstScene = chapter.scenes?.[0]?.Component;
        const cockpitBackdrop = FirstScene ? (
          <FirstScene collect={() => {}} action={() => {}} reveal={null}
            made={[]} inv={[]} flags={{}} queteQui={null} mode="jeu1" bare />
        ) : null;
        /* Label pour le dernier saut : on ne va pas à un chapitre, on va à
           la station des chronautes en 2287. */
        const finalLabel = isLastChapter ? "STATION DES CHRONAUTES · 2287" : label;
        return (
          <TimeVessel
            nextLabel={finalLabel}
            backdrop={cockpitBackdrop}
            onDone={() => {
              setVesselOpen(false);
              if (isLastChapter) {
                setScreen("chronautes");
              } else {
                setTransitionTo(chapterIndex + 1);
                setScreen("transition");
              }
            }}
            onCancel={() => setVesselOpen(false)}
          />
        );
      })()}

      {/* ─── CHOIX du support SOS en fin de chapitre ─── */}
      {sosChooserOpen && (
        <SosChooserOverlay
          chapterIndex={chapterIndex}
          chapter={chapter}
          msgs={msgs}
          sosSent={sosSent}
          onChoose={(msgId, dur) => {
            setSosSent((v) => v.includes(msgId) ? v : [...v, msgId]);
            bumpFlux(dur);
            setSosChooserOpen(false);
            setSosOpen(true); // lance l'animation Morse, qui enchaînera sur le saut
          }}
        />
      )}

      {modal?.type === "carte" && (
        <WorldMap Carte={chapter.carte} tab={tab} titre={chapter.epoque} onClose={() => setModal(null)} />
      )}

      {modal?.type === "journal" && (
        <div style={overlay} onClick={() => setModal(null)}>
          <div style={{ ...card, maxHeight: "80vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0, color: "#5eff9e", fontFamily: "ui-monospace,monospace", letterSpacing: 2, fontSize: 16 }}>📔 CARNET DE BORD</h2>
            {collection.length === 0 && <p style={{ color: "#8fa3bd", fontStyle: "italic" }}>Aucune découverte pour l'instant. Explore, combine, transmets !</p>}
            <Frise collection={collection} />
            {/* récapitulatif cumulatif : transmis (cristaux) vs perdus (fragments) */}
            {collection.length > 0 && (
              <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11.5, margin: "2px 0 10px" }}>
                <span style={{ color: "#5eff9e" }}>◆ {collection.filter((c) => !c.perdu).length} transmis</span>
                <span style={{ color: "#5a6678" }}> · </span>
                <span style={{ color: "#8fa3bd" }}>💨 {collection.filter((c) => c.perdu).length} perdu(s) en route</span>
              </div>
            )}
            {/* toutes les découvertes du voyage — lues dans la collection
                (auto-suffisante), donc valables d'un chapitre à l'autre */}
            {collection.filter((c) => !c.perdu).map((c) => (
              <div key={c.id} style={{ background: "#141b26", borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
                <strong>{c.emoji} {c.titre} <span style={{ color: "#8fa3bd", fontWeight: 400, fontSize: 11 }}>· {c.date}</span></strong>
                <p style={{ fontSize: 13, color: "#b8c4d4", margin: "4px 0 0", lineHeight: 1.5 }}>{c.fact}</p>
              </div>
            ))}
            {/* les fragments (messages perdus) — grisés */}
            {collection.filter((c) => c.perdu).map((c) => (
              <div key={c.id} style={{ background: "#0f1420", border: "1px dashed #3a4656", borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
                <strong style={{ color: "#8fa3bd" }}>💨 {c.titre} <span style={{ fontWeight: 400, fontSize: 11 }}>· {c.date} · perdu en route</span></strong>
                <p style={{ fontSize: 13, color: "#8a96a6", margin: "4px 0 0", lineHeight: 1.5 }}>{c.fact}</p>
              </div>
            ))}
            <div style={{ fontSize: 12, color: "#7a879e", margin: "8px 0" }}>
              {ALL_MSGS.length - msgs.length} message(s) encore à transmettre dans ce chapitre.
            </div>

            {/* ---- la sortie papier : trace écrite de la séance ---- */}
            <div style={{ borderTop: "1px solid #2a3648", paddingTop: 12, marginTop: 4 }}>
              <label style={{ fontSize: 12, color: "#8fa3bd", display: "block", marginBottom: 6 }}>
                Ton prénom (il s'imprimera sur le carnet) :
              </label>
              <input value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Prénom"
                style={{ width: "100%", background: "#141b26", border: "1px solid #2a3648", borderRadius: 8, padding: "9px 10px", color: "#e8eef5", fontSize: 14, fontFamily: "inherit", marginBottom: 8 }} />
              <button onClick={() => window.print()} disabled={collection.length === 0}
                style={{ width: "100%", background: collection.length ? "#e8934a" : "#2a2a2a", color: collection.length ? "#1a0e02" : "#5a6678", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, cursor: collection.length ? "pointer" : "default", fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
                🖨 VERSION IMPRIMABLE
              </button>
            </div>

            <button onClick={() => setModal(null)} style={{ width: "100%", background: "#1a2536", color: "#e8eef5", border: "1px solid #2a3648", borderRadius: 10, padding: "12px", fontWeight: 700, cursor: "pointer", marginTop: 8 }}>
              Fermer
            </button>
          </div>
        </div>
      )}

      <CarnetPrint
        prenom={prenom}
        collection={collection}
        fluxTotal={fluxTotal}
        bonusChapters={bonusChapters}
        chapters={CHAPTERS}
      />
    </div>
    </DragProvider>
  );
}

const overlay = { position: "fixed", inset: 0, background: "rgba(4,8,14,0.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 50, backdropFilter: "blur(3px)" };
const card = { background: "#0e1420", border: "2px solid #e8934a66", borderRadius: 18, padding: 20, maxWidth: 480, width: "100%", boxShadow: "0 12px 48px rgba(0,0,0,0.6)", animation: "popIn .25s ease-out" };
