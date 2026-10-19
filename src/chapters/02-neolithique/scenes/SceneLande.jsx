import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";
import { Clouds, Speckle } from "../../../engine/scenery.jsx";

/* ============================================================
   CHAPITRE 2 — Tableau : la lande aux mégalithes (Bretagne)
   Peinture fine — ciel breton changeant, mer grise au loin,
   granit patiné et lichen, ajoncs. À trouver ici : le silex
   (pour graver la dalle), la grande dalle, et le clan.
   ============================================================ */

export default function SceneLande({ collect, action, reveal, made = [] }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ld-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a6376" />
          <stop offset="45%" stopColor="#8b95a0" />
          <stop offset="78%" stopColor="#c2c4be" />
          <stop offset="100%" stopColor="#dcdcd2" />
        </linearGradient>
        <linearGradient id="ld-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#93a0a6" /><stop offset="100%" stopColor="#6a787e" /></linearGradient>
        <linearGradient id="ld-land" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#787a50" /><stop offset="100%" stopColor="#4a4e34" /></linearGradient>
        <linearGradient id="ld-granite" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#b0aca2" /><stop offset="48%" stopColor="#86827a" /><stop offset="100%" stopColor="#5a564e" /></linearGradient>
        <filter id="ld-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="ld-mottle" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="ld-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="8" /></filter>
      </defs>

      {/* ═══ ciel breton, bas et mouvant ═══ */}
      <rect width="1000" height="560" fill="url(#ld-sky)" />
      {/* masses de nuages bas, ventrus, avec le dessous sombre */}
      <Clouds id="ld-cl1" seed={9} items={[[140, 80, 300], [470, 56, 360], [860, 92, 300], [320, 150, 200], [980, 170, 180]]} color="#9aa2aa" shadow="#5a6270" opacity="0.85" drift={30} />
      <Clouds id="ld-cl2" seed={13} items={[[100, 64, 200], [440, 40, 240], [820, 72, 220]]} color="#c8ccd0" opacity="0.55" drift={24} />
      {/* trouée de lumière pâle qui perce les nuages */}
      <path d="M660 40 L760 40 L840 250 L580 250 Z" fill="#f4f4e8" opacity="0.14" filter="url(#ld-blur)" />
      <ellipse cx="700" cy="150" rx="120" ry="66" fill="#f4f4e8" opacity="0.3" filter="url(#ld-blur)" />

      {/* ═══ couche lointaine : la mer grise ═══ */}
      <PLayer depth={1}>
        <rect y="250" width="1000" height="82" fill="url(#ld-sea)" />
        {/* reflet pâle de la trouée sur l'eau */}
        <path d="M660 254 L740 254 L770 330 L610 330 Z" fill="#e4e8e0" opacity="0.22" filter="url(#ld-blur)" />
        {[262, 284, 306, 322].map((y, i) => (
          <path key={i} d={`M-40 ${y} q120 ${i % 2 ? 4 : -4} 240 0 t240 0 t240 0 t240 0 t240 0`} stroke="#c4ccce" strokeWidth="1.5" fill="none" opacity="0.4" />
        ))}
        {/* côte lointaine et falaises */}
        <path d="M-40 266 L-40 250 L20 246 L60 240 L92 242 L130 236 L168 240 L200 238 L236 246 L262 244 L300 252 L340 258 L380 264 L400 266 Z" fill="#7a8288" />
        <path d="M20 246 L60 240 L92 242 L130 236 L168 240" stroke="#a8aeb0" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M-40 266 L400 266" stroke="#e8ece8" strokeWidth="1.4" opacity="0.5" />
        {/* écume qui frappe les îlots */}
        <path d="M150 320 q30 -6 60 0 M876 316 q24 -5 48 0" stroke="#eef2f0" strokeWidth="2" fill="none" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.2;0.7" dur="3s" repeatCount="indefinite" />
        </path>
        {/* îlots de granit dans la mer */}
        <ellipse cx="180" cy="322" rx="30" ry="9" fill="#5a564e" />
        <ellipse cx="900" cy="318" rx="24" ry="8" fill="#5a564e" />
      </PLayer>

      {/* ═══ couche intermédiaire : lande + alignements de menhirs ═══ */}
      <PLayer depth={2}>
        <path d="M0 330 Q250 300 500 328 Q750 356 1000 322 L1000 440 L0 440 Z" fill="url(#ld-land)" />
        <path d="M0 330 Q250 300 500 328 Q750 356 1000 322 L1000 440 L0 440 Z" fill="#2c3018" opacity="0.3" filter="url(#ld-grain)" />
        <Speckle seed={81} x0={0} x1={1000} y0={326} y1={440} n={420} colors={["#8a5a7a", "#a8a050", "#4a5030", "#6a7a38", "#c89a40"]} r={[0.6, 1.6]} opacity={0.6} />
        {/* alignement (clin d'œil à Carnac) : menhirs qui rapetissent au loin */}
        {[[110, 336, 48], [178, 340, 62], [252, 338, 54], [332, 342, 66], [906, 330, 52], [846, 336, 42], [792, 340, 34]].map(([x, y, h], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y + 2} rx={12} ry={4} fill="#2c2c22" opacity="0.4" />
            <path d={`M${x - 9} ${y} Q${x - 11} ${y - h * 0.6} ${x - 4} ${y - h} Q${x + 2} ${y - h - 4} ${x + 6} ${y - h * 0.9} Q${x + 11} ${y - h * 0.5} ${x + 9} ${y} Z`} fill="url(#ld-granite)" />
            <path d={`M${x - 4} ${y - 6} Q${x - 6} ${y - h * 0.6} ${x - 1} ${y - h * 0.9}`} stroke="#c8c4bc" strokeWidth="1.3" fill="none" opacity="0.5" />
            <ellipse cx={x - 2} cy={y - h * 0.45} rx="4" ry="3" fill="#7a8a3a" opacity="0.4" />
          </g>
        ))}
        {/* ajoncs et bruyère */}
        {[80, 420, 600, 780, 960].map((x, i) => (
          <g key={i}>
            <path d={`M${x} 430 q-5 -16 -10 -20 M${x} 430 q0 -18 6 -22 M${x} 430 q6 -14 12 -16`} stroke="#6a7238" strokeWidth="2.4" fill="none" opacity="0.85" />
            <circle cx={x - 6} cy={412} r="2" fill="#c86a9a" opacity="0.6" />
          </g>
        ))}
      </PLayer>

      {/* ═══ premier plan : le chantier du mégalithe ═══ */}
      <PLayer depth={3}>
        <path d="M0 560 L0 430 Q250 408 520 432 Q760 452 1000 428 L1000 560 Z" fill="url(#ld-land)" />
        <path d="M0 560 L0 430 Q250 408 520 432 Q760 452 1000 428 L1000 560 Z" fill="#20240f" opacity="0.32" filter="url(#ld-mottle)" />
        <ellipse cx="500" cy="500" rx="420" ry="50" fill="#33381f" opacity="0.4" />
        <Speckle seed={83} x0={0} x1={1000} y0={436} y1={560} n={360} colors={["#8a5a7a", "#a8a050", "#2a3018", "#6a7a38"]} r={[0.8, 2.2]} opacity={0.55} />
        {/* touffes de bruyère et d'ajonc en fleur */}
        {[[60, 470, "#b06a9a"], [150, 530, "#e8c040"], [250, 520, "#b06a9a"], [600, 540, "#e8c040"], [880, 526, "#b06a9a"], [960, 480, "#e8c040"], [30, 540, "#e8c040"]].map(([x, y, f], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y} rx="22" ry="8" fill="#3a4224" />
            <ellipse cx={x - 4} cy={y - 4} rx="14" ry="6" fill="#4a5430" />
            {Array.from({ length: 7 }).map((_, k) => <circle key={k} cx={x - 14 + k * 4.6} cy={y - 6 + (k % 2) * 3} r="1.8" fill={f} opacity="0.9" />)}
          </g>
        ))}

        {/* LA GRANDE DALLE couchée sur des rondins — tant que le mégalithe
            n'est pas encore dressé */}
        {!made.includes("msg_megalithe") && (
        <g transform="translate(360,470)">
          {[-70, -20, 30, 80].map((dx, i) => (
            <g key={i} transform={`translate(${dx},44)`}>
              <ellipse cx="0" cy="0" rx="10" ry="10" fill="#6e4c2e" />
              <ellipse cx="0" cy="0" rx="10" ry="10" fill="none" stroke="#4a3018" strokeWidth="2" />
              <ellipse cx="0" cy="0" rx="4" ry="4" fill="#5c3f26" />
            </g>
          ))}
          <path d="M-110 34 L96 10 Q118 8 120 24 L118 34 Q116 44 96 44 L-108 44 Q-118 44 -110 34 Z" fill="url(#ld-granite)" />
          <path d="M-110 34 L96 10 Q118 8 120 24 L118 34 Q116 44 96 44 L-108 44 Q-118 44 -110 34 Z" fill="#2a2620" opacity="0.3" filter="url(#ld-grain)" />
          <path d="M-100 22 L96 4" stroke="#c8c4bc" strokeWidth="2" opacity="0.5" />
          <path d="M-60 24 q4 8 -2 16 M20 18 q5 8 -1 18" stroke="#4a463e" strokeWidth="1.6" fill="none" opacity="0.5" />
          {/* lichen sur la dalle */}
          <ellipse cx="-40" cy="26" rx="12" ry="4" fill="#8a9a48" opacity="0.5" />
          <ellipse cx="60" cy="18" rx="8" ry="3" fill="#7a8a3a" opacity="0.5" />
          {/* cordes prêtes */}
          <path d="M110 18 Q170 -10 240 -30 M108 26 Q168 6 236 -10" stroke="#8a6a42" strokeWidth="3" fill="none" opacity="0.85" />
        </g>
        )}

        {/* SILEX à graver, posé sur une pierre plate */}
        <g transform="translate(520,516)">
          <ellipse cx="0" cy="8" rx="26" ry="8" fill="#20240f" opacity="0.4" />
          <ellipse cx="0" cy="2" rx="22" ry="9" fill="#7a766c" />
          <path d="M-16 0 q16 -6 32 -1" stroke="#a8a49a" strokeWidth="1.4" fill="none" opacity="0.6" />
          {/* l'éclat de silex */}
          <path d="M-6 -4 L14 -12 L22 -2 L4 4 Z" fill="#8d8d97" stroke="#dfe3ec" strokeWidth="1" />
          <path d="M-2 -5 l14 -5" stroke="#eef0f6" strokeWidth="1.2" opacity="0.8" />
        </g>

        {/* LE CLAN qui tire (villageois arc-boutés) — seulement pendant le chantier */}
        {!made.includes("msg_megalithe") && (
        <g transform="translate(660,462)">
          {[0, 34, 66, 98].map((dx, i) => (
            <g key={i} transform={`translate(${dx},${(i % 2) * 6})`}>
              <ellipse cx="0" cy="34" rx="12" ry="4" fill="#20240f" opacity="0.4" />
              {/* penché en avant, la corde tirée par-dessus l'épaule */}
              <g transform="rotate(9 0 34)">
                <Figure x={0} y={34} s={0.675} stride={7} facing="right" skin="#8a5c3c"
                  look={["short", "braids", "mid", "bun"][i]} hair={["#2a1a10", "#3a2414", "#1e140c", "#4a3020"][i]} beard={i === 0 || i === 2 ? "short" : false}
                  garment="tunic" coat={i % 2 ? "#7a4f34" : "#6a4a30"} pants="#4a3a26" shoes="#3a2a18" mood="colere"
                  arms={[{ a1: 70, a2: 30 }, { a1: -40, a2: -60 }]} />
              </g>
            </g>
          ))}
          <path d="M-14 -6 L128 2" stroke="#8a6a42" strokeWidth="3" fill="none" opacity="0.85" />
        </g>
        )}

        {/* ═══ LE MÉGALITHE DRESSÉ (résultat de msg_megalithe) : le chantier
            a disparu, la pierre gravée se tient droite, baignée par la
            trouée de lumière — spirales façon Gavrinis. ═══ */}
        {made.includes("msg_megalithe") && (
        <g transform="translate(452,492)" style={{ animation: "fadein 1s ease-out" }}>
          <ellipse cx="-6" cy="4" rx="66" ry="14" fill="#20240f" opacity="0.5" />
          <path d="M-46 2 Q-56 -70 -46 -156 Q-40 -232 -14 -252 Q12 -258 30 -234 Q48 -170 44 -84 Q48 -24 40 2 Z" fill="url(#ld-granite)" />
          <path d="M-46 2 Q-56 -70 -46 -156 Q-40 -232 -14 -252 Q12 -258 30 -234 Q48 -170 44 -84 Q48 -24 40 2 Z" fill="#2a2620" opacity="0.28" filter="url(#ld-grain)" />
          {/* arête éclairée (côté trouée de lumière), arête d'ombre à gauche */}
          <path d="M40 0 Q48 -70 44 -150 Q40 -226 20 -248" stroke="#eceae0" strokeWidth="3" fill="none" opacity="0.45" />
          <path d="M-44 -4 Q-54 -74 -44 -156" stroke="#3a3830" strokeWidth="2.5" fill="none" opacity="0.5" />
          {/* SPIRALES gravées + rehaut clair dans le creux */}
          <g fill="none" strokeLinecap="round">
            <path d="M-8 -70 a6 6 0 1 1 -9 3 a13 13 0 1 1 18 -5 a20 20 0 1 1 -28 8" stroke="#3f3c34" strokeWidth="3" opacity="0.8" />
            <path d="M6 -152 a5 5 0 1 1 -7 3 a11 11 0 1 1 15 -4 a17 17 0 1 1 -23 7" stroke="#3f3c34" strokeWidth="3" opacity="0.8" />
            <path d="M-8 -72 a6 6 0 1 1 -9 3 a13 13 0 1 1 18 -5" stroke="#b8b4aa" strokeWidth="1" opacity="0.5" />
            <path d="M6 -154 a5 5 0 1 1 -7 3 a11 11 0 1 1 15 -4" stroke="#b8b4aa" strokeWidth="1" opacity="0.5" />
          </g>
          {/* chevrons gravés entre les spirales */}
          <path d="M-24 -110 l14 -8 l14 8 M-24 -101 l14 -8 l14 8" stroke="#3f3c34" strokeWidth="2.3" fill="none" opacity="0.7" strokeLinecap="round" />
          <path d="M-22 -202 l12 -7 l12 7 M-22 -194 l12 -7 l12 7" stroke="#3f3c34" strokeWidth="2.1" fill="none" opacity="0.7" strokeLinecap="round" />
          {/* lichen patiné */}
          <ellipse cx="-30" cy="-40" rx="12" ry="6" fill="#8a9a48" opacity="0.45" />
          <ellipse cx="26" cy="-182" rx="9" ry="5" fill="#7a8a3a" opacity="0.45" />
          <ellipse cx="0" cy="-244" rx="8" ry="4" fill="#9aaa58" opacity="0.4" />
        </g>
        )}

        {/* un menhir déjà dressé, premier plan, patiné et couvert de lichen */}
        <g transform="translate(120,430)">
          <ellipse cx="0" cy="88" rx="34" ry="10" fill="#20240f" opacity="0.5" />
          <path d="M-24 88 Q-30 20 -14 -30 Q-6 -58 6 -56 Q22 -52 24 10 Q28 60 22 88 Z" fill="url(#ld-granite)" />
          <path d="M-24 88 Q-30 20 -14 -30 Q-6 -58 6 -56 Q22 -52 24 10 Q28 60 22 88 Z" fill="#2a2620" opacity="0.3" filter="url(#ld-grain)" />
          <path d="M-10 78 Q-16 20 -6 -40" stroke="#c8c4bc" strokeWidth="2" fill="none" opacity="0.45" />
          <path d="M8 60 q6 8 0 20 M-4 30 q-6 6 -1 16" stroke="#4a463e" strokeWidth="1.6" fill="none" opacity="0.5" />
          <ellipse cx="-6" cy="20" rx="9" ry="5" fill="#7a8a3a" opacity="0.6" />
          <ellipse cx="10" cy="52" rx="6" ry="4" fill="#8a9a48" opacity="0.5" />
          <ellipse cx="2" cy="-30" rx="7" ry="4" fill="#9aaa58" opacity="0.4" />
        </g>

        {/* herbes qui cadrent le bas */}
        <g opacity="0.9">
          <path d="M-4 560 q10 -28 4 -44 M18 560 q3 -22 14 -36 M960 560 q-6 -24 2 -38 M984 560 q4 -20 12 -30" stroke="#20240f" strokeWidth="4" fill="none" />
        </g>
      </PLayer>

      {/* voile de grain global */}
      <rect width="1000" height="560" fill="#1a1c14" opacity="0.06" style={{ pointerEvents: "none" }} />

      {/* zones cliquables */}
      {/* le « ? » du chef de clan : pourquoi dresser une pierre énorme ? */}
      {!made.includes("msg_megalithe") && (
        <>
          <g transform="translate(712,326)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
          </g>
          <Hotspot cx={732} cy={336} r={28} label="parler au chef du clan" reveal={reveal} onClick={() => action("chef")} />
        </>
      )}

      <Hotspot cx={520} cy={514} r={40} label="silex" item="silex" reveal={reveal} onClick={() => collect("silex")} />
      {!made.includes("msg_megalithe") && <Hotspot cx={360} cy={500} r={70} label="dalle" item="dalle" reveal={reveal} onClick={() => collect("dalle")} />}
      {!made.includes("msg_megalithe") && <Hotspot cx={724} cy={435} r={94} label="le clan" item="clan" reveal={reveal} onClick={() => collect("clan")} />}
    </svg>
  );
}
