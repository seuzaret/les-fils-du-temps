import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 6 — Tableau : l'imprimerie en effervescence (départ)
   Peinture fine — atelier animé, jour clair : une presse en
   marche, des cordes de gazettes qui sèchent, des piles de
   feuilles, et le RÉDACTEUR EN CHEF Sigismond près de sa presse.
   On lui APPORTE l'article de Jules → il en fait une gazette.
   ============================================================ */

export default function SceneImprimerie({ collect, action, reveal, made = [], queteQui, mode }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="im-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a7658" /><stop offset="100%" stopColor="#5e4e38" /></linearGradient>
        <linearGradient id="im-win" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7ea0c0" /><stop offset="100%" stopColor="#cdd6c8" /></linearGradient>
        <linearGradient id="im-wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#7a5230" /><stop offset="50%" stopColor="#9a6c40" /><stop offset="100%" stopColor="#5a3f24" /></linearGradient>
        <linearGradient id="im-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9a8058" /><stop offset="100%" stopColor="#544330" /></linearGradient>
        <filter id="im-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="im-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6" /></filter>
        {/* découpe l'intérieur de la fenêtre (pour y voir la ville sans déborder) */}
        <clipPath id="im-winclip"><rect x="-56" y="-86" width="112" height="142" /></clipPath>
      </defs>

      {/* ═══ mur de l'atelier ═══ */}
      <rect width="1000" height="560" fill="url(#im-wall)" />
      <rect width="1000" height="560" fill="#2c2010" opacity="0.26" filter="url(#im-grain)" />

      {/* ═══ couche lointaine : fenêtres, cordes de gazettes ═══ */}
      <PLayer depth={1}>
        {/* deux fenêtres ouvertes sur la VILLE D'ÉPOQUE */}
        {[150, 420].map((x, i) => (
          <g key={i} transform={`translate(${x},170)`}>
            <rect x="-60" y="-90" width="120" height="150" fill="url(#im-win)" />
            {/* la ville vue par la fenêtre (découpée au cadre) */}
            <g clipPath="url(#im-winclip)">
              {/* rangée de façades et de toits pentus */}
              <rect x="-58" y="6" width="30" height="52" fill="#cbb890" />
              <path d="M-60 6 L-43 -20 L-26 6 Z" fill="#6a4a34" />
              <rect x="-26" y="-2" width="30" height="60" fill="#d8c8a0" />
              <path d="M-28 -2 L-11 -34 L6 -2 Z" fill="#54545e" />
              <rect x="6" y="10" width="32" height="48" fill="#c0ac84" />
              <path d="M4 10 L21 -14 L38 10 Z" fill="#6a4a34" />
              <rect x="38" y="2" width="22" height="56" fill="#d0c098" />
              <path d="M36 2 L48 -18 L60 2 Z" fill="#54545e" />
              {/* lucarnes (petites fenêtres de toit) */}
              <path d="M-40 -6 l6 -3 l6 3 v6 h-12 Z" fill="#8a7458" />
              <path d="M14 -2 l6 -3 l6 3 v6 h-12 Z" fill="#8a7458" />
              {/* clocher d'église — plus proéminent dans la 2e fenêtre */}
              {i === 1 && (
                <g>
                  <rect x="20" y="-30" width="15" height="42" fill="#b6aa8c" />
                  <rect x="24" y="-24" width="7" height="9" fill="#3a3a44" />
                  <path d="M18 -30 L27.5 -66 L37 -30 Z" fill="#4a4a56" />
                  <path d="M27.5 -66 v-8" stroke="#3a3a44" strokeWidth="1.4" />
                </g>
              )}
              {/* petites fenêtres sur les façades */}
              {[[-48, 22], [-38, 22], [-18, 16], [-4, 16], [16, 26], [28, 26], [46, 18]].map(([wx, wy], k) => (
                <rect key={k} x={wx} y={wy} width="5" height="8" fill="#3a3a42" />
              ))}
              {/* cheminées qui fument */}
              {[[-34, -16], [-2, -26], [30, -8]].map(([cx, cy], k) => (
                <g key={k}>
                  <rect x={cx} y={cy} width="5" height="13" fill="#8a5a3c" />
                  <path d={`M${cx + 2} ${cy} q-4 -8 2 -15`} stroke="#c8c0b6" strokeWidth="2" fill="none" opacity="0.45" style={{ animation: `drift ${4 + k + i}s ease-in-out infinite` }} />
                </g>
              ))}
            </g>
            {/* cadre + croisillons par-dessus */}
            <rect x="-60" y="-90" width="120" height="150" fill="none" stroke="#3a2a18" strokeWidth="7" />
            <path d="M0 -90 v150 M-60 -15 h120" stroke="#3a2a18" strokeWidth="4" />
          </g>
        ))}
        {/* poutre + cordes à sécher, gazettes suspendues */}
        <path d="M0 120 h1000" stroke="#3a2818" strokeWidth="9" />
        <path d="M560 138 q180 16 420 0" stroke="#5a4630" strokeWidth="2" fill="none" />
        {[600, 670, 740, 810, 880, 950].map((x, i) => (
          <g key={i} transform={`translate(${x},140)`}>
            <rect x="-20" y="0" width="40" height="52" fill="#efe6ce" transform={`rotate(${i % 2 ? 2 : -2})`} />
            <path d="M-14 8 h28 M-14 16 h22 M-14 24 h26 M-14 32 h18 M-14 40 h24" stroke="#5a4a3a" strokeWidth="0.9" opacity="0.7" transform={`rotate(${i % 2 ? 2 : -2})`} />
          </g>
        ))}
      </PLayer>

      {/* ═══ couche intermédiaire : la presse, l'ouvrier ═══ */}
      <PLayer depth={2}>
        {/* la presse (silhouette solide) */}
        <g transform="translate(300,320)">
          <rect x="-56" y="-30" width="16" height="130" fill="url(#im-wood)" />
          <rect x="40" y="-30" width="16" height="130" fill="url(#im-wood)" />
          <rect x="-64" y="-40" width="128" height="14" fill="#6e4c2e" />
          <rect x="-6" y="-24" width="12" height="54" fill="#8a8c92" />
          <path d="M6 -8 L70 20" stroke="#5a3f24" strokeWidth="7" strokeLinecap="round" />
          <rect x="-34" y="36" width="68" height="14" fill="#7a5636" />
          {/* pressier qui tire la barre */}
          <Figure x={78} y={78} s={0.5} facing="left" skin="#c8a882" hair="#3a2818" look="short" mood="colere"
            garment="jacket" coat="#6a5a40" apron="#8a7a5a" pants="#3a3020" shoes="#2a2018"
            arms={[{ a1: 170, a2: 185 }, { a1: 20, a2: 10 }]} />
        </g>
        {/* étagère de caractères + pots d'encre */}
        <g transform="translate(560,320)">
          <rect x="-50" y="-10" width="100" height="10" fill="#5a3f24" />
          <rect x="-46" y="-40" width="92" height="30" fill="#6e4c2e" />
          <path d="M-46 -25 h92 M-20 -40 v30 M8 -40 v30" stroke="#3a2814" strokeWidth="1.4" />
        </g>
      </PLayer>

      {/* ═══ premier plan : sol, piles de feuilles, colporteur ═══ */}
      <PLayer depth={3}>
        <rect y="400" width="1000" height="160" fill="url(#im-floor)" />
        <rect y="402" width="1000" height="158" fill="#2c1c10" opacity="0.34" filter="url(#im-grain)" />
        <path d="M0 456 h1000 M0 512 h1000 M340 410 v150 M700 410 v150" stroke="#3a2a18" strokeWidth="1.5" opacity="0.45" />
        <ellipse cx="500" cy="474" rx="440" ry="52" fill="#6e5836" opacity="0.3" />

        {/* PILES DE FEUILLES IMPRIMÉES */}
        <g transform="translate(280,500)">
          <g transform="rotate(-2)">
            <rect x="-50" y="-6" width="94" height="30" rx="1" fill="#dfd5bb" />
            <rect x="-54" y="0" width="94" height="30" rx="1" fill="#e6dcc2" />
            <rect x="-52" y="6" width="94" height="30" rx="1" fill="#efe6ce" />
            <path d="M-44 16 h74 M-44 22 h60 M-44 28 h68" stroke="#8a7a5a" strokeWidth="1" opacity="0.6" />
          </g>
          {/* une pile debout à côté */}
          <g transform="translate(64,-6)">
            {[0, -6, -12, -18].map((y, i) => <rect key={i} x="-18" y={y} width="36" height="8" fill="#e6dcc2" stroke="#c9b892" strokeWidth="0.6" />)}
          </g>
        </g>

        {/* SIGISMOND, le rédacteur en chef, près de sa presse, une épreuve
            à la main, l'autre main sur la hanche — l'air du patron */}
        <g transform="translate(762,462)">
          <ellipse cx="0" cy="44" rx="30" ry="8" fill="#241608" opacity="0.5" />
          {/* habit long brun, gilet bordeaux, cravate ; une épreuve à la main, l'autre sur la hanche */}
          <Figure x={0} y={44} s={0.68} skin="#d0a478" hair="#d0ccc4" look="short" glasses wrinkles mood="vexe"
            garment="coat" coat="#4a3226" pants="#3a2418" shoes="#1a1410"
            arms={[{ a1: 40, a2: -60 }, { a1: 40, a2: 20 }]}>
            <path d="M-11 -88 L11 -88 L9 -30 L-9 -30 Z" fill="#6a2530" />
            {[-62, -46].map((y) => <circle key={y} cx="0" cy={y} r="2.4" fill="#c8a84a" />)}
            <path d="M-6 -90 Q0 -76 6 -90 L4 -72 Q0 -66 -4 -72 Z" fill="#efe9dc" />
            <g transform="translate(46,-44) rotate(10)"><rect x="-14" y="-18" width="28" height="36" rx="1.4" fill="#efe6ce" stroke="#7a6a4a" strokeWidth="0.6" /><path d="M-9 -9 h18 M-9 -2 h13 M-9 5 h18" stroke="#7a6a4a" strokeWidth="1.4" opacity="0.7" /></g>
          </Figure>
        </g>

        {/* épave de MARTINE, contre une presse */}
        <g transform="translate(910,506) rotate(8)">
          <ellipse cx="0" cy="12" rx="26" ry="6" fill="#140b06" opacity="0.5" />
          <path d="M0 -20 Q18 -18 20 -4 Q22 8 11 11 L-11 11 Q-22 8 -20 -4 Q-18 -18 0 -20 Z" fill="#8a6240" />
          <circle cx="-1" cy="-4" r="5.5" fill="#cfeaff" stroke="#5c3a22" strokeWidth="1.4" />
          <rect x="-13" y="3" width="24" height="7" rx="2" fill="#0c1410" stroke="#5c3a22" strokeWidth="1" />
          <text x="-1" y="9" textAnchor="middle" fontSize="5.5" fill="#5eff9e" fontFamily="ui-monospace,monospace" style={{ animation: "pulse 2.2s infinite" }}>1794</text>
          <circle cx="13" cy="-27" r="2.3" fill="#5eff9e" style={{ animation: "pulse 1.5s infinite" }} />
          <path d="M8 -20 q6 -8 13 -6" stroke="#8a94a8" strokeWidth="2.3" fill="none" strokeLinecap="round" />
        </g>

        {/* RÉSULTAT (msg_gazettes) : LA UNE DU JOURNAL en grand — l'article de
            Jules sur la montgolfière, imprimé et tiré à des centaines
            d'exemplaires (une petite pile identique dessous). */}
        {made.includes("msg_gazettes") && (
          <g transform="translate(560,470)">
            {/* la pile d'exemplaires identiques, au sol */}
            <g transform="translate(0,26)">
              {[0, -5, -10, -15].map((y, i) => <rect key={i} x="-64" y={y} width="128" height="8" rx="1" fill="#e6dcc2" stroke="#c9b892" strokeWidth="0.6" transform={`rotate(${i % 2 ? 1 : -1})`} />)}
            </g>
            {/* la UNE, dressée en grand */}
            <g style={{ transformOrigin: "center", transformBox: "fill-box", animation: "popIn 0.6s ease-out" }}>
              <rect x="-72" y="-236" width="150" height="248" rx="2" fill="#f2ead2" stroke="#b8a97e" strokeWidth="2" style={{ filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.45))" }} />
              {/* bandeau-titre */}
              <text x="3" y="-212" textAnchor="middle" fontFamily="'Cinzel','Trajan Pro',Georgia,serif" fontSize="19" fill="#2a2015" letterSpacing="1.5" style={{ fontWeight: 700 }}>LA GAZETTE</text>
              <path d="M-64 -202 h134 M-64 -198 h134" stroke="#3a2c1c" strokeWidth="1" />
              <text x="-64" y="-190" fontFamily="Georgia,serif" fontSize="6.5" fill="#5a4a34" fontStyle="italic">Annonay · 1783</text>
              <text x="70" y="-190" textAnchor="end" fontFamily="Georgia,serif" fontSize="6.5" fill="#5a4a34" fontStyle="italic">par Jules · 2 sols</text>
              {/* le gros titre */}
              <text x="3" y="-172" textAnchor="middle" fontFamily="'Cinzel',Georgia,serif" fontSize="12.5" fill="#7a1e18" letterSpacing="0.5" style={{ fontWeight: 700 }}>UN GLOBE VOLE !</text>
              <text x="3" y="-159" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" fill="#3a2c1c" fontStyle="italic">La montgolfière s'élève à Annonay</text>
              {/* la gravure de la montgolfière */}
              <g transform="translate(3,-118)">
                <rect x="-40" y="-30" width="80" height="60" fill="#e6dcc0" stroke="#8a7a56" strokeWidth="1" />
                <path d="M0 -24 C16 -24 22 -8 20 2 C18 10 8 16 0 18 C-8 16 -18 10 -20 2 C-22 -8 -16 -24 0 -24 Z" fill="#c7b891" stroke="#5a4a34" strokeWidth="1" />
                <path d="M0 -24 V18 M-13 -20 Q-16 0 -8 16 M13 -20 Q16 0 8 16" stroke="#5a4a34" strokeWidth="0.6" fill="none" opacity="0.7" />
                <path d="M-8 18 L-4 26 M8 18 L4 26" stroke="#5a4a34" strokeWidth="0.8" />
                <path d="M-5 26 h10 l-2 6 h-6 Z" fill="#7a5230" />
                {/* petits badauds sous le ballon */}
                {[-30, -22, 24, 30].map((x, i) => <circle key={i} cx={x} cy="26" r="1.6" fill="#4a3a2a" />)}
              </g>
              {/* colonnes de texte */}
              {[-64, -18, 28].map((cx, c) => (
                <g key={c}>{[...Array(9)].map((_, i) => <path key={i} d={`M${cx} ${-78 + i * 8} h${c === 2 ? 42 : 40}`} stroke="#6a5a44" strokeWidth="1" opacity="0.55" />)}</g>
              ))}
              <path d="M-64 -86 h134" stroke="#3a2c1c" strokeWidth="0.8" />
            </g>
          </g>
        )}

        {/* ANACHRONISME : écouteurs sans fil dans leur boîtier, posés sur une casse à caractères */}
        {!made.includes("ecouteurs") && mode !== "jeu2" && (
          <g transform="translate(880,510)">
            {/* boîtier de charge blanc, forme galet */}
            <rect x={-18} y={-8} width={36} height={16} rx={6} fill="#f0e4d0" stroke="#5a4028" strokeWidth="1" />
            {/* petite trace de séparation du couvercle */}
            <path d="M-18 0 h36" stroke="#8a7860" strokeWidth="0.6" />
            {/* deux écouteurs (True Wireless) qui dépassent */}
            <ellipse cx={-9} cy={-8} rx={5} ry={4} fill="#f0e4d0" stroke="#5a4028" strokeWidth="0.6" />
            <ellipse cx={-9} cy={-9} rx={3} ry={2.5} fill="#3a3a3a" />
            <path d="M-9 -6 v6" stroke="#f0e4d0" strokeWidth="2.5" />
            <ellipse cx={9} cy={-8} rx={5} ry={4} fill="#f0e4d0" stroke="#5a4028" strokeWidth="0.6" />
            <ellipse cx={9} cy={-9} rx={3} ry={2.5} fill="#3a3a3a" />
            <path d="M9 -6 v6" stroke="#f0e4d0" strokeWidth="2.5" />
            {/* LED verte de charge */}
            <circle cx={0} cy={6} r={1.5} fill="#5eff9e" style={{ animation: "pulse 1.6s infinite" }} />
          </g>
        )}
        {/* SOURIS d'atelier qui traverse au sol — inevitable dans une
            imprimerie du XVe. Elle est dessinee tete a gauche, donc on
            la fait avancer de droite a gauche pour que la marche ait
            l'air normale. */}
        <g opacity="0.85">
          <animateTransform attributeName="transform" type="translate"
            values="1050,0; -40,-5; 1050,0" dur="30s" repeatCount="indefinite" />
          <g transform="translate(0,545)">
            <ellipse cx="0" cy="0" rx="5" ry="2.4" fill="#3a2818" />
            <circle cx="-4" cy="-1" r="2" fill="#3a2818" />
            {/* oreilles */}
            <circle cx="-5.5" cy="-3" r="1.2" fill="#3a2818" />
            <circle cx="-2.5" cy="-3" r="1.2" fill="#3a2818" />
            {/* queue */}
            <path d="M5 0 q6 4 8 -2" stroke="#3a2818" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          </g>
        </g>
      </PLayer>

      {/* voile de grain global */}
      <rect width="1000" height="560" fill="#1a1208" opacity="0.08" style={{ pointerEvents: "none" }} />

      {/* zones cliquables */}
      {/* le « ? » de Sigismond (tant qu'il est le personnage de la quête) */}
      {queteQui === "sigismond" && (
        <>
          <g transform="translate(744,352)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
          </g>
          <Hotspot cx={762} cy={438} r={26} label="parler à Sigismond" reveal={reveal} onClick={() => action("sigismond")} />
        </>
      )}

      {/* Sigismond, cible de dépôt : on lui apporte l'article → la gazette */}
      <Hotspot cx={762} cy={452} r={44} label="donner l'article à Sigismond" item="sigismond" reveal={reveal} onClick={() => action("sigismond")} />
      <Hotspot cx={910} cy={502} r={34} label="MARTINE" reveal={reveal} onClick={() => action("wreck")} />

      {mode !== "jeu2" && (
        <Hotspot cx={880} cy={510} r={24} label="… quelque chose ne va pas ici" item="ecouteurs" reveal={reveal} onClick={() => collect("ecouteurs")} />
      )}
    </svg>
  );
}
