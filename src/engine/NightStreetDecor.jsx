/* ============================================================
   DÉCOR — La rue du joueur, 3 h 14 du matin (intro, arrivée de MARTINE)
   ------------------------------------------------------------
   Lotissement endormi sous la pleine lune : ciel profond, voie
   lactée, halo orangé de la ville à l'horizon, colline et château
   d'eau au loin, pavillons (seule la chambre du joueur est allumée,
   plus un écran bleu chez le voisin), haies, clôture, arbres éclairés
   par la lune côté gauche, poteaux et fils électriques, trottoir,
   bordure, chaussée mouillée, flaques, lampadaires et leurs cônes de
   lumière, une voiture garée, un chat sur la clôture.

   À dessiner DANS le <svg viewBox="0 0 1200 680"> de SlideOutside.
   Ne contient NI MARTINE NI son halo (gérés par SlideOutside).
   Le centre de la chaussée (≈ 600, 560) reste dégagé pour l'atterrissage.
   ============================================================ */

/* pseudo-aléatoire déterministe (mêmes étoiles à chaque rendu) */
const rnd = (seed) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };

const STARS = (() => {
  const r = rnd(7);
  return Array.from({ length: 140 }, () => {
    const x = r() * 1200, y = r() * 430;
    return { x, y, rad: r() < 0.12 ? 1.6 : r() < 0.5 ? 1 : 0.6, o: 0.35 + r() * 0.6, tw: r() < 0.18 };
  }).filter((st) => Math.hypot(st.x - 200, st.y - 130) > 70);
})();

/* fenêtre de pavillon : allumée (lit) ou noire avec reflet de lune */
function Win({ x, y, w = 34, h = 40, lit = null, frame = "#2a2c40", curtain }) {
  return (
    <g>
      <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx="1.5" fill={frame} />
      {lit ? (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={lit} />
          {curtain && <path d={`M${x} ${y} L${x + w * 0.28} ${y} Q${x + w * 0.2} ${y + h * 0.6} ${x + w * 0.3} ${y + h} L${x} ${y + h} Z M${x + w} ${y} L${x + w * 0.72} ${y} Q${x + w * 0.8} ${y + h * 0.6} ${x + w * 0.7} ${y + h} L${x + w} ${y + h} Z`} fill={curtain} opacity="0.9" />}
        </g>
      ) : (
        <g>
          <rect x={x} y={y} width={w} height={h} fill="#0b0e1e" />
          <path d={`M${x + 3} ${y + h - 4} L${x + w * 0.55} ${y + 3}`} stroke="#5a6a9a" strokeWidth="2.4" opacity="0.28" />
        </g>
      )}
      <path d={`M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}`} stroke={frame} strokeWidth="2" />
      <rect x={x - 5} y={y + h + 2} width={w + 10} height="4" fill="#3a3c52" />
    </g>
  );
}

/* arbre feuillu : masses de feuillage éclairées par la lune (à gauche) */
function Tree({ x, y, s = 1 }) {
  const blobs = [[-26, -64, 30], [18, -70, 32], [-6, -96, 30], [30, -40, 24], [-34, -36, 22], [4, -46, 28]];
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx="6" cy="2" rx="46" ry="6" fill="#05060e" opacity="0.5" />
      <path d="M-5 0 Q-3 -30 -8 -52 M5 0 Q4 -26 12 -48 M0 -30 Q-12 -40 -22 -44" stroke="#1a1414" strokeWidth="7" strokeLinecap="round" fill="none" />
      {blobs.map(([bx, by, r], i) => <circle key={i} cx={bx} cy={by} r={r} fill="#0f1c22" />)}
      {blobs.map(([bx, by, r], i) => <circle key={`h${i}`} cx={bx - r * 0.3} cy={by - r * 0.3} r={r * 0.62} fill="#1d3238" opacity="0.75" />)}
      {blobs.slice(0, 4).map(([bx, by, r], i) => <circle key={`l${i}`} cx={bx - r * 0.45} cy={by - r * 0.45} r={r * 0.28} fill="#3a5a64" opacity="0.45" />)}
    </g>
  );
}

