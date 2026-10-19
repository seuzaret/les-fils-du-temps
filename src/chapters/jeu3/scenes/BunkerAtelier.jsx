import PnjRoom from "../PnjRoom.jsx";
import { PNJ_ROOMS } from "../pnj.js";
import { CeilingPipes, ConcretePanels, PerspFloor, Vignette } from "../bunkerKit.jsx";

/* ============================================================
   Atelier des Ingénieurs (niveau -1) — grande halle technique.
   Layout : établi long au fond, tuyauteries murales, ventilo
   qui tourne, générateur central en pièces détachées, tableau
   électrique à droite, rack d'outils au mur.
   ============================================================ */
export default function BunkerAtelier({ onGo, j3 }) {
  const bg = (
    <>
      <defs>
        <linearGradient id="atl-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2418" />
          <stop offset="100%" stopColor="#141008" />
        </linearGradient>
        <linearGradient id="atl-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2820" />
          <stop offset="100%" stopColor="#0a0604" />
        </linearGradient>
        <radialGradient id="atl-spark" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd870" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffd870" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="520" fill="url(#atl-wall)" />
      <ConcretePanels y0={50} y1={380} seed={64} opacity={1} />
      <rect y="380" width="1000" height="140" fill="url(#atl-floor)" />
      <PerspFloor y0={380} y1={520} step={80} rows={4} opacity={0.4} />
      <path d="M0 380 L1000 380" stroke="#0a0604" strokeWidth="1" />
      {/* Sol : dalles métalliques diamantées suggérées */}
      {[100, 220, 380, 500, 620, 780, 900].map((x, i) => (
        <path key={i} d={`M${x} 380 L${x + (x - 500) * 0.13} 520`} stroke="#0a0604" strokeWidth="0.7" opacity="0.55" />
      ))}
      <path d="M0 440 L1000 440" stroke="#0a0604" strokeWidth="0.7" opacity="0.55" />
      {/* Plafond avec poutres apparentes */}
      <rect x="0" y="0" width="1000" height="50" fill="#1a1408" />
      <CeilingPipes y={22} seed={69} />
      <path d="M0 50 L1000 50" stroke="#3a2010" strokeWidth="2" />
      {[100, 400, 700].map((x, i) => (
        <g key={i}>
          <rect x={x - 40} y="60" width="80" height="4" fill="#c8a848" opacity="0.7" />
          <rect x={x - 3} y="50" width="6" height="14" fill="#3a2010" />
        </g>
      ))}

      {/* TUYAUTERIES verticales à droite */}
      <g>
        <rect x="920" y="80" width="10" height="300" fill="#3a4048" stroke="#0a0806" strokeWidth="0.5" />
        <rect x="940" y="80" width="10" height="300" fill="#5a6270" stroke="#0a0806" strokeWidth="0.5" />
        <rect x="960" y="80" width="10" height="300" fill="#3a4048" stroke="#0a0806" strokeWidth="0.5" />
        {/* Valves */}
        {[130, 220, 310].map((y) => (
          <g key={y}>
            <circle cx="945" cy={y} r="7" fill="#c8a848" stroke="#1a0e08" strokeWidth="1" />
            <line x1="938" y1={y} x2="952" y2={y} stroke="#1a0e08" strokeWidth="0.8" />
            <line x1="945" y1={y - 7} x2="945" y2={y + 7} stroke="#1a0e08" strokeWidth="0.8" />
          </g>
        ))}
        {/* Étiquette "EAU / GAZ / AIR" */}
        {["EAU", "GAZ", "AIR"].map((t, i) => (
          <text key={t} x={925 + i * 20} y="76" fontSize="5" fontFamily="ui-monospace,monospace" fill="#c8a848">{t}</text>
        ))}
      </g>

      {/* ÉTABLI DE TRAVAIL long au fond */}
      <g transform="translate(120,320)">
        <rect x="0" y="0" width="640" height="24" fill="#5a4028" stroke="#1a0e08" strokeWidth="2" />
        <rect x="0" y="0" width="640" height="4" fill="#8a5030" />
        {/* Rangées d'outils suspendus au-dessus */}
        {[0, 60, 120, 180, 240, 480, 540, 600].map((dx, i) => (
          <g key={i} transform={`translate(${dx + 30},-30)`}>
            <line x1="0" y1="-8" x2="0" y2="26" stroke="#3a2010" strokeWidth="0.6" />
            <rect x="-4" y="-8" width="8" height="4" fill="#3a2010" />
            {i % 3 === 0 && (
              <path d="M-6 0 L6 0 L4 20 L-4 20 Z" fill="#8a5030" stroke="#1a0e08" strokeWidth="0.5" />
            )}
            {i % 3 === 1 && (
              <g>
                <rect x="-2" y="0" width="4" height="22" fill="#3a4048" stroke="#0a0806" strokeWidth="0.4" />
                <path d="M-6 20 L6 20 L4 26 L-4 26 Z" fill="#5a6270" />
              </g>
            )}
            {i % 3 === 2 && (
              <g>
                <path d="M-4 0 L4 0 L2 24 L-2 24 Z" fill="#c8a848" stroke="#1a0e08" strokeWidth="0.4" />
              </g>
            )}
          </g>
        ))}
        {/* Outils sur l'établi */}
        {[[40, "#8a5030"], [100, "#3a4048"], [160, "#5a6270"], [520, "#c8a848"], [580, "#3a4048"]].map(([x, c], i) => (
          <rect key={i} x={x} y="-16" width="14" height="14" fill={c} stroke="#1a0e08" strokeWidth="0.8" />
        ))}
      </g>

      {/* VENTILATEUR MURAL à gauche haut */}
      <g transform="translate(100,150)">
        <rect x="-40" y="-40" width="80" height="80" fill="#28303a" stroke="#0a0806" strokeWidth="2" />
        <circle r="32" fill="#141c26" />
        {/* Grille */}
        {[0, 30, 60, 90, 120, 150].map((a) => (
          <line key={a} x1={-32 * Math.cos((a * Math.PI) / 180)} y1={-32 * Math.sin((a * Math.PI) / 180)}
            x2={32 * Math.cos((a * Math.PI) / 180)} y2={32 * Math.sin((a * Math.PI) / 180)} stroke="#3a4048" strokeWidth="0.6" />
        ))}
        {/* Pales */}
        <g style={{ transformOrigin: "0 0", animation: "atlSpin 3s linear infinite" }}>
          {[0, 90, 180, 270].map((a) => (
            <path key={a} d="M0 0 L18 -5 L26 0 L18 5 Z" fill="#5a6270" stroke="#0a0806" strokeWidth="0.5" transform={`rotate(${a})`} />
          ))}
        </g>
        <circle r="4" fill="#c8a848" stroke="#0a0806" strokeWidth="0.6" />
      </g>

      {/* GÉNÉRATEUR CENTRAL démonté (une pièce en cours de réparation au sol) */}
      <g transform="translate(500,360)">
        {/* Base cassée avec halo étincelles */}
        <circle r="60" fill="url(#atl-spark)">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <rect x="-40" y="-6" width="80" height="18" fill="#28303a" stroke="#0a0806" strokeWidth="1.5" />
        {/* Cylindre au centre */}
        <rect x="-16" y="-40" width="32" height="34" fill="#3a4048" stroke="#0a0806" strokeWidth="1" />
        <circle cx="0" cy="-22" r="8" fill="#5a6270" stroke="#0a0806" strokeWidth="0.8" />
        <circle cx="0" cy="-22" r="4" fill="#c8a848" />
        {/* Pièces détachées au sol autour */}
        {[[-60, 8], [-46, 16], [50, 14], [66, 6]].map(([dx, dy], i) => (
          <rect key={i} x={dx} y={dy} width="8" height="4" fill="#8a5030" stroke="#0a0806" strokeWidth="0.4" transform={`rotate(${i * 30} ${dx + 4} ${dy + 2})`} />
        ))}
        {/* Étincelles animées */}
        <g style={{ transformOrigin: "0 -30px", animation: "atlSparkFlick 0.3s steps(2) infinite" }}>
          <path d="M-14 -22 L-24 -32 M14 -22 L24 -32 M0 -40 L-6 -50" stroke="#ffd870" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
          <circle cx="-20" cy="-28" r="1.4" fill="#fff4a0" />
          <circle cx="22" cy="-28" r="1.4" fill="#fff4a0" />
        </g>
      </g>

      {/* TABLEAU ÉLECTRIQUE à droite haut */}
      <g transform="translate(830,140)">
        <rect x="-50" y="-40" width="100" height="130" fill="#28303a" stroke="#0a0806" strokeWidth="2" />
        <rect x="-46" y="-36" width="92" height="122" fill="#141c26" />
        {/* Rangées d'interrupteurs */}
        {[0, 1, 2, 3, 4].map((r) => (
          <g key={r} transform={`translate(0,${-24 + r * 22})`}>
            {[-30, -10, 10, 30].map((dx, k) => (
              <g key={k}>
                <rect x={dx - 5} y="-6" width="10" height="12" fill="#5a6270" stroke="#0a0806" strokeWidth="0.4" />
                <rect x={dx - 2} y={r % 2 === 0 ? "-4" : "0"} width="4" height="4" fill={k === (r + 1) % 4 ? "#e83820" : "#5eff9e"} />
              </g>
            ))}
          </g>
        ))}
        {/* Étiquette "TABLEAU 4A" */}
        <text x="0" y="102" textAnchor="middle" fontSize="6" fontFamily="ui-monospace,monospace" fill="#c8a848">TABLEAU 4A</text>
      </g>

      <style>{`
        @keyframes atlSpin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        @keyframes atlSparkFlick { 0% { opacity: 1; } 50% { opacity: 0.15; } 100% { opacity: 1; } }
      `}</style>
      <Vignette id="atelier-vig" strength={0.45} />
    </>
  );
  return <PnjRoom titre="⚙ ATELIER DES INGÉNIEURS — NIVEAU -1" bg={bg} pnjList={PNJ_ROOMS.atelier} j3={j3} onGo={onGo} />;
}
