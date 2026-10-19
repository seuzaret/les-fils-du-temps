import PnjRoom from "../PnjRoom.jsx";
import { PNJ_ROOMS } from "../pnj.js";
import { CeilingPipes, ConcretePanels, PerspFloor, Vignette } from "../bunkerKit.jsx";

/* ============================================================
   Chapelle des Anciens (niveau +1) — grande nef sous voûtes.
   Layout : nef centrale avec bancs, autel monumental avec
   effigie MARTINE + halo doré, colonnes qui montent vers des
   voûtes, "vitraux" simulés par des panneaux lumineux, bougies
   qui vacillent au sol.
   ============================================================ */
export default function BunkerChapelle({ onGo, j3 }) {
  const bg = (
    <>
      <defs>
        <linearGradient id="chp-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2818" />
          <stop offset="100%" stopColor="#141008" />
        </linearGradient>
        <linearGradient id="chp-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a4028" />
          <stop offset="100%" stopColor="#1a0e04" />
        </linearGradient>
        <radialGradient id="chp-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd870" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffd870" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="chp-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd870" />
          <stop offset="100%" stopColor="#8a3820" />
        </linearGradient>
      </defs>
      <rect width="1000" height="520" fill="url(#chp-wall)" />
      <ConcretePanels y0={40} y1={380} seed={55} opacity={0.5} />
      <rect y="380" width="1000" height="140" fill="url(#chp-floor)" />
      <PerspFloor y0={380} y1={520} step={80} rows={4} opacity={0.4} />

      {/* PLAFOND VOÛTÉ (courbes qui suggèrent une nef gothique) */}
      <path d="M0 0 Q500 100 1000 0 L1000 60 Q500 130 0 60 Z" fill="#1a1008" />
      <path d="M0 60 Q500 130 1000 60" stroke="#c8a848" strokeWidth="1" opacity="0.4" fill="none" />

      {/* "VITRAUX" à gauche et à droite (panneaux lumineux avec motifs) */}
      {[[120, 100], [880, 100]].map(([x, y], k) => (
        <g key={k} transform={`translate(${x},${y})`}>
          <path d={`M-40 0 Q0 -30 40 0 L40 130 L-40 130 Z`} fill="url(#chp-glass)" stroke="#3a1808" strokeWidth="2" />
          {/* Croisillons du vitrail */}
          <line x1="-40" y1="30" x2="40" y2="30" stroke="#3a1808" strokeWidth="1.5" />
          <line x1="-40" y1="70" x2="40" y2="70" stroke="#3a1808" strokeWidth="1.5" />
          <line x1="0" y1="0" x2="0" y2="130" stroke="#3a1808" strokeWidth="1.5" />
          {/* Halo qui filtre à travers */}
          <ellipse cx="0" cy="220" rx="90" ry="40" fill="#ffd870" opacity="0.12" />
        </g>
      ))}

      {/* COLONNES qui montent vers les voûtes */}
      {[240, 460, 540, 760].map((x, i) => (
        <g key={i}>
          {/* Fût */}
          <rect x={x - 10} y="70" width="20" height="330" fill="#3a2818" stroke="#1a0e08" strokeWidth="1" />
          {/* Chapiteau */}
          <rect x={x - 14} y="62" width="28" height="10" fill="#5a3818" stroke="#1a0e08" strokeWidth="1" />
          {/* Base */}
          <rect x={x - 14} y="392" width="28" height="10" fill="#5a3818" stroke="#1a0e08" strokeWidth="1" />
        </g>
      ))}

      {/* AUTEL CENTRAL avec effigie stylisée du vaisseau MARTINE */}
      <g transform="translate(500,190)">
        <circle r="90" fill="url(#chp-glow)">
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Effigie : bulle du vaisseau stylisée */}
        <ellipse cx="0" cy="-14" rx="42" ry="34" fill="#7fecc4" opacity="0.55" stroke="#3aa07a" strokeWidth="2" />
        <ellipse cx="-10" cy="-24" rx="10" ry="6" fill="#fff" opacity="0.5" />
        {/* Base */}
        <rect x="-48" y="24" width="96" height="10" fill="#5a4028" stroke="#0a0806" strokeWidth="1" />
        {/* Tripode */}
        {[-30, 0, 30].map((dx) => (
          <path key={dx} d={`M${dx - 5} 34 L${dx - 10} 60 L${dx + 10} 60 L${dx + 5} 34 Z`} fill="#8a9098" stroke="#0a0806" strokeWidth="0.8" />
        ))}
        {/* Auréole "M" au-dessus */}
        <text x="0" y="-56" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="16" fontWeight="900" fill="#ffd870" letterSpacing="4">M</text>
      </g>

      {/* AUTEL / TABLE devant */}
      <g transform="translate(500,300)">
        <rect x="-90" y="0" width="180" height="16" fill="#8a5030" stroke="#3a2010" strokeWidth="2" />
        <rect x="-84" y="16" width="12" height="60" fill="#5a3018" />
        <rect x="72" y="16" width="12" height="60" fill="#5a3018" />
        <rect x="-90" y="16" width="180" height="6" fill="#3a2010" />
        {/* Chandeliers sur l'autel */}
        {[-60, 0, 60].map((dx) => (
          <g key={dx} transform={`translate(${dx},-6)`}>
            <rect x="-3" y="0" width="6" height="6" fill="#c8a848" />
            <rect x="-1.4" y="-16" width="2.8" height="16" fill="#e8dfc8" />
            <path d="M0 -22 Q-2 -19 0 -16 Q2 -19 0 -22 Z" fill="#ffd870">
              <animate attributeName="opacity" values="0.7;1;0.7" dur="1.6s" repeatCount="indefinite" />
            </path>
          </g>
        ))}
      </g>

      {/* BANCS de recueillement en 2 rangées (avec dossier) */}
      {[[180, 340], [820, 340], [180, 390], [820, 390]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          {/* Assise */}
          <rect x="-70" y="0" width="140" height="8" fill="#5a3818" stroke="#1a0e08" strokeWidth="1" />
          {/* Dossier */}
          <rect x="-70" y="-14" width="140" height="4" fill="#5a3818" stroke="#1a0e08" strokeWidth="0.5" />
          {/* Pieds */}
          <rect x="-70" y="8" width="6" height="18" fill="#3a2010" />
          <rect x="64" y="8" width="6" height="18" fill="#3a2010" />
        </g>
      ))}

      {/* BOUGIES VOTIVES au sol devant l'autel (rangée en arc) */}
      {[350, 400, 450, 500, 550, 600, 650].map((x, i) => (
        <g key={x} transform={`translate(${x},395)`}>
          <rect x="-2" y="0" width="4" height="10" fill="#e8dfc8" />
          <path d="M0 -4 Q-1.5 -1 0 2 Q1.5 -1 0 -4 Z" fill="#ffd870">
            <animate attributeName="opacity" values="0.7;1;0.7" dur={`${1.2 + (i % 3) * 0.3}s`} repeatCount="indefinite" />
          </path>
        </g>
      ))}
      <Vignette id="chapelle-vig" strength={0.45} />
    </>
  );
  return <PnjRoom titre="✧ CHAPELLE DES ANCIENS — NIVEAU +1" bg={bg} pnjList={PNJ_ROOMS.chapelle} j3={j3} onGo={onGo} />;
}
