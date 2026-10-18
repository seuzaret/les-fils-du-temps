/* ============================================================
   JEU 2B — décors et portrait de Léa
   ------------------------------------------------------------
   Trois décors plein cadre (viewBox 1000×560, `slice`) :
     StageChantier : galerie au-dessus du Puits, la veille du scellement
     StageAtelier  : l'atelier de Léa (fond discret, les deux documents
                     de l'activité s'affichent par-dessus)
     StageToast    : la salle commune, la longue table et les verres
   Le bandeau de dialogue occupe le bas de l'écran (≈ y > 410) :
   tout ce qui compte est dessiné plus haut.
   ============================================================ */

/* Paysage : le décor remplit l'écran (rogné). Portrait (téléphone) : décor entier, centré. */
const PAR = () => (typeof window !== "undefined" && window.innerHeight > window.innerWidth * 1.1 ? "xMidYMid meet" : "xMidYMid slice");
const FILL = { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" };

const polar = (r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [(Math.cos(a) * r).toFixed(1), (Math.sin(a) * r).toFixed(1)];
};
/* secteur d'anneau entre deux rayons et deux angles */
const wedge = (a0, a1, r0, r1) => {
  const [x0, y0] = polar(r1, a0), [x1, y1] = polar(r1, a1);
  const [x2, y2] = polar(r0, a1), [x3, y3] = polar(r0, a0);
  return `M${x0} ${y0} A${r1} ${r1} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${r0} ${r0} 0 0 0 ${x3} ${y3} Z`;
};

/* ───────────────────────── Léa Vermet ───────────────────────── */
export function PortraitLea({ mood = "neutre" }) {
  const eyes = mood === "content" ? -1 : mood === "vexe" ? 1.5 : 0;
  return (
    <svg viewBox="0 0 200 240" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="200" height="240" fill="#26303a" />
      <circle cx="100" cy="90" r="80" fill="#ff9a5a" opacity="0.13" />
      {/* salopette bleu-vert, tee-shirt jaune */}
      <path d="M20 240 L20 190 Q20 158 56 150 L144 150 Q180 158 180 190 L180 240 Z" fill="#2f7f86" stroke="#123c40" strokeWidth="1.5" />
      <path d="M62 148 L100 170 L138 148 L130 140 Q100 156 70 140 Z" fill="#f2c14e" stroke="#9a7a20" strokeWidth="1" />
      <path d="M70 150 L76 184 L88 184 L84 154 Z M130 150 L124 184 L112 184 L116 154 Z" fill="#2f7f86" stroke="#123c40" strokeWidth="1.2" />
      <rect x="72" y="184" width="56" height="56" fill="#34909a" stroke="#123c40" strokeWidth="1.2" />
      {/* poche de bavette avec outils */}
      <rect x="82" y="196" width="36" height="26" fill="#2a7078" stroke="#123c40" strokeWidth="1" />
      <path d="M90 196 L90 188 M100 196 L100 186 M110 196 L110 190" stroke="#d8d2c0" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="76" cy="184" r="2.4" fill="#f2c14e" /><circle cx="124" cy="184" r="2.4" fill="#f2c14e" />
      {/* cou */}
      <ellipse cx="100" cy="135" rx="16" ry="12" fill="#e8b996" />
      {/* tête */}
      <ellipse cx="100" cy="82" rx="49" ry="57" fill="#f4cfae" stroke="#8a5a38" strokeWidth="1.5" />
      {/* cheveux courts bouclés, auburn */}
      <g fill="#b8501f" stroke="#7a3412" strokeWidth="0.8">
        {[[58, 56, 15], [76, 38, 16], [100, 32, 17], [124, 38, 16], [142, 56, 15], [50, 80, 11], [150, 80, 11], [64, 46, 12], [136, 46, 12]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
      </g>
      <path d="M58 70 Q66 52 100 50 Q134 52 142 70 Q124 62 100 64 Q76 62 58 70 Z" fill="#c25a24" />
      {/* lunettes de soudeur relevées sur le front */}
      <path d="M52 58 Q100 44 148 58" stroke="#33333c" strokeWidth="7" fill="none" strokeLinecap="round" />
      <circle cx="80" cy="53" r="10" fill="#9ad6e8" stroke="#22222a" strokeWidth="3" opacity="0.92" />
      <circle cx="120" cy="53" r="10" fill="#9ad6e8" stroke="#22222a" strokeWidth="3" opacity="0.92" />
      <path d="M74 49 q4 -4 9 -3" stroke="#fff" strokeWidth="1.6" fill="none" opacity="0.7" strokeLinecap="round" />
      {/* taches de rousseur + trace de graisse */}
      {[[72, 100], [78, 104], [84, 99], [116, 99], [122, 104], [128, 100]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.1" fill="#b87850" opacity="0.8" />
      ))}
      <path d="M128 92 q8 2 12 8" stroke="#3a2a22" strokeWidth="3" strokeLinecap="round" opacity="0.28" fill="none" />
      {/* yeux */}
      <ellipse cx="82" cy="84" rx="6.5" ry="4.6" fill="#f8f4e8" />
      <ellipse cx="118" cy="84" rx="6.5" ry="4.6" fill="#f8f4e8" />
      <circle cx={82 + eyes} cy="84" r="2.9" fill="#3a6a4a" />
      <circle cx={118 + eyes} cy="84" r="2.9" fill="#3a6a4a" />
      <circle cx={82 + eyes} cy="84" r="1.2" fill="#10201a" />
      <circle cx={118 + eyes} cy="84" r="1.2" fill="#10201a" />
      <path d={mood === "vexe" ? "M73 74 q8 -1 16 3 M111 77 q8 -4 16 -3" : "M73 75 q8 -4 16 -1 M111 74 q8 -3 16 1"} stroke="#8a3c14" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M100 90 L97 106 L103 106" stroke="#b07850" strokeWidth="1" fill="none" />
      {mood === "content"
        ? <path d="M82 120 Q100 134 118 120" stroke="#9a3c2c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        : mood === "vexe"
        ? <path d="M86 127 Q100 120 114 127" stroke="#9a3c2c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        : <path d="M86 124 Q100 128 114 124" stroke="#9a3c2c" strokeWidth="2.2" fill="none" strokeLinecap="round" />}
    </svg>
  );
}

/* ───────────────────────── 1 · le Puits ───────────────────────── */
export function StageChantier() {
  return (
    <svg viewBox="0 0 1000 560" preserveAspectRatio={PAR()} style={FILL}>
      <defs>
        <linearGradient id="j2c-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#080d18" /><stop offset="55%" stopColor="#152036" /><stop offset="100%" stopColor="#262130" />
        </linearGradient>
        <linearGradient id="j2c-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#222a3a" /><stop offset="100%" stopColor="#090d15" />
        </linearGradient>
        <linearGradient id="j2c-plate" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7a8498" /><stop offset="100%" stopColor="#303848" />
        </linearGradient>
        <radialGradient id="j2c-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#bdf0ff" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#4aa8d8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#4aa8d8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="j2c-lamp" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffc880" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffc880" stopOpacity="0" />
        </radialGradient>
        <pattern id="j2c-hazard" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="16" fill="#f2c14e" /><rect x="8" width="8" height="16" fill="#1a1408" />
        </pattern>
      </defs>
      <rect width="1000" height="560" fill="url(#j2c-wall)" />

      {/* voûte de la grande salle : nervures */}
      <g stroke="#2c3c58" strokeWidth="2" fill="none" opacity="0.75">
        <path d="M-120 300 Q500 -250 1120 300" />
        <path d="M-40 300 Q500 -150 1040 300" />
        <path d="M60 300 Q500 -60 940 300" />
        <path d="M500 -10 L500 300 M300 20 L250 300 M700 20 L750 300 M130 70 L90 300 M870 70 L910 300" />
      </g>
      {/* sas latéraux */}
      {[70, 872].map((x) => (
        <g key={x} transform={`translate(${x},190)`}>
          <rect width="58" height="110" fill="#10182a" stroke="#4a5a74" strokeWidth="2" />
          <path d="M8 24 l21 -12 l21 12 M8 48 l21 -12 l21 12" stroke="#f2c14e" strokeWidth="2.4" fill="none" opacity="0.7" />
        </g>
      ))}
      {/* lampes de chantier */}
      {[[170, 62], [335, 36], [500, 28], [665, 36], [830, 62]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="70" fill="url(#j2c-lamp)">
            <animate attributeName="opacity" values="0.8;1;0.7;1" dur={`${3 + (i % 3)}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={x} cy={y} r="6" fill="#ffe2b0" />
        </g>
      ))}

      {/* sol */}
      <rect y="232" width="1000" height="330" fill="url(#j2c-floor)" />
      <g stroke="#2e3850" strokeWidth="1" opacity="0.7">
        {[-300, -100, 100, 300, 500, 700, 900, 1100, 1300].map((x) => <line key={x} x1="500" y1="250" x2={x} y2="560" />)}
        {[262, 290, 330, 390, 470].map((y) => <line key={y} x1="0" y1={y} x2="1000" y2={y} />)}
      </g>

      {/* le Puits, vu en perspective : lèvre, anneau, plaques d'obturation */}
      <ellipse cx="500" cy="347" rx="306" ry="80" fill="#2a3242" />
      <g transform="translate(500,335) scale(1,0.26)">
        <circle r="300" fill="#0d121b" stroke="#6a7486" strokeWidth="16" />
        <circle r="280" fill="#04070c" />
        <circle r="262" fill="none" stroke="#1c283c" strokeWidth="6" />
        <circle r="238" fill="none" stroke="#17223a" strokeWidth="6" />
        <circle r="200" fill="url(#j2c-glow)" />
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0;-3;0;2;0" dur="11s" repeatCount="indefinite" />
          {Array.from({ length: 8 }).map((_, i) => (
            <path key={i} d={wedge(i * 45 + 3, i * 45 + 42, 150, 284)} fill="url(#j2c-plate)" stroke="#10151e" strokeWidth="4" />
          ))}
        </g>
        {/* balises sur la lèvre */}
        {Array.from({ length: 16 }).map((_, i) => {
          const [x, y] = polar(300, i * 22.5);
          return (
            <circle key={i} cx={x} cy={y} r="7" fill="#ff9a3c">
              <animate attributeName="opacity" values="1;0.2;1" dur="1.6s" begin={`${(i % 4) * 0.4}s`} repeatCount="indefinite" />
            </circle>
          );
        })}
      </g>
      {/* lueur froide qui monte du fond */}
      <ellipse cx="500" cy="300" rx="190" ry="60" fill="#7fd8ff" opacity="0.1" />
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={i} cx={430 + (i * 37) % 140} cy="330" r="1.6" fill="#cfefff" opacity="0.7">
          <animate attributeName="cy" values="330;150" dur={`${5 + (i % 5)}s`} begin={`${i * 0.7}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.7;0" dur={`${5 + (i % 5)}s`} begin={`${i * 0.7}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* portique + dernière plaque suspendue */}
      <g fill="#2a3244" stroke="#4a566c" strokeWidth="1.5">
        <rect x="168" y="70" width="16" height="232" />
        <rect x="816" y="70" width="16" height="232" />
        <rect x="168" y="64" width="664" height="18" />
      </g>
      <g stroke="#4a566c" strokeWidth="2" opacity="0.8">
        <path d="M184 82 L260 64 M816 82 L740 64 M184 150 L168 120 M816 150 L832 120" />
      </g>
      <rect x="486" y="82" width="28" height="12" fill="#f2c14e" />
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 500 94;1.4 500 94;0 500 94;-1.4 500 94;0 500 94" dur="6.5s" repeatCount="indefinite" />
        <line x1="500" y1="94" x2="500" y2="178" stroke="#8a94a8" strokeWidth="3" strokeDasharray="6 3" />
        <path d="M426 178 L574 178 L558 214 L442 214 Z" fill="url(#j2c-plate)" stroke="#10151e" strokeWidth="2" />
        <path d="M434 192 L566 192 L561 205 L439 205 Z" fill="url(#j2c-hazard)" opacity="0.9" />
      </g>

      {/* panneau de chantier */}
      <g transform="translate(76,96)">
        <line x1="20" y1="-30" x2="20" y2="0" stroke="#5a6270" strokeWidth="2" />
        <line x1="190" y1="-30" x2="190" y2="0" stroke="#5a6270" strokeWidth="2" />
        <rect width="210" height="58" fill="#120f08" stroke="#f2c14e" strokeWidth="2" />
        <rect width="210" height="9" fill="url(#j2c-hazard)" />
        <text x="105" y="30" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="13" fontWeight="800" fill="#f2c14e" letterSpacing="2">PUITS · SCELLEMENT</text>
        <text x="105" y="48" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="11" fill="#c8d4e2" letterSpacing="2">DEMAIN · 12 MARS 2047</text>
      </g>

      {/* ouvriers qui font les derniers réglages */}
      {[[130, 300, 0], [250, 318, 1]].map(([x, y, k]) => (
        <g key={k} transform={`translate(${x},${y})`}>
          <animateTransform attributeName="transform" type="translate" values={`${x} ${y};${x + 46} ${y};${x} ${y}`} dur={`${9 + k * 3}s`} repeatCount="indefinite" additive="replace" />
          <ellipse cx="0" cy="26" rx="12" ry="3" fill="#000" opacity="0.4" />
          <rect x="-7" y="2" width="14" height="22" fill="#e8742a" />
          <circle cx="0" cy="-5" r="7" fill="#d8a888" />
          <path d="M-8 -7 Q0 -16 8 -7 Z" fill="#f2c14e" />
          <rect x="-4" y="22" width="3" height="8" fill="#222a36" /><rect x="1" y="22" width="3" height="8" fill="#222a36" />
        </g>
      ))}
      {/* caisses de matériel */}
      <g>
        <rect x="860" y="304" width="50" height="34" fill="#4a3a28" stroke="#2a2014" strokeWidth="1.5" />
        <rect x="900" y="316" width="42" height="26" fill="#3a4a58" stroke="#1a2430" strokeWidth="1.5" />
        <path d="M860 304 l50 34 M860 338 l50 -34" stroke="#2a2014" strokeWidth="1" opacity="0.6" />
      </g>
      {/* garde-corps premier plan */}
      <g fill="#10151e" stroke="#3a4458" strokeWidth="1.5">
        <rect x="0" y="392" width="1000" height="6" />
        {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={i * 76 + 10} y="392" width="6" height="56" />)}
      </g>
    </svg>
  );
}

/* ───────────────────────── 2 · l'atelier de Léa ───────────────────────── */
export function StageAtelier() {
  return (
    <svg viewBox="0 0 1000 560" preserveAspectRatio={PAR()} style={FILL}>
      <defs>
        <linearGradient id="j2a-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1820" /><stop offset="100%" stopColor="#14242c" />
        </linearGradient>
        <linearGradient id="j2a-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd98a" stopOpacity="0.38" /><stop offset="100%" stopColor="#ffd98a" stopOpacity="0" />
        </linearGradient>
        <pattern id="j2a-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 L0 0 L0 40" fill="none" stroke="#2a4a5a" strokeWidth="0.7" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="1000" height="560" fill="url(#j2a-wall)" />
      <rect width="1000" height="360" fill="url(#j2a-grid)" />

      {/* plan du Puits punaisé au mur */}
      <g transform="translate(500,170)" opacity="0.5">
        <rect x="-190" y="-120" width="380" height="240" fill="#0e2a3a" stroke="#4a8aa8" strokeWidth="1.5" />
        {[100, 76, 52, 28].map((r) => <circle key={r} r={r} fill="none" stroke="#5aa8c8" strokeWidth="1" />)}
        <path d="M-100 0 H100 M0 -100 V100" stroke="#5aa8c8" strokeWidth="0.8" />
        <text x="-176" y="-100" fontFamily="ui-monospace,monospace" fontSize="10" fill="#8ad0e8" letterSpacing="2">PUITS · COUPE A-A</text>
        <text x="-176" y="108" fontFamily="ui-monospace,monospace" fontSize="9" fill="#8ad0e8" letterSpacing="2">L. VERMET · ÉCHELLE 1/200</text>
      </g>

      {/* étagères de pièces, à gauche */}
      <g transform="translate(24,70)">
        {[0, 80, 160, 240].map((y, k) => (
          <g key={y} transform={`translate(0,${y})`}>
            <rect y="62" width="190" height="8" fill="#3a2a1c" />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={8 + i * 46} y={62 - (24 + ((i + k) % 3) * 8)} width={34} height={24 + ((i + k) % 3) * 8} fill={["#3a5a68", "#5a4a30", "#4a3a5a", "#2a5a4a"][(i + k) % 4]} stroke="#10181e" strokeWidth="1" />
            ))}
          </g>
        ))}
      </g>
      {/* panneau d'outils, à droite */}
      <g transform="translate(790,86)">
        <rect width="186" height="190" fill="#1c2a30" stroke="#3a4a52" strokeWidth="2" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${24 + i * 40},26)`}>
            <circle r="9" fill="none" stroke="#c8d0d8" strokeWidth="3" />
            <rect x="-2.5" y="8" width="5" height="52" fill="#c8d0d8" />
            <rect x="-5" y="62" width="10" height="18" fill="#e8742a" />
          </g>
        ))}
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${40 + i * 52},128)`}>
            <rect x="-4" y="-18" width="8" height="48" fill="#8a94a4" />
            <rect x="-9" y="26" width="18" height="30" rx="3" fill={["#f2c14e", "#e8742a", "#3a9a8a"][i]} />
          </g>
        ))}
      </g>

      {/* lampe d'établi : cône de lumière */}
      <path d="M868 40 L600 380 L960 380 Z" fill="url(#j2a-cone)" />
      <g transform="translate(868,34)">
        <path d="M0 0 L-40 40 L-80 20" stroke="#6a7486" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M-96 8 L-62 28 L-78 44 L-104 28 Z" fill="#c8d0d8" stroke="#6a7486" strokeWidth="1.5" />
      </g>

      {/* établi */}
      <rect y="352" width="1000" height="40" fill="#3a2a1c" />
      <rect y="392" width="1000" height="170" fill="#1e150d" />
      <g transform="translate(120,352)">
        <rect y="-14" width="120" height="14" fill="#1a3a30" stroke="#0a1a14" strokeWidth="1.5" />
        {[14, 40, 66, 92].map((x, i) => (
          <rect key={x} x={x} y="-12" width="9" height="5" fill={["#5eff9e", "#ffd166", "#7fd8ff", "#ff5a7a"][i]}>
            <animate attributeName="opacity" values="1;0.2;1" dur={`${1.2 + i * 0.4}s`} repeatCount="indefinite" />
          </rect>
        ))}
      </g>
      <g transform="translate(640,352)">
        <rect x="-36" y="-26" width="46" height="26" rx="4" fill="#5a4a38" /><path d="M10 -18 q16 2 10 14 q-4 6 -10 4" stroke="#5a4a38" strokeWidth="4" fill="none" />
        <circle cx="-22" cy="-34" r="5" fill="#e8e0d0" opacity="0.3"><animate attributeName="cy" values="-34;-54" dur="3s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.3;0" dur="3s" repeatCount="indefinite" /></circle>
      </g>
      <g transform="translate(300,352)">
        <rect x="0" y="-6" width="90" height="6" fill="#8a94a4" />
        <path d="M90 -3 L130 -8" stroke="#c8d0d8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="132" cy="-8" r="3" fill="#ff8a3a"><animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" /></circle>
      </g>
    </svg>
  );
}

