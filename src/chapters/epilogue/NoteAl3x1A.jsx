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

export default function NoteAl3x1A({ support, text, chapitreNom, variant = "wrong", onClose }) {
  const st = STYLES[support] || STYLES["rouleau de papyrus"];
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
