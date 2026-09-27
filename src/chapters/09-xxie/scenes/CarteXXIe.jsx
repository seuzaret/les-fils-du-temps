/* ============================================================
   CHAPITRE 10 — Carte : la convergence en un seul objet
   Les 2 tableaux ne sont pas géographiques : ils décrivent la
   même donnée à deux endroits — ta poche (chambre) et le hangar
   climatisé (datacenter) où elle vit réellement.
   ============================================================ */

const ETAPES = [
  { tab: 0, nom: "Ta chambre",      sous: "tout dans la poche",       emoji: "📱" },
  { tab: 1, nom: "Canapé du soir",  sous: "fil, JT, deepfakes",       emoji: "🛋️" },
  { tab: 2, nom: "Le datacenter",   sous: "serveurs à des km",        emoji: "🗄️" },
];

export default function CarteXXIe({ tab = 0 }) {
  return (
    <svg viewBox="0 0 700 440" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="c10-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1420" />
          <stop offset="55%" stopColor="#1a2438" />
          <stop offset="100%" stopColor="#0a1220" />
        </linearGradient>
        <linearGradient id="c10-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5eff9e" />
          <stop offset="100%" stopColor="#7fd8ff" />
        </linearGradient>
        <radialGradient id="c10-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5eff9e" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#5eff9e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="c10-cloud" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#7fd8ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7fd8ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* fond ciel numérique + grille discrète */}
      <rect width="700" height="440" fill="url(#c10-bg)" />
      {/* grille numérique en filigrane */}
      {[100, 200, 300, 400, 500, 600].map((x, i) => (
        <line key={`v${i}`} x1={x} y1="80" x2={x} y2="360" stroke="#26324a" strokeWidth="0.6" opacity="0.5" />
      ))}
      {[120, 180, 240, 300].map((y, i) => (
        <line key={`h${i}`} x1="60" y1={y} x2="640" y2={y} stroke="#26324a" strokeWidth="0.6" opacity="0.5" />
      ))}
      {/* petits paquets de données qui défilent */}
      {[[120, 140], [340, 200], [520, 260], [200, 300], [560, 160]].map(([x, y], i) => (
        <circle key={`p${i}`} cx={x} cy={y} r="1.5" fill="#5eff9e" opacity="0.55">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur={`${1.5 + (i % 3) * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* titre */}
      <text x="350" y="46" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="20" fill="#c8d4e2" letterSpacing="2">
        La donnée n'est plus dans l'objet
      </text>
      <text x="350" y="68" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="11" fill="#7fd8ff" letterSpacing="3">
        AUJOURD'HUI · 2025
      </text>

      {/* le nuage central qui relie les deux lieux */}
      <ellipse cx="350" cy="200" rx="90" ry="34" fill="url(#c10-cloud)" />
      <text x="350" y="200" textAnchor="middle" fontSize="26" opacity="0.9">☁️</text>
      <text x="350" y="228" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fill="#7fd8ff" letterSpacing="2">
        LE « CLOUD »
      </text>

      {/* lien horizontal entre les deux étapes, qui passe par le nuage */}
      <path d="M 160 200 Q 260 190 350 200 Q 440 210 540 200" stroke="url(#c10-line)"
        strokeWidth="2.5" fill="none" strokeDasharray="4 4" opacity="0.7">
        <animate attributeName="stroke-dashoffset" values="0;-16" dur="1.4s" repeatCount="indefinite" />
      </path>

      {/* les 3 étapes réparties autour du nuage */}
      {ETAPES.map((e, i) => {
        const ici = e.tab === tab;
        const x = i === 0 ? 130 : i === 1 ? 350 : 570;
        return (
          <g key={e.tab}>
            {/* halo si actif */}
            {ici && <circle cx={x} cy="200" r="42" fill="url(#c10-glow)" style={{ animation: "glow 2s ease-in-out infinite" }} />}

            {/* point sur la ligne */}
            <circle cx={x} cy="200" r={ici ? 12 : 8} fill={ici ? "#5eff9e" : "#3a5a72"} stroke="#c8d4e2" strokeWidth="2" />
            {ici && <circle cx={x} cy="200" r="18" fill="none" stroke="#5eff9e" strokeWidth="2" style={{ animation: "pulse 1.6s ease-in-out infinite" }} />}

            {/* carte descriptive */}
            <g transform={`translate(${x},280)`}>
              <rect x="-80" y="0" width="160" height="86" rx="8"
                fill={ici ? "rgba(94,255,158,0.14)" : "rgba(90,122,144,0.14)"}
                stroke={ici ? "#5eff9e" : "#5a7a90"} strokeWidth={ici ? 2 : 1} />
              <text x="0" y="30" textAnchor="middle" fontSize="26">{e.emoji}</text>
              <text x="0" y="54" textAnchor="middle" fontFamily="Palatino, Georgia, serif"
                fontSize={ici ? 15 : 13} fontWeight={ici ? 700 : 400}
                fill={ici ? "#5eff9e" : "#c8d4e2"}>{e.nom}</text>
              <text x="0" y="72" textAnchor="middle" fontFamily="ui-monospace,monospace"
                fontSize="9" fill={ici ? "#c8d4e2" : "#8a9aa8"}>{e.sous}</text>
            </g>

            {ici && (
              <text x={x} y="404" textAnchor="middle" fontFamily="ui-monospace,monospace"
                fontSize="11" fill="#5eff9e" fontWeight="700">◉ tu es ici</text>
            )}
          </g>
        );
      })}

      {/* clin d'œil pédagogique */}
      <text x="350" y="424" textAnchor="middle" fontFamily="Palatino, Georgia, serif"
        fontStyle="italic" fontSize="11" fill="#8fa3bd" opacity="0.85">
        Le support ne disparaît pas — il vit chez quelqu'un d'autre.
      </text>
    </svg>
  );
}