/* ───────────────────────── 3 · la salle commune ───────────────────────── */
function Bust({ x, y, skin, cloth, kind, s = 1 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-56 90 Q-56 30 -24 22 L24 22 Q56 30 56 90 Z" fill={cloth} stroke="#0a0f18" strokeWidth="1.5" />
      <rect x="-9" y="8" width="18" height="18" fill={skin} />
      {kind === "braids" && (
        <g fill="#1a1408">
          <path d="M-26 -8 Q-28 36 -34 62 L-26 62 Q-20 30 -18 4 Z" />
          <path d="M26 -8 Q28 36 34 62 L26 62 Q20 30 18 4 Z" />
        </g>
      )}
      <ellipse cx="0" cy="-6" rx="24" ry="29" fill={skin} stroke="#5a3818" strokeWidth="1.2" />
      {kind === "braids" && <path d="M-26 -10 Q-28 -40 0 -42 Q28 -40 26 -10 Q10 -24 0 -22 Q-10 -24 -26 -10 Z" fill="#1a1408" />}
      {kind === "white" && (
        <g fill="#e8e8e0" stroke="#8a8880" strokeWidth="0.8">
          <path d="M-25 -12 Q-24 -40 0 -40 Q24 -40 25 -12 Q12 -26 0 -24 Q-12 -26 -25 -12 Z" />
          <path d="M-16 6 Q0 34 16 6 Q14 20 6 26 Q0 30 -6 26 Q-14 20 -16 6 Z" />
        </g>
      )}
      {kind === "curls" && (
        <g fill="#b8501f" stroke="#7a3412" strokeWidth="0.8">
          {[[-20, -26, 11], [0, -34, 12], [20, -26, 11], [-27, -10, 8], [27, -10, 8]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} />)}
        </g>
      )}
      <circle cx="-8" cy="-5" r="2" fill="#1a1008" /><circle cx="8" cy="-5" r="2" fill="#1a1008" />
      <path d="M-7 8 q7 4 14 0" stroke="#5a2818" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function StageToast({ raised = false }) {
  /* verres au repos (x, y) → point de tintement (tx, ty), à droite de Léa et
     à gauche d'Elias pour ne pas masquer les visages. Le dernier verre est celui du joueur. */
  const cups = [
    { x: 310, y: 322, tx: 548, ty: 272, c: "#bfe8ff" },
    { x: 440, y: 326, tx: 566, ty: 262, c: "#bfe8ff" },
    { x: 700, y: 322, tx: 592, ty: 272, c: "#bfe8ff" },
    { x: 580, y: 360, tx: 570, ty: 280, c: "#ffe2a8" },
  ];
  return (
    <svg viewBox="0 0 1000 560" preserveAspectRatio={PAR()} style={FILL}>
      <defs>
        <linearGradient id="j2t-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b1018" /><stop offset="100%" stopColor="#2a2028" />
        </linearGradient>
        <radialGradient id="j2t-warm" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffb870" stopOpacity="0.4" /><stop offset="100%" stopColor="#ffb870" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="j2t-water" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#bdf0ff" stopOpacity="0.8" /><stop offset="100%" stopColor="#bdf0ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="560" fill="url(#j2t-wall)" />
      <ellipse cx="500" cy="170" rx="520" ry="220" fill="url(#j2t-warm)" />

      {/* voûte + nervures */}
      <g stroke="#2c3850" strokeWidth="1.6" fill="none" opacity="0.7">
        <path d="M-60 250 Q500 -190 1060 250" />
        <path d="M60 250 Q500 -80 940 250" />
        <path d="M500 -20 L500 250 M280 30 L220 250 M720 30 L780 250" />
      </g>
      {/* guirlandes lumineuses */}
      {[[130, 70], [320, 112], [500, 132], [680, 112], [870, 70]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x - 90} ${y - 24} Q${x} ${y + 26} ${x + 90} ${y - 24}`} stroke="#4a5060" strokeWidth="1" fill="none" />
          {[-66, -34, 0, 34, 66].map((dx, j) => (
            <circle key={j} cx={x + dx} cy={y + (Math.abs(dx) < 40 ? 14 : 3)} r="3" fill={["#ff8a3a", "#5eff9e", "#7fd8ff", "#ffd166", "#ff5a7a"][(i + j) % 5]}>
              <animate attributeName="opacity" values="0.5;1;0.5" dur={`${1.6 + ((i + j) % 3) * 0.5}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      ))}
      {/* banderole */}
      <g transform="translate(500,176)">
        <rect x="-170" y="-14" width="340" height="28" fill="#1a1408" stroke="#c8a848" strokeWidth="1.5" opacity="0.92" />
        <text y="5" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="13" fontWeight="700" fill="#e8c878" letterSpacing="3">LA VEILLE DU PUITS</text>
      </g>

      {/* convives, derrière la table */}
      <Bust x={290} y={236} skin="#c8946a" cloth="#3a5878" kind="braids" />
      <Bust x={430} y={242} skin="#f4cfae" cloth="#2f7f86" kind="curls" />
      <Bust x={730} y={236} skin="#e0b898" cloth="#8a6848" kind="white" />

      {/* longue table nappée */}
      <path d="M90 300 L910 300 L990 396 L10 396 Z" fill="#e8e0d0" stroke="#9a8a6a" strokeWidth="1.5" />
      <path d="M90 300 L910 300 L912 306 L88 306 Z" fill="#c8bca0" />
      {/* carafe d'eau du Puits au centre */}
      <g transform="translate(868,318)">
        <ellipse cx="0" cy="-20" rx="44" ry="34" fill="url(#j2t-water)">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
        </ellipse>
        <path d="M-14 0 L-18 -34 Q-16 -52 -6 -54 L6 -54 Q16 -52 18 -34 L14 0 Z" fill="#cfefff" stroke="#6aa8c8" strokeWidth="1.5" opacity="0.9" />
        <path d="M-14 -26 L14 -26" stroke="#6aa8c8" strokeWidth="1" opacity="0.8" />
      </g>
      {/* assiettes */}
      {[200, 330, 470, 640, 770].map((x) => <ellipse key={x} cx={x} cy={350} rx="30" ry="7" fill="#f4eee0" stroke="#bfb298" strokeWidth="1" />)}

      {/* verres : se lèvent au moment du toast */}
      {cups.map((c, i) => (
        <g key={i} style={{ transform: raised ? `translate(${c.tx - c.x}px,${c.ty - c.y}px)` : "translate(0px,0px)", transition: "transform 900ms cubic-bezier(.3,.8,.3,1)" }}>
          <path d={`M${c.x - 10} ${c.y} L${c.x - 7} ${c.y - 26} L${c.x + 7} ${c.y - 26} L${c.x + 10} ${c.y} Z`} fill={c.c} stroke="#6a8aa0" strokeWidth="1.4" opacity="0.9" />
          <path d={`M${c.x - 8} ${c.y - 10} L${c.x + 8} ${c.y - 10}`} stroke="#fff" strokeWidth="1" opacity="0.6" />
        </g>
      ))}
      {/* étincelle du tintement */}
      {raised && (
        <g transform="translate(570,250)">
          <g>
            <animateTransform attributeName="transform" type="scale" values="0.2;1.4;1" dur="0.7s" fill="freeze" />
            <path d="M0 -26 L5 -5 L26 0 L5 5 L0 26 L-5 5 L-26 0 L-5 -5 Z" fill="#fff6c8" opacity="0.95" />
            <path d="M-18 -18 L-4 -4 M18 -18 L4 -4 M-18 18 L-4 4 M18 18 L4 4" stroke="#ffe08a" strokeWidth="2" />
          </g>
        </g>
      )}
    </svg>
  );
}
