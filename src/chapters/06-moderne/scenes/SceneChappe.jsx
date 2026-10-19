import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";
import { Clouds, Grass, Haze, Hill, Leafy, Ridge, Rock, Speckle, TreeLine } from "../../../engine/scenery.jsx";

/* ============================================================
   CHAPITRE 6 — Tableau : la tour de Chappe
   Peinture fine — colline en fin de jour, la tour à bras
   articulés (télégraphe optique), une autre tour à l'horizon,
   l'opérateur à la longue-vue, le cahier de codes, un espion
   tapi, et le coin d'atelier de la pile de Volta.
   À trouver : bras articulés, longue-vue, cahier de codes,
   l'espion, disques de zinc & cuivre, chiffons à la saumure.
   ============================================================ */

export default function SceneChappe({ collect, action, reveal, made = [], queteQui }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="cp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a5580" />
          <stop offset="45%" stopColor="#7a8ab0" />
          <stop offset="76%" stopColor="#d8a878" />
          <stop offset="100%" stopColor="#f0cc82" />
        </linearGradient>
        <radialGradient id="cp-sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff0c8" /><stop offset="50%" stopColor="#ffd888" stopOpacity="0.6" /><stop offset="100%" stopColor="#ffd888" stopOpacity="0" /></radialGradient>
        <linearGradient id="cp-hill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7a7a4e" /><stop offset="100%" stopColor="#4e4e32" /></linearGradient>
        <linearGradient id="cp-tower" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#5e5644" /><stop offset="55%" stopColor="#8a7e64" /><stop offset="100%" stopColor="#d0b88a" /></linearGradient>
        <linearGradient id="cp-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9a8a56" /><stop offset="100%" stopColor="#4e4028" /></linearGradient>
        <filter id="cp-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="cp-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7" /></filter>
      </defs>

      {/* ═══ ciel de fin de jour ═══ */}
      <rect width="1000" height="560" fill="url(#cp-sky)" />
      {/* rayons du couchant, très doux */}
      <g opacity="0.16" filter="url(#cp-blur)">
        {[-62, -40, -18, 6, 30].map((a, i) => (
          <path key={i} d={`M760 200 L${760 + Math.cos((a * Math.PI) / 180 + Math.PI) * 900} ${200 + Math.sin((a * Math.PI) / 180 + Math.PI) * 900} L${760 + Math.cos(((a + 7) * Math.PI) / 180 + Math.PI) * 900} ${200 + Math.sin(((a + 7) * Math.PI) / 180 + Math.PI) * 900} Z`} fill="#fff0c8" />
        ))}
      </g>
      <circle cx="760" cy="200" r="140" fill="url(#cp-sun)" />
      <circle cx="760" cy="200" r="36" fill="#fff0c8" opacity="0.9" />
      {/* nuages effilés, dorés par en dessous */}
      <Clouds id="cp-cl" seed={203} items={[[180, 112, 200], [420, 74, 150], [640, 140, 110], [900, 120, 170], [300, 176, 120]]} color="#f2cfae" shadow="#8a7a9a" opacity={0.7} drift={24} />
      <path d="M600 168 q60 -6 130 -2 M820 160 q50 -4 110 2 M560 186 q40 -3 90 0" stroke="#ffe0b0" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <path d="M180 110 q8 -8 16 0 M240 132 q6 -6 12 0 M212 150 q5 -5 10 0" stroke="#3a4452" strokeWidth="2.2" fill="none" opacity="0.5" />

      {/* ═══ couche lointaine : collines + tour du télégraphe à l'horizon ═══ */}
      <PLayer depth={1}>
        {/* la chaîne lointaine, bleutée, rosie côté soleil */}
        <Ridge id="cp-r0" seed={201} y={264} amp={40} rough={0.5} fill="#8a86a4" lit="#c8a49a" light={1} />
        <Haze id="cp-hz0" y0={226} y1={282} color="#f0c090" opacity={0.45} />
        {/* les coteaux : champs, haies et bosquets ; ils portent le fort de
            Condé, la tour suivante et (plus tard) la tour-relais */}
        <Hill id="cp-h1" points={[[-40, 300], [80, 292], [170, 286], [250, 280], [330, 266], [420, 282], [500, 290], [600, 286], [700, 276], [812, 268], [900, 280], [1040, 292]]}
          fill="#6e6a40" lit="#b0a05a" light={1} rim={5}>
          {[[-40, 300, 160, "#7a7444"], [120, 296, 150, "#8a7e48"], [380, 290, 160, "#64683c"], [560, 292, 130, "#8a8048"], [700, 284, 150, "#74703e"], [860, 286, 200, "#867a46"]].map(([x, y, w, c], i) => (
            <path key={i} d={`M${x} ${y + 40} L${x + w * 0.1} ${y - 10} L${x + w} ${y - 14} L${x + w * 0.92} ${y + 40} Z`} fill={c} opacity="0.45" />
          ))}
          {/* haies du bocage, en pointillé de petits buissons */}
          {[[120, 296, 136, 334], [380, 290, 372, 334], [560, 292, 572, 334], [700, 282, 690, 334], [860, 284, 874, 334]].map(([x1, y1, x2, y2], i) => (
            Array.from({ length: 9 }).map((_, k) => <circle key={`${i}-${k}`} cx={x1 + ((x2 - x1) * k) / 8} cy={y1 + ((y2 - y1) * k) / 8} r={1.8 + k * 0.12} fill="#4a4a26" opacity="0.6" />)
          ))}
          <path d="M-40 312 Q300 300 520 306 Q760 312 1040 300" stroke="#4a4a2a" strokeWidth="2" fill="none" opacity="0.4" />
        </Hill>
        {[[60, 296], [96, 294], [262, 284], [404, 290], [432, 292], [620, 290], [668, 286], [940, 288], [976, 292]].map(([x, y], i) => (
          <Leafy key={i} x={x} y={y} s={0.14 + (i % 3) * 0.02} color={["#5a5e30", "#4e5a2c", "#62602e"][i % 3]} light={1} seed={210 + i} />
        ))}
        {/* CONDÉ reprise, au loin à gauche : une place forte avec le drapeau
            TRICOLORE hissé, un peu de fumée de canon — l'événement du jour */}
        <g transform="translate(170,268)" opacity="0.9">
          <rect x="-46" y="-14" width="92" height="34" fill="#6a6450" />
          <rect x="16" y="-14" width="30" height="34" fill="#a89878" opacity="0.4" />
          {[-46, -30, -14, 2, 18, 34].map((x, i) => <rect key={i} x={x} y="-22" width="8" height="8" fill="#6a6450" />)}
          <rect x="-16" y="-6" width="14" height="26" fill="#2c2618" />
          {/* mât + drapeau tricolore */}
          <path d="M40 -14 v-30" stroke="#3a2c1c" strokeWidth="2" />
          <path d="M40 -44 h24 v14 h-24 Z" fill="#e8e2d0" />
          <rect x="40" y="-44" width="8" height="14" fill="#2a4a9a" /><rect x="56" y="-44" width="8" height="14" fill="#a83030" />
          {/* fumée de canon */}
          <path d="M-40 6 q-10 -8 -4 -18 q-8 4 -6 -8" stroke="#cfc8bc" strokeWidth="4" fill="none" opacity="0.4" style={{ animation: "drift 6s ease-in-out infinite" }} filter="url(#cp-blur)" />
        </g>
        {/* la tour SUIVANTE, au loin (silhouette) */}
        <g transform="translate(330,268)" opacity="0.7">
          <rect x="-6" y="-30" width="12" height="30" fill="#3a3a2a" />
          <path d="M0 -30 v-16" stroke="#3a3a2a" strokeWidth="2" />
          <path d="M-16 -46 h32" stroke="#3a3a2a" strokeWidth="3" />
          <path d="M-16 -46 l-6 8 M16 -46 l6 -8" stroke="#3a3a2a" strokeWidth="2.4" />
        </g>
        <Haze id="cp-hz1" y0={280} y1={336} color="#e8b878" opacity={0.3} />
        {/* le versant le plus proche, avec ses bosquets */}
        <Hill id="cp-h2" points={[[-40, 338], [120, 326], [260, 342], [400, 372], [600, 374], [760, 342], [900, 326], [1040, 334]]}
          fill="#5e5a36" lit="#948850" light={1} rim={6}>
          <path d="M-40 360 Q200 350 420 392 M600 392 Q800 350 1040 356" stroke="#3e3c22" strokeWidth="2" fill="none" opacity="0.4" />
        </Hill>
        <TreeLine seed={221} x0={-20} x1={220} y={334} n={9} h={[16, 30]} kinds={["leafy", "conifer", "leafy"]} colors={["#4a5228", "#3e4822", "#565a2c"]} light={1} jitter={6} />
        <TreeLine seed={223} x0={800} x1={1020} y={334} n={9} h={[16, 30]} kinds={["leafy", "leafy", "conifer"]} colors={["#4a5228", "#3e4822", "#565a2c"]} light={1} jitter={6} />
      </PLayer>

      {/* ═══ couche intermédiaire : LA TOUR de Chappe + sa cabine ═══ */}
      <PLayer depth={2}>
        {/* le tertre qui porte la tour, et le sentier qui y grimpe */}
        <Hill id="cp-h3" points={[[250, 404], [370, 362], [450, 336], [550, 334], [640, 360], [760, 404]]} fill="#6e6438" lit="#a8964e" light={1} rim={5} bottom={420}>
          <path d="M380 420 Q420 380 470 364 Q520 350 506 334" stroke="#b8a070" strokeWidth="9" fill="none" opacity="0.55" strokeLinecap="round" />
          <ellipse cx="452" cy="338" rx="70" ry="9" fill="#2c2410" opacity="0.28" />
        </Hill>
        <Rock x={392} y={372} w={26} h={12} color="#8a7e62" light={1} seed={231} />
        <Rock x={618} y={364} w={20} h={10} color="#8a7e62" light={1} seed={232} />
        <Grass x={430} y={350} s={0.6} color="#5a5a2a" seed={233} n={5} />
        <Grass x={586} y={346} s={0.6} color="#5a5a2a" seed={234} n={5} />
        <g transform="translate(500,330)">
          {/* ombre portée de la tour, allongée vers la gauche (soleil couchant à droite) */}
          <path d="M-30 0 L30 0 L-120 14 L-170 10 Z" fill="#2c2410" opacity="0.3" />
          {/* fût de maçonnerie, assises de pierre */}
          <rect x="-30" y="-110" width="60" height="110" fill="url(#cp-tower)" />
          <rect x="-30" y="-110" width="60" height="110" fill="#2c2618" opacity="0.25" filter="url(#cp-grain)" />
          {Array.from({ length: 11 }).map((_, r) => (
            <g key={r}>
              <path d={`M-30 ${-r * 10} h60`} stroke="#5e5644" strokeWidth="0.8" opacity="0.45" />
              {[-18, -2, 14].map((x, k) => <path key={k} d={`M${x + (r % 2) * 8} ${-r * 10} v-10`} stroke="#5e5644" strokeWidth="0.7" opacity="0.35" />)}
            </g>
          ))}
          {/* corniche + petite cabine de l'opérateur au sommet */}
          <rect x="-34" y="-114" width="68" height="6" fill="#6e6450" />
          <rect x="-34" y="-114" width="68" height="2" fill="#d8c090" opacity="0.6" />
          <rect x="-14" y="-90" width="10" height="14" fill="#2c2416" />
          <rect x="-13" y="-89" width="8" height="12" fill="#ffd888" opacity="0.35" />
          <rect x="-12" y="-40" width="24" height="40" fill="#2c2416" />
          <path d="M-12 -40 Q0 -48 12 -40" fill="#2c2416" />
          <rect x="28" y="-110" width="2" height="110" fill="#fff0c8" opacity="0.35" />
          {/* le mât + le régulateur (grande traverse) et les 2 indicateurs */}
          <path d="M0 -110 v-70" stroke="#3a2c1c" strokeWidth="5" />
          {/* régulateur (barre centrale, inclinée) */}
          <g transform="rotate(-18)">
            <rect x="-52" y="-184" width="104" height="12" rx="3" fill="#5a3f24" />
            {/* indicateurs aux extrémités */}
            <g transform="translate(-52,-178) rotate(40)"><rect x="-4" y="-30" width="8" height="42" rx="3" fill="#6e4c2e" /></g>
            <g transform="translate(52,-178) rotate(-55)"><rect x="-4" y="-30" width="8" height="42" rx="3" fill="#6e4c2e" /></g>
          </g>
        </g>
      </PLayer>

      {/* ═══ premier plan : plateau herbeux, opérateur, atelier, espion ═══ */}
      <PLayer depth={3}>
        <rect y="400" width="1000" height="160" fill="url(#cp-ground)" />
        <rect y="402" width="1000" height="158" fill="#2a2010" opacity="0.32" filter="url(#cp-grain)" />
        <ellipse cx="500" cy="472" rx="440" ry="52" fill="#6e5c38" opacity="0.3" />
        {/* lisière du plateau : touffes rasantes contre le ciel du couchant */}
        <path d="M-20 402 Q200 396 400 404 Q620 410 1020 398 L1020 410 L-20 410 Z" fill="#a89458" opacity="0.6" />
        <Speckle seed={241} x0={0} x1={1000} y0={410} y1={556} n={110} colors={["#4e4028", "#c8b07a", "#6a5a38"]} r={[1, 2.6]} opacity={0.55} />
        {/* le sentier qui monte vers la tour */}
        <path d="M120 560 Q260 500 400 470 Q480 452 500 404" stroke="#b8a070" strokeWidth="26" fill="none" opacity="0.28" strokeLinecap="round" />
        <Grass x={80} y={470} s={1.1} color="#6a6e36" seed={242} n={8} />
        <Grass x={940} y={470} s={1.1} color="#6a6e36" seed={243} n={8} flower="#e8c860" />
        <Grass x={30} y={540} s={1.4} color="#5a5e2c" seed={244} n={9} />
        <Grass x={770} y={548} s={1.2} color="#5a5e2c" seed={245} n={8} flower="#d86a4a" />
        <Grass x={320} y={420} s={0.7} color="#7a7a40" seed={246} n={5} />
        <Grass x={720} y={424} s={0.7} color="#7a7a40" seed={247} n={5} />
        <Rock x={130} y={430} w={40} h={18} color="#8a7e62" light={1} seed={248} moss="#6a6e36" />
        <Rock x={980} y={530} w={50} h={24} color="#7a6e56" light={1} seed={249} />

        {/* LA FOULE DES BADAUDS au pied de la tour, le nez en l'air vers les
            bras du télégraphe — le spectacle nouveau de la Révolution */}
        {[[452, 430, "#5a3a4a", 0.85], [492, 436, "#3a4a6a", 0.95], [536, 432, "#5a4a2a", 0.9], [578, 438, "#4a3a5a", 1], [620, 434, "#6a3a3a", 0.9], [662, 440, "#3a4a3a", 0.82]].map(([x, y, c, s], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
            <ellipse cx="0" cy="34" rx="14" ry="4" fill="#241608" opacity="0.4" />
            {/* le nez en l'air ; tricorne pour certains, un bras qui pointe la tour */}
            <Figure x={0} y={32} s={0.44} skin="#cc9c6c" hair={["#3a2c1c", "#5a3a20", "#1e140c"][i % 3]} look={["ponytail", "bun", "short", "long", "ponytail", "curls"][i]}
              hat={i % 2 === 0 ? "tricorne" : null} mood="surpris" garment={i % 2 ? "dress" : "coat"} coat={c} pants="#3a2c1c"
              arms={i % 3 === 0 ? [{ a1: 10, a2: 6 }, { a1: 160, a2: 170 }] : [{ a1: 10, a2: 6 }, { a1: 10, a2: 6 }]} />
          </g>
        ))}

        {/* L'OPÉRATEUR à la longue-vue, tourné vers l'horizon */}
        <g transform="translate(360,470)">
          <ellipse cx="0" cy="30" rx="22" ry="6" fill="#241608" opacity="0.5" />
          {/* l'œil à la longue-vue, tourné vers l'horizon */}
          <Figure x={0} y={28} s={0.49} facing="right" skin="#c8a882" hair="#4a3a2a" look="ponytail" mood="vexe"
            garment="coat" coat="#3a4a6a" pants="#2c3448" shoes="#1a1a20"
            arms={[{ a1: 10, a2: 6 }, { a1: 140, a2: 100 }]}>
            <g transform="translate(9,-107) rotate(-4)">
              <rect x="0" y="-6" width="62" height="12" rx="5" fill="#3a2c1c" />
              <rect x="58" y="-8" width="15" height="16" rx="3" fill="#5a4630" />
              <circle cx="3" cy="0" r="5" fill="#cfeaff" />
            </g>
          </Figure>
        </g>

        {/* PUPITRE avec le CAHIER DE CODES */}
        <g transform="translate(240,500)">
          <path d="M-40 16 L40 16 L46 -4 L-34 -4 Z" fill="#6e4c2e" />
          <rect x="-40" y="16" width="8" height="26" fill="#5a3f24" /><rect x="34" y="16" width="8" height="26" fill="#5a3f24" />
          {/* cahier ouvert avec des schémas de positions de bras */}
          <g transform="translate(2,2)">
            <path d="M-30 4 L30 4 L28 -14 L-28 -14 Z" fill="#efe6ce" />
            <path d="M0 4 V-14" stroke="#c9b892" strokeWidth="1" />
            {[[-20, -6], [-8, -6], [14, -6], [22, -6]].map(([x, y], i) => (
              <g key={i} transform={`translate(${x},${y})`}>
                <path d="M0 4 v-8 M-4 -6 h8" stroke="#5a4a3a" strokeWidth="1" />
                <path d={`M-4 -6 l${i % 2 ? -2 : 2} -3 M4 -6 l${i % 2 ? 2 : -2} 3`} stroke="#5a4a3a" strokeWidth="1" />
              </g>
            ))}
          </g>
        </g>

        {/* ALESSANDRO VOLTA, au premier plan, la tête levée vers le télégraphe :
            il l'observe et cherche comment l'alimenter en énergie constante */}
        <g transform="translate(600,476)">
          <ellipse cx="0" cy="36" rx="24" ry="7" fill="#241608" opacity="0.5" />
          {/* habit vert long + jabot ; un bras levé pointe les bras du télégraphe */}
          <Figure x={0} y={34} s={0.58} facing="left" skin="#d6a67a" hair="#6a5a48" look="slick" mood="surpris"
            garment="coat" coat="#2c4636" pants="#1e3226" shoes="#1a1a14"
            arms={[{ a1: 150, a2: 160 }, { a1: 30, a2: 20 }]}>
            <path d="M0 -88 Q-6 -70 0 -48 Q6 -70 0 -88 Z" fill="#e6dfc8" />
            {/* éclair d'idée au-dessus de sa tête */}
            <path d="M12 -140 l-7 14 l7 -2 l-5 14" stroke="#ffe08a" strokeWidth="3.4" fill="none" style={{ animation: "pulse 1.8s infinite" }} />
          </Figure>
        </g>

        {/* LE COIN ATELIER DE VOLTA : disques de zinc & cuivre + chiffons salés */}
        <g transform="translate(660,502)">
          <path d="M-44 14 L44 14 L38 -2 L-38 -2 Z" fill="#5a3f24" />
          <rect x="-40" y="14" width="8" height="26" fill="#3a2814" /><rect x="32" y="14" width="8" height="26" fill="#3a2814" />
          {/* pile de disques métalliques (zinc clair / cuivre orangé alternés) */}
          <g transform="translate(-16,2)">
            {[0, -5, -10, -15, -20, -25].map((y, i) => (
              <ellipse key={i} cx="0" cy={y} rx="14" ry="4.5" fill={i % 2 ? "#c98a4a" : "#b8bcc0"} stroke="#7a6a4a" strokeWidth="0.6" />
            ))}
          </g>
          {/* pot de saumure + chiffons */}
          <g transform="translate(22,2)">
            <path d="M-11 -2 Q-12 8 0 9 Q12 8 11 -2 Z" fill="#7a6e5a" />
            <ellipse cx="0" cy="-2" rx="10" ry="3.6" fill="#a8c0c4" />
            <rect x="-6" y="-12" width="12" height="10" rx="2" fill="#e0d8c4" transform="rotate(-8)" />
          </g>
        </g>

        {/* L'ESPION tapi derrière un buisson, longue-vue braquée */}
        <g transform="translate(880,486)">
          {/* tapi derrière le buisson : on ne voit que sa tête et sa longue-vue */}
          <Figure x={-2} y={32} s={0.42} facing="right" skin="#8a7258" hair="#1c1c22" look="short" hat="tricorne" hatColor="#1c1c22" mood="vexe"
            garment="coat" coat="#2c2c34" pants="#1c1c22" arms={[{ a1: 10, a2: 6 }, { a1: 140, a2: 100 }]}>
            <g transform="translate(9,-107) rotate(-24)"><rect x="0" y="-6" width="46" height="12" rx="4" fill="#1c1c22" /><circle cx="46" cy="0" r="5.6" fill="#cfeaff" /></g>
          </Figure>
          <ellipse cx="6" cy="24" rx="40" ry="18" fill="#3a4a24" />
          <ellipse cx="-14" cy="16" rx="20" ry="14" fill="#46592c" />
          <ellipse cx="26" cy="18" rx="22" ry="13" fill="#3e4e26" />
        </g>
      </PLayer>

      {/* RÉSULTAT (msg_chappe) : au loin, sur une colline, une TOUR-RELAIS
          reprend le signal — le message saute de colline en colline, plus
          vite qu'aucun cheval */}
      {made.includes("msg_chappe") && (
        <g transform="translate(812,232)" style={{ animation: "fadein 1s ease-out" }}>
          <rect x="-6" y="0" width="12" height="36" fill="#4a5260" opacity="0.85" />
          <rect x="-9" y="-6" width="18" height="8" fill="#3e4652" opacity="0.85" />
          <path d="M0 -6 v-24" stroke="#2e3540" strokeWidth="3" />
          <path d="M0 -26 l-16 -8" stroke="#2e3540" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M0 -22 l14 10" stroke="#2e3540" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="0" cy="-30" r="3" fill="#ffe9a0" style={{ animation: "glow 1.6s ease-in-out infinite" }} />
        </g>
      )}

      {/* voile de grain global */}
      <rect width="1000" height="560" fill="#201810" opacity="0.06" style={{ pointerEvents: "none" }} />

      {/* zones cliquables */}
      {/* le « ? » de l'opérateur (tant qu'il guide : télégraphier Condé) */}
      {queteQui === "operateur" && (
        <>
          <g transform="translate(372,356)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
          </g>
          <Hotspot cx={392} cy={366} r={26} label="parler à l'opérateur" reveal={reveal} onClick={() => action("operateur")} />
        </>
      )}
      {/* le « ? » de Volta (quand il guide : fabriquer la pile) */}
      {queteQui === "volta" && (
        <>
          <g transform="translate(578,356)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
          </g>
          <Hotspot cx={598} cy={452} r={26} label="parler à Volta" reveal={reveal} onClick={() => action("volta")} />
        </>
      )}

      <Hotspot cx={480} cy={190} r={80} label="bras articulés" item="bras" reveal={reveal} onClick={() => collect("bras")} />
      <Hotspot cx={392} cy={452} r={38} label="longue-vue" item="longuevue" reveal={reveal} onClick={() => collect("longuevue")} />
      <Hotspot cx={240} cy={494} r={40} label="cahier de codes" item="cahier" reveal={reveal} onClick={() => collect("cahier")} />
      <Hotspot cx={644} cy={496} r={30} label="zinc & cuivre" item="zinc_cuivre" reveal={reveal} onClick={() => collect("zinc_cuivre")} />
      <Hotspot cx={700} cy={500} r={26} label="saumure" item="saumure" reveal={reveal} onClick={() => collect("saumure")} />
      <Hotspot cx={880} cy={486} r={44} label="l'espion" item="espion" reveal={reveal} onClick={() => collect("espion")} />
</svg>
  );
}
