import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 7 — Tableau 4 : le SALON du PHONOGRAPHE (New York, 1878)
   ------------------------------------------------------------
   James, désormais âgé (~66 ans), a fait venir à la maison la
   dernière merveille d'Edison : un phonographe à cylindre de cire.
   Il veut y enregistrer sa voix pour ses petits-enfants — pour
   qu'après sa mort, on l'entende encore. Son fils tourne la
   manivelle. Cliquer sur le phonographe ouvre le mini-jeu.
   ============================================================ */

export default function ScenePhonographe({ action, reveal, made = [], queteQui }) {
  const done = made.includes("msg_phonographe");

  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ph-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7a4a3a" /><stop offset="100%" stopColor="#4a2818" /></linearGradient>
        <linearGradient id="ph-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5a3820" /><stop offset="100%" stopColor="#2a1608" /></linearGradient>
        <linearGradient id="ph-table" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a5a30" /><stop offset="100%" stopColor="#4a2c14" /></linearGradient>
        <radialGradient id="ph-lamp" cx="50%" cy="0%" r="80%"><stop offset="0%" stopColor="#ffe8b0" stopOpacity="0.6" /><stop offset="100%" stopColor="#ffe8b0" stopOpacity="0" /></radialGradient>
        <filter id="ph-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" /></filter>
        <linearGradient id="ph-marble" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#e8e0d4" /><stop offset="100%" stopColor="#a89a8a" /></linearGradient>
        <linearGradient id="ph-drape" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#3a1a14" /><stop offset="50%" stopColor="#6a2a1e" /><stop offset="100%" stopColor="#3a1a14" /></linearGradient>
        <filter id="ph-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* ═══ mur tapissé de bordeaux (papier peint Belle Époque) ═══ */}
      <rect width="1000" height="440" fill="url(#ph-wall)" />
      <rect width="1000" height="440" fill="#2a1808" opacity="0.15" filter="url(#ph-grain)" />
      {/* motif de damas, en quinconce */}
      <g fill="#3a1c10" opacity="0.42">
        {Array.from({ length: 13 }).map((_, i) =>
          Array.from({ length: 5 }).map((_, j) => {
            const x = i * 80 + (j % 2) * 40 + 20, y = 100 + j * 60;
            return <path key={`${i}-${j}`} d={`M${x} ${y - 16} q10 8 0 16 q-10 -8 0 -16 Z M${x - 12} ${y + 4} q12 -2 12 8 q-12 2 -12 -8 Z M${x + 12} ${y + 4} q-12 -2 -12 8 q12 2 12 -8 Z M${x - 1} ${y + 10} h2 v8 h-2 Z`} />;
          })
        )}
      </g>
      {/* frise haute et cimaise */}
      <rect width="1000" height="60" fill="#3a1a10" opacity="0.6" />
      <rect y="58" width="1000" height="6" fill="#8a5a32" />
      <rect y="64" width="1000" height="2" fill="#2a1208" />
      <path d="M0 340 h1000" stroke="#2a1808" strokeWidth="4" />
      {/* lambris d'acajou, panneaux moulurés */}
      <rect y="340" width="1000" height="60" fill="#3a2010" />
      <rect y="336" width="1000" height="6" fill="#6a4020" />
      {Array.from({ length: 11 }).map((_, i) => <rect key={i} x={i * 94 + 8} y="350" width="80" height="40" fill="none" stroke="#24120a" strokeWidth="2" />)}
      {Array.from({ length: 11 }).map((_, i) => <path key={`h${i}`} d={`M${i * 94 + 9} 351 h78`} stroke="#7a4a28" strokeWidth="1" opacity="0.5" />)}

      {/* LA CHEMINÉE de marbre : feu, pendule et chandeliers sur le manteau */}
      <g transform="translate(150,400)">
        <circle cx="0" cy="-50" r="70" fill="#ff9a4a" opacity="0.18" filter="url(#ph-blur)" style={{ animation: "glow 2.2s ease-in-out infinite" }} />
        <rect x="-86" y="-118" width="172" height="12" fill="url(#ph-marble)" />
        <rect x="-80" y="-106" width="22" height="106" fill="url(#ph-marble)" />
        <rect x="58" y="-106" width="22" height="106" fill="url(#ph-marble)" />
        <rect x="-58" y="-106" width="116" height="16" fill="url(#ph-marble)" />
        <path d="M-58 0 L-58 -76 Q0 -100 58 -76 L58 0 Z" fill="#140806" />
        <path d="M-30 0 q4 -26 14 -30 q-2 14 10 18 q2 -20 14 -28 q4 18 16 26 q4 -8 10 -10 q0 14 -6 24 Z" fill="#ff8a3c" style={{ animation: "glow 1.4s ease-in-out infinite" }} />
        <path d="M-16 0 q4 -14 10 -16 q2 8 8 10 q2 -10 8 -14 q2 10 6 20 Z" fill="#ffe08a" />
        <rect x="-36" y="-6" width="72" height="6" fill="#2a1a10" />
        <rect x="-92" y="0" width="184" height="8" fill="#8a7e70" />
        {/* pendule de cheminée */}
        <g transform="translate(0,-118)">
          <path d="M-18 0 L-18 -26 Q0 -40 18 -26 L18 0 Z" fill="#c8a040" />
          <circle cx="0" cy="-18" r="8" fill="#f0e6d0" stroke="#7a5a20" strokeWidth="1.4" />
          <path d="M0 -18 v-5 M0 -18 l4 2" stroke="#2a1a10" strokeWidth="1" />
        </g>
        {[-60, 60].map((x) => (
          <g key={x} transform={`translate(${x},-118)`}>
            <path d="M-6 0 h12 l-3 -6 h-6 Z M-1.5 -6 v-14" stroke="#c8a040" strokeWidth="2" fill="#c8a040" />
            <rect x="-2" y="-30" width="4" height="10" fill="#efe6d2" />
            <path d="M0 -30 q-2 -4 0 -7 q2 3 0 7 Z" fill="#ffd08a" />
          </g>
        ))}
      </g>

      {/* LA FENÊTRE à lourds rideaux : en face, une maison de grès brun, un
          bec de gaz dans la rue du soir */}
      <g transform="translate(900,190)">
        <rect x="-60" y="-110" width="120" height="200" fill="#1a2238" />
        <rect x="-60" y="-110" width="120" height="200" fill="#3a3040" opacity="0.4" />
        <rect x="-60" y="-50" width="120" height="140" fill="#5a3a2c" />
        {[[-44, -36], [-10, -36], [24, -36], [-44, 16], [-10, 16], [24, 16]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="18" height="30" fill={i % 3 === 1 ? "#ffd88a" : "#2a1a14"} opacity={i % 3 === 1 ? 0.8 : 1} />
        ))}
        <circle cx="-30" cy="70" r="18" fill="#ffe0a0" opacity="0.4" filter="url(#ph-blur)" />
        <path d="M-30 90 v-26" stroke="#1a1410" strokeWidth="2.4" /><rect x="-34" y="60" width="8" height="10" fill="#ffe0a0" />
        <path d="M-60 -110 h120 M0 -110 v200 M-60 -10 h120" stroke="#2a1a10" strokeWidth="5" />
        <rect x="-60" y="-110" width="120" height="200" fill="none" stroke="#2a1a10" strokeWidth="8" />
        {/* rideaux de velours retenus par des embrasses, cantonnière */}
        <path d="M-80 -124 L-40 -124 Q-30 -20 -54 30 Q-44 70 -60 110 L-84 110 Z" fill="url(#ph-drape)" />
        <path d="M80 -124 L40 -124 Q30 -20 54 30 Q44 70 60 110 L84 110 Z" fill="url(#ph-drape)" />
        <path d="M-58 26 q8 8 16 0 M58 26 q-8 8 -16 0" stroke="#c8a040" strokeWidth="3" fill="none" />
        <path d="M-90 -130 h180 v16 Q60 -96 0 -110 Q-60 -96 -90 -114 Z" fill="#5a1e16" />
        <path d="M-90 -130 h180" stroke="#c8a040" strokeWidth="3" />
      </g>

      {/* Un CADRE au mur : le daguerréotype de James JEUNE (héritage narratif du T2) */}
      <g transform="translate(120,120)">
        <rect x="-30" y="-40" width="60" height="80" fill="#e8c060" />
        <rect x="-26" y="-36" width="52" height="72" fill="#0a0806" />
        <rect x="-22" y="-32" width="44" height="64" fill="#c8d0d4" />
        <path d="M-10 -22 Q0 -30 10 -22 L8 8 Q0 12 -8 8 Z" fill="#8a807a" />
        <circle cx="0" cy="-14" r="4" fill="#5a5450" />
        <text y="56" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontStyle="italic" fontSize="10" fill="#e8c060">1855</text>
      </g>

      {/* halo lumineux (lampe à pétrole) */}
      <path d="M400 20 L640 20 L720 400 L320 400 Z" fill="url(#ph-lamp)" opacity="0.5" />

      {/* ═══ le sol parqueté ═══ */}
      <PLayer depth={2}>
        <path d="M0 560 L0 400 L1000 400 L1000 560 Z" fill="url(#ph-floor)" />
        {Array.from({ length: 24 }).map((_, i) => {
          const x = -180 + i * 60;
          return <path key={i} d={`M${(500 + (x - 500) * 0.6).toFixed(0)} 400 L${x} 560`} stroke="#1a0c04" strokeWidth="1.2" opacity="0.45" />;
        })}
        <rect y="398" width="1000" height="5" fill="#1a0c04" />
        {/* le tapis d'Orient sous la table */}
        <path d="M290 424 L710 424 L800 548 L200 548 Z" fill="#6a1e16" />
        <path d="M304 430 L696 430 L776 542 L224 542 Z" fill="none" stroke="#c8a040" strokeWidth="3" opacity="0.7" />
        <path d="M322 438 L678 438 L748 534 L252 534 Z" fill="#2a2a4a" opacity="0.5" />
        <path d="M342 446 L658 446 L722 526 L278 526 Z" fill="#8a2a1e" />
        {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${420 + i * 26} 470 l13 -12 l13 12 l-13 12 Z`} fill="#c8a040" opacity="0.4" />)}
        {Array.from({ length: 30 }).map((_, i) => <path key={`f${i}`} d={`M${200 + i * 20.7} 548 v6`} stroke="#d8c8a0" strokeWidth="1.4" opacity="0.6" />)}
      </PLayer>

      {/* ═══ premier plan : la TABLE + LE PHONOGRAPHE + James âgé + son fils ═══ */}
      <PLayer depth={3}>
        {/* la table victorienne */}
        <g transform="translate(500,410)">
          <rect x="-140" y="-10" width="280" height="16" fill="url(#ph-table)" />
          <rect x="-140" y="-10" width="280" height="16" fill="#1a0c04" opacity="0.25" filter="url(#ph-grain)" />
          <path d="M-130 6 Q-124 60 -134 130 L-126 130 Q-116 60 -122 6 Z" fill="#4a2c14" />
          <path d="M130 6 Q124 60 134 130 L126 130 Q116 60 122 6 Z" fill="#4a2c14" />
        </g>

        {/* LE PHONOGRAPHE EDISON — cylindre à cire + grand cornet de cuivre */}
        <g transform="translate(500,320)">
          <rect x="-70" y="60" width="140" height="30" rx="4" fill="#5a3820" />
          <rect x="-70" y="60" width="140" height="30" rx="4" fill="none" stroke="#2a1608" strokeWidth="2" />
          <rect x="-60" y="30" width="120" height="30" fill="#3a2a20" />
          <circle cx="-52" cy="45" r="10" fill="#7a6a5a" stroke="#3a2a20" strokeWidth="2" />
          <circle cx="-52" cy="45" r="4" fill="#3a2a20" />
          {/* manivelle qui tourne en continu (SMIL, marche partout) */}
          <g>
            <animateTransform attributeName="transform" type="rotate"
              values="0 -52 45; 360 -52 45" dur="3.2s" repeatCount="indefinite" />
            <rect x="-58" y="43" width="26" height="4" fill="#a89878" />
            <circle cx="-32" cy="45" r="3.4" fill="#5a4a3a" />
          </g>
          {/* le cylindre de cire (le SUPPORT — l'objet héritage) */}
          <g transform="translate(0,20)">
            <ellipse cx="0" cy="0" rx="52" ry="12" fill="#e0d0a0" />
            <rect x="-52" y="0" width="104" height="20" fill="#e0d0a0" />
            <ellipse cx="0" cy="20" rx="52" ry="12" fill="#c8b088" />
            {[4, 8, 12, 16].map((y, i) => <ellipse key={i} cx="0" cy={y} rx="52" ry="12" fill="none" stroke="#8a7050" strokeWidth="0.6" opacity="0.7" />)}
            {/* l'aiguille sur son bras */}
            <path d="M0 -10 L-20 -30" stroke="#7a6a5a" strokeWidth="3" />
            <circle cx="-20" cy="-30" r="6" fill="#a89878" />
            <path d="M0 -10 L0 -6" stroke="#c8b088" strokeWidth="3" />
          </g>
          {/* le grand cornet de cuivre (pavillon d'enregistrement) */}
          <g transform="translate(50,0)">
            <path d="M0 0 L120 -70 L120 -30 L0 30 Z" fill="#c8802a" />
            <path d="M0 0 L120 -70 L120 -30 L0 30 Z" fill="none" stroke="#7a4a10" strokeWidth="2" />
            <ellipse cx="120" cy="-50" rx="10" ry="40" fill="#7a4a10" />
            <path d="M0 -6 L20 -14 L20 22 L0 14 Z" fill="#7a4a10" />
            {/* NOTES DE MUSIQUE qui sortent du cornet — 3 notes qui
                s'envolent en decalage. Croche + tete de note noire. */}
            {[
              { d: 0, sym: "♪", drift: 30 },
              { d: 1.6, sym: "♫", drift: 45 },
              { d: 3.2, sym: "♩", drift: 36 },
            ].map((n, i) => (
              <g key={i}>
                <animateTransform attributeName="transform" type="translate"
                  values={`120,-50; 200,-${80 + n.drift}; 260,-${100 + n.drift * 1.4}`}
                  dur="4.5s" begin={`${n.d}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;1;0" keyTimes="0;0.4;1" dur="4.5s" begin={`${n.d}s`} repeatCount="indefinite" />
                <text x="0" y="0" fontSize="22" fontWeight="700" fill="#3a2818" fontFamily="Georgia, serif">{n.sym}</text>
              </g>
            ))}
          </g>
        </g>

        {/* JAMES ÂGÉ (~66 ans) — dans un fauteuil, penché vers le cornet */}
        <g transform="translate(720,420)">
          {/* fauteuil */}
          <rect x="-52" y="-30" width="104" height="80" rx="8" fill="#4a2814" />
          <rect x="-58" y="-90" width="12" height="130" rx="4" fill="#4a2814" />
          <rect x="46" y="-90" width="12" height="130" rx="4" fill="#4a2814" />
          <rect x="-48" y="-102" width="96" height="20" rx="6" fill="#5a3018" />
          {/* redingote noire, cravate ; il tend le bras vers le cornet */}
          <Figure x={0} y={22} s={1.7} pose="sit" skin="#dcac8a" hair="#e8e4dc" look="ring" glasses mustache="handlebar" wrinkles mood="content"
            garment="coat" coat="#1c1610" pants="#141010" shoes="#0a0806"
            arms={[{ a1: 84, a2: 94 }, { a1: 14, a2: -30 }]}>
            <path d="M-5 -73 L0 -66 L5 -73 L4 -50 L-4 -50 Z" fill="#efe6d2" />
            <path d="M-1.6 -66 L1.6 -66 L1.6 -52 L-1.6 -52 Z" fill="#0a0a10" />
          </Figure>
        </g>

        {/* LE FILS DE JAMES (~30 ans) — debout, tournant la manivelle du phono */}
        <g transform="translate(360,410)">
          <Figure x={0} y={40} s={1.58} skin="#e4b48a" hair="#8a3a1a" look="short" freckles mood="content"
            garment="jacket" coat="#4a5a6a" coat2="#efe6d2" pants="#2c3846" shoes="#1a1a20"
            arms={[{ a1: 10, a2: 6 }, { a1: 60, a2: 80 }]}>
            <path d="M-1.6 -86 L1.6 -86 L1.6 -60 L-1.6 -60 Z" fill="#3a2820" />
          </Figure>
        </g>

        {/* lampe à pétrole suspendue */}
        <g transform="translate(500,40)">
          <path d="M0 0 v50" stroke="#3a2410" strokeWidth="2" />
          <path d="M-24 50 L24 50 L20 70 L-20 70 Z" fill="#a89878" />
          <ellipse cx="0" cy="80" rx="18" ry="10" fill="#ffe8b0" opacity="0.85" style={{ animation: "glow 2.8s ease-in-out infinite" }} />
        </g>

        {/* « ? » de James âgé (tant qu'il guide) */}
      </PLayer>

      <rect width="1000" height="560" fill="#141810" opacity="0.06" style={{ pointerEvents: "none" }} />

      {/* ═══ zones cliquables ═══ */}
      <Hotspot cx={720} cy={310} r={54} label="James âgé" reveal={reveal} onClick={() => action("james-vieux")} />
      <Hotspot cx={360} cy={330} r={40} label="son fils" reveal={reveal} onClick={() => action("filsjames")} />
      {!done && (
        <Hotspot cx={520} cy={320} r={80} label="le phonographe Edison — graver la voix" reveal={reveal} onClick={() => action("phono")} />
      )}
    </svg>
  );
}
