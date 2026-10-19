import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";
import { Clouds, Glitter } from "../../../engine/scenery.jsx";

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
        <filter id="cb-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6" /></filter>
        <linearGradient id="cb-rail" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a6a46" /><stop offset="100%" stopColor="#4a3420" /></linearGradient>
        <filter id="cb-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* ═══ ciel marin ═══ */}
      <rect width="1000" height="560" fill="url(#cb-sky)" />
      <circle cx="820" cy="120" r="90" fill="#fff2d0" opacity="0.18" filter="url(#cb-blur)" />
      <circle cx="820" cy="120" r="34" fill="#fff2d0" opacity="0.75" />
      <Clouds id="cb-cl" seed={701} items={[[150, 92, 210], [470, 60, 170], [660, 196, 150], [320, 206, 130], [960, 70, 150]]} color="#eef0ec" shadow="#8a9aa8" opacity={0.75} drift={22} />
      <path d="M160 110 q8 -8 16 0 q8 -8 16 0 M240 140 q6 -6 12 0 q6 -6 12 0 M600 120 q5 -5 10 0 q5 -5 10 0" stroke="#4a5460" strokeWidth="2.2" fill="none" opacity="0.5" />

      {/* ═══ couche lointaine : l'océan + (une fois relié) l'AUTRE RIVE ═══ */}
      <PLayer depth={1}>
        <rect y="260" width="1000" height="120" fill="url(#cb-sea)" />
        {[276, 300, 326, 352].map((y, i) => (
          <path key={i} d={`M0 ${y} q110 ${i % 2 ? 5 : -5} 220 0 t220 0 t220 0 t220 0`} stroke="#bfe0dc" strokeWidth="1.5" fill="none" opacity="0.35" style={{ animation: `ripple ${3 + (i % 3)}s ease-in-out infinite` }} />
        ))}
        <rect y="258" width="1000" height="10" fill="#d8e0d8" opacity="0.35" filter="url(#cb-blur)" />
        <Glitter x={820} y0={266} y1={378} w0={14} w1={120} blurId="cb-blur" />
        {/* écume des crêtes, au hasard */}
        {Array.from({ length: 26 }).map((_, i) => {
          const x = (i * 157) % 1000, y = 272 + ((i * 53) % 100), w = 6 + (y - 262) * 0.12;
          return <path key={i} d={`M${x} ${y} q${w / 2} -2 ${w} 0`} stroke="#e8f4f0" strokeWidth="1.4" fill="none" opacity="0.5" />;
        })}
        {/* le navire d'escorte, au loin : coque, trois mâts, cheminée qui fume */}
        <g transform="translate(560,266)" opacity="0.8">
          <path d="M-34 -2 L34 -2 L28 4 L-30 4 Z" fill="#2a3038" />
          <path d="M-20 -2 v-30 M0 -2 v-36 M20 -2 v-28" stroke="#2a3038" strokeWidth="1.4" />
          <path d="M-26 -22 h12 M-7 -28 h14 M14 -20 h12" stroke="#2a3038" strokeWidth="1" />
          <rect x="6" y="-12" width="5" height="10" fill="#2a3038" />
          <path d="M8 -12 q-14 -10 -36 -12 q-14 -2 -24 -8" stroke="#8a929a" strokeWidth="4" fill="none" opacity="0.4" filter="url(#cb-blur)" />
        </g>

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
        {/* à droite, au-delà de la poupe, la mer où plonge le câble */}
        <rect x="800" y="420" width="240" height="160" fill="#204a5e" />
        {[450, 480, 516, 548].map((y, i) => <path key={y} d={`M820 ${y} q40 ${i % 2 ? 4 : -4} 80 0 t80 0 t80 0`} stroke="#7ab0b8" strokeWidth="2" fill="none" opacity="0.4" style={{ animation: `ripple ${3 + i}s ease-in-out infinite` }} />)}
        {/* le pont : bordages en long, joints décalés, poupe arrondie à droite */}
        <path d="M-40 420 L880 420 Q936 440 958 560 L-40 560 Z" fill="url(#cb-hull)" />
        <path d="M-40 428 L874 428 Q924 446 944 560 L-40 560 Z" fill="url(#cb-deck)" />
        <g clipPath="url(#cb-deckclip)">
          <rect x="-40" y="428" width="1000" height="132" fill="#2c1c10" opacity="0.28" filter="url(#cb-grain)" />
          {Array.from({ length: 11 }).map((_, k) => {
            const y = 428 + Math.pow(k, 1.45) * 4.2;
            return (
              <g key={k}>
                <path d={`M-40 ${y.toFixed(1)} H1000`} stroke="#3a2a18" strokeWidth={0.8 + k * 0.08} opacity="0.45" />
                {Array.from({ length: 7 }).map((_, j) => <path key={j} d={`M${(j * 160 + (k % 3) * 53).toFixed(0)} ${y.toFixed(1)} v${(3 + k * 1.1).toFixed(1)}`} stroke="#3a2a18" strokeWidth="0.8" opacity="0.4" />)}
              </g>
            );
          })}
        </g>
        <defs><clipPath id="cb-deckclip"><path d="M-40 428 L874 428 Q924 446 944 560 L-40 560 Z" /></clipPath></defs>
        {/* le bastingage : lisse, montants et pavois */}
        <rect x="-40" y="404" width="912" height="18" fill="url(#cb-rail)" />
        <rect x="-40" y="402" width="912" height="5" fill="#a88a5e" />
        {Array.from({ length: 23 }).map((_, i) => <rect key={i} x={i * 40 - 4} y="406" width="4" height="16" fill="#3a2814" opacity="0.6" />)}
        <path d="M868 404 Q912 414 938 450" stroke="#a88a5e" strokeWidth="5" fill="none" />
        {/* le grand mât, ses haubans et ses enfléchures, à gauche */}
        <rect x="102" y="-20" width="14" height="440" fill="#6e5032" />
        <rect x="112" y="-20" width="4" height="440" fill="#3a2814" opacity="0.5" />
        <rect x="40" y="40" width="140" height="7" rx="3" fill="#5a3f24" />
        {[[20, 404], [52, 404], [166, 404], [198, 404]].map(([x, y], i) => <path key={i} d={`M109 30 L${x} ${y}`} stroke="#2c2018" strokeWidth="1.6" opacity="0.8" />)}
        {Array.from({ length: 14 }).map((_, k) => {
          const t = 0.12 + k * 0.06, y = 30 + (404 - 30) * t;
          return <path key={k} d={`M${109 + (20 - 109) * t} ${y} L${109 + (52 - 109) * t} ${y} M${109 + (166 - 109) * t} ${y} L${109 + (198 - 109) * t} ${y}`} stroke="#2c2018" strokeWidth="1" opacity="0.6" />;
        })}
        {/* ligne de pavillons de signaux */}
        <path d="M109 50 Q300 120 520 -10" stroke="#2c2018" strokeWidth="1" fill="none" opacity="0.7" />
        {[0.15, 0.28, 0.41, 0.54, 0.67, 0.8].map((t, i) => {
          const x = (1 - t) * (1 - t) * 109 + 2 * (1 - t) * t * 300 + t * t * 520, y = (1 - t) * (1 - t) * 50 + 2 * (1 - t) * t * 120 + t * t * -10;
          return <path key={i} d={`M${x.toFixed(1)} ${y.toFixed(1)} l8 2 l-3 12 Z`} fill={["#c83a2a", "#f0d040", "#2a4a9a", "#f0f0e8", "#c83a2a", "#2a6a3a"][i]} />;
        })}
        {/* bitte d'amarrage et glène de cordage */}
        <g transform="translate(880,474)">
          <ellipse cx="0" cy="14" rx="20" ry="5" fill="#160f08" opacity="0.4" />
          <rect x="-14" y="-8" width="10" height="22" rx="3" fill="#3a3c42" /><rect x="4" y="-8" width="10" height="22" rx="3" fill="#3a3c42" />
          <rect x="-14" y="-10" width="10" height="4" rx="2" fill="#6a6c72" /><rect x="4" y="-10" width="10" height="4" rx="2" fill="#6a6c72" />
        </g>
        <g transform="translate(620,528)">
          <ellipse cx="0" cy="6" rx="40" ry="10" fill="#160f08" opacity="0.4" />
          {[34, 27, 20, 13].map((r, i) => <ellipse key={i} cx="0" cy="0" rx={r} ry={r * 0.3} fill="none" stroke={i % 2 ? "#a88a5a" : "#c8a874"} strokeWidth="4" />)}
          <path d="M34 0 q16 4 26 16" stroke="#c8a874" strokeWidth="4" fill="none" />
        </g>
        {/* panneau de cale à caillebotis */}
        <g transform="translate(150,524)">
          <path d="M-60 -16 L60 -16 L70 22 L-70 22 Z" fill="#4a3420" />
          <path d="M-54 -12 L54 -12 L62 18 L-62 18 Z" fill="#7a5a36" />
          {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${-50 + i * 12.5} -12 L${-58 + i * 14.5} 18`} stroke="#3a2814" strokeWidth="1.4" />)}
          {[-4, 6].map((y) => <path key={y} d={`M-58 ${y} H58`} stroke="#3a2814" strokeWidth="1.4" />)}
        </g>

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
