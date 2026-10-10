import { useState, useEffect, useRef } from "react";
import { LEVELS, ROOM_TO_LEVEL, isLevelUnlocked, isLevelVisible } from "../levels.js";

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
   ============================================================ */
export default function BunkerElevator({ onGo, j3 }) {
  const currentLvl = ROOM_TO_LEVEL[j3?.previousRoom] || "0";
  const [phase, setPhase] = useState("idle");
  const [target, setTarget] = useState(null);
  const rafRef = useRef(null);

  const go = (lvl) => {
    if (!isLevelUnlocked(lvl.id, j3.flags)) return;
    if (lvl.id === currentLvl) { onGo(lvl.hubRoom); return; }
    setTarget(lvl);
    setPhase("moving");
  };

  useEffect(() => {
    if (phase !== "moving") return;
    const t = setTimeout(() => setPhase("arrived"), 1500);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "arrived") return;
    const t = setTimeout(() => onGo(target.hubRoom), 1500);
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current); };
  }, [phase, target, onGo]);

  const displayLvl = phase === "arrived" ? target : LEVELS.find((l) => l.id === currentLvl);
  const isMoving = phase === "moving";

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
          <radialGradient id="ev-glow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor={displayLvl?.color || "#5eff9e"} stopOpacity="0.28" />
            <stop offset="100%" stopColor={displayLvl?.color || "#5eff9e"} stopOpacity="0" />
          </radialGradient>
        </defs>

        <g style={isMoving ? { animation: "evShake 0.14s ease-in-out infinite" } : {}}>
          {/* Mur du fond de la cabine */}
          <rect width="1200" height="620" fill="url(#ev-wall)" />
          {/* Lambris verticaux sur tout le mur */}
          {[0, 120, 240, 360, 480, 600, 720, 840, 960, 1080, 1200].map((x, i) => (
            <line key={i} x1={x} y1="80" x2={x} y2="540" stroke="#0a0e14" strokeWidth="0.8" opacity="0.6" />
          ))}

          {/* PLAFOND avec caissons de néons encastrés */}
          <rect x="0" y="0" width="1200" height="80" fill="url(#ev-ceil)" />
          <path d="M0 80 L1200 80" stroke="#0a0e14" strokeWidth="2.5" />
          {/* 3 caissons de néons rectangulaires */}
          {[220, 600, 980].map((x, i) => (
            <g key={i} transform={`translate(${x},40)`}>
              <rect x="-100" y="-24" width="200" height="48" fill="#141c26" stroke="#0a0e14" strokeWidth="2" rx="4" />
              <rect x="-88" y="-16" width="176" height="32" fill="#e8eef5" opacity={isMoving ? 0.55 : 0.92} rx="2">
                {isMoving && <animate attributeName="opacity" values="0.35;0.8;0.35" dur="0.25s" repeatCount="indefinite" />}
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
            </g>
            {/* Panneau droit — glisse vers la droite à l'arrivée */}
            <g style={phase === "arrived" ? { animation: "evDoorR 0.7s ease-out forwards" } : {}}>
              <rect x="500" y="208" width="116" height="320" fill="url(#ev-door)" stroke="#0a0e14" strokeWidth="1.5" />
              <rect x="580" y="220" width="6" height="290" fill="#c8d4e2" opacity="0.25" />
              <rect x="506" y="350" width="8" height="40" fill="#c8a848" stroke="#3a2010" strokeWidth="0.8" />
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
              fill={displayLvl?.color || "#5eff9e"} letterSpacing="6"
              style={{ filter: `drop-shadow(0 0 8px ${displayLvl?.color || "#5eff9e"})` }}>
              {displayLvl?.id || "?"}
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

            {/* Petit bouton K discret, calé entre la grille et le STOP sur
                le côté droit. N'apparaît que si l'étage est déverrouillé. */}
            {(() => {
              const lvlK = LEVELS.find((l) => l.id === "K");
              if (!lvlK || !isLevelUnlocked("K", j3.flags)) return null;
              const here = currentLvl === "K";
              return (
                <g transform="translate(395,326)"
                  onClick={() => go(lvlK)}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => e.currentTarget.querySelector(".k-hov").setAttribute("opacity", "1")}
                  onMouseLeave={(e) => e.currentTarget.querySelector(".k-hov").setAttribute("opacity", "0")}>
                  <circle className="k-hov" r="22" fill="none" stroke={lvlK.color} strokeWidth="1.6" opacity="0" />
                  <circle r="16" fill={here ? lvlK.color : "#0a0e14"} stroke={lvlK.color} strokeWidth="1.8" />
                  <text x="0" y="5" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="16"
                    fontWeight="900" fill={here ? "#0a0806" : lvlK.color} letterSpacing="1">
                    K
                  </text>
                  {!here && (
                    <circle r="20" fill="none" stroke={lvlK.color} strokeWidth="0.6" opacity="0.4">
                      <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
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
          @keyframes evDoorL { from { transform: translate(0,0); } to { transform: translate(-116px,0); } }
          @keyframes evDoorR { from { transform: translate(0,0); } to { transform: translate(116px,0); } }
        `}</style>
      </svg>

      {phase === "arrived" && (
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 3, color: "#5eff9e" }}>
          ✓ ARRIVÉE À L'ÉTAGE {target.id} — {target.name.toUpperCase()}
        </div>
      )}
      {phase === "idle" && (
        <p style={{ margin: 0, fontSize: 11, color: "#7a879e", textAlign: "center", fontStyle: "italic" }}>
          Clique un étage sur le tableau, ou utilise la mini-carte à gauche.
        </p>
      )}
    </div>
  );
}
