import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";
import { Clouds, Glitter, Haze, Ridge, Speckle, TreeLine } from "../../../engine/scenery.jsx";

/* ============================================================
   CHAPITRE 3 — Tableau : la côte phénicienne
   Peinture fine — lumière méditerranéenne, un port, des navires
   marchands, des ballots de marchandises, le comptoir où l'on
   troque… et où l'alphabet se transmet.
   À trouver : les 22 signes (au comptoir), les navires marchands.
   ============================================================ */

export default function ScenePhenicie({ collect, action, reveal, made = [], mode = "jeu1" }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ph-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2f6a9e" />
          <stop offset="48%" stopColor="#79aacb" />
          <stop offset="80%" stopColor="#e6c98a" />
          <stop offset="100%" stopColor="#f4dca0" />
        </linearGradient>
        <radialGradient id="ph-sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff4d0" /><stop offset="50%" stopColor="#ffe09a" stopOpacity="0.6" /><stop offset="100%" stopColor="#ffe09a" stopOpacity="0" /></radialGradient>
        <linearGradient id="ph-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5aa0b0" /><stop offset="55%" stopColor="#2f7e92" /><stop offset="100%" stopColor="#1c5a6e" /></linearGradient>
        <linearGradient id="ph-quay" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c2a877" /><stop offset="100%" stopColor="#7a6240" /></linearGradient>
        <filter id="ph-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="ph-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7" /></filter>
      </defs>

      {/* ═══ ciel méditerranéen ═══ */}
      <rect width="1000" height="560" fill="url(#ph-sky)" />
      <circle cx="800" cy="150" r="150" fill="url(#ph-sun)" />
      <circle cx="800" cy="150" r="42" fill="#fff4d0" opacity="0.95" />
      <Clouds id="ph-cl" seed={41} items={[[180, 70, 200], [480, 110, 160], [620, 52, 140]]} color="#fbf6ec" shadow="#d0d8dc" opacity="0.75" drift={18} />
      {/* mouettes */}
      <path d="M180 120 q8 -8 16 0 q8 -8 16 0 M260 150 q6 -6 12 0 q6 -6 12 0" stroke="#3c4452" strokeWidth="2.2" fill="none" opacity="0.6" />

      {/* ═══ couche lointaine : cap rocheux + ville phénicienne ═══ */}
      <PLayer depth={1}>
        {/* montagnes de l'arrière-pays, puis la côte qui fuit au loin à droite */}
        <Ridge id="ph-r0" seed={221} x0={-40} x1={1040} y={274} amp={90} rough={0.58} fill="#8a9ab8" lit="#b8c4d4" light={1} />
        <Haze id="ph-h0" y0={200} y1={300} color="#f0dcb0" opacity={0.5} />
        <path d="M600 300 Q760 290 1040 292 L1040 302 L600 302 Z" fill="#a8a088" opacity="0.8" />
        {/* le cap rocheux et la ville phénicienne en terrasses */}
        <path d="M-40 304 L-40 262 Q60 236 160 248 Q250 258 300 276 Q330 290 340 304 Z" fill="#9a8662" />
        <path d="M-40 262 Q60 236 160 248 Q250 258 300 276" stroke="#c8b488" strokeWidth="3" fill="none" opacity="0.6" />
        <TreeLine seed={223} x0={0} x1={300} y={262} n={10} h={[10, 18]} kinds={["leafy", "conifer"]} colors={["#4a5a34", "#566a3a"]} light={1} jitter={8} />
        {[[20, 266, 26, 22], [50, 258, 22, 28], [80, 262, 28, 20], [112, 256, 24, 26], [146, 262, 30, 22], [182, 270, 24, 18], [214, 274, 28, 18], [246, 282, 22, 14], [36, 284, 30, 18], [96, 282, 26, 18], [160, 286, 28, 16]].map(([x, y, w, h], i) => (
          <g key={i}>
            <rect x={x} y={y - h} width={w} height={h} fill={i % 3 ? "#e8dcc4" : "#d8cab0"} />
            <rect x={x} y={y - h} width={w} height="3" fill="#b8a888" />
            <rect x={x + w * 0.6} y={y - h} width={w * 0.4} height={h} fill="#000" opacity="0.08" />
            <rect x={x + w / 2 - 3} y={y - h + 7} width="5" height="7" fill="#4a3a28" />
          </g>
        ))}
        {/* jetée de pierre qui ferme le port */}
        <path d="M200 304 L440 300 L446 308 L200 312 Z" fill="#8a7a5e" />
        <path d="M200 304 L440 300" stroke="#c2b48e" strokeWidth="2" />
        {/* phare / tour de guet */}
        <rect x="300" y="230" width="16" height="70" fill="#c2b48e" /><rect x="298" y="224" width="20" height="10" fill="#a86a4a" />
      </PLayer>

      {/* ═══ couche intermédiaire : la mer + les navires marchands ═══ */}
      <PLayer depth={2}>
        <rect x="-40" y="300" width="1080" height="130" fill="url(#ph-sea)" />
        <Glitter x={780} y0={304} y1={420} w0={16} w1={130} blurId="ph-blur" />
        {[316, 342, 368, 396].map((y, i) => (
          <path key={i} d={`M-40 ${y} q110 ${i % 2 ? 5 : -5} 220 0 t220 0 t220 0 t220 0 t220 0`} stroke="#bfe0dc" strokeWidth="1.6" fill="none" opacity="0.4" style={{ animation: `ripple ${3 + (i % 3)}s ease-in-out infinite` }} />
        ))}
        {/* deux navires marchands (coque à rames + voile carrée) */}
        {[[420, 350, 1], [720, 372, 0.8]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
            <path d="M-56 16 Q0 34 56 16 L46 30 Q0 40 -46 30 Z" fill="#5a3f24" />
            <path d="M-56 16 Q-60 6 -52 4 M56 16 Q60 6 52 4" stroke="#7a5636" strokeWidth="3" fill="none" />
            <path d="M0 16 L0 -46" stroke="#4a3320" strokeWidth="3" />
            <rect x="-30" y="-46" width="60" height="34" fill="#e8dcc0" />
            <path d="M-30 -46 h60 M-30 -30 h60" stroke="#c2a86a" strokeWidth="1.4" opacity="0.6" />
            {/* rames */}
            <path d="M-40 24 l-14 12 M-24 26 l-12 12 M24 26 l12 12 M40 24 l14 12" stroke="#6e4c2e" strokeWidth="2.4" />
          </g>
        ))}
      </PLayer>

      {/* ═══ premier plan : le quai, les ballots, le comptoir ═══ */}
      <PLayer depth={3}>
        <path d="M0 560 L0 418 Q250 404 520 424 Q760 442 1000 416 L1000 560 Z" fill="url(#ph-quay)" />
        <path d="M0 560 L0 418 Q250 404 520 424 Q760 442 1000 416 L1000 560 Z" fill="#3c2c18" opacity="0.3" filter="url(#ph-grain)" />
        {/* dalles du quai, en perspective, et le bord du quai sur l'eau */}
        <path d="M-40 418 Q250 404 520 424 Q760 442 1040 416 L1040 428 Q760 454 520 436 Q250 416 -40 430 Z" fill="#5c4830" opacity="0.6" />
        {[[430, 452], [452, 484], [484, 526], [526, 590]].map(([y0, y1], r) => (
          <g key={r}>
            <path d={`M-40 ${y1} H1040`} stroke="#5c4830" strokeWidth={1.2 + r * 0.4} opacity="0.45" />
            {Array.from({ length: 10 }).map((_, k) => {
              const x = -80 + k * 130 + (r % 2) * 65;
              const f0 = 1 + (y0 - 420) / 140, f1 = 1 + (y1 - 420) / 140;
              return <path key={k} d={`M${(500 + (x - 500) * f0).toFixed(0)} ${y0} L${(500 + (x - 500) * f1).toFixed(0)} ${y1}`} stroke="#5c4830" strokeWidth="1.4" opacity="0.4" />;
            })}
          </g>
        ))}
        <Speckle seed={225} x0={0} x1={1000} y0={430} y1={560} n={240} colors={["#8a7048", "#e0cca0", "#5c4830"]} opacity={0.45} />
        {/* bitte d'amarrage et cordage */}
        <g transform="translate(330,438)">
          <rect x="-7" y="-20" width="14" height="22" rx="3" fill="#6a5a44" /><ellipse cx="0" cy="-20" rx="9" ry="3" fill="#8a7a62" />
          <path d="M6 -12 Q40 -6 70 -26" stroke="#a8875a" strokeWidth="2.4" fill="none" />
        </g>
        <ellipse cx="500" cy="500" rx="440" ry="46" fill="#7a6240" opacity="0.35" />

        {/* BALLOTS de marchandises empilés */}
        <g transform="translate(150,486)">
          <rect x="-34" y="-4" width="34" height="30" rx="4" fill="#a86a4a" />
          <rect x="2" y="-4" width="34" height="30" rx="4" fill="#b8794a" />
          <rect x="-16" y="-32" width="34" height="30" rx="4" fill="#96613e" />
          <path d="M-30 10 h30 M6 10 h30 M-12 -18 h30" stroke="#5c3822" strokeWidth="1.4" opacity="0.6" />
          {/* amphores appuyées */}
          <g transform="translate(44,10)"><path d="M-7 -2 Q-9 12 0 16 Q9 12 7 -2 Q7 -10 0 -12 Q-7 -10 -7 -2 Z" fill="#b8935e" /><rect x="-3" y="-16" width="6" height="6" fill="#8a6238" /></g>
        </g>

        {/* LE COMPTOIR : une table où l'on troque, une tablette aux 22 signes */}
        <g transform="translate(470,500)">
          <rect x="-70" y="6" width="140" height="12" rx="3" fill="#8a6238" />
          <rect x="-64" y="18" width="10" height="24" fill="#6e4c2e" /><rect x="54" y="18" width="10" height="24" fill="#6e4c2e" />
          {/* la plaquette de l'alphabet (22 signes simples) */}
          <g transform="translate(-4,-8)">
            <rect x="-40" y="-14" width="80" height="26" rx="3" fill="#e8dcc0" />
            <rect x="-40" y="-14" width="80" height="26" rx="3" fill="#6e5228" opacity="0.2" filter="url(#ph-grain)" />
            {["𐤀","𐤁","𐤂","𐤃","𐤄","𐤅","𐤆"].map((c, i) => (
              <text key={i} x={-34 + i * 11} y="-2" fontSize="9" fill="#3c2c18" fontFamily="ui-monospace,monospace">{c}</text>
            ))}
            {["𐤇","𐤈","𐤉","𐤊","𐤋","𐤌","𐤍"].map((c, i) => (
              <text key={i} x={-34 + i * 11} y="9" fontSize="9" fill="#3c2c18" fontFamily="ui-monospace,monospace">{c}</text>
            ))}
          </g>
          {/* balance de marchand */}
          <g transform="translate(56,-6)">
            <path d="M0 -14 L0 0 M-12 -10 L12 -10" stroke="#6e5230" strokeWidth="1.6" />
            <path d="M-12 -10 l-4 8 l8 0 Z M12 -10 l-4 8 l8 0 Z" fill="#c2a86a" />
          </g>
        </g>

        {/* un marchand phénicien assis au comptoir */}
        <g transform="translate(560,486)">
          <Figure x={0} y={26} s={0.841} pose="sit" skin="#a06a44" hair="#2c1c12" look="curls" beard="full" beardColor="#2c1c12" earrings
            garment="robe" coat="#7a3f34" trim="#c89a4a" pants="#5a2e26" shoes="#3a2418"
            arms={[{ a1: 62, a2: 84 }, { a1: 14, a2: -20 }]} />
        </g>

        {/* TABLETTE À GRAVER — ouvre le mini-jeu « Écris MARTINE » */}
        <g transform="translate(300,500)">
          <ellipse cx="0" cy="20" rx="40" ry="9" fill="#160f06" opacity="0.4" />
          <path d="M-36 14 Q-38 -14 -30 -18 L30 -16 Q40 -14 38 12 Q38 20 28 20 L-26 20 Q-36 20 -36 14 Z" fill="#c8a46a" stroke="#8a6a3a" strokeWidth="2" />
          <g stroke="#5a3f22" strokeWidth="1.6" fill="none" strokeLinecap="round">
            <path d="M-24 -4 L-18 8 L-12 -4 M-24 -4 q-4 -6 -8 -4 M-12 -4 q4 -6 8 -4" />
            <path d="M-4 -6 q3 4 6 0 q3 4 6 0" />
            <path d="M16 -8 L26 4 M26 -8 L16 4" />
          </g>
          <g transform="translate(30,-12) rotate(28)"><rect x="-1.4" y="-14" width="2.8" height="26" rx="1.4" fill="#c9a86a" /></g>
          <text x="0" y="-28" textAnchor="middle" fontSize="16" fill="#ffd166" style={{ animation: "glow 2s ease-in-out infinite" }}>✍</text>
        </g>

        {/* bittes d'amarrage + corde */}
        <g transform="translate(820,470)">
          <rect x="-6" y="0" width="12" height="24" rx="4" fill="#5c4630" />
          <path d="M0 4 q40 8 70 -6" stroke="#8a6a42" strokeWidth="3" fill="none" opacity="0.8" />
        </g>

        {/* herbes / cordages qui cadrent le bas */}
        <g opacity="0.85"><path d="M-4 560 q8 -22 2 -34 M980 560 q-6 -20 2 -32" stroke="#3a2c18" strokeWidth="4" fill="none" /></g>
      </PLayer>

      {/* voile de grain global */}
      <rect width="1000" height="560" fill="#231a10" opacity="0.06" style={{ pointerEvents: "none" }} />

      {/* zones cliquables */}
      {/* Hotspot pour parler à Assurbanipal — visible tant qu'on n'a pas
          l'alphabet, caché en jeu 2 (l'enquête Al3x1A ne le concerne pas). */}
      {!made.includes("msg_alphabet") && mode !== "jeu2" && (
        <Hotspot cx={560} cy={463} r={41} label="parler à Assurbanipal" reveal={reveal} onClick={() => action("assurbanipal")} />
      )}

      {/* la tablette : APPRENDRE l'alphabet (mini-jeu) → on gagne les 22 signes */}
      <Hotspot cx={300} cy={494} r={46} label="apprendre l'alphabet" reveal={reveal} onClick={() => action("alphabet")} />
      <Hotspot cx={470} cy={356} r={70} label="navires marchands" item="navires" reveal={reveal} onClick={() => collect("navires")} />
      {/* MOUETTE posee AU SOMMET de la pile de ballots — bouge la tete
          en va-et-vient et se retourne parfois completement de l'autre
          cote. Blanche, bec jaune-orange, tache rouge caracteristique. */}
      <g>
        {/* toggle du corps entier qui se retourne de temps en temps :
            scaleX -1 pendant une partie du cycle */}
        <animateTransform attributeName="transform" type="translate"
          values="150,447; 150,447" dur="14s" repeatCount="indefinite" />
        <g>
          <animateTransform attributeName="transform" type="scale"
            values="1,1; 1,1; -1,1; -1,1; 1,1"
            keyTimes="0;0.45;0.5;0.9;1" dur="14s" repeatCount="indefinite" />
          {/* corps arrondi */}
          <ellipse cx="0" cy="0" rx="8" ry="6" fill="#f5f2ea" stroke="#4a4a4a" strokeWidth="0.5" />
          <path d="M-2 -1 q6 -3 8 2 q-2 4 -8 2 Z" fill="#c8ccd0" stroke="#4a4a4a" strokeWidth="0.4" />
          <path d="M6 1 l3 -1 l-1 3 Z" fill="#1a1408" />
          {/* petites pattes jaunes */}
          <path d="M-2 6 v3 M2 6 v3" stroke="#e8a028" strokeWidth="0.8" strokeLinecap="round" />
          {/* tete + bec, qui pivote de gauche a droite quand elle regarde */}
          <g style={{ transformOrigin: "-4px -4px" }}>
            <animateTransform attributeName="transform" type="rotate"
              values="-15; 15; -15" dur="3.5s" repeatCount="indefinite" />
            <circle cx="-4" cy="-5" r="3" fill="#f5f2ea" stroke="#4a4a4a" strokeWidth="0.4" />
            <path d="M-7 -5 l-4 0.5 l4 1 Z" fill="#e8a028" stroke="#7a5010" strokeWidth="0.3" />
            <circle cx="-9" cy="-4.5" r="0.4" fill="#c02830" />
            <circle cx="-5" cy="-5.5" r="0.5" fill="#0a0604" />
          </g>
        </g>
      </g>
</svg>
  );
}
