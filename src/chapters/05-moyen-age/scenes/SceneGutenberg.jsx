import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 5 — Tableau : l'atelier de Gutenberg (Mayence)
   Peinture fine — atelier de bois chaud, feuilles imprimées qui
   sèchent sur une corde, la fonte du plomb, la casse de
   caractères, et la grande presse à vis. À trouver : plomb
   fondu, moule à lettres, presse à vis.
   ============================================================ */

export default function SceneGutenberg({ collect, action, reveal, made = [], mode = "jeu1" }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="gt-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7a5e40" /><stop offset="100%" stopColor="#4e3a26" /></linearGradient>
        <linearGradient id="gt-win" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6a8ea8" /><stop offset="100%" stopColor="#c8d0c0" /></linearGradient>
        <linearGradient id="gt-wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#7a5230" /><stop offset="50%" stopColor="#9a6c40" /><stop offset="100%" stopColor="#5a3f24" /></linearGradient>
        <linearGradient id="gt-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a6e4c" /><stop offset="100%" stopColor="#4e3a26" /></linearGradient>
        <radialGradient id="gt-fire" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffc068" stopOpacity="0.6" /><stop offset="100%" stopColor="#ff9540" stopOpacity="0" /></radialGradient>
        <filter id="gt-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="gt-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>

      {/* ═══ mur de l'atelier ═══ */}
      <rect width="1000" height="560" fill="url(#gt-wall)" />
      <rect width="1000" height="560" fill="#2a1c10" opacity="0.28" filter="url(#gt-grain)" />

      {/* ═══ couche lointaine : fenêtre + poutres + feuilles qui sèchent ═══ */}
      <PLayer depth={1}>
        {/* fenêtre à petits carreaux */}
        <g transform="translate(160,180)">
          <rect x="-70" y="-80" width="140" height="160" fill="url(#gt-win)" />
          <rect x="-70" y="-80" width="140" height="160" fill="none" stroke="#3a2a18" strokeWidth="8" />
          <path d="M0 -80 v160 M-70 -20 h140 M-70 40 h140" stroke="#3a2a18" strokeWidth="4" />
        </g>
        {/* poutre + corde à sécher, feuilles imprimées suspendues */}
        <path d="M0 130 h1000" stroke="#3a2818" strokeWidth="10" />
        <path d="M300 150 q200 20 640 0" stroke="#5a4630" strokeWidth="2" fill="none" />
        {[360, 440, 520, 600, 680, 760, 840].map((x, i) => (
          <g key={i} transform={`translate(${x},152)`}>
            <rect x="-22" y="0" width="44" height="58" fill="#efe6ce" transform={`rotate(${i % 2 ? 2 : -2})`} />
            <path d="M-16 10 h32 M-16 18 h26 M-16 26 h30 M-16 34 h22 M-16 42 h28" stroke="#5a4a3a" strokeWidth="1" opacity="0.7" transform={`rotate(${i % 2 ? 2 : -2})`} />
            <circle cx="0" cy="0" r="2" fill="#5a4630" />
          </g>
        ))}
      </PLayer>

      {/* ═══ couche intermédiaire : étagères, casse de caractères ═══ */}
      <PLayer depth={2}>
        {/* étagère à outils */}
        <g transform="translate(430,300)">
          <rect x="-70" y="-40" width="140" height="10" fill="#5a3f24" />
          {[-56, -36, -16, 20, 44].map((x, i) => <rect key={i} x={x} y="-70" width="10" height="30" fill="#8a6a42" />)}
          <ellipse cx="4" cy="-46" rx="16" ry="6" fill="#6e4c2e" />
        </g>
      </PLayer>

      {/* ═══ premier plan : fonte, casse, la GRANDE PRESSE ═══ */}
      <PLayer depth={3}>
        <rect y="400" width="1000" height="160" fill="url(#gt-floor)" />
        <rect y="402" width="1000" height="158" fill="#2c1c10" opacity="0.35" filter="url(#gt-grain)" />
        <path d="M0 456 h1000 M0 512 h1000 M300 410 v150 M780 410 v150" stroke="#3a2a18" strokeWidth="1.6" opacity="0.5" />
        <ellipse cx="500" cy="474" rx="440" ry="52" fill="#6e5232" opacity="0.3" />

        {/* LA FONTE DU PLOMB : creuset sur un petit foyer */}
        <g transform="translate(200,478)">
          <ellipse cx="0" cy="30" rx="120" ry="34" fill="url(#gt-fire)" style={{ animation: "glow 2.6s ease-in-out infinite" }} />
          {/* foyer */}
          <path d="M-30 34 Q-34 8 0 4 Q34 8 30 34 Z" fill="#4a3020" />
          <path d="M-16 34 Q-18 12 0 9 Q18 12 16 34 Z" fill="#ff8a3c" />
          <circle cx="0" cy="22" r="4" fill="#fff2c4" style={{ animation: "glow 1.6s ease-in-out infinite" }} />
          {/* creuset avec louche */}
          <g transform="translate(0,-4)">
            <path d="M-14 -6 Q-16 8 0 10 Q16 8 14 -6 Z" fill="#5a5c62" />
            <ellipse cx="0" cy="-6" rx="13" ry="4.5" fill="#c9c4a0" />
            <ellipse cx="0" cy="-6" rx="8" ry="2.6" fill="#ffcf78" style={{ animation: "glow 2s ease-in-out infinite" }} />
            <path d="M12 -4 q12 -2 16 -12" stroke="#6a5c48" strokeWidth="3" fill="none" />
          </g>
        </g>

        {/* LA CASSE de caractères + le moule à lettres */}
        <g transform="translate(360,504)">
          {/* casier compartimenté rempli de petites lettres */}
          <rect x="-52" y="-14" width="104" height="30" rx="2" fill="#5a3f24" />
          <path d="M-52 -4 h104 M-52 6 h104 M-30 -14 v30 M-8 -14 v30 M14 -14 v30 M36 -14 v30" stroke="#3a2814" strokeWidth="1.4" />
          {/* petites lettres de plomb (points brillants) */}
          {[-42, -20, 2, 24, 44].map((x, r) => [-9, 1, 11].map((y, c) => (
            <rect key={`${r}-${c}`} x={x} y={y} width="4" height="6" fill="#b8bcc4" />
          )))}
          {/* le moule à lettres, posé devant */}
          <g transform="translate(-2,22)">
            <rect x="-16" y="-6" width="32" height="14" rx="2" fill="#6a6c72" />
            <rect x="-4" y="-4" width="8" height="10" fill="#3a3c42" />
            <path d="M-16 0 h32" stroke="#4a4c52" strokeWidth="1.2" />
          </g>
        </g>

        {/* LA BOUTEILLE D'ENCRE + les tampons (balles à encrer) */}
        <g transform="translate(556,514)">
          <ellipse cx="0" cy="16" rx="30" ry="7" fill="#160f08" opacity="0.4" />
          {/* la bouteille d'encre noire */}
          <path d="M-8 8 Q-11 -6 -5 -10 L-5 -16 L5 -16 L5 -10 Q11 -6 8 8 Z" fill="#2a2620" />
          <rect x="-5" y="-20" width="10" height="5" rx="1" fill="#4a3f30" />
          <ellipse cx="0" cy="-2" rx="6" ry="3" fill="#0c0a08" />
          <path d="M-6 0 q6 3 12 0" stroke="#4a4438" strokeWidth="1" opacity="0.6" fill="none" />
          {/* deux balles à encrer (cuir bourré, manche court) */}
          {[[18, 2], [26, 8]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x},${y})`}>
              <circle cx="0" cy="0" r="7" fill="#3a2c1c" />
              <circle cx="-2" cy="-2" r="2.4" fill="#5a4632" opacity="0.7" />
              <rect x="-1.4" y="-14" width="3" height="10" rx="1.4" fill="#6a4c2e" />
            </g>
          ))}
        </g>

        {/* LA GRANDE PRESSE À VIS (la pièce maîtresse) */}
        <g transform="translate(680,430)">
          {/* bâti en bois */}
          <rect x="-70" y="-30" width="20" height="150" fill="url(#gt-wood)" />
          <rect x="50" y="-30" width="20" height="150" fill="url(#gt-wood)" />
          <rect x="-78" y="-40" width="156" height="16" fill="#6e4c2e" />
          <rect x="-78" y="112" width="156" height="14" fill="#6e4c2e" />
          {/* la grande vis centrale */}
          <rect x="-8" y="-24" width="16" height="70" fill="#8a8c92" />
          {[-20, -10, 0, 10, 20, 30].map((y, i) => <path key={i} d={`M-8 ${y} l16 4`} stroke="#5a5c62" strokeWidth="2" />)}
          {/* la barre (levier) qu'on pousse */}
          <path d="M8 -12 h84" stroke="#5a3f24" strokeWidth="8" strokeLinecap="round" />
          <circle cx="96" cy="-12" r="7" fill="#6e4c2e" />
          {/* le plateau qui presse + la feuille */}
          <rect x="-44" y="46" width="88" height="16" fill="#7a5636" />
          <rect x="-40" y="60" width="80" height="4" fill="#3a2c1c" />
          {/* la forme encrée dessous + une feuille imprimée qui dépasse */}
          <rect x="-40" y="66" width="80" height="30" fill="#2c2620" />
          <rect x="-30" y="72" width="60" height="30" fill="#efe6ce" transform="rotate(-2)" />
          <path d="M-22 82 h44 M-22 88 h34 M-22 94 h40" stroke="#5a4a3a" strokeWidth="1" opacity="0.7" />
          {/* imprimeur qui actionne */}
          <Figure x={110} y={86} s={0.78} skin="#c8a882" hair="#3a2818" look="mid" mood="colere"
            garment="tunic" coat="#5a4a30" apron="#8a7a5a" pants="#3a3020" shoes="#2a2018"
            arms={[{ a1: 165, a2: 175 }, { a1: 30, a2: 20 }]} />
        </g>

        {/* RÉSULTAT (msg_imprimerie) : une PILE de feuilles toutes IDENTIQUES,
            tout juste sorties de la presse — la production en série. */}
        {made.includes("msg_imprimerie") && (
          <g transform="translate(606,548)" style={{ animation: "fadein 1s ease-out" }}>
            <ellipse cx="0" cy="8" rx="34" ry="8" fill="#160f08" opacity="0.5" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <g key={i} transform={`translate(${(i % 2 ? 3 : -3)},${-i * 5}) rotate(${i % 2 ? -1.6 : 1.6})`}>
                <rect x="-26" y="-34" width="52" height="40" fill="#efe6ce" />
                <path d="M-18 -27 h36 M-18 -21 h28 M-18 -15 h34 M-18 -9 h24 M-18 -3 h32" stroke="#5a4a3a" strokeWidth="1" opacity="0.6" />
              </g>
            ))}
          </g>
        )}

        {/* GUTENBERG — il tient un bloc de bois gravé, fendu : sa page ratée.
            C'est ce ratage qui va lui donner l'idée des lettres séparées. */}
        <g transform="translate(486,478)">
          <ellipse cx="0" cy="30" rx="24" ry="7" fill="#160f08" opacity="0.6" />
          {/* robe longue d'artisan-bourgeois, toque ; il présente le bloc gravé fendu */}
          <Figure x={0} y={30} s={0.74} skin="#cf9f70" hair="#9a948a" look="ring" beard="long" hat="toque" hatColor="#2a3a30" hatColor2="#1a2a22" wrinkles mood="vexe"
            garment="robe" coat="#3e3a52" trim="#2a2740" pants="#2a2740" shoes="#1a1820"
            arms={[{ a1: 20, a2: -10 }, { a1: 20, a2: -10 }]}>
            <g transform="translate(0,-32)">
              <rect x="-36" y="-14" width="72" height="36" rx="2.6" fill="#7a5636" stroke="#3a2a18" strokeWidth="0.8" />
              <path d="M-29 -7 h23 M-29 2 h20 M-29 11 h25 M9 -7 h20 M9 2 h23" stroke="#3a2a18" strokeWidth="2.1" />
              {/* la fêlure qui a tout gâché */}
              <path d="M-4 -16 l7 16 l-5 9 l7 14" stroke="#1a1008" strokeWidth="3.6" fill="none" />
            </g>
            <circle cx="-22.9" cy="-46" r="4.4" fill="#cf9f70" stroke="#8a6040" strokeWidth="0.6" />
            <circle cx="22.9" cy="-46" r="4.4" fill="#cf9f70" stroke="#8a6040" strokeWidth="0.6" />
          </Figure>
        </g>
      </PLayer>

      {/* voile de grain global */}
      <rect width="1000" height="560" fill="#180f08" opacity="0.08" style={{ pointerEvents: "none" }} />

      {/* zones cliquables */}
      {/* le « ? » de Gutenberg : cache en jeu 2 (pas de quete d'imprimerie) */}
      {!made.includes("msg_imprimerie") && mode !== "jeu2" && (
        <>
          <g transform="translate(466,358)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
          </g>
          <Hotspot cx={486} cy={446} r={40} label="parler à Gutenberg" reveal={reveal} onClick={() => action("gutenberg")} />
        </>
      )}

      <Hotspot cx={200} cy={472} r={40} label="plomb fondu" item="plomb_fondu" reveal={reveal} onClick={() => collect("plomb_fondu")} />
      <Hotspot cx={360} cy={500} r={46} label="moule à lettres" item="moule" reveal={reveal} onClick={() => collect("moule")} />
      <Hotspot cx={560} cy={510} r={30} label="bouteille d'encre" item="encre" reveal={reveal} onClick={() => collect("encre")} />
      <Hotspot cx={678} cy={470} r={74} label="presse à vis" item="presse" reveal={reveal} onClick={() => collect("presse")} />
      {/* PETITE SOURIS d'atelier qui detale sous la presse. Tete a
          gauche, marche de droite a gauche. */}
      <g opacity="0.85">
        <animateTransform attributeName="transform" type="translate"
          values="1050,0; -40,-3; 1050,0" dur="34s" repeatCount="indefinite" />
        <g transform="translate(0,548)">
          <ellipse cx="0" cy="0" rx="5" ry="2.4" fill="#3a2818" />
          <circle cx="-4" cy="-1" r="2" fill="#3a2818" />
          <circle cx="-5.5" cy="-3" r="1.2" fill="#3a2818" />
          <circle cx="-2.5" cy="-3" r="1.2" fill="#3a2818" />
          <path d="M5 0 q6 4 8 -2" stroke="#3a2818" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
