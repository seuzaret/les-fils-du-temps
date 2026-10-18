import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

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
        <linearGradient id="cp-tower" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#b0a488" /><stop offset="50%" stopColor="#8a7e64" /><stop offset="100%" stopColor="#5e5644" /></linearGradient>
        <linearGradient id="cp-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a7c50" /><stop offset="100%" stopColor="#4e4028" /></linearGradient>
        <filter id="cp-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="cp-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7" /></filter>
      </defs>

      {/* ═══ ciel de fin de jour ═══ */}
      <rect width="1000" height="560" fill="url(#cp-sky)" />
      <circle cx="760" cy="200" r="140" fill="url(#cp-sun)" />
      <circle cx="760" cy="200" r="36" fill="#fff0c8" opacity="0.9" />
      <path d="M180 110 q8 -8 16 0 M240 132 q6 -6 12 0" stroke="#3a4452" strokeWidth="2.2" fill="none" opacity="0.5" />

      {/* ═══ couche lointaine : collines + tour du télégraphe à l'horizon ═══ */}
      <PLayer depth={1}>
        <path d="M0 300 L150 250 L320 296 L500 244 L700 300 L860 252 L1000 296 L1000 400 L0 400 Z" fill="url(#cp-hill)" />
        {/* CONDÉ reprise, au loin à gauche : une place forte avec le drapeau
            TRICOLORE hissé, un peu de fumée de canon — l'événement du jour */}
        <g transform="translate(170,268)" opacity="0.9">
          <rect x="-46" y="-14" width="92" height="34" fill="#6a6450" />
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
        <g transform="translate(500,244)" opacity="0.7">
          <rect x="-6" y="-30" width="12" height="30" fill="#3a3a2a" />
          <path d="M0 -30 v-16" stroke="#3a3a2a" strokeWidth="2" />
          <path d="M-16 -46 h32" stroke="#3a3a2a" strokeWidth="3" />
          <path d="M-16 -46 l-6 8 M16 -46 l6 -8" stroke="#3a3a2a" strokeWidth="2.4" />
        </g>
        {/* ligne de brume chaude */}
        <rect y="288" width="1000" height="24" fill="#e8b878" opacity="0.14" filter="url(#cp-blur)" />
      </PLayer>

      {/* ═══ couche intermédiaire : LA TOUR de Chappe + sa cabine ═══ */}
      <PLayer depth={2}>
        <g transform="translate(500,330)">
          {/* fût de maçonnerie */}
          <rect x="-30" y="-110" width="60" height="110" fill="url(#cp-tower)" />
          <rect x="-30" y="-110" width="60" height="110" fill="#2c2618" opacity="0.25" filter="url(#cp-grain)" />
          <path d="M-30 -70 h60 M-30 -36 h60" stroke="#5e5644" strokeWidth="1.4" opacity="0.5" />
          <rect x="-12" y="-40" width="24" height="40" fill="#2c2416" />
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
        {[80, 940].map((x, i) => (
          <path key={i} d={`M${x} 470 q-5 -16 -10 -20 M${x} 470 q0 -18 6 -22 M${x} 470 q6 -14 12 -16`} stroke="#6a6e36" strokeWidth="2.4" fill="none" opacity="0.7" />
        ))}

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
      {/* AMBIANCE : deux nuages qui derivent tres lentement dans le ciel
          (a la place des oiseaux). Vitesse ralentie pour ne pas distraire. */}
      <g opacity="0.7">
        <animateTransform attributeName="transform" type="translate"
          values="-160,0; 1160,20" dur="140s" repeatCount="indefinite" />
        <ellipse cx="0" cy="90" rx="70" ry="12" fill="#f0e8d0" />
        <ellipse cx="30" cy="82" rx="46" ry="10" fill="#f0e8d0" />
        <ellipse cx="-24" cy="86" rx="40" ry="8" fill="#e8dcc0" />
      </g>
      <g opacity="0.6">
        <animateTransform attributeName="transform" type="translate"
          values="-200,0; 1200,-10" dur="180s" begin="30s" repeatCount="indefinite" />
        <ellipse cx="0" cy="150" rx="60" ry="10" fill="#e8dcc0" />
        <ellipse cx="26" cy="144" rx="38" ry="8" fill="#f0e8d0" />
      </g>
</svg>
  );
}
