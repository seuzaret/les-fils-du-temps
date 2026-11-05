import { useState, useEffect, useRef } from "react";

/* ============================================================
   MINI-JEU : « Le daguerréotype de James » (Californie, ~1855)
   ------------------------------------------------------------
   Le joueur voit ce que voit le photographe : un CADRE fixe (la
   mire), et JAMES qui GIGOTE — impossible de tenir 15 secondes
   sans bouger ! Il faut appuyer sur DÉCLENCHER pour armer le
   magnésium : après un court délai (~250 ms), le FLASH part
   pour de vrai. Si James est dans le cadre à cet instant, la
   photo est prise. Il en faut 3 réussies : après chaque flash,
   ses yeux sont éblouis différemment (aveugle, larmes, plissés,
   bigleux…).
   Leçon EMI : la photo est un DÉCALAGE — on ne capture jamais
   l'instant qu'on croit voir. C'est déjà de la mise en scène.
   ============================================================ */

const NEED = 3;              // 3 photos réussies pour la fiche
const MAX_TRIES = 10;        // 10 plaques dans le châssis — au-delà, on recommence
const FLASH_DELAY_MS = 260;  // décalage entre "déclencher" et le vrai flash
const FRAME_X0 = 160, FRAME_X1 = 240; // fenêtre où James doit être (SVG viewBox 400)

/* 5 émotions d'éblouissement — un dessin par "coup au but". */
const DAZE_EYES = [
  { name: "Ébloui", left: [-3, 0, 3, 0], right: [-3, 0, 3, 0], mouth: "O" },
  { name: "Larmes", left: [-3, 1], right: [3, 1], tear: true, mouth: "-" },
  { name: "Plissés", squint: true, mouth: "n" },
  { name: "Bigleux", crossed: true, mouth: "-" },
  { name: "Aveuglé (papillons)", stars: true, mouth: "O" },
];

/* petit flash sonore (WebAudio) : "pssschh" court */
let AC = null;
function playFlash() {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === "suspended") AC.resume();
    const t = AC.currentTime;
    const noise = AC.createBufferSource();
    const buffer = AC.createBuffer(1, AC.sampleRate * 0.18, AC.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    noise.buffer = buffer;
    const g = AC.createGain();
    g.gain.setValueAtTime(0.25, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    noise.connect(g); g.connect(AC.destination);
    noise.start(t); noise.stop(t + 0.2);
  } catch {}
}