/* lampadaire avec cône de lumière et flaque de lumière au sol */
function StreetLamp({ x, dir = 1, top = 196 }) {
  const hx = x + dir * 58;
  return (
    <g>
      <path d={`M${hx - 16} ${top + 18} L${hx - 120} 540 L${hx + 120} 540 L${hx + 16} ${top + 18} Z`} fill="url(#ns-cone)" />
      <ellipse cx={hx} cy="532" rx="150" ry="20" fill="url(#ns-pool)" />
      <rect x={x - 4} y={top} width="8" height={530 - top} fill="#262838" />
      <rect x={x - 7} y="512" width="14" height="20" rx="2" fill="#20222e" />
      <path d={`M${x} ${top + 4} Q${x + dir * 30} ${top - 8} ${hx} ${top + 6}`} stroke="#262838" strokeWidth="6" fill="none" />
      <path d={`M${hx - 18} ${top + 6} L${hx + 18} ${top + 6} L${hx + 12} ${top + 18} L${hx - 12} ${top + 18} Z`} fill="#30323f" />
      <ellipse cx={hx} cy={top + 19} rx="11" ry="3.4" fill="#fff0c0" />
      <circle cx={hx} cy={top + 22} r="46" fill="url(#ns-bulb)" />
    </g>
  );
}

