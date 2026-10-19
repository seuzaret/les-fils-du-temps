import PnjRoom from "../PnjRoom.jsx";
import { PNJ_ROOMS } from "../pnj.js";
import { CeilingPipes, ConcretePanels, PerspFloor, Vignette } from "../bunkerKit.jsx";

/* ============================================================
   Serres hydroponiques (niveau -2) — production alimentaire.
   Décor cyberpunk-agricole : rangées de tours hydroponiques
   avec plants verts, tubes à LEDs magenta (grow lights), cuves
   d'eau nutritive, tuyaux de circulation, monte-charge à
   cageots. Rangée du fond en perspective.
   ============================================================ */
export default function BunkerSerres({ onGo, j3 }) {
  const bg = (
    <>
      <defs>
        <linearGradient id="sr-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e2818" />
          <stop offset="100%" stopColor="#04120a" />
        </linearGradient>
        <linearGradient id="sr-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a3020" />
          <stop offset="100%" stopColor="#050a08" />
        </linearGradient>
        <radialGradient id="sr-grow" cx="50%" cy="0%" r="60%">
          <stop offset="0%" stopColor="#ff5cc8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ff5cc8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sr-tower" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8d4e2" />
          <stop offset="100%" stopColor="#5a6270" />
        </linearGradient>
        <linearGradient id="sr-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fd8ff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#3a80c8" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect width="1000" height="520" fill="url(#sr-wall)" />
      <ConcretePanels y0={50} y1={380} seed={79} opacity={0.6} />
      <rect y="380" width="1000" height="140" fill="url(#sr-floor)" />
      <PerspFloor y0={380} y1={520} step={80} rows={4} opacity={0.4} />
      <path d="M0 380 L1000 380" stroke="#050a08" strokeWidth="1" />
      {/* Perspective sol : dalles béton avec joints humides */}
      {[80, 240, 500, 760, 920].map((x, i) => (
        <path key={i} d={`M${x} 380 L${x + (x - 500) * 0.14} 520`} stroke="#050a08" strokeWidth="0.8" opacity="0.55" />
      ))}
      <path d="M0 440 L1000 440" stroke="#050a08" strokeWidth="0.6" opacity="0.5" />

      {/* PLAFOND — tuyauterie d'eau + condensation */}
      <rect x="0" y="0" width="1000" height="50" fill="#0a1810" />
      <CeilingPipes y={22} seed={84} />
      <path d="M0 20 L1000 20" stroke="#3a80c8" strokeWidth="5" opacity="0.85" />
      <path d="M0 30 L1000 30" stroke="#5a6270" strokeWidth="2" opacity="0.7" />
      <path d="M0 38 L1000 38" stroke="#5eff9e" strokeWidth="1" opacity="0.55" />
      {/* Attaches */}
      {[100, 320, 540, 760, 920].map((x, i) => (
        <rect key={i} x={x - 6} y="14" width="12" height="14" fill="#141c26" stroke="#0a0e14" strokeWidth="0.5" />
      ))}
      {/* Gouttes qui pendent (condensation) */}
      {[180, 380, 620, 820].map((x, i) => (
        <g key={i}>
          <line x1={x} y1="30" x2={x} y2="46" stroke="#7fd8ff" strokeWidth="0.6" opacity="0.5" />
          <ellipse cx={x} cy="48" rx="1.5" ry="2" fill="#7fd8ff" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </ellipse>
        </g>
      ))}

      {/* GROW LIGHTS suspendues (barres LED magenta au-dessus des tours) */}
      {[160, 380, 620, 820].map((x, i) => (
        <g key={i} transform={`translate(${x},60)`}>
          <line x1="0" y1="0" x2="0" y2="10" stroke="#3a4048" strokeWidth="1.5" />
          <rect x="-70" y="10" width="140" height="12" rx="2" fill="#28303a" stroke="#0a0e14" strokeWidth="1" />
          <rect x="-66" y="14" width="132" height="4" fill="#ff5cc8" opacity="0.9">
            <animate attributeName="opacity" values="0.6;1;0.7" dur={`${2.4 + i * 0.3}s`} repeatCount="indefinite" />
          </rect>
          <ellipse cx="0" cy="60" rx="90" ry="30" fill="url(#sr-grow)" />
        </g>
      ))}

      {/* TOURS HYDROPONIQUES — 4 tours verticales avec plants */}
      {[160, 380, 620, 820].map((x, i) => (
        <g key={i} transform={`translate(${x},100)`}>
          {/* Corps de la tour (colonne PVC) */}
          <rect x="-18" y="0" width="36" height="280" fill="url(#sr-tower)" stroke="#0a0e14" strokeWidth="1.5" />
          {/* Trous de plantation avec petits plants qui dépassent */}
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <g key={k} transform={`translate(0,${20 + k * 42})`}>
              {/* Alternance droite/gauche des plants */}
              <g transform={`translate(${k % 2 === 0 ? -18 : 18},0) scale(${k % 2 === 0 ? -1 : 1},1)`}>
                {/* Coupelle */}
                <ellipse cx="0" cy="0" rx="14" ry="4" fill="#3a2818" stroke="#0a0806" strokeWidth="0.6" />
                {/* Feuilles (petit buisson qui varie par index+tour) */}
                {[0, 1, 2].map((f) => (
                  <path key={f}
                    d={`M0 -2 Q${8 + f * 2} ${-10 - f * 2} ${14 + f * 2} ${-6 - f * 3}`}
                    stroke="#5eff9e" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity={0.85 - f * 0.15} />
                ))}
                {/* Fruit occasionnel (tomate) */}
                {(i + k) % 4 === 0 && (
                  <circle cx="8" cy="-6" r="3" fill="#e83820" stroke="#3a0000" strokeWidth="0.4" />
                )}
              </g>
            </g>
          ))}
          {/* Étiquette au pied */}
          <rect x="-14" y="284" width="28" height="12" fill="#e8dfc8" stroke="#3a2818" strokeWidth="0.6" />
          <text x="0" y="293" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fontWeight="800" fill="#0a0806">
            {["SAL", "TOM", "PAT", "CHM"][i]}·{i + 1}
          </text>
        </g>
      ))}

      {/* CUVES d'eau nutritive au pied des tours (arrière-plan bleu) */}
      {[160, 380, 620, 820].map((x, i) => (
        <g key={i} transform={`translate(${x},386)`}>
          <rect x="-40" y="0" width="80" height="22" fill="#141c26" stroke="#0a0e14" strokeWidth="1" />
          <rect x="-38" y="2" width="76" height="10" fill="url(#sr-water)" opacity="0.85" />
          {/* Petits bulles */}
          <circle cx="-18" cy="7" r="1" fill="#e8eef5" opacity="0.7">
            <animate attributeName="cy" values="9;3;9" dur={`${2 + i * 0.2}s`} repeatCount="indefinite" />
          </circle>
          <circle cx="10" cy="6" r="0.8" fill="#e8eef5" opacity="0.6">
            <animate attributeName="cy" values="9;3;9" dur={`${1.6 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* TUYAUX horizontaux qui relient les cuves */}
      <path d="M120 396 L860 396" stroke="#3a80c8" strokeWidth="3" opacity="0.8" />
      <path d="M120 396 L860 396" stroke="#7fd8ff" strokeWidth="1" opacity="0.55" />

      {/* MONTE-CHARGE À CAGEOTS à droite (destination inconnue selon Ru) */}
      <g transform="translate(920,140)">
        <rect x="-40" y="0" width="80" height="240" fill="#28303a" stroke="#0a0e14" strokeWidth="2" />
        <rect x="-36" y="4" width="72" height="232" fill="#141c26" />
        {/* Rails verticaux */}
        <line x1="-30" y1="4" x2="-30" y2="236" stroke="#5a6270" strokeWidth="1" />
        <line x1="30" y1="4" x2="30" y2="236" stroke="#5a6270" strokeWidth="1" />
        {/* Cageot en cours de montée */}
        <g transform="translate(0,80)" style={{ transformOrigin: "0 0", animation: "srHoist 6s ease-in-out infinite alternate" }}>
          <rect x="-26" y="0" width="52" height="24" fill="#5a3818" stroke="#0a0806" strokeWidth="1" />
          <line x1="-26" y1="12" x2="26" y2="12" stroke="#0a0806" strokeWidth="0.4" />
          <line x1="-14" y1="0" x2="-14" y2="24" stroke="#0a0806" strokeWidth="0.4" />
          <line x1="14" y1="0" x2="14" y2="24" stroke="#0a0806" strokeWidth="0.4" />
          {/* Petites feuilles qui dépassent */}
          <path d="M-14 -2 Q-8 -12 -2 -4 M4 -2 Q10 -14 16 -4" stroke="#5eff9e" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          {/* Câble vers le haut */}
          <line x1="0" y1="0" x2="0" y2="-80" stroke="#c8a848" strokeWidth="1" />
        </g>
        {/* Étiquette destination inconnue */}
        <rect x="-30" y="250" width="60" height="16" fill="#e8dfc8" stroke="#3a2818" strokeWidth="0.6" />
        <text x="0" y="260" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fontWeight="800" fill="#0a0806">MONTE-CHARGE</text>
        <text x="0" y="278" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#5eff9e">DEST : ??</text>
      </g>

      {/* PANNEAU DE CONTRÔLE des grow lights à gauche */}
      <g transform="translate(60,180)">
        <rect x="0" y="0" width="70" height="140" fill="#28303a" stroke="#0a0e14" strokeWidth="2" />
        <rect x="4" y="4" width="62" height="132" fill="#141c26" />
        {/* Écran vert */}
        <rect x="8" y="8" width="54" height="24" fill="#0a1810" stroke="#5eff9e" strokeWidth="1" />
        <text x="35" y="18" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="5" fill="#5eff9e">CYCLE</text>
        <text x="35" y="28" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fontWeight="800" fill="#ff5cc8">12H · ON</text>
        {/* Molettes */}
        {[0, 1, 2].map((r) => (
          [0, 1].map((c) => (
            <circle key={`${r}${c}`} cx={18 + c * 30} cy={48 + r * 26} r="7" fill="#3a4048" stroke="#0a0806" strokeWidth="0.6" />
          ))
        ))}
        {/* Étiquette */}
        <text x="35" y="132" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="5" fill="#c8a848">CTRL-HYDRO 3</text>
      </g>

      {/* Cageot de récolte au sol au premier plan */}
      <g transform="translate(370,440)">
        <rect x="0" y="0" width="90" height="34" fill="#5a3818" stroke="#0a0806" strokeWidth="1" />
        <line x1="0" y1="16" x2="90" y2="16" stroke="#0a0806" strokeWidth="0.5" />
        <line x1="30" y1="0" x2="30" y2="34" stroke="#0a0806" strokeWidth="0.4" />
        <line x1="60" y1="0" x2="60" y2="34" stroke="#0a0806" strokeWidth="0.4" />
        {/* Feuilles + tomates qui dépassent */}
        <circle cx="16" cy="-2" r="4" fill="#e83820" stroke="#3a0000" strokeWidth="0.4" />
        <circle cx="30" cy="-4" r="4" fill="#e83820" stroke="#3a0000" strokeWidth="0.4" />
        <path d="M40 -2 Q46 -14 54 -4 M60 -2 Q66 -14 74 -4" stroke="#5eff9e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
      {/* Arrosoir en métal à côté */}
      <g transform="translate(480,450)">
        <ellipse cx="0" cy="0" rx="18" ry="6" fill="#5a6270" stroke="#0a0806" strokeWidth="0.6" />
        <path d="M-18 -14 L-18 0 L18 0 L18 -14 L14 -18 L-14 -18 Z" fill="#5a6270" stroke="#0a0806" strokeWidth="1" />
        <path d="M18 -10 L34 -6 L34 -12 L20 -14 Z" fill="#5a6270" stroke="#0a0806" strokeWidth="0.6" />
        <path d="M-14 -18 Q-14 -30 0 -30 Q14 -30 14 -18" fill="none" stroke="#5a6270" strokeWidth="1.5" />
      </g>

      <style>{`@keyframes srHoist { 0% { transform: translate(0,80px); } 100% { transform: translate(0,-40px); } }`}</style>
      <Vignette id="serres-vig" strength={0.45} />
    </>
  );
  return <PnjRoom titre="🌱 SERRES HYDROPONIQUES — NIVEAU -2" bg={bg} pnjList={PNJ_ROOMS.serres} j3={j3} onGo={onGo} />;
}
