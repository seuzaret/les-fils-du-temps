/* ============================================================
   NOTE D'AL3X1A — modale plein écran qui affiche une note
   ============================================================
   Une note apparaît stylisée selon le SUPPORT caractéristique de
   l'époque où elle a été trouvée : paroi de grotte, tablette
   d'argile, papyrus, manuscrit, gazette, télégramme, cassette,
   CD, smartphone. Le rendu (couleurs, police, cadrage) renforce
   la pédagogie sur les supports.
   ============================================================ */

/* Style visuel de chaque support. */
const STYLES = {
  "peinture rupestre":         { bg: "#3a2818", ink: "#c8632a", border: "#8a5828", font: "Georgia, serif", label: "Peinture rupestre — Grande Paroi" },
  "gravure sur mégalithe":     { bg: "#5a5a5a", ink: "#1a1a1a", border: "#3a3a3a", font: "Georgia, serif", label: "Gravure — pierre levée" },
  "tablette d'argile cunéiforme": { bg: "#a8825a", ink: "#3a2010", border: "#5a3820", font: "Georgia, serif", label: "Tablette d'argile — cunéiforme" },
  "rouleau de papyrus":        { bg: "#e8d0a0", ink: "#5a2818", border: "#8a5828", font: "Palatino, Georgia, serif", label: "Papyrus — encre de suie" },
  "enluminure marginale":      { bg: "#f0e8d0", ink: "#5a1818", border: "#c8a848", font: "Palatino, Georgia, serif", label: "Enluminure — marge d'un manuscrit" },
  "gazette imprimée":          { bg: "#e8dfc8", ink: "#1a1a1a", border: "#5a3818", font: "Georgia, serif", label: "Gazette — atelier de Gutenberg" },
  "télégramme Morse":          { bg: "#c8bfa0", ink: "#0a0a0a", border: "#5a3818", font: "ui-monospace, monospace", label: "Télégramme — bureau des postes" },
  "cassette audio":            { bg: "#1a1a1a", ink: "#e8e8e8", border: "#c8a848", font: "ui-monospace, monospace", label: "Cassette audio — bande magnétique" },
  "CD gravé":                  { bg: "#0a1420", ink: "#7fd8ff", border: "#3a80c8", font: "ui-monospace, monospace", label: "CD gravé — piste .txt" },
  "smartphone":                { bg: "#0a0a10", ink: "#a8f0a0", border: "#3a5a48", font: "ui-monospace, monospace", label: "Note mémo — smartphone" },
};

/* ─── Petits croquis "stylo-bille" d'Al3x1A ─── Un croquis par support,
   dessiné à la couleur d'encre du support. Lignes à main levée, sans
   remplissage, avec quelques annotations manuscrites pour la chaleur. */
function SketchPainting({ ink }) {
  const s = { stroke: ink, strokeWidth: 1.4, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <svg viewBox="0 0 220 110" style={{ display: "block", width: "100%", height: "auto", maxHeight: 110 }}>
      {/* Main en négatif (pochoir à l'ocre) */}
      <g transform="translate(42,60)">
        <path d="M-14 20 Q-14 -4 -6 -10 L-6 -22 Q-4 -24 -2 -22 L-2 -6 L2 -6 L2 -26 Q4 -28 6 -26 L6 -6 L10 -6 L10 -22 Q12 -24 14 -22 L14 -6 L18 -6 L18 -14 Q20 -16 22 -14 L22 10 Q22 22 10 24 L-6 24 Q-14 22 -14 20 Z" {...s} />
      </g>
      {/* Gouttelettes d'ocre pulvérisées */}
      {[[18,30],[70,22],[72,48],[32,80],[16,66]].map(([cx,cy],i)=> <circle key={i} cx={cx} cy={cy} r={1} fill={ink} opacity="0.7" />)}
      {/* Bison stylisé */}
      <g transform="translate(140,60)">
        <path d="M-40 10 Q-44 -8 -30 -14 Q-10 -18 10 -14 Q30 -10 42 -4 Q46 4 42 14 Q38 20 20 20 Q0 22 -16 20 Q-32 18 -40 10 Z" {...s} />
        <path d="M-30 -14 L-36 -24 M-24 -16 L-30 -26" {...s} />
        <path d="M-28 20 L-30 32 M-18 22 L-20 34 M18 20 L20 32 M30 18 L32 30" {...s} />
        <circle cx="-26" cy="-4" r="1.2" fill={ink} />
      </g>
      <text x="200" y="12" textAnchor="end" fontFamily="Georgia,serif" fontSize="9" fill={ink} fontStyle="italic" opacity="0.65">jour 3</text>
    </svg>
  );
}

