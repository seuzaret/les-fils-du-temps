import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 8 — Tableau-ÉNIGME : « Relier toutes les machines ? »
   ------------------------------------------------------------
   Un labo des années 1980. Les micro-ordinateurs sont là, mais
   chacun dans son coin. Le chercheur (cliquable) pose sa question.
   → laser + disque brillant → un lecteur CD apparaît, le rayon lit
     le disque et l'arc-en-ciel s'allume.
   → ordinateurs + réseau → les machines se relient : des liens
     lumineux courent d'un écran à l'autre.
   ⚠️ C'est ici qu'on ramasse la DISQUETTE (objet HÉRITAGE) : elle
      voyagera jusqu'au chapitre 9 pour la leçon d'obsolescence.
   Ce décor réagit à l'état du jeu via la prop `made`.
   ============================================================ */

export default function SceneLabo({ collect, action, reveal, made = [] }) {
  const cd = made.includes("msg_cd");        // le lecteur CD fonctionne
  const net = made.includes("msg_internet"); // les machines sont reliées

  /* les trois postes de travail */
  const POSTES = [180, 420, 660];

  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="lb-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a4e58" /><stop offset="100%" stopColor="#25282f" /></linearGradient>
        <linearGradient id="lb-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5a5e66" /><stop offset="100%" stopColor="#24272c" /></linearGradient>
        <linearGradient id="lb-desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a8478" /><stop offset="100%" stopColor="#4e4a42" /></linearGradient>
        <linearGradient id="lb-cd" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7fd8ff" /><stop offset="30%" stopColor="#a8ff9e" /><stop offset="55%" stopColor="#ffe08a" /><stop offset="80%" stopColor="#ff8ac8" /><stop offset="100%" stopColor="#9a8aff" />
        </linearGradient>
        <radialGradient id="lb-netglow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#5eff9e" stopOpacity="0.4" /><stop offset="100%" stopColor="#5eff9e" stopOpacity="0" /></radialGradient>
        <radialGradient id="lb-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.6" /><stop offset="100%" stopColor="#ffe9a8" stopOpacity="0" /></radialGradient>
        <filter id="lb-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* ═══ le labo ═══ */}
      <rect width="1000" height="560" fill="url(#lb-wall)" />
      <rect width="1000" height="560" fill="#14161c" opacity="0.24" filter="url(#lb-grain)" />
      {/* dalles de faux plafond */}
      {[...Array(10)].map((_, i) => <path key={i} d={`M${i * 100} 0 v70`} stroke="#3a3e46" strokeWidth="1.6" opacity="0.6" />)}
      <path d="M0 70 h1000" stroke="#3a3e46" strokeWidth="2.5" opacity="0.6" />

      {/* ═══ couche lointaine : tableau blanc + affiche ═══ */}
      <PLayer depth={1}>
        <g transform="translate(500,170)">
          <rect x="-130" y="-58" width="260" height="116" rx="3" fill="#e8eaec" stroke="#7a7e86" strokeWidth="5" />
          {/* un schéma de réseau griffonné : des ronds reliés */}
          {[[-80, -20], [-20, -34], [40, -14], [92, -30], [-46, 22], [24, 28], [86, 16]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="8" fill="none" stroke="#3a6ac8" strokeWidth="2.5" />
          ))}
          <path d="M-72 -20 L-28 -32 M-12 -32 L32 -16 M48 -16 L84 -28 M-74 -14 L-50 14 M-38 22 L16 27 M32 26 L80 18 M-14 -28 L-42 16 M40 -6 L28 20"
            stroke="#3a6ac8" strokeWidth="1.8" fill="none" opacity="0.8" />
          <text x="-104" y="46" fontSize="11" fill="#c8483a" fontFamily="ui-monospace,monospace">et si on les reliait TOUS ?</text>
        </g>
      </PLayer>

      {/* ═══ couche intermédiaire : LE CHERCHEUR + le « ? » + les liens réseau ═══ */}
      <PLayer depth={2}>
        {!net && (
          <g transform="translate(830,258)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -24 24 -24 q24 0 24 20 q0 17 -20 22 l0 8" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="24" cy="37" r="3" fill="#ffd166" />
          </g>
        )}
        {/* le chercheur, debout près des machines */}
        <g transform="translate(852,380)">
          <Figure x={0} y={50} s={0.77} facing="left" skin="#e0b090" hair="#8a7a68" look="short" glasses mood="content"
            garment="coat" coat="#5a6a7a" pants="#2a3038" shoes="#141418" arms={[{ a1: 60, a2: 30 }, { a1: 10, a2: 6 }]} />
        </g>
      </PLayer>

      {/* ═══ premier plan : les bureaux, les machines, les pièces ═══ */}
      <PLayer depth={3}>
        <rect y="404" width="1000" height="156" fill="url(#lb-floor)" />
        <rect y="406" width="1000" height="154" fill="#14161c" opacity="0.32" filter="url(#lb-grain)" />
        <path d="M0 448 h1000 M0 500 h1000 M160 404 v156 M400 404 v156 M640 404 v156 M880 404 v156" stroke="#1c1f24" strokeWidth="1.4" opacity="0.5" />

        {/* la grande paillasse */}
        <rect x="60" y="430" width="700" height="14" rx="3" fill="url(#lb-desk)" />
        <rect x="76" y="444" width="12" height="48" fill="#3a3e46" /><rect x="732" y="444" width="12" height="48" fill="#3a3e46" />

        {/* APPARAÎT : les liens du réseau qui courent d'un poste à l'autre */}
        {net && (
          <g style={{ animation: "pulse 0.9s ease-out 2" }}>
            <ellipse cx="420" cy="400" rx="360" ry="70" fill="url(#lb-netglow)" />
            <path d="M180 400 Q300 356 420 400 Q540 356 660 400" stroke="#5eff9e" strokeWidth="2.5" fill="none" opacity="0.9" />
            {/* des paquets de données qui filent dans les deux sens */}
            <circle r="4" fill="#5eff9e">
              <animateMotion dur="2.2s" repeatCount="indefinite" path="M180 400 Q300 356 420 400 Q540 356 660 400" />
            </circle>
            <circle r="4" fill="#7fd8ff">
              <animateMotion dur="2.6s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear" path="M180 400 Q300 356 420 400 Q540 356 660 400" />
            </circle>
          </g>
        )}

        {/* LES TROIS POSTES : micro-ordinateurs beiges */}
        {POSTES.map((x, i) => (
          <g key={i} transform={`translate(${x},400)`}>
            {/* l'écran */}
            <rect x="-38" y="-46" width="76" height="58" rx="5" fill="#c8c2b0" />
            <rect x="-38" y="-46" width="76" height="58" rx="5" fill="#2c2820" opacity="0.2" filter="url(#lb-grain)" />
            <rect x="-30" y="-39" width="60" height="42" rx="2" fill={net ? "#0e2a18" : "#14161a"} />
            {/* le contenu de l'écran : lignes seules, ou reliées au réseau */}
            {net ? (
              <g fill="#5eff9e" fontFamily="ui-monospace,monospace" fontSize="5">
                <text x="-26" y="-30">CONNECTE</text>
                <text x="-26" y="-22">{"> www"}</text>
                <path d="M-26 -16 h52 M-26 -10 h40 M-26 -4 h48" stroke="#5eff9e" strokeWidth="1" opacity="0.7" />
                <circle cx="22" cy="-32" r="2" fill="#5eff9e" style={{ animation: "pulse 1.2s infinite" }} />
              </g>
            ) : (
              <g>
                <path d="M-26 -30 h22 M-26 -23 h30 M-26 -16 h14" stroke="#3a6a4a" strokeWidth="1.4" opacity="0.8" />
                <rect x="-26" y="-10" width="5" height="6" fill="#5eff9e" opacity="0.8" style={{ animation: "pulse 1.1s steps(2) infinite" }} />
              </g>
            )}
            {/* le socle + le clavier */}
            <rect x="-14" y="12" width="28" height="6" fill="#a8a294" />
            <rect x="-40" y="18" width="80" height="12" rx="2" fill="#b8b2a2" />
            <path d="M-34 24 h68" stroke="#8a8578" strokeWidth="4" strokeDasharray="3 2" />
          </g>
        ))}

        {/* PIÈCE : le RÉSEAU (un rouleau de câble par terre) */}
        {!net && (
          <g transform="translate(500,506)">
            <ellipse cx="0" cy="10" rx="42" ry="8" fill="#101418" opacity="0.5" />
            <ellipse cx="0" cy="0" rx="38" ry="16" fill="none" stroke="#2a5a8a" strokeWidth="9" />
            <ellipse cx="0" cy="0" rx="26" ry="11" fill="none" stroke="#3a6ac8" strokeWidth="8" />
            <ellipse cx="0" cy="0" rx="14" ry="6" fill="none" stroke="#2a5a8a" strokeWidth="7" />
            {/* un bout qui dépasse, avec sa prise */}
            <path d="M36 6 q26 8 44 -2" stroke="#3a6ac8" strokeWidth="6" fill="none" />
            <rect x="78" y="-2" width="14" height="10" rx="2" fill="#c8c2b0" />
          </g>
        )}

        {/* PIÈCE : le LASER (petit boîtier avec une diode) */}
        {!cd && (
          <g transform="translate(300,414)">
            <rect x="-24" y="-10" width="48" height="20" rx="3" fill="#3a3e46" />
            <rect x="-24" y="-10" width="48" height="20" rx="3" fill="#14161c" opacity="0.3" filter="url(#lb-grain)" />
            <circle cx="26" cy="0" r="5" fill="#c8483a" style={{ animation: "pulse 1.4s infinite" }} />
            <path d="M31 0 h20" stroke="#ff5a4a" strokeWidth="2" opacity="0.7" style={{ animation: "glow 1.4s infinite" }} />
            <rect x="-18" y="-5" width="10" height="4" rx="1" fill="#5eff9e" />
          </g>
        )}

        {/* PIÈCE : le DISQUE BRILLANT posé sur la paillasse */}
        {!cd && (
          <g transform="translate(600,420)">
            <ellipse cx="0" cy="4" rx="34" ry="9" fill="#101418" opacity="0.4" />
            <ellipse cx="0" cy="0" rx="34" ry="10" fill="url(#lb-cd)" opacity="0.9" style={{ animation: "glow 3s ease-in-out infinite" }} />
            <ellipse cx="0" cy="0" rx="34" ry="10" fill="none" stroke="#dfeaf2" strokeWidth="1" opacity="0.6" />
            <ellipse cx="0" cy="0" rx="9" ry="2.6" fill="#25282f" />
          </g>
        )}

        {/* APPARAÎT : LE LECTEUR CD, qui lit le disque au laser */}
        {cd && (
          <g transform="translate(590,404)" style={{ animation: "pulse 0.7s ease-out 2" }}>
            <ellipse cx="0" cy="18" rx="90" ry="40" fill="url(#lb-glow)" />
            {/* le boîtier + le tiroir ouvert */}
            <rect x="-62" y="-4" width="124" height="30" rx="3" fill="#3a3e46" />
            <rect x="-62" y="-4" width="124" height="30" rx="3" fill="#14161c" opacity="0.26" filter="url(#lb-grain)" />
            <rect x="-44" y="-14" width="88" height="12" rx="2" fill="#2a2e36" />
            {/* le disque qui tourne dans le tiroir */}
            <g transform="translate(0,-14)">
              <ellipse cx="0" cy="0" rx="34" ry="9" fill="url(#lb-cd)" opacity="0.95" style={{ animation: "glow 1.6s ease-in-out infinite" }} />
              <ellipse cx="0" cy="0" rx="9" ry="2.4" fill="#25282f" />
            </g>
            {/* le rayon laser qui vient lire le disque par en dessous */}
            <path d="M-16 6 L-2 -12" stroke="#ff5a4a" strokeWidth="2.5" opacity="0.9" style={{ animation: "pulse 1.2s infinite" }} />
            <circle cx="-16" cy="6" r="3" fill="#ff5a4a" style={{ animation: "glow 1.2s infinite" }} />
            {/* voyants + affichage */}
            <rect x="24" y="6" width="30" height="12" rx="2" fill="#101418" />
            <text x="39" y="15" textAnchor="middle" fontSize="7" fill="#5eff9e" fontFamily="ui-monospace,monospace" style={{ animation: "pulse 2s infinite" }}>CD</text>
            <circle cx="-50" cy="12" r="3" fill="#5eff9e" style={{ animation: "pulse 1.4s infinite" }} />
          </g>
        )}

        {/* LA BOÎTE DE DISQUETTES — l'objet HÉRITAGE pour le chapitre 9 */}
        <g transform="translate(830,496)">
          <ellipse cx="0" cy="26" rx="46" ry="8" fill="#101418" opacity="0.45" />
          {/* la boîte de rangement */}
          <path d="M-42 22 L-38 -6 L38 -6 L42 22 Z" fill="#4a4e56" />
          <path d="M-42 22 L-38 -6 L38 -6 L42 22 Z" fill="#14161c" opacity="0.28" filter="url(#lb-grain)" />
          {/* les disquettes rangées, en éventail */}
          {[-22, -8, 6, 20].map((x, i) => (
            <g key={i} transform={`translate(${x},-20) rotate(${-6 + i * 4})`}>
              <rect x="-13" y="-14" width="26" height="26" rx="1.5" fill={i % 2 ? "#2a2e36" : "#343842"} />
              <rect x="-8" y="-13" width="16" height="9" rx="1" fill="#b8bcc4" />
              <rect x="-5" y="-13" width="8" height="7" fill="#6a6e76" />
              <rect x="-9" y="3" width="18" height="7" rx="1" fill="#e8e4da" opacity="0.85" />
            </g>
          ))}
        </g>
      </PLayer>

      <rect width="1000" height="560" fill="#0e1016" opacity="0.06" style={{ pointerEvents: "none" }} />

      {/* ═══ zones cliquables ═══ */}
      <Hotspot cx={852} cy={366} r={50} label="le chercheur" reveal={reveal} onClick={() => action("berners")} />
      {!cd && (
        <>
          <Hotspot cx={300} cy={414} r={34} label="laser" item="laser" reveal={reveal} onClick={() => collect("laser")} />
          <Hotspot cx={600} cy={418} r={38} label="disque brillant" item="disque_optique" reveal={reveal} onClick={() => collect("disque_optique")} />
        </>
      )}
      {!net && (
        <>
          <Hotspot cx={420} cy={378} r={46} label="ordinateurs" item="ordinateurs" reveal={reveal} onClick={() => collect("ordinateurs")} />
          <Hotspot cx={500} cy={504} r={46} label="réseau" item="reseau" reveal={reveal} onClick={() => collect("reseau")} />
        </>
      )}
      {/* la disquette : TOUJOURS ramassable (objet héritage du chapitre 9) */}
      <Hotspot cx={830} cy={478} r={44} label="disquette" item="disquette" reveal={reveal} onClick={() => collect("disquette")} />
    </svg>
  );
}
