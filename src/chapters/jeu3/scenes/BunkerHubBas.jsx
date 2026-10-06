import { getMissionOrder } from "../missions.js";

/* ============================================================
   JEU 3 — Couloir du niveau -1 (Services) — v2 cyberpunk
   ------------------------------------------------------------
   Quatre portes techniques (Rumeurs, Archives, Infirmerie,
   Atelier) qui descendent jusqu'au sol. Ambiance bleu-vert
   froide, câbles rétroéclairés, conduits, ventilation, boîtiers
   électriques, tuyauterie apparente.
   ============================================================ */
const DOORS = [
  { id: "rumeurs",    code: "R-01", label: "Bureau des Rumeurs",     color: "#3a2818" },
  { id: "archives",   code: "A-01", label: "Salle des Archives",     color: "#28303a" },
  { id: "infirmerie", code: "I-01", label: "Infirmerie",             color: "#5a6270" },
  { id: "atelier",    code: "T-01", label: "Atelier des Ingénieurs", color: "#5a4028" },
];

export default function BunkerHubBas({ onGo, j3 }) {
  /* Badge "nouvelle enquête" sur la porte Rumeurs : Kova est faite,
     il reste au moins une enquête active, et son briefing n'a pas
     encore été lu. */
  const flags = j3?.flags || {};
  const order = getMissionOrder(flags);
  const activeId = order.find((id) => j3?.missions?.[id] && !flags[j3.missions[id].flag]);
  const activeMission = activeId ? j3.missions[activeId] : null;
  const newCase = !!flags.mission_kova_done && !!activeMission && !flags[`briefing_${activeMission.id}_done`];
  return (
    <svg viewBox="0 0 1000 460" style={{ display: "block", width: "100%", height: "auto", maxHeight: "100%" }}>
      <defs>
        <linearGradient id="hb-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2028" />
          <stop offset="100%" stopColor="#050810" />
        </linearGradient>
        <linearGradient id="hb-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1218" />
          <stop offset="100%" stopColor="#020408" />
        </linearGradient>
      </defs>
      <rect width="1000" height="460" fill="url(#hb-wall)" />

      {/* PLAFOND CYBERPUNK : câbles bundlés, tuyauterie, néons */}
      <path d="M0 16 L1000 16" stroke="#3a4048" strokeWidth="6" opacity="0.85" />
      <path d="M0 26 L1000 26" stroke="#5eff9e" strokeWidth="1.2" opacity="0.5" />
      <path d="M0 32 L1000 32" stroke="#7fd8ff" strokeWidth="1" opacity="0.45" />
      <path d="M0 38 L1000 38" stroke="#e83820" strokeWidth="1" opacity="0.4" />
      {/* Attaches */}
      {[100, 320, 540, 760, 940].map((x, i) => (
        <rect key={i} x={x - 8} y="12" width="16" height="10" fill="#28303a" stroke="#0a0e14" strokeWidth="0.5" />
      ))}
      {/* Câbles qui pendent en boucle */}
      <path d="M180 18 Q180 60 210 50 Q240 40 220 20" stroke="#5eff9e" strokeWidth="1.2" fill="none" opacity="0.7" />
      <path d="M620 18 Q620 70 650 58 Q680 44 660 22" stroke="#7fd8ff" strokeWidth="1.2" fill="none" opacity="0.7" />
      {/* Tuyaux verticaux descendants avec valves */}
      <g>
        <rect x="16" y="40" width="10" height="320" fill="#3a4048" stroke="#0a0e14" strokeWidth="0.6" />
        <rect x="28" y="40" width="10" height="320" fill="#5a6270" stroke="#0a0e14" strokeWidth="0.6" />
        {[130, 220, 310].map((y) => (
          <g key={y}>
            <circle cx="31" cy={y} r="6" fill="#c8a848" stroke="#1a0e08" strokeWidth="1" />
            <line x1="24" y1={y} x2="38" y2={y} stroke="#1a0e08" strokeWidth="0.6" />
          </g>
        ))}
      </g>
      <g>
        <rect x="960" y="40" width="10" height="320" fill="#3a4048" stroke="#0a0e14" strokeWidth="0.6" />
        <rect x="972" y="40" width="10" height="320" fill="#5a6270" stroke="#0a0e14" strokeWidth="0.6" />
        {[150, 250, 330].map((y) => (
          <g key={y}>
            <circle cx="975" cy={y} r="6" fill="#c8a848" stroke="#1a0e08" strokeWidth="1" />
            <line x1="968" y1={y} x2="982" y2={y} stroke="#1a0e08" strokeWidth="0.6" />
          </g>
        ))}
      </g>

      {/* Néons froids + halos */}
      {[200, 500, 800].map((x, i) => (
        <g key={i}>
          <rect x={x - 30} y="52" width="60" height="4" fill="#e8eef5" opacity="0.85" />
          <ellipse cx={x} cy="86" rx="90" ry="26" fill="#7fd8ff" opacity="0.08" />
        </g>
      ))}

      {/* BOÎTIERS ÉLECTRIQUES / DISJONCTEURS le long du mur */}
      {[[140, 90], [400, 90], [660, 90], [880, 90]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <rect x="-16" y="-14" width="32" height="28" fill="#28303a" stroke="#0a0e14" strokeWidth="1" />
          <rect x="-13" y="-11" width="26" height="22" fill="#141c26" />
          {[0, 1].map((r) => (
            [-6, 6].map((dx, k) => (
              <rect key={`${r}${k}`} x={dx - 3} y={-6 + r * 8} width="6" height="6" fill={((r + k + i) % 3 === 0) ? "#5eff9e" : "#c8a848"} opacity="0.85">
                <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.4 + i * 0.2}s`} repeatCount="indefinite" />
              </rect>
            ))
          ))}
        </g>
      ))}

      {/* Sol technique */}
      <rect y="370" width="1000" height="90" fill="url(#hb-floor)" />
      {/* Plinthe */}
      <rect y="366" width="1000" height="8" fill="#28303a" stroke="#0a0e14" strokeWidth="0.5" />
      {/* Grille de sol technique */}
      {[100, 250, 400, 600, 750, 900].map((x) => (
        <rect key={x} x={x - 8} y="380" width="16" height="6" fill="#3a4048" opacity="0.7" />
      ))}
      {/* Marquage sol jaune */}
      <path d="M180 405 L820 405" stroke="#c8a848" strokeWidth="3" strokeDasharray="10 8" opacity="0.55" />

      {/* Ascenseur à gauche */}
      <g transform="translate(50,150)" onClick={() => onGo("elevator")} style={{ cursor: "pointer" }}
        onMouseEnter={(e) => e.currentTarget.querySelector(".el-hov").setAttribute("opacity", "1")}
        onMouseLeave={(e) => e.currentTarget.querySelector(".el-hov").setAttribute("opacity", "0")}>
        <rect className="el-hov" x="-6" y="-6" width="112" height="232" fill="none" stroke="#7fd8ff" strokeWidth="2" opacity="0" />
        <rect x="0" y="0" width="100" height="220" fill="#28303a" stroke="#0a0e14" strokeWidth="3" />
        <rect x="4" y="4" width="92" height="212" fill="#141c26" />
        <line x1="50" y1="12" x2="50" y2="208" stroke="#5eff9e" strokeWidth="1.2" />
        <rect x="14" y="30" width="72" height="36" fill="#0e1a10" stroke="#5eff9e" strokeWidth="1.2" />
        <text x="50" y="52" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fontWeight="800" fill="#5eff9e" letterSpacing="1">-1</text>
        <circle cx="50" cy="90" r="6" fill="#5eff9e">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <text x="50" y="240" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fill="#c8d4e2" letterSpacing="2">ASCENSEUR</text>
      </g>

      {/* 4 portes en une rangée à droite du couloir — étendues (y=150, h=220 → bottom 370 = sol) */}
      {DOORS.map((door, i) => {
        const x = 200 + i * 195;
        return (
          <g key={door.id} transform={`translate(${x},150)`}
            onClick={() => onGo(door.id)} style={{ cursor: "pointer" }}
            onMouseEnter={(e) => e.currentTarget.querySelector(".db-hov").setAttribute("opacity", "1")}
            onMouseLeave={(e) => e.currentTarget.querySelector(".db-hov").setAttribute("opacity", "0")}>
            <rect className="db-hov" x="-8" y="-8" width="146" height="236" fill="none" stroke="#5eff9e" strokeWidth="2" opacity="0" />
            <rect x="-4" y="-4" width="138" height="228" fill="#3a2818" stroke="#0a0806" strokeWidth="2" />
            <rect x="0" y="0" width="130" height="220" fill={door.color} stroke="#0a0806" strokeWidth="3" />
            <rect x="4" y="4" width="122" height="212" fill={door.color} stroke="#0a0806" strokeWidth="1" opacity="0.6" />
            {/* Seuil */}
            <rect x="0" y="214" width="130" height="6" fill="#5a6270" stroke="#0a0806" strokeWidth="0.6" />
            <circle cx="110" cy="105" r="4" fill="#c8a848" />
            <rect x="18" y="30" width="94" height="38" fill="#e8eef5" stroke="#3a2818" strokeWidth="1.5" />
            <text x="65" y="46" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="12" fill="#0a0806" fontWeight="700">{door.code}</text>
            <text x="65" y="58" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6.5" fill="#5a4028">{door.label.toUpperCase()}</text>
            <circle cx="65" cy="76" r="3" fill="#5eff9e">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
            </circle>
            {door.id === "rumeurs" && newCase && (
              <g transform="translate(118,10)">
                <circle r="14" fill="#e0a848" stroke="#1a0e08" strokeWidth="1.5">
                  <animate attributeName="r" values="12;15;12" dur="1.4s" repeatCount="indefinite" />
                </circle>
                <text x="0" y="4" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="14" fontWeight="900" fill="#1a0e08">!</text>
                <text x="0" y="30" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fontWeight="700" fill="#e0a848" letterSpacing="1">NOUVELLE</text>
                <text x="0" y="40" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fontWeight="700" fill="#e0a848" letterSpacing="1">ENQUÊTE</text>
              </g>
            )}
          </g>
        );
      })}

      <text x="500" y="440" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fill="#5a6678" letterSpacing="2">
        NIVEAU -1 · SECTEUR TECHNIQUE ET SERVICES
      </text>
    </svg>
  );
}