function SketchMenhir({ ink }) {
  const s = { stroke: ink, strokeWidth: 1.5, fill: "none", strokeLinecap: "round" };
  return (
    <svg viewBox="0 0 220 110" style={{ display: "block", width: "100%", height: "auto", maxHeight: 110 }}>
      {/* Menhir dressé */}
      <path d="M70 20 Q80 10 92 20 L96 90 L66 90 Z" {...s} />
      <path d="M68 60 Q82 56 94 60 M70 76 L92 76" {...s} strokeWidth="0.8" opacity="0.5" />
      {/* Petit humain pour l'échelle */}
      <g transform="translate(130,70)">
        <circle cx="0" cy="-16" r="4" {...s} />
        <path d="M0 -12 L0 10 M-6 -6 L6 -6 M-6 20 L0 10 L6 20" {...s} />
      </g>
      {/* Poteries alignées */}
      {[0,1,2].map(i => (
        <g key={i} transform={`translate(${160 + i*16},84)`}>
          <path d="M-5 0 Q-7 -8 -3 -10 L3 -10 Q7 -8 5 0 Z" {...s} strokeWidth="1" />
        </g>
      ))}
      <text x="40" y="14" fontFamily="Georgia,serif" fontSize="9" fill={ink} fontStyle="italic" opacity="0.65">— néolithique</text>
    </svg>
  );
}

function SketchZiggurat({ ink }) {
  const s = { stroke: ink, strokeWidth: 1.5, fill: "none", strokeLinecap: "round" };
  return (
    <svg viewBox="0 0 220 110" style={{ display: "block", width: "100%", height: "auto", maxHeight: 110 }}>
      {/* Ziggourat 3 étages */}
      <path d="M50 92 L50 76 L108 76 L108 92 M60 76 L60 60 L98 60 L98 76 M72 60 L72 46 L86 46 L86 60" {...s} />
      <path d="M78 46 L82 40 L78 46" {...s} />
      {/* Rivière ondulée en bas */}
      <path d="M20 100 Q50 96 80 100 T140 100 T200 100" {...s} opacity="0.6" />
      {/* Palmier */}
      <g transform="translate(170,70)">
        <path d="M0 20 L0 -4" {...s} />
        <path d="M0 -4 Q-18 -14 -22 -2 M0 -4 Q18 -14 22 -2 M0 -4 Q-10 -22 0 -22 M0 -4 Q10 -22 0 -22" {...s} />
      </g>
      <text x="24" y="14" fontFamily="Georgia,serif" fontSize="9" fill={ink} fontStyle="italic" opacity="0.65">le fleuve</text>
    </svg>
  );
}

function SketchColumn({ ink }) {
  const s = { stroke: ink, strokeWidth: 1.5, fill: "none", strokeLinecap: "round" };
  return (
    <svg viewBox="0 0 220 110" style={{ display: "block", width: "100%", height: "auto", maxHeight: 110 }}>
      {/* Colonne corinthienne simplifiée */}
      <g transform="translate(60,0)">
        <path d="M-16 20 L16 20 L18 24 L-18 24 Z" {...s} />
        <path d="M-14 24 L14 24 L14 94 L-14 94 Z" {...s} />
        <path d="M-10 24 L-10 94 M-4 24 L-4 94 M4 24 L4 94 M10 24 L10 94" {...s} strokeWidth="0.8" opacity="0.5" />
        <path d="M-18 94 L18 94 L20 100 L-20 100 Z" {...s} />
        {/* Volutes du chapiteau */}
        <path d="M-14 20 Q-10 10 -6 14 M14 20 Q10 10 6 14" {...s} />
      </g>
      {/* Rouleau déroulé */}
      <g transform="translate(140,60)">
        <path d="M-30 -10 Q-30 -14 -24 -14 L24 -14 Q30 -14 30 -10 L30 10 Q30 14 24 14 L-24 14 Q-30 14 -30 10 Z" {...s} />
        <path d="M-30 -10 Q-36 0 -30 10 M30 -10 Q36 0 30 10" {...s} />
        <path d="M-22 -6 L18 -6 M-22 0 L22 0 M-22 6 L14 6" {...s} strokeWidth="0.8" opacity="0.55" />
      </g>
      <text x="200" y="100" textAnchor="end" fontFamily="Georgia,serif" fontSize="9" fill={ink} fontStyle="italic" opacity="0.65">la bibliothèque</text>
    </svg>
  );
}

