/* ============================================================
   JEU 3 — Décors des voyages du Chronographe K-01 (1000 × 560)
   ------------------------------------------------------------
   Les destinations dont aucun tableau du Jeu 1 ne montre le bon
   lieu ni la bonne date ont leur propre décor ici :
     VKSignalHill — Signal Hill (Terre-Neuve), 12 décembre 1901 :
                    Marconi capte le « S » envoyé de Poldhu
     VKDaguerre   — l'atelier parisien de Daguerre, 1839
     VKBell       — Boston, 5 Exeter Place, 10 mars 1876
     VKEdison     — le laboratoire de Menlo Park, décembre 1877
     VKLumiere    — le salon indien du Grand Café, 28 décembre 1895
     VKFallback   — ruelle / forêt / désert, pour les années
                    « hors dossier »
   Chaque décor dessine ses personnages aux positions données par
   le tableau DEST de BunkerVoyageK.jsx (zones cliquables : x = pieds,
   y ≈ hauteur de la poitrine).
   ============================================================ */
import { Bust, Figure } from "../../engine/chars.jsx";
import { Clouds, Conifer, Dunes, Grass, Haze, Palm, Ridge, Rock, Speckle, rng } from "../../engine/scenery.jsx";
import { PerspFloor, Vignette } from "./bunkerKit.jsx";

const Frame = ({ id, defs, children }) => (
  <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" style={{ display: "block", width: "100%", height: "100%" }}>
    <defs>
      <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8" /></filter>
      {defs}
    </defs>
    {children}
    <Vignette id={`${id}-vig`} w={1000} h={560} strength={0.45} />
  </svg>
);

/* lattes de bois verticales, teintes inégales */
function Planks({ x0, x1, y0, y1, w = 34, colors, seed = 1 }) {
  const r = rng(seed);
  return (
    <g>
      {Array.from({ length: Math.ceil((x1 - x0) / w) }).map((_, i) => (
        <rect key={i} x={x0 + i * w} y={y0} width={w - 1.5} height={y1 - y0} fill={colors[Math.floor(r() * colors.length)]} />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <ellipse key={`n${i}`} cx={x0 + r() * (x1 - x0)} cy={y0 + r() * (y1 - y0)} rx="4" ry="2" fill="#000" opacity="0.15" />
      ))}
    </g>
  );
}

