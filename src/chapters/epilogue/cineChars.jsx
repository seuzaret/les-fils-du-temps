/* ============================================================
   PERSONNAGES DES CINÉMATIQUES — têtes, bustes, silhouettes
   ------------------------------------------------------------
   Une seule tête pour tout le monde (`Head`) : le visage est une
   ellipse (rx 13, ry 15), et les CHEVEUX comme la BARBE sont des
   arcs de cette même ellipse — rien ne dépasse du contour, la
   barbe affleure la mâchoire, les cheveux affleurent le crâne.
   Deux couches : `HeadBack` (derrière le corps : cheveux longs,
   capuche, tresses…) puis `HeadFront` (visage, barbe, traits,
   mèches de devant). Coordonnées locales : centre du visage = (0,0).

   `Figure` : personnage en pied (origine aux pieds, ≈ 125 de haut).
   `Bust`   : buste (épaules + tête), origine au centre du visage.
   ============================================================ */

const RX = 13, RY = 15;

const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return ((n >> 16) & 255) * 0.3 + ((n >> 8) & 255) * 0.59 + (n & 255) * 0.11; };

const shade = (hex, k = -0.18) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v + 255 * k)));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, "0")).join("")}`;
};

/* ───────── couche arrière : tout ce qui passe derrière le visage/le corps ───────── */
export function HeadBack({ look = "short", hair = "#3a2818", hood = false, hoodColor = "#6a5a8a", back = false }) {
  return (
    <g>
      {hood && <path d="M-17 4 Q-21.5 -25 0 -26.5 Q21.5 -25 17 4 L23 28 Q0 33 -23 28 Z" fill={hoodColor} stroke={shade(hoodColor, -0.25)} strokeWidth="0.7" />}
      {look === "long" && <path d="M-14.4 -7 Q-18.5 14 -14.5 40 Q0 44 14.5 40 Q18.5 14 14.4 -7 Z" fill={hair} />}
      {look === "braids" && (
        <g stroke={hair} strokeWidth="5.4" fill="none" strokeLinecap="round">
          <path d="M-12.6 1 Q-17.5 20 -13.5 42" /><path d="M12.6 1 Q17.5 20 13.5 42" />
          <path d="M-13.5 38 l0 0 M13.5 38 l0 0" stroke="#e86028" strokeWidth="6" />
        </g>
      )}
      {look === "bun" && <circle cx="0" cy="-19" r="7.5" fill={hair} />}
      {look === "curls" && (
        <g fill={hair} stroke={shade(hair, -0.12)} strokeWidth="0.6">
          {[200, 222, 244, 266, 288, 310, 332].map((a, i) => {
            const r = (a * Math.PI) / 180;
            return <circle key={i} cx={(Math.cos(r) * 14.4).toFixed(1)} cy={(Math.sin(r) * 16.4).toFixed(1)} r="6.6" />;
          })}
          <circle cx="-13.6" cy="3" r="5" /><circle cx="13.6" cy="3" r="5" />
        </g>
      )}
      {back && (
        <g>
          <ellipse cx="0" cy="0" rx={RX + 0.8} ry={RY + 0.8} fill={hair} stroke={shade(hair, -0.2)} strokeWidth="0.8" />
          <path d="M-7 -10 Q-8.5 0 -6 10 M0 -12.5 L0 11 M7 -10 Q8.5 0 6 10" stroke={shade(hair, -0.2)} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.7" />
        </g>
      )}
    </g>
  );
}

/* ───────── couche avant : visage, barbe, traits, cheveux de devant ───────── */
export function HeadFront({ skin = "#e0a878", hair = "#3a2818", look = "short", beard = false, mood = "neutre", hood = false, hoodColor = "#6a5a8a", back = false }) {
  if (back) return null;
  const line = shade(skin, -0.42);
  const brows = mood === "vexe"
    ? ["M-8.4 -4.4 Q-5.2 -6.2 -2.2 -7.4", "M8.4 -4.4 Q5.2 -6.2 2.2 -7.4"]
    : mood === "colere"
    ? ["M-8.4 -7.2 Q-5.2 -6.2 -2.2 -4.4", "M8.4 -7.2 Q5.2 -6.2 2.2 -4.4"]
    : ["M-8.4 -5.6 Q-5.2 -7 -2.2 -5.8", "M8.4 -5.6 Q5.2 -7 2.2 -5.8"];
  const mouth = mood === "content" ? "M-4.4 7 Q0 11.6 4.4 7"
    : mood === "vexe" ? "M-3.8 9.8 Q0 7.2 3.8 9.8"
    : mood === "surpris" ? "M-2.2 8 Q0 12 2.2 8 Q0 7 -2.2 8"
    : "M-3.6 8.4 Q0 9.4 3.6 8.4";
  const hairColor = hair;
  const light = lum(hair) > 190;
  return (
    <g>
      {/* oreilles + visage */}
      <ellipse cx={-RX} cy="1" rx="2" ry="3.2" fill={shade(skin, -0.06)} /><ellipse cx={RX} cy="1" rx="2" ry="3.2" fill={shade(skin, -0.06)} />
      <ellipse cx="0" cy="0" rx={RX} ry={RY} fill={skin} stroke={line} strokeWidth="0.7" />
      {/* barbe : région basse de la MÊME ellipse (affleure la mâchoire) + moustache */}
      {beard && (
        <g>
          <path d={`M-12.65 3 A${RX} ${RY} 0 0 0 12.65 3 Q10.6 5.6 6.4 6 Q0 3 -6.4 6 Q-10.6 5.6 -12.65 3 Z`} fill={hair} stroke={shade(hair, -0.12)} strokeWidth="0.35" />
          <path d="M-5 6 Q-2 4.4 0 5.2 Q2 4.4 5 6" stroke={shade(hair, -0.22)} strokeWidth="0.7" fill="none" />
        </g>
      )}
      {/* traits */}
      <path d={brows[0]} stroke={light ? "#b0a89a" : shade(hair, -0.1)} strokeWidth={light ? 1.15 : 1.5} fill="none" strokeLinecap="round" />
      <path d={brows[1]} stroke={light ? "#b0a89a" : shade(hair, -0.1)} strokeWidth={light ? 1.15 : 1.5} fill="none" strokeLinecap="round" />
      <ellipse cx="-5.2" cy="-1.4" rx="1.7" ry={mood === "content" ? 1.0 : 1.6} fill="#1a1008" />
      <ellipse cx="5.2" cy="-1.4" rx="1.7" ry={mood === "content" ? 1.0 : 1.6} fill="#1a1008" />
      <circle cx="-4.6" cy="-2" r="0.6" fill="#fff" opacity="0.8" /><circle cx="5.8" cy="-2" r="0.6" fill="#fff" opacity="0.8" />
      <path d="M0.4 -1 Q2.4 3.2 0 4.4" stroke={line} strokeWidth="0.9" fill="none" strokeLinecap="round" />
      <path d={mouth} stroke={beard ? "#7a3a28" : "#8a3c2a"} strokeWidth="1.3" fill={mood === "content" || mood === "surpris" ? "#7a2a22" : "none"} strokeLinecap="round" />
      {/* cheveux de devant : un arc de l'ellipse du crâne, pas plus large que la tête */}
      {look !== "bald" && !hood && (
        <path d={`M${-RX - 0.3} -1.8 A${RX + 0.3} ${RY + 0.7} 0 0 1 ${RX + 0.3} -1.8 Q8 -4.6 2.6 -9.6 Q-5.6 -6.6 ${-RX - 0.3} -1.8 Z`} fill={hairColor} stroke={shade(hairColor, -0.1)} strokeWidth="0.35" />
      )}
      {/* capuche : bord autour du visage + un peu de frange dessous */}
      {hood && (
        <g>
          <path d={`M${-RX - 0.4} -1 A${RX + 0.4} ${RY + 1.2} 0 0 1 ${RX + 0.4} -1 Q9 -6.4 0 -7.4 Q-9 -6.4 ${-RX - 0.4} -1 Z`} fill={hoodColor} stroke={shade(hoodColor, -0.25)} strokeWidth="0.7" />
          <path d={`M-9.4 -6.6 Q-3 -9.4 1 -7.6 Q5 -9.2 9.4 -6.4 Q4 -4.4 0 -5.6 Q-5 -4.2 -9.4 -6.6 Z`} fill={hair} />
          <path d={`M${-RX - 0.4} -1 Q${-RX - 1.8} 9 -11 16 M${RX + 0.4} -1 Q${RX + 1.8} 9 11 16`} stroke={hoodColor} strokeWidth="3.4" fill="none" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

/* ───────── silhouette en pied ───────── */
const GARMENT = { coat: { hem: -20, w: 25 }, tunic: { hem: -33, w: 23.5 }, jacket: { hem: -47, w: 20.5 } };

function Arm({ side, a1, a2, coat, skin }) {
  const sx = side * 19.5, sy = -84, L1 = 19, L2 = 18;
  const r1 = (a1 * Math.PI) / 180, r2 = (a2 * Math.PI) / 180;
  const ex = sx + side * Math.sin(r1) * L1, ey = sy + Math.cos(r1) * L1;
  const hx = ex + side * Math.sin(r2) * L2, hy = ey + Math.cos(r2) * L2;
  const d = `M${sx} ${sy} L${ex.toFixed(1)} ${ey.toFixed(1)} L${hx.toFixed(1)} ${hy.toFixed(1)}`;
  return (
    <g>
      <path d={d} stroke={shade(coat, -0.28)} strokeWidth="9.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={coat} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={hx.toFixed(1)} cy={(hy + 2.4).toFixed(1)} r="4.4" fill={skin} stroke={shade(skin, -0.3)} strokeWidth="0.6" />
    </g>
  );
}

/* arms : [{ a1, a2 }, { a1, a2 }] — angles depuis la verticale, positifs = vers l'extérieur */
export function Figure({
  x = 0, y = 0, s = 1,
  skin = "#e0a878", hair = "#3a2818", look = "short", beard = false, mood = "neutre",
  coat = "#3a80c8", pants = "#3a2818", shoes = "#1a1410", garment = "jacket",
  hood = false, hoodColor = "#6a5a8a", back = false, cane = false, stride = 0,
  arms = [{ a1: 9, a2: 6 }, { a1: 9, a2: 6 }], children,
}) {
  const g = GARMENT[garment] || GARMENT.jacket;
  const coatDark = shade(coat, -0.22);
  const torso = `M-21.5 -86 Q-21.5 -91.5 -13 -92 L-4.8 -91.4 L0 -87.6 L4.8 -91.4 L13 -92 Q21.5 -91.5 21.5 -86 L20 -50 L${g.w} ${g.hem} Q0 ${g.hem + 3.4} ${-g.w} ${g.hem} L-20 -50 Z`;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="27" ry="5" fill="#000" opacity="0.4" />
      <g transform="translate(0,-106)"><HeadBack look={look} hair={hair} hood={hood} hoodColor={hoodColor} back={back} /></g>
      {/* jambes */}
      {[-1, 1].map((k) => (
        <g key={k} transform={`rotate(${k * stride} 0 -48)`}>
          <rect x={k < 0 ? -10.4 : 1.4} y="-50" width="9" height="46" rx="3.2" fill={pants} stroke={shade(pants, -0.2)} strokeWidth="0.6" />
          <ellipse cx={k * 5.9} cy="-2" rx="6.4" ry="3.3" fill={shoes} />
        </g>
      ))}
      {/* cou */}
      <rect x="-4.6" y="-93" width="9.2" height="10" rx="2" fill={shade(skin, -0.1)} />
      {/* tronc + col */}
      <path d={torso} fill={coat} stroke={coatDark} strokeWidth="0.9" strokeLinejoin="round" />
      <path d="M-4.8 -91.4 L0 -87.6 L4.8 -91.4" fill={skin} stroke={shade(skin, -0.3)} strokeWidth="0.6" />
      <path d={`M-20 -50 Q0 -47 20 -50`} stroke={coatDark} strokeWidth="1.8" fill="none" />
      <path d="M0 -87.6 L0 -52" stroke={coatDark} strokeWidth="0.7" opacity="0.55" />
      {arms.map((a, i) => <Arm key={i} side={i ? 1 : -1} a1={a.a1} a2={a.a2} coat={coat} skin={skin} />)}
      {cane && <path d="M30 -48 L35 -1" stroke="#6a4a2a" strokeWidth="3.6" strokeLinecap="round" />}
      <g transform="translate(0,-106)"><HeadFront skin={skin} hair={hair} look={look} beard={beard} mood={mood} hood={hood} hoodColor={hoodColor} back={back} /></g>
      {children}
    </g>
  );
}

/* ───────── buste (table, portrait en situation) ───────── */
export function Bust({ x = 0, y = 0, s = 1.9, skin = "#e0a878", hair = "#3a2818", look = "short", beard = false, mood = "neutre", cloth = "#3a5878", children }) {
  const dark = shade(cloth, -0.25);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <HeadBack look={look} hair={hair} />
      <path d="M-33 52 Q-33 22 -11 18 L11 18 Q33 22 33 52 Z" fill={cloth} stroke={dark} strokeWidth="0.9" />
      <rect x="-4.8" y="11" width="9.6" height="10" rx="2" fill={shade(skin, -0.1)} />
      <path d="M-10 18 L0 25 L10 18" fill={skin} stroke={shade(skin, -0.3)} strokeWidth="0.7" />
      <path d="M-10 18 Q0 27 10 18" stroke={dark} strokeWidth="1.2" fill="none" />
      <HeadFront skin={skin} hair={hair} look={look} beard={beard} mood={mood} />
      {children}
    </g>
  );
}