function SketchScriptorium({ ink }) {
  const s = { stroke: ink, strokeWidth: 1.5, fill: "none", strokeLinecap: "round" };
  return (
    <svg viewBox="0 0 220 110" style={{ display: "block", width: "100%", height: "auto", maxHeight: 110 }}>
      {/* Livre ouvert */}
      <g transform="translate(70,60)">
        <path d="M-40 20 Q-20 -4 0 -2 Q20 -4 40 20 L40 24 L-40 24 Z" {...s} />
        <path d="M0 -2 L0 22" {...s} />
        {/* Lignes de texte */}
        {[-10,-4,2,8,14].map((y,i) => (
          <g key={i}>
            <line x1="-32" y1={y+10} x2="-6" y2={y+10} {...s} strokeWidth="0.7" opacity="0.6" />
            <line x1="6" y1={y+10} x2="32" y2={y+10} {...s} strokeWidth="0.7" opacity="0.6" />
          </g>
        ))}
        {/* Lettrine */}
        <rect x="-28" y="-2" width="8" height="10" {...s} strokeWidth="0.9" />
      </g>
      {/* Plume d'oie */}
      <g transform="translate(160,50) rotate(-28)">
        <path d="M-20 0 L18 -4 Q22 -4 22 0 L22 4 Q22 8 18 8 L-20 4 Z" {...s} />
        <path d="M-20 0 L-30 10 L-28 12" {...s} strokeWidth="1" />
        {/* Barbes */}
        {[-12,-6,0,6,12].map((x,i) => <path key={i} d={`M${x} -4 L${x-6} -12`} {...s} strokeWidth="0.7" opacity="0.6" />)}
      </g>
      <text x="200" y="14" textAnchor="end" fontFamily="Georgia,serif" fontSize="9" fill={ink} fontStyle="italic" opacity="0.65">le scriptorium</text>
    </svg>
  );
}

function SketchPress({ ink }) {
  const s = { stroke: ink, strokeWidth: 1.5, fill: "none", strokeLinecap: "round" };
  return (
    <svg viewBox="0 0 220 110" style={{ display: "block", width: "100%", height: "auto", maxHeight: 110 }}>
      {/* Presse en bois */}
      <g transform="translate(70,55)">
        <path d="M-32 30 L32 30 L30 36 L-30 36 Z" {...s} />
        <path d="M-26 30 L-26 -20 L26 -20 L26 30" {...s} />
        <path d="M-20 -20 L-20 -32 M20 -20 L20 -32 M-20 -32 L20 -32" {...s} />
        {/* Vis + poignée en T */}
        <path d="M0 -32 L0 -42 M-18 -42 L18 -42" {...s} strokeWidth="2" />
        <circle cx="-18" cy="-42" r="2" {...s} strokeWidth="0.8" />
        <circle cx="18" cy="-42" r="2" {...s} strokeWidth="0.8" />
        {/* Feuille qui sort */}
        <path d="M-14 10 L14 10 L14 24 L-14 24 Z" {...s} strokeWidth="0.9" />
        <line x1="-10" y1="14" x2="10" y2="14" {...s} strokeWidth="0.7" />
        <line x1="-10" y1="18" x2="8" y2="18" {...s} strokeWidth="0.7" />
      </g>
      {/* Blocs de lettres */}
      <g transform="translate(160,85)">
        {[0,1,2].map(i => (
          <g key={i} transform={`translate(${i*14},0)`}>
            <rect x="-5" y="-10" width="10" height="12" {...s} strokeWidth="0.9" />
            <text x="0" y="0" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" fill={ink}>{"ABC"[i]}</text>
          </g>
        ))}
      </g>
      <text x="200" y="14" textAnchor="end" fontFamily="Georgia,serif" fontSize="9" fill={ink} fontStyle="italic" opacity="0.65">la presse</text>
    </svg>
  );
}

