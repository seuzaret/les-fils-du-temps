import { ConcretePanels, PerspFloor } from "../bunkerKit.jsx";
/* ============================================================
   JEU 3 — Couloir du niveau 0 (Habitat) — v2 : 4 chambres
   ------------------------------------------------------------
   Long couloir : ascenseur à gauche, puis 4 portes de chambres
   côte à côte (N-24 Lior, N-27 le joueur, N-30 Yona, N-32 Estev).
   Ambiance bleutée neutre. Trappe rouge « Niveau -3 » au fond
   quand débloquée.
   ============================================================ */
export default function BunkerHub({ onGo, j3 }) {
  const finaleDone = !!j3?.flags?.mission_finale_done;

  const doors = [
    { room: "chambreN24", num: "N-24", nom: "LIOR",  color: "#3a80c8" },
    { room: "chambre",    num: "N-27", nom: "MOI",   color: "#c88060", mine: true },
    { room: "chambreN30", num: "N-30", nom: "YONA",  color: "#c8a848" },
    { room: "chambreN32", num: "N-32", nom: "ESTEV", color: "#5eff9e" },
  ];

  return (
    <svg viewBox="0 0 1200 480" style={{ display: "block", width: "100%", height: "auto", maxHeight: "100%" }}>
      <defs>
        <linearGradient id="hb0-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2f38" />
          <stop offset="100%" stopColor="#0e1218" />
        </linearGradient>
        <linearGradient id="hb0-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2028" />
          <stop offset="100%" stopColor="#0a0e14" />
        </linearGradient>
      </defs>
      <rect width="1200" height="480" fill="url(#hb0-wall)" />
      <ConcretePanels x0={0} x1={1200} y0={50} y1={370} w={120} seed={41} />

      {/* PLAFOND CYBERPUNK : plusieurs tubes + câbles */}
      <path d="M0 22 L1200 22" stroke="#3a4048" strokeWidth="6" opacity="0.85" />
      <path d="M0 32 L1200 32" stroke="#5a4028" strokeWidth="2.5" opacity="0.75" />
      <path d="M0 40 L1200 40" stroke="#7fd8ff" strokeWidth="1.2" opacity="0.55" />
      <path d="M0 46 L1200 46" stroke="#5eff9e" strokeWidth="1" opacity="0.5" />
      {/* Attaches de tubes */}
      {[120, 340, 560, 780, 1000, 1160].map((x, i) => (
        <rect key={i} x={x - 6} y="18" width="12" height="12" fill="#28303a" stroke="#0a0e14" strokeWidth="0.5" />
      ))}
      {/* Câble pendant en boucle */}
      <path d="M280 24 Q280 70 310 60 Q340 50 320 30" stroke="#7fd8ff" strokeWidth="1.2" fill="none" opacity="0.6" />
      <path d="M900 24 Q900 74 930 62 Q960 48 940 30" stroke="#c8a848" strokeWidth="1.2" fill="none" opacity="0.6" />

      {/* Conduits verticaux latéraux + LEDs */}
      <g>
        <rect x="6" y="60" width="10" height="300" fill="#3a4048" stroke="#0a0e14" strokeWidth="0.6" />
        {[100, 180, 260].map((y) => (
          <g key={y}>
            <rect x="2" y={y} width="18" height="10" fill="#141c26" stroke="#3a4048" strokeWidth="0.5" />
            <circle cx="11" cy={y + 5} r="2" fill="#7fd8ff">
              <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.4 + y * 0.005}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </g>
      <g>
        <rect x="1184" y="60" width="10" height="300" fill="#3a4048" stroke="#0a0e14" strokeWidth="0.6" />
        {[130, 210, 290].map((y) => (
          <g key={y}>
            <rect x="1180" y={y} width="18" height="10" fill="#141c26" stroke="#3a4048" strokeWidth="0.5" />
            <circle cx="1189" cy={y + 5} r="2" fill="#c8a848">
              <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.2 + y * 0.007}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </g>

      {/* Néons */}
      {[180, 400, 620, 840, 1060].map((x, i) => (
        <g key={i}>
          <rect x={x - 30} y="60" width="60" height="4" fill="#e8eef5" opacity="0.85" />
          <ellipse cx={x} cy="70" rx="90" ry="24" fill="#7fd8ff" opacity="0.07" />
        </g>
      ))}

      {/* Bouches de ventilation près du sol */}
      <g transform="translate(180,340)">
        <rect x="0" y="0" width="60" height="16" fill="#0a0e14" stroke="#3a4048" strokeWidth="0.8" />
        {[0, 1, 2].map((i) => (
          <line key={i} x1="4" y1={4 + i * 4} x2="56" y2={4 + i * 4} stroke="#3a4048" strokeWidth="0.6" />
        ))}
      </g>
      <g transform="translate(940,340)">
        <rect x="0" y="0" width="60" height="16" fill="#0a0e14" stroke="#3a4048" strokeWidth="0.8" />
        {[0, 1, 2].map((i) => (
          <line key={i} x1="4" y1={4 + i * 4} x2="56" y2={4 + i * 4} stroke="#3a4048" strokeWidth="0.6" />
        ))}
      </g>

      {/* Sol */}
      <rect y="370" width="1200" height="110" fill="url(#hb0-floor)" />
      <g transform="translate(100,0)"><PerspFloor y0={370} y1={480} step={90} rows={3} opacity={0.4} /></g>
      {/* Plinthe */}
      <rect y="366" width="1200" height="8" fill="#141c26" stroke="#0a0e14" strokeWidth="0.5" />
      <path d="M0 390 L1200 390" stroke="#1a2028" strokeWidth="1" />
      {/* Marquage sol */}
      <path d="M60 420 L1140 420" stroke="#3a80c8" strokeWidth="2" strokeDasharray="8 6" opacity="0.4" />

      {/* Numéros de niveau sur le mur */}
      <text x="600" y="130" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="46" fill="#7fd8ff" opacity="0.12" fontWeight="900" letterSpacing="10">NIVEAU 0 · HABITAT</text>

      {/* Ascenseur à gauche */}
      <g transform="translate(30,140)" onClick={() => onGo("elevator")} style={{ cursor: "pointer" }}
        onMouseEnter={(e) => e.currentTarget.querySelector(".el-hov").setAttribute("opacity", "1")}
        onMouseLeave={(e) => e.currentTarget.querySelector(".el-hov").setAttribute("opacity", "0")}>
        <rect className="el-hov" x="-6" y="-6" width="132" height="232" fill="none" stroke="#7fd8ff" strokeWidth="2" opacity="0" />
        <rect x="0" y="0" width="120" height="220" fill="#28303a" stroke="#0a0e14" strokeWidth="3" />
        <rect x="4" y="4" width="112" height="212" fill="#141c26" />
        <line x1="60" y1="14" x2="60" y2="208" stroke="#5eff9e" strokeWidth="1.4" />
        <rect x="18" y="30" width="84" height="42" fill="#0e1a10" stroke="#5eff9e" strokeWidth="1.4" />
        <text x="60" y="54" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="12" fontWeight="800" fill="#5eff9e" letterSpacing="2">↕</text>
        <text x="60" y="66" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#5eff9e" letterSpacing="2">0</text>
        <circle cx="60" cy="102" r="7" fill="#5eff9e">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <text x="60" y="240" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fill="#c8d4e2" letterSpacing="3">ASCENSEUR</text>
      </g>

      {/* Les 4 portes de chambres */}
      {doors.map((d, i) => {
        const x = 220 + i * 200;
        const hoverCls = `dh${i}`;
        return (
          <g key={d.room} transform={`translate(${x},140)`}
            onClick={() => onGo(d.room)} style={{ cursor: "pointer" }}
            onMouseEnter={(e) => e.currentTarget.querySelector(`.${hoverCls}`).setAttribute("opacity", "1")}
            onMouseLeave={(e) => e.currentTarget.querySelector(`.${hoverCls}`).setAttribute("opacity", "0")}>
            {/* Halo hover */}
            <rect className={hoverCls} x="-8" y="-8" width="176" height="246" fill="none" stroke={d.color} strokeWidth="2" opacity="0" />
            {/* Chambranle */}
            <rect x="-4" y="-4" width="168" height="238" fill="#3a2818" stroke="#0a0806" strokeWidth="2" />
            {/* Porte pleine hauteur */}
            <rect x="0" y="0" width="160" height="230" fill={d.mine ? "#5a4028" : "#3a2818"} stroke="#0a0806" strokeWidth="1.5" />
            <rect x="4" y="4" width="152" height="222" fill="#5a4028" opacity="0.55" stroke="#0a0806" strokeWidth="0.6" />
            {/* Seuil métallique */}
            <rect x="0" y="224" width="160" height="6" fill="#5a6270" stroke="#0a0806" strokeWidth="0.6" />
            {/* Poignée */}
            <circle cx="140" cy="110" r="5" fill="#c8a848" />
            {/* Plaque numéro + nom */}
            <rect x="20" y="32" width="120" height="44" fill="#e8dfc8" stroke="#3a2818" strokeWidth="1.5" />
            <text x="80" y="52" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="16" fill="#0a0806" fontWeight="700">{d.num}</text>
            <text x="80" y="66" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#5a4028" letterSpacing="1">{d.mine ? "MA CHAMBRE" : d.nom}</text>
            {/* Voyant */}
            <circle cx="80" cy="88" r="3.5" fill={d.color}>
              <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.6 + i * 0.15}s`} repeatCount="indefinite" />
            </circle>
            {/* Étoile discrète pour ma chambre */}
            {d.mine && (
              <text x="80" y="200" textAnchor="middle" fontFamily="Georgia,serif" fontSize="14" fill="#c88060" opacity="0.85">★</text>
            )}
          </g>
        );
      })}

      {/* Trappe rouge « Niveau -3 » quand débloquée (raccourci d'urgence) */}
      {j3?.flags?.mission_kova_done && j3?.flags?.phase5_done && j3?.flags?.mission_carnet_done && (
        <g transform="translate(1110,280)" onClick={() => onGo("serveurs")} style={{ cursor: "pointer" }}>
          <circle r="52" fill="none" stroke="#ff5030" strokeWidth="2" strokeDasharray="6 4">
            <animate attributeName="r" values="46;56;46" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <rect x="-40" y="-30" width="80" height="90" fill="#1a0808" stroke="#ff5030" strokeWidth="3" />
          <rect x="-36" y="-26" width="72" height="82" fill="#2a0e08" />
          <text x="0" y="-6" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="12" fontWeight="800" fill="#ff5030">⚠</text>
          <text x="0" y="10" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#ff5030">NIVEAU</text>
          <text x="0" y="22" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fontWeight="800" fill="#ff5030">-3</text>
          <text x="0" y="42" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#ff8080">SERVEURS</text>
          {finaleDone && <text x="0" y="72" textAnchor="middle" fontSize="12" fill="#5eff9e">✓</text>}
        </g>
      )}

      <text x="600" y="460" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fill="#5a6678" letterSpacing="2">
        NIVEAU 0 · SECTEUR HABITAT · 4 CHAMBRES OCCUPÉES · ASCENSEUR À GAUCHE
      </text>
    </svg>
  );
}
