import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { GrassTuft, Birds } from "./decor.jsx";
import TimeMachine from "../../../engine/TimeMachine.jsx";
import { Figure } from "../../../engine/chars.jsx";
import { Ridge, TreeLine } from "../../../engine/scenery.jsx";

/* ============================================================
   CHAPITRE 1 — Tableau : devant la grotte (tableau de départ)
   VERSION « PEINTURE FINE » (démonstration du style réaliste) :
   crêtes irrégulières + brume entre les plans, textures de
   roche et de sol (grain), lumière rasante du couchant,
   ombres longues, végétation détaillée, premier plan qui cadre.
   À trouver ici : l'ocre, la liane. On peut entrer dans la
   grotte (action "cave") ou revenir à MARTINE (action "wreck",
   nom conservé pour compat, mais elle est posée proprement).
   Les zones cliquables n'ont pas bougé.
   ============================================================ */

export default function SceneExterieur({ collect, action, reveal, made = [], queteQui, bare = false }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* ciel de début de matinée : bleu-lavande qui rosit vers l'horizon */}
        <linearGradient id="x2sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#24356a" />
          <stop offset="22%" stopColor="#40518e" />
          <stop offset="46%" stopColor="#7a72a8" />
          <stop offset="68%" stopColor="#c493a0" />
          <stop offset="84%" stopColor="#eec08c" />
          <stop offset="100%" stopColor="#ffe6b0" />
        </linearGradient>
        <radialGradient id="x2sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff8e0" />
          <stop offset="35%" stopColor="#ffe4a8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffe0a0" stopOpacity="0" />
        </radialGradient>
        {/* plans de montagnes : bleutés au loin (perspective atmosphérique) */}
        <linearGradient id="x2mFar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6a78b4" /><stop offset="100%" stopColor="#505e98" /></linearGradient>
        <linearGradient id="x2mMid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6f6494" /><stop offset="100%" stopColor="#524874" /></linearGradient>
        <linearGradient id="x2mNear" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4c4258" /><stop offset="100%" stopColor="#322c42" /></linearGradient>
        <linearGradient id="x2soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a08256" />
          <stop offset="18%" stopColor="#8a6844" />
          <stop offset="55%" stopColor="#6a5034" />
          <stop offset="100%" stopColor="#423020" />
        </linearGradient>
        <linearGradient id="x2rock" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#8a6448" />
          <stop offset="35%" stopColor="#6e4c36" />
          <stop offset="70%" stopColor="#523828" />
          <stop offset="100%" stopColor="#38261c" />
        </linearGradient>
        <radialGradient id="x2cave" cx="50%" cy="26%" r="85%">
          <stop offset="0%" stopColor="#040201" />
          <stop offset="62%" stopColor="#0f0804" />
          <stop offset="100%" stopColor="#26150e" />
        </radialGradient>
        {/* flou doux pour les nuages et halos */}
        <filter id="x2blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        {/* grain fin de matière (roche, sol, voile général) */}
        <filter id="x2grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        {/* marbrures larges (plaques d'usure du sol, taches de la roche) */}
        <filter id="x2mottle" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* ═══ ciel (fixe) ═══ */}
      <rect width="1000" height="560" fill="url(#x2sky)" />
      {/* dernières étoiles qui s'effacent dans le petit matin */}
      {[[70, 36, 1.3, 0.4], [300, 30, 1.4, 0.35], [560, 24, 1.1, 0.3], [880, 40, 1.3, 0.35]].map(([x, y, r, o], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={o} style={{ animation: `twinkle ${3 + i}s infinite` }} />
      ))}
      {/* soleil levant, encore bas — il émerge derrière les crêtes */}
      <circle cx="705" cy="235" r="175" fill="url(#x2sun)" />
      <circle cx="705" cy="235" r="78" fill="#ffe4a8" opacity="0.45" filter="url(#x2blur)" />
      <circle cx="705" cy="235" r="42" fill="#fff8e2" />
      <circle cx="705" cy="235" r="42" fill="none" stroke="#fffbe8" strokeWidth="1.5" opacity="0.8" />
      {/* nuages du matin, rosés par le soleil rasant */}
      <g filter="url(#x2blur)">
        <ellipse cx="265" cy="118" rx="150" ry="13" fill="#f0b8a0" opacity="0.4" />
        <ellipse cx="330" cy="132" rx="90" ry="8" fill="#e8987a" opacity="0.32" />
        <ellipse cx="585" cy="170" rx="185" ry="11" fill="#f8d0a8" opacity="0.45" />
        <ellipse cx="650" cy="184" rx="90" ry="6" fill="#ffe8c0" opacity="0.5" />
        <ellipse cx="852" cy="106" rx="115" ry="9" fill="#d8a0a8" opacity="0.35" />
      </g>
      {/* (les <Birds /> statiques ont ete retirees, on garde les 4 hirondelles
          animees ajoutees plus bas et le vol des mammouths anime.) */}

      {/* ═══ couche lointaine (bouge peu) ═══ */}
      <PLayer depth={1}>
      {/* crête lointaine, enneigée, éclairée par le soleil levant (à droite) */}
      <Ridge id="x2-r1" seed={61} y={300} amp={110} rough={0.6} fill="#5c6aa6" lit="#8a8cc0" light={1} snow="#e8dce8" snowLine={222} />
      {/* brume matinale au pied de la crête */}
      <rect y="280" width="1000" height="40" fill="#ffe6b0" opacity="0.2" filter="url(#x2blur)" />
      {/* crête intermédiaire */}
      <Ridge id="x2-r2" seed={67} y={340} amp={76} rough={0.58} fill="#5e5486" lit="#8a7aa8" light={1} />
      <rect y="332" width="1000" height="24" fill="#ffe6b0" opacity="0.16" filter="url(#x2blur)" />
      {/* collines proches, adoucies, avec forêt en silhouette */}
      <path d="M0 384 Q90 344 180 366 Q270 388 360 360 Q450 334 540 366 Q630 396 720 372 Q810 348 900 376 Q950 390 1000 372 L1000 440 L0 440 Z" fill="url(#x2mNear)" />
      <TreeLine seed={29} x0={120} x1={300} y={384} n={9} h={[12, 24]} kinds={["conifer"]} colors={["#2a1830", "#33203a"]} light={1} jitter={5} />
      <TreeLine seed={31} x0={540} x1={680} y={386} n={7} h={[12, 22]} kinds={["conifer"]} colors={["#2a1830", "#33203a"]} light={1} jitter={5} />
      <TreeLine seed={37} x0={830} x1={960} y={388} n={6} h={[12, 22]} kinds={["conifer"]} colors={["#2a1830", "#33203a"]} light={1} jitter={5} />
      {/* deux MAMMOUTHS en silhouette sur la crête (défenses claires
          pour qu'on les reconnaisse au premier coup d'œil) */}
      <g>
        {/* l'adulte */}
        <g transform="translate(786,362)" fill="#20122c">
          <rect x="-27" y="-4" width="7" height="26" rx="3" />
          <rect x="-13" y="-2" width="7" height="24" rx="3" />
          <rect x="5" y="-4" width="7" height="26" rx="3" />
          <rect x="17" y="-2" width="7" height="24" rx="3" />
          {/* croupe basse → grosse bosse d'épaule → tête bombée */}
          <path d="M-36 0 Q-40 -14 -30 -22 Q-20 -32 -6 -32 Q2 -40 12 -38 Q24 -36 28 -26 Q32 -18 28 -10 Q24 -2 16 0 Q-6 4 -24 3 Q-33 3 -36 0 Z" />
          {/* trompe qui descend et s'enroule vers l'arrière */}
          <path d="M27 -22 q11 8 9 20 q-2 11 -11 13 q6 -9 4 -16 q-2 -9 -8 -13 Z" />
          {/* poils qui pendent sous le ventre */}
          <path d="M-26 3 l-2 7 M-12 4 l-2 8 M2 4 l-1 7 M12 2 l-2 7" stroke="#20122c" strokeWidth="2" />
          {/* défenses claires, courbées vers le haut */}
          <path d="M24 -6 q13 6 20 -3" stroke="#d8c8b4" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <path d="M22 -3 q10 6 16 1" stroke="#c0b0a0" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </g>
        {/* le petit, qui suit */}
        <g transform="translate(858,374) scale(0.5)" fill="#241530">
          <rect x="-27" y="-4" width="8" height="26" rx="3" />
          <rect x="-11" y="-2" width="8" height="24" rx="3" />
          <rect x="7" y="-4" width="8" height="26" rx="3" />
          <path d="M-36 0 Q-40 -14 -30 -22 Q-20 -32 -6 -32 Q2 -40 12 -38 Q24 -36 28 -26 Q32 -18 28 -10 Q24 -2 16 0 Q-6 4 -24 3 Q-33 3 -36 0 Z" />
          <path d="M27 -22 q11 8 9 20 q-2 11 -11 13 q6 -9 4 -16 q-2 -9 -8 -13 Z" />
        </g>
      </g>

      {/* VOL D'OISEAUX qui traverse le ciel matinal — quelques hirondelles
          entre les cretes, silhouettes noires bien lisibles. */}
      <g opacity="0.85">
        <animateTransform attributeName="transform" type="translate"
          values="-60,0; 1060,-20" dur="24s" repeatCount="indefinite" />
        <path d="M0 180 q6 -8 12 0 q6 -8 12 0" stroke="#1a1408" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M30 194 q6 -8 12 0 q6 -8 12 0" stroke="#1a1408" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M58 176 q6 -8 12 0 q6 -8 12 0" stroke="#1a1408" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M86 190 q5 -6 10 0 q5 -6 10 0" stroke="#1a1408" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </g>
      </PLayer>

      {/* ═══ couche intermédiaire ═══ */}
      <PLayer depth={2}>
      {/* sol */}
      <rect y="400" width="1000" height="160" fill="url(#x2soil)" />
      {/* nappe de lumière dorée du matin, côté soleil */}
      <ellipse cx="710" cy="404" rx="430" ry="46" fill="#ffe0a0" opacity="0.18" filter="url(#x2blur)" />
      {/* nappe de brume qui traîne encore au ras du sol */}
      <ellipse cx="420" cy="408" rx="380" ry="18" fill="#f0e0c0" opacity="0.16" filter="url(#x2blur)" />
      {/* textures du sol : marbrures larges + grain fin renforcé */}
      <rect y="402" width="1000" height="158" fill="#241608" opacity="0.35" filter="url(#x2mottle)" />
      <rect y="402" width="1000" height="158" fill="#2c1c10" opacity="0.5" filter="url(#x2grain)" />
      {/* ondulations du terrain */}
      <path d="M0 408 Q260 396 520 408 T1000 402 L1000 424 Q700 436 380 424 T0 432 Z" fill="#a08050" opacity="0.4" />
      <path d="M120 452 Q300 444 470 452 M560 470 Q740 462 920 472" stroke="#3c2a1a" strokeWidth="2" fill="none" opacity="0.35" />
      {/* sentier usé */}
      <path d="M240 560 Q300 490 420 462 Q560 430 705 424 L742 430 Q580 444 470 474 Q360 504 330 560 Z" fill="#ac8756" opacity="0.5" />
      <path d="M255 560 Q320 496 430 468 Q560 440 700 428" stroke="#c49a62" strokeWidth="3" fill="none" opacity="0.35" />
      <path d="M300 522 q14 -4 26 -2 M370 492 q16 -6 30 -4 M470 464 q18 -5 34 -4" stroke="#8a6a42" strokeWidth="2.5" fill="none" opacity="0.5" />
      {/* cailloux du sol, ombres longues vers la gauche (soleil à droite) */}
      {[[380, 470, 7], [452, 496, 5], [608, 452, 6], [665, 484, 4], [905, 452, 8], [545, 508, 6]].map(([x, y, r], i) => (
        <g key={i}>
          <ellipse cx={x - r * 1.8} cy={y + 1.5} rx={r * 2.1} ry={r * 0.42} fill="#241628" opacity="0.4" />
          <ellipse cx={x} cy={y} rx={r} ry={r * 0.68} fill={i % 2 ? "#6e5a42" : "#5a4632"} />
          <path d={`M${x - r * 0.7} ${y - r * 0.35} q${r * 0.7} -${r * 0.5} ${r * 1.5} -${r * 0.1}`} stroke="#c49a62" strokeWidth="1.2" fill="none" opacity="0.6" />
        </g>
      ))}

      {/* LA FALAISE — silhouette irrégulière, strates, lumière rasante */}
      <path d="M-40 430 L-40 84 L40 80 L62 70 L104 74 L132 64 L170 72 L206 86 L230 84 L254 108 L276 112 L292 140 L312 150 L306 190 L322 206 L316 244 L332 264 L322 300 L336 320 L318 352 L326 380 L304 404 L310 430 Z" fill="url(#x2rock)" />
      {/* textures de la roche : taches larges + grain fin renforcé */}
      <path d="M-40 430 L-40 84 L40 80 L62 70 L104 74 L132 64 L170 72 L206 86 L230 84 L254 108 L276 112 L292 140 L312 150 L306 190 L322 206 L316 244 L332 264 L322 300 L336 320 L318 352 L326 380 L304 404 L310 430 Z" fill="#1c1006" opacity="0.3" filter="url(#x2mottle)" />
      <path d="M-40 430 L-40 84 L40 80 L62 70 L104 74 L132 64 L170 72 L206 86 L230 84 L254 108 L276 112 L292 140 L312 150 L306 190 L322 206 L316 244 L332 264 L322 300 L336 320 L318 352 L326 380 L304 404 L310 430 Z" fill="#221408" opacity="0.6" filter="url(#x2grain)" />
      {/* piquetage de la roche (petits creux d'érosion) */}
      {[[64, 140], [118, 188], [86, 246], [156, 210], [190, 168], [132, 302], [98, 344], [204, 268], [246, 196], [174, 386], [228, 342], [268, 240]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={2.2 + (i % 3)} ry={1.4 + (i % 2)} fill="#241608" opacity="0.45" />
      ))}
      {/* strates irrégulières */}
      <path d="M24 148 q70 -14 148 4 q40 10 74 26 M18 214 q86 -10 168 12 q36 10 66 24 M26 288 q74 -6 148 14 q40 12 68 26 M40 352 q64 -4 128 12" stroke="#33210f" strokeWidth="4" fill="none" opacity="0.4" />
      <path d="M30 176 q60 -8 128 6 M22 246 q70 -6 142 12 M34 318 q58 -4 120 10" stroke="#241608" strokeWidth="2" fill="none" opacity="0.35" />
      {/* fissures verticales */}
      <path d="M120 106 q12 56 -6 118 q-8 34 4 66 M212 132 q16 62 4 124 q-6 34 6 62 M282 168 q10 44 -2 92" stroke="#2a1a0e" strokeWidth="2.5" fill="none" opacity="0.55" />
      {/* lumière rasante du matin sur les arêtes */}
      <path d="M254 108 L276 112 L292 140 L312 150 L306 190 L322 206 L316 244 L332 264 L322 300" stroke="#ffe0a0" strokeWidth="4" fill="none" opacity="0.45" strokeLinejoin="round" />
      <path d="M170 72 L206 86 L230 84 L254 108 M62 70 L104 74 L132 64" stroke="#ffe0a0" strokeWidth="3" fill="none" opacity="0.32" strokeLinejoin="round" />
      <path d="M322 300 L336 320 L318 352 L326 380 L304 404" stroke="#f0c890" strokeWidth="3" fill="none" opacity="0.32" strokeLinejoin="round" />
      {/* surplombs : chaque strate dure fait une petite corniche qui projette une ombre */}
      {[[20, 150, 230], [10, 222, 260], [16, 292, 270], [30, 360, 250]].map(([x, y, w], i) => (
        <g key={i}>
          <path d={`M${x} ${y} l${w * 0.22} -3 l${w * 0.18} 5 l${w * 0.25} -2 l${w * 0.2} 6 l${w * 0.15} 2`} stroke="#9a7458" strokeWidth="3" opacity="0.45" fill="none" strokeLinejoin="round" />
          <path d={`M${x} ${y + 4} l${w * 0.22} -3 l${w * 0.18} 5 l${w * 0.25} -2 l${w * 0.2} 6 l${w * 0.15} 2`} stroke="#1a0e08" strokeWidth="5" opacity="0.38" fill="none" strokeLinejoin="round" />
        </g>
      ))}
      {/* arbres et buissons accrochés au sommet de la falaise */}
      <TreeLine seed={41} x0={-20} x1={240} y={80} n={10} h={[34, 58]} kinds={["conifer", "leafy", "conifer"]} colors={["#2c2a3a", "#383246", "#30303c"]} light={1} jitter={6} />
      <path d="M-40 82 L40 80 L62 70 L104 74 L132 64 L170 72 L206 86 L230 84 L254 108" stroke="#4a5a30" strokeWidth="4" fill="none" opacity="0.7" strokeLinejoin="round" />
      {/* mousse et végétation accrochée */}
      {[[236, 150], [274, 210], [252, 300], [296, 258]].map(([x, y], i) => (
        <g key={i} opacity="0.8">
          <ellipse cx={x} cy={y} rx={9 + (i % 2) * 3} ry={4} fill="#3c4a24" />
          <ellipse cx={x - 4} cy={y - 2} rx={5} ry={2.5} fill="#4c5c2c" />
        </g>
      ))}

      {/* bouche de la grotte */}
      <path d="M92 430 Q84 320 168 298 Q254 314 246 430 Z" fill="url(#x2cave)" />
      <path d="M92 430 Q84 320 168 298 Q254 314 246 430" fill="none" stroke="#1a0d08" strokeWidth="8" />
      <path d="M100 430 Q96 336 168 314" stroke="#ffe0a0" strokeWidth="3" fill="none" opacity="0.3" />
      <path d="M238 430 Q240 350 196 322" stroke="#0a0503" strokeWidth="5" fill="none" opacity="0.6" />
      {/* blocs à l'entrée + éboulis, ombres longues */}
      {[[86, 444, 18], [130, 452, 12], [252, 446, 16], [286, 452, 10], [200, 448, 8]].map(([x, y, r], i) => (
        <g key={i}>
          <ellipse cx={x - r * 1.6} cy={y + 3} rx={r * 2} ry={r * 0.4} fill="#241628" opacity="0.45" />
          <ellipse cx={x} cy={y} rx={r} ry={r * 0.6} fill="#5a4030" />
          <path d={`M${x - r * 0.6} ${y - r * 0.3} q${r * 0.6} -${r * 0.45} ${r * 1.3} -${r * 0.05}`} stroke="#b08a58" strokeWidth="1.4" fill="none" opacity="0.55" />
        </g>
      ))}

      {/* la tache d'OCRE, plus matérielle : croûte, éclats, traînées */}
      <g>
        <ellipse cx="112" cy="490" rx="40" ry="10" fill="#241628" opacity="0.35" />
        <ellipse cx="118" cy="486" rx="35" ry="11" fill="#a8431f" />
        <ellipse cx="106" cy="482" rx="15" ry="5" fill="#c95a28" />
        <ellipse cx="130" cy="488" rx="10" ry="4" fill="#8a3418" />
        <ellipse cx="96" cy="488" rx="6" ry="2.6" fill="#d96a35" />
        {[[142, 484], [148, 490], [138, 494]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="3" ry="1.6" fill="#b84a22" />
        ))}
        <path d="M92 480 q12 -7 26 -4 M100 492 q14 4 30 1" stroke="#d96a35" strokeWidth="2" fill="none" opacity="0.8" />
        <path d="M118 478 q6 -3 12 -2" stroke="#e8804a" strokeWidth="1.5" fill="none" />
      </g>

      {/* lianes détaillées, avec feuilles */}
      <g>
        <path d="M296 298 q10 36 -6 64 q-10 26 4 48" stroke="#3c5528" strokeWidth="5" fill="none" style={{ animation: "sway 4.2s ease-in-out infinite", transformOrigin: "296px 298px", transformBox: "view-box" }} />
        <path d="M306 304 q4 32 -8 56 q-7 22 2 40" stroke="#527232" strokeWidth="3.5" fill="none" style={{ animation: "sway 3.6s ease-in-out infinite", transformOrigin: "306px 304px", transformBox: "view-box" }} />
        <path d="M288 294 q11 30 0 58 q-5 18 2 34" stroke="#324a22" strokeWidth="3" fill="none" />
        {[[300, 336, -1], [291, 366, 1], [303, 398, -1], [296, 322, 1], [286, 384, -1]].map(([x, y, s], i) => (
          <path key={i} d={`M${x} ${y} q${8 * s} -3 ${10 * s} -10 q${-9 * s} 1 ${-10 * s} 10 Z`} fill={i % 2 ? "#527232" : "#46632c"} />
        ))}
        <path d="M298 306 q-4 20 2 38" stroke="#5d7a36" strokeWidth="1.5" fill="none" opacity="0.7" />
      </g>

      {/* buisson détaillé, feuillage en bouquets + lisière éclairée */}
      <g>
        <ellipse cx="368" cy="458" rx="52" ry="8" fill="#241628" opacity="0.4" />
        <ellipse cx="380" cy="448" rx="42" ry="18" fill="#33421f" />
        <ellipse cx="360" cy="440" rx="26" ry="13" fill="#3e5026" />
        <ellipse cx="398" cy="440" rx="22" ry="11" fill="#2a3819" />
        <ellipse cx="378" cy="432" rx="18" ry="9" fill="#46602c" />
        {[[352, 434], [370, 426], [390, 430], [404, 438], [360, 446]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} q4 -6 10 -6 q-2 6 -10 6 Z`} fill="#557236" opacity="0.9" />
        ))}
        <path d="M362 428 q16 -8 34 -2" stroke="#7a9a4a" strokeWidth="2" fill="none" opacity="0.7" />
      </g>
      {[430, 540, 660, 950].map((x, i) => <GrassTuft key={i} x={x} y={470 + (i % 2) * 40} c={i % 2 ? "#5d6b2e" : "#4e5c28"} />)}
      <GrassTuft x={200} y={540} c="#6b5a2e" />


      </PLayer>

      {/* ═══ premier plan (bouge le plus) ═══ */}
      <PLayer depth={3}>
      {/* MARTINE : le vaisseau, posé proprement sur ses tripodes.
          Design partagé avec TimeVessel/IntroStory (composant TimeMachine).
          Petite taille (0.35) pour rester discret dans le décor.
          Cliquable via le Hotspot ci-dessous (label "MARTINE"). */}
      {!bare && (
      <g transform="translate(840,510) scale(0.35)">
        <TimeMachine landed={true} />
      </g>
      )}
      {/* herbes sombres qui cadrent le bas de l'image */}
      <g opacity="0.9">
        <path d="M-4 560 q10 -34 4 -52 M14 560 q2 -28 14 -44 M34 560 q-6 -24 2 -40 M60 560 q8 -26 0 -38" stroke="#241a10" strokeWidth="4" fill="none" />
        <path d="M950 560 q-8 -30 -2 -46 M972 560 q4 -26 12 -38 M992 560 q-4 -22 4 -34 M928 560 q6 -20 -2 -32" stroke="#241a10" strokeWidth="4" fill="none" />
        <path d="M120 560 q6 -20 0 -30 M480 560 q-5 -18 2 -28 M700 560 q6 -18 0 -26" stroke="#2c2014" strokeWidth="3.5" fill="none" />
      </g>
      {/* poussière dorée en suspension dans la lumière du matin */}
      {[[620, 470], [700, 440], [780, 460]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="#ffe8b8" opacity="0.6" style={{ animation: `drift ${4 + i}s ease-in-out infinite` }} />
      ))}

      {/* ANA — l'accueillante du clan, les paumes rouges d'ocre. C'est elle
          qui ouvre les portes du clan… et qui aime les belles soirées. */}
      {!bare && (
      <g transform="translate(252,494)">
        <ellipse cx="0" cy="16" rx="20" ry="5" fill="#241a10" opacity="0.6" />
        <Figure x={0} y={16} s={0.74} skin="#cf9f72" hair="#3a2818" look="long" mood="content" paint earrings="#e8dcc4"
          garment="fur" coat="#8a6a48" pants="#5a3e26" bareArms arms={[{ a1: 150, a2: 166 }, { a1: 150, a2: 166 }]}>
          <circle cx="-33.6" cy="-115.6" r="6" fill="#b5451f" /><circle cx="33.6" cy="-115.6" r="6" fill="#b5451f" />
        </Figure>
      </g>
      )}
      {/* le « ? » doré : c'est au tour d'Ana dans la quête */}
      {queteQui === "ana" && (
        <g transform="translate(236,354)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
          <path d="M0 0 q0 -22 22 -22 q22 0 22 18 q0 15 -18 20 l0 7" fill="none" stroke="#ffd166" strokeWidth="4" />
          <circle cx="22" cy="34" r="2.8" fill="#ffd166" />
        </g>
      )}
      </PLayer>

      {/* léger voile de grain sur toute l'image (unifie la matière) */}
      <rect width="1000" height="560" fill="#1a1410" opacity="0.1" filter="url(#x2grain)" style={{ pointerEvents: "none" }} />

      {/* zones cliquables — hors couches (décalage max « rayon) */}
      {!bare && <>
        <Hotspot cx={118} cy={486} r={44} label="ocre" item="ocre" reveal={reveal} onClick={() => collect("ocre")} />
        <Hotspot cx={297} cy={360} r={48} label="liane" item="liane" reveal={reveal} onClick={() => collect("liane")} />
        <Hotspot cx={168} cy={380} r={60} label="grotte" reveal={reveal} onClick={() => action("cave")} />
        <Hotspot cx={840} cy={486} r={60} label="MARTINE" reveal={reveal} onClick={() => action("wreck")} />
        <Hotspot cx={252} cy={442} r={48} label="Ana" reveal={reveal} onClick={(p) => action("ana", p)} />
      </>}
    </svg>
  );
}