function SketchTelegraph({ ink }) {
  const s = { stroke: ink, strokeWidth: 1.5, fill: "none", strokeLinecap: "round" };
  return (
    <svg viewBox="0 0 220 110" style={{ display: "block", width: "100%", height: "auto", maxHeight: 110 }}>
      {/* Poteau télégraphique */}
      <g transform="translate(60,0)">
        <path d="M0 100 L0 20" {...s} />
        <path d="M-20 30 L20 30 M-24 44 L24 44" {...s} />
        <circle cx="-18" cy="30" r="1.4" fill={ink} />
        <circle cx="18" cy="30" r="1.4" fill={ink} />
        <circle cx="-22" cy="44" r="1.4" fill={ink} />
        <circle cx="22" cy="44" r="1.4" fill={ink} />
      </g>
      {/* Fils en diagonale */}
      <path d="M78 30 Q130 36 180 42" {...s} strokeWidth="0.8" opacity="0.75" />
      <path d="M78 44 Q130 50 180 56" {...s} strokeWidth="0.8" opacity="0.75" />
      {/* Points Morse sur le fil */}
      <text x="140" y="26" fontFamily="ui-monospace,monospace" fontSize="12" fill={ink} letterSpacing="3">· − · ·</text>
      {/* Petite locomotive à vapeur */}
      <g transform="translate(150,80)">
        <path d="M-24 0 L-24 -12 L8 -12 L10 -4 L24 -4 L24 0 Z" {...s} />
        <circle cx="-18" cy="0" r="4" {...s} />
        <circle cx="18" cy="0" r="4" {...s} />
        <path d="M-16 -12 L-16 -22 Q-10 -24 -6 -22" {...s} strokeWidth="1" />
        <path d="M-14 -24 Q-14 -28 -10 -28" {...s} strokeWidth="0.8" opacity="0.65" />
      </g>
      <text x="14" y="100" fontFamily="Georgia,serif" fontSize="9" fill={ink} fontStyle="italic" opacity="0.65">le fil</text>
    </svg>
  );
}

function SketchRadio({ ink }) {
  const s = { stroke: ink, strokeWidth: 1.5, fill: "none", strokeLinecap: "round" };
  return (
    <svg viewBox="0 0 220 110" style={{ display: "block", width: "100%", height: "auto", maxHeight: 110 }}>
      {/* Poste radio */}
      <g transform="translate(65,55)">
        <path d="M-36 24 L-36 -20 Q-36 -24 -32 -24 L32 -24 Q36 -24 36 -20 L36 24 Q36 28 32 28 L-32 28 Q-36 28 -36 24 Z" {...s} />
        {/* Haut-parleur */}
        <circle cx="-14" cy="4" r="12" {...s} />
        <circle cx="-14" cy="4" r="6" {...s} strokeWidth="0.8" opacity="0.6" />
        {/* Cadran */}
        <rect x="4" y="-14" width="26" height="10" {...s} strokeWidth="0.9" />
        <path d="M4 -8 L30 -8" {...s} strokeWidth="0.6" opacity="0.5" />
        <circle cx="12" cy="-9" r="1.4" fill={ink} />
        {/* Molettes */}
        <circle cx="12" cy="18" r="4" {...s} strokeWidth="0.9" />
        <circle cx="24" cy="18" r="4" {...s} strokeWidth="0.9" />
        {/* Antenne */}
        <path d="M30 -24 L46 -42" {...s} />
      </g>
      {/* Ondes sortantes */}
      {[16,24,32].map((r,i) => (
        <path key={i} d={`M165 50 Q${165 + r} ${50 - r/2} ${165 + r*1.5} 50`} {...s} strokeWidth="0.9" opacity={0.9 - i*0.2} />
      ))}
      <text x="200" y="14" textAnchor="end" fontFamily="Georgia,serif" fontSize="9" fill={ink} fontStyle="italic" opacity="0.65">la BBC</text>
    </svg>
  );
}

