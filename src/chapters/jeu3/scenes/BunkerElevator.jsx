import { useState, useEffect, useRef } from "react";
import { LEVELS, ROOM_TO_LEVEL, isLevelUnlocked, isLevelVisible } from "../levels.js";
import { MISSIONS_RUMEURS, getMissionOrder } from "../missions.js";

/* ============================================================
   JEU 3 — Ascenseur du bunker (v5 : cabine + panneau de bord)
   ------------------------------------------------------------
   On voit qu'on est DANS une cabine d'ascenseur : mur du fond
   avec portes fermées à seam central, ticker LED d'étage
   au-dessus, cabine avec ceiling à néons encastrés, plancher
   dallé, main courante des deux côtés, miroir mural gauche,
   grille de ventilation gauche haut, extincteur au sol.
   Le tableau de sélection des étages est monté sur le mur
   droit — vraie disposition d'ascenseur.
   Graffitis des Fils du Temps : un nouveau tag apparaît sur les
   parois à chaque étape de l'enquête (voir GRAFFITIS) ; la légende
   sous la cabine décrit celui qu'on n'a pas encore vu
   (flag graffiti_vus = liste des ids déjà vus).
   ============================================================ */

/* Ordre du récit : Kova, une 2e rumeur, Tchatine, l'arrestation de
   Jorge, les trois voyages K. Chaque tag dépend de sa propre étape,
   l'ordre dans lequel le joueur les fait n'a pas d'importance. */
const GRAFFITIS = [
  { id: "qui", when: (f) => !!f.mission_kova_done,
    caption: "Sur le miroir, quelqu'un a écrit au feutre : « QUI L'A ÉCRIT ? ». À côté, un petit dessin : un sablier traversé d'un fil." },
  { id: "fils", when: (f) => getMissionOrder(f).filter((id) => f[MISSIONS_RUMEURS[id]?.flag]).length >= 2,
    caption: "Au-dessus du tableau, sur la peinture grise toute fraîche, un tag à la bombe : « LES FILS DU TEMPS SE SOUVIENNENT », signé du même sablier." },
  { id: "verifie", when: (f) => !!f.mission_tchatine_done,
    caption: "Sur la porte de gauche, deux mots peints à la bombe : « VÉRIFIE. RECOUPE. »" },
  { id: "jorge", when: (f) => !!f.jorge_arrete,
    caption: "Sur la porte de droite, la peinture coule encore : « LIBÉREZ JORGE ». Jorge est en cellule : quelqu'un d'autre écrit ces messages." },
  { id: "lea", when: (f) => (f.k_voyage_order || ["gutenberg", "chappe", "marconi"]).every((id) => f[`voyageK_${id}_done`]),
    caption: "Au-dessus du miroir, une nouvelle inscription : « LÉA AVAIT RAISON »." },
];

/* Signature des Fils du Temps : un sablier traversé d'un fil. */
function Sigil({ x, y, s = 1, color }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-8 -12 H8 L0 0 Z M-8 12 H8 L0 0 Z" fill="none" stroke={color} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M-15 -3 C-7 -10 5 4 15 -4" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </g>
  );
}

/* Coulures sous un tag à la bombe (positions fixes). */
function Drips({ x, y, w, color, seed = 1 }) {
  return (
    <g>
      {Array.from({ length: 6 }).map((_, i) => {
        const dx = ((i * 37 + seed * 53) % 100) / 100;
        const h = 6 + ((i * 29 + seed * 17) % 14);
        return <rect key={i} x={x + dx * w} y={y} width="2" height={h} rx="1" fill={color} opacity="0.75" />;
      })}
    </g>
  );
}

const SPRAY = "'Arial Black', Impact, 'Helvetica Neue', sans-serif";
const MARKER = "'Segoe Print', 'Comic Sans MS', 'Bradley Hand', cursive";

