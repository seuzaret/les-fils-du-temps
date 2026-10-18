import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 2 · Tableau 3 — Les artisans de la cité  (PEINTURE FINE)
   La place du marché, au pied du grand mur. À GAUCHE : Jala la
   potière, son échoppe, son tour, son four, ses pigments. À DROITE :
   Ahmid le marchand et son troupeau. Lumière chaude d'après-midi.
   ============================================================ */

export default function SceneArtisans({ collect, action, reveal, made = [], queteQui }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ar-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#88a6c4" /><stop offset="55%" stopColor="#cdd8d4" /><stop offset="100%" stopColor="#f0e6cc" /></linearGradient>
        <linearGradient id="ar-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#cdb184" /><stop offset="100%" stopColor="#8f7048" /></linearGradient>
        <linearGradient id="ar-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c2a066" /><stop offset="100%" stopColor="#7a5e3a" /></linearGradient>
        <linearGradient id="ar-house" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f2ece0" /><stop offset="100%" stopColor="#d8cdb6" /></linearGradient>
        <radialGradient id="ar-fire" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffc068" stopOpacity="0.7" /><stop offset="100%" stopColor="#ff9540" stopOpacity="0" /></radialGradient>
        <radialGradient id="ar-sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff2d0" stopOpacity="0.6" /><stop offset="100%" stopColor="#fff2d0" stopOpacity="0" /></radialGradient>
        <filter id="ar-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="ar-mottle" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="ar-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>

      {/* ═══ ciel + soleil bas ═══ */}
      <rect width="1000" height="560" fill="url(#ar-sky)" />
      <ellipse cx="500" cy="120" rx="360" ry="240" fill="url(#ar-sun)" />

      {/* ═══ fond lointain : le grand mur + les maisons blanches ═══ */}
      <PLayer depth={1}>
        {/* le grand mur de la cité */}
        <rect y="150" width="1000" height="210" fill="url(#ar-wall)" />
        <rect y="150" width="1000" height="210" fill="#5a4022" opacity="0.22" filter="url(#ar-mottle)" />
        <path d="M0 158 h1000 M0 214 h1000 M0 272 h1000 M0 326 h1000" stroke="#7a5c34" strokeWidth="1.6" opacity="0.4" />
        {[80, 300, 540, 780].map((x, i) => <path key={i} d={`M${x} 150 v210`} stroke="#7a5c34" strokeWidth="1.4" opacity="0.3" />)}
        {Array.from({ length: 20 }).map((_, i) => <rect key={i} x={i * 52} y="136" width="30" height="16" fill="#b59662" stroke="#8a6e46" strokeWidth="0.5" />)}
        <rect x="466" y="92" width="74" height="60" fill="#b89a66" /><rect x="466" y="84" width="74" height="12" fill="#9a7e52" />
        {[478, 500, 522].map((x, i) => <rect key={i} x={x} y="78" width="12" height="8" fill="#a88a5a" />)}

        {/* MAISONS BLANCHES aux toits carrés (façon Çatalhöyük), échelles au toit */}
        {[[110, 300, 0.95], [200, 288, 1.1], [292, 306, 0.85], [720, 296, 1.0], [812, 306, 0.9], [896, 292, 0.8]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
            <rect x="-30" y="0" width="60" height="56" fill="url(#ar-house)" />
            <rect x="-30" y="0" width="60" height="56" fill="#8a7a5a" opacity="0.14" filter="url(#ar-grain)" />
            <rect x="-30" y="0" width="60" height="9" fill="#cfc4ac" />
            <rect x="-30" y="0" width="60" height="56" fill="none" stroke="#c2b79c" strokeWidth="1" />
            <rect x="-8" y="30" width="16" height="26" fill="#5a4a36" />
            <rect x="-6" y="32" width="12" height="22" fill="#3a2e1e" />
            <path d="M-20 0 l4 -15 M-14 0 l4 -15 M-19 -4 h5 M-18 -8 h5 M-17 -12 h5" stroke="#8a7a5a" strokeWidth="1.2" />
            <path d="M12 8 h14" stroke="#b0a488" strokeWidth="1" opacity="0.6" />
          </g>
        ))}
      </PLayer>

      {/* ═══ le sol de la place ═══ */}
      <PLayer depth={2}>
        <rect y="352" width="1000" height="208" fill="url(#ar-ground)" />
        <rect y="352" width="1000" height="208" fill="#4a3620" opacity="0.28" filter="url(#ar-mottle)" />
        <path d="M0 430 h1000 M0 500 h1000" stroke="#5a442a" strokeWidth="1.4" opacity="0.3" />
        <ellipse cx="500" cy="470" rx="470" ry="64" fill="#5a4426" opacity="0.24" />
        {/* quelques pavés / cailloux */}
        {[[420, 428], [560, 448], [640, 420], [340, 456], [480, 512]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="9" ry="4" fill="#8a6e46" opacity="0.4" />)}

        {/* ═══ CÔTÉ POTIÈRE (gauche) ═══ */}
        {/* L'ÉCHOPPE : auvent de toile + étagère de pots */}
        <g transform="translate(256,392)">
          <ellipse cx="0" cy="66" rx="70" ry="10" fill="#3a2814" opacity="0.28" />
          <rect x="-56" y="-10" width="7" height="72" fill="#6e4c2e" /><rect x="-56" y="-10" width="7" height="72" fill="#8a6642" opacity="0.5" />
          <rect x="50" y="-10" width="7" height="72" fill="#6e4c2e" />
          <path d="M-70 -10 L70 -10 L54 -36 L-54 -36 Z" fill="#c07a44" />
          <path d="M-70 -10 L70 -10 L54 -36 L-54 -36 Z" fill="#7a4a26" opacity="0.3" filter="url(#ar-grain)" />
          {[-48, -24, 0, 24, 48].map((x, i) => <path key={i} d={`M${x} -10 l5 -24`} stroke="#e6dcc4" strokeWidth="4" opacity="0.45" />)}
          <path d="M-70 -10 L70 -10" stroke="#5a3620" strokeWidth="2" opacity="0.5" />
          {/* étagère */}
          <rect x="-52" y="22" width="104" height="7" fill="#5a3f24" />
          <rect x="-52" y="22" width="104" height="3" fill="#7a5a3a" />
          {[-40, -15, 12, 38].map((x, i) => (
            <g key={i} transform={`translate(${x},14)`}>
              <path d="M-8 -2 Q-9 7 0 8 Q9 7 8 -2 Z" fill="#b5623a" /><ellipse cx="0" cy="-2" rx="7" ry="2.6" fill="#9a5030" />
              <path d="M-6 2 h12" stroke="#e6d8bc" strokeWidth="1" opacity="0.5" />
            </g>
          ))}
        </g>

        {/* le four à poterie, rougeoyant */}
        <g transform="translate(150,448)">
          <ellipse cx="0" cy="46" rx="84" ry="26" fill="url(#ar-fire)" style={{ animation: "glow 2.6s ease-in-out infinite" }} />
          <ellipse cx="0" cy="44" rx="46" ry="12" fill="#3a2414" />
          <path d="M-42 42 Q-50 -10 0 -16 Q50 -10 42 42 Z" fill="#8a6238" />
          <path d="M-42 42 Q-50 -10 0 -16 Q50 -10 42 42 Z" fill="#4a3018" opacity="0.3" filter="url(#ar-grain)" />
          <path d="M-24 42 Q-26 2 0 -2 Q26 2 24 42 Z" fill="#2e1c0e" />
          <path d="M-15 42 Q-17 14 0 10 Q17 14 15 42 Z" fill="#ff8a3c" style={{ animation: "glow 1.7s ease-in-out infinite" }} />
          <path d="M-8 40 Q-9 20 0 16 Q9 20 8 40 Z" fill="#ffd36a" />
          <circle cx="0" cy="28" r="4" fill="#fff2c4" />
          {/* fumée */}
          <ellipse cx="6" cy="-24" rx="10" ry="16" fill="#d8cebc" opacity="0.28" style={{ animation: "drift 4s ease-in-out infinite" }} filter="url(#ar-blur)" />
        </g>

        {/* le tour du potier (plateau + pied) */}
        <g transform="translate(330,470)">
          <ellipse cx="0" cy="34" rx="30" ry="8" fill="#2a1c10" opacity="0.4" />
          <rect x="-6" y="6" width="12" height="30" fill="#5a3f24" />
          <ellipse cx="0" cy="8" rx="28" ry="8" fill="#5a3f24" />
          <ellipse cx="0" cy="3" rx="28" ry="9" fill="#9a7a52" />
          <ellipse cx="0" cy="1" rx="28" ry="8" fill="#b0906035" />
          <ellipse cx="0" cy="2" rx="11" ry="3.5" fill="#6e5236" opacity="0.7" />
          <ellipse cx="0" cy="1" rx="22" ry="6" fill="none" stroke="#7a5a3a" strokeWidth="1" opacity="0.4" />
        </g>

        {/* pots de pigments colorés */}
        <g transform="translate(432,506)">
          <ellipse cx="4" cy="8" rx="46" ry="7" fill="#2a1c10" opacity="0.3" />
          {[["#c8382e", -22], ["#2a6a9a", -5], ["#e0b040", 12], ["#3a8a4a", 29]].map(([c, dx], i) => (
            <g key={i} transform={`translate(${dx},0)`}>
              <path d="M-8 -2 Q-10 9 0 10 Q10 9 8 -2 Z" fill="#7a5636" /><ellipse cx="0" cy="-2" rx="7" ry="3" fill={c} />
              <ellipse cx="-2" cy="-3" rx="3" ry="1.4" fill="#ffffff" opacity="0.3" />
            </g>
          ))}
        </g>

        {/* JALA la potière, penchée sur son ouvrage */}
        <g transform="translate(258,468)">
          <ellipse cx="0" cy="28" rx="22" ry="6" fill="#2a1c10" opacity="0.4" />
          <Figure x={0} y={28} s={0.53} facing="right" skin="#cf9f72" hair="#4a3020" look="bun" hat="headband" hatColor="#b84828" mood="content"
            garment="dress" coat="#3a6a8a" apron="#b09878" pants="#3a2818" arms={[{ a1: 10, a2: 6 }, { a1: 40, a2: 72 }]} />
        </g>
        {queteQui === "jala" && (
          <g transform="translate(240,372)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
          </g>
        )}
        {/* RÉSULTAT : la poterie ornée exposée fièrement */}
        {made.includes("msg_poterie") && (
          <g transform="translate(206,502)" style={{ animation: "fadein 1s ease-out" }}>
            <ellipse cx="0" cy="32" rx="24" ry="7" fill="#2a1c10" opacity="0.4" />
            <path d="M-20 -8 Q-27 4 -18 22 Q-10 33 0 33 Q10 33 18 22 Q27 4 20 -8 Q10 -17 0 -17 Q-10 -17 -20 -8 Z" fill="#b5623a" />
            <path d="M-20 -8 Q-27 4 -18 22 Q-10 33 0 33 Q10 33 18 22 Q27 4 20 -8 Q10 -17 0 -17 Q-10 -17 -20 -8 Z" fill="#8a4626" opacity="0.25" filter="url(#ar-grain)" />
            <path d="M-14 -14 Q0 -20 14 -14 L12 -8 Q0 -12 -12 -8 Z" fill="#9a5030" />
            <path d="M-18 2 l6 -5 l6 5 l6 -5 l6 5" stroke="#2c1810" strokeWidth="2.2" fill="none" />
            <path d="M-18 11 h36" stroke="#efe0c4" strokeWidth="2.6" opacity="0.85" />
            <circle cx="0" cy="21" r="3" fill="#e8e0d0" stroke="#c8b090" strokeWidth="1" />
            <path d="M-13 26 q13 5 26 0" stroke="#2c1810" strokeWidth="1.6" fill="none" opacity="0.6" />
          </g>
        )}

        {/* ═══ CÔTÉ MARCHAND (droite) ═══ */}
        {/* le troupeau (moutons) — chacun bouge doucement d'avant en
            arriere autour de sa position, timings decales pour eviter
            l'effet de synchronisation ridicule. */}
        <g transform="translate(800,476)">
          {[[-42, 2, 3.5, 0], [2, 10, 4, 0.7], [42, -4, 3, 1.4], [72, 12, 4.5, 2.1]].map(([dx, dy, dur, off], i) => (
            <g key={i}>
              <animateTransform attributeName="transform" type="translate"
                values={`${dx - 3},${dy}; ${dx + 3},${dy}; ${dx - 3},${dy}`}
                dur={`${dur}s`} begin={`${off}s`} repeatCount="indefinite" />
              <ellipse cx="0" cy="15" rx="20" ry="5" fill="#2a1c10" opacity="0.35" />
              <ellipse cx="0" cy="0" rx="19" ry="14" fill="#e8e1d0" />
              <ellipse cx="0" cy="0" rx="19" ry="14" fill="#b0a488" opacity="0.2" filter="url(#ar-grain)" />
              {/* tete qui se penche pour brouter puis se releve */}
              <g style={{ transformOrigin: "10px 0px" }}>
                <animateTransform attributeName="transform" type="rotate"
                  values="0; 25; 0" dur={`${dur + 1.5}s`} begin={`${off}s`} repeatCount="indefinite" />
                <ellipse cx="15" cy="-4" rx="8" ry="7.5" fill="#4a3a2c" />
                <ellipse cx="18" cy="-5" rx="2" ry="2.5" fill="#2a2018" />
              </g>
              <path d="M-11 12 v9 M-3 13 v9 M6 13 v9 M15 10 v9" stroke="#4a3a2c" strokeWidth="3.2" strokeLinecap="round" />
            </g>
          ))}
        </g>
        {/* AHMID le marchand, main tendue vers ses bêtes */}
        <g transform="translate(680,470)">
          <ellipse cx="0" cy="30" rx="23" ry="6" fill="#2a1c10" opacity="0.4" />
          <Figure x={0} y={30} s={0.57} facing="right" skin="#b8885a" hair="#1a1408" hat="keffieh" hatColor="#e2d6bc" hatColor2="#5a3a20" mood="content"
            garment="robe" coat="#9a6432" pants="#5a3a20" arms={[{ a1: 8, a2: 4 }, { a1: 76, a2: 88 }]} />
        </g>
        {queteQui === "ahmid" && (
          <g transform="translate(662,372)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
          </g>
        )}
      </PLayer>

      {/* voile de grain global */}
      <rect width="1000" height="560" fill="#2a1e10" opacity="0.06" style={{ pointerEvents: "none" }} />

      {/* zones cliquables — personnages */}
      <Hotspot cx={258} cy={442} r={40} label="Jala, la potière" reveal={reveal} onClick={(p) => action("jala", p)} />
      <Hotspot cx={680} cy={444} r={40} label="Ahmid, le marchand" reveal={reveal} onClick={(p) => action("ahmid", p)} />
      {/* objets et supports */}
      <Hotspot cx={330} cy={454} r={40} label="le tour du potier" item="tour" reveal={reveal} onClick={() => collect("tour")} />
      <Hotspot cx={150} cy={448} r={50} label="le four" item="feu" reveal={reveal} onClick={() => collect("feu")} />
      <Hotspot cx={432} cy={500} r={40} label="pigments" item="pigments" reveal={reveal} onClick={() => collect("pigments")} />
      <Hotspot cx={810} cy={472} r={74} label="le troupeau" item="troupeau" reveal={reveal} onClick={() => collect("troupeau")} />
          {/* LUCIOLE qui danse autour du feu — point jaune-vert qui pulse */}
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="110,433; 130,408; 170,413; 190,438; 170,453; 130,448; 110,433"
          dur="12s" repeatCount="indefinite" />
        <circle r="4" fill="#eeff88" opacity="0.35">
          <animate attributeName="opacity" values="0.15;0.55;0.15" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="r" values="3;6;3" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <circle r="1.4" fill="#fffca8">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1.2s" repeatCount="indefinite" />
        </circle>
      </g>
</svg>
  );
}
