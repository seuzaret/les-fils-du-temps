import { PLayer } from "../../../engine/Parallax.jsx";
import { Clouds, Ridge, TreeLine, Volcano } from "../../../engine/scenery.jsx";

/* ============================================================
   CHAPITRE 4 — Fond commun aux 3 tableaux de Pompéi
   Le ciel méditerranéen, la ville de Pompéi (toits rouges, un
   temple) et le VÉSUVE qui fume au fond — présent partout, que
   personne ne regarde. Chaque tableau ajoute ensuite son décor.
   ============================================================ */

/* les dégradés / filtres partagés — à placer dans le <defs> de chaque scène */
export function PompeiDefs() {
  return (
    <>
      <linearGradient id="pf-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3f74a4" /><stop offset="55%" stopColor="#8fb6cc" /><stop offset="100%" stopColor="#e8d0a0" />
      </linearGradient>
      <filter id="pf-grain" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
        <feComposite in="a" in2="SourceGraphic" operator="in" />
      </filter>
      <filter id="pf-mottle" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
        <feComposite in="a" in2="SourceGraphic" operator="in" />
      </filter>
      <filter id="pf-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7" /></filter>
    </>
  );
}

/* le ciel + le Vésuve + la ville — couche lointaine (depth 1) */
export function PompeiFond() {
  return (
    <>
      <rect width="1000" height="560" fill="url(#pf-sky)" />
      <circle cx="170" cy="120" r="70" fill="#fff4d0" opacity="0.18" />
      <circle cx="170" cy="120" r="34" fill="#fff4d0" opacity="0.85" />
      <Clouds id="pf-cl" seed={81} items={[[360, 80, 200], [580, 120, 170], [120, 190, 120]]} color="#fbf4e6" shadow="#c8ccd0" opacity="0.75" drift={16} />

      <PLayer depth={1}>
        {/* colline / horizon */}
        <Ridge id="pf-r0" seed={83} x0={-40} x1={640} y={290} amp={50} rough={0.5} fill="#8a9ab0" lit="#a8b4c4" light={-1} />
        <path d="M-40 296 Q250 284 500 292 Q750 300 1040 290 L1040 360 L-40 360 Z" fill="#9a9a6e" />
        <TreeLine seed={85} x0={-20} x1={640} y={294} n={18} h={[14, 26]} kinds={["leafy", "conifer"]} colors={["#5a6a3a", "#4a5a30"]} light={-1} jitter={4} />

        {/* le VÉSUVE qui fume, au fond à droite */}
        <Volcano id="pf-vol" x={800} y={300} w={330} h={162} color="#63634a" light={-1} smoke={false} glow green="#55663f" />
        <g transform="translate(800,298)">
          {/* colonne de fumee principale, plus large et plus visible qu'avant */}
          <path d="M0 -164 q-14 -36 11 -62 q-19 8 -8 -36 q12 -22 -3 -48" stroke="#c8bcae" strokeWidth="18" fill="none" opacity="0.55" filter="url(#pf-blur)">
            <animate attributeName="opacity" values="0.4;0.7;0.4" dur="5s" repeatCount="indefinite" />
          </path>
          {/* deuxieme volute plus fine qui monte en decale */}
          <path d="M-6 -155 q-18 -28 4 -56 q-14 4 -2 -34" stroke="#dad0c4" strokeWidth="12" fill="none" opacity="0.42" filter="url(#pf-blur)">
            <animate attributeName="opacity" values="0.25;0.55;0.25" dur="6s" begin="1.5s" repeatCount="indefinite" />
          </path>
          {/* touches ocre-rouge (soufre / cendres chaudes) */}
          <path d="M5 -150 q-9 -26 7 -46" stroke="#c8622a" strokeWidth="7" fill="none" opacity="0.4" filter="url(#pf-blur)" />
          {/* petites cendres qui s'echappent en haut de la colonne */}
          {[[-8, -220, 2.4, 0], [4, -230, 2.8, 1], [-2, -240, 3.2, 2]].map(([cx, cy, dur, delay], i) => (
            <circle key={i} cx={cx} cy={cy} r="1.4" fill="#8a6248" opacity="0.6">
              <animate attributeName="cy" values={`${cy};${cy - 40};${cy}`} dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>

        {/* LA VILLE DE POMPÉI : maisons blanches à toits rouges + un temple */}
        {[[70, 292, 1], [120, 288, 0.85], [300, 292, 0.9], [360, 288, 1.05], [470, 294, 0.8], [560, 290, 0.9]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
            <rect x="-20" y="-24" width="40" height="24" fill="#e4dcc8" />
            <rect x="-20" y="-24" width="40" height="24" fill="#a89a78" opacity="0.15" filter="url(#pf-grain)" />
            <path d="M-24 -24 L0 -38 L24 -24 Z" fill="#a8462e" />
            <rect x="-6" y="-14" width="12" height="14" fill="#6a5238" />
          </g>
        ))}
        {/* le temple à colonnes (au centre de la ville) */}
        <g transform="translate(420,292)">
          <path d="M-34 -30 L0 -48 L34 -30 Z" fill="#c8462e" />
          <rect x="-32" y="-30" width="64" height="6" fill="#e4dcc8" />
          {[-26, -14, -2, 10, 22].map((x, i) => <rect key={i} x={x} y="-24" width="6" height="24" fill="#d8cdb4" />)}
        </g>
        {/* cyprès sombres qui ponctuent l'horizon */}
        {[30, 250, 640, 950].map((x, i) => (
          <path key={i} d={`M${x} 296 q-6 -52 0 -72 q6 20 0 72 Z`} fill="#3a5236" opacity="0.85" />
        ))}
      </PLayer>
    </>
  );
}
