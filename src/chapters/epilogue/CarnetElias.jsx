import { useState } from "react";
import { Bust, Figure } from "../../engine/chars.jsx";

/* ============================================================
   ÉPILOGUE — LE CARNET D'ELIAS
   ------------------------------------------------------------
   Séquence narrative en 6 planches illustrées (SVG) qui joue
   AVANT l'arrivée à la station des chronautes. Chaque planche
   est une case dessinée + un court paragraphe manuscrit dessous.
   Navigation : ‹ Précédent · Suivant ›. Skippable.
   ------------------------------------------------------------
   0. Couverture            (« carnet d'un survivant », signé)
   1. Nous, les chronautes  (la station, la petite équipe, la MARTINE « sœur »)
   2. La maladie de l'oubli (la grand-mère qui s'efface)
   3. D'où elle vient       (K-01, la fissure du temps, les 4 règles d'Al3x1a)
   4. Comment on tient      (le mur de notes, la mémoire de MARTINE)
   5. Les signaux           (le SOS du joueur, apparu sur la paroi)
   Refait le 2026-11-05 (textes validés par le créateur) : plus de
   pannes de machines avant le Jeu 2B, seulement la maladie de l'oubli.
   ------------------------------------------------------------
   Note : Al3x1a n'apparaît pas en image dans le carnet (son nom et
   sa signature « — A. » seulement) ; son portrait est réservé à la
   station.
   ============================================================ */

