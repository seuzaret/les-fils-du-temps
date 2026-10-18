import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 3 — Tableau 1 : la cité d'Ur (tableau de départ)
   Peinture fine — ocre mésopotamien : ziggourat en briques crues,
   grenier, canal bordé de roseaux, four à tablettes. La QUÊTE :
   le roi Mesannepada (à gauche) accueille ; Narâm-Sîn (à droite),
   près de l'étable (bœufs + blé), a besoin d'un registre.
   À trouver : roseaux, couteau, argile, sceau, four, eau.
   ============================================================ */

export default function SceneUruk({ collect, action, reveal, made = [], queteQui, mode }) {
  const grave = made.includes("msg_cuneiforme");
  const aTablette = made.includes("tablette_vierge");
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="uk-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5f82" /><stop offset="42%" stopColor="#9a8a86" /><stop offset="74%" stopColor="#d0aa6e" /><stop offset="100%" stopColor="#eccb86" />
        </linearGradient>
        <radialGradient id="uk-sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff0c8" /><stop offset="50%" stopColor="#ffd888" stopOpacity="0.6" /><stop offset="100%" stopColor="#ffd888" stopOpacity="0" /></radialGradient>
        <linearGradient id="uk-brick" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c69a5e" /><stop offset="100%" stopColor="#9a6e3e" /></linearGradient>
        <linearGradient id="uk-brick2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#b8894e" /><stop offset="100%" stopColor="#8a5e34" /></linearGradient>
        <linearGradient id="uk-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c2a06a" /><stop offset="35%" stopColor="#a67c46" /><stop offset="100%" stopColor="#6e5230" /></linearGradient>
        <linearGradient id="uk-wool" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e6dcc4" /><stop offset="100%" stopColor="#c4b493" /></linearGradient>
        <filter id="uk-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="uk-mottle" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="uk-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7" /></filter>
      </defs>

      {/* ═══ ciel chaud et poussiéreux ═══ */}
      <rect width="1000" height="560" fill="url(#uk-sky)" />
      <circle cx="720" cy="170" r="150" fill="url(#uk-sun)" />
      <circle cx="720" cy="170" r="40" fill="#fff0c8" opacity="0.9" />
      <rect y="150" width="1000" height="120" fill="#d8b078" opacity="0.12" filter="url(#uk-blur)" />

      {/* ═══ couche lointaine : la ziggourat + palmiers ═══ */}
      <PLayer depth={1}>
        <path d="M0 300 Q250 288 500 298 Q750 308 1000 296 L1000 445 L0 445 Z" fill="#b89660" />
        <g transform="translate(250,300)">
          <path d="M-130 0 L130 0 L96 -40 L-96 -40 Z" fill="url(#uk-brick2)" />
          <path d="M-96 -40 L96 -40 L66 -78 L-66 -78 Z" fill="url(#uk-brick)" />
          <path d="M-66 -78 L66 -78 L40 -112 L-40 -112 Z" fill="url(#uk-brick2)" />
          <rect x="-14" y="-112" width="28" height="16" fill="#7a5230" />
          <path d="M-8 0 L8 0 L6 -112 L-6 -112 Z" fill="#8a6238" opacity="0.7" />
          {[0, -40, -78].map((y, i) => <path key={i} d={`M-120 ${y} h240`} stroke="#6e4c28" strokeWidth="1.5" opacity="0.3" />)}
        </g>
        {[[560, 300, 1], [900, 296, 0.85], [640, 302, 0.7]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
            <path d="M0 0 L-3 -60 L3 -60 Z" fill="#6e4c2e" />
            <path d="M0 -60 q-30 -6 -46 12 M0 -60 q30 -6 46 12 M0 -60 q-20 -22 -34 -30 M0 -60 q20 -22 34 -30 M0 -60 q0 -26 0 -40" stroke="#4a6a30" strokeWidth="4" fill="none" />
          </g>
        ))}
        {/* MILAN NOIR qui plane au-dessus de la cité — cercles lents, très
            oriental. Rotation autour d'un point du ciel, silhouette simple. */}
        <g opacity="0.7">
          <animateTransform attributeName="transform" type="rotate"
            values="0 500 120; 360 500 120" dur="34s" repeatCount="indefinite" />
          <g transform="translate(200,0)">
            <path d="M0 120 q-8 -3 -16 0 M0 120 q8 -3 16 0" stroke="#1a1408" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <ellipse cx="0" cy="120" rx="1.2" ry="2" fill="#1a1408" />
          </g>
        </g>
      </PLayer>

      {/* ═══ couche intermédiaire : bâtiments + l'étable ═══ */}
      <PLayer depth={2}>
        {/* le grenier à grain (centre-droit) */}
        <g transform="translate(560,362)">
          <ellipse cx="0" cy="70" rx="64" ry="12" fill="#3c2c18" opacity="0.4" />
          <path d="M-50 72 L-50 -6 Q0 -38 50 -6 L50 72 Z" fill="url(#uk-brick)" />
          <path d="M-50 72 L-50 -6 Q0 -38 50 -6 L50 72 Z" fill="#5c3f22" opacity="0.35" filter="url(#uk-grain)" />
          <path d="M-50 6 h100 M-50 30 h100 M-50 54 h100" stroke="#6e4c28" strokeWidth="1.5" opacity="0.4" />
          <path d="M-14 72 L-14 42 Q0 34 14 42 L14 72 Z" fill="#2c1c10" />
          <text x="0" y="-14" textAnchor="middle" fontSize="12" fill="#5c3f22" opacity="0.6" fontFamily="ui-monospace,monospace">𒀭</text>
        </g>

        {/* L'ÉTABLE du roi (droite) : enclos de briques, 2 bœufs, gerbes de blé */}
        <g transform="translate(850,392)">
          {/* enclos */}
          <path d="M-70 40 L-70 -6 L70 -6 L70 40" fill="none" stroke="#8a5e34" strokeWidth="6" />
          <rect x="-72" y="-8" width="144" height="8" fill="#9a6e3e" />
          {/* toit d'auvent */}
          <path d="M-78 -6 L0 -30 L78 -6 Z" fill="#a86a3a" />
          <path d="M-78 -6 L0 -30 L78 -6 Z" fill="#7a4a26" opacity="0.3" filter="url(#uk-grain)" />
          {/* deux bœufs */}
          {[[-34, 18], [12, 22]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x},${y})`}>
              <ellipse cx="0" cy="10" rx="22" ry="5" fill="#241608" opacity="0.35" />
              <path d="M-20 6 Q-22 -10 -6 -12 L14 -12 Q22 -10 20 4 L20 8 L14 8 L14 4 L-14 4 L-14 8 L-20 8 Z" fill="#7a5030" />
              <path d="M-20 -6 q-6 -2 -8 -8 M-20 -8 q-2 -6 2 -10" stroke="#e8e0cc" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="-22" cy="-8" r="2" fill="#2a1c10" />
            </g>
          ))}
          {/* gerbes de blé */}
          {[[46, 26], [58, 30]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x},${y})`} stroke="#c8a24a" strokeWidth="2.5" fill="none" strokeLinecap="round">
              <path d="M0 12 L0 -14 M-5 12 L-4 -10 M5 12 L4 -10" />
              <path d="M0 -14 q-4 -2 -5 -7 M0 -14 q4 -2 5 -7 M-4 -10 q-3 -2 -4 -6 M4 -10 q3 -2 4 -6" />
            </g>
          ))}
        </g>

        {/* maison de briques (gauche, derrière le roi) */}
        <g transform="translate(120,364)">
          <rect x="-56" y="-10" width="112" height="80" rx="4" fill="url(#uk-brick2)" />
          <rect x="-56" y="-10" width="112" height="80" rx="4" fill="#5c3f22" opacity="0.3" filter="url(#uk-grain)" />
          <path d="M-56 12 h112 M-56 36 h112" stroke="#6e4c28" strokeWidth="1.5" opacity="0.35" />
          <path d="M-14 70 L-14 30 Q0 24 14 30 L14 70 Z" fill="#241608" />
        </g>
      </PLayer>

      {/* ═══ premier plan : la cour, le canal, les gens ═══ */}
      <PLayer depth={3}>
        <rect y="435" width="1000" height="125" fill="url(#uk-ground)" />
        <ellipse cx="500" cy="500" rx="440" ry="50" fill="#8a6c40" opacity="0.35" />
        <rect y="437" width="1000" height="123" fill="#3c2c18" opacity="0.3" filter="url(#uk-mottle)" />
        <rect y="437" width="1000" height="123" fill="#2c1c10" opacity="0.4" filter="url(#uk-grain)" />

        {/* LE CANAL (eau) en bas à gauche + les roseaux */}
        <g>
          <path d="M-10 560 L-10 508 Q120 496 210 518 Q160 548 60 552 Q10 554 -10 560 Z" fill="#7a8e8e" />
          <path d="M-10 518 Q100 506 190 520" stroke="#c9d8d0" strokeWidth="2" fill="none" opacity="0.5" />
          <path d="M20 534 q40 -4 80 2 M0 546 q40 -3 70 1" stroke="#5a7278" strokeWidth="1.6" fill="none" opacity="0.6" style={{ animation: "ripple 3.4s ease-in-out infinite" }} />
          {/* touffe de roseaux sur pied, au bord */}
          {[196, 214, 230, 246].map((x, i) => (
            <path key={i} d={`M${x} 516 q${i % 2 ? 4 : -4} -34 ${i % 2 ? 6 : -3} -56`} stroke="#5c6a2e" strokeWidth="2.5" fill="none" style={{ animation: `sway ${3 + i * 0.4}s ease-in-out infinite`, transformOrigin: `${x}px 516px`, transformBox: "view-box" }} />
          ))}
        </g>

        {/* BOTTE DE ROSEAUX coupés, posée au sol (à ramasser) */}
        <g transform="translate(150,520)">
          <ellipse cx="0" cy="14" rx="26" ry="6" fill="#241608" opacity="0.4" />
          <g stroke="#8a9a4e" strokeWidth="3" strokeLinecap="round">
            {[-10, -4, 2, 8, 14].map((x, i) => <path key={i} d={`M${x} 12 L${x - 6 + i * 2} -30`} />)}
          </g>
          <path d="M-14 2 q14 -4 30 0" stroke="#6e5228" strokeWidth="3" fill="none" />
        </g>

        {/* LE FOUR à tablettes */}
        <g transform="translate(600,458)">
          <ellipse cx="0" cy="36" rx="48" ry="11" fill="#241608" opacity="0.5" />
          <path d="M-38 36 Q-44 -10 0 -18 Q44 -10 38 36 Z" fill="#9a6e3e" />
          <path d="M-38 36 Q-44 -10 0 -18 Q44 -10 38 36 Z" fill="#4c3020" opacity="0.4" filter="url(#uk-grain)" />
          <path d="M-18 36 Q-20 4 0 0 Q20 4 18 36 Z" fill="#ff8a3c" />
          <path d="M-12 36 Q-13 10 0 7 Q13 10 12 36 Z" fill="#ffd36a" />
          <circle cx="0" cy="22" r="4" fill="#fff2c4" style={{ animation: "glow 1.6s ease-in-out infinite" }} />
          <path d="M0 -18 q-8 -18 5 -30" stroke="#c8b8a0" strokeWidth="4" fill="none" opacity="0.35" style={{ animation: "drift 4s ease-in-out infinite" }} filter="url(#uk-blur)" />
        </g>

        {/* TAS D'ARGILE fraîche, près du canal */}
        <g transform="translate(300,510)">
          <ellipse cx="0" cy="8" rx="42" ry="11" fill="#241608" opacity="0.4" />
          <ellipse cx="0" cy="4" rx="40" ry="12" fill="#7a5236" />
          <ellipse cx="-10" cy="-4" rx="18" ry="11" fill="#8a5e3c" />
          <ellipse cx="14" cy="0" rx="15" ry="9" fill="#96683f" />
          <path d="M-18 -4 q12 -8 26 -2" stroke="#a8784a" strokeWidth="2" fill="none" opacity="0.6" />
        </g>

        {/* LE ROI MESANNEPADA sur son estrade (gauche) */}
        <g transform="translate(250,458)">
          {/* estrade de briques */}
          <rect x="-52" y="30" width="104" height="20" fill="#9a6e3e" />
          <rect x="-52" y="30" width="104" height="6" fill="#b8894e" />
          <path d="M-52 36 h104" stroke="#6e4c28" strokeWidth="1" opacity="0.5" />
          <ellipse cx="0" cy="30" rx="22" ry="6" fill="#241608" opacity="0.4" />
          {/* le roi, robe de laine à touffes (kaunakès), sceptre */}
          <Figure x={0} y={30} s={0.54} skin="#c6965f" hair="#1a1008" look="short" beard="royal" kohl hat="turban" hatColor="#8a6a3e" hatColor2="#e8c050"
            garment="robe" coat="#d8c8a0" pants="#6e4c2e" shoes="#5a3a20" belt={false}
            arms={[{ a1: 12, a2: -8 }, { a1: 25, a2: 40 }]}
            behind={<g>
              <path d="M38 -94 L43 -1" stroke="#6e4c2e" strokeWidth="5.6" strokeLinecap="round" />
              <circle cx="38" cy="-97" r="6.6" fill="#c89a2a" />
            </g>}>
            <g stroke="#a89470" strokeWidth="2" fill="none" opacity="0.8">
              <path d="M-23 -64 q6 7 12 0 q6 7 12 0 q6 7 12 0 q6 7 11 0 M-25 -44 q6 7 12 0 q6 7 12 0 q6 7 13 0 q6 7 12 0 M-27 -22 q7 7 13 0 q7 7 13 0 q7 7 13 0 q7 7 14 0" />
            </g>
          </Figure>
        </g>
        {queteQui === "mesannepada" && (
          <g transform="translate(232,368)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
          </g>
        )}

        {/* LE SCEAU-CYLINDRE du roi, posé sur l'estrade */}
        <g transform="translate(320,494)">
          <ellipse cx="0" cy="8" rx="12" ry="3.5" fill="#241608" opacity="0.4" />
          <rect x="-9" y="-6" width="18" height="13" rx="6" fill="#4a6a8a" />
          <path d="M-7 -3 h14 M-7 0 h14 M-7 3 h14" stroke="#2c4256" strokeWidth="1" opacity="0.7" />
        </g>

        {/* LE COUTEAU de silex, posé au sol */}
        <g transform="translate(430,516) rotate(-8)">
          <ellipse cx="0" cy="4" rx="20" ry="4" fill="#241608" opacity="0.4" />
          <rect x="-18" y="-3" width="18" height="6" rx="2" fill="#6e4c2e" />
          <path d="M0 -4 L20 -1 L20 3 L0 4 Z" fill="#c8c0b4" stroke="#8a8478" strokeWidth="0.8" />
        </g>

        {/* NARÂM-SÎN le collecteur, devant l'étable (droite) */}
        <g transform="translate(700,486)">
          <ellipse cx="0" cy="26" rx="22" ry="6" fill="#241608" opacity="0.45" />
          {/* crâne rasé de scribe ; tablette dans une main, l'autre à la tête, dépité */}
          <Figure x={0} y={26} s={0.5} skin="#c0926a" hair="#2a1a10" look="bald" kohl mood="vexe"
            garment="robe" coat="#e0d4b8" trim="#b8a67e" pants="#6e5a3a" shoes="#4a3a24"
            arms={[{ a1: 30, a2: 60 }, { a1: 150, a2: -120 }]}>
            <g transform="translate(-50,-50) rotate(-10)">
              <rect x="-18" y="-14" width="36" height="28" rx="4" fill="#a67c46" stroke="#5c3f22" strokeWidth="0.8" />
              <path d="M-10 -6 l6 3.2 M0 -6 l6 3.2 M-10 4 l6 3.2" stroke="#5c3f22" strokeWidth="2" />
            </g>
          </Figure>
        </g>
        {queteQui === "naram" && (
          <g transform="translate(682,388)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
          </g>
        )}

        {/* LA TABLETTE À GRAVER : n'apparaît qu'une fois fabriquée (mini-jeu) */}
        {aTablette && !grave && (
          <g transform="translate(470,502)">
            <g style={{ animation: "glow 2.4s ease-in-out infinite" }}>
              <g transform="translate(-18,-96)">
                <path d="M0 0 q0 -18 18 -18 q18 0 18 15 q0 13 -16 16 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
                <circle cx="18" cy="27" r="2.4" fill="#ffd166" />
              </g>
            </g>
            <ellipse cx="0" cy="16" rx="30" ry="8" fill="#241608" opacity="0.4" />
            {/* natte + tablette vierge posée dessus */}
            <ellipse cx="0" cy="12" rx="34" ry="10" fill="#b89a5e" />
            <ellipse cx="0" cy="12" rx="34" ry="10" fill="#6e5228" opacity="0.3" filter="url(#uk-grain)" />
            <rect x="-18" y="-4" width="36" height="24" rx="4" fill="#c9a878" stroke="#8a6a44" strokeWidth="1.4" />
            <path d="M-18 4 Q0 10 18 4" stroke="#a98858" strokeWidth="1.2" fill="none" opacity="0.6" />
          </g>
        )}

        {/* épave de MARTINE, dans un coin */}
        <g transform="translate(940,502) rotate(8)">
          <ellipse cx="0" cy="12" rx="26" ry="6" fill="#140b06" opacity="0.5" />
          <path d="M0 -20 Q18 -18 20 -4 Q22 8 11 11 L-11 11 Q-22 8 -20 -4 Q-18 -18 0 -20 Z" fill="#8a6240" />
          <circle cx="-1" cy="-4" r="5.5" fill="#cfeaff" stroke="#5c3a22" strokeWidth="1.4" />
          <rect x="-12" y="3" width="22" height="7" rx="2" fill="#0c1410" stroke="#5c3a22" strokeWidth="1" />
          <text x="-1" y="9" textAnchor="middle" fontSize="5.5" fill="#5eff9e" fontFamily="ui-monospace,monospace" style={{ animation: "pulse 2.2s infinite" }}>−3300</text>
          <circle cx="13" cy="-27" r="2.3" fill="#5eff9e" style={{ animation: "pulse 1.5s infinite" }} />
          <path d="M8 -20 q6 -8 13 -6" stroke="#8a94a8" strokeWidth="2.3" fill="none" strokeLinecap="round" />
        </g>

        {/* RÉSULTAT (msg_cuneiforme) : la tablette CUITE couverte de signes */}
        {grave && (
          <g transform="translate(470,506)" style={{ animation: "fadein 1s ease-out" }}>
            <ellipse cx="0" cy="22" rx="34" ry="8" fill="#20140a" opacity="0.4" />
            <path d="M-28 -20 Q-33 -2 -28 16 Q0 23 28 16 Q33 -2 28 -20 Q0 -27 -28 -20 Z" fill="#c9a878" />
            <path d="M-28 -20 Q0 -12 28 -20" stroke="#a98858" strokeWidth="1.6" fill="none" opacity="0.6" />
            {[-13, -4, 5, 14].map((ry, r) => [-20, -12, -4, 4, 12].map((rx, c) => (
              <path key={`${r}-${c}`} d={`M${rx} ${ry - 2} l5 2 l-5 2 Z`} fill="#4a3420" transform={`rotate(${((r + c) % 3) * 22 - 22} ${rx} ${ry})`} />
            )))}
          </g>
        )}

        {/* ANACHRONISME : stylo Bic bleu posé sur la marche du grenier */}
        {!made.includes("stylo_bic") && mode !== "jeu2" && (
          <g transform="translate(820,470) rotate(35)">
            <rect x={-3} y={-24} width={6} height={44} fill="#0a2058" stroke="#050820" strokeWidth="0.6" />
            <path d="M-3 20 L0 32 L3 20 Z" fill="#0a0e14" />
            <rect x={-3} y={-24} width={6} height={7} fill="#c8c8c8" />
            <rect x={-3.5} y={-14} width={7} height={2} fill="#050820" />
            <path d="M3 -8 l6 -2" stroke="#0a2058" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        )}
      </PLayer>

      {/* voile de grain global */}
      <rect width="1000" height="560" fill="#2a1c10" opacity="0.08" style={{ pointerEvents: "none" }} />

      {/* ═══ zones cliquables ═══ */}
      {/* personnages de la quête */}
      <Hotspot cx={250} cy={432} r={40} label="le roi Mesannepada" reveal={reveal} onClick={(p) => action("mesannepada", p)} />
      <Hotspot cx={700} cy={458} r={40} label="Narâm-Sîn, le collecteur" reveal={reveal} onClick={(p) => action("naram", p)} />
      {/* le mini-jeu du registre : seulement quand la tablette est prête */}
      {aTablette && !grave && (
        <Hotspot cx={470} cy={500} r={40} label="graver le registre sur la tablette" reveal={reveal} onClick={() => action("tablette")} />
      )}
      {/* objets & supports */}
      <Hotspot cx={150} cy={512} r={38} label="roseaux" item="roseaux" reveal={reveal} onClick={() => collect("roseaux")} />
      <Hotspot cx={430} cy={512} r={30} label="couteau de silex" item="couteau" reveal={reveal} onClick={() => collect("couteau")} />
      <Hotspot cx={300} cy={502} r={42} label="argile" item="argile" reveal={reveal} onClick={() => collect("argile")} />
      <Hotspot cx={320} cy={492} r={26} label="sceau-cylindre du roi" item="sceau" reveal={reveal} onClick={() => collect("sceau")} />
      <Hotspot cx={600} cy={460} r={46} label="four" item="four" reveal={reveal} onClick={() => collect("four")} />
      <Hotspot cx={90} cy={528} r={44} label="eau" item="eau" reveal={reveal} onClick={() => collect("eau")} />
      <Hotspot cx={940} cy={498} r={34} label="MARTINE" reveal={reveal} onClick={() => action("wreck")} />

      {mode !== "jeu2" && (
        <Hotspot cx={820} cy={480} r={22} label="… quelque chose ne va pas ici" item="stylo_bic" reveal={reveal} onClick={() => collect("stylo_bic")} />
      )}
    </svg>
  );
}
