import PnjRoom from "../PnjRoom.jsx";
import { PNJ_ROOMS } from "../pnj.js";

/* ============================================================
   Infirmerie (niveau -1) — carrelage clair, ambiance froide.
   Layout : 3 lits médicaux alignés au fond, moniteur central
   ECG, armoire à médicaments à droite, bureau/dossiers, croix
   rouge murale, néons blancs.
   ============================================================ */
export default function BunkerInfirmerie({ onGo, j3 }) {
  const bg = (
    <>
      <defs>
        <linearGradient id="inf-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8d4e2" />
          <stop offset="100%" stopColor="#5a6270" />
        </linearGradient>
        <linearGradient id="inf-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#28303a" />
          <stop offset="100%" stopColor="#0a0e14" />
        </linearGradient>
      </defs>
      <rect width="1000" height="520" fill="url(#inf-wall)" />
      {/* Plafond */}
      <rect x="0" y="0" width="1000" height="60" fill="#3a4048" />
      {/* Néons blancs alignés */}
      {[200, 500, 800].map((x, i) => (
        <rect key={i} x={x - 40} y="20" width="80" height="10" rx="2" fill="#e8eef5" opacity="0.85" />
      ))}
      {/* Ligne de fuite du sol */}
      <rect y="380" width="1000" height="140" fill="url(#inf-floor)" />
      {/* Carrelage : lignes horizontales et diagonales */}
      <path d="M0 380 L1000 380" stroke="#5a6270" strokeWidth="1" opacity="0.6" />
      {[100, 200, 300, 500, 700, 800, 900].map((x, i) => (
        <path key={i} d={`M${x} 380 L${x + (x - 500) * 0.14} 520`} stroke="#0a0e14" strokeWidth="0.6" opacity="0.5" />
      ))}
      <path d="M0 440 L1000 440" stroke="#0a0e14" strokeWidth="0.6" opacity="0.5" />

      {/* CROIX ROUGE MURALE au fond centre */}
      <g transform="translate(500,120)">
        <circle r="46" fill="#fff" stroke="#3a4048" strokeWidth="2" />
        <rect x="-32" y="-8" width="64" height="16" fill="#e83820" />
        <rect x="-8" y="-32" width="16" height="64" fill="#e83820" />
      </g>

      {/* 3 LITS MÉDICAUX alignés au fond, avec perche à sérum */}
      {[[120, 320], [500, 320], [880, 320]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          {/* Structure du lit */}
          <rect x="-60" y="0" width="120" height="34" fill="#e8eef5" stroke="#3a4048" strokeWidth="1.5" />
          <rect x="-60" y="34" width="120" height="8" fill="#3a4048" />
          {/* Pieds */}
          <rect x="-60" y="42" width="6" height="20" fill="#3a4048" />
          <rect x="54" y="42" width="6" height="20" fill="#3a4048" />
          {/* Oreiller + drap plié */}
          <rect x="-56" y="4" width="30" height="14" fill="#f0f4ff" />
          <path d="M-24 4 L44 4 L44 30 L-24 30 Z" fill="#c8d4e2" opacity="0.85" />
          {/* Perche à sérum */}
          <line x1="-54" y1="-36" x2="-54" y2="0" stroke="#8a9098" strokeWidth="1.5" />
          <ellipse cx="-54" cy="-38" rx="7" ry="3" fill="#3a4048" />
          {/* Poche perfusion */}
          <rect x="-58" y="-30" width="8" height="14" rx="2" fill="#7fd8ff" opacity="0.85" stroke="#3a80c8" strokeWidth="0.5" />
          <line x1="-54" y1="-16" x2="-52" y2="4" stroke="#5a7098" strokeWidth="0.5" />
          {/* Numéro de lit */}
          <text x="0" y="60" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#c8d4e2">LIT-{i + 1}</text>
        </g>
      ))}

      {/* MONITEUR CENTRAL au fond (poste de contrôle) */}
      <g transform="translate(500,180)">
        <rect x="-52" y="0" width="104" height="80" fill="#0a1420" stroke="#5eff9e" strokeWidth="1.5" />
        <rect x="-48" y="4" width="96" height="60" fill="#0a1810" />
        {/* Grille ECG */}
        {[[10], [30], [50]].map(([dy], i) => (
          <line key={i} x1="-48" y1={4 + dy} x2="48" y2={4 + dy} stroke="#144030" strokeWidth="0.4" />
        ))}
        <path d="M-48 34 L-32 34 L-24 20 L-12 48 L0 26 L14 40 L26 30 L48 34"
          stroke="#5eff9e" strokeWidth="1.4" fill="none" strokeLinejoin="round">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1.2s" repeatCount="indefinite" />
        </path>
        <text x="0" y="74" textAnchor="middle" fontSize="6.5" fontFamily="ui-monospace,monospace" fill="#5eff9e">ECG · 72 bpm · STABLE</text>
      </g>

      {/* ARMOIRE À MÉDICAMENTS à droite */}
      <g transform="translate(900,180)">
        <rect x="-40" y="0" width="80" height="180" fill="#c8d4e2" stroke="#3a4048" strokeWidth="2" />
        {/* Étagères de flacons */}
        {[10, 46, 82, 118].map((y, i) => (
          <g key={i}>
            <rect x="-36" y={y} width="72" height="30" fill="none" stroke="#3a4048" strokeWidth="0.6" />
            {[-24, -12, 0, 12, 24].map((dx, k) => (
              <rect key={k} x={dx - 3} y={y + 4} width="6" height="22" fill={["#e83820", "#5eff9e", "#7fd8ff", "#ffd870", "#c8a848"][(i + k) % 5]} stroke="#0a0806" strokeWidth="0.3" opacity="0.8" />
            ))}
          </g>
        ))}
        <text x="0" y="172" textAnchor="middle" fontSize="6.5" fontFamily="ui-monospace,monospace" fill="#3a4048">PHARMACIE</text>
      </g>

      {/* PETIT BUREAU / DOSSIER à gauche */}
      <g transform="translate(100,240)">
        <rect x="0" y="0" width="90" height="8" fill="#5a4028" stroke="#1a0e08" strokeWidth="0.8" />
        <rect x="4" y="8" width="8" height="30" fill="#3a2818" />
        <rect x="78" y="8" width="8" height="30" fill="#3a2818" />
        {/* Chaise */}
        <rect x="30" y="52" width="30" height="4" fill="#3a4048" />
        <rect x="30" y="24" width="4" height="28" fill="#3a4048" />
        <rect x="56" y="24" width="4" height="28" fill="#3a4048" />
        {/* Dossiers empilés + étiquettes */}
        <rect x="8" y="-14" width="14" height="14" fill="#8a3820" stroke="#0a0806" strokeWidth="0.5" />
        <text x="15" y="-5" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="4" fontWeight="800" fill="#f8e8d0">N-30</text>
        <rect x="26" y="-14" width="14" height="14" fill="#3a4048" stroke="#0a0806" strokeWidth="0.5" />
        <text x="33" y="-5" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="4" fontWeight="800" fill="#c8d4e2">N-24</text>
        <rect x="44" y="-14" width="14" height="14" fill="#5a4028" stroke="#0a0806" strokeWidth="0.5" />
        <text x="51" y="-5" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="4" fontWeight="800" fill="#f8e8d0">N-27</text>
        {/* Lampe articulée */}
        <line x1="70" y1="-16" x2="70" y2="0" stroke="#5a6270" strokeWidth="1" />
        <ellipse cx="70" cy="-20" rx="6" ry="3" fill="#c8a848" />
      </g>

      {/* RIDEAUX séparateurs entre les lits (ambiance hospitalière) */}
      {[290, 690].map((x, i) => (
        <g key={i}>
          <line x1={x} y1="240" x2={x} y2="340" stroke="#5a6270" strokeWidth="2" />
          <path d={`M${x - 2} 240 L${x - 2} 340 Q${x - 2} 346 ${x + 4} 346 L${x + 4} 240 Z`} fill="#c8d4e2" opacity="0.75" stroke="#8a9098" strokeWidth="0.6" />
          {/* Plis */}
          {[0, 1, 2].map((p) => (
            <line key={p} x1={x + 1 + p * 1.5} y1="246" x2={x + 1 + p * 1.5} y2="340" stroke="#8a9098" strokeWidth="0.3" opacity="0.5" />
          ))}
          {/* Rail au plafond */}
          <line x1={x - 10} y1="238" x2={x + 10} y2="238" stroke="#3a4048" strokeWidth="1" />
          <circle cx={x} cy="238" r="2" fill="#5a6270" />
        </g>
      ))}

      {/* NÉGATOSCOPE (visionneuse de radiographies) sur le mur à gauche */}
      <g transform="translate(100,100)">
        <rect x="0" y="0" width="110" height="90" fill="#141c26" stroke="#3a4048" strokeWidth="2" />
        <rect x="4" y="4" width="102" height="82" fill="#e8eef5" opacity="0.95" />
        {/* Radiographie thorax stylisée */}
        <g transform="translate(55,45)" opacity="0.7">
          {/* colonne vertébrale */}
          <line x1="0" y1="-30" x2="0" y2="30" stroke="#5a6270" strokeWidth="1.5" />
          {/* côtes */}
          {[-18, -8, 2, 12].map((y, i) => (
            <g key={i}>
              <path d={`M0 ${y} q-20 ${8 + i * 2} -32 2`} stroke="#5a6270" strokeWidth="0.6" fill="none" />
              <path d={`M0 ${y} q20 ${8 + i * 2} 32 2`} stroke="#5a6270" strokeWidth="0.6" fill="none" />
            </g>
          ))}
          {/* clavicules */}
          <path d="M-18 -22 q-6 -4 -14 -2" stroke="#5a6270" strokeWidth="0.6" fill="none" />
          <path d="M18 -22 q6 -4 14 -2" stroke="#5a6270" strokeWidth="0.6" fill="none" />
        </g>
        <text x="55" y="100" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#3a4048">RX · N-27 · THORAX</text>
      </g>

      {/* GEL HYDROALCOOLIQUE mural près de la porte */}
      <g transform="translate(820,100)">
        <rect x="0" y="0" width="18" height="40" rx="2" fill="#5eff9e" opacity="0.6" stroke="#3a4048" strokeWidth="0.8" />
        <rect x="2" y="6" width="14" height="22" fill="#5eff9e" opacity="0.4" />
        <rect x="-2" y="40" width="22" height="6" fill="#28303a" />
        <path d="M0 46 L0 54 L8 54" stroke="#28303a" strokeWidth="1" fill="none" />
        <text x="9" y="60" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="4" fill="#c8d4e2">GEL · 90°</text>
      </g>

      {/* CHARIOT à instruments près du lit central */}
      <g transform="translate(560,330)">
        <rect x="-18" y="0" width="36" height="4" fill="#c8d4e2" stroke="#3a4048" strokeWidth="0.8" />
        <rect x="-16" y="4" width="32" height="18" fill="#e8eef5" stroke="#3a4048" strokeWidth="0.6" />
        <rect x="-18" y="22" width="36" height="4" fill="#c8d4e2" stroke="#3a4048" strokeWidth="0.6" />
        {/* Roulettes */}
        <circle cx="-14" cy="30" r="2.5" fill="#3a4048" />
        <circle cx="14" cy="30" r="2.5" fill="#3a4048" />
        {/* Objets sur le plateau */}
        <rect x="-14" y="-6" width="8" height="6" fill="#8a1010" stroke="#3a0000" strokeWidth="0.4" />
        <circle cx="0" cy="-3" r="3" fill="#5a6270" stroke="#0a0806" strokeWidth="0.4" />
        <rect x="6" y="-4" width="10" height="4" fill="#7fd8ff" opacity="0.8" stroke="#3a80c8" strokeWidth="0.3" />
      </g>

      {/* POUBELLE À DÉCHETS MÉDICAUX à droite du bureau */}
      <g transform="translate(230,330)">
        <path d="M-10 0 L10 0 L8 36 L-8 36 Z" fill="#f4b800" stroke="#5a4020" strokeWidth="1" />
        <rect x="-12" y="-4" width="24" height="4" fill="#8a6020" stroke="#5a4020" strokeWidth="0.5" />
        <text x="0" y="22" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="5" fontWeight="800" fill="#5a2810">DASRI</text>
        {/* Symbole biohazard simplifié */}
        <circle cx="0" cy="10" r="3" fill="none" stroke="#8a1010" strokeWidth="0.8" />
      </g>

      {/* PICTOGRAMMES de signalétique "SILENCE" + "ACCÈS RESTREINT" */}
      <g transform="translate(500,80)">
        <rect x="-30" y="0" width="60" height="18" fill="#141c26" stroke="#5eff9e" strokeWidth="0.6" />
        <text x="0" y="12" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fontWeight="800" fill="#5eff9e" letterSpacing="2">SILENCE</text>
      </g>
    </>
  );
  return <PnjRoom titre="⚕ INFIRMERIE — SECTEUR B" bg={bg} pnjList={PNJ_ROOMS.infirmerie} j3={j3} onGo={onGo} />;
}
