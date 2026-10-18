import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 5 — Tableau : le moulin à papier (extérieur)
   Peinture fine — au bord de la rivière : un MOULIN À EAU dont
   la roue tourne (elle actionne les maillets qui broient les
   chiffons). Le papetier travaille DANS le moulin, sous la grande
   arche de son atelier, avec sa CUVE et ses feuilles au séchoir.
   Sur le chemin, un CHIFFONNIER crie sa marchandise, sa hotte
   pleine de vieux chiffons.
   On ramasse les chiffons, on les broie dans la cuve → du PAPIER
   (la recette venue de Chine, bien moins cher que le parchemin).
   ============================================================ */

export default function SceneMoulin({ collect, action, reveal, made = [], mode = "jeu1" }) {
  const papier = made.includes("papier");
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="mo-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8fb0cc" /><stop offset="55%" stopColor="#c2d2d8" /><stop offset="100%" stopColor="#e6e2c8" /></linearGradient>
        <linearGradient id="mo-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6a94a0" /><stop offset="100%" stopColor="#3e6270" /></linearGradient>
        <linearGradient id="mo-stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9a9080" /><stop offset="100%" stopColor="#6a6052" /></linearGradient>
        <linearGradient id="mo-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a6238" /><stop offset="100%" stopColor="#5a3f24" /></linearGradient>
        <linearGradient id="mo-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9a8a5e" /><stop offset="100%" stopColor="#5e5030" /></linearGradient>
        <filter id="mo-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="mo-mottle" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* ═══ ciel ═══ */}
      <rect width="1000" height="560" fill="url(#mo-sky)" />
      {[[200, 90, 130], [560, 66, 160], [760, 116, 100]].map(([x, y, w], i) => (
        <ellipse key={i} cx={x} cy={y} rx={w} ry={13} fill="#f2f2e8" opacity="0.55" />
      ))}
      <circle cx="130" cy="100" r="30" fill="#fff4d0" opacity="0.85" />

      {/* ═══ couche lointaine : collines, arbres, LE MOULIN ═══ */}
      <PLayer depth={1}>
        <path d="M0 300 Q250 280 500 292 Q750 304 1000 286 L1000 360 L0 360 Z" fill="#8a9a6a" />
        <path d="M0 330 Q300 314 620 326 Q820 334 1000 322 L1000 380 L0 380 Z" fill="#79895c" />
        {[[70, 322], [250, 314], [980, 316]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <rect x="-4" y="-4" width="8" height="26" fill="#6a4c2e" />
            <circle cx="0" cy="-18" r="22" fill="#5a7a44" /><circle cx="-14" cy="-8" r="16" fill="#658149" /><circle cx="14" cy="-8" r="16" fill="#557040" />
          </g>
        ))}

        {/* ═══ LE MOULIN À PAPIER : bâtiment de pierre + étage à colombages,
            avec une GRANDE ARCHE ouverte (l'atelier) où travaille le papetier ═══ */}
        <g transform="translate(650,300)">
          {/* corps de pierre */}
          <rect x="-120" y="-10" width="240" height="172" fill="url(#mo-stone)" />
          <rect x="-120" y="-10" width="240" height="172" fill="#2c2418" opacity="0.2" filter="url(#mo-grain)" />
          {/* étage à colombages */}
          <rect x="-120" y="-72" width="240" height="62" fill="url(#mo-wood)" />
          <path d="M-120 -42 h240 M-60 -72 v62 M0 -72 v62 M60 -72 v62 M-120 -72 l60 62 M60 -72 l60 62 M-60 -72 l60 62 M0 -72 l60 62" stroke="#4a3218" strokeWidth="3" opacity="0.5" />
          {/* toit */}
          <path d="M-138 -72 L0 -134 L138 -72 Z" fill="#7a4632" />
          <path d="M-138 -72 L0 -134" stroke="#5a3020" strokeWidth="3" opacity="0.6" />
          <rect x="-14" y="-116" width="28" height="20" fill="#3a2c1c" />
          {/* petites fenêtres de l'étage */}
          {[-86, 74].map((x, i) => <rect key={i} x={x} y="-58" width="24" height="30" rx="2" fill="#2c2418" />)}
          {/* LA GRANDE ARCHE de l'atelier (sombre : on y voit travailler) */}
          <path d="M-72 162 L-72 60 Q0 8 72 60 L72 162 Z" fill="#241c14" />
          <path d="M-72 162 L-72 60 Q0 8 72 60 L72 162 Z" fill="none" stroke="#4a3a28" strokeWidth="6" />
          {/* dans l'ombre de l'arche : étagère + rames de papier qui sèchent */}
          <g opacity="0.9">
            <rect x="-64" y="70" width="128" height="7" fill="#3a2c1c" />
            {[-52, -30, -8, 14, 36].map((x, i) => (
              <rect key={i} x={x} y="46" width="16" height="24" fill="#cabf9a" opacity="0.55" transform={`rotate(${i % 2 ? 2 : -2} ${x + 8} 58)`} />
            ))}
            {/* une corde de feuilles suspendues au fond */}
            <path d="M-60 96 q60 10 120 0" stroke="#4a3a28" strokeWidth="1.6" fill="none" />
            {[-44, -16, 12, 40].map((x, i) => <rect key={i} x={x} y="98" width="20" height="26" fill="#d8d0b6" opacity="0.5" />)}
          </g>
        </g>
      </PLayer>

      {/* ═══ couche intermédiaire : la rivière, LA ROUE, séchoir extérieur ═══ */}
      <PLayer depth={2}>
        {/* LA RIVIÈRE en travers */}
        <rect y="392" width="1000" height="72" fill="url(#mo-water)" />
        <rect y="394" width="1000" height="70" fill="#2a3e46" opacity="0.22" filter="url(#mo-mottle)" />
        {[406, 424, 444].map((y, i) => <path key={i} d={`M0 ${y} q120 -6 240 0 q120 6 240 0 q120 -6 240 0 q120 6 240 0`} stroke="#bcd2d4" strokeWidth="1.6" fill="none" opacity="0.4" />)}

        {/* LA ROUE À AUBES, accolée au flanc DROIT du moulin, dans la rivière.
            La rotation est appliquée à un <g> IMBRIQUÉ (contenu symétrique
            centré sur 0,0), autour de son propre centre (transform-box:fill-box)
            → elle tourne bien rond, sans vaciller. */}
        <g transform="translate(792,406)">
          {/* support + axe (fixes) */}
          <rect x="-6" y="-96" width="12" height="150" fill="#4a3218" />
          <circle cx="0" cy="0" r="10" fill="#3a2818" />
          <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "spin 10s linear infinite" }}>
            <circle cx="0" cy="0" r="84" fill="none" stroke="#6a4c2e" strokeWidth="10" />
            <circle cx="0" cy="0" r="56" fill="none" stroke="#5a3f24" strokeWidth="5" />
            {[...Array(12)].map((_, i) => (
              <g key={i} transform={`rotate(${i * 30})`}>
                <rect x="-3" y="-84" width="6" height="56" fill="#7a5636" />
                <path d="M-15 -88 h30 v-10 h-30 Z" fill="#6a4c2e" />
              </g>
            ))}
          </g>
          {/* éclaboussures en bas de la roue (fixes) */}
          <g style={{ animation: "glow 1.4s ease-in-out infinite" }}>
            <ellipse cx="0" cy="82" rx="30" ry="8" fill="#dfeef0" opacity="0.6" />
            <circle cx="-16" cy="74" r="3" fill="#eef6f6" opacity="0.7" /><circle cx="14" cy="78" r="2.4" fill="#eef6f6" opacity="0.7" />
          </g>
        </g>

        {/* SÉCHOIR extérieur : feuilles suspendues à une corde sous un auvent */}
        <g transform="translate(300,300)">
          <rect x="-120" y="-6" width="8" height="150" fill="#6a4c2e" /><rect x="108" y="-6" width="8" height="150" fill="#6a4c2e" />
          <path d="M-130 -6 L126 -6 L118 -26 L-122 -26 Z" fill="#8a5a34" />
          <path d="M-112 22 q120 18 220 0" stroke="#5a4630" strokeWidth="2" fill="none" />
          {[-92, -54, -16, 22, 60].map((x, i) => (
            <g key={i} transform={`translate(${x},24)`}>
              <rect x="-16" y="0" width="32" height="42" fill="#efe9d6" transform={`rotate(${i % 2 ? 2 : -2})`} />
              <rect x="-16" y="0" width="32" height="42" fill="#cabf9a" opacity="0.25" transform={`rotate(${i % 2 ? 2 : -2})`} />
              <circle cx="0" cy="0" r="2" fill="#5a4630" />
            </g>
          ))}
        </g>
      </PLayer>

      {/* ═══ premier plan : berge, la cuve + le papetier (dans l'arche), chiffonnier ═══ */}
      <PLayer depth={3}>
        <rect y="452" width="1000" height="108" fill="url(#mo-ground)" />
        <rect y="454" width="1000" height="106" fill="#2c2214" opacity="0.3" filter="url(#mo-mottle)" />
        <ellipse cx="500" cy="500" rx="460" ry="44" fill="#7a6844" opacity="0.25" />

        {/* LE PAPETIER dans l'atelier, qui plonge son tamis dans la CUVE */}
        <g transform="translate(590,470)">
          {/* le papetier, tablier de cuir */}
          <g transform="translate(-38,-6)">
            <ellipse cx="0" cy="46" rx="20" ry="6" fill="#160f08" opacity="0.4" />
            {/* penché vers la cuve, tablier de cuir, le tamis à bout de bras */}
            <g transform="rotate(10 0 42)">
              <Figure x={0} y={42} s={0.585} skin="#d4a474" hair="#5a3a20" look="short" beard="short" mood="content" hat="cap" hatColor="#e2d8c0"
                garment="tunic" coat="#7a6a50" apron="#8a5a34" pants="#5a4630" shoes="#3a2a18"
                arms={[{ a1: -40, a2: -80 }, { a1: 70, a2: 90 }]} />
            </g>
            <g transform="translate(42,2) rotate(12)">
              <rect x="-3" y="-14" width="30" height="20" rx="2" fill="#8a6a3a" />
              <rect x="1" y="-10" width="22" height="12" fill="#cabf90" />
              <path d="M1 -4 h22 M8 -10 v12 M15 -10 v12" stroke="#9a8a5a" strokeWidth="0.7" opacity="0.7" />
            </g>
          </g>
          {/* LA CUVE (grande) */}
          <g transform="translate(70,0)">
            <ellipse cx="0" cy="44" rx="58" ry="11" fill="#160f08" opacity="0.4" />
            <path d="M-46 -16 L46 -16 L38 40 L-38 40 Z" fill="url(#mo-wood)" />
            <path d="M-46 -16 L46 -16 L38 40 L-38 40 Z" fill="#2a1c10" opacity="0.22" filter="url(#mo-grain)" />
            <path d="M-26 -16 L-22 40 M0 -16 v56 M26 -16 L22 40" stroke="#4a3218" strokeWidth="1.4" opacity="0.5" />
            <path d="M-44 -3 L44 -3 M-41 20 L41 20" stroke="#3a2412" strokeWidth="3" />
            {/* surface d'eau + pâte de chiffon */}
            <ellipse cx="0" cy="-16" rx="45" ry="11" fill="#9aa29a" />
            <ellipse cx="0" cy="-16" rx="45" ry="11" fill="#d8dcd2" opacity="0.28" />
            {[[-20, -18], [8, -15], [24, -19], [-6, -14], [16, -18]].map(([x, y], i) => (
              <ellipse key={i} cx={x} cy={y} rx="4" ry="1.8" fill="#eef0e8" opacity="0.8" />
            ))}
          </g>
        </g>

        {/* LE CHIFFONNIER : hotte de chiffons sur le dos, main en porte-voix,
            il crie sa marchandise (à gauche, sur le chemin) */}
        <g transform="translate(150,486)">
          <ellipse cx="0" cy="40" rx="34" ry="9" fill="#160f08" opacity="0.4" />
          {/* tourné vers le chemin, une main en porte-voix ; hotte de chiffons, bâton */}
          <Figure x={0} y={40} s={0.6} facing="left" skin="#cc9c6c" hair="#4a3020" look="short" beard="stubble" mood="surpris"
            hood hoodColor="#7a3a2a" garment="tunic" coat="#6e5030" pants="#5a4030" shoes="#3a2818"
            arms={[{ a1: 100, a2: -110 }, { a1: 20, a2: 10 }]}
            behind={<g>
              <path d="M34 -76 L40 0" stroke="#5a3f24" strokeWidth="5" strokeLinecap="round" />
              <g transform="translate(14,-70) scale(1.4)">
                <path d="M-4 6 Q-8 -22 14 -26 Q34 -22 30 6 Z" fill="#9a6a3a" />
                <path d="M-2 -4 q16 5 30 0 M0 -14 q14 5 26 0" stroke="#6e4c24" strokeWidth="1.4" fill="none" opacity="0.6" />
                {[["#a8302a", 2, -24], ["#2a6a9a", 16, -28], ["#c8b060", 26, -22], ["#3a8a4a", 10, -22], ["#8a4a8a", 22, -14]].map(([c, x, y], i) => (
                  <path key={i} d={`M${x} ${y} q5 -6 10 0 q-2 5 -5 6 q-4 -1 -5 -6`} fill={c} />
                ))}
              </g>
            </g>}>
            <path d="M14 -90 L22 -54" stroke="#5a3a1e" strokeWidth="2.4" />
          </Figure>

          {/* la bulle « Chiffons ! » qui pulse */}
          <g transform="translate(-58,-52)" style={{ animation: "glow 1.8s ease-in-out infinite" }}>
            <rect x="-2" y="-16" width="70" height="26" rx="7" fill="#fbf6e8" />
            <path d="M34 10 l-6 12 l16 -6 Z" fill="#fbf6e8" />
            <text x="33" y="2" textAnchor="middle" fontSize="13" fill="#7a3020" fontFamily="Palatino, Georgia, serif" style={{ fontWeight: 700 }}>Chiffons !</text>
          </g>
        </g>

        {/* RÉSULTAT (papier) : une belle feuille blanche fraîchement formée,
            posée sur un feutre, qui « pop » et brille doucement */}
        {papier && (
          <g transform="translate(500,506)" style={{ animation: "fadein 1s ease-out" }}>
            <ellipse cx="0" cy="18" rx="34" ry="8" fill="#160f08" opacity="0.4" />
            <path d="M-30 14 L30 14 L26 6 L-26 6 Z" fill="#8a7a56" />
            <path d="M-28 8 L28 8 L24 0 L-24 0 Z" fill="#a89a72" />
            <g transform="rotate(-3)">
              <rect x="-26" y="-30" width="52" height="34" rx="1.5" fill="#f6f2e6" style={{ filter: "drop-shadow(0 0 7px #fff6d8)" }} />
              <rect x="-26" y="-30" width="52" height="34" rx="1.5" fill="none" stroke="#d8d0bc" strokeWidth="1" />
              <path d="M-18 -22 h36 M-18 -14 h30 M-18 -6 h36" stroke="#dfd8c4" strokeWidth="1.4" opacity="0.7" />
            </g>
          </g>
        )}
      </PLayer>

      {/* voile global chaud */}
      <rect width="1000" height="560" fill="#221a0c" opacity="0.05" style={{ pointerEvents: "none" }} />

      {/* ═══ zones cliquables ═══ */}
      {/* le « ? » du papetier : cache en jeu 2 */}
      {!papier && mode !== "jeu2" && (
        <>
          <g transform="translate(526,352)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
          </g>
          <Hotspot cx={548} cy={460} r={28} label="parler au papetier" reveal={reveal} onClick={() => action("papetier")} />
        </>
      )}

      {/* le chiffonnier (crie sa marchandise) et sa hotte de chiffons —
          zones séparées : cliquer l'homme = l'écouter ; la hotte = prendre */}
      <Hotspot cx={136} cy={480} r={22} label="le chiffonnier" reveal={reveal} onClick={() => action("chiffonnier")} />
      <Hotspot cx={184} cy={466} r={22} label="vieux chiffons de lin" item="chiffons" reveal={reveal} onClick={() => collect("chiffons")} />
      {/* la cuve du papetier (support : on y broie les chiffons) */}
      <Hotspot cx={660} cy={468} r={44} label="la cuve du papetier" item="cuve" reveal={reveal} onClick={() => collect("cuve")} />
          {/* AMBIANCE : petit vol d'oiseaux qui traverse le ciel */}
      <g opacity="0.75">
        <animateTransform attributeName="transform" type="translate"
          values="-40,0; 1050,-20" dur="28s" repeatCount="indefinite" />
        <path d="M0 130 q6 -8 12 0 q6 -8 12 0" stroke="#1a1408" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M28 142 q6 -8 12 0 q6 -8 12 0" stroke="#1a1408" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M54 128 q6 -8 12 0 q6 -8 12 0" stroke="#1a1408" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
</svg>
  );
}
