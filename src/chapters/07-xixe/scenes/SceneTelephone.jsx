import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 7 — Tableau 4 : le téléphone transcontinental
   ------------------------------------------------------------
   Bureau new-yorkais chic, 1915. Sur une haute table, un téléphone
   à colonne Bell (« candlestick »). Au mur, une grande carte des
   États-Unis avec la nouvelle LIGNE TRANSCONTINENTALE tirée par
   AT&T de New York à San Francisco. Par la fenêtre, la silhouette
   de la Statue de la Liberté. SEAN O'SULLIVAN, fils de James,
   décroche pour appeler la famille rescapée à San Francisco.
   On lui APPORTE le combiné + le microphone → mini-jeu ? Non :
   simple recette combiné + microphone → msg_telephone.
   ============================================================ */

export default function SceneTelephone({ collect, action, reveal, made = [], queteQui }) {
  const dit = made.includes("msg_telephone");
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="tp-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7a6a5a" /><stop offset="100%" stopColor="#4c4034" /></linearGradient>
        <linearGradient id="tp-desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5a3f24" /><stop offset="100%" stopColor="#2c1c10" /></linearGradient>
        <linearGradient id="tp-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6a4a30" /><stop offset="100%" stopColor="#3a2416" /></linearGradient>
        <linearGradient id="tp-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a8bcc8" /><stop offset="100%" stopColor="#dccfa0" /></linearGradient>
        <radialGradient id="tp-lamp" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffcf78" stopOpacity="0.5" /><stop offset="100%" stopColor="#ff9540" stopOpacity="0" /></radialGradient>
        <filter id="tp-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" /></filter>
        <linearGradient id="tp-panel" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5a3a22" /><stop offset="100%" stopColor="#3a2414" /></linearGradient>
        <linearGradient id="tp-rad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#8a8a84" /><stop offset="50%" stopColor="#b8b8b0" /><stop offset="100%" stopColor="#6a6a64" /></linearGradient>
        <filter id="tp-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.45 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <clipPath id="tp-winclip"><rect x="-90" y="-80" width="180" height="150" /></clipPath>
      </defs>

      {/* mur */}
      <rect width="1000" height="560" fill="url(#tp-wall)" />
      <rect width="1000" height="560" fill="#241a10" opacity="0.22" filter="url(#tp-grain)" />
      {/* papier peint à fines rayures, corniche moulurée */}
      <g opacity="0.07">
        {Array.from({ length: 34 }).map((_, i) => <rect key={i} x={i * 30} y="30" width="12" height="300" fill="#2a1a10" />)}
      </g>
      <g opacity="0.12">
        {Array.from({ length: 34 }).map((_, i) => <path key={i} d={`M${i * 30 + 21} 30 v300`} stroke="#e8d8b8" strokeWidth="1" />)}
      </g>
      <rect x="-40" y="-10" width="1080" height="34" fill="#e0d4bc" />
      <rect x="-40" y="22" width="1080" height="6" fill="#b8a888" />
      <rect x="-40" y="28" width="1080" height="3" fill="#5a4a38" opacity="0.6" />
      {Array.from({ length: 50 }).map((_, i) => <rect key={i} x={i * 22} y="8" width="10" height="10" fill="#c8bca0" />)}
      {/* lambris de chêne foncé, panneaux moulurés */}
      <rect x="-40" y="330" width="1080" height="112" fill="url(#tp-panel)" />
      <rect x="-40" y="324" width="1080" height="9" fill="#6a4a2c" />
      <rect x="-40" y="324" width="1080" height="2" fill="#9a7a50" />
      {Array.from({ length: 11 }).map((_, i) => (
        <g key={i}>
          <rect x={i * 96 + 6} y="344" width="80" height="84" fill="none" stroke="#24140a" strokeWidth="2.4" />
          <path d={`M${i * 96 + 8} 346 h76`} stroke="#8a6a44" strokeWidth="1" opacity="0.5" />
        </g>
      ))}
      {/* le plafonnier électrique (1915 : l'électricité arrive dans les bureaux) */}
      <g transform="translate(500,0)">
        <path d="M0 28 v40" stroke="#3a2a18" strokeWidth="2" />
        <path d="M-26 68 L26 68 L18 86 L-18 86 Z" fill="#e8e0c8" opacity="0.9" />
        <ellipse cx="0" cy="88" rx="18" ry="4" fill="#fff4d0" />
        <circle cx="0" cy="96" r="40" fill="#fff0c0" opacity="0.18" filter="url(#tp-blur)" />
      </g>

      {/* ═══ couche lointaine : fenêtre sur New York + grande carte USA ═══ */}
      <PLayer depth={1}>
        {/* la FENÊTRE avec vue sur la baie (Statue de la Liberté) */}
        <g transform="translate(788,160)">
          <rect x="-92" y="-84" width="184" height="156" fill="url(#tp-sky)" />
          <g clipPath="url(#tp-winclip)">
            {/* nuages et silhouettes lointaines (dont le Woolworth Building, 1913) */}
            <ellipse cx="-40" cy="-56" rx="40" ry="7" fill="#fff" opacity="0.6" filter="url(#tp-blur)" />
            <ellipse cx="50" cy="-34" rx="34" ry="6" fill="#fff" opacity="0.5" filter="url(#tp-blur)" />
            <g fill="#8a94a4" opacity="0.8">
              <rect x="40" y="-30" width="14" height="60" /><path d="M40 -30 L47 -50 L54 -30 Z" /><rect x="46" y="-58" width="2" height="8" />
              <rect x="10" y="-6" width="14" height="40" /><rect x="60" y="-2" width="16" height="36" /><rect x="80" y="-14" width="12" height="48" />
            </g>
            {/* mer */}
            <rect x="-90" y="30" width="180" height="42" fill="#5a94a4" opacity="0.85" />
            <path d="M-90 32 h180" stroke="#cfe0dc" strokeWidth="1" opacity="0.4" />

            {/* GODZILLA a hauteur de la Statue de la Liberte : silhouette
                sombre qui traverse la baie de GAUCHE a DROITE, 15 s apres
                le chargement (clin d'oeil, humour reference). */}
            <g opacity="0.92" transform="translate(-140,42)">
              <animateTransform attributeName="transform" type="translate"
                values="-140,42; -140,42; 110,42; 110,42"
                keyTimes="0; 0.08; 0.92; 1"
                dur="60s" begin="15s" fill="freeze" repeatCount="indefinite" />
              {/* dessine en local (feet a y=0, tete en haut vers y=-40),
                  facing RIGHT, echelle 0.6 pour ~ meme hauteur que la Statue */}
              <g transform="scale(0.6)">
                {/* petit bercement de marche */}
                <animateTransform attributeName="transform" type="translate"
                  additive="sum"
                  values="0,0; 0,-1.6; 0,0; 0,-1.6; 0,0" dur="2s" repeatCount="indefinite" />
                {/* remous autour des jambes (au niveau de la mer) */}
                <ellipse cx="0" cy="0" rx="30" ry="4" fill="#cfe0dc" opacity="0.55">
                  <animate attributeName="opacity" values="0.35;0.7;0.35" dur="2s" repeatCount="indefinite" />
                </ellipse>
                {/* QUEUE massive derriere (a gauche, opposee au mouvement) */}
                <path d="M-6 -14 Q-30 -20 -46 -12 Q-52 -6 -44 -8 Q-30 -12 -14 -12 Q-8 -14 -6 -14 Z" fill="#0e2418" />
                {/* pattes arrieres puissantes qui plongent dans l'eau */}
                <path d="M-8 -4 Q-12 -18 -4 -22 Q4 -22 4 -8 L8 -4 L2 -2 L-6 -2 Z" fill="#0e2418" />
                <path d="M6 -4 Q2 -20 10 -24 Q18 -24 18 -10 L20 -4 L14 -2 L6 -2 Z" fill="#12301c" />
                {/* CORPS enorme, ventre plus clair */}
                <path d="M-12 -6 Q-16 -34 0 -46 Q18 -52 22 -32 Q24 -14 16 -4 Z" fill="#12301c" />
                <path d="M-4 -12 Q-8 -30 4 -38 Q14 -40 16 -26 Q16 -12 8 -6 Z" fill="#1a3a24" opacity="0.7" />
                {/* pointes/ecailles dorsales le long du dos */}
                {[[-10,-32],[-4,-40],[4,-44],[12,-42],[18,-36],[22,-28]].map(([x,y],i) => (
                  <path key={i} d={`M${x} ${y} l3 -6 l3 6 Z`} fill="#1e4a2c" />
                ))}
                {/* PETITES MAINS de T-rex TENDUES vers la Statue (a droite) */}
                <g>
                  {/* bras droit, tendu vers l'avant */}
                  <path d="M18 -22 q10 -2 18 2 q2 2 -2 3 q-3 -1 -6 -1 q-3 1 -7 0 Z" fill="#0e2418" />
                  {/* petites griffes */}
                  <path d="M34 -18 l3 1 M34 -20 l3 0 M34 -22 l3 -1" stroke="#0e2418" strokeWidth="0.6" fill="none" />
                  {/* bras gauche, un peu plus court */}
                  <path d="M14 -18 q8 -1 14 3 q1 2 -2 2 q-3 -1 -6 -1 q-3 1 -6 0 Z" fill="#12301c" opacity="0.85" />
                </g>
                {/* COU epais qui monte, incline vers l'avant */}
                <path d="M6 -44 Q8 -56 18 -62 Q28 -60 26 -50 Q22 -46 18 -44 Z" fill="#12301c" />
                {/* TETE de T-rex avec museau allonge, tournee vers la droite */}
                <g transform="translate(24,-62)">
                  {/* crane */}
                  <path d="M-8 -2 Q-6 -12 6 -12 Q18 -10 20 -2 Q18 4 8 4 Q-6 4 -8 -2 Z" fill="#12301c" />
                  {/* museau allonge en avant */}
                  <path d="M8 -4 Q18 -6 26 -2 Q28 2 24 4 Q14 6 8 4 Z" fill="#12301c" />
                  {/* machoire inferieure ouverte */}
                  <path d="M6 4 Q16 8 24 5 L26 6 Q16 10 6 6 Z" fill="#0a1c12" />
                  {/* DENTS visibles */}
                  <path d="M10 4 l0.8 3 l0.8 -3 M15 4 l0.8 3.4 l0.8 -3.4 M20 4 l0.8 3 l0.8 -3" fill="#efe6d2" stroke="#efe6d2" strokeWidth="0.4" />
                  {/* oeil rouge lueur */}
                  <circle cx="12" cy="-4" r="1.4" fill="#ff6b3a">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                  {/* narine */}
                  <circle cx="22" cy="0" r="0.6" fill="#0a1c12" />
                </g>
              </g>
            </g>

            {/* Statue de la Liberté au loin */}
            <g transform="translate(-30,42)">
              {/* socle */}
              <rect x="-8" y="0" width="16" height="12" fill="#7a705c" />
              <rect x="-14" y="12" width="28" height="6" fill="#5a5040" />
              {/* silhouette */}
              <path d="M-3 -22 L3 -22 L4 0 L-4 0 Z" fill="#7ea89a" />
              <circle cx="0" cy="-26" r="4" fill="#7ea89a" />
              {/* couronne à rayons */}
              {[...Array(7)].map((_, i) => <path key={i} d="M0 -32 v-4" stroke="#7ea89a" strokeWidth="1.2" transform={`rotate(${-45 + i * 15} 0 -26)`} />)}
              {/* flambeau levé */}
              <path d="M4 -22 l12 -14" stroke="#7ea89a" strokeWidth="2" />
              <path d="M16 -36 q-2 -6 3 -8 q5 2 3 8 Z" fill="#ffcf78" style={{ animation: "glow 2.6s ease-in-out infinite" }} />
            </g>
            {/* buildings de Manhattan */}
            {[[20, 20, 40], [46, 12, 52], [72, 20, 32]].map(([x, top, h], i) => (
              <g key={i}>
                <rect x={x} y={top} width={20} height={h} fill="#4a4a54" />
                {[...Array(4)].map((_, k) => [...Array(2)].map((__, c) => (
                  <rect key={`${k}-${c}`} x={x + 3 + c * 8} y={top + 4 + k * 8} width="4" height="4" fill="#ffe08a" opacity="0.7" />
                )))}
              </g>
            ))}

          </g>
          {/* store à rouleau à demi baissé + reflet sur la vitre */}
          <rect x="-90" y="-82" width="180" height="26" fill="#e8dcc0" />
          <path d="M-90 -56 h180" stroke="#a89878" strokeWidth="3" />
          <circle cx="0" cy="-50" r="3" fill="none" stroke="#a89878" strokeWidth="1.4" />
          <path d="M-80 60 L-30 -50 L-14 -50 L-64 60 Z" fill="#fff" opacity="0.08" />
          {/* cadre + croisillons */}
          <rect x="-92" y="-84" width="184" height="156" fill="none" stroke="#3a2a18" strokeWidth="8" />
          <path d="M0 -84 v156 M-92 -6 h184" stroke="#3a2a18" strokeWidth="4" />
          <rect x="-102" y="72" width="204" height="10" fill="#5a3f24" />
          <rect x="-102" y="72" width="204" height="2.5" fill="#9a7a50" />
        </g>
        {/* le RADIATEUR en fonte sous la fenêtre */}
        <g transform="translate(788,440)">
          <ellipse cx="0" cy="2" rx="70" ry="6" fill="#140c06" opacity="0.4" />
          {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-62 + i * 10.5} y="-62" width="8" height="60" rx="3.5" fill="url(#tp-rad)" />)}
          <rect x="-64" y="-14" width="128" height="5" fill="#7a7a74" />
          <rect x="-64" y="-56" width="128" height="4" fill="#9a9a94" />
          <path d="M-48 -62 q0 -6 6 -6 M50 -62 q-2 -8 4 -10" stroke="#f0f0f0" strokeWidth="2" fill="none" opacity="0.3" style={{ animation: "drift 4s ease-in-out infinite" }} />
        </g>
        {/* la bibliothèque vitrée, à gauche */}
        <g transform="translate(64,440)">
          <rect x="-56" y="-300" width="112" height="300" fill="#3a2414" />
          <rect x="-60" y="-306" width="120" height="10" fill="#5a3a22" />
          {[0, 1, 2, 3].map((r) => (
            <g key={r}>
              <rect x="-48" y={-288 + r * 70} width="96" height="60" fill="#24160c" />
              {Array.from({ length: 11 }).map((_, k) => (
                <rect key={k} x={-46 + k * 8.4} y={-288 + r * 70 + 60 - (40 + ((k * 7 + r * 3) % 14))} width="7" height={40 + ((k * 7 + r * 3) % 14)} fill={["#6a2a1e", "#2a4a3a", "#7a5a2a", "#3a3a5a", "#5a2a3a"][(k + r) % 5]} />
              ))}
              <rect x="-48" y={-228 + r * 70} width="96" height="4" fill="#5a3a22" />
            </g>
          ))}
          <path d="M-48 -288 L-10 -288 L-48 -200 Z" fill="#fff" opacity="0.06" />
          <path d="M0 -296 v296" stroke="#5a3a22" strokeWidth="3" />
        </g>
        {/* le portemanteau, chapeau melon et canne */}
        <g transform="translate(950,440)">
          <rect x="-3" y="-230" width="6" height="226" fill="#3a2414" />
          <path d="M-26 0 L0 -20 L26 0" stroke="#3a2414" strokeWidth="5" fill="none" />
          <path d="M0 -224 l-18 -8 M0 -224 l18 -8 M0 -210 l-16 4 M0 -210 l16 4" stroke="#3a2414" strokeWidth="3" />
          <g transform="translate(-16,-236)"><ellipse cx="0" cy="6" rx="16" ry="4" fill="#1a1410" /><path d="M-10 6 Q-10 -10 0 -10 Q10 -10 10 6 Z" fill="#241c16" /></g>
          {/* pardessus suspendu par le col */}
          <path d="M14 -212 q-8 4 -10 20 L-2 -80 Q14 -70 34 -80 L32 -192 q-2 -16 -10 -20 Z" fill="#2a2420" />
          <path d="M14 -212 L18 -150 L22 -212" stroke="#1a1410" strokeWidth="2" fill="none" />
          <path d="M6 -150 q4 30 2 66 M30 -150 q-2 30 0 66" stroke="#1a1410" strokeWidth="1.4" fill="none" opacity="0.7" />
        </g>

        {/* GRANDE CARTE DES USA au mur avec la LIGNE TRANSCONTINENTALE 1915 */}
        <g transform="translate(280,180)">
          <rect x="-160" y="-96" width="320" height="188" fill="#efe0be" />
          <rect x="-160" y="-96" width="320" height="188" fill="#8a6a3a" opacity="0.16" filter="url(#tp-grain)" />
          <rect x="-160" y="-96" width="320" height="188" fill="none" stroke="#5a3f24" strokeWidth="5" />
          <text x="0" y="-72" textAnchor="middle" fontFamily="'Cinzel',Georgia,serif" fontSize="14" fill="#5a3f24" letterSpacing="1">UNITED STATES · 1915</text>
          {/* contour très stylisé du continent */}
          <path d="M-140 -46 L-40 -50 L20 -46 L100 -40 L140 -30 L140 60 L60 66 L-40 70 L-100 60 L-140 30 Z" fill="none" stroke="#7a5a34" strokeWidth="2.2" />
          {/* la LIGNE transcontinentale : San Francisco → New York */}
          <path d="M-124 20 Q-40 -6 132 -12" stroke="#c8382e" strokeWidth="3" strokeDasharray="6 5" fill="none" />
          {/* SF (gauche) et NY (droite) */}
          <circle cx="-124" cy="20" r="5" fill="#c8382e" stroke="#5a1a12" strokeWidth="1.4" />
          <text x="-124" y="36" textAnchor="middle" fontFamily="Palatino,serif" fontSize="10" fill="#5a1a12" fontWeight="700">San Francisco</text>
          <circle cx="132" cy="-12" r="5" fill="#c8382e" stroke="#5a1a12" strokeWidth="1.4" />
          <text x="132" y="-20" textAnchor="middle" fontFamily="Palatino,serif" fontSize="10" fill="#5a1a12" fontWeight="700">New York</text>
          {/* une signature-tampon */}
          <g transform="translate(-88,72)" opacity="0.65">
            <circle r="14" fill="none" stroke="#7a2418" strokeWidth="1.4" />
            <text y="1" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill="#7a2418">AT&amp;T</text>
            <text y="9" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill="#7a2418">1915</text>
          </g>
        </g>
      </PLayer>

      {/* ═══ couche intermédiaire : lampe à abat-jour + Sean au bureau ═══ */}
      <PLayer depth={2}>
        {/* parquet en perspective (sous Sean, pour qu'on voie ses pieds) */}
        <rect y="440" width="1000" height="120" fill="url(#tp-floor)" />
        <rect y="442" width="1000" height="118" fill="#241608" opacity="0.32" filter="url(#tp-grain)" />
        {Array.from({ length: 22 }).map((_, i) => {
          const x = -180 + i * 66;
          return <path key={i} d={`M${(500 + (x - 500) * 0.66).toFixed(0)} 440 L${x} 560`} stroke="#241408" strokeWidth="1.2" opacity="0.45" />;
        })}
        <rect y="438" width="1000" height="5" fill="#241408" />
        {/* tapis sous le bureau */}
        <path d="M250 452 L750 452 L820 540 L180 540 Z" fill="#4a2a3a" />
        <path d="M264 458 L736 458 L800 534 L200 534 Z" fill="none" stroke="#c8a860" strokeWidth="2" opacity="0.6" />
        <path d="M290 466 L710 466 L766 526 L234 526 Z" fill="#5a3444" />
        <ellipse cx="500" cy="490" rx="440" ry="46" fill="#5e4230" opacity="0.2" />
        <ellipse cx="490" cy="460" rx="180" ry="60" fill="url(#tp-lamp)" style={{ animation: "glow 3s ease-in-out infinite" }} />
        {/* « ? » de Sean tant qu'il guide */}

        {/* SEAN O'SULLIVAN debout, en costume, main sur le combiné */}
        <g transform="translate(560,376)">
          <ellipse cx="0" cy="94" rx="34" ry="8" fill="#160f08" opacity="0.5" />
          {/* costume, cravate rayée ; le combiné à l'oreille */}
          <Figure x={0} y={74} s={0.92} skin="#e4b48a" hair="#8a3a1a" look="short" freckles mood="content"
            garment="jacket" coat="#4a5a6a" coat2="#efe9dc" pants="#2a3846" shoes="#141418"
            arms={[{ a1: 40, a2: -30 }, { a1: 150, a2: -135 }]}>
            <path d="M-2 -86 L2 -86 L4 -52 L-4 -52 Z" fill="#2a6a3a" />
            {[-80, -70, -60].map((y) => <path key={y} d={`M-3 ${y} h6`} stroke="#e0b040" strokeWidth="1.2" />)}
            <ellipse cx="17" cy="-104" rx="5.4" ry="9" fill="#2a2418" />
            <path d="M13 -104 q4 -2 8 0" stroke="#e0b040" strokeWidth="1" fill="none" />
          </Figure>
        </g>
      </PLayer>

      {/* ═══ premier plan : bureau, téléphone à colonne, lampe, épave ═══ */}
      <PLayer depth={3}>
        {/* LE GRAND BUREAU à caissons */}
        <g transform="translate(500,490)">
          <rect x="-240" y="-8" width="480" height="18" rx="4" fill="url(#tp-desk)" />
          <rect x="-232" y="10" width="14" height="52" fill="#2c1c10" />
          <rect x="218" y="10" width="14" height="52" fill="#2c1c10" />
          {[-236, 156].map((x) => (
            <g key={x}>
              <rect x={x} y="10" width="80" height="58" fill="#3a2414" />
              {[14, 32, 50].map((y) => <g key={y}><rect x={x + 6} y={y} width="68" height="14" fill="none" stroke="#1e120a" strokeWidth="1.4" /><rect x={x + 34} y={y + 6} width="12" height="2.6" rx="1" fill="#c8a860" /></g>)}
            </g>
          ))}
          <rect x="-240" y="-8" width="480" height="3" fill="#8a6a44" opacity="0.6" />
          {/* dossier + plume sur le bureau */}
          <g transform="translate(-160,-14)">
            <rect x="-24" y="-10" width="48" height="18" rx="1" fill="#e6dcc2" />
            <path d="M-18 -4 h36 M-18 0 h30" stroke="#8a7a5a" strokeWidth="1" opacity="0.6" />
            <g transform="translate(22,-6) rotate(20)"><path d="M0 0 Q4 -18 1 -32 Q-2 -18 0 0 Z" fill="#f4efe2" stroke="#c9be9a" strokeWidth="0.8" /></g>
          </g>
        </g>

        {/* LE TÉLÉPHONE À COLONNE Bell (candlestick) — vibre légèrement (voix qui arrive) */}
        <g>
          <animateTransform attributeName="transform" type="translate"
            values="560,468; 560,468; 561,468; 559,468; 561,469; 560,468; 560,468; 560,468"
            keyTimes="0; 0.55; 0.6; 0.65; 0.7; 0.75; 0.8; 1"
            dur="6s" repeatCount="indefinite" />
          {/* base ronde */}
          <ellipse cx="0" cy="14" rx="26" ry="6" fill="#160f08" opacity="0.5" />
          <ellipse cx="0" cy="12" rx="22" ry="4" fill="#2c2418" />
          <ellipse cx="0" cy="8" rx="22" ry="6" fill="#3a2c1c" />
          {/* colonne */}
          <rect x="-3" y="-40" width="6" height="48" fill="#3a2c1c" />
          {/* microphone conique (embouchure) au sommet */}
          <path d="M-12 -46 L12 -46 L8 -34 L-8 -34 Z" fill="#2a2418" />
          <ellipse cx="0" cy="-46" rx="12" ry="3.5" fill="#1a1410" />
          <ellipse cx="0" cy="-46" rx="8" ry="2.2" fill="#0a0806" />
          {/* petit crochet latéral pour l'écouteur (vide car Sean l'a en main) */}
          <path d="M12 -36 q10 -2 8 8" stroke="#5a4a30" strokeWidth="2" fill="none" />
          {/* cordon qui va vers l'écouteur (Sean au-dessus) */}
          <path d="M14 -30 Q30 -34 34 -68" stroke="#2a2418" strokeWidth="2.5" fill="none" />
        </g>

        {/* petites ondes sonores qui sortent de l'ecouteur (la voix qui arrive) */}
        <g transform="translate(594,438)" opacity="0.75">
          {[0, 1, 2].map((i) => (
            <path key={i} d="M0 0 q6 -6 12 0" stroke="#ffe08a" strokeWidth="1.6" fill="none" strokeLinecap="round">
              <animate attributeName="opacity" values="0;0;0.9;0" dur="6s" begin={`${3 + i * 0.4}s`} repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="translate"
                values="0,0; 6,-4; 12,-8" dur="6s" begin={`${3 + i * 0.4}s`} repeatCount="indefinite" />
            </path>
          ))}
        </g>

        {/* petite lampe à abat-jour verte (banquier) qui clignote */}
        <g transform="translate(300,462)">
          <rect x="-4" y="0" width="8" height="30" fill="#c8a860" />
          <rect x="-14" y="0" width="28" height="6" rx="2" fill="#a88b30" />
          <path d="M-24 -20 L24 -20 L20 0 L-20 0 Z" fill="#2a6a3a" />
          <ellipse cx="0" cy="-20" rx="24" ry="6" fill="#3a8a4a">
            <animate attributeName="fill" values="#3a8a4a;#7ae090;#3a8a4a;#3a8a4a;#3a8a4a" dur="2.6s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="0" cy="4" rx="26" ry="6" fill="url(#tp-lamp)">
            <animate attributeName="opacity" values="0.45;1;0.45;0.45;0.45" dur="2.6s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* résultat : SIGNAL vocal qui file dans la ligne (petits ronds
            partant du téléphone vers la carte, animation) */}
        {dit && (
          <g style={{ animation: "fadein 1s ease-out" }}>
            {[0, 1, 2, 3].map((i) => (
              <circle key={i} r="4" fill="#ffe08a">
                <animateMotion dur="2.4s" begin={`${i * 0.6}s`} repeatCount="indefinite" path="M560 428 Q460 380 300 220" />
                <animate attributeName="opacity" values="0;1;0" dur="2.4s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </g>
        )}

        {/* épave de MARTINE */}
        <g transform="translate(856,506) rotate(8)">
          <ellipse cx="0" cy="12" rx="26" ry="6" fill="#0a0603" opacity="0.6" />
          <path d="M0 -20 Q18 -18 20 -4 Q22 8 11 11 L-11 11 Q-22 8 -20 -4 Q-18 -18 0 -20 Z" fill="#8a6240" />
          <circle cx="-1" cy="-4" r="5.5" fill="#cfeaff" stroke="#5c3a22" strokeWidth="1.4" />
          <rect x="-13" y="3" width="24" height="7" rx="2" fill="#0c1410" stroke="#5c3a22" strokeWidth="1" />
          <text x="-1" y="9" textAnchor="middle" fontSize="5.5" fill="#5eff9e" fontFamily="ui-monospace,monospace" style={{ animation: "pulse 2.2s infinite" }}>1915</text>
          <circle cx="13" cy="-27" r="2.3" fill="#5eff9e" style={{ animation: "pulse 1.5s infinite" }} />
        </g>
      </PLayer>

      {/* voile de grain global */}
      <rect width="1000" height="560" fill="#181008" opacity="0.06" style={{ pointerEvents: "none" }} />

      {/* zones cliquables */}
      <Hotspot cx={560} cy={370} r={54} label="Sean O'Sullivan" reveal={reveal} onClick={() => action("sean")} />
      {!dit && (
        <>
          <Hotspot cx={560} cy={432} r={26} label="microphone du téléphone" item="micro" reveal={reveal} onClick={() => collect("micro")} />
          <Hotspot cx={582} cy={410} r={20} label="écouteur du téléphone" item="ecouteur" reveal={reveal} onClick={() => collect("ecouteur")} />
        </>
      )}
      <Hotspot cx={856} cy={502} r={34} label="MARTINE" reveal={reveal} onClick={() => action("wreck")} />
    </svg>
  );
}
