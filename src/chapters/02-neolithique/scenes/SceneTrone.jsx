import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 2 · Tableau 2 — La salle du roi Tannis  (PEINTURE FINE)
   Une salle de torchis : un rai de lumière tombe d'une ouverture au
   toit (façon Çatalhöyük), un crâne de taureau et des fresques au
   mur, le trône de pierre et de peaux, l'armurerie de silex du roi.
   ============================================================ */

export default function SceneTrone({ collect, action, reveal, queteQui }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="tr-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a6e4c" /><stop offset="100%" stopColor="#4e3a26" /></linearGradient>
        <linearGradient id="tr-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7a5e3e" /><stop offset="100%" stopColor="#3e2c1c" /></linearGradient>
        <linearGradient id="tr-stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9a9084" /><stop offset="100%" stopColor="#5e564c" /></linearGradient>
        <linearGradient id="tr-fur" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a6440" /><stop offset="100%" stopColor="#5a3f24" /></linearGradient>
        <radialGradient id="tr-glow" cx="50%" cy="38%" r="62%"><stop offset="0%" stopColor="#ffe9b0" stopOpacity="0.5" /><stop offset="60%" stopColor="#ffcf80" stopOpacity="0.14" /><stop offset="100%" stopColor="#ffcf80" stopOpacity="0" /></radialGradient>
        <radialGradient id="tr-torch" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffc068" stopOpacity="0.6" /><stop offset="100%" stopColor="#ff9540" stopOpacity="0" /></radialGradient>
        <filter id="tr-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="tr-mottle" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="tr-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7" /></filter>
      </defs>

      {/* ═══ mur de torchis, texturé ═══ */}
      <rect width="1000" height="560" fill="url(#tr-wall)" />
      <rect width="1000" height="560" fill="#2a1c10" opacity="0.3" filter="url(#tr-mottle)" />
      <rect width="1000" height="560" fill="#241608" opacity="0.14" filter="url(#tr-grain)" />
      {/* les murs latéraux en perspective : la salle a de la profondeur */}
      <path d="M-40 -20 L130 60 L130 404 L-40 470 Z" fill="#3e2c1c" />
      <path d="M-40 -20 L130 60 L130 404 L-40 470 Z" fill="#1a1008" opacity="0.35" filter="url(#tr-mottle)" />
      <path d="M1040 -20 L870 60 L870 404 L1040 470 Z" fill="#3a2818" />
      <path d="M1040 -20 L870 60 L870 404 L1040 470 Z" fill="#1a1008" opacity="0.4" filter="url(#tr-mottle)" />
      <path d="M130 60 L130 404 M870 60 L870 404" stroke="#2a1c10" strokeWidth="4" />
      {/* poteaux de bois qui portent le toit */}
      {[[146, 0.9], [854, 0.9], [40, 1.2], [960, 1.2]].map(([x, k], i) => (
        <g key={i}>
          <rect x={x - 11 * k} y="20" width={22 * k} height={470 - 20} fill="#4a3220" />
          <rect x={x - 11 * k} y="20" width={7 * k} height={450} fill="#7a5638" opacity="0.6" />
          <path d={`M${x - 8 * k} 120 h${16 * k} M${x - 8 * k} 300 h${16 * k}`} stroke="#2a1a0c" strokeWidth="3" />
        </g>
      ))}
      {/* charpente du plafond, solives qui fuient vers le fond */}
      <path d="M-40 -20 L1040 -20 L870 60 L130 60 Z" fill="#2e2014" />
      {Array.from({ length: 9 }).map((_, i) => {
        const xb = 130 + i * 92.5, xt = -40 + i * 135;
        return <path key={i} d={`M${xt} -20 L${xb} 60`} stroke="#4a3420" strokeWidth="7" />;
      })}
      <path d="M130 60 L870 60" stroke="#4a3420" strokeWidth="8" />
      {/* l'ouverture du toit : un carré de ciel */}
      <path d="M440 -20 L560 -20 L548 30 L452 30 Z" fill="#9ab8d0" />
      <path d="M440 -20 L560 -20 L548 30 L452 30 Z" fill="none" stroke="#1a1008" strokeWidth="4" />

      {/* le RAI DE LUMIÈRE qui tombe de l'ouverture du toit sur le trône */}
      <path d="M452 30 L548 30 L640 470 L360 470 Z" fill="#ffe9b0" opacity="0.14" filter="url(#tr-blur)" />
      <ellipse cx="500" cy="330" rx="230" ry="210" fill="url(#tr-glow)" />

      {/* ═══ décor mural : fresques, crâne de taureau, peaux ═══ */}
      <PLayer depth={1}>
        {/* fresque géométrique rouge (façon Çatalhöyük), à gauche */}
        <g transform="translate(215,150)" opacity="0.8">
          <rect x="-52" y="-30" width="104" height="88" fill="#7a2a22" opacity="0.35" />
          {[-40, -20, 0, 20, 40].map((x, i) => <path key={i} d={`M${x} -24 l10 12 l-10 12 l10 12`} stroke="#c85a3a" strokeWidth="2.5" fill="none" opacity="0.8" />)}
          <path d="M-48 40 h96" stroke="#e0b040" strokeWidth="2.5" opacity="0.7" />
        </g>
        {/* le CRÂNE DE TAUREAU (bucrane), emblème sacré, à droite */}
        <g transform="translate(790,150)">
          <path d="M-22 -6 Q-24 24 0 30 Q24 24 22 -6 Q0 -18 -22 -6 Z" fill="#e6ddc8" />
          <path d="M-22 -6 Q-24 24 0 30 Q24 24 22 -6" fill="none" stroke="#c8bda0" strokeWidth="1.5" />
          <ellipse cx="-9" cy="6" rx="4" ry="6" fill="#3a3024" /><ellipse cx="9" cy="6" rx="4" ry="6" fill="#3a3024" />
          {/* les grandes cornes recourbées */}
          <path d="M-20 -4 Q-52 -14 -60 -44 Q-48 -30 -30 -24 Q-24 -18 -20 -8 Z" fill="#efe8d6" stroke="#c8bda0" strokeWidth="1" />
          <path d="M20 -4 Q52 -14 60 -44 Q48 -30 30 -24 Q24 -18 20 -8 Z" fill="#efe8d6" stroke="#c8bda0" strokeWidth="1" />
        </g>
        {/* tentures de peaux au mur */}
        {[360, 640].map((x, i) => (
          <g key={i}><rect x={x - 40} y="118" width="80" height="140" rx="4" fill="url(#tr-fur)" /><rect x={x - 40} y="118" width="80" height="140" rx="4" fill="#2c1a0c" opacity="0.3" filter="url(#tr-grain)" /><path d={`M${x - 40} 160 h80 M${x - 40} 200 h80`} stroke="#4a3018" strokeWidth="2" opacity="0.5" /></g>
        ))}
      </PLayer>

      {/* ═══ le trône, le roi, l'armurerie ═══ */}
      <PLayer depth={2}>
        {/* les torches murales */}
        {[196, 804].map((x, i) => (
          <g key={i} transform={`translate(${x},220)`}>
            <ellipse cx="0" cy="-24" rx="46" ry="52" fill="url(#tr-torch)" style={{ animation: "glow 4.5s ease-in-out infinite" }} />
            <rect x="-4" y="0" width="8" height="120" fill="#4a3018" />
            <path d="M-8 -4 q4 -6 8 -8 q4 6 8 8 Z" fill="#5a3f24" />
            <g style={{ transformOrigin: `${x}px 194px`, transformBox: "view-box", animation: "flick 3.2s ease-in-out infinite" }}>
              <path d="M0 -6 Q-12 -26 0 -46 Q12 -26 0 -6 Z" fill="#ff8a3c" />
              <path d="M0 -8 Q-6 -22 0 -36 Q6 -22 0 -8 Z" fill="#ffd36a" />
              <path d="M0 -10 Q-3 -18 0 -26 Q3 -18 0 -10 Z" fill="#fff2c4" />
            </g>
          </g>
        ))}
        {/* deux haches de silex croisées au mur (emblème du roi) */}
        <g transform="translate(500,148)">
          {[24, -24].map((rot, i) => (
            <g key={i} transform={`rotate(${rot})`}>
              <path d="M0 -52 L0 50" stroke="#6e4c2e" strokeWidth="6" strokeLinecap="round" />
              <path d="M-4 -50 L-20 -60 L-13 -76 L1 -64 Z" fill="#8d8d97" stroke="#dfe3ec" strokeWidth="1.2" />
              <path d="M-4 -52 q4 -4 8 -2" stroke="#5a3f24" strokeWidth="2.4" fill="none" />
            </g>
          ))}
          <circle cx="0" cy="0" r="5" fill="#a8842a" />
        </g>

        {/* sol dallé */}
        <rect y="404" width="1000" height="156" fill="url(#tr-floor)" />
        <rect y="406" width="1000" height="154" fill="#241608" opacity="0.3" filter="url(#tr-mottle)" />
        {/* dalles de pierre en perspective */}
        {[[404, 420], [420, 444], [444, 478], [478, 524], [524, 590]].map(([y0, y1], r) => (
          <g key={r}>
            <path d={`M-40 ${y1} H1040`} stroke="#2c1c10" strokeWidth={1.4 + r * 0.4} opacity="0.5" />
            {Array.from({ length: 9 }).map((_, k) => {
              const x = -60 + k * 140 + (r % 2) * 70;
              const f0 = 1 + (y0 - 404) / 120, f1 = 1 + (y1 - 404) / 120;
              return <path key={k} d={`M${(500 + (x - 500) * f0).toFixed(0)} ${y0} L${(500 + (x - 500) * f1).toFixed(0)} ${y1}`} stroke="#2c1c10" strokeWidth="1.4" opacity="0.45" />;
            })}
          </g>
        ))}
        {/* peau d'ours étendue devant l'estrade */}
        <path d="M380 500 Q360 486 392 478 Q430 470 500 472 Q570 470 608 478 Q640 486 620 500 Q640 514 606 522 Q560 532 500 530 Q440 532 394 522 Q360 514 380 500 Z" fill="#6a4a2e" />
        <path d="M400 500 Q450 490 500 492 Q550 490 600 500" stroke="#8a6a46" strokeWidth="3" fill="none" opacity="0.6" />
        <path d="M380 500 l-16 -6 M380 500 l-14 8 M620 500 l16 -6 M620 500 l14 8" stroke="#5a3e24" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="500" cy="478" rx="360" ry="44" fill="#241608" opacity="0.35" />
        {/* tache de lumière au sol, sous le rai */}
        <ellipse cx="500" cy="452" rx="150" ry="22" fill="#ffe9b0" opacity="0.12" filter="url(#tr-blur)" />

        {/* ESTRADE + LE TRÔNE de pierre et de peaux */}
        <g transform="translate(500,438)">
          <rect x="-100" y="20" width="200" height="22" fill="#6a6258" />
          <rect x="-100" y="20" width="200" height="22" fill="#3a342c" opacity="0.35" filter="url(#tr-grain)" />
          <path d="M-62 22 L-62 -114 Q-62 -132 -44 -132 L44 -132 Q62 -132 62 -114 L62 22 Z" fill="url(#tr-stone)" />
          <path d="M-62 22 L-62 -114 Q-62 -132 -44 -132 L44 -132 Q62 -132 62 -114 L62 22 Z" fill="#3a342c" opacity="0.28" filter="url(#tr-grain)" />
          <rect x="-52" y="-92" width="104" height="90" fill="url(#tr-fur)" />
          <path d="M-52 -62 h104 M-52 -30 h104" stroke="#4a3018" strokeWidth="2" opacity="0.5" />
          <path d="M-44 -80 q10 -4 22 0 M-4 -48 q12 -4 24 0" stroke="#7a5a3a" strokeWidth="2" fill="none" opacity="0.5" />
          {/* accoudoirs éclairés */}
          <rect x="-74" y="-42" width="20" height="64" rx="4" fill="#6a6258" /><path d="M-72 -40 q6 -6 16 0" stroke="#b0a894" strokeWidth="1.4" fill="none" opacity="0.6" />
          <rect x="54" y="-42" width="20" height="64" rx="4" fill="#6a6258" />
        </g>

        {/* LE ROI TANNIS, assis, couronné */}
        <g transform="translate(500,392)">
          <Figure x={0} y={46} s={0.93} pose="sit" skin="#c6965f" hair="#1a1408" hat="crown" hatColor="#e0b040" earrings="#e0b040"
            garment="robe" coat="#7a2a4a" pants="#5a1c38" arms={[{ a1: 14, a2: -20 }, { a1: 40, a2: 150 }]}>
            <path d="M-14 -66 Q0 -54 14 -66" stroke="#e0b040" strokeWidth="4.5" fill="none" />
            <circle cx="0" cy="-58" r="3" fill="#e0b040" />
          </Figure>
          <path d="M38 -50 L38 24" stroke="#8a6a3a" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="38" cy="-52" r="7" fill="#e0b040" stroke="#a8842a" strokeWidth="1.5" />
        </g>
        {/* le « ? » doré : c'est au tour du roi */}
        {queteQui === "tannis" && (
          <g transform="translate(482,282)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -22 22 -22 q22 0 22 18 q0 15 -18 20 l0 7" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="22" cy="34" r="2.8" fill="#ffd166" />
          </g>
        )}

        {/* jarres de grain (les impôts du roi) */}
        {[[300, 502], [700, 504]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <ellipse cx="0" cy="20" rx="20" ry="5" fill="#241608" opacity="0.4" />
            <path d="M-20 -14 Q-26 8 -14 20 Q0 26 14 20 Q26 8 20 -14 Q0 -24 -20 -14 Z" fill="#a86a3a" />
            <path d="M-20 -14 Q-26 8 -14 20 Q0 26 14 20 Q26 8 20 -14 Q0 -24 -20 -14 Z" fill="#5a3520" opacity="0.25" filter="url(#tr-grain)" />
            <ellipse cx="0" cy="-16" rx="13" ry="4.5" fill="#7a4a26" />
            <path d="M-16 0 q16 6 32 0" stroke="#7a4a26" strokeWidth="1.4" fill="none" opacity="0.5" />
            <path d="M-14 -14 q14 -4 28 0" stroke="#c89060" strokeWidth="1.4" fill="none" opacity="0.4" />
          </g>
        ))}

        {/* LE RÂTELIER D'ARMES, à droite (le silex se prend ici) */}
        <g transform="translate(792,452)">
          <ellipse cx="0" cy="50" rx="50" ry="9" fill="#241608" opacity="0.4" />
          <rect x="-44" y="34" width="88" height="9" fill="#5a3f24" />
          <rect x="-44" y="-14" width="88" height="7" fill="#6e4c2e" />
          {[-28, -2, 24].map((dx, i) => (
            <g key={i} transform={`translate(${dx},0) rotate(${(i - 1) * 3})`}>
              <path d="M0 42 L0 -42" stroke="#6e4c2e" strokeWidth="6" strokeLinecap="round" />
              <path d="M0 42 L0 -42" stroke="#a8865c" strokeWidth="1.4" opacity="0" />
              <path d="M-4 -40 L-21 -50 L-13 -67 L1 -54 Z" fill="#8d8d97" stroke="#dfe3ec" strokeWidth="1.2" />
              <path d="M-4 -42 q4 -4 8 -2" stroke="#5a3f24" strokeWidth="2.5" fill="none" />
            </g>
          ))}
        </g>
      </PLayer>

      {/* voile de grain global */}
      <rect width="1000" height="560" fill="#160e06" opacity="0.08" style={{ pointerEvents: "none" }} />

      {/* zones cliquables : le roi + l'armurerie */}
      <Hotspot cx={500} cy={368} r={56} label="le roi Tannis" reveal={reveal} onClick={(p) => action("tannis", p)} />
      <Hotspot cx={792} cy={428} r={46} label="hache de silex" item="silex" reveal={reveal} onClick={() => collect("silex")} />
    </svg>
  );
}
