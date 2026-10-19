/* ============================================================
   JEU 3 — Kit de décor du bunker (salles 1000 × 520)
   ------------------------------------------------------------
   Briques communes à toutes les salles, déterministes :
     ConcretePanels — béton coffré : joints, boulons, coulures
                      de rouille et d'humidité, grain
     CeilingPipes   — tuyaux et chemin de câbles au plafond
     PerspFloor     — joints du sol en perspective + reflet
     WallVent       — grille d'aération (ventilateur qui tourne)
     Caution        — bande jaune et noire
     Vignette       — coins assombris (à poser en fin de décor)
   ============================================================ */
import { rng } from "../../engine/scenery.jsx";

export function ConcretePanels({ x0 = 0, x1 = 1000, y0, y1, w = 125, seed = 1, joint = "#0c1016", bolt = "#3a4250", stain = "#3a2a1a", opacity = 1 }) {
  const r = rng(seed);
  const cols = Math.ceil((x1 - x0) / w);
  const mid = y0 + (y1 - y0) * 0.5;
  return (
    <g opacity={opacity}>
      {/* teintes légèrement différentes d'un panneau à l'autre */}
      {Array.from({ length: cols }).map((_, i) => (
        <rect key={`t${i}`} x={x0 + i * w} y={y0} width={w} height={y1 - y0} fill={r() < 0.5 ? "#ffffff" : "#000000"} opacity={0.015 + r() * 0.03} />
      ))}
      {Array.from({ length: cols + 1 }).map((_, i) => <path key={`v${i}`} d={`M${x0 + i * w} ${y0} V${y1}`} stroke={joint} strokeWidth="2" opacity="0.7" />)}
      <path d={`M${x0} ${mid} H${x1}`} stroke={joint} strokeWidth="1.4" opacity="0.5" />
      {/* boulons d'ancrage (trous de banches) */}
      {Array.from({ length: cols }).map((_, i) => [0.22, 0.78].map((f) => [0.25, 0.75].map((g) => (
        <circle key={`b${i}-${f}-${g}`} cx={x0 + i * w + w * f} cy={y0 + (y1 - y0) * g} r="2.2" fill={joint} stroke={bolt} strokeWidth="0.8" opacity="0.8" />
      ))))}
      {/* coulures sous certains boulons */}
      {Array.from({ length: cols }).map((_, i) => r() < 0.55 && (
        <path key={`s${i}`} d={`M${x0 + i * w + w * (0.2 + r() * 0.6)} ${y0 + (y1 - y0) * 0.27} q${(r() - 0.5) * 6} ${20 + r() * 40} ${(r() - 0.5) * 4} ${50 + r() * 60}`}
          stroke={stain} strokeWidth={2 + r() * 3} strokeLinecap="round" opacity={0.18 + r() * 0.18} fill="none" />
      ))}
      {/* grain du béton */}
      {Array.from({ length: Math.floor((x1 - x0) * (y1 - y0) / 1800) }).map((_, i) => (
        <circle key={`g${i}`} cx={(x0 + r() * (x1 - x0)).toFixed(0)} cy={(y0 + r() * (y1 - y0)).toFixed(0)} r={(0.5 + r() * 1.2).toFixed(1)} fill={r() < 0.5 ? "#000" : "#fff"} opacity={(0.06 + r() * 0.08).toFixed(2)} />
      ))}
    </g>
  );
}

export function CeilingPipes({ y = 30, x0 = -20, x1 = 1020, seed = 3, tint = "#4a5462", cables = true }) {
  const r = rng(seed);
  return (
    <g>
      {[0, 1].map((k) => (
        <g key={k}>
          <rect x={x0} y={y + k * 12} width={x1 - x0} height={8 - k * 2} rx="3" fill={tint} opacity={0.9 - k * 0.2} />
          <rect x={x0} y={y + k * 12} width={x1 - x0} height="2" fill="#ffffff" opacity="0.12" />
          {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={x0 + 60 + i * 120 + k * 40} y={y + k * 12 - 2} width="7" height={12 - k * 2} fill="#2a303a" />)}
        </g>
      ))}
      {/* vanne et boîte de dérivation */}
      <g transform={`translate(${x0 + 180 + r() * 500},${y + 4})`}>
        <circle r="7" fill="none" stroke="#a83a2a" strokeWidth="2.4" /><path d="M-7 0 h14 M0 -7 v14" stroke="#a83a2a" strokeWidth="1.6" />
      </g>
      {cables && [0, 1, 2].map((k) => {
        const a = x0 + 40 + k * 340, b = a + 300;
        return <path key={`c${k}`} d={`M${a} ${y + 22} Q${(a + b) / 2} ${y + 40 + r() * 16} ${b} ${y + 22}`} stroke={["#1a1a1e", "#5a2a20", "#2a3a5a"][k]} strokeWidth="2" fill="none" opacity="0.8" />;
      })}
    </g>
  );
}

export function PerspFloor({ y0, y1 = 520, vx = 500, step = 90, rows = 4, joint = "#000000", opacity = 0.35, sheen = "#ffffff" }) {
  const n = Math.ceil(2400 / step);
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const x = -700 + i * step;
        return <path key={i} d={`M${(vx + (x - vx) * 0.55).toFixed(1)} ${y0} L${x} ${y1}`} stroke={joint} strokeWidth="1.1" opacity={opacity} />;
      })}
      {Array.from({ length: rows }).map((_, k) => {
        const t = (k + 1) / (rows + 1), y = y0 + (y1 - y0) * t * t;
        return <path key={`h${k}`} d={`M0 ${y.toFixed(1)} H1000`} stroke={joint} strokeWidth="1" opacity={opacity * 0.9} />;
      })}
      <ellipse cx={vx} cy={y0 + (y1 - y0) * 0.35} rx="360" ry={(y1 - y0) * 0.2} fill={sheen} opacity="0.04" />
    </g>
  );
}

export function WallVent({ x, y, w = 70, h = 44, spin = true }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="3" fill="#0e1218" stroke="#4a5462" strokeWidth="1.6" />
      <g>
        {spin && <animateTransform attributeName="transform" type="rotate" values="0;360" dur="3s" repeatCount="indefinite" />}
        {[0, 60, 120].map((a) => <path key={a} d={`M0 0 L${(Math.min(w, h) * 0.4).toFixed(0)} -5 L${(Math.min(w, h) * 0.4).toFixed(0)} 5 Z`} fill="#3a4250" transform={`rotate(${a})`} />)}
      </g>
      {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${-w / 2 + 3} ${-h / 2 + 4 + i * ((h - 8) / 5)} h${w - 6}`} stroke="#4a5462" strokeWidth="1.2" opacity="0.8" />)}
    </g>
  );
}

export function Caution({ x, y, w, h = 8, id = "cau" }) {
  return (
    <g>
      <defs>
        <pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="12" fill="#e8b830" /><rect x="6" width="6" height="12" fill="#141410" />
        </pattern>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} opacity="0.85" />
    </g>
  );
}

export function Vignette({ id = "vig", w = 1000, h = 520, strength = 0.5 }) {
  return (
    <g style={{ pointerEvents: "none" }}>
      <defs>
        <radialGradient id={id} cx="50%" cy="45%" r="75%">
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity={strength} />
        </radialGradient>
      </defs>
      <rect width={w} height={h} fill={`url(#${id})`} />
    </g>
  );
}
