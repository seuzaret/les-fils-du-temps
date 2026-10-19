import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";
import { Clouds, Glitter, Grass, Hill, Rock, rng } from "../../../engine/scenery.jsx";

/* ============================================================
   CHAPITRE 7 — Tableau : la STATION MARCONI (côte, nuit du 15 avril 1912)
   ------------------------------------------------------------
   Nuit sur une station côtière de TSF. Au large, un navire (invisible
   depuis ici) coule dans l'Atlantique. Marconi capte les bips de
   détresse : parmi tous les outils de son établi, lequel peut porter
   secours SANS AUCUN FIL, à travers la mer et la nuit ? Cliquer sur
   l'établi ouvre le mini-jeu (choisir l'antenne).
   ============================================================ */

export default function SceneTSF({ collect, action, reveal, made = [], queteQui }) {
  const sos = made.includes("msg_sos");    // l'appel est parti → secours en route

  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ts-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0e1636" /><stop offset="60%" stopColor="#243a5e" /><stop offset="100%" stopColor="#3e5a6e" /></linearGradient>
        <radialGradient id="ts-moon" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#eef2f6" /><stop offset="55%" stopColor="#cdd8e0" stopOpacity="0.5" /><stop offset="100%" stopColor="#cdd8e0" stopOpacity="0" /></radialGradient>
        <linearGradient id="ts-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#26445e" /><stop offset="100%" stopColor="#0e2438" /></linearGradient>
        <linearGradient id="ts-cliff" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2e3540" /><stop offset="100%" stopColor="#161c26" /></linearGradient>
        <radialGradient id="ts-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#7fd8ff" stopOpacity="0.5" /><stop offset="100%" stopColor="#7fd8ff" stopOpacity="0" /></radialGradient>
        <filter id="ts-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" /></filter>
        <linearGradient id="ts-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#fff4c8" stopOpacity="0.5" /><stop offset="100%" stopColor="#fff4c8" stopOpacity="0" /></linearGradient>
        <filter id="ts-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* ═══ ciel de nuit ═══ */}
      <rect width="1000" height="560" fill="url(#ts-sky)" />
      {/* la Voie lactée, et un semis d'étoiles */}
      <ellipse cx="640" cy="120" rx="460" ry="46" fill="#8a9ac8" opacity="0.12" filter="url(#ts-blur)" transform="rotate(-16 640 120)" />
      {(() => { const r = rng(731); return Array.from({ length: 90 }, (_, i) => (
        <circle key={`s${i}`} cx={(r() * 1000).toFixed(0)} cy={(r() * 300).toFixed(0)} r={r() < 0.12 ? 1.3 : 0.7} fill="#fff" opacity={(0.3 + r() * 0.5).toFixed(2)} />
      )); })()}
      {[[120, 60], [260, 40], [420, 80], [600, 50], [720, 90], [880, 44], [950, 110], [340, 110], [520, 30]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.4" fill="#fff" opacity="0.85" style={{ animation: `twinkle ${2 + (i % 3)}s infinite` }} />
      ))}
      <Clouds id="ts-cl" seed={733} items={[[460, 170, 220], [800, 96, 170], [640, 250, 130], [80, 250, 140]]} color="#2e3c5c" shadow="#16203a" opacity={0.75} drift={18} />
      <circle cx="180" cy="130" r="90" fill="url(#ts-moon)" />
      <circle cx="180" cy="130" r="34" fill="#eef2f6" />
      <circle cx="168" cy="122" r="6" fill="#d0d8e0" opacity="0.6" />

      {/* ═══ couche lointaine : la mer + le navire (en détresse, puis secouru) ═══ */}
      <PLayer depth={1}>
        <rect y="330" width="1000" height="120" fill="url(#ts-sea)" />
        <rect y="326" width="1000" height="10" fill="#5a7088" opacity="0.4" filter="url(#ts-blur)" />
        <Glitter x={180} y0={340} y1={448} w0={10} w1={110} color="#eef4fa" color2="#b8c8d8" blurId="ts-blur" />
        {/* le cap lointain et son PHARE, dont le pinceau balaie la nuit */}
        <Hill id="ts-cap" points={[[-40, 334], [10, 312], [70, 300], [130, 314], [210, 334]]} fill="#0e1622" lit="#22304a" light={-1} rim={3} bottom={340} />
        <g transform="translate(70,300)">
          <rect x="-4" y="-26" width="8" height="26" fill="#c8ccd4" />
          <rect x="-4" y="-18" width="8" height="4" fill="#8a3028" /><rect x="-4" y="-8" width="8" height="4" fill="#8a3028" />
          <rect x="-6" y="-32" width="12" height="6" fill="#2a3038" />
          <circle cx="0" cy="-29" r="3" fill="#fff4c8" />
          <circle cx="0" cy="-29" r="12" fill="#fff4c8" opacity="0.35" filter="url(#ts-blur)" />
          <g>
            <animateTransform attributeName="transform" type="rotate" values="0 0 -29; 360 0 -29" dur="8s" repeatCount="indefinite" />
            <path d="M0 -29 L260 -50 L260 -8 Z" fill="url(#ts-beam)" opacity="0.6" />
          </g>
        </g>
        {[348, 372, 398].map((y, i) => (
          <path key={i} d={`M0 ${y} q120 ${i % 2 ? 4 : -4} 240 0 t240 0 t240 0 t240 0`} stroke="#5a7a8a" strokeWidth="1.4" fill="none" opacity="0.4" style={{ animation: `ripple ${3 + (i % 3)}s ease-in-out infinite` }} />
        ))}

        {/* APPARAÎT : le bateau de secours qui accourt (une fois le SOS envoyé) */}
        {sos && (
          <g transform="translate(560,352)" style={{ animation: "pulse 0.9s ease-out 2" }}>
            <path d="M-46 4 Q0 16 46 4 L38 16 Q0 24 -38 16 Z" fill="#12202c" />
            <rect x="-34" y="-10" width="68" height="14" fill="#1e2c3a" />
            {[-20, -2, 16].map((x, i) => <rect key={i} x={x} y="-22" width="7" height="12" rx="2" fill="#2a2018" />)}
            {/* projecteur de secours braqué vers le naufrage */}
            <path d="M40 -12 L120 -30 L120 6 Z" fill="#ffe9a8" opacity="0.28" style={{ animation: "glow 1.6s ease-in-out infinite" }} />
            {[-28, -14, 0, 14, 28].map((x, i) => <circle key={i} cx={x} cy="-3" r="1.8" fill="#ffd166" />)}
          </g>
        )}

        {/* LE PAQUEBOT (Titanic) : il gîte et lance ses feux, en tanguant
            doucement sur les vagues (bercement SMIL avec un peu de rotation
            supplementaire de -3 a +3 degres autour de son inclinaison de base). */}
        <g transform="translate(800,368)">
          <g>
            <animateTransform attributeName="transform" type="rotate"
              values={`${sos ? -7 : -13} 0 0; ${sos ? -1 : -7} 0 0; ${sos ? -7 : -13} 0 0`}
              dur="5s" repeatCount="indefinite" />
            <path d="M-70 6 Q0 22 70 6 L58 22 Q0 32 -58 22 Z" fill="#0e1620" />
            <rect x="-52" y="-14" width="104" height="20" fill="#1a2430" />
            {[-30, -8, 14, 34].map((x, i) => <rect key={i} x={x} y="-30" width="10" height="18" rx="2" fill="#2a2018" />)}
            {[-44, -30, -16, -2, 12, 26, 40].map((x, i) => (
              <circle key={i} cx={x} cy="-4" r="2" fill="#ffd166" opacity="0.9" style={{ animation: `twinkle ${1.4 + (i % 3) * 0.5}s infinite` }} />
            ))}
            {/* fusée de détresse — seulement tant qu'il n'est pas secouru */}
            {!sos && (
              <g>
                <path d="M50 -30 q10 -30 4 -56" stroke="#ff6a4a" strokeWidth="2" fill="none" opacity="0.7" />
                <circle cx="55" cy="-88" r="3" fill="#ffd166" style={{ animation: "pulse 1.2s infinite" }} />
              </g>
            )}
          </g>
        </g>

        {/* ICEBERG qui derive doucement sur la mer, en travers du champ.
            Silhouette blanche irreguliere avec une partie immergee bleutee. */}
        <g opacity="0.9">
          <animateTransform attributeName="transform" type="translate"
            values="-80,0; 1080,20; -80,0" dur="90s" repeatCount="indefinite" />
          <g transform="translate(0,378)">
            {/* partie immergee, plus bleutee et effacee */}
            <path d="M-24 6 Q-20 22 -8 24 L14 24 Q22 22 22 6 Z" fill="#7ab0c8" opacity="0.55" />
            {/* partie visible : glace claire */}
            <path d="M-22 6 L-14 -18 L-6 -6 L4 -22 L14 -12 L20 6 Z" fill="#e8f4f8" stroke="#8ab0c4" strokeWidth="0.6" />
            {/* facettes et ombres */}
            <path d="M-14 -18 L-6 -6 L-14 4 Z" fill="#c8dae2" opacity="0.7" />
            <path d="M4 -22 L14 -12 L4 6 Z" fill="#c8dae2" opacity="0.5" />
            {/* reflet blanc au sommet */}
            <path d="M-8 -14 L-2 -18 L2 -14 Z" fill="#ffffff" opacity="0.9" />
            {/* petit sillage clair */}
            <path d="M22 8 q10 -2 16 -6" stroke="#c8dae2" strokeWidth="1" fill="none" opacity="0.6" />
          </g>
        </g>
      </PLayer>

      {/* ═══ couche intermédiaire : le mât (une fois branche) + les ondes ═══ */}
      <PLayer depth={2}>
        {/* le grand mât (l'antenne) — APPARAIT une fois qu'on l'a branche */}
        {sos && (
          <g transform="translate(430,400)">
            <path d="M-4 0 L-10 -230 L10 -230 L4 0 Z" fill="#2a3038" />
            {[...Array(8)].map((_, i) => <path key={i} d={`M${-9 + i * 0.6} ${-30 - i * 25} h${18 - i * 1.2}`} stroke="#3a424c" strokeWidth="2" />)}
            <path d="M0 -230 L-90 0 M0 -230 L90 0" stroke="#2a3038" strokeWidth="1.4" opacity="0.7" />
            <path d="M0 -228 q120 6 260 -10" stroke="#3a424c" strokeWidth="1.4" fill="none" opacity="0.7" />
          </g>
        )}

        {/* APRÈS : la station ÉMET pour de bon — grandes ondes vers le large */}
        {sos && (
          <g style={{ animation: "pulse 0.7s ease-out 2" }}>
            <circle cx="430" cy="178" r="90" fill="url(#ts-glow)" />
            <g transform="translate(430,178)" fill="none" stroke="#7fd8ff">
              {[30, 54, 80, 108, 138].map((r, i) => (
                <g key={i} style={{ animation: `pulse ${1.6 + i * 0.35}s infinite` }}>
                  <path d={`M${r * 0.6} -${r * 0.55} A${r} ${r} 0 0 1 ${r * 0.6} ${r * 0.55}`} strokeWidth="3" opacity={0.95 - i * 0.13} />
                </g>
              ))}
              {[30, 54, 80].map((r, i) => (
                <g key={`l${i}`} style={{ animation: `pulse ${1.6 + i * 0.35}s infinite` }}>
                  <path d={`M-${r * 0.6} -${r * 0.55} A${r} ${r} 0 0 0 -${r * 0.6} ${r * 0.55}`} strokeWidth="2.4" opacity={0.55 - i * 0.12} />
                </g>
              ))}
            </g>
            {/* l'étincelle de l'émetteur */}
            <circle cx="430" cy="172" r="4" fill="#eaf8ff" style={{ animation: "spark 0.9s linear infinite" }} />
          </g>
        )}
      </PLayer>

      {/* ═══ premier plan : la falaise, la cabine, MARCONI ═══ */}
      <PLayer depth={3}>
        <path d="M0 560 L0 440 Q250 424 520 442 Q760 458 1000 436 L1000 560 Z" fill="url(#ts-cliff)" />
        <path d="M0 560 L0 440 Q250 424 520 442 Q760 458 1000 436 L1000 560 Z" fill="#0a0e14" opacity="0.4" filter="url(#ts-grain)" />

        {/* le bord de la falaise : herbes rases en silhouette, rochers */}
        {Array.from({ length: 40 }).map((_, i) => {
          const x = i * 26 + ((i * 7) % 11), y = 440 - 8 * Math.sin((x / 1000) * Math.PI) + (x > 520 ? (x - 520) * 0.02 : 0);
          return <path key={i} d={`M${x} ${y + 4} l2 -${6 + (i % 4) * 2} l2 ${6 + (i % 4) * 2} l3 -${4 + (i % 3) * 2} l2 ${4 + (i % 3) * 2}`} fill="#1a2028" />;
        })}
        <Rock x={620} y={470} w={64} h={26} color="#252c36" light={-1} seed={741} />
        <Rock x={900} y={500} w={90} h={36} color="#222932" light={-1} seed={742} moss="#24301e" />
        <Rock x={60} y={520} w={70} h={28} color="#222932" light={-1} seed={743} />
        <Grass x={700} y={500} s={1.1} color="#1c2418" seed={744} n={7} />
        <Grass x={330} y={540} s={1.3} color="#1c2418" seed={745} n={8} />
        {/* le poteau de la ligne télégraphique terrestre, relié à la cabine */}
        <g transform="translate(120,452)">
          <rect x="-4" y="-150" width="8" height="150" fill="#2a2018" />
          <rect x="-26" y="-140" width="52" height="5" fill="#2a2018" />
          {[-22, -8, 8, 22].map((x) => <rect key={x} x={x - 2} y="-147" width="4" height="7" rx="1.5" fill="#8a9aa8" />)}
          <path d="M-22 -147 Q150 -110 296 -48 M22 -147 Q170 -104 300 -44" stroke="#0a0e14" strokeWidth="1" fill="none" />
        </g>
        {/* la lueur de la fenêtre sur le sol */}
        <ellipse cx="420" cy="500" rx="80" ry="14" fill="#ffcf78" opacity="0.18" filter="url(#ts-blur)" />

        {/* la cabine de TSF */}
        <g transform="translate(430,470)">
          {/* cheminée qui fume */}
          <rect x="24" y="-66" width="10" height="20" fill="#1c222a" />
          <path d="M29 -66 q-8 -12 2 -22 q8 -10 -2 -20" stroke="#5a6878" strokeWidth="5" fill="none" opacity="0.35" filter="url(#ts-blur)" style={{ animation: "drift 6s ease-in-out infinite" }} />
          <rect x="-46" y="-40" width="92" height="60" rx="3" fill="#2a3038" />
          {[-30, -18, -6, 6].map((y, r) => <path key={y} d={`M-46 ${y} h92`} stroke="#1c222a" strokeWidth="1" opacity="0.7" />)}
          {[-30, -18, -6].map((y, r) => [-34, -10, 14, 38].map((x) => <path key={`${y}-${x}`} d={`M${x + (r % 2) * 12} ${y} v12`} stroke="#1c222a" strokeWidth="1" opacity="0.6" />))}
          <path d="M-52 -40 L0 -66 L52 -40 Z" fill="#1c222a" />
          <rect x="-26" y="-28" width="30" height="24" fill="#ffcf78" opacity="0.85" />
          <path d="M-26 -16 h30 M-11 -28 v24" stroke="#3a2c1c" strokeWidth="2" />
          <circle cx="-11" cy="-14" r="5" fill="#3a2c1c" />
          <path d="M-16 -16 a5 5 0 0 1 10 0" stroke="#2a2018" strokeWidth="2" fill="none" />
          <rect x="18" y="-18" width="16" height="38" fill="#12161c" />
          {/* lanterne à la porte */}
          <path d="M40 -26 h6 v4" stroke="#1a1410" strokeWidth="1.6" fill="none" />
          <rect x="42" y="-22" width="8" height="10" rx="2" fill="#ffd88a" opacity="0.9" style={{ animation: "glow 2.6s ease-in-out infinite" }} />
          <circle cx="46" cy="-17" r="12" fill="#ffd88a" opacity="0.25" filter="url(#ts-blur)" />
        </g>
        {sos && <path d="M424 440 l6 -40 l6 40 Z" fill="#2a3038" />}

        {/* « ? » de Marconi (tant qu'il guide) */}

        {/* MARCONI : il scrute la nuit vers le navire */}
        <g transform="translate(238,494)">
          <Figure x={0} y={32} s={0.819} facing="right" skin="#d0a67e" hair="#1a1008" look="slick" mustache mood="vexe"
            garment="coat" coat="#26303e" pants="#1a2028" shoes="#0a0e14" arms={[{ a1: 10, a2: 6 }, { a1: 110, a2: 100 }]}>
            {/* casque d'écoute sur les oreilles */}
            <path d="M-14 -108 A14 14 0 0 1 14 -108" stroke="#4a5460" strokeWidth="3" fill="none" />
            <circle cx="-13.6" cy="-104" r="4.2" fill="#4a5460" /><circle cx="13.6" cy="-104" r="4.2" fill="#4a5460" />
          </Figure>
        </g>

      </PLayer>

      <rect width="1000" height="560" fill="#0a1020" opacity="0.08" style={{ pointerEvents: "none" }} />

      {/* ═══ zones cliquables ═══ */}
      <Hotspot cx={238} cy={445} r={60} label="Marconi" reveal={reveal} onClick={() => action("marconi")} />
      {/* la porte de la cabine : ouvre l'etabli d'outils tant qu'on n'a
          pas encore recupere quelque chose la-bas et que le sos n'est pas
          parti. Reste cliquable meme si on a deja gagne l'antenne, pour
          repartir dans le mini-jeu si on veut. */}
      {!sos && (
        <Hotspot cx={430} cy={475} r={44} label="la porte" reveal={reveal} onClick={() => action("outils")} />
      )}
      {/* le TOIT de la cabine : cible pour brancher l'antenne (n'apparait
          qu'une fois l'antenne dans la besace). */}
      {made.includes("antenne") && !sos && (
        <Hotspot cx={430} cy={425} r={40} label="le toit — poser l'antenne" item="station_marconi" reveal={reveal} onClick={() => collect("station_marconi")} />
      )}
    </svg>
  );
}
