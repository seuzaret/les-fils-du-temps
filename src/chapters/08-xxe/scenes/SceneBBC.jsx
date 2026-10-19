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
        <filter id="bbc-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8" /></filter>
        <radialGradient id="bbc-quilt" cx="45%" cy="40%" r="65%"><stop offset="0%" stopColor="#5e5548" /><stop offset="100%" stopColor="#2e271f" /></radialGradient>
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
      <PLayer depth={1}>
        <rect width="1000" height="560" fill="url(#bbc-wall)" />
        {/* panneaux acoustiques capitonnés : tissu tendu, boutons, joints */}
        {[...Array(5)].map((_, r) => [...Array(11)].map((_, c) => (
          <g key={`p-${r}-${c}`}>
            <rect x={c * 92 - 6} y={r * 84 - 4} width="88" height="80" rx="14" fill="url(#bbc-quilt)" opacity="0.85" />
            {/* plis du capiton entre les boutons */}
            <path d={`M${c * 92 + 16} ${r * 84 + 16} L${c * 92 + 36} ${r * 84 + 36} L${c * 92 + 56} ${r * 84 + 16} M${c * 92 + 16} ${r * 84 + 56} L${c * 92 + 36} ${r * 84 + 36} L${c * 92 + 56} ${r * 84 + 56}`} stroke="#2a241c" strokeWidth="1" fill="none" opacity="0.35" />
            {[[22, 20], [62, 20], [42, 40], [22, 60], [62, 60]].map(([x, y], k) => (
              <circle key={k} cx={c * 92 - 6 + x} cy={r * 84 - 4 + y} r="1.8" fill="#221c16" />
            ))}
          </g>
        )))}
        {/* plinthe et sol de liège */}
        <rect y="404" width="1000" height="20" fill="#2a2018" />
        {/* l'affiche « Careless talk costs lives » */}
        <g transform="translate(400,250)">
          <rect x="-36" y="-50" width="72" height="100" fill="#1a1410" />
          <rect x="-33" y="-47" width="66" height="94" fill="#e0d4b0" />
          <rect x="-33" y="-47" width="66" height="26" fill="#a83020" />
          <text x="0" y="-36" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fill="#f0e8d0" style={{ fontWeight: 700 }}>CARELESS</text>
          <text x="0" y="-26" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fill="#f0e8d0" style={{ fontWeight: 700 }}>TALK</text>
          <circle cx="-8" cy="0" r="9" fill="#5a4a3a" /><circle cx="10" cy="2" r="8" fill="#3a3028" />
          <path d="M-20 22 q12 -14 24 0 Z M0 22 q10 -12 20 0 Z" fill="#4a3a2a" />
          <text x="0" y="36" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7.5" fill="#2a1a10" style={{ fontWeight: 700 }}>COSTS LIVES</text>
        </g>
        {/* la VITRE DE LA RÉGIE : l'ingénieur du son, ses vu-mètres */}
        <g transform="translate(900,214)">
          <rect x="-10" y="-10" width="140" height="130" fill="#1a1006" />
          <rect x="0" y="0" width="120" height="110" fill="#14181c" />
          <rect x="0" y="70" width="120" height="40" fill="#2a2a2e" />
          {[16, 48, 80].map((x, i) => (
            <g key={x}>
              <rect x={x} y="76" width="24" height="16" rx="2" fill="#e8d8a0" opacity="0.7" />
              <path d={`M${x + 12} 90 l${[-6, 4, 7][i]} -10`} stroke="#2a1a10" strokeWidth="1.2">
                <animateTransform attributeName="transform" type="rotate" values={`-10 ${x + 12} 90; 14 ${x + 12} 90; -10 ${x + 12} 90`} dur={`${0.7 + i * 0.3}s`} repeatCount="indefinite" />
              </path>
            </g>
          ))}
          <circle cx="60" cy="40" r="13" fill="#0a0c10" /><path d="M42 70 q18 -26 36 0 Z" fill="#0a0c10" />
          <path d="M47 36 q13 -16 26 0" stroke="#3a3a3a" strokeWidth="3" fill="none" />
          <path d="M6 4 L40 4 L10 60 Z" fill="#fff" opacity="0.05" />
        </g>
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
        <PLayer depth={1.5}>
          {[30, 60, 90, 120, 160].map((r, i) => (
            <path key={i} d={`M650 150 a${r} ${r * 0.7} 0 0 1 ${r * 1.5} 0`} fill="none"
              stroke="#ffd166" strokeWidth="2" opacity={0.85 - i * 0.16}
              style={{ animation: "pulse 1.6s ease-in-out infinite" }} />
          ))}
        </PLayer>
      )}

      {/* ═══ PLAN DU MILIEU : la table technique, le pupitre, le pied du micro ═══ */}
      <PLayer depth={2.5}>
        {/* sol : linoléum en dalles, tapis sous le pupitre, câbles */}
        <rect y="420" width="1000" height="140" fill="url(#bbc-floor)" />
        {Array.from({ length: 16 }).map((_, i) => {
          const x = -200 + i * 96;
          return <path key={i} d={`M${(500 + (x - 500) * 0.6).toFixed(0)} 420 L${x} 560`} stroke="#1a120a" strokeWidth="1.2" opacity="0.4" />;
        })}
        {[446, 482, 528].map((y) => <path key={y} d={`M0 ${y} H1000`} stroke="#1a120a" strokeWidth="1.2" opacity="0.35" />)}
        <path d="M540 436 L860 436 L900 520 L500 520 Z" fill="#4a1e18" opacity="0.85" />
        <path d="M552 442 L848 442 L884 514 L516 514 Z" fill="none" stroke="#a8803a" strokeWidth="1.6" opacity="0.5" />
        <path d="M820 460 Q860 500 940 490 Q980 486 1010 500" stroke="#141010" strokeWidth="4" fill="none" />
        <path d="M600 470 Q520 520 380 510 Q300 504 260 540" stroke="#141010" strokeWidth="3" fill="none" opacity="0.8" />
        {/* lumière tamisée de la lampe, sur le sol */}
        <ellipse cx="180" cy="440" rx="160" ry="30" fill="#ffcf78" opacity="0.08" filter="url(#bbc-blur)" />
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
      <PLayer depth={3}>
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
          {/* carafe d'eau et verre du speaker */}
          <g transform="translate(608,358)">
            <path d="M-8 0 Q-12 -14 -5 -20 L-5 -28 L5 -28 L5 -20 Q12 -14 8 0 Z" fill="#c8d8e0" opacity="0.5" stroke="#8a9aa8" strokeWidth="0.8" />
            <path d="M-9 -6 Q0 -4 9 -6 L8 0 L-8 0 Z" fill="#9ab8c8" opacity="0.5" />
            <rect x="12" y="-12" width="9" height="12" fill="#c8d8e0" opacity="0.5" stroke="#8a9aa8" strokeWidth="0.8" />
          </g>
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
