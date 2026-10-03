import { useEffect, useMemo, useRef, useState } from "react";

/* ============================================================
   EASTER EGG : mini-Pac-Man JOUABLE sur la borne d'arcade de la
   chambre 1985. On clique sur l'écran de la borne, une modal
   plein format s'ouvre avec un vrai mini-jeu : flèches du
   clavier (ou boutons tactiles) pour déplacer Pac-Man, un
   fantôme patrouille, on mange les pastilles. Score, victoire,
   défaite. Esc ou clic sur « REFERMER » pour sortir.
   ============================================================ */

/* Labyrinthe 15×11 — # mur, . pastille, o power-pill,
   P départ pac, G départ fantôme, espace = couloir vide. */
const MAZE_RAW = [
  "###############",
  "#o...........o#",
  "#.####.#.####.#",
  "#.............#",
  "#.##.##.##.##.#",
  "#....#.G.#....#",
  "#.##.#####.##.#",
  "#.............#",
  "#.####.#.####.#",
  "#o....P......o#",
  "###############",
];

const COLS = MAZE_RAW[0].length;
const ROWS = MAZE_RAW.length;
const CELL = 22;
const W = COLS * CELL;
const H = ROWS * CELL;

const DIRS = {
  ArrowUp:    [0, -1],
  ArrowDown:  [0, 1],
  ArrowLeft:  [-1, 0],
  ArrowRight: [1, 0],
};

function parseMaze() {
  const walls = [];
  const pellets = new Set();
  const powers = new Set();
  let pac = [1, 1];
  let ghost = [1, 1];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const c = MAZE_RAW[y][x];
      if (c === "#") walls.push([x, y]);
      else if (c === ".") pellets.add(`${x},${y}`);
      else if (c === "o") powers.add(`${x},${y}`);
      else if (c === "P") pac = [x, y];
      else if (c === "G") ghost = [x, y];
    }
  }
  return { walls, pellets, powers, pac, ghost };
}

function isWall(x, y) {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return true;
  return MAZE_RAW[y][x] === "#";
}

