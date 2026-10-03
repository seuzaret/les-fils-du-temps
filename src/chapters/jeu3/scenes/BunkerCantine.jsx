import PnjRoom from "../PnjRoom.jsx";
import { PNJ_ROOMS } from "../pnj.js";

/* ============================================================
   Cantine (niveau +1) — grande salle commune.
   Layout : cuisine ouverte à gauche (comptoir + passe-plats),
   colonnes structurales, longues tables au centre, distributeur
   automatique au fond, néons chauds au plafond, plateaux et vaisselle.
   ============================================================ */
export default function BunkerCantine({ onGo, j3 }) {
  const bg = (
    <>
      <defs>
        <linearGradient id="cnt-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a2a" />
          <stop offset="100%" stopColor="#141410" />
        </linearGradient>
        <linearGradient id="cnt-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a4030" />
          <stop offset="100%" stopColor="#1a1008" />
        </linearGradient>
        <radialGradient id="cnt-lamp" cx="50%" cy="0%" r="60%">
          <stop offset="0%" stopColor="#ffd870" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffd870" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Mur du fond + sol carrelé en perspective */}
      <rect width="1000" height="520" fill="url(#cnt-wall)" />
      <rect y="380" width="1000" height="140" fill="url(#cnt-floor)" />
      {/* Ligne de fuite du sol */}
      <path d="M0 380 L1000 380" stroke="#2a1808" strokeWidth="1" />
      {[80, 220, 400, 600, 780, 920].map((x, i) => (
        <path key={i} d={`M${x} 380 L${x + (x - 500) * 0.15} 520`} stroke="#2a1808" strokeWidth="0.8" opacity="0.55" />
      ))}
      <path d="M0 440 L1000 440" stroke="#2a1808" strokeWidth="0.6" opacity="0.6" />
      <path d="M0 490 L1000 490" stroke="#2a1808" strokeWidth="0.5" opacity="0.5" />

      {/* Plafond avec poutres structurelles */}
      <rect x="0" y="0" width="1000" height="60" fill="#1a1a10" />
      {[200, 500, 800].map((x, i) => (
        <g key={i}>
          <rect x={x - 6} y="60" width="12" height="30" fill="#2a1810" />
          {/* Néon suspendu chaud */}
          <rect x={x - 40} y="88" width="80" height="8" rx="2" fill="#ffd870" opacity="0.85" />
          <circle cx={x} cy="120" r="90" fill="url(#cnt-lamp)" />
        </g>
      ))}
      {/* Poutres transversales */}
      <path d="M0 60 L1000 60" stroke="#3a2818" strokeWidth="2" />
      <path d="M0 66 L1000 66" stroke="#0a0806" strokeWidth="1" opacity="0.7" />

      {/* CUISINE OUVERTE À GAUCHE — comptoir + passe-plats derrière */}
      <g transform="translate(0,180)">
        {/* Comptoir bois massif */}
        <rect x="0" y="80" width="180" height="14" fill="#5a3818" stroke="#1a0e08" strokeWidth="2" />
        <rect x="0" y="94" width="180" height="106" fill="#3a2010" stroke="#1a0e08" strokeWidth="1.5" />
        {/* Passe-plats (mur ouvert dans le fond) */}
        <rect x="10" y="-20" width="160" height="90" fill="#1a1008" />
        <rect x="14" y="-16" width="152" height="82" fill="#2a1810" opacity="0.7" />
        {/* Casseroles et suspensions */}
        <line x1="30" y1="-20" x2="30" y2="-38" stroke="#5a4028" strokeWidth="1.5" />
        <path d="M20 -38 Q30 -46 40 -38 L38 -32 L22 -32 Z" fill="#5a6270" stroke="#0a0806" strokeWidth="0.6" />
        <line x1="70" y1="-20" x2="70" y2="-42" stroke="#5a4028" strokeWidth="1.5" />
        <circle cx="70" cy="-44" r="4" fill="#8a5030" stroke="#0a0806" strokeWidth="0.6" />
        <line x1="120" y1="-20" x2="120" y2="-36" stroke="#5a4028" strokeWidth="1.5" />
        <path d="M110 -36 L130 -36 L128 -30 L112 -30 Z" fill="#5a6270" stroke="#0a0806" strokeWidth="0.5" />
        {/* Plateaux sur le comptoir */}
        {[30, 70, 110].map((x, i) => (
          <g key={i} transform={`translate(${x},80)`}>
            <rect x="-14" y="-6" width="28" height="6" fill="#c8b090" stroke="#3a2818" strokeWidth="0.6" />
            <circle cx="0" cy="-9" r="4" fill="#8a5030" />
          </g>
        ))}
        {/* Petite étiquette "CUISINE" */}
        <rect x="30" y="60" width="60" height="12" fill="#e8dfc8" stroke="#3a2818" strokeWidth="0.8" />
        <text x="60" y="69" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fontWeight="700" fill="#3a2010">CUISINE</text>
      </g>

      {/* COLONNES structurelles */}
      {[320, 700].map((x, i) => (
        <g key={i}>
          <rect x={x - 12} y="80" width="24" height="320" fill="#3a3a2a" stroke="#1a1a10" strokeWidth="1.5" />
          <rect x={x - 14} y="76" width="28" height="8" fill="#5a4028" stroke="#1a1a10" strokeWidth="1" />
          {/* Capitaux */}
          <rect x={x - 14} y="392" width="28" height="8" fill="#5a4028" stroke="#1a1a10" strokeWidth="1" />
        </g>
      ))}

      {/* LONGUES TABLES COMMUNES */}
      {[[400, 380], [700, 380]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          {/* Plateau */}
          <rect x="-90" y="0" width="180" height="12" fill="#8a7050" stroke="#3a2818" strokeWidth="1.5" />
          {/* Pieds en X */}
          <path d="M-84 12 L-70 40 M-70 12 L-84 40" stroke="#3a2818" strokeWidth="2" />
          <path d="M70 12 L84 40 M84 12 L70 40" stroke="#3a2818" strokeWidth="2" />
          {/* Bancs de chaque côté */}
          <rect x="-90" y="-16" width="180" height="6" fill="#5a3818" stroke="#1a0e08" strokeWidth="0.8" />
          <rect x="-90" y="40" width="180" height="6" fill="#5a3818" stroke="#1a0e08" strokeWidth="0.8" />
          {/* Plateaux et gobelets sur la table */}
          {[-60, -20, 20, 60].map((dx, k) => (
            <g key={k} transform={`translate(${dx},2)`}>
              <rect x="-10" y="0" width="20" height="4" fill="#c8b090" stroke="#3a2818" strokeWidth="0.5" opacity={i === 0 ? 0.85 : (k % 2 === 0 ? 0.5 : 0.85)} />
              {k % 2 === 0 && <ellipse cx="0" cy="-3" rx="3" ry="2" fill="#5a3818" />}
            </g>
          ))}
        </g>
      ))}

      {/* HOTTE de cuisine avec ventilation suspendue */}
      <g transform="translate(90,164)">
        <path d="M-80 0 L80 0 L60 24 L-60 24 Z" fill="#5a6270" stroke="#0a0e14" strokeWidth="1.5" />
        <rect x="-50" y="24" width="100" height="4" fill="#28303a" />
        {/* Vapeur qui monte */}
        <path d="M-30 -2 q-4 -16 2 -24 q6 -8 2 -18" stroke="#c8d4e2" strokeWidth="1.2" fill="none" opacity="0.5">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M20 -2 q-4 -14 2 -22 q6 -6 2 -16" stroke="#c8d4e2" strokeWidth="1.2" fill="none" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.6s" repeatCount="indefinite" />
        </path>
      </g>

      {/* TABLEAU-MENU ardoise à droite de la cuisine */}
      <g transform="translate(220,110)">
        <rect x="-6" y="-6" width="112" height="112" fill="#3a2010" stroke="#1a0e08" strokeWidth="2" />
        <rect x="0" y="0" width="100" height="100" fill="#141008" />
        <text x="50" y="16" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fontWeight="800" fill="#e8dfc8">MENU · J+15042</text>
        <line x1="10" y1="22" x2="90" y2="22" stroke="#c8a848" strokeWidth="0.4" opacity="0.6" />
        <text x="8" y="36" fontFamily="Georgia,serif" fontSize="7" fill="#c8a848" fontStyle="italic">· Soupe des champs</text>
        <text x="8" y="50" fontFamily="Georgia,serif" fontSize="7" fill="#c8a848" fontStyle="italic">· Galette M-42</text>
        <text x="8" y="64" fontFamily="Georgia,serif" fontSize="7" fill="#c8a848" fontStyle="italic">· Chou braisé</text>
        <text x="8" y="78" fontFamily="Georgia,serif" fontSize="7" fill="#c8a848" fontStyle="italic">· Flan vitaminé</text>
        <text x="50" y="94" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="5" fill="#8fa3bd">— ratio M-42 : +12%</text>
      </g>

      {/* HORLOGE murale */}
      <g transform="translate(500,110)">
        <circle r="22" fill="#e8dfc8" stroke="#3a2818" strokeWidth="2" />
        <circle r="18" fill="#f4ecd0" />
        {[0, 90, 180, 270].map((a) => (
          <line key={a} x1={15 * Math.cos((a * Math.PI) / 180)} y1={15 * Math.sin((a * Math.PI) / 180)}
            x2={19 * Math.cos((a * Math.PI) / 180)} y2={19 * Math.sin((a * Math.PI) / 180)}
            stroke="#3a2010" strokeWidth="1.5" />
        ))}
        <line x1="0" y1="0" x2="0" y2="-14" stroke="#0a0806" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="0" y1="0" x2="10" y2="6" stroke="#0a0806" strokeWidth="1" strokeLinecap="round" />
        <circle r="1.8" fill="#0a0806" />
      </g>

      {/* AVIS OFFICIEL punaisé */}
      <g transform="translate(620,100)">
        <rect x="0" y="0" width="94" height="60" fill="#f0e4c8" stroke="#3a2818" strokeWidth="1.4" transform="rotate(-2 47 30)" />
        <text x="47" y="20" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fontWeight="800" fill="#8a1010" transform="rotate(-2 47 30)">AVIS · MARTINE</text>
        <line x1="10" y1="26" x2="84" y2="26" stroke="#3a2010" strokeWidth="0.4" transform="rotate(-2 47 30)" />
        <text x="10" y="38" fontFamily="Georgia,serif" fontSize="6" fill="#3a2010" fontStyle="italic" transform="rotate(-2 47 30)">Nouvelle ration de vitamine M-42</text>
        <text x="10" y="48" fontFamily="Georgia,serif" fontSize="6" fill="#3a2010" fontStyle="italic" transform="rotate(-2 47 30)">obligatoire à chaque repas.</text>
        <circle cx="4" cy="2" r="2" fill="#e83820" transform="rotate(-2 47 30)" />
      </g>

      {/* DISTRIBUTEUR AUTOMATIQUE au fond droite — avec compteur de rations qui tictaque */}
      <g transform="translate(880,120)">
        <rect x="0" y="0" width="90" height="200" fill="#28303a" stroke="#0a0e14" strokeWidth="2" />
        <rect x="6" y="6" width="78" height="60" fill="#0e1a10" stroke="#5eff9e" strokeWidth="1" />
        <text x="45" y="24" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fontWeight="700" fill="#5eff9e">RATIONS</text>
        <text x="45" y="36" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill="#5eff9e">JOUR 15 042</text>
        <text x="45" y="48" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill="#c8d4e2">— MARTINE —</text>
        <circle cx="78" cy="60" r="2.5" fill="#5eff9e">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
        </circle>
        {/* Petites cases produits avec emoji */}
        {[["🍞","🥣","🥫"],["🫓","🫛","🫘"],["🍪","🧈","🧂"],["💊","💊","💊"]].map((row, r) => (
          row.map((em, c) => (
            <g key={`${r}${c}`}>
              <rect x={10 + c * 24} y={80 + r * 22} width="20" height="18" fill="#141c26" stroke="#3a4048" strokeWidth="0.6" />
              <text x={20 + c * 24} y={94 + r * 22} textAnchor="middle" fontSize="10">{em}</text>
            </g>
          ))
        ))}
        {/* Trappe de distribution */}
        <rect x="12" y="170" width="66" height="20" fill="#0a0806" />
        <text x="45" y="184" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#c8d4e2">RETIRER →</text>
      </g>

      {/* Chariot ménage dans un coin (seau + serpillière) */}
      <g transform="translate(50,460)">
        <rect x="0" y="0" width="34" height="28" fill="#c8a848" stroke="#5a4020" strokeWidth="0.8" />
        <ellipse cx="17" cy="0" rx="18" ry="4" fill="#3a2818" opacity="0.6" />
        <line x1="38" y1="-20" x2="38" y2="30" stroke="#5a4028" strokeWidth="1.5" />
        <path d="M30 -20 L46 -20 L44 -10 L32 -10 Z" fill="#8a7050" stroke="#3a2818" strokeWidth="0.5" />
      </g>

      {/* Trois gros bidons alignés au mur droite (approvisionnement) */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${780 + i * 32},368)`}>
          <rect x="-12" y="0" width="24" height="34" fill="#e8dfc8" stroke="#3a2818" strokeWidth="1" />
          <rect x="-10" y="4" width="20" height="8" fill="#8a1010" />
          <text x="0" y="22" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="5" fill="#3a2010">M-42</text>
          <text x="0" y="29" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="4" fill="#5a4028">10 kg</text>
        </g>
      ))}
    </>
  );
  return <PnjRoom titre="🍲 CANTINE COMMUNE — NIVEAU +1" bg={bg} pnjList={PNJ_ROOMS.cantine} j3={j3} onGo={onGo} />;
}
