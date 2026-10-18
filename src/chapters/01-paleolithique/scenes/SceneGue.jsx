import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 1 — Tableau : LE GUÉ DE LA RIVIÈRE
   ------------------------------------------------------------
   La rivière s'élargit ici, avec une série de grosses pierres
   qui affleurent : le passage à gué pour rejoindre l'autre rive
   (forêt profonde). Poissons visibles, un pêcheur sur la berge.
   ============================================================ */

export default function SceneGue({ collect, action, reveal, made = [], inv = [] }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="gu-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a8b8c8" /><stop offset="60%" stopColor="#c0c8b8" /><stop offset="100%" stopColor="#d0d0a8" /></linearGradient>
        <linearGradient id="gu-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7a9db4" /><stop offset="50%" stopColor="#5480a0" /><stop offset="100%" stopColor="#2a4868" /></linearGradient>
        <linearGradient id="gu-rive" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6a4830" /><stop offset="100%" stopColor="#2a1a10" /></linearGradient>
        <radialGradient id="gu-stone" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="#9a8878" /><stop offset="70%" stopColor="#6a5848" /><stop offset="100%" stopColor="#3a2818" /></radialGradient>
        <filter id="gu-shimmer"><feTurbulence type="turbulence" baseFrequency="0.9" numOctaves="1" seed="5" /><feColorMatrix values="0 0 0 0 0.9 0 0 0 0 0.95 0 0 0 0 1 0 0 0 0.25 0" /></filter>
      </defs>

      <PLayer depth={4}>
        <rect width="1000" height="240" fill="url(#gu-sky)" />
        {/* nuages doux */}
        {[[120, 60, 60], [420, 80, 80], [780, 55, 50]].map(([x, y, r], i) => (
          <g key={i} opacity="0.55">
            <ellipse cx={x} cy={y} rx={r} ry="10" fill="#f0e8d0" />
            <ellipse cx={x - 20} cy={y + 4} rx={r - 20} ry="7" fill="#f0e8d0" />
          </g>
        ))}
        {/* collines vertes lointaines derrière la forêt */}
        <path d="M0 240 L0 200 Q200 170 400 195 Q600 175 800 200 Q900 190 1000 200 L1000 240 Z" fill="#5a6a48" opacity="0.65" />
        {/* forêt profonde sur l'autre rive */}
        <path d="M0 240 L0 180 Q100 140 200 180 Q300 130 400 170 Q500 120 600 160 Q700 140 800 170 Q900 130 1000 180 L1000 240 Z" fill="#2a3818" opacity="0.92" />
        {/* silhouettes de bouleaux améliorées, écorce blanche typique */}
        {[80, 180, 320, 460, 620, 780, 920].map((x, i) => {
          const h = 60 + (i % 3) * 14;
          const foliageR = 22 + (i % 2) * 4;
          return (
            <g key={i} transform={`translate(${x},240)`}>
              {/* ombre au sol */}
              <ellipse cx="0" cy="2" rx="8" ry="2" fill="#0a0604" opacity="0.5" />
              {/* tronc bouleau avec base plus large */}
              <path d={`M-3 0 L-2 -${h} L2 -${h} L3 0 Z`} fill="#f0e8d8" stroke="#8a7860" strokeWidth="0.3" />
              {/* marques noires horizontales typiques du bouleau */}
              <path d={`M-2 -${Math.floor(h*0.2)} h4 M-2 -${Math.floor(h*0.4)} h4 M-2 -${Math.floor(h*0.6)} h4 M-2 -${Math.floor(h*0.8)} h4`} stroke="#2a1e10" strokeWidth="1.2" strokeLinecap="round" />
              {/* petits nœuds */}
              <circle cx="0" cy={-Math.floor(h*0.5)} r="0.8" fill="#3a2818" />
              {/* feuillage — 3 lobes empilés pour volume */}
              <ellipse cx="-4" cy={-(h + 6)} rx={foliageR - 4} ry={foliageR - 8} fill="#3a5820" opacity="0.85" />
              <ellipse cx="4" cy={-(h + 4)} rx={foliageR - 6} ry={foliageR - 10} fill="#4a6828" opacity="0.85" />
              <ellipse cx="0" cy={-(h + 14)} rx={foliageR - 2} ry={foliageR - 6} fill="#4a6a2a" opacity="0.9" />
              {/* mini touches jaunes = feuilles au soleil */}
              <circle cx={-6} cy={-(h + 12)} r="1.5" fill="#c8c058" opacity="0.7" />
              <circle cx={4} cy={-(h + 8)} r="1.2" fill="#b0a848" opacity="0.6" />
            </g>
          );
        })}
        {/* vol de petits oiseaux au loin en V */}
        <g opacity="0.6" transform="translate(560,120)">
          <path d="M0 0 q-3 -3 -6 0 M0 0 q3 -3 6 0" stroke="#3a2818" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M20 8 q-3 -3 -6 0 M20 8 q3 -3 6 0" stroke="#3a2818" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M-20 6 q-3 -3 -6 0 M-20 6 q3 -3 6 0" stroke="#3a2818" strokeWidth="1" fill="none" strokeLinecap="round" />
        </g>
      </PLayer>

      <PLayer depth={3}>
        {/* la rivière large — bande d'eau bleu-gris qui traverse */}
        <rect y="240" width="1000" height="200" fill="url(#gu-water)" />
        {/* voile de miroitement (turbulence) */}
        <rect y="240" width="1000" height="200" filter="url(#gu-shimmer)" opacity="0.7" />
        {/* reflets de forêt sur l'eau (bandes sombres inversées) */}
        <path d="M0 240 L1000 240 L1000 280 L0 280 Z" fill="#2a3818" opacity="0.35" />
        <path d="M80 250 q40 8 80 0 q40 -6 80 4 M320 260 q40 6 80 -2 M580 254 q40 8 80 0 q40 -8 80 2" stroke="#1a2810" strokeWidth="2" fill="none" opacity="0.5" />

        {/* remous, courants — étalés jusqu'à la rive droite */}
        {[260, 300, 340, 380, 420].map((y, i) => (
          <path key={i} d={`M0 ${y} q80 -${4 + i} 160 0 q80 ${4 + i} 160 0 q80 -${4 + i} 160 0 q80 ${4 + i} 160 0 q80 -${4 + i} 160 0 q80 ${4 + i} 160 0 q40 -${4 + i} 80 0`} stroke="#b0d0e8" strokeWidth="1.2" fill="none" opacity={0.4 + (i % 2) * 0.15} />
        ))}
        {/* reflets brillants animés (soleil sur l'eau) */}
        {[[120, 320], [340, 300], [560, 340], [780, 310], [880, 360], [220, 350], [660, 380], [460, 370]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="18" ry="2.5" fill="#f8f8e8" opacity="0.55" style={{ animation: `float ${2.5 + (i % 3) * 0.3}s ease-in-out infinite` }} />
        ))}

        {/* 5 GROSSES PIERRES du gué en zigzag — mieux modelées */}
        {[[120, 380], [260, 340], [420, 380], [580, 340], [740, 380]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            {/* ombre + halo mouillé autour de la pierre */}
            <ellipse cx="0" cy="14" rx="52" ry="8" fill="#0a1420" opacity="0.55" />
            <ellipse cx="0" cy="10" rx="46" ry="5" fill="#2a4058" opacity="0.5" />
            {/* corps pierre avec gradient radial */}
            <path d="M-40 0 Q-30 -22 0 -24 Q30 -22 40 0 L36 8 Q0 12 -36 8 Z" fill="url(#gu-stone)" stroke="#1a1408" strokeWidth="1.5" />
            {/* strates */}
            <path d="M-32 -6 q30 -8 62 -2 M-30 4 q28 -4 58 -2" stroke="#3a2818" strokeWidth="0.6" fill="none" opacity="0.7" />
            {/* reflet lumineux au sommet */}
            <ellipse cx="-8" cy="-12" rx="14" ry="6" fill="#c8b8a0" opacity="0.55" />
            {/* mousses vertes au niveau de l'eau */}
            <path d="M-38 4 q4 -4 8 0 q-4 4 -8 0 Z" fill="#5a7030" opacity="0.85" />
            <path d="M30 6 q4 -4 8 0 q-4 4 -8 0 Z" fill="#5a7030" opacity="0.8" />
            {/* petites gouttes qui coulent */}
            <circle cx="-20" cy="8" r="0.8" fill="#b0d0e8" opacity="0.7" />
            <circle cx="20" cy="10" r="0.8" fill="#b0d0e8" opacity="0.7" />
          </g>
        ))}

        {/* Rochers isolés côté droit (hors du chemin du gué) —
            purement décoratifs, plus petits, pour que la rivière ne s'arrête
            pas visuellement à la 5e pierre. */}
        {[[860, 350, 0.65], [920, 400, 0.55], [820, 415, 0.5]].map(([x, y, s], i) => (
          <g key={`side-${i}`} transform={`translate(${x},${y}) scale(${s})`}>
            <ellipse cx="0" cy="12" rx="46" ry="6" fill="#0a1420" opacity="0.5" />
            <path d="M-32 0 Q-24 -18 0 -20 Q26 -18 32 0 L28 6 Q0 10 -30 6 Z" fill="url(#gu-stone)" stroke="#1a1408" strokeWidth="1.2" />
            <ellipse cx="-6" cy="-10" rx="10" ry="4" fill="#c8b8a0" opacity="0.45" />
            <path d="M-28 4 q3 -3 6 0 q-3 3 -6 0 Z" fill="#5a7030" opacity="0.75" />
          </g>
        ))}

        {/* Poissons dans l'eau — ils nagent horizontalement autour de
            leur position moyenne, avec un peu de derive verticale. Sens
            alterne pour la variete (certains vers la droite, d'autres
            vers la gauche via scale X). */}
        {[[180, 400, 1], [360, 420, -1], [500, 400, 1], [660, 420, -1], [820, 400, 1], [910, 385, -1]].map(([x, y, dir], i) => (
          <g key={i}>
            <animateTransform attributeName="transform" type="translate"
              values={dir === 1
                ? `${x - 40},${y}; ${x + 40},${y + 2}; ${x - 40},${y}`
                : `${x + 40},${y}; ${x - 40},${y - 2}; ${x + 40},${y}`}
              dur={`${8 + (i % 3) * 2}s`} repeatCount="indefinite" />
            <g transform={dir === -1 ? "scale(-1,1)" : undefined}>
              {/* corps */}
              <path d="M0 0 Q-10 -4 -16 0 Q-10 4 0 0 L10 -3 L14 -7 L10 -3 L14 3 L10 3 L0 0 Z" fill="#5a8098" stroke="#1a2838" strokeWidth="0.7" />
              {/* ventre clair */}
              <path d="M-14 1 Q-10 3 0 0" stroke="#c0e0f0" strokeWidth="1" fill="none" opacity="0.7" />
              {/* écailles */}
              <path d="M-10 -1 q2 -1 4 0 M-6 0 q2 -1 4 0 M-2 -1 q2 -1 4 0" stroke="#3a5060" strokeWidth="0.4" fill="none" opacity="0.7" />
              {/* œil vif */}
              <circle cx="-10" cy="-1" r="1.4" fill="#0a0806" />
              <circle cx="-10.4" cy="-1.4" r="0.5" fill="#f8f8e8" />
              {/* nageoire dorsale */}
              <path d="M-6 -3 q3 -3 6 0" stroke="#3a5060" strokeWidth="0.6" fill="#4a6878" />
            </g>
          </g>
        ))}

        {/* Libellules qui volent au-dessus */}
        {[[280, 268, 0.4], [700, 290, 0.6], [520, 258, 0.5]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${s})`} style={{ animation: `float ${1.6 + i * 0.2}s ease-in-out infinite` }}>
            {/* ailes translucides */}
            <ellipse cx="-6" cy="-1" rx="6" ry="2" fill="#b0d0e8" opacity="0.55" />
            <ellipse cx="6" cy="-1" rx="6" ry="2" fill="#b0d0e8" opacity="0.55" />
            <ellipse cx="-4" cy="2" rx="5" ry="1.5" fill="#b0d0e8" opacity="0.5" />
            <ellipse cx="4" cy="2" rx="5" ry="1.5" fill="#b0d0e8" opacity="0.5" />
            {/* corps allongé bleu iridescent */}
            <rect x="-8" y="0" width="16" height="1.4" rx="0.7" fill="#3a6a90" />
            <rect x="-8" y="-0.4" width="16" height="0.6" fill="#78b0d8" />
          </g>
        ))}
      </PLayer>

      <PLayer depth={2}>
        {/* berge proche (au sol) */}
        <path d="M0 440 L1000 440 L1000 560 L0 560 Z" fill="url(#gu-rive)" />
        {/* clapotis sur la berge : ligne mouillée plus claire */}
        <path d="M0 442 q100 -3 200 0 q100 3 200 0 q100 -3 200 0 q100 3 200 0 q100 -3 200 0 L1000 448 L0 448 Z" fill="#8ab0c8" opacity="0.4" />
        {/* petites vaguelettes qui viennent lécher la berge */}
        <path d="M0 446 q40 -1.5 80 0 q40 1.5 80 0 q40 -1.5 80 0 q40 1.5 80 0 q40 -1.5 80 0 q40 1.5 80 0 q40 -1.5 80 0 q40 1.5 80 0 q40 -1.5 80 0 q40 1.5 80 0 q40 -1.5 80 0 q40 1.5 80 0" stroke="#c0d8e8" strokeWidth="0.8" fill="none" opacity="0.6" />
        {/* sable/limon plus clair devant la ligne d'eau */}
        <path d="M0 448 L1000 448 L1000 470 L0 470 Z" fill="#8a6a48" opacity="0.5" />
        {/* cailloux au bord — plus variés, plus texturés */}
        {[[80, 460, 1], [140, 466, 0.7], [220, 470, 1.1], [560, 470, 0.9], [620, 466, 0.6], [720, 460, 1.2], [880, 468, 0.8], [940, 462, 0.7]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
            <ellipse cx="0" cy="4" rx="14" ry="2" fill="#0a0604" opacity="0.5" />
            <path d="M-14 0 q4 -8 14 -8 q10 0 14 6 q0 6 -14 6 q-14 0 -14 -4 Z" fill="#7a6858" stroke="#2a1810" strokeWidth="0.6" />
            <ellipse cx="-4" cy="-3" rx="6" ry="2" fill="#a08878" opacity="0.6" />
          </g>
        ))}
        {/* petites brindilles échouées */}
        <path d="M310 462 l30 4 M660 464 l24 -2" stroke="#3a2818" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
        {/* herbes hautes qui cadrent — plus fournies, avec fleurs */}
        <g opacity="0.9">
          <path d="M40 560 q10 -32 4 -48 M62 560 q3 -26 14 -40 M28 560 q-5 -22 10 -34 M78 560 q-2 -20 8 -30" stroke="#3a4a20" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M940 560 q-8 -30 -2 -46 M962 560 q4 -26 12 -38 M920 560 q-4 -20 6 -32 M978 560 q-5 -18 4 -28" stroke="#3a4a20" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M400 560 q-5 -16 2 -26 M540 560 q5 -16 -1 -24" stroke="#4a5828" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* petites fleurs sauvages jaunes */}
          <circle cx="46" cy="514" r="2" fill="#f0d048" />
          <circle cx="76" cy="522" r="2" fill="#f0d048" />
          <circle cx="944" cy="516" r="2" fill="#f0d048" />
          <circle cx="974" cy="524" r="2" fill="#f0d048" />
        </g>
        {/* touffes de roseaux entre les herbes */}
        <g opacity="0.85">
          <path d="M120 470 l-3 -30 M124 470 l1 -34 M128 470 l4 -32" stroke="#7a6a30" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="122" cy="438" rx="2" ry="6" fill="#4a3818" />
          <ellipse cx="126" cy="434" rx="2" ry="6" fill="#4a3818" />
          <path d="M820 468 l-3 -28 M824 468 l1 -32 M828 468 l4 -30" stroke="#7a6a30" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="822" cy="438" rx="2" ry="6" fill="#4a3818" />
          <ellipse cx="826" cy="434" rx="2" ry="6" fill="#4a3818" />
        </g>
      </PLayer>

      <PLayer depth={1}>
        {/* Le PÊCHEUR ancestral sur la berge, canne en bois — mieux fini */}
        <g transform="translate(120,470)">
          <ellipse cx="0" cy="42" rx="30" ry="4" fill="#0a0604" opacity="0.55" />
          <Figure x={0} y={42} s={0.98} pose="ground" facing="right" skin="#c8946a" hair="#3a2418" look="bun" beard="short"
            garment="fur" coat="#9a6028" pants="#6a4020" bareArms arms={[{ a1: 14, a2: -16 }, { a1: 48, a2: 120 }]} />
          <path d="M48 -3 Q90 -60 130 -70 Q160 -60 155 -30" stroke="#5a3818" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </g>
        {/* Objets ephemere : disparaissent une fois ramassés */}
        {!inv.includes("escargot") && (
        <g transform="translate(680,528)">
          <ellipse cx="0" cy="0" rx="10" ry="7" fill="#8a6a48" stroke="#3a2818" strokeWidth="1" />
          <path d="M-2 -1 q3 -3 6 0 q-2 2 -6 0 Z" fill="#5a4028" opacity="0.7" />
          <path d="M-3 -2 q4 -4 8 0 q-3 3 -8 0 Z M-2 0 q3 -2 5 0 q-2 1.5 -5 0 Z" fill="none" stroke="#5a4028" strokeWidth="0.5" />
          <path d="M-10 3 Q-16 5 -18 3" stroke="#8a7060" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M-16 1 l-2 -3 M-14 2 l-2 -3" stroke="#5a4028" strokeWidth="0.5" strokeLinecap="round" />
        </g>
        )}
        {!inv.includes("fleur") && (
        <g transform="translate(340,540)">
          {[0, 72, 144, 216, 288].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            return <circle key={i} cx={Math.cos(rad) * 3} cy={Math.sin(rad) * 3} r="2.5" fill="#7fb0e0" />;
          })}
          <circle cx="0" cy="0" r="1.5" fill="#e0a848" />
          <path d="M0 3 L0 12" stroke="#3a5820" strokeWidth="1" />
        </g>
        )}
        {!inv.includes("caillou_rond") && (
        <g transform="translate(560,548)">
          <ellipse cx="0" cy="0" rx="8" ry="5" fill="#8a8078" stroke="#3a3028" strokeWidth="0.6" />
          <path d="M-3 -1 q4 -3 6 0" stroke="#5a5048" strokeWidth="0.5" fill="none" />
        </g>
        )}
      </PLayer>

      {/* ═══ zones cliquables ═══ */}
      <Hotspot cx={120} cy={450} r={40} label="le pêcheur" reveal={reveal} onClick={() => action("pecheur")} />
      <Hotspot cx={400} cy={370} r={80} label="traverser le gué (pierres)" reveal={reveal} onClick={() => action("traverser_gue")} />
      {[[180, 400], [360, 420], [500, 400], [660, 420], [820, 400], [910, 385]].map(([x, y], i) => (
        <Hotspot key={i} cx={x} cy={y} r={16} label="poisson dans l'eau" reveal={reveal} onClick={() => action("pecher")} />
      ))}
      <Hotspot cx={680} cy={528} r={18} label="escargot" item="escargot" reveal={reveal} onClick={() => collect("escargot")} />
      <Hotspot cx={340} cy={540} r={14} label="petite fleur" item="fleur" reveal={reveal} onClick={() => collect("fleur")} />
      <Hotspot cx={560} cy={548} r={14} label="joli caillou" item="caillou_rond" reveal={reveal} onClick={() => collect("caillou_rond")} />
    </svg>
  );
}
