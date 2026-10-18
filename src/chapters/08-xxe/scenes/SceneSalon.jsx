import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 8 — Tableau : Salon Dupont, Paris occupé, nuit du
   5 au 6 juin 1944. Petit salon parisien : rideaux tirés
   (black-out), fauteuil, buffet, table basse. Marthe cache
   sa TSF dans le buffet (hotspot pour la sortir), le fil
   d'antenne est dans un tiroir, la couverture sur le fauteuil.
   On assemble : TSF sur la table → antenne tendue → couverture
   par-dessus → le message arrive.
   ============================================================ */

export default function SceneSalon({ collect, action, reveal, made = [], flags = [] }) {
  const posee   = !!flags.tsf_posee;
  const reliee  = !!flags.tsf_reliee;
  const prete   = !!flags.tsf_prete;
  const capte   = made.includes("msg_debarquement");

  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sd-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7a5836" /><stop offset="100%" stopColor="#3a2818" /></linearGradient>
        <linearGradient id="sd-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5a3a20" /><stop offset="100%" stopColor="#2a1a10" /></linearGradient>
        <linearGradient id="sd-curtain" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3a2418" /><stop offset="100%" stopColor="#1a0e08" /></linearGradient>
        <linearGradient id="sd-buffet" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6a4020" /><stop offset="100%" stopColor="#2a1608" /></linearGradient>
        <radialGradient id="sd-lampe" cx="50%" cy="30%" r="60%"><stop offset="0%" stopColor="#ffdca8" stopOpacity="0.55" /><stop offset="100%" stopColor="#ff9540" stopOpacity="0" /></radialGradient>
        <radialGradient id="sd-cadran" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffe08a" stopOpacity="0.85" /><stop offset="100%" stopColor="#ffcf50" stopOpacity="0" /></radialGradient>
      </defs>

      {/* ═══ mur + tapisserie discrète ═══ */}
      <PLayer depth={4}>
        <rect width="1000" height="560" fill="url(#sd-wall)" />
        {[...Array(6)].map((_, r) => [...Array(10)].map((_, c) => (
          <path key={`t-${r}-${c}`} d={`M${60 + c * 96} ${50 + r * 70} q6 -6 12 0 q-6 6 -12 0 Z`}
            fill="#8a6540" opacity="0.35" />
        )))}
        <circle cx="150" cy="200" r="180" fill="url(#sd-lampe)" />
        {reliee && <circle cx="500" cy="300" r="60" fill="url(#sd-cadran)" opacity={capte ? 1 : 0.5} />}
      </PLayer>

      {/* ═══ FENÊTRE aux rideaux tirés (black-out) ═══ */}
      <PLayer depth={3}>
        <rect x="380" y="60" width="220" height="180" fill="#0a0604" stroke="#3a2418" strokeWidth="4" />
        {/* un seul faisceau DCA, discret, qui balaie a travers la fente
            entre les rideaux (clip strict a la vitre pour qu'il ne
            deborde jamais dehors). */}
        <defs><clipPath id="sd-slitclip"><rect x="384" y="64" width="212" height="172" /></clipPath></defs>
        <g clipPath="url(#sd-slitclip)">
          <g>
            <animateTransform attributeName="transform" type="rotate"
              values="14 490 240; -18 490 240; 14 490 240" dur="12s" repeatCount="indefinite" />
            <path d="M488 240 L474 70 L502 70 L492 240 Z" fill="#ffe08a" opacity="0.22" />
          </g>
          {/* petits eclairs de DCA loin */}
          <circle cx="440" cy="120" r="2" fill="#ff9a4a">
            <animate attributeName="opacity" values="0;0.9;0;0;0" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle cx="560" cy="90" r="2" fill="#ff9a4a">
            <animate attributeName="opacity" values="0;0;0;0.9;0" dur="7s" repeatCount="indefinite" />
          </circle>
        </g>
        <path d="M370 60 L400 60 L410 240 L370 240 Z" fill="url(#sd-curtain)" />
        <path d="M600 60 L630 60 L630 240 L590 240 Z" fill="url(#sd-curtain)" />
        <path d="M400 60 Q450 30 500 60" stroke="#5a3818" strokeWidth="3" fill="none" />
        <path d="M500 60 Q550 30 600 60" stroke="#5a3818" strokeWidth="3" fill="none" />
        <path d="M420 240 L430 60 L432 240 Z" fill="#3a4058" opacity="0.35" />
        {reliee && (
          <path d="M495 240 Q460 260 470 300" stroke="#c8963e" strokeWidth="1.6" fill="none" opacity="0.9" strokeDasharray="1 2" />
        )}
        {/* Bobine de fil d'antenne accrochée à la crémone de la fenêtre — visible tant qu'on ne l'a pas prise */}
        {!reliee && (
          <g transform="translate(490,150)">
            {/* crochet + bobine */}
            <path d="M0 -18 v10" stroke="#3a2418" strokeWidth="2" />
            <circle cx="0" cy="0" r="14" fill="#3a2418" />
            <circle cx="0" cy="0" r="10" fill="#c8963e" stroke="#5a3818" strokeWidth="1.5" />
            {/* enroulements */}
            {[3, 5, 7, 9].map((r, i) => (
              <circle key={i} cx="0" cy="0" r={r} fill="none" stroke="#8a5820" strokeWidth="0.6" opacity="0.7" />
            ))}
            {/* petit fil qui pendouille */}
            <path d="M8 6 q4 8 -2 14" stroke="#c8963e" strokeWidth="1.2" fill="none" />
          </g>
        )}
      </PLayer>

      {/* ═══ meubles ═══ */}
      <PLayer depth={2}>
        <rect y="440" width="1000" height="120" fill="url(#sd-floor)" />
        <rect x="150" y="450" width="600" height="60" rx="6" fill="#6a2820" opacity="0.7" />
        <rect x="170" y="460" width="560" height="40" rx="4" fill="none" stroke="#c88060" strokeWidth="1" opacity="0.6" />

        {/* PETITE SOURIS grise qui trotte : sort de derriere le buffet,
            traverse en un eclair, disparait derriere le fauteuil. Dessinee
            AVANT les meubles pour passer bien derriere eux. */}
        <g>
          <animateTransform attributeName="transform" type="translate"
            values="240,538; 240,538; 810,538; 810,538; 240,538"
            keyTimes="0; 0.55; 0.7; 0.85; 1"
            dur="22s" repeatCount="indefinite" />
          <g>
            {/* corps gris */}
            <ellipse cx="0" cy="0" rx="7" ry="3.5" fill="#7a7268" stroke="#3a342e" strokeWidth="0.4" />
            {/* tete */}
            <ellipse cx="7" cy="-1" rx="4" ry="3" fill="#7a7268" />
            {/* oreille */}
            <circle cx="6" cy="-3.5" r="1.6" fill="#5a5450" />
            {/* museau */}
            <circle cx="11" cy="-1" r="0.7" fill="#3a342e" />
            {/* oeil */}
            <circle cx="9" cy="-2" r="0.5" fill="#0a0806" />
            {/* pattes qui trottent (petit bobbing) */}
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="0,0; 0,-0.5; 0,0" dur="0.15s" repeatCount="indefinite" />
              <path d="M-4 3 v2 M-1 3 v2 M2 3 v2 M5 3 v2" stroke="#3a342e" strokeWidth="0.6" strokeLinecap="round" />
            </g>
            {/* longue queue */}
            <path d="M-6 -1 q-8 -3 -12 3" stroke="#7a7268" strokeWidth="1" fill="none" strokeLinecap="round" />
          </g>
        </g>

        {/* BUFFET (TSF cachée + antenne dans tiroir droit) */}
        <g>
          <rect x="30" y="320" width="200" height="140" fill="url(#sd-buffet)" stroke="#1a0e04" strokeWidth="3" />
          <rect x="40" y="330" width="86" height="60" fill="#2a1608" stroke="#8a5a20" strokeWidth="1.5" />
          <rect x="134" y="330" width="86" height="60" fill="#2a1608" stroke="#8a5a20" strokeWidth="1.5" />
          <circle cx="83" cy="360" r="2.5" fill="#c8963e" />
          <circle cx="177" cy="360" r="2.5" fill="#c8963e" />
          {!posee && (
            <g transform="translate(83,360)" opacity="0.55">
              <rect x="-16" y="-8" width="32" height="20" rx="2" fill="#5a3818" />
              <circle cx="0" cy="4" r="6" fill="#c8963e" />
            </g>
          )}
          {/* photo encadrée du mari mort en 14-18 */}
          <rect x="60" y="288" width="30" height="34" fill="#e8d8b0" stroke="#3a2418" strokeWidth="1.5" />
          <path d="M64 292 h22 v26 h-22 Z" fill="#4a4038" />
          <rect x="70" y="298" width="10" height="8" fill="#c8946a" />
          <path d="M70 306 L80 306 L80 314 L70 314 Z" fill="#3a2418" />
          {/* petit vase */}
          <path d="M170 290 Q166 302 170 316 L182 316 Q186 302 182 290 Z" fill="#6a2820" />
          <path d="M172 288 q4 -4 8 0" stroke="#3a1808" strokeWidth="1.5" fill="none" />
        </g>

        {/* FAUTEUIL avec couverture drapée */}
        <g>
          <rect x="820" y="330" width="150" height="130" fill="#4a2820" stroke="#1a0e04" strokeWidth="2" />
          <rect x="820" y="330" width="150" height="30" fill="#5a3628" />
          <rect x="810" y="360" width="30" height="80" fill="#3a1e18" />
          <rect x="950" y="360" width="30" height="80" fill="#3a1e18" />
          {/* pas de couverture sur le fauteuil : elle est apportée depuis Paris (marché noir) */}
        </g>

        {/* TABLE BASSE avec la TSF posée dessus */}
        <g>
          <ellipse cx="500" cy="450" rx="120" ry="14" fill="#3a2418" opacity="0.6" />
          <rect x="400" y="420" width="200" height="14" rx="3" fill="url(#sd-buffet)" stroke="#1a0e04" strokeWidth="2" />
          <rect x="410" y="434" width="10" height="30" fill="#3a2410" />
          <rect x="580" y="434" width="10" height="30" fill="#3a2410" />
          {posee && (
            <g transform="translate(500,380)">
              <rect x="-56" y="-6" width="112" height="46" rx="6" fill="#5a3010" stroke="#2a1608" strokeWidth="3" />
              <rect x="-56" y="-6" width="112" height="12" fill="#3a1e0a" />
              <rect x="-46" y="12" width="54" height="20" rx="2" fill={reliee ? "#ffe08a" : "#3a2410"} opacity={reliee ? 0.75 : 1} />
              <rect x="-46" y="12" width="54" height="20" rx="2" fill="none" stroke="#8a5a20" strokeWidth="1.4" />
              {[-40, -30, -20, -10, 0, 5].map((x, i) => (
                <path key={i} d={`M${x} 14 v4`} stroke="#3a2410" strokeWidth="0.8" />
              ))}
              <path d="M-15 12 L-15 32" stroke="#c83820" strokeWidth="1.6" />
              <circle cx="24" cy="22" r="8" fill="#c8963e" stroke="#5a3818" strokeWidth="1.4" />
              <circle cx="42" cy="22" r="6" fill="#c8963e" stroke="#5a3818" strokeWidth="1.4" />
              <circle cx="-36" cy="22" r="7" fill="#2a1608" />
              <circle cx="-36" cy="22" r="5" fill="none" stroke="#c8963e" strokeWidth="0.6" />
            </g>
          )}
          {capte && (
            <g transform="translate(500,388)" opacity="0.95">
              <path d="M-64 -14 Q-40 -20 0 -18 Q40 -20 64 -14 Q68 20 40 30 Q0 34 -40 30 Q-68 20 -64 -14 Z"
                fill="#5a2a1a" stroke="#2a1008" strokeWidth="1.5" />
              <path d="M-56 -8 h112 M-56 4 h112 M-56 16 h112 M-40 -14 v42 M-20 -18 v50 M0 -18 v52 M20 -18 v50 M40 -14 v42" stroke="#3a1408" strokeWidth="0.5" opacity="0.55" />
            </g>
          )}
        </g>
      </PLayer>

      {/* ═══ AVANT-PLAN : MARTHE dans son fauteuil ═══ */}
      <PLayer depth={1}>
        <g transform="translate(870,340)">
          <Figure x={0} y={108} s={1.23} pose="sit" skin="#e4c4a4" hair="#a8a49c" look="bun" wrinkles mood="content"
            garment="dress" coat="#1a1a1a" pants="#2a2420" shoes="#0a0a0a" belt={false} arms={[{ a1: 14, a2: -30 }, { a1: 14, a2: -30 }]}>
            {/* châle noir à franges */}
            <path d="M-26 -71 Q0 -78 26 -71 L25 -47 Q0 -55 -25 -47 Z" fill="#0a0a0a" stroke="#2a2a2a" strokeWidth="0.8" />
            {[-24, -16, -8, 0, 8, 16, 24].map((x, i) => <path key={x} d={`M${x} ${-50 + (Math.abs(x) > 12 ? 2 : 0)} v${3 + (i % 3) * 2}`} stroke="#2a2a2a" strokeWidth="0.8" />)}
          </Figure>
        </g>

      </PLayer>

      {/* ═══ zones cliquables ═══ */}
      <Hotspot cx={870} cy={370} r={54} label="Marthe Dupont" reveal={reveal} onClick={() => action("marthe")} />
      {!posee && (
        <Hotspot cx={83} cy={360} r={36} label="le poste TSF (dans le buffet)" item="tsf" reveal={reveal} onClick={() => collect("tsf")} />
      )}
      {!reliee && (
        <Hotspot cx={490} cy={150} r={36} label="fil d'antenne (accroché à la fenêtre)" item="antenne" reveal={reveal} onClick={() => collect("antenne")} />
      )}
      {/* la couverture est apportée depuis T1 Paris — plus de hotspot ici */}
      <Hotspot cx={500} cy={428} r={80} label="la table du salon — pose la TSF ici" item="table" reveal={reveal} onClick={() => action("marthe")} />
      {posee && !capte && !prete && (
        <Hotspot cx={500} cy={400} r={64} label={reliee ? "la TSF — jette-y la couverture" : "la TSF — tends-lui le fil d'antenne"} item="tsf" reveal={reveal} onClick={() => action("marthe")} />
      )}
      {prete && !capte && (
        <Hotspot cx={500} cy={400} r={64} label="allumer et chercher Londres dans le brouillage" reveal={reveal} onClick={() => action("tsf_bouton")} />
      )}
    </svg>
  );
}
