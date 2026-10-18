import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Bust, Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 7 — Tableau 6 : le NICKELODEON (New York, mai 1912)
   ------------------------------------------------------------
   Quelques semaines après le naufrage du Titanic. Sean, 15 ans,
   entre dans un « Nickelodeon » de la 14ᵉ rue — un des premiers
   petits cinémas populaires (5 cents la place). Sur l'écran passe
   « Saved from the Titanic », un film muet avec Dorothy Gibson,
   vraie rescapée du naufrage.
   Cliquer sur la cabine de projection ouvre le mini-jeu (tourner
   la manivelle à la bonne vitesse : 16 images/seconde).
   ============================================================ */

export default function SceneLumiere({ action, reveal, made = [], queteQui }) {
  const done = made.includes("msg_cinema");

  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ci-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2a1420" /><stop offset="100%" stopColor="#100810" /></linearGradient>
        <linearGradient id="ci-carpet" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5a2418" /><stop offset="100%" stopColor="#2a0e08" /></linearGradient>
        <linearGradient id="ci-curtain" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7a1818" /><stop offset="100%" stopColor="#3a0808" /></linearGradient>
        <linearGradient id="ci-screen" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#efe9dc" /><stop offset="100%" stopColor="#b8b0a0" /></linearGradient>
        <radialGradient id="ci-beam" cx="90%" cy="100%" r="140%"><stop offset="0%" stopColor="#ffe8b0" stopOpacity="0.35" /><stop offset="100%" stopColor="#ffe8b0" stopOpacity="0" /></radialGradient>
        <filter id="ci-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* ═══ la salle obscure ═══ */}
      <rect width="1000" height="560" fill="url(#ci-wall)" />
      <rect width="1000" height="560" fill="#000" opacity="0.15" filter="url(#ci-grain)" />
      <path d="M0 40 h1000" stroke="#5a3010" strokeWidth="4" opacity="0.6" />
      {[100, 300, 500, 700, 900].map((x, i) => (
        <g key={i} transform={`translate(${x},40)`}>
          <path d="M-20 0 q20 -30 40 0 Z" fill="#5a3010" opacity="0.6" />
          <circle cx="0" cy="-4" r="4" fill="#a8801f" opacity="0.7" />
        </g>
      ))}

      {/* ═══ l'ÉCRAN, entouré de son rideau de velours ═══ */}
      <g transform="translate(500,220)">
        <path d="M-280 -140 L280 -140 L260 -110 L-260 -110 Z" fill="url(#ci-curtain)" />
        <path d="M-260 -110 h520 v6 h-520 Z" fill="#3a0808" />
        <path d="M-280 -110 L-200 -110 Q-180 20 -220 120 L-280 120 Z" fill="url(#ci-curtain)" />
        <g stroke="#3a0808" strokeWidth="1.5" opacity="0.55">
          {[-270, -258, -246, -234, -222, -210].map((x, i) => <path key={i} d={`M${x} -110 q6 100 -2 230`} />)}
        </g>
        <path d="M280 -110 L200 -110 Q180 20 220 120 L280 120 Z" fill="url(#ci-curtain)" />
        <g stroke="#3a0808" strokeWidth="1.5" opacity="0.55">
          {[270, 258, 246, 234, 222, 210].map((x, i) => <path key={i} d={`M${x} -110 q-6 100 2 230`} />)}
        </g>
        <rect x="-200" y="-110" width="400" height="230" fill="url(#ci-screen)" />
        <rect x="-200" y="-110" width="400" height="230" fill="#3a1808" opacity="0.35" />
        <rect x="-200" y="-110" width="400" height="230" fill="none" stroke="#a8801f" strokeWidth="4" />

        {/* la scène projetée : le naufrage du Titanic */}
        <path d="M-200 40 Q-100 34 0 40 T200 40 L200 120 L-200 120 Z" fill="#3a1808" opacity="0.6" />
        {[50, 66, 82, 98].map((y, i) => (
          <path key={i} d={`M-200 ${y} q50 ${i % 2 ? 3 : -3} 100 0 t100 0 t100 0 t100 0`} stroke="#b48a5a" strokeWidth="1.2" fill="none" opacity={0.5 - i * 0.08} />
        ))}
        {/* le bateau du film tangue (bercement de la scene projetee) */}
        <g>
          <animateTransform attributeName="transform" type="rotate"
            values="-18 -40 20; -10 -40 20; -18 -40 20" dur="4s" repeatCount="indefinite" />
          <g transform="translate(-40,20)">
            <path d="M-70 0 Q0 12 70 0 L60 14 Q0 22 -60 14 Z" fill="#1a0e04" />
            <rect x="-52" y="-14" width="104" height="20" fill="#2a1608" />
            {[-30, -8, 14, 34].map((x, i) => <rect key={i} x={x} y="-30" width="10" height="18" rx="2" fill="#3a1c0a" />)}
            {[-44, -30, -16, -2, 12, 26, 40].map((x, i) => <circle key={i} cx={x} cy="-4" r="1.6" fill="#ffe08a" opacity="0.85" />)}
          </g>
        </g>
        {/* Dorothy Gibson debout, rescapée */}
        <g transform="translate(60,-20)">
          <path d="M0 0 Q-8 -30 0 -50 Q8 -30 0 0 Z" fill="#1a0e04" />
          <circle cx="0" cy="-58" r="8" fill="#a86a3a" />
          <path d="M-14 0 L14 0 L20 60 L-20 60 Z" fill="#efe6d2" opacity="0.85" />
        </g>
        <g transform="translate(0,88)">
          <rect x="-100" y="-10" width="200" height="20" fill="#0a0806" />
          <text x="0" y="4" textAnchor="middle" fontFamily="Georgia,serif" fontStyle="italic" fontSize="12" fill="#e8d8b0">« Saved from the Titanic »</text>
        </g>

        <rect x="-200" y="-110" width="400" height="230" fill="#000" opacity="0.06">
          <animate attributeName="opacity" values="0.02;0.14;0.05;0.11;0.03;0.09" dur="0.4s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* le CÔNE de lumière du projecteur */}
      <path d="M900 500 L360 220 L640 220 L980 500 Z" fill="url(#ci-beam)" opacity="0.8">
        <animate attributeName="opacity" values="0.7;0.9;0.75;0.85;0.7" dur="0.5s" repeatCount="indefinite" />
      </path>

      {/* ═══ la SALLE : rangées de fauteuils (silhouettes en contre-jour) ═══ */}
      <PLayer depth={2}>
        <path d="M0 560 L0 460 L1000 460 L1000 560 Z" fill="url(#ci-carpet)" />
        <path d="M0 460 h1000" stroke="#1a0804" strokeWidth="3" />
        {[
          [90, 490], [170, 484], [240, 496], [320, 486], [400, 494], [480, 486], [560, 496], [640, 484], [820, 492]
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            {/* spectateur vu de dos, en ombre chinoise : chignons, chapeaux, casquettes */}
            <Bust x={0} y={-36} s={0.62} back skin="#0a0604" hair="#0a0604" cloth="#0a0604" collar="none"
              look={["bun", "short", "long", "short", "bob", "ring", "bun", "short", "curls"][i]}
              hat={[null, "flatcap", null, "brim", null, "tophat", "pillbox", null, null][i]} hatColor="#0a0604" hatColor2="#0a0604" />
          </g>
        ))}
      </PLayer>

      {/* ═══ SEAN, 15 ans, seul au premier rang, ému ═══ */}
      <PLayer depth={3}>
        <g transform="translate(720,490)">
          <rect x="-24" y="-16" width="48" height="60" rx="4" fill="#3a0808" />
          <Figure x={0} y={28} s={0.69} pose="sit" skin="#e4b48a" hair="#8a3a1a" look="short" freckles mood="vexe" hat="flatcap" hatColor="#3a2418"
            garment="jacket" coat="#3a5a7a" pants="#2a3a4a" shoes="#1a1410" arms={[{ a1: 14, a2: -30 }, { a1: 14, a2: -30 }]}>
            {/* une larme */}
            <circle cx="-5" cy="-84" r="1.6" fill="#7fd8ff" style={{ animation: "glow 3s ease-in-out infinite" }} />
          </Figure>
        </g>

        {/* « ? » de l'ouvreuse (tant qu'elle guide) */}

        {/* L'OUVREUSE avec sa petite lampe — avance et recule dans l'allee */}
        <g>
          <animateTransform attributeName="transform" type="translate"
            values="140,490; 200,492; 240,494; 200,492; 140,490; 100,488; 140,490"
            keyTimes="0; 0.15; 0.3; 0.45; 0.6; 0.8; 1"
            dur="18s" repeatCount="indefinite" />
          <Figure x={0} y={0} s={0.92} skin="#e8bc94" hair="#7a5030" look="bun" earrings="#f4f0e4" lips="#b02030" mood="content"
            hat="pillbox" hatColor="#7a1a24" hatColor2="#e8c040" garment="dress" coat="#5a1418" trim="#e8c040" pants="#3a0808" shoes="#1a0606"
            arms={[{ a1: 10, a2: 6 }, { a1: 40, a2: 20 }]}>
            <g transform="translate(38,-50)">
              <rect x="0" y="-5" width="16" height="10" rx="2" fill="#a89878" />
              <ellipse cx="24" cy="0" rx="16" ry="9" fill="#ffe8b0" opacity="0.5" style={{ animation: "glow 2.4s ease-in-out infinite" }} />
            </g>
          </Figure>
        </g>
      </PLayer>

      <rect width="1000" height="560" fill="#000" opacity="0.12" style={{ pointerEvents: "none" }} />

      {/* ═══ zones cliquables ═══ */}
      <Hotspot cx={140} cy={430} r={46} label="l'ouvreuse" reveal={reveal} onClick={() => action("ouvreuse")} />
      <Hotspot cx={720} cy={440} r={36} label="Sean, 15 ans" reveal={reveal} onClick={() => action("sean-jeune")} />
      {!done && (
        <Hotspot cx={880} cy={430} r={60} label="la cabine de projection — tourner la manivelle" reveal={reveal} onClick={() => action("projecteur")} />
      )}
    </svg>
  );
}