/* ─── Planche 0 : la couverture du carnet ─── */
function P0() {
  return (
    <svg viewBox="0 0 800 460" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="p0-cover" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a3818" /><stop offset="100%" stopColor="#2a1808" />
        </linearGradient>
        <radialGradient id="p0-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd166" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffd166" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* fond cuir usé */}
      <rect width="800" height="460" fill="url(#p0-cover)" />
      {/* texture cuir : petites craquelures */}
      {Array.from({ length: 60 }).map((_, i) => (
        <path key={i} d={`M${(i * 71) % 800} ${(i * 43) % 460} l${4 + (i % 5)} ${1 + (i % 3)}`}
          stroke="#1a0808" strokeWidth="0.5" opacity="0.35" fill="none" />
      ))}
      {/* halo chaud au centre */}
      <ellipse cx="400" cy="230" rx="260" ry="180" fill="url(#p0-halo)" />
      {/* cadre gravé */}
      <rect x="60" y="60" width="680" height="340" fill="none" stroke="#c9a54a" strokeWidth="2" opacity="0.7" />
      <rect x="70" y="70" width="660" height="320" fill="none" stroke="#8a5a2a" strokeWidth="0.8" opacity="0.7" />
      {/* Titre */}
      <text x="400" y="140" textAnchor="middle" fontFamily="Georgia, serif" fontSize="30" fontStyle="italic" fill="#f4e4b0" letterSpacing="4">Carnet d'Elias</text>
      <text x="400" y="172" textAnchor="middle" fontFamily="Georgia, serif" fontSize="16" fill="#c9a54a" letterSpacing="3" opacity="0.9">— survivant, station des chronautes —</text>

      {/* Petit dessin central : main qui tient une plume au-dessus d'une bougie */}
      <g transform="translate(400,260)">
        {/* bougie */}
        <rect x="-6" y="0" width="12" height="40" fill="#e8d8a8" />
        <path d="M-6 0 L6 0 L4 -6 L-4 -6 Z" fill="#c9a54a" />
        <path d="M0 -6 L0 -14" stroke="#3a2818" strokeWidth="0.6" />
        <ellipse cx="0" cy="-18" rx="4" ry="8" fill="#ffe090" opacity="0.9">
          <animate attributeName="ry" values="8;6;8" dur="1.2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="0" cy="-18" rx="10" ry="14" fill="url(#p0-halo)" />
        {/* main + plume à droite */}
        <g transform="translate(38,-4)">
          <path d="M0 40 L-4 12 Q-4 4 4 4 L14 4 Q22 8 22 16 L20 40 Z" fill="#d0a888" />
          {/* doigts serrant la plume */}
          <path d="M-6 8 Q-2 10 4 10 L14 12 Q18 14 18 20" stroke="#a08068" strokeWidth="0.8" fill="none" />
          {/* plume qui pointe vers la bougie */}
          <path d="M8 6 L-30 -30" stroke="#1a1010" strokeWidth="2" strokeLinecap="round" />
          <path d="M-30 -30 L-20 -18 M-24 -24 L-14 -14 M-18 -18 L-8 -10" stroke="#c9a54a" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
          <path d="M-30 -30 L-32 -32" stroke="#5a3818" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>

      {/* Date + lieu */}
      <text x="400" y="360" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="12" fill="#c9a54a" letterSpacing="4" opacity="0.85">STATION DES CHRONAUTES · 2045</text>

      {/* Note manuscrite / dédicace */}
      <g transform="translate(400,390)">
        <text x="0" y="0" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="13" fill="#f4e4b0" opacity="0.95">
          « Pour ne pas oublier ce que nous avons été. »
        </text>
        <text x="120" y="18" textAnchor="middle" fontFamily="Georgia, serif" fontSize="13" fontStyle="italic" fill="#f4e4b0" opacity="0.85">— E.</text>
      </g>
    </svg>
  );
}

/* ─── La paroi peinte (bison, cheval, mains négatives), réutilisée par la
   planche « Les signaux » ; `sos` y cache trois points, trois traits,
   trois points à l'ocre, comme le joueur les a cachés dans le passé ─── */
function Paroi({ sos = false }) {
  return (
    <g>
      <path d="M-138 -62 Q-142 -78 -118 -80 Q-60 -88 0 -82 Q66 -90 122 -79 Q143 -74 138 -50 Q145 -4 136 48 Q140 74 114 78 Q40 86 -30 80 Q-98 86 -126 76 Q-143 68 -138 38 Q-146 -12 -138 -62 Z"
        fill="url(#ce-roche)" stroke="#4a3018" strokeWidth="2" />
      <ellipse cx="-96" cy="-46" rx="26" ry="12" fill="#8a5a2a" opacity="0.18" />
      <ellipse cx="100" cy="-10" rx="22" ry="30" fill="#5a4a3a" opacity="0.12" />
      <ellipse cx="-20" cy="56" rx="40" ry="10" fill="#7a4a24" opacity="0.15" />
      <path d="M-120 -20 q14 6 18 22 q4 14 -6 30 M60 -78 q-6 16 4 30 M126 30 q-14 4 -20 18" stroke="#5a3e22" strokeWidth="1.2" fill="none" opacity="0.5" />
      <g transform="translate(-14,6)">
        <path d="M-78 4 Q-84 -8 -74 -16 Q-66 -32 -48 -40 Q-28 -48 -8 -36 Q16 -26 40 -24 Q56 -22 56 -6 Q58 10 44 16 Q10 22 -20 18 Q-44 18 -58 12 Q-70 10 -78 4 Z"
          fill="#a8481c" stroke="#1c1208" strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M-74 -16 Q-66 -32 -48 -40 Q-36 -44 -30 -37 Q-44 -26 -54 -10 Q-62 0 -76 -2 Z" fill="#1c1208" opacity="0.8" />
        <path d="M-36 4 Q0 0 34 -6" stroke="#d08850" strokeWidth="4" fill="none" opacity="0.35" strokeLinecap="round" />
        <path d="M-68 -26 q-7 -9 0 -16 M-60 -31 q-2 -10 6 -14" stroke="#1c1208" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M-76 3 q-3 8 3 11" stroke="#1c1208" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M55 -8 Q66 -2 61 12" stroke="#1c1208" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="-67" cy="-9" r="1.5" fill="#e8c890" />
        <path d="M-56 12 L-59 33 M-40 17 L-40 35 M22 18 L25 34 M40 14 L45 31" stroke="#1c1208" strokeWidth="4.2" strokeLinecap="round" />
      </g>
      <g transform="translate(80,-50) scale(0.62)" fill="none" stroke="#1c1208" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-30 4 Q-34 -12 -22 -20 Q-14 -24 -8 -14 Q8 -8 26 -10 Q40 -8 44 4 Q44 14 34 16 Q4 20 -14 14" strokeWidth="3" />
        <path d="M-22 -20 Q-34 -26 -40 -16 Q-42 -8 -36 -4" strokeWidth="3" />
        <path d="M-18 -22 l4 -6 M-12 -18 l5 -7" strokeWidth="2" />
        <path d="M-10 16 L-12 32 M2 18 L2 34 M24 16 L26 32 M34 14 L38 30" strokeWidth="3" />
        <path d="M44 2 Q54 6 50 18" strokeWidth="2.4" />
      </g>
      {[[96, 34, 1, -8], [68, 58, 0.8, 14]].map(([hx, hy, sc, rot], i) => (
        <g key={i} transform={`translate(${hx},${hy}) rotate(${rot}) scale(${sc})`}>
          <circle cx="0" cy="-4" r="26" fill="url(#ce-ocre)" />
          <g fill="#d6b682">
            <rect x="-8" y="-2" width="16" height="16" rx="6" />
            <rect x="-8.5" y="-20" width="4.2" height="20" rx="2.1" />
            <rect x="-3.4" y="-24" width="4.2" height="24" rx="2.1" />
            <rect x="1.7" y="-22" width="4.2" height="22" rx="2.1" />
            <rect x="6.6" y="-16" width="3.8" height="17" rx="1.9" />
            <rect x="-16" y="-8" width="5" height="14" rx="2.5" transform="rotate(-38 -13 0)" />
          </g>
        </g>
      ))}
      {/* le SOS caché sous le ventre du bison : · · ·  — — —  · · · */}
      {sos && (
        <g fill="#a8301a" stroke="#a8301a" strokeLinecap="round">
          {[0, 1, 2].map((k) => <circle key={`a${k}`} cx={-86 + k * 7} cy="56" r="2.2" stroke="none" />)}
          {[0, 1, 2].map((k) => <line key={`b${k}`} x1={-60 + k * 13} y1="56" x2={-52 + k * 13} y2="56" strokeWidth="3.6" />)}
          {[0, 1, 2].map((k) => <circle key={`c${k}`} cx={-16 + k * 7} cy="56" r="2.2" stroke="none" />)}
        </g>
      )}
    </g>
  );
}

/* les dégradés communs aux planches (roche, ocre soufflé) */
function DefsCarnet() {
  return (
    <defs>
      <radialGradient id="ce-roche" cx="45%" cy="40%" r="70%">
        <stop offset="0%" stopColor="#e6cc9c" /><stop offset="60%" stopColor="#c09868" /><stop offset="100%" stopColor="#8a6438" />
      </radialGradient>
      <radialGradient id="ce-ocre" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#a83c18" stopOpacity="0.9" /><stop offset="55%" stopColor="#b04a20" stopOpacity="0.6" /><stop offset="100%" stopColor="#b04a20" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/* les personnages de la station, comme dans le reste du jeu */
const ELIAS = { skin: "#e0b898", hair: "#e8e8e0", look: "short", beard: true, garment: "tunic", coat: "#c8a878", pants: "#4a3a28" };
const MIRA = { skin: "#c8946a", hair: "#1a1408", look: "braids", earrings: "#c8a848", lips: "#c85028", garment: "jacket", coat: "#3a5878", pants: "#1a2838" };
const LEA = { skin: "#f4cfae", hair: "#b8501f", look: "curls", garment: "jacket", coat: "#2f7f86", pants: "#1e3a40" };

/* ─── Planche 1 : nous, les chronautes (la station, la petite équipe) ─── */
function P1() {
  return (
    <svg viewBox="0 0 800 460" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="p1c-ciel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a3a5a" /><stop offset="60%" stopColor="#c87a5a" /><stop offset="100%" stopColor="#e8b878" />
        </linearGradient>
      </defs>
      <rect width="800" height="460" fill="url(#p1c-ciel)" />
      <circle cx="640" cy="210" r="34" fill="#ffd8a0" opacity="0.8" />
      <path d="M0 300 Q160 250 320 280 Q480 250 640 275 Q720 262 800 270 L800 460 L0 460 Z" fill="#5a4a5a" opacity="0.6" />
      <path d="M0 330 Q200 300 400 320 Q600 296 800 318 L800 460 L0 460 Z" fill="#3a3040" />
      {/* la station : un dôme géodésique rapiécé, panneaux solaires, antenne */}
      <g transform="translate(400,330)">
        <path d="M-150 0 A150 120 0 0 1 150 0 Z" fill="#9aa4b0" stroke="#3a4858" strokeWidth="2" />
        <path d="M-150 0 L-110 -80 L-40 -116 L40 -116 L110 -80 L150 0 M-150 0 L-75 -104 L0 -120 L75 -104 L150 0 M-110 -80 L0 -70 L110 -80 M-40 -116 L-75 -104 L0 -70 L75 -104 L40 -116 M-110 -80 L-90 0 M110 -80 L90 0 M0 -70 L0 0"
          stroke="#3a4858" strokeWidth="1" fill="none" opacity="0.8" />
        <path d="M-70 -60 l30 -6 l6 24 l-30 6 Z" fill="#c8a878" stroke="#5a4028" strokeWidth="1" />
        <path d="M60 -40 l26 4 l-4 22 l-26 -4 Z" fill="#7a8a6a" stroke="#3a4a2a" strokeWidth="1" />
        <path d="M-18 0 L-18 -34 Q-18 -46 0 -46 Q18 -46 18 -34 L18 0 Z" fill="#2a2018" stroke="#1a1008" strokeWidth="1" />
        <line x1="0" y1="-120" x2="0" y2="-170" stroke="#3a4858" strokeWidth="2" />
        <circle cx="0" cy="-172" r="4" fill="#ff6a5a"><animate attributeName="opacity" values="1;0.2;1" dur="1.6s" repeatCount="indefinite" /></circle>
        {[-250, -200].map((x) => <g key={x} transform={`translate(${x},-10) rotate(-12)`}><rect x="-22" y="-14" width="44" height="26" fill="#2a3a6a" stroke="#9aa4b0" strokeWidth="1.5" /><path d="M-22 -1 H22 M-7 -14 V12 M8 -14 V12" stroke="#5a6a9a" strokeWidth="0.8" /></g>)}
      </g>
      {/* la petite équipe, devant la station, et la MARTINE « sœur » qui attend */}
      <g transform="translate(0,0)">
        <Figure x={200} y={430} s={0.95} {...ELIAS} mood="content" arms={[{ a1: 9, a2: 6 }, { a1: 30, a2: 20 }]} />
        <Figure x={270} y={432} s={0.92} {...MIRA} mood="content" arms={[{ a1: 9, a2: 6 }, { a1: 9, a2: 6 }]} />
        <Figure x={540} y={432} s={0.92} {...LEA} glasses mood="neutre" arms={[{ a1: 20, a2: 10 }, { a1: 9, a2: 6 }]} />
        <Figure x={610} y={434} s={0.85} skin="#a8785a" hair="#2a1a10" look="short" garment="jacket" coat="#6a5a3a" pants="#2a2a30" mood="neutre" arms={[{ a1: 9, a2: 6 }, { a1: 9, a2: 6 }]} />
      </g>
      <g transform="translate(372,372)">
        <ellipse cx="28" cy="62" rx="26" ry="5" fill="#000" opacity="0.25" />
        <svg x="0" y="0" width="56" height="56" viewBox="0 0 100 100" overflow="visible"><AvatarSoeur /></svg>
      </g>
    </svg>
  );
}

/* la MARTINE « sœur » : la même coque, l'œil éteint (elle attend sa pilote) */
function AvatarSoeur() {
  return (
    <g>
      <ellipse cx="50" cy="55" rx="40" ry="34" fill="#8a5a38" stroke="#3a2010" strokeWidth="3" />
      <path d="M14 50 Q50 38 86 50" stroke="#5a3820" strokeWidth="2" fill="none" />
      <circle cx="50" cy="56" r="15" fill="#e8e0d0" stroke="#3a2010" strokeWidth="2.5" />
      <circle cx="50" cy="56" r="7" fill="#3a4858" />
      <line x1="50" y1="22" x2="50" y2="6" stroke="#3a2010" strokeWidth="2.5" />
      <circle cx="50" cy="5" r="4" fill="#5a6a7a" />
      <path d="M8 56 h-8 M92 56 h8" stroke="#9aa4b0" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

/* ─── Planche 3 : d'où vient la maladie (la vieille machine de Léa, la
   fissure du temps, les quatre règles d'Al3x1a) ─── */
function P3() {
  const REGLES = ["Ne croise jamais un autre toi-même.", "Ne raconte pas le futur.", "Ne laisse rien du futur dans le passé.", "Rentre avant qu'il soit trop tard."];
  return (
    <svg viewBox="0 0 800 460" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="p3c-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141c2a" /><stop offset="100%" stopColor="#06080e" />
        </linearGradient>
        <linearGradient id="p3c-faille" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7fd8ff" stopOpacity="0" /><stop offset="50%" stopColor="#c8f0ff" stopOpacity="0.95" /><stop offset="100%" stopColor="#7fd8ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="800" height="460" fill="url(#p3c-bg)" />
      {/* la fissure du temps, derrière la machine, où tombent des souvenirs */}
      <path d="M40 60 L120 120 L100 170 L190 220 L160 280 L250 330 L230 400" stroke="url(#p3c-faille)" strokeWidth="6" fill="none" />
      <path d="M40 60 L120 120 L100 170 L190 220 L160 280 L250 330 L230 400" stroke="#e8f8ff" strokeWidth="1.2" fill="none" opacity="0.8" />
      {[[150, 140, -12], [210, 250, 18], [120, 210, 30], [260, 380, -20]].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${r})`} opacity="0.75">
          <rect x="-16" y="-12" width="32" height="24" fill="#f0e8d8" stroke="#8a7a60" strokeWidth="1" />
          <rect x="-13" y="-9" width="26" height="14" fill="#a8b8c8" />
          <animate attributeName="opacity" values="0.75;0.15;0.75" dur={`${3 + i}s`} repeatCount="indefinite" />
        </g>
      ))}
      {/* K-01, le prototype de Léa (vers 2030) : une capsule bricolée, des étincelles */}
      <g transform="translate(250,300)">
        <rect x="-70" y="-120" width="140" height="150" rx="18" fill="#4a5058" stroke="#1a2028" strokeWidth="3" />
        <rect x="-50" y="-100" width="100" height="70" rx="10" fill="#0e1a24" stroke="#7fd8ff" strokeWidth="2" />
        <circle cx="0" cy="-65" r="20" fill="none" stroke="#7fd8ff" strokeWidth="2" opacity="0.7" />
        <text x="0" y="12" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="16" fontWeight="800" fill="#ffd166">K-01</text>
        <path d="M-70 -20 Q-110 -10 -100 30 M70 -40 Q110 -30 120 20" stroke="#2a2a2a" strokeWidth="5" fill="none" />
        {[[-80, -110], [86, -96], [60, -128]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} l6 -10 l-2 8 l8 -4 l-6 10`} stroke="#ffd166" strokeWidth="2" fill="none">
            <animate attributeName="opacity" values="1;0;1" dur={`${0.6 + i * 0.3}s`} repeatCount="indefinite" />
          </path>
        ))}
        <rect x="-60" y="30" width="120" height="10" fill="#1a2028" />
      </g>
      {/* les quatre règles, écrites à la main par Al3x1a */}
      <g transform="translate(560,220) rotate(2)">
        <rect x="-190" y="-150" width="380" height="290" fill="#efe2c4" stroke="#8a6838" strokeWidth="2" />
        <path d="M-190 -150 l20 0 l-20 18 Z M190 140 l-20 0 l20 -18 Z" fill="#d8c8a0" />
        <text x="0" y="-112" textAnchor="middle" fontFamily="Georgia, serif" fontSize="20" fontWeight="700" fill="#3a2418" letterSpacing="2">LES 4 RÈGLES</text>
        {REGLES.map((r, i) => (
          <g key={i} transform={`translate(-166,${-66 + i * 50})`}>
            <circle cx="10" cy="-6" r="13" fill="#3a5878" />
            <text x="10" y="-1" textAnchor="middle" fontFamily="Georgia, serif" fontSize="15" fontWeight="800" fill="#efe2c4">{i + 1}</text>
            <text x="34" y="-1" fontFamily="Georgia, serif" fontStyle="italic" fontSize="15.5" fill="#2a3a5a">{r}</text>
          </g>
        ))}
        <text x="150" y="126" textAnchor="end" fontFamily="Georgia, serif" fontStyle="italic" fontSize="16" fill="#2a4a9a">— A.</text>
      </g>
    </svg>
  );
}

/* ─── Planche 4 : comment on tient (on écrit tout ; MARTINE se souvient) ─── */
function P4() {
  const NOTES = [["Mira", "ingénieure"], ["Léa", "K-01, la machine"], ["Elias", "moi"], ["la cantine", "à gauche"], ["mardi", "j'ai déjà écrit ça ?"]];
  return (
    <svg viewBox="0 0 800 460" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="p4c-mur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3020" /><stop offset="100%" stopColor="#1a140c" />
        </linearGradient>
      </defs>
      <rect width="800" height="460" fill="url(#p4c-mur)" />
      {/* le mur couvert de notes et de photos reliées par des fils */}
      <path d="M90 120 L230 90 L330 150 M230 90 L190 210 L330 150" stroke="#c84030" strokeWidth="1.5" fill="none" opacity="0.8" />
      {NOTES.map(([a, b], i) => {
        const [x, y, r] = [[90, 120, -4], [230, 90, 3], [330, 150, -2], [190, 210, 5], [60, 230, -6]][i];
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
            <rect x="-48" y="-30" width="96" height="60" fill={i % 2 ? "#f0e070" : "#f4ead0"} stroke="#8a7a50" strokeWidth="1" />
            <circle cx="0" cy="-26" r="3.5" fill="#c84030" />
            <text x="0" y="-4" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="14" fill="#2a2010">{a}</text>
            <text x="0" y="14" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="10.5" fill="#5a4a30">{b}</text>
          </g>
        );
      })}
      {/* Elias, derrière la table, qui écrit (dessiné AVANT la table) */}
      <Figure x={300} y={418} s={1.12} {...ELIAS} mood="neutre" arms={[{ a1: 34, a2: 70 }, { a1: 30, a2: 76 }]} />
      {/* le bureau : plateau et façade pleine (on ne voit qu'Elias au-dessus) */}
      <rect x="40" y="330" width="420" height="16" fill="#5a3a20" />
      <rect x="48" y="346" width="404" height="114" fill="#3a2410" />
      <path d="M150 346 V460 M350 346 V460 M48 400 H452" stroke="#2a1808" strokeWidth="2" opacity="0.7" />
      {[100, 250, 400].map((x) => <circle key={x} cx={x} cy="372" r="3" fill="#c8a848" />)}
      {[0, 1, 2, 3].map((k) => <rect key={k} x={80 + k * 3} y={318 - k * 10} width="70" height="10" rx="2" fill={["#7a3a28", "#3a5a6a", "#6a5a2a", "#4a3a5a"][k]} stroke="#1a1008" strokeWidth="0.8" />)}
      <g transform="translate(300,330)">
        <rect x="-44" y="-6" width="88" height="6" fill="#f4ead0" stroke="#8a7a50" strokeWidth="0.8" />
        <path d="M-34 -3 h50 M-34 -1 h40" stroke="#5a4a30" strokeWidth="0.6" />
        <path d="M18 -4 l16 -12" stroke="#2a2010" strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* l'écran de MARTINE : sa mémoire, à elle, ne s'efface pas */}
      <g transform="translate(610,230)">
        <rect x="-150" y="-140" width="300" height="220" rx="12" fill="#0a1410" stroke="#5eff9e" strokeWidth="3" />
        <svg x="-26" y="-130" width="52" height="52" viewBox="0 0 100 100" overflow="visible"><AvatarSoeur /></svg>
        <text x="0" y="-60" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="12" fill="#5eff9e" letterSpacing="2">MÉMOIRE DE MARTINE</text>
        {["Elias · chef des chronautes", "Mira · ingénieure", "Léa · inventrice de K-01", "Al3x1a · partie en 2035"].map((l, i) => (
          <g key={i} transform={`translate(-128,${-34 + i * 26})`}>
            <rect x="0" y="-12" width="18" height="18" fill="#1a3a28" stroke="#5eff9e" strokeWidth="1" />
            <text x="28" y="2" fontFamily="ui-monospace,monospace" fontSize="12" fill="#c8ffd8">{l}</text>
          </g>
        ))}
        <text x="0" y="68" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="11" fill="#5eff9e" opacity="0.8">12 408 souvenirs archivés ▮</text>
      </g>
    </svg>
  );
}

