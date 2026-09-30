/* ============================================================
   JEU 3 — Niveau +2 : Surface / Sortie scellée C-3
   ------------------------------------------------------------
   Hommage direct au Vault-Tec de Fallout : une immense porte
   circulaire encastrée dans le béton, avec engrenages, verrou
   central en croix, panneau d'avertissement radioactif rouge.
   Non interactive pour l'instant — s'ouvre selon la fin choisie
   au niveau -3.
   ============================================================ */
export default function BunkerSurface({ onGo, j3 }) {
  const done = !!j3?.flags?.mission_finale_done;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", height: "100%", padding: 4, boxSizing: "border-box", overflowY: "auto" }}>
      <svg viewBox="0 0 900 500" style={{ display: "block", width: "100%", height: "auto", maxHeight: "100%" }}>
        <defs>
          <linearGradient id="sf-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a3020" />
            <stop offset="100%" stopColor="#1a0e08" />
          </linearGradient>
          <radialGradient id="sf-warn" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff5030" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ff5030" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sf-metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8d0d8" />
            <stop offset="1" stopColor="#5a6270" />
          </linearGradient>
          <radialGradient id="sf-ring" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#a0a8b0" />
            <stop offset="100%" stopColor="#3a4048" />
          </radialGradient>
        </defs>
        {/* Béton brut du sas de sortie */}
        <rect width="900" height="500" fill="url(#sf-wall)" />
        {/* Grosses fissures et joints de béton */}
        <path d="M0 100 L200 120 L100 250 M700 90 L900 140 M300 400 L500 380 L700 420" stroke="#0a0806" strokeWidth="1" opacity="0.6" fill="none" />
        {/* Halo rouge d'avertissement autour de la porte */}
        <circle cx="450" cy="260" r="260" fill="url(#sf-warn)">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2.4s" repeatCount="indefinite" />
        </circle>

        {/* LA PORTE : anneau extérieur monumental + porte circulaire */}
        <g transform="translate(450,260)">
          {/* Cadre encastré rectangulaire */}
          <rect x="-200" y="-200" width="400" height="400" fill="#2a2018" stroke="#0a0806" strokeWidth="4" />
          <rect x="-192" y="-192" width="384" height="384" fill="#3a2c1c" opacity="0.6" />
          {/* Rivets aux 4 coins */}
          {[[-180, -180], [180, -180], [-180, 180], [180, 180]].map(([rx, ry], i) => (
            <g key={i} transform={`translate(${rx},${ry})`}>
              <circle r="10" fill="#141c26" stroke="#5a6270" strokeWidth="1.5" />
              <circle r="4" fill="#5a6270" />
            </g>
          ))}
          {/* Anneau chromé extérieur */}
          <circle r="180" fill="url(#sf-ring)" stroke="#0a0806" strokeWidth="3" />
          {/* Alcoves d'engrenages sur l'anneau */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const rad = (a * Math.PI) / 180;
            const cx = Math.cos(rad) * 165, cy = Math.sin(rad) * 165;
            return (
              <g key={a} transform={`translate(${cx},${cy}) rotate(${a})`}>
                <rect x="-8" y="-14" width="16" height="28" fill="#141c26" stroke="#0a0806" strokeWidth="1" />
                <circle cx="0" cy="0" r="8" fill="#3a4048" stroke="#0a0806" strokeWidth="1" />
                <circle cx="0" cy="0" r="4" fill="#5a6270" />
              </g>
            );
          })}
          {/* Porte proprement dite (disque intérieur) */}
          <circle r="140" fill="url(#sf-metal)" stroke="#0a0806" strokeWidth="3" />
          {/* Motif concentrique de la porte */}
          <circle r="130" fill="none" stroke="#3a4048" strokeWidth="1.5" />
          <circle r="110" fill="none" stroke="#3a4048" strokeWidth="1" />
          <circle r="90"  fill="none" stroke="#3a4048" strokeWidth="1" />

          {/* Le grand volant en croix au centre */}
          <g style={{ transformOrigin: "0px 0px", animation: done ? "sfWheelSpin 12s linear infinite" : "none" }}>
            <circle r="76" fill="none" stroke="#5a6270" strokeWidth="3" />
            <circle r="70" fill="#28303a" stroke="#0a0806" strokeWidth="2" />
            {[0, 45, 90, 135].map((a) => (
              <g key={a} transform={`rotate(${a})`}>
                <rect x="-6" y="-70" width="12" height="140" fill="url(#sf-metal)" stroke="#0a0806" strokeWidth="1" />
                {/* Poignée aux extrémités */}
                <circle cx="0" cy="-70" r="8" fill="#3a4048" stroke="#0a0806" strokeWidth="1" />
                <circle cx="0" cy="70" r="8" fill="#3a4048" stroke="#0a0806" strokeWidth="1" />
              </g>
            ))}
            {/* Bouton central rouge */}
            <circle r="14" fill="#8a1010" stroke="#0a0806" strokeWidth="2" />
            <circle r="10" fill="#e83820" />
            <circle r="4" fill="#ff8060">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="1.6s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Panneau plaque "C-3" au-dessus */}
          <g transform="translate(0,-230)">
            <rect x="-70" y="-16" width="140" height="32" fill="#e8dfc8" stroke="#3a2818" strokeWidth="1.5" />
            <text x="0" y="8" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="18" fontWeight="900" fill="#0a0806" letterSpacing="6">C-3</text>
          </g>
          {/* Symbole radiation / avertissement en bas */}
          <g transform="translate(0,220)">
            <circle r="22" fill="#e8dfc8" stroke="#0a0806" strokeWidth="1.5" />
            {[0, 120, 240].map((a) => (
              <path key={a} d="M-10 0 A 18 18 0 0 1 10 0 L 5 -14 L -5 -14 Z"
                fill="#0a0806" transform={`rotate(${a})`} />
            ))}
            <circle r="5" fill="#0a0806" />
            <text x="0" y="42" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fontWeight="800" fill="#8a1010" letterSpacing="1">DANGER · SORTIE SCELLÉE</text>
          </g>
        </g>

        {/* Grosses chaînes qui traversent la porte (verrouillée) */}
        {!done && (
          <>
            <path d="M240 60 L680 460" stroke="#2a2018" strokeWidth="16" strokeLinecap="round" opacity="0.8" />
            <path d="M240 60 L680 460" stroke="#5a4028" strokeWidth="12" strokeLinecap="round" opacity="0.6" />
            <path d="M680 60 L240 460" stroke="#2a2018" strokeWidth="16" strokeLinecap="round" opacity="0.8" />
            <path d="M680 60 L240 460" stroke="#5a4028" strokeWidth="12" strokeLinecap="round" opacity="0.6" />
            {/* Cadenas central */}
            <g transform="translate(450,260)">
              <rect x="-24" y="-12" width="48" height="36" rx="4" fill="#3a2818" stroke="#0a0806" strokeWidth="2" />
              <path d="M-14 -12 L-14 -22 Q0 -32 14 -22 L14 -12" fill="none" stroke="#5a4028" strokeWidth="5" strokeLinecap="round" />
              <circle r="4" fill="#0a0806" />
            </g>
          </>
        )}

        <style>{`@keyframes sfWheelSpin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
      </svg>

      <div style={{ maxWidth: 800, width: "100%", background: "#2a1408", border: "1px solid #8a1010", borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#ff5030" }}>
          ⚠ SORTIE C-3 · NIVEAU +2 · SCELLÉE DEPUIS 40 ANS
        </div>
        <p style={{ margin: "5px 0 0", fontSize: 13, color: "#c8b090", lineHeight: 1.5 }}>
          {done
            ? "Le volant tourne à vide. Quelque chose a changé au niveau -3 — la porte pourrait bientôt s'ouvrir."
            : "Chaînes soudées, cadenas indéchiffrable. Selon MARTINE, l'air dehors serait inhabitable. Mais qui a soudé la porte, et pourquoi ?"}
        </p>
      </div>

      <button onClick={() => onGo("elevator")}
        style={{ background: "#141b26", color: "#7fd8ff", border: "1px solid #3a80c8", borderRadius: 10, padding: "9px 20px", fontWeight: 700, cursor: "pointer", fontSize: 12.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
        ↕ Reprendre l'ascenseur
      </button>
    </div>
  );
}
