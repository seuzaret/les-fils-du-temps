import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 2 · Tableau 1 — La porte de la cité  (PEINTURE FINE)
   Aube méditerranéenne : la mer à gauche, la cité aux toits blancs
   sur sa colline, la palissade de bois et sa porte gardée par Guna.
   Un coquillage brille sur la grève mouillée.
   ============================================================ */

export default function SceneMuraille({ collect, action, reveal, queteQui }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="mu-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#26386c" /><stop offset="30%" stopColor="#5a6a9c" /><stop offset="58%" stopColor="#b89ca8" /><stop offset="80%" stopColor="#f0c090" /><stop offset="100%" stopColor="#ffe6b0" />
        </linearGradient>
        <radialGradient id="mu-sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff6dc" /><stop offset="45%" stopColor="#ffe0a4" stopOpacity="0.7" /><stop offset="100%" stopColor="#ffe0a0" stopOpacity="0" /></radialGradient>
        <linearGradient id="mu-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c8b490" /><stop offset="34%" stopColor="#8a94a0" /><stop offset="100%" stopColor="#4c5a68" /></linearGradient>
        <linearGradient id="mu-wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4a3322" /><stop offset="50%" stopColor="#7a5636" /><stop offset="100%" stopColor="#2e2014" /></linearGradient>
        <linearGradient id="mu-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c2a878" /><stop offset="100%" stopColor="#7a6040" /></linearGradient>
        <linearGradient id="mu-house" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#efe8da" /><stop offset="100%" stopColor="#cbbfa6" /></linearGradient>
        <filter id="mu-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="8" /></filter>
        <filter id="mu-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="mu-mottle" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* ═══ ciel d'aube ═══ */}
      <rect width="1000" height="560" fill="url(#mu-sky)" />
      {[[520, 40, 0.3], [660, 66, 0.28], [200, 54, 0.32], [820, 44, 0.3]].map(([x, y, o], i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill="#fff" opacity={o} style={{ animation: `twinkle ${3 + i}s infinite` }} />
      ))}
      {/* le soleil, bas sur la mer */}
      <circle cx="150" cy="240" r="150" fill="url(#mu-sun)" />
      <circle cx="150" cy="240" r="34" fill="#fff8e2" />
      {/* nuées étirées du matin */}
      <g filter="url(#mu-blur)">
        <ellipse cx="420" cy="120" rx="170" ry="10" fill="#f0b8a0" opacity="0.4" />
        <ellipse cx="720" cy="150" rx="140" ry="8" fill="#e8a88c" opacity="0.3" />
      </g>

      {/* ═══ couche lointaine : la mer + la cité blanche sur sa colline ═══ */}
      <PLayer depth={1}>
        {/* la mer, qui s'étend jusque derrière la cité */}
        <path d="M-40 300 L1040 300 L1040 372 L340 372 L340 440 L-40 440 Z" fill="url(#mu-sea)" />
        {/* un cap rocheux au loin, à gauche */}
        <path d="M-40 300 L-40 284 L10 280 L40 270 L70 274 L96 286 L130 296 L150 300 Z" fill="#7a6a78" opacity="0.8" />
        {/* reflet du soleil : une colonne de paillettes */}
        <ellipse cx="150" cy="340" rx="70" ry="40" fill="#ffe0a0" opacity="0.16" filter="url(#mu-blur)" />
        {Array.from({ length: 14 }).map((_, i) => {
          const y = 304 + i * 9, w = 12 + i * 6, x = 150 - w / 2 + ((i * 29) % 9) - 4;
          return <path key={`g${i}`} d={`M${x.toFixed(1)} ${y} h${w.toFixed(1)}`} stroke={i % 3 ? "#ffe6a8" : "#fff8dc"} strokeWidth={1.4 + i * 0.08} strokeLinecap="round" opacity={0.75 - i * 0.03}>
            <animate attributeName="opacity" values={`${(0.75 - i * 0.03).toFixed(2)};0.2;${(0.75 - i * 0.03).toFixed(2)}`} dur={`${1.6 + (i % 4) * 0.5}s`} repeatCount="indefinite" />
          </path>;
        })}
        {[314, 330, 346, 362, 380, 398].map((y, i) => <path key={i} d={`M-40 ${y} q40 ${i % 2 ? 3 : -3} 80 0 t80 0 t80 0 t80 0 t80 0`} stroke="#d8dce0" strokeWidth="1.4" fill="none" opacity="0.4" />)}
        {/* la plage qui s'avance vers la mer, ligne d'écume */}
        <path d="M-40 400 Q80 388 200 396 Q290 402 340 380 L340 440 L-40 440 Z" fill="#c8a878" />
        <path d="M-40 400 Q80 388 200 396 Q290 402 340 380" stroke="#f4f0e8" strokeWidth="3" fill="none" opacity="0.8">
          <animate attributeName="d" values="M-40 400 Q80 388 200 396 Q290 402 340 380;M-40 396 Q80 384 200 392 Q290 398 340 377;M-40 400 Q80 388 200 396 Q290 402 340 380" dur="5s" repeatCount="indefinite" />
        </path>
        <path d="M-40 406 Q80 396 200 402 Q290 408 340 388" stroke="#9a9080" strokeWidth="5" fill="none" opacity="0.4" />
        {/* une barque au loin */}
        <path d="M240 344 q14 6 28 0 l-4 8 l-20 0 Z" fill="#3a3428" opacity="0.7" />
        <path d="M254 344 l0 -14" stroke="#3a3428" strokeWidth="1.4" opacity="0.7" />
        {/* colline + toits blancs de la cité, derrière la muraille */}
        <path d="M330 320 Q560 288 780 316 Q900 330 1000 314 L1000 372 L330 372 Z" fill="#9a8a5e" />
        {[[440, 268, 0.9], [512, 254, 1.05], [590, 268, 0.85], [668, 258, 1.0], [742, 272, 0.9], [812, 262, 0.8]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
            <rect x="-26" y="0" width="52" height="60" fill="url(#mu-house)" />
            <rect x="-26" y="0" width="52" height="60" fill="#8a7a56" opacity="0.12" filter="url(#mu-grain)" />
            <rect x="-26" y="0" width="52" height="8" fill="#d8cfb8" />
            <path d="M-26 0 h52" stroke="#e8e0cc" strokeWidth="1.5" opacity="0.6" />
            <rect x="-9" y="30" width="18" height="30" fill="#3a2c1c" />
            {/* échelle sur le toit (Çatalhöyük) */}
            <path d="M-18 0 l4 -13 M-12 0 l4 -13 M-17 -3 h5 M-16 -7 h5" stroke="#a89060" strokeWidth="1.1" opacity="0.7" />
          </g>
        ))}
      </PLayer>

      {/* ═══ couche intermédiaire : la palissade de bois + la porte ═══ */}
      <PLayer depth={2}>
        {/* remblai de terre au pied du mur */}
        <path d="M330 372 Q640 356 1000 368 L1000 430 L330 430 Z" fill="#8a6e46" />
        <path d="M330 372 Q640 356 1000 368 L1000 430 L330 430 Z" fill="#3a2c18" opacity="0.28" filter="url(#mu-mottle)" />
        {/* les pieux de la palissade */}
        {Array.from({ length: 22 }).map((_, i) => {
          const x = 336 + i * 30;
          if (x > 560 && x < 700) return null; // l'ouverture de la porte
          const h = 196 + (i % 3) * 6;
          return (
            <g key={i}>
              <rect x={x} y={430 - h} width="24" height={h} fill="url(#mu-wood)" />
              <rect x={x} y={430 - h} width="24" height={h} fill="#221408" opacity="0.4" filter="url(#mu-grain)" />
              <path d={`M${x + 2} ${430 - h + 14} v${h - 24}`} stroke="#a8865c" strokeWidth="1.4" opacity="0.35" />
              <path d={`M${x} ${430 - h} l12 -14 l12 14 Z`} fill="#6e4c2e" />
              <path d={`M${x} ${430 - h} l12 -14`} stroke="#8a6a44" strokeWidth="1.4" opacity="0.5" />
            </g>
          );
        })}
        {/* le linteau : grosse poutre en travers, posée au sommet de la palissade */}
        <rect x="556" y="212" width="186" height="24" fill="url(#mu-wood)" />
        <rect x="556" y="212" width="186" height="24" fill="#221408" opacity="0.4" filter="url(#mu-grain)" />
        <path d="M560 217 h178" stroke="#a8865c" strokeWidth="1.4" opacity="0.35" />
        {/* la tour de guet, assise sur le linteau */}
        <rect x="580" y="158" width="138" height="56" fill="#5a3f24" />
        <rect x="580" y="158" width="138" height="56" fill="#221408" opacity="0.3" filter="url(#mu-grain)" />
        {[584, 608, 632, 656, 680, 704].map((x, i) => <rect key={i} x={x} y="146" width="14" height="14" fill="#4a3018" />)}
        <rect x="635" y="174" width="28" height="26" fill="#241608" />
        <path d="M635 187 h28" stroke="#3a2614" strokeWidth="1.4" opacity="0.6" />
        {/* les deux grands battants de la porte, sous le linteau */}
        <rect x="572" y="236" width="154" height="194" fill="#3a2614" />
        <rect x="572" y="236" width="154" height="194" fill="#221408" opacity="0.32" filter="url(#mu-grain)" />
        <path d="M649 236 v194" stroke="#1c1006" strokeWidth="4" />
        <path d="M572 236 v194 M726 236 v194" stroke="#241608" strokeWidth="3" />
        {[236, 430].map((y, i) => <path key={i} d={`M572 ${y} h154`} stroke="#241608" strokeWidth="3" />)}
        {/* deux traverses de renfort ferrées + clous */}
        {[296, 384].map((y, i) => (
          <g key={i}>
            <path d={`M576 ${y} h146`} stroke="#2a180c" strokeWidth="7" />
            {[584, 616, 642, 656, 690, 718].map((x, j) => <circle key={j} cx={x} cy={y} r="2.4" fill="#1c1006" />)}
          </g>
        ))}
        {/* planches verticales sur chaque battant */}
        {[588, 610, 632, 668, 690, 712].map((x, i) => <path key={i} d={`M${x} 240 v186`} stroke="#241608" strokeWidth="1.6" opacity="0.5" />)}
        {/* fente d'ombre entre les battants */}
        <rect x="645" y="240" width="8" height="186" fill="#0e0805" opacity="0.6" />
      </PLayer>

      {/* ═══ premier plan : la grève, Guna, le coquillage ═══ */}
      <PLayer depth={3}>
        {/* le sol devant la porte */}
        <path d="M0 560 L0 430 Q320 412 640 434 Q840 448 1000 428 L1000 560 Z" fill="url(#mu-sand)" />
        <path d="M0 560 L0 430 Q320 412 640 434 Q840 448 1000 428 L1000 560 Z" fill="#2c1c10" opacity="0.26" filter="url(#mu-mottle)" />
        <ellipse cx="580" cy="500" rx="420" ry="46" fill="#5a4630" opacity="0.25" />
        {/* la grève mouillée qui rejoint la mer, à gauche */}
        <path d="M-20 452 Q120 440 240 460 Q300 490 270 530 Q250 560 260 580 L-20 580 Z" fill="#9a9080" opacity="0.45" />
        <path d="M-20 456 Q120 444 236 464 Q294 492 266 530" stroke="#e8dcc0" strokeWidth="2" fill="none" opacity="0.5" />
        {/* galets mouillés */}
        {[[90, 520, 10], [150, 540, 7], [210, 522, 9]].map(([x, y, r], i) => (
          <g key={i}><ellipse cx={x + r} cy={y + 2} rx={r * 1.4} ry={r * 0.35} fill="#1c1420" opacity="0.4" /><ellipse cx={x} cy={y} rx={r} ry={r * 0.6} fill={i % 2 ? "#6e5a48" : "#564636"} /><path d={`M${x - r * 0.6} ${y - r * 0.3} q${r * 0.6} -${r * 0.4} ${r * 1.2} 0`} stroke="#e8d4a8" strokeWidth="1.4" fill="none" opacity="0.6" /></g>
        ))}

        {/* GUNA, le garde — cuirasse de cuir, lance, bouclier rond */}
        <g transform="translate(388,440)">
          <ellipse cx="0" cy="46" rx="28" ry="7" fill="#2a1c10" opacity="0.5" />
          <path d="M34 -60 L30 46" stroke="#6e4c2e" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M34 -60 l-6 14 l6 5 l6 -5 Z" fill="#8d8d97" stroke="#dfe3ec" strokeWidth="1" />
          <Figure x={0} y={46} s={0.828} skin="#c6965f" hair="#2c2013" hat="leather" hatColor="#7a4e2c"
            garment="tunic" coat="#7a5636" pants="#5a3f24" trim="#5a3f24" arms={[{ a1: 30, a2: 50 }, { a1: 36, a2: 4 }]} />
          <ellipse cx="-24" cy="-2" rx="14" ry="16" fill="#8a5a34" stroke="#5a3f24" strokeWidth="2.5" />
          <circle cx="-24" cy="-2" r="4" fill="#c8a860" />
          <path d="M-24 -16 v28 M-36 -2 h24" stroke="#5a3f24" strokeWidth="1.4" opacity="0.5" />
        </g>
        {/* le « ? » doré : c'est au tour de Guna */}
        {queteQui === "guna" && (
          <g transform="translate(370,317)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -22 22 -22 q22 0 22 18 q0 15 -18 20 l0 7" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="22" cy="34" r="2.8" fill="#ffd166" />
          </g>
        )}

        {/* LE COQUILLAGE, nacré, sur le sable humide */}
        <g transform="translate(140,486)">
          <ellipse cx="0" cy="12" rx="22" ry="6" fill="#1c1420" opacity="0.4" />
          <path d="M0 10 Q-22 4 -16 -14 Q-7 -24 0 -16 Q7 -24 16 -14 Q22 4 0 10 Z" fill="#f2e6cc" />
          <path d="M0 10 Q-22 4 -16 -14 Q-7 -24 0 -16 Q7 -24 16 -14 Q22 4 0 10 Z" fill="#e8b0c0" opacity="0.25" />
          <path d="M0 8 L-10 -10 M0 8 L-3 -16 M0 8 L4 -15 M0 8 L11 -9" stroke="#d0b898" strokeWidth="1.4" opacity="0.7" />
          <path d="M-4 -14 q4 -4 8 0" stroke="#fff6ea" strokeWidth="1.4" fill="none" opacity="0.7" />
        </g>

        {/* herbes sèches qui cadrent le bas */}
        <g opacity="0.9">
          <path d="M-4 560 q10 -30 4 -46 M18 560 q3 -24 14 -38 M960 560 q-6 -22 2 -34 M984 560 q4 -18 12 -28" stroke="#241a10" strokeWidth="4" fill="none" />
        </g>
      </PLayer>

      {/* voile de grain global */}
      <rect width="1000" height="560" fill="#141008" opacity="0.08" style={{ pointerEvents: "none" }} />

      {/* zones cliquables */}
      <Hotspot cx={393} cy={403} r={48} label="Guna, le garde" reveal={reveal} onClick={(p) => action("guna", p)} />
      <Hotspot cx={140} cy={480} r={34} label="coquillage" item="coquillage" reveal={reveal} onClick={() => collect("coquillage")} />
      {/* la porte elle-même : clic → salle du trône */}
      <Hotspot cx={649} cy={333} r={90} label="entrer dans la cité" reveal={reveal} onClick={() => action("porte_cite")} />
          {/* AMBIANCE : petit vol d'oiseaux qui traverse le ciel */}
      <g opacity="0.75">
        <animateTransform attributeName="transform" type="translate"
          values="-40,0; 1050,-20" dur="28s" repeatCount="indefinite" />
        <path d="M0 130 q6 -8 12 0 q6 -8 12 0" stroke="#1a1408" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M28 142 q6 -8 12 0 q6 -8 12 0" stroke="#1a1408" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M54 128 q6 -8 12 0 q6 -8 12 0" stroke="#1a1408" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
</svg>
  );
}
