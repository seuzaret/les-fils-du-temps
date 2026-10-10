/* ============================================================
   JEU 3 — ÉPILOGUE
   ------------------------------------------------------------
   Quatre actes animés, enchaînés par bouton :
     1. LE RAPPORT   — tu remets au Juge Vez les 3 dossiers.
     2. L'OUVERTURE  — la grande porte scellée craque et s'ouvre.
     3. L'AIR LIBRE  — surface, soleil, horizon.
     4. L'HÉRITAGE   — carte-postale finale : la fiche de la pièce
                       que tu as laissée à Jorge, sortie de sa
                       cellule, qui classe à ton tour.
   Dernière action : "Retour au menu" → onExit().
   ============================================================ */
import { useState, useEffect } from "react";

function useSequence(steps, active = true) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!active) return;
    setT(0);
    const ids = steps.map((delay, i) => setTimeout(() => setT(i + 1), delay));
    return () => ids.forEach(clearTimeout);
  }, [active, JSON.stringify(steps)]);
  return t;
}

export default function EpilogueJeu3({ onDone, prenom = "Chronaute" }) {
  const [acte, setActe] = useState(0);
  const actes = [
    { Comp: Acte1Rapport,   title: "I. LE RAPPORT",  cta: "Continuer ▸" },
    { Comp: Acte2Ouverture, title: "II. L'OUVERTURE", cta: "Continuer ▸" },
    { Comp: Acte3AirLibre,  title: "III. L'AIR LIBRE", cta: "Continuer ▸" },
    { Comp: Acte4Heritage,  title: "IV. L'HÉRITAGE", cta: "Terminer ▸" },
  ];
  const A = actes[acte];
  const Comp = A.Comp;
  const atLast = acte === actes.length - 1;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#050810", zIndex: 60, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "Palatino, Georgia, serif", color: "#e8eef5" }}>
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 4, color: "#c8a848", marginBottom: 10 }}>
        🌑 LE PUITS · ÉPILOGUE · {A.title}
      </div>
      <div style={{ width: "100%", maxWidth: 1000 }}>
        <Comp prenom={prenom} />
      </div>
      <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#8a7050" }}>
          {acte + 1} / {actes.length}
        </div>
        <button onClick={() => (atLast ? onDone?.() : setActe(acte + 1))}
          style={{ background: "#c8a848", color: "#1a0e08", border: "none", borderRadius: 8, padding: "10px 24px", fontFamily: "ui-monospace,monospace", fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: 2 }}>
          {A.cta}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   ACTE I · LE RAPPORT — bureau de Vez, remise des dossiers
   ============================================================ */
