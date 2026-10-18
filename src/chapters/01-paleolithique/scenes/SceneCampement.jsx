import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { GrassTuft } from "./decor.jsx";
import { Figure } from "../../../engine/chars.jsx";
import { Canopy, Grass, Haze, Speckle, TreeLine } from "../../../engine/scenery.jsx";

/* ============================================================
   CHAPITRE 1 — Tableau : le campement
   VERSION « PEINTURE FINE » : clairière au petit matin —
   forêt embrumée en fond, rayons de soleil entre les troncs,
   écorces texturées, rosée dans l'herbe, et le feu du clan qui
   contraste chaudement dans la fraîcheur bleutée.
   À trouver ici : le feu, ta voix (le conteur), les branches.
   ============================================================ */

export default function SceneCampement({ collect, action, reveal, made = [], queteQui, mode }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* ciel du matin entre les arbres */}
        <linearGradient id="c1sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2c3e70" />
          <stop offset="35%" stopColor="#54619c" />
          <stop offset="62%" stopColor="#9384ac" />
          <stop offset="82%" stopColor="#d8ab94" />
          <stop offset="100%" stopColor="#f4d4a4" />
        </linearGradient>
        <linearGradient id="c1trunk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4c3626" />
          <stop offset="45%" stopColor="#6a4c34" />
          <stop offset="100%" stopColor="#2e2016" />
        </linearGradient>
        <radialGradient id="c1canopy" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#4c6244" />
          <stop offset="70%" stopColor="#2c4030" />
          <stop offset="100%" stopColor="#1e2c22" />
        </radialGradient>
        <linearGradient id="c1soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a6c46" />
          <stop offset="30%" stopColor="#6e5236" />
          <stop offset="100%" stopColor="#3a281a" />
        </linearGradient>
        <radialGradient id="c1fire" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffc068" stopOpacity="0.6" />
          <stop offset="55%" stopColor="#ff9540" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ff9540" stopOpacity="0" />
        </radialGradient>
        <filter id="c1blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="8" /></filter>
        <filter id="c1grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="c1mottle" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* ═══ ciel (fixe) ═══ */}
      <rect width="1000" height="560" fill="url(#c1sky)" />
      {[[120, 40, 0.35], [340, 28, 0.3], [620, 46, 0.35], [820, 30, 0.3]].map(([x, y, o], i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill="#fff" opacity={o} style={{ animation: `twinkle ${3 + i}s infinite` }} />
      ))}
      {/* lueur du soleil levant, hors champ à droite */}
      <ellipse cx="1010" cy="230" rx="260" ry="180" fill="#ffe4a8" opacity="0.3" filter="url(#c1blur)" />

      {/* ═══ couche lointaine : forêt embrumée ═══ */}
      <PLayer depth={1}>
      <rect y="300" width="1000" height="140" fill="#3a4668" />
      {/* forêt profonde en trois rangs, de plus en plus bleutée au loin */}
      <TreeLine seed={51} y={330} n={40} h={[90, 150]} kinds={["conifer", "leafy"]} colors={["#3a4870", "#3e4c74"]} light={1} jitter={10} />
      <Haze id="c1-h1" y0={190} y1={340} color="#a8a4c0" opacity={0.45} />
      <TreeLine seed={53} y={350} n={26} h={[110, 170]} kinds={["leafy", "conifer", "leafy"]} colors={["#323e60", "#34405e", "#2e3a58"]} light={1} jitter={12} />
      <Haze id="c1-h2" y0={260} y1={360} color="#c8b8c0" opacity={0.3} />
      {/* nappes de brume entre les troncs */}
      <ellipse cx="300" cy="352" rx="320" ry="22" fill="#e8dcc4" opacity="0.2" filter="url(#c1blur)" />
      <ellipse cx="740" cy="368" rx="300" ry="18" fill="#f4e4c0" opacity="0.24" filter="url(#c1blur)" />
      <ellipse cx="520" cy="336" rx="240" ry="14" fill="#d8ccb8" opacity="0.16" filter="url(#c1blur)" />

      {/* OISEAUX qui traversent le ciel au loin — trois silhouettes en V,
          traversée lente pour rester discret. Recycle l'idée du petit oiseau
          de l'atelier mais en escadre. */}
      <g opacity="0.7">
        <animateTransform attributeName="transform" type="translate"
          values="-40,0; 1050,-30" dur="26s" repeatCount="indefinite" />
        <path d="M0 100 q3 -4 6 0 q3 -4 6 0" stroke="#1c1810" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M18 108 q3 -4 6 0 q3 -4 6 0" stroke="#1c1810" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M32 96 q3 -4 6 0 q3 -4 6 0" stroke="#1c1810" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>

      {/* (tentative de petit feu de camp dans la foret retiree — pas
          assez visible dans ce plan brumeux) */}
      </PLayer>

      {/* ═══ couche intermédiaire : les grands arbres de la clairière ═══ */}
      <PLayer depth={2}>
      {/* grand arbre de gauche */}
      <g>
        <rect x="58" y="112" width="34" height="340" fill="url(#c1trunk)" rx="9" />
        <rect x="58" y="112" width="34" height="340" fill="#221408" opacity="0.5" filter="url(#c1grain)" rx="9" />
        {/* écorce : cannelures, nœud, mousse au pied */}
        <path d="M66 160 q4 60 -2 130 M80 140 q5 80 0 180 M74 340 q3 50 -1 100" stroke="#33231a" strokeWidth="2.5" fill="none" opacity="0.7" />
        <ellipse cx="84" cy="248" rx="5" ry="9" fill="#2c1c10" />
        <path d="M64 200 q12 6 22 0 M62 300 q14 8 24 0" stroke="#33231a" strokeWidth="3" fill="none" />
        <path d="M90 130 q2 100 0 200" stroke="#a8865c" strokeWidth="2" fill="none" opacity="0.4" />
        <ellipse cx="70" cy="448" rx="16" ry="6" fill="#3c4a28" opacity="0.8" />
        {/* frondaison en bouquets */}
        <Canopy cx={86} cy={92} rx={130} ry={84} color="#2c4030" light={1} seed={3} n={20} />
        {[[40, 66], [96, 52], [148, 60], [66, 96], [120, 100]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} q6 -8 14 -8 q-3 8 -14 8 Z`} fill="#54724a" opacity="0.85" />
        ))}
        <path d="M30 60 q50 -26 128 -6" stroke="#8aa668" strokeWidth="2.5" fill="none" opacity="0.5" />
      </g>
      {/* grand arbre de droite */}
      <g>
        <rect x="866" y="82" width="40" height="370" fill="url(#c1trunk)" rx="10" />
        <rect x="866" y="82" width="40" height="370" fill="#221408" opacity="0.5" filter="url(#c1grain)" rx="10" />
        <path d="M876 140 q5 90 -1 200 M892 120 q4 100 1 240" stroke="#33231a" strokeWidth="2.5" fill="none" opacity="0.7" />
        <path d="M874 180 q14 7 24 0 M872 290 q16 9 28 0 M878 380 q12 6 22 0" stroke="#33231a" strokeWidth="3" fill="none" />
        <ellipse cx="898" cy="320" rx="5" ry="10" fill="#2c1c10" />
        <path d="M902 100 q3 140 0 260" stroke="#a8865c" strokeWidth="2" fill="none" opacity="0.4" />
        <Canopy cx={884} cy={84} rx={150} ry={90} color="#2c4030" light={1} seed={7} n={22} />
        {[[830, 84], [890, 48], [940, 76], [864, 110]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} q6 -8 14 -8 q-3 8 -14 8 Z`} fill="#54724a" opacity="0.85" />
        ))}
        <path d="M812 70 q64 -30 150 -2" stroke="#8aa668" strokeWidth="2.5" fill="none" opacity="0.5" />
      </g>
      {/* sapins de lisière */}
      {[[758, 452, 1.05], [196, 448, 0.85]].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
          <path d="M-3 0 L3 0 L2 -18 L-2 -18 Z" fill="#2e1f14" />
          <path d="M0 -92 L20 -60 L10 -62 L28 -34 L14 -36 L34 -8 L-34 -8 L-14 -36 L-28 -34 L-10 -62 L-20 -60 Z" fill="#26402e" />
          <path d="M0 -92 L20 -60 L10 -62 L28 -34 L14 -36 L20 -26 L-2 -30 Z" fill="#3a5a40" opacity="0.7" />
          <path d="M-20 -60 L0 -92 L6 -82" stroke="#7a9a68" strokeWidth="2" fill="none" opacity="0.5" />
        </g>
      ))}
      </PLayer>

      {/* ═══ premier plan : la clairière, le feu, le clan ═══ */}
      <PLayer depth={3}>
      <rect y="400" width="1000" height="160" fill="url(#c1soil)" />
      <rect y="402" width="1000" height="158" fill="#241608" opacity="0.35" filter="url(#c1mottle)" />
      <rect y="402" width="1000" height="158" fill="#2c1c10" opacity="0.5" filter="url(#c1grain)" />
      {/* rayons du matin qui percent entre les arbres */}
      <path d="M830 60 L960 40 L760 460 L680 440 Z" fill="#ffe8b8" opacity="0.08" filter="url(#c1blur)" />
      <path d="M700 90 L780 76 L620 430 L570 416 Z" fill="#fff2cc" opacity="0.06" filter="url(#c1blur)" />
      {/* bord de la clairière : herbes hautes et fougères qui fondent sol et forêt */}
      <path d="M-20 404 Q120 396 260 406 Q420 398 560 404 Q720 396 860 406 Q940 400 1020 404 L1020 420 L-20 420 Z" fill="#3a4430" opacity="0.8" />
      {Array.from({ length: 34 }).map((_, i) => <Grass key={i} x={i * 30 + (i % 3) * 7} y={410 + (i % 4) * 3} seed={i + 2} color={i % 2 ? "#4a5a34" : "#3c4c2c"} s={0.9 + (i % 3) * 0.2} n={7} />)}
      {/* clairière tassée autour du feu */}
      <ellipse cx="500" cy="472" rx="380" ry="66" fill="#8a6c46" opacity="0.4" />
      <Speckle seed={44} x0={140} x1={860} y0={420} y1={540} n={220} colors={["#3a2414", "#a08060", "#5a3e26"]} opacity={0.45} />
      {/* brindilles, aiguilles et feuilles mortes */}
      {[[220, 506, 20], [330, 530, -15], [640, 520, 40], [760, 500, -30], [430, 540, 10]].map(([x, y, r], i) => (
        <path key={i} d="M-10 0 L10 0 M2 0 l5 -4" stroke="#4a3220" strokeWidth="1.6" strokeLinecap="round" transform={`translate(${x},${y}) rotate(${r})`} />
      ))}
      <ellipse cx="500" cy="470" rx="230" ry="110" fill="url(#c1fire)" style={{ animation: "glow 2.4s ease-in-out infinite" }} />
      {/* reflets du feu sur les troncs proches */}
      <path d="M60 210 l0 220" stroke="#ff9540" strokeWidth="8" opacity="0.12" />
      <path d="M902 160 l0 260" stroke="#ff9540" strokeWidth="10" opacity="0.14" />
      {/* LE FOYER : pierres aux faces éclairées côté flammes */}
      {[[-54, 16], [-36, 26], [-10, 31], [20, 28], [45, 18], [56, 5]].map(([dx, dy], i) => (
        <g key={i}>
          <ellipse cx={500 + dx} cy={452 + dy} rx="13" ry="8" fill={i % 2 ? "#5a5a64" : "#4a4a52"} />
          <path d={`M${500 + dx - 9} ${452 + dy - 3} q${dx > 0 ? -6 : 9} -5 ${dx > 0 ? -14 : 15} -1`} stroke="#ffb868" strokeWidth="1.8" fill="none" opacity="0.6" />
        </g>
      ))}
      {/* bûches et flammes à trois épaisseurs + cœur blanc */}
      <g transform="translate(500,452)">
        <path d="M-30 10 L32 20 M-28 20 L30 8 M-6 24 L4 4" stroke="#3a2412" strokeWidth="8" strokeLinecap="round" />
        <path d="M-28 9 L30 19 M-26 19 L28 7" stroke="#5c3a22" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        <g style={{ transformOrigin: "0px 12px", animation: "flick 0.85s ease-in-out infinite" }}>
          <path d="M0 14 Q-22 -8 -7 -40 Q-1 -18 5 -32 Q22 -6 9 12 Z" fill="#ff7f24" />
          <path d="M0 14 Q-12 -2 -4 -24 Q1 -10 5 -17 Q12 -2 6 11 Z" fill="#ffb347" />
          <path d="M0 13 Q-6 4 -1 -10 Q1 -4 3 -7 Q7 2 3 10 Z" fill="#ffe28a" />
          <path d="M0 12 Q-3 6 0 -3 Q3 5 1 11 Z" fill="#fff8dc" />
        </g>
        {/* braises et étincelles */}
        <circle cx="-14" cy="16" r="2" fill="#ff7f24" opacity="0.9" style={{ animation: "glow 1.4s ease-in-out infinite" }} />
        <circle cx="10" cy="19" r="1.6" fill="#ffb347" opacity="0.9" style={{ animation: "glow 1.9s ease-in-out infinite" }} />
        <circle cx="-8" cy="-46" r="1.8" fill="#ffd166" style={{ animation: "spark 1.8s linear infinite" }} />
        <circle cx="10" cy="-56" r="1.5" fill="#ff9540" style={{ animation: "spark 2.3s linear infinite" }} />
        {/* colonne de fumée du matin, bien visible dans l'air frais */}
        <path d="M2 -40 q-10 -26 6 -44 q-12 10 -4 -26 q10 -18 2 -34" stroke="#b8c0d0" strokeWidth="5" fill="none" opacity="0.3" style={{ animation: "drift 5s ease-in-out infinite" }} filter="url(#c1blur)" />
        {/* LUCIOLE qui danse autour du feu — point jaune-vert qui pulse
            et suit un chemin sinueux en boucle. Coordonnees relatives au
            centre du feu (0,0 = 500,452 en absolu). */}
        <g>
          <animateTransform attributeName="transform" type="translate"
            values="-50,-20; -20,-45; 20,-30; 40,-10; 20,10; -20,0; -45,-20; -50,-20"
            dur="12s" repeatCount="indefinite" />
          {/* halo doux jaune-vert */}
          <circle r="4" fill="#eeff88" opacity="0.35">
            <animate attributeName="opacity" values="0.15;0.55;0.15" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="r" values="3;6;3" dur="1.2s" repeatCount="indefinite" />
          </circle>
          {/* point lumineux central */}
          <circle r="1.4" fill="#fffca8">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="1.2s" repeatCount="indefinite" />
          </circle>
        </g>
      </g>
      {/* LE CONTEUR (toi), enveloppé dans sa fourrure */}
      <g transform="translate(408,442)">
        <ellipse cx="4" cy="34" rx="26" ry="7" fill="#1c1008" opacity="0.7" />
        <Figure x={0} y={34} s={0.8} pose="ground" skin="#b07a52" hair="#3a2415" look="short" mood="content" hood hoodColor="#6e4a2c"
          garment="fur" coat="#5c3a22" pants="#4a2e1a" arms={[{ a1: 14, a2: -10 }, { a1: 40, a2: 70 }]} />
        <path d="M8 -32 q6 4 5 12" stroke="#ffb868" strokeWidth="2" fill="none" opacity="0.5" />
      </g>
      {/* LE TAS DE BRANCHES, écorces détaillées */}
      <g transform="translate(660,492)">
        <ellipse cx="0" cy="14" rx="66" ry="10" fill="#1c1008" opacity="0.6" />
        <path d="M-52 6 q30 -14 66 -6" stroke="#5a3a1e" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M-44 12 q34 -10 62 -2" stroke="#6e4a26" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M-30 2 q26 -12 54 -8" stroke="#4a3018" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M14 -2 l10 -14 M-10 0 l-8 -12 M32 4 l12 -8" stroke="#5a3a1e" strokeWidth="4" strokeLinecap="round" />
        {/* écorce qui s'écaille + brindilles */}
        <path d="M-38 5 l6 -2 M-12 2 l7 -3 M20 0 l6 -2 M-24 10 l6 -2" stroke="#8a6a42" strokeWidth="1.8" opacity="0.8" />
        <path d="M40 10 q8 -3 14 -1 M-56 10 q-6 -4 -10 -2" stroke="#4a3018" strokeWidth="2.5" fill="none" />
      </g>
      {/* le séchoir à peaux */}
      <g transform="translate(150,470)">
        <path d="M-40 20 L-40 -60 M40 20 L40 -60 M-44 -56 L44 -56" stroke="#4a3018" strokeWidth="6" strokeLinecap="round" />
        <path d="M-40 -20 L-46 16 M40 -20 L46 16" stroke="#3a2412" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        <path d="M-30 -52 Q0 -60 30 -52 L26 6 Q0 14 -26 6 Z" fill="#8a6240" />
        <path d="M-30 -52 Q0 -60 30 -52 L26 6 Q0 14 -26 6 Z" fill="#5c3a22" opacity="0.4" filter="url(#c1grain)" />
        <path d="M-22 -44 q22 -6 44 0 M-24 -20 q24 -6 48 0 M-22 -2 q22 -5 44 0" stroke="#6e4a2c" strokeWidth="2" fill="none" opacity="0.7" />
        <path d="M-26 -50 q26 -7 52 0" stroke="#c9a878" strokeWidth="1.6" fill="none" opacity="0.5" />
      </g>
      {/* herbe de rosée : touffes claires piquées de gouttes */}
      {[[300, 520, "#5d6b2e"], [580, 540, "#67793a"], [940, 520, "#5d6b2e"], [230, 545, "#4e5c28"], [700, 528, "#67793a"], [840, 548, "#5d6b2e"]].map(([x, y, c], i) => (
        <g key={i}>
          <GrassTuft x={x} y={y} c={c} />
          <circle cx={x - 4} cy={y - 14} r="1" fill="#d8e8f0" opacity="0.7" />
        </g>
      ))}
      {/* RAYA, LE CHEF — assis face au feu, il remue les braises. C'est lui
          qui accueille, éprouve, et fait entrer les nouveaux dans le clan. */}
      <g transform="translate(300,470)">
        <ellipse cx="0" cy="20" rx="30" ry="8" fill="#160f08" opacity="0.7" />
        <Figure x={0} y={20} s={0.7} pose="ground" facing="right" skin="#c0926a" hair="#5e5646" look="slick" wrinkles
          garment="fur" coat="#5c3a22" pants="#4a2e1a" bareArms arms={[{ a1: 16, a2: -14 }, { a1: 70, a2: 82 }]} />
        <path d="M39 -8 L72 4" stroke="#4a3420" strokeWidth="3" strokeLinecap="round" />
        <circle cx="14" cy="-32" r="7" fill="#ffb347" opacity="0.12" style={{ animation: "glow 2.6s ease-in-out infinite" }} />
      </g>
      {/* le « ? » doré : c'est au tour de Raya dans la quête */}
      {queteQui === "raya" && (
        <g transform="translate(282,372)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
          <path d="M0 0 q0 -22 22 -22 q22 0 22 18 q0 15 -18 20 l0 7" fill="none" stroke="#ffd166" strokeWidth="4" />
          <circle cx="22" cy="34" r="2.8" fill="#ffd166" />
        </g>
      )}

      {/* RÉSULTAT (msg_veillee) : LA VEILLÉE — le clan se rassemble autour
          du feu, le soir, et les histoires passent de bouche à oreille */}
      {made.includes("msg_veillee") && (
        <g style={{ animation: "fadein 1.2s ease-out" }}>
          <ellipse cx="500" cy="466" rx="300" ry="82" fill="url(#c1fire)" opacity="0.55" filter="url(#c1blur)" style={{ animation: "glow 3s ease-in-out infinite" }} />
          {[[572, 486, 1, "#4a2e1a"], [620, 476, 0.9, "#3e2818"], [540, 496, 0.85, "#432a18"]].map(([x, y, s, c], i) => (
            <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
              <path d="M-14 12 Q-16 -10 0 -14 Q16 -10 14 12 Z" fill={c} />
              <circle cx="-2" cy="-16" r="7" fill={c} />
              <path d="M-14 6 Q-16 -8 -6 -13" stroke="#ff9540" strokeWidth="2" fill="none" opacity="0.5" />
            </g>
          ))}
          {[[520, 418], [500, 398], [540, 408]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.6" fill="#ffd166" opacity="0.7" style={{ animation: `spark ${2 + i * 0.6}s linear infinite` }} />
          ))}
        </g>
      )}

      {/* herbes sombres qui cadrent le bas */}
      <g opacity="0.9">
        <path d="M-4 560 q10 -32 4 -50 M16 560 q3 -26 14 -42 M38 560 q-6 -22 2 -38 M64 560 q8 -24 0 -36" stroke="#1c1810" strokeWidth="4" fill="none" />
        <path d="M948 560 q-8 -28 -2 -44 M970 560 q4 -24 12 -36 M992 560 q-4 -20 4 -32" stroke="#1c1810" strokeWidth="4" fill="none" />
        <path d="M420 560 q-5 -16 2 -26 M540 560 q5 -16 -1 -24" stroke="#241c12" strokeWidth="3.5" fill="none" />
      </g>

      {/* ANACHRONISME : boîte d'allumettes bien à droite au sol, loin du feu.
          Dans le PLayer premier plan pour bouger avec la parallaxe. */}
      {!made.includes("allumettes") && mode !== "jeu2" && (
        <g transform="translate(840,510) rotate(-8)">
          <rect x={-14} y={-8} width={28} height={16} rx={1.5} fill="#c8382e" stroke="#5a1810" strokeWidth="1" />
          <rect x={-11} y={-5} width={22} height={7} fill="#f0e4c8" />
          <text x={0} y={0} textAnchor="middle" fontSize="4.5" fontFamily="ui-monospace,monospace" fontWeight="800" fill="#5a1810">SAFETY</text>
          <text x={0} y={7} textAnchor="middle" fontSize="3.5" fontFamily="ui-monospace,monospace" fill="#f0e4c8">MATCHES</text>
          {/* petite allumette qui dépasse */}
          <path d="M-14 -6 l-8 -3" stroke="#e8d5a8" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="-22.5" cy="-9.5" r="1.2" fill="#c8382e" />
        </g>
      )}

      </PLayer>

      {/* léger voile de grain sur toute l'image */}
      <rect width="1000" height="560" fill="#141008" opacity="0.1" filter="url(#c1grain)" style={{ pointerEvents: "none" }} />

      {/* zones cliquables — hors couches (décalage max « rayon) */}
      <Hotspot cx={500} cy={440} r={62} label="feu" item="feu" support reveal={reveal} onClick={() => collect("feu")} />
      {/* petites notes de musique flottantes au-dessus du personnage qui fredonne */}
      <g style={{ pointerEvents: "none" }} opacity="0.85">
        <text x="380" y="400" fontSize="16" fill="#c9a877" fontFamily="Georgia,serif" style={{ animation: "drift 3.2s ease-in-out infinite" }}>♪</text>
        <text x="405" y="386" fontSize="13" fill="#c9a877" fontFamily="Georgia,serif" style={{ animation: "drift 3.8s ease-in-out infinite", animationDelay: "0.6s" }}>♫</text>
        <text x="428" y="402" fontSize="14" fill="#c9a877" fontFamily="Georgia,serif" style={{ animation: "drift 3.5s ease-in-out infinite", animationDelay: "1.2s" }}>♪</text>
      </g>
      <Hotspot cx={410} cy={432} r={48} label="quelqu'un qui fredonne" item="voix" reveal={reveal} onClick={() => collect("voix")} />
      <Hotspot cx={660} cy={488} r={58} label="branches" item="branche" reveal={reveal} onClick={() => collect("branche")} />
      <Hotspot cx={300} cy={446} r={44} label="Raya, le chef" reveal={reveal} onClick={(p) => action("raya", p)} />

      {/* ANACHRONISME : la boîte d'allumettes traîne au sol, loin du feu à droite */}
      {mode !== "jeu2" && (
        <Hotspot cx={840} cy={510} r={20} label="… quelque chose ne va pas ici" item="allumettes" reveal={reveal} onClick={() => collect("allumettes")} />
      )}
    </svg>
  );
}
