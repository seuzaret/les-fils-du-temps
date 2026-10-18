import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 8 — Tableau : Studio BBC, Bush House, Londres,
   5 juin 1944, 21h00. Petit studio insonorisé, lumière tamisée,
   panneau ON AIR à droite. Arthur Smith au pupitre ; il faut
   lui apporter le MICRO (sur la table à gauche), puis lui glisser
   le FEUILLET de Verlaine (posé près du micro).
   Quand msg_radio_londres est transmis : la lampe ON AIR passe
   au rouge, les ondes jaillissent par la fenêtre vers l'Europe.
   ============================================================ */

export default function SceneBBC({ collect, action, reveal, made = [], flags = [] }) {
  const microBranche = !!flags.micro_branche;
  const enOnde = made.includes("msg_radio_londres");

  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="bbc-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a4238" /><stop offset="100%" stopColor="#2a221a" /></linearGradient>
        <linearGradient id="bbc-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6a5238" /><stop offset="100%" stopColor="#2c1e12" /></linearGradient>
        <linearGradient id="bbc-desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7a5636" /><stop offset="100%" stopColor="#432c18" /></linearGradient>
        <radialGradient id="bbc-lamp" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffcf78" stopOpacity="0.5" /><stop offset="100%" stopColor="#ff9540" stopOpacity="0" /></radialGradient>
        <radialGradient id="bbc-red" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ff3820" stopOpacity="0.75" /><stop offset="100%" stopColor="#ff3820" stopOpacity="0" /></radialGradient>
        {/* ciel de Londres, nuit du 5 juin 44 — bleu-nuit qui vire un peu au violet à l'horizon */}
        <linearGradient id="bbc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0a1428" />
          <stop offset="55%"  stopColor="#12203a" />
          <stop offset="100%" stopColor="#2c1e2a" />
        </linearGradient>
        {/* faisceau de projecteur DCA (défense anti-aérienne) */}
        <linearGradient id="bbc-searchlight" x1="0" y1="1" x2="0.5" y2="0">
          <stop offset="0%"   stopColor="#e8e0b0" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#e8e0b0" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ═══ FOND — mur du studio, panneaux acoustiques ═══ */}
      <PLayer depth={4}>
        <rect width="1000" height="560" fill="url(#bbc-wall)" />
        {[...Array(4)].map((_, r) => [...Array(10)].map((_, c) => (
          <rect key={`p-${r}-${c}`} x={40 + c * 96} y={40 + r * 72} width="76" height="52" rx="4"
            fill="#3a3228" opacity="0.55" />
        )))}
        {/* halo de la lampe ON AIR quand active */}
        {enOnde && <circle cx="830" cy="150" r="120" fill="url(#bbc-red)" />}

        {/* FENÊTRE avec vue sur Londres, nuit du 5 juin 1944 (blackout).
             Positionnée entre la pendule (490) et le panneau ON AIR (770-890) :
             au-dessus du speaker, dans l'axe des ondes qui vont partir. */}
        <g transform="translate(560,60)">
          {/* embrasure — dormant en bois épais */}
          <rect x="-6" y="-6" width="192" height="192" fill="#1a1006" />
          <rect x="0" y="0" width="180" height="180" fill="url(#bbc-sky)" />
          {/* halo lunaire */}
          <circle cx="130" cy="46" r="22" fill="#e8e0b0" opacity="0.28" />
          <circle cx="130" cy="46" r="10" fill="#f8f0d0" opacity="0.85" />
          <circle cx="128" cy="44" r="3" fill="#c8c0a0" opacity="0.4" />
          {/* faisceau de projecteur DCA qui balaie le ciel — cône blanchâtre */}
          <g style={{ transformOrigin: "20px 178px" }}>
            <animateTransform attributeName="transform" type="rotate"
              values="-25;10;-25" dur="9s" repeatCount="indefinite" />
            <path d="M18 178 L64 20 L84 20 L40 178 Z" fill="url(#bbc-searchlight)" opacity="0.55" />
          </g>
          {/* étoiles */}
          {[[24, 22, 1], [56, 30, 0.8], [80, 14, 1.1], [166, 20, 0.9], [174, 60, 0.8]].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#f8f0d8" opacity="0.75">
              <animate attributeName="opacity" values="0.4;0.9;0.4" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
            </circle>
          ))}
          {/* silhouette de LONDRES : Big Ben à gauche, Parliament, toits, dôme St-Paul à droite */}
          {/* toits + terrasses en fond */}
          <path d="M0 148 L20 128 L40 130 L60 118 L80 122 L90 108 L100 118 L114 116 L128 106 L140 118 L156 114 L168 122 L180 122 L180 180 L0 180 Z"
            fill="#0a0e1c" />
          {/* Big Ben (tour de l'horloge) à gauche */}
          <g transform="translate(24,120)">
            <rect x="-8" y="0" width="16" height="60" fill="#12162a" />
            {/* horloge éclairée */}
            <rect x="-6" y="6" width="12" height="10" fill="#f0d888" opacity="0.9" />
            <path d="M0 8 L0 13 M0 11 L4 11" stroke="#3a2810" strokeWidth="0.6" />
            {/* balustrade + toit pointu */}
            <rect x="-9" y="-3" width="18" height="3" fill="#12162a" />
            <path d="M-8 -3 L0 -20 L8 -3 Z" fill="#12162a" />
            <path d="M0 -20 L0 -30" stroke="#12162a" strokeWidth="2" />
            <circle cx="0" cy="-30" r="1.5" fill="#12162a" />
          </g>
          {/* Parliament à côté (crénelures) */}
          <path d="M40 130 L40 108 L44 108 L44 112 L48 112 L48 108 L52 108 L52 112 L56 112 L56 108 L60 108 L60 130 Z"
            fill="#12162a" />
          {/* dôme St-Paul à droite */}
          <g transform="translate(140,118)">
            <ellipse cx="0" cy="0" rx="14" ry="10" fill="#12162a" />
            <path d="M-14 0 L14 0 L14 12 L-14 12 Z" fill="#12162a" />
            <path d="M0 -10 L0 -16" stroke="#12162a" strokeWidth="1.6" />
            <circle cx="0" cy="-16" r="1.6" fill="#12162a" />
          </g>
          {/* ballon de barrage flottant, argenté */}
          <g transform="translate(88,60)">
            <ellipse cx="0" cy="0" rx="8" ry="5" fill="#5a6474" opacity="0.85" />
            <path d="M-5 4 L-2 8 L2 8 L5 4" fill="none" stroke="#3a4454" strokeWidth="0.6" />
            <path d="M-2 8 L0 40 L4 40" stroke="#3a4454" strokeWidth="0.5" fill="none" />
          </g>
          {/* menuiserie : croisillons de la fenêtre (double vertical + horizontal médian) */}
          <path d="M60 0 v180 M120 0 v180 M0 90 h180" stroke="#3a2418" strokeWidth="4" />
          <path d="M60 90 h60" stroke="#3a2418" strokeWidth="4.5" />
          {/* rebord intérieur en bois clair */}
          <rect x="-6" y="180" width="192" height="10" fill="#5a3818" stroke="#2a1408" strokeWidth="1" />
          <path d="M-6 184 L186 184" stroke="#8a5828" strokeWidth="0.5" opacity="0.7" />
          {/* rideau de blackout à moitié tiré à droite */}
          <rect x="152" y="0" width="34" height="180" fill="#1a0e08" opacity="0.9" />
          <path d="M156 0 v180 M164 0 v180 M172 0 v180 M180 0 v180" stroke="#0a0402" strokeWidth="0.6" opacity="0.5" />
          {/* petit reflet lumineux sur la vitre (frontière du blackout) */}
          <path d="M152 0 L152 180" stroke="#4a4028" strokeWidth="0.6" opacity="0.55" />
          {/* étiquette réglementaire en bas */}
          <rect x="4" y="192" width="86" height="8" fill="#e8dfc8" stroke="#3a2418" strokeWidth="0.4" />
          <text x="47" y="199" textAnchor="middle" fontSize="5" fontFamily="ui-monospace,monospace" fill="#3a2418">BLACKOUT — 21:12</text>
        </g>
      </PLayer>

      {/* ═══ ondes qui partent par la fenêtre — visible seulement quand émission ═══ */}
      {enOnde && (
        <PLayer depth={3}>
          {[30, 60, 90, 120, 160].map((r, i) => (
            <path key={i} d={`M650 150 a${r} ${r * 0.7} 0 0 1 ${r * 1.5} 0`} fill="none"
              stroke="#ffd166" strokeWidth="2" opacity={0.85 - i * 0.16}
              style={{ animation: "pulse 1.6s ease-in-out infinite" }} />
          ))}
        </PLayer>
      )}

      {/* ═══ PLAN DU MILIEU : la table technique, le pupitre, le pied du micro ═══ */}
      <PLayer depth={2}>
        {/* sol */}
        <rect y="420" width="1000" height="140" fill="url(#bbc-floor)" />
        {/* pendule murale — 21h00 le 5 juin 1944 */}
        <circle cx="490" cy="90" r="34" fill="#f0e8d0" stroke="#3a2c18" strokeWidth="3" />
        <circle cx="490" cy="90" r="2" fill="#1a1006" />
        <path d="M490 90 L490 68 M490 90 L508 88" stroke="#1a1006" strokeWidth="2" strokeLinecap="round" />
        {[0, 90, 180, 270].map((a, i) => {
          const rad = (a * Math.PI) / 180;
          const x1 = 490 + Math.cos(rad) * 26, y1 = 90 + Math.sin(rad) * 26;
          const x2 = 490 + Math.cos(rad) * 30, y2 = 90 + Math.sin(rad) * 30;
          return <path key={i} d={`M${x1} ${y1} L${x2} ${y2}`} stroke="#1a1006" strokeWidth="1.5" />;
        })}

        {/* panneau ON AIR (haut droite) */}
        <rect x="770" y="120" width="120" height="60" rx="8" fill="#2a1608" stroke="#8a5a20" strokeWidth="3" />
        <text x="830" y="158" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="22"
          fontWeight="800" fill={enOnde ? "#ff5030" : "#4a3a2a"}
          style={enOnde ? { filter: "drop-shadow(0 0 6px #ff5030)" } : {}}>
          ON AIR
        </text>

        {/* TABLE de gauche (avec le micro à ramasser + feuillet) */}
        <rect x="60" y="320" width="240" height="18" fill="url(#bbc-desk)" stroke="#2a1608" strokeWidth="2" />
        <rect x="70" y="338" width="14" height="90" fill="#3a2410" />
        <rect x="276" y="338" width="14" height="90" fill="#3a2410" />
        {/* lampe de bureau col-de-cygne (allumée douce) */}
        <path d="M100 320 L100 260 Q100 240 140 240" fill="none" stroke="#4a4038" strokeWidth="4" />
        <path d="M140 232 L152 258 L128 258 Z" fill="#c8963e" />
        <circle cx="140" cy="270" r="18" fill="url(#bbc-lamp)" />

        {/* le MICRO (posé sur la table, cible d'un hotspot) — style micro carbone années 40, gros et rond */}
        {!microBranche && (
          <g transform="translate(200,300)">
            <rect x="-4" y="0" width="8" height="20" fill="#2a2a2a" />
            <ellipse cx="0" cy="-8" rx="18" ry="24" fill="#3a3a3a" stroke="#6a6a6a" strokeWidth="2" />
            <ellipse cx="0" cy="-8" rx="12" ry="18" fill="#1a1a1a" />
            {/* petits trous de la grille */}
            {[[-6, -14], [0, -14], [6, -14], [-6, -6], [0, -6], [6, -6], [-6, 2], [0, 2], [6, 2]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="0.9" fill="#5a5a5a" />
            ))}
          </g>
        )}

        {/* le FEUILLET (Verlaine) — posé sur la table à côté du micro */}
        <g transform="translate(120,306)">
          <rect x="0" y="0" width="46" height="30" fill="#f0e8d0" stroke="#8a5a20" strokeWidth="1"
            transform="rotate(-8)" />
          <path d="M4 6 h32 M4 12 h30 M4 18 h34 M4 24 h28" stroke="#5a4028" strokeWidth="0.7"
            transform="rotate(-8)" />
        </g>
      </PLayer>

      {/* ═══ AVANT-PLAN : ARTHUR au PUPITRE + micro branché (quand posé) ═══ */}
      <PLayer depth={1}>
        {/* silhouette d'ARTHUR — dessinée AVANT le pupitre pour qu'il passe DERRIÈRE
            (bas du corps caché par le meuble) ; le micro sera dessiné APRÈS le pupitre
            pour rester devant lui, sinon on ne verrait plus le micro. */}
        <g transform="translate(720,300)">
          {/* assis derrière le pupitre, casque autour du cou */}
          <Figure x={0} y={121} s={1.38} pose="sit" skin="#e0b48a" hair="#4a3020" look="slick" mustache mood="content"
            garment="jacket" coat="#1a2438" coat2="#efe6d2" pants="#141c2c" shoes="#0a0a10" arms={[{ a1: 20, a2: -30 }, { a1: 20, a2: -30 }]}>
            <path d="M-2.4 -70 L2.4 -70 L1.6 -48 L0 -40 L-1.6 -48 Z" fill="#8a1a1a" />
            <path d="M-15 -70 Q0 -78 15 -70" fill="none" stroke="#2a2a2a" strokeWidth="2.4" />
            <ellipse cx="-15" cy="-69" rx="4" ry="4.6" fill="#3a3a3a" /><ellipse cx="15" cy="-69" rx="4" ry="4.6" fill="#3a3a3a" />
          </Figure>
        </g>

        {/* PUPITRE du speaker (support de dépôt) — dessiné APRÈS Arthur pour cacher
            le bas de son corps. Sa tranche supérieure est à y=360 : la cravate
            se coupe au niveau de la ceinture. */}
        <g>
          <rect x="580" y="360" width="220" height="80" fill="url(#bbc-desk)" stroke="#2a1608" strokeWidth="3" />
          <rect x="580" y="360" width="220" height="14" fill="#5a3818" />
          {/* pied et fils */}
          <rect x="590" y="440" width="14" height="60" fill="#3a2410" />
          <rect x="776" y="440" width="14" height="60" fill="#3a2410" />
          {/* boutons/potards */}
          {[620, 660, 700, 740, 780].map((x, i) => (
            <g key={i}><circle cx={x} cy="392" r="7" fill="#c8963e" stroke="#5a3818" strokeWidth="1.5" /><path d={`M${x} 388 L${x} 396`} stroke="#5a3818" strokeWidth="1.5" /></g>
          ))}
          {/* jack ouvert (à brancher) */}
          <circle cx="820" cy="392" r="9" fill="#0a0604" stroke={microBranche ? "#5eff9e" : "#c8963e"} strokeWidth="2"
            style={microBranche ? {} : { animation: "pulse 1.6s ease-in-out infinite" }} />
        </g>

        {/* le MICRO EN PLACE (quand branché) — dessiné APRÈS le pupitre pour passer DEVANT lui */}
        {microBranche && (
          <g transform="translate(690,340)">
            {/* pied */}
            <rect x="-3" y="0" width="6" height="40" fill="#2a2a2a" />
            <ellipse cx="0" cy="42" rx="16" ry="4" fill="#2a2a2a" />
            {/* tête du micro */}
            <ellipse cx="0" cy="-16" rx="20" ry="26" fill="#3a3a3a" stroke="#6a6a6a" strokeWidth="2" />
            <ellipse cx="0" cy="-16" rx="14" ry="20" fill="#1a1a1a" />
            {[[-8, -24], [0, -24], [8, -24], [-8, -16], [0, -16], [8, -16], [-8, -8], [0, -8], [8, -8]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="1" fill="#5a5a5a" />
            ))}
            {/* logo BBC sous le micro */}
            <rect x="-12" y="12" width="24" height="10" fill="#0a0a0a" />
            <text x="0" y="20" fontSize="7" fontFamily="ui-monospace,monospace" fontWeight="800" fill="#e0d8c0" textAnchor="middle">BBC</text>
          </g>
        )}

        {/* « ? » Q&A d'accueil au-dessus d'Arthur (tant que le message n'est pas transmis) */}
      </PLayer>

      {/* ═══ zones cliquables ═══ */}
      <Hotspot cx={700} cy={340} r={54} label="Arthur Smith" reveal={reveal} onClick={() => action("arthur")} />
      {!microBranche && (
        <Hotspot cx={200} cy={296} r={30} label="le micro de studio" item="micro" reveal={reveal} onClick={() => collect("micro")} />
      )}
      <Hotspot cx={143} cy={314} r={22} label="le feuillet de Verlaine" item="poeme" reveal={reveal} onClick={() => collect("poeme")} />
      {/* le PUPITRE — cible de dépôt (micro puis poème), reconnu SUPPORT via items.pupitre.support=true */}
      <Hotspot cx={690} cy={390} r={64} label={microBranche ? "le pupitre — glisse-y le feuillet" : "le pupitre — glisse-y le micro"} item="pupitre" reveal={reveal} onClick={() => action("arthur")} />
    </svg>
  );
}