function SketchTV({ ink }) {
  const s = { stroke: ink, strokeWidth: 1.5, fill: "none", strokeLinecap: "round" };
  return (
    <svg viewBox="0 0 220 110" style={{ display: "block", width: "100%", height: "auto", maxHeight: 110 }}>
      {/* TV cathodique */}
      <g transform="translate(80,60)">
        <path d="M-40 24 Q-40 -20 -34 -20 L34 -20 Q40 -20 40 24 Q40 28 34 28 L-34 28 Q-40 28 -40 24 Z" {...s} />
        {/* Écran */}
        <path d="M-28 20 Q-28 -14 -22 -14 L22 -14 Q28 -14 28 20 Q28 24 22 24 L-22 24 Q-28 24 -28 20 Z" {...s} strokeWidth="0.9" />
        {/* Scanlines */}
        {[-6,0,6,12].map((y,i)=><line key={i} x1="-24" y1={y+6} x2="24" y2={y+6} {...s} strokeWidth="0.5" opacity="0.4"/>)}
        {/* Molette */}
        <circle cx="34" cy="4" r="2" {...s} strokeWidth="0.8" />
      </g>
      {/* Antenne oreilles de lapin */}
      <path d="M70 36 L54 10 M90 36 L106 10" {...s} />
      <circle cx="54" cy="10" r="1.4" fill={ink} />
      <circle cx="106" cy="10" r="1.4" fill={ink} />
      {/* Petite silhouette qui regarde */}
      <g transform="translate(170,80)">
        <circle cx="0" cy="-16" r="4" {...s} />
        <path d="M0 -12 L0 10 M-6 -4 L6 -4 M-5 20 L0 10 L5 20" {...s} />
      </g>
      <text x="14" y="14" fontFamily="Georgia,serif" fontSize="9" fill={ink} fontStyle="italic" opacity="0.65">en direct</text>
    </svg>
  );
}

function SketchSmartphone({ ink }) {
  const s = { stroke: ink, strokeWidth: 1.5, fill: "none", strokeLinecap: "round" };
  return (
    <svg viewBox="0 0 220 110" style={{ display: "block", width: "100%", height: "auto", maxHeight: 110 }}>
      {/* Smartphone */}
      <g transform="translate(70,55)">
        <path d="M-18 -40 Q-20 -42 -18 -44 L18 -44 Q20 -42 18 -40 L18 40 Q20 42 18 44 L-18 44 Q-20 42 -18 40 Z" {...s} />
        <path d="M-14 -36 L14 -36 L14 36 L-14 36 Z" {...s} strokeWidth="0.9" />
        {/* Icônes */}
        {[0,1,2].map(j => [0,1,2].map(i => (
          <rect key={`${i}-${j}`} x={-10 + i*8} y={-28 + j*10} width="4" height="4" {...s} strokeWidth="0.6" opacity="0.65" />
        )))}
        {/* Bouton home */}
        <circle cx="0" cy="40" r="2" {...s} strokeWidth="0.8" />
      </g>
      {/* Signal wifi */}
      <g transform="translate(150,40)" opacity="0.85">
        <circle r="3" fill={ink} />
        <path d="M-8 -4 Q0 -10 8 -4" {...s} />
        <path d="M-14 -10 Q0 -22 14 -10" {...s} />
      </g>
      {/* Petite silhouette tête penchée vers l'écran */}
      <g transform="translate(170,88)">
        <circle cx="0" cy="-18" r="4" {...s} />
        <path d="M-2 -14 Q-6 -4 -2 6 L4 6 L4 -4" {...s} />
      </g>
      <text x="200" y="100" textAnchor="end" fontFamily="Georgia,serif" fontSize="9" fill={ink} fontStyle="italic" opacity="0.65">personne ne lève les yeux</text>
    </svg>
  );
}