/* ═════════════ MARCONI · Signal Hill, 12 décembre 1901 ═════════════ */
export function VKSignalHill() {
  return (
    <Frame id="vksh" defs={
      <>
        <linearGradient id="vksh-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a96a4" /><stop offset="100%" stopColor="#d4d8dc" /></linearGradient>
        <linearGradient id="vksh-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a5a6a" /><stop offset="100%" stopColor="#2a3644" /></linearGradient>
        <clipPath id="vksh-win"><rect x="640" y="90" width="270" height="240" /></clipPath>
      </>}>
      {/* le mur de planches peint, qui s'écaille */}
      <rect width="1000" height="560" fill="#5a6a64" />
      <Planks x0={0} x1={1000} y0={40} y1={410} colors={["#6a7a72", "#64746c", "#70807a", "#5e6e66"]} seed={1901} />
      {[[120, 180, 40, 16], [520, 120, 30, 12], [360, 300, 50, 18]].map(([x, y, rx, ry], i) => <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#8a7a5a" opacity="0.35" />)}
      <rect width="1000" height="44" fill="#3a3a34" />
      <rect y="40" width="1000" height="6" fill="#2a2a24" />
      <rect y="404" width="1000" height="10" fill="#3a3a30" />
      {/* plancher */}
      <rect y="410" width="1000" height="150" fill="#5a4630" />
      <PerspFloor y0={410} y1={560} step={70} rows={4} opacity={0.4} />

      {/* LA FENÊTRE : ciel d'hiver, l'Atlantique, la tour Cabot, le cerf-volant */}
      <g clipPath="url(#vksh-win)">
        <rect x="640" y="90" width="270" height="240" fill="url(#vksh-sky)" />
        <Clouds id="vksh-cl" seed={1902} items={[[700, 130, 140], [860, 110, 120], [780, 170, 100]]} color="#e8eaee" shadow="#7a8494" opacity={0.85} drift={10} />
        <rect x="640" y="250" width="270" height="80" fill="url(#vksh-sea)" />
        {[262, 276, 292, 310].map((y) => <path key={y} d={`M640 ${y} q20 -3 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0`} stroke="#c8d0d8" strokeWidth="1" fill="none" opacity="0.4" />)}
        {/* la colline, la neige, et la tour Cabot tout en haut */}
        <path d="M640 330 L640 236 Q690 220 730 230 L760 214 Q800 210 820 236 L910 270 L910 330 Z" fill="#4a5040" />
        <path d="M660 236 q20 -6 40 -2 M740 220 q20 -6 50 0 M830 246 q20 4 40 12" stroke="#f0f2f4" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
        <g transform="translate(780,214)">
          <rect x="-14" y="-40" width="28" height="40" fill="#6a6258" />
          <rect x="-18" y="-46" width="36" height="8" fill="#5a5248" />
          {[-16, -8, 0, 8].map((x) => <rect key={x} x={x} y="-52" width="5" height="6" fill="#5a5248" />)}
          <rect x="18" y="-26" width="12" height="26" fill="#6a6258" />
          <rect x="-4" y="-30" width="6" height="10" fill="#2a2620" />
        </g>
        {/* le cerf-volant hexagonal qui porte l'antenne, secoué par le vent */}
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0; 6 -4; -4 3; 0 0" dur="3.2s" repeatCount="indefinite" />
          <path d="M858 104 l12 -7 l12 7 l0 14 l-12 7 l-12 -7 Z" fill="#e8dcc0" stroke="#5a4a30" strokeWidth="1.2" />
          <path d="M858 104 l24 14 M882 104 l-24 14 M870 97 v28" stroke="#5a4a30" strokeWidth="0.8" />
          <path d="M870 125 q-6 14 4 26 q-8 10 2 22" stroke="#c8b890" strokeWidth="1" fill="none" />
        </g>
        <path d="M870 118 Q820 190 760 252 Q720 296 700 330" stroke="#2a2a2a" strokeWidth="1" fill="none" />
        {/* le vent qui chasse la neige */}
        {Array.from({ length: 12 }).map((_, i) => (
          <circle key={i} cx={650 + (i * 47) % 260} cy={100 + (i * 31) % 220} r="1.4" fill="#fff" opacity="0.8">
            <animate attributeName="cx" values={`${650 + (i * 47) % 260};${700 + (i * 47) % 260}`} dur={`${1.4 + (i % 3) * 0.4}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
      <rect x="632" y="82" width="286" height="256" fill="none" stroke="#3a3a30" strokeWidth="10" />
      <path d="M775 90 v240 M640 210 h270" stroke="#3a3a30" strokeWidth="5" />
      <rect x="624" y="336" width="302" height="10" fill="#4a4a3a" />
      {/* le fil d'antenne entre par un trou du châssis et descend au récepteur */}
      <path d="M700 330 Q690 360 640 372 Q600 380 586 392" stroke="#2a2a2a" strokeWidth="1.6" fill="none" />

      {/* le poêle, le manteau, le calendrier */}
      <g transform="translate(90,410)">
        <rect x="-4" y="-370" width="12" height="270" fill="#1a1a1a" />
        <path d="M-30 -100 Q-36 -50 -26 0 L26 0 Q36 -50 30 -100 Z" fill="#2a2a2a" />
        <rect x="-34" y="-112" width="68" height="14" rx="3" fill="#1a1a1a" />
        <rect x="-12" y="-74" width="24" height="18" rx="2" fill="#ff8a3c" opacity="0.8" />
        <circle cx="0" cy="-66" r="30" fill="#ff8a3c" opacity="0.2" filter="url(#vksh-blur)" />
      </g>
      <g transform="translate(230,160)">
        <path d="M0 0 v10" stroke="#2a2a24" strokeWidth="3" />
        <path d="M-22 10 q22 -8 44 0 L36 120 L-36 120 Z" fill="#2a2420" />
        <path d="M-12 8 q12 18 24 0" stroke="#1a1410" strokeWidth="2" fill="none" />
      </g>
      <g transform="translate(400,140)">
        <rect x="-30" y="-30" width="60" height="70" fill="#efe6d2" />
        <rect x="-30" y="-30" width="60" height="16" fill="#8a1a1a" />
        <text x="0" y="-18" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fontWeight="700" fill="#f0e8d0">DÉC. 1901</text>
        {Array.from({ length: 30 }).map((_, k) => <rect key={k} x={-26 + (k % 7) * 7.6} y={-8 + Math.floor(k / 7) * 9} width="5" height="6" fill={k === 11 ? "#8a1a1a" : "#a8a088"} opacity="0.7" />)}
      </g>

      {/* LA TABLE DU RÉCEPTEUR */}
      <g transform="translate(560,400)">
        <ellipse cx="0" cy="100" rx="170" ry="10" fill="#000" opacity="0.3" />
        <rect x="-160" y="0" width="320" height="12" fill="#6a4a2a" stroke="#2a1a0a" strokeWidth="1.5" />
        <rect x="-150" y="12" width="10" height="90" fill="#4a3018" /><rect x="140" y="12" width="10" height="90" fill="#4a3018" />
        {/* piles */}
        {[-130, -104].map((x) => <g key={x}><rect x={x} y="-30" width="20" height="30" fill="#5a6a7a" opacity="0.8" /><rect x={x + 4} y="-36" width="4" height="6" fill="#c8a848" /><rect x={x + 12} y="-36" width="4" height="6" fill="#3a3a3a" /></g>)}
        {/* le cohéreur : un tube de verre et sa limaille, sur son support */}
        <g transform="translate(-40,-20)">
          <rect x="-30" y="12" width="70" height="8" fill="#4a3018" />
          <rect x="-22" y="-4" width="54" height="10" rx="5" fill="#d8e8f0" opacity="0.6" stroke="#8a9aa8" strokeWidth="0.8" />
          <rect x="-26" y="-3" width="8" height="8" fill="#a8a090" /><rect x="28" y="-3" width="8" height="8" fill="#a8a090" />
          <rect x="0" y="-2" width="8" height="6" fill="#5a5a5a" opacity="0.7" />
          <path d="M-22 6 v6 M32 6 v6" stroke="#8a8070" strokeWidth="2" />
          {/* le petit marteau qui tapote le tube */}
          <path d="M4 -4 L12 -20" stroke="#5a5a5a" strokeWidth="2" /><circle cx="12" cy="-22" r="3" fill="#8a8a8a" />
        </g>
        {/* le combiné téléphonique, au bout de son fil */}
        <path d="M30 -6 Q20 -40 -40 -70" stroke="#1a1a1a" strokeWidth="1.6" fill="none" />
        <rect x="40" y="-24" width="30" height="24" fill="#2a2420" />
        <rect x="80" y="-16" width="56" height="16" fill="#efe6d2" transform="rotate(-4 108 -8)" />
        <path d="M86 -10 h40 M86 -6 h30" stroke="#5a4a30" strokeWidth="0.8" transform="rotate(-4 108 -8)" />
        <text x="108" y="-24" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" fill="#2a1a0a" fontStyle="italic" transform="rotate(-4 108 -8)">• • •</text>
        <g transform="translate(-140,-34)">
          <path d="M-8 34 h16 l-3 -10 h-10 Z" fill="#8a6a3a" />
          <path d="M-5 24 q-6 -12 5 -20 q11 8 5 20 Z" fill="#fff0c8" opacity="0.6" />
          <circle cx="0" cy="16" r="20" fill="#ffd890" opacity="0.25" filter="url(#vksh-blur)" />
        </g>
      </g>

      {/* MARCONI, assis, le combiné à l'oreille */}
      <rect x="360" y="420" width="70" height="8" fill="#4a3018" />
      <path d="M366 428 v52 M424 428 v52 M362 360 v68" stroke="#4a3018" strokeWidth="5" />
      <Figure x={400} y={482} s={1.0} pose="sit" facing="right" skin="#e0b090" hair="#2a1a10" look="slick" mustache mood="surpris"
        garment="coat" coat="#2a2a34" pants="#1e1e26" shoes="#0e0e12" arms={[{ a1: 60, a2: -80 }, { a1: 70, a2: 80 }]}>
        <ellipse cx="-14" cy="-102" rx="5" ry="7" fill="#1a1a1a" />
        <path d="M-6 -88 h12 l-2 6 h-8 Z" fill="#efe9dc" />
      </Figure>

      {/* GEORGE KEMP, son assistant, près de la fenêtre */}
      <Figure x={830} y={500} s={1.0} facing="left" skin="#d8a884" hair="#6a5a48" look="short" mustache="handlebar" mood="content"
        garment="coat" coat="#4a3a2a" pants="#2a2420" shoes="#1a1410" arms={[{ a1: 10, a2: 6 }, { a1: 60, a2: 90 }]}>
        <rect x="-44" y="-74" width="16" height="20" fill="#efe6d2" stroke="#5a4a30" strokeWidth="0.8" />
      </Figure>
    </Frame>
  );
}

/* ═════════════ DAGUERRE · Paris, 1839 ═════════════ */
export function VKDaguerre() {
  return (
    <Frame id="vkdg" defs={
      <>
        <linearGradient id="vkdg-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9ab4cc" /><stop offset="100%" stopColor="#e4dcc8" /></linearGradient>
        <linearGradient id="vkdg-cone" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fff4d0" stopOpacity="0.3" /><stop offset="100%" stopColor="#fff4d0" stopOpacity="0" /></linearGradient>
        <clipPath id="vkdg-win"><rect x="100" y="90" width="260" height="220" /></clipPath>
      </>}>
      {/* plâtre de la mansarde, poutres */}
      <rect width="1000" height="560" fill="#c8b898" />
      <Speckle seed={1839} x0={0} x1={1000} y0={40} y1={400} n={160} colors={["#a89878", "#e0d4b8"]} r={[0.8, 2]} opacity={0.4} perspective={false} />
      <path d="M0 0 L1000 0 L1000 40 L600 40 L0 120 Z" fill="#8a7458" />
      <path d="M0 120 L600 40" stroke="#5a4428" strokeWidth="10" />
      {[120, 300, 480].map((x, i) => <path key={x} d={`M${x} ${120 - i * 26 - (x - 120) * 0.02} L${x} 400`} stroke="#6a5030" strokeWidth="12" opacity="0.8" />)}
      <rect y="396" width="1000" height="10" fill="#6a5030" />
      <rect y="404" width="1000" height="156" fill="#7a5a38" />
      <PerspFloor y0={404} y1={560} step={66} rows={4} opacity={0.4} />

      {/* LA FENÊTRE sur les toits de Paris et les tours de Notre-Dame */}
      <g clipPath="url(#vkdg-win)">
        <rect x="100" y="90" width="260" height="220" fill="url(#vkdg-sky)" />
        <g fill="#8a8ca0" opacity="0.8">
          <rect x="250" y="150" width="24" height="90" /><rect x="282" y="150" width="24" height="90" /><rect x="250" y="190" width="56" height="50" />
          <rect x="252" y="146" width="20" height="6" /><rect x="284" y="146" width="20" height="6" />
          <path d="M318 190 L330 150 L342 190 Z" />
        </g>
        {[[100, 230, 60, "#6a5a6a"], [150, 220, 70, "#7a6a74"], [210, 236, 60, "#5a5060"], [270, 240, 90, "#6a6070"]].map(([x, y, w, c], i) => (
          <g key={i}><path d={`M${x} ${y} L${x + w * 0.2} ${y - 20} L${x + w * 0.8} ${y - 20} L${x + w} ${y} L${x + w} 320 L${x} 320 Z`} fill={c} />
            {[0.3, 0.7].map((f) => <rect key={f} x={x + w * f - 4} y={y - 34} width="8" height="16" fill="#8a4a3a" />)}</g>
        ))}
        <path d="M120 300 q40 -10 80 0 t80 0 t80 0" stroke="#d8d0c0" strokeWidth="3" fill="none" opacity="0.4" />
      </g>
      <rect x="94" y="84" width="272" height="232" fill="none" stroke="#5a4428" strokeWidth="10" />
      <path d="M230 90 v220 M100 200 h260" stroke="#5a4428" strokeWidth="5" />
      <rect x="86" y="314" width="288" height="10" fill="#6a5030" />
      {/* le jour qui entre et éclaire le sujet */}
      <path d="M100 90 L360 90 L760 520 L300 520 Z" fill="url(#vkdg-cone)" />

      {/* sur un chevalet : la vue du boulevard du Temple (1838), une rue
          déserte — on ne voit qu'un homme, immobile chez le cireur */}
      <g transform="translate(470,250)">
        <path d="M-40 140 L0 -70 L40 140 M0 -70 L0 150" stroke="#5a3a1a" strokeWidth="5" fill="none" />
        <rect x="-50" y="-40" width="100" height="78" fill="#3a2a1a" />
        <rect x="-44" y="-34" width="88" height="66" fill="#a8acb0" />
        <path d="M-44 20 L-10 -6 L10 -6 L44 32 Z" fill="#8a8e92" />
        {[-34, -24, 24, 34].map((x, i) => <circle key={i} cx={x} cy={-14 + (i % 2) * 6} r="8" fill="#6a6e72" />)}
        <path d="M-44 -6 L-20 -20 L-20 6 Z M44 -4 L20 -18 L20 8 Z" fill="#7a7e82" />
        <circle cx="-14" cy="14" r="1.6" fill="#3a3a3a" /><path d="M-14 15 v5" stroke="#3a3a3a" strokeWidth="1.2" />
        <rect x="-50" y="38" width="100" height="6" fill="#5a3a1a" />
      </g>

      {/* LA CHAMBRE NOIRE (boîte à tiroir) sur sa table, tournée vers la fenêtre */}
      <g transform="translate(300,400)">
        <rect x="-50" y="0" width="100" height="10" fill="#6a4a2a" /><path d="M-44 10 v90 M44 10 v90" stroke="#4a3018" strokeWidth="6" />
        <rect x="-40" y="-56" width="70" height="56" fill="#8a5a30" stroke="#3a2010" strokeWidth="2" />
        <rect x="-6" y="-52" width="54" height="48" fill="#9a6a3a" stroke="#3a2010" strokeWidth="1.5" />
        <rect x="-50" y="-40" width="14" height="24" fill="#2a2a2a" /><circle cx="-50" cy="-28" r="9" fill="#1a1a1a" stroke="#c8a848" strokeWidth="2" />
        <rect x="14" y="-48" width="26" height="8" fill="#efe6d2" opacity="0.7" />
      </g>

      {/* L'ÉTABLI : boîte à iode, boîte à mercure sur sa lampe, plaques, flacons */}
      <g transform="translate(780,400)">
        <ellipse cx="0" cy="104" rx="190" ry="10" fill="#000" opacity="0.3" />
        <rect x="-180" y="0" width="360" height="12" fill="#6a4a2a" stroke="#2a1a0a" strokeWidth="1.5" />
        <rect x="-170" y="12" width="12" height="92" fill="#4a3018" /><rect x="158" y="12" width="12" height="92" fill="#4a3018" />
        <g transform="translate(-120,0)"><rect x="-28" y="-34" width="56" height="34" fill="#7a5030" stroke="#3a2010" strokeWidth="1.5" /><rect x="-30" y="-40" width="60" height="8" fill="#9a6a3a" /><text x="0" y="-12" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" fill="#e8dcc0">IODE</text></g>
        <g transform="translate(-30,0)">
          <path d="M-24 -50 L24 -50 L16 -24 L-16 -24 Z" fill="#6a4a2a" stroke="#3a2010" strokeWidth="1.5" />
          <path d="M-14 -24 v24 M14 -24 v24" stroke="#3a2010" strokeWidth="3" />
          <path d="M-5 -6 q5 -12 10 0 Z" fill="#7fb8ff" opacity="0.8" />
          <rect x="18" y="-80" width="4" height="34" fill="#e8e8f0" stroke="#8a8a8a" strokeWidth="0.6" /><circle cx="20" cy="-46" r="3" fill="#c83a2a" />
          <text x="0" y="-34" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7" fill="#e8dcc0">MERCURE</text>
        </g>
        {[40, 62, 84].map((x, i) => <g key={x}><rect x={x - 7} y={-30 - i * 2} width="14" height={30 + i * 2} rx="3" fill={["#3a6a4a", "#8a6a3a", "#d8d0c0"][i]} opacity="0.85" /><rect x={x - 4} y={-36 - i * 2} width="8" height="6" fill="#3a2010" /></g>)}
        {[120, 140].map((x, i) => <rect key={x} x={x - 14} y={-4 - i * 3} width="30" height="4" fill="#c8ccd0" stroke="#8a8a8a" strokeWidth="0.5" transform={`rotate(${-4 + i * 6} ${x} -4)`} />)}
      </g>

      {/* DAGUERRE, debout près de sa chambre noire */}
      <Figure x={420} y={500} s={1.0} facing="right" skin="#e0b090" hair="#7a6a5a" look="curls" beard="chops" beardColor="#7a6a5a" mood="content"
        garment="coat" coat="#2a2a3a" pants="#3a3a44" shoes="#141418" arms={[{ a1: 10, a2: 6 }, { a1: 70, a2: 60 }]}>
        <path d="M-8 -90 Q0 -80 8 -90 L6 -76 Q0 -72 -6 -76 Z" fill="#efe9dc" />
        <rect x="34" y="-66" width="20" height="14" fill="#a8acb0" stroke="#5a4a30" strokeWidth="1" />
      </Figure>
      {/* ISIDORE NIÉPCE, son associé (le fils de Nicéphore) */}
      <Figure x={880} y={500} s={0.98} facing="left" skin="#e4b48a" hair="#3a2818" look="short" mustache mood="neutre"
        garment="coat" coat="#4a3a2a" pants="#2a2420" shoes="#1a1410" arms={[{ a1: 10, a2: 6 }, { a1: 10, a2: 6 }]} />
    </Frame>
  );
}

/* ═════════════ BELL · Boston, 10 mars 1876 ═════════════ */
export function VKBell() {
  return (
    <Frame id="vkbl" defs={
      <>
        <pattern id="vkbl-paper" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#8a7a5a" />
          <path d="M20 8 q6 6 0 12 q-6 -6 0 -12 Z M4 30 q4 4 0 8 q-4 -4 0 -8 Z" fill="#6a5a3a" opacity="0.6" />
        </pattern>
        <linearGradient id="vkbl-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#141c30" /><stop offset="100%" stopColor="#2a3048" /></linearGradient>
        <clipPath id="vkbl-win"><rect x="80" y="110" width="150" height="190" /></clipPath>
      </>}>
      <rect width="1000" height="560" fill="url(#vkbl-paper)" />
      <rect width="1000" height="560" fill="#2a1a0a" opacity="0.35" />
      <rect width="1000" height="36" fill="#3a2a1a" />
      <rect y="396" width="1000" height="10" fill="#3a2414" />
      <rect y="404" width="1000" height="156" fill="#5a3a20" />
      <PerspFloor y0={404} y1={560} step={66} rows={4} opacity={0.4} />

      {/* fenêtre sur Boston, le soir */}
      <g clipPath="url(#vkbl-win)">
        <rect x="80" y="110" width="150" height="190" fill="url(#vkbl-night)" />
        {[[80, 200, 60], [140, 180, 50], [190, 210, 40]].map(([x, y, w], i) => (
          <g key={i}><rect x={x} y={y} width={w} height={300 - y} fill="#3a2420" />
            {Array.from({ length: 6 }).map((_, k) => <rect key={k} x={x + 6 + (k % 3) * 16} y={y + 10 + Math.floor(k / 3) * 26} width="8" height="12" fill={(k + i) % 3 ? "#ffd88a" : "#1a1210"} opacity="0.8" />)}</g>
        ))}
      </g>
      <rect x="74" y="104" width="162" height="202" fill="none" stroke="#3a2414" strokeWidth="8" />
      <path d="M155 110 v190 M80 205 h150" stroke="#3a2414" strokeWidth="4" />
      {/* bec de gaz mural */}
      <g transform="translate(300,150)">
        <path d="M0 0 h20 v10" stroke="#8a6a3a" strokeWidth="3" fill="none" />
        <path d="M14 10 h12 l-2 14 h-8 Z" fill="#e8dcc0" opacity="0.85" />
        <circle cx="20" cy="18" r="40" fill="#ffd890" opacity="0.18" filter="url(#vkbl-blur)" />
      </g>

      {/* la cloison et la porte ouverte sur la pièce de Watson */}
      <rect x="640" y="36" width="360" height="370" fill="#6a5a3a" />
      <rect x="640" y="36" width="360" height="370" fill="#000" opacity="0.25" />
      <rect x="690" y="150" width="140" height="256" fill="#2a2018" />
      <rect x="696" y="156" width="128" height="250" fill="#4a3a28" />
      <rect x="760" y="190" width="56" height="70" fill="#1a2238" /><path d="M788 190 v70 M760 225 h56" stroke="#3a2a1a" strokeWidth="3" />
      <ellipse cx="760" cy="300" rx="90" ry="60" fill="#ffd890" opacity="0.14" filter="url(#vkbl-blur)" />
      <path d="M696 156 L660 140 L660 420 L696 406 Z" fill="#5a4028" stroke="#2a1a0a" strokeWidth="1.5" />
      <rect x="680" y="140" width="160" height="12" fill="#4a3018" />
      {/* les fils qui courent le long du mur, d'une pièce à l'autre */}
      <path d="M560 380 L560 120 L700 120 L700 160 Q720 170 740 200" stroke="#1a1a1a" strokeWidth="1.6" fill="none" />
      <path d="M570 380 L570 126 L706 126" stroke="#8a3a1a" strokeWidth="1.2" fill="none" />
      {[[557, 180], [557, 260], [557, 340], [610, 117], [660, 117]].map(([x, y]) => <rect key={`${x}-${y}`} x={x - 3} y={y - 3} width="8" height="8" rx="2" fill="#c8a848" />)}
      {/* THOMAS WATSON, dans l'autre pièce, le récepteur collé à l'oreille */}
      <rect x="770" y="350" width="50" height="8" fill="#5a3a20" /><path d="M774 358 v48 M816 358 v48" stroke="#3a2414" strokeWidth="4" />
      <Figure x={750} y={404} s={0.86} facing="left" skin="#e0b090" hair="#5a3a20" look="short" mustache mood="surpris"
        garment="jacket" coat="#5a4a3a" pants="#2a2420" shoes="#1a1410" arms={[{ a1: 150, a2: -150 }, { a1: 10, a2: 6 }]}>
        <ellipse cx="-22" cy="-104" rx="5" ry="7" fill="#2a2420" />
      </Figure>

      {/* LA TABLE DE BELL : l'émetteur à liquide (cornet, membrane, aiguille
          plongée dans l'eau acidulée) et les piles en bocaux */}
      <g transform="translate(470,400)">
        <ellipse cx="0" cy="100" rx="150" ry="10" fill="#000" opacity="0.3" />
        <rect x="-140" y="0" width="280" height="12" fill="#6a4a2a" stroke="#2a1a0a" strokeWidth="1.5" />
        <rect x="-130" y="12" width="10" height="90" fill="#4a3018" /><rect x="120" y="12" width="10" height="90" fill="#4a3018" />
        <rect x="-120" y="50" width="240" height="6" fill="#4a3018" />
        {[-96, -64, -32, 0].map((x) => <g key={x}><rect x={x} y="22" width="24" height="28" rx="3" fill="#9ac0b0" opacity="0.55" /><rect x={x} y="34" width="24" height="16" fill="#5a8a7a" opacity="0.6" /><path d={`M${x + 6} 22 v-6 M${x + 18} 22 v-6`} stroke="#c98a4a" strokeWidth="1.6" /></g>)}
        <g transform="translate(50,0)">
          <rect x="-20" y="-8" width="40" height="8" fill="#3a2414" />
          <path d="M-10 -8 v-60 M10 -8 v-60" stroke="#5a5a5a" strokeWidth="3" />
          <path d="M-12 -40 Q0 -36 12 -40 L10 -8 L-10 -8 Z" fill="#c8d8e0" opacity="0.5" stroke="#8a9aa8" strokeWidth="0.8" />
          <rect x="-16" y="-72" width="32" height="6" fill="#8a6a3a" />
          <path d="M-14 -72 L-30 -106 L30 -106 L14 -72 Z" fill="#c8a050" stroke="#7a5a20" strokeWidth="1.2" />
          <path d="M0 -66 v30" stroke="#3a3a3a" strokeWidth="1.2" />
        </g>
        <rect x="-136" y="-6" width="50" height="6" fill="#efe6d2" transform="rotate(-4 -111 -3)" />
      </g>
      {/* ALEXANDER GRAHAM BELL, penché sur le cornet */}
      <Figure x={420} y={500} s={1.02} facing="right" skin="#e4b48a" hair="#1e140c" look="short" beard="short" beardColor="#1e140c" mood="surpris"
        garment="coat" coat="#1e1a1e" pants="#1a1418" shoes="#0e0a0a" arms={[{ a1: 70, a2: 40 }, { a1: 30, a2: 10 }]} />
    </Frame>
  );
}

/* ═════════════ EDISON · Menlo Park, décembre 1877 ═════════════ */
export function VKEdison() {
  const VX = 500, VY = 230; // point de fuite : l'orgue au fond du laboratoire
  return (
    <Frame id="vked" defs={
      <linearGradient id="vked-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a6a44" /><stop offset="100%" stopColor="#5a4028" /></linearGradient>
    }>
      {/* la longue salle de bois, vue en enfilade */}
      <rect width="1000" height="560" fill="#6a5034" />
      <path d={`M0 0 L${VX - 120} ${VY - 80} L${VX + 120} ${VY - 80} L1000 0 Z`} fill="#4a3620" />
      <path d={`M0 560 L${VX - 120} ${VY + 60} L${VX + 120} ${VY + 60} L1000 560 Z`} fill="#5a4028" />
      {Array.from({ length: 16 }).map((_, i) => { const x = -400 + i * 120; return <path key={i} d={`M${VX + (x - VX) * 0.1} ${VY + 60} L${x} 560`} stroke="#3a2a18" strokeWidth="1.2" opacity="0.6" />; })}
      <path d={`M0 0 L${VX - 120} ${VY - 80} L${VX - 120} ${VY + 60} L0 560 Z`} fill="url(#vked-wood)" />
      <path d={`M1000 0 L${VX + 120} ${VY - 80} L${VX + 120} ${VY + 60} L1000 560 Z`} fill="url(#vked-wood)" />
      {/* les étagères de flacons qui fuient le long des deux murs */}
      {[0, 1].map((side) => Array.from({ length: 5 }).map((_, r) => {
        const xA = (t) => side ? 1000 - (1000 - (VX + 120)) * t : (VX - 120) * t;
        return (
          <g key={`${side}-${r}`}>
            <path d={`M${xA(0)} ${60 + r * 70} L${xA(1)} ${VY - 60 + r * 22}`} stroke="#3a2a18" strokeWidth={4 - r * 0.4} />
            {Array.from({ length: 12 }).map((_, k) => {
              const t = k / 12, x = xA(t), y = (60 + r * 70) * (1 - t) + (VY - 60 + r * 22) * t, h = 22 * (1 - t * 0.8);
              return <rect key={k} x={x - h * 0.3} y={y - h} width={h * 0.55} height={h} fill={["#7a9a8a", "#c8a050", "#8a4a3a", "#d8d0c0", "#5a7a9a"][(k + r + side) % 5]} opacity="0.75" />;
            })}
          </g>
        );
      }))}
      {/* l'orgue, tout au fond (il y en avait un à Menlo Park) */}
      <rect x={VX - 120} y={VY - 80} width="240" height="140" fill="#3a2818" />
      {Array.from({ length: 13 }).map((_, i) => <rect key={i} x={VX - 96 + i * 15} y={VY - 70 + Math.abs(6 - i) * 5} width="9" height={80 - Math.abs(6 - i) * 5} rx="4" fill="#c8a050" stroke="#7a5a20" strokeWidth="0.8" />)}
      <rect x={VX - 60} y={VY + 18} width="120" height="22" fill="#2a1a10" />
      {/* les becs de gaz qui pendent, en enfilade */}
      {[0.15, 0.4, 0.62].map((t, i) => {
        const y = 20 + t * 120, s = 1 - t * 0.6;
        return [VX - 260 * (1 - t), VX + 260 * (1 - t)].map((xx, k) => (
          <g key={`${i}-${k}`} transform={`translate(${xx},${y}) scale(${s})`}>
            <path d="M0 -40 v40" stroke="#3a2a18" strokeWidth="2" />
            <path d="M-12 0 h24 l-4 14 h-16 Z" fill="#e8dcc0" />
            <circle cx="0" cy="10" r="36" fill="#ffd890" opacity="0.18" filter="url(#vked-blur)" />
          </g>
        ));
      })}
      {/* les longues tables du labo, au milieu */}
      <path d={`M${VX - 60} ${VY + 64} L${VX + 60} ${VY + 64} L${VX + 200} ${VY + 160} L${VX - 200} ${VY + 160} Z`} fill="#4a3018" />
      {[VX - 30, VX, VX + 30].map((x, i) => <rect key={i} x={x - 4} y={VY + 50 + i * 3} width="8" height="14" fill={["#7a9a8a", "#c8a050", "#8a4a3a"][i]} />)}
      {/* deux collaborateurs au fond, à leurs paillasses */}
      <Figure x={VX - 110} y={VY + 110} s={0.42} facing="right" skin="#d8a884" hair="#3a2818" look="short" garment="jacket" coat="#5a4a3a" pants="#2a2420" arms={[{ a1: 60, a2: 60 }, { a1: 60, a2: 60 }]} />
      <Figure x={VX + 120} y={VY + 118} s={0.44} facing="left" skin="#e0b090" hair="#5a3a20" look="short" mustache garment="jacket" coat="#3a4a5a" pants="#2a2a30" arms={[{ a1: 30, a2: -30 }, { a1: 10, a2: 6 }]} />

      {/* LA TABLE DU PREMIER PLAN et LE PHONOGRAPHE À FEUILLE D'ÉTAIN */}
      <g transform="translate(560,410)">
        <ellipse cx="0" cy="104" rx="200" ry="12" fill="#000" opacity="0.35" />
        <rect x="-190" y="0" width="380" height="14" fill="#6a4a2a" stroke="#2a1a0a" strokeWidth="1.5" />
        <rect x="-180" y="14" width="12" height="92" fill="#4a3018" /><rect x="168" y="14" width="12" height="92" fill="#4a3018" />
        <g transform="translate(-10,0)">
          <rect x="-90" y="-10" width="180" height="10" fill="#2a2a2e" />
          <path d="M-80 -10 v-20 M80 -10 v-20" stroke="#2a2a2e" strokeWidth="6" />
          <rect x="-110" y="-34" width="230" height="4" fill="#8a8c92" />
          {/* le cylindre de laiton entouré de sa feuille d'étain */}
          <rect x="-60" y="-56" width="120" height="44" rx="6" fill="#c8a050" />
          <rect x="-60" y="-56" width="120" height="44" rx="6" fill="#e8e8ec" opacity="0.7" />
          {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M${-56 + i * 8.5} -56 l4 44`} stroke="#9a9aa0" strokeWidth="0.8" />)}
          <path d="M-50 -48 h100" stroke="#fff" strokeWidth="3" opacity="0.5" />
          {/* la manivelle */}
          <circle cx="124" cy="-32" r="5" fill="#2a2a2e" />
          <g><animateTransform attributeName="transform" type="rotate" values="0 124 -32;360 124 -32" dur="2.4s" repeatCount="indefinite" /><path d="M124 -32 L124 -58 L140 -58" stroke="#2a2a2e" strokeWidth="4" fill="none" strokeLinecap="round" /></g>
          {/* l'embouchure et sa membrane */}
          <rect x="-30" y="-84" width="10" height="28" fill="#2a2a2e" />
          <path d="M-40 -96 L-10 -96 L-16 -84 L-34 -84 Z" fill="#3a3a3e" />
          <ellipse cx="-25" cy="-96" rx="15" ry="4" fill="#1a1a1e" />
        </g>
        <g transform="translate(150,-4)"><rect x="-20" y="-6" width="40" height="6" fill="#efe6d2" /><path d="M-14 -4 h28" stroke="#5a4a30" strokeWidth="0.6" /></g>
      </g>
      {/* THOMAS EDISON, qui crie dans l'embouchure */}
      <Figure x={440} y={500} s={1.02} facing="right" skin="#e4b48a" hair="#4a3a2a" look="mid" mood="surpris"
        garment="jacket" coat="#3a3430" coat2="#e8e4da" pants="#2a2420" shoes="#1a1410" arms={[{ a1: 70, a2: 40 }, { a1: 40, a2: 20 }]} />
      {/* JOHN KRUESI, le mécanicien qui a construit la machine */}
      <Figure x={830} y={500} s={1.0} facing="left" skin="#d8a884" hair="#5a4a3a" look="short" beard="full" beardColor="#5a4a3a" mood="vexe"
        garment="jacket" coat="#4a4a50" apron="#8a7a5a" pants="#2a2a30" shoes="#1a1a1e" arms={[{ a1: 40, a2: -60 }, { a1: 40, a2: -60 }]} />
    </Frame>
  );
}

/* ═════════════ LUMIÈRE · Grand Café, 28 décembre 1895 ═════════════ */
export function VKLumiere() {
  return (
    <Frame id="vklu" defs={
      <>
        <linearGradient id="vklu-beam" x1="1" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#fff4d0" stopOpacity="0.45" /><stop offset="100%" stopColor="#fff4d0" stopOpacity="0.05" /></linearGradient>
        <linearGradient id="vklu-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3a1a20" /><stop offset="100%" stopColor="#1a0a10" /></linearGradient>
      </>}>
      <rect width="1000" height="560" fill="url(#vklu-wall)" />
      {/* les arcs « indiens » du salon, en bleu, rouge et or */}
      {Array.from({ length: 7 }).map((_, i) => {
        const x = 70 + i * 145;
        return (
          <g key={i} opacity={i === 2 || i === 3 || i === 4 ? 0.35 : 0.9}>
            {/* arc polylobé « moghol », pointe en bulbe */}
            <path d={`M${x - 52} 380 L${x - 52} 170 Q${x - 60} 140 ${x - 36} 126 Q${x - 44} 104 ${x - 18} 100 Q${x - 6} 84 ${x} 66 Q${x + 6} 84 ${x + 18} 100 Q${x + 44} 104 ${x + 36} 126 Q${x + 60} 140 ${x + 52} 170 L${x + 52} 380 Z`} fill="#1a3a4a" stroke="#c8a040" strokeWidth="3" />
            <path d={`M${x - 40} 380 L${x - 40} 174 Q${x - 46} 150 ${x - 28} 138 Q${x - 34} 120 ${x - 12} 116 Q${x - 4} 102 ${x} 88 Q${x + 4} 102 ${x + 12} 116 Q${x + 34} 120 ${x + 28} 138 Q${x + 46} 150 ${x + 40} 174 L${x + 40} 380 Z`} fill="#5a1a1e" />
            {Array.from({ length: 5 }).map((_, k) => <path key={k} d={`M${x} ${150 + k * 44} l10 10 l-10 10 l-10 -10 Z`} fill="#c8a040" opacity="0.6" />)}
            <rect x={x - 60} y="376" width="120" height="8" fill="#c8a040" opacity="0.7" />
          </g>
        );
      })}
      <rect width="1000" height="56" fill="#2a1418" />
      <path d="M0 56 h1000" stroke="#c8a040" strokeWidth="3" opacity="0.7" />
      {/* l'écran, et le film projeté : la sortie de l'usine Lumière à Lyon */}
      <g transform="translate(500,190)">
        <rect x="-180" y="-110" width="360" height="220" fill="#e8e4d8" />
        <g>
          <animate attributeName="opacity" values="1;0.85;1;0.9;1" dur="0.35s" repeatCount="indefinite" />
          <rect x="-170" y="-100" width="340" height="200" fill="#b8b4a8" />
          <rect x="-150" y="-90" width="300" height="120" fill="#8a8680" />
          <rect x="-80" y="-60" width="160" height="110" fill="#4a4844" />
          <path d="M-80 -60 L0 -80 L80 -60" fill="#6a6660" />
          <rect x="-170" y="50" width="340" height="50" fill="#a8a49a" />
          {Array.from({ length: 11 }).map((_, i) => (
            <g key={i}>
              <animateTransform attributeName="transform" type="translate" values={`0 0; ${(i % 2 ? 1 : -1) * (60 + i * 8)} 20`} dur={`${3 + (i % 3)}s`} repeatCount="indefinite" />
              <circle cx={-50 + i * 10} cy="22" r="4" fill="#2a2826" />
              <path d={`M${-56 + i * 10} 40 L${-50 + i * 10} 26 L${-44 + i * 10} 40 Z`} fill="#2a2826" />
            </g>
          ))}
        </g>
        <rect x="-180" y="-110" width="360" height="220" fill="none" stroke="#1a0a0a" strokeWidth="6" />
      </g>
      {/* le faisceau du cinématographe, plein de poussière */}
      <path d="M840 300 L330 90 L670 300 Z" fill="url(#vklu-beam)" opacity="0.7">
        <animate attributeName="opacity" values="0.6;0.8;0.65;0.75;0.6" dur="0.5s" repeatCount="indefinite" />
      </path>
      {/* plancher */}
      <rect y="384" width="1000" height="176" fill="#3a2418" />
      <PerspFloor y0={384} y1={560} step={70} rows={4} opacity={0.45} />
      {/* LE CINÉMATOGRAPHE sur son pied, et l'opérateur qui tourne la manivelle */}
      <g transform="translate(860,300)">
        <path d="M-20 0 L-34 160 M20 0 L34 160 M0 0 L0 160" stroke="#3a2418" strokeWidth="5" />
        <rect x="-30" y="-30" width="60" height="34" fill="#8a5a30" stroke="#3a2010" strokeWidth="2" />
        <rect x="-44" y="-22" width="14" height="16" fill="#2a2a2a" />
        <circle cx="-44" cy="-14" r="6" fill="#fff4d0" />
        <circle cx="34" cy="-14" r="4" fill="#2a2a2a" />
        <g><animateTransform attributeName="transform" type="rotate" values="0 34 -14;360 34 -14" dur="0.75s" repeatCount="indefinite" /><path d="M34 -14 L50 -14" stroke="#2a2a2a" strokeWidth="3" strokeLinecap="round" /></g>
      </g>
      <Figure x={930} y={470} s={0.9} facing="left" skin="#e0b090" hair="#3a2818" look="short" mustache mood="neutre"
        garment="jacket" coat="#3a3430" pants="#2a2420" shoes="#1a1410" arms={[{ a1: 10, a2: 6 }, { a1: 70, a2: 60 }]} />
      {/* le public, de dos : hauts-de-forme, chapeaux à plumes */}
      {[[0, 448, 1.0], [1, 506, 1.18]].map(([row, y, s]) => (
        <g key={row}>
          {Array.from({ length: row ? 6 : 7 }).map((_, i) => {
            const x = (row ? 250 : 220) + i * (row ? 98 : 84) + (row ? 0 : 20);
            if (x > 800) return null;
            return (
              <g key={i}>
                <Bust x={x} y={y - 40 * s} s={0.62 * s} back skin="#c8a888" hair={["#3a2818", "#1a1410", "#6a5a48"][i % 3]} cloth={["#1a1a1e", "#3a2a2a", "#2a2a3a"][i % 3]} collar="none"
                  look={["short", "bun", "short", "bun", "ring", "bun", "short"][i]} hat={["tophat", "pillbox", "brim", null, "tophat", "pillbox", "brim"][i]} hatColor={["#141414", "#6a2a3a", "#2a2a2a", null, "#141414", "#3a4a6a", "#2a2a2a"][i]} />
                <rect x={x - 24 * s} y={y + 6} width={48 * s} height="10" rx="3" fill="#2a1410" />
              </g>
            );
          })}
        </g>
      ))}
      {/* l'affiche à l'entrée : « Entrée 1 franc » */}
      <g transform="translate(70,250)">
        <rect x="-50" y="-70" width="100" height="140" fill="#e8dcc0" stroke="#5a3a20" strokeWidth="2" />
        <text x="0" y="-48" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fontWeight="700" fill="#5a1a10">CINÉMATOGRAPHE</text>
        <text x="0" y="-34" textAnchor="middle" fontFamily="Georgia,serif" fontSize="12" fontWeight="800" fill="#2a1a10">LUMIÈRE</text>
        <circle cx="0" cy="0" r="22" fill="#2a2a2a" /><circle cx="0" cy="0" r="14" fill="#fff4d0" opacity="0.8" />
        <text x="0" y="40" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" fill="#2a1a10">Entrée : 1 franc</text>
        <text x="0" y="54" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7" fontStyle="italic" fill="#5a3a20">14, bd des Capucines</text>
      </g>
      {/* ANTOINE LUMIÈRE, le père, qui reçoit le public */}
      <Figure x={150} y={500} s={1.0} facing="right" skin="#e0b090" hair="#e8e4dc" look="ring" beard="full" beardColor="#e8e4dc" mood="content"
        garment="coat" coat="#2a2228" pants="#1a1418" shoes="#0e0a0a" arms={[{ a1: 10, a2: 6 }, { a1: 80, a2: 70 }]} />
      {/* une spectatrice, debout dans l'allée, qui n'en revient pas */}
      <Figure x={790} y={520} s={1.02} facing="left" skin="#ecc8a4" hair="#5a3820" look="bun" hat="pillbox" hatColor="#6a2a3a" hatColor2="#c8a040" mood="surpris"
        garment="dress" coat="#4a2a3a" pants="#2a1418" shoes="#1a0a10" arms={[{ a1: 10, a2: 6 }, { a1: 130, a2: 140 }]} />
    </Frame>
  );
}

/* ═════════════ HORS DOSSIER : ruelle, forêt, désert ═════════════ */
const shadowPeople = (pts, coat) => pts.map(([x, y, facing], i) => (
  <Figure key={i} x={x} y={y} s={0.9} facing={facing} skin="#3a3036" hair="#141018" look={i ? "short" : "long"} hat={i ? "brim" : "hood"} hatColor="#141018" hoodColor={coat}
    garment="coat" coat={coat} pants="#141018" shoes="#0a080c" mood="neutre" arms={[{ a1: 10, a2: 6 }, { a1: 10, a2: 6 }]} />
));

export function VKFallback({ kind = "ruelle" }) {
  if (kind === "foret") {
    return (
      <Frame id="vkff" defs={<linearGradient id="vkff-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0a1220" /><stop offset="100%" stopColor="#1e2a34" /></linearGradient>}>
        <rect width="1000" height="560" fill="url(#vkff-sky)" />
        {(() => { const r = rng(77); return Array.from({ length: 60 }, (_, i) => <circle key={i} cx={(r() * 1000).toFixed(0)} cy={(r() * 240).toFixed(0)} r={r() < 0.15 ? 1.3 : 0.7} fill="#e0e8f0" opacity={(0.3 + r() * 0.5).toFixed(2)} />); })()}
        <circle cx="760" cy="110" r="70" fill="#c8d0d8" opacity="0.12" filter="url(#vkff-blur)" />
        <circle cx="760" cy="110" r="30" fill="#d8e0e8" opacity="0.8" />
        <Ridge id="vkff-r" seed={78} y={330} amp={60} fill="#141e24" lit="#1e2a32" light={1} />
        {Array.from({ length: 16 }).map((_, i) => <Conifer key={i} x={i * 66 + (i % 2) * 20} y={420 + (i % 3) * 6} h={130 + (i % 4) * 30} color="#0c1612" light={1} lit="#1a2a22" />)}
        <Haze id="vkff-hz" y0={380} y1={470} color="#8aa0b0" opacity={0.25} />
        <rect y="460" width="1000" height="100" fill="#080c0a" />
        {[40, 330, 690, 980].map((x, i) => <Conifer key={`f${i}`} x={x} y={560} h={300} color="#040806" light={1} />)}
        <circle cx="500" cy="500" r="1.8" fill="#ffd870" opacity="0.8"><animate attributeName="opacity" values="0.8;0;0.8" dur="4s" repeatCount="indefinite" /></circle>
        <circle cx="509" cy="500" r="1.8" fill="#ffd870" opacity="0.8"><animate attributeName="opacity" values="0.8;0;0.8" dur="4s" repeatCount="indefinite" /></circle>
        {shadowPeople([[300, 475, "right"], [680, 465, "left"]], "#1e2420")}
        <text x="500" y="545" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="12" fill="#6a7a7a" fontStyle="italic" letterSpacing="2">une forêt la nuit, à une époque indéfinie</text>
      </Frame>
    );
  }
  if (kind === "desert") {
    return (
      <Frame id="vkfd" defs={<linearGradient id="vkfd-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2a1a2a" /><stop offset="60%" stopColor="#8a4a3a" /><stop offset="100%" stopColor="#e8904a" /></linearGradient>}>
        <rect width="1000" height="560" fill="url(#vkfd-sky)" />
        <circle cx="500" cy="380" r="150" fill="#ffb060" opacity="0.25" filter="url(#vkfd-blur)" />
        <circle cx="500" cy="380" r="60" fill="#ffc070" />
        <Dunes id="vkfd-d1" seed={91} y={400} amp={40} fill="#6a3a28" shadow="#4a2418" light={1} />
        <Dunes id="vkfd-d2" seed={93} y={470} amp={50} fill="#4a2818" shadow="#2a140c" light={1} />
        <Palm x={110} y={470} h={150} lean={-14} color="#1a1008" trunk="#1a1008" dates={false} seed={95} />
        <Palm x={160} y={480} h={110} lean={10} color="#1a1008" trunk="#1a1008" dates={false} seed={96} />
        <Speckle seed={97} x0={0} x1={1000} y0={480} y1={556} n={120} colors={["#8a5030", "#2a140c"]} r={[0.8, 1.8]} opacity={0.5} />
        {shadowPeople([[320, 485, "right"], [660, 495, "left"]], "#2a1810")}
        <text x="500" y="545" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="12" fill="#e8b890" fontStyle="italic" letterSpacing="2">un désert au crépuscule, à une époque indéfinie</text>
      </Frame>
    );
  }
  return (
    <Frame id="vkfr" defs={<linearGradient id="vkfr-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#141028" /><stop offset="100%" stopColor="#2a2032" /></linearGradient>}>
      <rect width="1000" height="560" fill="url(#vkfr-sky)" />
      <circle cx="800" cy="110" r="34" fill="#a89aa0" opacity="0.7" />
      {/* maisons à colombages qui se penchent sur la ruelle, fenêtres éteintes */}
      {[[-40, 160, 0], [150, 120, 1], [700, 130, 2], [870, 150, 3]].map(([x, top, k]) => (
        <g key={k}>
          <rect x={x} y={top} width="180" height={430 - top} fill={["#2a2230", "#30283a", "#282030", "#322a36"][k]} />
          <path d={`M${x - 10} ${top} L${x + 90} ${top - 60} L${x + 190} ${top} Z`} fill="#1a1420" />
          {[0, 1, 2].map((r) => <path key={r} d={`M${x} ${top + 60 + r * 90} h180`} stroke="#141018" strokeWidth="5" />)}
          {[0, 1].map((r) => [0, 1, 2].map((c) => <rect key={`${r}-${c}`} x={x + 24 + c * 54} y={top + 80 + r * 90} width="22" height="30" fill={(k + r + c) % 5 === 0 ? "#ffd88a" : "#0e0a14"} opacity={(k + r + c) % 5 === 0 ? 0.7 : 1} />))}
        </g>
      ))}
      <rect y="430" width="1000" height="130" fill="#1a1618" />
      <PerspFloor y0={430} y1={560} step={60} rows={4} opacity={0.5} />
      {/* une lanterne au coin de la ruelle */}
      <g transform="translate(330,200)">
        <path d="M0 0 h30 v6" stroke="#141018" strokeWidth="3" fill="none" />
        <path d="M22 6 h16 l-2 20 h-12 Z" fill="#ffd88a" opacity="0.8" />
        <circle cx="30" cy="18" r="50" fill="#ffd88a" opacity="0.15" filter="url(#vkfr-blur)" />
      </g>
      <ellipse cx="490" cy="500" rx="200" ry="14" fill="#ffd88a" opacity="0.06" />
      {shadowPeople([[350, 435, "right"], [650, 455, "left"]], "#2a2232")}
      <text x="500" y="545" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="12" fill="#8a7a90" fontStyle="italic" letterSpacing="2">une ruelle, quelque part, à une époque indéfinie</text>
    </Frame>
  );
}
