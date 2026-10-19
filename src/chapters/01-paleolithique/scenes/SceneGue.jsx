import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";
import { Clouds, Grass, Haze, Reflect, Ridge, Rock, Speckle, TreeLine } from "../../../engine/scenery.jsx";

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
        <linearGradient id="gu-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6e96c0" /><stop offset="55%" stopColor="#a8c0d4" /><stop offset="100%" stopColor="#e4e4d0" /></linearGradient>
        <linearGradient id="gu-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8aa8b8" /><stop offset="35%" stopColor="#5a8aa4" /><stop offset="100%" stopColor="#24425e" /></linearGradient>
        <linearGradient id="gu-rive" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6a4830" /><stop offset="100%" stopColor="#2a1a10" /></linearGradient>
        <radialGradient id="gu-stone" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="#9a8878" /><stop offset="70%" stopColor="#6a5848" /><stop offset="100%" stopColor="#3a2818" /></radialGradient>
        <filter id="gu-shimmer"><feTurbulence type="turbulence" baseFrequency="0.9" numOctaves="1" seed="5" /><feColorMatrix values="0 0 0 0 0.9 0 0 0 0 0.95 0 0 0 0 1 0 0 0 0.25 0" /></filter>
      </defs>

      {/* ═══ ciel de fin de matinée, nuages, montagnes bleues ═══ */}
      <rect x="-40" y="-20" width="1080" height="300" fill="url(#gu-sky)" />
      <Clouds id="gu-cl" seed={4} items={[[140, 46, 150], [470, 30, 190], [800, 58, 140], [640, 92, 90]]} color="#fbf6ea" shadow="#c8ccd0" opacity="0.8" drift={20} />
      <PLayer depth={1}>
        <Ridge id="gu-r1" seed={14} y={204} amp={104} rough={0.62} fill="#7088a8" lit="#a8bcd4" light={-1} snow="#eef2f6" snowLine={132} />
        <Haze id="gu-h1" y0={160} y1={222} color="#dce4e8" opacity={0.45} />
        <Ridge id="gu-r2" seed={23} y={222} amp={40} fill="#6a8466" lit="#87a07a" light={-1} />
        {/* forêt profonde sur l'autre rive : conifères au fond, bouleaux devant */}
        <TreeLine seed={5} y={232} n={52} h={[22, 44]} kinds={["conifer"]} colors={["#2a4030", "#304a34", "#24382a"]} light={-1} />
        <TreeLine seed={9} y={240} n={13} h={[44, 74]} kinds={["birch", "birch", "leafy"]} colors={["#5a7a32", "#6a8a3a", "#4a6a2a"]} light={-1} />
        {/* l'autre rive : graviers et herbes au pied des arbres */}
        <path d="M-40 236 Q200 232 420 238 Q640 234 1040 238 L1040 250 L-40 250 Z" fill="#7a7258" />
        <path d="M-40 246 Q300 242 620 247 Q820 244 1040 246 L1040 250 L-40 250 Z" fill="#5a5444" />
        {/* vol de petits oiseaux au loin en V */}
        <g opacity="0.6" transform="translate(560,120)">
          <path d="M0 0 q-3 -3 -6 0 M0 0 q3 -3 6 0" stroke="#3a2818" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M20 8 q-3 -3 -6 0 M20 8 q3 -3 6 0" stroke="#3a2818" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M-20 6 q-3 -3 -6 0 M-20 6 q3 -3 6 0" stroke="#3a2818" strokeWidth="1" fill="none" strokeLinecap="round" />
        </g>
      </PLayer>

      <PLayer depth={1.5}>
        {/* la rivière large — bande d'eau bleu-gris qui traverse */}
        <rect x="-40" y="248" width="1080" height="200" fill="url(#gu-water)" />
        <Reflect id="gu-ref" axisY={249} opacity={0.5} blur={3}>
          <TreeLine seed={5} y={232} n={52} h={[22, 44]} kinds={["conifer"]} colors={["#2a4030", "#304a34", "#24382a"]} light={-1} />
          <TreeLine seed={9} y={240} n={13} h={[44, 74]} kinds={["birch", "birch", "leafy"]} colors={["#5a7a32", "#6a8a3a", "#4a6a2a"]} light={-1} />
        </Reflect>
        <rect x="-40" y="248" width="1080" height="4" fill="#c8d8e0" opacity="0.5" />
        {/* voile de miroitement (turbulence) */}
        <rect x="-40" y="248" width="1080" height="200" filter="url(#gu-shimmer)" opacity="0.5" />
        {/* reflets de forêt sur l'eau (bandes sombres inversées) */}


        {/* remous, courants — étalés jusqu'à la rive droite */}
        {[260, 300, 340, 380, 420].map((y, i) => (
          <path key={i} d={`M0 ${y} q80 -${4 + i} 160 0 q80 ${4 + i} 160 0 q80 -${4 + i} 160 0 q80 ${4 + i} 160 0 q80 -${4 + i} 160 0 q80 ${4 + i} 160 0 q40 -${4 + i} 80 0`} stroke="#b0d0e8" strokeWidth="1.2" fill="none" opacity={0.4 + (i % 2) * 0.15} />
        ))}
        {/* reflets brillants animés (soleil sur l'eau) */}
        {[[120, 320], [340, 300], [560, 340], [780, 310], [880, 360], [220, 350], [660, 380], [460, 370]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="18" ry="2.5" fill="#f8f8e8" opacity="0.55" style={{ animation: `float ${2.5 + (i % 3) * 0.3}s ease-in-out infinite` }} />
        ))}

        {/* 5 GROSSES PIERRES du gué en zigzag : plus petites au loin, écume au pied */}
        {[[120, 384, 1.0], [260, 344, 0.82], [420, 384, 1.04], [580, 344, 0.84], [740, 384, 0.98]].map(([x, y, k], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y + 4} rx={56 * k} ry={9 * k} fill="#0a1420" opacity="0.45" />
            <Rock x={x} y={y} w={84 * k} h={30 * k} color={["#8a7c6c", "#7a7064", "#867a6a", "#7c7266", "#8a7e70"][i]} light={-1} seed={i * 7 + 3} moss="#5a7030" />
            <path d={`M${x - 46 * k} ${y + 2} q${12 * k} -4 ${24 * k} 0 q${12 * k} 4 ${24 * k} 0 q${12 * k} -4 ${24 * k} 0 q${12 * k} 4 ${22 * k} 0`} stroke="#e8f4fa" strokeWidth="2" fill="none" opacity="0.65">
              <animate attributeName="opacity" values="0.65;0.25;0.65" dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" />
            </path>
            <path d={`M${x + 40 * k} ${y + 3} q${16 * k} 2 ${30 * k} 8`} stroke="#d8ecf4" strokeWidth="1.4" fill="none" opacity="0.5" />
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

      <PLayer depth={2.5}>
        {/* berge proche (au sol) */}
        <path d="M0 440 L1000 440 L1000 560 L0 560 Z" fill="url(#gu-rive)" />
        {/* clapotis sur la berge : ligne mouillée plus claire */}
        <path d="M0 442 q100 -3 200 0 q100 3 200 0 q100 -3 200 0 q100 3 200 0 q100 -3 200 0 L1000 448 L0 448 Z" fill="#8ab0c8" opacity="0.4" />
        {/* petites vaguelettes qui viennent lécher la berge */}
        <path d="M0 446 q40 -1.5 80 0 q40 1.5 80 0 q40 -1.5 80 0 q40 1.5 80 0 q40 -1.5 80 0 q40 1.5 80 0 q40 -1.5 80 0 q40 1.5 80 0 q40 -1.5 80 0 q40 1.5 80 0 q40 -1.5 80 0 q40 1.5 80 0" stroke="#c0d8e8" strokeWidth="0.8" fill="none" opacity="0.6" />
        {/* sable/limon plus clair devant la ligne d'eau */}
        <path d="M0 448 L1000 448 L1000 470 L0 470 Z" fill="#8a6a48" opacity="0.5" />
        {/* grain du sol, galets, herbes */}
        <Speckle seed={3} x0={0} x1={1000} y0={452} y1={560} n={260} colors={["#3a2414", "#9a7a58", "#5a3e26", "#b8a080"]} opacity={0.5} />
        <path d="M-10 500 Q250 488 520 500 Q760 510 1010 494 L1010 560 L-10 560 Z" fill="#2a1a10" opacity="0.35" />
        {[[260, 486, 1], [470, 494, 2], [640, 480, 3], [790, 500, 4], [900, 486, 5], [190, 520, 6]].map(([x, y, sd]) => (
          <Grass key={sd} x={x} y={y} seed={sd} color="#5a6a2a" s={0.9} flower={sd % 2 ? "#f0d048" : null} />
        ))}
        {/* bois flotté échoué */}
        <g transform="translate(780,478) rotate(-6)">
          <path d="M-60 0 Q-20 -8 40 -4 L64 -10 L60 -4 L40 2 Q-20 6 -60 6 Z" fill="#a89478" stroke="#5a4a38" strokeWidth="1" />
          <path d="M-50 1 Q0 -4 40 -1" stroke="#7a6a58" strokeWidth="1" fill="none" />
          <ellipse cx="-60" cy="3" rx="3" ry="4" fill="#8a7860" stroke="#5a4a38" strokeWidth="0.8" />
        </g>
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

      <PLayer depth={3}>
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
