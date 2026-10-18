/* ============================================================
   DÉCOR — Arrivée en −18 000 (dernière diapo de l'intro)
   ------------------------------------------------------------
   Vallée de la Vézère au maximum glaciaire : steppe froide, chaîne
   glacée au loin, rivière en tresses, troupeau de rennes, chevaux et
   bisons, pins tordus par le vent, falaise calcaire avec abri sous
   roche et peintures, camp du clan autour du feu. Couchant : lumière
   rasante, ombres longues vers la gauche.

   À dessiner DANS le <svg viewBox="0 0 1200 680"> de SlideArrival.
   Ne contient NI le vaisseau, NI MARTINE, NI le clan, NI la bulle :
   ils restent gérés par SlideArrival (interactifs). Les aplats de
   base débordent du cadre pour qu'aucune bande vide n'apparaisse
   quand la fenêtre n'a pas exactement le même format.
   ============================================================ */

const SHADOW = "#2a1830";

/* ─── silhouettes ─────────────────────────────────────────── */

const Reindeer = ({ x, y, s = 1, flip = false, graze = false }) => (
  <g>
    <ellipse cx={x - 18 * s} cy={y + 1.5 * s} rx={28 * s} ry={3 * s} fill={SHADOW} opacity="0.32" />
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`} fill="#2e1d26" stroke="#2e1d26">
      <path d="M-20 -14 Q-22 -25 -8 -26 Q8 -28 18 -22 Q23 -19 20 -13 Q14 -8 0 -8 Q-14 -8 -20 -14 Z" stroke="none" />
      {graze
        ? <path d="M16 -21 Q25 -17 29 -7 L34 -2 L29 0 Q23 -3 19 -11 Z" stroke="none" />
        : <path d="M16 -22 Q22 -32 28 -36 L34 -34 L36 -30 L31 -28 Q27 -22 22 -16 Z" stroke="none" />}
      <path d="M-14 -10 L-15 0 M-8 -9 L-8 0 M10 -9 L11 0 M16 -10 L18 0" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d={graze ? "M33 -3 Q36 -12 33 -20 M35 -8 Q41 -13 41 -20" : "M31 -36 Q28 -47 33 -54 M32 -45 Q38 -49 40 -56 M30 -42 Q24 -46 21 -53"}
        strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M-17 -12 Q-6 -8 12 -9" stroke="#8a6a7a" strokeWidth="1.6" opacity="0.5" fill="none" />
    </g>
  </g>
);

const Horse = ({ x, y, s = 1, flip = false }) => (
  <g>
    <ellipse cx={x - 20 * s} cy={y + 1.5 * s} rx={32 * s} ry={3 * s} fill={SHADOW} opacity="0.32" />
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`} fill="#2c1b22" stroke="#2c1b22">
      <path d="M-24 -22 Q-22 -33 -6 -33 Q8 -34 18 -31 Q22 -29 22 -23 Q18 -15 4 -15 Q-14 -15 -24 -22 Z" stroke="none" />
      <path d="M16 -30 Q22 -42 30 -46 L36 -42 L35 -38 Q29 -34 25 -24 Z" stroke="none" />
      <path d="M18 -32 Q22 -42 28 -46" strokeWidth="2.6" fill="none" stroke="#150c12" />
      <path d="M35 -42 l1 -5 l3 4 Z" stroke="none" />
      <path d="M-16 -16 L-17 0 M-10 -15 L-10 0 M8 -15 L9 0 M16 -17 L18 0" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M-24 -26 Q-32 -22 -31 -9" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </g>
  </g>
);

