import { useState } from "react";

/* ============================================================
   JEU 3 — SCÈNE : « Le Réveil » — chambre N-27
   ------------------------------------------------------------
   Séquence narrative alternée écran noir / chambre, pour laisser
   la désorientation s'installer. Un clic n'importe où avance.
   Chambre : viewBox 1000×520. Dernier texte → bouton pour sortir.
   ============================================================ */
const STEPS = [
  { mode: "black", text: "Une lumière blanche, froide." },
  { mode: "black", text: "Un plafond bas en béton." },
  { mode: "room",  text: null },
  { mode: "black", text: "Tu ne connais pas cette pièce…" },
  { mode: "black", text: "Où es-tu ? Comment es-tu arrivé·e ici ? Rien ne te revient." },
  { mode: "room",  text: null },
  { mode: "black", text: "Juste un flash : MARTINE qui parle, un vertige, le noir." },
  { mode: "black", text: "Est-ce que tu as rêvé tout ça ?", big: true },
  { mode: "room",  text: "Ton téléphone sur la table est noir, muet. Tu essaies de l'allumer. Rien." },
  { mode: "room",  text: "Sur le mur, une affiche : « RÉSEAU M · Bienvenue, HABITANT N-27 ». Tu ne connais pas ce logo." },
  { mode: "room",  text: "Sur la porte : « N-27 · Habitant · Niveau 4 ». Il faut sortir voir." },
];

