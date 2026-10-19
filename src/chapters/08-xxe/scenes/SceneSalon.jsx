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
        <filter id="sd-blur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="14" /></filter>
        <linearGradient id="sd-marble" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#d8d0c4" /><stop offset="100%" stopColor="#8a8274" /></linearGradient>
        <linearGradient id="sd-mirror" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3a3a40" /><stop offset="50%" stopColor="#5a5a62" /><stop offset="100%" stopColor="#2a2a30" /></linearGradient>
        <linearGradient id="sd-velvet" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6a3428" /><stop offset="100%" stopColor="#3a1a14" /></linearGradient>
        <radialGradient id="sd-cadran" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffe08a" stopOpacity="0.85" /><stop offset="100%" stopColor="#ffcf50" stopOpacity="0" /></radialGradient>
      </defs>

      {/* ═══ mur + tapisserie discrète ═══ */}
      <PLayer depth={1}>
        <rect width="1000" height="560" fill="url(#sd-wall)" />
        {/* papier peint à bouquets, en quinconce */}
        {[...Array(6)].map((_, r) => [...Array(11)].map((_, c) => {
          const x = 30 + c * 96 + (r % 2) * 48, y = 50 + r * 70;
          return (
            <g key={`t-${r}-${c}`} opacity="0.35">
              <path d={`M${x} ${y} q6 -6 12 0 q-6 6 -12 0 Z M${x + 6} ${y - 4} q-8 -10 0 -16 q8 6 0 16 Z`} fill="#8a6540" />
              <circle cx={x + 6} cy={y - 14} r="3" fill="#9a5a3a" />
            </g>
          );
        }))}
        {/* cimaise et plinthe */}
        <rect y="300" width="1000" height="5" fill="#4a3018" />
        <rect y="300" width="1000" height="1.5" fill="#9a7048" opacity="0.6" />
        <rect y="426" width="1000" height="16" fill="#2a1a0c" />
        {/* la lampe sur le buffet éclaire le coin gauche */}
        <ellipse cx="128" cy="250" rx="190" ry="150" fill="#ffcf8a" opacity="0.2" filter="url(#sd-blur)" />
        {reliee && <circle cx="500" cy="300" r="60" fill="url(#sd-cadran)" opacity={capte ? 1 : 0.5} />}
      </PLayer>

      {/* ═══ FENÊTRE aux rideaux tirés (black-out) ═══ */}
      <PLayer depth={1.5}>
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

      {/* ═══ la CHEMINÉE de marbre et son trumeau (miroir) ═══ */}
      <PLayer depth={1.5}>
        <g transform="translate(726,440)">
          {/* trumeau : grand miroir dans un cadre doré */}
          <rect x="-66" y="-330" width="132" height="190" fill="#8a6a34" />
          <rect x="-58" y="-322" width="116" height="174" fill="url(#sd-mirror)" />
          <path d="M-50 -310 L-10 -310 L-50 -230 Z" fill="#fff" opacity="0.06" />
          <path d="M-58 -322 q58 -24 116 0" stroke="#c8a050" strokeWidth="3" fill="none" />
          {/* le manteau, la pendule, deux bougeoirs éteints (couvre-feu) */}
          <rect x="-82" y="-142" width="164" height="12" fill="url(#sd-marble)" />
          <rect x="-74" y="-130" width="20" height="130" fill="url(#sd-marble)" />
          <rect x="54" y="-130" width="20" height="130" fill="url(#sd-marble)" />
          <rect x="-54" y="-130" width="108" height="16" fill="url(#sd-marble)" />
          <path d="M-54 0 L-54 -100 Q0 -120 54 -100 L54 0 Z" fill="#120a06" />
          <path d="M-30 0 q6 -10 14 -8 q-2 -6 8 -6 q10 2 10 10 q8 -4 14 4 Z" fill="#4a1a0a" />
          <circle cx="-4" cy="-6" r="3" fill="#c84a1a" opacity="0.8" style={{ animation: "glow 3s ease-in-out infinite" }} />
          <g transform="translate(0,-142)">
            <path d="M-16 0 L-16 -22 Q0 -34 16 -22 L16 0 Z" fill="#c8a040" />
            <circle cx="0" cy="-15" r="7" fill="#f0e6d0" stroke="#7a5a20" strokeWidth="1.2" />
            <path d="M0 -15 v-4 M0 -15 l3 2" stroke="#2a1a10" strokeWidth="0.9" />
          </g>
          {[-56, 56].map((x) => <g key={x} transform={`translate(${x},-142)`}><path d="M-5 0 h10 l-2 -5 h-6 Z M-1.2 -5 v-12" stroke="#c8a040" strokeWidth="1.8" fill="#c8a040" /><rect x="-2" y="-26" width="4" height="9" fill="#efe6d2" /></g>)}
        </g>
      </PLayer>

      {/* ═══ meubles ═══ */}
      <PLayer depth={2.5}>
        <rect y="440" width="1000" height="120" fill="url(#sd-floor)" />
        {/* parquet en point de Hongrie, en perspective */}
        <g opacity="0.55">
          {Array.from({ length: 5 }).map((_, r) => {
            const y0 = 442 + r * r * 2.6 + r * 14, y1 = 442 + (r + 1) * (r + 1) * 2.6 + (r + 1) * 14, h = y1 - y0;
            return Array.from({ length: 22 }).map((_, c) => {
              const k = 0.7 + (y0 - 440) / 260, w = 54 * k, x = 500 + (c - 11) * w;
              return <path key={`${r}-${c}`} d={`M${x} ${y0} L${x + w / 2} ${y0 + h / 2} L${x} ${y1} M${x + w / 2} ${y0 + h / 2} L${x + w} ${y0}`} stroke="#1a0e06" strokeWidth="1" fill="none" />;
            });
          })}
        </g>
        <rect y="438" width="1000" height="5" fill="#1a0e06" />
        {/* le tapis, en perspective */}
        <path d="M230 452 L770 452 L830 520 L170 520 Z" fill="#6a2820" opacity="0.85" />
        <path d="M244 458 L756 458 L810 514 L190 514 Z" fill="none" stroke="#c88060" strokeWidth="1.4" opacity="0.6" />
        <path d="M270 466 L730 466 L776 506 L224 506 Z" fill="#7a3426" opacity="0.6" />
        {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${420 + i * 32} 486 l12 -9 l12 9 l-12 9 Z`} fill="#c88060" opacity="0.35" />)}
        {/* la lampe de chevet sur le buffet, abat-jour à franges */}
        <g transform="translate(128,320)">
          <path d="M-8 0 h16 l-3 -8 h-10 Z" fill="#8a6a34" />
          <path d="M0 -8 v-36" stroke="#8a6a34" strokeWidth="3" />
          <path d="M-26 -42 L26 -42 L16 -72 L-16 -72 Z" fill="#e8c890" opacity="0.92" />
          {Array.from({ length: 13 }).map((_, k) => <path key={k} d={`M${-25 + k * 4.2} -42 v5`} stroke="#c8a060" strokeWidth="1.2" />)}
          <ellipse cx="0" cy="-42" rx="26" ry="5" fill="#fff0c8" opacity="0.6" />
        </g>

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
          {/* fauteuil Voltaire de velours : dossier galbé, accoudoirs, pieds tournés */}
          <path d="M826 446 L826 330 Q826 296 856 290 Q895 282 934 290 Q964 296 964 330 L964 446 Z" fill="url(#sd-velvet)" stroke="#1a0e04" strokeWidth="2" />
          <path d="M842 330 Q895 312 948 330" stroke="#8a4a38" strokeWidth="2" fill="none" opacity="0.6" />
          {[[850, 318], [895, 308], [940, 318], [870, 352], [920, 352]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2" fill="#2a1008" />)}
          <path d="M806 446 L806 382 Q806 366 822 366 L842 366 L842 446 Z" fill="#4a2018" stroke="#1a0e04" strokeWidth="1.6" />
          <path d="M984 446 L984 382 Q984 366 968 366 L948 366 L948 446 Z" fill="#4a2018" stroke="#1a0e04" strokeWidth="1.6" />
          <ellipse cx="824" cy="370" rx="18" ry="6" fill="#6a3428" /><ellipse cx="966" cy="370" rx="18" ry="6" fill="#6a3428" />
          <path d="M812 446 v12 M836 446 v12 M954 446 v12 M978 446 v12" stroke="#2a1608" strokeWidth="5" strokeLinecap="round" />
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
      <PLayer depth={3}>
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