function Acte1Rapport({ prenom }) {
  const t = useSequence([400, 1200, 2200, 3200]);
  return (
    <svg viewBox="0 0 1000 460" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="ep1-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1408" />
          <stop offset="100%" stopColor="#050408" />
        </linearGradient>
        <linearGradient id="ep1-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a3818" />
          <stop offset="100%" stopColor="#2a1808" />
        </linearGradient>
      </defs>
      <rect width="1000" height="460" fill="url(#ep1-wall)" />
      {/* Lampe de bureau avec cône de lumière chaude */}
      <ellipse cx="500" cy="300" rx="280" ry="140" fill="#c8a848" opacity="0.1" />
      <ellipse cx="500" cy="300" rx="180" ry="100" fill="#ffd870" opacity="0.08" />
      <g transform="translate(380,120)">
        <line x1="0" y1="0" x2="0" y2="60" stroke="#5a4028" strokeWidth="2" />
        <path d="M-20 60 L20 60 L10 90 L-10 90 Z" fill="#8a5030" stroke="#1a0e08" strokeWidth="1" />
        <ellipse cx="0" cy="92" rx="12" ry="3" fill="#ffd870" opacity="0.9">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="3.5s" repeatCount="indefinite" />
        </ellipse>
      </g>
      {/* Bureau en bois massif */}
      <rect x="100" y="310" width="800" height="20" fill="url(#ep1-wood)" stroke="#1a0e08" strokeWidth="2" />
      <rect x="140" y="330" width="40" height="90" fill="#2a1808" stroke="#1a0e08" strokeWidth="1" />
      <rect x="820" y="330" width="40" height="90" fill="#2a1808" stroke="#1a0e08" strokeWidth="1" />
      {/* Trois dossiers posés sur le bureau */}
      {["gutenberg", "chappe", "marconi"].map((id, i) => {
        const x = 380 + i * 100;
        const appear = t > i;
        return (
          <g key={id} transform={`translate(${x},300)`} opacity={appear ? 1 : 0}
            style={{ transition: "opacity 0.4s" }}>
            <rect x="-30" y="-6" width="60" height="12" fill="#8a5030" stroke="#1a0e08" strokeWidth="0.8" />
            <rect x="-28" y="-18" width="56" height="14" fill="#c8a848" stroke="#5a3818" strokeWidth="0.6" />
            <text x="0" y="-8" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fontWeight="800" fill="#1a0e08">
              {id.toUpperCase()}
            </text>
            {/* Petit tampon rouge VÉRIFIÉ */}
            <g transform="rotate(-14)">
              <rect x="-18" y="-14" width="36" height="10" fill="none" stroke="#c81010" strokeWidth="1.2" />
              <text x="0" y="-6" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fontWeight="900" fill="#c81010">VÉRIFIÉ</text>
            </g>
          </g>
        );
      })}
      {/* Juge Vez à droite, enfoncée dans son fauteuil */}
      <g transform="translate(760,250)">
        <ellipse cx="0" cy="80" rx="20" ry="4" fill="#000" opacity="0.4" />
        <rect x="-20" y="20" width="40" height="60" fill="#2a1808" stroke="#1a0e08" strokeWidth="0.8" />
        <path d="M-24 20 Q-26 0 -14 -6 L14 -6 Q26 0 24 20 Z" fill="#5a3818" stroke="#1a0e08" strokeWidth="0.8" />
        <circle cx="0" cy="-20" r="14" fill="#c8a888" stroke="#5a3018" strokeWidth="0.8" />
        <path d="M-12 -24 q0 -14 12 -16 q12 -2 14 6 q-2 10 -6 14 L-6 -22 Z" fill="#c8a848" />
        <circle cx="-4" cy="-20" r="1.3" fill="#0a0806" />
        <circle cx="4" cy="-20" r="1.3" fill="#0a0806" />
        <path d="M-3 -14 Q0 -11 3 -14" stroke="#5a2818" strokeWidth="0.9" fill="none" />
      </g>
      {/* Toi, à gauche */}
      <g transform="translate(220,250)">
        <ellipse cx="0" cy="80" rx="18" ry="4" fill="#000" opacity="0.4" />
        <path d="M-14 20 Q-18 0 -4 -6 L4 -6 Q18 0 14 20 Z" fill="#28303a" stroke="#1a0e08" strokeWidth="0.8" />
        <rect x="-6" y="20" width="12" height="60" fill="#1a1408" />
        <circle cx="0" cy="-16" r="12" fill="#c8a888" stroke="#5a3018" strokeWidth="0.8" />
        <path d="M-10 -18 q0 -12 10 -14 q10 -2 12 4 q-2 8 -4 10 L-4 -18 Z" fill="#5a3818" />
        <circle cx="-3" cy="-16" r="1.1" fill="#0a0806" />
        <circle cx="3" cy="-16" r="1.1" fill="#0a0806" />
      </g>
      {/* Bulle de dialogue qui apparaît tardivement */}
      {t > 3 && (
        <g transform="translate(500,80)">
          <rect x="-280" y="0" width="560" height="40" rx="10" fill="#141008" stroke="#c8a848" strokeWidth="1.2" />
          <text x="0" y="18" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="12" fill="#e8dfc8">
            Vez te regarde longuement : « Tu as fait ton travail, {prenom}.
          </text>
          <text x="0" y="34" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="12" fill="#e8dfc8">
            Il reste à faire le mien — rouvrir le Puits à ce qu'il a oublié. »
          </text>
        </g>
      )}
    </svg>
  );
}