const SKETCHES = {
  "peinture rupestre":            SketchPainting,
  "gravure sur mégalithe":        SketchMenhir,
  "tablette d'argile cunéiforme": SketchZiggurat,
  "rouleau de papyrus":           SketchColumn,
  "enluminure marginale":         SketchScriptorium,
  "gazette imprimée":             SketchPress,
  "télégramme Morse":             SketchTelegraph,
  "cassette audio":               SketchRadio,
  "CD gravé":                     SketchTV,
  "smartphone":                   SketchSmartphone,
};

export default function NoteAl3x1A({ support, text, chapitreNom, variant = "wrong", onClose }) {
  const st = STYLES[support] || STYLES["rouleau de papyrus"];
  const Sketch = SKETCHES[support] || null;
  const badge = variant === "right" ? { label: "✦ ICI ✦", color: "#5eff9e" }
             : variant === "clue"  ? { label: "✦ INDICE DE RECOUPEMENT ✦", color: "#ffd166" }
             : null;
  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 90, padding: 20, backdropFilter: "blur(4px)" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(540px, 100%)", maxHeight: "92vh", overflowY: "auto",
          background: st.bg, border: `4px solid ${variant === "right" ? "#5eff9e" : variant === "clue" ? "#ffd166" : st.border}`, borderRadius: 12,
          padding: "22px 26px", position: "relative",
          fontFamily: st.font, color: st.ink,
          boxShadow: `0 12px 48px rgba(0,0,0,0.7)${variant !== "wrong" ? `, 0 0 24px ${variant === "right" ? "rgba(94,255,158,0.4)" : "rgba(255,209,102,0.35)"}` : ""}`,
          animation: "fadein 0.4s ease-out",
        }}>
        {/* En-tête discret : où la note a été trouvée */}
        <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 10, letterSpacing: 2, opacity: 0.55, marginBottom: 4 }}>
          {chapitreNom.toUpperCase()}
        </div>
        <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: 1.5, opacity: 0.75, marginBottom: 10, fontStyle: "italic" }}>
          {st.label}
        </div>
        {badge && (
          <div style={{ display: "inline-block", background: badge.color, color: st.bg, padding: "3px 10px", borderRadius: 20, fontFamily: "ui-monospace, monospace", fontSize: 10, fontWeight: 900, letterSpacing: 2, marginBottom: 10 }}>
            {badge.label}
          </div>
        )}
        {/* Séparateur */}
        <div style={{ height: 1, background: st.ink, opacity: 0.4, marginBottom: 14 }} />
        {/* Croquis d'Al3x1A — un petit dessin au stylo, par support */}
        {Sketch && (
          <div style={{ marginBottom: 12, padding: "4px 8px", opacity: 0.9 }}>
            <Sketch ink={st.ink} />
          </div>
        )}
        {/* Le texte de la note */}
        <p style={{ fontSize: 15.5, lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>{text}</p>
        {/* Signature */}
        <div style={{ marginTop: 20, textAlign: "right", fontSize: 13, fontStyle: "italic", opacity: 0.75 }}>
          — Al3x1A
        </div>
        {variant === "clue" && (
          <div style={{ marginTop: 14, padding: "8px 12px", background: `${st.ink}11`, border: `1px dashed ${st.ink}66`, borderRadius: 6, fontSize: 12, lineHeight: 1.5, fontStyle: "italic", opacity: 0.85 }}>
            Cette note décrit l'époque où elle s'est arrêtée. Recoupe avec d'autres indices pour trouver où. (📓 carnet en haut)
          </div>
        )}
        {/* Bouton fermer */}
        <button onClick={onClose}
          style={{
            display: "block", margin: "22px auto 0",
            background: st.ink, color: st.bg, border: "none", borderRadius: 8,
            padding: "10px 24px", fontWeight: 800, cursor: "pointer",
            fontFamily: "ui-monospace, monospace", letterSpacing: 1,
          }}>
          Refermer
        </button>
      </div>
    </div>
  );
}