export default function NightStreetDecor() {
  return (
    <g>
      <defs>
        <linearGradient id="ns-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#05081a" />
          <stop offset="45%" stopColor="#0e1434" />
          <stop offset="80%" stopColor="#222650" />
          <stop offset="100%" stopColor="#3a2c50" />
        </linearGradient>
        <linearGradient id="ns-citglow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d07a50" stopOpacity="0" />
          <stop offset="100%" stopColor="#d07a50" stopOpacity="0.32" />
        </linearGradient>
        <radialGradient id="ns-moonhalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f4ead0" stopOpacity="0.5" />
          <stop offset="40%" stopColor="#c8d0f0" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#c8d0f0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ns-moon" cx="40%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#fbf4e0" />
          <stop offset="70%" stopColor="#e8dcbc" />
          <stop offset="100%" stopColor="#c8b890" />
        </radialGradient>
        <linearGradient id="ns-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe6a0" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#ffe6a0" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ns-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffdc90" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#ffdc90" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ns-bulb" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff2c4" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#fff2c4" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ns-warm" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb860" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffb860" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ns-tv" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7ab0ff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7ab0ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ns-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#191a26" />
          <stop offset="100%" stopColor="#0c0c14" />
        </linearGradient>
        <linearGradient id="ns-walk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2c3c" />
          <stop offset="100%" stopColor="#22232f" />
        </linearGradient>
        <linearGradient id="ns-wall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2a3048" />
          <stop offset="100%" stopColor="#1a1e30" />
        </linearGradient>
        <filter id="ns-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6" /></filter>
        <filter id="ns-softer" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="14" /></filter>
      </defs>

      {/* ═══ ciel ═══ */}
      <rect x="-200" y="-40" width="1600" height="580" fill="url(#ns-sky)" />
      {/* voie lactée, très discrète, en diagonale */}
      <g filter="url(#ns-softer)" opacity="0.5">
        <path d="M520 -20 Q760 120 1240 230 L1240 300 Q760 190 470 40 Z" fill="#5a5a90" opacity="0.35" />
        <path d="M640 40 Q860 150 1150 220" stroke="#8a8ab8" strokeWidth="26" opacity="0.18" fill="none" />
      </g>
      {STARS.map((st, i) => (
        <circle key={i} cx={st.x.toFixed(1)} cy={st.y.toFixed(1)} r={st.rad} fill="#fff" opacity={st.o.toFixed(2)}>
          {st.tw && <animate attributeName="opacity" values={`${st.o.toFixed(2)};0.15;${st.o.toFixed(2)}`} dur={`${2.5 + (i % 5)}s`} repeatCount="indefinite" />}
        </circle>
      ))}
      {/* une étoile filante, de temps en temps */}
      <path d="M880 60 l-90 34" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0">
        <animate attributeName="opacity" values="0;0;0.9;0" keyTimes="0;0.86;0.9;1" dur="9s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate" values="0 0;0 0;-60 22" keyTimes="0;0.86;1" dur="9s" repeatCount="indefinite" />
      </path>

      {/* ═══ la lune ═══ */}
      <circle cx="200" cy="130" r="170" fill="url(#ns-moonhalo)" />
      <circle cx="200" cy="130" r="52" fill="url(#ns-moon)" />
      <g fill="#b8aa88" opacity="0.5">
        <circle cx="214" cy="118" r="11" /><circle cx="186" cy="146" r="7" /><circle cx="178" cy="112" r="5" />
        <circle cx="226" cy="150" r="4" /><ellipse cx="200" cy="96" rx="9" ry="5" />
      </g>
      <path d="M232 92 A52 52 0 0 1 206 182 A60 60 0 0 0 232 92 Z" fill="#9a8e70" opacity="0.25" />
      {/* fins nuages qui passent devant la lune */}
      <g filter="url(#ns-soft)">
        <g>
          <animateTransform attributeName="transform" type="translate" values="-40 0; 60 0; -40 0" dur="60s" repeatCount="indefinite" />
          <ellipse cx="190" cy="168" rx="120" ry="9" fill="#1a1e40" opacity="0.65" />
          <ellipse cx="250" cy="176" rx="70" ry="6" fill="#c8c8e0" opacity="0.12" />
        </g>
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0; -80 0; 0 0" dur="80s" repeatCount="indefinite" />
          <ellipse cx="760" cy="150" rx="190" ry="12" fill="#1a1e44" opacity="0.55" />
          <ellipse cx="1020" cy="232" rx="160" ry="10" fill="#22264a" opacity="0.6" />
        </g>
      </g>

      {/* ═══ lointains : halo de la ville, colline, château d'eau, pylônes ═══ */}
      <rect x="-200" y="340" width="1600" height="160" fill="url(#ns-citglow)" />
      <path d="M-200 470 Q60 420 260 440 Q470 410 700 432 Q920 404 1110 430 Q1260 420 1400 440 L1400 520 L-200 520 Z" fill="#141838" />
      {/* lisière d'arbres sur la colline */}
      <path d="M-200 462 q20 -14 40 -2 q16 -16 34 -2 q14 -12 30 0 q22 -16 44 -2 q18 -10 36 0 L-16 480 L-200 480 Z M640 428 q16 -12 32 0 q14 -14 30 -2 q20 -12 40 0 q14 -10 28 2 L770 444 L640 444 Z" fill="#10132e" />
      {/* château d'eau au loin, avec feu rouge clignotant */}
      <g transform="translate(870,404)" fill="#121534">
        <path d="M-5 30 L-3 0 L3 0 L5 30 Z" />
        <path d="M-22 0 Q-24 -16 0 -20 Q24 -16 22 0 Q0 6 -22 0 Z" />
        <path d="M-8 30 L-2 0 M8 30 L2 0" stroke="#121534" strokeWidth="1.4" />
        <circle cx="0" cy="-22" r="1.8" fill="#ff4a3a">
          <animate attributeName="opacity" values="1;0.1;1" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>
      {/* lumières lointaines éparses sur la colline */}
      {[[96, 452, "#e8b060"], [338, 438, "#e8c070"], [548, 430, "#d8a858"], [1060, 428, "#e8b868"], [1150, 434, "#d8b070"]].map(([lx, ly, c], i) => (
        <rect key={i} x={lx} y={ly} width="3" height="3" fill={c} opacity="0.75" />
      ))}

      {/* ═══ second rang : toits de pavillons plus loin ═══ */}
      <g fill="#161a36">
        <path d="M380 492 L380 446 L430 418 L480 446 L480 492 Z" />
        <path d="M690 492 L690 440 L752 404 L814 440 L814 492 Z" />
        <path d="M1040 492 L1040 452 L1090 424 L1140 452 L1140 492 Z" />
      </g>
      <rect x="742" y="452" width="10" height="12" fill="#e0a850" opacity="0.6" />

      {/* ═══ fils électriques entre deux poteaux de bois ═══ */}
      <g stroke="#0c0e1c" fill="none">
        <path d="M-20 262 Q340 300 652 270 Q900 296 1230 268" strokeWidth="1.4" />
        <path d="M-20 276 Q340 314 652 284 Q900 310 1230 282" strokeWidth="1.2" />
        <path d="M652 270 L652 500" strokeWidth="7" stroke="#1a1620" />
        <path d="M632 268 L672 268 M636 282 L668 282" strokeWidth="4" stroke="#1a1620" />
      </g>

      {/* ═══ PAVILLON DU JOUEUR (gauche) : à l'étage, la chambre allumée ═══ */}
      <g>
        {/* toit */}
        <path d="M34 336 L196 236 L360 336 Z" fill="#141628" />
        <path d="M34 336 L196 236 L360 336" stroke="#2c3050" strokeWidth="4" fill="none" />
        {[268, 290, 312].map((y) => <path key={y} d={`M${196 - (y - 236) * 1.62} ${y} L${196 + (y - 236) * 1.64} ${y}`} stroke="#1e2138" strokeWidth="1.6" />)}
        <path d="M196 236 L120 283" stroke="#4a5480" strokeWidth="1.4" opacity="0.5" />
        {/* cheminée qui fume */}
        <rect x="268" y="262" width="22" height="46" fill="#2a2030" />
        <rect x="264" y="258" width="30" height="7" fill="#3a2c3c" />
        <path d="M279 256 Q272 236 284 220 Q276 200 290 182 Q282 164 296 148" stroke="#8a90a8" strokeWidth="6" fill="none" opacity="0.22" strokeLinecap="round">
          <animate attributeName="opacity" values="0.12;0.3;0.12" dur="5s" repeatCount="indefinite" />
        </path>
        {/* façade */}
        <rect x="52" y="336" width="290" height="164" fill="url(#ns-wall)" />
        {[352, 372, 392, 412, 432, 452, 472].map((y) => <path key={y} d={`M52 ${y} H342`} stroke="#222740" strokeWidth="1" opacity="0.6" />)}
        <path d="M52 336 H342" stroke="#3a4060" strokeWidth="3" />
        <path d="M52 418 H342" stroke="#2c3250" strokeWidth="3" />
        {/* LA CHAMBRE du joueur, à l'étage : lumière chaude, rideaux tirés */}
        <circle cx="206" cy="374" r="90" fill="url(#ns-warm)" />
        <Win x={182} y={350} w={50} h={48} lit="#ffc068" curtain="#a8603a" />
        <rect x="186" y="354" width="42" height="40" fill="#fff0c0" opacity="0.25">
          <animate attributeName="opacity" values="0.15;0.35;0.15" dur="4s" repeatCount="indefinite" />
        </rect>
        <Win x={86} y={352} w={40} h={44} />
        <Win x={272} y={352} w={40} h={44} />
        {/* rez-de-chaussée */}
        <Win x={190} y={436} w={56} h={42} />
        {/* porte, marquise, applique allumée */}
        <rect x="96" y="430" width="40" height="70" fill="#2a1a14" stroke="#4a3020" strokeWidth="2" />
        <rect x="102" y="436" width="28" height="22" fill="#1c120e" />
        <circle cx="130" cy="468" r="2" fill="#c8a848" />
        <path d="M86 426 L146 426 L140 418 L92 418 Z" fill="#30344c" />
        <circle cx="152" cy="442" r="30" fill="url(#ns-warm)" />
        <rect x="149" y="436" width="6" height="9" rx="2" fill="#ffd890" />
        <rect x="88" y="500" width="56" height="6" fill="#30323e" />
        <rect x="92" y="506" width="48" height="5" fill="#2a2c38" />
        {/* gouttière */}
        <path d="M342 340 V500" stroke="#30344c" strokeWidth="3" />
      </g>

      {/* ═══ PAVILLONS VOISINS ═══ */}
      {/* le bungalow (derrière la haie) */}
      <g>
        <path d="M392 412 L470 362 L548 412 Z" fill="#14172c" />
        <path d="M392 412 L470 362 L548 412" stroke="#2a2e4c" strokeWidth="3" fill="none" />
        <rect x="402" y="412" width="136" height="88" fill="#1c2034" />
        <Win x={418} y={430} w={36} h={34} />
        <Win x={486} y={430} w={36} h={34} />
      </g>
      {/* la maison derrière l'atterrissage */}
      <g>
        <path d="M570 370 L680 304 L790 370 Z" fill="#131628" />
        <path d="M570 370 L680 304 L790 370" stroke="#2a2e4c" strokeWidth="3" fill="none" />
        <rect x="584" y="370" width="192" height="130" fill="#1a1e32" />
        <Win x={606} y={392} w={38} h={40} />
        <Win x={716} y={392} w={38} h={40} />
        <rect x="662" y="440" width="36" height="60" fill="#14100e" stroke="#2c2a3a" strokeWidth="2" />
      </g>
      {/* la maison du voisin insomniaque : un écran bleu qui clignote */}
      <g>
        <path d="M842 384 L948 318 L1054 384 Z" fill="#141628" />
        <path d="M842 384 L948 318 L1054 384" stroke="#2c3050" strokeWidth="3" fill="none" />
        <rect x="854" y="384" width="188" height="116" fill="#1c2034" />
        <circle cx="900" cy="430" r="60" fill="url(#ns-tv)">
          <animate attributeName="opacity" values="1;0.55;0.9;0.4;1" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <Win x={878} y={410} w={44} h={40} lit="#6a9ae0" />
        <rect x="882" y="414" width="36" height="32" fill="#c8e0ff" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.05;0.4;0.1;0.3" dur="2.6s" repeatCount="indefinite" />
        </rect>
        <Win x={976} y={410} w={40} h={40} />
        <rect x="1000" y="356" width="18" height="30" fill="#2a2030" />
      </g>
      <g>
        <path d="M1078 396 L1170 340 L1262 396 Z" fill="#131628" />
        <rect x="1088" y="396" width="160" height="104" fill="#1a1e32" />
        <Win x={1110} y={420} w={38} h={38} />
      </g>

      {/* ═══ arbres de jardin, éclairés par la lune ═══ */}
      <Tree x={372} y={500} s={1.05} />
      <Tree x={1070} y={502} s={0.92} />
      <Tree x={20} y={506} s={0.85} />

      {/* ═══ haies, clôture, chat ═══ */}
      <g>
        <path d="M150 500 q14 -26 30 -8 q14 -22 32 -4 q16 -20 34 -2 q14 -16 26 0 L272 506 L150 506 Z" fill="#0e1a1e" />
        <path d="M156 496 q10 -14 22 -6 M196 490 q12 -14 24 -4 M234 492 q10 -12 22 -2" stroke="#2a4048" strokeWidth="3" fill="none" opacity="0.5" />
        <path d="M398 500 q16 -24 34 -6 q16 -22 34 -4 q18 -20 36 0 q12 -14 30 2 L552 506 L398 506 Z" fill="#0e1a1e" />
        {/* clôture blanche (bois peint) devant la maison voisine */}
        <g fill="#8a8ea8" opacity="0.55">
          {Array.from({ length: 24 }).map((_, i) => <path key={i} d={`M${840 + i * 9} 506 V486 l3 -4 l3 4 V506 Z`} />)}
          <rect x="836" y="490" width="220" height="3" />
          <rect x="836" y="499" width="220" height="3" />
        </g>
        {/* le chat sur la clôture, yeux qui brillent */}
        <g transform="translate(1020,482)">
          <path d="M-12 0 Q-12 -12 -2 -12 Q6 -12 8 -6 L10 -16 L13 -10 L16 -16 L16 -4 Q16 2 8 2 Z" fill="#06070e" />
          <path d="M-12 0 Q-22 -4 -20 -16" stroke="#06070e" strokeWidth="3" fill="none" strokeLinecap="round" />
          <g fill="#c8ff6a">
            <circle cx="10" cy="-8" r="1.2"><animate attributeName="opacity" values="1;1;0;1" keyTimes="0;0.9;0.95;1" dur="5s" repeatCount="indefinite" /></circle>
            <circle cx="14" cy="-8" r="1.2"><animate attributeName="opacity" values="1;1;0;1" keyTimes="0;0.9;0.95;1" dur="5s" repeatCount="indefinite" /></circle>
          </g>
        </g>
      </g>

      {/* ═══ trottoir, bordure, chaussée ═══ */}
      <rect x="-200" y="500" width="1600" height="34" fill="url(#ns-walk)" />
      {Array.from({ length: 20 }).map((_, i) => <path key={i} d={`M${i * 70 - 10} 500 L${i * 70 - 22} 534`} stroke="#1a1b26" strokeWidth="1.4" />)}
      <rect x="-200" y="534" width="1600" height="8" fill="#3a3c4c" />
      <rect x="-200" y="534" width="1600" height="2" fill="#5a5c70" opacity="0.7" />
      <rect x="-200" y="542" width="1600" height="160" fill="url(#ns-road)" />
      {/* grain de l'asphalte */}
      <g fill="#2a2c3a" opacity="0.6">
        {Array.from({ length: 70 }).map((_, i) => <circle key={i} cx={(i * 173) % 1200} cy={552 + ((i * 59) % 124)} r={i % 3 ? 0.9 : 1.4} />)}
      </g>
      {/* marquage central, usé */}
      {[40, 200, 360, 520, 680, 840, 1000, 1160].map((x) => <rect key={x} x={x} y="618" width="70" height="5" fill="#b8a870" opacity="0.4" />)}
      {/* bouche d'égout, plaque, flaques qui reflètent les lampadaires et la lune */}
      <rect x="378" y="543" width="34" height="6" fill="#08080e" />
      {[382, 388, 394, 400, 406].map((x) => <path key={x} d={`M${x} 543 v6`} stroke="#3a3c4c" strokeWidth="1" />)}
      <ellipse cx="300" cy="652" rx="30" ry="8" fill="#0a0a12" stroke="#2c2e3c" strokeWidth="2" />
      <ellipse cx="520" cy="580" rx="70" ry="9" fill="#2a3050" opacity="0.5" />
      <ellipse cx="520" cy="580" rx="30" ry="3" fill="#ffe0a0" opacity="0.35" />
      <ellipse cx="1000" cy="596" rx="90" ry="10" fill="#2a3050" opacity="0.45" />
      <ellipse cx="1000" cy="596" rx="40" ry="3" fill="#ffe0a0" opacity="0.3" />
      <ellipse cx="200" cy="600" rx="56" ry="7" fill="#3a4060" opacity="0.4" />
      <ellipse cx="200" cy="600" rx="14" ry="3" fill="#f4ead0" opacity="0.5" />

      {/* ═══ la voiture garée (droite) ═══ */}
      <g transform="translate(1060,566)">
        <ellipse cx="0" cy="12" rx="110" ry="9" fill="#05050a" opacity="0.6" />
        <path d="M-104 4 L-104 -14 Q-102 -24 -84 -26 L-56 -30 Q-36 -52 -6 -54 L34 -54 Q56 -52 72 -32 L96 -28 Q108 -24 108 -12 L108 4 Z" fill="#232838" />
        <path d="M-48 -30 Q-32 -48 -8 -49 L-8 -30 Z M-2 -49 L30 -49 Q48 -47 62 -30 L-2 -30 Z" fill="#0e1220" />
        <path d="M-40 -32 Q-28 -44 -14 -46" stroke="#6a7aa8" strokeWidth="2" opacity="0.4" fill="none" />
        <path d="M-104 -10 H108" stroke="#3a4058" strokeWidth="2" />
        <rect x="-104" y="-16" width="8" height="5" fill="#ff5a3a" opacity="0.7" />
        <circle cx="-62" cy="4" r="17" fill="#0a0a10" /><circle cx="-62" cy="4" r="8" fill="#3a3c4a" />
        <circle cx="66" cy="4" r="17" fill="#0a0a10" /><circle cx="66" cy="4" r="8" fill="#3a3c4a" />
        <path d="M-80 -26 Q0 -34 96 -27" stroke="#8a9ac8" strokeWidth="1.4" opacity="0.35" fill="none" />
      </g>

      {/* ═══ lampadaires ═══ */}
      <StreetLamp x={440} dir={1} />
      <StreetLamp x={960} dir={-1} top={214} />

      {/* ═══ premier plan : boîte aux lettres du joueur, herbes du bas-côté ═══ */}
      <g transform="translate(150,500)">
        <ellipse cx="0" cy="30" rx="16" ry="3" fill="#0a0a12" opacity="0.6" />
        <rect x="-3" y="-6" width="6" height="36" fill="#2c2c36" />
        <path d="M-22 -24 L18 -24 Q24 -24 24 -16 L24 6 L-22 6 Z" fill="#8a1414" stroke="#3a0000" strokeWidth="1.4" />
        <path d="M-22 -24 Q-28 -24 -28 -16 L-28 6 L-22 6 Z" fill="#6a0e0e" />
        <rect x="-14" y="-16" width="16" height="4" fill="#0a0806" />
        <path d="M24 -18 L30 -18 L30 -30 L36 -30 L36 -24 L30 -24" fill="#e8c048" stroke="#8a6a20" strokeWidth="0.8" />
        <path d="M-20 -22 L14 -22" stroke="#d04040" strokeWidth="1.4" opacity="0.6" />
      </g>
      <g stroke="#1a2a24" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.9">
        <path d="M-6 690 q6 -30 2 -50 M8 690 q2 -22 14 -36 M22 690 q-2 -18 8 -28" />
        <path d="M1190 690 q-6 -26 2 -44 M1176 690 q-2 -20 -12 -32" />
      </g>
    </g>
  );
}