/* ─── Planche 5 : les signaux (le SOS du joueur, apparu sur la paroi) ─── */
function PSignaux() {
  return (
    <svg viewBox="0 0 800 460" style={{ width: "100%", height: "auto", display: "block" }}>
      <DefsCarnet />
      <defs>
        <linearGradient id="p6c-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1c10" /><stop offset="100%" stopColor="#0e0804" />
        </linearGradient>
        <linearGradient id="p6c-lampe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff2c8" stopOpacity="0.55" /><stop offset="100%" stopColor="#fff2c8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="800" height="460" fill="url(#p6c-bg)" />
      {/* la paroi, en grand */}
      <g transform="translate(450,215) scale(2.15)"><Paroi sos /></g>
      {/* Mira éclaire la paroi à la lampe : le faisceau tombe sur le SOS */}
      <path d="M136 384 L470 312 L470 358 Z" fill="#fff2c8" opacity="0.22" />
      <g transform="translate(80,370)">
        <Figure x={0} y={90} s={0.95} {...MIRA} mood="surpris" arms={[{ a1: 9, a2: 6 }, { a1: 80, a2: 84 }]} />
      </g>
    </svg>
  );
}

/* ─── Planche 2 : la maladie de l'oubli ─── */
function P5() {
  return (
    <svg viewBox="0 0 800 460" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="p5-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2028" /><stop offset="100%" stopColor="#0a0e18" />
        </linearGradient>
        <radialGradient id="p5-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe090" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffe090" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="460" fill="url(#p5-bg)" />

      {/* la personne âgée, moitié gauche nette, moitié droite qui s'efface */}
      <g transform="translate(340,220)">
        {/* buste et tête du kit, deux fois : à gauche net, à droite qui s'estompe */}
        <clipPath id="p5-gauche"><rect x="-200" y="-120" width="200" height="340" /></clipPath>
        <clipPath id="p5-droite"><rect x="0" y="-120" width="200" height="340" /></clipPath>
        <g clipPath="url(#p5-gauche)">
          <Bust x={-30} y={-10} s={3.23} skin="#e0b898" hair="#e8e8e0" look="bun" wrinkles mood="vexe" cloth="#5a4838" collar="round" />
        </g>
        <g clipPath="url(#p5-droite)" opacity="0.3">
          <Bust x={-30} y={-10} s={3.23} skin="#e0b898" hair="#e8e8e0" look="bun" wrinkles mood="vexe" cloth="#5a4838" collar="round" />
        </g>
        <path d="M0 -70 V200" stroke="#c8d4e2" strokeWidth="1" strokeDasharray="3 5" opacity="0.4" />
        {/* particules qui s'échappent du côté effacé, comme mémoire qui part au vent */}
        {[[20, -40], [30, -20], [40, 0], [26, 20], [40, -50]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.6" fill="#c8d4e2" opacity="0.5">
            <animate attributeName="cx" values={`${x};${x + 30};${x + 60}`} dur={`${3 + i}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.2;0" dur={`${3 + i}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {/* pancarte "Je m'appelle ..." pendue au cou */}
        <path d="M-30 50 L-30 90" stroke="#8a6838" strokeWidth="1" />
        <rect x="-72" y="90" width="84" height="30" fill="#f0e0c0" stroke="#8a6838" strokeWidth="1" />
        <text x="-64" y="103" fontSize="9" fontFamily="Georgia, serif" fill="#3a2418">Je m'appelle</text>
        <text x="-64" y="115" fontSize="10" fontFamily="Georgia, serif" fill="#8a6838" letterSpacing="2">. . . . . . .</text>
      </g>

      {/* enfant qui tend une photo, halo doré autour de la photo */}
      <g transform="translate(560,320)">
        <ellipse cx="0" cy="-30" rx="60" ry="45" fill="url(#p5-glow)" />
        <Figure x={0} y={90} s={1.08} skin="#f0d0a8" hair="#3a2818" look="short" mood="content" garment="tee" coat="#e05028" pants="#3a4a6a" shoes="#e8e8e0" belt={false}
          arms={[{ a1: 110, a2: 100 }, { a1: 14, a2: 6 }]} />
        <g transform="translate(-50,-28) rotate(-8)">
          <rect x="-20" y="-16" width="40" height="32" fill="#fff" stroke="#8a6838" strokeWidth="1" />
          {/* photo : une jeune femme avec un enfant */}
          <ellipse cx="-6" cy="-4" rx="6" ry="8" fill="#e0b898" />
          <path d="M-12 -8 Q-6 -14 0 -8 L0 4 L-12 4 Z" fill="#3a2818" />
          <ellipse cx="8" cy="4" rx="4" ry="5" fill="#f0d0a8" />
        </g>
        {/* bulle "c'est toi, mamie" */}
        <g transform="translate(30,-58)">
          <rect x="-4" y="-14" width="90" height="24" fill="#fff" rx="4" />
          <path d="M4 8 L-4 14 L4 8 Z" fill="#fff" />
          <text x="40" y="0" textAnchor="middle" fontSize="10" fontFamily="Georgia, serif" fill="#3a2418">c'est toi, mamie…</text>
        </g>
      </g>

      {/* photos qui tombent, feuilles envolées en fond */}
      {[[100, 80], [180, 140], [80, 300], [700, 100], [640, 220]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${i * 20 - 40})`} opacity="0.6">
          <rect x="-12" y="-9" width="24" height="18" fill="#fff" stroke="#8a6838" strokeWidth="0.6" />
          <rect x="-10" y="-7" width="20" height="10" fill="#c8b8a0" />
          <animateTransform attributeName="transform" type="translate" values={`${x} ${y};${x + 20} ${y + 60};${x} ${y}`} dur={`${6 + i}s`} repeatCount="indefinite" additive="sum" />
        </g>
      ))}
    </svg>
  );
}

/* ─── Séquence complète ─── */
const PLANCHES = [
  { titre: "Carnet d'Elias",            date: "2045",   Vignette: P0, cover: true,
    texte: "Je m'appelle Elias. Je vis à la station des chronautes. J'écris ces pages pour que ce qui nous arrive ne s'efface pas tout à fait. Tourne, si tu veux lire." },
  { titre: "Nous, les chronautes",      date: "2045",   Vignette: P1,
    texte: "Nous sommes une poignée, dans une vieille station. Une fille venue du futur, Al3x1a, nous a appris à voyager dans le temps sans rien abîmer. Notre mission : trouver un remède." },
  { titre: "La maladie de l'oubli",     date: "aujourd'hui", Vignette: P5,
    texte: "Quelque chose nous ronge. On perd nos souvenirs, un peu chaque jour. Certains oublient jusqu'à leur propre nom. Ceux qui oublient tout oublient même qu'ils oublient. C'est le pire." },
  { titre: "D'où elle vient",           date: "vers 2030", Vignette: P3,
    texte: "Les premiers voyages dans le temps ont changé le passé, sans le vouloir. Chaque changement efface un peu de nos souvenirs. Al3x1a a écrit quatre règles pour que ça n'arrive plus. Mais le mal était fait." },
  { titre: "Comment on tient",          date: "chaque jour", Vignette: P4,
    texte: "On écrit tout : les noms, les visages, ce qu'on a fait la veille. Et MARTINE se souvient pour nous. Sa mémoire, à elle, ne s'efface pas." },
  { titre: "Les signaux",               date: "depuis quelques jours", Vignette: PSignaux,
    texte: "Des signes apparaissent dans les plus vieilles traces, là où il n'y avait rien : trois points, trois traits, trois points. Sur une paroi de 20 000 ans. Quelqu'un arrive." },
];

export default function CarnetElias({ onDone }) {
  const [i, setI] = useState(0);
  const p = PLANCHES[i];
  const total = PLANCHES.length;
  const dernier = i === total - 1;

  /* Clic n'importe où sur l'écran = tourner la page.
     Sur la dernière planche : ferme le carnet. */
  const advance = () => { if (dernier) onDone(); else setI(i + 1); };

  return (
    <div onClick={advance}
      style={{ position: "fixed", inset: 0, background: "#050810", color: "#e8eef5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: 20, zIndex: 80, fontFamily: "Georgia, serif", overflowY: "auto", cursor: "pointer" }}>
      {/* en-tête : indication + option skip discret */}
      <div style={{ width: "100%", maxWidth: 900, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11.5, letterSpacing: 3, color: "#ffd166" }}>📖 LE CARNET D'ELIAS · {i + 1}/{total}</div>
        <button onClick={(e) => { e.stopPropagation(); onDone(); }}
          title="Sauter le carnet"
          style={{ background: "rgba(20,27,38,0.6)", color: "#8fa3bd", border: "1px solid rgba(200,212,226,0.25)", borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600, fontFamily: "ui-monospace,monospace", cursor: "pointer", letterSpacing: 1, backdropFilter: "blur(4px)" }}>
          passer ›
        </button>
      </div>

      {/* la page du carnet : couleur parchemin, ombre douce */}
      <div style={{ width: "100%", maxWidth: 900, background: "#f2e6cc", color: "#2a1810", border: "1px solid #8a6838", borderRadius: 6, boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 2px 0 #d8c8a0 inset", padding: 22, position: "relative" }}>
        {/* petite indication de chapitre en haut */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #a89058", paddingBottom: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>{p.titre}</div>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 2, color: "#8a5828" }}>{p.date}</div>
        </div>

        {/* la case dessinée */}
        <div style={{ border: "1px solid #8a6838", boxShadow: "inset 0 0 0 3px #f2e6cc, inset 0 0 0 4px #8a6838", borderRadius: 3, overflow: "hidden", background: "#0a0a12" }}>
          <p.Vignette />
        </div>

        {/* texte narratif */}
        <p style={{ fontSize: 17, lineHeight: 1.7, margin: "16px 4px 4px", fontStyle: "italic", color: "#2a1810" }}>
          « {p.texte} »
        </p>
      </div>

      {/* barre de navigation */}
      <div style={{ display: "flex", gap: 12, marginTop: 16, alignItems: "center" }} onClick={(e) => e.stopPropagation()}>
        <button onClick={(e) => { e.stopPropagation(); setI(Math.max(0, i - 1)); }} disabled={i === 0}
          style={{ background: i === 0 ? "#26324a" : "#141b26", color: i === 0 ? "#5a7a90" : "#c8d4e2", border: "1px solid #3a4a68", borderRadius: 10, padding: "10px 18px", fontFamily: "ui-monospace,monospace", fontWeight: 700, cursor: i === 0 ? "default" : "pointer" }}>
          ‹ Précédent
        </button>
        {/* points de progression */}
        <div style={{ display: "flex", gap: 6 }}>
          {PLANCHES.map((_, k) => (
            <div key={k} onClick={(e) => { e.stopPropagation(); setI(k); }}
              style={{ width: 10, height: 10, borderRadius: "50%", background: k === i ? "#ffd166" : k < i ? "#8a6838" : "#26324a", cursor: "pointer", border: "1px solid #3a2818" }} />
          ))}
        </div>
        {!dernier ? (
          <button onClick={(e) => { e.stopPropagation(); setI(i + 1); }}
            style={{ background: "#8a6838", color: "#f2e6cc", border: "none", borderRadius: 10, padding: "10px 18px", fontFamily: "ui-monospace,monospace", fontWeight: 700, cursor: "pointer" }}>
            Suivant ›
          </button>
        ) : (
          <button onClick={onDone}
            style={{ background: "#e8934a", color: "#160c02", border: "none", borderRadius: 10, padding: "10px 22px", fontFamily: "ui-monospace,monospace", fontWeight: 800, letterSpacing: 1, cursor: "pointer", boxShadow: "0 0 20px rgba(232,150,74,0.5)" }}>
            ▸ Rejoindre la station
          </button>
        )}
      </div>
    </div>
  );
}
