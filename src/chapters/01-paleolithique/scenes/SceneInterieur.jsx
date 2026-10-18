import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 1 — Tableau : au fond de la grotte
   VERSION « PEINTURE FINE » : obscurité profonde, grand rayon
   de lumière du matin qui entre par l'ouverture et vient
   baigner la paroi du fond, roche texturée (grain, marbrures,
   piquetage), stalactites luisantes, flaque qui reflète la
   lumière, atelier de taille détaillé.
   À trouver ici : la paroi (l'écran naturel) et le silex.
   ============================================================ */

export default function SceneInterieur({ collect, action, reveal, made = [], queteQui, inv = [] }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="g1bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#171009" />
          <stop offset="60%" stopColor="#100a06" />
          <stop offset="100%" stopColor="#0a0604" />
        </linearGradient>
        {/* la paroi du fond, éclairée côté entrée */}
        <linearGradient id="g1paroi" x1="0" y1="0" x2="1" y2="0.15">
          <stop offset="0%" stopColor="#96744e" />
          <stop offset="35%" stopColor="#7a5838" />
          <stop offset="70%" stopColor="#543822" />
          <stop offset="100%" stopColor="#321e12" />
        </linearGradient>
        {/* l'ouverture vers le jour (matin doré) */}
        <radialGradient id="g1day" cx="30%" cy="45%" r="80%">
          <stop offset="0%" stopColor="#fff8dc" />
          <stop offset="45%" stopColor="#f6d090" />
          <stop offset="100%" stopColor="#b8854e" />
        </radialGradient>
        <radialGradient id="g1pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffedb8" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#f0c890" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#f0c890" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="g1floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#402c1a" />
          <stop offset="100%" stopColor="#150d07" />
        </linearGradient>
        <filter id="g1blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="8" /></filter>
        <filter id="g1grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="g1mottle" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* ═══ fond de caverne (fixe) ═══ */}
      <rect width="1000" height="560" fill="url(#g1bg)" />
      {/* voûte : masses sombres qui encadrent */}
      <path d="M0 0 L1000 0 L1000 90 Q700 40 380 66 Q140 84 0 60 Z" fill="#1c1209" />
      <path d="M0 0 L1000 0 L1000 90 Q700 40 380 66 Q140 84 0 60 Z" fill="#0f0a05" opacity="0.5" filter="url(#g1mottle)" />

      {/* ═══ couche intermédiaire : entrée, parois latérales, concrétions ═══ */}
      <PLayer depth={2}>
      {/* l'ouverture, à gauche : le matin entre */}
      <path d="M0 110 Q130 200 96 560 L0 560 Z" fill="url(#g1day)" />
      <path d="M0 150 Q100 230 82 520 L0 540 Z" fill="#fff8dc" opacity="0.5" filter="url(#g1blur)" />
      {/* silhouettes dehors : arbres frais du matin */}
      <path d="M10 300 l7 -44 l7 44 M34 342 l9 -56 l9 56 M22 380 l5 -30 l5 30" stroke="#5a6a52" strokeWidth="5" opacity="0.65" fill="none" />
      {/* paroi latérale gauche, léchée par la lumière */}
      <path d="M0 60 Q190 96 96 250 Q34 348 122 560 L0 560 Z" fill="#2c1c10" />
      <path d="M0 60 Q190 96 96 250 Q34 348 122 560 L0 560 Z" fill="#160d06" opacity="0.55" filter="url(#g1grain)" />
      <path d="M150 120 Q110 210 100 260 M130 300 q-16 60 -6 120" stroke="#0e0805" strokeWidth="3" fill="none" opacity="0.6" />
      <path d="M96 250 Q60 330 100 440" stroke="#c99e66" strokeWidth="2.5" fill="none" opacity="0.35" />
      {/* paroi latérale droite, dans l'ombre */}
      <path d="M1000 40 Q830 70 894 210 Q952 340 856 560 L1000 560 Z" fill="#1e1208" />
      <path d="M1000 40 Q830 70 894 210 Q952 340 856 560 L1000 560 Z" fill="#120b05" opacity="0.6" filter="url(#g1grain)" />
      <path d="M900 120 q-14 60 -2 120 M880 300 q-10 60 4 130" stroke="#0c0704" strokeWidth="3" fill="none" opacity="0.5" />
      {/* stalactites : formes irrégulières, luisantes côté entrée */}
      {[[298, 74, 16, "#3c2818"], [352, 46, 10, "#2e1d12"], [414, 66, 13, "#33210f"], [478, 88, 18, "#3c2818"], [548, 58, 11, "#2e1d12"], [610, 78, 15, "#33210f"], [684, 44, 9, "#281808"], [758, 70, 16, "#2e1d12"], [842, 52, 10, "#241505"]].map(([x, h, w, c], i) => (
        <g key={i}>
          <path d={`M${x - w} 62 Q${x - w * 0.3} ${62 + h * 0.6} ${x} ${62 + h + (i % 3) * 14} Q${x + w * 0.3} ${62 + h * 0.6} ${x + w} 62 Z`} fill={c} />
          <path d={`M${x - w * 0.5} 66 Q${x - w * 0.15} ${62 + h * 0.5} ${x - w * 0.1} ${62 + h * 0.8}`} stroke="#c99e66" strokeWidth="1.6" fill="none" opacity={0.3 - (i % 3) * 0.07} />
          {i % 3 === 0 && <circle cx={x} cy={62 + h + (i % 3) * 14 + 2} r="1.4" fill="#ffedb8" opacity="0.5" />}
        </g>
      ))}
      {/* la chauve-souris endormie */}
      <g transform="translate(716,96)">
        <path d="M0 0 q-6 2 -7 9 q3 -2 7 -1 q4 -1 7 1 q-1 -7 -7 -9 Z" fill="#0d0805" />
        <circle cx="0" cy="9" r="3" fill="#0d0805" />
      </g>
      {/* stalagmites répondantes */}
      {[[336, 66], [724, 88], [806, 50], [552, 40]].map(([x, h], i) => (
        <g key={i}>
          <path d={`M${x - 20} 560 Q${x - 6} ${560 - h * 0.55} ${x} ${560 - h} Q${x + 6} ${560 - h * 0.55} ${x + 20} 560 Z`} fill="#33210f" />
          <path d={`M${x - 8} ${560 - h * 0.3} Q${x - 3} ${560 - h * 0.7} ${x} ${560 - h + 4}`} stroke="#c99e66" strokeWidth="1.4" fill="none" opacity="0.25" />
        </g>
      ))}
      </PLayer>

      {/* ═══ couche lointaine : LA GRANDE PAROI, baignée de matin ═══ */}
      <PLayer depth={1}>
      <path d="M380 60 Q700 30 940 90 L920 470 Q640 500 400 460 Z" fill="url(#g1paroi)" />
      {/* textures : marbrures + grain + piquetage */}
      <path d="M380 60 Q700 30 940 90 L920 470 Q640 500 400 460 Z" fill="#1c1006" opacity="0.3" filter="url(#g1mottle)" />
      <path d="M380 60 Q700 30 940 90 L920 470 Q640 500 400 460 Z" fill="#221408" opacity="0.55" filter="url(#g1grain)" />
      {[[470, 150], [540, 210], [610, 130], [680, 250], [750, 180], [820, 300], [500, 330], [590, 390], [700, 350], [780, 420], [860, 220], [430, 260]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={2.4 + (i % 3)} ry={1.5 + (i % 2)} fill="#241608" opacity="0.4" />
      ))}
      {/* strates douces + fissures */}
      <path d="M420 120 q160 -18 380 6 M410 220 q200 -14 430 10 M415 330 q180 -10 400 12" stroke="#33210f" strokeWidth="3" fill="none" opacity="0.35" />
      <path d="M600 90 q-8 60 6 110 q10 40 -4 80 M780 130 q10 50 -2 95 M520 300 q6 40 -2 80" stroke="#241408" strokeWidth="2.5" fill="none" opacity="0.55" />
      {/* taches minérales (ocres, manganèse) : la paroi a déjà une histoire */}
      <ellipse cx="585" cy="240" rx="34" ry="20" fill="#8a3418" opacity="0.1" />
      <ellipse cx="710" cy="320" rx="26" ry="14" fill="#2c2c38" opacity="0.14" />
      <ellipse cx="500" cy="180" rx="20" ry="12" fill="#a8431f" opacity="0.08" />
      {/* LE RAYON DU MATIN : il traverse la grotte depuis l'entrée */}
      <path d="M80 250 L640 140 L720 380 L110 430 Z" fill="#fff2cc" opacity="0.08" filter="url(#g1blur)" />
      <path d="M85 280 L600 190 L650 330 L100 400 Z" fill="#ffedb8" opacity="0.07" filter="url(#g1blur)" />
      {/* la nappe de lumière sur la paroi */}
      <ellipse cx="565" cy="270" rx="255" ry="185" fill="url(#g1pool)" />
      {/* arête gauche de la paroi accrochée par la lumière */}
      <path d="M395 80 Q390 260 405 450" stroke="#ffe0a8" strokeWidth="3" fill="none" opacity="0.3" />
      {/* poussière en suspension dans le rayon */}
      {[[240, 250], [320, 300], [410, 260], [480, 320], [280, 350], [370, 220]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1 + (i % 2) * 0.6} fill="#ffedb8" opacity="0.55" style={{ animation: `drift ${4.5 + i * 0.7}s ease-in-out infinite` }} />
      ))}

      {/* ═══ RÉSULTATS peints sur la paroi (feedback direct) ═══ */}
      {/* le MAMMOUTH au charbon — celui que le joueur a vu dans la vallée
          (tableau « devant la grotte »), redessiné de mémoire à la façon
          des mammouths de Rouffignac : un trait noir, souple et sûr. */}
      {made.includes("msg_peinture") && (
        <g transform="translate(575,272)" style={{ animation: "fadein .9s ease-out" }}>
          <g fill="none" stroke="#1c1208" strokeLinecap="round" strokeLinejoin="round">
            {/* la ligne du dos : dôme de la tête, creux de la nuque,
                grande bosse, croupe qui tombe */}
            <path d="M-84 4 Q-92 -22 -70 -36 Q-58 -44 -48 -36 Q-44 -52 -8 -54 Q36 -54 56 -32 Q70 -16 64 8" strokeWidth="5" />
            {/* le ventre laineux */}
            <path d="M-70 10 Q-30 24 24 20 Q48 18 60 10" strokeWidth="4.5" />
            {/* les longs poils qui pendent */}
            <path d="M-54 16 l-3 10 M-32 21 l-2 11 M-10 24 l-1 11 M14 22 l-1 10 M40 18 l-2 10" strokeWidth="2.5" />
            {/* les pattes-colonnes */}
            <path d="M-60 12 L-63 46 M-40 17 L-41 50 M22 20 L22 50 M46 12 L52 44" strokeWidth="6.5" />
            {/* la trompe, qui descend et se recourbe */}
            <path d="M-84 4 Q-96 22 -88 44 Q-84 54 -74 51" strokeWidth="4.5" />
          </g>
          {/* la défense, plus claire — gravée dans le trait */}
          <path d="M-72 16 Q-48 32 -28 22" stroke="#8a6a48" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <path d="M-70 12 Q-50 24 -36 17" stroke="#5a4028" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {/* l'œil, minuscule sous le dôme */}
          <circle cx="-62" cy="-24" r="2" fill="#120a06" />
          {/* rehaut d'ocre sur le flanc, souffle de couleur */}
          <path d="M-52 0 Q-8 10 44 2" stroke="#a8542a" strokeWidth="3" fill="none" opacity="0.35" />
        </g>
      )}
      {/* les MAINS NÉGATIVES à l'ocre, quand les mains sont faites */}
      {made.includes("msg_mains") && (
        <g style={{ animation: "fadein .9s ease-out" }}>
          {[[730, 250, 1], [772, 300, 0.82]].map(([hx, hy, sc], i) => (
            <g key={i} transform={`translate(${hx},${hy}) scale(${sc})`}>
              <ellipse cx="0" cy="0" rx="24" ry="28" fill="#9a3a1c" opacity="0.5" />
              <g fill="#4e3220">
                <rect x="-8" y="0" width="16" height="14" rx="5" />
                <rect x="-8" y="-14" width="4" height="16" rx="2" />
                <rect x="-3" y="-18" width="4" height="20" rx="2" />
                <rect x="2" y="-16" width="4" height="18" rx="2" />
                <rect x="6" y="-12" width="4" height="14" rx="2" />
                <rect x="-14" y="-8" width="6" height="11" rx="3" transform="rotate(-32 -11 -3)" />
              </g>
            </g>
          ))}
        </g>
      )}
      </PLayer>

      {/* ═══ premier plan : le sol, la flaque, l'atelier de taille ═══ */}
      <PLayer depth={3}>
      <path d="M0 560 L1000 560 L1000 470 Q700 510 400 465 Q200 440 90 460 L0 480 Z" fill="#2c1c10" />
      <path d="M0 560 L1000 560 L1000 470 Q700 510 400 465 Q200 440 90 460 L0 480 Z" fill="#180f08" opacity="0.4" filter="url(#g1mottle)" />
      <path d="M0 560 L1000 560 L1000 470 Q700 510 400 465 Q200 440 90 460 L0 480 Z" fill="#1c1008" opacity="0.55" filter="url(#g1grain)" />
      {/* tache de lumière au sol, sous le rayon */}
      <ellipse cx="270" cy="500" rx="180" ry="26" fill="#f0c890" opacity="0.12" filter="url(#g1blur)" />
      <ellipse cx="500" cy="532" rx="420" ry="26" fill="#120b06" opacity="0.8" />
      {/* la flaque, qui reflète la lumière de l'entrée */}
      <g>
        <ellipse cx="700" cy="520" rx="72" ry="13" fill="#2c2438" />
        <ellipse cx="700" cy="518" rx="54" ry="8" fill="#4c4060" opacity="0.8" />
        <ellipse cx="682" cy="517" rx="20" ry="4" fill="#f0d8a8" opacity="0.35" style={{ animation: "ripple 4s ease-in-out infinite" }} />
        <path d="M652 514 q24 -5 48 -2" stroke="#8a7a98" strokeWidth="1.4" fill="none" opacity="0.6" />
      </g>
      {/* gouttes qui tombent des stalactites dans la flaque */}
      <circle cx="712" cy="480" r="1.3" fill="#cfeaff" opacity="0.6" style={{ animation: "spark 2.6s linear infinite reverse" }} />
      {/* L'ATELIER DE TAILLE : pierre-siège, éclats, nucléus, percuteur —
          disparaît une fois qu'on a ramassé le silex brut. */}
      {!inv.includes("silex_brut") && (
      <g transform="translate(300,505)">
        <ellipse cx="0" cy="12" rx="76" ry="13" fill="#160d06" opacity="0.8" />
        {/* pierre-siège du tailleur */}
        <ellipse cx="-52" cy="-2" rx="20" ry="12" fill="#4c3a2c" />
        <path d="M-68 -6 q16 -10 32 -2" stroke="#8a6a48" strokeWidth="2" fill="none" opacity="0.6" />
        {/* éclats de silex, faces brillantes vers la lumière */}
        {[[-24, 4, 15], [-4, -3, 19], [16, 5, 13], [36, 0, 16], [4, 9, 11], [-14, 11, 9]].map(([x, y, w], i) => (
          <g key={i}>
            <path d={`M${x} ${y} l${w} -6 l${w * 0.5} 8 l-${w * 0.9} 5 Z`} fill={i % 2 ? "#8d8d97" : "#6f6f7a"} stroke="#c9c9d4" strokeWidth="0.8" />
            <path d={`M${x + 2} ${y - 1} l${w * 0.5} -3`} stroke="#e8ecf4" strokeWidth="1.2" opacity="0.8" />
          </g>
        ))}
        {/* le nucléus (bloc à débiter) et le beau grand éclat */}
        <path d="M52 -6 l16 -10 l14 6 l-4 12 l-18 4 Z" fill="#7a7a86" stroke="#a8a8b4" strokeWidth="1" />
        <path d="M-2 -10 L22 -20 L34 -8 L12 0 Z" fill="#9aa0ad" stroke="#dfe3ec" strokeWidth="1.2" />
        {/* percuteur en pierre dure */}
        <ellipse cx="80" cy="7" rx="15" ry="10" fill="#54544c" />
        <path d="M70 2 q10 -7 20 -1" stroke="#8a8a80" strokeWidth="1.6" fill="none" opacity="0.7" />
      </g>
      )}
      {/* pierres éparses */}
      {[[150, 520, 9], [480, 512, 7], [590, 534, 11], [880, 516, 8]].map(([x, y, r], i) => (
        <g key={i}>
          <ellipse cx={x - 3} cy={y + 2} rx={r * 1.4} ry={r * 0.35} fill="#0e0804" opacity="0.6" />
          <ellipse cx={x} cy={y} rx={r} ry={r * 0.6} fill="#3c2c1c" />
          <path d={`M${x - r * 0.6} ${y - r * 0.3} q${r * 0.6} -${r * 0.4} ${r * 1.2} 0`} stroke="#8a6a48" strokeWidth="1.2" fill="none" opacity="0.5" />
        </g>
      ))}
      {/* KYAN, LA MÉMOIRE DU CLAN — assise au pied de la paroi sacrée, dans
          le rayon du matin. C'est elle qui fait entrer les nouveaux dans la
          famille… et qui raconte l'histoire du clan aux ancêtres. */}
      <g transform="translate(452,486)">
        <ellipse cx="0" cy="18" rx="32" ry="8" fill="#0e0804" opacity="0.75" />
        <Figure x={0} y={18} s={0.72} pose="ground" facing="right" skin="#c09064" hair="#e4dccc" look="long" mood="content" paint="dots" wrinkles
          garment="fur" coat="#6a4a30" pants="#4a3420" bareArms arms={[{ a1: 14, a2: -14 }, { a1: 96, a2: 130 }]} />
        <path d="M-8 -24 Q10 -33 24 -18" stroke="#ffe0a8" strokeWidth="2" fill="none" opacity="0.4" />
      </g>
      {/* le « ? » doré : c'est au tour de Kyan dans la quête */}
      {queteQui === "kyan" && (
        <g transform="translate(430,392)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
          <path d="M0 0 q0 -22 22 -22 q22 0 22 18 q0 15 -18 20 l0 7" fill="none" stroke="#ffd166" strokeWidth="4" />
          <circle cx="22" cy="34" r="2.8" fill="#ffd166" />
        </g>
      )}

      {/* blocs sombres qui cadrent les coins du bas */}
      <path d="M0 560 L0 508 Q40 502 74 522 Q96 538 88 560 Z" fill="#120b06" />
      <path d="M1000 560 L1000 500 Q952 496 924 520 Q904 540 916 560 Z" fill="#100a05" />
      {/* CHAUVE-SOURIS qui vole en zigzag sous la voute — bien plus
          visible qu'une souris au sol, et parfaitement adapte a une
          grotte du paleolithique. Ailes qui battent. */}
      <g opacity="0.85">
        <animateTransform attributeName="transform" type="translate"
          values="1050,180; 200,90; 750,150; 100,110; 1050,180" dur="16s" repeatCount="indefinite" />
        <g>
          {/* battement d'ailes en scale X */}
          <animateTransform attributeName="transform" type="scale"
            values="1,1; 0.5,1; 1,1" dur="0.3s" repeatCount="indefinite" />
          {/* corps */}
          <ellipse cx="0" cy="0" rx="1.6" ry="3" fill="#1a1004" />
          {/* ailes membraneuses */}
          <path d="M0 -1 q-10 -5 -14 2 q6 -1 8 3 q-6 -1 -8 3 q10 -1 14 -3 Z" fill="#1a1004" stroke="#0a0602" strokeWidth="0.3" />
          <path d="M0 -1 q10 -5 14 2 q-6 -1 -8 3 q6 -1 8 3 q-10 -1 -14 -3 Z" fill="#1a1004" stroke="#0a0602" strokeWidth="0.3" />
          {/* petites oreilles */}
          <path d="M-1 -3 l-0.5 -1.5 M1 -3 l0.5 -1.5" stroke="#1a1004" strokeWidth="0.6" />
        </g>
      </g>
      </PLayer>

      {/* léger voile de grain sur toute l'image */}
      <rect width="1000" height="560" fill="#141008" opacity="0.1" filter="url(#g1grain)" style={{ pointerEvents: "none" }} />

      {/* zones cliquables — hors couches (décalage max « rayon) */}
      <Hotspot cx={640} cy={270} r={150} label="paroi" item="paroi" support reveal={reveal} onClick={() => collect("paroi")} />
      <Hotspot cx={310} cy={498} r={55} label="silex brut" item="silex_brut" reveal={reveal} onClick={() => collect("silex_brut")} />
      <Hotspot cx={452} cy={462} r={48} label="Kyan" reveal={reveal} onClick={(p) => action("kyan", p)} />
    </svg>
  );
}
