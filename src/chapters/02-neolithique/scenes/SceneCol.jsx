import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";
import { Clouds, Haze, Ridge, Rock, Speckle } from "../../../engine/scenery.jsx";

/* ============================================================
   CHAPITRE 2 — Tableau : le col de la montagne (l'homme des glaces)
   Peinture fine — HAUTE MONTAGNE ALPINE (Ötzi = Alpes, pas le
   pôle) : roche grise-brune qui affleure, névés et plaques de
   neige, alpenglow chaud sur les cimes, moraine rocheuse au sol.
   À trouver ici : le minerai de cuivre, l'aiguille d'os, la suie
   (près du feu), la pierre à marteler.
   ============================================================ */

export default function SceneCol({ collect, action, reveal, made = [] }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="cl-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#33517e" />
          <stop offset="50%" stopColor="#7c9cbc" />
          <stop offset="82%" stopColor="#c8cfc8" />
          <stop offset="100%" stopColor="#e6d8b8" />
        </linearGradient>
        <linearGradient id="cl-rockFar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9a8f84" /><stop offset="100%" stopColor="#6e6660" /></linearGradient>
        <linearGradient id="cl-rock" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#8c8076" /><stop offset="55%" stopColor="#6a6056" /><stop offset="100%" stopColor="#463f38" /></linearGradient>
        <linearGradient id="cl-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a7e6e" /><stop offset="100%" stopColor="#544a3e" /></linearGradient>
        <linearGradient id="cl-glacier" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d6e2e6" /><stop offset="100%" stopColor="#a6bac2" /></linearGradient>
        <radialGradient id="cl-fire" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffc068" stopOpacity="0.6" /><stop offset="100%" stopColor="#ff9540" stopOpacity="0" /></radialGradient>
        <filter id="cl-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="cl-mottle" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="cl-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7" /></filter>
      </defs>

      {/* ═══ ciel alpin (plus chaud à l'horizon) ═══ */}
      <rect width="1000" height="560" fill="url(#cl-sky)" />
      <circle cx="790" cy="120" r="40" fill="#fff2d2" opacity="0.9" />
      <circle cx="790" cy="120" r="72" fill="#fff2d2" opacity="0.22" filter="url(#cl-blur)" />
      <Clouds id="cl-cl" seed={5} items={[[260, 118, 220], [560, 74, 160], [120, 60, 120]]} color="#f4ece0" shadow="#b8c0c8" opacity="0.75" drift={18} />

      {/* ═══ couche lointaine : les grands sommets alpins, neige et alpenglow ═══ */}
      <PLayer depth={1}>
        <Ridge id="cl-r0" seed={101} y={250} amp={150} rough={0.62} fill="#9aa6c0" lit="#d8d0d8" light={1} snow="#f2f4f6" snowLine={170} opacity={0.75} />
        <Haze id="cl-h0" y0={150} y1={260} color="#d8e0e8" opacity={0.4} />
        <Ridge id="cl-r1" seed={103} y={290} amp={170} rough={0.64} fill="#7e746c" lit="#b8a090" light={1} snow="#eef4f6" snowLine={196} />
        <Haze id="cl-h1" y0={220} y1={300} color="#c8cfc8" opacity={0.45} />
      </PLayer>

      {/* ═══ couche intermédiaire : la langue de glacier entre deux éperons ═══ */}
      <PLayer depth={2}>
        {/* éperons rocheux de part et d'autre */}
        <Ridge id="cl-r2" seed={107} y={352} amp={112} rough={0.58} fill="url(#cl-rock)" lit="#a89880" light={1} snow="#e4ecf0" snowLine={262} />
        {/* le glacier descend du cirque vers nous : étroit au loin, large au pied */}
        <path d="M486 196 Q510 190 536 196 Q548 236 566 270 Q586 300 584 336 Q590 390 604 440 L424 440 Q440 392 438 340 Q436 300 458 268 Q476 234 486 196 Z" fill="url(#cl-glacier)" />
        <g stroke="#7e9cae" strokeWidth="2" fill="none" opacity="0.65" strokeLinecap="round">
          <path d="M478 230 q30 6 58 0 M466 262 q40 8 86 -2 M452 296 q50 8 110 -2 M446 332 q60 8 126 -2 M444 372 q66 8 136 -2 M436 410 q74 8 150 -2" />
        </g>
        <g fill="#8eaec0" opacity="0.6">
          <path d="M500 250 l4 8 l-8 0 Z M530 286 l6 10 l-12 0 Z M484 318 l6 10 l-12 0 Z M548 352 l7 12 l-14 0 Z M500 392 l7 12 l-14 0 Z" />
        </g>
        {/* moraines latérales : bandes de débris sombres le long des bords */}
        <path d="M486 196 Q476 234 458 268 Q436 300 438 340 Q440 392 424 440" stroke="#6a6056" strokeWidth="10" fill="none" opacity="0.8" strokeLinecap="round" />
        <path d="M536 196 Q548 236 566 270 Q586 300 584 336 Q590 390 604 440" stroke="#6a6056" strokeWidth="10" fill="none" opacity="0.8" strokeLinecap="round" />
        <path d="M512 210 Q508 300 516 440" stroke="#7a7066" strokeWidth="4" fill="none" opacity="0.45" strokeDasharray="10 8" />
        <ellipse cx="511" cy="198" rx="40" ry="12" fill="#c8cfd4" opacity="0.6" filter="url(#cl-blur)" />
        {/* plaques de névé accrochées à la roche */}
        <path d="M120 360 q30 -8 62 4 q-24 12 -62 6 Z" fill="#dde8ec" opacity="0.85" />
        <path d="M820 372 q34 -8 70 6 q-30 12 -70 4 Z" fill="#dde8ec" opacity="0.85" />
        {/* moraine : gros blocs au pied des pentes */}
        <Rock x={250} y={414} w={80} h={34} color="#6e655a" light={1} seed={3} />
        <Rock x={712} y={420} w={96} h={40} color="#645b50" light={1} seed={8} />
        <Rock x={128} y={430} w={60} h={24} color="#706658" light={1} seed={11} />
        <Rock x={900} y={432} w={70} h={28} color="#6a6054" light={1} seed={14} />
      </PLayer>

      {/* ═══ premier plan : le col rocheux (moraine + plaques de neige) ═══ */}
      <PLayer depth={3}>
        <path d="M0 560 L0 420 Q250 398 520 424 Q760 444 1000 416 L1000 560 Z" fill="url(#cl-ground)" />
        <path d="M0 560 L0 420 Q250 398 520 424 Q760 444 1000 416 L1000 560 Z" fill="#2a2318" opacity="0.34" filter="url(#cl-mottle)" />
        <path d="M0 560 L0 420 Q250 398 520 424 Q760 444 1000 416 L1000 560 Z" fill="#2e2820" opacity="0.4" filter="url(#cl-grain)" />
        <Speckle seed={61} x0={0} x1={1000} y0={426} y1={560} n={300} colors={["#3a3228", "#a89a88", "#5a5046", "#c8c0b4"]} opacity={0.5} />
        {/* plaques de neige résiduelle au sol (pas un manteau) */}
        <path d="M60 470 Q160 458 250 472 Q180 486 80 482 Q50 480 60 470 Z" fill="#e4eef0" opacity="0.85" />
        <path d="M560 486 Q680 476 800 490 Q690 500 580 496 Q540 494 560 486 Z" fill="#e4eef0" opacity="0.8" />
        <path d="M360 520 Q430 512 500 522 Q440 530 370 528 Z" fill="#e4eef0" opacity="0.7" />
        {/* cailloux de scree */}
        {[[180, 520, 9], [430, 540, 7], [520, 508, 6], [905, 516, 8], [250, 544, 6]].map(([x, y, r], i) => (
          <g key={i}>
            <ellipse cx={x - 2} cy={y + 2} rx={r * 1.3} ry={r * 0.35} fill="#1c1810" opacity="0.4" />
            <ellipse cx={x} cy={y} rx={r} ry={r * 0.62} fill={i % 2 ? "#7a6e5e" : "#645a4c"} />
            <path d={`M${x - r * 0.6} ${y - r * 0.3} q${r * 0.6} -${r * 0.4} ${r * 1.2} 0`} stroke="#9a8c78" strokeWidth="1.2" fill="none" opacity="0.5" />
          </g>
        ))}

        {/* LE FEU de bivouac + halo, et bol de SUIE */}
        <g transform="translate(430,478)">
          <ellipse cx="0" cy="16" rx="120" ry="40" fill="url(#cl-fire)" style={{ animation: "glow 2.4s ease-in-out infinite" }} />
          <path d="M-22 12 L20 16 M-18 18 L18 8" stroke="#3a2412" strokeWidth="6" strokeLinecap="round" />
          <g style={{ transformOrigin: "0px 10px", transformBox: "view-box", animation: "flick 0.9s ease-in-out infinite" }}>
            <path d="M0 12 Q-14 -6 -4 -26 Q0 -12 4 -20 Q14 -4 6 10 Z" fill="#ff7f24" />
            <path d="M0 11 Q-7 0 -2 -14 Q1 -6 3 -10 Q8 -1 3 9 Z" fill="#ffd36a" />
            <path d="M0 10 Q-3 4 0 -5 Q3 4 1 9 Z" fill="#fff2c4" />
          </g>
          <circle cx="-8" cy="-4" r="1.6" fill="#ffd166" style={{ animation: "spark 2.2s linear infinite" }} />
          {/* bol de suie */}
          <g transform="translate(46,16)">
            <ellipse cx="0" cy="7" rx="11" ry="4" fill="#2c2c30" opacity="0.5" />
            <path d="M-11 -3 Q-12 7 0 8 Q12 7 11 -3 Z" fill="#5a4636" />
            <ellipse cx="0" cy="-3" rx="10" ry="4.5" fill="#1c1c1c" />
            <ellipse cx="-3" cy="-4" rx="4" ry="2" fill="#3a3a3a" />
          </g>
        </g>

        {/* L'HOMME DES GLACES, emmitouflé, arc à côté, haleine visible */}
        <g transform="translate(300,470)">
          <ellipse cx="0" cy="34" rx="26" ry="7" fill="#2e281e" opacity="0.5" />
          <Figure x={0} y={34} s={0.918} pose="ground" skin="#bf9068" hair="#3a2a1a" mood="vexe" hood hoodColor="#7a6244" wrinkles
            garment="fur" coat="#6a5238" pants="#5a4630" arms={[{ a1: 14, a2: -12 }, { a1: 16, a2: -14 }]} />
          <ellipse cx="11" cy="-14" rx="9" ry="4" fill="#f0f4f8" opacity="0.45" style={{ animation: "drift 3.5s ease-in-out infinite" }} filter="url(#cl-blur)" />
          <path d="M24 34 Q40 0 30 -34" stroke="#6e4c2e" strokeWidth="3" fill="none" />
          <path d="M24 34 L30 -34" stroke="#c9b48a" strokeWidth="1.2" opacity="0.7" />
          <g transform="translate(-22,10) rotate(-30)">
            <rect x="-1" y="-10" width="2" height="20" rx="1" fill="#e8e0cc" />
            <circle cx="0" cy="-10" r="2" fill="#e8e0cc" />
            <circle cx="0" cy="-10" r="0.8" fill="#5a4636" />
          </g>
        </g>

        {/* PIERRE À MARTELER (enclume) */}
        <g transform="translate(620,506)">
          <ellipse cx="0" cy="10" rx="34" ry="10" fill="#2e281e" opacity="0.5" />
          <path d="M-30 8 Q-34 -8 -14 -12 L18 -12 Q34 -10 32 6 Q30 14 14 14 L-16 14 Q-30 14 -30 8 Z" fill="#8a8278" />
          <path d="M-30 8 Q-34 -8 -14 -12 L18 -12 Q34 -10 32 6 Q30 14 14 14 L-16 14 Q-30 14 -30 8 Z" fill="#5a5248" opacity="0.3" filter="url(#cl-grain)" />
          <path d="M-24 -2 Q0 -8 26 -2" stroke="#b8b0a4" strokeWidth="1.6" fill="none" opacity="0.6" />
          <ellipse cx="6" cy="-8" rx="10" ry="7" fill="#6a6258" />
        </g>

        {/* MINERAI de cuivre (malachite) au pied d'un rocher */}
        <g transform="translate(830,512)">
          <ellipse cx="0" cy="8" rx="30" ry="9" fill="#2e281e" opacity="0.5" />
          <ellipse cx="0" cy="0" rx="22" ry="14" fill="#5c584c" />
          <path d="M-14 -2 Q-4 -10 6 -4 Q14 0 8 8 Q-2 12 -12 6 Z" fill="#2e8a5a" />
          <path d="M-8 0 q6 -4 12 0 M-4 5 q5 -3 10 -1" stroke="#5ec88a" strokeWidth="2" fill="none" opacity="0.8" />
          <ellipse cx="-6" cy="-2" rx="4" ry="3" fill="#7ad8a0" opacity="0.7" />
        </g>

        {/* RÉSULTAT (msg_hache) : la HACHE DE CUIVRE, coulée et martelée, posée
            sur l'enclume — brillante, gravée de signes de propriété */}
        {made.includes("msg_hache") && (
          <g transform="translate(620,496)" style={{ animation: "fadein 1s ease-out" }}>
            <path d="M-30 12 L28 -14" stroke="#7a5230" strokeWidth="6" strokeLinecap="round" />
            <path d="M-30 12 L28 -14" stroke="#9a6c40" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <path d="M22 -20 L41 -11 L34 3 L17 -8 Z" fill="#c87838" />
            <path d="M22 -20 L41 -11 L34 3 L17 -8 Z" fill="none" stroke="#e0a860" strokeWidth="1.2" />
            <path d="M25 -16 L37 -9" stroke="#f0c890" strokeWidth="1.4" opacity="0.7" />
            <path d="M26 -7 l6 3 M28 -11 l6 3" stroke="#7a4a20" strokeWidth="1" opacity="0.8" />
            <path d="M19 -12 q4 4 8 2" stroke="#5a3f24" strokeWidth="2.5" fill="none" />
          </g>
        )}

        {/* rochers qui cadrent les coins du bas */}
        <path d="M0 560 L0 512 Q46 502 86 522 Q54 540 18 544 Q4 546 0 560 Z" fill="#3e372c" />
        <path d="M1000 560 L1000 508 Q950 500 916 520 Q956 538 986 542 Q998 544 1000 560 Z" fill="#3a342a" />
      </PLayer>

      {/* voile atmosphérique léger (pas froid-bleu) */}
      <rect width="1000" height="560" fill="#d8ceb8" opacity="0.05" style={{ pointerEvents: "none" }} />

      {/* zones cliquables */}
      {/* le « ? » de l'homme des glaces : une marque qui ne s'efface jamais ? */}
      {!made.includes("msg_tatouage") && (
        <>
          <g transform="translate(310,348)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
          </g>
          <Hotspot cx={330} cy={378} r={28} label="parler à l'homme des glaces" reveal={reveal} onClick={() => action("otzi")} />
        </>
      )}

      <Hotspot cx={270} cy={447} r={48} label="aiguille" item="aiguille" reveal={reveal} onClick={() => collect("aiguille")} />
      <Hotspot cx={476} cy={492} r={40} label="suie" item="suie" reveal={reveal} onClick={() => collect("suie")} />
      <Hotspot cx={620} cy={500} r={44} label="pierre" item="pierre" reveal={reveal} onClick={() => collect("pierre")} />
      <Hotspot cx={830} cy={508} r={44} label="minerai" item="minerai" reveal={reveal} onClick={() => collect("minerai")} />
          {/* AMBIANCE : petit vol d'oiseaux qui traverse le ciel */}
      <g opacity="0.75">
        <animateTransform attributeName="transform" type="translate"
          values="-40,0; 1050,-20" dur="28s" repeatCount="indefinite" />
        <path d="M0 130 q6 -8 12 0 q6 -8 12 0" stroke="#1a1408" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M28 142 q6 -8 12 0 q6 -8 12 0" stroke="#1a1408" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M54 128 q6 -8 12 0 q6 -8 12 0" stroke="#1a1408" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      {/* LUCIOLE qui danse autour du feu — point jaune-vert qui pulse */}
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="390,463; 410,438; 450,443; 470,468; 450,483; 410,478; 390,463"
          dur="12s" repeatCount="indefinite" />
        <circle r="4" fill="#eeff88" opacity="0.35">
          <animate attributeName="opacity" values="0.15;0.55;0.15" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="r" values="3;6;3" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <circle r="1.4" fill="#fffca8">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1.2s" repeatCount="indefinite" />
        </circle>
      </g>
</svg>
  );
}
