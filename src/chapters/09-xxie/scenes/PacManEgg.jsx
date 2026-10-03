import { useState, useEffect } from "react";

/* ============================================================
   EASTER EGG : Pac-Man dans la chambre de l'ado (jeu 2)
   ------------------------------------------------------------
   Petite console vintage trouvée dans la chambre de l'ado. Un clic
   ouvre une modal plein format avec un labyrinthe Pac-Man miniature
   qui joue tout seul (boucle hypnotique). Rien à gagner — juste un
   clin d'œil nostalgique pour les joueurs qui fouillent.

   Technique : SVG + animations SMIL. Pac-Man suit un circuit fixe,
   un fantôme le poursuit, les points disparaissent, puis tout
   recommence toutes les 12 secondes.
   ============================================================ */

/* Circuit Pac-Man : liste de waypoints (en coordonnées viewBox).
   Pac-Man passe par ces points en boucle. */
const PACMAN_PATH = [
  [60, 60], [340, 60], [340, 120], [60, 120],
  [60, 180], [340, 180], [340, 240], [60, 240],
  [60, 60], // retour au début
];
const GHOST_PATH = [
  [200, 60], [340, 60], [340, 240], [60, 240],
  [60, 120], [340, 120], [340, 180], [60, 180],
  [60, 60], [200, 60],
];

function toSmil(path) {
  return path.map(([x, y]) => `${x},${y}`).join(";");
}

export default function PacManEgg({ onClose }) {
  const [showHigh, setShowHigh] = useState(false);
  /* Clignote le HIGH SCORE à la toute fin pour le fun. */
  useEffect(() => {
    const id = setTimeout(() => setShowHigh(true), 2000);
    return () => clearTimeout(id);
  }, []);

  const pacX = toSmil(PACMAN_PATH.map((p) => [p[0], 0]).map(([x]) => [x])).replace(/,/g, "");
  // (shortcut not useful — SMIL below uses values attributes directly)

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 250, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, cursor: "pointer", fontFamily: "ui-monospace, monospace" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 520, width: "100%", background: "#000", border: "6px solid #c8a848", borderRadius: 14, padding: "22px 20px", boxShadow: "0 0 60px rgba(255,209,102,0.25)" }}>
        {/* En-tête console */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "#c8a848" }}>CONSOLE N-24 · ARCHIVE 1980</div>
          <button onClick={onClose}
            style={{ background: "#c8a848", color: "#1a0e08", border: "none", borderRadius: 4, padding: "4px 10px", fontFamily: "ui-monospace,monospace", fontSize: 10, fontWeight: 800, cursor: "pointer", letterSpacing: 1 }}>
            REFERMER ✕
          </button>
        </div>

        {/* Écran arcade */}
        <div style={{ background: "#000", border: "2px solid #c8a848", borderRadius: 6, padding: 8 }}>
          <svg viewBox="0 0 400 300" style={{ display: "block", width: "100%", height: "auto", background: "#000" }}>
            {/* Cadre labyrinthe */}
            <rect x="20" y="20" width="360" height="260" fill="none" stroke="#1e40ff" strokeWidth="3" rx="4" />
            {/* Couloirs horizontaux */}
            <path d="M20 100 L380 100 M20 160 L380 160 M20 220 L380 220" stroke="#1e40ff" strokeWidth="2" />
            {/* Couloirs verticaux */}
            <path d="M100 20 L100 280 M200 20 L200 280 M300 20 L300 280" stroke="#1e40ff" strokeWidth="2" opacity="0.5" />

            {/* Points à manger */}
            {[
              [80,60],[140,60],[200,60],[260,60],[320,60],
              [80,120],[140,120],[200,120],[260,120],[320,120],
              [80,180],[140,180],[200,180],[260,180],[320,180],
              [80,240],[140,240],[200,240],[260,240],[320,240],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="3" fill="#ffe8a0">
                <animate attributeName="opacity" values="1;1;0" dur="12s"
                  begin={`${(i / 20) * 10}s`} repeatCount="indefinite" />
              </circle>
            ))}

            {/* 4 power-pills clignotantes aux coins */}
            {[[60,60],[340,60],[60,240],[340,240]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="6" fill="#ffe8a0">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="0.5s" repeatCount="indefinite" />
              </circle>
            ))}

            {/* Pac-Man qui parcourt le circuit */}
            <g>
              <animateMotion dur="12s" repeatCount="indefinite"
                path="M 60 60 L 340 60 L 340 120 L 60 120 L 60 180 L 340 180 L 340 240 L 60 240 L 60 60 Z" />
              {/* Corps Pac-Man avec bouche qui mâche */}
              <g>
                <circle r="10" fill="#ffd700" />
                <path d="M0 0 L10 -6 L10 6 Z" fill="#000">
                  <animate attributeName="d" values="M0 0 L10 -6 L10 6 Z;M0 0 L10 -1 L10 1 Z;M0 0 L10 -6 L10 6 Z" dur="0.3s" repeatCount="indefinite" />
                </path>
              </g>
            </g>

            {/* Fantôme rouge qui le poursuit */}
            <g>
              <animateMotion dur="12s" repeatCount="indefinite" begin="0.5s"
                path="M 200 60 L 340 60 L 340 240 L 60 240 L 60 120 L 340 120 L 340 180 L 60 180 L 60 60 L 200 60 Z" />
              <g transform="translate(-9,-10)">
                <path d="M0 2 Q0 -10 9 -10 Q18 -10 18 2 L18 14 L15 11 L12 14 L9 11 L6 14 L3 11 L0 14 Z" fill="#e83820" />
                {/* Yeux */}
                <circle cx="6" cy="2" r="2.4" fill="#fff" />
                <circle cx="12" cy="2" r="2.4" fill="#fff" />
                <circle cx="6" cy="2" r="1.2" fill="#1e40ff">
                  <animate attributeName="cx" values="5;7;5" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="12" cy="2" r="1.2" fill="#1e40ff">
                  <animate attributeName="cx" values="11;13;11" dur="2s" repeatCount="indefinite" />
                </circle>
              </g>
            </g>

            {/* HUD score */}
            <text x="20" y="14" fontFamily="ui-monospace,monospace" fontSize="12" fontWeight="800" fill="#ffd700">1UP · {showHigh ? "7650" : "0000"}</text>
            <text x="200" y="14" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fontWeight="800" fill="#e83820">HIGH SCORE</text>
            <text x="200" y="298" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fontWeight="800" fill="#ffd700" opacity={showHigh ? 1 : 0}>
              <animate attributeName="opacity" values="0;1;0" dur="0.8s" repeatCount="indefinite" />
              GAME OVER
            </text>
          </svg>
        </div>

        <div style={{ marginTop: 10, textAlign: "center", fontSize: 10, color: "#8a7a4a", fontStyle: "italic", letterSpacing: 2 }}>
          « Trouvée au fond d'un tiroir — ça marchait déjà avant tes parents. »
        </div>
      </div>
    </div>
  );
}
