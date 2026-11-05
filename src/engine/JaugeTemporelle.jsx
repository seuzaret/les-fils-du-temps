/* ============================================================
   MOTEUR — La jauge de flux temporel (colonne verticale à droite
   de l'écran de jeu, mode large).
   Aucun état propre : tout vient des props.
   ============================================================ */
export default function JaugeTemporelle({ transmis, requis, total, destination, canJump, onJump, isLast, bloque }) {
  const pct = Math.min(100, Math.round((transmis / requis) * 100));
  /* Graduations tous les 5 flux (= 1 message principal). Rend visible
     l'ampleur d'un +5 (transmission) vs d'un +3 (bonus) vs d'un -1. */
  const nbGrads = Math.max(1, Math.floor(requis / 5)) - 1;
  return (
    <div style={{ width: 116, flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", minHeight: 0,
        background: "linear-gradient(180deg,#141b28,#0c1220)", border: "1px solid #26324a", borderRadius: 12, padding: "9px 8px", gap: 7 }}>
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 1.5, color: "#ffd166", textAlign: "center", lineHeight: 1.35 }}>⚡ FLUX<br />TEMPOREL</div>

      {/* la colonne qui se remplit (de bas en haut) */}
      <div style={{ flex: "1 1 auto", width: 30, minHeight: 54, background: "#0a1119", border: "1px solid #26324a", borderRadius: 8, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column-reverse" }}>
        <div style={{ height: `${Math.max(0, pct)}%`, background: canJump ? "linear-gradient(0deg,#e8934a,#ffd166)" : "linear-gradient(0deg,#2f5a76,#7fd8ff)", transition: "height .5s ease-out", boxShadow: canJump ? "0 0 16px #ffd166" : "none" }} />
        {/* graduations : tous les 5 flux (~ 1 message principal) */}
        {Array.from({ length: nbGrads }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, bottom: `${((i + 1) * 5 / requis) * 100}%`, height: 1, background: "#0a1119" }} />
        ))}
      </div>

      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 13.5, fontWeight: 700, color: canJump ? "#ffd166" : "#8fa3bd" }}>{Math.min(transmis, requis)}/{requis}⚡</div>

      <button onClick={onJump} disabled={!canJump} title={canJump ? (isLast ? "Voir l'épilogue" : `Partir vers ${destination}`) : (bloque || `Encore ${Math.max(0, Math.ceil(requis - transmis))}⚡ pour partir`)}
        style={{ width: "100%", background: canJump ? "#e8934a" : "#141b28", color: canJump ? "#160c02" : "#54607a", border: "none", borderRadius: 8, padding: "8px 4px", fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 800, letterSpacing: 0.5, cursor: canJump ? "pointer" : "not-allowed", lineHeight: 1.3, animation: canJump ? "glow 2.4s ease-in-out infinite" : "none" }}>
        {canJump ? (isLast ? "🌀 FIN" : "🌀 PARTIR") : "🔒"}
      </button>
      {canJump && !isLast && <div style={{ fontSize: 8.5, color: "#e8934a", fontFamily: "ui-monospace,monospace", textAlign: "center", lineHeight: 1.2, marginTop: -3 }}>{destination}</div>}

      {/* suivi des trouvailles : une pastille par invention de l'époque */}
      <div style={{ borderTop: "1px solid #26324a", paddingTop: 6, marginTop: 2, width: "100%" }}>
        <div style={{ fontSize: 8, color: "#6f8099", fontFamily: "ui-monospace,monospace", letterSpacing: 1, textAlign: "center" }}>TROUVAILLES</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center", marginTop: 5 }}>
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} style={{ width: 9, height: 9, borderRadius: "50%",
              background: i < transmis ? "#ffd166" : "#20293c",
              border: i < transmis ? "none" : "1px solid #2c3852",
              boxShadow: i < transmis ? "0 0 5px #ffd16699" : "none" }} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#8fa3bd", fontFamily: "ui-monospace,monospace", marginTop: 5, textAlign: "center" }}>{transmis}/{total}</div>
      </div>
    </div>
  );
}