export default function BunkerElevator({ onGo, j3 }) {
  const currentLvl = ROOM_TO_LEVEL[j3?.previousRoom] || "0";
  const [phase, setPhase] = useState("idle");
  const [target, setTarget] = useState(null);
  const [kTaps, setKTaps] = useState(0);
  const rafRef = useRef(null);
  const audioRef = useRef(null);
  const K_TAPS_NEEDED = 5;
  /* Graffitis visibles, et ceux qu'on découvre à cette visite
     (calculés une fois à l'entrée dans la cabine). */
  const tags = new Set(GRAFFITIS.filter((g) => g.when(j3?.flags || {})).map((g) => g.id));
  const [newTags] = useState(() => {
    const seen = j3?.flags?.graffiti_vus || [];
    return GRAFFITIS.filter((g) => tags.has(g.id) && !seen.includes(g.id)).map((g) => g.id);
  });
  useEffect(() => {
    if (newTags.length) j3?.setFlag?.("graffiti_vus", [...tags]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const tagStyle = (id) => (newTags.includes(id) ? { animation: "evTagIn 1.4s ease-out 0.5s both" } : undefined);
  const lastNew = GRAFFITIS.filter((g) => newTags.includes(g.id)).pop();

  const beep = (freq = 440, dur = 0.08) => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!audioRef.current) audioRef.current = new Ctx();
      const ctx = audioRef.current;
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      const t0 = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.08, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    } catch {}
  };

  const go = (lvl) => {
    if (!isLevelUnlocked(lvl.id, j3.flags)) return;
    if (lvl.id === currentLvl) { onGo(lvl.hubRoom); return; }
    setTarget(lvl);
    /* K-01 : phase « glitch » (défaillance lumière) avant le mouvement. */
    setPhase(lvl.id === "K" ? "glitch" : "moving");
  };

  /* Phase glitch : courte défaillance lumière avant le trajet vers K. */
  useEffect(() => {
    if (phase !== "glitch") return;
    const t = setTimeout(() => setPhase("moving"), 1600);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "moving") return;
    /* Trajet plus long et chaotique quand on descend vers K. */
    const dur = target?.id === "K" ? 2600 : 1500;
    const t = setTimeout(() => setPhase("arrived"), dur);
    return () => clearTimeout(t);
  }, [phase, target]);

  useEffect(() => {
    if (phase !== "arrived") return;
    const t = setTimeout(() => onGo(target.hubRoom), 1500);
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current); };
  }, [phase, target, onGo]);

  const displayLvl = phase === "arrived" ? target : LEVELS.find((l) => l.id === currentLvl);
  const isMoving = phase === "moving";
  const isGlitch = phase === "glitch";
  const isK = target?.id === "K";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%" }}>
      <svg viewBox="0 0 1200 620" style={{ display: "block", width: "100%", height: "auto", maxHeight: "100%" }}>
        <defs>
          <linearGradient id="ev-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a4048" />
            <stop offset="100%" stopColor="#141c26" />
          </linearGradient>
          <linearGradient id="ev-ceil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#28303a" />
            <stop offset="100%" stopColor="#1a2028" />
          </linearGradient>
          <linearGradient id="ev-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a4048" />
            <stop offset="100%" stopColor="#0a0e14" />
          </linearGradient>
          <linearGradient id="ev-door" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8a9098" />
            <stop offset="100%" stopColor="#3a4048" />
          </linearGradient>
          <linearGradient id="ev-panel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a6270" />
            <stop offset="100%" stopColor="#28303a" />
          </linearGradient>
          <linearGradient id="ev-mirror" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2a3540" />
            <stop offset="60%" stopColor="#3a4a58" />
            <stop offset="100%" stopColor="#1a2028" />
          </linearGradient>
          <filter id="ev-spray" x="-5%" y="-20%" width="110%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" />
            <feGaussianBlur stdDeviation="0.35" />
          </filter>
          <radialGradient id="ev-glow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor={displayLvl?.color || "#5eff9e"} stopOpacity="0.28" />
            <stop offset="100%" stopColor={displayLvl?.color || "#5eff9e"} stopOpacity="0" />
          </radialGradient>
        </defs>

        <g style={
          isGlitch ? { animation: "evJolt 0.5s ease-in-out infinite" } :
          isMoving && isK ? { animation: "evShakeHard 0.09s ease-in-out infinite" } :
          isMoving ? { animation: "evShake 0.14s ease-in-out infinite" } : {}
        }>
          {/* Mur du fond de la cabine */}
          <rect width="1200" height="620" fill="url(#ev-wall)" />
          {/* Lambris verticaux sur tout le mur */}
          {[0, 120, 240, 360, 480, 600, 720, 840, 960, 1080, 1200].map((x, i) => (
            <line key={i} x1={x} y1="80" x2={x} y2="540" stroke="#0a0e14" strokeWidth="0.8" opacity="0.6" />
          ))}

          {/* Rideau noir qui éclipse brièvement toute la cabine pendant
              le glitch (pour simuler la panne de courant). */}
          {isGlitch && (
            <rect width="1200" height="620" fill="#000">
              <animate attributeName="opacity" values="0;0.8;0;0.6;0;0.9;0.1" dur="1.6s" repeatCount="1" fill="freeze" />
            </rect>
          )}

          {/* PLAFOND avec caissons de néons encastrés */}
          <rect x="0" y="0" width="1200" height="80" fill="url(#ev-ceil)" />
          <path d="M0 80 L1200 80" stroke="#0a0e14" strokeWidth="2.5" />
          {/* 3 caissons de néons rectangulaires. En glitch, ils vacillent
              brutalement et de manière désynchronisée. */}
          {[220, 600, 980].map((x, i) => (
            <g key={i} transform={`translate(${x},40)`}>
              <rect x="-100" y="-24" width="200" height="48" fill="#141c26" stroke="#0a0e14" strokeWidth="2" rx="4" />
              <rect x="-88" y="-16" width="176" height="32" fill="#e8eef5"
                opacity={isGlitch ? 0.1 : (isMoving ? 0.55 : 0.92)} rx="2">
                {isGlitch && (
                  <animate attributeName="opacity"
                    values={i === 0 ? "0.9;0.1;0.8;0.05;0.7;0;0.4" :
                            i === 1 ? "0.1;0.9;0.05;0.6;0.1;0.8;0" :
                                      "0.6;0;0.9;0.1;0.3;0.9;0.05"}
                    dur="1.6s" repeatCount="1" fill="freeze" />
                )}
                {isMoving && !isGlitch && (
                  <animate attributeName="opacity"
                    values={isK ? "0.1;0.6;0.2;0.5;0.1" : "0.35;0.8;0.35"}
                    dur={isK ? "0.35s" : "0.25s"} repeatCount="indefinite" />
                )}
              </rect>
            </g>
          ))}

          {/* PLANCHER dallé + seuil de porte */}
          <rect y="540" width="1200" height="80" fill="url(#ev-floor)" />
          <path d="M0 540 L1200 540" stroke="#0a0e14" strokeWidth="2.5" />
          {/* Dalles diagonales pour perspective */}
          {[120, 320, 520, 720, 920, 1120].map((x, i) => (
            <path key={i} d={`M${x} 540 L${x + (x - 600) * 0.15} 620`} stroke="#0a0e14" strokeWidth="0.8" opacity="0.55" />
          ))}
          <path d="M0 580 L1200 580" stroke="#0a0e14" strokeWidth="0.6" opacity="0.5" />
          {/* Seuil laiton au milieu (devant les portes) */}
          <rect x="380" y="536" width="240" height="8" fill="#c8a848" stroke="#3a2010" strokeWidth="1" />

          {/* HALO couleur d'étage en fond */}
          <ellipse cx="500" cy="320" rx="440" ry="220" fill="url(#ev-glow)" />

          {/* PORTES CENTRALES : fermées, s'ouvrent quand phase === "arrived" */}
          <g>
            {/* Cadre en acier */}
            <rect x="376" y="200" width="248" height="336" fill="#28303a" stroke="#0a0e14" strokeWidth="4" />
            {/* Cage sombre visible derrière les portes quand elles s'ouvrent */}
            <rect x="384" y="208" width="232" height="320" fill="#0a0806" />
            {/* Lueur verte au bout du couloir de sortie */}
            {phase === "arrived" && (
              <ellipse cx="500" cy="368" rx="60" ry="120" fill={target?.color || "#5eff9e"} opacity="0.35">
                <animate attributeName="opacity" values="0;0.5;0.35" dur="0.7s" begin="0.2s" fill="freeze" />
              </ellipse>
            )}
            {/* Panneau gauche — glisse vers la gauche à l'arrivée */}
            <g style={phase === "arrived" ? { animation: "evDoorL 0.7s ease-out forwards" } : {}}>
              <rect x="384" y="208" width="116" height="320" fill="url(#ev-door)" stroke="#0a0e14" strokeWidth="1.5" />
              <rect x="410" y="220" width="6" height="290" fill="#c8d4e2" opacity="0.25" />
              <rect x="486" y="350" width="8" height="40" fill="#c8a848" stroke="#3a2010" strokeWidth="0.8" />
              {tags.has("verifie") && (
                <g style={tagStyle("verifie")} filter="url(#ev-spray)" transform="rotate(-4 442 280)">
                  <text x="442" y="272" textAnchor="middle" fontFamily={SPRAY} fontWeight="900" fontSize="21" fill="#e8d048" stroke="#1a1408" strokeWidth="0.8">VÉRIFIE.</text>
                  <text x="444" y="298" textAnchor="middle" fontFamily={SPRAY} fontWeight="900" fontSize="21" fill="#e8d048" stroke="#1a1408" strokeWidth="0.8">RECOUPE.</text>
                  <Drips x={398} y={301} w={90} color="#e8d048" seed={3} />
                </g>
              )}
            </g>
            {/* Panneau droit — glisse vers la droite à l'arrivée */}
            <g style={phase === "arrived" ? { animation: "evDoorR 0.7s ease-out forwards" } : {}}>
              <rect x="500" y="208" width="116" height="320" fill="url(#ev-door)" stroke="#0a0e14" strokeWidth="1.5" />
              <rect x="580" y="220" width="6" height="290" fill="#c8d4e2" opacity="0.25" />
              <rect x="506" y="350" width="8" height="40" fill="#c8a848" stroke="#3a2010" strokeWidth="0.8" />
              {tags.has("jorge") && (
                <g style={tagStyle("jorge")} filter="url(#ev-spray)" transform="rotate(3 558 456)">
                  <text x="558" y="448" textAnchor="middle" fontFamily={SPRAY} fontWeight="900" fontSize="22" fill="#ff6a4a" stroke="#1a0806" strokeWidth="0.8">LIBÉREZ</text>
                  <text x="558" y="476" textAnchor="middle" fontFamily={SPRAY} fontWeight="900" fontSize="24" fill="#ff6a4a" stroke="#1a0806" strokeWidth="0.8">JORGE</text>
                  <Drips x={524} y={479} w={70} color="#ff6a4a" seed={5} />
                </g>
              )}
            </g>
            {/* Seam central (visible seulement quand fermées) */}
            {phase !== "arrived" && (
              <line x1="500" y1="208" x2="500" y2="528" stroke="#0a0e14" strokeWidth="2" />
            )}
          </g>

          {/* TICKER LED au-dessus des portes (indicateur d'étage) */}
          <g transform="translate(500,140)">
            <rect x="-140" y="-40" width="280" height="70" fill="#0a0806" stroke="#5eff9e" strokeWidth="3" rx="6" />
            <text x="-130" y="-22" fontFamily="ui-monospace,monospace" fontSize="11" fill="#5eff9e" letterSpacing="4">ÉTAGE</text>
            <text x="0" y="18" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="46" fontWeight="900"
              fill={isGlitch ? "#e83820" : (displayLvl?.color || "#5eff9e")} letterSpacing="6"
              style={{ filter: `drop-shadow(0 0 8px ${isGlitch ? "#e83820" : (displayLvl?.color || "#5eff9e")})` }}>
              {isGlitch ? (
                <>
                  ?!?
                  <animate attributeName="opacity" values="1;0;1;0.4;0.9;0" dur="1.6s" repeatCount="1" fill="freeze" />
                </>
              ) : (displayLvl?.id || "?")}
            </text>
            {/* Voyant STATION / MARCHE */}
            <g transform="translate(120,-24)">
              <circle r="6" fill="#0a0806" stroke="#3a4048" strokeWidth="0.8" />
              <circle r="3" fill={isMoving ? "#ff5030" : "#5eff9e"}>
                <animate attributeName="opacity" values="0.5;1;0.5" dur={isMoving ? "0.4s" : "1.6s"} repeatCount="indefinite" />
              </circle>
            </g>
            {/* Flèche direction quand en mouvement */}
            {isMoving && (() => {
              const idxTarget = LEVELS.findIndex((l) => l.id === target.id);
              const idxCur = LEVELS.findIndex((l) => l.id === currentLvl);
              const goingDown = idxTarget > idxCur;
              return (
                <path d={goingDown ? "M96 -8 L128 -8 L112 24 Z" : "M96 12 L128 12 L112 -18 Z"} fill="#ff5030">
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="0.5s" repeatCount="indefinite" />
                </path>
              );
            })()}
          </g>
          {/* Petite plaque du nom d'étage sous le ticker */}
          <g transform="translate(500,196)">
            <rect x="-120" y="-10" width="240" height="20" fill="#141c26" stroke="#3a4048" strokeWidth="1" />
            <text x="0" y="4" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="11" fill="#c8d4e2" letterSpacing="4">
              {(displayLvl?.name || "").toUpperCase()}
            </text>
          </g>

          {/* MIROIR mural gauche */}
          <g>
            <rect x="80" y="220" width="230" height="290" fill="#0a0e14" stroke="#5a6270" strokeWidth="4" />
            <rect x="88" y="228" width="214" height="274" fill="url(#ev-mirror)" opacity="0.85" />
            {/* Reflet oblique */}
            <path d="M100 240 L120 240 L280 480 L260 480 Z" fill="#e8eef5" opacity="0.08" />
            {/* Bordure ornementale */}
            <rect x="86" y="226" width="218" height="278" fill="none" stroke="#3a4048" strokeWidth="1" />
          </g>
          {/* Main courante gauche */}
          <g>
            <rect x="72" y="422" width="248" height="10" fill="#c8a848" stroke="#3a2010" strokeWidth="1.5" rx="4" />
            {/* Deux supports */}
            <rect x="86" y="432" width="10" height="18" fill="#5a4028" stroke="#0a0806" strokeWidth="0.6" />
            <rect x="296" y="432" width="10" height="18" fill="#5a4028" stroke="#0a0806" strokeWidth="0.6" />
          </g>
          {/* Grille de ventilation au-dessus du miroir */}
          <g transform="translate(80,100)">
            <rect x="0" y="0" width="230" height="60" fill="#0a0e14" stroke="#5a6270" strokeWidth="1.5" />
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1="8" y1={10 + i * 10} x2="222" y2={10 + i * 10} stroke="#5a6270" strokeWidth="1.2" />
            ))}
          </g>
          {/* Extincteur au sol à gauche */}
          <g transform="translate(30,470)">
            <rect x="0" y="0" width="34" height="66" fill="#8a1010" stroke="#0a0806" strokeWidth="1.5" rx="4" />
            <rect x="10" y="-5" width="14" height="8" fill="#3a4048" stroke="#0a0806" strokeWidth="0.6" />
            <text x="17" y="40" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fontWeight="800" fill="#fff">FEU</text>
          </g>

          {/* GRAFFITIS — mur au-dessus du tableau : un ancien tag
              recouvert de peinture grise (MARTINE efface), sur lequel
              les Fils du Temps finissent par repeindre leur nom. */}
          <g style={{ pointerEvents: "none" }}>
            <text x="930" y="148" textAnchor="middle" fontFamily={SPRAY} fontWeight="900" fontSize="40" fill="#e8e0d0" opacity={tags.has("fils") ? 0.12 : 0.32} transform="rotate(-3 930 140)">SOUVENEZ-VOUS</text>
            <rect x="712" y="92" width="436" height="80" fill="#4a5058" opacity="0.86" />
            {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={716 + i * 72} y="94" width="64" height="76" fill="#5a6068" opacity={0.18 + (i % 3) * 0.06} />)}
            {tags.has("fils") && (
              <g style={tagStyle("fils")} filter="url(#ev-spray)" transform="rotate(-2 930 132)">
                <Sigil x={752} y={130} s={1.5} color="#ff8a3a" />
                <text x="950" y="124" textAnchor="middle" fontFamily={SPRAY} fontWeight="900" fontSize="30" fill="#ff8a3a" stroke="#1a0c04" strokeWidth="1" letterSpacing="1">LES FILS DU TEMPS</text>
                <text x="950" y="158" textAnchor="middle" fontFamily={SPRAY} fontWeight="900" fontSize="24" fill="#ff8a3a" stroke="#1a0c04" strokeWidth="1" letterSpacing="2">SE SOUVIENNENT</text>
                <Drips x={830} y={162} w={240} color="#ff8a3a" seed={2} />
              </g>
            )}
            {tags.has("qui") && (
              <g style={tagStyle("qui")} transform="rotate(-7 196 300)">
                <text x="196" y="300" textAnchor="middle" fontFamily={MARKER} fontWeight="700" fontSize="28" fill="#f0ece0" opacity="0.88">QUI L'A ÉCRIT ?</text>
                <Sigil x={196} y={334} s={0.9} color="#f0ece0" />
              </g>
            )}
            {tags.has("lea") && (
              <g style={tagStyle("lea")} filter="url(#ev-spray)" transform="rotate(-1.5 196 196)">
                <text x="196" y="206" textAnchor="middle" fontFamily={SPRAY} fontWeight="900" fontSize="27" fill="#7fe8c8" stroke="#06140e" strokeWidth="0.9" letterSpacing="1">LÉA AVAIT RAISON</text>
                <Sigil x={350} y={194} s={0.8} color="#7fe8c8" />
              </g>
            )}
          </g>

          {/* PANNEAU DE COMMANDE monté sur mur droit */}
          <g transform="translate(700,180)">
            {/* Cadre acier brossé */}
            <rect x="0" y="0" width="450" height="360" fill="url(#ev-panel)" stroke="#0a0e14" strokeWidth="6" rx="14" />
            {/* Rivets aux 4 coins */}
            {[[18, 18], [432, 18], [18, 342], [432, 342]].map(([rx, ry], i) => (
              <g key={i} transform={`translate(${rx},${ry})`}>
                <circle r="8" fill="#141c26" stroke="#5a6270" strokeWidth="1" />
                <circle r="3" fill="#5a6270" />
              </g>
            ))}
            {/* Intérieur foncé */}
            <rect x="14" y="14" width="422" height="332" fill="#141c26" stroke="#3a4048" strokeWidth="1.5" rx="10" />
            {/* Label du panneau */}
            <text x="225" y="34" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fill="#c8d4e2" letterSpacing="6">SÉLECTION D'ÉTAGE</text>

            {/* GRILLE 3 × 2 boutons d'étage (K exclu : trop discret pour la
                grille principale, voir petit bouton séparé plus bas). */}
            <g transform="translate(28,50)">
              {LEVELS.filter((lvl) => isLevelVisible(lvl, j3.flags) && lvl.id !== "K").map((lvl, i) => {
                const unlocked = isLevelUnlocked(lvl.id, j3.flags);
                const here = lvl.id === currentLvl;
                const col = i % 2;
                const row = Math.floor(i / 2);
                const bx = col * 200;
                const by = row * 92;
                return (
                  <g key={lvl.id} transform={`translate(${bx},${by})`}
                    onClick={unlocked ? () => go(lvl) : undefined}
                    style={{ cursor: unlocked ? "pointer" : "not-allowed" }}
                    onMouseEnter={(e) => unlocked && e.currentTarget.querySelector(".hov").setAttribute("opacity", "1")}
                    onMouseLeave={(e) => e.currentTarget.querySelector(".hov").setAttribute("opacity", "0")}>
                    <rect className="hov" x="-4" y="-4" width="196" height="84" fill="none" stroke={lvl.color} strokeWidth="2.5" opacity="0" rx="10" />
                    <rect x="0" y="0" width="188" height="76"
                      fill={here ? lvl.color : "#0a0e14"}
                      stroke={unlocked ? lvl.color : "#3a4048"}
                      strokeWidth="3" rx="8" opacity={unlocked ? 1 : 0.5} />
                    <text x="24" y="54" fontFamily="ui-monospace,monospace" fontSize="34" fontWeight="900"
                      fill={here ? "#0a0806" : lvl.color} letterSpacing="2">{lvl.id}</text>
                    <text x="72" y="38" fontFamily="ui-monospace,monospace" fontSize="12" fontWeight="700"
                      fill={here ? "#0a0806" : "#e8eef5"} letterSpacing="2">
                      {lvl.name.toUpperCase()}
                    </text>
                    <text x="72" y="56" fontFamily="ui-monospace,monospace" fontSize="9"
                      fill={here ? "#0a0806" : "#7a879e"} letterSpacing="1">
                      {here ? "• ICI" : (unlocked ? "" : "🔒")}
                    </text>
                    {/* Voyant */}
                    <circle cx="166" cy="38" r="6.5" fill="#0a0806" stroke="#3a4048" strokeWidth="0.8" />
                    <circle cx="166" cy="38" r="3.2" fill={here ? "#0a0806" : (unlocked ? lvl.color : "#3a4048")}>
                      {here && <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" />}
                    </circle>
                  </g>
                );
              })}
            </g>

            {/* Poignée STOP en bas du panneau */}
            <g transform="translate(225,326)">
              <rect x="-90" y="-14" width="180" height="34" fill="#8a1010" stroke="#0a0806" strokeWidth="2" rx="6" />
              <rect x="-52" y="-8" width="104" height="22" fill="#e83820" stroke="#3a0000" strokeWidth="1.5" rx="3" />
              <text x="0" y="8" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="14" fontWeight="900" fill="#fff" letterSpacing="4">STOP</text>
            </g>

            {/* Petit bouton rond CACHÉ à droite du STOP, sans inscription.
                Jorge dit en cellule qu'il faut 5 appuis pour l'activer.
                Les 4 premiers clics émettent un bip et allument un
                voyant partiel ; au 5e, l'étage K devient accessible et
                le voyage se lance au prochain clic. */}
            {isLevelUnlocked("K", j3.flags) && (() => {
              const lvlK = LEVELS.find((l) => l.id === "K");
              if (!lvlK) return null;
              const here = currentLvl === "K";
              /* Une fois la Salle K visitée au moins une fois, le bouton
                 devient classique : un seul clic suffit. Sinon il faut
                 5 appuis d'affilée pour l'activer. */
              const learned = !!j3?.flags?.salle_k_vue;
              const activated = learned || kTaps >= K_TAPS_NEEDED;
              const onTap = () => {
                if (activated || here) { go(lvlK); return; }
                const next = kTaps + 1;
                beep(300 + next * 90, 0.09);
                setKTaps(next);
                /* Code triche : au 5e tap, on débloque aussi le médiadex
                   (sinon Jorge force à aller le chercher d'abord). */
                if (next >= K_TAPS_NEEDED && !j3?.flags?.mediadex_retrouve) {
                  j3?.setFlag?.("mediadex_retrouve", true);
                }
              };
              return (
                <g transform="translate(430,338)"
                  onClick={onTap}
                  style={{ cursor: "pointer" }}>
                  <circle r="14" fill="transparent" />
                  {/* Minuscule bouton discret, pas de texte */}
                  <circle r="4.5"
                    fill={activated ? lvlK.color : "#1a2028"}
                    stroke={activated ? lvlK.color : "#3a4048"}
                    strokeWidth="1" />
                  {/* Arc partiel qui se remplit à chaque clic (0..5) */}
                  {!activated && kTaps > 0 && (
                    <circle r="7" fill="none" stroke={lvlK.color} strokeWidth="1.2"
                      strokeDasharray={`${(kTaps / K_TAPS_NEEDED) * 44} 44`}
                      transform="rotate(-90)"
                      opacity="0.7" />
                  )}
                  {activated && (
                    <circle r="7" fill="none" stroke={lvlK.color} strokeWidth="1.2">
                      <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" />
                    </circle>
                  )}
                </g>
              );
            })()}
          </g>

          {/* Numéro de cabine sur le seuil */}
          <g transform="translate(500,588)">
            <rect x="-56" y="-11" width="112" height="22" fill="#e8dfc8" stroke="#3a2818" strokeWidth="1" />
            <text x="0" y="4" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="11" fontWeight="900" fill="#0a0806" letterSpacing="2">CAB · A-3</text>
          </g>
        </g>

        <style>{`
          @keyframes evShake { 0%,100% { transform: translate(0,0); } 50% { transform: translate(0,1.2px); } }
          @keyframes evShakeHard { 0% { transform: translate(-1.4px,-2px); } 25% { transform: translate(1.6px,1.5px); } 50% { transform: translate(-1px,2.2px); } 75% { transform: translate(2px,-1.5px); } 100% { transform: translate(0,0); } }
          @keyframes evJolt { 0% { transform: translate(0,0); } 15% { transform: translate(0,-6px) rotate(-0.3deg); } 30% { transform: translate(0,4px) rotate(0.4deg); } 50% { transform: translate(2px,-2px); } 70% { transform: translate(-2px,3px) rotate(-0.2deg); } 100% { transform: translate(0,0); } }
          @keyframes evDoorL { from { transform: translate(0,0); } to { transform: translate(-116px,0); } }
          @keyframes evDoorR { from { transform: translate(0,0); } to { transform: translate(116px,0); } }
          @keyframes evTagIn { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
      </svg>

      {phase === "arrived" && (
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 3, color: "#5eff9e" }}>
          ✓ ARRIVÉE À L'ÉTAGE {target.id} — {target.name.toUpperCase()}
        </div>
      )}
      {phase === "idle" && lastNew && (
        <p style={{ margin: 0, maxWidth: 760, fontSize: 13, color: "#e8dfc8", textAlign: "center", fontStyle: "italic", fontFamily: "Palatino, Georgia, serif" }}>
          {lastNew.caption}
        </p>
      )}
      {phase === "idle" && (
        <p style={{ margin: 0, fontSize: 11, color: "#7a879e", textAlign: "center", fontStyle: "italic" }}>
          Clique un étage sur le tableau, ou utilise la mini-carte à gauche.
        </p>
      )}
    </div>
  );
}
