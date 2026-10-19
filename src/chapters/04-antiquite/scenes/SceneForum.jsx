import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { PompeiDefs, PompeiFond } from "./fond.jsx";
import { Canopy, Grass, Speckle } from "../../../engine/scenery.jsx";

/* ============================================================
   CHAPITRE 4 · Tableau 3 — Le jardin clos de la villa
   Mur de clôture au fond (la ville + le Vésuve dépassent), des
   oliviers, un grand arbre où pend une ruche, une fontaine, une
   vache, une cabane à outils (épée, burin) et un établi.
   ============================================================ */

export default function SceneJardin({ collect, action, reveal, made = [] }) {
  const cire = made.includes("cire_abeille");   // la ruche a-t-elle été décrochée ?
  const abattu = made.includes("peau");         // le bœuf a-t-il été abattu ?
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <PompeiDefs />
        <linearGradient id="ja-grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a9a52" /><stop offset="100%" stopColor="#5a6a34" /></linearGradient>
        <linearGradient id="ja-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a8ccd0" /><stop offset="100%" stopColor="#5a808a" /></linearGradient>
        <linearGradient id="ja-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d8c49a" /><stop offset="100%" stopColor="#b09a6e" /></linearGradient>
        <radialGradient id="ja-tree" cx="45%" cy="40%" r="60%"><stop offset="0%" stopColor="#6a8a3a" /><stop offset="100%" stopColor="#3a5226" /></radialGradient>
        <radialGradient id="ja-olive" cx="45%" cy="40%" r="60%"><stop offset="0%" stopColor="#9aa672" /><stop offset="100%" stopColor="#6a7a48" /></radialGradient>
      </defs>

      <PompeiFond />

      {/* ═══ derrière le mur : une ville plus dense ═══ */}
      <PLayer depth={2}>
        {[[60, 300, 1], [110, 296, 0.9], [175, 300, 1.05], [235, 298, 0.85], [560, 300, 0.9], [620, 296, 1.1], [690, 300, 0.9], [900, 298, 1]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
            <rect x="-22" y="-40" width="44" height="40" fill="#e4dcc8" />
            <rect x="-22" y="-40" width="44" height="40" fill="#a89a78" opacity="0.15" filter="url(#pf-grain)" />
            <path d="M-26 -40 L0 -56 L26 -40 Z" fill="#a8462e" />
            <rect x="-13" y="-28" width="10" height="12" fill="#6a5238" /><rect x="4" y="-28" width="10" height="12" fill="#6a5238" />
            <rect x="-7" y="-14" width="14" height="14" fill="#5a4230" />
          </g>
        ))}
        <g transform="translate(400,300)">
          <path d="M-40 -40 L0 -60 L40 -40 Z" fill="#c8462e" />
          <rect x="-38" y="-40" width="76" height="7" fill="#e4dcc8" />
          {[-32, -18, -4, 10, 24].map((x, i) => <rect key={i} x={x} y="-33" width="7" height="33" fill="#d8cdb4" />)}
        </g>

        {/* LE MUR DE CLÔTURE du jardin */}
        <rect x="0" y="304" width="1000" height="56" fill="url(#ja-wall)" />
        <rect x="0" y="304" width="1000" height="56" fill="#8a6e46" opacity="0.2" filter="url(#pf-grain)" />
        {/* lierre et vigne qui grimpent sur le mur */}
        {[[30, 6], [250, 4], [610, 5], [960, 6]].map(([x, n], i) => (
          <g key={i}>{Array.from({ length: n }).map((_, k) => <circle key={k} cx={x + (k % 3) * 9 - 9} cy={352 - k * 8} r="6" fill={k % 2 ? "#4a6a2a" : "#5a7a34"} />)}</g>
        ))}
        <rect x="0" y="298" width="1000" height="10" fill="#c8b488" />
        <path d="M0 322 h1000 M0 340 h1000" stroke="#a08a5e" strokeWidth="1.2" opacity="0.5" />
        {[...Array(28)].map((_, i) => <path key={i} d={`M${i * 36} 308 v52`} stroke="#a08a5e" strokeWidth="1" opacity="0.35" />)}
      </PLayer>

      {/* ═══ le jardin (premier plan) ═══ */}
      <PLayer depth={3}>
        <rect y="356" width="1000" height="204" fill="url(#ja-grass)" />
        <rect y="358" width="1000" height="202" fill="#2e3a18" opacity="0.24" filter="url(#pf-mottle)" />
        <Speckle seed={271} x0={0} x1={1000} y0={360} y1={560} n={360} colors={["#a8b860", "#4a5a28", "#c8c870", "#6a7a38"]} opacity={0.5} />
        {[[60, 420, 1], [300, 470, 2], [680, 430, 3], [760, 530, 4], [920, 450, 5], [240, 540, 6], [560, 500, 7], [880, 540, 8]].map(([x, y, sd]) => (
          <Grass key={sd} x={x} y={y} seed={sd} color="#5a6a30" s={1.1} flower={["#e8d040", "#f4f0f0", "#c86a9a"][sd % 3]} />
        ))}
        {/* ombre portée du mur sur la pelouse */}
        <path d="M-40 356 L1040 356 L1040 372 Q500 380 -40 370 Z" fill="#2e3a18" opacity="0.3" />
        {/* bordures de buis le long de l'allée */}
        <path d="M398 560 L470 390 L462 390 L386 560 Z" fill="#3e5a26" />
        <path d="M622 560 L542 390 L550 390 L634 560 Z" fill="#3e5a26" />
        <path d="M400 560 L472 388 L540 388 L620 560 Z" fill="#c2a877" opacity="0.85" />
        <path d="M400 560 L472 388 M620 560 L540 388" stroke="#8a6e46" strokeWidth="1.6" opacity="0.4" />

        {/* LES OLIVIERS (en rang le long du mur) */}
        {[[390, 372, 0.9], [470, 374, 0.8], [560, 376, 0.75], [720, 374, 0.85], [820, 372, 1], [900, 376, 0.8]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
            <path d="M0 4 q-7 -32 -1 -50 q7 18 1 50" stroke="#6e5236" strokeWidth="9" fill="none" strokeLinecap="round" />
            <path d="M0 -30 l-12 -8 M0 -38 l12 -10" stroke="#6e5236" strokeWidth="3" />
            <ellipse cx="-3" cy="-56" rx="30" ry="23" fill="url(#ja-olive)" />
            <ellipse cx="12" cy="-46" rx="20" ry="16" fill="#7a8a5a" opacity="0.8" />
            {[...Array(7)].map((_, k) => <circle key={k} cx={-18 + k * 6} cy={-52 + (k % 2) * 9} r="2" fill="#3a4a22" />)}
          </g>
        ))}

        {/* LE GRAND ARBRE (gauche) — une RUCHE pend à sa branche */}
        <g transform="translate(140,356)">
          <path d="M0 8 L-6 -74 M0 8 L6 -74" stroke="#5a3f24" strokeWidth="15" strokeLinecap="round" />
          <path d="M0 -44 l-26 -14 M0 -54 l26 -18 M0 -64 l-22 -22" stroke="#5a3f24" strokeWidth="6" strokeLinecap="round" />
          <Canopy cx={0} cy={-96} rx={78} ry={60} color="#4e6e2e" light={-1} seed={5} n={18} />
          {/* la branche horizontale d'où pend la ruche (puis qu'on ramasse) */}
          <path d="M-8 -40 q-34 -2 -58 6" stroke="#6a4a2c" strokeWidth="5" fill="none" strokeLinecap="round" />
          {!cire ? (
            <g>
              {/* la corde + la RUCHE (skep de paille) accrochée à la branche */}
              <path d="M-56 -34 v18" stroke="#8a6a3a" strokeWidth="1.6" />
              <g transform="translate(-56,10)">
                <path d="M-16 6 Q-18 -18 0 -22 Q18 -18 16 6 Z" fill="#d8a83a" />
                <path d="M-15 -2 q15 5 30 0 M-13 -9 q13 4 26 0 M-16 5 q16 5 32 0" stroke="#a87a1a" strokeWidth="1.6" fill="none" />
                <ellipse cx="0" cy="6" rx="16" ry="4" fill="#a87a1a" opacity="0.5" />
                <path d="M-4 6 q4 4 8 0" stroke="#3a2a10" strokeWidth="2" fill="none" />
              </g>
              {/* les ABEILLES qui tournent autour de la ruche — chacune
                  fait un petit orbit de quelques pixels autour de sa
                  position (SMIL pour marcher partout). */}
              {[[-42, 2, 2.4, 0], [-70, -8, 3.1, 0.5], [-58, -20, 2.7, 1.1], [-48, -14, 3.4, 1.7]].map(([x, y, dur, off], i) => (
                <g key={i}>
                  <animateTransform attributeName="transform" type="translate"
                    values={`${x - 3},${y}; ${x + 3},${y - 2}; ${x + 2},${y + 2}; ${x - 3},${y}`}
                    dur={`${dur}s`} begin={`${off}s`} repeatCount="indefinite" />
                  <ellipse cx="0" cy="0" rx="2.4" ry="1.6" fill="#e0b23a" stroke="#3a2010" strokeWidth="0.3" />
                  <path d="M-2 0 h4" stroke="#2a1c10" strokeWidth="1.4" />
                  {/* petites ailes translucides */}
                  <ellipse cx="0" cy="-1.5" rx="2" ry="1" fill="#e8eef2" opacity="0.5" />
                </g>
              ))}
            </g>
          ) : null}
        </g>

        {/* panier d'olives (récolte) — vu de 3/4 : corps tressé conique,
            ouverture elliptique, olives en tas dedans */}
        <g transform="translate(400,492)">
          {/* corps du panier, légèrement évasé */}
          <path d="M-19 -3 Q-23 16 0 18 Q23 16 19 -3 Z" fill="#a87a44" />
          <path d="M-19 -3 Q-23 16 0 18 Q23 16 19 -3 Z" fill="#3a2414" opacity="0.18" filter="url(#pf-grain)" />
          {/* tressage horizontal */}
          <path d="M-21 3 q21 6 42 0 M-19 10 q19 5 38 0" stroke="#7a5230" strokeWidth="1.4" fill="none" opacity="0.6" />
          {/* ouverture elliptique (le rebord vu du dessus) */}
          <ellipse cx="0" cy="-3" rx="20" ry="7.5" fill="#6e4a28" />
          <ellipse cx="0" cy="-4" rx="17.5" ry="5.8" fill="#4a3418" />
          {/* les olives en tas dans l'ouverture */}
          {[[-10, -4], [-3, -6], [4, -6], [11, -4], [-7, -1], [0, -2], [7, -2], [13, -1], [-3, 1], [4, 1], [-1, -9], [6, -9]].map(([x, y], k) => (
            <g key={k} transform={`translate(${x},${y})`}>
              <ellipse rx="3.4" ry="3" fill="url(#ja-olive)" />
              <ellipse cx="-0.9" cy="-0.9" rx="1" ry="0.8" fill="#c2cc9a" opacity="0.6" />
            </g>
          ))}
        </g>

        {/* LA CABANE À OUTILS : l'épée et le burin y sont accrochés */}
        <g transform="translate(250,468)">
          <ellipse cx="0" cy="30" rx="66" ry="10" fill="#241608" opacity="0.3" />
          {/* mur du fond (planches) */}
          <rect x="-50" y="-58" width="100" height="88" fill="#a8804a" />
          <rect x="-50" y="-58" width="100" height="88" fill="#3a2414" opacity="0.28" filter="url(#pf-grain)" />
          <path d="M-32 -58 v88 M-6 -58 v88 M20 -58 v88" stroke="#7a5230" strokeWidth="1.4" opacity="0.5" />
          {/* toit en pente */}
          <path d="M-62 -58 L44 -74 L60 -60 L-46 -44 Z" fill="#8a5a34" />
          <path d="M-62 -58 L44 -74" stroke="#6a4420" strokeWidth="2" opacity="0.5" />
          {/* poteaux d'angle */}
          <rect x="-54" y="-52" width="7" height="82" fill="#6e4c2e" /><rect x="47" y="-58" width="7" height="88" fill="#6e4c2e" />
          {/* barre à outils + crochets */}
          <rect x="-44" y="-40" width="88" height="4" fill="#6e4c2e" />
          {[-30, 0, 30].map((x, i) => <path key={i} d={`M${x} -36 v4`} stroke="#5a3f24" strokeWidth="2" />)}
          {/* l'ÉPÉE accrochée (gauche) */}
          <g transform="translate(-30,-34)">
            <path d="M0 4 L0 40" stroke="#c8c8d0" strokeWidth="4" strokeLinecap="round" />
            <path d="M-8 4 h16" stroke="#8a7a4a" strokeWidth="3" /><rect x="-2.5" y="-2" width="5" height="8" rx="1" fill="#6a4a2c" />
          </g>
          {/* le BURIN + maillet accrochés (droite) */}
          <g transform="translate(30,-34)">
            <rect x="-2" y="2" width="5" height="26" rx="1.5" fill="#9a9aa6" /><rect x="-4" y="26" width="9" height="6" rx="1.5" fill="#5a3f24" />
            <g transform="translate(-18,6)"><rect x="-7" y="-6" width="15" height="11" rx="2" fill="#8a5a34" /><rect x="-1" y="5" width="4" height="20" fill="#5a3f24" /></g>
          </g>
        </g>

        {/* LA FONTAINE (centre) */}
        <g transform="translate(510,472)">
          <ellipse cx="0" cy="30" rx="64" ry="14" fill="#241608" opacity="0.3" />
          <path d="M-58 22 Q-64 -2 0 -8 Q64 -2 58 22 Z" fill="#b0a488" />
          <ellipse cx="0" cy="-8" rx="54" ry="14" fill="url(#ja-water)" />
          <path d="M-40 -8 q40 -6 80 0" stroke="#cfe0e0" strokeWidth="1.6" fill="none" opacity="0.5" style={{ animation: "ripple 3.4s ease-in-out infinite" }} />
          <rect x="-4" y="-38" width="8" height="32" fill="#9a8e78" />
          <path d="M0 -38 q-10 -14 0 -26 q10 12 0 26" fill="#bfe0e0" opacity="0.6" style={{ animation: "pulse 2.2s ease-in-out infinite" }} />
        </g>

        {/* L'ÉTABLI : la planche et le grattoir (espacés de la cabane) */}
        <g transform="translate(700,504)">
          <ellipse cx="0" cy="30" rx="78" ry="12" fill="#241608" opacity="0.35" />
          <rect x="-74" y="-6" width="148" height="15" rx="3" fill="#7a5230" />
          <rect x="-74" y="-6" width="148" height="15" rx="3" fill="#3a2414" opacity="0.3" filter="url(#pf-grain)" />
          <rect x="-66" y="9" width="14" height="30" fill="#5a3f24" /><rect x="52" y="9" width="14" height="30" fill="#5a3f24" />
          {/* planches empilées (gauche) */}
          <g transform="translate(-38,-14)"><rect x="-26" y="0" width="52" height="7" rx="1.5" fill="#a8865a" /><rect x="-22" y="-7" width="46" height="7" rx="1.5" fill="#b89a6a" /><rect x="-18" y="-14" width="40" height="7" rx="1.5" fill="#a8865a" /></g>
          {/* grattoir + ponce (droite) */}
          <g transform="translate(44,-12)"><path d="M-9 4 L9 0 L9 4 L-9 8 Z" fill="#c8c0b4" stroke="#8a8478" strokeWidth="0.8" /><rect x="-14" y="4" width="11" height="5" rx="2" fill="#6e4c2e" /><ellipse cx="20" cy="4" rx="8" ry="5" fill="#b8b0a0" /></g>
        </g>

        {/* LA VACHE (droite, support) — avance un peu de gauche a droite
            puis revient (petit va-et-vient de brouteuse) */}
        {!abattu && (
          <g>
            <animateTransform attributeName="transform" type="translate"
              values="0,0; 30,0; 30,0; 0,0; 0,0" keyTimes="0;0.35;0.5;0.85;1" dur="24s" repeatCount="indefinite" />
            <g transform="translate(870,470)">
              <ellipse cx="0" cy="30" rx="40" ry="8" fill="#241608" opacity="0.35" />
              <path d="M-34 22 Q-40 -14 -14 -18 L20 -18 Q40 -14 36 18 L36 30 L26 30 L26 24 L-24 24 L-24 30 L-34 30 Z" fill="#d8cdbc" />
              <path d="M-34 22 Q-40 -14 -14 -18 L20 -18 Q40 -14 36 18" fill="#8a7a68" opacity="0.2" filter="url(#pf-grain)" />
              <ellipse cx="-8" cy="2" rx="12" ry="9" fill="#5a4636" opacity="0.6" /><ellipse cx="18" cy="8" rx="8" ry="6" fill="#5a4636" opacity="0.6" />
              <path d="M-34 -8 Q-52 -10 -50 6 Q-48 16 -36 14 Z" fill="#d8cdbc" />
              <path d="M-50 -6 q-6 -6 -3 -12 M-44 -10 q-2 -8 3 -12" stroke="#c8b8a0" strokeWidth="3" fill="none" strokeLinecap="round" />
              <circle cx="-46" cy="2" r="2" fill="#2a1c10" />
            </g>
          </g>
        )}
      </PLayer>

      <rect width="1000" height="560" fill="#231a10" opacity="0.06" style={{ pointerEvents: "none" }} />

      {/* zones cliquables */}
      {!abattu && <Hotspot cx={870} cy={462} r={46} label="la vache" item="vache" reveal={reveal} onClick={() => collect("vache")} />}
      {/* la ruche (cire) puis, une fois décrochée, la branche */}
      {!cire
        ? <Hotspot cx={84} cy={360} r={30} label="la ruche (cire d'abeille)" item="cire_abeille" reveal={reveal} onClick={() => collect("cire_abeille")} />
        : <Hotspot cx={102} cy={320} r={28} label="la branche (le stylet)" item="branche" reveal={reveal} onClick={() => collect("branche")} />}
      <Hotspot cx={220} cy={438} r={26} label="l'épée (à la cabane)" item="epee" reveal={reveal} onClick={() => collect("epee")} />
      <Hotspot cx={280} cy={438} r={26} label="le burin (à la cabane)" item="burin" reveal={reveal} onClick={() => collect("burin")} />
      <Hotspot cx={662} cy={488} r={30} label="planche de bois" item="planche" reveal={reveal} onClick={() => collect("planche")} />
      <Hotspot cx={744} cy={488} r={28} label="grattoir & ponce" item="grattoir" reveal={reveal} onClick={() => collect("grattoir")} />
      {/* SIX petits oiseaux qui virevoltent dans le jardin, en groupe
          desordonne (chacun sur sa propre trajectoire courte). */}
      {[
        { path: "80,150; 220,120; 80,150", dur: 8, y: 0 },
        { path: "180,180; 320,150; 180,180", dur: 10, y: 0 },
        { path: "260,140; 380,170; 260,140", dur: 9, y: 0 },
        { path: "520,160; 660,130; 520,160", dur: 11, y: 0 },
        { path: "620,190; 760,160; 620,190", dur: 8.5, y: 0 },
        { path: "740,140; 880,170; 740,140", dur: 9.5, y: 0 },
      ].map((b, i) => (
        <g key={i} opacity="0.85">
          <animateTransform attributeName="transform" type="translate"
            values={b.path} dur={`${b.dur}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
          <path d="M0 0 q4 -5 8 0 q4 -5 8 0" stroke="#2a1e10" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      ))}
</svg>
  );
}
