import { ConcretePanels, PerspFloor } from "../bunkerKit.jsx";
/* ============================================================
   JEU 3 — Couloir du niveau +1 (Communal) — v2 cyberpunk
   ------------------------------------------------------------
   Deux portes (Cantine, Chapelle) qui descendent jusqu'au sol.
   Ambiance beige-doré chaude + tuyauteries dorées, câbles au
   plafond, conduits verticaux, ventilation, autocollants d'usage.
   ============================================================ */
const DOORS = [
  { id: "cantine",  code: "C-01", label: "Cantine commune",       color: "#3a3a2a" },
  { id: "chapelle", code: "X-01", label: "Chapelle des Anciens",  color: "#3a2018" },
];

export default function BunkerHubHaut({ onGo }) {
  return (
    <svg viewBox="0 0 900 460" style={{ display: "block", width: "100%", height: "auto", maxHeight: "100%" }}>
      <defs>
        <linearGradient id="hh-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2f18" />
          <stop offset="100%" stopColor="#1a1408" />
        </linearGradient>
        <linearGradient id="hh-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1a08" />
          <stop offset="100%" stopColor="#0a0604" />
        </linearGradient>
      </defs>
      <rect width="900" height="460" fill="url(#hh-wall)" />
      <ConcretePanels x0={0} x1={900} y0={56} y1={360} w={112} seed={43} stain="#4a3010" />

      {/* Tuyauteries plafond (grosse dorée + secondaires) */}
      <path d="M0 24 L900 24" stroke="#c8a848" strokeWidth="8" opacity="0.9" />
      <path d="M0 24 L900 24" stroke="#5a4028" strokeWidth="1.5" opacity="0.7" />
      <path d="M0 40 L900 40" stroke="#5a4028" strokeWidth="3" opacity="0.8" />
      <path d="M0 50 L900 50" stroke="#3a2010" strokeWidth="2" opacity="0.7" />
      {/* Attaches de tuyaux */}
      {[80, 240, 480, 720, 860].map((x, i) => (
        <g key={i}>
          <rect x={x - 6} y="18" width="12" height="14" fill="#3a2010" stroke="#0a0806" strokeWidth="0.5" />
          <rect x={x - 6} y="36" width="12" height="18" fill="#3a2010" stroke="#0a0806" strokeWidth="0.5" opacity="0.7" />
        </g>
      ))}
      {/* Câbles descendants ondulés */}
      <path d="M60 30 Q56 90 62 160 Q56 240 60 340" stroke="#c8a848" strokeWidth="1.5" fill="none" opacity="0.75" />
      <path d="M840 30 Q844 90 838 160 Q844 240 840 340" stroke="#c8a848" strokeWidth="1.5" fill="none" opacity="0.75" />
      <path d="M65 30 Q68 100 62 180" stroke="#e83820" strokeWidth="1" fill="none" opacity="0.7" />

      {/* Néons chauds + halos */}
      {[150, 400, 650].map((x, i) => (
        <g key={i}>
          <rect x={x - 30} y="62" width="60" height="6" rx="1" fill="#ffd870" opacity="0.85" />
          <circle cx={x} cy="98" r="80" fill="#ffd870" opacity="0.09" />
        </g>
      ))}
      {/* Sol carrelé */}
      <rect y="360" width="900" height="100" fill="url(#hh-floor)" />
      <g transform="translate(-50,0)"><PerspFloor y0={360} y1={460} step={70} rows={3} opacity={0.45} /></g>
      {[0, 100, 200, 400, 500, 700, 800].map((x) => (
        <path key={x} d={`M${x} 360 L${x - 40} 460`} stroke="#3a2818" strokeWidth="1" opacity="0.55" />
      ))}
      <path d="M0 400 L900 400" stroke="#2a1808" strokeWidth="1" opacity="0.6" />
      {/* Plinthe métallique */}
      <rect y="356" width="900" height="8" fill="#3a2010" stroke="#0a0806" strokeWidth="0.5" />

      {/* Conduits verticaux latéraux + boîtiers */}
      <g>
        <rect x="20" y="60" width="14" height="300" fill="#5a4028" stroke="#0a0806" strokeWidth="0.8" />
        <rect x="20" y="60" width="14" height="300" fill="url(#hh-wall)" opacity="0.3" />
        {[110, 170, 260].map((y) => (
          <g key={y}>
            <rect x="14" y={y} width="26" height="16" fill="#3a2010" stroke="#0a0806" strokeWidth="0.8" />
            <circle cx="27" cy={y + 8} r="2" fill="#5eff9e">
              <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.6 + y * 0.005}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </g>
      <g>
        <rect x="866" y="60" width="14" height="300" fill="#5a4028" stroke="#0a0806" strokeWidth="0.8" />
        {[130, 220, 300].map((y) => (
          <g key={y}>
            <rect x="860" y={y} width="26" height="16" fill="#3a2010" stroke="#0a0806" strokeWidth="0.8" />
            <circle cx="873" cy={y + 8} r="2" fill="#c8a848">
              <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.4 + y * 0.006}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </g>

      {/* Grille ventilation en bas de mur au fond */}
      <g transform="translate(320,340)">
        <rect x="0" y="0" width="60" height="16" fill="#0a0604" stroke="#5a4028" strokeWidth="0.8" />
        {[0, 1, 2].map((i) => (
          <line key={i} x1="4" y1={4 + i * 4} x2="56" y2={4 + i * 4} stroke="#5a4028" strokeWidth="0.6" />
        ))}
      </g>
      <g transform="translate(560,340)">
        <rect x="0" y="0" width="60" height="16" fill="#0a0604" stroke="#5a4028" strokeWidth="0.8" />
        {[0, 1, 2].map((i) => (
          <line key={i} x1="4" y1={4 + i * 4} x2="56" y2={4 + i * 4} stroke="#5a4028" strokeWidth="0.6" />
        ))}
      </g>

      {/* Petits autocollants d'usage sur le mur */}
      <g transform="translate(230,330)">
        <rect x="-14" y="-8" width="28" height="16" fill="#c8a848" stroke="#0a0806" strokeWidth="0.5" />
        <text x="0" y="4" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fontWeight="800" fill="#0a0806">+1</text>
      </g>

      {/* Ascenseur à gauche */}
      <g transform="translate(50,150)" onClick={() => onGo("elevator")} style={{ cursor: "pointer" }}
        onMouseEnter={(e) => e.currentTarget.querySelector(".el-hov").setAttribute("opacity", "1")}
        onMouseLeave={(e) => e.currentTarget.querySelector(".el-hov").setAttribute("opacity", "0")}>
        <rect className="el-hov" x="-6" y="-6" width="112" height="222" fill="none" stroke="#7fd8ff" strokeWidth="2" opacity="0" />
        <rect x="0" y="0" width="100" height="210" fill="#28303a" stroke="#0a0e14" strokeWidth="3" />
        <rect x="4" y="4" width="92" height="202" fill="#141c26" />
        {/* Porte à deux battants */}
        <line x1="50" y1="12" x2="50" y2="198" stroke="#5eff9e" strokeWidth="1.2" />
        <rect x="14" y="30" width="72" height="36" fill="#0e1a10" stroke="#5eff9e" strokeWidth="1.2" />
        <text x="50" y="52" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fontWeight="800" fill="#5eff9e" letterSpacing="1">+1</text>
        <circle cx="50" cy="90" r="6" fill="#5eff9e">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <text x="50" y="230" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fill="#c8d4e2" letterSpacing="2">ASCENSEUR</text>
      </g>

      {/* Les 2 portes de ce niveau — étendues jusqu'au sol (y=150, h=210 → bottom=360 = sol) */}
      {DOORS.map((door, i) => {
        const x = 250 + i * 300;
        return (
          <g key={door.id} transform={`translate(${x},150)`}
            onClick={() => onGo(door.id)} style={{ cursor: "pointer" }}
            onMouseEnter={(e) => e.currentTarget.querySelector(".dh-hov").setAttribute("opacity", "1")}
            onMouseLeave={(e) => e.currentTarget.querySelector(".dh-hov").setAttribute("opacity", "0")}>
            <rect className="dh-hov" x="-10" y="-10" width="180" height="230" fill="none" stroke="#c88060" strokeWidth="2" opacity="0" />
            {/* Chambranle */}
            <rect x="-6" y="-6" width="172" height="222" fill="#3a2818" stroke="#0a0806" strokeWidth="2" />
            {/* Porte pleine hauteur */}
            <rect x="0" y="0" width="160" height="210" fill={door.color} stroke="#0a0806" strokeWidth="3" />
            <rect x="4" y="4" width="152" height="202" fill={door.color} stroke="#0a0806" strokeWidth="1" opacity="0.6" />
            {/* Petit seuil métallique en bas */}
            <rect x="0" y="204" width="160" height="6" fill="#5a6270" stroke="#0a0806" strokeWidth="0.6" />
            <circle cx="140" cy="105" r="5" fill="#c8a848" />
            <rect x="24" y="30" width="112" height="40" fill="#e8dfc8" stroke="#3a2818" strokeWidth="1.5" />
            <text x="80" y="46" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="14" fill="#0a0806" fontWeight="700">{door.code}</text>
            <text x="80" y="60" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7.5" fill="#5a4028">{door.label.toUpperCase()}</text>
            <circle cx="80" cy="80" r="3.5" fill="#5eff9e">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}

      {/* Bandeau bas */}
      <text x="450" y="440" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fill="#5a6678" letterSpacing="2">
        NIVEAU +1 · SECTEUR COMMUNAL
      </text>
    </svg>
  );
}
