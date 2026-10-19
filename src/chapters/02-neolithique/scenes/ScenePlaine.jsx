import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";
import { Clouds, Grass, Haze, Ridge, Speckle, TreeLine } from "../../../engine/scenery.jsx";

/* ============================================================
   CHAPITRE 2 · Tableau 4 — La plaine aux mégalithes  (PEINTURE FINE)
   Une grande plaine venteuse, un fleuve à droite (argile + cailloux
   noirs sur la berge), des menhirs au loin. Le prêtre Imir, le
   tailleur Doka et ses hommes hâlent la grande pierre. Les tombes
   des rois veillent au fond — on sent la solennité.
   ============================================================ */

export default function ScenePlaine({ collect, action, reveal, made = [], queteQui }) {
  const dresse = made.includes("msg_megalithe");
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="pl-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4e72a0" /><stop offset="45%" stopColor="#9fb6c6" /><stop offset="100%" stopColor="#e2dcc0" /></linearGradient>
        <linearGradient id="pl-hill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a935a" /><stop offset="100%" stopColor="#6a7444" /></linearGradient>
        <linearGradient id="pl-land" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#96975a" /><stop offset="100%" stopColor="#565e34" /></linearGradient>
        <linearGradient id="pl-river" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9cc0c6" /><stop offset="100%" stopColor="#527882" /></linearGradient>
        <linearGradient id="pl-granite" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#bdb9ae" /><stop offset="50%" stopColor="#84807780" /><stop offset="100%" stopColor="#585048" /></linearGradient>
        <radialGradient id="pl-sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff2c8" stopOpacity="0.7" /><stop offset="100%" stopColor="#fff2c8" stopOpacity="0" /></radialGradient>
        <filter id="pl-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="pl-mottle" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="pl-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>

      {/* ═══ ciel, soleil pâle, nuages filants ═══ */}
      <rect width="1000" height="560" fill="url(#pl-sky)" />
      <circle cx="300" cy="140" r="46" fill="#fff0b8" opacity="0.7" />
      <ellipse cx="300" cy="140" rx="200" ry="150" fill="url(#pl-sun)" />
      <Clouds id="pl-cl" seed={21} items={[[170, 92, 180], [520, 66, 230], [790, 112, 170], [640, 160, 110]]} color="#f8f4e8" shadow="#c8c8c0" opacity="0.8" drift={18} />

      {/* ═══ fond : collines + tombes des rois (tumulus) au loin ═══ */}
      <PLayer depth={1}>
        {/* collines bleutées très loin, puis bocage */}
        <Ridge id="pl-r0" seed={151} y={282} amp={40} rough={0.5} fill="#8a9ab0" lit="#a8b4c4" light={-1} />
        <Haze id="pl-h0" y0={250} y1={300} color="#e2dcc0" opacity={0.45} />
        <path d="M0 300 Q250 272 500 292 Q750 314 1000 288 L1000 360 L0 360 Z" fill="url(#pl-hill)" />
        <TreeLine seed={153} x0={-20} x1={560} y={294} n={30} h={[12, 22]} kinds={["leafy", "leafy", "conifer"]} colors={["#4a5a30", "#56663a", "#3e4e2a"]} light={-1} jitter={8} />
        <TreeLine seed={157} x0={880} x1={1020} y={296} n={7} h={[12, 22]} kinds={["leafy"]} colors={["#4a5a30", "#56663a"]} light={-1} jitter={6} />
        <path d="M0 300 Q250 272 500 292 Q750 314 1000 288 L1000 360 L0 360 Z" fill="#3a4020" opacity="0.2" filter="url(#pl-mottle)" />
        {/* les tumulus (tombes des rois), silhouettes solennelles */}
        {[[620, 300, 1], [720, 296, 1.35], [828, 306, 0.85]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
            <path d="M-56 6 Q-40 -34 0 -38 Q40 -34 56 6 Z" fill="#6e7444" />
            <path d="M-56 6 Q-40 -34 0 -38 Q40 -34 56 6 Z" fill="#3a3e20" opacity="0.28" filter="url(#pl-grain)" />
            {/* dalle d'entrée sombre */}
            <path d="M-9 6 L-9 -10 Q0 -16 9 -10 L9 6 Z" fill="#241c14" />
            <path d="M-40 4 Q0 -20 40 4" stroke="#8a9058" strokeWidth="1.4" fill="none" opacity="0.4" />
          </g>
        ))}
        {/* un menhir déjà dressé, au loin à gauche */}
        <g transform="translate(140,300)">
          <path d="M-11 60 Q-15 -14 0 -40 Q15 -14 11 60 Z" fill="url(#pl-granite)" />
          <path d="M9 56 Q13 -8 2 -36" stroke="#e6e2d6" strokeWidth="1.6" fill="none" opacity="0.4" />
          <ellipse cx="-2" cy="10" rx="6" ry="4" fill="#7a8a3a" opacity="0.4" />
        </g>
      </PLayer>

      {/* ═══ la plaine + le fleuve ═══ */}
      <PLayer depth={2}>
        <path d="M-40 336 Q160 318 380 328 Q600 340 820 324 Q930 318 1040 330 L1040 560 L-40 560 Z" fill="url(#pl-land)" />
        <path d="M-40 336 Q160 318 380 328 Q600 340 820 324 Q930 318 1040 330 L1040 560 L-40 560 Z" fill="#2e3418" opacity="0.24" filter="url(#pl-mottle)" />
        <path d="M-40 336 Q160 318 380 328 Q600 340 820 324 Q930 318 1040 330" stroke="#b8b878" strokeWidth="3" fill="none" opacity="0.4" />
        {/* une haie basse qui court sur la crête de la plaine */}
        <TreeLine seed={159} x0={380} x1={560} y={334} n={10} h={[16, 26]} kinds={["leafy"]} colors={["#4a5a30", "#56663a"]} light={-1} jitter={4} />
        <ellipse cx="450" cy="486" rx="450" ry="64" fill="#2e3416" opacity="0.24" />
        <Speckle seed={91} x0={0} x1={820} y0={334} y1={560} n={420} colors={["#a8a860", "#5a6a30", "#c8b860", "#4a5428"]} r={[0.6, 1.8]} opacity={0.5} />
        {[[60, 470, 1], [300, 540, 2], [460, 460, 3], [620, 530, 4], [760, 470, 5], [140, 540, 6]].map(([x, y, sd]) => <Grass key={sd} x={x} y={y} seed={sd} color="#6a7a38" s={1.1} flower={sd % 2 ? "#e8d040" : "#f0f0f0"} />)}
        {/* touffes d'herbe éparses */}
        {[[120, 420], [240, 452], [380, 500], [520, 430], [700, 508], [180, 490], [820, 452]].map(([x, y], i) => (
          <g key={i} stroke="#7a8446" strokeWidth="2" strokeLinecap="round" opacity="0.55">
            <path d={`M${x} ${y} l-4 -12 M${x} ${y} l0 -15 M${x} ${y} l4 -12`} />
          </g>
        ))}

        {/* LE FLEUVE, à droite */}
        <path d="M818 330 Q862 420 838 560 L1000 560 L1000 330 Z" fill="url(#pl-river)" />
        <path d="M818 330 Q862 420 838 560" stroke="#cfe0e0" strokeWidth="2" fill="none" opacity="0.4" />
        {[356, 396, 436, 476, 516].map((y, i) => <path key={i} d={`M842 ${y} q42 ${i % 2 ? 5 : -5} 84 0`} stroke="#d4e2e2" strokeWidth="1.4" fill="none" opacity="0.4" />)}
        {/* reflet du soleil sur l'eau */}
        <ellipse cx="920" cy="420" rx="30" ry="70" fill="#fff2c8" opacity="0.14" filter="url(#pl-blur)" />

        {/* argile + cailloux noirs sur la berge */}
        <g transform="translate(884,500)">
          <ellipse cx="0" cy="8" rx="20" ry="6" fill="#241c12" opacity="0.4" />
          <path d="M-18 4 Q-16 -11 0 -11 Q16 -11 18 4 Z" fill="#8a6a4a" />
          <ellipse cx="0" cy="4" rx="18" ry="5" fill="#6e5238" />
          <path d="M-12 0 q12 5 24 0" stroke="#5a4230" strokeWidth="1.2" fill="none" opacity="0.6" />
        </g>
        <g transform="translate(816,518)">{[[-10, 0], [2, 4], [12, -2], [-2, 8], [7, 7]].map(([x, y], i) => (
          <g key={i}><ellipse cx={x} cy={y} rx="4.5" ry="3.5" fill="#2c2c32" /><ellipse cx={x - 1} cy={y - 1} rx="1.6" ry="1" fill="#6a6a72" opacity="0.5" /></g>
        ))}</g>

        {/* PETITS CRABES qui trottinent en travers sur la berge du fleuve
            — mouvement lateral typique du crabe, timings decales. Rouge
            brique, pinces devant, huit pattes. */}
        {[[840, 545, 4, 0], [880, 552, 5, 1.5]].map(([bx, by, dur, off], i) => (
          <g key={i}>
            <animateTransform attributeName="transform" type="translate"
              values={`${bx - 8},${by}; ${bx + 8},${by}; ${bx - 8},${by}`}
              dur={`${dur}s`} begin={`${off}s`} repeatCount="indefinite" />
            {/* corps aplati */}
            <ellipse cx="0" cy="0" rx="4.5" ry="3" fill="#a03018" stroke="#4a1408" strokeWidth="0.4" />
            {/* petites taches */}
            <circle cx="-1" cy="-0.5" r="0.6" fill="#5a1810" />
            <circle cx="1.5" cy="-0.5" r="0.6" fill="#5a1810" />
            {/* deux yeux sur pedoncules */}
            <circle cx="-1.2" cy="-2.5" r="0.5" fill="#0a0604" />
            <circle cx="1.2" cy="-2.5" r="0.5" fill="#0a0604" />
            {/* pinces (grandes) devant */}
            <path d="M-4 -1 l-3 -1 q-1 1 1 2 M-4 -1 l-2 1 q0 -1 2 -2" stroke="#a03018" strokeWidth="1.2" fill="#a03018" strokeLinecap="round" />
            <path d="M4 -1 l3 -1 q1 1 -1 2 M4 -1 l2 1 q0 -1 -2 -2" stroke="#a03018" strokeWidth="1.2" fill="#a03018" strokeLinecap="round" />
            {/* pattes (4 par cote) */}
            <path d="M-3 1 l-3 1 M-3 2 l-4 2 M-3 2.5 l-3 2 M-3 3 l-3 3" stroke="#7a2010" strokeWidth="0.6" strokeLinecap="round" />
            <path d="M3 1 l3 1 M3 2 l4 2 M3 2.5 l3 2 M3 3 l3 3" stroke="#7a2010" strokeWidth="0.6" strokeLinecap="round" />
          </g>
        ))}

        {/* LE CHANTIER (tant que le mégalithe n'est pas dressé) */}
        {!dresse && (
          <>
            <g transform="translate(450,478)">
              {[-70, -20, 30, 80].map((dx, i) => <ellipse key={i} cx={dx} cy={40} rx="11" ry="8" fill="#6e4c2e" />)}
              {[-70, -20, 30, 80].map((dx, i) => <ellipse key={`h${i}`} cx={dx} cy={37} rx="11" ry="4" fill="#8a6642" />)}
              <path d="M-100 30 L90 8 Q114 6 114 22 L112 32 Q110 42 90 42 L-98 42 Q-114 42 -100 30 Z" fill="url(#pl-granite)" />
              <path d="M-100 30 L90 8 Q114 6 114 22 L112 32 Q110 42 90 42 L-98 42 Q-114 42 -100 30 Z" fill="#3a342c" opacity="0.22" filter="url(#pl-grain)" />
              <path d="M-90 20 L88 2" stroke="#dcd8ce" strokeWidth="2" opacity="0.4" />
              <path d="M-60 34 q60 -6 120 -14" stroke="#4a443a" strokeWidth="1.4" fill="none" opacity="0.4" />
            </g>
            {/* les hommes de Doka, arc-boutés sur la corde */}
            <g transform="translate(636,458)">
              <path d="M-20 -4 L92 2" stroke="#8a6a42" strokeWidth="3.5" fill="none" opacity="0.85" />
              {[0, 30, 60].map((dx, i) => (
                <g key={i} transform={`translate(${dx},${(i % 2) * 6}) rotate(-14)`}>
                  <Figure x={0} y={26} s={0.476} facing="right" skin={["#8a5c3c", "#a87650", "#9a6a46"][i]} hair="#2a1c10" look={["short", "ring", "short"][i]} beard={i === 1 ? "short" : false}
                    garment="tunic" coat={i % 2 ? "#7a4f34" : "#6a4a30"} pants="#4a3020" bareArms stride={10} arms={[{ a1: 70, a2: 84 }, { a1: 64, a2: 80 }]} />
                </g>
              ))}
            </g>
          </>
        )}

        {/* LE MÉGALITHE DRESSÉ (résultat de msg_megalithe) */}
        {dresse && (
          <g transform="translate(452,494)" style={{ animation: "fadein 1s ease-out" }}>
            <ellipse cx="-6" cy="4" rx="62" ry="14" fill="#2e3416" opacity="0.4" />
            <path d="M-44 2 Q-54 -70 -44 -152 Q-38 -224 -12 -244 Q14 -250 30 -226 Q46 -166 42 -82 Q46 -22 38 2 Z" fill="url(#pl-granite)" />
            <path d="M-44 2 Q-54 -70 -44 -152 Q-38 -224 -12 -244 Q14 -250 30 -226 Q46 -166 42 -82 Q46 -22 38 2 Z" fill="#3a342c" opacity="0.2" filter="url(#pl-grain)" />
            <path d="M38 0 Q46 -70 42 -146 Q38 -220 18 -240" stroke="#eceae0" strokeWidth="3" fill="none" opacity="0.5" />
            <path d="M-40 -6 Q-48 -76 -40 -150" stroke="#3a342c" strokeWidth="2.5" fill="none" opacity="0.3" />
            <g fill="none" strokeLinecap="round" stroke="#3f3c34" strokeWidth="3" opacity="0.8">
              <path d="M-8 -68 a6 6 0 1 1 -9 3 a13 13 0 1 1 18 -5 a20 20 0 1 1 -28 8" />
              <path d="M6 -150 a5 5 0 1 1 -7 3 a11 11 0 1 1 15 -4 a17 17 0 1 1 -23 7" />
              <path d="M-22 -108 l14 -8 l14 8 M-22 -99 l14 -8 l14 8" strokeWidth="2.3" opacity="0.7" />
            </g>
            <ellipse cx="-28" cy="-40" rx="12" ry="6" fill="#7a8a3a" opacity="0.4" />
          </g>
        )}

        {/* IMIR le prêtre, bras levés vers le ciel */}
        <g transform="translate(300,472)">
          <ellipse cx="0" cy="28" rx="22" ry="6" fill="#241c12" opacity="0.4" />
          <Figure x={0} y={28} s={0.795} skin="#c0926a" hair="#2a1a10" look="bald" paint
            garment="toga" coat="#ece2d0" coat2="#8a2438" pants="#c8bca0" arms={[{ a1: 150, a2: 166 }, { a1: 150, a2: 166 }]} />
        </g>
        {queteQui === "imir" && (
          <g transform="translate(282,340)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
          </g>
        )}

        {/* DOKA le tailleur, accroupi, maillet en main */}
        <g transform="translate(560,484)">
          <ellipse cx="0" cy="22" rx="20" ry="6" fill="#241c12" opacity="0.4" />
          <Figure x={0} y={22} s={0.8} pose="kneel" facing="right" skin="#b8885a" hair="#3a2818" hat="headband" hatColor="#6a4628" mood="colere"
            garment="tunic" coat="#7a5636" pants="#5a3f24" bareArms arms={[{ a1: 20, a2: -10 }, { a1: 60, a2: 84 }]} />
          <g transform="translate(25,8)"><rect x="-7" y="-7" width="14" height="12" rx="2" fill="#8a5a34" /><rect x="-2" y="5" width="4" height="12" fill="#5a3f24" /><path d="M-7 -3 h14" stroke="#5a3820" strokeWidth="1.2" /></g>
        </g>
        {queteQui === "doka" && (
          <g transform="translate(542,359)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
          </g>
        )}
      </PLayer>

      {/* voile de grain global */}
      <rect width="1000" height="560" fill="#1a1c12" opacity="0.05" style={{ pointerEvents: "none" }} />

      {/* zones cliquables — personnages */}
      <Hotspot cx={300} cy={422} r={48} label="Imir, le prêtre" reveal={reveal} onClick={(p) => action("imir", p)} />
      <Hotspot cx={560} cy={436} r={46} label="Doka, le tailleur" reveal={reveal} onClick={(p) => action("doka", p)} />
      {/* objets + supports (le chantier disparaît une fois dressé) */}
      {!dresse && <Hotspot cx={450} cy={500} r={70} label="grande pierre" item="grande_pierre" reveal={reveal} onClick={() => collect("grande_pierre")} />}
      {!dresse && <Hotspot cx={669} cy={452} r={72} label="les hommes" item="hommes" reveal={reveal} onClick={() => collect("hommes")} />}
      <Hotspot cx={884} cy={500} r={34} label="argile" item="argile" reveal={reveal} onClick={() => collect("argile")} />
      <Hotspot cx={816} cy={516} r={30} label="cailloux noirs" item="cailloux" reveal={reveal} onClick={() => collect("cailloux")} />
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
