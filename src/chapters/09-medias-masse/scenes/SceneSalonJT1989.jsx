import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";

/* ============================================================
   CHAPITRE 9 — Tableau : SALON DEVANT LE JT (9 nov. 1989)
   ------------------------------------------------------------
   Vue caméra placée DERRIÈRE le canapé. Le canapé et le fauteuil
   de grand-père (tous deux vus DE DOS) occupent le premier plan
   bas de l'écran. Les nuques de la famille dépassent du dossier ;
   ils regardent la TV cathodique au fond, encadrée par une vraie
   déco de salon 80s : fenêtre à droite (nuit + rideaux à motifs),
   tableau paysagé à gauche, horloge murale, plante verte, tapis
   à motifs.
   ============================================================ */

export default function SceneSalonJT1989({ collect, action, reveal, made = [], inv = [], mode }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="jt-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2e22" />
          <stop offset="60%" stopColor="#2a1e14" />
          <stop offset="100%" stopColor="#180f08" />
        </linearGradient>
        <linearGradient id="jt-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2418" />
          <stop offset="100%" stopColor="#1a0e08" />
        </linearGradient>
        <linearGradient id="jt-tv-frame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a08050" />
          <stop offset="100%" stopColor="#5a3a20" />
        </linearGradient>
        <radialGradient id="jt-screen" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#c0c8c8" />
          <stop offset="100%" stopColor="#4a5058" />
        </radialGradient>
        <linearGradient id="jt-couch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a3a1a" />
          <stop offset="100%" stopColor="#3a1e0a" />
        </linearGradient>
        <linearGradient id="jt-gp-chair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a3a2a" />
          <stop offset="100%" stopColor="#301a10" />
        </linearGradient>
        <linearGradient id="jt-night-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1024" />
          <stop offset="100%" stopColor="#1a1a2a" />
        </linearGradient>
      </defs>

      {/* ═════ MUR + DÉCO MURALE (soirée, pénombre) ═════ */}
      <PLayer depth={5}>
        <rect width="1000" height="420" fill="url(#jt-wall)" />
        {/* motifs discrets papier peint 80s */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((row) => (
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map((col) => {
            const x = 60 + col * 110 + (row % 2) * 55;
            const y = 24 + row * 40;
            return (
              <path key={`p-${row}-${col}`} d={`M${x} ${y} L${x + 8} ${y + 8} L${x} ${y + 16} L${x - 8} ${y + 8} Z`} fill="#5a4232" opacity="0.35" />
            );
          })
        ))}
        {/* plinthe */}
        <rect y="416" width="1000" height="4" fill="#1a0e04" />

        {/* CADRE / TABLEAU sur le mur à GAUCHE — petit paysage */}
        <g transform="translate(80,180)">
          <rect x="0" y="0" width="120" height="90" fill="#3a2a18" />
          <rect x="6" y="6" width="108" height="78" fill="#c9a54a" opacity="0.15" />
          <rect x="10" y="10" width="100" height="70" fill="#4a6a3a" />
          {/* ciel dans le tableau */}
          <rect x="10" y="10" width="100" height="30" fill="#7a90b0" />
          <circle cx="90" cy="26" r="6" fill="#f0e0a0" opacity="0.8" />
          {/* colline */}
          <path d="M10 40 Q40 34 60 40 Q80 46 110 38 L110 80 L10 80 Z" fill="#4a6a3a" />
          <path d="M10 50 Q40 46 60 52 Q80 58 110 48" stroke="#5a7a44" strokeWidth="2" fill="none" opacity="0.7" />
          {/* petit arbre */}
          <rect x="40" y="52" width="3" height="12" fill="#3a2418" />
          <circle cx="41" cy="50" r="6" fill="#3a5028" />
        </g>

        {/* HORLOGE MURALE ronde en bois, au-dessus de la TV */}
        <g transform="translate(500,80)">
          <circle cx="0" cy="0" r="34" fill="#4a2c18" stroke="#c9a54a" strokeWidth="2" />
          <circle cx="0" cy="0" r="28" fill="#f0e8c8" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
            const a = (i * 30 - 90) * Math.PI / 180;
            return <circle key={i} cx={Math.cos(a) * 22} cy={Math.sin(a) * 22} r={i % 3 === 0 ? 2 : 1.2} fill="#1a1a10" />;
          })}
          {/* aiguilles à 20:32 */}
          <line x1="0" y1="0" x2="12" y2="-2" stroke="#1a1a10" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="0" y1="0" x2="-8" y2="14" stroke="#1a1a10" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="0" cy="0" r="2.5" fill="#c04030" />
        </g>

        {/* PLANTE VERTE en pot suspendu à gauche */}
        <g transform="translate(240,50)">
          <line x1="0" y1="0" x2="0" y2="40" stroke="#8a7458" strokeWidth="0.8" />
          <line x1="-20" y1="4" x2="0" y2="40" stroke="#8a7458" strokeWidth="0.6" opacity="0.7" />
          <line x1="20" y1="4" x2="0" y2="40" stroke="#8a7458" strokeWidth="0.6" opacity="0.7" />
          {/* pot en macramé (années 80 !) */}
          <path d="M-20 40 L20 40 L14 68 L-14 68 Z" fill="#c9a54a" />
          <path d="M-20 40 L-14 68 M-10 40 L-8 68 M0 40 L0 68 M10 40 L8 68 M20 40 L14 68" stroke="#8a7458" strokeWidth="0.6" opacity="0.6" />
          {/* feuilles retombantes */}
          <path d="M-10 40 Q-30 60 -32 90 M0 40 Q-4 70 -10 100 M6 40 Q20 65 24 90 M14 40 Q30 55 32 85" stroke="#3a5028" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.85" />
          <path d="M-6 40 Q-14 74 -20 108 M2 40 Q10 78 8 110 M10 40 Q20 74 26 108" stroke="#4a6a34" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.75" />
        </g>

        {/* FENÊTRE à DROITE — vue sur la rue de nuit, rideaux à motifs */}
        <g transform="translate(820,100)">
          {/* cadre extérieur en bois */}
          <rect x="-72" y="-28" width="164" height="220" fill="#3a2418" />
          {/* ouverture */}
          <rect x="-64" y="-20" width="148" height="204" fill="url(#jt-night-sky)" />
          {/* étoiles + lampadaires */}
          {[[-40, 12], [-16, 30], [26, 8], [46, 40], [-32, 68], [8, 84], [58, 100]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="0.8" fill="#f0e0a0" opacity={0.6 + (i % 3) * 0.15} />
          ))}
          {/* silhouettes de toits au loin */}
          <path d="M-64 130 L-40 108 L-20 130 L4 112 L28 130 L52 116 L84 130 L84 184 L-64 184 Z" fill="#0a0a14" opacity="0.85" />
          {/* fenêtre allumée dans un immeuble en face */}
          <rect x="14" y="140" width="6" height="10" fill="#f0d060" opacity="0.7" />
          <rect x="-30" y="150" width="4" height="8" fill="#f0d060" opacity="0.5" />
          {/* meneau (montant vertical au centre) */}
          <rect x="6" y="-20" width="4" height="204" fill="#3a2418" />
          {/* traverse horizontale */}
          <rect x="-64" y="82" width="148" height="4" fill="#3a2418" />
          {/* rideaux à motifs de chaque côté, tirés partiellement */}
          <path d="M-72 -28 L-72 192 L-40 192 Q-56 60 -72 -28 Z" fill="#8a3a2a" />
          <path d="M92 -28 L92 192 L60 192 Q76 60 92 -28 Z" fill="#8a3a2a" />
          {/* petits motifs sur les rideaux */}
          {[[-60, 20], [-58, 60], [-56, 100], [-54, 140], [78, 20], [76, 60], [74, 100], [72, 140]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.5" fill="#c9a54a" opacity="0.5" />
          ))}
          {/* barre à rideaux + embouts */}
          <rect x="-76" y="-32" width="172" height="4" fill="#8a6a44" />
          <circle cx="-76" cy="-30" r="5" fill="#c9a54a" />
          <circle cx="96" cy="-30" r="5" fill="#c9a54a" />
          {/* rebord de fenêtre */}
          <rect x="-76" y="188" width="172" height="6" fill="#8a6a44" />
        </g>
      </PLayer>

      {/* Sol : parquet */}
      <PLayer depth={4}>
        <rect y="420" width="1000" height="140" fill="url(#jt-floor)" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line key={i} x1="0" y1={430 + i * 15} x2="1000" y2={430 + i * 15} stroke="#0a0604" strokeWidth="0.6" opacity="0.5" />
        ))}
      </PLayer>

      {/* MEUBLE + TV cathodique — centré au fond du salon */}
      <PLayer depth={4}>
        {/* meuble bas */}
        <rect x="410" y="340" width="180" height="72" fill="#3a2418" stroke="#1a0e04" strokeWidth="1.5" rx="2" />
        <rect x="414" y="344" width="172" height="6" fill="#4a3020" />
        <rect x="470" y="386" width="14" height="4" fill="#c9a54a" rx="1" />
        <rect x="516" y="386" width="14" height="4" fill="#c9a54a" rx="1" />

        {/* Magnétoscope VHS */}
        <rect x="422" y="324" width="72" height="14" fill="#141414" stroke="#0a0a0a" strokeWidth="1" rx="1" />
        <rect x="426" y="327" width="46" height="4" fill="#2a2a2a" />
        <circle cx="484" cy="331" r="1.6" fill="#c04040">
          <animate attributeName="opacity" values="1;0.35;1" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <text x="430" y="336" fontFamily="ui-monospace,monospace" fontSize="4" fill="#7fd8ff">REC 20:32</text>

        {/* TV cathodique */}
        <g transform="translate(500,260)">
          <path d="M-98 -60 L98 -60 L86 62 L-86 62 Z" fill="url(#jt-tv-frame)" stroke="#1a0e04" strokeWidth="1.5" />
          <ellipse cx="0" cy="62" rx="88" ry="6" fill="#3a2418" />
          <rect x="-92" y="-56" width="184" height="122" fill="url(#jt-tv-frame)" stroke="#1a0e04" strokeWidth="1.5" rx="4" />
          <rect x="-76" y="-46" width="152" height="94" fill="url(#jt-screen)" stroke="#141410" strokeWidth="2" rx="12" />
          <rect x="-70" y="-8" width="140" height="20" fill="#8a8880" opacity="0.6" />
          {[[-56, -12], [-38, -14], [-16, -10], [8, -14], [26, -10], [46, -13], [62, -11]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1.6 + (i % 2)} fill="#2a2a20" opacity="0.7" />
          ))}
          <rect x="-76" y="30" width="152" height="14" fill="#a02020" opacity="0.95" />
          <text x="0" y="41" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fontWeight="800" fill="#fff">◉ EN DIRECT — BERLIN</text>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <line key={`sc-${i}`} x1="-76" y1={-44 + i * 10} x2="76" y2={-44 + i * 10} stroke="#000" strokeWidth="0.3" opacity="0.18" />
          ))}
          <circle cx="82" cy="-30" r="6" fill="#1a0e04" stroke="#c9a54a" strokeWidth="1" />
          <circle cx="82" cy="-8" r="6" fill="#1a0e04" stroke="#c9a54a" strokeWidth="1" />
        </g>
      </PLayer>

      {/* MAMAN debout à gauche, 3/4, combiné à l'oreille */}
      <PLayer depth={2}>
        <g transform="translate(120,440)">
          <rect x="-40" y="-24" width="80" height="30" fill="#3a2418" stroke="#1a0e04" strokeWidth="1.2" rx="2" />
          <rect x="-32" y="-42" width="64" height="24" fill="#c85030" stroke="#7a2010" strokeWidth="1" rx="3" />
          <circle cx="-8" cy="-30" r="5" fill="#1a1a1a" />
          <circle cx="-8" cy="-30" r="3" fill="#c85030" />
          <path d="M-30 42 Q-24 20 -20 6" stroke="#1a1a1a" strokeWidth="1.4" fill="none" />
        </g>
        <g transform="translate(160,450)">
          <path d="M-14 -30 Q0 -34 14 -30 L16 8 L-16 8 Z" fill="#4a6a94" />
          <path d="M-18 -30 L-13 -34 L-13 -22 L-18 -22 Z" fill="#4a6a94" />
          <path d="M18 -30 L13 -34 L13 -22 L18 -22 Z" fill="#4a6a94" />
          <path d="M-16 8 L16 8 L18 44 L-18 44 Z" fill="#2a3a54" />
          <rect x="-6" y="44" width="4" height="20" fill="#c9a878" />
          <rect x="2" y="44" width="4" height="20" fill="#c9a878" />
          <ellipse cx="-4" cy="66" rx="6" ry="2" fill="#1a1410" />
          <ellipse cx="4" cy="66" rx="6" ry="2" fill="#1a1410" />
          <path d="M-14 -22 L-24 -34 L-22 -40" stroke="#4a6a94" strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="-4" cy="-40" r="10" fill="#f0d0a8" />
          <path d="M-14 -46 Q-4 -54 6 -46 L6 -32 L-14 -32 Z" fill="#e8c878" />
          <rect x="-24" y="-46" width="10" height="10" fill="#c85030" stroke="#7a2010" strokeWidth="0.6" rx="1" />
        </g>
      </PLayer>

      {/* ═════ FAUTEUIL DU GRAND-PÈRE, à droite, VU DE DOS, orienté TV ═════ */}
      <PLayer depth={1}>
        <g transform="translate(880,540)">
          {/* dossier haut, arrondi */}
          <path d="M-56 -180 Q0 -196 56 -180 L64 -30 L-64 -30 Z" fill="url(#jt-gp-chair)" />
          {/* rainures cotelées */}
          {[-40, -20, 0, 20, 40].map((x) => (
            <line key={x} x1={x} y1="-178" x2={x} y2="-34" stroke="#1a0a04" strokeWidth="0.6" opacity="0.5" />
          ))}
          {/* accoudoirs qui remontent */}
          <path d="M-84 -160 Q-88 -170 -76 -172 L-64 -170 L-58 -30 L-84 -30 Z" fill="url(#jt-gp-chair)" />
          <path d="M84 -160 Q88 -170 76 -172 L64 -170 L58 -30 L84 -30 Z" fill="url(#jt-gp-chair)" />
          {/* base */}
          <rect x="-84" y="-30" width="168" height="30" fill="#1a0a04" />
          {/* pieds */}
          <rect x="-78" y="0" width="10" height="12" fill="#1a0a04" rx="1" />
          <rect x="68" y="0" width="10" height="12" fill="#1a0a04" rx="1" />

          {/* GRAND-PÈRE : nuque + haut du crâne qui dépasse du dossier arrondi */}
          <g transform="translate(0,-176)">
            <ellipse cx="0" cy="0" rx="18" ry="16" fill="#e8c8a8" />
            {/* frange de cheveux blancs, calvitie sur le dessus */}
            <path d="M-16 -6 Q-14 -14 -6 -16 L6 -16 Q14 -14 16 -6 L16 -2 L-16 -2 Z" fill="#efe8de" />
            <path d="M-15 0 Q-10 2 -6 0 M-3 0 Q1 2 5 0 M8 0 Q13 2 16 0" stroke="#c8bfae" strokeWidth="0.5" />
            {/* branche de lunettes discrète côté gauche */}
            <line x1="-14" y1="0" x2="-8" y2="2" stroke="#1a1a1a" strokeWidth="0.7" opacity="0.7" />
          </g>
          {/* col d'un gilet gris-beige qui dépasse */}
          <path d="M-22 -170 Q0 -164 22 -170 L22 -158 L-22 -158 Z" fill="#7a6a5a" />
        </g>
      </PLayer>

      {/* Tapis + ADO au sol devant le canapé */}
      <PLayer depth={3}>
        <ellipse cx="500" cy="480" rx="320" ry="26" fill="#7a2a2a" opacity="0.75" />
        <ellipse cx="500" cy="480" rx="300" ry="22" fill="none" stroke="#c9a54a" strokeWidth="1.2" opacity="0.7" />
        {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
          <circle key={i} cx={500 + i * 68} cy="480" r="6" fill="none" stroke="#c9a54a" strokeWidth="0.9" opacity="0.55" />
        ))}
        <g transform="translate(400,504)">
          <path d="M-16 -18 Q0 -22 16 -18 L18 20 L-18 20 Z" fill="#e878a0" />
          <path d="M-10 -22 Q-14 -8 -10 6 M10 -22 Q14 -8 10 6" stroke="#1a1a1a" strokeWidth="8" fill="none" />
          <circle cx="0" cy="-28" r="9" fill="#f0d0a8" />
          <ellipse cx="4" cy="-36" rx="4" ry="2.5" fill="#f8b0c8" />
          <path d="M-14 20 L14 20 L12 34 L-12 34 Z" fill="#3a5074" />
        </g>
      </PLayer>

      {/* ═════ CANAPÉ AU PREMIER PLAN, DE DOS, avec papa + un(e) autre ═════ */}
      <PLayer depth={1}>
        <g transform="translate(410,540)">
          {/* dossier canapé, arrondi haut, plus généreux (baissé pour laisser voir les têtes) */}
          <path d="M-260 -128 Q0 -150 260 -128 L272 -50 L-272 -50 Z" fill="url(#jt-couch)" />
          {/* rainures velours cotelé */}
          {[-220, -180, -140, -100, -60, -20, 20, 60, 100, 140, 180, 220].map((x) => (
            <line key={x} x1={x} y1="-128" x2={x} y2="-56" stroke="#2a0e04" strokeWidth="0.6" opacity="0.55" />
          ))}
          {/* liseré du dossier */}
          <path d="M-260 -128 Q0 -150 260 -128" fill="none" stroke="#2a0e04" strokeWidth="2" />
          {/* accoudoirs */}
          <path d="M-292 -108 Q-296 -120 -284 -122 L-268 -120 L-260 -50 L-292 -50 Z" fill="url(#jt-couch)" />
          <path d="M292 -108 Q296 -120 284 -122 L268 -120 L260 -50 L292 -50 Z" fill="url(#jt-couch)" />
          {/* base */}
          <rect x="-292" y="-50" width="584" height="50" fill="#1a0a04" />

          {/* PAPA — nuque proprement calée juste au-dessus du dossier */}
          <g transform="translate(-100,-158)">
            {/* haut du crâne + nuque, ovale plus long horizontalement */}
            <ellipse cx="0" cy="4" rx="16" ry="14" fill="#e8bfa0" />
            {/* cheveux courts brun, coupe classique années 80 */}
            <path d="M-15 -2 Q-14 -12 -6 -14 L6 -14 Q14 -12 15 -2 L15 4 L-15 4 Z" fill="#3a2418" />
            <path d="M-14 4 L14 4" stroke="#2a1408" strokeWidth="0.6" />
            {/* petit trait fin qui suggère l'arrière d'oreille droite */}
            <ellipse cx="15" cy="8" rx="2" ry="4" fill="#d8a888" />
            {/* col de chemise à carreaux */}
            <path d="M-20 14 L-14 20 L0 18 L14 20 L20 14 L20 22 L-20 22 Z" fill="#8a5a3a" />
            <path d="M-14 20 L-4 24 L4 24 L14 20" stroke="#5a3a20" strokeWidth="0.6" fill="none" />
            {/* bras qui dépasse à droite tenant la cigarette */}
            <g transform="translate(38,26)">
              <ellipse cx="0" cy="0" rx="4" ry="3" fill="#e8bfa0" />
              <line x1="4" y1="0" x2="14" y2="-4" stroke="#f0eae0" strokeWidth="1.4" />
              <ellipse cx="14" cy="-4" rx="1.2" ry="0.6" fill="#ff8a30">
                <animate attributeName="opacity" values="1;0.4;1" dur="2.4s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="18" cy="-14" rx="2.5" ry="1.3" fill="#e8e0d0" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="cy" values="-14;-26" dur="2.4s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="22" cy="-22" rx="3.5" ry="1.6" fill="#d8d0c0" opacity="0.35">
                <animate attributeName="opacity" values="0.35;0" dur="3s" begin="0.4s" repeatCount="indefinite" />
                <animate attributeName="cy" values="-22;-38" dur="3s" begin="0.4s" repeatCount="indefinite" />
              </ellipse>
            </g>
          </g>

          {/* SŒUR/FRÈRE — nuque, cheveux mi-longs, T-shirt orange 80s */}
          <g transform="translate(80,-158)">
            <ellipse cx="0" cy="4" rx="15" ry="14" fill="#f0d0a8" />
            {/* cheveux châtains mi-longs avec petites vagues */}
            <path d="M-15 -2 Q-14 -14 -4 -16 L4 -16 Q14 -14 15 -2 L16 14 L-16 14 Z" fill="#7a5030" />
            <path d="M-14 4 Q-10 8 -6 4 M6 4 Q10 8 14 4" stroke="#5a3a1a" strokeWidth="0.6" fill="none" opacity="0.7" />
            {/* col d'un T-shirt orange fluo */}
            <path d="M-18 14 L-8 20 L8 20 L18 14 L20 22 L-20 22 Z" fill="#e8542e" />
          </g>
        </g>
      </PLayer>

      {/* voile de grain global */}
      <rect width="1000" height="560" fill="#141008" opacity="0.06" style={{ pointerEvents: "none" }} />

      {/* zones cliquables */}
      {!made.includes("msg_evenement") && mode !== "jeu2" && (
        <Hotspot cx={500} cy={260} r={80} label="regarder le direct du JT" reveal={reveal} onClick={() => action("cadrer_evenement")} />
      )}
      <Hotspot cx={310} cy={388} r={30} label="parler à Papa" reveal={reveal} onClick={() => action("papa_jt")} />
      <Hotspot cx={155} cy={410} r={28} label="parler à Maman" reveal={reveal} onClick={() => action("maman_jt")} />
      <Hotspot cx={400} cy={484} r={28} label="parler à l'ado" reveal={reveal} onClick={() => action("ado_jt")} />
      <Hotspot cx={880} cy={368} r={30} label="parler à Grand-père" reveal={reveal} onClick={() => action("grandpere_jt")} />
    </svg>
  );
}