/* ============================================================
   ACTE II · L'OUVERTURE — la grande porte scellée se descelle
   ============================================================ */
function Acte2Ouverture() {
  const t = useSequence([600, 1600, 2800, 4000]);
  const opened = t >= 3;
  const sparks = t >= 2;
  return (
    <svg viewBox="0 0 1000 460" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="ep2-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a24" />
          <stop offset="100%" stopColor="#050810" />
        </linearGradient>
        <radialGradient id="ep2-light" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd870" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffd870" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="460" fill="url(#ep2-wall)" />
      {/* Halo chaud qui monte quand la porte s'ouvre */}
      {opened && <ellipse cx="500" cy="230" rx="340" ry="200" fill="url(#ep2-light)" />}
      {/* Encadrement en pierre massive */}
      <rect x="200" y="80" width="600" height="340" fill="#28303a" stroke="#0a0806" strokeWidth="4" />
      {/* Linteau avec inscription */}
      <rect x="200" y="60" width="600" height="30" fill="#5a4028" stroke="#1a0e08" strokeWidth="2" />
      <text x="500" y="80" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="11" fontWeight="700" fill="#c8a848" letterSpacing="6">
        SORTIE C-3 · SCELLÉE EN 2047
      </text>
      {/* Deux battants qui glissent quand opened */}
      <g style={{ transition: "transform 1.4s cubic-bezier(0.3,0,0.3,1)",
        transform: opened ? "translateX(-180px)" : "translateX(0)" }}>
        <rect x="208" y="92" width="294" height="320" fill="#3a2818" stroke="#0a0806" strokeWidth="2" />
        {/* Rivets */}
        {[[240, 120], [240, 220], [240, 320], [460, 120], [460, 220], [460, 320]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4" fill="#5a4028" stroke="#0a0806" strokeWidth="0.6" />
        ))}
        {/* Soudures qui sautent (étincelles) */}
        {sparks && [[220, 150], [220, 250], [220, 350]].map(([cx, cy], i) => (
          <g key={i} transform={`translate(${cx},${cy})`}>
            <circle r="6" fill="#ffd870" opacity={opened ? 0 : 1}>
              <animate attributeName="r" values="2;10;2" dur="0.4s" repeatCount="3" />
              <animate attributeName="opacity" values="0;1;0" dur="0.4s" repeatCount="3" />
            </circle>
          </g>
        ))}
      </g>
      <g style={{ transition: "transform 1.4s cubic-bezier(0.3,0,0.3,1)",
        transform: opened ? "translateX(180px)" : "translateX(0)" }}>
        <rect x="498" y="92" width="294" height="320" fill="#3a2818" stroke="#0a0806" strokeWidth="2" />
        {[[540, 120], [540, 220], [540, 320], [760, 120], [760, 220], [760, 320]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4" fill="#5a4028" stroke="#0a0806" strokeWidth="0.6" />
        ))}
        {sparks && [[780, 150], [780, 250], [780, 350]].map(([cx, cy], i) => (
          <g key={i} transform={`translate(${cx},${cy})`}>
            <circle r="6" fill="#ffd870" opacity={opened ? 0 : 1}>
              <animate attributeName="r" values="2;10;2" dur="0.4s" repeatCount="3" />
              <animate attributeName="opacity" values="0;1;0" dur="0.4s" repeatCount="3" />
            </circle>
          </g>
        ))}
      </g>
      {/* Fente centrale vide quand ouverte : on voit un paysage lumineux */}
      {opened && (
        <g>
          <rect x="320" y="92" width="360" height="320" fill="#0a1428" />
          {/* Ciel bleu + soleil éblouissant */}
          <rect x="320" y="92" width="360" height="200" fill="#7fb0ff" />
          <ellipse cx="500" cy="230" rx="60" ry="60" fill="#ffd870">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
          </ellipse>
          {/* Ligne d'horizon avec silhouette d'herbes */}
          <rect x="320" y="292" width="360" height="120" fill="#5a7a3a" />
          <path d="M320 292 L380 282 L420 288 L480 278 L540 290 L600 284 L680 292 Z" fill="#8aff70" opacity="0.6" />
        </g>
      )}
      {/* Dialogue haut */}
      <text x="500" y="40" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="14" fill="#c8a848" fontStyle="italic">
        {opened ? "La soudure a sauté. Il entre un air qu'on n'avait jamais respiré, ici." : "Quarante ans de soudures craquent sous le chalumeau de Yol."}
      </text>
    </svg>
  );
}

