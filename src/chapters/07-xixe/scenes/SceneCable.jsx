import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 7 — Tableau-ÉNIGME : « Relier deux continents ? »
   ------------------------------------------------------------
   Le pont d'un navire câblier. L'ingénieur (cliquable) pose son
   problème : de l'autre côté de l'océan, il y a l'Amérique.
   → câble + océan → le câble atteint l'autre rive : un phare
     s'allume au loin et un signal file dans le câble.
   Ce décor réagit à l'état du jeu via la prop `made`.
   ============================================================ */

export default function SceneCable({ collect, action, reveal, made = [], queteQui }) {
  const built = made.includes("msg_cable"); // le câble relie les deux continents

  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="cb-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5a7898" /><stop offset="60%" stopColor="#a8bcc4" /><stop offset="100%" stopColor="#e0d8b8" /></linearGradient>
        <linearGradient id="cb-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5a8a9a" /><stop offset="55%" stopColor="#356a7e" /><stop offset="100%" stopColor="#204a5e" /></linearGradient>
        <linearGradient id="cb-deck" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9a7a52" /><stop offset="100%" stopColor="#5e4630" /></linearGradient>
        <linearGradient id="cb-hull" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a4038" /><stop offset="100%" stopColor="#2a241e" /></linearGradient>
        <radialGradient id="cb-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.75" /><stop offset="100%" stopColor="#ffe9a8" stopOpacity="0" /></radialGradient>
        <filter id="cb-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* ═══ ciel marin ═══ */}
      <rect width="1000" height="560" fill="url(#cb-sky)" />
      <circle cx="820" cy="120" r="34" fill="#fff2d0" opacity="0.7" />
      <path d="M160 110 q8 -8 16 0 q8 -8 16 0 M240 140 q6 -6 12 0 q6 -6 12 0" stroke="#4a5460" strokeWidth="2.2" fill="none" opacity="0.5" />

      {/* ═══ couche lointaine : l'océan + (une fois relié) l'AUTRE RIVE ═══ */}
      <PLayer depth={1}>
        <rect y="260" width="1000" height="120" fill="url(#cb-sea)" />
        {[276, 300, 326, 352].map((y, i) => (
          <path key={i} d={`M0 ${y} q110 ${i % 2 ? 5 : -5} 220 0 t220 0 t220 0 t220 0`} stroke="#bfe0dc" strokeWidth="1.5" fill="none" opacity="0.35" style={{ animation: `ripple ${3 + (i % 3)}s ease-in-out infinite` }} />
        ))}
        <path d="M780 266 L860 266 L890 380 L740 380 Z" fill="#f0e6c8" opacity="0.16" />

        {/* BALEINE au LOIN (dans la mer lointaine), plus petite et plus discrete */}
        <g opacity="0.7">
          <animateTransform attributeName="transform" type="translate"
            values="-80,0; 1080,6; -80,0" dur="80s" repeatCount="indefinite" />
          <g transform="translate(0,320) scale(0.55)">
            <path d="M-30 0 Q-10 -16 10 -16 Q30 -14 40 -8 L44 -4 L-30 -4 Z" fill="#1c2c3a" stroke="#0a121c" strokeWidth="0.5" />
            <path d="M-10 -12 Q10 -14 25 -10" stroke="#4a6a84" strokeWidth="1" fill="none" opacity="0.6" />
            <path d="M-30 -4 q-15 -6 -22 -18 q0 8 8 14 q-10 0 -14 6 Z" fill="#1c2c3a" stroke="#0a121c" strokeWidth="0.5" />
            <g transform="translate(-4,-16)">
              <path d="M0 0 q-3 -10 4 -18" stroke="#e0e8ec" strokeWidth="2.4" fill="none" opacity="0.4">
                <animate attributeName="opacity" values="0;0.55;0" keyTimes="0;0.5;1" dur="5s" repeatCount="indefinite" />
              </path>
              <circle cx="0" cy="-6" r="1.2" fill="#eef2f6" opacity="0.5" />
            </g>
            <path d="M-40 0 q-14 -1 -22 -4" stroke="#a8c0c8" strokeWidth="1" fill="none" opacity="0.45" />
          </g>
        </g>

        {/* APPARAÎT : la côte d'Amérique, atteinte par le câble */}
        {built && (
          <g style={{ animation: "pulse 0.9s ease-out 2" }}>
            <path d="M700 262 Q800 250 900 256 Q960 259 1000 254 L1000 268 L700 268 Z" fill="#5a6a4a" />
            <path d="M700 262 Q800 250 900 256 Q960 259 1000 254 L1000 268 L700 268 Z" fill="#2c3418" opacity="0.35" filter="url(#cb-grain)" />
            {/* un phare qui clignote : le message est arrivé !
                (x ≤ 860 : au-delà, le décor est rogné selon la fenêtre) */}
            <g transform="translate(824,254)">
              <ellipse cx="0" cy="30" rx="40" ry="16" fill="url(#cb-glow)" />
              <path d="M-5 8 L-3 -18 L3 -18 L5 8 Z" fill="#e8e0d0" />
              <path d="M-3 -12 h6 M-3 -4 h6" stroke="#a83828" strokeWidth="2" />
              <circle cx="0" cy="-22" r="3.4" fill="#ffe08a" style={{ animation: "pulse 1.1s infinite" }} />
            </g>
          </g>
        )}
      </PLayer>

      {/* ═══ couche intermédiaire : la mer proche + la GRUE FLOTTANTE ═══ */}
      <PLayer depth={2}>
        <rect y="360" width="1000" height="80" fill="#2c586e" />
        {[380, 404, 424].map((y, i) => (
          <path key={i} d={`M0 ${y} q120 ${i % 2 ? 6 : -6} 240 0 t240 0 t240 0 t240 0`} stroke="#7ab0b8" strokeWidth="2" fill="none" opacity="0.4" style={{ animation: `ripple ${3 + (i % 3)}s ease-in-out infinite` }} />
        ))}

        {/* la GRUE FLOTTANTE — un ponton avec un bras de grue qui pivote, cliquable
            tant qu'on ne l'a pas ramassée. Une fois attrapée, elle disparaît du décor
            (le joueur la « prend » dans son sac). */}
        {!built && (
          <g>
            <animateTransform attributeName="transform" type="translate"
              values="210,378; 220,374; 210,378" dur="5s" repeatCount="indefinite" />
            {/* la coque du ponton (large et plate) */}
            <path d="M-56 12 Q0 22 56 12 L46 24 Q0 32 -46 24 Z" fill="#1a2028" />
            <path d="M-56 12 Q0 22 56 12 L46 24 Q0 32 -46 24 Z" fill="none" stroke="#0a0e14" strokeWidth="1.5" />
            {/* le pont */}
            <rect x="-40" y="4" width="80" height="10" fill="#3a2c1c" />
            {/* la base pivotante de la grue */}
            <rect x="-6" y="-8" width="12" height="14" fill="#5a4028" />
            {/* le MÂT DE GRUE + FLÈCHE inclinée à 45° (silhouette caractéristique) */}
            <path d="M0 -8 L0 -50 L34 -30 Z" fill="none" stroke="#7a5030" strokeWidth="3" />
            <path d="M0 -50 L34 -30" stroke="#7a5030" strokeWidth="3" />
            {/* le CROCHET qui pend au bout de la flèche */}
            <path d="M34 -30 L34 -12" stroke="#a89878" strokeWidth="1.2" />
            <path d="M32 -12 q0 4 2 4 q2 0 2 -4 Z" fill="#a89878" />
            {/* cheminée fumante */}
            <rect x="-24" y="-8" width="6" height="14" fill="#3a2418" />
            <ellipse cx="-21" cy="-14" rx="4" ry="6" fill="#7a7a7a" opacity="0.6" style={{ animation: "drift 3s ease-in-out infinite" }} />
          </g>
        )}
        {/* une fois le câble posé : la grue est repartie ; on la remplace au fond
            par sa silhouette lointaine (mission accomplie) */}
        {built && (
          <g transform="translate(160,354)" opacity="0.5">
            <path d="M-14 4 Q0 8 14 4 L12 8 Q0 10 -12 8 Z" fill="#1a2028" />
            <path d="M0 -6 L0 -18 L12 -10 Z" fill="none" stroke="#7a5030" strokeWidth="1.5" />
          </g>
        )}
      </PLayer>

      {/* ═══ premier plan : le pont du navire câblier ═══ */}
      <PLayer depth={3}>
        <path d="M0 560 L0 430 Q250 414 520 434 Q760 452 1000 428 L1000 560 Z" fill="url(#cb-hull)" />
        <rect y="424" width="1000" height="40" fill="url(#cb-deck)" />
        <rect y="424" width="1000" height="40" fill="#2c1c10" opacity="0.3" filter="url(#cb-grain)" />
        <path d="M0 448 h1000 M120 424 v136 M340 424 v136 M560 424 v136 M780 424 v136" stroke="#3a2a18" strokeWidth="1.6" opacity="0.4" />
        <rect y="460" width="1000" height="100" fill="url(#cb-deck)" />
        <rect y="462" width="1000" height="98" fill="#2c1c10" opacity="0.28" filter="url(#cb-grain)" />

        {/* LE GRAND TOURET — plein tant que le câble n'est pas posé, presque vide après */}
        <g transform="translate(300,470)">
          <ellipse cx="0" cy="52" rx="76" ry="14" fill="#160f08" opacity="0.5" />
          <circle cx="0" cy="0" r="58" fill="#5a3f24" />
          <circle cx="0" cy="0" r="58" fill="none" stroke="#3a2814" strokeWidth="4" />
          {!built
            ? [50, 42, 34, 26, 18].map((r, i) => <circle key={i} cx="0" cy="0" r={r} fill="none" stroke={i % 2 ? "#3a3a42" : "#4a4a52"} strokeWidth="6" />)
            : [22, 16].map((r, i) => <circle key={i} cx="0" cy="0" r={r} fill="none" stroke={i % 2 ? "#3a3a42" : "#4a4a52"} strokeWidth="5" opacity="0.8" />)}
          <circle cx="0" cy="0" r="8" fill="#6a6c72" />
          <path d="M-64 52 L-40 8 M64 52 L40 8" stroke="#3a2814" strokeWidth="8" strokeLinecap="round" />
        </g>

        {/* le câble qui file du touret vers la poulie, puis dans la mer */}
        <path d="M356 470 Q520 452 640 448 Q760 444 820 430" stroke="#2c2c34" strokeWidth="6" fill="none" />
        <path d="M356 470 Q520 452 640 448 Q760 444 820 430" stroke="#4a4a54" strokeWidth="2" fill="none" opacity="0.6" />
        {/* APPARAÎT : un signal lumineux qui file dans le câble */}
        {built && (
          <circle r="5" fill="#ffe08a">
            <animateMotion dur="1.8s" repeatCount="indefinite" path="M356 470 Q520 452 640 448 Q760 444 820 430" />
          </circle>
        )}
        {/* poulie de guidage au bord */}
        <g transform="translate(830,428)">
          <circle cx="0" cy="0" r="16" fill="#5a5c62" stroke="#3a3c42" strokeWidth="3" />
          <circle cx="0" cy="0" r="6" fill="#3a3c42" />
        </g>
        <path d="M842 434 Q900 460 940 500" stroke="#2c2c34" strokeWidth="6" fill="none" />
        <ellipse cx="944" cy="502" rx="18" ry="5" fill="#bfe0dc" opacity="0.4" style={{ animation: "ripple 2.6s ease-in-out infinite" }} />

        {/* « ? » de James, tant qu'il guide (poser le câble vers l'Irlande) */}

        {/* JAMES O'SULLIVAN, passager fortuné, à la proue, le regard vers
            l'Irlande — il rêve de joindre sa famille de l'autre côté */}
        <g transform="translate(706,470)">
          <ellipse cx="0" cy="34" rx="18" ry="6" fill="#160f08" opacity="0.5" />
          {/* gilet rouge, chapeau repoussé ; un bras au bastingage, l'autre pointe l'horizon */}
          <Figure x={0} y={32} s={0.57} skin="#e4b48a" hair="#a0522d" look="short" mustache="handlebar" freckles mood="content" hat="brim" hatColor="#8a5a30" hatColor2="#3a2818"
            garment="jacket" coat="#6a4a30" coat2="#a8352a" pants="#4a3a2a" shoes="#2a1a10"
            arms={[{ a1: 20, a2: 10 }, { a1: 120, a2: 110 }]}>
            <path d="M-6 -72 q6 14 12 0" stroke="#e6c25a" strokeWidth="2" fill="none" />
          </Figure>
        </g>

        {/* L'INGÉNIEUR : debout, il regarde vers l'Amérique */}
        <g transform="translate(540,470)">
          <Figure x={0} y={34} s={0.6} facing="right" skin="#d8a884" hair="#6a4a38" look="short" beard="short" beardColor="#6a4a38" hat="tophat" hatColor="#241c20"
            garment="coat" coat="#3a3a4a" pants="#2a2a34" shoes="#141418"
            arms={[{ a1: 10, a2: 6 }, { a1: 110, a2: 100 }]} />
        </g>

        {/* un matelot qui surveille le câble */}
        <g transform="translate(430,452)">
          <Figure x={0} y={22} s={0.41} skin="#c8a882" hair="#3a2818" look="short" hat="cap" hatColor="#e8e4da" mood="vexe"
            garment="jacket" coat="#3a4a6a" pants="#2a3448" shoes="#141418" arms={[{ a1: 10, a2: 6 }, { a1: 60, a2: 100 }]} />
        </g>

        <path d="M0 500 h1000" stroke="#3a2a18" strokeWidth="4" opacity="0.5" />
      </PLayer>

      <rect width="1000" height="560" fill="#141810" opacity="0.05" style={{ pointerEvents: "none" }} />

      {/* ═══ zones cliquables ═══ */}
      <Hotspot cx={706} cy={452} r={34} label="James O'Sullivan" reveal={reveal} onClick={() => action("james")} />
      <Hotspot cx={540} cy={444} r={48} label="l'ingénieur" reveal={reveal} onClick={() => action("field")} />
      {!built && (
        <>
          <Hotspot cx={300} cy={468} r={64} label="câble" item="cable" reveal={reveal} onClick={() => collect("cable")} />
          <Hotspot cx={210} cy={368} r={54} label="grue flottante" item="grue" reveal={reveal} onClick={() => collect("grue")} />
          <Hotspot cx={740} cy={320} r={80} label="océan" item="ocean" reveal={reveal} onClick={() => collect("ocean")} />
        </>
      )}
    </svg>
  );
}
