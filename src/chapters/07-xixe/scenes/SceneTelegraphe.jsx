import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Arm, Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 7 — Tableau 1 : la cabane du télégraphe (Far West)
   ------------------------------------------------------------
   Une cabane en rondins : murs de planches, un bureau et le
   manipulateur Morse. Par la fenêtre : la rue d'une ville western
   (façades de bois, SALOON), les poteaux télégraphiques et un TRAIN
   À VAPEUR qui fume. JESSIE TOMBSTONE, prospecteur, débarque tout
   excité : il a trouvé un FILON D'OR et veut prévenir sa famille à
   New York — vite ! On lui apporte la pile de Volta pour brancher
   le télégraphe → mini-jeu Morse (taper « OR »).
   ============================================================ */

export default function SceneTelegraphe({ collect, action, reveal, made = [], queteQui, mode }) {
  const tg = made.includes("msg_telegraphe");
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="wt-plank" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a5f38" /><stop offset="100%" stopColor="#5e3f24" /></linearGradient>
        <linearGradient id="wt-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a8c0d0" /><stop offset="55%" stopColor="#e6cf9e" /><stop offset="100%" stopColor="#e0a860" /></linearGradient>
        <linearGradient id="wt-desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9a6a3c" /><stop offset="100%" stopColor="#5a3f24" /></linearGradient>
        <linearGradient id="wt-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7a5636" /><stop offset="100%" stopColor="#3e2c1a" /></linearGradient>
        <radialGradient id="wt-lamp" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffcf78" stopOpacity="0.5" /><stop offset="100%" stopColor="#ff9540" stopOpacity="0" /></radialGradient>
        <radialGradient id="wt-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.7" /><stop offset="100%" stopColor="#ffe9a8" stopOpacity="0" /></radialGradient>
        <filter id="wt-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" /></filter>
        <linearGradient id="wt-iron" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#1a1816" /><stop offset="50%" stopColor="#3a3632" /><stop offset="100%" stopColor="#141210" /></linearGradient>
        <filter id="wt-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <clipPath id="wt-winclip"><rect x="-118" y="-96" width="236" height="196" /></clipPath>
      </defs>

      {/* ═══ mur de planches de la cabane ═══ */}
      <rect width="1000" height="560" fill="url(#wt-plank)" />
      <rect width="1000" height="560" fill="#2c1c0e" opacity="0.26" filter="url(#wt-grain)" />
      {/* rainures horizontales des planches + clous */}
      <g stroke="#3a2614" strokeWidth="2" opacity="0.5">
        {[70, 140, 210, 280, 350].map((y, i) => <path key={i} d={`M0 ${y} h1000`} />)}
      </g>
      {/* planches de largeurs inégales, teintes et nœuds */}
      {[[0, 70, "#7a5232"], [70, 140, "#8e6440"], [140, 210, "#80583a"], [210, 280, "#946a42"], [280, 350, "#7e5636"], [350, 404, "#8a6040"]].map(([y0, y1, c], i) => (
        <rect key={i} x="0" y={y0 + 1} width="1000" height={y1 - y0 - 2} fill={c} opacity="0.35" />
      ))}
      {[70, 140, 210, 280, 350].map((y, i) => Array.from({ length: 5 }).map((_, k) => <path key={`${i}-${k}`} d={`M${(k * 230 + i * 97) % 1000} ${y - 70} v70`} stroke="#3a2614" strokeWidth="1.6" opacity="0.4" />))}
      {[[180, 100], [610, 170], [890, 310], [330, 320], [70, 240], [760, 40]].map(([x, y], i) => (
        <g key={i}><ellipse cx={x} cy={y} rx="7" ry="3.4" fill="#4a3018" opacity="0.6" /><ellipse cx={x} cy={y} rx="12" ry="5.4" fill="none" stroke="#4a3018" strokeWidth="1" opacity="0.35" /></g>
      ))}
      {[[40, 105], [40, 245], [960, 105], [960, 245], [500, 35]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#2a1a0c" />)}
      {/* poutre du plafond */}
      <rect x="-40" y="-10" width="1080" height="26" fill="#3a2614" />
      <path d="M-40 16 h1080" stroke="#5a3f24" strokeWidth="2" />

      {/* ═══ couche lointaine : la FENÊTRE sur la ville western + le TRAIN ═══ */}
      <PLayer depth={1}>
        <g transform="translate(748,176)">
          {/* le paysage à travers la vitre */}
          <rect x="-118" y="-96" width="236" height="196" fill="url(#wt-sky)" />
          <g clipPath="url(#wt-winclip)">
            {/* mesa/collines sèches */}
            <path d="M-118 30 L-70 -6 L-30 24 L20 -10 L70 20 L118 -4 L118 100 L-118 100 Z" fill="#b98a52" />
            <path d="M-118 46 Q-40 30 40 44 Q90 52 118 42 L118 100 L-118 100 Z" fill="#9a6e40" />
            {/* soleil bas */}
            <circle cx="72" cy="-40" r="20" fill="#fff0c0" opacity="0.85" />
            {/* façades western à faux-fronts (SALOON, STORE) */}
            {[[-92, "#8a5a34", "SALOON"], [-46, "#6a4a30", "STORE"], [6, "#7a5236", ""]].map(([x, c, t], i) => (
              <g key={i} transform={`translate(${x},20)`}>
                <rect x="-20" y="0" width="40" height="46" fill={c} />
                <rect x="-24" y="-14" width="48" height="16" fill={c} />
                <path d="M-24 -14 h48 v-4 h-48 Z" fill="#4a3220" />
                <rect x="-10" y="16" width="20" height="30" fill="#2c1c10" />
                {t && <text x="0" y="-3" textAnchor="middle" fontFamily="'Cinzel',Georgia,serif" fontSize="6" fill="#e6d5a8">{t}</text>}
              </g>
            ))}
            {/* poteaux télégraphiques qui s'éloignent */}
            {[[44, 1], [72, 0.8], [94, 0.62]].map(([x, s], i) => (
              <g key={i} transform={`translate(${x},34) scale(${s})`}>
                <rect x="-2" y="-40" width="4" height="46" fill="#4a3320" />
                <path d="M-9 -34 h18" stroke="#4a3320" strokeWidth="2.4" />
              </g>
            ))}
            {/* les RAILS restent en place, y compris cote droit
                (traverses qui filent au loin — illusion de perspective
                et de mouvement quand le train est passe) */}
            <g transform="translate(0,74)">
              <path d="M-118 6 h236" stroke="#5a4630" strokeWidth="2" />
              {[-100, -70, -40, -10, 20, 50, 80, 108].map((x, i) => <rect key={i} x={x} y="2" width="4" height="6" fill="#3a2c1c" />)}
              {/* deuxieme rail parallele en perspective */}
              <path d="M-118 12 h236" stroke="#5a4630" strokeWidth="1.5" opacity="0.7" />
            </g>

            {/* le TRAIN À VAPEUR au loin (echelle reduite) qui passe de
                droite a gauche UNE SEULE FOIS puis attend longtemps. */}
            <g transform="translate(0,64) scale(0.7)">
              <g>
                <animateTransform attributeName="transform" type="translate"
                  values="220,0; 220,0; -260,0; -260,0"
                  keyTimes="0;0.2;0.55;1" dur="30s" repeatCount="indefinite" />
                {/* wagons */}
                <rect x="34" y="-16" width="30" height="18" rx="2" fill="#6a3a2a" /><rect x="68" y="-16" width="30" height="18" rx="2" fill="#5a3a2a" />
                {/* locomotive */}
                <rect x="-6" y="-20" width="36" height="22" rx="2" fill="#2c2620" />
                <rect x="-18" y="-12" width="14" height="14" fill="#2c2620" />
                <path d="M-20 2 l-6 6 h8 Z" fill="#1c1610" />
                <circle cx="-2" cy="4" r="4" fill="#3a3a44" /><circle cx="14" cy="4" r="4" fill="#3a3a44" /><circle cx="52" cy="4" r="3" fill="#3a3a44" />
                <rect x="18" y="-30" width="8" height="12" fill="#1c1610" />
                <g>
                  <animateTransform attributeName="transform" type="translate"
                    values="0,0; 4,-4; 0,0" dur="5s" repeatCount="indefinite" />
                  <circle cx="24" cy="-36" r="7" fill="#d8d0c4" opacity="0.5" /><circle cx="34" cy="-44" r="9" fill="#cfc8bc" opacity="0.4" /><circle cx="48" cy="-50" r="11" fill="#c8c0b4" opacity="0.3" />
                </g>
              </g>
            </g>
          </g>
          {/* cadre + croisillons de la fenêtre */}
          <rect x="-118" y="-96" width="236" height="196" fill="none" stroke="#3a2614" strokeWidth="10" />
          <path d="M0 -96 v196 M-118 2 h236" stroke="#3a2614" strokeWidth="6" />
          <path d="M-124 -102 h248 v10 h-248 Z" fill="#5a3f24" />
        </g>

        {/* pendule + affiche WANTED + carte, sur le mur de gauche */}
        <g transform="translate(120,150)">
          <circle cx="0" cy="0" r="26" fill="#e8dcc0" stroke="#4a3218" strokeWidth="5" />
          <path d="M0 0 L0 -15 M0 0 L9 4" stroke="#3a2c1c" strokeWidth="2.2" />
        </g>
        <g transform="translate(250,150) rotate(-3)">
          <rect x="-28" y="-38" width="56" height="76" fill="#e0d0a8" />
          <rect x="-28" y="-38" width="56" height="76" fill="#7a5a30" opacity="0.18" filter="url(#wt-grain)" />
          <rect x="-28" y="-38" width="56" height="76" fill="none" stroke="#8a6a3a" strokeWidth="2" />
          <text x="0" y="-24" textAnchor="middle" fontSize="11" fill="#3a2c1c" fontFamily="'Cinzel',Georgia,serif" style={{ fontWeight: 700 }}>WANTED</text>
          <rect x="-15" y="-16" width="30" height="28" fill="#c8b890" stroke="#6a4a2a" strokeWidth="1.4" />
          <circle cx="0" cy="-5" r="6.5" fill="#9a8a6a" /><path d="M-8 11 q8 -7 16 0" fill="#8a7a5a" />
          <path d="M-9 -8 q9 -6 18 0 l-2 -4 h-14 Z" fill="#5a4a2a" />
          <text x="0" y="26" textAnchor="middle" fontSize="8" fill="#7a2418" fontFamily="'Cinzel',Georgia,serif" style={{ fontWeight: 700 }}>500 $</text>
        </g>
        {/* la carte des lignes télégraphiques, punaisée au mur */}
        <g transform="translate(400,236) rotate(1.5)">
          <rect x="-62" y="-40" width="124" height="80" fill="#e0d0a8" />
          <rect x="-62" y="-40" width="124" height="80" fill="#7a5a30" opacity="0.15" filter="url(#wt-grain)" />
          <path d="M-54 -20 Q-30 -30 0 -24 Q30 -18 54 -26 L56 26 Q20 32 -10 28 Q-40 24 -56 30 Z" fill="none" stroke="#8a6a3a" strokeWidth="1.4" />
          <path d="M-44 10 L-20 2 L6 -4 L30 -10 L48 -14" stroke="#7a2418" strokeWidth="1.6" strokeDasharray="4 3" fill="none" />
          {[[-44, 10], [6, -4], [48, -14]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.4" fill="#7a2418" />)}
          <text x="0" y="-30" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7" fill="#3a2c1c">TELEGRAPH LINES</text>
          {[[-58, -36], [58, -36], [-58, 36], [58, 36]].map(([x, y], i) => <circle key={`p${i}`} cx={x} cy={y} r="2" fill="#a83a2c" />)}
        </g>
        {/* carabine accrochée + chapeau stetson */}
        <g transform="translate(430,120)">
          <path d="M-40 0 h80" stroke="#3a2614" strokeWidth="3" />
          <path d="M-40 6 h70 v4 h-70 Z" fill="#3a2c22" /><rect x="24" y="4" width="16" height="8" rx="2" fill="#5a3f24" />
          <g transform="translate(56,2)">
            <ellipse cx="0" cy="8" rx="22" ry="5" fill="#5a4028" />
            <path d="M-13 8 Q-14 -10 0 -12 Q14 -10 13 8 Z" fill="#6a4c2e" />
            <path d="M-13 4 q13 6 26 0" stroke="#4a3218" strokeWidth="3" fill="none" />
          </g>
        </g>
      </PLayer>

      {/* ═══ couche intermédiaire : le télégraphiste au bureau + le « ? » ═══ */}
      <PLayer depth={2}>
        {/* le plancher (sous le télégraphiste, pour qu'on voie son siège) */}
        <rect y="404" width="1000" height="156" fill="url(#wt-floor)" />
        <rect y="406" width="1000" height="154" fill="#241608" opacity="0.34" filter="url(#wt-grain)" />
        {Array.from({ length: 20 }).map((_, i) => {
          const x = -160 + i * 70;
          return <path key={i} d={`M${(500 + (x - 500) * 0.62).toFixed(0)} 404 L${x} 560`} stroke="#2a1a0c" strokeWidth="1.5" opacity="0.45" />;
        })}
        {[440, 486, 536].map((y, i) => <path key={y} d={`M${i * 90} ${y} h${200 + i * 40} M${600 - i * 50} ${y} h${180 + i * 30}`} stroke="#2a1a0c" strokeWidth="1.2" opacity="0.35" />)}
        <rect y="400" width="1000" height="6" fill="#2a1a0c" />
        {/* le soleil couchant entre par la fenêtre et s'allonge sur le plancher */}
        <path d="M640 406 L860 406 L740 560 L420 560 Z" fill="#ffd890" opacity="0.14" filter="url(#wt-blur)" />
        <ellipse cx="380" cy="472" rx="200" ry="80" fill="url(#wt-lamp)" style={{ animation: "glow 2.6s ease-in-out infinite" }} />
        {/* le POÊLE de fonte et son tuyau */}
        <g transform="translate(64,404)">
          <ellipse cx="0" cy="2" rx="40" ry="8" fill="#140c06" opacity="0.5" />
          <rect x="-4" y="-404" width="12" height="300" fill="url(#wt-iron)" />
          <path d="M-26 -60 Q-34 -20 -24 0 L24 0 Q34 -20 26 -60 Z" fill="url(#wt-iron)" />
          <rect x="-30" y="-70" width="60" height="12" rx="3" fill="#2a2622" />
          <rect x="-12" y="-46" width="24" height="18" rx="2" fill="#ff8a3c" opacity="0.75" style={{ animation: "glow 2s ease-in-out infinite" }} />
          <path d="M-12 -37 h24" stroke="#1a1816" strokeWidth="2" />
          <rect x="-14" y="-110" width="28" height="44" rx="4" fill="url(#wt-iron)" />
          {[-20, 18].map((x) => <rect key={x} x={x} y="0" width="4" height="6" fill="#1a1816" />)}
        </g>
        {/* le télégraphiste assis derrière le bureau (à droite), au manipulateur */}
        <g transform="translate(540,372)">
          <Figure x={0} y={87} s={1.08} pose="sit" skin="#d8a884" hair="#4a3a30" look="short" mood="content" hat="visor" hatColor="#2a6a3a"
            garment="jacket" coat="#3a4152" coat2="#e6dfc8" pants="#2c3242" shoes="#141418" arms={[{ a1: 30, a2: -40 }, { a1: 20, a2: -10 }]} />
        </g>
        {/* son pupitre : le récepteur à bande, les bocaux de la pile, une lampe */}
        <g transform="translate(546,424)">
          <ellipse cx="0" cy="40" rx="100" ry="8" fill="#140c06" opacity="0.4" />
          <rect x="-92" y="0" width="184" height="10" rx="2" fill="url(#wt-desk)" />
          <rect x="-86" y="10" width="172" height="34" fill="#5a3f24" />
          <path d="M-86 10 h172" stroke="#3e2a16" strokeWidth="2" />
          <rect x="-80" y="16" width="76" height="22" fill="none" stroke="#3e2a16" strokeWidth="1.4" />
          <rect x="4" y="16" width="76" height="22" fill="none" stroke="#3e2a16" strokeWidth="1.4" />
          {/* récepteur Morse : rouleau de bande de papier */}
          <g transform="translate(-50,-4)">
            <rect x="-14" y="-6" width="28" height="10" rx="2" fill="#5a4630" />
            <circle cx="-8" cy="-10" r="7" fill="#efe6ce" stroke="#8a7a5a" strokeWidth="1" />
            <path d="M-2 -8 Q14 -6 24 4" stroke="#efe6ce" strokeWidth="2.6" fill="none" /><path d="M2 -7.6 l3 0.4 M10 -6.4 l2 0.6 M16 -3.6 l2 1.4" stroke="#2c2418" strokeWidth="1" />
          </g>
          {/* bocaux de verre de la pile (l'électricité du télégraphe) */}
          {[46, 62, 78].map((x) => (
            <g key={x}><rect x={x - 6} y="-16" width="12" height="16" rx="2" fill="#9ac0b0" opacity="0.6" /><rect x={x - 6} y="-8" width="12" height="8" fill="#5a8a7a" opacity="0.6" /><path d={`M${x - 2} -16 v-5 M${x + 2} -16 v-5`} stroke="#c98a4a" strokeWidth="1.4" /></g>
          ))}
          {/* lampe à pétrole */}
          <g transform="translate(16,0)">
            <path d="M-7 0 h14 l-2 -8 h-10 Z" fill="#8a6a3a" />
            <path d="M-4 -8 q-6 -10 4 -18 q10 8 4 18 Z" fill="#fff0c8" opacity="0.55" />
            <circle cx="0" cy="-14" r="14" fill="#ffcf78" opacity="0.3" filter="url(#wt-blur)" />
          </g>
        </g>
      </PLayer>

      {/* ═══ premier plan : bureau, Morse, Jessie, épave ═══ */}
      <PLayer depth={3}>

        {/* LE BUREAU du télégraphe */}
        <g transform="translate(430,486)">
          <rect x="-190" y="6" width="400" height="16" rx="3" fill="url(#wt-desk)" />
          <rect x="-182" y="22" width="14" height="42" fill="#3e2a16" /><rect x="176" y="22" width="14" height="42" fill="#3e2a16" />
          {/* registre + plume sur le bureau */}
          <g transform="translate(120,-2)"><rect x="-18" y="-8" width="36" height="14" rx="1" fill="#efe6ce" /><path d="M-12 -3 h24 M-12 1 h18" stroke="#8a7a5a" strokeWidth="1" opacity="0.6" /></g>
        </g>

        {/* LE MANIPULATEUR MORSE (support : on lui apporte la pile) */}
        <g transform="translate(300,478)">
          <rect x="-30" y="2" width="60" height="8" rx="2" fill="#3a2c1c" />
          <circle cx="-8" cy="-2" r="8" fill="#3a3a44" />
          <rect x="-30" y="-6" width="24" height="4" rx="2" fill="#8a8c92" />
          <circle cx="-8" cy="-2" r="4" fill="#c98a4a" />
          <g transform="translate(18,-4)">
            <rect x="-8" y="-10" width="16" height="14" rx="2" fill="#6a6c72" />
            <rect x="-5" y="-16" width="10" height="6" fill="#8a8c92" />
            <path d="M-6 -18 q0 -6 6 -6" stroke="#5a5c62" strokeWidth="2" fill="none" />
          </g>
        </g>
        {/* APPARAÎT : la bande de points-traits (télégraphe transmis) */}
        {tg && (
          <g transform="translate(300,470)" style={{ animation: "pulse 0.7s ease-out 2" }}>
            <ellipse cx="0" cy="8" rx="70" ry="30" fill="url(#wt-glow)" />
            <path d="M20 0 q40 6 92 26" stroke="#f2ead6" strokeWidth="14" fill="none" strokeLinecap="round" />
            <g fill="#2c2418">
              {[[38, 6], [52, 10], [70, 15], [86, 20], [104, 26]].map(([x, y], i) => (
                i % 2 ? <rect key={i} x={x} y={y - 2} width="9" height="3" rx="1.5" /> : <circle key={i} cx={x} cy={y} r="1.8" />
              ))}
            </g>
          </g>
        )}

        {/* JESSIE TOMBSTONE, prospecteur surexcité, brandissant sa pépite d'or */}
        <g transform="translate(196,458)">
          <ellipse cx="0" cy="52" rx="30" ry="8" fill="#160f08" opacity="0.5" />
          {/* chemise à carreaux, bretelles, chapeau de prospecteur ; batée dans une main */}
          <Figure x={0} y={52} s={0.828} skin="#e4b48a" hair="#a0522d" look="short" mustache="handlebar" freckles mood="surpris" hat="brim" hatColor="#6a4c2e" hatColor2="#4a3218"
            garment="jacket" coat="#a83a2c" pants="#4a3a2a" shoes="#2c1c10" arms={[{ a1: 30, a2: -50 }]}>
            <path d="M-17 -64 h28 M-18 -76 h30" stroke="#7a241c" strokeWidth="1.6" opacity="0.6" />
            <path d="M-11 -90 v42 M11 -90 v42" stroke="#4a3320" strokeWidth="3.6" />
            <g transform="translate(-24,-46)"><ellipse cx="0" cy="0" rx="17" ry="7" fill="#3a3a42" /><ellipse cx="0" cy="-1.4" rx="11" ry="4.2" fill="#5a5040" /><circle cx="-3" cy="-1.4" r="1.7" fill="#ffd44a" /><circle cx="4" cy="0" r="1.4" fill="#ffd44a" /></g>
            {/* bras LEVÉ brandissant la pépite d'or, qui s'agite en cadence */}
            <g>
              <animateTransform attributeName="transform" type="rotate" values="-25 19.5 -84; 15 19.5 -84; -25 19.5 -84" dur="1.6s" repeatCount="indefinite" />
              <Arm side={1} a1={150} a2={170} coat="#a83a2c" skin="#e4b48a" />
              <g transform="translate(32,-122)">
                <path d="M-10 6 L-4 -8 L8 -6 L6 8 Z" fill="#ffd44a" stroke="#c8961e" strokeWidth="1.8" />
                <path d="M-4 -1 l4 4" stroke="#fff6c8" strokeWidth="1.8" />
                {[[-14, -11], [14, -8], [0, -17]].map(([x, y], i) => <path key={i} d={`M${x} ${y} l3 3 l-3 3 l-3 -3 Z`} fill="#fff2b0" style={{ animation: `twinkle ${1.4 + i * 0.3}s ease-in-out infinite` }} />)}
              </g>
            </g>
          </Figure>
        </g>

        {/* épave de MARTINE dans un coin */}
        <g transform="translate(856,506) rotate(8)">
          <ellipse cx="0" cy="12" rx="26" ry="6" fill="#0a0603" opacity="0.6" />
          <path d="M0 -20 Q18 -18 20 -4 Q22 8 11 11 L-11 11 Q-22 8 -20 -4 Q-18 -18 0 -20 Z" fill="#8a6240" />
          <circle cx="-1" cy="-4" r="5.5" fill="#cfeaff" stroke="#5c3a22" strokeWidth="1.4" />
          <rect x="-13" y="3" width="24" height="7" rx="2" fill="#0c1410" stroke="#5c3a22" strokeWidth="1" />
          <text x="-1" y="9" textAnchor="middle" fontSize="5.5" fill="#5eff9e" fontFamily="ui-monospace,monospace" style={{ animation: "pulse 2.2s infinite" }}>1849</text>
          <circle cx="13" cy="-27" r="2.3" fill="#5eff9e" style={{ animation: "pulse 1.5s infinite" }} />
          <path d="M8 -20 q6 -8 13 -6" stroke="#8a94a8" strokeWidth="2.3" fill="none" strokeLinecap="round" />
        </g>

        {/* ANACHRONISME : smartphone posé au sol dans un coin, écran allumé */}
        {!made.includes("smartphone") && mode !== "jeu2" && (
          <g transform="translate(140,510) rotate(15)">
            <rect x={-10} y={-18} width={20} height={36} rx={3} fill="#1a1a1a" stroke="#5a5a5a" strokeWidth="1" />
            <rect x={-9} y={-16} width={18} height={32} rx={1.5} fill="#0a1428" />
            {/* barre de notifications */}
            <rect x={-9} y={-16} width={18} height={4} fill="#050810" />
            <text x={0} y={-13} textAnchor="middle" fontSize="3" fontFamily="ui-monospace,monospace" fill="#c8d4e2">12:04 ⚡</text>
            {/* rectangles d'apps */}
            {[[-6, -8], [0, -8], [6, -8], [-6, -2], [0, -2], [6, -2], [-6, 4], [0, 4], [6, 4]].map(([ax, ay], i) => (
              <rect key={i} x={ax - 2} y={ay - 2} width={4} height={4} rx={0.6} fill={["#c8382e", "#3a80c8", "#e0a848", "#5aa030", "#a840c0", "#e83820", "#3ac0c0", "#e07040", "#8ac030"][i]} />
            ))}
            {/* bouton accueil */}
            <circle cx={0} cy={13} r={1.5} fill="none" stroke="#5a5a5a" strokeWidth="0.8" />
          </g>
        )}
      </PLayer>

      {/* voile de grain global */}
      <rect width="1000" height="560" fill="#181008" opacity="0.08" style={{ pointerEvents: "none" }} />

      {/* ═══ zones cliquables ═══ */}
      <Hotspot cx={201} cy={418} r={46} label="James O'Sullivan" reveal={reveal} onClick={() => action("james")} />
      {!tg && (
        <Hotspot cx={306} cy={476} r={40} label="le manipulateur Morse" item="code_morse" reveal={reveal} onClick={() => collect("code_morse")} />
      )}
      <Hotspot cx={856} cy={502} r={34} label="MARTINE" reveal={reveal} onClick={() => action("wreck")} />
      {mode !== "jeu2" && (
        <Hotspot cx={140} cy={510} r={22} label="… quelque chose ne va pas ici" item="smartphone" reveal={reveal} onClick={() => collect("smartphone")} />
      )}
    </svg>
  );
}
