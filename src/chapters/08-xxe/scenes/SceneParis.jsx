import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";
import { Leafy } from "../../../engine/scenery.jsx";

/* ============================================================
   CHAPITRE 8 — Tableau : Paris occupé, 5 juin 1944, fin d'après-midi.
   VERSION PEINTURE FINE : dégradés, grain fractal, brume dorée
   filtrée, ombres longues, façades weathered, pavés qui vivent.
   Marthe passe sur le trottoir, panier au bras, tandis qu'un
   Panzer remonte l'avenue. Sous l'arcade : un marchand clandestin
   avec la couverture qui étouffera cette nuit le son de la TSF.

   Toutes les positions cliquables sont inchangées.
   ============================================================ */

export default function SceneParis({ collect, action, reveal, made = [], mode }) {
  const acheteFait = made.includes("couverture");

  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* ciel de fin d'après-midi, plombé de guerre — beige-gris qui vire au sépia */}
        <linearGradient id="pa-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#7c8898" />
          <stop offset="35%"  stopColor="#9c988a" />
          <stop offset="70%"  stopColor="#c8b494" />
          <stop offset="100%" stopColor="#dcc4a0" />
        </linearGradient>
        <radialGradient id="pa-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#fff4d0" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fff4d0" stopOpacity="0" />
        </radialGradient>
        {/* rue pavée : gris humide avec ombres longues */}
        <linearGradient id="pa-street" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#5a5048" />
          <stop offset="55%"  stopColor="#3a342c" />
          <stop offset="100%" stopColor="#1a1610" />
        </linearGradient>
        <linearGradient id="pa-trottoir" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#8a7a68" />
          <stop offset="100%" stopColor="#5a4a3c" />
        </linearGradient>
        {/* façade haussmannienne : pierre calcaire dorée par le couchant */}
        <linearGradient id="pa-facade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#d4b890" />
          <stop offset="45%"  stopColor="#b4977a" />
          <stop offset="100%" stopColor="#7a6250" />
        </linearGradient>
        <linearGradient id="pa-facade-shadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#8a7458" />
          <stop offset="100%" stopColor="#4a3a2c" />
        </linearGradient>
        {/* toit ardoise mansardé */}
        <linearGradient id="pa-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#5a5460" />
          <stop offset="100%" stopColor="#2a2430" />
        </linearGradient>
        {/* Eiffel : silhouette bleutée dans la brume */}
        <linearGradient id="pa-eiffel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#3a4050" />
          <stop offset="100%" stopColor="#4c4238" />
        </linearGradient>
        {/* brume atmosphérique + grain */}
        <filter id="pa-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="pa-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="8" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="pa-mottle" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="4" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.45 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* ═══ CIEL brumeux ═══ */}
      <PLayer depth={1}>
        <rect width="1000" height="440" fill="url(#pa-sky)" />
        {/* soleil bas voilé, à droite */}
        <circle cx="820" cy="120" r="220" fill="url(#pa-sun)" />
        <circle cx="820" cy="120" r="70"  fill="#f8e8b8" opacity="0.35" filter="url(#pa-blur)" />
        <circle cx="820" cy="120" r="26"  fill="#fff4d0" opacity="0.7" />
        {/* nuages étirés lourds */}
        <g filter="url(#pa-blur)">
          <ellipse cx="180" cy="80"  rx="180" ry="12" fill="#efe6d2" opacity="0.55" />
          <ellipse cx="480" cy="60"  rx="220" ry="10" fill="#e0d4bc" opacity="0.45" />
          <ellipse cx="880" cy="90"  rx="140" ry="10" fill="#c8b8a0" opacity="0.45" />
          <ellipse cx="360" cy="150" rx="200" ry="8"  fill="#d8c8ac" opacity="0.35" />
        </g>
        {/* vol de corbeaux — silhouette de guerre, plus lourds que des hirondelles */}
        <g opacity="0.75">
          <animateTransform attributeName="transform" type="translate"
            values="-40,0; 1060,40; -40,0" dur="42s" repeatCount="indefinite" />
          <path d="M0 90 q7 -8 14 0 q7 -8 14 0" stroke="#1a1408" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M40 108 q6 -7 12 0 q6 -7 12 0" stroke="#1a1408" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M74 96 q6 -7 12 0 q6 -7 12 0" stroke="#1a1408" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </g>
      </PLayer>

      {/* ═══ TOUR EIFFEL au fond, brumeuse ═══ */}
      <PLayer depth={1.5}>
        <g transform="translate(500,300)" opacity="0.85">
          {/* silhouette bleutée : quatre piles galbées, la grande arche,
              les deux plates-formes, le campanile ; voile de brume en bas */}
          <path d="M-74 0 Q-46 -70 -20 -150 L-8 -236 L8 -236 L20 -150 Q46 -70 74 0 L50 0 Q28 -56 0 -58 Q-28 -56 -50 0 Z" fill="url(#pa-eiffel)" />
          <path d="M-44 -66 L44 -66 L40 -80 L-40 -80 Z" fill="#2c323e" />
          <path d="M-44 -66 h88" stroke="#5a6070" strokeWidth="0.8" opacity="0.6" />
          <path d="M-24 -150 L24 -150 L22 -160 L-22 -160 Z" fill="#2c323e" />
          <rect x="-6" y="-246" width="12" height="10" fill="#2c323e" />
          <path d="M0 -246 v-14" stroke="#2c323e" strokeWidth="2" />
          {/* treillis : croisillons fins sur les piles */}
          {Array.from({ length: 9 }).map((_, k) => {
            const y = -6 - k * 8, w = 74 - k * 4.2;
            return <path key={k} d={`M${-w} ${y} L${-w + 14} ${y - 8} M${-w + 14} ${y} L${-w} ${y - 8} M${w} ${y} L${w - 14} ${y - 8} M${w - 14} ${y} L${w} ${y - 8}`} stroke="#1e232c" strokeWidth="0.6" opacity="0.6" />;
          })}
          {Array.from({ length: 10 }).map((_, k) => {
            const y = -84 - k * 7, w = 38 - k * 1.8;
            return <path key={`h${k}`} d={`M${-w} ${y} L${w} ${y - 7} M${w} ${y} L${-w} ${y - 7}`} stroke="#1e232c" strokeWidth="0.5" opacity="0.45" />;
          })}
          <path d="M-20 -160 L-8 -236 M20 -160 L8 -236 M-16 -180 L12 -200 M16 -180 L-12 -200 M-12 -205 L8 -222 M12 -205 L-8 -222" stroke="#1e232c" strokeWidth="0.5" opacity="0.5" />
          {/* voile de brume par-dessus la moitié inférieure — perspective atmosphérique */}
          <rect x="-80" y="-40" width="160" height="60" fill="#c8b494" opacity="0.35" filter="url(#pa-blur)" />
          {/* drapeau nazi au sommet — rouge, disque blanc, croix stylisée */}
          <g transform="translate(0,-262)">
            <path d="M0 0 L48 0 L48 32 L0 36 Z" fill="#8a1a1a" stroke="#3a0a0a" strokeWidth="1" />
            <path d="M0 0 L48 0 L48 32 L0 36 Z" fill="#4a0808" opacity="0.35" filter="url(#pa-grain)" />
            <circle cx="24" cy="17" r="9" fill="#f0e4c8" />
            <path d="M20 13 L24 17 L20 21 M24 13 L28 17 L24 21 M20 17 L28 17 M24 13 L24 21" stroke="#1a1a1a" strokeWidth="1.6" fill="none" />
          </g>
        </g>
      </PLayer>

      {/* ═══ L'AVENUE qui file vers la tour : façades en fuite, platanes ═══ */}
      <PLayer depth={1.5}>
        <path d="M360 440 L478 302 L522 302 L700 440 Z" fill="#6a6056" />
        <path d="M360 440 L478 302 L522 302 L700 440 Z" fill="#c8b494" opacity="0.25" />
        <path d="M430 440 L494 302 M630 440 L508 302" stroke="#8a7a68" strokeWidth="2" opacity="0.5" />
        {/* façades de gauche, de plus en plus petites et brumeuses */}
        {[[360, 120, 440, 400, 150, 410], [400, 150, 410, 432, 196, 372], [432, 196, 372, 456, 232, 342], [456, 232, 342, 472, 258, 318]].map(([x0, t0, b0, x1, t1, b1], i) => (
          <g key={`L${i}`} opacity={0.95 - i * 0.12}>
            <path d={`M${x0} ${t0} L${x1} ${t1} L${x1} ${b1} L${x0} ${b0} Z`} fill={i % 2 ? "#b8a088" : "#c4ac90"} />
            {[0.25, 0.5, 0.75].map((f) => <path key={f} d={`M${x0} ${t0 + (b0 - t0) * f} L${x1} ${t1 + (b1 - t1) * f}`} stroke="#5a4838" strokeWidth="0.8" opacity="0.6" />)}
            {[0.3, 0.7].map((f) => <path key={`v${f}`} d={`M${x0 + (x1 - x0) * f} ${t0 + (t1 - t0) * f + 6} L${x0 + (x1 - x0) * f} ${b0 + (b1 - b0) * f - 10}`} stroke="#3a3440" strokeWidth={4 - i} opacity="0.55" strokeDasharray="8 6" />)}
            <path d={`M${x0} ${t0} L${x1} ${t1} L${x1} ${t1 - 10 + i * 2} L${x0} ${t0 - 18 + i * 3} Z`} fill="#4a4450" />
          </g>
        ))}
        {/* façades de droite */}
        {[[700, 120, 440, 640, 150, 410], [640, 150, 410, 588, 196, 372], [588, 196, 372, 552, 232, 342], [552, 232, 342, 530, 258, 318]].map(([x0, t0, b0, x1, t1, b1], i) => (
          <g key={`R${i}`} opacity={0.95 - i * 0.12}>
            <path d={`M${x0} ${t0} L${x1} ${t1} L${x1} ${b1} L${x0} ${b0} Z`} fill={i % 2 ? "#a89078" : "#9a846c"} />
            {[0.25, 0.5, 0.75].map((f) => <path key={f} d={`M${x0} ${t0 + (b0 - t0) * f} L${x1} ${t1 + (b1 - t1) * f}`} stroke="#4a3a2c" strokeWidth="0.8" opacity="0.6" />)}
            {[0.3, 0.7].map((f) => <path key={`v${f}`} d={`M${x0 + (x1 - x0) * f} ${t0 + (t1 - t0) * f + 6} L${x0 + (x1 - x0) * f} ${b0 + (b1 - b0) * f - 10}`} stroke="#2a2430" strokeWidth={4 - i} opacity="0.55" strokeDasharray="8 6" />)}
            <path d={`M${x0} ${t0} L${x1} ${t1} L${x1} ${t1 - 10 + i * 2} L${x0} ${t0 - 18 + i * 3} Z`} fill="#3a3440" />
          </g>
        ))}
        {/* les platanes de l'avenue, qui rapetissent vers le fond */}
        {[[392, 420, 0.42], [432, 382, 0.32], [458, 350, 0.24], [472, 330, 0.18], [668, 420, 0.42], [604, 382, 0.32], [566, 350, 0.24], [544, 330, 0.18]].map(([x, y, sc], i) => (
          <Leafy key={i} x={x} y={y} s={sc} color={["#5a6a3a", "#66743e", "#526234"][i % 3]} light={1} seed={801 + i} />
        ))}
        <rect x="360" y="290" width="340" height="40" fill="#d8c4a0" opacity="0.35" filter="url(#pa-blur)" />
      </PLayer>

      {/* ═══ FAÇADES haussmanniennes ═══ */}
      <PLayer depth={2}>
        {/* ─── immeuble gauche ─── */}
        <g>
          <rect x="0" y="80" width="360" height="380" fill="url(#pa-facade)" stroke="#5a4838" strokeWidth="2" />
          {/* patine générale */}
          <rect x="0" y="80" width="360" height="380" fill="#3a2818" opacity="0.22" filter="url(#pa-mottle)" />
          {/* corniches horizontales avec relief */}
          {[200, 300, 400].map((y, i) => (
            <g key={i}>
              <rect x="0" y={y - 4} width="360" height="8" fill="url(#pa-facade-shadow)" />
              <path d={`M0 ${y - 4} h360`} stroke="#3a2c20" strokeWidth="1.2" />
              <path d={`M0 ${y + 4} h360`} stroke="#f0d8b0" strokeWidth="0.8" opacity="0.55" />
            </g>
          ))}
          {/* fenêtres avec balconnets et volets ouverts */}
          {[100, 200, 300].map((y, r) => [40, 130, 220, 310].map((x, c) => (
            <g key={`Lf-${r}-${c}`}>
              {/* embrasure intérieure sombre */}
              <rect x={x - 2} y={y + 16} width="50" height="64" fill="#241a10" />
              {/* vitre — vitrage divisé en 4 carreaux */}
              <rect x={x} y={y + 18} width="46" height="60" fill="#3a4048" stroke="#0a0806" strokeWidth="1.4" />
              <path d={`M${x + 23} ${y + 18} v60 M${x} ${y + 48} h46`} stroke="#0a0806" strokeWidth="0.8" opacity="0.7" />
              {/* reflet léger dans une vitre */}
              <rect x={x + 2} y={y + 20} width="8" height="18" fill="#8a98a8" opacity="0.35" />
              {/* balconnet en fer forgé */}
              <path d={`M${x - 4} ${y + 78} L${x + 50} ${y + 78} L${x + 46} ${y + 84} L${x} ${y + 84} Z`} fill="#5a4838" />
              <path d={`M${x - 4} ${y + 82} h54`} stroke="#2a1e12" strokeWidth="0.6" />
              {/* volets */}
              <rect x={x - 8} y={y + 18} width="8" height="60" fill="#4a3020" stroke="#241408" strokeWidth="0.5" />
              <path d={`M${x - 4} ${y + 20} v56`} stroke="#2a1608" strokeWidth="0.4" />
              <rect x={x + 46} y={y + 18} width="8" height="60" fill="#4a3020" stroke="#241408" strokeWidth="0.5" />
              <path d={`M${x + 50} ${y + 20} v56`} stroke="#2a1608" strokeWidth="0.4" />
            </g>
          )))}
          {/* toit mansardé ardoise, avec lucarne */}
          <path d="M0 80 L360 80 L340 40 L20 40 Z" fill="url(#pa-roof)" />
          <path d="M20 40 L340 40" stroke="#141018" strokeWidth="1.6" />
          {/* lucarne */}
          <path d="M170 40 L170 22 L190 22 L190 40 Z" fill="url(#pa-roof)" stroke="#141018" strokeWidth="1" />
          <rect x="174" y="24" width="12" height="12" fill="#3a4048" stroke="#0a0806" strokeWidth="0.6" />
          {/* cheminée en brique */}
          <rect x="60" y="20" width="14" height="20" fill="#8a3818" stroke="#3a1408" strokeWidth="0.8" />
          <rect x="58" y="18" width="18" height="4" fill="#5a2810" />
          {/* petit filet de fumée qui monte */}
          <path d="M67 18 q-3 -6 2 -12 q-2 -6 3 -12" stroke="#7a7060" strokeWidth="2" fill="none" opacity="0.5"
            style={{ animation: "drift 5s ease-in-out infinite" }} />
        </g>

        {/* ─── immeuble droit ─── */}
        <g>
          <rect x="700" y="80" width="300" height="380" fill="url(#pa-facade)" stroke="#5a4838" strokeWidth="2" />
          <rect x="700" y="80" width="300" height="380" fill="#3a2818" opacity="0.22" filter="url(#pa-mottle)" />
          {[200, 300, 400].map((y, i) => (
            <g key={i}>
              <rect x="700" y={y - 4} width="300" height="8" fill="url(#pa-facade-shadow)" />
              <path d={`M700 ${y - 4} h300`} stroke="#3a2c20" strokeWidth="1.2" />
              <path d={`M700 ${y + 4} h300`} stroke="#f0d8b0" strokeWidth="0.8" opacity="0.55" />
            </g>
          ))}
          {[100, 200, 300].map((y, r) => [720, 810, 900].map((x, c) => (
            <g key={`Rf-${r}-${c}`}>
              <rect x={x - 2} y={y + 16} width="50" height="64" fill="#241a10" />
              <rect x={x} y={y + 18} width="46" height="60" fill="#3a4048" stroke="#0a0806" strokeWidth="1.4" />
              <path d={`M${x + 23} ${y + 18} v60 M${x} ${y + 48} h46`} stroke="#0a0806" strokeWidth="0.8" opacity="0.7" />
              <rect x={x + 2} y={y + 20} width="8" height="18" fill="#8a98a8" opacity="0.35" />
              <path d={`M${x - 4} ${y + 78} L${x + 50} ${y + 78} L${x + 46} ${y + 84} L${x} ${y + 84} Z`} fill="#5a4838" />
              <rect x={x - 8} y={y + 18} width="8" height="60" fill="#4a3020" stroke="#241408" strokeWidth="0.5" />
              <rect x={x + 46} y={y + 18} width="8" height="60" fill="#4a3020" stroke="#241408" strokeWidth="0.5" />
            </g>
          )))}
          <path d="M700 80 L1000 80 L980 40 L720 40 Z" fill="url(#pa-roof)" />
          <path d="M720 40 L980 40" stroke="#141018" strokeWidth="1.6" />
          <path d="M840 40 L840 22 L860 22 L860 40 Z" fill="url(#pa-roof)" stroke="#141018" strokeWidth="1" />
          <rect x="844" y="24" width="12" height="12" fill="#3a4048" stroke="#0a0806" strokeWidth="0.6" />
        </g>
      </PLayer>

      {/* ═══ AFFICHES ═══ */}
      <PLayer depth={2}>
        {/* Affiche VERBOTEN, corner déchiré + tâche d'humidité */}
        <g transform="translate(20,300)">
          <rect x="0" y="0" width="70" height="90" fill="#e8dfc8" stroke="#3a0a0a" strokeWidth="1.5" />
          <rect x="0" y="0" width="70" height="90" fill="#5a3818" opacity="0.2" filter="url(#pa-grain)" />
          {/* déchirure coin bas-droit */}
          <path d="M70 74 L58 90 L70 90 Z" fill="#241408" />
          <path d="M70 74 L58 90" stroke="#5a1a1a" strokeWidth="0.5" />
          <text x="35" y="18" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fontWeight="800" fill="#8a1a1a">VERBOTEN</text>
          <path d="M6 26 h58" stroke="#3a0a0a" strokeWidth="0.6" />
          <path d="M6 34 h58" stroke="#3a0a0a" strokeWidth="0.4" />
          <text x="35" y="48" textAnchor="middle" fontFamily="Georgia,serif" fontSize="6.5" fill="#3a0a0a">Écoute des</text>
          <text x="35" y="56" textAnchor="middle" fontFamily="Georgia,serif" fontSize="6.5" fill="#3a0a0a">radios ennemies</text>
          <text x="35" y="66" textAnchor="middle" fontFamily="Georgia,serif" fontSize="6.5" fontWeight="700" fill="#5a0a0a">= PRISON</text>
          <text x="35" y="82" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5.5" fontStyle="italic" fill="#5a1a1a">Der Militärbefehlshaber</text>
          {/* clou en haut */}
          <circle cx="35" cy="4" r="1.4" fill="#5a4028" />
        </g>

        {/* Affiche Vichy « Travail Famille Patrie » avec francisque */}
        <g transform="translate(920,320)">
          <rect x="0" y="0" width="60" height="76" fill="#e8dfc8" stroke="#5a4028" strokeWidth="1.5" />
          <rect x="0" y="0" width="60" height="76" fill="#5a3818" opacity="0.2" filter="url(#pa-grain)" />
          <text x="30" y="16" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fontWeight="800" fill="#5a1a10">TRAVAIL</text>
          <text x="30" y="30" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fontWeight="800" fill="#5a1a10">FAMILLE</text>
          <text x="30" y="44" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fontWeight="800" fill="#5a1a10">PATRIE</text>
          <path d="M12 52 h36" stroke="#5a1a10" strokeWidth="0.6" />
          {/* francisque stylisée (double hache) */}
          <path d="M30 60 v10 M22 64 l8 -4 l8 4 l-4 3 l-4 -2 l-4 2 z" stroke="#5a1a10" strokeWidth="0.8" fill="#5a1a10" />
          <circle cx="30" cy="4" r="1.4" fill="#5a4028" />
        </g>
      </PLayer>

      {/* ═══ SOL (rue pavée + trottoir) ═══ */}
      <PLayer depth={2.5}>
        <rect y="440" width="1000" height="120" fill="url(#pa-street)" />
        {/* mottling humide */}
        <rect y="440" width="1000" height="120" fill="#241608" opacity="0.35" filter="url(#pa-mottle)" />
        {/* trottoir */}
        <rect y="440" width="1000" height="22" fill="url(#pa-trottoir)" />
        <path d="M0 460 h1000" stroke="#2a1a10" strokeWidth="1.6" />
        <path d="M0 442 h1000" stroke="#f0d8b0" strokeWidth="0.6" opacity="0.35" />
        {/* pavés avec joints marqués */}
        {[...Array(6)].map((_, r) => [...Array(20)].map((_, c) => (
          <g key={`p-${r}-${c}`}>
            <rect x={c * 50 + (r % 2 ? 25 : 0)} y={470 + r * 16} width="46" height="12" rx="1.4"
              fill={r % 3 === 0 ? "#4c4238" : (r % 3 === 1 ? "#3a3428" : "#5a5044")} opacity="0.75" />
            {/* petit reflet chaque 3 pavés */}
            {(r + c) % 3 === 0 && (
              <rect x={c * 50 + (r % 2 ? 26 : 1)} y={471 + r * 16} width="14" height="2" fill="#8a7860" opacity="0.4" />
            )}
          </g>
        )))}
        {/* flaques d'eau qui reflètent le ciel */}
        <ellipse cx="380" cy="522" rx="34" ry="4" fill="#8a988a" opacity="0.4" />
        <ellipse cx="380" cy="521" rx="28" ry="2.5" fill="#c8d0c0" opacity="0.3" />
        <ellipse cx="670" cy="540" rx="26" ry="3" fill="#8a988a" opacity="0.35" />
      </PLayer>

      {/* ═══ ARCADE + MARCHAND ═══ */}
      <PLayer depth={3}>
        <g transform="translate(120,320)">
          {/* ombre projetée à l'intérieur de l'arche */}
          <path d="M-70 130 L-70 30 Q0 -30 70 30 L70 130 Z" fill="#4a4038" stroke="#2a2418" strokeWidth="2" />
          <path d="M-70 130 L-70 30 Q0 -30 70 30 L70 130 Z" fill="#1a1408" opacity="0.35" filter="url(#pa-grain)" />
          <path d="M-60 130 L-60 40 Q0 -18 60 40 L60 130 Z" fill="#1a1408" />
          {/* pierre de l'arche : bloc en clef de voûte */}
          <path d="M-6 -30 L6 -30 L4 -22 L-4 -22 Z" fill="#7a6a58" stroke="#3a2818" strokeWidth="0.8" />
          {/* rebord de l'étal, bois usé */}
          <rect x="-46" y="106" width="92" height="6" fill="#5a3820" stroke="#2a1608" strokeWidth="0.8" />
          {/* couverture pliée */}
          {!acheteFait && (
            <g>
              <path d="M-30 88 L30 88 L34 108 Q0 116 -34 108 Z" fill="#6a2c1a" stroke="#2a1008" strokeWidth="1.5" />
              <path d="M-30 88 L30 88 L34 108 Q0 116 -34 108 Z" fill="#3a1408" opacity="0.4" filter="url(#pa-grain)" />
              {/* plis et rayures écossaises */}
              <path d="M-24 94 h48 M-26 100 h50 M-28 106 h54" stroke="#3a1408" strokeWidth="0.6" opacity="0.7" />
              <path d="M-16 88 v22 M-2 88 v24 M12 88 v22" stroke="#3a1408" strokeWidth="0.5" opacity="0.6" />
              {/* étiquette prix */}
              <rect x="6" y="94" width="18" height="10" fill="#e8dfc8" stroke="#5a4028" strokeWidth="0.4" transform="rotate(-6 15 99)" />
              <text x="15" y="101" textAnchor="middle" fontSize="5" fontFamily="Georgia,serif" fill="#3a1408" transform="rotate(-6 15 99)">50F</text>
            </g>
          )}
          {/* savons rares et boîtes rangées */}
          <rect x="-52" y="98" width="18" height="10" fill="#8a6540" stroke="#3a2418" strokeWidth="0.8" />
          <rect x="-52" y="98" width="18" height="3" fill="#a88558" />
          <rect x="36" y="98" width="16" height="10" fill="#6a5040" stroke="#3a2418" strokeWidth="0.8" />
          <rect x="36" y="98" width="16" height="3" fill="#8a7050" />
          {/* petits paquets suspendus au-dessus */}
          <path d="M-30 40 v6 M-14 40 v10 M2 40 v6 M18 40 v10" stroke="#3a2818" strokeWidth="0.6" />
          <rect x="-32" y="46" width="6" height="8" fill="#c8b090" stroke="#3a2818" strokeWidth="0.4" />
          <rect x="-16" y="50" width="6" height="8" fill="#a89078" stroke="#3a2818" strokeWidth="0.4" />
          <rect x="0" y="46" width="6" height="8" fill="#c8b090" stroke="#3a2818" strokeWidth="0.4" />

          {/* ─── MARCHAND ─── */}
          <g transform="translate(-18,60)">
            <clipPath id="pa-marchand"><rect x="-60" y="-60" width="120" height="120" /></clipPath>
            <g clipPath="url(#pa-marchand)">
              {/* visage creusé (1944, la ration), manteau brun usé, la main sur la couverture */}
              <Figure x={0} y={72} s={0.62} skin="#d4a47c" hair="#3a2818" look="short" mustache mood="vexe" hat="flatcap" hatColor="#5a5048"
                garment="coat" coat="#5a3820" pants="#3a2818" shoes="#1a1008" arms={[{ a1: 10, a2: 6 }, { a1: 40, a2: -20 }]} />
            </g>
          </g>
        </g>
      </PLayer>

      {/* ═══ PATROUILLE ALLEMANDE + PANZER + MARTHE + ANACHRO ═══ */}
      <PLayer depth={3}>
        {/* Panzer qui remonte l'avenue */}
        <g opacity="0.92">
          <animateTransform attributeName="transform" type="translate"
            values="1100,0; -240,0" dur="55s" repeatCount="indefinite" />
          <g transform="translate(0,458)">
            {/* ombre sous les chenilles */}
            <ellipse cx="0" cy="22" rx="90" ry="6" fill="#0a0604" opacity="0.55" />
            {/* corps (caisse) */}
            <path d="M-72 0 L72 0 L60 -22 L-56 -22 Z" fill="#5a5040" stroke="#2a2418" strokeWidth="1.2" />
            <path d="M-72 0 L72 0 L60 -22 L-56 -22 Z" fill="#241408" opacity="0.25" filter="url(#pa-grain)" />
            {/* tourelle */}
            <path d="M-24 -22 L26 -22 L22 -38 L-20 -38 Z" fill="#4a4030" stroke="#2a2418" strokeWidth="1" />
            <rect x="-4" y="-40" width="8" height="4" fill="#2a2418" />
            {/* canon long */}
            <path d="M22 -34 L92 -30 L92 -26 L22 -30 Z" fill="#3a3428" stroke="#1a1408" strokeWidth="0.8" />
            <circle cx="92" cy="-28" r="2.4" fill="#0a0604" />
            {/* croix de fer + numero */}
            <path d="M-40 -14 h10 M-35 -19 v10" stroke="#efe6d2" strokeWidth="1.4" />
            <text x="-16" y="-8" fontSize="6" fontFamily="ui-monospace,monospace" fill="#e8dfc8" fontWeight="700">213</text>
            {/* chenille superieure + patin */}
            <rect x="-76" y="0" width="152" height="6" fill="#2a2418" />
            <rect x="-76" y="14" width="152" height="6" fill="#2a2418" />
            {[-60, -40, -20, 0, 20, 40, 60].map((x, i) => (
              <g key={i}>
                <circle cx={x} cy="10" r="7" fill="#3a3428" stroke="#1a1408" strokeWidth="1" />
                <circle cx={x} cy="10" r="2.4" fill="#5a5040" />
              </g>
            ))}
            {/* segments de chenille */}
            {[...Array(20)].map((_, i) => (
              <rect key={`c-${i}`} x={-76 + i * 8} y="15" width="6" height="4" fill="#1a1408" />
            ))}
            {/* poussière */}
            <g opacity="0.6">
              {[-70, -50, -30].map((x, i) => (
                <circle key={i} cx={x} cy="22" r="5" fill="#9a8878">
                  <animate attributeName="opacity" values="0.5;0.15;0.5" dur={`${1 + i * 0.3}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </g>
            {/* fumée */}
            <g opacity="0.6">
              <animateTransform attributeName="transform" type="translate"
                values="0,0; -6,-4; 0,0" dur="3s" repeatCount="indefinite" />
              <circle cx="-70" cy="-16" r="6" fill="#7a7060" opacity="0.5" />
              <circle cx="-78" cy="-24" r="8" fill="#6a6050" opacity="0.4" />
              <circle cx="-84" cy="-32" r="9" fill="#5a5040" opacity="0.3" />
            </g>
          </g>
        </g>

        {/* Patrouille allemande */}
        <g transform="translate(560,410)">
          {[[0, 0], [40, 4]].map(([dx, dy], si) => (
            <g key={si} transform={`translate(${dx},${dy})`}>
              {/* casque d'acier, uniforme feldgrau, fusil à l'épaule */}
              <Figure x={0} y={93} s={0.78} skin="#dfa888" hair="#8a7050" look="short" mood="vexe" hat="wwhelm" hatColor="#4a5040"
                garment="jacket" coat="#5a6050" trim="#2a2018" pants="#4a5040" shoes="#0a0806"
                arms={[{ a1: 10, a2: 6 }, { a1: 24, a2: -40 }]}
                behind={<path d="M12 -110 L30 -40" stroke="#3a2818" strokeWidth="3.6" strokeLinecap="round" />} />
            </g>
          ))}
        </g>

        {/* MARTHE */}
        <g transform="translate(400,430)">
          {/* ombre */}
          <ellipse cx="0" cy="102" rx="18" ry="3" fill="#0a0604" opacity="0.55" />
          {/* robe noire, châle, panier au bras (un oignon qui dépasse) */}
          <Figure x={0} y={102} s={0.96} skin="#e4c4a4" hair="#a8a49c" look="bun" wrinkles mood="vexe"
            garment="dress" coat="#1a1a1a" pants="#3a3028" shoes="#0a0a0a" belt={false} arms={[{ a1: 10, a2: 6 }, { a1: 20, a2: -30 }]}>
            <path d="M-25 -89 Q0 -95 25 -89 L23 -66 Q0 -74 -23 -66 Z" fill="#0a0a0a" />
            <path d="M-23 -68 q23 -7 46 0" stroke="#3a3030" strokeWidth="0.6" fill="none" opacity="0.7" />
            <g transform="translate(22,-42)">
              <ellipse cx="0" cy="0" rx="10" ry="7" fill="#8a6540" stroke="#3a2418" strokeWidth="1" />
              <path d="M-7 -2 q7 -8 14 0" stroke="#3a2418" strokeWidth="1.6" fill="none" />
              <ellipse cx="-2" cy="-6" rx="3" ry="2.4" fill="#e8d090" stroke="#5a4028" strokeWidth="0.4" />
            </g>
          </Figure>
        </g>

        {/* ANACHRONISME : télécommande TV moderne dans le caniveau */}
        {!made.includes("telecommande") && mode !== "jeu2" && (
          <g transform="translate(750,520) rotate(20)">
            <ellipse cx="0" cy="24" rx="10" ry="1.6" fill="#0a0604" opacity="0.55" />
            <rect x={-9} y={-24} width={18} height={48} rx={3} fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
            <rect x={-6} y={-20} width={12} height={5} rx={0.6} fill="#2a3050" />
            <circle cx={-4} cy={-10} r={2} fill="#c8382e" />
            <circle cx={4} cy={-10} r={2} fill="#5a5a5a" />
            <circle cx={0} cy={-4} r={2.5} fill="#5eff9e" />
            {[[-4, 2], [4, 2], [-4, 8], [4, 8], [-4, 14], [4, 14], [0, 20]].map(([bx, by], i) => (
              <rect key={i} x={bx - 2} y={by - 1.4} width={4} height={2.8} rx={0.6} fill="#5a5a5a" />
            ))}
            <text x={0} y={-15.5} textAnchor="middle" fontSize="2.4" fontFamily="ui-monospace,monospace" fill="#c8d4e2">TV42</text>
          </g>
        )}
      </PLayer>

      {/* léger voile de grain sur toute l'image */}
      <rect width="1000" height="560" fill="#1a1410" opacity="0.09" style={{ pointerEvents: "none" }} />

      {/* ═══ zones cliquables (positions inchangées) ═══ */}
      <Hotspot cx={102} cy={380} r={54} label="marchand clandestin (sous l'arcade)" reveal={reveal} onClick={() => action("marchand")} />
      {!acheteFait && (
        <Hotspot cx={110} cy={418} r={26} label="grosse couverture" item="couverture" reveal={reveal} onClick={() => collect("couverture")} />
      )}
      <Hotspot cx={600} cy={438} r={44} label="patrouille allemande" reveal={reveal} onClick={() => action("patrouille")} />
      <Hotspot cx={55} cy={345} r={30} label="affiche VERBOTEN" reveal={reveal} onClick={() => action("affiche")} />
      <Hotspot cx={950} cy={358} r={26} label="affiche de Vichy" reveal={reveal} onClick={() => action("affiche")} />
      {mode !== "jeu2" && (
        <Hotspot cx={750} cy={520} r={24} label="… quelque chose ne va pas ici" item="telecommande" reveal={reveal} onClick={() => collect("telecommande")} />
      )}
    </svg>
  );
}