/* ============================================================
   ACTE III · L'AIR LIBRE — surface, soleil
   ============================================================ */
function Acte3AirLibre() {
  const t = useSequence([500, 1600, 2800]);
  return (
    <svg viewBox="0 0 1000 460" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="ep3-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fb0ff" />
          <stop offset="100%" stopColor="#ffd870" />
        </linearGradient>
        <linearGradient id="ep3-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8aff70" />
          <stop offset="100%" stopColor="#3a5a1a" />
        </linearGradient>
      </defs>
      <rect width="1000" height="300" fill="url(#ep3-sky)" />
      <rect y="300" width="1000" height="160" fill="url(#ep3-grass)" />
      {/* Soleil */}
      <circle cx="800" cy="100" r="55" fill="#ffd870" opacity="0.9">
        <animate attributeName="r" values="52;58;52" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="800" cy="100" r="90" fill="#ffd870" opacity="0.15" />
      {/* Nuages */}
      {[[200, 80], [550, 60], [900, 50]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          <ellipse cx="0" cy="0" rx="40" ry="12" fill="#e8eef5" opacity="0.85" />
          <ellipse cx="-20" cy="4" rx="20" ry="8" fill="#e8eef5" opacity="0.85" />
          <ellipse cx="20" cy="4" rx="22" ry="8" fill="#e8eef5" opacity="0.85" />
        </g>
      ))}
      {/* Oiseaux */}
      {t > 0 && (
        <g>
          {[[300, 140], [340, 130], [380, 140]].map(([cx, cy], i) => (
            <path key={i} d={`M${cx} ${cy} q6 -6 12 0 q6 -6 12 0`} stroke="#1a1408" strokeWidth="1.4" fill="none">
              <animate attributeName="transform" type="translate" from="0 0" to="400 -40" dur="12s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            </path>
          ))}
        </g>
      )}
      {/* Herbes au vent */}
      {[150, 220, 310, 460, 560, 710, 830].map((x, i) => (
        <path key={i} d={`M${x} 420 q-4 -20 2 -40 q6 20 2 40`} stroke="#2a4a0a" strokeWidth="1.5" fill="none" opacity="0.8">
          <animate attributeName="d"
            values={`M${x} 420 q-4 -20 2 -40 q6 20 2 40; M${x} 420 q-6 -18 4 -38 q4 20 2 40; M${x} 420 q-4 -20 2 -40 q6 20 2 40`}
            dur={`${2.4 + (i % 3) * 0.4}s`} repeatCount="indefinite" />
        </path>
      ))}
      {/* Silhouettes des premiers habitants qui sortent, en file */}
      {t > 1 && (
        <g>
          {[0, 1, 2, 3, 4].map((i) => {
            const x = 500 - i * 36;
            return (
              <g key={i} transform={`translate(${x},370)`}>
                <ellipse cx="0" cy="10" rx="8" ry="2" fill="#000" opacity="0.3" />
                <path d="M-8 10 Q-10 -14 -4 -20 L4 -20 Q10 -14 8 10 Z" fill={i === 0 ? "#28303a" : "#5a4028"} stroke="#0a0806" strokeWidth="0.6" />
                <circle cx="0" cy="-26" r="6" fill="#c8a888" stroke="#5a3018" strokeWidth="0.5" />
              </g>
            );
          })}
        </g>
      )}
      {/* Texte */}
      {t > 2 && (
        <g>
          <rect x="100" y="330" width="800" height="60" rx="8" fill="#141008" opacity="0.75" stroke="#c8a848" strokeWidth="1" />
          <text x="500" y="358" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="14" fontStyle="italic" fill="#e8dfc8">
            Les habitants sortent un à un. Certains se taisent, d'autres pleurent.
          </text>
          <text x="500" y="378" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="14" fontStyle="italic" fill="#e8dfc8">
            Yol, le garde de la porte, reste au seuil. « Finalement, c'était pas pour toujours. »
          </text>
        </g>
      )}
    </svg>
  );
}