const Bison = ({ x, y, s = 1, flip = false }) => (
  <g>
    <ellipse cx={x - 20 * s} cy={y + 1.5 * s} rx={30 * s} ry={3 * s} fill={SHADOW} opacity="0.34" />
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`} fill="#241520" stroke="#241520">
      <path d="M-26 -16 Q-26 -36 -6 -38 Q10 -39 20 -31 Q29 -27 27 -15 Q20 -8 4 -8 Q-16 -8 -26 -16 Z" stroke="none" />
      <path d="M22 -28 Q31 -28 34 -17 L30 -12 L23 -16 Z" stroke="none" />
      <path d="M31 -27 q4 -6 8 -3" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M-16 -10 L-17 0 M-8 -9 L-8 0 M10 -9 L11 0 M18 -10 L20 0" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M-6 -8 l-1 5 M2 -8 l0 6 M10 -8 l1 5" strokeWidth="1.4" fill="none" />
    </g>
  </g>
);

const Pine = ({ x, y, s = 1, lean = 6 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx="-30" cy="3" rx="64" ry="6" fill={SHADOW} opacity="0.38" />
    <path d={`M0 0 Q${-lean} -70 ${lean * 0.4} -150`} stroke="#2a1c1c" strokeWidth="8" fill="none" strokeLinecap="round" />
    <path d={`M${-lean * 0.4} -50 q-26 -2 -40 8 M${-lean * 0.7} -82 q30 -6 46 2 M${-lean * 0.6} -104 q-26 -8 -38 -2 M${-lean * 0.2} -126 q22 -6 32 0`}
      stroke="#2a1c1c" strokeWidth="3" fill="none" strokeLinecap="round" />
    <g fill="#1b2a24">
      <ellipse cx="-36" cy="-50" rx="24" ry="7" />
      <ellipse cx="44" cy="-79" rx="27" ry="8" />
      <ellipse cx="-34" cy="-101" rx="23" ry="7" />
      <ellipse cx="30" cy="-124" rx="21" ry="6.5" />
      <ellipse cx="3" cy="-150" rx="26" ry="9" />
      <ellipse cx="-12" cy="-140" rx="16" ry="6" />
    </g>
    <g fill="#4a5a34" opacity="0.7">
      <ellipse cx="54" cy="-82" rx="14" ry="3.2" />
      <ellipse cx="38" cy="-127" rx="11" ry="2.8" />
      <ellipse cx="14" cy="-153" rx="14" ry="3.2" />
      <ellipse cx="-24" cy="-104" rx="10" ry="2.6" />
    </g>
  </g>
);

const MiniPine = ({ x, y, s = 1 }) => (
  <path d="M0 0 L-4 0 L-2 -9 L-5 -9 L0 -20 L5 -9 L2 -9 L4 0 Z"
    transform={`translate(${x},${y}) scale(${s})`} fill="#3a2c40" opacity="0.8" />
);

const Tuft = ({ x, y, s = 1, c = "#a8843c" }) => (
  <path d={`M${x} ${y} q${-5 * s} ${-16 * s} ${-12 * s} ${-20 * s} M${x} ${y} q${s} ${-20 * s} ${6 * s} ${-26 * s} M${x} ${y} q${5 * s} ${-14 * s} ${13 * s} ${-17 * s} M${x} ${y} q${-2 * s} ${-12 * s} ${s} ${-22 * s}`}
    stroke={c} strokeWidth={2 * s} fill="none" strokeLinecap="round" opacity="0.85" />
);

const Snow = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M0 0 Q18 -7 42 -4 Q66 -9 84 0 Q62 9 34 7 Q10 9 0 0 Z" fill="#8c9cc8" opacity="0.55" />
    <path d="M2 -2 Q20 -9 42 -6 Q64 -10 80 -2 Q60 4 36 3 Q12 4 2 -2 Z" fill="#e2e8f6" opacity="0.82" />
    <path d="M28 -6 Q44 -9 60 -6" stroke="#fff" strokeWidth="1.2" fill="none" opacity="0.7" />
  </g>
);

const Stone = ({ x, y, r = 8, tone = "#5a4650" }) => (
  <g>
    <ellipse cx={x - r * 1.8} cy={y + r * 0.25} rx={r * 2.2} ry={r * 0.4} fill={SHADOW} opacity="0.35" />
    <ellipse cx={x} cy={y} rx={r} ry={r * 0.64} fill={tone} />
    <path d={`M${x - r * 0.6} ${y - r * 0.3} q${r * 0.6} ${-r * 0.5} ${r * 1.3} ${-r * 0.1}`} stroke="#d8a888" strokeWidth="1.3" fill="none" opacity="0.6" />
  </g>
);

/* main négative : halo d'ocre soufflé, la main laisse la couleur de la paroi */
const Hand = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <circle r="19" fill="#a8401c" opacity="0.8" filter="url(#pa-blur2)" />
    <g fill="#2e2028">
      <ellipse cx="0" cy="5" rx="8.5" ry="9.5" />
      <ellipse cx="-9" cy="-5" rx="2.4" ry="7.5" transform="rotate(-24 -9 -5)" />
      <ellipse cx="-4" cy="-10" rx="2.4" ry="8.5" transform="rotate(-8 -4 -10)" />
      <ellipse cx="2" cy="-11" rx="2.4" ry="9" transform="rotate(4 2 -11)" />
      <ellipse cx="8" cy="-8" rx="2.3" ry="8" transform="rotate(18 8 -8)" />
      <ellipse cx="12" cy="3" rx="2.4" ry="6" transform="rotate(62 12 3)" />
    </g>
  </g>
);

/* ─── formes réutilisées ──────────────────────────────────── */

const FAR_RIDGE = "M-600 372 L0 372 L48 346 L96 322 L132 338 L176 316 L224 296 L262 270 L292 258 L318 280 L350 296 L392 318 L430 300 L470 276 L504 252 L524 246 L548 270 L580 296 L622 312 L668 296 L712 318 L760 330 L800 312 L836 296 L862 310 L894 340 L920 372 L940 392 L962 368 L990 336 L1020 304 L1048 284 L1072 292 L1104 312 L1140 298 L1172 316 L1200 330 L1800 330 L1800 452 L-600 452 Z";
const MID_RIDGE = "M-600 414 L0 414 L60 398 L120 380 L176 392 L236 372 L300 360 L352 378 L408 398 L470 408 L530 392 L590 370 L640 366 L700 388 L760 404 L820 392 L870 384 L930 400 L990 396 L1050 376 L1110 366 L1160 382 L1200 372 L1800 372 L1800 456 L-600 456 Z";
const CLIFF = "M-600 600 L-600 150 L-10 150 L34 128 L64 134 L88 112 L134 120 L166 100 L212 110 L236 138 L278 144 L296 170 L324 184 L318 232 L338 252 L330 298 L350 322 L340 374 L354 398 L342 442 L356 466 L330 504 L338 532 L318 562 L324 600 Z";
const ABRI = "M64 600 Q52 460 126 420 Q194 394 252 430 Q284 456 278 600 Z";
const NEAR_GROUND = "M-600 508 L-20 508 Q200 498 420 506 T820 502 T1220 508 L1800 508 L1800 900 L-600 900 Z";

export default function PaleoArrivalDecor() {
  return (
    <g>
      <defs>
        <linearGradient id="pa-sky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="460">
          <stop offset="0%" stopColor="#161d4e" />
          <stop offset="16%" stopColor="#2c3676" />
          <stop offset="34%" stopColor="#5d5498" />
          <stop offset="52%" stopColor="#b0689a" />
          <stop offset="68%" stopColor="#e6896c" />
          <stop offset="84%" stopColor="#f6b676" />
          <stop offset="100%" stopColor="#ffdca0" />
        </linearGradient>
        <radialGradient id="pa-sunglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff3c8" stopOpacity="0.95" />
          <stop offset="30%" stopColor="#ffd890" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffb870" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pa-ray" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ffe2a8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffe2a8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="pa-mFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9886c0" />
          <stop offset="100%" stopColor="#c89cb4" />
        </linearGradient>
        <linearGradient id="pa-alpen" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1200" y2="0">
          <stop offset="55%" stopColor="#ffb880" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffb880" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="pa-mMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a5a92" />
          <stop offset="100%" stopColor="#8e6c96" />
        </linearGradient>
        <linearGradient id="pa-hills" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6c526c" />
          <stop offset="100%" stopColor="#4c3a52" />
        </linearGradient>
        <linearGradient id="pa-bank" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a08a54" />
          <stop offset="100%" stopColor="#6e6038" />
        </linearGradient>
        <linearGradient id="pa-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffc888" />
          <stop offset="45%" stopColor="#d88a7e" />
          <stop offset="100%" stopColor="#7a62a2" />
        </linearGradient>
        <linearGradient id="pa-ground" gradientUnits="userSpaceOnUse" x1="0" y1="500" x2="0" y2="680">
          <stop offset="0%" stopColor="#92704a" />
          <stop offset="28%" stopColor="#6c5038" />
          <stop offset="70%" stopColor="#40301f" />
          <stop offset="100%" stopColor="#251a12" />
        </linearGradient>
        <linearGradient id="pa-rock" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#8a665e" />
          <stop offset="40%" stopColor="#664a4e" />
          <stop offset="100%" stopColor="#3a2a34" />
        </linearGradient>
        <radialGradient id="pa-abri" cx="50%" cy="88%" r="78%">
          <stop offset="0%" stopColor="#8e4c22" />
          <stop offset="42%" stopColor="#40261a" />
          <stop offset="100%" stopColor="#120a0a" />
        </radialGradient>
        <radialGradient id="pa-fireglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffc070" stopOpacity="0.85" />
          <stop offset="38%" stopColor="#ff8a38" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ff6a20" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pa-vig" cx="50%" cy="48%" r="78%">
          <stop offset="60%" stopColor="#0a0612" stopOpacity="0" />
          <stop offset="100%" stopColor="#0a0612" stopOpacity="0.55" />
        </radialGradient>
        <linearGradient id="pa-hide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c27a3c" />
          <stop offset="55%" stopColor="#8a5430" />
          <stop offset="100%" stopColor="#4e3020" />
        </linearGradient>
        <filter id="pa-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7" /></filter>
        <filter id="pa-blur2" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.4" /></filter>
        <filter id="pa-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="pa-mottle" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <clipPath id="pa-snow1">
          <path d="M-600 0 H1800 V330 L1200 326 L1140 306 L1100 318 L1050 296 L1000 316 L950 360 L930 380 L900 336 L860 312 L820 326 L760 334 L700 322 L650 330 L600 316 L560 300 L520 262 L480 296 L430 312 L380 326 L330 302 L290 270 L240 306 L190 326 L130 340 L90 330 L40 350 L0 350 L-600 350 Z" />
        </clipPath>
        <style>{`
          @keyframes pa-pulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }
          @keyframes pa-drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(16px, -10px); } }
        `}</style>
      </defs>

      {/* ═══ CIEL ═══ */}
      <rect x="-600" y="-400" width="2400" height="860" fill="url(#pa-sky)" />
      {[[80, 40, 1.3], [210, 74, 1], [340, 30, 1.4], [470, 62, 1], [610, 24, 1.2], [760, 52, 1], [1010, 34, 1.3], [1130, 70, 1], [1260, 44, 1.2], [-120, 60, 1.2]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#f4ecff" opacity="0.7">
          <animate attributeName="opacity" values="0.35;0.9;0.35" dur={`${2.6 + (i % 4)}s`} begin={`${i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* halo + soleil dans l'échancrure de la crête */}
      <circle cx="940" cy="372" r="340" fill="url(#pa-sunglow)" />
      {/* rayons crépusculaires */}
      <g>
        {[[520, 580], [640, 710], [770, 850], [890, 990], [1030, 1130], [1160, 1260], [380, 450]].map(([a, b], i) => (
          <path key={i} d={`M940 372 L${a} -60 L${b} -60 Z`} fill="url(#pa-ray)" opacity={0.55 + (i % 3) * 0.12} />
        ))}
      </g>
      <circle cx="940" cy="372" r="46" fill="#fff0bc" />
      <circle cx="940" cy="372" r="30" fill="#fffbe6" />
      {/* nuages allongés, ventres éclairés par le couchant */}
      <g filter="url(#pa-blur)">
        <ellipse cx="300" cy="124" rx="290" ry="14" fill="#f0a090" opacity="0.5" />
        <ellipse cx="370" cy="140" rx="160" ry="8" fill="#e07a7a" opacity="0.4" />
        <ellipse cx="760" cy="196" rx="340" ry="16" fill="#ffc890" opacity="0.55" />
        <ellipse cx="830" cy="214" rx="190" ry="8" fill="#ffe2b0" opacity="0.55" />
        <ellipse cx="1050" cy="124" rx="200" ry="11" fill="#f0a0a0" opacity="0.45" />
        <ellipse cx="120" cy="262" rx="210" ry="10" fill="#c07898" opacity="0.4" />
        <ellipse cx="560" cy="300" rx="170" ry="7" fill="#f2a888" opacity="0.4" />
      </g>
      <g fill="none" stroke="#ffe6b8" strokeLinecap="round" opacity="0.5">
        <path d="M470 194 Q620 182 780 192 T1090 190" strokeWidth="1.6" />
        <path d="M60 266 Q180 256 300 264" strokeWidth="1.2" />
        <path d="M980 126 Q1060 118 1140 126" strokeWidth="1.4" />
      </g>
      {/* oies sauvages en V */}
      <g opacity="0.75" stroke="#2a1830" strokeWidth="1.8" fill="none" strokeLinecap="round">
        <animateTransform attributeName="transform" type="translate" values="-160,0; 1360,-26" dur="46s" repeatCount="indefinite" />
        {[[0, 0], [-18, 10], [18, 10], [-36, 20], [36, 20], [-54, 30], [54, 30]].map(([dx, dy], i) => (
          <path key={i} d={`M${200 + dx} ${160 + dy} q5 -6 10 0 q5 -6 10 0`} />
        ))}
      </g>

      {/* ═══ CHAÎNE LOINTAINE GLACÉE ═══ */}
      <path d={FAR_RIDGE} fill="url(#pa-mFar)" />
      <path d={FAR_RIDGE} fill="#f2e0ee" clipPath="url(#pa-snow1)" />
      <path d={FAR_RIDGE} fill="#4a3a7a" clipPath="url(#pa-snow1)" opacity="0.14" />
      {/* faces à l'ombre, côté gauche des sommets */}
      {[[292, 258], [524, 246], [836, 296], [1048, 284], [224, 296]].map(([px, py], i) => (
        <path key={i} d={`M${px} ${py} L${px - 78} ${py + 90} L${px - 12} ${py + 98} Z`} fill="#4a3a7a" opacity="0.2" />
      ))}
      {/* arêtes éclairées côté soleil */}
      <path d="M292 258 L318 280 L350 296 M524 246 L548 270 L580 296 M836 296 L862 310 L894 340 M1048 284 L1072 292 L1104 312" stroke="#ffd0b0" strokeWidth="2" fill="none" opacity="0.55" />
      <path d={FAR_RIDGE} fill="url(#pa-alpen)" />
      <rect x="-600" y="384" width="2400" height="56" fill="#ffd2b0" opacity="0.3" filter="url(#pa-blur)" />

      {/* ═══ CHAÎNE INTERMÉDIAIRE ═══ */}
      <path d={MID_RIDGE} fill="url(#pa-mMid)" />
      <path d="M300 360 L352 378 L408 398 M640 366 L700 388 M1110 366 L1160 382" stroke="#ffc8a8" strokeWidth="2" fill="none" opacity="0.4" />
      <rect x="-600" y="412" width="2400" height="40" fill="#ffc8a0" opacity="0.26" filter="url(#pa-blur)" />

      {/* ═══ COLLINES DE STEPPE + rares pins ═══ */}
      <path d="M-600 440 L0 440 Q120 420 240 432 T480 428 T720 436 T960 430 T1200 434 L1800 434 L1800 474 L-600 474 Z" fill="url(#pa-hills)" />
      {[[60, 436, 1], [92, 438, 0.8], [330, 430, 1.1], [356, 432, 0.8], [612, 436, 1], [640, 438, 0.8], [668, 436, 0.9], [1010, 430, 1], [1034, 432, 0.8], [1160, 436, 1.1]].map(([x, y, s], i) => (
        <MiniPine key={i} x={x} y={y} s={s} />
      ))}

      {/* ═══ BERGE LOINTAINE + TROUPEAU ═══ */}
      <path d="M-600 448 L0 448 Q150 438 300 446 T600 444 T900 448 T1200 444 L1800 444 L1800 480 L-600 480 Z" fill="url(#pa-bank)" />
      <path d="M-600 448 L0 448 Q150 438 300 446 T600 444 T900 448 T1200 444 L1800 444 L1800 454 L-600 454 Z" fill="#ffd8a0" opacity="0.25" />
      {[[470, 452], [492, 454], [516, 451], [560, 455], [586, 452], [632, 454], [704, 452], [736, 454]].map(([x, y], i) => (
        <g key={i} fill="#4a3c28" opacity="0.8">
          <ellipse cx={x} cy={y - 3} rx={12 + (i % 3) * 3} ry={5} />
          <ellipse cx={x - 4} cy={y - 6} rx={7} ry={3.4} fill="#5c4c30" />
        </g>
      ))}
      <Reindeer x={778} y={462} s={0.62} />
      <Reindeer x={818} y={466} s={0.54} flip />
      <Reindeer x={852} y={463} s={0.6} graze />
      <Horse x={1018} y={464} s={0.56} />
      <Horse x={1054} y={468} s={0.5} flip />
      <Bison x={1112} y={465} s={0.58} />
      <Bison x={1150} y={469} s={0.5} flip />
      <Reindeer x={574} y={468} s={0.5} graze />

      {/* ═══ RIVIÈRE EN TRESSES ═══ */}
      <path d="M-600 490 L-20 490 Q140 478 300 488 Q420 470 560 478 T820 472 T1060 476 T1200 472 L1800 472 L1800 506 L1200 504 Q1060 512 900 502 T600 510 T300 500 Q140 508 -20 500 L-600 500 Z" fill="url(#pa-water)" />
      {/* sentier de lumière du soleil sur l'eau */}
      <ellipse cx="940" cy="488" rx="56" ry="14" fill="#ffeab4" opacity="0.65" filter="url(#pa-blur2)" />
      {[[-34, 480, 70], [-48, 485, 96], [-30, 490, 60], [-40, 496, 80], [-22, 500, 44]].map(([dx, y, w], i) => (
        <path key={i} d={`M${940 + dx} ${y} h${w}`} stroke="#fff4cc" strokeWidth="2" opacity="0.7" strokeLinecap="round">
          <animate attributeName="opacity" values="0.35;0.85;0.35" dur={`${1.8 + i * 0.5}s`} repeatCount="indefinite" />
        </path>
      ))}
      <path d="M380 484 h46 M520 490 h60 M650 484 h54 M760 494 h40 M1100 486 h70 M1010 500 h50" stroke="#ffe0b0" strokeWidth="1.4" opacity="0.4" strokeLinecap="round" />
      {/* bancs de sable et glace de rive */}
      <ellipse cx="640" cy="492" rx="34" ry="3.4" fill="#d8c4a0" opacity="0.7" />
      <ellipse cx="1070" cy="490" rx="26" ry="3" fill="#d8c4a0" opacity="0.7" />
      <path d="M-20 500 Q140 508 300 500 Q420 508 600 510 T900 502 T1200 504" stroke="#eaf0fa" strokeWidth="2.4" fill="none" opacity="0.6" />

      {/* ═══ SOL DU CAMP ═══ */}
      <path d={NEAR_GROUND} fill="url(#pa-ground)" />
      <path d={NEAR_GROUND} fill="#241608" opacity="0.38" filter="url(#pa-mottle)" />
      <path d={NEAR_GROUND} fill="#2c1c10" opacity="0.5" filter="url(#pa-grain)" />
      <path d="M-600 508 L-20 508 Q200 498 420 506 T820 502 T1220 508 L1800 508" stroke="#d8b078" strokeWidth="2.2" fill="none" opacity="0.5" />
      {/* nappe de lumière rasante côté soleil, brume au ras du sol */}
      <ellipse cx="900" cy="520" rx="420" ry="24" fill="#ffd9a0" opacity="0.24" filter="url(#pa-blur)" />
      <ellipse cx="520" cy="514" rx="380" ry="14" fill="#f0d8c0" opacity="0.16" filter="url(#pa-blur)" />
      {/* sentier piétiné du camp à la rivière */}
      <path d="M560 574 Q590 540 616 508 L636 508 Q618 548 596 584 Z" fill="#a88454" opacity="0.4" />
      <path d="M150 640 Q300 620 470 614 Q640 606 800 618" stroke="#2c1c10" strokeWidth="14" fill="none" opacity="0.18" strokeLinecap="round" />
      {/* névés oubliés dans les creux */}
      <Snow x={600} y={640} s={1.25} />
      <Snow x={1050} y={612} s={1} />
      <Snow x={14} y={655} s={1.2} />
      <Snow x={1130} y={560} s={0.8} />
      <Snow x={420} y={660} s={0.9} />
      {[[690, 560, 1], [760, 620, 1.2], [980, 540, 0.9], [1040, 650, 1.2], [470, 640, 1.1], [330, 664, 1], [860, 668, 1.2], [1180, 640, 1.2], [560, 540, 0.8], [90, 668, 1]].map(([x, y, s], i) => (
        <Tuft key={i} x={x} y={y} s={s} c={i % 2 ? "#a8843c" : "#8e7236"} />
      ))}
      {[[760, 650, 8], [980, 600, 9], [1090, 668, 11], [380, 576, 6], [640, 600, 6], [200, 668, 10], [520, 668, 7], [830, 548, 6]].map(([x, y, r], i) => (
        <Stone key={i} x={x} y={y} r={r} tone={i % 2 ? "#6a5258" : "#54424c"} />
      ))}
      {/* éclats de silex et os près du foyer */}
      {[[262, 640], [276, 648], [250, 654], [296, 638]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} l5 -2 l2 3 l-4 3 Z`} fill="#c8c2c0" opacity="0.8" />
      ))}
      <path d="M312 654 q8 -4 16 0 M322 650 l-2 8 M334 650 l2 8" stroke="#e0d4c0" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.8" />

      {/* ═══ PINS DE LA RIVE (à droite, cadrent la scène) ═══ */}
      <Pine x={1032} y={500} s={0.75} lean={4} />
      <Pine x={1100} y={566} s={1.15} lean={8} />
      <Pine x={1172} y={600} s={1.45} lean={10} />
      {/* saules nains et bouleau sur la rive gauche */}
      <g>
        {[[372, 496, 1], [404, 500, 1.2], [440, 497, 0.9]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
            <ellipse cx="-8" cy="2" rx="22" ry="3" fill={SHADOW} opacity="0.3" />
            <ellipse cx="0" cy="-8" rx="16" ry="9" fill="#5a5430" />
            <ellipse cx="-6" cy="-12" rx="9" ry="5" fill="#7a6a36" />
            <ellipse cx="8" cy="-9" rx="7" ry="4" fill="#8a5a30" />
          </g>
        ))}
        {[[470, 498], [486, 500], [498, 497]].map(([x, y], i) => (
          <g key={i}>
            <path d={`M${x} ${y} L${x - 1} ${y - 52 - i * 8}`} stroke="#e8e0d8" strokeWidth="3.4" strokeLinecap="round" />
            <path d={`M${x} ${y - 16} h3 M${x - 1} ${y - 30} h-3 M${x - 1} ${y - 42} h3`} stroke="#3a2c2c" strokeWidth="1.4" />
            <path d={`M${x - 1} ${y - 40 - i * 8} q-10 -10 -16 -8 M${x - 1} ${y - 46 - i * 8} q10 -10 15 -6`} stroke="#8a6a3a" strokeWidth="1.6" fill="none" />
          </g>
        ))}
      </g>

      {/* ═══ FALAISE CALCAIRE + ABRI SOUS ROCHE ═══ */}
      <path d={CLIFF} fill="url(#pa-rock)" />
      <path d={CLIFF} fill="#1c1018" opacity="0.32" filter="url(#pa-mottle)" />
      <path d={CLIFF} fill="#1e1218" opacity="0.6" filter="url(#pa-grain)" />
      {/* strates */}
      <path d="M-20 190 q100 -14 208 6 q64 12 136 32 M-20 258 q96 -10 190 12 q60 12 128 30 M-20 326 q86 -6 168 14 q50 12 116 26 M-20 394 q70 -4 150 10" stroke="#2c1c24" strokeWidth="4" fill="none" opacity="0.4" />
      <path d="M-10 224 q80 -8 168 8 M-10 292 q82 -6 160 12 M-10 360 q70 -4 140 10" stroke="#241820" strokeWidth="2" fill="none" opacity="0.35" />
      {/* fissures et coulées d'eau sur la paroi */}
      <path d="M120 128 q12 56 -6 118 q-8 34 4 66 M214 150 q16 62 4 124 q-6 30 6 54 M284 188 q10 44 -2 92" stroke="#26161c" strokeWidth="2.6" fill="none" opacity="0.5" />
      <path d="M156 160 q4 40 0 70 M244 220 q2 36 -2 64" stroke="#3a2c36" strokeWidth="6" fill="none" opacity="0.18" />
      {/* piqueté d'érosion */}
      {[[64, 170], [118, 214], [86, 280], [156, 236], [190, 196], [132, 330], [98, 372], [204, 296], [246, 224], [268, 270], [40, 230], [226, 340]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={2.2 + (i % 3)} ry={1.4 + (i % 2)} fill="#241620" opacity="0.45" />
      ))}
      {/* lumière rasante sur l'arête droite et le dessus */}
      <path d="M296 170 L324 184 L318 232 L338 252 L330 298 L350 322 L340 374 L354 398 L342 442 L356 466 L330 504 L338 532" stroke="#ffc890" strokeWidth="3.4" fill="none" strokeLinejoin="round" opacity="0.55" />
      <path d="M34 128 L64 134 L88 112 L134 120 L166 100 L212 110 L236 138 L278 144 L296 170" stroke="#ffd2a8" strokeWidth="2.6" fill="none" strokeLinejoin="round" opacity="0.42" />
      {/* mousses, lichens et touffes en haut de la falaise */}
      {[[236, 160], [276, 196], [262, 306], [304, 258]].map(([x, y], i) => (
        <g key={i} opacity="0.8">
          <ellipse cx={x} cy={y} rx={9 + (i % 2) * 3} ry={4} fill="#4a5030" />
          <ellipse cx={x - 4} cy={y - 2} rx={5} ry={2.5} fill="#6a6a3a" />
        </g>
      ))}
      <Tuft x={70} y={134} s={0.9} c="#c0983c" />
      <Tuft x={104} y={115} s={0.8} c="#a8843c" />
      <Tuft x={170} y={101} s={0.9} c="#c0983c" />
      <Tuft x={222} y={122} s={0.8} c="#a8843c" />
      <Pine x={40} y={140} s={0.55} lean={5} />

      {/* l'abri : cavité, voûte, suie, paroi peinte */}
      <path d={ABRI} fill="url(#pa-abri)" />
      <path d="M64 600 Q52 460 126 420 Q194 394 252 430 Q284 456 278 600" stroke="#120a0c" strokeWidth="8" fill="none" />
      <path d="M72 540 Q66 466 130 432 Q194 408 248 440" stroke="#e0b090" strokeWidth="2.4" fill="none" opacity="0.38" />
      <ellipse cx="176" cy="440" rx="54" ry="12" fill="#0c0605" opacity="0.6" filter="url(#pa-blur2)" />
      {/* peintures : mains négatives, cheval, rangée de points */}
      <Hand x={112} y={494} rot={-12} />
      <Hand x={136} y={466} rot={8} s={0.9} />
      <Hand x={234} y={486} rot={14} s={0.95} />
      <g transform="translate(176,516) scale(0.82)">
        <path d="M-40 -2 Q-40 -18 -24 -20 Q-4 -24 12 -18 Q22 -14 26 -22 Q30 -30 38 -32 L48 -28 L46 -22 Q40 -20 38 -14 Q36 -4 30 6 L28 24 L22 24 L24 4 Q14 2 4 4 L2 24 L-4 24 L-4 4 Q-14 4 -24 2 L-26 24 L-32 24 L-32 4 Q-38 6 -40 -2 Z" fill="#241410" opacity="0.92" />
        <path d="M36 -32 L38 -38 L41 -32 Z" fill="#241410" />
        <path d="M26 -22 Q28 -30 34 -34" stroke="#241410" strokeWidth="2.4" fill="none" />
        <path d="M-40 -2 Q-48 4 -46 18" stroke="#241410" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M-22 -8 Q0 0 22 -6" stroke="#b8582a" strokeWidth="3.2" fill="none" opacity="0.75" strokeLinecap="round" />
      </g>
      {[100, 124, 148, 172, 196, 220, 244].map((x, i) => (
        <circle key={i} cx={x} cy={552 + (i % 2) * 3} r="3" fill="#a8401c" opacity="0.8" />
      ))}
      {/* chute de blocs à l'entrée */}
      {[[40, 604, 16], [290, 606, 14], [320, 600, 9], [24, 590, 9]].map(([x, y, r], i) => (
        <Stone key={i} x={x} y={y} r={r} tone="#5c4650" />
      ))}
      {/* le feu éclaire l'abri et la base de la falaise */}
      <ellipse cx="190" cy="548" rx="210" ry="150" fill="url(#pa-fireglow)" opacity="0.6" style={{ animation: "pa-pulse 1.6s ease-in-out infinite" }} />

      {/* ═══ TENTE DE PEAUX, LANCES, SÉCHOIR, TAS DE BOIS ═══ */}
      <g transform="translate(392,534)">
        <ellipse cx="-16" cy="4" rx="78" ry="9" fill={SHADOW} opacity="0.4" />
        <path d="M-60 0 L-6 -120 L52 0 Z" fill="url(#pa-hide)" />
        <path d="M-60 0 L-6 -120 L-16 0 Z" fill="#d08a44" opacity="0.55" />
        <path d="M-6 -120 L52 0 L-16 0 Z" fill="#3a2418" opacity="0.38" />
        <path d="M-60 0 L-6 -120 L52 0 Z" fill="#1e120c" opacity="0.4" filter="url(#pa-grain)" />
        <path d="M-6 -120 L-30 0 M-6 -120 L18 0 M-33 -50 Q-8 -44 22 -52 M-46 -22 Q-8 -14 36 -24" stroke="#2c1a10" strokeWidth="1.5" strokeDasharray="5 3" fill="none" opacity="0.75" />
        <path d="M-18 0 L-8 -40 L4 0 Z" fill="#160a06" />
        <path d="M-15 0 L-8 -32 L1 0 Z" fill="#b0602a" opacity="0.5" />
        <path d="M-6 -120 L-18 -148 M-6 -120 L-1 -152 M-6 -120 L8 -146" stroke="#4a2c18" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M-2 -150 q-8 -18 2 -34 q10 -16 -2 -34" stroke="#c0b4c0" strokeWidth="9" fill="none" opacity="0.22" strokeLinecap="round" filter="url(#pa-blur2)" />
      </g>
      {[[388, 540, 364, 408, 0], [400, 541, 382, 420, 1]].map(([x1, y1, x2, y2, k]) => (
        <g key={k}>
          <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke="#5a3a20" strokeWidth="3" strokeLinecap="round" />
          <path d={`M${x2} ${y2} l-5 4 l5 -24 l5 24 Z`} fill="#cbb89a" stroke="#6a5a48" strokeWidth="0.8" />
        </g>
      ))}
      <g transform="translate(618,534)">
        <ellipse cx="-14" cy="4" rx="52" ry="6" fill={SHADOW} opacity="0.38" />
        <path d="M-34 0 L-26 -64 L-18 0 M18 0 L26 -64 L34 0" stroke="#4a2c18" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <path d="M-32 -60 L32 -60" stroke="#5a3a20" strokeWidth="4" strokeLinecap="round" />
        {[-20, -10, 2, 12, 22].map((dx, i) => (
          <path key={i} d={`M${dx} -58 l${i % 2 ? 1 : -1} ${20 + (i % 3) * 6}`} stroke={i % 2 ? "#a0482e" : "#7a2c22"} strokeWidth="5" strokeLinecap="round" />
        ))}
        <path d="M-27 -58 q-4 18 2 28 q6 -2 6 -8 q-2 -12 -2 -20" fill="#c89a62" opacity="0.9" />
        <path d="M28 -58 q-3 12 0 20" stroke="#c8d0d8" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g transform="translate(78,632)">
        <ellipse cx="-14" cy="6" rx="46" ry="6" fill={SHADOW} opacity="0.4" />
        {[[0, 0, 0], [0, -11, 4], [-4, -22, -3]].map(([dx, dy, rot], i) => (
          <g key={i} transform={`translate(${dx},${dy}) rotate(${rot})`}>
            <rect x="-30" y="-6" width="60" height="12" rx="6" fill="#4a2e1c" />
            <rect x="-30" y="-6" width="60" height="4" rx="2" fill="#7a5030" opacity="0.7" />
            <ellipse cx="30" cy="0" rx="5" ry="6" fill="#a87c4c" />
            <ellipse cx="30" cy="0" rx="2.4" ry="3" fill="none" stroke="#6a4a2c" strokeWidth="0.8" />
          </g>
        ))}
      </g>

      {/* ═══ LE FEU DU CLAN ═══ */}
      <g transform="translate(180,600)">
        <circle r="170" fill="url(#pa-fireglow)" style={{ animation: "pa-pulse 1.5s ease-in-out infinite" }} />
        <ellipse cx="0" cy="6" rx="64" ry="16" fill="#140a06" opacity="0.65" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const sy = Math.sin(a);
          if (sy >= 0.05) return null;
          return <Stone key={`b${i}`} x={Math.cos(a) * 52} y={sy * 15} r={8 + (i % 3)} tone="#4c3c44" />;
        })}
        <g strokeLinecap="round">
          <path d="M-36 8 L30 -2" stroke="#2c1a10" strokeWidth="10" />
          <path d="M-30 -2 L36 8" stroke="#3a2214" strokeWidth="10" />
          <path d="M-36 8 L30 -2" stroke="#e07a30" strokeWidth="2" opacity="0.55" />
          <path d="M-30 -2 L36 8" stroke="#c06020" strokeWidth="2" opacity="0.55" />
        </g>
        <ellipse cx="0" cy="3" rx="26" ry="5" fill="#ff7a28" opacity="0.7" />
        <g>
          <animateTransform attributeName="transform" type="scale" values="1 1; 1.06 1.14; 0.96 0.94; 1.03 1.08; 1 1" dur="1.1s" repeatCount="indefinite" />
          <path d="M-18 2 Q-24 -18 -8 -36 Q-4 -24 0 -56 Q9 -32 15 -36 Q26 -16 18 2 Z" fill="#ff8a30" />
          <path d="M-11 2 Q-15 -11 -4 -28 Q0 -15 2 -42 Q9 -22 12 -24 Q17 -9 11 2 Z" fill="#ffc040" />
          <path d="M-5 2 Q-8 -7 0 -19 Q8 -7 5 2 Z" fill="#fff0b0" />
        </g>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const sy = Math.sin(a);
          if (sy < 0.05) return null;
          return <Stone key={`f${i}`} x={Math.cos(a) * 52} y={sy * 15} r={8 + (i % 3)} tone="#5a4850" />;
        })}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={-6 + i * 3} cy="-14" r="1.5" fill="#ffd070">
            <animate attributeName="cy" values="-14;-120" dur={`${2.2 + (i % 3) * 0.7}s`} begin={`${i * 0.45}s`} repeatCount="indefinite" />
            <animate attributeName="cx" values={`${-6 + i * 3};${-26 + i * 9}`} dur={`${2.2 + (i % 3) * 0.7}s`} begin={`${i * 0.45}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur={`${2.2 + (i % 3) * 0.7}s`} begin={`${i * 0.45}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <path d="M0 -60 Q-16 -94 2 -126 Q22 -160 -4 -194 Q-24 -226 -2 -262" stroke="#b0a8b4" strokeWidth="20" fill="none" strokeLinecap="round" opacity="0.2" filter="url(#pa-blur)">
          <animate attributeName="opacity" values="0.12;0.26;0.12" dur="4s" repeatCount="indefinite" />
        </path>
        <path d="M0 -60 Q-14 -92 2 -122 Q18 -150 -2 -182" stroke="#c8c0cc" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.22" filter="url(#pa-blur2)" />
      </g>

      {/* ═══ ATMOSPHÈRE : lueur du soleil, poussière, vignette ═══ */}
      <ellipse cx="900" cy="470" rx="320" ry="150" fill="url(#pa-sunglow)" opacity="0.32" />
      {[[620, 470], [700, 520], [780, 450], [980, 540], [330, 500], [470, 470]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.7" fill="#ffe8b8" opacity="0.6" style={{ animation: `pa-drift ${4 + i}s ease-in-out infinite` }} />
      ))}
      <rect x="-600" y="-300" width="2400" height="1200" fill="url(#pa-vig)" pointerEvents="none" />
    </g>
  );
}