export default function BunkerAwake({ onGo }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const advance = () => { if (!isLast) setStep(step + 1); };

  if (current.mode === "black") {
    return (
      <div onClick={advance}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", width: "100%", height: "100%",
          background: "#000", cursor: "pointer", padding: 24, boxSizing: "border-box",
        }}>
        <p style={{
          color: "#e8eef5", textAlign: "center", margin: 0,
          fontFamily: "Georgia, serif",
          fontSize: current.big ? 32 : 18,
          lineHeight: 1.5,
          letterSpacing: current.big ? 1 : 0,
          maxWidth: 760,
          opacity: 0.95,
        }}>
          {current.text}
        </p>
        <div style={{ marginTop: 36, fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#5a6678", letterSpacing: 2 }}>
          CLIC POUR CONTINUER
        </div>
      </div>
    );
  }

  /* mode "room" */
  return (
    <div onClick={advance}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", height: "100%", padding: 8, boxSizing: "border-box", cursor: isLast ? "default" : "pointer" }}>
      <RoomSvg />

      <div style={{ maxWidth: 780, textAlign: "center", minHeight: 72 }}>
        {current.text ? (
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#c8d4e2", margin: 0, fontStyle: "italic" }}>
            « {current.text} »
          </p>
        ) : (
          <p style={{ fontSize: 13, color: "#5a6678", margin: 0, fontFamily: "ui-monospace,monospace", letterSpacing: 2 }}>
            CLIC POUR CONTINUER
          </p>
        )}
        {isLast && (
          <div style={{ marginTop: 14 }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => onGo("hub")} autoFocus
              style={{ background: "#5eff9e", color: "#06110b", border: "none", borderRadius: 10, padding: "12px 26px", fontWeight: 800, cursor: "pointer", fontSize: 14, fontFamily: "ui-monospace,monospace", letterSpacing: 2, boxShadow: "0 0 18px rgba(94,255,158,0.35)" }}>
              ▶ SORTIR DANS LE COULOIR
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* --------- Décor SVG de la chambre N-27 --------- */
function RoomSvg() {
  return (
    <svg viewBox="0 0 1000 520" preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", flex: 1, minHeight: 0 }}>
      <defs>
        <linearGradient id="ba-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2f38" />
          <stop offset="100%" stopColor="#141820" />
        </linearGradient>
        <linearGradient id="ba-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1e26" />
          <stop offset="100%" stopColor="#050810" />
        </linearGradient>
        <radialGradient id="ba-light" cx="50%" cy="0%" r="60%">
          <stop offset="0%" stopColor="#f0f4ff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#f0f4ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="520" fill="url(#ba-wall)" />
      <rect x="0" y="0" width="1000" height="70" fill="#1a1e26" />
      <rect x="340" y="24" width="320" height="14" rx="3" fill="#e8eef5" opacity="0.85" />
      <ellipse cx="500" cy="42" rx="260" ry="200" fill="url(#ba-light)" />
      <rect x="0" y="400" width="1000" height="120" fill="url(#ba-floor)" />
      <path d="M0 400 L1000 400" stroke="#3a4048" strokeWidth="1" />
      {[80, 200, 380, 620, 800, 920].map((x) => (
        <path key={x} d={`M${x} 400 L${x + (x - 500) * 0.13} 520`} stroke="#0a0e14" strokeWidth="1" opacity="0.6" />
      ))}
      <path d="M0 460 L1000 460" stroke="#0a0e14" strokeWidth="0.6" opacity="0.5" />

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

      {/* ÉTAGÈRE MURALE */}
      <g transform="translate(240,220)">
        <rect x="0" y="0" width="140" height="4" fill="#3a4048" />
        <rect x="0" y="60" width="140" height="4" fill="#3a4048" />
        {[[6, "#5a3818", 30], [18, "#8a3820", 28], [30, "#5a2818", 32], [44, "#8a5030", 26], [58, "#3a2818", 30], [72, "#5a4028", 28]].map(([x, c, h], i) => (
          <rect key={i} x={x} y={-h} width="10" height={h} fill={c} stroke="#0a0806" strokeWidth="0.3" />
        ))}
        <rect x="95" y="-20" width="14" height="20" rx="1" fill="#c8b090" stroke="#3a2818" strokeWidth="0.5" />
        <rect x="115" y="-24" width="20" height="24" fill="#e8dfc8" stroke="#3a2818" strokeWidth="0.6" />
        <rect x="118" y="-21" width="14" height="18" fill="#5a6270" opacity="0.7" />
        {[[10, "#5a4028", 26], [22, "#8a5030", 24], [34, "#3a2818", 28]].map(([x, c, h], i) => (
          <rect key={`b${i}`} x={x} y={64 - h + 64} width="10" height={h} fill={c} stroke="#0a0806" strokeWidth="0.3" />
        ))}
        <rect x="80" y="72" width="18" height="20" fill="#3a2010" stroke="#0a0806" strokeWidth="0.5" />
        <path d="M89 72 q-6 -12 -2 -22 M89 72 q6 -14 4 -24 M89 72 q0 -18 -6 -22" stroke="#4a6a2a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>

      {/* POSTER MARTINE */}
      <g transform="translate(440,110)">
        <rect x="0" y="0" width="130" height="90" fill="#e8dfc8" stroke="#3a2818" strokeWidth="1.5" />
        <rect x="6" y="6" width="118" height="20" fill="#0e1a30" />
        <text x="65" y="20" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fontWeight="800" fill="#5eff9e" letterSpacing="2">◈ RÉSEAU M</text>
        <text x="65" y="42" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill="#3a2010">Bienvenue, HABITANT N-27</text>
        <text x="65" y="56" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#8a5030">Niveau 4 · Secteur H</text>
        <text x="65" y="74" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fontStyle="italic" fill="#8a5030">La surface est encore inhabitable.</text>
        <text x="65" y="84" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="5" fill="#5eff9e">— MARTINE —</text>
      </g>

      {/* RADIATEUR */}
      <g transform="translate(440,210)">
        <rect x="0" y="0" width="130" height="20" fill="#5a6270" stroke="#0a0e14" strokeWidth="1" />
        {[10, 25, 40, 55, 70, 85, 100, 115].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="20" stroke="#0a0e14" strokeWidth="0.6" />
        ))}
        <circle cx="126" cy="10" r="4" fill="#c8a848" stroke="#3a2010" strokeWidth="0.5" />
      </g>

      {/* LIT */}
      <g transform="translate(200,340)">
        <rect x="0" y="0" width="360" height="80" fill="#3a4048" stroke="#0a0e14" strokeWidth="2" />
        <rect x="0" y="0" width="360" height="6" fill="#5a6270" />
        <path d="M4 8 Q90 -6 180 12 Q270 26 356 8 L356 44 Q270 52 180 44 Q90 38 4 44 Z" fill="#5a6270" />
        <path d="M40 10 q10 4 20 -2 M120 14 q10 6 20 0 M240 18 q10 4 20 -2 M320 12 q10 6 20 0" stroke="#3a4048" strokeWidth="0.6" fill="none" opacity="0.7" />
        <rect x="8" y="6" width="80" height="26" rx="4" fill="#e8eef5" stroke="#8a9098" strokeWidth="0.6" />
        <path d="M12 12 q10 4 30 0 q20 -4 40 4" stroke="#8a9098" strokeWidth="0.4" fill="none" opacity="0.6" />
        <rect x="4" y="80" width="10" height="34" fill="#1a1e26" />
        <rect x="346" y="80" width="10" height="34" fill="#1a1e26" />
      </g>

      {/* BUREAU + CHAISE + LAMPE */}
      <g transform="translate(620,360)">
        <rect x="0" y="0" width="140" height="8" fill="#5a4028" stroke="#1a0e08" strokeWidth="1" />
        <rect x="4" y="8" width="10" height="52" fill="#3a2818" />
        <rect x="126" y="8" width="10" height="52" fill="#3a2818" />
        <rect x="20" y="12" width="100" height="16" fill="#3a2818" stroke="#0a0806" strokeWidth="0.5" />
        <circle cx="70" cy="20" r="1.6" fill="#c8a848" />
        <rect x="50" y="70" width="40" height="6" fill="#3a4048" />
        <rect x="52" y="76" width="4" height="26" fill="#3a4048" />
        <rect x="84" y="76" width="4" height="26" fill="#3a4048" />
        <rect x="50" y="40" width="40" height="4" fill="#3a4048" />
        <rect x="50" y="44" width="4" height="26" fill="#3a4048" />
        <circle cx="30" cy="0" r="3" fill="#3a4048" />
        <line x1="30" y1="0" x2="46" y2="-24" stroke="#5a6270" strokeWidth="1.6" />
        <line x1="46" y1="-24" x2="58" y2="-14" stroke="#5a6270" strokeWidth="1.6" />
        <path d="M52 -20 L64 -8 L54 -4 Z" fill="#c8a848" stroke="#3a2010" strokeWidth="0.5" />
        <circle cx="58" cy="-8" r="4" fill="#ffd870" opacity="0.6" />
        {/* Téléphone noir, écran éteint, sur le bureau */}
        <rect x="88" y="-6" width="26" height="4" rx="1" fill="#0a0e14" stroke="#3a2010" strokeWidth="0.5" />
        <rect x="90" y="-5" width="22" height="2" fill="#1a1e26" />
      </g>

      {/* GRANDE PORTE */}
      <g transform="translate(820,180)">
        <rect x="0" y="0" width="140" height="240" fill="#5a4028" stroke="#0a0806" strokeWidth="3" />
        <rect x="4" y="4" width="132" height="232" fill="#4a3020" />
        <rect x="14" y="14" width="112" height="80" fill="none" stroke="#3a2010" strokeWidth="1" />
        <rect x="14" y="106" width="112" height="120" fill="none" stroke="#3a2010" strokeWidth="1" />
        <circle cx="118" cy="118" r="5" fill="#c8a848" stroke="#3a2010" strokeWidth="0.6" />
        <rect x="26" y="34" width="88" height="30" fill="#e8eef5" stroke="#3a2818" strokeWidth="1.5" />
        <text x="70" y="46" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fontWeight="800" fill="#0a0806" letterSpacing="1">N-27</text>
        <text x="70" y="58" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6.5" fill="#5a4028">HABITANT · N4</text>
        <circle cx="70" cy="86" r="3" fill="#5eff9e">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
        </circle>
      </g>

      <ellipse cx="380" cy="440" rx="120" ry="14" fill="#5a3818" opacity="0.55" />
    </svg>
  );
}