/* ============================================================
   ACTE IV · L'HÉRITAGE — Jorge sorti, fiche posée pour toi
   ============================================================ */
function Acte4Heritage({ prenom }) {
  const t = useSequence([600, 1800, 3200]);
  return (
    <svg viewBox="0 0 1000 460" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="ep4-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1808" />
          <stop offset="100%" stopColor="#0a0806" />
        </linearGradient>
      </defs>
      <rect width="1000" height="460" fill="url(#ep4-wall)" />
      {/* Lampe pupitre */}
      <ellipse cx="500" cy="300" rx="300" ry="140" fill="#c8a848" opacity="0.12" />
      {/* Bureau */}
      <rect x="150" y="300" width="700" height="22" fill="#5a3818" stroke="#1a0e08" strokeWidth="1.5" />
      {/* Fiche posée au centre */}
      <g transform="translate(500,290) rotate(-3)">
        <rect x="-100" y="-70" width="200" height="140" fill="#f0e4c8" stroke="#5a4028" strokeWidth="1.5" />
        <circle cx="0" cy="-70" r="4" fill="#141008" opacity="0.6" />
        <text x="0" y="-50" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#8a5030" letterSpacing="2">
          À — {prenom.toUpperCase()}
        </text>
        <line x1="-80" y1="-42" x2="80" y2="-42" stroke="#8a5030" strokeDasharray="2 2" />
        <text x="0" y="-24" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="10" fill="#1a0e08">
          Trois dates. Trois lieux.
        </text>
        <text x="0" y="-8" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="10" fill="#1a0e08">
          Trois noms rendus à qui ils reviennent.
        </text>
        <text x="0" y="16" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="10" fill="#1a0e08" fontStyle="italic">
          Les archives recommencent à dire vrai.
        </text>
        <text x="0" y="36" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="10" fill="#1a0e08" fontStyle="italic">
          Garde l'œil ouvert, où que tu ailles.
        </text>
        <text x="0" y="58" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fill="#5a2010" fontWeight="800">
          — Jorge
        </text>
      </g>
      {/* Silhouette de Jorge qui s'éloigne, à droite, après t=1 */}
      {t > 1 && (
        <g transform="translate(820,330)" opacity="0.7" style={{ transition: "opacity 1.2s" }}>
          <path d="M-14 20 Q-18 0 -4 -6 L4 -6 Q18 0 14 20 Z" fill="#5a4028" stroke="#1a0e08" strokeWidth="0.6" />
          <rect x="-6" y="20" width="12" height="60" fill="#28303a" />
          <circle cx="0" cy="-16" r="11" fill="#c8a888" stroke="#5a3018" strokeWidth="0.6" />
          {/* chauve */}
          <path d="M-9 -18 Q0 -22 9 -18" stroke="#5a3018" strokeWidth="0.4" fill="none" opacity="0.6" />
          {/* barbe */}
          <path d="M-8 -10 Q-9 -2 -4 1 Q0 2 4 1 Q9 -2 8 -10" fill="#8a8070" opacity="0.9" />
          <ellipse cx="0" cy="86" rx="18" ry="3" fill="#000" opacity="0.4" />
        </g>
      )}
      {/* Carte "FIN" en bas */}
      {t > 2 && (
        <g>
          <rect x="300" y="400" width="400" height="46" rx="6" fill="#141008" stroke="#c8a848" strokeWidth="1.2" />
          <text x="500" y="420" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="12" letterSpacing="4" fill="#c8a848" fontWeight="800">
            FIN DU JEU 3 · LE DISCERNEMENT
          </text>
          <text x="500" y="438" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="11" fill="#8a7050" fontStyle="italic">
            Ce qu'une archive garde dépend de celui qui la regarde.
          </text>
        </g>
      )}
    </svg>
  );
}
