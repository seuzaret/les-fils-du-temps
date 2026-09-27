import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";

/* ============================================================
   CHAPITRE 9 (XXIe) — Tableau : Ta chambre, aujourd'hui.
   Chambre d'ado moderne : lumieres LED RGB, posters (Minecraft,
   K-Pop, 67), lit tout au fond, gros setup GAMER au premier plan
   (PC tour vitree + ventilos RGB, ecran incurve, clavier
   mecanique, souris RGB, siege bucket).
   L'enchainement d'objets a assembler reste :
     - Memoire flash + Poche (jean)     -> cle USB
     - Ecran tactile + Reseau mobile    -> smartphone
     - Disquette + PC moderne           -> MESSAGE PERDU
     - Photos d'enfance (tablette)      -> pour le datacenter
   ============================================================ */

export default function SceneChambre({ collect, action, reveal, made = [], inv = [], mode }) {
  const appelFait = made.includes("msg_appel");
  const mobileFait = made.includes("msg_mobile");
  const smartFait = made.includes("msg_smartphone");
  const telPris   = made.includes("telephone");
  const dead   = made.includes("msg_disquette");
  const compte = made.includes("msg_compte");
  /* On masque le téléphone à cadran une fois qu'il a servi aux 3 recettes (appel, mobile, smartphone) */
  const telUsed = appelFait && mobileFait && smartFait;

  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ch-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a1830" /><stop offset="100%" stopColor="#0a0a1c" /></linearGradient>
        <linearGradient id="ch-win"  x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#141c34" /><stop offset="100%" stopColor="#3a4a68" /></linearGradient>
        <linearGradient id="ch-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2a1e18" /><stop offset="100%" stopColor="#100a08" /></linearGradient>
        <linearGradient id="ch-desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#161624" /><stop offset="100%" stopColor="#050510" /></linearGradient>
        <linearGradient id="ch-tower" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2a2a3a" /><stop offset="100%" stopColor="#0a0a12" /></linearGradient>
        <radialGradient id="ch-scr"  cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#7fd8ff" stopOpacity="0.35" /><stop offset="100%" stopColor="#7fd8ff" stopOpacity="0" /></radialGradient>
        <radialGradient id="ch-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.65" /><stop offset="100%" stopColor="#ffe9a8" stopOpacity="0" /></radialGradient>
        <radialGradient id="ch-magenta" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ff4aa0" stopOpacity="0.35" /><stop offset="100%" stopColor="#ff4aa0" stopOpacity="0" /></radialGradient>
        <radialGradient id="ch-cyan"    cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#4ae0ff" stopOpacity="0.35" /><stop offset="100%" stopColor="#4ae0ff" stopOpacity="0" /></radialGradient>
        <filter id="ch-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <clipPath id="ch-winclip"><rect x="-56" y="-56" width="112" height="112" /></clipPath>
      </defs>

      {/* ═══ mur sombre + grain ═══ */}
      <rect width="1000" height="560" fill="url(#ch-wall)" />
      <rect width="1000" height="560" fill="#050510" opacity="0.24" filter="url(#ch-grain)" />

      {/* HALOS ambiants des LEDs RGB : deux nappes qui bougent en couleur */}
      <ellipse cx="220" cy="180" rx="260" ry="180" fill="url(#ch-magenta)">
        <animate attributeName="opacity" values="0.7;0.35;0.7" dur="6s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="720" cy="200" rx="280" ry="200" fill="url(#ch-cyan)">
        <animate attributeName="opacity" values="0.35;0.75;0.35" dur="6s" repeatCount="indefinite" />
      </ellipse>

      {/* BANDEAU LED RGB en haut du mur : degrade qui defile */}
      <g>
        <rect x="0" y="14" width="1000" height="8" fill="#4ae0ff">
          <animate attributeName="fill" dur="8s" repeatCount="indefinite"
            values="#4ae0ff; #ff4aa0; #7fe0a8; #ffd166; #a840f0; #4ae0ff" />
        </rect>
        {/* LEDs individuelles qui clignotent chacune a un tempo */}
        {[...Array(28)].map((_, i) => (
          <circle key={i} cx={20 + i * 35} cy="18" r="2.4" fill="#ffffff">
            <animate attributeName="opacity"
              values="0.3;1;0.4;0.9;0.3"
              dur={`${1.2 + (i % 4) * 0.5}s`}
              begin={`${(i * 0.07) % 2}s`}
              repeatCount="indefinite" />
          </circle>
        ))}
      </g>

      {/* BANDEAU LED lateral droit (colle au bord de la fenetre) */}
      <rect x="990" y="30" width="6" height="380" fill="#a840f0">
        <animate attributeName="fill" dur="10s" repeatCount="indefinite"
          values="#a840f0; #4ae0ff; #ffd166; #ff4aa0; #a840f0" />
      </rect>

      {/* ═══ couche lointaine : la fenetre + les POSTERS ═══ */}
      <PLayer depth={1}>
        {/* POSTER MINECRAFT (bloc de terre pixelise) */}
        <g transform="translate(340,110)">
          <rect x="-40" y="-56" width="80" height="112" rx="2" fill="#0a0a10" stroke="#8ac86a" strokeWidth="2" />
          {/* fond ciel Minecraft */}
          <rect x="-38" y="-54" width="76" height="72" fill="#7fbbe0" />
          {/* soleil carre */}
          <rect x="14" y="-48" width="14" height="14" fill="#ffe08a" />
          {/* bloc de terre au sol */}
          {[...Array(6)].map((_, r) => [...Array(6)].map((_, c) => {
            const shades = r < 2 ? ["#7fbb4a","#6aa03e","#8ac860","#5a8830","#7fbb4a","#6aa03e"]
                                 : ["#8a5828","#a06840","#7a4820","#a06840","#8a5828","#6a3818"];
            return <rect key={`${r}-${c}`} x={-38 + c * 13} y={18 + r * 6} width="13" height="6" fill={shades[c]} stroke="#3a2010" strokeWidth="0.3" />;
          }))}
          <text x="0" y="52" textAnchor="middle" fontFamily="ui-monospace,monospace" fontWeight="800" fontSize="9" fill="#8ac86a" letterSpacing="2">MINECRAFT</text>
        </g>

        {/* POSTER K-POP (silhouettes + coeur/paillettes) */}
        <g transform="translate(500,110)">
          <rect x="-40" y="-56" width="80" height="112" rx="2" fill="#f8c8e0" stroke="#a840f0" strokeWidth="2" />
          {/* gradient de fond magenta pastel */}
          <rect x="-38" y="-54" width="76" height="90" fill="#f8c8e0" />
          {/* silhouettes du groupe */}
          {[-24, -12, 0, 12, 24].map((x, i) => (
            <g key={i} transform={`translate(${x},0)`}>
              <circle cx="0" cy="-14" r="5" fill="#5a2058" />
              <path d="M-5 -8 L5 -8 L4 18 L-4 18 Z" fill={["#a840f0","#f870b0","#a840f0","#f870b0","#a840f0"][i]} />
            </g>
          ))}
          {/* coeurs pailletes */}
          <path d="M-28 -40 q-3 -6 -6 -2 q-3 -4 -6 2 q0 4 6 8 q6 -4 6 -8 Z" fill="#ff4aa0" />
          <path d="M28 -30 q-3 -6 -6 -2 q-3 -4 -6 2 q0 4 6 8 q6 -4 6 -8 Z" fill="#ff4aa0" opacity="0.85" />
          {/* etoiles */}
          {[[-30,-10],[26,20],[-14,-46],[16,-38]].map(([x,y],i) => (
            <path key={i} d={`M${x} ${y} l1.4 3 l3 0 l-2.4 2 l1 3 l-3 -1.8 l-3 1.8 l1 -3 l-2.4 -2 l3 0 Z`} fill="#ffe08a" />
          ))}
          <text x="0" y="50" textAnchor="middle" fontFamily="Impact, 'Arial Black', sans-serif" fontWeight="900" fontSize="14" fill="#a840f0" letterSpacing="2">K-POP</text>
        </g>

        {/* POSTER 67 (rap french touch) */}
        <g transform="translate(660,110)">
          <rect x="-40" y="-56" width="80" height="112" rx="2" fill="#0a0a0a" stroke="#c8963e" strokeWidth="2" />
          {/* fond degrade sombre */}
          <rect x="-38" y="-54" width="76" height="108" fill="#0a0a0a" />
          {/* rayons dores */}
          {[-40,-20,0,20,40].map((a,i) => (
            <path key={i} d={`M0 20 L${a * 1.2} -50`} stroke="#c8963e" strokeWidth="0.6" opacity="0.4" />
          ))}
          {/* le "67" en gros */}
          <text x="0" y="10" textAnchor="middle" fontFamily="Impact, 'Arial Black', sans-serif" fontSize="60" fontWeight="900" fill="#c8963e" letterSpacing="-4">67</text>
          <text x="0" y="10" textAnchor="middle" fontFamily="Impact, 'Arial Black', sans-serif" fontSize="60" fontWeight="900" fill="none" stroke="#f8d838" strokeWidth="1" letterSpacing="-4">67</text>
          {/* tag / signature */}
          <text x="0" y="38" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill="#c8963e" letterSpacing="3">EN CE MOMENT</text>
        </g>

        {/* FENETRE + antenne 5G (RESEAU MOBILE) */}
        <g transform="translate(830,158)">
          <rect x="-58" y="-58" width="116" height="116" fill="url(#ch-win)" />
          <g clipPath="url(#ch-winclip)">
            {/* ville la nuit */}
            <path d="M-56 44 L-56 6 L-36 6 L-36 26 L-14 26 L-14 -4 L10 -4 L10 22 L34 22 L34 2 L56 2 L56 44 Z" fill="#151b2c" />
            {[[-48, 14], [-28, 34], [-6, 6], [18, 30], [42, 12], [-44, 30], [24, 8]].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width="4" height="4" fill="#ffd166" opacity="0.85">
                <animate attributeName="opacity" values="0.6;1;0.6" dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
              </rect>
            ))}
            {/* antenne 5G */}
            <g transform="translate(20,-16)">
              <path d="M-3 26 L-7 -22 L7 -22 L3 26 Z" fill="#2a3040" />
              {[-1, 1].map((s, i) => <rect key={i} x={s * 7 - 2} y="-24" width="4" height="11" rx="1" fill="#4a5060" />)}
              <g fill="none" stroke="#7fd8ff">
                {[10, 18, 26].map((r, i) => (
                  <g key={i}>
                    <animate attributeName="opacity" values="0.9;0.1;0.9" dur="1.8s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                    <path d={`M${r * 0.6} -${r * 0.5 + 22} A${r} ${r} 0 0 1 ${r * 0.6} ${r * 0.5 - 22}`} strokeWidth="1.8" />
                    <path d={`M-${r * 0.6} -${r * 0.5 + 22} A${r} ${r} 0 0 0 -${r * 0.6} ${r * 0.5 - 22}`} strokeWidth="1.8" />
                  </g>
                ))}
              </g>
            </g>
            {/* drone */}
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="-60,0; 60,-6; -60,0" dur="18s" repeatCount="indefinite" />
              <g transform="translate(0,-10)">
                <rect x="-6" y="-2" width="12" height="4" rx="0.8" fill="#0a0e18" stroke="#5a6a80" strokeWidth="0.5" />
                <path d="M-8 -1 h4 M4 -1 h4 M-8 1 h4 M4 1 h4" stroke="#8a94a8" strokeWidth="0.6" />
                <circle cx="0" cy="0" r="1.4" fill="#e83820">
                  <animate attributeName="opacity" values="0.2;1;0.2" dur="0.9s" repeatCount="indefinite" />
                </circle>
              </g>
            </g>
          </g>
          <rect x="-58" y="-58" width="116" height="116" fill="none" stroke="#2a3040" strokeWidth="7" />
          <path d="M0 -58 v116 M-58 0 h116" stroke="#2a3040" strokeWidth="3.5" />
        </g>
      </PLayer>

      {/* ═══ SOL + BUREAU GAMER + ADO + PC TOUR ═══ */}
      <PLayer depth={3}>
        <rect y="408" width="1000" height="152" fill="url(#ch-floor)" />
        <rect y="410" width="1000" height="150" fill="#050510" opacity="0.34" filter="url(#ch-grain)" />
        {/* bandes du plancher */}
        <path d="M0 452 h1000 M0 504 h1000 M180 408 v152 M540 408 v152 M840 408 v152" stroke="#180c08" strokeWidth="1.4" opacity="0.5" />

        {/* LIT pose au sol, cote GAUCHE. Un JEAN plie traine dessus. */}
        <g transform="translate(140,470) scale(1)">
          {/* tete de lit */}
          <rect x="-92" y="-48" width="184" height="14" rx="3" fill="#3a3a4a" />
          {/* matelas + couette */}
          <rect x="-90" y="-34" width="180" height="44" rx="4" fill="#3a4a6a" />
          <rect x="-90" y="-34" width="180" height="44" rx="4" fill="#101828" opacity="0.24" filter="url(#ch-grain)" />
          {/* oreiller */}
          <rect x="-82" y="-28" width="60" height="22" rx="4" fill="#e8e4da" opacity="0.9" />
          {/* couverture froissee au pied */}
          <path d="M-32 -20 q22 -6 48 4 q28 8 46 -4 v34 h-94 Z" fill="#5a2a3e" />

          {/* JEAN plie sur le lit — pantalon plie avec 2 jambes visibles (décoratif) */}
          <g transform="translate(10,-6)">
            <path d="M-40 12 Q0 22 40 12 L40 16 Q0 26 -40 16 Z" fill="#050510" opacity="0.35" />
            <rect x="-28" y="-10" width="56" height="6" rx="1.5" fill="#4a6ea0" />
            <rect x="-24" y="-9" width="6" height="4" fill="#3a5a88" />
            {[-16, -8, 0, 8, 16].map((x, i) => <rect key={i} x={x - 1} y="-9" width="2" height="4" fill="#8ac0e8" opacity="0.6" />)}
            <path d="M-28 -4 L28 -4 L26 6 L16 6 L14 20 L4 20 L2 6 L-2 6 L-4 20 L-14 20 L-16 6 L-26 6 Z" fill="#3a5a8a" stroke="#1a3060" strokeWidth="1" />
            <path d="M-28 -4 L28 -4 L26 6 L16 6 L14 20 L4 20 L2 6 L-2 6 L-4 20 L-14 20 L-16 6 L-26 6 Z" fill="#101828" opacity="0.2" filter="url(#ch-grain)" />
            <path d="M0 -4 v10" stroke="#7fa8d8" strokeWidth="0.6" strokeDasharray="1.2 1.2" />
            <path d="M-22 -2 q14 -2 16 6 l-2 3 q-8 -4 -14 -3 Z" fill="none" stroke="#7fa8d8" strokeWidth="1.6" />
            <path d="M22 -2 q-14 -2 -16 6 l2 3 q8 -4 14 -3 Z" fill="none" stroke="#7fa8d8" strokeWidth="1.2" opacity="0.7" />
            <path d="M-22 -2 q14 -2 16 6" stroke="#a8ccec" strokeWidth="0.6" strokeDasharray="1 1" fill="none" />
            <rect x="14" y="-8" width="6" height="4" rx="0.4" fill="#8a5828" stroke="#3a1a08" strokeWidth="0.3" />
          </g>

          {/* pieds */}
          <rect x="-86" y="10" width="10" height="24" fill="#1a1a20" />
          <rect x="76"  y="10" width="10" height="24" fill="#1a1a20" />
        </g>

        {/* GRAND BUREAU GAMER noir : raccourci a gauche pour laisser voir le lit */}
        <g transform="translate(500,432)">
          <rect x="-240" y="0" width="560" height="16" rx="3" fill="url(#ch-desk)" />
          {/* eclairage RGB sous le bureau */}
          <rect x="-240" y="16" width="560" height="3" fill="#ff4aa0">
            <animate attributeName="fill" dur="7s" repeatCount="indefinite"
              values="#ff4aa0; #4ae0ff; #a840f0; #7fe0a8; #ff4aa0" />
          </rect>
          {/* pieds fins metal */}
          <rect x="-236" y="19" width="8" height="72" fill="#0a0a10" />
          <rect x="308"  y="19" width="8" height="72" fill="#0a0a10" />
        </g>

        {/* PC TOUR GAMER a DROITE du bureau, avec panneau vitre et
            3 ventilos RGB qui tournent. */}
        <g transform="translate(880,342)">
          {/* halo RGB autour de la tour — cadre a l'interieur de la tour */}
          <ellipse cx="0" cy="75" rx="42" ry="75" fill="url(#ch-magenta)" opacity="0.6">
            <animate attributeName="opacity" values="0.35;0.7;0.35" dur="5s" repeatCount="indefinite" />
          </ellipse>
          {/* liseret LED sur les 4 aretes visibles de la tour */}
          <rect x="-42" y="0" width="84" height="150" rx="2" fill="none" strokeWidth="2" stroke="#4ae0ff">
            <animate attributeName="stroke" dur="8s" repeatCount="indefinite"
              values="#4ae0ff; #ff4aa0; #a840f0; #7fe0a8; #ffd166; #4ae0ff" />
          </rect>
          <rect x="-42" y="0" width="84" height="150" rx="2" fill="url(#ch-tower)" stroke="#2a2a3a" strokeWidth="2" />
          {/* fenetre vitree */}
          <rect x="-34" y="8" width="68" height="130" rx="2" fill="#0a0a16" stroke="#3a3a52" strokeWidth="1.4" />
          {/* 3 ventilos RGB, alignes A L'INTERIEUR de la tour vitree */}
          {[36, 76, 116].map((cy, i) => (
            <g key={i} transform={`translate(0,${cy})`}>
              {/* cadre du ventilateur */}
              <rect x="-24" y="-14" width="48" height="28" rx="4" fill="#050510" stroke="#3a3a52" strokeWidth="0.6" />
              {/* halo colore */}
              <circle r="14" fill="#7fe0ff" opacity="0.25">
                <animate attributeName="fill" dur={`${4 + i}s`} repeatCount="indefinite"
                  values={["#7fe0ff;#ff4aa0;#7fe0ff", "#a840f0;#7fe0a8;#a840f0", "#ffd166;#4ae0ff;#ffd166"][i]} />
              </circle>
              {/* pales qui tournent */}
              <g>
                <animateTransform attributeName="transform" type="rotate"
                  values={`0; ${360 * (i % 2 ? 1 : -1)}`}
                  dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
                {[0, 90, 180, 270].map((a, k) => (
                  <path key={k} d="M0 -12 q3 6 -1 12 q-2 -8 1 -12 Z" fill="#2a2a3a" transform={`rotate(${a})`} />
                ))}
                <circle r="4" fill="#3a3a52" stroke="#0a0a10" strokeWidth="0.6" />
              </g>
              {/* liseret RGB autour du ventilo */}
              <circle r="13" fill="none" strokeWidth="1.4" stroke="#ff4aa0">
                <animate attributeName="stroke" dur={`${5 + i}s`} repeatCount="indefinite"
                  values={["#ff4aa0;#4ae0ff;#ff4aa0", "#a840f0;#ffd166;#a840f0", "#7fe0a8;#ff4aa0;#7fe0a8"][i]} />
              </circle>
            </g>
          ))}
          {/* bouton power avec LED */}
          <circle cx="0" cy="146" r="3" fill="#2a2a3a" />
          <circle cx="0" cy="146" r="1.4" fill="#5eff9e">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* ECRAN GAMER ULTRAWIDE incurve, dresse sur le bureau */}
        <g transform="translate(560,340)">
          {/* pied */}
          <rect x="-6" y="88" width="12" height="10" fill="#1a1a24" />
          <path d="M-40 98 L40 98 L36 104 L-36 104 Z" fill="#0a0a12" />
          {/* dos + LED RGB derriere */}
          <g>
            <path d="M-180 -60 Q0 -70 180 -60 L180 88 L-180 88 Z" fill="#0a0a12" stroke="#2a2a3a" strokeWidth="2" />
            {/* halo RGB derriere l'ecran */}
            <ellipse cx="0" cy="14" rx="200" ry="80" fill="url(#ch-scr)" style={{ animation: "glow 4s ease-in-out infinite" }} />
          </g>
          {/* dalle avec un jeu qui tourne (perspective incurvee) */}
          <path d="M-172 -50 Q0 -60 172 -50 L172 80 L-172 80 Z" fill={dead ? "#2a1418" : "#0e1a2a"} />
          {dead ? (
            <g fontFamily="ui-monospace,monospace">
              <text x="0" y="-16" textAnchor="middle" fontSize="20" fontWeight="800" fill="#ff6a4a">⚠ ERREUR</text>
              <text x="0" y="6"   textAnchor="middle" fontSize="12" fill="#ff9a8a">Périphérique inconnu</text>
              <text x="0" y="24"  textAnchor="middle" fontSize="12" fill="#ff9a8a">Format illisible : disquette 3½"</text>
              <rect x="-70" y="34" width="140" height="8" rx="1" fill="#5a2a2a" />
              <text x="0" y="60" textAnchor="middle" fontSize="9" fill="#c88080">OK</text>
            </g>
          ) : (
            <g>
              {/* HUD de jeu factice : mini-map + vie + kills */}
              <rect x="-160" y="-42" width="60" height="34" fill="#050510" stroke="#4ae0ff" strokeWidth="0.8" />
              <text x="-155" y="-32" fontFamily="ui-monospace,monospace" fontSize="6" fill="#4ae0ff">MAP</text>
              {/* barre de vie */}
              <rect x="-90" y="-40" width="80" height="8" fill="#3a0a10" />
              <rect x="-90" y="-40" width="52" height="8" fill="#e83820">
                <animate attributeName="width" values="52;44;52;38;52" dur="6s" repeatCount="indefinite" />
              </rect>
              <text x="-88" y="-33" fontFamily="ui-monospace,monospace" fontSize="6" fill="#ffe0d0">HP</text>
              {/* silhouette de perso en pixels */}
              <g transform="translate(0,20)">
                <rect x="-6" y="-14" width="12" height="8" fill="#7fe0a8" />
                <rect x="-8" y="-6"  width="16" height="14" fill="#4a90c8" />
                <rect x="-6" y="8"   width="4" height="10" fill="#2a1810" />
                <rect x="2"  y="8"   width="4" height="10" fill="#2a1810" />
              </g>
              {/* particules d'action */}
              {[[-40,10],[52,-4],[70,30],[-90,20],[110,10]].map(([x,y],i) => (
                <circle key={i} cx={x} cy={y} r={1.6} fill="#ffe08a">
                  <animate attributeName="opacity" values="0.2;1;0.2" dur={`${1 + (i % 3) * 0.4}s`} repeatCount="indefinite" />
                </circle>
              ))}
              {/* kills / score */}
              <text x="150" y="-32" textAnchor="end" fontFamily="ui-monospace,monospace" fontSize="8" fill="#7fe0a8">KILLS 12</text>
              <text x="150" y="-20" textAnchor="end" fontFamily="ui-monospace,monospace" fontSize="8" fill="#ffd166">SCORE 8420</text>
            </g>
          )}
        </g>

        {/* CLAVIER mecanique RGB devant l'ecran */}
        <g transform="translate(560,420)">
          <rect x="-96" y="-6" width="192" height="14" rx="2" fill="#0a0a12" stroke="#2a2a3a" strokeWidth="1" />
          {/* touches */}
          {[...Array(14)].map((_, c) => [...Array(3)].map((_, r) => (
            <rect key={`k-${c}-${r}`} x={-92 + c * 13} y={-4 + r * 4.5} width="10" height="3.4" rx="0.4" fill="#1a1a22" />
          )))}
          {/* eclairage RGB sous le clavier */}
          {[...Array(14)].map((_, c) => (
            <rect key={`led-${c}`} x={-92 + c * 13} y={8} width="10" height="1" fill="#4ae0ff">
              <animate attributeName="fill" dur={`${3 + c * 0.15}s`} repeatCount="indefinite"
                values="#4ae0ff;#ff4aa0;#a840f0;#7fe0a8;#ffd166;#4ae0ff" />
            </rect>
          ))}
        </g>

        {/* SOURIS gamer RGB, tapis assorti */}
        <g transform="translate(700,420)">
          <rect x="-30" y="-2" width="80" height="10" rx="2" fill="#050510" stroke="#4ae0ff" strokeWidth="0.6" />
          <path d="M0 -6 Q6 -14 14 -6 Q16 6 8 8 L-4 8 Q-8 4 -6 -2 Z" fill="#1a1a24" stroke="#3a3a52" strokeWidth="0.8" />
          <path d="M2 -4 v6" stroke="#4ae0ff" strokeWidth="0.6" />
          <circle cx="4" cy="6" r="1" fill="#ff4aa0">
            <animate attributeName="fill" dur="4s" repeatCount="indefinite" values="#ff4aa0;#4ae0ff;#7fe0a8;#ff4aa0" />
          </circle>
        </g>

        {/* SIEGE GAMER derriere le bureau + L'ADO assis */}
        <g transform="translate(560,470)">
          {/* base 5 branches + verin */}
          <ellipse cx="0" cy="86" rx="52" ry="6" fill="#050510" />
          <rect x="-3" y="30" width="6" height="60" fill="#2a2a3a" />
          {/* accoudoirs */}
          <rect x="-46" y="6" width="10" height="30" fill="#1a1a22" />
          <rect x="36"  y="6" width="10" height="30" fill="#1a1a22" />
          {/* dossier haut bucket-seat */}
          <path d="M-42 30 Q-46 -60 0 -68 Q46 -60 42 30 Z" fill="#151520" stroke="#2a2a3a" strokeWidth="1.4" />
          {/* liseret RGB sur les cotes du dossier */}
          <path d="M-40 -50 Q-42 -6 -40 26" stroke="#ff4aa0" strokeWidth="1.6" fill="none">
            <animate attributeName="stroke" dur="7s" repeatCount="indefinite" values="#ff4aa0;#4ae0ff;#a840f0;#ff4aa0" />
          </path>
          <path d="M40 -50 Q42 -6 40 26" stroke="#4ae0ff" strokeWidth="1.6" fill="none">
            <animate attributeName="stroke" dur="7s" repeatCount="indefinite" values="#4ae0ff;#ff4aa0;#7fe0a8;#4ae0ff" />
          </path>
          {/* assise */}
          <path d="M-40 30 L40 30 L34 46 L-34 46 Z" fill="#1a1a22" />

          {/* L'ADO assis */}
          <g transform="translate(0,-4)">
            {/* torse — sweat colore avec LED reflet */}
            <path d="M-20 24 Q-22 -20 0 -26 Q22 -20 20 24 Z" fill="#2a2038" />
            <path d="M-20 24 Q-22 -20 0 -26 Q22 -20 20 24 Z" fill="#050510" opacity="0.24" filter="url(#ch-grain)" />
            {/* capuche */}
            <path d="M-18 -14 Q-14 -30 0 -30 Q14 -30 18 -14" stroke="#1a1420" strokeWidth="4" fill="none" />
            {/* tête */}
            <circle cx="0" cy="-38" r="11" fill="#e0b090" />
            {/* casque gamer RGB */}
            <path d="M-11 -40 a11 11 0 0 1 22 0" stroke="#3a3a52" strokeWidth="3" fill="none" />
            <ellipse cx="-11" cy="-38" rx="3.4" ry="4.4" fill="#151520" stroke="#ff4aa0" strokeWidth="0.8">
              <animate attributeName="stroke" dur="5s" repeatCount="indefinite" values="#ff4aa0;#4ae0ff;#7fe0a8;#ff4aa0" />
            </ellipse>
            <ellipse cx="11" cy="-38"  rx="3.4" ry="4.4" fill="#151520" stroke="#4ae0ff" strokeWidth="0.8">
              <animate attributeName="stroke" dur="5s" repeatCount="indefinite" values="#4ae0ff;#ff4aa0;#a840f0;#4ae0ff" />
            </ellipse>
            {/* micro rabattable */}
            <path d="M-11 -35 q-8 4 -8 12" stroke="#3a3a52" strokeWidth="1.4" fill="none" />
            <circle cx="-19" cy="-23" r="1.6" fill="#0a0a12" />
            {/* petits yeux visibles */}
            <circle cx="-3" cy="-38" r="1.2" fill="#0a0a12" />
            <circle cx="3"  cy="-38" r="1.2" fill="#0a0a12" />
          </g>
        </g>

        {/* --- PIECES A RAMASSER SUR LE BUREAU (bien devant l'ecran) --- */}

        {/* TÉLÉPHONE À CADRAN posé sur le bureau, côté gauche — héritage 80s */}
        {!inv.includes("telephone") && !telUsed && (
          <g transform="translate(320,414)">
            {/* base bakélite */}
            <path d="M-24 6 Q-26 -4 -18 -12 L18 -12 Q26 -4 24 6 Z" fill="#1a1408" stroke="#3a2418" strokeWidth="1" />
            {/* combiné posé dessus */}
            <path d="M-18 -14 Q-22 -18 -18 -20 L-12 -20 Q-8 -18 -8 -14 L8 -14 Q8 -18 12 -20 L18 -20 Q22 -18 18 -14 Z" fill="#3a2818" stroke="#5a3818" strokeWidth="1" />
            {/* cadran rotatif */}
            <circle cx="0" cy="-4" r="8" fill="#c8b898" stroke="#3a2818" strokeWidth="0.8" />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
              const a = (n * 36 - 90) * Math.PI / 180;
              return <circle key={n} cx={Math.cos(a) * 5.6} cy={-4 + Math.sin(a) * 5.6} r="0.7" fill="#3a2818" />;
            })}
            <circle cx="0" cy="-4" r="1.8" fill="#3a2818" />
            {/* fil qui s'échappe vers la prise */}
            <path d="M-24 -2 Q-40 6 -60 20" stroke="#3a2818" strokeWidth="1.4" fill="none" opacity="0.75" />
            <path d="M-30 -1 Q-46 8 -66 22" stroke="#5a3818" strokeWidth="0.5" fill="none" opacity="0.5" />
            {/* halo doux */}
            <ellipse cx="0" cy="0" rx="30" ry="8" fill="#c8a878" opacity="0.15" />
          </g>
        )}

        {/* PRISE MURALE côté gauche du bureau — support (recette) */}
        {!appelFait && (
          <g transform="translate(240,436)">
            {/* platine blanche */}
            <rect x="-14" y="-12" width="28" height="24" rx="3" fill="#e8e4d8" stroke="#3a3a3a" strokeWidth="0.6" />
            {/* petits trous style prise T */}
            <circle cx="-4" cy="-2" r="1.6" fill="#1a1a1a" />
            <circle cx="4" cy="-2" r="1.6" fill="#1a1a1a" />
            <rect x="-1.2" y="4" width="2.4" height="4" fill="#1a1a1a" />
            {/* signal RJ11 pour montrer que c'est la prise du tel */}
            <text x="0" y="-18" textAnchor="middle" fontSize="6" fontFamily="ui-monospace,monospace" fill="#8a5828">RJ11</text>
          </g>
        )}

        {/* Après le smartphone : révélation « tous les médias dans une main » sur l'écran gamer */}
        {smartFait && (
          <g transform="translate(410,410)" style={{ animation: "pulse 0.7s ease-out 2" }}>
            <ellipse cx="0" cy="4" rx="80" ry="52" fill="url(#ch-glow)" />
            <rect x="-22" y="-30" width="44" height="60" rx="6" fill="#1c2028" />
            <rect x="-19" y="-26" width="38" height="52" rx="4" fill="#0e1420" />
            {["📷", "📻", "📺", "🎞️", "📰", "✉️", "📚", "🎵", "☎️"].map((e, i) => (
              <text key={i} x={-13 + (i % 3) * 12} y={-15 + Math.floor(i / 3) * 15} fontSize="9" textAnchor="middle">{e}</text>
            ))}
            <rect x="-8" y="24" width="16" height="2" rx="1" fill="#5a6070" />
          </g>
        )}

        {/* TABLETTE posee sur le bureau, cote droit : contient les photos */}
        {!compte && (
          <g transform="translate(760,414)">
            <rect x="-28" y="-20" width="56" height="42" rx="3" fill="#2a2e3a" />
            <rect x="-25" y="-17" width="50" height="36" rx="2" fill="#dfe8f2" />
            {[...Array(6)].map((_, i) => (
              <rect key={i} x={-22 + (i % 3) * 16} y={-14 + Math.floor(i / 3) * 17} width="14" height="15" rx="1"
                fill={["#c8a882", "#8ab0c8", "#c8c07a", "#b08a9a", "#8ac8a0", "#c88a6a"][i]} />
            ))}
          </g>
        )}

        {/* epave de MARTINE au sol devant la tour */}
        <g transform="translate(870,516) rotate(-7)">
          <ellipse cx="0" cy="12" rx="26" ry="6" fill="#0a0603" opacity="0.6" />
          <path d="M0 -20 Q18 -18 20 -4 Q22 8 11 11 L-11 11 Q-22 8 -20 -4 Q-18 -18 0 -20 Z" fill="#8a6240" />
          <circle cx="-1" cy="-4" r="5.5" fill="#cfeaff" stroke="#5c3a22" strokeWidth="1.4" />
          <rect x="-13" y="3" width="24" height="7" rx="2" fill="#0c1410" stroke="#5c3a22" strokeWidth="1" />
          <text x="-1" y="9" textAnchor="middle" fontSize="4.6" fill="#5eff9e" fontFamily="ui-monospace,monospace" style={{ animation: "pulse 2.2s infinite" }}>2026</text>
          <circle cx="13" cy="-27" r="2.3" fill="#5eff9e" style={{ animation: "pulse 1.5s infinite" }} />
          <path d="M8 -20 q6 -8 13 -6" stroke="#8a94a8" strokeWidth="2.3" fill="none" strokeLinecap="round" />
        </g>

        {/* ANACHRONISME DU FUTUR : le NEURO-LIEN sur le tapis */}
        {!made.includes("neurolien") && mode !== "jeu2" && (
          <g transform="translate(120,510)">
            <circle r={38} fill="#a840c0" opacity="0.25" style={{ animation: "pulse 2s infinite" }} />
            <circle r={24} fill="#7fe0ff" opacity="0.35" style={{ animation: "pulse 2s infinite" }} />
            <ellipse cx={0} cy={2} rx={20} ry={6} fill="#c8a8e0" stroke="#7fe0ff" strokeWidth="1.5" opacity="0.9" />
            <ellipse cx={0} cy={0} rx={16} ry={5} fill="#e0c8f0" opacity="0.85" />
            {[[-11, 0], [-4, -2], [4, 0], [11, -2]].map(([nx, ny], i) => <circle key={i} cx={nx} cy={ny} r={1.6} fill="#3a1a58" />)}
            <path d="M-11 0 L-4 -2 L4 0 L11 -2" stroke="#5a2088" strokeWidth="1" fill="none" />
            <text x={0} y={4} textAnchor="middle" fontSize="4" fontFamily="ui-monospace,monospace" fontWeight="800" fill="#3a1a58">NL™</text>
          </g>
        )}
      </PLayer>

      <rect width="1000" height="560" fill="#0c0e1a" opacity="0.06" style={{ pointerEvents: "none" }} />

      {/* ═══ zones cliquables ═══ */}
      <Hotspot cx={560} cy={430} r={54} label="toi (gaming)" reveal={reveal} onClick={() => action("ado")} />

      {/* Le TÉLÉPHONE À CADRAN — objet ramassable qui sert dans 3 recettes */}
      {!inv.includes("telephone") && !telUsed && (
        <Hotspot cx={320} cy={414} r={28} label="vieux téléphone à cadran" item="telephone" reveal={reveal} onClick={() => collect("telephone")} />
      )}
      {/* La PRISE MURALE — support fixe pour l'appel */}
      {!appelFait && (
        <Hotspot cx={240} cy={436} r={20} label="prise murale du téléphone" item="prise" reveal={reveal} onClick={() => collect("prise")} />
      )}
      {/* L'ANTENNE RELAIS — support fixe pour le mobile */}
      {!mobileFait && (
        <Hotspot cx={850} cy={142} r={44} label="antenne relais 4G/5G" item="antenne" reveal={reveal} onClick={() => collect("antenne")} />
      )}
      {/* L'ORDINATEUR (PC gamer) — support fixe pour le smartphone ET pour tenter la disquette */}
      {(!smartFait || !dead) && (
        <Hotspot cx={560} cy={340} r={90} label="ordinateur — colle un téléphone ou une disquette" item="ordinateur" reveal={reveal} onClick={() => collect("ordinateur")} />
      )}

      {/* la tablette avec les photos */}
      {!compte && (
        <Hotspot cx={760} cy={414} r={28} label="tablette (photos d'enfance)" item="photos_enfance" reveal={reveal} onClick={() => collect("photos_enfance")} />
      )}

      <Hotspot cx={870} cy={512} r={32} label="MARTINE" reveal={reveal} onClick={() => action("wreck")} />
      {mode !== "jeu2" && !made.includes("neurolien") && (
        <Hotspot cx={120} cy={506} r={44} label="… quelque chose de très bizarre" item="neurolien" reveal={reveal} onClick={() => collect("neurolien")} />
      )}
    </svg>
  );
}