export function PhotoGame({ onClose, onWin }) {
  const [taken, setTaken] = useState([]);      // [{ok, dazeIdx}, …]
  const [flashing, setFlashing] = useState(false);
  const [armed, setArmed] = useState(false);   // le déclencheur est ARMÉ (délai en cours)
  const [dazeIdx, setDazeIdx] = useState(null);
  const [won, setWon] = useState(false);
  /* animation d'OUVERTURE : le cache est retiré, un bref halo de lumière
     entre dans l'objectif — puis on découvre le viseur. */
  const [opening, setOpening] = useState(true);
  useEffect(() => { const t = setTimeout(() => setOpening(false), 620); return () => clearTimeout(t); }, []);

  /* position animée de James — mouvement irrégulier, plus rapide qu'un enfant excité.
     `x` est aussi tenu dans un ref pour être lu à l'instant PRÉCIS où le
     flash tombe (le setTimeout capturerait sinon la valeur du clic). */
  const [x, setX] = useState(200);
  const xRef = useRef(200);
  const raf = useRef(null);
  const t0 = useRef(performance.now());

  useEffect(() => {
    const tick = (t) => {
      const elapsed = (t - t0.current) / 1000;
      const nx = 200 + Math.sin(elapsed * 1.7) * 120 + Math.sin(elapsed * 4.3) * 30 + Math.sin(elapsed * 0.9) * 40;
      xRef.current = nx;
      setX(nx);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  useEffect(() => { if (won) onWin?.(); }, [won]); // eslint-disable-line

  /* cheat de test : taper "gg" (deux g en < 800 ms) valide 3 photos parfaites. */
  const lastG = useRef(0);
  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === "g" || e.key === "G") && !won) {
        const now = Date.now();
        if (now - lastG.current < 800) {
          setTaken([{ok:true,dazeIdx:0},{ok:true,dazeIdx:2},{ok:true,dazeIdx:4}]);
          setTimeout(() => setWon(true), 200);
        }
        lastG.current = now;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [won]);

  const declencher = () => {
    if (armed || flashing || won) return;
    setArmed(true);
    /* le magnésium met un instant à s'enflammer — c'est là toute
       la difficulté du daguerréotype ! */
    setTimeout(() => {
      const inFrame = xRef.current >= FRAME_X0 && xRef.current <= FRAME_X1;
      const idx = Math.floor(Math.random() * DAZE_EYES.length);
      setDazeIdx(idx);
      setFlashing(true);
      playFlash();
      setTimeout(() => setFlashing(false), 220);
      setTaken((arr) => {
        const nxt = [...arr, { ok: inFrame, dazeIdx: idx }];
        const wins = nxt.filter((s) => s.ok).length;
        /* victoire dès qu'on tient NEED bonnes photos */
        if (wins >= NEED) setTimeout(() => setWon(true), 900);
        return nxt;
      });
      /* les yeux ne se remettent pas tout de suite */
      setTimeout(() => setDazeIdx(null), 1100);
      setArmed(false);
    }, FLASH_DELAY_MS);
  };

  const okCount = taken.filter(t => t.ok).length;
  const outOfTries = taken.length >= MAX_TRIES && okCount < NEED && !won;

  const recommencer = () => {
    setTaken([]); setArmed(false); setFlashing(false); setDazeIdx(null);
    t0.current = performance.now(); // remet le mouvement à zéro
  };

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(4,8,14,0.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 70, backdropFilter: "blur(3px)" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", background: "#17110a", border: "2px solid #c8963e66", borderRadius: 18, padding: 20, maxWidth: 620, width: "100%", maxHeight: "92vh", overflow: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.6)", color: "#efe6d2", fontFamily: "Palatino, Georgia, serif" }}>
        <div style={{ textAlign: "center", fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 2, color: "#e0a848" }}>📷 STUDIO DAGUERRÉOTYPE · CALIFORNIE 1855</div>
        <h2 style={{ textAlign: "center", margin: "6px 0 4px", color: "#ffd166", fontSize: 21 }}>Le portrait de James pour sa mère</h2>
        {/* halo lumineux qui envahit le modal quand on retire le cache */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "radial-gradient(circle at 50% 50%, #fff2c8 0%, #ffe8a0 40%, transparent 75%)", pointerEvents: "none", opacity: opening ? 1 : 0, transition: "opacity 0.55s ease-out", zIndex: 5 }} />

        {!won ? (
          <>
            <p style={{ textAlign: "center", fontSize: 14.5, color: "#d8c9a8", margin: "0 0 12px" }}>
              James n'arrive pas à rester immobile ! Appuie sur <strong>DÉCLENCHER</strong> pour armer le magnésium — attention, le flash part avec un COURT DÉLAI. Il faut le viser bien dans le cadre. Trois bonnes photos suffiront.
            </p>

            {/* ═══ ce que voit le photographe (viseur, dépoli à l'envers en réalité, mais on affiche à l'endroit) ═══ */}
            <svg viewBox="0 0 400 260" style={{ width: "100%", height: "auto", background: "#0e0a06", borderRadius: 8, border: "2px solid #5a4028" }}>
              {/* le CADRE de visée (mire fixe) */}
              <rect x={FRAME_X0} y="40" width={FRAME_X1 - FRAME_X0} height="200" fill="none" stroke="#c8963e" strokeWidth="2" strokeDasharray="6 6" />
              {/* réticule central */}
              <path d={`M${(FRAME_X0 + FRAME_X1) / 2} 40 v14 M${(FRAME_X0 + FRAME_X1) / 2} 226 v14 M${FRAME_X0} 140 h14 M${FRAME_X1 - 14} 140 h14`} stroke="#c8963e" strokeWidth="1.5" />
              {/* décor de fond (studio) */}
              <path d="M0 240 h400 v-4 h-400 Z" fill="#3a2418" />
              <path d="M60 236 h280 v-160 h-280 Z" fill="#4a2a18" opacity="0.5" />

              {/* JAMES qui gigote (position x animée) */}
              <g transform={`translate(${x},178)`}>
                {/* corps */}
                <path d="M-24 0 Q-30 -50 -14 -70 L14 -70 Q30 -50 24 0 L20 -6 L-20 -6 Z" fill="#1c1610" />
                <path d="M-12 -70 L0 -56 L12 -70 L10 -18 L-10 -18 Z" fill="#7a5220" />
                <path d="M-4 -76 Q0 -70 4 -76 L2 -60 Q0 -56 -2 -60 Z" fill="#efe6d2" />
                {/* tête */}
                <g transform="translate(0, -100)">
                  <circle cx="0" cy="0" r="22" fill="#e0b084" />
                  <path d="M-18 -6 Q-16 -22 0 -22 Q16 -22 18 -6 Q10 -16 0 -16 Q-10 -16 -18 -6 Z" fill="#b0602c" />
                  {/* moustache */}
                  <path d="M-6 8 q6 -3 12 0 q-2 -4 -6 -4 q-4 0 -6 4 Z" fill="#a85a2a" />
                  {/* YEUX : normaux, ou éblouis selon dazeIdx (dessins ci-dessous) */}
                  {dazeIdx === null && (
                    <>
                      <circle cx="-7" cy="-4" r="2" fill="#3a6a8a" />
                      <circle cx="7" cy="-4" r="2" fill="#3a6a8a" />
                    </>
                  )}
                  {dazeIdx === 0 && (
                    /* ÉBLOUI : pupilles minuscules dans grand blanc */
                    <>
                      <circle cx="-7" cy="-4" r="4" fill="#fff" /><circle cx="-7" cy="-4" r="0.7" fill="#3a6a8a" />
                      <circle cx="7" cy="-4" r="4" fill="#fff" /><circle cx="7" cy="-4" r="0.7" fill="#3a6a8a" />
                    </>
                  )}
                  {dazeIdx === 1 && (
                    /* LARMES qui coulent */
                    <>
                      <path d="M-11 -4 h8 M3 -4 h8" stroke="#3a2418" strokeWidth="2" fill="none" />
                      <path d="M-8 0 q-1 5 2 8" stroke="#7fd8ff" strokeWidth="1.4" fill="none" />
                      <circle cx="-6" cy="10" r="1.6" fill="#7fd8ff" />
                      <circle cx="6" cy="10" r="1.6" fill="#7fd8ff" />
                    </>
                  )}
                  {dazeIdx === 2 && (
                    /* PLISSÉS : deux traits noirs */
                    <>
                      <path d="M-11 -4 q4 4 8 0" stroke="#3a2418" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                      <path d="M3 -4 q4 4 8 0" stroke="#3a2418" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                    </>
                  )}
                  {dazeIdx === 3 && (
                    /* BIGLEUX : pupilles au centre */
                    <>
                      <circle cx="-7" cy="-4" r="3" fill="#fff" /><circle cx="-4" cy="-4" r="1.6" fill="#3a6a8a" />
                      <circle cx="7" cy="-4" r="3" fill="#fff" /><circle cx="4" cy="-4" r="1.6" fill="#3a6a8a" />
                    </>
                  )}
                  {dazeIdx === 4 && (
                    /* AVEUGLÉ — petites étoiles/papillons */
                    <>
                      <text x="-7" y="-2" fontSize="8" textAnchor="middle" fill="#ffd166">✦</text>
                      <text x="7" y="-2" fontSize="8" textAnchor="middle" fill="#ffd166">✦</text>
                    </>
                  )}
                  {/* bouche : varie selon l'émotion */}
                  {(!dazeIdx && dazeIdx !== 0) && <path d="M-4 8 q4 3 8 0" stroke="#7a3a18" strokeWidth="1.5" fill="none" />}
                  {dazeIdx === 0 && <ellipse cx="0" cy="9" rx="3" ry="4" fill="#5a2818" />}
                  {dazeIdx === 4 && <ellipse cx="0" cy="9" rx="3" ry="4" fill="#5a2818" />}
                  {dazeIdx === 1 && <path d="M-4 10 L4 10" stroke="#5a2818" strokeWidth="1.6" />}
                  {dazeIdx === 2 && <path d="M-4 9 q4 -2 8 0" stroke="#5a2818" strokeWidth="1.4" fill="none" />}
                  {dazeIdx === 3 && <path d="M-4 10 L4 10" stroke="#5a2818" strokeWidth="1.6" />}
                </g>
              </g>

              {/* Le grand FLASH BLANC qui recouvre tout quand le magnésium part */}
              {flashing && <rect width="400" height="260" fill="#fff" opacity="0.95" />}

              {/* Anneau ARMÉ (le magnésium chauffe) — petit signal en haut */}
              {armed && !flashing && (
                <g transform="translate(370,20)">
                  <circle r="6" fill="#e0a848" style={{ animation: "pulse 0.25s infinite" }} />
                  <text x="-10" y="4" textAnchor="end" fontFamily="ui-monospace,monospace" fontSize="9" fill="#e0a848">ARMÉ…</text>
                </g>
              )}
            </svg>

            {/* la RANGÉE DES PHOTOS PRISES (visibles côte à côte) */}
            <div style={{ display: "flex", gap: 6, justifyContent: "center", margin: "12px 0 8px", minHeight: 40 }}>
              {taken.map((sh, i) => (
                <div key={i} style={{ width: 44, height: 40, background: sh.ok ? "#3a2410" : "#0a0604", border: `2px solid ${sh.ok ? "#7fe0a8" : "#a83828"}`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "ui-monospace,monospace", fontSize: 11.5, color: sh.ok ? "#7fe0a8" : "#a83828" }}>
                  {sh.ok ? "✓" : "✗"}<br />
                </div>
              ))}
              {taken.length === 0 && <span style={{ fontSize: 12, color: "#a89878", fontStyle: "italic", alignSelf: "center" }}>aucune photo prise</span>}
            </div>
            <p style={{ textAlign: "center", fontSize: 13.5, color: "#c8963e", margin: "0 0 8px" }}>
              {okCount} / {NEED} bonnes photos · plaques utilisées : {taken.length} / {MAX_TRIES}
            </p>

            {outOfTries ? (
              <>
                <p style={{ textAlign: "center", fontSize: 14.5, color: "#e0685a", fontStyle: "italic", margin: "6px 0 10px" }}>
                  Toutes les plaques du photographe sont utilisées ! Il faut tout recommencer.
                </p>
                <button onClick={recommencer}
                  style={{ width: "100%", background: "#c8382e", color: "#efe6d2", border: "none", borderRadius: 10, padding: "16px", fontWeight: 800, cursor: "pointer", fontSize: 17, fontFamily: "ui-monospace,monospace", letterSpacing: 2 }}>
                  ↺ RECOMMENCER
                </button>
              </>
            ) : (
              <button onClick={declencher} disabled={armed || flashing}
                style={{ width: "100%", background: armed ? "#5a4028" : "#e0a848", color: "#1a1206", border: "none", borderRadius: 10, padding: "18px", fontWeight: 800, cursor: armed ? "wait" : "pointer", fontSize: 18, fontFamily: "ui-monospace,monospace", letterSpacing: 2 }}>
                {armed ? "⚡ MAGNÉSIUM ALLUMÉ…" : "⚡ DÉCLENCHER"}
              </button>
            )}
          </>
        ) : (
          <div style={{ marginTop: 4 }}>
            <div style={{ background: "#0e1420", border: "1px solid #2a3648", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "#e8eef5", margin: 0 }}>
                « Trois plaques réussies ! James pourra choisir la moins pire pour sa mère. Le daguerréotype (Daguerre, 1839) fixe la lumière sur une plaque de cuivre argentée en 15 à 30 secondes ; en 1855, avec le magnésium, on descend à 1 seconde… mais l'éclair est si violent qu'il ÉBLOUIT le sujet. Les portraits d'époque font tous la tête : essaie de sourire quand tu prends la foudre en pleine figure. Retiens ça : la photo est un DÉCALAGE — le photographe ne capture jamais tout à fait l'instant qu'il croit voir. Dès 1850 on RETOUCHE les daguerréotypes ; en 2026 c'est pareil, en pire. Bonne habitude : se demander toujours qui a fait cette image, ET ce qu'elle NE montre pas. » — MARTINE
              </p>
            </div>
            <p style={{ textAlign: "center", margin: "12px 0 0", color: "#7fe0a8", fontSize: 14.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              ✓ Daguerréotype de James : pour l'Irlande !
            </p>
            <button onClick={onClose}
              style={{ marginTop: 10, width: "100%", background: "#e0a848", color: "#1a1206", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, cursor: "pointer", fontSize: 16, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              Continuer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