export default function PacManEgg({ onClose }) {
  const initial = useMemo(parseMaze, []);
  const [pac, setPac] = useState(initial.pac);
  const [ghost, setGhost] = useState(initial.ghost);
  const [pellets, setPellets] = useState(initial.pellets);
  const [powers, setPowers] = useState(initial.powers);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("playing"); // playing | won | lost
  const [dir, setDir] = useState([0, 0]);
  const [nextDir, setNextDir] = useState([0, 0]);
  const [frightened, setFrightened] = useState(0); // ticks restants

  const pacRef = useRef(pac);
  const dirRef = useRef(dir);
  const nextDirRef = useRef(nextDir);
  const ghostRef = useRef(ghost);
  const statusRef = useRef(status);
  const pelletsRef = useRef(pellets);
  const powersRef = useRef(powers);
  const frightenedRef = useRef(0);
  pacRef.current = pac;
  dirRef.current = dir;
  nextDirRef.current = nextDir;
  ghostRef.current = ghost;
  statusRef.current = status;
  pelletsRef.current = pellets;
  powersRef.current = powers;
  frightenedRef.current = frightened;

  /* Touches clavier */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { onClose(); return; }
      const d = DIRS[e.key];
      if (d) {
        e.preventDefault();
        setNextDir(d);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* Boucle de jeu : un tick toutes les 180ms */
  useEffect(() => {
    const id = setInterval(() => {
      if (statusRef.current !== "playing") return;

      /* Pac-Man : essaie la direction demandée, sinon continue tout droit */
      let [px, py] = pacRef.current;
      const [ndx, ndy] = nextDirRef.current;
      let [dx, dy] = dirRef.current;
      if ((ndx || ndy) && !isWall(px + ndx, py + ndy)) {
        dx = ndx; dy = ndy;
        setDir([ndx, ndy]);
      }
      if ((dx || dy) && !isWall(px + dx, py + dy)) {
        px += dx; py += dy;
        setPac([px, py]);
      }

      /* Avale pastilles / power-pills */
      const key = `${px},${py}`;
      if (pelletsRef.current.has(key)) {
        const n = new Set(pelletsRef.current);
        n.delete(key);
        setPellets(n);
        setScore((s) => s + 10);
      }
      if (powersRef.current.has(key)) {
        const n = new Set(powersRef.current);
        n.delete(key);
        setPowers(n);
        setScore((s) => s + 50);
        setFrightened(30); // ~5.4s à 180ms
      }

      /* Fantôme : chasse Pac-Man (ou fuit si frightened) */
      let [gx, gy] = ghostRef.current;
      const choices = [[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b]) => !isWall(gx+a, gy+b));
      if (choices.length) {
        const scored = choices.map(([a, b]) => {
          const nx = gx + a, ny = gy + b;
          const dist = Math.abs(nx - px) + Math.abs(ny - py);
          const jitter = Math.random() * 1.4;
          return { a, b, score: frightenedRef.current > 0 ? -dist + jitter : dist + jitter };
        });
        scored.sort((u, v) => u.score - v.score);
        const [a, b] = [scored[0].a, scored[0].b];
        gx += a; gy += b;
        setGhost([gx, gy]);
      }

      /* Collision Pac/Fantôme */
      if (gx === px && gy === py) {
        if (frightenedRef.current > 0) {
          /* on mange le fantôme : il repart au centre */
          setGhost([7, 5]);
          setScore((s) => s + 200);
          setFrightened(0);
        } else {
          setStatus("lost");
        }
      }

      if (frightenedRef.current > 0) setFrightened((f) => f - 1);

      /* Victoire */
      if (pelletsRef.current.size === 0 && powersRef.current.size === 0) {
        setStatus("won");
      }
    }, 180);
    return () => clearInterval(id);
  }, []);

  /* Bouche de Pac-Man qui s'ouvre/ferme */
  const [chomp, setChomp] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setChomp((c) => !c), 160);
    return () => clearInterval(id);
  }, []);

  function restart() {
    const m = parseMaze();
    setPac(m.pac); setGhost(m.ghost);
    setPellets(m.pellets); setPowers(m.powers);
    setScore(0); setStatus("playing");
    setDir([0, 0]); setNextDir([0, 0]);
    setFrightened(0);
  }

  /* Angle de Pac en fonction de la direction */
  const dirAngle = dir[0] === 1 ? 0 : dir[0] === -1 ? 180 : dir[1] === 1 ? 90 : dir[1] === -1 ? 270 : 0;
  const mouth = chomp ? 10 : 42;

  function tap(dx, dy) { setNextDir([dx, dy]); }

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 250, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, cursor: "pointer", fontFamily: "ui-monospace, monospace" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 520, width: "100%", background: "#000", border: "6px solid #c8a848", borderRadius: 14, padding: "18px 18px 14px", boxShadow: "0 0 60px rgba(255,209,102,0.25)" }}>
        {/* En-tête */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "#c8a848" }}>ARCADE · PAC·80</div>
          <button onClick={onClose}
            style={{ background: "#c8a848", color: "#1a0e08", border: "none", borderRadius: 4, padding: "4px 10px", fontFamily: "ui-monospace,monospace", fontSize: 10, fontWeight: 800, cursor: "pointer", letterSpacing: 1 }}>
            REFERMER ✕
          </button>
        </div>

        {/* Score */}
        <div style={{ display: "flex", justifyContent: "space-between", color: "#ffd700", fontSize: 12, fontWeight: 800, marginBottom: 6, letterSpacing: 2 }}>
          <span>1UP · {String(score).padStart(4, "0")}</span>
          <span style={{ color: "#e83820" }}>HIGH · 7650</span>
        </div>

        {/* Écran arcade */}
        <div style={{ background: "#000", border: "2px solid #c8a848", borderRadius: 6, padding: 6 }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ display: "block", width: "100%", height: "auto", background: "#000" }}>
            {/* Murs */}
            {MAZE_RAW.map((row, y) => row.split("").map((c, x) => c === "#" ? (
              <rect key={`w-${x}-${y}`} x={x * CELL} y={y * CELL} width={CELL} height={CELL} fill="#1e40ff" stroke="#3a60ff" strokeWidth="1" rx="2" />
            ) : null))}

            {/* Pastilles */}
            {[...pellets].map((k) => {
              const [x, y] = k.split(",").map(Number);
              return <circle key={`p-${k}`} cx={x * CELL + CELL / 2} cy={y * CELL + CELL / 2} r="2.4" fill="#ffe8a0" />;
            })}

            {/* Power-pills */}
            {[...powers].map((k) => {
              const [x, y] = k.split(",").map(Number);
              return (
                <circle key={`o-${k}`} cx={x * CELL + CELL / 2} cy={y * CELL + CELL / 2} r="5.5" fill="#ffe8a0">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="0.5s" repeatCount="indefinite" />
                </circle>
              );
            })}

            {/* Pac-Man */}
            <g transform={`translate(${pac[0] * CELL + CELL / 2},${pac[1] * CELL + CELL / 2}) rotate(${dirAngle})`}>
              <path d={`M 0 0 L ${CELL / 2 - 2} -${mouth / 4} A ${CELL / 2 - 2} ${CELL / 2 - 2} 0 1 0 ${CELL / 2 - 2} ${mouth / 4} Z`} fill="#ffd700" />
            </g>

            {/* Fantôme */}
            <g transform={`translate(${ghost[0] * CELL + CELL / 2 - 9},${ghost[1] * CELL + CELL / 2 - 10})`}>
              <path d="M0 4 Q0 -10 9 -10 Q18 -10 18 4 L18 14 L15 11 L12 14 L9 11 L6 14 L3 11 L0 14 Z"
                fill={frightened > 0 ? (frightened < 8 ? "#ffffff" : "#1e40ff") : "#e83820"} />
              <circle cx="6" cy="2" r="2.6" fill="#fff" />
              <circle cx="12" cy="2" r="2.6" fill="#fff" />
              <circle cx={6 + (pac[0] > ghost[0] ? 1 : pac[0] < ghost[0] ? -1 : 0)} cy={2 + (pac[1] > ghost[1] ? 1 : pac[1] < ghost[1] ? -1 : 0)} r="1.3" fill="#1a1a1a" />
              <circle cx={12 + (pac[0] > ghost[0] ? 1 : pac[0] < ghost[0] ? -1 : 0)} cy={2 + (pac[1] > ghost[1] ? 1 : pac[1] < ghost[1] ? -1 : 0)} r="1.3" fill="#1a1a1a" />
            </g>

            {/* Overlay fin de partie */}
            {status !== "playing" && (
              <g>
                <rect x="0" y="0" width={W} height={H} fill="#000" opacity="0.7" />
                <text x={W / 2} y={H / 2 - 10} textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="22" fontWeight="800"
                  fill={status === "won" ? "#5eff9e" : "#e83820"}>
                  {status === "won" ? "YOU WIN !" : "GAME OVER"}
                </text>
                <text x={W / 2} y={H / 2 + 14} textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fill="#ffd700" letterSpacing="2">
                  SCORE {String(score).padStart(4, "0")}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Commandes tactiles + rejouer */}
        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 36px)", gridTemplateRows: "repeat(3, 36px)", gap: 3 }}>
            <div />
            <button onClick={() => tap(0, -1)} style={padBtn}>▲</button>
            <div />
            <button onClick={() => tap(-1, 0)} style={padBtn}>◀</button>
            <div />
            <button onClick={() => tap(1, 0)} style={padBtn}>▶</button>
            <div />
            <button onClick={() => tap(0, 1)} style={padBtn}>▼</button>
            <div />
          </div>
          <div style={{ textAlign: "right", fontSize: 10, color: "#8a7a4a", letterSpacing: 1 }}>
            <div>FLÈCHES = BOUGER</div>
            <div>ÉCHAP = QUITTER</div>
            {status !== "playing" && (
              <button onClick={restart} style={{ marginTop: 6, background: "#c8a848", color: "#1a0e08", border: "none", borderRadius: 4, padding: "4px 10px", fontFamily: "ui-monospace,monospace", fontSize: 10, fontWeight: 800, cursor: "pointer", letterSpacing: 1 }}>
                REJOUER
              </button>
            )}
          </div>
        </div>

        <div style={{ marginTop: 8, textAlign: "center", fontSize: 10, color: "#8a7a4a", fontStyle: "italic", letterSpacing: 1 }}>
          « Trois pièces de 1 franc dans la fente — et voilà. »
        </div>
      </div>
    </div>
  );
}

const padBtn = {
  background: "#1a1a24",
  color: "#ffd700",
  border: "1px solid #c8a848",
  borderRadius: 4,
  fontFamily: "ui-monospace,monospace",
  fontSize: 16,
  fontWeight: 800,
  cursor: "pointer",
};
