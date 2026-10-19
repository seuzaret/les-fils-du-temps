import { CeilingPipes, ConcretePanels, PerspFloor, Vignette } from "./bunkerKit.jsx";

/* ============================================================
   JEU 3 — Décor de la chambre N-27 (ta chambre), 1000 × 520
   ------------------------------------------------------------
   Partagé par le réveil (BunkerAwake) et la chambre jouable
   (BunkerChambre) : c'est la MÊME pièce, on doit la reconnaître
   en y revenant. Emplacements pour les objets propres à chaque
   scène :
     bedExtras  — posé sur le lit (la tablette Tchatine)
     deskExtras — posé sur le bureau (le médiadex, le téléphone mort)
     onDoor     — clic sur la porte (absent : porte inerte)
     shelfTablet — "off" | "on" : la tablette rangée sur l'étagère
                  (fin du Jeu 2 : « sur ton étagère, une tablette »)
   ============================================================ */
export default function ChambreN27Decor({ bedExtras = null, deskExtras = null, onDoor, dim = 0, shelfTablet = null }) {
  return (
    <>
      <defs>
        <linearGradient id="bc-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2f38" />
          <stop offset="100%" stopColor="#141820" />
        </linearGradient>
        <linearGradient id="bc-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1e26" />
          <stop offset="100%" stopColor="#050810" />
        </linearGradient>
        <radialGradient id="bc-light" cx="50%" cy="0%" r="60%">
          <stop offset="0%" stopColor="#f0f4ff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f0f4ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Murs + plafond + sol en perspective */}
      <rect width="1000" height="520" fill="url(#bc-wall)" />
      <ConcretePanels y0={70} y1={400} seed={44} opacity={1} />
      <rect x="0" y="0" width="1000" height="70" fill="#1a1e26" />
      <CeilingPipes y={40} seed={49} />
      <rect x="340" y="24" width="320" height="14" rx="3" fill="#e8eef5" opacity="0.85" />
      <ellipse cx="500" cy="42" rx="260" ry="200" fill="url(#bc-light)" />
      <rect x="0" y="400" width="1000" height="120" fill="url(#bc-floor)" />
      <PerspFloor y0={400} y1={520} step={80} rows={4} opacity={0.4} />
      <path d="M0 400 L1000 400" stroke="#3a4048" strokeWidth="1" />
      {/* tapis tressé, carton d'arrivée, baskets */}
      <ellipse cx="420" cy="470" rx="230" ry="30" fill="#3a3448" opacity="0.8" />
      <ellipse cx="420" cy="470" rx="200" ry="24" fill="none" stroke="#5a5470" strokeWidth="3" opacity="0.7" />
      <ellipse cx="420" cy="470" rx="160" ry="18" fill="none" stroke="#4a4460" strokeWidth="3" opacity="0.7" />
      <g transform="translate(110,486)">
        <path d="M-40 0 L40 0 L40 -40 L-40 -40 Z" fill="#a8845a" stroke="#5a4028" strokeWidth="1.5" />
        <path d="M-40 -40 L-30 -52 L50 -52 L40 -40 Z" fill="#c8a070" stroke="#5a4028" strokeWidth="1.2" />
        <path d="M40 0 L50 -12 L50 -52 L40 -40 Z" fill="#8a6a44" />
        <rect x="-26" y="-30" width="40" height="12" fill="#efe9dc" /><text x="-6" y="-21" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#3a2818">N-27 · EFFETS</text>
      </g>
      <g transform="translate(640,500)">
        <path d="M-20 0 q0 -10 10 -12 l14 4 q8 2 10 8 Z" fill="#e8e8f0" stroke="#5a6270" strokeWidth="1" />
        <path d="M6 4 q0 -10 10 -12 l14 4 q8 2 10 8 Z" fill="#e8e8f0" stroke="#5a6270" strokeWidth="1" />
        <path d="M-16 -4 h20 M10 0 h20" stroke="#c83a2a" strokeWidth="1.6" />
      </g>
      {/* une carte postale de la surface, punaisée près de l'armoire */}
      <g transform="translate(222,150) rotate(-6)">
        <rect x="-18" y="-12" width="36" height="24" fill="#f4f0e4" />
        <rect x="-16" y="-10" width="32" height="14" fill="#7ab0d8" /><circle cx="8" cy="-6" r="3" fill="#f2c14e" />
        <path d="M-16 4 L-6 -2 L2 2 L16 -4 L16 4 Z" fill="#4a8a4a" />
        <circle cx="0" cy="-12" r="1.6" fill="#c83a2a" />
      </g>

      {/* ARMOIRE HAUTE à gauche */}
      <g transform="translate(80,180)">
        <rect x="0" y="0" width="120" height="220" fill="#3a4048" stroke="#0a0e14" strokeWidth="2" />
        <line x1="60" y1="10" x2="60" y2="210" stroke="#0a0e14" strokeWidth="1" />
        <circle cx="52" cy="120" r="3" fill="#c8a848" />
        <circle cx="68" cy="120" r="3" fill="#c8a848" />
        <rect x="30" y="18" width="60" height="14" fill="#e8dfc8" stroke="#3a2818" strokeWidth="0.5" />
        <text x="60" y="28" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fontWeight="700" fill="#3a2010">N-27</text>
        <line x1="10" y1="14" x2="10" y2="206" stroke="#5a6270" strokeWidth="0.5" opacity="0.7" />
      </g>

      {/* ÉTAGÈRE MURALE (2 planches) — décor simple, plus de mission */}
      <g transform="translate(240,220)">
        <rect x="0" y="0" width="140" height="4" fill="#3a4048" />
        <rect x="0" y="60" width="140" height="4" fill="#3a4048" />
        {/* Livres alignés sur planche haute */}
        {[[6, "#5a3818", 30], [18, "#8a3820", 28], [30, "#5a2818", 32], [44, "#8a5030", 26], [58, "#3a2818", 30]].map(([x, c, h], i) => (
          <rect key={i} x={x} y={-h} width="10" height={h} fill={c} stroke="#0a0806" strokeWidth="0.3" />
        ))}
        <rect x="80" y="-20" width="14" height="20" rx="1" fill="#c8b090" stroke="#3a2818" strokeWidth="0.5" />
        <rect x="102" y="-24" width="20" height="24" fill="#e8dfc8" stroke="#3a2818" strokeWidth="0.6" />
        <rect x="105" y="-21" width="14" height="18" fill="#5a6270" opacity="0.7" />
        {[[10, "#5a4028", 26], [22, "#8a5030", 24], [34, "#3a2818", 28], [46, "#5a3818", 30], [58, "#8a5030", 28], [70, "#5a2818", 26]].map(([x, c, h], i) => (
          <rect key={`b${i}`} x={x} y={60 - h} width="10" height={h} fill={c} stroke="#0a0806" strokeWidth="0.3" />
        ))}
        {/* la tablette, posée debout sur la planche du bas (éteinte, ou qui
            clignote quand elle reçoit des publications) */}
        {shelfTablet && (
          <g transform="translate(104,30)">
            {shelfTablet === "on" && (
              <circle cx="11" cy="15" r="24" fill="none" stroke="#f08ad0" strokeWidth="1.4" strokeDasharray="4 4" opacity="0.85">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            <rect x="0" y="0" width="22" height="30" rx="2.5" fill="#0a0e14" stroke={shelfTablet === "on" ? "#f08ad0" : "#3a4048"} strokeWidth="1.2" />
            <rect x="2.5" y="3" width="17" height="24" fill={shelfTablet === "on" ? "#2a1a2a" : "#131922"} />
            {shelfTablet === "on" && [8, 14, 20].map((y) => <rect key={y} x="4.5" y={y} width="13" height="3" fill="#f08ad0" opacity="0.5" />)}
          </g>
        )}
      </g>

      {/* POSTER MURAL (Réseau M) — à la place de l'ancien panneau */}
      <g transform="translate(430,90)">
        <rect x="0" y="0" width="220" height="130" fill="#0e1a30" stroke="#5eff9e" strokeWidth="2" />
        <text x="110" y="22" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="11" fontWeight="800" fill="#5eff9e" letterSpacing="2">◈ RÉSEAU M</text>
        <text x="110" y="46" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fill="#c8d4e2">Bienvenue, HABITANT N-27.</text>
        <text x="110" y="62" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fill="#c8d4e2">Niveau 0 · Secteur H</text>
        <text x="110" y="88" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#7a879e">Rappel : la surface est</text>
        <text x="110" y="100" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#7a879e">encore inhabitable.</text>
        <text x="110" y="122" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill="#5eff9e" letterSpacing="1">— MARTINE, Réseau M —</text>
      </g>

      {/* RADIATEUR mural sous le poster */}
      <g transform="translate(430,230)">
        <rect x="0" y="0" width="220" height="20" fill="#5a6270" stroke="#0a0e14" strokeWidth="1" />
        {[10, 30, 50, 70, 90, 110, 130, 150, 170, 190, 210].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="20" stroke="#0a0e14" strokeWidth="0.6" />
        ))}
        <circle cx="216" cy="10" r="4" fill="#c8a848" stroke="#3a2010" strokeWidth="0.5" />
      </g>

      {/* LIT au premier plan */}
      <g transform="translate(220,340)">
        <rect x="0" y="0" width="360" height="80" fill="#3a4048" stroke="#0a0e14" strokeWidth="2" />
        <rect x="0" y="0" width="360" height="6" fill="#5a6270" />
        <path d="M4 8 Q90 -6 180 12 Q270 26 356 8 L356 44 Q270 52 180 44 Q90 38 4 44 Z" fill="#5a6270" />
        <rect x="8" y="6" width="80" height="26" rx="4" fill="#e8eef5" stroke="#8a9098" strokeWidth="0.6" />
        <rect x="4" y="80" width="10" height="34" fill="#1a1e26" />
        <rect x="346" y="80" width="10" height="34" fill="#1a1e26" />
        {bedExtras}
      </g>

      {/* BUREAU + CHAISE + LAMPE à droite */}
      <g transform="translate(640,360)">
        <rect x="0" y="0" width="140" height="8" fill="#5a4028" stroke="#1a0e08" strokeWidth="1" />
        <rect x="4" y="8" width="10" height="52" fill="#3a2818" />
        <rect x="126" y="8" width="10" height="52" fill="#3a2818" />
        <rect x="20" y="12" width="100" height="16" fill="#3a2818" stroke="#0a0806" strokeWidth="0.5" />
        <circle cx="70" cy="20" r="1.6" fill="#c8a848" />
        {/* Chaise */}
        <rect x="50" y="70" width="40" height="6" fill="#3a4048" />
        <rect x="52" y="76" width="4" height="26" fill="#3a4048" />
        <rect x="84" y="76" width="4" height="26" fill="#3a4048" />
        <rect x="50" y="40" width="40" height="4" fill="#3a4048" />
        <rect x="50" y="44" width="4" height="26" fill="#3a4048" />
        {/* Lampe articulée */}
        <circle cx="30" cy="0" r="3" fill="#3a4048" />
        <line x1="30" y1="0" x2="46" y2="-24" stroke="#5a6270" strokeWidth="1.6" />
        <line x1="46" y1="-24" x2="58" y2="-14" stroke="#5a6270" strokeWidth="1.6" />
        <path d="M52 -20 L64 -8 L54 -4 Z" fill="#c8a848" stroke="#3a2010" strokeWidth="0.5" />
        <circle cx="58" cy="-8" r="4" fill="#ffd870" opacity="0.6" />
        {deskExtras}
        <line x1="112" y1="-6" x2="128" y2="-14" stroke="#3a2010" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* GRANDE PORTE à droite extrême — cliquable pour sortir au couloir */}
      <g transform="translate(840,180)"
        onClick={onDoor}
        style={{ cursor: onDoor ? "pointer" : "default" }}>
        <rect x="0" y="0" width="140" height="240" fill="#5a4028" stroke="#0a0806" strokeWidth="3" />
        <rect x="4" y="4" width="132" height="232" fill="#4a3020" />
        <rect x="14" y="14" width="112" height="80" fill="none" stroke="#3a2010" strokeWidth="1" />
        <rect x="14" y="106" width="112" height="120" fill="none" stroke="#3a2010" strokeWidth="1" />
        <circle cx="118" cy="118" r="5" fill="#c8a848" stroke="#3a2010" strokeWidth="0.6" />
        <rect x="26" y="34" width="88" height="30" fill="#e8eef5" stroke="#3a2818" strokeWidth="1.5" />
        <text x="70" y="46" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fontWeight="800" fill="#0a0806" letterSpacing="1">N-27</text>
        <text x="70" y="58" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6.5" fill="#5a4028">HABITANT · NIVEAU 0</text>
        <circle cx="70" cy="86" r="3" fill="#5eff9e">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Petit tapis au pied du lit */}
      <ellipse cx="400" cy="440" rx="120" ry="14" fill="#5a3818" opacity="0.55" />
      {dim > 0 && <rect width="1000" height="520" fill="#000" opacity={dim} style={{ pointerEvents: "none" }} />}
    </>
  );
}
