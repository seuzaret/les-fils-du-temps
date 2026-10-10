import { LEVELS as ALL_LEVELS, ROOM_TO_LEVEL, isLevelUnlocked, isLevelVisible } from "./levels.js";

/* ============================================================
   JEU 3 — Mini-carte latérale du bunker (coupe verticale)
   ------------------------------------------------------------
   Vraie coupe architecturale : surface (ciel étoilé, ruines
   silhouettées, ligne de terrain), roche stratifiée qui se
   fonce en descendant, cage d'ascenseur verticale traversant
   tous les niveaux, chaque étage avec ses petites pièces
   dessinées et des icônes de métier. Le joueur est signalé par
   un point clignotant. Cliquable — chaque étage débloqué renvoie
   vers son mini-hub.
   ============================================================ */
export default function BunkerMinimap({ room, flags, onGo, cheat = false }) {
  const currentLevel = ROOM_TO_LEVEL[room] ?? null;
  /* On n'affiche que les niveaux visibles (K reste masqué tant que
     non débloqué). L'ordre de la liste suit celui de levels.js. */
  const LEVELS = ALL_LEVELS.filter((lvl) => isLevelVisible(lvl, flags));
  /* Hauteurs et positions : la surface est en haut ; les 4 étages
     souterrains descendent. Le -3 est bien plus bas que le -1
     (schema : gap réaliste). K vient en toute dernière position
     avec un gap supplémentaire pour marquer sa singularité. */
  const LEVEL_HEIGHT = 54;
  const GAP = 6;
  const SURFACE_TOP = 34;
  const levelsPos = LEVELS.map((lvl, i) => {
    let y;
    if (lvl.id === "+2") y = SURFACE_TOP;
    else if (lvl.id === "+1") y = SURFACE_TOP + (LEVEL_HEIGHT + GAP);
    else if (lvl.id === "0")  y = SURFACE_TOP + 2 * (LEVEL_HEIGHT + GAP);
    else if (lvl.id === "-1") y = SURFACE_TOP + 3 * (LEVEL_HEIGHT + GAP);
    else if (lvl.id === "-2") y = SURFACE_TOP + 4 * (LEVEL_HEIGHT + GAP);
    else if (lvl.id === "-3") y = SURFACE_TOP + 4 * (LEVEL_HEIGHT + GAP) + 2 * (LEVEL_HEIGHT + GAP);
    else if (lvl.id === "K")  y = SURFACE_TOP + 4 * (LEVEL_HEIGHT + GAP) + 4 * (LEVEL_HEIGHT + GAP);
    else y = SURFACE_TOP + i * (LEVEL_HEIGHT + GAP);
    return { lvl, y };
  });
  const SVG_H = levelsPos[levelsPos.length - 1].y + LEVEL_HEIGHT + 30;
  const SHAFT_X = 70;
  const SHAFT_W = 10;

  /* Icônes de pièces par niveau : simple pastille de couleur + emoji-like
     dessiné dans une petite bulle SVG. On les rend à droite du niveau. */
  const roomIcon = (id) => {
    switch (id) {
      case "surface":    return "☢";
      case "cantine":    return "🍲";
      case "chapelle":   return "✧";
      case "chambre":
      case "chambreN24":
      case "chambreN30":
      case "chambreN32": return "🛏";
      case "rumeurs":    return "💬";
      case "archives":   return "📚";
      case "infirmerie": return "⚕";
      case "atelier":    return "🔧";
      case "prison":     return "⛓";
      case "salleK":     return "⟡";
      case "serres":     return "🌱";
      case "serveurs":   return "◈";
      default:           return "•";
    }
  };

  return (
    <div style={{
      width: 130, flex: "0 0 auto",
      display: "flex", flexDirection: "column",
      padding: "8px 6px", background: "#0a1020", borderRight: "1px solid #1a2536",
      fontFamily: "ui-monospace,monospace",
      overflowY: "auto",
    }}>
      <div style={{ fontSize: 9, letterSpacing: 2, color: "#5a6678", textAlign: "center", marginBottom: 4 }}>
        BUNKER · COUPE
      </div>
      <svg viewBox={`0 0 130 ${SVG_H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          {/* Roche stratifiée : gradient beige → brun foncé en descendant */}
          <linearGradient id="mm-rock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a4028" />
            <stop offset="35%" stopColor="#3a2818" />
            <stop offset="70%" stopColor="#2a1810" />
            <stop offset="100%" stopColor="#0e0806" />
          </linearGradient>
          {/* Ciel nocturne au-dessus de la surface */}
          <linearGradient id="mm-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#050810" />
            <stop offset="100%" stopColor="#1a1a30" />
          </linearGradient>
        </defs>
        {/* CIEL */}
        <rect x="0" y="0" width="130" height={SURFACE_TOP - 4} fill="url(#mm-sky)" />
        {/* Étoiles */}
        {[[15, 8], [45, 12], [70, 6], [95, 14], [110, 9], [25, 20], [85, 22]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 0.9 : 0.6} fill="#e8eef5" opacity={0.55 + (i % 4) * 0.1} />
        ))}
        {/* Petite lune */}
        <circle cx="110" cy="14" r="6" fill="#f0e4c8" opacity="0.75" />
        <circle cx="113" cy="12" r="4" fill="#1a1a30" opacity="0.85" />

        {/* Ligne de terrain avec bâtiments détruits */}
        <path d="M0 30 L10 28 L14 30 L22 20 L26 24 L34 22 L42 30 L52 18 L58 24 L66 30 L74 26 L82 30 L92 22 L100 30 L108 28 L118 30 L130 30 L130 34 L0 34 Z"
          fill="#3a2818" stroke="#0a0806" strokeWidth="0.6" />
        {/* Petites fenêtres allumées dans les ruines */}
        <rect x="50" y="20" width="1.4" height="2" fill="#ffd870" opacity="0.85" />
        <rect x="94" y="24" width="1.4" height="2" fill="#e8a848" opacity="0.7" />

        {/* SOUS-SOL : roche stratifiée du haut jusqu'en bas */}
        <rect x="0" y={SURFACE_TOP} width="130" height={SVG_H - SURFACE_TOP} fill="url(#mm-rock)" />
        {/* Strates horizontales très discrètes (traits foncés) */}
        {[80, 130, 180, 230, 320, 380].map((y, i) => (
          <path key={i} d={`M0 ${y} q40 ${(i % 2 ? 4 : -3)} 130 0`} stroke="#0a0806" strokeWidth="0.5" opacity="0.55" fill="none" />
        ))}

        {/* CAGE D'ASCENSEUR : rail vertical qui traverse tout */}
        <rect x={SHAFT_X - 1} y={SURFACE_TOP} width={SHAFT_W + 2} height={SVG_H - SURFACE_TOP - 20}
          fill="#141c26" stroke="#0a0e14" strokeWidth="0.6" />
        {/* Câbles de l'ascenseur */}
        <line x1={SHAFT_X + 2} y1={SURFACE_TOP} x2={SHAFT_X + 2} y2={SVG_H - 20} stroke="#5a6270" strokeWidth="0.5" opacity="0.7" />
        <line x1={SHAFT_X + SHAFT_W - 2} y1={SURFACE_TOP} x2={SHAFT_X + SHAFT_W - 2} y2={SVG_H - 20} stroke="#5a6270" strokeWidth="0.5" opacity="0.7" />
        {/* Petites lucarnes de la cabine — position figée sur l'étage courant */}
        {(() => {
          const cur = levelsPos.find((lp) => lp.lvl.id === currentLevel);
          if (!cur) return null;
          const cy = cur.y + LEVEL_HEIGHT / 2;
          return (
            <g>
              <rect x={SHAFT_X + 1} y={cy - 6} width={SHAFT_W} height={12} fill="#28303a" stroke="#5eff9e" strokeWidth="0.6" />
              <line x1={SHAFT_X + 1 + SHAFT_W / 2} y1={cy - 6} x2={SHAFT_X + 1 + SHAFT_W / 2} y2={cy + 6} stroke="#5eff9e" strokeWidth="0.4" />
            </g>
          );
        })()}

        {/* NIVEAUX (dessinés APRÈS la roche pour être devant) */}
        {levelsPos.map(({ lvl, y }) => {
          const unlocked = isLevelUnlocked(lvl.id, flags);
          const isHere = currentLevel === lvl.id;
          const canClick = unlocked && (cheat || isHere);
          const roomCount = lvl.rooms.length;
          return (
            <g key={lvl.id}
              onClick={canClick ? () => onGo(lvl.hubRoom) : undefined}
              style={{ cursor: canClick ? "pointer" : "default", opacity: unlocked ? 1 : 0.4 }}>
              {/* Cage béton pour la salle (rectangle plus large que la cage d'ascenseur) */}
              <rect x="10" y={y} width="110" height={LEVEL_HEIGHT}
                fill={isHere ? lvl.color : "#28303a"}
                fillOpacity={isHere ? 0.85 : 1}
                stroke="#0a0e14" strokeWidth="0.6" />
              {/* Petit bandeau intérieur au ton du niveau, même quand pas ici */}
              {!isHere && (
                <rect x="10" y={y} width="110" height="4" fill={lvl.color} opacity="0.65" />
              )}
              {/* Porte d'accès depuis l'ascenseur (petite ouverture) */}
              <rect x={SHAFT_X + SHAFT_W} y={y + LEVEL_HEIGHT / 2 - 5} width="4" height="10"
                fill={isHere ? "#0a0806" : "#141c26"} />
              {/* Étiquette étage (à gauche) */}
              <text x="16" y={y + 14} fontSize="9" fontWeight="900"
                fill={isHere ? "#0a0806" : lvl.color} letterSpacing="1">
                {lvl.id}
              </text>
              <text x="16" y={y + 24} fontSize="5.5" fill={isHere ? "#0a0806" : "#c8d4e2"}>
                {lvl.name.toUpperCase()}
              </text>
              {/* Petites pièces à droite : une case par pièce avec icône */}
              <g>
                {lvl.rooms.map((r, i) => {
                  const rx = 90 + (i % 2) * 12;
                  const ry = y + 8 + Math.floor(i / 2) * 16;
                  return (
                    <g key={r.id}>
                      <rect x={rx} y={ry} width="10" height="12" fill="#0a0e14" stroke={lvl.color} strokeWidth="0.5" opacity="0.85" />
                      <text x={rx + 5} y={ry + 9} textAnchor="middle" fontSize="7" fill={lvl.color}>{roomIcon(r.id)}</text>
                    </g>
                  );
                })}
                {/* Fill vide si moins de 4 pièces (juste esthétique, laisse la place) */}
                {roomCount === 1 && (
                  <text x="96" y={y + 42} fontSize="4.5" fill="#5a6678" opacity="0.7">seule</text>
                )}
              </g>
              {/* Cadenas si verrouillé */}
              {!unlocked && (
                <g transform={`translate(60,${y + LEVEL_HEIGHT - 12})`}>
                  <rect x="-6" y="0" width="12" height="8" fill="#8a7050" stroke="#0a0806" strokeWidth="0.6" />
                  <path d="M-4 0 L-4 -4 Q0 -8 4 -4 L4 0" fill="none" stroke="#8a7050" strokeWidth="1.2" />
                </g>
              )}
              {/* Point du joueur (clignotant) */}
              {isHere && (
                <circle cx="60" cy={y + LEVEL_HEIGHT - 10} r="3" fill="#fff" stroke="#0a0806" strokeWidth="0.6">
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="1.4s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}

        {/* GAP visuel entre -2 et -3 : petite section noire "roche compacte" avec quelques cailloux */}
        {(() => {
          const between = levelsPos[4].y + LEVEL_HEIGHT;
          const nextY = levelsPos[5].y;
          const cx = 40;
          return (
            <g>
              <text x={cx} y={between + (nextY - between) / 2 + 3} textAnchor="middle" fontSize="6" fill="#5a4028" opacity="0.7" letterSpacing="1">
                · · ·
              </text>
              <text x={cx} y={between + (nextY - between) / 2 + 12} textAnchor="middle" fontSize="4" fill="#3a2818" letterSpacing="1">
                roche
              </text>
            </g>
          );
        })()}
      </svg>
      <div style={{ fontSize: 8.5, color: "#5a6678", textAlign: "center", marginTop: 6, lineHeight: 1.4 }}>
        {cheat ? <>🐛 TRICHE ·<br />clique un<br />étage</> : <>Prends<br />l'ascenseur<br />pour te<br />déplacer</>}
      </div>
    </div>
  );
}
