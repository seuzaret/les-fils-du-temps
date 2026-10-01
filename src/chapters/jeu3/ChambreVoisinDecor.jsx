/* ============================================================
   JEU 3 — Décor partagé pour les chambres voisines du niveau 0
   ------------------------------------------------------------
   Base commune (murs, sol, lit, bureau, étagère, porte) façon
   BunkerChambre — 1000×520 — puis chaque chambre y injecte ses
   objets particuliers (extras) et sa couleur d'accent.
   Utilisé comme `bg` dans PnjRoom.
   ============================================================ */
export default function ChambreVoisinDecor({ num, accent = "#7fd8ff", extras = null, litColor = "#5a3018", bureauColor = "#5a4028" }) {
  return (
    <>
      <defs>
        <linearGradient id={`cv-wall-${num}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2f38" />
          <stop offset="100%" stopColor="#0e1218" />
        </linearGradient>
        <linearGradient id={`cv-floor-${num}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a3020" />
          <stop offset="100%" stopColor="#1a0e08" />
        </linearGradient>
        <radialGradient id={`cv-lamp-${num}`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Mur + sol + plafond */}
      <rect width="1000" height="520" fill={`url(#cv-wall-${num})`} />
      <rect y="0" width="1000" height="30" fill="#141820" />
      <rect y="400" width="1000" height="120" fill={`url(#cv-floor-${num})`} />
      <path d="M0 400 L1000 400" stroke="#0a0806" strokeWidth="1" />
      {/* Bandeau plafond + néon */}
      <rect x="380" y="26" width="220" height="8" rx="2" fill={accent} opacity="0.55" />
      <circle cx="490" cy="70" r="140" fill={`url(#cv-lamp-${num})`} />
      {/* Rivets de mur */}
      {[60, 260, 500, 740, 940].map((x, i) => (
        <circle key={i} cx={x} cy="60" r="3" fill="#141c26" stroke="#3a4048" strokeWidth="0.8" />
      ))}
      {/* Plaque numéro chambre (grande, mur du fond) */}
      <g transform="translate(500,100)">
        <rect x="-56" y="-16" width="112" height="32" fill="#e8dfc8" stroke="#3a2818" strokeWidth="1.5" />
        <text x="0" y="8" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="18" fontWeight="900" fill="#0a0806" letterSpacing="4">{num}</text>
      </g>

      {/* Armoire haute à gauche */}
      <g transform="translate(60,140)">
        <rect x="0" y="0" width="130" height="240" fill="#3a2818" stroke="#0a0806" strokeWidth="2" />
        <rect x="4" y="4" width="60" height="232" fill="#5a4028" opacity="0.7" />
        <rect x="66" y="4" width="60" height="232" fill="#5a4028" opacity="0.7" />
        <circle cx="60" cy="120" r="3" fill="#c8a848" />
        <circle cx="70" cy="120" r="3" fill="#c8a848" />
      </g>

      {/* Étagère murale (2 planches) */}
      <g transform="translate(220,120)">
        <rect x="0" y="0" width="220" height="6" fill="#5a4028" stroke="#0a0806" strokeWidth="0.8" />
        <rect x="0" y="70" width="220" height="6" fill="#5a4028" stroke="#0a0806" strokeWidth="0.8" />
        {/* Livres planche 1 */}
        {[["#8a3820", 14], ["#3a80c8", 22], ["#c8a848", 18], ["#5a6270", 24], ["#5eff9e", 20], ["#8a5030", 16]].map(([c, h], i) => (
          <rect key={i} x={10 + i * 24} y={-h} width="18" height={h} fill={c} stroke="#0a0806" strokeWidth="0.5" />
        ))}
        {/* Gobelet + plante planche 2 */}
        <rect x="20" y="52" width="16" height="18" fill="#c8b090" stroke="#3a2818" strokeWidth="0.8" />
        <g transform="translate(80,50)">
          <rect x="-12" y="10" width="24" height="10" fill="#5a3818" />
          <path d="M-8 10 Q-4 -8 4 4 Q10 -6 8 10" fill="#3a6828" stroke="#1a3010" strokeWidth="0.6" />
        </g>
        <rect x="130" y="52" width="72" height="18" fill="#141820" stroke="#3a4048" strokeWidth="0.8" />
        <text x="166" y="65" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill={accent}>N-{num.slice(-2)}</text>
      </g>

      {/* Lit métallique large */}
      <g transform="translate(60,290)">
        <rect x="0" y="30" width="360" height="80" fill="#5a6270" stroke="#0a0806" strokeWidth="2" />
        {/* Matelas + couette froissée */}
        <rect x="4" y="10" width="352" height="24" fill={litColor} stroke="#0a0806" strokeWidth="1" />
        <path d="M20 12 Q60 20 100 12 Q140 20 180 14 Q220 22 260 12 Q300 18 340 14" stroke="#0a0806" strokeWidth="0.8" fill="none" opacity="0.5" />
        {/* Oreiller */}
        <rect x="10" y="4" width="70" height="20" rx="4" fill="#e8eef5" stroke="#3a4048" strokeWidth="0.8" />
        {/* Pieds */}
        <rect x="4" y="110" width="10" height="14" fill="#3a4048" />
        <rect x="346" y="110" width="10" height="14" fill="#3a4048" />
      </g>

      {/* Bureau + chaise + lampe articulée + carnet */}
      <g transform="translate(450,300)">
        {/* Chaise */}
        <rect x="-10" y="46" width="30" height="6" fill={bureauColor} stroke="#0a0806" strokeWidth="0.8" />
        <rect x="-10" y="10" width="4" height="42" fill={bureauColor} stroke="#0a0806" strokeWidth="0.6" />
        <rect x="-10" y="10" width="30" height="4" fill={bureauColor} stroke="#0a0806" strokeWidth="0.6" />
        <rect x="-8" y="52" width="4" height="24" fill="#3a2818" />
        <rect x="14" y="52" width="4" height="24" fill="#3a2818" />
        {/* Plateau bureau */}
        <rect x="30" y="52" width="180" height="10" fill={bureauColor} stroke="#0a0806" strokeWidth="1.5" />
        <rect x="34" y="62" width="8" height="34" fill="#3a2818" />
        <rect x="198" y="62" width="8" height="34" fill="#3a2818" />
        {/* Lampe articulée */}
        <g transform="translate(60,52)">
          <circle r="5" fill="#3a4048" />
          <path d="M0 0 L20 -30 L60 -20" stroke="#3a4048" strokeWidth="2.5" fill="none" />
          <path d="M52 -26 L74 -12 L64 -2 L44 -18 Z" fill={accent} opacity="0.85" stroke="#0a0806" strokeWidth="0.8" />
          <circle cx="60" cy="-10" r="3" fill="#fff8dc">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.4s" repeatCount="indefinite" />
          </circle>
        </g>
        {/* Carnet ordinaire */}
        <rect x="150" y="46" width="40" height="8" fill="#c8a848" stroke="#3a2818" strokeWidth="0.8" />
      </g>

      {/* Radiateur mural */}
      <g transform="translate(830,180)">
        <rect x="0" y="0" width="60" height="120" fill="#5a6270" stroke="#0a0806" strokeWidth="1.5" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1="0" y1={20 + i * 16} x2="60" y2={20 + i * 16} stroke="#0a0806" strokeWidth="0.6" />
        ))}
      </g>

      {/* Porte à droite (retour couloir) — agrandie, plaque visible */}
      <g transform="translate(790,200)">
        <rect x="-6" y="-6" width="200" height="220" fill="#3a2818" stroke="#0a0806" strokeWidth="3" />
        <rect x="0" y="0" width="188" height="208" fill="#5a4028" stroke="#0a0806" strokeWidth="1.5" />
        {/* Panneaux gravés */}
        <rect x="18" y="100" width="152" height="90" fill="none" stroke="#3a2010" strokeWidth="1" />
        {/* Poignée */}
        <circle cx="170" cy="104" r="6" fill="#c8a848" stroke="#3a2010" strokeWidth="0.8" />
        {/* Plaque COULOIR grand format */}
        <rect x="24" y="24" width="140" height="54" fill="#e8dfc8" stroke="#3a2818" strokeWidth="1.5" />
        <text x="94" y="56" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="22" fontWeight="800" fill="#0a0806" letterSpacing="4">COULOIR</text>
        {/* Voyant */}
        <circle cx="94" cy="92" r="4" fill={accent}>
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
        </circle>
      </g>

      {extras}
    </>
  );
}
