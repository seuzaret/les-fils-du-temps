import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Birds } from "./decor.jsx";
import { Figure } from "../../../engine/chars.jsx";
import { Ridge, TreeLine } from "../../../engine/scenery.jsx";

/* ============================================================
   CHAPITRE 1 — Tableau : la rivière
   VERSION « PEINTURE FINE » : aube sur l'eau — brume qui
   traîne à la surface, reflet doré du soleil levant, galets
   mouillés et brillants, roseaux à quenouilles, cerf raffiné
   qui boit dans la lumière (tant que `flags.hunted` est faux).
   À trouver ici : le cerf et le tronc creux.
   ============================================================ */

export default function SceneRiviere({ collect, action, reveal, flags, queteQui }) {
  const hunted = flags.hunted;
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="r1sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#26376c" />
          <stop offset="28%" stopColor="#475694" />
          <stop offset="52%" stopColor="#8478a8" />
          <stop offset="72%" stopColor="#cf9a9c" />
          <stop offset="88%" stopColor="#f0c08c" />
          <stop offset="100%" stopColor="#ffe6b0" />
        </linearGradient>
        <radialGradient id="r1sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff8e0" />
          <stop offset="40%" stopColor="#ffe4a8" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ffe0a0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="r1mMid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#68699e" /><stop offset="100%" stopColor="#4c4e80" /></linearGradient>
        <linearGradient id="r1mNear" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4c465e" /><stop offset="100%" stopColor="#343048" /></linearGradient>
        {/* l'eau : ciel du matin renversé */}
        <linearGradient id="r1water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8d4a8" />
          <stop offset="26%" stopColor="#a893a0" />
          <stop offset="60%" stopColor="#5c6494" />
          <stop offset="100%" stopColor="#333c66" />
        </linearGradient>
        <linearGradient id="r1soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#96784e" />
          <stop offset="40%" stopColor="#74563a" />
          <stop offset="100%" stopColor="#402c1c" />
        </linearGradient>
        <linearGradient id="r1trunk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a3322" />
          <stop offset="50%" stopColor="#6e4c32" />
          <stop offset="100%" stopColor="#2e2014" />
        </linearGradient>
        <filter id="r1blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="8" /></filter>
        <filter id="r1grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="r1mottle" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* ═══ ciel (fixe) ═══ */}
      <rect width="1000" height="560" fill="url(#r1sky)" />
      {[[560, 30, 0.32], [700, 60, 0.28], [860, 36, 0.32], [120, 50, 0.3]].map(([x, y, o], i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill="#fff" opacity={o} style={{ animation: `twinkle ${3 + i}s infinite` }} />
      ))}
      {/* soleil levant, bas sur l'horizon à gauche */}
      <circle cx="290" cy="196" r="165" fill="url(#r1sun)" />
      <circle cx="290" cy="196" r="70" fill="#ffe4a8" opacity="0.45" filter="url(#r1blur)" />
      <circle cx="290" cy="196" r="38" fill="#fff8e2" />
      {/* nuages étirés du matin */}
      <g filter="url(#r1blur)">
        <ellipse cx="480" cy="120" rx="160" ry="10" fill="#f0b8a0" opacity="0.4" />
        <ellipse cx="720" cy="150" rx="130" ry="8" fill="#e8a88c" opacity="0.32" />
        <ellipse cx="200" cy="90" rx="110" ry="8" fill="#f8d0a8" opacity="0.4" />
      </g>
      <Birds />

      {/* ═══ couche lointaine : collines bleutées ═══ */}
      <PLayer depth={1}>
      <Ridge id="r1-r1" seed={83} y={300} amp={96} rough={0.6} fill="#58629a" lit="#8a88b8" light={-1} snow="#e4dcec" snowLine={232} />
      <rect y="288" width="1000" height="26" fill="#ffe6b0" opacity="0.18" filter="url(#r1blur)" />
      <Ridge id="r1-r2" seed={89} y={350} amp={56} rough={0.5} fill="url(#r1mNear)" lit="#5a4a6a" light={-1} />
      <TreeLine seed={91} y={372} n={44} h={[18, 34]} kinds={["conifer"]} colors={["#2c2838", "#33303e", "#28243a"]} light={-1} jitter={8} />
      <rect y="340" width="1000" height="22" fill="#ffe6b0" opacity="0.14" filter="url(#r1blur)" />
      </PLayer>

      {/* ═══ couche intermédiaire : berge lointaine et rivière ═══ */}
      <PLayer depth={2}>
      {/* berge d'en face */}
      <rect y="380" width="1000" height="40" fill="#4a3a2c" />
      <rect y="380" width="1000" height="40" fill="#2c2014" opacity="0.5" filter="url(#r1grain)" />
      {/* sapins de l'autre rive, sombres à contre-jour */}
      <TreeLine seed={93} x0={20} x1={220} y={398} n={6} h={[50, 80]} kinds={["conifer"]} colors={["#243028", "#1e2a24"]} light={-1} jitter={4} />
      <TreeLine seed={97} x0={820} x1={990} y={396} n={5} h={[56, 86]} kinds={["conifer"]} colors={["#243028", "#1e2a24"]} light={-1} jitter={4} />
      {[240, 320, 620, 700, 780].map((x, i) => (
        <path key={i} d={`M${x} 400 q-4 -14 -9 -17 M${x} 400 q0 -16 5 -21 M${x} 400 q4 -12 10 -15`} stroke="#3c4626" strokeWidth="2" fill="none" opacity="0.8" />
      ))}
      {/* LA RIVIÈRE au petit matin */}
      <rect y="404" width="1000" height="100" fill="url(#r1water)" />
      {/* le chemin doré du soleil sur l'eau */}
      {/* reflet du soleil : une colonne de petites vaguelettes dorées, plus large vers nous */}
      <ellipse cx="290" cy="454" rx="70" ry="50" fill="#ffd88a" opacity="0.14" filter="url(#r1blur)" />
      {Array.from({ length: 16 }).map((_, i) => {
        const y = 410 + i * 6, w = 14 + i * 4.2, x = 290 - w / 2 + ((i * 37) % 9) - 4;
        return <path key={`sp${i}`} d={`M${x.toFixed(1)} ${y} h${w.toFixed(1)}`} stroke={i % 3 ? "#ffe6a8" : "#fff8dc"} strokeWidth={1.4 + i * 0.08} strokeLinecap="round" opacity={0.75 - i * 0.025}>
          <animate attributeName="opacity" values={`${(0.75 - i * 0.025).toFixed(2)};0.2;${(0.75 - i * 0.025).toFixed(2)}`} dur={`${1.6 + (i % 4) * 0.5}s`} repeatCount="indefinite" />
        </path>;
      })}
      {[[240, 430, 70], [290, 452, 90], [258, 474, 80], [306, 490, 60]].map(([x, y, w], i) => (
        <path key={i} d={`M${x} ${y} q${w / 2} ${i % 2 ? 3 : -3} ${w} 0`} stroke="#fff2c4" strokeWidth="2.2" fill="none" opacity="0.5" style={{ animation: `ripple ${2.4 + (i % 3) * 0.8}s ease-in-out infinite` }} />
      ))}
      {/* rides sombres et claires du courant */}
      {[[120, 424, 90], [430, 448, 130], [560, 428, 100], [700, 462, 120], [860, 436, 80], [520, 486, 90]].map(([x, y, w], i) => (
        <path key={i} d={`M${x} ${y} q${w / 2} ${i % 2 ? 4 : -4} ${w} 0`} stroke={i % 2 ? "#d8c8a0" : "#48507e"} strokeWidth="2.2" fill="none" opacity="0.45" style={{ animation: `ripple ${3 + (i % 3)}s ease-in-out infinite` }} />
      ))}
      {/* brume d'aube qui traîne sur l'eau */}
      <ellipse cx="480" cy="418" rx="330" ry="14" fill="#f0e4c8" opacity="0.28" filter="url(#r1blur)" />
      <ellipse cx="780" cy="432" rx="220" ry="10" fill="#e8dcc0" opacity="0.22" filter="url(#r1blur)" />
      <ellipse cx="180" cy="440" rx="180" ry="9" fill="#f4e8cc" opacity="0.2" filter="url(#r1blur)" />
      {/* DEUX POISSONS argentés qui traversent l'eau — reflets discrets à
          la surface. Petits dos qui affleurent, animation de translation
          lente pour rester crédible (poisson qui glisse, pas qui court). */}
      <g opacity="0.65">
        <animateTransform attributeName="transform" type="translate"
          values="-30,0; 1050,10; -30,0" dur="22s" repeatCount="indefinite" />
        {/* dos du poisson (ellipse plate) */}
        <ellipse cx="0" cy="466" rx="7" ry="1.6" fill="#8aa0a8" />
        {/* nageoire dorsale qui affleure */}
        <path d="M-2 464 l1 -2 l3 0 l1 2" stroke="#5a6a72" strokeWidth="0.8" fill="none" />
        {/* petites rides autour */}
        <path d="M-10 468 q7 -2 14 0" stroke="#d8c8a0" strokeWidth="0.6" fill="none" opacity="0.6" />
      </g>
      <g opacity="0.55">
        <animateTransform attributeName="transform" type="translate"
          values="1050,0; -30,-8; 1050,0" dur="28s" repeatCount="indefinite" />
        <ellipse cx="0" cy="482" rx="5" ry="1.3" fill="#9aacb4" />
        <path d="M-1 481 l1 -1.5 l2 0 l1 1.5" stroke="#5a6a72" strokeWidth="0.6" fill="none" />
        <path d="M-8 484 q6 -1.5 12 0" stroke="#d8c8a0" strokeWidth="0.5" fill="none" opacity="0.5" />
      </g>

      {/* le héron, immobile dans la brume */}
      <g transform="translate(520,398)">
        <path d="M0 0 q2 -18 10 -22 q6 -2 8 2 l6 -2 l-5 5 q-2 8 -10 9 L8 22 M14 22 l-3 -14" stroke="#2c2438" strokeWidth="2.5" fill="none" />
        <circle cx="16" cy="-20" r="1" fill="#2c2438" />
        <ellipse cx="8" cy="24" rx="10" ry="2" fill="none" stroke="#d8c8a0" strokeWidth="1.2" opacity="0.5" style={{ animation: "ripple 3.4s ease-in-out infinite" }} />
      </g>
      </PLayer>

      {/* ═══ premier plan : berge proche, tronc, cerf ═══ */}
      <PLayer depth={3}>
      {/* berge : sable humide près de l'eau, plus sombre */}
      <path d="M0 504 Q240 486 520 502 Q780 516 1000 498 L1000 560 L0 560 Z" fill="url(#r1soil)" />
      <path d="M0 504 Q240 486 520 502 Q780 516 1000 498 L1000 560 L0 560 Z" fill="#241608" opacity="0.35" filter="url(#r1mottle)" />
      <path d="M0 504 Q240 486 520 502 Q780 516 1000 498 L1000 560 L0 560 Z" fill="#2c1c10" opacity="0.5" filter="url(#r1grain)" />
      {/* ligne de rive mouillée + reflet */}
      <path d="M0 505 Q240 488 520 503 T1000 499" stroke="#2c2438" strokeWidth="5" fill="none" opacity="0.5" />
      <path d="M0 508 Q240 492 520 507 T1000 503" stroke="#e8d4a8" strokeWidth="2" fill="none" opacity="0.5" />
      {/* galets mouillés, brillants côté soleil */}
      {[[90, 528, 14], [132, 541, 10], [420, 534, 16], [472, 547, 9], [560, 528, 12], [938, 534, 13], [660, 544, 8], [240, 548, 7]].map(([x, y, r], i) => (
        <g key={i}>
          <ellipse cx={x + r * 0.9} cy={y + 2} rx={r * 1.5} ry={r * 0.35} fill="#1c1420" opacity="0.45" />
          <ellipse cx={x} cy={y} rx={r} ry={r * 0.58} fill={i % 2 ? "#6e5a48" : "#564636"} />
          <path d={`M${x - r * 0.65} ${y - r * 0.28} q${r * 0.6} -${r * 0.45} ${r * 1.3} -${r * 0.06}`} stroke="#e8d4a8" strokeWidth="1.6" fill="none" opacity="0.7" />
        </g>
      ))}
      {/* LE TRONC CREUX échoué : cernes, fentes, mousse */}
      <g transform="translate(240,514)">
        <ellipse cx="0" cy="16" rx="88" ry="10" fill="#180f08" opacity="0.6" />
        <path d="M-78 -8 Q-80 -20 -66 -20 L66 -14 Q80 -13 78 0 L76 8 Q76 16 62 16 L-64 12 Q-78 12 -78 -8 Z" fill="url(#r1trunk)" />
        <path d="M-78 -8 Q-80 -20 -66 -20 L66 -14 Q80 -13 78 0 L76 8 Q76 16 62 16 L-64 12 Q-78 12 -78 -8 Z" fill="#221408" opacity="0.5" filter="url(#r1grain)" />
        {/* l'ouverture du tronc : cernes concentriques */}
        <ellipse cx="72" cy="-1" rx="10" ry="13" fill="#160c05" />
        <ellipse cx="72" cy="-1" rx="10" ry="13" fill="none" stroke="#33210f" strokeWidth="2.5" />
        <ellipse cx="72" cy="-1" rx="6" ry="8" fill="none" stroke="#4a3018" strokeWidth="1.4" opacity="0.8" />
        <ellipse cx="72" cy="-1" rx="3" ry="4" fill="none" stroke="#2c1a0c" strokeWidth="1.2" opacity="0.8" />
        {/* fibre du bois, fentes, écorce décollée */}
        <path d="M-66 -12 h110 M-60 -2 h96 M-52 6 h80" stroke="#33210f" strokeWidth="2" opacity="0.7" />
        <path d="M-30 -16 l14 4 M8 -14 l16 3" stroke="#241408" strokeWidth="2.5" opacity="0.7" />
        <path d="M-40 -18 q6 -10 16 -8" stroke="#4a3322" strokeWidth="4" fill="none" />
        {/* dessus éclairé par l'aube + mousse */}
        <path d="M-70 -16 Q0 -22 70 -12" stroke="#c9a878" strokeWidth="2" fill="none" opacity="0.5" />
        <ellipse cx="-34" cy="-16" rx="12" ry="4" fill="#3c4a28" opacity="0.85" />
        <ellipse cx="-20" cy="-18" rx="6" ry="2.5" fill="#4c5c30" opacity="0.85" />
      </g>
      {/* roseaux à quenouilles, détaillés */}
      <g>
        {[640, 660, 682, 700, 720].map((x, i) => (
          <g key={i}>
            <path d={`M${x} 520 q${i % 2 ? 5 : -5} -50 ${i % 2 ? 8 : -3} -${82 + (i % 3) * 10}`} stroke={i % 2 ? "#4a6228" : "#3c5222"} strokeWidth="3.5" fill="none" style={{ animation: `sway ${3 + i * 0.4}s ease-in-out infinite`, transformOrigin: `${x}px 520px`, transformBox: "view-box" }} />
            <ellipse cx={x + (i % 2 ? 8 : -3)} cy={430 - (i % 3) * 10} rx="4.5" ry="15" fill="#5c4020" style={{ animation: `sway ${3 + i * 0.4}s ease-in-out infinite`, transformOrigin: `${x}px 520px`, transformBox: "view-box" }} />
            <path d={`M${x + (i % 2 ? 8 : -3)} ${414 - (i % 3) * 10} l0 -8`} stroke="#5c4020" strokeWidth="1.6" />
          </g>
        ))}
        {/* feuilles de roseaux */}
        <path d="M652 512 q14 -30 4 -58 M694 516 q-12 -26 -4 -52" stroke="#54724a" strokeWidth="2.5" fill="none" opacity="0.8" />
      </g>
      {/* LE CERF qui boit dans la lumière de l'aube */}
      {!hunted ? (
        <g transform="translate(800,470)">
          <ellipse cx="0" cy="40" rx="54" ry="8" fill="#1c1008" opacity="0.55" />
          {/* corps deux tons + contre-jour doré */}
          <path d="M-34 0 Q-38 -22 -12 -24 L26 -20 Q44 -18 42 -2 Q40 12 24 14 L-20 12 Q-34 12 -34 0 Z" fill="#6e4a2c" />
          <path d="M-34 0 Q-38 -22 -12 -24 L10 -22 Q-10 -14 -16 4 Z" fill="#7d5636" />
          <path d="M-30 8 Q0 14 22 12 Q0 8 -26 2 Z" fill="#54381e" opacity="0.8" />
          <ellipse cx="8" cy="-4" rx="18" ry="10" fill="#8a6240" opacity="0.5" />
          {/* liseré de lumière sur le dos (soleil à gauche) */}
          <path d="M-30 -16 Q-8 -26 18 -21" stroke="#ffe0a8" strokeWidth="2.2" fill="none" opacity="0.65" />
          {/* cou penché vers l'eau */}
          <path d="M34 -12 Q58 -6 66 18 L74 30" stroke="#6e4a2c" strokeWidth="13" strokeLinecap="round" fill="none" />
          <path d="M36 -16 Q56 -10 64 8" stroke="#ffe0a8" strokeWidth="1.8" fill="none" opacity="0.5" />
          {/* tête */}
          <g transform="translate(76,34) rotate(28)">
            <path d="M-8 -6 Q6 -10 14 -2 Q18 2 12 6 L-4 8 Q-12 6 -8 -6 Z" fill="#7d5636" />
            <circle cx="0" cy="-2" r="1.8" fill="#160c05" />
            <circle cx="0.6" cy="-2.6" r="0.5" fill="#ffe0a8" opacity="0.9" />
            <ellipse cx="13" cy="3" rx="2.5" ry="2" fill="#2e1d12" />
            <path d="M-6 -8 l-5 -8" stroke="#6e4a2c" strokeWidth="4" strokeLinecap="round" />
          </g>
          {/* bois, éclairés sur leur tranche */}
          <g stroke="#4a3018" strokeWidth="3.2" fill="none" strokeLinecap="round">
            <path d="M60 6 q-2 -18 -12 -26 M54 -8 q-10 -4 -14 -12 M56 -14 q2 -10 10 -14 M52 -20 q-6 -8 -14 -8" />
          </g>
          <path d="M48 -20 q-2 -14 -8 -20" stroke="#c9a878" strokeWidth="1.4" fill="none" opacity="0.6" />
          {/* pattes fines + sabots */}
          <path d="M-26 10 L-30 42 M-12 12 L-13 42 M12 12 L14 42 M26 8 L32 40" stroke="#5c3a22" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M-31 42 l4 3 M-14 42 l4 3 M13 42 l4 3 M31 40 l5 3" stroke="#241408" strokeWidth="4" strokeLinecap="round" />
          {/* queue + cercles dans l'eau où il boit */}
          <path d="M-34 -6 q-8 0 -9 7" stroke="#6e4a2c" strokeWidth="5" strokeLinecap="round" fill="none" />
          <ellipse cx="86" cy="46" rx="20" ry="3.5" fill="none" stroke="#fff2c4" strokeWidth="1.8" opacity="0.6" style={{ animation: "ripple 2.4s ease-in-out infinite" }} />
          <ellipse cx="86" cy="46" rx="11" ry="2" fill="none" stroke="#e8d4a8" strokeWidth="1.2" opacity="0.5" style={{ animation: "ripple 1.8s ease-in-out infinite" }} />
        </g>
      ) : (
        /* après la chasse : les empreintes dans le sable humide */
        <g fill="#2c1e12" opacity="0.85">
          {[[760, 520], [790, 530], [822, 524], [854, 534]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x},${y})`}>
              <ellipse cx="-3" cy="0" rx="3.5" ry="6" /><ellipse cx="4" cy="0" rx="3.5" ry="6" />
              <ellipse cx="-3" cy="-1.4" rx="3" ry="4" fill="#1c1208" />
            </g>
          ))}
        </g>
      )}
      {/* DORU — accroupi, immobile, il guette le cerf de l'autre côté.
          Son épreuve pour le nouveau : ramener ce cerf… de LOIN. */}
      <g transform="translate(470,486)">
        <ellipse cx="0" cy="22" rx="28" ry="7" fill="#160f08" opacity="0.65" />
        <Figure x={0} y={22} s={0.858} pose="kneel" facing="right" skin="#c8986c" hair="#2c2013" look="ponytail" mood="colere" hat="headband" hatColor="#8a5a30" paint
          garment="fur" coat="#5c3a22" pants="#4a2e18" bareArms arms={[{ a1: 18, a2: -16 }, { a1: 155, a2: -105 }]} />
      </g>
      {/* le « ? » doré : c'est au tour de Doru dans la quête */}
      {queteQui === "doru" && (
        <g transform="translate(452,371)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
          <path d="M0 0 q0 -22 22 -22 q22 0 22 18 q0 15 -18 20 l0 7" fill="none" stroke="#ffd166" strokeWidth="4" />
          <circle cx="22" cy="34" r="2.8" fill="#ffd166" />
        </g>
      )}

      {/* herbes et roseaux sombres qui cadrent le bas */}
      <g opacity="0.9">
        <path d="M-4 560 q10 -34 4 -52 M16 560 q3 -28 14 -44 M38 560 q-6 -24 2 -40" stroke="#1a140c" strokeWidth="4" fill="none" />
        <path d="M950 560 q-8 -30 -2 -46 M972 560 q4 -26 12 -38 M994 560 q-4 -22 4 -34" stroke="#1a140c" strokeWidth="4" fill="none" />
        <path d="M120 560 q6 -22 0 -32 M360 560 q-5 -18 2 -28 M760 560 q6 -18 0 -26" stroke="#221a10" strokeWidth="3.5" fill="none" />
      </g>
      </PLayer>

      {/* léger voile de grain sur toute l'image */}
      <rect width="1000" height="560" fill="#141008" opacity="0.1" filter="url(#r1grain)" style={{ pointerEvents: "none" }} />

      {/* zones cliquables — hors couches (décalage max « rayon) */}
      {!hunted && <Hotspot cx={810} cy={470} r={78} label="cerf" item="cerf" reveal={reveal} onClick={() => collect("cerf")} />}
      <Hotspot cx={240} cy={510} r={70} label="tronc" item="tronc" reveal={reveal} onClick={() => collect("tronc")} />
      <Hotspot cx={470} cy={451} r={53} label="Doru" reveal={reveal} onClick={(p) => action("doru", p)} />
    </svg>
  );
}
