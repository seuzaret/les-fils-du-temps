import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 2 — Tableau : le village (tableau de départ)
   Peinture fine — fin de journée dorée : ciel de couchant,
   torchis et chaume texturés, fumées des foyers, four qui
   rougeoie, enclos animé (moutons qui bougent la tête).
   À trouver ici : argile, le tour du potier, le four,
   les pigments, le troupeau, la mémoire (le berger).
   ============================================================ */

export default function SceneVillage({ collect, action, reveal, made = [], mode }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="vg-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#26305e" />
          <stop offset="34%" stopColor="#5a4a7a" />
          <stop offset="62%" stopColor="#b86a56" />
          <stop offset="84%" stopColor="#e89a4a" />
          <stop offset="100%" stopColor="#f6c86a" />
        </linearGradient>
        <radialGradient id="vg-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff2c4" /><stop offset="45%" stopColor="#ffd070" stopOpacity="0.7" /><stop offset="100%" stopColor="#ffd070" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="vg-hill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7a6a52" /><stop offset="100%" stopColor="#544632" /></linearGradient>
        <linearGradient id="vg-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a6824e" /><stop offset="30%" stopColor="#886238" /><stop offset="100%" stopColor="#4c3620" /></linearGradient>
        <linearGradient id="vg-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c2a678" /><stop offset="100%" stopColor="#8a6c46" /></linearGradient>
        <linearGradient id="vg-thatch" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c49a4e" /><stop offset="100%" stopColor="#8a6a2e" /></linearGradient>
        <filter id="vg-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="vg-mottle" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="vg-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7" /></filter>
      </defs>

      {/* ═══ ciel de couchant ═══ */}
      <rect width="1000" height="560" fill="url(#vg-sky)" />
      <circle cx="175" cy="215" r="165" fill="url(#vg-sun)" />
      <circle cx="175" cy="215" r="46" fill="#fff0be" />
      <g filter="url(#vg-blur)">
        <ellipse cx="360" cy="150" rx="150" ry="11" fill="#e8946a" opacity="0.4" />
        <ellipse cx="700" cy="120" rx="120" ry="9" fill="#d87a58" opacity="0.35" />
        <ellipse cx="540" cy="185" rx="180" ry="10" fill="#f4b26a" opacity="0.4" />
      </g>
      {[[70, 40, 0.4], [300, 30, 0.35], [560, 50, 0.4], [880, 36, 0.35]].map(([x, y, o], i) => (
        <circle key={i} cx={x} cy={y} r="1.3" fill="#fff" opacity={o} style={{ animation: `twinkle ${3 + i}s infinite` }} />
      ))}

      {/* ═══ couche lointaine : collines + champ labouré ═══ */}
      <PLayer depth={1}>
        <path d="M0 300 Q180 252 360 288 Q540 324 720 282 Q860 250 1000 292 L1000 420 L0 420 Z" fill="url(#vg-hill)" />
        <rect y="300" width="1000" height="30" fill="#f4b26a" opacity="0.12" filter="url(#vg-blur)" />
        {/* lisière d'arbres en silhouette */}
        {[120, 175, 235, 300, 690, 760, 830].map((x, i) => (
          <ellipse key={i} cx={x} cy={286 - (i % 2) * 8} rx={26 + (i % 3) * 6} ry={20} fill="#3e3324" opacity="0.7" />
        ))}
        {/* champ labouré */}
        <path d="M0 336 Q250 320 500 338 T1000 334 L1000 400 L0 400 Z" fill="#7a5a30" />
        <path d="M0 336 Q250 320 500 338 T1000 334 L1000 400 L0 400 Z" fill="#3c2c18" opacity="0.35" filter="url(#vg-grain)" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <path key={i} d={`M${40 + i * 122} 350 Q${100 + i * 122} 346 ${162 + i * 122} 352`} stroke="#5c4222" strokeWidth="3" fill="none" opacity="0.55" />
        ))}
        {/* OISEAUX qui traversent le ciel — vol en V, plus visibles */}
        <g opacity="0.9">
          <animateTransform attributeName="transform" type="translate"
            values="-60,0; 1060,-30" dur="26s" repeatCount="indefinite" />
          <path d="M0 220 q6 -8 12 0 q6 -8 12 0" stroke="#1c1810" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M32 232 q6 -8 12 0 q6 -8 12 0" stroke="#1c1810" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M60 216 q6 -8 12 0 q6 -8 12 0" stroke="#1c1810" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </g>
      </PLayer>

      {/* ═══ couche intermédiaire : les huttes du village ═══ */}
      <PLayer depth={2}>
        {[[250, 300, 1], [430, 282, 1.16], [640, 306, 0.9]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
            <ellipse cx="0" cy="70" rx="72" ry="12" fill="#2c2014" opacity="0.5" />
            {/* mur de torchis texturé */}
            <rect x="-52" y="6" width="104" height="66" rx="6" fill="url(#vg-wall)" />
            <rect x="-52" y="6" width="104" height="66" rx="6" fill="#5c4228" opacity="0.35" filter="url(#vg-grain)" />
            <path d="M-46 26 q46 -6 92 0 M-44 48 q44 -5 88 0" stroke="#6e5232" strokeWidth="1.4" fill="none" opacity="0.4" />
            {/* toit de chaume, brins */}
            <path d="M-66 8 L0 -54 L66 8 Z" fill="url(#vg-thatch)" />
            <path d="M-66 8 L0 -54 L66 8 Z" fill="#5c421e" opacity="0.3" filter="url(#vg-grain)" />
            {[-44, -28, -12, 4, 20, 36].map((dx, k) => (
              <path key={k} d={`M${dx} 6 L${dx * 0.35} ${-50 + Math.abs(dx) * 0.1}`} stroke="#6e5220" strokeWidth="1.5" opacity="0.5" />
            ))}
            <path d="M-66 8 L66 8" stroke="#5c421e" strokeWidth="3" opacity="0.6" />
            {/* lumière du couchant sur le pignon droit */}
            <path d="M0 -54 L66 8 L44 8 Z" fill="#ffce7a" opacity="0.18" />
            {/* porte sombre */}
            <path d="M-14 72 L-14 34 Q0 24 14 34 L14 72 Z" fill="#241608" />
            <path d="M-14 34 Q0 24 14 34" stroke="#3c2c1a" strokeWidth="2" fill="none" />
            {/* fumée du foyer intérieur */}
            <path d="M0 -54 q-8 -22 5 -36 q-11 8 -3 -24" stroke="#c8cbd0" strokeWidth="4" fill="none" opacity="0.4" style={{ animation: `drift ${5 + i}s ease-in-out infinite` }} filter="url(#vg-blur)" />
          </g>
        ))}
      </PLayer>

      {/* ═══ premier plan : sol, atelier, four, enclos, clan ═══ */}
      <PLayer depth={3}>
        <rect y="400" width="1000" height="160" fill="url(#vg-ground)" />
        <ellipse cx="500" cy="470" rx="440" ry="60" fill="#8a6636" opacity="0.4" />
        <rect y="402" width="1000" height="158" fill="#241608" opacity="0.34" filter="url(#vg-mottle)" />
        <rect y="402" width="1000" height="158" fill="#2c1c10" opacity="0.5" filter="url(#vg-grain)" />
        {/* nappe de lumière dorée côté soleil */}
        <ellipse cx="220" cy="452" rx="360" ry="50" fill="#ffce7a" opacity="0.14" filter="url(#vg-blur)" />

        {/* LE FOUR à céramique */}
        <g transform="translate(150,452)">
          <ellipse cx="0" cy="34" rx="52" ry="12" fill="#241608" opacity="0.5" />
          <path d="M-42 34 Q-48 -12 0 -20 Q48 -12 42 34 Z" fill="#8a5a3c" />
          <path d="M-42 34 Q-48 -12 0 -20 Q48 -12 42 34 Z" fill="#4c3020" opacity="0.4" filter="url(#vg-grain)" />
          <path d="M-30 34 q-4 -30 30 -34" stroke="#c9945e" strokeWidth="2" fill="none" opacity="0.4" />
          {/* gueule rougeoyante */}
          <path d="M-20 34 Q-22 2 0 -2 Q22 2 20 34 Z" fill="#ff8a3c" />
          <path d="M-13 34 Q-14 8 0 5 Q14 8 13 34 Z" fill="#ffd36a" />
          <circle cx="0" cy="20" r="5" fill="#fff2c4" style={{ animation: "glow 1.6s ease-in-out infinite" }} />
          {/* étincelles + fumée */}
          <circle cx="4" cy="-6" r="1.4" fill="#ffd166" style={{ animation: "spark 2s linear infinite" }} />
          <path d="M0 -20 q-8 -18 5 -30" stroke="#c8cbd0" strokeWidth="4" fill="none" opacity="0.4" style={{ animation: "drift 4s ease-in-out infinite" }} filter="url(#vg-blur)" />
        </g>

        {/* LA POTIÈRE au travail sur son TOUR (le pot prend forme en tournant) */}
        <g transform="translate(330,470)">
          <ellipse cx="0" cy="30" rx="30" ry="7" fill="#241608" opacity="0.5" />
          <Figure x={0} y={30} s={0.64} pose="sit" facing="right" skin="#9a6a44" hair="#3a2415" look="bun" mood="content"
            garment="dress" coat="#7a4f34" pants="#63402a" bareArms arms={[{ a1: 30, a2: 50 }, { a1: 48, a2: 84 }]} />
          {/* LE TOUR : la roue tourne (rayons animés), le pot monte dessus */}
          <g transform="translate(36,14)">
            <ellipse cx="0" cy="20" rx="16" ry="8" fill="#3a2a1a" />
            <ellipse cx="0" cy="18" rx="16" ry="8" fill="#4e3822" />
            <g style={{ transformOrigin: "366px 502px", transformBox: "view-box", animation: "spin 1.1s linear infinite" }}>
              {[0, 72, 144, 216, 288].map((a) => (
                <line key={a} x1="0" y1="18" x2="0" y2="7" transform={`rotate(${a} 0 18)`} stroke="#6a4c30" strokeWidth="2.2" strokeLinecap="round" />
              ))}
              <circle cx="0" cy="18" r="2.6" fill="#7c5636" />
            </g>
            {/* le pot en formation */}
            <path d="M-10 8 Q-13 -8 0 -13 Q13 -8 10 8 Q7 14 0 14 Q-7 14 -10 8 Z" fill="#7c5636" />
            <ellipse cx="0" cy="-13" rx="10" ry="3.4" fill="#63402a" />
            <path d="M-8 -3 q8 -4 16 0" stroke="#8a6442" strokeWidth="1.2" fill="none" opacity="0.6" />
          </g>
        </g>

        {/* TAS D'ARGILE */}
        <g transform="translate(470,506)">
          <ellipse cx="0" cy="8" rx="42" ry="12" fill="#241608" opacity="0.4" />
          <ellipse cx="0" cy="6" rx="40" ry="12" fill="#5c3f26" />
          <ellipse cx="-8" cy="-2" rx="20" ry="12" fill="#6b4a2e" />
          <ellipse cx="14" cy="2" rx="16" ry="10" fill="#7c5636" />
          <path d="M-18 -4 q12 -8 26 -2 M-6 6 q10 -5 22 -1" stroke="#8a6442" strokeWidth="2" fill="none" opacity="0.6" />
        </g>

        {/* POTS DE PIGMENTS */}
        <g transform="translate(590,512)">
          {[["#b23a2a", -22], ["#d98a2a", 0], ["#e8d0b0", 22]].map(([c, dx], i) => (
            <g key={i} transform={`translate(${dx},0)`}>
              <ellipse cx="0" cy="9" rx="12" ry="5" fill="#241608" opacity="0.5" />
              <path d="M-11 -2 Q-12 8 0 9 Q12 8 11 -2 Z" fill="#7a5636" />
              <ellipse cx="0" cy="-2" rx="10" ry="4.5" fill={c} />
              <ellipse cx="-3" cy="-3" rx="3.5" ry="1.6" fill="#fff" opacity="0.25" />
            </g>
          ))}
        </g>

        {/* ENCLOS + troupeau (moutons qui bougent la tête, vache) */}
        <g transform="translate(820,470)">
          <path d="M-90 20 L-90 -6 M-50 20 L-50 -8 M-10 20 L-10 -6 M30 22 L30 -6 M70 22 L70 -4 M-96 -2 L74 -6" stroke="#6e4c2e" strokeWidth="4" strokeLinecap="round" />
          {/* mouton 1 (tête qui broute) */}
          <g transform="translate(-58,8)">
            <ellipse cx="2" cy="-2" rx="19" ry="12" fill="#f0ebdf" />
            <ellipse cx="2" cy="-2" rx="19" ry="12" fill="#c8c0ae" opacity="0.4" filter="url(#vg-grain)" />
            <g style={{ transformOrigin: "-8px -4px", transformBox: "view-box", animation: "grazing 4s ease-in-out infinite" }}>
              <circle cx="-15" cy="-5" r="7" fill="#4a4038" />
              <ellipse cx="-20" cy="-8" rx="3" ry="4" fill="#3a322c" />
            </g>
            <rect x="-8" y="8" width="4" height="10" fill="#4a4038" /><rect x="6" y="8" width="4" height="10" fill="#4a4038" />
          </g>
          {/* mouton 2 */}
          <g transform="translate(2,10) scale(0.9)">
            <ellipse cx="0" cy="0" rx="18" ry="12" fill="#e2dbcb" />
            <circle cx="-15" cy="-5" r="7" fill="#4a4038" />
            <rect x="-8" y="9" width="4" height="9" fill="#4a4038" /><rect x="6" y="9" width="4" height="9" fill="#4a4038" />
          </g>
          {/* vache */}
          <g transform="translate(52,6)">
            <ellipse cx="0" cy="0" rx="22" ry="13" fill="#8a6a4a" />
            <ellipse cx="6" cy="-2" rx="9" ry="6" fill="#e8ddc8" opacity="0.7" />
            <circle cx="-20" cy="-6" r="8" fill="#6e5238" />
            <path d="M-26 -10 q-4 -8 2 -10 M-14 -12 q3 -8 8 -6" stroke="#4a3624" strokeWidth="2.5" fill="none" />
            <rect x="-10" y="10" width="4" height="10" fill="#5c4632" /><rect x="8" y="10" width="4" height="10" fill="#5c4632" />
          </g>
        </g>

        {/* CAILLOUX NOIRS au pied du berger : un par bête, pour compter */}
        <g transform="translate(636,508)">
          <ellipse cx="0" cy="6" rx="26" ry="7" fill="#241608" opacity="0.4" />
          {[[-14, 2, 5], [-2, 4, 6], [9, 1, 5], [16, 5, 4], [-8, 7, 4], [3, 8, 5], [-18, 6, 3]].map(([x, y, rr], i) => (
            <g key={i}>
              <ellipse cx={x} cy={y + 2} rx={rr * 1.2} ry={rr * 0.4} fill="#160f06" opacity="0.5" />
              <circle cx={x} cy={y} r={rr} fill={i % 2 ? "#2a2a30" : "#1f1f26"} />
              <circle cx={x - rr * 0.35} cy={y - rr * 0.35} r={rr * 0.3} fill="#4a4a54" opacity="0.6" />
            </g>
          ))}
        </g>

        {/* LE BERGER perplexe (compter le troupeau au marché) */}
        <g transform="translate(700,474)">
          <ellipse cx="0" cy="30" rx="20" ry="6" fill="#241608" opacity="0.5" />
          <Figure x={0} y={30} s={0.52} skin="#9a6a44" hair="#3a2415" look="short" beard="short" mood="vexe"
            garment="tunic" coat="#6a4a30" pants="#4a3020" arms={[{ a1: 10, a2: 6 }, { a1: 150, a2: -110 }]} />
          <text x="16" y="-30" fontSize="14" fill="#e8eef5" fontFamily="ui-monospace,monospace" opacity="0.85" style={{ animation: "drift 3s ease-in-out infinite" }}>?</text>
          <text x="-20" y="-24" fontSize="10" fill="#c8d4e2" fontFamily="ui-monospace,monospace" opacity="0.6" style={{ animation: "drift 4s ease-in-out infinite" }}>?</text>
        </g>

        {/* épave de MARTINE, plantée dans le champ */}
        <g transform="translate(70,500) rotate(-8)">
          <ellipse cx="0" cy="14" rx="30" ry="7" fill="#140b06" opacity="0.5" />
          <path d="M0 -22 Q20 -20 22 -4 Q24 8 12 12 L-12 12 Q-24 8 -22 -4 Q-20 -20 0 -22 Z" fill="#8a6240" />
          <path d="M-20 -6 Q0 -14 20 -6" stroke="#5c3a22" strokeWidth="2" fill="none" opacity="0.8" />
          <circle cx="-1" cy="-4" r="6" fill="#cfeaff" stroke="#5c3a22" strokeWidth="1.5" />
          <rect x="-13" y="4" width="24" height="8" rx="2" fill="#0c1410" stroke="#5c3a22" strokeWidth="1" />
          <text x="-1" y="10.5" textAnchor="middle" fontSize="6" fill="#5eff9e" fontFamily="ui-monospace,monospace" style={{ animation: "pulse 2.2s infinite" }}>−4500</text>
          <circle cx="14" cy="-30" r="2.5" fill="#5eff9e" style={{ animation: "pulse 1.5s infinite" }} />
          <path d="M9 -22 q6 -8 13 -6" stroke="#8a94a8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>

        {/* RÉSULTAT (msg_poterie) : un beau pot cuit, PEINT de motifs
            géométriques — la « marque » du village, reconnaissable entre tous */}
        {made.includes("msg_poterie") && (
          <g transform="translate(248,500)" style={{ animation: "fadein 1s ease-out" }}>
            <ellipse cx="0" cy="36" rx="30" ry="8" fill="#20180c" opacity="0.4" />
            <path d="M-24 -10 Q-30 4 -22 26 Q-14 38 0 38 Q14 38 22 26 Q30 4 24 -10 Q14 -20 0 -20 Q-14 -20 -24 -10 Z" fill="#b5623a" />
            <path d="M-24 -10 Q0 -2 24 -10" stroke="#7a3f24" strokeWidth="2" fill="none" opacity="0.5" />
            <path d="M-16 -18 Q0 -24 16 -18 L14 -10 Q0 -15 -14 -10 Z" fill="#9a5030" />
            {/* motifs peints : zigzags + bandes */}
            <path d="M-22 -4 h44" stroke="#2c1810" strokeWidth="1.6" opacity="0.6" />
            <path d="M-22 3 l7 -6 l7 6 l7 -6 l7 6 l7 -6" stroke="#2c1810" strokeWidth="2" fill="none" />
            <path d="M-22 13 h44" stroke="#efe0c4" strokeWidth="2.5" opacity="0.85" />
            <path d="M-20 21 l6 6 l6 -6 l6 6 l6 -6 l6 6" stroke="#efe0c4" strokeWidth="2" fill="none" opacity="0.8" />
          </g>
        )}

        {/* herbes qui cadrent le bas */}
        <g opacity="0.9">
          <path d="M-4 560 q10 -30 4 -46 M18 560 q3 -24 14 -38 M40 560 q-6 -20 2 -34" stroke="#241a10" strokeWidth="4" fill="none" />
          <path d="M420 560 q-5 -16 2 -26 M540 560 q5 -16 -1 -24" stroke="#2c2014" strokeWidth="3.5" fill="none" />
        </g>

        {/* ANACHRONISME : canette de soda écrasée bien visible sur la terre */}
        {!made.includes("canette") && mode !== "jeu2" && (
          <g transform="translate(390,530) rotate(-18)">
            {/* corps de canette (aluminium argent) */}
            <rect x={-9} y={-22} width={18} height={36} rx={2} fill="#c8c8c8" stroke="#5a5a5a" strokeWidth="0.8" />
            {/* bandeau rouge principal */}
            <rect x={-9} y={-14} width={18} height={18} fill="#c8382e" />
            {/* logo COLA en blanc */}
            <text x={0} y={-2} textAnchor="middle" fontSize="5.5" fontFamily="Georgia,serif" fontStyle="italic" fontWeight="800" fill="#f0e4c8">Cola</text>
            {/* dessus (ouverture) */}
            <ellipse cx={0} cy={-22} rx={9} ry={2.4} fill="#8a8a8a" stroke="#5a5a5a" strokeWidth="0.6" />
            <path d="M-4 -22 h8" stroke="#3a3a3a" strokeWidth="0.6" />
            {/* dessous */}
            <ellipse cx={0} cy={14} rx={9} ry={2} fill="#a8a8a8" />
            {/* bosse/écrasement */}
            <path d="M-9 -4 q4 3 18 -1" stroke="#8a2820" strokeWidth="0.6" fill="none" />
          </g>
        )}
      </PLayer>

      {/* voile de grain global */}
      <rect width="1000" height="560" fill="#141008" opacity="0.08" style={{ pointerEvents: "none" }} />

      {/* zones cliquables */}
      {/* les « ? » : la potière et le berger ont chacun un problème à raconter.
          (Cliquer la personne prend ce qu'elle donne ; cliquer son « ? » l'écoute.) */}
      {!made.includes("msg_poterie") && (
        <>
          <g transform="translate(322,376)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
          </g>
          <Hotspot cx={342} cy={386} r={28} label="parler à la potière" reveal={reveal} onClick={() => action("potiere")} />
        </>
      )}
      {!made.includes("msg_comptage") && (
        <>
          <g transform="translate(692,376)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
          </g>
          <Hotspot cx={712} cy={386} r={28} label="parler au berger" reveal={reveal} onClick={() => action("berger")} />
        </>
      )}

      <Hotspot cx={470} cy={500} r={46} label="argile" item="argile" reveal={reveal} onClick={() => collect("argile")} />
      <Hotspot cx={330} cy={455} r={44} label="potière" item="mains" reveal={reveal} onClick={() => collect("mains")} />
      <Hotspot cx={150} cy={450} r={50} label="four" item="four" reveal={reveal} onClick={() => collect("four")} />
      <Hotspot cx={590} cy={505} r={42} label="pigments" item="pigments" reveal={reveal} onClick={() => collect("pigments")} />
      <Hotspot cx={820} cy={468} r={70} label="troupeau" item="troupeau" reveal={reveal} onClick={() => collect("troupeau")} />
      <Hotspot cx={636} cy={506} r={34} label="cailloux noirs" item="cailloux" reveal={reveal} onClick={() => collect("cailloux")} />
      <Hotspot cx={70} cy={490} r={40} label="MARTINE" reveal={reveal} onClick={() => action("wreck")} />

      {/* ANACHRONISME : hotspot de la canette (visuel dans le PLayer premier plan) */}
      {mode !== "jeu2" && (
        <Hotspot cx={390} cy={520} r={22} label="… quelque chose ne va pas ici" item="canette" reveal={reveal} onClick={() => collect("canette")} />
      )}
    </svg>
  );
}
